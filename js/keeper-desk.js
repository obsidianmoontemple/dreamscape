/* SomnuMatrix — keeper-desk.js
   the desk in the penthouse. sit at it and the city's controls open: who holds
   which office, how many positions each post keeps, the codes on the tower, and
   who keeps the desk itself.
   it is the same desk as the admin page — the same functions, the same rules.
   the server checks that you are a keeper on every one of them; nothing here
   grants anything the browser could grant itself.
   loaded as a plain script; shares scope with the other files */
"use strict";

var deskOpen=false, deskNear=false, deskOffices=[], deskJobs=[];

function amKeeper(){ return !!(deskStanding&&deskStanding.keeper); }
/* what this dreamer may change in Somnucor. Everyone: their own look and
   the lots they hold. Shaping the city: the keeper and the City planner.
   Rearranging a workplace: the keeper, the City planner and the Carpenter. */
var myPowers={};
function mayShape(){ return amKeeper()||!!(myPowers&&myPowers.shape); }
function mayArrangeAny(){ return amKeeper()||!!(myPowers&&myPowers.arrange); }
function amHolder(){ return !!(deskStanding&&deskStanding.holder); }
function amDeskOfficer(){ return !!(deskStanding&&(deskStanding.keeper||deskStanding.officer||deskStanding.holder)); }
var deskStanding=null;
/* who you are to the desk comes from the server in one answer
   (penthouse_access, schema-update-18): keeper, officer, and whether you
   presently hold the penthouse. admin_diagnose is still asked as a fallback
   so a database that hasn't had update 18 yet keeps working for keepers. */
function checkKeeper(){
  if(!signedIn()) { deskStanding=null; return Promise.resolve(deskStanding); }
  return Promise.all([
    cityRpc("penthouse_access").catch(function(){ return null; }),
    cityRpc("admin_diagnose").catch(function(){ return null; }),
    (standing?Promise.resolve(standing):refreshStanding().catch(function(){ return null; }))
  ]).then(function(r){
    var a=r[0]||{}, d=r[1];
    deskStanding={
      keeper:!!(a.keeper||(d&&d.you_are==="keeper")),
      officer:!!(a.officer||(typeof amOfficer==="function"&&amOfficer())||
        (typeof standing!=="undefined"&&standing&&(standing.jobs||[]).some(function(j){ return j.panel==="prison"; }))),
      holder:!!a.holder,
      who:a.who||"code", hasCode:!!a.has_code
    };
    cityRpc("my_powers").then(function(p){ myPowers=p||{}; if(typeof paintShapeButton==="function") paintShapeButton(); }).catch(function(){ myPowers={}; });
    return deskStanding;
  }).catch(function(){ deskStanding={keeper:false,officer:false,holder:false}; return deskStanding; });
}

/* ---- the desk itself, in the penthouse ---- */
function deskTick(dt){
  if(!walkMode||!store.inside||!INT||!INT.locked) { deskNear=false; officeDeskTick(); return; }
  if((INT.level||0)!==INT.locked.level) { deskNear=false; officeDeskTick(); return; }
  /* the desk stands at the far end of the office */
  var P=camera.position, dx=P.x-INT.ox, dz=P.z-(INT.oz-INT.D/2+3);
  var near=Math.hypot(dx,dz)<3.2;
  if(near&&!deskNear){
    deskNear=true;
    setStatus("<b>The Keeper's Desk.</b> Press <b>K</b> to open the city's books.");
  } else if(!near&&deskNear) deskNear=false;
  if(near) officeDeskNear=false; else officeDeskTick();
}
/* ---- every other desk in the tower: not the Keeper's own, but not a
   decoration either. any office room's desk is a way for whoever works
   there to reach their own job — draw their pay, see the post they hold,
   send someone home or call them back to work — without walking back out
   to the panel outside. */
