/* SomnuMatrix — charstyle.js
   people drawn the way fantasy concept art draws them, built in layers:
     1. the base — illustrated proportions (a fuller head, strong hands),
        a painted face (eyes with colour and a glint, brows, a nose, a
        smile), tousled hair, a collar at the neck, boots with turned cuffs
     2. gear — a vest, a belt with its buckle, both, or a cloak
     3. features — pointed ears, swapped in on anyone
     and a shared colour palette, so the whole city's clothing belongs to
     one world. Every dreamer chooses their own in the wardrobe; the city's
     people are each given theirs from who they are.
   loaded as a plain script; shares scope with the other files */
"use strict";

var CS_PALETTE=[0x3A6A9A,0x6A4A32,0x8A2A3A,0x3A6A3A,0x5A3A7A,0x2E3A5A,0x8A6A3A,0x4A5A2E,0x7A3A2A,0x2A5A5A,0x6A6A72,0xC8B08A];
var CS_EYES=[0x5A3A22,0x3A2A1A,0x4A7AAA,0x3A6A4A,0x6A6A5A,0x7A5A2A];
var GEARS=["none","vest","belt","vestbelt","cloak"], GEAR_LABEL=["none","a vest","a belt","vest and belt","a cloak"];
var EARS=["round","pointed"], EARS_LABEL=["rounded","pointed (elven)"];

/* what a person carries in the gear layer, chosen from who they are unless they chose */
function csLookFill(L,seed){
  var h=hash(String(seed)+"cs");
  if(L.gear===undefined||L.gear===null) L.gear=["none","vest","belt","vestbelt","cloak","vest","belt","none","vestbelt","none"][h%10];
  if(L.gearColor===undefined||L.gearColor===null) L.gearColor=CS_PALETTE[(h>>>5)%CS_PALETTE.length];
  if(L.eyes===undefined||L.eyes===null) L.eyes=CS_EYES[(h>>>9)%CS_EYES.length];
  if(L.ears===undefined||L.ears===null) L.ears=((h>>>13)%13===0)?"pointed":"round";
  return L;
}
(function(){
  if(typeof fillLook!=="function") return;
  var fl=fillLook;
  fillLook=function(L,seed){ fl(L,seed); return csLookFill(L,seed); };
})();

/* ---- creatures, dragons and gods, drawn smooth: while one is being built,
   every round shape it is made of has more sides to it (not on phones) ---- */
var CS_SMOOTH=0;
(function(){
  if(typeof GFX_STYLE!=="undefined"&&GFX_STYLE==="standard") return;
  if(typeof cyl!=="function"||typeof sph!=="function") return;
  var c0=cyl, k0=cone, s0=sph, t0=tor;
  cyl=function(a,b,h,s){ if(!CS_SMOOTH) return c0(a,b,h,s); s=s||8; return new THREE.CylinderGeometry(a,b,h,Math.max(s,Math.min(24,s*2.5|0))); };
  cone=function(r,h,s){ if(!CS_SMOOTH) return k0(r,h,s); s=s||8; return new THREE.ConeGeometry(r,h,Math.max(s,Math.min(20,s*3))); };
  sph=function(r,a,b){ if(!CS_SMOOTH) return s0(r,a,b); return new THREE.SphereGeometry(r,Math.max(a||12,24),Math.max(b||10,16)); };
  tor=function(r,t,arc){ if(!CS_SMOOTH) return t0(r,t,arc); return new THREE.TorusGeometry(r,t,12,40,arc===undefined?Math.PI*2:arc); };
  function smooth(fn){ return function(){ CS_SMOOTH++; try{ return fn.apply(this,arguments); } finally{ CS_SMOOTH--; } }; }
  if(typeof buildCreature==="function") buildCreature=smooth(buildCreature);
  if(typeof buildDragon==="function") buildDragon=smooth(buildDragon);
  if(typeof buildDeity==="function") buildDeity=smooth(buildDeity);
  if(typeof HEADS!=="undefined") Object.keys(HEADS).forEach(function(k){ HEADS[k]=smooth(HEADS[k]); });
})();

