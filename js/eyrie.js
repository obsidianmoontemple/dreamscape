/* SomnuMatrix — eyrie.js
   the Dragon Corp's dragons, and where they live.
     - a riding dragon, built to be ridden: a saddle at its shoulders, wings
       that beat in flight and fold at rest, legs that tuck up when it flies,
       a tail that curls round when it perches — in its rider's own colour
     - the Eyrie, beside the Dragon Roost: every officer of the Corp has an
       apartment there, with an open balcony where their own dragon perches
     - from the apartment, out onto the balcony and up into the saddle; fly
       home and land on the balcony to go back in
     - everyone else in the city sees the dragons on the balconies, and the
       riders on their dragons in the sky
   loaded as a plain script; shares scope with the other files */
"use strict";

var DRAGON_COL={green:0x3F7A3A,red:0xA8322B,black:0x2A2A30,gold:0xC9A040,blue:0x2F5E9E,purple:0x5E3A7E,
  white:0xE8E4DA,silver:0xB8BCC4,bronze:0x9A6A3A,teal:0x2A7A7A,grey:0x6A6E76,orange:0xC8662A};
var DRAGON_COLS=Object.keys(DRAGON_COL);
var DRAGON_SADDLE=2.52;          /* the top of the saddle, above the ground the dragon stands on */
var DRAGON_HIP=0.95;             /* how high a rider's hips sit above their feet */
function dragonHex(c){ if(typeof c==="number") return c; return DRAGON_COL[c]||0x3F7A3A; }

/* ================================================================ the riding dragon */
/* built about the ground under its saddle, its head toward +z.
   o.lod: fewer small pieces (claws, belly plates, spines) for far-off dragons */
