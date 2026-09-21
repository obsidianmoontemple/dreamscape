/* Dream Walker's Atlas — regression tests.
   Every case here is something that actually broke during development.
   Runs in the browser at index.html?test=1, and under Node via run-node.js. */

function built(){ return store.objects.filter(function(o){ return !o.filler; }); }
function kinds(a){ return built().filter(function(o){ return o.archetype===a; }); }
function dist(a,b){ return Math.round(Math.hypot(a.x-b.x,a.z-b.z)); }

/* ---------- the kit ---------- */
T.test("every archetype is well formed",function(){
  var need={box:3,cyl:3,cone:2,sph:1,ico:1,pln:2,tor:2};
  Object.keys(KIT).forEach(function(n){
    var d=KIT[n];
    T.ok(Array.isArray(d.size)&&d.size.length===3,n+" size");
    d.parts.forEach(function(p,i){
      T.ok(need[p.g]!==undefined,n+" part "+i+" unknown shape "+p.g);
      T.ok(p.s.length>=need[p.g],n+" part "+i+" size");
      T.ok(p.p.length===3,n+" part "+i+" position");
      if(typeof p.c==="string") T.ok(ROLE[p.c]!==undefined,n+" part "+i+" colour role "+p.c);
    });
  });
});
T.test("every trigger word points at a real archetype",function(){
  Object.keys(VOCAB).forEach(function(k){ T.ok(KIT[k],"VOCAB."+k+" has no archetype"); });
});

/* ---------- names ---------- */
T.test("places get real names, never 'undefined'",function(){
  scanText("a house, a church, a school, a bank and a shop");
  built().forEach(function(o){
    T.ok(o.name&&o.name.indexOf("undefined")===-1,"bad name: "+o.name);
    if(o.addr) T.ok(o.addr.street.indexOf("undefined")===-1,"bad street: "+o.addr.street);
  });
});

/* ---------- placement ---------- */
T.test("two buildings never share a lot",function(){
  scanText("a house. a gas station. a shop. a church. a bank. a school. a hotel.");
  var seen={};
  built().forEach(function(o){
    if(o.lot===null||o.lot===undefined) return;
    var k=o.bx+":"+o.bz+":"+o.lot;
    T.ok(!seen[k],"lot "+k+" used twice"); seen[k]=1;
  });
});
T.test("'two blocks down on the opposite side' lands two blocks away, across the street",function(){
  scanText("I built a house.");
  scanText("Then a gas station two blocks down on the opposite side of the street.");
  var h=kinds("house")[0], g=kinds("gasstation")[0];
  T.ok(h&&g,"both built");
  T.near(dist(h,g),216,20,"distance");
  T.ok(g.bz!==h.bz,"on the other side of the street");
});
T.test("'the side of the street' does not build a street",function(){
  scanText("a shop on the other side of the street");
  T.eq(kinds("road").length,0,"roads built");
});
T.test("a modifier belongs to the next noun only",function(){
  scanText("a huge red hospital with a crowd outside");
  var c=kinds("crowd")[0];
  T.ok(c,"crowd built");
  T.ok(!c.attrs.s&&c.attrs.c===undefined,"the crowd took the hospital's size or colour");
});

/* ---------- places that recur ---------- */
T.test("'the house' sharpens the house; 'another house' builds a second",function(){
  scanText("There was a house.");
  scanText("I went back to the house.");
  T.eq(kinds("house").length,1,"after 'the house'");
  scanText("There was another house further down the street.");
  T.eq(kinds("house").length,2,"after 'another house'");
});
T.test("a new night: 'the house' is a new house unless linked",function(){
  scanText("There was a house by the river.");
  closeNight("one","There was a house by the river.",false);
  scanText("I was in the house again.");
  T.eq(kinds("house").length,2,"houses across two nights");
});

