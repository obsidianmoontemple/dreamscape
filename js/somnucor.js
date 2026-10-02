/* SomnuMatrix — somnucor.js
   Somnucor: the hall every dreamer arrives in. A ring of doors, one for every world
   the Atlas knows, and one that carries your own name and opens on your own town.
   Between the doors stand mirrors. Around the hall, galleries showing what can be
   dreamt — dwellings, figures, gods, creatures, workings, the turning year — and
   signboards saying plainly how any of it is done.
   It is built once, and it belongs to the app rather than to any one dream.
   loaded as a plain script; shares scope with the other files */
"use strict";

var HUB_STONE=0x2A2E3A, HUB_TRIM=0xC9A868, HUB_GLOW=0x9FD8FF;

/* ---------- the pieces the hall is made of ---------- */
S("hubdoor","structure",[3.4,5.2,1.2],[
  {g:"box",s:[3.2,5,.8],p:[0,2.5,0],c:HUB_STONE},
  {g:"box",s:[2.2,4,.3],p:[0,2,.3],c:0x141620},
  {g:"pln",s:[2,3.8],p:[0,2,.48],c:HUB_GLOW,glow:1,opa:.42},
  {g:"box",s:[3.4,.3,1],p:[0,5.1,0],c:HUB_TRIM},
  {g:"box",s:[2.4,.5,.12],p:[0,4.5,.45],c:0x0E1018},
  {g:"sph",s:[.12],p:[-1.3,2.4,.45],c:HUB_TRIM,glow:1,pulse:1},
  {g:"sph",s:[.12],p:[1.3,2.4,.45],c:HUB_TRIM,glow:1,pulse:1}
],["door of your own","a door with a name on it","hall door","doorway in the hall"]);
S("hubmirror","structure",[2.2,4.6,.6],[
  {g:"box",s:[2,4.4,.35],p:[0,2.2,0],c:HUB_STONE},
  {g:"box",s:[1.5,3.6,.12],p:[0,2.2,.2],c:0xDDE3EC,glow:1,opa:.75},
  {g:"tor",s:[.9,.09],p:[0,4.2,.1],r:[0,0,0],c:HUB_TRIM}
],["standing mirror","tall mirror in a frame","mirror between the doors"]);
S("maptable","structure",[7,1.6,7],[
  {g:"cyl",s:[3,3.2,1.1,24],p:[0,.55,0],c:HUB_STONE},
  {g:"cyl",s:[3.1,3.1,.12,24],p:[0,1.12,0],c:0x141620},
  {g:"cyl",s:[2.7,2.7,.06,24],p:[0,1.2,0],c:HUB_GLOW,glow:1,opa:.5,pulse:1},
  {g:"sph",s:[.16],p:[1.6,1.34,0],c:HUB_TRIM,glow:1,pulse:1,rep:[6,-.5,0,.5]},
  {g:"tor",s:[3.25,.1],p:[0,1.14,0],r:[Math.PI/2,0,0],c:HUB_TRIM}
],["map table","table with a map of the worlds","the great map","map of everywhere"]);
S("signboard","infra",[3.4,2.8,.4],[
  {g:"cyl",s:[.12,.14,2.6,8],p:[-1.2,1.3,0],c:0x4A4238},
  {g:"cyl",s:[.12,.14,2.6,8],p:[1.2,1.3,0],c:0x4A4238},
  {g:"box",s:[3.2,1.5,.14],p:[0,2.1,0],c:0x2A2E3A},
  {g:"box",s:[2.9,1.2,.05],p:[0,2.1,.1],c:0xE8E4DA},
  {g:"box",s:[3.3,.12,.2],p:[0,2.92,0],c:HUB_TRIM}
],["signboard","a board with writing on it","notice board in the hall"]);
S("hubpillar","structure",[2.6,9,2.6],[
  {g:"cyl",s:[1,1.2,8,12],p:[0,4,0],c:HUB_STONE},
  {g:"cyl",s:[1.4,1.4,.5,12],p:[0,8.2,0],c:HUB_TRIM},
  {g:"cyl",s:[1.4,1.4,.5,12],p:[0,.25,0],c:HUB_TRIM},
  {g:"sph",s:[.3],p:[0,8.8,0],c:HUB_GLOW,glow:1,pulse:1}
],["great pillar","pillar of the hall"]);
S("plinth","infra",[2.2,1.2,2.2],[
  {g:"cyl",s:[.9,1,1,16],p:[0,.5,0],c:HUB_STONE},
  {g:"cyl",s:[1.05,1.05,.1,16],p:[0,1.05,0],c:HUB_TRIM}
],["plinth","pedestal","stand for something"]);