function buildMountDragon(col,o){
  o=o||{}; var c=dragonHex(col), lod=!!o.lod;
  function M(h,ds){ var m=new THREE.MeshLambertMaterial({color:h}); if(ds) m.side=THREE.DoubleSide; return m; }
  var skin=M(c), belly=M(blend(c,0xE8D8B0,0.45)), dark=M(shade(c,-0.45)), horn=M(0xE8DCC0), claw=M(0x2A2420),
      wingM=M(shade(c,-0.22),true), eyeM=new THREE.MeshBasicMaterial({color:0xFFC23A}), pupil=new THREE.MeshBasicMaterial({color:0x140C08}),
      leather=M(0x5A3A22), blanket=M(0x23324E,true), gold=M(0xC9A868,true);
  function mesh(geo,mat,x,y,z,rx,ry,rz){ var m=new THREE.Mesh(geo,mat); m.position.set(x||0,y||0,z||0); if(rx||ry||rz) m.rotation.set(rx||0,ry||0,rz||0); return m; }
  var g=new THREE.Group(), body=new THREE.Group(); g.add(body);
  g.userData.mount=1; g.userData.col=col;

  /* the body: chest to hips, close-set, with a pale belly and a ridge of spines */
  var R=[0.66,0.78,0.86,0.9,0.9,0.88,0.84,0.78,0.7,0.62], BY=1.6;
  R.forEach(function(r,i){
    var z=1.5-i*0.36;
    var s=mesh(new THREE.SphereGeometry(r,22,16),skin,0,BY,z); s.scale.set(1,0.92,1.2); body.add(s);
    if(!lod){ var b=mesh(new THREE.SphereGeometry(r*0.85,16,10),belly,0,BY-r*0.3,z); b.scale.set(0.9,0.45,1.1); body.add(b); }
    if(!lod&&i%2===0) body.add(mesh(new THREE.ConeGeometry(0.11,0.42,10),dark,0,BY+r*0.86,z-0.05,-0.35));
  });

  /* the neck rises from the chest to the head; it bobs as one */
  var neck=new THREE.Group(); neck.position.set(0,BY+0.25,1.55); body.add(neck);
  for(var n=0;n<6;n++){
    var t=(n+0.5)/6, r=0.58-t*0.22;
    var qy=(1-t)*(1-t)*0+2*(1-t)*t*1.05+t*t*1.4, qz=(1-t)*(1-t)*0+2*(1-t)*t*0.45+t*t*2.0;
    neck.add(mesh(new THREE.SphereGeometry(r,20,14),skin,0,qy,qz));
    if(!lod&&n%2===1) neck.add(mesh(new THREE.ConeGeometry(0.08,0.3,8),dark,0,qy+r*0.9,qz-0.05,-0.5));
  }
  var head=new THREE.Group(); head.position.set(0,1.5,2.15); neck.add(head);
  var cr=mesh(new THREE.SphereGeometry(0.42,24,16),skin,0,0,0); cr.scale.set(1,0.82,1.1); head.add(cr);
  var sn=mesh(new THREE.SphereGeometry(0.3,20,14),skin,0,-0.1,0.55); sn.scale.set(0.95,0.7,1.75); head.add(sn);
  var jw=mesh(new THREE.SphereGeometry(0.26,18,10),belly,0,-0.27,0.42); jw.scale.set(0.9,0.45,1.6); head.add(jw);
  [-1,1].forEach(function(sd){
    head.add(mesh(new THREE.BoxGeometry(0.16,0.07,0.32),dark,sd*0.2,0.2,0.22,0,sd*0.3,0));
    var e=mesh(new THREE.SphereGeometry(0.075,14,10),eyeM,sd*0.245,0.08,0.3); head.add(e);
    var pp=mesh(new THREE.BoxGeometry(0.018,0.1,0.02),pupil,sd*0.31,0.08,0.33); pp.rotation.y=sd*0.6; head.add(pp);
    head.add(mesh(new THREE.SphereGeometry(0.035,8,6),pupil,sd*0.09,-0.02,1.02));
    head.add(mesh(new THREE.ConeGeometry(0.09,0.9,14),horn,sd*0.22,0.3,-0.32,-2.05,0,sd*0.22));
    head.add(mesh(new THREE.ConeGeometry(0.05,0.42,10),horn,sd*0.34,0.05,-0.15,-1.95,0,sd*0.65));
    if(!lod) for(var q=0;q<3;q++) head.add(mesh(new THREE.ConeGeometry(0.035,0.12,8),horn,sd*(0.07+q*0.06),-0.19,0.9-q*0.13,Math.PI));
  });
  if(!lod) for(var cq=0;cq<3;cq++) head.add(mesh(new THREE.ConeGeometry(0.07,0.32,8),dark,0,0.22-cq*0.12,-0.42-cq*0.08,-1.9));

  /* the tail: a chain of joints, so it can sway, droop and curl */
  var tail=[], parent=body, TN=14;
  var tj=new THREE.Group(); tj.position.set(0,BY,-1.85); body.add(tj); parent=tj;
  for(var k=0;k<TN;k++){
    var rr=0.56*Math.pow(1-k/TN,0.9)+0.06;
    var j=k?new THREE.Group():tj; if(k){ j.position.set(0,0,-0.42); parent.add(j); }
    var seg=mesh(new THREE.SphereGeometry(rr,18,12),skin,0,0,-0.21); seg.scale.set(1,0.9,1.35); j.add(seg);
    if(!lod&&k%2===0) j.add(mesh(new THREE.ConeGeometry(Math.max(0.04,rr*0.25),rr*0.7,8),dark,0,rr*0.85,-0.21,-0.35));
    tail.push(j); parent=j;
  }
  var spade=mesh(new THREE.ConeGeometry(0.22,0.5,4),dark,0,0,-0.55,-Math.PI/2); spade.scale.set(1,1,0.25); parent.add(spade);

  /* four legs, each a shoulder or haunch, an upper and a lower leg, and a clawed foot */
  var legs=[];
  [[0.62,1.05,0],[-0.62,1.05,0],[0.7,-1.35,1],[-0.7,-1.35,1]].forEach(function(L,i){
    var pv=new THREE.Group(); pv.position.set(L[0]*1.08,BY-0.3,L[1]); body.add(pv);
    pv.add(mesh(new THREE.SphereGeometry(L[2]?0.44:0.36,18,12),skin,0,0.05,0));
    pv.add(mesh(new THREE.CylinderGeometry(0.26,0.19,0.72,16),skin,0,-0.36,0));
    var kn=new THREE.Group(); kn.position.y=-0.72; pv.add(kn);
    kn.add(mesh(new THREE.CylinderGeometry(0.18,0.14,0.55,14),skin,0,-0.27,0));
    var ft=mesh(new THREE.SphereGeometry(0.19,14,10),skin,0,-0.5,0.08); ft.scale.set(1.1,0.5,1.5); kn.add(ft);
    if(!lod) for(var cl=-1;cl<=1;cl++) kn.add(mesh(new THREE.ConeGeometry(0.045,0.2,8),claw,cl*0.09,-0.54,0.36,Math.PI/2));
    legs.push({pv:pv,kn:kn,hind:!!L[2],ph:i===0||i===3?0:Math.PI});
  });

  /* wings: a membrane between finger bones, scalloped at the trailing edge */
  var shp=new THREE.Shape(), K=0.5;
  shp.moveTo(0,0); shp.lineTo(3*K,4.5*K); shp.lineTo(11*K,3.2*K);
  shp.quadraticCurveTo(9.5*K,1.2*K,9*K,-0.6*K); shp.quadraticCurveTo(7*K,0.4*K,6*K,-1.4*K);
  shp.quadraticCurveTo(4*K,-0.2*K,2.8*K,-1.8*K); shp.quadraticCurveTo(1.5*K,-0.6*K,0,-1.2*K); shp.lineTo(0,0);
  var wgeo=new THREE.ShapeGeometry(shp,8), wings=[];
  [-1,1].forEach(function(sd){
    var w=new THREE.Group(); w.position.set(sd*0.55,BY+0.6,0.55); body.add(w);
    var mem=new THREE.Mesh(wgeo,wingM); mem.rotation.x=Math.PI/2; mem.scale.set(sd,1,1); w.add(mem);
    [[3,4.5,0.09],[11,3.2,0.07],[9,-0.6,0.05],[6,-1.4,0.05],[2.8,-1.8,0.05]].forEach(function(pt,bi){
      var x=pt[0]*K, y=pt[1]*K, len=Math.sqrt(x*x+y*y);
      var bone=new THREE.Mesh(new THREE.CylinderGeometry(pt[2]*0.7,pt[2],len,8),dark);
      bone.position.set(x/2,y/2,0.02); bone.rotation.z=Math.atan2(y,x)-Math.PI/2;
      if(bi===1){ bone.position.set((3*K+x)/2,(4.5*K+y)/2,0.02); var dx=x-3*K, dy=y-4.5*K; bone.scale.y=Math.sqrt(dx*dx+dy*dy)/len; bone.rotation.z=Math.atan2(dy,dx)-Math.PI/2; }
      mem.add(bone);
    });
    wings.push({g:w,mem:mem,sd:sd});
  });

  /* the Corp's saddle: a blue blanket trimmed in gold, a leather seat, stirrups */
  var drape=mesh(new THREE.CylinderGeometry(0.94,0.94,1.5,24,1,true,Math.PI-1.15,2.3),blanket,0,BY,0.1,Math.PI/2); drape.scale.set(1,1,0.97); body.add(drape);
  [-0.74,0.74].forEach(function(zz){ var tr=mesh(new THREE.CylinderGeometry(0.955,0.955,0.07,24,1,true,Math.PI-1.16,2.32),gold,0,BY,0.1+zz,Math.PI/2); body.add(tr); });
  [-1,1].forEach(function(sd){
    body.add(mesh(new THREE.CylinderGeometry(0.17,0.17,0.02,20),gold,sd*0.86,BY-0.42,0.1,0,0,Math.PI/2+sd*0.42));
    var strap=mesh(new THREE.BoxGeometry(0.04,0.78,0.06),leather,sd*0.82,BY+0.2,0.05,0,0,sd*0.18); body.add(strap);
    var st=mesh(new THREE.TorusGeometry(0.08,0.016,8,16),M(0x8A8C92),sd*0.9,BY-0.24,0.05); body.add(st);
  });
  body.add(mesh(new THREE.BoxGeometry(0.62,0.16,0.9),leather,0,DRAGON_SADDLE-0.08,0.05));
  body.add(mesh(new THREE.BoxGeometry(0.6,0.34,0.12),leather,0,DRAGON_SADDLE+0.05,-0.4));
  body.add(mesh(new THREE.CylinderGeometry(0.06,0.08,0.32,10),leather,0,DRAGON_SADDLE+0.06,0.46));
  body.add(mesh(new THREE.SphereGeometry(0.07,10,8),gold,0,DRAGON_SADDLE+0.24,0.46));

  /* how it holds itself: blended toward whatever it is doing now */
  var S={fly:0,walk:0,curl:0,t0:hashSeed(col)};
  g.userData.pose="stand"; g.userData.speed=0;
  function lerp(a,b,k){ return a+(b-a)*k; }
  g.userData.anim=function(t,dt){
    var p=g.userData.pose, k=Math.min(1,(dt||0.033)*3.5);
    S.fly+=((p==="fly"?1:0)-S.fly)*k; S.curl+=((p==="perch"?1:0)-S.curl)*k;
    S.walk+=((p==="walk"?1:0)-S.walk)*k;
    var tt=t+S.t0, F=S.fly;
    /* wings: beating in flight, folded up and back at rest */
    var beat=Math.sin(tt*2.6);
    wings.forEach(function(w){
      /* folded: laid back along the flanks, the tips over the haunches */
      w.g.rotation.z=w.sd*lerp(0.55,0.12+beat*0.62,F);
      w.g.rotation.y=w.sd*lerp(1.2,0,F);
      w.g.rotation.x=lerp(-0.15,0,F);
      w.mem.scale.x=w.sd*lerp(0.62,1,F);
    });
    body.position.y=F*(-beat*0.12);
    neck.rotation.x=Math.sin(tt*0.9)*0.05+F*0.18-S.curl*0.08;
    head.rotation.x=-F*0.14+S.curl*0.1;
    head.rotation.y=S.curl*Math.sin(tt*0.25)*0.35;
    /* legs: down and walking on the ground, tucked up in the air */
    var sw=S.walk*Math.sin(tt*6.5)*0.42;
    legs.forEach(function(L,i){
      var walkA=(i%2===0?1:-1)*(L.hind?-1:1)*sw;
      L.pv.rotation.x=lerp(walkA,L.hind?1.25:0.95,F);
      L.kn.rotation.x=lerp(Math.max(0,-walkA)*0.6,L.hind?0.35:-1.35,F);
    });
    /* the tail: straight out behind in flight, down to the ground standing, curled round perching */
    tail.forEach(function(j,i){
      var sway=Math.sin(tt*1.3-i*0.45)*(0.04+F*0.04);
      var droopStand=i<4?0.08:-0.03, droopFly=i<3?0.02:-0.01, droopPerch=i<4?0.1:-0.03;
      j.rotation.x=lerp(lerp(droopStand,droopPerch,S.curl),droopFly,F);
      j.rotation.y=sway+S.curl*0.26;
    });
  };
  g.userData.anim(0,1); g.userData.anim(0,1);
  return g;
}
function hashSeed(x){ return (typeof hash==="function"?hash(String(x)):7)%100/10; }

