# Proves every access rule in schema.sql against a local Postgres with standin.sql loaded.
# Only needed when the schema changes. 46 checks, all passing as of version 1.
import subprocess, uuid, re
DB=["su","postgres","-c"]
def sql(stmt, user=None, role="authenticated"):
    pre=""
    if role=="anon": pre="set role anon; "
    elif role=="authenticated": pre="set role authenticated; set request.jwt.claim.sub = '%s'; " % user
    cmd="psql -h /tmp/pgrun -p 5499 -d atlas -At -v ON_ERROR_STOP=1 -c \"%s\"" % (pre+stmt).replace('"','\\"')
    r=subprocess.run(DB+[cmd],capture_output=True,text=True)
    if r.returncode==0:
        keep=[l for l in r.stdout.strip().split("\n") if l and not re.match(r"^(SET|UPDATE \d+|INSERT \d+ \d+|DELETE \d+|SELECT \d+)$",l)]
        return (True,"\n".join(keep))
    errs=[l for l in r.stderr.split("\n") if "ERROR" in l]
    return (False,errs[0] if errs else r.stderr.strip())
def owner(stmt):
    r=subprocess.run(DB+["psql -h /tmp/pgrun -p 5499 -d atlas -At -v ON_ERROR_STOP=1 -c \"%s\"" % stmt.replace('"','\\"')],capture_output=True,text=True)
    assert r.returncode==0, r.stderr; return r.stdout.strip()

ADMIN,ALICE,BOB=[str(uuid.uuid4()) for _ in range(3)]
owner("insert into auth.users(id,email) values ('%s','keeper@example.com'),('%s','alice@example.com'),('%s','bob@example.com')"%(ADMIN,ALICE,BOB))
owner("insert into public.admins(user_id) values ('%s')"%ADMIN)

results=[]
def check(name, cond, detail=""):
    results.append((name,cond,detail)); print(("  pass  " if cond else "  FAIL  ")+name+("" if cond else "   -> "+str(detail)))

# sign-up makes a profile
check("signing up creates a profile automatically", owner("select count(*) from public.profiles")=="3")

# ---- messages ----
ok,out=sql("insert into public.messages(kind,subject,body) values ('dreamwalker','The mill','I dreamt of a mill at night.') returning id",ALICE)
mid=out.split("\n")[0] if ok else None
check("a dreamer can send a message", ok, out)
ok,out=sql("insert into public.messages(kind,body,status,reply) values ('support','hi','replied','fake reply')",ALICE)
check("a dreamer cannot forge a reply or status when sending", not ok, out)
ok,out=sql("select count(*) from public.messages",BOB)
check("another dreamer cannot see Alice's message", ok and out=="0", out)
ok,out=sql("update public.messages set reply='x' where id='%s'"%mid,ALICE)
ok2,out2=sql("select coalesce(reply,'') from public.messages where id='%s'"%mid,ALICE)
check("a dreamer cannot write a reply to their own message", ok2 and out2=="", (out,out2))
ok,out=sql("select count(*) from public.messages",ADMIN)
check("the admin sees messages", ok and out=="1", out)
ok,out=sql("update public.messages set reply='Read the mill as your working hours.', status='replied', replied_at=now() where id='%s' returning status"%mid,ADMIN)
check("the admin can reply", ok and out=="replied", out)
ok,out=sql("select reply from public.messages where id='%s'"%mid,ALICE)
check("Alice can read the reply", ok and out.startswith("Read the mill"), out)
ok,out=sql("select public.admin_message_sender('%s')"%mid,ADMIN)
check("the admin can see who to reply to", ok and out=="alice@example.com", out)
ok,out=sql("select public.admin_message_sender('%s')"%mid,BOB)
check("a dreamer cannot look up senders", not ok, out)

# ---- the vault ----
ok,out=sql("insert into public.vault(cipher,iv,salt,bytes) values ('ENCRYPTED','iv','salt',9)",ALICE)
check("a dreamer can store their encrypted dreamscape", ok, out)
ok,out=sql("select count(*) from public.vault",ADMIN)
check("the admin CANNOT read anyone's dreamscape", ok and out=="0", out)
ok,out=sql("select count(*) from public.vault",BOB)
check("another dreamer cannot read it", ok and out=="0", out)
ok,out=sql("insert into public.vault(user_id,cipher,iv,salt) values ('%s','x','x','x')"%BOB,ALICE)
check("a dreamer cannot write into someone else's vault", not ok, out)