/* ---------- figures ---------- */
T.test("the same woman on three nights is one person",function(){
  ["A woman stood at the door.","The woman was there again, by the wall.","I saw the woman near the church."]
    .forEach(function(t,i){ store.session=i+1; scanText(t); feedContext(t); });
  var w=store.characters.filter(function(c){ return c.archetype==="human"&&c.primary!==false; });
  T.eq(w.length,1,"women");
  T.ok(w[0].sessions.length>=2,"nights recorded");
});
T.test("'another woman' is a second person",function(){
  scanText("A woman stood at the door."); feedContext("A woman stood at the door.");
  scanText("Another woman waited by the church."); feedContext("Another woman waited by the church.");
  var w=store.characters.filter(function(c){ return c.archetype==="human"&&c.primary!==false; });
  T.eq(w.length,2,"women");
});
T.test("nothing is invented for a dreamt figure",function(){
  scanText("A woman stood outside a house."); feedContext("A woman stood outside a house.");
  var w=store.characters.filter(function(c){ return c.primary!==false; })[0];
  assignLife(w);
  T.ok(!w.home&&!w.work&&!w.routine,"a life was invented");
  var r=whereabouts(w,15);
  T.ok(r.unknown,"should stand where dreamt");
});
T.test("a stated role and night shift put her at work at 03:00",function(){
  scanText("A woman stood outside a hospital. There was a house.");
  feedContext("A woman stood outside a hospital.");
  var w=store.characters.filter(function(c){ return c.primary!==false; })[0];
  reconcile({objects:[],people:[{label:w.name,role:"nurse",shift:"night"}],emotions:[],lucidity:0});
  assignLife(w);
  T.eq(w.src.routine,"stated","routine provenance");
  T.eq(whereabouts(w,3).where,"work","where at 03:00");
});
T.test("a figure speaking of itself is recorded in the third person",function(){
  T.eq(deFirstPerson("I work nights at the mill.","Mara"),"Mara works nights at the mill.");
  T.eq(deFirstPerson("I live in the tall house.","Mara"),"Mara lives in the tall house.");
});

/* ---------- population ---------- */
T.test("a busy block is busy at 08:00 and empty at 03:00",function(){
  var b={res:40,day:860,any:true,flavour:"com",ids:[]};
  T.ok(crowdSize(b,8)>crowdSize(b,3)+8,"morning rush");
  T.ok(crowdSize(b,3)<=1,"small hours");
});
T.test("fillers are never written to storage",function(){
  scanText("an enormous skyscraper, a station, a bank and a shop");
  populate(); balanceCrowds(18); save();
  var saved=JSON.parse(localStorage.getItem(KEY));
  T.eq(saved.objects.filter(function(o){ return o.filler; }).length,0,"fillers saved");
});

/* ---------- the sealed record ---------- */
T.test("a night is filed once, and its seal catches tampering",function(){
  var r=closeNight("seal test","I was in a tall house by the river.",false);
  T.ok(r,"first close");
  var now=store.session; store.session=r.n;
  T.eq(closeNight("the same night again","x",false),null,"a night filed twice");
  store.session=now;
  return new Promise(function(res){ setTimeout(res,60); }).then(function(){
    return verifyNight(r.n);
  }).then(function(ok){
    T.ok(ok,"fresh seal verifies");
    amendNight(r.n,"The windows were bricked up.");
    T.eq(r.original,"I was in a tall house by the river.","original untouched");
    return verifyNight(r.n);
  }).then(function(ok){
    T.ok(ok,"still verifies after an addition");
    var keep=r.original; r.original+=" (altered)";
    return verifyNight(r.n).then(function(bad){ r.original=keep; T.ok(!bad,"tampering not detected"); });
  });
});
T.test("research shares only the whitelisted fields",function(){
  scanText("There was a fire and the tower collapsed.");
  var r=closeNight("fire","There was a fire and the tower collapsed. My sister Ruth was there.",false);
  var s=researchSummary(r);
  T.eq(Object.keys(s).sort().join(","),"events,feelings,forms,lucidity,night_of","fields");
  T.ok(JSON.stringify(s).indexOf("Ruth")===-1,"a name leaked");
  T.ok(JSON.stringify(s).indexOf("sister")===-1,"dream text leaked");
});
T.test("deleting a night takes only that night's places",function(){
  scanText("a house and a tower"); closeNight("one","a house and a tower",false);
  scanText("a church"); var r=closeNight("two","a church",false);
  deleteNight(r.n);
  T.eq(kinds("church").length,0,"church from the deleted night");
  T.eq(kinds("house").length,1,"house from the kept night");
});