/* ================================================================ riding it */
RIDE_SEAT.dragon=DRAGON_SADDLE-DRAGON_HIP;
function myDragon(){ var d=(CORP.data&&CORP.data.dragon)||{}; return {name:d.name||"your dragon",color:d.color||"green"}; }
function speciesScale(L){ var sp=L&&L.species&&SPECIES_FEATS[L.species]; return (sp&&sp.s)||1; }
/* a rider sits astride: legs out round the dragon's sides, hips in the saddle */
function riderPose(fig){
  var lm=fig&&fig.userData&&fig.userData.limbs; if(!lm) return;
  [lm.ll,lm.rl].forEach(function(l){ if(!l) return; l.rotation.z=(l.position.x>0?1:-1)*0.62; l.rotation.x=-0.35; });
}
var EY={list:[],at:0,perched:{},guide:null,panelAt:0,mountedPrev:false,landCool:0,last:null,away:true};

(function(){
  /* the mount, drawn as the riding dragon in the rider's colour */
  var rt=rideTick;
  rideTick=function(dt){
    if(rideArch!=="dragon") return rt(dt);
    var show=walkMode&&!store.inside;
    if(!show){ if(rideG) rideG.visible=false; return; }
    var col=myDragon().color;
    if(rideG&&rideG.userData.col!==col){ scene.remove(rideG); rideG=null; }
    if(!rideG){ rideG=buildMountDragon(col); rideG.traverse(function(m){ m.raycast=function(){}; }); scene.add(rideG); }
    var P=camera.position, seat=rideSeatNow(), base=P.y-1.72-seat;
    rideG.visible=true;
    rideG.position.set(P.x,base,P.z);
    rideG.rotation.y=yaw+Math.PI;
    var gy=(typeof supportAt==="function")?supportAt(P.x,P.z,base):terrainY(P.x,P.z);
    var moved=EY.last?Math.hypot(P.x-EY.last.x,P.z-EY.last.z):0; EY.last={x:P.x,z:P.z};
    rideG.userData.pose=base-gy>0.6?"fly":(moved>0.02?"walk":"stand");
    rideG.userData.anim(performance.now()/1000,dt);
  };
  /* your own figure, seen from behind, sits in the saddle */
  if(typeof avatarTick==="function"){
    var at=avatarTick;
    avatarTick=function(dt){
      at(dt);
      if(rideArch==="dragon"&&meG&&walkMode&&!store.inside){
        meG.position.y+=DRAGON_HIP*(1-speciesScale(meLook()));
        riderPose(meG);
      }
    };
  }
  /* stepping out of walking and back in keeps you in the saddle, and in the air */
  if(typeof setWalk==="function"){
    var sw=setWalk;
    setWalk=function(on){ var r=sw.apply(this,arguments); if(rideArch&&RIDE_FLIES[rideArch]&&typeof canFly!=="undefined") canFly=true; return r; };
  }
  /* getting off: you keep flying only if you could fly before */
  var rd=ride;
  ride=function(name){
    var was=rideArch;
    rd(name);
    if(!rideArch&&was&&RIDE_FLIES[was]&&typeof canFly!=="undefined")
      canFly=hasAbility("flying")||hasAbility("floating")||(typeof magicGranted!=="undefined"&&!!magicGranted);
  };
})();