/* ---- the painted face ---- */
var FACE_TEX={};
function hexCss(n){ return "#"+("000000"+((n||0)>>>0).toString(16)).slice(-6); }
function faceTexture(skin,hair,eyes,sex,child){
  var key=[skin,hair,eyes,sex,child?1:0].join("|"); if(FACE_TEX[key]) return FACE_TEX[key];
  var c=document.createElement("canvas"); c.width=256; c.height=256; var x=c.getContext("2d");
  x.clearRect(0,0,256,256);
  var ink="#2A1A14", ey=140, ex=[86,170], er=child?17:15;
  /* brows, in the hair's own colour, a shade darker */
  x.strokeStyle=hexCss(blend(hair||0x3A2A1A,0x000000,0.35)); x.lineCap="round"; x.lineWidth=child?6:sex==="f"?6:9;
  ex.forEach(function(px,i){ var sd=i?1:-1; x.beginPath(); x.moveTo(px-20*sd,ey-25); x.quadraticCurveTo(px,ey-37,px+21*sd,ey-29); x.stroke(); });
  /* eyes: white, the iris in its colour, the pupil, a glint, and a line above */
  ex.forEach(function(px){
    x.fillStyle="#F8F4EC"; x.beginPath(); x.ellipse(px,ey,er+3,er-1,0,0,Math.PI*2); x.fill();
    x.fillStyle=hexCss(eyes); x.beginPath(); x.arc(px,ey+1,er-3,0,Math.PI*2); x.fill();
    x.fillStyle="#0E0A08"; x.beginPath(); x.arc(px,ey+1,er-9,0,Math.PI*2); x.fill();
    x.fillStyle="#FFFFFF"; x.beginPath(); x.arc(px+4,ey-4,4,0,Math.PI*2); x.fill();
    x.strokeStyle=ink; x.lineWidth=4; x.beginPath(); x.ellipse(px,ey,er+3,er-1,0,Math.PI*1.05,Math.PI*1.95); x.stroke();
    if(sex==="f"){ x.beginPath(); x.moveTo(px+er+2,ey-6); x.lineTo(px+er+8,ey-11); x.stroke(); }
  });
  /* a nose, by its shadow */
  x.strokeStyle=hexCss(blend(skin||0xC8A080,0x6A3A2A,0.45)); x.lineWidth=4; x.beginPath(); x.moveTo(128,ey+16); x.quadraticCurveTo(122,ey+40,132,ey+44); x.stroke();
  /* the cheeks, warm */
  x.fillStyle="rgba(220,110,100,0.32)"; [70,186].forEach(function(px){ x.beginPath(); x.ellipse(px,ey+42,16,9,0,0,Math.PI*2); x.fill(); });
  /* a quiet smile */
  x.strokeStyle="#7A3A30"; x.lineWidth=5; x.beginPath(); x.moveTo(108,ey+66); x.quadraticCurveTo(128,ey+78,150,ey+64); x.stroke();
  var t=new THREE.CanvasTexture(c); t.anisotropy=4; FACE_TEX[key]=t; return t;
}
/* the front of the head, where the face is painted */
function faceGeo(){ return fg("faceplate",function(){ return new THREE.SphereGeometry(0.1135,32,24,Math.PI/2-0.95,1.9,0.78,1.32); }); }

/* ---- the layers, added to a figure as it is built ---- */
var CS_HEADPART={head:1,eye:1,face:1,haircap:1,hairlong:1,bun:1,tail:1,afro:1,coily:1,locs:1,braid:1,braidband:1,buzzcap:1,waves:1,wrap:1,
  wrapknot:1,curly:1,hatcap:1,brimcap:1,crown:1,brim:1,hood:1,tuft:1,ear:1};