/* ---------- the books ---------- */
T.test("1644 spelling meets modern words",function(){
  [["house","houſe"],["fire","fyre"],["blood","bloud"],["tower","towres"],["dream","dreames"],["glass","glaſſe"]]
    .forEach(function(p){ T.eq(normEM(p[0]),normEM(p[1]),p[0]+" / "+p[1]); });
});
T.test("a flying dream opens on Artemidorus 'To flye'",function(){
  var d="I flew over the sea at night under a full moon.";
  store.transcript=d; scanText(d);
  var r=interpretText(d,null);
  T.ok(r.art.length&&/^To flye/.test(r.art[0].head),"first chapter: "+(r.art[0]&&r.art[0].head));
  T.ok(r.miller.some(function(m){ return m.w==="Flying"; }),"Miller's Flying");
});
T.test("houseflies do not summon the flying chapter",function(){
  var d="The kitchen was full of flies.";
  var r=interpretText(d,null);
  T.ok(!r.art.some(function(a){ return /^To flye/.test(a.head); }),"flying chapter appeared");
});
T.test("a chapter must earn its place — no teeth in a house dream",function(){
  var d="I was in a tall house by the river. There was a fire in the church.";
  var r=interpretText(d,null);
  T.ok(!r.art.some(function(a){ return /Teeth/.test(a.head); }),"Of the Teeth appeared");
});
T.test("held-back 1901 readings never appear unless released",function(){
  books();
  var held=DW_BOOKS.miller.entries.filter(function(e){ return e.hold; }).map(function(e){ return e.w; });
  T.ok(held.length===5,"five entries held");
  var r=interpretText("a "+held.join(" and a ").toLowerCase(),null);
  T.ok(!r.miller.some(function(m){ return held.indexOf(m.w)>-1; }),"a held entry was shown");
});

/* ---------- the sky ---------- */
T.test("noon is bright and midnight is dark",function(){
  function lum(n){ return 0.2126*((n>>16)&255)+0.7152*((n>>8)&255)+0.0722*(n&255); }
  T.ok(lum(skyAt(12).low)>lum(skyAt(0).low)*8,"daylight");
  T.eq(daylight(0),0,"midnight light");
  T.eq(daylight(12),1,"noon light");
});