/* the Corp mount: your own dragon, by name */
(function(){
  corpMount=function(on){
    if(on){
      var d=myDragon();
      riding=d.name; rideSpeed=4; rideArch="dragon"; if(typeof canFly!=="undefined") canFly=true;
      if(rideG){ scene.remove(rideG); rideG=null; }
      var L=meLook(); L.ride="dragon"; L.rideColor=d.color; L.rideName=d.name;
      if(typeof publishMyLook==="function") publishMyLook();
      CORP.mounted=true;
      setStatus("<b>Up on "+esc(d.name)+".</b> Space to climb, C to come down. Fly home to your balcony at the Eyrie and land to go in.");
    } else {
      if(typeof ride==="function") ride(null); CORP.mounted=false;
      var L2=meLook(); delete L2.rideColor; delete L2.rideName;
      if(typeof publishMyLook==="function") publishMyLook();
    }
  };
})();

/* other dreamers: facing the way they go, their size their own, astride their dragons */
(function(){
  if(typeof presenceGroupFor!=="function") return;
  var pg=presenceGroupFor;
  presenceGroupFor=function(row){
    var g=pg(row), body=g.children[0], L=(row&&row.look)||{}, s=speciesScale(L);
    /* a presence group turns with its dreamer's view, and the view looks down -z;
       the figure is built facing +z, so it turns round to face where they look */
    if(body&&body.isGroup!==false&&body!==g.userData.tag&&body!==g.userData.mount){ body.rotation.order="YXZ"; body.rotation.y+=Math.PI; }
    if(g.userData.tag&&s!==1) g.userData.tag.position.y-=2.02*(1-s);
    if(L.ride==="dragon"&&g.userData.mount) riderPose(g);
    return g;
  };
})();

/* ================================================================ the Eyrie */
/* a tower of the Corp's own stone. Seven floors of apartments over a lobby;
   on each floor, one apartment to each face, every one with a broad open
   ledge for its dragon — staggered left and right, floor by floor, so a
   dragon on one ledge has the open sky above it */