# ---- profiles and plans ----
ok,out=sql("update public.profiles set plan='member' where id='%s'"%ALICE,ALICE)
check("a dreamer cannot give themselves a paid plan", not ok, out)
ok,out=sql("update public.profiles set research_consent=true, research_since=now() where id='%s' returning research_consent"%ALICE,ALICE)
check("a dreamer can turn research sharing on", ok and out=="t", out)
ok,out=sql("select public.admin_set_plan('%s','member',now()+interval '1 year')"%BOB,ALICE)
check("a dreamer cannot set plans", not ok, out)
ok,out=sql("select public.admin_set_plan('%s','member',now()+interval '1 year')"%BOB,ADMIN)
ok2,out2=sql("select plan from public.profiles where id='%s'"%BOB,BOB)
check("the admin can set a plan", ok and out2=="member", (out,out2))
ok,out=sql("select count(*) from public.admin_list_dreamers()",ADMIN)
check("the admin can list dreamers", ok and out=="3", out)
ok,out=sql("select count(*) from public.admin_list_dreamers()",ALICE)
check("a dreamer cannot list dreamers", not ok, out)
ok,out=sql("select count(*) from public.profiles",BOB)
check("a dreamer sees only their own profile", ok and out=="1", out)

# ---- settings ----
ok,out=sql("select value from public.app_config where key='dreamwalker_open'",None,"anon")
check("settings are readable before sign-in", ok and out=="true", out)
ok,out=sql("update public.app_config set value='false' where key='dreamwalker_open'",None,"anon")
check("nobody signed out can change settings", not ok, out)
ok,out=sql("update public.app_config set value='false' where key='dreamwalker_open' returning key",ALICE)
check("a dreamer cannot change settings", ok and out=="", out)
ok,out=sql("update public.app_config set value='[\"w:Gypsy\"]' where key='miller_released' returning key",ADMIN)
check("the admin can change settings", ok and out=="miller_released", out)

# ---- research ----
RID=str(uuid.uuid4())
ok,out=sql("select public.submit_research('%s',current_date,array['fire','collapse'],array['house','tower'],array['afraid'],0::smallint)"%RID,BOB)
check("research is refused without consent", not ok, out)
ok,out=sql("select public.submit_research('%s',current_date,array['fire','collapse'],array['house','tower'],array['afraid'],0::smallint)"%RID,ALICE)
check("research is accepted with consent", ok, out)
ok,out=sql("select public.submit_research('%s',current_date,array['my sister ruth'],array['house'],array[]::text[],0::smallint)"%RID,ALICE)
check("anything off the whitelist is refused", not ok, out)
ok,out=sql("select public.submit_research('%s',current_date,array['fire'],array['Ruth''s house'],array[]::text[],0::smallint)"%RID,ALICE)
check("names smuggled in as forms are refused", not ok, out)
cols=owner("select string_agg(column_name,',' order by ordinal_position) from information_schema.columns where table_name='research_summaries'")
check("research rows hold no account at all", "user" not in cols, cols)
ok,out=sql("select count(*) from public.research_summaries",ALICE)
check("dreamers cannot browse research rows", ok and out=="0", out)
ok,out=sql("select count(*) from public.research_summaries",ADMIN)
check("the admin can read research summaries", ok and out=="1", out)
ok,out=sql("select public.withdraw_research('%s')"%RID,ALICE)
check("a dreamer can withdraw what they sent", ok and out=="1", out)

# ---- nothing leaks to the signed-out ----
for t in ["messages","vault","profiles","orders","research_summaries","admins"]:
    ok,out=sql("select count(*) from public.%s"%t,None,"anon")
    check("signed out: no access to "+t, not ok, out)
for f in ["public.admin_list_dreamers()","public.is_admin()"]:
    ok,out=sql("select "+f,None,"anon")
    check("signed out: cannot call "+f.split('.')[1], not ok, out)

# ---- orders ----
ok,out=sql("insert into public.orders(item,ship_name) values ('atlas','Alice') returning status",ALICE)
check("a dreamer can order the Atlas", ok and out=="requested", out)
ok,out=sql("insert into public.orders(item,status) values ('atlas','shipped')",ALICE)
check("a dreamer cannot mark their own order shipped", not ok, out)
ok,out=sql("update public.orders set status='printing', updated_at=now() returning status",ADMIN)
check("the admin can move an order along", ok and out=="printing", out)
ok,out=sql("select count(*) from public.orders",BOB)
check("another dreamer cannot see Alice's order", ok and out=="0", out)

# account deletion takes everything of theirs
owner("delete from auth.users where id='%s'"%ALICE)
check("deleting an account removes their vault, messages and profile",
      owner("select (select count(*) from public.vault)+(select count(*) from public.messages)+(select count(*) from public.profiles where id='%s')"%ALICE)=="0")

p=sum(1 for r in results if r[1]); print("\n%d of %d passed"%(p,len(results)))