var CS_HEAD_K=1.2;
function csDress(g,spec,f){
  var L=lookOf(spec);
  if(spec.city||spec.hub||spec.filler||/^presence_|^__me/.test(String(spec.id))) csLookFill(L,spec.id);
  var body=g.children[0]; if(!body) return g;
  var parts={}; body.children.forEach(function(m){ if(m.userData&&m.userData.part) (parts[m.userData.part]=parts[m.userData.part]||[]).push(m); });
  var head=(parts.head||[])[0], torso=(parts.torso||[])[0]; if(!head||!torso) return g;
  var filler=!!spec.filler, child=spec.archetype==="child"||L.age==="child";
  function pick(v,d){ return v!==null&&v!==undefined?v:d; }
  var skin=pick(L.skin,STATUE.skin), hair=pick(L.hair,STATUE.hair), top=pick(L.top,STATUE.top), shoes=pick(L.shoes,STATUE.shoes);
  var topKind=L.topKind||"shirt", bottomKind=L.bottomKind||"trousers", style=L.hairStyle||(L.sex==="f"?"long":"short");
  function add(key,make,mat,x,y,z){ var m=new THREE.Mesh(fg(key,make),mat); m.position.set(x||0,y||0,z||0); m.userData.part=key.replace(/[\d.]+/g,""); m.userData.cs=1; body.add(m); return m; }
  var hy=head.position.y;

  /* the face, painted, in place of two dots — the dots are kept, shrunk away,
     so a creature that hides its eyes (or shows only its eyes) still can */
  (parts.eye||[]).forEach(function(e){ e.userData.csEye=e.scale.clone(); e.scale.setScalar(0.0001); });
  if(filler||f>=0.5){
    var fm=new THREE.MeshLambertMaterial({map:faceTexture(skin,hair,L.eyes,L.sex,child),transparent:true,alphaTest:0.12,depthWrite:false,
      polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2});
    var face=new THREE.Mesh(faceGeo(),fm); face.position.copy(head.position); face.scale.copy(head.scale); face.userData.part="face"; face.userData.cs=1; face.userData.map=fm.map; face.renderOrder=2; body.add(face);
  }
  /* hair, hoods and caps leave the face open: a cap over the crown, the
     rest round the sides and back */
  ["haircap","buzzcap","hatcap","hood","wrap"].forEach(function(pn){
    (parts[pn]||[]).forEach(function(m){
      var p=m.geometry.parameters; if(!p||p.phiLength<6) return;
      var r=p.radius, tl=p.thetaLength, gap=pn==="hood"?1.7:1.9;
      m.geometry=fg("open"+pn+r+"_"+tl,function(){ return new THREE.SphereGeometry(r,32,16,Math.PI/2+gap/2,Math.PI*2-gap,0,tl); });
      if(m.material&&!m.material.userData.dbl){ m.material=m.material.clone(); m.material.side=THREE.DoubleSide; m.material.userData.dbl=1; }
      var top=new THREE.Mesh(fg("crowncap"+r+"_"+(pn==="hood"?1:0),function(){ return new THREE.SphereGeometry(r,32,10,0,Math.PI*2,0,pn==="hood"?1.05:0.92); }),m.material);
      top.position.copy(m.position); top.scale.copy(m.scale); top.userData.part=pn; top.userData.cs=1; body.add(top);
    });
  });
  /* tousled hair: tufts over the crown and a fringe across the brow */
  if(style!=="bald"&&style!=="buzz"&&style!=="afro"&&style!=="headwrap"&&style!=="curly"&&!(L.hat&&L.hat!=="none")){
    var hm=figMat(hair,f,filler), n=style==="short"||style==="waves"?11:7;
    for(var i=0;i<n;i++){
      var a=i/n*Math.PI*2+0.3, rr=0.085, up=i%3===0;
      var t=add("tuft",function(){ return new THREE.ConeGeometry(0.042,0.1,10); },hm,Math.cos(a)*rr,hy+0.085+(up?0.02:0),Math.sin(a)*rr-0.01);
      t.rotation.z=-Math.cos(a)*0.9; t.rotation.x=Math.sin(a)*0.9; t.rotation.y=a;
    }
    for(var k=0;k<3;k++){
      var fr=add("tuft",function(){ return new THREE.ConeGeometry(0.042,0.1,10); },hm,(k-1)*0.05,hy+0.06,0.085);
      fr.rotation.x=2.3; fr.rotation.z=(k-1)*0.35;
    }
  }
  /* pointed ears, on anyone who has them (a species that brings its own keeps those) */
  var sp=L.species&&SPECIES_FEATS[L.species], ownEars=sp&&sp.feats.indexOf("ears")>-1;
  if(L.ears==="pointed"&&!ownEars){
    var em=figMat(skin,f,filler);
    [-1,1].forEach(function(sd){ var e=add("ear",function(){ return new THREE.ConeGeometry(0.028,0.13,12); },em,sd*0.11,hy+0.02,-0.01); e.rotation.z=-sd*1.05; e.rotation.x=-0.25; });
  }
  /* a collar at the neck */
  if(topKind!=="robe"){ var col=add("collar",function(){ return new THREE.TorusGeometry(0.062,0.018,8,20); },figMat(blend(top,0x000000,0.15),f,filler),0,1.565,0.006); col.rotation.x=Math.PI/2; col.scale.z=0.9; }
  /* rounded shoulders where the sleeves meet the body */
  body.children.forEach(function(pv){
    if(!pv.isGroup||!pv.children.some(function(m){ return m.userData.part==="arm"; })) return;
    var sm=pv.children.filter(function(m){ return m.userData.part==="arm"; })[0].material;
    var sh=new THREE.Mesh(fg("shoulderball",function(){ return new THREE.SphereGeometry(0.068,20,14); }),sm); sh.position.y=-0.02; sh.userData.part="shoulder"; pv.add(sh);
  });
  /* strong hands */
  body.children.forEach(function(pv){ if(pv.isGroup) pv.children.forEach(function(m){ if(m.userData.part==="hand") m.scale.setScalar(1.35); }); });
  /* boots with turned cuffs, over the trousers */
  if(bottomKind!=="skirt"&&topKind!=="dress"&&topKind!=="robe"){
    var bm=figMat(shoes,f,filler), cm=figMat(blend(shoes,0xFFFFFF,0.12),f,filler);
    body.children.forEach(function(pv){
      if(!pv.isGroup) return;
      var hasLeg=pv.children.some(function(m){ return m.userData.part==="leg"; }); if(!hasLeg) return;
      var shaft=new THREE.Mesh(fg("bootshaft",function(){ return new THREE.CylinderGeometry(0.07,0.064,0.26,16); }),bm); shaft.position.y=-0.74; shaft.userData.part="boot"; pv.add(shaft);
      var cuff=new THREE.Mesh(fg("bootcuff",function(){ return new THREE.CylinderGeometry(0.082,0.078,0.07,16); }),cm); cuff.position.y=-0.6; cuff.userData.part="boot"; pv.add(cuff);
      pv.children.forEach(function(m){ if(m.userData.part==="shoe"){ m.scale.set(1.25,1.3,1.1); m.position.z=0.055; } });
    });
  }
  /* the gear layer */
  var gear=L.gear||"none", gm=figMat(pick(L.gearColor,CS_PALETTE[1]),f,filler), shoulder=torso.geometry.parameters.radiusTop||0.2;
  if((gear==="vest"||gear==="vestbelt")&&topKind!=="robe"){
    var v=add("vest"+shoulder,function(){ return new THREE.CylinderGeometry(shoulder+0.014,0.178,0.5,24,1,true,0.42,Math.PI*2-0.84); },gm,0,1.26,0);
    v.material=v.material.clone(); v.material.side=THREE.DoubleSide; v.scale.z=0.68;
  }
  if((gear==="belt"||gear==="vestbelt")&&topKind!=="robe"){
    var b=add("belt",function(){ return new THREE.CylinderGeometry(0.182,0.186,0.065,24); },figMat(0x3A2A1C,f,filler),0,0.99,0); b.scale.z=0.82;
    add("buckle",function(){ return new THREE.BoxGeometry(0.06,0.055,0.02); },figMat(0xC9A868,f,filler),0,0.99,0.155);
  }
  if(gear==="cloak"){
    var cl=add("cloak",function(){ return new THREE.CylinderGeometry(0.22,0.34,1.05,24,1,true,Math.PI/2+0.25,Math.PI-0.5); },gm,0,1.05,-0.02);
    cl.material=cl.material.clone(); cl.material.side=THREE.DoubleSide; cl.scale.z=0.75;
    add("clasp",function(){ return new THREE.SphereGeometry(0.022,10,8); },figMat(0xC9A868,f,filler),0,1.53,0.08);
  }
  /* illustrated proportions: the head, and all that sits on it, a size larger */
  csHeadScale(body,hy);
  body.children.forEach(function(m){ m.userData.csBase=1; });
  g.userData.csHy=hy;
  return g;
}
function csIsSpecies(o){ if(typeof SPECIES_FEATS==="undefined") return false; for(var k in SPECIES_FEATS) if(SPECIES_FEATS[k]===o) return true; return false; }
/* what was added after the figure was dressed: anything at the head grows with it */
var CS_HAIRPART={haircap:1,hairlong:1,bun:1,tail:1,afro:1,coily:1,locs:1,braid:1,braidband:1,buzzcap:1,waves:1,wrap:1,wrapknot:1,curly:1};
function csAfter(g){
  var body=g&&g.children[0]; if(!body||!body.children) return;
  if(!g.userData.csHy){ csSync(body); return; }
  var hy=g.userData.csHy, k=CS_HEAD_K, limbs=g.userData.limbs||{}, lv=[];
  Object.keys(limbs).forEach(function(n){ lv.push(limbs[n]); });
  body.children.forEach(function(m){
    if(m.userData.csBase||m.userData.csHead||lv.indexOf(m)>-1) return;
    if(!(m.isMesh||m.isGroup)) return;
    m.userData.csHead=1;
    if(m.position.y<=hy-0.215) return;
    m.position.set(m.position.x*k,hy+(m.position.y-hy)*k,m.position.z*k);
    m.scale.multiplyScalar(k);
  });
  csSync(body);
}
function csSync(body){
  var face=null, head=null, eyes=[], tufts=[], ears=[], hairHidden=false;
  body.children.forEach(function(m){
    var p=m.userData&&m.userData.part;
    if(p==="face") face=m; else if(p==="head") head=head||m; else if(p==="eye") eyes.push(m);
    else if(p==="tuft") tufts.push(m); else if(p==="ear"&&m.userData.cs) ears.push(m);
    else if(CS_HAIRPART[p]&&m.visible===false) hairHidden=true;
  });
  var eyesHidden=eyes.some(function(e){ return e.visible===false; }), headHidden=!!(head&&head.visible===false);
  /* formless: everything gone but the eyes — so the eyes come back */
  if(face&&face.visible===false&&!eyesHidden) eyes.forEach(function(e){ if(e.userData.csEye){ e.scale.copy(e.userData.csEye).multiplyScalar(CS_HEAD_K); } });
  if(eyesHidden||headHidden){
    if(face) face.visible=false;
    tufts.forEach(function(t){ t.visible=false; }); ears.forEach(function(e){ e.visible=false; });
  }
  if(hairHidden) tufts.forEach(function(t){ t.visible=false; });
  if(face&&head) face.scale.copy(head.scale);
  /* a ghost's face is as see-through as the rest of it */
  if(face&&face.userData.map&&face.material&&!face.material.map){
    face.material=new THREE.MeshBasicMaterial({map:face.userData.map,transparent:true,opacity:0.6,depthWrite:false,alphaTest:0.12});
  }
}
function csHeadScale(body,hy){
  var k=CS_HEAD_K;
  body.children.forEach(function(m){
    if(!m.isMesh||m.userData.csHead) return;
    var p=m.userData.part, isHead=CS_HEADPART[p]||(m.userData.acc&&m.position.y>hy-0.07)||(m.userData.feat&&m.position.y>hy-0.2);
    if(!isHead) return;
    m.userData.csHead=1;
    m.position.set(m.position.x*k,hy+(m.position.y-hy)*k,m.position.z*k);
    m.scale.multiplyScalar(k);
  });
}
(function(){
  if(typeof buildFigure!=="function") return;
  var bf=buildFigure;
  buildFigure=function(spec,f){
    var g=bf.apply(this,arguments);
    try{ csDress(g,spec,f); }catch(e){ if(window.console) console.warn("dress:",e); }
    return g;
  };
  /* a species' own features (ears, horns), and a folk's or a god's own
     head — an animal's, a skull, a helm, a crown — sit on the larger head too;
     and whatever hides a head or its eyes hides the painted face with it */
  if(typeof dressFolk==="function"){
    var df=dressFolk;
    dressFolk=function(g,spec,f,o){
      var r=df.apply(this,arguments);
      try{ csAfter(g); }catch(e){ if(window.console) console.warn("folk:",e); }
      return r;
    };
  }
  if(typeof buildDeity==="function"){
    var bd=buildDeity;
    buildDeity=function(spec,f){
      var g=bd.apply(this,arguments);
      try{ csAfter(g); }catch(e){ if(window.console) console.warn("deity:",e); }
      return g;
    };
  }
  /* the wardrobe: gear, its colour, and ears */
  if(typeof renderWardrobe==="function"){
    var rw=renderWardrobe;
    renderWardrobe=function(){
      rw();
      var w=document.getElementById("me-ward"); if(!w) return;
      var L=meLook(), S=L.src||{};
      function set(k,v){ L[k]=v; L.src=L.src||{}; L.src[k]="chosen"; rebuildMe(); save(); if(typeof publishMyLook==="function") publishMyLook(); renderWardrobe(); }
      var box=document.createElement("div");
      box.innerHTML='<div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--dim,#999);margin:12px 0 4px">Gear and features</div>'+
        selectRow("Gear",S.gear,GEARS,L.gear,function(v){ set("gear",v||"none"); },GEAR_LABEL)+
        swatchRow("Gear colour",S.gearColor,CS_PALETTE,L.gearColor,function(v){ set("gearColor",v); })+
        swatchRow("Eyes",S.eyes,CS_EYES,L.eyes,function(v){ set("eyes",v); })+
        selectRow("Ears",S.ears,EARS,L.ears,function(v){ set("ears",v||"round"); },EARS_LABEL);
      var done=w.querySelector("#me-close"); w.appendChild(box);
      Array.prototype.forEach.call(box.querySelectorAll("[data-lk]"),function(b){ b.onclick=function(){ LKH[b.getAttribute("data-lk")](parseInt(b.getAttribute("data-c"),10)); }; });
      Array.prototype.forEach.call(box.querySelectorAll("[data-lkp]"),function(inp){ inp.onchange=function(){ LKH[inp.getAttribute("data-lkp")](parseInt(inp.value.slice(1),16)); }; });
      Array.prototype.forEach.call(box.querySelectorAll("[data-lks]"),function(s){ s.onchange=function(){ LKH[s.getAttribute("data-lks")](s.value); }; });
    };
  }
})();