var EYRIE_CORE=24, EYRIE_FLOORS=7, EYRIE_LEDGE={w:8,d:7};
function eyrieLedgeTop(f){ return 5*f+1; }
function eyrieSlot(n){ var i=n-1; var f=1+Math.floor(i/4); return {n:n,f:f,side:i%4,u:(f%2===1)?-6:6,y:eyrieLedgeTop(f)}; }
/* a point on a face: u along it, v out from it */
function eyrieLocal(side,u,v){
  var h=EYRIE_CORE/2+v;
  if(side===0) return {x:u,z:h,ox:0,oz:1};
  if(side===1) return {x:h,z:-u,ox:1,oz:0};
  if(side===2) return {x:-u,z:-h,ox:0,oz:-1};
  return {x:-h,z:u,ox:-1,oz:0};
}
(function(){
  var parts=[
    {g:"box",s:[EYRIE_CORE,42,EYRIE_CORE],p:[0,21,0],c:"body"},
    {g:"box",s:[EYRIE_CORE+1.2,0.6,EYRIE_CORE+1.2],p:[0,0.3,0],c:"trim"},
    {g:"box",s:[EYRIE_CORE+1.4,1.2,EYRIE_CORE+1.4],p:[0,42.6,0],c:"trim"},
    {g:"box",s:[EYRIE_CORE+1.4,0.5,EYRIE_CORE+1.4],p:[0,5.75,0],c:"trim"},
    {g:"cone",s:[17.6,11,4],p:[0,48.7,0],r:[0,Math.PI/4,0],c:"roof"},
    {g:"cyl",s:[0.45,0.6,6,10],p:[0,57,0],c:0x2A2E38},
    {g:"sph",s:[1.1],p:[0,60.3,0],c:0xFFB45A,glow:1,pulse:1},
    {g:"box",s:[3.2,3.8,0.5],p:[0,1.9,EYRIE_CORE/2+0.2],c:"dark"},
    {g:"box",s:[4.6,0.5,0.8],p:[0,4.05,EYRIE_CORE/2+0.35],c:"trim"}
  ];
  /* a column of tall windows up the middle of every face, between the ledges */
  [0,1,2,3].forEach(function(side){
    var a=eyrieLocal(side,0,0.06), along=side%2===0;
    parts.push({g:"box",s:along?[1.4,3,0.2]:[0.2,3,1.4],p:[a.x,eyrieLedgeTop(1)+2,a.z],c:0x3A4654,rep:[7,0,5,0]});
  });
  /* the ledges: odd floors to one side of each face, even floors to the other */
  [[1,4],[2,3]].forEach(function(fr){
    var f0=fr[0], n=fr[1], u=(f0%2===1)?-6:6, y=eyrieLedgeTop(f0);
    [0,1,2,3].forEach(function(side){
      var along=side%2===0;
      function sz(a,o,h){ return along?[a,h,o]:[o,h,a]; }
      function at(uu,v,yy){ var L=eyrieLocal(side,uu,v); return [L.x,yy,L.z]; }
      var rep=[n,0,10,0];
      parts.push({g:"box",s:sz(EYRIE_LEDGE.w,EYRIE_LEDGE.d,0.6),p:at(u,EYRIE_LEDGE.d/2,y-0.3),c:"trim",rep:rep});
      [-1,1].forEach(function(sd){
        parts.push({g:"box",s:sz(0.9,5,1.6),p:at(u+sd*3,2.5,y-1.4),c:"trim",rep:rep});
        parts.push({g:"box",s:sz(0.3,EYRIE_LEDGE.d,1.1),p:at(u+sd*3.85,EYRIE_LEDGE.d/2,y+0.55),c:"body",rep:rep});
      });
      parts.push({g:"box",s:sz(3.4,0.25,3.6),p:at(u,0.12,y+1.8),c:0xFFC878,glow:1,rep:rep});
      parts.push({g:"box",s:sz(4.2,0.3,0.6),p:at(u,0.3,y+3.75),c:"trim",rep:rep});
      parts.push({g:"sph",s:[0.24],p:at(u+3.85,EYRIE_LEDGE.d-0.3,y+1.35),c:0xFFB45A,glow:1,rep:rep});
      parts.push({g:"sph",s:[0.24],p:at(u-3.85,EYRIE_LEDGE.d-0.3,y+1.35),c:0xFFB45A,glow:1,rep:rep});
    });
  });
  A("eyrie","structure",[EYRIE_CORE,44,EYRIE_CORE],parts,{sign:[0,4.95,EYRIE_CORE/2+0.8,4.4,1.3]});
  if(typeof MORE_VOCAB!=="undefined") MORE_VOCAB.eyrie=["eyrie","dragon eyrie"];
  if(typeof PLANS!=="undefined") PLANS.eyrie={mode:"mixed",ground:"lobby",w:20,d:20,upper:["living","bedroom","kitchen","bathroom"],wall:0xC8CCD4,floor:"wood",lift:true};
  if(typeof STOREYS!=="undefined") STOREYS.eyrie=EYRIE_FLOORS+1;
})();

