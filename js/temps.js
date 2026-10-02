/* SomnuMatrix — temps.js
   no post in Somnucor stands empty. Every job nobody has taken yet is
   worked by a stand-in: a citizen of the city who does that job, on site,
   the way a dreamer hired to it would —
     - at the counter, bench or desk: at their post by the workplace door,
       and inside at their station when you go in
     - on the rounds: walking the trade's own round (the lamps, the post,
       the homes, the docks, the gate), stopping to do the work at each
     - at the gathering: in the fields, the orchards, the quarry, the quay
     - in the Wilds: the hunters, out after nightmares
     - the Dragon Corp: on dragons, flying their sectors
   The moment a dreamer takes the post, the stand-in steps aside.
   Every device sees the same stand-ins in the same places: who they are,
   where they go and when all come from the post and the clock.
   loaded as a plain script; shares scope with the other files */
"use strict";

var TEMP_GIVEN_F=["Mara","Isolde","Wren","Elsie","Tamsin","Hester","Ada","Nell","Rosalind","Imogen","Bryony","Clemency","Ottilie","Maud","Agnes","Sabine","Linnet","Delphine","Ione","Perpetua"];
var TEMP_GIVEN_M=["Oswin","Ferrin","Gethin","Alban","Corbin","Jory","Tobias","Silas","Ambrose","Hal","Edric","Lucan","Bram","Ivo","Rafe","Dunstan","Piers","Casimir","Matthias","Anselm"];
var TEMPS={list:[],at:0,busy:false,shown:{},inside:[],clock:0,maxNear:16,maxFly:6};

/* ---- who is needed: every open post, from the job board ---- */
function tempsRefresh(force){
  if(TEMPS.busy) return;
  if(!force&&Date.now()-TEMPS.at<120000&&TEMPS.list.length) return;
  if(!store.workplaceAt||!ATLC) return;
  TEMPS.at=Date.now();
  var signed=typeof signedIn==="function"&&signedIn();
  var src=signed?cityRpc("job_board"):Promise.resolve(null);
  TEMPS.busy=true;
  src.then(function(rows){ TEMPS.busy=false; tempsPlan(rows); }).catch(function(){ TEMPS.busy=false; tempsPlan(null); });
}
function tempsPlan(rows){
  var posts=[];
  if(Array.isArray(rows)&&rows.length){
    rows.forEach(function(r){
      var open=Math.max(0,(+r.positions||0)-(+r.taken||0)); if(!open) return;
      if(!(r.workplace&&store.workplaceAt[r.workplace])&&r.panel!=="police") return;
      for(var k=0;k<open;k++) posts.push({job:r.job_id,title:r.title||"worker",workplace:r.workplace||"The Dragon Roost",panel:r.panel,roams:!!r.roams,k:k});
    });
  } else if(typeof WORKPLACES!=="undefined"){
    /* nobody signed in to ask: one stand-in to every post the city plans */
    WORKPLACES.forEach(function(w){ if(!store.workplaceAt[w.key]) return;
      (w.jobs||[]).forEach(function(j){ posts.push({job:j,title:"worker",workplace:w.key,panel:null,roams:false,k:0}); }); });
  }
  var keep={};
  TEMPS.list=posts.map(function(p,i){
    var id="tw"+p.job+"_"+p.k; keep[id]=1;
    var old=TEMPS.list.filter(function(t){ return t.id===id; })[0];
    return old||tempMake(id,p);
  });
  Object.keys(TEMPS.shown).forEach(function(id){ if(!keep[id]) tempHide(id); });
}
function tempMake(id,p){
  var h=hash(id), f=(h>>>3)%2===0;
  var name=(f?TEMP_GIVEN_F:TEMP_GIVEN_M)[(h>>>5)%20]+" "+SURNAME[(h>>>10)%SURNAME.length];
  var t={id:id,post:p,name:name,f:f,seed:h,mode:"desk",stops:null,home:null};
  var w=store.workplaceAt[p.workplace]; t.home=w?{x:w.x,z:w.z,id:w.id}:{x:ATLC.x,z:ATLC.z};
  var title=p.title, tasks=(typeof JOBWORK_TARGETS!=="undefined"&&JOBWORK_TARGETS[title])||null, node=null;
  if(typeof JOBWORK_NODE!=="undefined") Object.keys(JOBWORK_NODE).forEach(function(k){ if(k.split("|")[0]===title&&!node) node=JOBWORK_NODE[k]; });
  if(p.panel==="police") t.mode="fly";
  else if(p.workplace==="The Hunters' Lodge") t.mode="hunt";
  else if(node) { t.mode="gather"; t.node=node; }
  else if(tasks){ t.mode="round"; t.kinds=[]; Object.keys(tasks).forEach(function(k){ tasks[k].forEach(function(x){ if(t.kinds.indexOf(x)<0) t.kinds.push(x); }); }); }
  else if(p.roams) { t.mode="round"; t.kinds=["streets"]; }
  return t;
}