var officeDeskNear=false;
var WORKDESK={desk:1,judgebench:1,till:1,counter:1,counterbank:1,lectern:1,workbench:1,bigconsole:1,maptable:1};
function officeDeskTick(){
  if(!walkMode||!store.inside||!INT||(!INT.locked&&!INT.wpKey)){ officeDeskNear=false; return; }
  var P=camera.position, near=null;
  if(INT.wpKey){
    /* in any workplace: a desk, a bench, a counter or a till is where the work is done */
    var lv=INT.level||0;
    INT.root.children.forEach(function(c){
      if(near||!c.userData||!WORKDESK[c.userData.furn]) return;
      if(Math.abs(c.position.y-lv*INT.floor)>1) return;
      if(Math.hypot(P.x-(INT.ox+c.position.x),P.z-(INT.oz+c.position.z))<2.8) near={room:"work"};
    });
  }
  (INT.spots||[]).forEach(function(sp){
    if(near||!INT.locked) return;
    if(sp.room!=="office"&&sp.room!=="techoffice") return;
    var wx=INT.ox+sp.x, wz=INT.oz+sp.z;
    if(Math.hypot(P.x-wx,P.z-wz)<3.4) near=sp;
  });
  if(near&&!officeDeskNear){
    officeDeskNear=true;
    setStatus(signedIn()?"<b>A desk.</b> Press <b>K</b> for your own work here.":"<b>A desk.</b> Sign in to use it.");
  } else if(!near&&officeDeskNear) officeDeskNear=false;
}
function openOfficeDesk(){
  if(deskOpen) return closeDesk();
  if(!signedIn()) return setStatus("Sign in first — a desk knows whose work it shows by account.");
  deskOpen=true;
  var p=document.getElementById("keeper-desk");
  if(!p){
    p=document.createElement("div"); p.id="keeper-desk";
    p.style.cssText="position:fixed;inset:4% 3%;z-index:60;overflow-y:auto;overflow-x:auto;background:rgba(8,10,16,.97);"+
      "border:1px solid var(--gold,#C9A868);border-radius:4px;padding:22px 26px;font-family:var(--sans);font-size:14px";
    document.body.appendChild(p);
  }
  p.style.display="block";
  p.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">'+
    '<b style="font-family:var(--serif);font-size:20px;color:var(--gold)">Your desk</b>'+
    '<button class="btn" id="od-close">Leave the desk</button></div>'+
    '<div id="od-body">Looking…</div>';
  document.getElementById("od-close").onclick=closeDesk;
  (standing?Promise.resolve(standing):refreshStanding()).then(function(s){
    var body=document.getElementById("od-body"); if(!body) return;
    var jobs=(s&&s.jobs)||[];
    if(!jobs.length){
      body.innerHTML="<p>Nobody's own work sits at this desk yet. Take a post from the job board and it's yours.</p>";
      return;
    }
    body.innerHTML='<p style="color:var(--dim);margin:0 0 10px">What you hold with Somnucor, and the wages waiting on it.</p>'+
      jobs.map(function(j,i){
        return '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--line)">'+
          '<span><b>'+esc(j.job)+'</b> at '+esc(j.employer)+' — '+j.rate+' gold '+(j.kind==="salary"?"a week":"an hour")+
          (j.offline?" <span style='color:var(--dim)'>· at work while you sleep</span>":"")+'</span>'+
          '<span>'+(j.job_id?('<button class="btn" data-odoff="'+j.job_id+'" data-on="'+(j.offline?"0":"1")+'">'+
            (j.offline?"call home":"leave at work")+'</button>'):"")+'</span></div>';
      }).join("")+
      '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="od-pay">Draw my pay</button>'+
      (jobs.some(function(j){ return j.panel==="police"||j.panel==="court"||j.panel==="prison"; })?'<button class="btn" id="od-courts">The courts and the Gaol</button>':'')+
      (typeof canArrange==="function"&&INT&&INT.wpKey&&canArrange(INT.wpKey)?'<button class="btn" id="od-arrange">Rearrange this place</button>':'')+
      '</div>';
    Array.prototype.forEach.call(body.querySelectorAll("[data-odoff]"),function(b){
      b.onclick=function(){ workOffline(+b.getAttribute("data-off")||+b.getAttribute("data-odoff"),b.getAttribute("data-on")==="1").then(function(){ openOfficeDesk(); }); };
    });
    var pb=document.getElementById("od-pay");
    if(pb) pb.onclick=function(){ if(typeof drawPay==="function") drawPay().then(function(){ openOfficeDesk(); }); };
    var cb=document.getElementById("od-courts");
    if(cb) cb.onclick=function(){ closeDesk(); openDesk(); };
    var ab=document.getElementById("od-arrange");
    if(ab) ab.onclick=function(){ closeDesk(); startArranging(); };
  });
}
function openDesk(){
  if(deskOpen) return closeDesk();
  if(!signedIn()) return setStatus("Sign in first — the desk knows its keeper by account.");
  deskOpen=true;
  var p=document.getElementById("keeper-desk");
  if(!p){
    p=document.createElement("div"); p.id="keeper-desk";
    p.style.cssText="position:fixed;inset:4% 3%;z-index:60;overflow-y:auto;overflow-x:auto;background:rgba(8,10,16,.97);"+
      "border:1px solid var(--gold,#C9A868);border-radius:4px;padding:22px 26px;font-family:var(--sans);font-size:14px";
    document.body.appendChild(p);
  }
  p.style.display="block";
  p.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">'+
    '<b style="font-family:var(--serif);font-size:20px;color:var(--gold)">The Keeper\u2019s Desk</b>'+
    '<button class="btn" id="kd-close">Leave the desk</button></div>'+
    '<div id="kd-body">Asking the city whether you keep this desk\u2026</div>';
  document.getElementById("kd-close").onclick=closeDesk;
  checkKeeper().then(function(){
    var body=document.getElementById("kd-body");
    if(!amDeskOfficer()){
      body.innerHTML="<p>This desk answers only to a keeper, to whoever holds the penthouse, or to Somnucor's own police and courts. You may sit at it, but it will tell you nothing.</p>"+
        "<p style='color:var(--dim)'>Signed in as <b>"+esc(myEmail()||"?")+"</b>. If that is wrong, a keeper can add you on the admin page, "+
        "or run schema-update-18, which makes the Temple's own account a keeper.</p>";
      return;
    }
    drawDesk(body);
  });
}
function closeDesk(){
  deskOpen=false;
  var p=document.getElementById("keeper-desk"); if(p) p.style.display="none";
}