/* laid with the city, behind the Roost, under its own run of names */
(function(){
  if(typeof atlTransit!=="function") return;
  var tr=atlTransit;
  atlTransit=function(C){
    tr(C);
    var keepSeq=C.seq, keepPre=C.pre; C.pre="se"; C.seq=0;
    try{ atlEyrie(C); }catch(e){ if(window.console) console.warn("eyrie:",e); } finally { C.pre=keepPre; C.seq=keepSeq; }
  };
})();
function atlEyrie(C){
  var w=C.workplaces["The Dragon Roost"]; if(!w) return;
  var roost=store.objects.filter(function(o){ return o.id===w.id; })[0]; if(!roost) return;
  var rx=roost.x-C.h.x, rz=roost.z-C.h.z, rr=Math.hypot(rx,rz), a=Math.atan2(rz,rx);
  var rd=kitD(roost.archetype,(roost.attrs&&roost.attrs.s)||1);
  var r=rr+rd/2+6+EYRIE_LEDGE.d+EYRIE_CORE/2;
  /* its door faces along the ring, toward the street side of the Roost */
  var sp=C.at("eyrie",r,a,rotAlong(a),"The Eyrie",{c:0x5C626E,rc:0x2C3A54},{eyrie:true,sign:"The Eyrie"});
  if(!sp) return;
  var d=doorWorld(sp), kx=d.x+d.out.x*3, kz=d.z+d.out.z*3;
  var ka=Math.atan2(kz-C.h.z,kx-C.h.x), kr=Math.hypot(kx-C.h.x,kz-C.h.z);
  C.sign(kr,ka+7/kr,rotAlong(a)+Math.PI/2,"The Eyrie","Quarters of the Dragon Corp. Every officer has an apartment here, and a balcony for their dragon.");
  store.eyrieId=sp.id;
}
function eyrieSpec(){ var id=store.eyrieId; if(!id) return null; for(var i=0;i<store.objects.length;i++) if(store.objects[i].id===id) return store.objects[i]; return null; }
/* where apartment n's dragon perches, in the world */
function eyriePerch(n,v){
  var sp=eyrieSpec(); if(!sp||!n) return null;
  var S=eyrieSlot(n), L=eyrieLocal(S.side,S.u,v===undefined?3.9:v), r=sp.rot||0, c=Math.cos(r), s=Math.sin(r);
  var base=terrainY(sp.x,sp.z)+(sp.y||0);
  var ox=L.ox*c+L.oz*s, oz=-L.ox*s+L.oz*c;
  return {x:sp.x+L.x*c+L.z*s, z:sp.z-L.x*s+L.z*c, y:base+S.y, ox:ox, oz:oz, rot:Math.atan2(ox,oz), floor:S.f, n:n};
}
var EYRIE_FACE=["north","east","south","west"];
function eyrieWords(n){ var S=eyrieSlot(n); return "No. "+n+", floor "+(S.f+1)+" of the Eyrie"; }

/* only the Corp go above the lobby */
(function(){
  if(typeof levelAllowed!=="function") return;
  var la=levelAllowed;
  levelAllowed=function(to){
    if(INT&&INT.spec&&INT.spec.eyrie&&to>0&&!(amCorp()||(typeof amKeeper==="function"&&amKeeper()))){
      setStatus("<b>The lift will not go up.</b> The floors above are the Corp's own quarters.");
      return false;
    }
    return la(to);
  };
})();

/* ================================================================ the balconies */
function eyrieRefresh(){
  if(!(typeof signedIn==="function"&&signedIn())) return;
  if(Date.now()-EY.at<60000) return;
  EY.at=Date.now();
  cityRpc("corp_eyrie").then(function(l){ EY.list=Array.isArray(l)?l:[]; eyriePerchAll(); }).catch(function(){});
}
function eyrieAway(row){
  /* a dragon is off its balcony while its rider is up on it */
  var me=(typeof myUserId==="function")?myUserId():null;
  if(row.id===me) return !!CORP.mounted;
  var p=(typeof presenceOthers!=="undefined")?presenceOthers[row.id]:null;
  return !!(p&&p.group&&p.group.userData.mount);
}
function eyrieClearPerch(n){
  var P=EY.perched[n]; if(!P) return;
  (P.meshes||[]).forEach(function(m){ scene.remove(m); }); if(P.g) scene.remove(P.g);
  delete EY.perched[n];
}
function eyriePerchAll(){
  var want={};
  (EY.list||[]).forEach(function(row){
    if(!row.apartment||eyrieAway(row)) return;
    var key=row.apartment, sig=row.color+"|"+row.id;
    want[key]=1;
    if(EY.perched[key]&&EY.perched[key].sig===sig) return;
    eyrieClearPerch(key);
    var at=eyriePerch(row.apartment); if(!at) return;
    var g=buildMountDragon(row.color,{lod:false}); g.userData.pose="perch";
    for(var i=0;i<40;i++) g.userData.anim(i*0.1,0.1);
    g.position.set(at.x,at.y,at.z); g.rotation.y=at.rot; g.updateMatrixWorld(true);
    var rec={sig:sig,at:at,name:row.dragon,rider:row.rider};
    if(typeof bakePress==="function"){
      var list=[]; g.traverse(function(m){ if(m.isMesh) list.push({m:m}); });
      try{
        rec.meshes=bakePress(list,at.x,at.z,"eyrie"+key).meshes;
        if(typeof TOON!=="undefined"&&TOON) rec.meshes.forEach(function(m){ if(m.material&&m.material.isMeshToonMaterial) m.material.onBeforeCompile=TOON.hook; });
      }catch(e){ rec.meshes=null; }
    }
    if(!rec.meshes){ rec.g=g; g.traverse(function(m){ m.raycast=function(){}; }); scene.add(g); }
    EY.perched[key]=rec;
  });
  Object.keys(EY.perched).forEach(function(k){ if(!want[k]) eyrieClearPerch(k); });
}
function eyrieShow(on){
  Object.keys(EY.perched).forEach(function(k){ var P=EY.perched[k];
    (P.meshes||[]).forEach(function(m){ m.visible=on; }); if(P.g) P.g.visible=on; });
}