/* ---- where the work takes them ---- */
function tempDoor(t){
  var sp=t.home&&t.home.id&&specById(t.home.id);
  if(!sp) return {x:t.home.x,z:t.home.z,out:{x:0,z:1}};
  try{ var d=doorWorld(sp); return {x:d.x,z:d.z,out:d.out}; }catch(e){ return {x:sp.x,z:sp.z,out:{x:0,z:1}}; }
}
function tempStops(t){
  if(t.stops) return t.stops;
  var D=tempDoor(t), all=[], H=t.home;
  if(t.mode==="hunt"){
    var a0=Math.atan2(H.z-ATLC.z,H.x-ATLC.x);
    for(var i=0;i<5;i++){ var a=a0+((t.seed>>>(i*3))%9-4)*0.06, r=2240+((t.seed>>>(i*4))%7)*55; all.push({x:ATLC.x+Math.cos(a)*r,z:ATLC.z+Math.sin(a)*r}); }
  } else if(t.mode==="gather"){
    var re=NODE_RE[t.node]||NODE_RE.fields;
    cityObjs().forEach(function(o){ if(re.test(o.archetype)){ var d=Math.hypot(o.x-H.x,o.z-H.z); if(d<380) all.push({x:o.x,z:o.z,d:d}); } });
    all.sort(function(a,b){ return a.d-b.d; }); all=all.slice(0,12);
    var pick=[]; for(var j=0;j<Math.min(3,all.length);j++) pick.push(all[(t.seed>>>(j*5)+t.post.k)%all.length]); all=pick;
  } else if(t.mode==="round"){
    (t.kinds||[]).forEach(function(k){
      if(k==="streets"){ var rs=tempStreetNear(Math.hypot(H.x-ATLC.x,H.z-ATLC.z)), a1=Math.atan2(H.z-ATLC.z,H.x-ATLC.x);
        for(var s=-2;s<=2;s++){ var aa=a1+s*60/rs; all.push({x:ATLC.x+Math.cos(aa)*rs,z:ATLC.z+Math.sin(aa)*rs}); } return; }
      try{ targetsFor(k).forEach(function(o){ var d=Math.hypot(o.x-H.x,o.z-H.z); if(d<450) all.push({x:o.x,z:o.z,d:d}); }); }catch(e){}
    });
    all.sort(function(a,b){ return (a.d||0)-(b.d||0); }); all=all.slice(0,14);
    var n=Math.min(4,all.length), out=[]; for(var q=0;q<n;q++) out.push(all[((t.seed>>>(q*4))+q*3+t.post.k)%all.length]);
    all=out;
  }
  /* the round runs in order round the city, from the door and back to it */
  var ac=function(p){ return Math.atan2(p.z-ATLC.z,p.x-ATLC.x); };
  all.sort(function(a,b){ return ac(a)-ac(b); });
  t.stops=[{x:D.x+D.out.x*2,z:D.z+D.out.z*2,door:1}].concat(all.map(function(p){ return {x:p.x,z:p.z}; }));
  /* the walk between stops keeps to the streets: out to the ring road, along it, and in */
  t.legs=[]; var tot=0;
  for(var i2=0;i2<t.stops.length;i2++){
    var A=t.stops[i2], B=t.stops[(i2+1)%t.stops.length], path=tempPath(A,B), len=0;
    for(var m=1;m<path.length;m++) len+=Math.hypot(path[m].x-path[m-1].x,path[m].z-path[m-1].z);
    var pause=t.mode==="gather"?24:(t.mode==="hunt"?14:9);
    t.legs.push({path:path,len:len,pause:pause,t0:tot}); tot+=len/1.5+pause;
  }
  t.loop=Math.max(30,tot);
  return t.stops;
}
function tempStreetNear(r){
  var best=null; Object.keys(ATL_STREETS).forEach(function(k){ ATL_STREETS[k].forEach(function(rs){ if(best===null||Math.abs(rs-r)<Math.abs(best-r)) best=rs; }); });
  if(r>2160) return r; return best||r;
}
function tempPath(A,B){
  var rA=Math.hypot(A.x-ATLC.x,A.z-ATLC.z), rB=Math.hypot(B.x-ATLC.x,B.z-ATLC.z);
  var aA=Math.atan2(A.z-ATLC.z,A.x-ATLC.x), aB=Math.atan2(B.z-ATLC.z,B.x-ATLC.x);
  var rs=tempStreetNear(rA), pts=[{x:A.x,z:A.z}];
  if(Math.hypot(A.x-B.x,A.z-B.z)<40) return pts.concat([{x:B.x,z:B.z}]);
  var da=Math.atan2(Math.sin(aB-aA),Math.cos(aB-aA)), n=Math.max(1,Math.ceil(Math.abs(da)*rs/25));
  for(var i=0;i<=n;i++){ var a=aA+da*i/n; pts.push({x:ATLC.x+Math.cos(a)*rs,z:ATLC.z+Math.sin(a)*rs}); }
  var rs2=tempStreetNear(rB);
  if(rs2!==rs){ pts.push({x:ATLC.x+Math.cos(aB)*rs2,z:ATLC.z+Math.sin(aB)*rs2}); }
  pts.push({x:B.x,z:B.z});
  return pts;
}
/* where a stand-in is at time T, and whether they are walking or working */
function tempAt(t,T){
  if(t.mode==="desk"){
    var D=tempDoor(t), side=(t.post.k%2?1:-1)*(1.8+Math.floor(t.post.k/2)*1.1)+((t.seed>>>7)%3-1)*0.4;
    var sx=D.out.z, sz=-D.out.x;
    return {x:D.x+D.out.x*2.4+sx*side,z:D.z+D.out.z*2.4+sz*side,face:Math.atan2(D.out.x,D.out.z),walk:false};
  }
  if(t.mode==="fly"){
    var r=320+(t.seed%1200), a=(t.seed%628)/100+T*(0.012+((t.seed>>>8)%5)*0.002)*(t.seed%2?1:-1);
    var x=ATLC.x+Math.cos(a)*r, z=ATLC.z+Math.sin(a)*r, dir=t.seed%2?1:-1;
    return {x:x,z:z,y:terrainY(x,z)+55+(t.seed>>>4)%40,face:Math.atan2(-Math.sin(a)*dir,Math.cos(a)*dir),fly:true};
  }
  tempStops(t);
  var u=((T+(t.seed%997))%t.loop+t.loop)%t.loop, L=t.legs[0];
  for(var i=0;i<t.legs.length;i++) if(t.legs[i].t0<=u) L=t.legs[i];
  var into=u-L.t0, p0=L.path[0], p1=L.path[1]||p0;
  if(into<L.pause) return {x:p0.x,z:p0.z,face:Math.atan2(p1.x-p0.x,p1.z-p0.z),walk:false,work:true};
  var d=(into-L.pause)*1.5;
  for(var m=1;m<L.path.length;m++){
    var a1=L.path[m-1], b1=L.path[m], sl=Math.hypot(b1.x-a1.x,b1.z-a1.z);
    if(d<=sl||m===L.path.length-1){ var k=sl?Math.min(1,d/sl):1; return {x:a1.x+(b1.x-a1.x)*k,z:a1.z+(b1.z-a1.z)*k,face:Math.atan2(b1.x-a1.x,b1.z-a1.z),walk:k<1}; }
    d-=sl;
  }
  return {x:p0.x,z:p0.z,face:0,walk:false};
}