EFFECTS.hubdoor=function(g,spec){
  var pane=null;
  g.traverse(function(m){ if(m.isMesh&&m.geometry&&m.geometry.type==="PlaneGeometry") pane=m; });
  return function(t){ if(pane) pane.material.opacity=.32+.14*Math.sin(t*1.1+(spec.x||0)); };
};
EFFECTS.maptable=function(g){ return function(t){ g.children.forEach(function(m,i){ if(i>3) m.rotation.y=t*.15; }); }; };

/* ---------- what the hall says ---------- */
var HUB_SIGNS=[
  ["Speak it while it is still there","Press the circle and talk, or type. A sentence is enough. The Atlas builds only what you dreamt \u2014 what you left out stays faint."],
  ["Walk it","Press Walk. W A S D, or the pad on a phone. What is solid holds you: decks, stairs, floors, roofs. Doors let you in."],
  ["Change what is wrong","Tap anything to open it. Its colours, its materials, its windows and doors, who lives there \u2014 all of it yours to correct."],
  ["Cross over","Say how you went: \u201cI went down into the underworld\u201d, \u201cI found myself somewhere else\u201d. Or take one of the doors in this hall."],
  ["Nobody reads your dreams","They stay on your device. Keep them to your account and they are locked here first, with a phrase only you know."]
];
/* the doors round the ring: every world the Atlas knows, and your own */
function hubDoorList(){
  var list=[{to:"town",name:"Your own town"}];
  Object.keys(REALMS).forEach(function(k){ if(k!=="somnucor") list.push({to:k,name:REALMS[k].name}); });
  return list;
}
/* the galleries: a little of everything, set out to be looked at */
var HUB_GALLERY=[
  {name:"Dwellings",of:["cottage","house","hanok","yurt","pueblo","toadstoolhouse","habitat","igloo"]},
  {name:"Great places",of:["church","pagoda","mosque","castle","merpalace","icepalace","ziggurat","skyscraper"]},
  {name:"Those you may meet",of:["human","child","fairy","elf","goblin","mermaid","angel","robot"]},
  {name:"Creatures",of:["unicorn","griffin","kitsune","cerberus","spider","octopus","phoenix","dragon"]},
  {name:"The gods, in their own terms",of:["deity","deity","deity","deity"],deities:["hecate","anubis","ganesha","thor","guanyin","odin"]},
  {name:"Workings and arms",of:["fireball","lightningbolt","iceblast","shieldspell","swordlying","bowlying","staffmagic","wand"]},
  {name:"The turning year",of:["yuletree","ostaraeggs","beltanefire","lithawheel","lughcorn","mabontable","samhainlanterns","imbolccandles"]},
  {name:"Ways of travelling",of:["stargate","flyingcarpet","teleportpad","broomstick","shuttle","saucer","soulferry","firechariot"]}
];