/* ================================================================ every frame */
function eyrieTick(dt){
  var r=somnucorRealm(), here=r&&(store.here||0)===r.id;
  if(!here){ eyrieShow(false); eyriePanel(null); return; }
  eyrieRefresh();
  var sp=eyrieSpec(), P=camera.position;
  var near=sp&&!store.inside&&Math.hypot(sp.x-P.x,sp.z-P.z)<900;
  eyrieShow(!!near);
  /* the balconies follow who is riding */
  if(CORP.mounted!==EY.mountedPrev){ EY.mountedPrev=CORP.mounted; eyriePerchAll(); }
  EY.panelAt-=dt; if(EY.panelAt<=0){ EY.panelAt=2; eyriePerchAll(); }
  /* the other riders' dragons, alive */
  if(typeof presenceOthers!=="undefined") Object.keys(presenceOthers).forEach(function(id){
    var p=presenceOthers[id], g=p.group, m=g&&g.userData.mount; if(!m) return;
    var gy=terrainY(g.position.x,g.position.z), mv=p.lastX!==undefined?Math.hypot(g.position.x-p.lastX,g.position.z-p.lastZ):0;
    p.lastX=g.position.x; p.lastZ=g.position.z;
    m.userData.pose=g.position.y-gy>0.6?"fly":(mv>0.01?"walk":"stand");
    m.userData.anim(performance.now()/1000,dt);
  });
  /* home: land on your own balcony and go in */
  if(EY.landCool>0) EY.landCool-=dt;
  var mine=CORP.data&&CORP.data.apartment, B=mine?eyriePerch(mine):null;
  if(CORP.mounted&&B&&!store.inside){
    var feet=P.y-1.72-rideSeatNow(), dh=Math.hypot(B.x-P.x,B.z-P.z);
    if(dh>15) EY.away=true;
    if(EY.away&&EY.landCool<=0&&dh<5&&Math.abs(feet-B.y)<3) eyrieLand(B);
  }
  eyrieGuideTick();
  eyriePanel(store.inside&&INT&&INT.spec&&INT.spec.eyrie?INT:null);
}
function eyrieLand(B){
  EY.landCool=4; EY.guide=null;
  corpMount(false);
  var sp=eyrieSpec(); if(!sp) return;
  enterBuilding(sp);
  var f=Math.min(B.floor,(INT.levels||1)-1);
  INT.level=f; camera.position.y=1.72+f*INT.floor; wallsAt=-1;
  setStatus("<b>Home.</b> "+esc(myDragon().name)+" settles on the balcony. You are on floor "+(f+1)+", at your apartment.");
}
function eyrieMountHere(){
  var mine=CORP.data&&CORP.data.apartment, B=mine?eyriePerch(mine):null; if(!B) return;
  if(store.inside&&typeof exitInterior==="function") exitInterior(true);
  EY.landCool=5; EY.away=false;
  camera.position.set(B.x,B.y+RIDE_SEAT.dragon+1.72,B.z);
  yaw=Math.atan2(-B.ox,-B.oz); pitch=-0.12;
  corpMount(true);
  if(typeof flyY!=="undefined") flyY=B.y+RIDE_SEAT.dragon;
  setStatus("<b>Out onto the balcony, and up into the saddle.</b> "+esc(myDragon().name)+" spreads its wings — Space to climb, C to come down. Land here again to go back in.");
}
/* the way home */
function eyrieGo(){
  var mine=CORP.data&&CORP.data.apartment, sp=eyrieSpec(); if(!sp) return;
  if(CORP.mounted&&mine){ var B=eyriePerch(mine); EY.guide={x:B.x,z:B.z,y:B.y,name:"your balcony"}; }
  else { var d=doorWorld(sp); EY.guide={x:d.x,z:d.z,name:"the Eyrie's door"}; }
  if(typeof WORK!=="undefined"){ WORK.open=false; if(typeof workPaint==="function") workPaint(); }
}
function eyrieGuideTick(){
  var G=EY.guide, run=document.getElementById("work-run"); if(!G) return;
  if(!run){ if(typeof workEl==="function") workEl(); run=document.getElementById("work-run"); if(!run) return; }
  var P=camera.position, d=Math.hypot(G.x-P.x,G.z-P.z);
  if(store.inside||d<6){ EY.guide=null; run.style.display="none"; return; }
  var bearing=Math.atan2(G.x-P.x,G.z-P.z), rel=(bearing-(yaw+Math.PI))*180/Math.PI;
  var up=G.y!==undefined?Math.round(G.y-(P.y-1.72-rideSeatNow())):0;
  run.style.display="block";
  run.innerHTML="<b>Home to the Eyrie</b><div style='margin-top:6px'>"+esc(G.name)+" · "+Math.round(d)+" m"+(up>2?" · "+up+" m up":"")+
    " <span class='arrow' style='display:inline-block;transform:rotate("+(-rel).toFixed(0)+"deg)'>↑</span></div><div style='margin-top:6px'><button class='btn' id='ey-stop'>Stop</button></div>";
  var st=document.getElementById("ey-stop"); if(st) st.onclick=function(){ EY.guide=null; run.style.display="none"; };
}