/* ---- drawing them: only the nearest, and only while near ---- */
function tempLook(t){
  var L=randomLook(t.id,"human"); L.sex=t.f?"f":"m";
  if(typeof csLookFill==="function") csLookFill(L,t.id);
  var ti=String(t.post.title).toLowerCase();
  if(/baker|cook|chef|brewer|butcher|apothecary/.test(ti)){ L.gear="none"; L.top=0xF2EEE6; }
  if(/smith|miner|quarry|charcoal|carpenter|mason/.test(ti)){ L.gear="vestbelt"; L.gearColor=0x5A3A22; }
  if(/farm|shepherd|dairy|forester|garden|harvest/.test(ti)){ L.gear="belt"; L.hat=L.hat||"brimmed"; }
  if(/hunter/.test(ti)){ L.gear="cloak"; L.gearColor=0x2E3A2A; }
  if(t.mode==="fly"){ L.top=0x23324E; L.bottom=0x1E2638; L.gear="cloak"; L.gearColor=0x23324E; }
  return L;
}
function tempShow(t){
  var spec={id:"__tw_"+t.id,archetype:"human",attrs:{},look:tempLook(t),solid:false,detail:3,nights:[],city:true};
  var g=buildFigure(spec,1), fig=g;
  if(t.mode==="fly"&&typeof buildMountDragon==="function"){
    var dg=buildMountDragon(DRAGON_COLS[t.seed%DRAGON_COLS.length],{lod:true}); dg.userData.pose="fly";
    g.position.y=DRAGON_SADDLE-DRAGON_HIP; if(typeof riderPose==="function") riderPose(g);
    var root=new THREE.Group(); root.add(dg); root.add(g); root.userData.limbs=g.userData.limbs; root.userData.mount=dg; fig=root;
  }
  if(t.mode==="hunt"&&typeof HELD!=="undefined"&&HELD.spear){ try{ var it=HELD.spear(); it.position.set(-0.26,0.96,0.27); g.children[0].add(it); }catch(e){} }
  var tag=makeTag(t.name+" · "+t.post.title,false); tag.position.y=t.mode==="fly"?4.6:2.15; tag.visible=false; fig.add(tag); fig.userData.tag=tag;
  fig.traverse(function(m){ m.raycast=function(){}; });
  scene.add(fig);
  TEMPS.shown[t.id]={g:fig,t:t,phase:(t.seed%100)/10};
}
function tempHide(id){
  var S=TEMPS.shown[id]; if(!S) return;
  if(S.g.userData.tag) dropTag(S.g.userData.tag);
  scene.remove(S.g); delete TEMPS.shown[id];
}
function tempsTick(dt){
  var r=(typeof somnucorRealm==="function")?somnucorRealm():null;
  var here=r&&(store.here||0)===r.id&&!store.inside;
  if(!here||!ATLC){ Object.keys(TEMPS.shown).forEach(tempHide); return; }
  tempsRefresh(false);
  TEMPS.clock+=dt;
  var T=Date.now()/1000, P=camera.position;
  /* who is near enough to draw, nearest first */
  if(!TEMPS.pickAt||TEMPS.clock-TEMPS.pickAt>1){
    TEMPS.pickAt=TEMPS.clock;
    var walkers=[], flyers=[];
    TEMPS.list.forEach(function(t){
      var at=tempAt(t,T), d=Math.hypot(at.x-P.x,at.z-P.z);
      if(t.mode==="fly"){ if(d<1300) flyers.push({t:t,d:d}); } else if(d<150) walkers.push({t:t,d:d});
    });
    walkers.sort(function(a,b){ return a.d-b.d; }); flyers.sort(function(a,b){ return a.d-b.d; });
    var want={};
    walkers.slice(0,TEMPS.maxNear).concat(flyers.slice(0,TEMPS.maxFly)).forEach(function(w){ want[w.t.id]=1; if(!TEMPS.shown[w.t.id]) tempShow(w.t); });
    Object.keys(TEMPS.shown).forEach(function(id){ if(!want[id]) tempHide(id); });
  }
  Object.keys(TEMPS.shown).forEach(function(id){
    var S=TEMPS.shown[id], t=S.t, g=S.g, at=tempAt(t,T);
    var y=at.y!==undefined?at.y:terrainY(at.x,at.z);
    g.position.set(at.x,y,at.z);
    var dr=((at.face-g.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI; g.rotation.y+=dr*Math.min(1,dt*6);
    var lm=g.userData.limbs;
    S.phase+=dt*(at.walk?7:2.4);
    if(at.fly){ var m=g.userData.mount; if(m&&m.userData.anim) m.userData.anim(T,dt); }
    else if(lm){
      var s=at.walk?Math.sin(S.phase)*0.5:0;
      lm.ll.rotation.x=s; lm.rl.rotation.x=-s;
      if(at.walk){ lm.la.rotation.x=-s*0.75; lm.ra.rotation.x=s*0.75; }
      else { var w=Math.sin(S.phase)*0.35; lm.la.rotation.x=-0.7+w; lm.ra.rotation.x=-0.55-w; }
    }
    if(g.userData.tag) g.userData.tag.visible=Math.hypot(at.x-P.x,at.z-P.z)<(at.fly?120:22);
  });
}

/* ---- inside: the stand-ins at their stations ---- */
(function(){
  if(typeof bringOccupants!=="function") return;
  var bo=bringOccupants;
  bringOccupants=function(){
    bo.apply(this,arguments);
    try{ tempsInside(); }catch(e){ if(window.console) console.warn("temps inside:",e); }
  };
})();
function tempsInside(){
  if(!INT||!INT.spec) return;
  var key=INT.spec.workplace||INT.wpKey; if(!key) return;
  var mine=TEMPS.list.filter(function(t){ return t.post.workplace===key&&t.mode!=="fly"; }).slice(0,8);
  var spots=(INT.spots||[]).filter(function(s){ return !(s.level>0); });
  mine.forEach(function(t,i){
    var sp=spots.length?spots[(i+1)%spots.length]:{x:0,z:0}, lap=spots.length?Math.floor((i+1)/spots.length):i;
    var g=buildFigure({id:"__twin_"+t.id,archetype:"human",attrs:{},look:tempLook(t),solid:false,detail:3,nights:[],city:true},1);
    var x=sp.x+(lap%2?1.1:-1.1)*Math.ceil(lap/2), z=sp.z-0.8;
    g.position.set(x,0,z); g.rotation.y=Math.PI+((t.seed%7)-3)*0.3;
    var lm=g.userData.limbs; if(lm){ lm.la.rotation.x=-0.7; lm.ra.rotation.x=-0.5; }
    var tag=makeTag(t.name+" · "+t.post.title,false); tag.position.y=2.15; g.add(tag);
    g.traverse(function(m){ m.raycast=function(){}; });
    INT.root.add(g);
  });
}

/* every frame, with the city */
(function(){
  if(typeof transitTick!=="function") return;
  var tt=transitTick;
  transitTick=function(dt){ tt(dt); try{ tempsTick(dt); }catch(e){ if(window.console) console.warn("temps:",e); } };
})();