function somnucorRealm(){
  var R=realms();
  for(var i=0;i<R.length;i++) if(R[i].kind==="somnucor") return R[i];
  return null;
}
function buildSomnucor(){
  if(somnucorRealm()) return somnucorRealm();
  if(typeof REALMS==="undefined"||!REALMS.somnucor) return null;
  var was=store.here||0, wasGrid=store.grid;
  var r=makeRealm("somnucor");
  store.here=r.id; store.grid=r.grid;
  var h=blockOrigin(r.grid.bx,r.grid.bz);
  function put(arch,x,z,rot,attrs,name){
    var spec={id:uid(),archetype:arch,label:name||null,attrs:attrs||{},x:h.x+x,z:h.z+z,rot:rot||0,
      solid:true,detail:4,nights:[store.session],realm:r.id,hub:true,addr:null,name:name||null,named:name?"stated":null};
    store.objects.push(spec);
    if(typeof addMesh==="function"&&typeof scene!=="undefined"&&scene) addMesh(spec);
    return spec;
  }
  /* the ring of doors, with mirrors between them */
  var doors=hubDoorList(), n=doors.length, R0=30;
  doors.forEach(function(d,i){
    var a=(i/n)*Math.PI*2;
    var x=Math.cos(a)*R0, z=Math.sin(a)*R0;
    var spec=put("hubdoor",x,z,-a+Math.PI/2,{},d.name);
    spec.leadsTo=d.to;
    var am=((i+0.5)/n)*Math.PI*2;
    put("hubmirror",Math.cos(am)*R0,Math.sin(am)*R0,-am+Math.PI/2);
  });
  /* pillars, the map, and the signs */
  for(var p=0;p<8;p++){ var pa=(p/8)*Math.PI*2+0.2; put("hubpillar",Math.cos(pa)*18,Math.sin(pa)*18,0); }
  for(var L=0;L<12;L++){ var la=(L/12)*Math.PI*2; put("streetlight",Math.cos(la)*24,Math.sin(la)*24,-la); }
  for(var L2=0;L2<8;L2++){ var la2=(L2/8)*Math.PI*2+0.4; put("stringlights",Math.cos(la2)*52,Math.sin(la2)*52,-la2+Math.PI/2); }
  put("maptable",0,0,0,{},"The map of everywhere");
  HUB_SIGNS.forEach(function(s,i){
    var a=(i/HUB_SIGNS.length)*Math.PI*2+0.4;
    var spec=put("signboard",Math.cos(a)*12,Math.sin(a)*12,-a+Math.PI/2,{},s[0]);
    spec.sign=s[0]; spec.note=s[1];
  });
  /* the galleries, in rows beyond the ring */
  HUB_GALLERY.forEach(function(row,gi){
    var a=(gi/HUB_GALLERY.length)*Math.PI*2, cx=Math.cos(a)*62, cz=Math.sin(a)*62;
    var sx=Math.cos(a+Math.PI/2), sz=Math.sin(a+Math.PI/2);
    var board=put("signboard",cx-sx*16,cz-sz*16,-a+Math.PI/2,{},row.name);
    board.sign=row.name; board.note="Dream any of these by name, and it will stand in your own town.";
    row.of.forEach(function(arch,k){
      if(!KIT[arch]) return;
      var off=(k-(row.of.length-1)/2)*9;
      var px=cx+sx*off, pz=cz+sz*off;
      put("plinth",px,pz,0);
      /* everything stands on its plinth at a size you can look at */
      var d=KIT[arch], tall=Math.max(d.size[0],d.size[1],d.size[2]);
      var sc=Math.max(0.12,Math.min(1,5.5/tall));
      var spec=put(arch,px,pz+1.6,-a+Math.PI,{s:sc});
      if(row.deities&&row.deities[k]&&typeof makeDeity==="function"){ try{ makeDeity(spec,row.deities[k]); }catch(e){} }
    });
  });
  r.dressed=true;
  store.somnucor=r.id;
  store.here=was; store.grid=wasGrid;
  if(typeof save==="function") save();
  return r;
}
/* walking into a door in the hall */
var hubCool=0;
function hubTick(dt){
  if(hubCool>0) hubCool-=dt;
  if(!walkMode||store.inside||hubCool>0) return;
  var P=camera.position;
  for(var i=0;i<store.objects.length;i++){
    var o=store.objects[i];
    if(o.archetype!=="hubdoor") continue;
    if(!o.leadsTo){
      /* a dreamer's door: walk in, if they opened it */
      if((o.realm||0)!==(store.here||0)) continue;
      if(Math.hypot(o.x-P.x,o.z-P.z)>1.9) continue;
      hubCool=2.5;
      if(typeof walkIntoDoor==="function") walkIntoDoor(o);
      return;
    }
    if((o.realm||0)!==(store.here||0)) continue;
    if(Math.hypot(o.x-P.x,o.z-P.z)>1.9) continue;
    hubCool=2.5;
    if(o.leadsTo==="hall"){ toHall(); if(typeof openHall==="function") openHall(); return; }
    if(o.leadsTo==="somnucor"){
      var c=somnucorRealm()||(typeof buildSomnucorCity==="function"?buildSomnucorCity():null);
      if(c){ beHere(c.id); var cb=blockOrigin(c.grid.bx,c.grid.bz);
        camera.position.set(cb.x,camera.position.y,cb.z+30);
        setStatus("<b>Somnucor.</b> The gate to the hall stands behind you."); }
      return;
    }
    if(o.leadsTo==="town"){
      if(typeof beHere==="function") beHere(0);
      var t=heartOf(0);
      camera.position.set(t.x,camera.position.y,t.z+24);
      setStatus("<b>Your own town.</b> Everything you have dreamt stands here.");
    } else {
      enterRealm(o.leadsTo,false,null,null);
      var rr=realms()[realms().length-1];
      if(typeof beHere==="function") beHere(rr?rr.id:0);
      var hh=heartOf(store.here||0);
      camera.position.set(hh.x,camera.position.y,hh.z+18);
      setStatus("<b>"+esc((REALMS[o.leadsTo]||{}).name||o.leadsTo)+".</b> The way back stands where you came in.");
    }
    if(typeof save==="function") save();
    return;
  }
}
/* the way home to the hall, from anywhere */
function toSomnucor(){
  var r=somnucorRealm()||(typeof buildSomnucorCity==="function"?buildSomnucorCity():buildSomnucor());
  if(!r) return;
  if(typeof beHere==="function") beHere(r.id);
  var h=(typeof ATLC!=="undefined"&&ATLC)?{x:ATLC.x,z:ATLC.z}:heartOf(r.id);
  if(walkMode){ camera.position.set(h.x,1.72,h.z+44); }
  else if(typeof visitRealm==="function") visitRealm(r.id);
  setStatus("<b>Somnucor.</b> Every door here opens on a world. One of them is yours.");
}