/* inside the Eyrie: the way up, and your own door */
function eyriePanel(I){
  var el=document.getElementById("eyrie-panel");
  if(!I){ if(el) el.style.display="none"; return; }
  if(!el){
    el=document.createElement("div"); el.id="eyrie-panel";
    el.style.cssText="position:fixed;left:50%;transform:translateX(-50%);bottom:86px;z-index:40;background:rgba(14,16,22,.9);border:1px solid #3A4458;"+
      "border-radius:10px;padding:10px 14px;font:14px var(--sans,system-ui);color:#E8E2D2;max-width:min(92vw,460px);text-align:center;line-height:1.5";
    document.body.appendChild(el);
  }
  var lvl=I.level||0, mine=CORP.data&&CORP.data.apartment, S=mine?eyrieSlot(mine):null, key;
  var corp=amCorp(), h;
  if(!corp) h='<b style="color:#E8C27A">The Eyrie</b><br>Quarters of the Dragon Corp. The floors above are the officers\' own.';
  else if(!mine) h='<b style="color:#E8C27A">The Eyrie</b><br>Your apartment is being made ready. Open your work panel in a moment.';
  else if(lvl!==S.f) h='<b style="color:#E8C27A">The Eyrie</b><br>Your apartment is <b>'+esc(eyrieWords(mine))+'</b>'+(lvl===0?' — take the lift up.':' — this is floor '+(lvl+1)+'.');
  else h='<b style="color:#E8C27A">Apartment '+mine+'</b><br>'+esc(myDragon().name)+' waits on your balcony.<div style="margin-top:8px"><button class="btn" id="ey-mount">Out onto the balcony — mount '+esc(myDragon().name)+'</button></div>';
  key=h;
  if(el.dataset.k!==key){ el.dataset.k=key; el.innerHTML=h; var b=document.getElementById("ey-mount"); if(b) b.onclick=eyrieMountHere; }
  el.style.display="block";
}

/* ================================================================ the Corp panel */
(function(){
  if(typeof corpHtml!=="function") return;
  var ch=corpHtml;
  corpHtml=function(){
    var h=ch(), d=CORP.data; if(!h||!d||!amCorp()) return h;
    var dr=myDragon(), mark='<div style="color:var(--dim);margin-top:4px">Sectors</div>';
    var x='<div style="margin:8px 0;padding:8px 0;border-top:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08)">'+
      (d.apartment?'Your apartment: <b style="color:var(--bone)">'+esc(eyrieWords(d.apartment))+'</b> <button class="btn" id="ey-go">Go there</button>':'<span style="color:var(--dim)">Your apartment in the Eyrie is being made ready.</span>')+
      '<div style="margin-top:6px">Your dragon: <input id="ey-name" maxlength="30" value="'+esc(dr.name==="your dragon"?"":dr.name)+'" placeholder="name your dragon" style="width:9em;background:#0E1016;color:var(--bone,#eee);border:1px solid #3A4458;border-radius:6px;padding:3px 6px"> '+
      DRAGON_COLS.map(function(c){ return '<button data-dc="'+c+'" title="'+c+'" style="width:18px;height:18px;border-radius:50%;margin:0 2px;vertical-align:middle;cursor:pointer;background:#'+("000000"+DRAGON_COL[c].toString(16)).slice(-6)+
        ';border:2px solid '+(c===dr.color?"#E8C27A":"transparent")+'"></button>'; }).join("")+
      ' <button class="btn" id="ey-save">Keep</button></div></div>';
    return h.indexOf(mark)>-1?h.replace(mark,x+mark):h+x;
  };
  var cw=corpWire;
  corpWire=function(el){
    cw(el);
    var mb=document.getElementById("corp-mount"); if(mb&&!CORP.mounted) mb.textContent="Mount "+myDragon().name;
    var go=document.getElementById("ey-go"); if(go) go.onclick=eyrieGo;
    var pick=myDragon().color;
    Array.prototype.forEach.call(el.querySelectorAll("[data-dc]"),function(b){ b.onclick=function(){
      pick=b.getAttribute("data-dc");
      Array.prototype.forEach.call(el.querySelectorAll("[data-dc]"),function(o){ o.style.borderColor=o===b?"#E8C27A":"transparent"; }); }; });
    var sv=document.getElementById("ey-save"); if(sv) sv.onclick=function(){
      var nm=(document.getElementById("ey-name").value||"").trim();
      cityRpc("corp_dragon",{p_name:nm||null,p_color:pick}).then(function(o){
        if(o!=="ok"){ setStatus(esc(String(o))); return; }
        if(CORP.data){ CORP.data.dragon={name:nm||myDragon().name,color:pick}; }
        if(CORP.mounted) corpMount(true);
        EY.at=0; eyrieRefresh();
        setStatus("<b>"+esc(nm||"Your dragon")+"</b> — so it is. ");
        if(typeof workPaint==="function") workPaint();
      }).catch(function(e){ setStatus(esc(e.message)); });
    };
  };
})();