function drawDesk(body){
  var keeper=amKeeper(), holder=amHolder(), officer=!!(deskStanding&&deskStanding.officer);
  var tabs=[];
  if(keeper) tabs.push(["hiring","Hiring"],["offices","Offices"],["posts","Positions & wages"],["workplaces","Workplaces"],["catalogue","Catalogue"]);
  if(keeper||holder) tabs.push(["security","Tower security"],["housing","Housing"]);
  if(keeper||officer) tabs.push(["courts","Courts"]);
  tabs.push(["people","Who is in the city"]);
  if(keeper) tabs.push(["city","The city"]);
  body.innerHTML='<div id="kd-msg" style="color:var(--dim);min-height:18px;margin-bottom:10px"></div>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">'+
      tabs.map(function(t){ return '<button class="btn" data-kd="'+t[0]+'">'+t[1]+'</button>'; }).join("")+
    '</div><div id="kd-pane"></div>';
  Array.prototype.forEach.call(body.querySelectorAll("[data-kd]"),function(b){
    b.onclick=function(){ deskPane(b.getAttribute("data-kd")); };
  });
  body.insertAdjacentHTML("afterbegin",'<div style="color:var(--dim);font-size:12px;margin-bottom:6px">You sit here as <b style="color:var(--bone)">'+
    (keeper?"a keeper":holder?"the holder of the penthouse":"an officer of Somnucor")+'</b>.</div>');
  deskPane(keeper?"offices":holder?"security":"courts");
}
function kdMsg(t,bad){ var e=document.getElementById("kd-msg"); if(e){ e.textContent=t; e.style.color=bad?"#C0603A":"var(--dim)"; } }
function deskPane(which){
  var pane=document.getElementById("kd-pane"); if(!pane) return;
  pane.innerHTML="Looking\u2026";
  if(which==="hiring"){
    cityRpc("applications_board").then(function(rows){
      rows=rows||[];
      pane.innerHTML='<p style="color:var(--dim);line-height:1.6">Who is waiting on a post that a keeper chooses for. Most of the city\u2019s posts hire the first dreamer who takes one, while there is room; the law, the courts, the Gaol and the treasury wait for you. Change which is which on <b>Positions &amp; wages</b>.</p>'+
        (rows.length?'<table style="width:100%;border-collapse:collapse">'+rows.map(function(a){
          return '<tr><td style="padding:5px 6px;border-bottom:1px solid var(--line)">'+esc(a.email||a.user_id)+'</td>'+
            '<td style="border-bottom:1px solid var(--line)"><b>'+esc(a.job)+'</b>'+(a.workplace?'<br><span style="color:var(--dim);font-size:12px">'+esc(a.workplace)+'</span>':'')+'</td>'+
            '<td style="border-bottom:1px solid var(--line);color:var(--dim)">'+(a.said?'\u201c'+esc(a.said)+'\u201d':'')+'</td>'+
            '<td style="border-bottom:1px solid var(--line);white-space:nowrap">'+new Date(a.at).toLocaleDateString()+' <button class="btn" data-hire="'+a.application_id+'">Hire</button></td></tr>';
        }).join("")+'</table>':'<p>Nobody is waiting.</p>');
      Array.prototype.forEach.call(pane.querySelectorAll("[data-hire]"),function(b){
        b.onclick=function(){ cityRpc("hire",{p_application:+b.getAttribute("data-hire")})
          .then(function(o){ kdMsg(o==="ok"?"Hired.":String(o),o!=="ok"); deskPane("hiring"); })
          .catch(function(e){ kdMsg(e.message,true); }); };
      });
    }).catch(function(e){ pane.innerHTML="<span style='color:#C0603A'>"+esc(e.message)+" \u2014 has schema-update-19 been run?</span>"; });
  }
  else if(which==="workplaces"){
    cityRpc("workplace_board").then(function(rows){
      rows=rows||[];
      pane.innerHTML='<p style="color:var(--dim);line-height:1.6">Every place of work in the city, and who works there. Its own workers may rearrange it from inside; you may too, or put it back the way it was built.</p>'+
        '<table style="width:100%;border-collapse:collapse">'+rows.map(function(w){
          return '<tr><td style="padding:5px 6px;border-bottom:1px solid var(--line)"><b>'+esc(w.key)+'</b><br><span style="color:var(--dim);font-size:12px">'+esc(w.jobs||"")+'</span></td>'+
            '<td style="border-bottom:1px solid var(--line);color:var(--dim)">'+esc((atlRing(w.ring)||{}).name||w.ring)+'</td>'+
            '<td style="border-bottom:1px solid var(--line);color:var(--dim)">'+(w.decor?"rearranged "+new Date(w.decor_at).toLocaleDateString():"as built")+'</td>'+
            '<td style="border-bottom:1px solid var(--line);white-space:nowrap"><button class="btn" data-way="'+esc(w.key)+'">Show me</button>'+
            (w.decor?' <button class="btn" data-reset="'+esc(w.key)+'">As built</button>':'')+'</td></tr>';
        }).join("")+'</table>';
      Array.prototype.forEach.call(pane.querySelectorAll("[data-way]"),function(b){ b.onclick=function(){ closeDesk(); showTheWay(b.getAttribute("data-way")); }; });
      Array.prototype.forEach.call(pane.querySelectorAll("[data-reset]"),function(b){
        b.onclick=function(){ cityRpc("reset_workplace_decor",{p_key:b.getAttribute("data-reset")})
          .then(function(o){ kdMsg(o==="ok"?"Put back as built.":String(o),o!=="ok"); if(typeof loadWorkplaces==="function") loadWorkplaces(true); deskPane("workplaces"); }); };
      });
    }).catch(function(e){ pane.innerHTML="<span style='color:#C0603A'>"+esc(e.message)+" \u2014 has schema-update-19 been run?</span>"; });
  }
  else if(which==="offices"){
    Promise.all([cityRpc("office_board"),cityRpc("admin_list_dreamers")]).then(function(r){
      deskOffices=r[0]||[];
      var who=(r[1]||[]).map(function(d){ return '<option value="'+d.id+'">'+esc(d.email||d.id)+"</option>"; }).join("");
      pane.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">'+
        '<select id="kd-off">'+deskOffices.map(function(o){
          return '<option value="'+o.office_id+'">Floor '+(o.floor+1)+' \u00b7 '+esc(o.number)+(o.name?" \u2014 "+esc(o.name):"")+(o.occupied?" (taken)":"")+"</option>"; }).join("")+'</select>'+
        '<select id="kd-who"><option value="">— nobody —</option>'+who+'</select>'+
        '<input id="kd-name" placeholder="what it is called" style="background:var(--void);border:1px solid var(--line);color:var(--bone);padding:6px 8px">'+
        '<button class="btn" id="kd-assign">Assign</button></div>'+
        '<p style="color:var(--dim);font-size:12px;margin:-4px 0 10px">Offices are for our backers and our actual city workers. Assigning one only ties it to them on the books — it stays locked, no working code, until you set one below.</p>'+
        '<table style="width:100%;border-collapse:collapse">'+
        deskOffices.map(function(o,i){
          return '<tr><td style="padding:4px 6px;border-bottom:1px solid var(--line)">Floor '+(o.floor+1)+'</td>'+
            '<td style="padding:4px 6px;border-bottom:1px solid var(--line)">'+esc(o.number)+'</td>'+
            '<td style="padding:4px 6px;border-bottom:1px solid var(--line)">'+esc(o.name||"")+'</td>'+
            '<td style="padding:4px 6px;border-bottom:1px solid var(--line)">'+(o.occupant?esc(o.occupant):'<span style="color:var(--dim)">empty</span>')+'</td>'+
            '<td style="padding:4px 6px;border-bottom:1px solid var(--line)">'+
              (o.occupant?('<input id="kd-code-'+i+'" placeholder="4–12 chars" style="width:100px;background:var(--void);border:1px solid var(--line);color:var(--bone);padding:3px 6px">'+
              ' <button class="btn" data-setcode="'+o.office_id+'" data-i="'+i+'">Set code</button>'+
              ' <button class="btn" data-lock="'+o.office_id+'">Lock</button>')
              :'<span style="color:var(--dim)">—</span>')+
            "</td></tr>";
        }).join("")+"</table>";
      document.getElementById("kd-assign").onclick=function(){
        var u=document.getElementById("kd-who").value||null;
        cityRpc("assign_office",{p_office:+document.getElementById("kd-off").value,p_user:u,
          p_name:(document.getElementById("kd-name").value||"").trim()||null,p_panel:null})
          .then(function(out){ kdMsg(String(out)); deskPane("offices"); })
          .catch(function(e){ kdMsg(e.message,true); });
      };
      Array.prototype.forEach.call(pane.querySelectorAll("[data-setcode]"),function(b){
        b.onclick=function(){
          var code=(document.getElementById("kd-code-"+b.getAttribute("data-i")).value||"").trim();
          cityRpc("set_office_code",{p_office:+b.getAttribute("data-setcode"),p_code:code})
            .then(function(out){ kdMsg(out==="ok"?"Code set. That office is unlocked now.":String(out)); deskPane("offices"); })
            .catch(function(e){ kdMsg(e.message,true); });
        };
      });
      Array.prototype.forEach.call(pane.querySelectorAll("[data-lock]"),function(b){
        b.onclick=function(){
          cityRpc("lock_office",{p_office:+b.getAttribute("data-lock")})
            .then(function(out){ kdMsg(out==="ok"?"Locked. No code opens it now, except the occupant themself or a keeper.":String(out)); deskPane("offices"); })
            .catch(function(e){ kdMsg(e.message,true); });
        };
      });
    }).catch(function(e){ pane.innerHTML="<span style='color:#C0603A'>"+esc(e.message)+"</span>"; });
  }
  else if(which==="posts"){
    cityRpc("job_board").then(function(rows){
      deskJobs=rows||[];
      pane.innerHTML='<table style="width:100%;border-collapse:collapse">'+
        '<tr><th style="text-align:left;padding:4px 6px">Post</th><th style="text-align:left">Pay</th>'+
        '<th style="text-align:left">Filled</th><th style="text-align:left">Positions</th><th style="text-align:left">Wage</th><th style="text-align:left">Hires itself</th><th></th></tr>'+
        deskJobs.map(function(j,i){
          return '<tr><td style="padding:4px 6px;border-bottom:1px solid var(--line)">'+esc(j.title)+(j.workplace?'<br><span style="color:var(--dim);font-size:11px">'+esc(j.workplace)+'</span>':'')+'</td>'+
            '<td style="border-bottom:1px solid var(--line)">'+j.rate+" gold "+(j.pay_kind==="salary"?"a week":"an hour")+'</td>'+
            '<td style="border-bottom:1px solid var(--line)">'+j.taken+'</td>'+
            '<td style="border-bottom:1px solid var(--line)"><input id="kdp-'+i+'" type="number" min="0" value="'+j.positions+
            '" style="width:64px;background:var(--void);border:1px solid var(--line);color:var(--bone);padding:3px"></td>'+
            '<td style="border-bottom:1px solid var(--line)"><input id="kdw-'+i+'" type="number" min="0" value="'+j.rate+
            '" style="width:64px;background:var(--void);border:1px solid var(--line);color:var(--bone);padding:3px"></td>'+
            '<td style="border-bottom:1px solid var(--line)"><input type="checkbox" data-auto="'+j.job_id+'" '+(j.auto_hire===false?"":"checked")+'></td>'+
            '<td style="border-bottom:1px solid var(--line)">'+
              '<button class="btn" data-kdp="'+i+'" data-job="'+j.job_id+'">Set positions</button> '+
              '<button class="btn" data-kdw="'+i+'" data-job="'+j.job_id+'">Set wage</button></td></tr>';
        }).join("")+"</table>";
      Array.prototype.forEach.call(pane.querySelectorAll("[data-kdp]"),function(b){
        b.onclick=function(){
          cityRpc("set_positions",{p_job:+b.getAttribute("data-job"),
            p_positions:+document.getElementById("kdp-"+b.getAttribute("data-kdp")).value})
            .then(function(o){ kdMsg(o==="ok"?"Positions set.":String(o),o!=="ok"); deskPane("posts"); })
            .catch(function(e){ kdMsg(e.message,true); });
        };
      });
      Array.prototype.forEach.call(pane.querySelectorAll("[data-auto]"),function(b){
        b.onchange=function(){ cityRpc("set_auto_hire",{p_job:+b.getAttribute("data-auto"),p_on:b.checked})
          .then(function(o){ kdMsg(o==="ok"?(b.checked?"That post now hires whoever takes it first.":"A keeper chooses for that post now."):String(o),o!=="ok"); })
          .catch(function(e){ kdMsg(e.message,true); }); };
      });
      Array.prototype.forEach.call(pane.querySelectorAll("[data-kdw]"),function(b){
        b.onclick=function(){
          var i=+b.getAttribute("data-kdw"), j=deskJobs[i];
          cityRpc("set_wage",{p_job:+b.getAttribute("data-job"),p_kind:j.pay_kind,
            p_rate:+document.getElementById("kdw-"+i).value,p_starting:j.starting})
            .then(function(o){ kdMsg(o==="ok"?"Wage set.":String(o),o!=="ok"); deskPane("posts"); })
            .catch(function(e){ kdMsg(e.message,true); });
        };
      });
    });
  }
  else if(which==="catalogue"){
    cityRpc("catalogue_board").then(function(rows){
      var cat=rows||[];
      pane.innerHTML='<p style="color:var(--dim);line-height:1.6">What everything in Somnucor sells for — the shop’s wares, and what is built out of the quarry and the stand.</p>'+
        '<table style="width:100%;border-collapse:collapse">'+
        '<tr><th style="text-align:left;padding:4px 6px">Thing</th><th style="text-align:left">Kind</th>'+
        '<th style="text-align:left">Listed</th><th style="text-align:left">Price</th><th></th></tr>'+
        cat.map(function(c,i){
          return '<tr><td style="padding:4px 6px;border-bottom:1px solid var(--line)">'+esc(c.name)+'</td>'+
            '<td style="border-bottom:1px solid var(--line)">'+esc(c.kind)+'</td>'+
            '<td style="border-bottom:1px solid var(--line)"><input id="kdcl-'+i+'" type="checkbox" '+(c.listed?"checked":"")+'></td>'+
            '<td style="border-bottom:1px solid var(--line)"><input id="kdc-'+i+'" type="number" min="0" value="'+c.price+
            '" style="width:76px;background:var(--void);border:1px solid var(--line);color:var(--bone);padding:3px"></td>'+
            '<td style="border-bottom:1px solid var(--line)"><button class="btn" data-kdc="'+i+'" data-item="'+c.id+'">Set</button></td></tr>';
        }).join("")+"</table>";
      Array.prototype.forEach.call(pane.querySelectorAll("[data-kdc]"),function(b){
        b.onclick=function(){
          var i=b.getAttribute("data-kdc");
          cityRpc("set_price",{p_item:+b.getAttribute("data-item"),
            p_price:+document.getElementById("kdc-"+i).value,
            p_listed:document.getElementById("kdcl-"+i).checked})
            .then(function(o){ kdMsg(o==="ok"?"Set.":String(o),o!=="ok"); deskPane("catalogue"); })
            .catch(function(e){ kdMsg(e.message,true); });
        };
      });
    }).catch(function(e){ pane.innerHTML="<span style='color:#C0603A'>"+esc(e.message)+"</span>"; });
  }
  else if(which==="courts"){
    cityRpc("prison_board").then(function(rows){
      var held=rows||[];
      pane.innerHTML='<p style="color:var(--dim);line-height:1.6">Who Somnucor currently holds. A sentence can be worked off, or a keeper or officer can release it outright. It touches nothing in anybody’s own dreamscape.</p>'+
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">'+
          '<input id="kd-sent-user" placeholder="their account id" style="min-width:260px;background:var(--void);border:1px solid var(--line);color:var(--bone);padding:6px 8px">'+
          '<input id="kd-sent-crime" placeholder="the charge" style="background:var(--void);border:1px solid var(--line);color:var(--bone);padding:6px 8px">'+
          '</div><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px">'+
          '<label>Hours to serve in the Gaol <input id="kd-sent-real" type="number" min="1" max="720" value="4" style="width:64px;background:var(--void);border:1px solid var(--line);color:var(--bone);padding:6px 8px"></label>'+
          '<label><input id="kd-sent-workable" type="checkbox" checked> or worked off in <input id="kd-sent-work" type="number" min="1" value="2" style="width:64px;background:var(--void);border:1px solid var(--line);color:var(--bone);padding:6px 8px"> hours at the yard benches</label>'+
          '<button class="btn" id="kd-sentence">Sentence</button></div>'+
          '<p style="color:var(--dim);font-size:12px;margin:-6px 0 12px">Find an account id on the Offices pane’s picker if you keep the desk, or ask them for it. Only time actually spent in the Gaol counts — in its cells or its yard — and the prisoner is kept there whenever they are in Somnucor. The sentence ends when the hours are served, or when the hours are worked off at the benches, whichever comes first.</p>'+
        '<table style="width:100%;border-collapse:collapse">'+
        '<tr><th style="text-align:left;padding:4px 6px">Held</th><th style="text-align:left">For</th>'+
        '<th style="text-align:left">Served</th><th style="text-align:left">Worked off</th><th></th></tr>'+
        held.map(function(p){
          return '<tr><td style="padding:4px 6px;border-bottom:1px solid var(--line)">'+esc(p.email||p.user)+'</td>'+
            '<td style="border-bottom:1px solid var(--line)">'+esc(p.crime)+'</td>'+
            '<td style="border-bottom:1px solid var(--line)">'+(p.serve_hours?(Math.floor((p.served_minutes||0)/60)+"h"+((p.served_minutes||0)%60)+"m of "+p.serve_hours+"h"):"\u2014")+'</td>'+
            '<td style="border-bottom:1px solid var(--line)">'+(p.work_off?(Math.floor((p.worked_minutes||0)/60)+"h"+((p.worked_minutes||0)%60)+"m of "+p.hours+"h"):"<span style=\"color:var(--dim)\">no</span>")+'</td>'+
            '<td style="border-bottom:1px solid var(--line)"><button class="btn" data-kd-release="'+p.sentence_id+'">Release</button></td></tr>';
        }).join("")+"</table>"+
        (!held.length?'<p style="color:var(--dim)">Nobody is held just now.</p>':"");
      var sb=document.getElementById("kd-sentence");
      if(sb) sb.onclick=function(){
        var u=(document.getElementById("kd-sent-user").value||"").trim();
        var crime=(document.getElementById("kd-sent-crime").value||"").trim();
        var hoursReal=+document.getElementById("kd-sent-real").value||1;
        var workOff=document.getElementById("kd-sent-workable").checked;
        var hoursWork=+document.getElementById("kd-sent-work").value||1;
        if(!u||!crime) return kdMsg("An account id and a charge are both needed.",true);
        cityRpc("sentence",{p_user:u,p_crime:crime,p_hours_real:hoursReal,p_work_off:workOff,p_work_hours:hoursWork})
          .then(function(o){ kdMsg(o==="ok"?"Sentenced.":String(o),o!=="ok"); deskPane("courts"); })
          .catch(function(e){ kdMsg(e.message,true); });
      };
      Array.prototype.forEach.call(pane.querySelectorAll("[data-kd-release]"),function(b){
        b.onclick=function(){
          cityRpc("release",{p_sentence:+b.getAttribute("data-kd-release")})
            .then(function(o){ kdMsg(o==="ok"?"Released.":String(o),o!=="ok"); deskPane("courts"); })
            .catch(function(e){ kdMsg(e.message,true); });
        };
      });
    }).catch(function(e){ pane.innerHTML="<span style='color:#C0603A'>"+esc(e.message)+"</span>"; });
  }
  else if(which==="security"){
    /* the code itself is kept on the server (schema-update-18): it is read
       back only for a keeper or the holder, and set through set_penthouse_code.
       who the door admits and whether the tower opens are settings for
       everybody, so only a keeper writes those. */
    var cur=(typeof DW_CLOUD!=="undefined"&&DW_CLOUD.config)||{};
    var keeperHere=amKeeper();
    Promise.all([
      cityRpc("penthouse_holder").catch(function(){ return null; }),
      keeperHere?cityRpc("admin_list_dreamers").catch(function(){ return []; }):Promise.resolve([]),
      cityRpc("penthouse_code_now").catch(function(){ return null; })
    ]).then(function(pr){
        var holder=pr[0], code=pr[2]||"";
        var who=(pr[1]||[]).map(function(d){ return '<option value="'+d.id+'"'+(d.id===holder?" selected":"")+'>'+esc(d.email||d.id)+"</option>"; }).join("");
        var inp='style="background:var(--void);border:1px solid var(--line);color:var(--bone);padding:6px 8px"';
        pane.innerHTML='<p style="color:var(--dim);line-height:1.6">The code on this office, who it admits, and whether the tower opens above the lobby. A code is a door, not a vault — nobody’s dreams are behind it. '+
          'The code is kept on the server: nobody can read it from the page, and a keeper or whoever holds the penthouse always walks straight in.</p>'+
          '<h4 style="margin:12px 0 6px;font-weight:500">The code on the door</h4>'+
          '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">'+
          '<input id="kd-code" maxlength="12" placeholder="4 to 12 characters" value="'+esc(code)+'" '+inp+'>'+
          '<button class="btn" id="kd-code-roll">New random code</button>'+
          '<button class="btn" id="kd-code-set">Set the code</button>'+
          '<button class="btn" id="kd-code-clear">Clear it</button></div>'+
          '<p style="color:var(--dim);font-size:12px;margin:6px 0 0">'+(code?"The door asks for <b style=\"color:var(--bone)\">"+esc(code)+"</b> now.":"No code is set — only a keeper or the holder can go up.")+'</p>'+
          (keeperHere?(
            '<h4 style="margin:16px 0 6px;font-weight:500">Who the door admits, and the tower</h4>'+
            '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">'+
            '<select id="kd-who2"><option value="code">Anyone with the code</option><option value="keepers">Keepers and the holder only</option><option value="shut">Sealed</option></select>'+
            '<select id="kd-tower"><option value="open">Tower open</option><option value="lobby">Lobby only</option></select>'+
            '<button class="btn" id="kd-sec">Set</button></div>'+
            '<h4 style="margin:16px 0 6px;font-weight:500">Who holds the penthouse</h4>'+
            '<p style="color:var(--dim);font-size:12px;margin:0 0 8px">Whoever holds it walks in without a code, sits at this desk, may change the door’s code, and may assign the Somnucor Employee &amp; Backer District’s plots, the same as a keeper can.</p>'+
            '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">'+
            '<select id="kd-holder"><option value="">— nobody —</option>'+who+'</select>'+
            '<button class="btn" id="kd-holder-set">Set</button></div>')
          :'<p style="color:var(--dim);font-size:12px;margin-top:14px">Who the door admits, whether the tower opens, and who holds the penthouse are a keeper’s to set.</p>');
        var setCode=function(c){
          if(c&&(c.length<4||c.length>12)) return kdMsg("A code wants between four and twelve characters.",true);
          cityRpc("set_penthouse_code",{p_code:c||null})
            .then(function(o){ kdMsg(o==="ok"?(c?"Set. The penthouse door asks for "+c+" now.":"Cleared. Only a keeper or the holder goes up now."):String(o),o!=="ok"); deskPane("security"); })
            .catch(function(e){ kdMsg(e.message,true); });
        };
        document.getElementById("kd-code-roll").onclick=function(){
          var n=""; for(var i=0;i<6;i++) n+="0123456789"[Math.floor(Math.random()*10)];
          document.getElementById("kd-code").value=n; kdMsg("A new code. Press Set the code to make it so.");
        };
        document.getElementById("kd-code-set").onclick=function(){ setCode((document.getElementById("kd-code").value||"").trim()); };
        document.getElementById("kd-code-clear").onclick=function(){ setCode(""); };
        if(!keeperHere) return;
        document.getElementById("kd-who2").value=cur.penthouseWho||"code";
        document.getElementById("kd-tower").value=cur.towerOpen==="lobby"?"lobby":"open";
        document.getElementById("kd-sec").onclick=function(){
          Promise.all([
            putCloudConfig("penthouseWho",document.getElementById("kd-who2").value),
            putCloudConfig("towerOpen",document.getElementById("kd-tower").value)
          ]).then(function(){ kdMsg("Set. The tower obeys at once."); loadCloudConfig(); })
            .catch(function(e){ kdMsg(e.message,true); });
        };
        document.getElementById("kd-holder-set").onclick=function(){
          var u=document.getElementById("kd-holder").value||null;
          cityRpc("set_penthouse_holder",{p_user:u})
            .then(function(o){ kdMsg(o==="ok"?"Set.":String(o),o!=="ok"); deskPane("security"); })
            .catch(function(e){ kdMsg(e.message,true); });
        };
      }).catch(function(e){ pane.innerHTML="<span style='color:#C0603A'>"+esc(e.message)+"</span>"; });
  }
  else if(which==="people"){
    /* everybody walking Somnucor this minute — the same list the city panel
       draws from, set out for whoever keeps the desk */
    var rows=(typeof presenceList==="function")?presenceList():[];
    pane.innerHTML='<p style="color:var(--dim);line-height:1.6">Dreamers walking Somnucor right now. You see them only while you are in the city yourself, and only while they are too.</p>'+
      (rows.length?'<table style="width:100%;border-collapse:collapse">'+rows.map(function(p){
        return '<tr><td style="padding:4px 6px;border-bottom:1px solid var(--line)">'+esc(p.name)+'</td>'+
          '<td style="border-bottom:1px solid var(--line);color:var(--dim)">'+Math.round(p.dist)+' m away</td>'+
          '<td style="border-bottom:1px solid var(--line);font-size:11px;color:var(--dim)">'+esc(p.id)+'</td></tr>';
      }).join("")+'</table>':'<p>Nobody else is in the city just now.</p>');
  }
  else if(which==="housing"){
    /* a keeper picks from every account; the holder picks from dreamers who
       have taken a door, by the name on it (district_candidates) */
    Promise.all([loadLots(),cityRpc(amKeeper()?"admin_list_dreamers":"district_candidates").catch(function(){ return []; })]).then(function(r){
      var rows=r[0]||[], who=(r[1]||[]).map(function(d){ return '<option value="'+d.id+'">'+esc(d.email||d.id)+"</option>"; }).join("");
      var laid=(store.plots||[]).length, inBooks=(rows||[]).length;
      var held=(rows||[]).filter(function(l){ return l.held; }).length;
      var district=rows.filter(function(l){ return l.quarter==="The Somnucor Employee & Backer District"; });
      var districtLaid=(store.districtPlots||[]).length;
      pane.innerHTML='<p style="line-height:1.7">Plots laid out in the world: <b>'+laid+'</b><br>'+
        'Entered in the books: <b>'+inBooks+'</b> \u00b7 held by somebody: <b>'+held+'</b></p>'+
        '<p style="color:var(--dim);line-height:1.6">A plot has to be entered in the books before anybody can take it. '+
        'The realtor does this, or you.</p>'+
        (amKeeper()?'<button class="btn" id="kd-section">Enter the plots in the books</button>':'')+
        '<div style="margin-top:12px;max-height:280px;overflow-y:auto"><table style="width:100%;border-collapse:collapse">'+
        (rows||[]).slice(0,200).map(function(l){
          return '<tr><td style="padding:3px 6px;border-bottom:1px solid var(--line)">'+esc(l.name)+'</td>'+
            '<td style="border-bottom:1px solid var(--line)">'+esc(l.quarter||"")+'</td>'+
            '<td style="border-bottom:1px solid var(--line)">'+(l.price?l.price.toLocaleString()+" gold":"")+'</td>'+
            '<td style="border-bottom:1px solid var(--line)">'+(l.rent?l.rent.toLocaleString()+" a week":"")+'</td>'+
            '<td style="border-bottom:1px solid var(--line)">'+(l.held?"held":"free")+'</td></tr>';
        }).join("")+'</table></div>'+
        '<h4 style="margin:18px 0 6px;font-weight:500">The Somnucor Employee &amp; Backer District</h4>'+
        '<p style="color:var(--dim);font-size:12px;margin:0 0 8px">Never bought or leased \u2014 assigned, by a keeper or by whoever presently holds the penthouse (set that on the Tower security pane). '+
        (districtLaid?("Laid out in the world: "+districtLaid+" plots."):"Not laid out in the world yet \u2014 join Somnucor once more to build it.")+'</p>'+
        (districtLaid&&amKeeper()?'<button class="btn" id="kd-district-section">Enter the District\u2019s plots in the books</button>':"")+
        '<div style="margin-top:10px;max-height:220px;overflow-y:auto"><table style="width:100%;border-collapse:collapse">'+
        district.map(function(l){
          return '<tr><td style="padding:3px 6px;border-bottom:1px solid var(--line)">'+esc(l.name)+'</td>'+
            '<td style="border-bottom:1px solid var(--line)">'+(l.held?"held":"<span style=\"color:var(--dim)\">empty</span>")+'</td>'+
            '<td style="border-bottom:1px solid var(--line)"><select data-dwho="'+l.lot_id+'"><option value="">\u2014 nobody \u2014</option>'+who+'</select> '+
            '<button class="btn" data-dassign="'+l.lot_id+'">Assign</button></td></tr>';
        }).join("")+'</table></div>';
      var kdsec=document.getElementById("kd-section");
      if(kdsec) kdsec.onclick=function(){
        kdMsg("Entering them\u2026");
        sectionHousing().then(function(){ deskPane("housing"); }).catch(function(e){ kdMsg(e.message,true); });
      };
      var ds=document.getElementById("kd-district-section");
      if(ds) ds.onclick=function(){
        kdMsg("Entering the District's plots\u2026");
        sectionDistrict().then(function(){ deskPane("housing"); }).catch(function(e){ kdMsg(e.message,true); });
      };
      Array.prototype.forEach.call(pane.querySelectorAll("[data-dassign]"),function(b){
        b.onclick=function(){
          var lot=b.getAttribute("data-dassign");
          var u=document.querySelector('[data-dwho="'+lot+'"]').value||null;
          cityRpc("assign_district_plot",{p_lot:+lot,p_user:u})
            .then(function(o){ kdMsg(o==="ok"?"Assigned.":String(o),o!=="ok"); deskPane("housing"); })
            .catch(function(e){ kdMsg(e.message,true); });
        };
      });
    });
  }
  else {
    Promise.all([cityRpc("admin_diagnose"),cityRpc("doors_standing"),readTreasury()]).then(function(r){
      var d=r[0]||{}, doors=r[1], tr=r[2]||{};
      pane.innerHTML='<div style="line-height:1.8">'+
        "Accounts: <b>"+d.accounts_in_auth+"</b><br>"+
        "Signed in at least once: <b>"+d.signed_in_ever+"</b><br>"+
        "Doors in the hall: <b>"+(doors||0)+"</b><br>"+
        "Devices using the Atlas: <b>"+d.devices+"</b><br>"+
        "Keepers and watchers: <b>"+d.admins+"</b> ("+d.keepers+" keeper"+(d.keepers===1?"":"s")+")<br>"+
        "<span style='color:var(--dim)'>You are a "+esc(d.you_are||"?")+".</span></div>"+
        '<h4 style="margin:16px 0 6px;color:var(--bone);font-weight:500">The treasury</h4>'+
        '<div style="display:flex;gap:14px;flex-wrap:wrap;align-items:flex-end">'+
          '<label style="display:block">Tax on wages, in the hundred<br><input id="kd-tax" type="number" min="0" max="100" value="'+(tr.tax==null?"":tr.tax)+
            '" style="width:70px;background:var(--void);border:1px solid var(--line);color:var(--bone);padding:6px 8px"></label>'+
          '<button class="btn" id="kd-tax-set">Set tax</button>'+
          '<label style="display:block">Toll on the market, in the hundred<br><input id="kd-toll" type="number" min="0" max="100" value="'+(tr.market_toll==null?"":tr.market_toll)+
            '" style="width:70px;background:var(--void);border:1px solid var(--line);color:var(--bone);padding:6px 8px"></label>'+
          '<button class="btn" id="kd-toll-set">Set toll</button>'+
        '</div>'+
        '<h4 style="margin:16px 0 6px;color:var(--bone);font-weight:500">How wages are earned</h4>'+
        '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><select id="kd-payrule">'+
          '<option value="at_work">For the hours actually spent at one\u2019s post (someone left at work earns two fifths)</option>'+
          '<option value="always">For every hour since last paid, wherever one is</option></select>'+
          '<button class="btn" id="kd-payrule-set">Set</button></div>'+
        (tr.gold!=null?'<p style="color:var(--dim);margin-top:10px">The treasury itself holds <b>'+tr.gold.toLocaleString()+'</b> gold.</p>':"");
      var tb=document.getElementById("kd-tax-set");
      if(tb) tb.onclick=function(){
        cityRpc("set_tax",{p_per_cent:+document.getElementById("kd-tax").value})
          .then(function(o){ kdMsg(o==="ok"?"Tax set.":String(o),o!=="ok"); deskPane("city"); })
          .catch(function(e){ kdMsg(e.message,true); });
      };
      var pr=document.getElementById("kd-payrule");
      if(pr){ var cur=(typeof DW_CLOUD!=="undefined"&&DW_CLOUD.config&&DW_CLOUD.config.pay_rule)||"at_work"; pr.value=cur==="always"?"always":"at_work"; }
      var prb=document.getElementById("kd-payrule-set");
      if(prb) prb.onclick=function(){ cityRpc("set_pay_rule",{p_rule:pr.value}).then(function(o){ kdMsg(o==="ok"?"Set.":String(o),o!=="ok"); loadCloudConfig(); }).catch(function(e){ kdMsg(e.message,true); }); };
      var tl=document.getElementById("kd-toll-set");
      if(tl) tl.onclick=function(){
        cityRpc("set_toll",{p_per_cent:+document.getElementById("kd-toll").value})
          .then(function(o){ kdMsg(o==="ok"?"Toll set.":String(o),o!=="ok"); deskPane("city"); })
          .catch(function(e){ kdMsg(e.message,true); });
      };
    }).catch(function(e){ pane.innerHTML="<span style='color:#C0603A'>"+esc(e.message)+"</span>"; });
  }
}
/* reads the treasury row straight (RLS admits a keeper/watcher via is_admin()) */
function readTreasury(){
  return freshToken().then(function(tok){
    return fetch(DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/treasury?select=tax,market_toll,gold&limit=1",{
      headers:{apikey:DW_CONFIG.supabaseKey,Authorization:"Bearer "+(tok||DW_CONFIG.supabaseKey)}
    }).then(function(r){ return r.ok?r.json():[]; }).then(function(rows){ return (rows&&rows[0])||{}; });
  }).catch(function(){ return {}; });
}

/* writing a setting for everybody, from in the world */
function putCloudConfig(key,value){
  return freshToken().then(function(tok){
    return fetch(DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/app_config",{
      method:"POST",
      headers:{apikey:DW_CONFIG.supabaseKey,Authorization:"Bearer "+tok,"Content-Type":"application/json",
               Prefer:"resolution=merge-duplicates"},
      body:JSON.stringify({key:key,value:value,updated_at:new Date().toISOString()})
    }).then(function(r){ if(!r.ok) throw new Error("the desk could not write that"); return true; });
  });
}

if(typeof addEventListener==="function") addEventListener("keydown",function(e){
  if(/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||"")) return;
  if(e.code==="KeyK"&&(deskNear||deskOpen)) openDesk();
  else if(e.code==="KeyK"&&officeDeskNear) openOfficeDesk();
  if(e.code==="Escape"&&deskOpen) closeDesk();
});