/* ---------- the Hall of Doors: a world of its own ---------- */
function hallRealm(){
  var R=realms();
  for(var i=0;i<R.length;i++) if(R[i].kind==="hall") return R[i];
  return null;
}
var HALL_BUILD=2;
function buildHall(){
  var had=hallRealm();
  if(had&&(had.build||0)>=HALL_BUILD) return had;
  if(had){
    for(var i=store.objects.length-1;i>=0;i--){
      var o=store.objects[i];
      if((o.realm||0)!==had.id) continue;
      if(meshes[o.id]){ scene.remove(meshes[o.id]); delete meshes[o.id]; }
      store.objects.splice(i,1);
    }
    var R=realms(), k=R.indexOf(had); if(k>-1) R.splice(k,1);
    if(store.here===had.id) store.here=0;
  }
  if(typeof REALMS==="undefined"||!REALMS.hall) return null;
  var was=store.here||0, wasGrid=store.grid;
  var r=makeRealm("hall");
  store.here=r.id; store.grid=r.grid;
  var h=blockOrigin(r.grid.bx,r.grid.bz);
  function put(arch,x,z,rot,name,attrs){
    if(!KIT[arch]) return null;
    var spec={id:uid(),archetype:arch,label:name||null,attrs:attrs||{},x:h.x+x,z:h.z+z,rot:rot||0,
      solid:true,detail:4,nights:[store.session],realm:r.id,hub:true,peopled:true,
      addr:null,name:name||null,named:name?"stated":null};
    store.objects.push(spec);
    if(typeof addMesh==="function"&&typeof scene!=="undefined"&&scene) addMesh(spec);
    return spec;
  }
  /* the way back to the city stands where you come in */
  var back=put("hubdoor",0,22,Math.PI,"Back to Somnucor");
  if(back) back.leadsTo="somnucor";
  /* the doors to the worlds, ringing the middle */
  var doors=hubDoorList().filter(function(d){ return d.to!=="hall"; }), n=doors.length;
  doors.forEach(function(d,i){
    var a=(i/n)*Math.PI*2;
    var spec=put("hubdoor",Math.cos(a)*34,Math.sin(a)*34,-a+Math.PI/2,d.name);
    if(spec) spec.leadsTo=d.to;
    var am=((i+0.5)/n)*Math.PI*2;
    put("hubmirror",Math.cos(am)*34,Math.sin(am)*34,-am+Math.PI/2);
  });
  for(var p=0;p<12;p++){ var pa=(p/12)*Math.PI*2+0.13; put("hubpillar",Math.cos(pa)*20,Math.sin(pa)*20,0); }
  for(var L=0;L<20;L++){ var la=(L/20)*Math.PI*2; put("streetlight",Math.cos(la)*27,Math.sin(la)*27,-la); }
  put("maptable",0,0,0,"The map of everywhere");
  HUB_SIGNS.forEach(function(s,i){
    var a=(i/HUB_SIGNS.length)*Math.PI*2+0.4;
    var spec=put("signboard",Math.cos(a)*13,Math.sin(a)*13,-a+Math.PI/2,s[0]);
    if(spec){ spec.sign=s[0]; spec.note=s[1]; }
  });
  r.dressed=true; r.build=HALL_BUILD; store.hall=r.id;
  store.here=was; store.grid=wasGrid;
  if(typeof save==="function") save();
  return r;
}
function toHall(){
  var r=hallRealm()||buildHall();
  if(!r) return;
  if(typeof beHere==="function") beHere(r.id);
  var h=blockOrigin(r.grid.bx,r.grid.bz);
  if(walkMode) camera.position.set(h.x,1.72,h.z+16);
  else if(typeof visitRealm==="function") visitRealm(r.id);
  setStatus("<b>The Hall of Doors.</b> Every door here opens on a world, and one of them is yours.");
}