/* ---------- added after the second round of testing in use ---------- */
T.test("possessive and bare mentions mean tonight's house",function(){
  scanText("There was a house.");
  scanText("I went into grandma's house.");
  scanText("Back to house again.");
  T.eq(kinds("house").length,1,"houses");
});
T.test("the slower pass can run twice over the same night without building twice",function(){
  scanText("I walked to a house and then a church.");
  var p={objects:[{archetype:"house",label:"tall house"},{archetype:"church",label:"old church"}],emotions:[],lucidity:0};
  reconcile(p);
  reconcile({objects:[{archetype:"house",label:"the house by the road"},{archetype:"church",label:"a church"}],emotions:[],lucidity:0});
  T.eq(kinds("house").length,1,"houses"); T.eq(kinds("church").length,1,"churches");
});
T.test("floors: a three-storey house is three floors and taller, not stretched",function(){
  scanText("a three-storey house");
  var h=kinds("house")[0];
  T.eq(h.attrs.lv,3,"floors read");
  var parts=levelParts(KIT.house,h), body=parts[0], roof=parts[1];
  T.near(body.s[1],7.5,0.01,"wall height");
  T.ok(roof.p[1]>KIT.house.parts[1].p[1]+2,"roof lifted");
  T.eq(roof.s.join(","),KIT.house.parts[1].s.join(","),"roof kept its shape");
});
T.test("floors stated after the noun: a tower of twelve floors",function(){
  scanText("a tower of twelve floors");
  T.eq(kinds("tower")[0].attrs.lv,12,"floors");
});
T.test("clean slate keeps who is dreaming and nothing else",function(){
  dreamer().name="the Walker";
  scanText("a house and a church"); closeNight("x","a house and a church",false);
  window.confirm=function(){ return true; }; var ex=exportJSON; exportJSON=function(){};
  cleanSlate();
  exportJSON=ex;
  T.eq(built().length,0,"places"); T.eq(store.sessions.length,0,"sealed dreams");
  T.eq(dreamer().name,"the Walker","who is dreaming");
});
T.test("a hand-placed building snaps to a free lot and never shares one",function(){
  document.getElementById("p-snap").checked=true;
  var a=plotPlace("house",0,30), b=plotPlace("shop",0,30);
  T.ok(a.lot!==null&&b.lot!==null,"both on lots");
  T.ok(a.bx+":"+a.bz+":"+a.lot!==b.bx+":"+b.bz+":"+b.lot,"shared a lot");
  T.ok(a.placed&&fidelity(a)===1,"placed by hand is fully solid");
});
T.test("moving a building frees its old lot",function(){
  document.getElementById("p-snap").checked=true;
  var a=plotPlace("house",0,30), was=lotKey(a.bx,a.bz,a.lot);
  settle(a,300,300);
  T.ok(!store.lots[was],"old lot still taken");
  T.ok(store.lots[lotKey(a.bx,a.bz,a.lot)]===a.id,"new lot not taken");
});
T.test("a figure you made can be woken by telling the dream about them",function(){
  var f=plotPlace("human",10,10), c=charOf(f);
  T.ok(!c.awake,"awake too soon");
  var r=describeFigure(c,"His name is Silas. He works nights at the mill. He wears a grey coat. He never looks at the sky.");
  T.eq(c.name,"Silas","name taken");
  T.ok(c.awake,"still asleep after four things");
});
T.test("the offline voice answers the question and does not repeat itself",function(){
  var f=plotPlace("human",10,10), c=charOf(f);
  describeFigure(c,"His name is Silas. He works nights at the mill. He wears a grey coat. He never looks at the sky.");
  var seen={}, dup=0;
  for(var i=0;i<10;i++){ var r=localVoice(c,"tell me something"); if(seen[r]) dup++; seen[r]=1; }
  T.eq(dup,0,"repeated lines in ten replies");
  var who=localVoice(c,"who are you?");
  T.ok(/Silas/.test(who)||/I'm/.test(who),"did not answer who: "+who);
  T.ok(!/I was A |I was the /i.test(Object.keys(seen).join(" ")),"the old broken sentence is back");
});
T.test("a recorded detail is turned into the figure's own memory",function(){
  var c={name:"woman",aka:["woman"],details:[],sessions:[1]};
  T.eq(toFirstPerson("A woman stood at the door of a house.",c),"I stood at the door of a house.");
  T.eq(toFirstPerson("I saw the woman near the old church.",c),"You saw me near the old church.");
  T.eq(toFirstPerson("He works nights at the mill.",{name:"Silas",aka:["silas"]}),"I work nights at the mill.");
});

/* ---------- the Atlas-wide settings from the admin page ---------- */
T.test("a reading released from the admin page appears for everyone",function(){
  books();
  var keep=DW_CLOUD.config;
  DW_CLOUD.config={miller_released:["w:Gypsy"]};
  var r=interpretText("a gypsy by the road",null);
  var shown=r.miller.some(function(m){ return m.w==="Gypsy"; });
  DW_CLOUD.config=keep;
  T.ok(shown,"released entry still held back");
  var r2=interpretText("a gypsy by the road",null);
  T.ok(!r2.miller.some(function(m){ return m.w==="Gypsy"; }),"held entry shown without release");
});
T.test("a secret key in the config is never treated as usable",function(){
  var keep=DW_CONFIG.supabaseKey, keepU=DW_CONFIG.supabaseUrl;
  DW_CONFIG.supabaseUrl="https://example.supabase.co"; DW_CONFIG.supabaseKey="sb_secret_abc";
  T.ok(!cloudOn(),"a secret key was accepted");
  DW_CONFIG.supabaseKey="sb_publishable_abc";
  T.ok(cloudOn(),"a publishable key was refused");
  DW_CONFIG.supabaseKey=keep; DW_CONFIG.supabaseUrl=keepU;
});
