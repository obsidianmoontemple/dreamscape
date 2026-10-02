/* SomnuMatrix — deity-forms.js
   how deities and dragons are drawn: a body, then their iconography built onto it.
   loaded as a plain script; shares scope with the other files */
"use strict";

A("deity","being",[1.2,2.4,1.2],[{g:"sph",s:[.3],p:[0,1.2,0],c:"light",glow:1}]);
A("dragon","being",[40,20,60],[{g:"sph",s:[2],p:[0,2,0],c:"nature"}]);
PEOPLE.deity=1;
MORE_VOCAB.dragon=["dragon","dragons","wyrm","wyvern","great serpent"];
MORE_VOCAB.deity=["goddess","deity","divine being","a god","the god","the gods"];

function mL(c){ return new THREE.MeshLambertMaterial({color:c}); }
function mG(c,o){ return new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o===undefined?0.9:o,depthWrite:false}); }
function P(geo,mat,x,y,z,rx,ry,rz){ var m=new THREE.Mesh(geo,mat); m.position.set(x||0,y||0,z||0); if(rx||ry||rz) m.rotation.set(rx||0,ry||0,rz||0); return m; }
function box(w,h,d){ return new THREE.BoxGeometry(w,h,d); }
function cyl(a,b,h,s){ return new THREE.CylinderGeometry(a,b,h,s||8); }
function cone(r,h,s){ return new THREE.ConeGeometry(r,h,s||8); }
function sph(r,a,b){ return new THREE.SphereGeometry(r,a||12,b||10); }
function tor(r,t,arc){ return new THREE.TorusGeometry(r,t,6,24,arc===undefined?Math.PI*2:arc); }

/* ---------- animal heads ---------- */
var HEADS={
  jackal:function(){ var g=new THREE.Group(), m=mL(0x17171A);
    g.add(P(box(.2,.2,.24),m,0,0,0)); g.add(P(box(.09,.09,.26),m,0,-.04,.2));
    g.add(P(cone(.05,.26,4),m,-.07,.2,-.02)); g.add(P(cone(.05,.26,4),m,.07,.2,-.02));
    g.add(P(sph(.018),mG(0xE8C27A,1),-.06,.03,.1)); g.add(P(sph(.018),mG(0xE8C27A,1),.06,.03,.1)); return g; },
  falcon:function(){ var g=new THREE.Group();
    g.add(P(sph(.125),mL(0x5A4A3A),0,0,0)); g.add(P(sph(.08),mL(0xE6DCC2),0,-.03,.07));
    g.add(P(cone(.035,.13,6),mL(0x2A2420),0,-.02,.16,Math.PI/2)); g.add(P(sph(.02),mG(0x111111,1),-.06,.02,.09)); g.add(P(sph(.02),mG(0x111111,1),.06,.02,.09)); return g; },
  ibis:function(){ var g=new THREE.Group();
    g.add(P(sph(.105),mL(0x1C1C1E),0,0,0)); g.add(P(cyl(.02,.012,.4,6),mL(0x1C1C1E),0,-.12,.2,1.95)); return g; },
  cat:function(){ var g=new THREE.Group(), m=mL(0x1A1A1E);
    g.add(P(sph(.12),m,0,0,0)); g.add(P(cone(.045,.12,4),m,-.07,.12,0)); g.add(P(cone(.045,.12,4),m,.07,.12,0));
    g.add(P(sph(.05),m,0,-.04,.09)); g.add(P(sph(.02),mG(0x7FE08A,1),-.05,.02,.1)); g.add(P(sph(.02),mG(0x7FE08A,1),.05,.02,.1)); return g; },
  lion:function(){ var g=new THREE.Group();
    g.add(P(new THREE.IcosahedronGeometry(.2,1),mL(0x8A5A2A),0,0,-.04)); g.add(P(sph(.13),mL(0xB8883A),0,0,.04));
    g.add(P(sph(.06),mL(0xC89A4A),0,-.04,.14)); g.add(P(sph(.02),mG(0xE8C27A,1),-.05,.03,.14)); g.add(P(sph(.02),mG(0xE8C27A,1),.05,.03,.14)); return g; },
  croc:function(){ var g=new THREE.Group(), m=mL(0x3E5A34);
    g.add(P(box(.2,.13,.22),m,0,0,0)); g.add(P(box(.13,.08,.42),m,0,-.03,.28)); g.add(P(sph(.022),mG(0xE8C27A,1),-.06,.06,.06)); g.add(P(sph(.022),mG(0xE8C27A,1),.06,.06,.06)); return g; },
  hippo:function(){ var g=new THREE.Group(), m=mL(0x7A6A6A);
    g.add(P(box(.24,.22,.26),m,0,0,0)); g.add(P(box(.26,.16,.18),m,0,-.05,.18)); g.add(P(sph(.03),m,-.08,.13,-.02)); g.add(P(sph(.03),m,.08,.13,-.02)); return g; },
  elephant:function(){ var g=new THREE.Group(), m=mL(0x8A8A8E);
    g.add(P(sph(.17),m,0,0,0)); g.add(P(cyl(.055,.03,.55,8),m,0,-.26,.17,.25));
    g.add(P(cyl(.17,.17,.02,14),m,-.18,.0,-.02,0,0,Math.PI/2)); g.add(P(cyl(.17,.17,.02,14),m,.18,.0,-.02,0,0,Math.PI/2));
    g.add(P(cone(.018,.14,6),mL(0xE8E4DA),.06,-.1,.15,2.2)); g.add(P(sph(.02),mG(0x111111,1),-.08,.04,.14)); g.add(P(sph(.02),mG(0x111111,1),.08,.04,.14)); return g; },
  monkey:function(){ var g=new THREE.Group();
    g.add(P(sph(.12),mL(0x7A5A3A),0,0,0)); g.add(P(sph(.075),mL(0xC8A882),0,-.03,.08));
    g.add(P(sph(.04),mL(0x7A5A3A),-.12,.01,0)); g.add(P(sph(.04),mL(0x7A5A3A),.12,.01,0)); g.add(P(sph(.018),mG(0x111111,1),-.04,.03,.11)); g.add(P(sph(.018),mG(0x111111,1),.04,.03,.11)); return g; },
  goat:function(){ var g=new THREE.Group(), m=mL(0x1E1C1C);
    g.add(P(box(.15,.18,.24),m,0,0,.02)); g.add(P(cone(.035,.3,6),m,-.07,.2,-.06,-.6)); g.add(P(cone(.035,.3,6),m,.07,.2,-.06,-.6));
    g.add(P(cone(.03,.12,5),m,0,-.16,.1,Math.PI)); g.add(P(sph(.02),mG(0xE8561E,1),-.05,.03,.13)); g.add(P(sph(.02),mG(0xE8561E,1),.05,.03,.13)); return g; },
  bull:function(){ var g=new THREE.Group(), m=mL(0x4A2A22);
    g.add(P(box(.22,.22,.26),m,0,0,.02)); g.add(P(cyl(.03,.015,.3,6),mL(0xE6DCC2),-.2,.1,0,0,0,1.2)); g.add(P(cyl(.03,.015,.3,6),mL(0xE6DCC2),.2,.1,0,0,0,-1.2));
    g.add(P(sph(.02),mG(0xE8561E,1),-.07,.03,.15)); g.add(P(sph(.02),mG(0xE8561E,1),.07,.03,.15)); return g; },
  setanimal:function(){ var g=new THREE.Group(), m=mL(0x8A4A3A);
    g.add(P(box(.13,.15,.2),m,0,0,0)); g.add(P(cyl(.035,.02,.3,6),m,0,-.08,.18,1.9));
    g.add(P(box(.05,.18,.02),m,-.05,.18,-.02)); g.add(P(box(.05,.18,.02),m,.05,.18,-.02)); return g; },
  fly:function(){ var g=new THREE.Group();
    g.add(P(sph(.13),mL(0x1A1A1E),0,0,0)); g.add(P(sph(.075),mG(0xA8322B,1),-.075,.02,.08)); g.add(P(sph(.075),mG(0xA8322B,1),.075,.02,.08)); return g; }
};

/* ---------- things held ---------- */
function flameAt(g,y,s){ var f=P(cone(.07*s,.22*s,6),mG(0xFFB23A,.9),0,y,0); f.userData.flicker=1; g.add(f); return f; }
var HELD={
  torch:function(){ var g=new THREE.Group(); g.add(P(cyl(.025,.03,.7),mL(0x5A3A22),0,0,0)); flameAt(g,.44,1); return g; },
  key:function(){ var g=new THREE.Group(), m=mL(GOLD); g.add(P(tor(.06,.015),m,0,.24,0)); g.add(P(box(.025,.4,.025),m,0,0,0)); g.add(P(box(.08,.05,.02),m,.04,-.17,0)); return g; },
  trident:function(){ var g=new THREE.Group(), m=mL(0xA7AAB0); g.add(P(cyl(.02,.02,1.9),m,0,.3,0)); g.add(P(box(.3,.03,.03),m,0,1.2,0));
    [-0.14,0,0.14].forEach(function(x){ g.add(P(cone(.025,.22,5),m,x,1.34,0)); }); return g; },
  thunderbolt:function(){ var g=new THREE.Group(), m=mG(0xFFE8A0,.95);
    g.add(P(box(.05,.25,.05),m,0,.12,0,0,0,.4)); g.add(P(box(.05,.25,.05),m,.02,-.08,0,0,0,-.4)); g.add(P(box(.05,.22,.05),m,-.01,-.26,0,0,0,.4)); return g; },
  hammer:function(){ var g=new THREE.Group(); g.add(P(cyl(.02,.02,.4),mL(0x5A3A22),0,0,0)); g.add(P(box(.26,.14,.14),mL(0x5A5C62),0,.22,0)); return g; },
  spear:function(){ var g=new THREE.Group(); g.add(P(cyl(.018,.018,2.1),mL(0x5A3A22),0,.35,0)); g.add(P(cone(.04,.22,5),mL(0xA7AAB0),0,1.5,0)); return g; },
  glaive:function(){ var g=new THREE.Group(); g.add(P(cyl(.02,.02,2.1),mL(0x5A3A22),0,.35,0)); g.add(P(box(.12,.5,.02),mL(0xA7AAB0),.04,1.55,0,0,0,-.1)); return g; },
  bow:function(){ var g=new THREE.Group(); g.add(P(tor(.45,.015,Math.PI),mL(0x5A3A22),0,0,0,0,0,Math.PI/2)); g.add(P(box(.005,.9,.005),mL(0xE6DCC2),0,0,0)); return g; },
  lyre:function(){ var g=new THREE.Group(), m=mL(GOLD); g.add(P(cyl(.015,.015,.4),m,-.1,.1,0,0,0,.15)); g.add(P(cyl(.015,.015,.4),m,.1,.1,0,0,0,-.15));
    g.add(P(box(.26,.02,.02),m,0,.3,0)); g.add(P(box(.2,.08,.04),m,0,-.1,0)); return g; },
  harp:function(){ var g=new THREE.Group(), m=mL(0x7A5A3A); g.add(P(box(.03,.5,.03),m,-.1,0,0)); g.add(P(box(.3,.03,.03),m,.05,.24,0,0,0,-.3)); g.add(P(box(.03,.3,.03),m,.18,-.05,0,0,0,.4)); return g; },
  scales:function(){ var g=new THREE.Group(), m=mL(GOLD); g.add(P(cyl(.012,.012,.5),m,0,.1,0)); g.add(P(box(.44,.015,.015),m,0,.34,0));
    g.add(P(cyl(.07,.07,.01,12),m,-.21,.2,0)); g.add(P(cyl(.07,.07,.01,12),m,.21,.2,0)); return g; },
  ankh:function(){ var g=new THREE.Group(), m=mL(GOLD); g.add(P(tor(.05,.014),m,0,.12,0)); g.add(P(box(.03,.2,.02),m,0,-.04,0)); g.add(P(box(.14,.03,.02),m,0,.05,0)); return g; },
  caduceus:function(){ var g=new THREE.Group(), m=mL(GOLD); g.add(P(cyl(.015,.015,1),m,0,.2,0));
    for(var i=0;i<3;i++) g.add(P(tor(.05,.012),mL(0x3F7A3A),0,.05+i*.16,0,Math.PI/2,0,i*.8)); g.add(P(box(.24,.04,.01),mL(0xE8E4DA),0,.72,0)); return g; },
  staff:function(){ var g=new THREE.Group(); g.add(P(cyl(.025,.03,1.9),mL(0x6B4A32),0,.3,0)); return g; },
  scepter:function(){ var g=new THREE.Group(); g.add(P(cyl(.018,.018,1.1),mL(GOLD),0,.15,0)); g.add(P(sph(.05),mL(GOLD),0,.72,0)); return g; },
  sword:function(){ var g=new THREE.Group(); g.add(P(box(.06,.8,.015),mL(0xB8BCC4),0,.45,0)); g.add(P(box(.2,.03,.04),mL(GOLD),0,.04,0)); g.add(P(cyl(.018,.018,.14),mL(0x3A2A1E),0,-.05,0)); return g; },
  dagger:function(){ var g=new THREE.Group(); g.add(P(box(.04,.3,.012),mL(0xB8BCC4),0,.18,0)); g.add(P(box(.12,.02,.03),mL(GOLD),0,.03,0)); return g; },
  machete:function(){ var g=new THREE.Group(); g.add(P(box(.07,.55,.012),mL(0xA7AAB0),.02,.3,0,0,0,-.08)); g.add(P(cyl(.018,.018,.14),mL(0x3A2A1E),0,-.05,0)); return g; },
  axe:function(){ var g=new THREE.Group(); g.add(P(cyl(.018,.018,.6),mL(0x5A3A22),0,.1,0)); g.add(P(box(.3,.16,.02),mL(0xA7AAB0),0,.36,0)); return g; },
  shield:function(){ var g=new THREE.Group(); g.add(P(cyl(.34,.34,.03,20),mL(0x9A6A3A),0,0,0,Math.PI/2)); g.add(P(sph(.05),mL(GOLD),0,0,.03)); return g; },
  mirror:function(){ var g=new THREE.Group(); g.add(P(cyl(.1,.1,.012,18),mL(0xDDE3EC),0,.12,0,Math.PI/2)); g.add(P(cyl(.012,.012,.14),mL(GOLD),0,-.02,0)); return g; },
  book:function(){ var g=new THREE.Group(); g.add(P(box(.24,.32,.05),mL(0x6B2A22),0,0,0)); return g; },
  pen:function(){ var g=new THREE.Group(); g.add(P(cyl(.008,.004,.24),mL(0x2A2420),0,0,0)); return g; },
  lotus:function(){ var g=new THREE.Group(); for(var i=0;i<6;i++){ var a=i*1.047; g.add(P(cone(.035,.1,4),mL(0xE8A0B8),Math.cos(a)*.04,.03,Math.sin(a)*.04,Math.cos(a)*.5,0,Math.sin(a)*.5)); } g.add(P(sph(.03),mL(0xE8C27A),0,.02,0)); return g; },
  wheat:function(){ var g=new THREE.Group(); for(var i=0;i<5;i++) g.add(P(cyl(.006,.006,.5),mL(0xC7A043),(i-2)*.015,.1,0,0,0,(i-2)*.08)); g.add(P(box(.07,.14,.03),mL(0xD4B83C),0,.34,0)); return g; },
  cup:function(){ var g=new THREE.Group(); g.add(P(cyl(.07,.03,.12,12),mL(GOLD),0,.06,0)); g.add(P(cyl(.01,.01,.06),mL(GOLD),0,-.03,0)); return g; },
  apple:function(){ var g=new THREE.Group(); g.add(P(sph(.05),mL(0xC7A043),0,0,0)); return g; },
  pomegranate:function(){ var g=new THREE.Group(); g.add(P(sph(.055),mL(0xA8322B),0,0,0)); g.add(P(cone(.02,.03,5),mL(0xA8322B),0,.06,0)); return g; },
  peach:function(){ var g=new THREE.Group(); g.add(P(sph(.055),mL(0xE8A088),0,0,0)); return g; },
  crookflail:function(){ var g=new THREE.Group(); g.add(P(cyl(.015,.015,.45),mL(GOLD),-.05,0,0,0,0,.35)); g.add(P(tor(.04,.012,Math.PI),mL(GOLD),-.13,.22,0));
    g.add(P(cyl(.015,.015,.4),mL(0x2F5E9E),.05,0,0,0,0,-.35)); return g; },
  fan:function(){ var g=new THREE.Group(); g.add(P(cyl(.18,.18,.01,16,1),mL(0xE8E4DA),0,.12,0,Math.PI/2)); g.add(P(cyl(.012,.012,.16),mL(0x5A3A22),0,-.04,0)); return g; },
  gourd:function(){ var g=new THREE.Group(), m=mL(0xB8945A); g.add(P(sph(.08),m,0,0,0)); g.add(P(sph(.055),m,0,.11,0)); return g; },
  vase:function(){ var g=new THREE.Group(); g.add(P(sph(.06),mL(0xE8E4DA),0,0,0)); g.add(P(cyl(.02,.03,.1),mL(0xE8E4DA),0,.08,0)); g.add(P(cyl(.004,.004,.2),mL(0x3F7A3A),0,.2,0,0,0,.3)); return g; },
  flute:function(){ var g=new THREE.Group(); g.add(P(cyl(.015,.015,.5),mL(0x8A6A3A),0,0,0,0,0,Math.PI/2)); return g; },
  drum:function(){ var g=new THREE.Group(); g.add(P(cyl(.08,.08,.14,14),mL(0x8A5A3A),0,0,0)); return g; },
  conch:function(){ var g=new THREE.Group(); g.add(P(cone(.06,.18,8),mL(0xF2EEE6),0,0,0,0,0,1.2)); return g; },
  discus:function(){ var g=new THREE.Group(); var r=P(tor(.12,.02),mG(0xE8C27A,.95),0,.1,0); r.userData.spin=1; g.add(r); return g; },
  club:function(){ var g=new THREE.Group(); g.add(P(cyl(.025,.03,.7),mL(0x6B4A32),0,0,0)); g.add(P(sph(.09),mL(GOLD),0,.4,0)); return g; },
  noose:function(){ var g=new THREE.Group(); g.add(P(tor(.1,.012),mL(0xB8945A),0,0,0)); return g; },
  skull:function(){ var g=new THREE.Group(); g.add(P(sph(.07),mL(0xE6DCC2),0,0,0)); return g; },
  wheel:function(){ var g=new THREE.Group(), m=mL(GOLD); g.add(P(tor(.2,.02),m,0,0,0)); for(var i=0;i<4;i++) g.add(P(box(.4,.015,.015),m,0,0,0,0,0,i*.785)); return g; },
  horn:function(){ var g=new THREE.Group(); g.add(P(cone(.05,.4,8),mL(GOLD),0,.1,0,0,0,.4)); return g; },
  castanets:function(){ var g=new THREE.Group(); g.add(P(box(.06,.18,.02),mL(0x6B4A32),-.02,0,0)); g.add(P(box(.06,.18,.02),mL(0x6B4A32),.02,0,0)); return g; },
  flowerbasket:function(){ var g=new THREE.Group(); g.add(P(cyl(.1,.07,.1,10),mL(0x8A6A3A),0,0,0)); g.add(P(sph(.05),mL(0xE8A0B8),-.03,.07,0)); g.add(P(sph(.04),mL(0xD4B83C),.04,.07,.02)); return g; },
  coins:function(){ var g=new THREE.Group(); for(var i=0;i<4;i++) g.add(P(cyl(.04,.04,.01,12),mL(GOLD),(i%2)*.02,i*.012,0)); return g; },
  fish:function(){ var g=new THREE.Group(); g.add(P(sph(.07),mL(0xC0392B),0,0,0)); g.children[0].scale.set(2,1,.5); g.add(P(cone(.05,.08,4),mL(0xC0392B),-.17,0,0,0,0,Math.PI/2)); return g; },
  hook:function(){ var g=new THREE.Group(); g.add(P(tor(.1,.02,Math.PI*1.3),mL(0xE6DCC2),0,0,0)); return g; },
  sickle:function(){ var g=new THREE.Group(); g.add(P(tor(.16,.015,Math.PI),mL(0xA7AAB0),0,.15,0)); g.add(P(cyl(.015,.015,.2),mL(0x5A3A22),-.16,.05,0)); return g; }
};
var AT_FEET={anvil:1,cauldron:1};
var ON_SHOULDER={owl:1,raven:1,ravens:1,dove:1,eagle:1,bird:1};
var BESIDE={dog:1,dogs:1,wolf:1,wolves:1,cat:1,cats:1,horse:1,stag:1,goat:1,boar:1,lion:1,rat:1,bull:1,cow:1,swan:1,peacock:1,rabbit:1,serpent:1,spider:1};

function bird(col,s){ var g=new THREE.Group(); g.add(P(sph(.07*s),mL(col),0,0,0)); g.add(P(sph(.045*s),mL(col),0,.07*s,.04*s));
  g.add(P(cone(.015*s,.04*s,4),mL(0x3A3020),0,.06*s,.09*s,Math.PI/2)); return g; }
function quad(col,s,extra){
  var g=new THREE.Group(), m=mL(col);
  g.add(P(box(.3*s,.26*s,.7*s),m,0,.45*s,0)); g.add(P(box(.2*s,.2*s,.26*s),m,0,.62*s,.42*s));
  [[-.1,-.26],[.1,-.26],[-.1,.26],[.1,.26]].forEach(function(p){ g.add(P(cyl(.04*s,.035*s,.36*s,6),m,p[0]*s,.18*s,p[1]*s)); });
  if(extra) extra(g,m,s);
  return g;
}
function companion(k){
  if(k==="owl") return bird(0x7A5A3A,1.2);
  if(k==="raven"||k==="ravens") return bird(0x141418,1);
  if(k==="dove") return bird(0xF2EEE6,.9);
  if(k==="eagle") return bird(0x5A4230,1.5);
  if(k==="bird") return bird(0x6A8AB0,.9);
  if(k==="dog"||k==="dogs") return quad(0x2A2622,1);
  if(k==="wolf"||k==="wolves") return quad(0x6E6A66,1.15);
  if(k==="cat"||k==="cats") return quad(0x1A1A1E,.5);
  if(k==="rat") return quad(0x6E665E,.25);
  if(k==="horse") return quad(0xE8E4DA,2.3);
  if(k==="goat") return quad(0x7A6A5A,1,function(g,m,s){ g.add(P(cone(.03,.2,5),mL(0x2A2622),-.05,.8,.42,-.5)); g.add(P(cone(.03,.2,5),mL(0x2A2622),.05,.8,.42,-.5)); });
  if(k==="stag") return quad(0x8A6A4A,1.9,function(g,m,s){ [-1,1].forEach(function(sd){ g.add(P(cyl(.012,.012,.5,5),mL(0x5A4A3A),sd*.1,1.45,.8,0,0,sd*.5)); }); });
  if(k==="boar") return quad(0x4A3A30,1.1,function(g,m,s){ g.add(P(cone(.02,.1,5),mL(0xE6DCC2),.07,.6,.6,-1.2)); g.add(P(cone(.02,.1,5),mL(0xE6DCC2),-.07,.6,.6,-1.2)); });
  if(k==="lion") return quad(0xB8883A,1.8,function(g,m,s){ g.add(P(new THREE.IcosahedronGeometry(.22,1),mL(0x8A5A2A),0,1.1,.7)); });
  if(k==="bull"||k==="cow") return quad(k==="bull"?0xE8E4DA:0xC9B38E,2.1);
  if(k==="swan") return bird(0xF2EEE6,2.4);
  if(k==="peacock"){ var p=bird(0x2F5E9E,1.8); p.add(P(cyl(.5,.5,.02,20,1,false,Math.PI*1.1,Math.PI*.8),mL(0x2F7A5A),0,.35,-.15,Math.PI/2)); return p; }
  if(k==="rabbit") return quad(0xF2EEE6,.35,function(g){ g.add(P(box(.04,.18,.02),mL(0xF2EEE6),-.04,.33,.16)); g.add(P(box(.04,.18,.02),mL(0xF2EEE6),.04,.33,.16)); });
  if(k==="spider"){ var sp=new THREE.Group(); sp.add(P(sph(.16),mL(0x2A2220),0,.2,0)); for(var i=0;i<8;i++){ var a=i*.785; sp.add(P(cyl(.012,.012,.4,4),mL(0x2A2220),Math.cos(a)*.2,.12,Math.sin(a)*.2,0,-a,Math.PI/2.6)); } return sp; }
  if(k==="serpent"){ var sg=new THREE.Group(); for(var j=0;j<3;j++) sg.add(P(tor(.22-j*.05,.04),mL(0x3F7A3A),0,.05+j*.08,0,Math.PI/2)); sg.add(P(sph(.06),mL(0x3F7A3A),0,.3,.08)); return sg; }
  return null;
}

/* ---------- a deity: body, then iconography ---------- */
function buildDeity(spec,f){
  var d=spec.deity?DEITY[spec.deity]:null;
  var g=buildFigure(spec,f), body=g.children[0], L=lookOf(spec), limbs=g.userData.limbs;
  if(!d){ addAura(g,"glow"); body.scale.multiplyScalar(1.25); return g; }
  var ic=d.icons, has=function(t){ return hasIcon(d,t); };
  var headY=1.72;
  function hideParts(names){ body.traverse(function(m){ if(m.userData&&names.indexOf(m.userData.part)>-1) m.visible=false; }); }
  /* animal heads replace the human head */
  var hk=iconVal(d,"head");
  if(hk&&HEADS[hk]){ hideParts(["head","haircap","hairlong","bun","tail","curly","afro","coily","locs","braid","braidband","buzzcap","waves","wrap","wrapknot","eye","hatcap","brimcap","crown","brim","hood"]); var H=HEADS[hk](); H.position.set(0,headY,0); body.add(H); }
  if(has("skull")){ hideParts(["eye"]); var sk=new THREE.Group(); sk.add(P(sph(.118),mL(0xE6DCC2),0,0,0)); sk.add(P(sph(.03),mG(0x111111,1),-.045,.02,.09)); sk.add(P(sph(.03),mG(0x111111,1),.045,.02,.09)); sk.position.set(0,headY,0); body.add(sk); }
  /* crowns and what sits on the head */
  var gold=mL(GOLD);
  if(has("crown")){ body.add(P(cyl(.12,.13,.08,10),gold,0,headY+.12,0)); for(var i=0;i<5;i++){ var a=i*1.2566; body.add(P(cone(.02,.07,4),gold,Math.cos(a)*.11,headY+.19,Math.sin(a)*.11)); } }
  if(has("crownwhite")){ body.add(P(cone(.09,.34,10),mL(0xE8E4DA),0,headY+.28,0)); body.add(P(box(.03,.3,.01),mL(0xE8E4DA),-.1,headY+.24,0)); body.add(P(box(.03,.3,.01),mL(0xE8E4DA),.1,headY+.24,0)); }
  if(has("crownred")){ body.add(P(cyl(.12,.12,.12,10),mL(0xA8322B),0,headY+.14,0)); body.add(P(cone(.07,.26,10),mL(0xE8E4DA),0,headY+.3,0)); }
  if(has("sundisc")) body.add(P(sph(.14,14,10),mG(0xE8561E,1),0,headY+.32,-.02));
  if(has("cowhorns")){ body.add(P(tor(.16,.022,Math.PI),mL(0x2A2622),0,headY+.2,-.02)); }
  if(has("horns")){ body.add(P(cone(.035,.22,6),mL(0x2A2622),-.08,headY+.18,0,0,0,.5)); body.add(P(cone(.035,.22,6),mL(0x2A2622),.08,headY+.18,0,0,0,-.5)); }
  if(has("antlers")) [-1,1].forEach(function(sd){ var m=mL(0x5A4A3A);
    body.add(P(cyl(.015,.018,.4,5),m,sd*.14,headY+.28,0,0,0,sd*-.6)); body.add(P(cyl(.01,.012,.18,5),m,sd*.22,headY+.42,0,0,0,sd*.3)); body.add(P(cyl(.01,.012,.16,5),m,sd*.1,headY+.4,0,0,0,sd*-.1)); });
  if(has("mooncrown")) body.add(P(tor(.1,.02,Math.PI),mG(0xDDE3EC,1),0,headY+.2,0,0,0,Math.PI));
  if(has("halo")) body.add(P(tor(.3,.02),mG(0xE8C27A,.9),0,headY+.02,-.14));
  if(has("feather")) body.add(P(box(.05,.36,.01),mL(0xF2EEE6),0,headY+.28,-.02,-.1));
  if(has("plumes")){ body.add(P(box(.05,.5,.01),mL(GOLD),-.03,headY+.36,0)); body.add(P(box(.05,.5,.01),mL(GOLD),.03,headY+.36,0)); }
  if(has("helmet")){ body.add(P(new THREE.SphereGeometry(.132,14,8,0,Math.PI*2,0,Math.PI*.55),mL(0x9A6A3A),0,headY+.01,0)); body.add(P(box(.03,.12,.26),mL(0xA8322B),0,headY+.16,-.02)); }
  if(has("wingedhelm")){ body.add(P(new THREE.SphereGeometry(.13,14,8,0,Math.PI*2,0,Math.PI*.5),mL(GOLD),0,headY+.01,0));
    body.add(P(box(.02,.1,.16),mL(0xF2EEE6),-.14,headY+.08,-.02,0,0,.5)); body.add(P(box(.02,.1,.16),mL(0xF2EEE6),.14,headY+.08,-.02,0,0,-.5)); }
  if(has("cap")) body.add(P(new THREE.SphereGeometry(.12,14,8,0,Math.PI*2,0,Math.PI*.45),mL(0x2F5E9E),0,headY+.01,0));
  if(has("laurel")) body.add(P(tor(.12,.016),mL(0x3F7A3A),0,headY+.06,0,Math.PI/2));
  if(has("veil")) body.add(P(cone(.3,.62,14),new THREE.MeshLambertMaterial({color:L.top||0x5E5E64,transparent:true,opacity:.8}),0,headY-.12,-.02));
  if(has("longbeard")||has("beard")){ var bl=has("longbeard")?.3:.14; body.add(P(box(.13,bl,.06),mL(L.hair!==null&&L.hair!==undefined?L.hair:0x9A9690),0,headY-.1-bl/2+.04,.08)); }
  if(has("thirdeye")) body.add(P(box(.015,.04,.01),mG(0xA8322B,1),0,headY+.06,.112));
  if(has("onesight")) body.add(P(box(.05,.03,.01),mL(0x111111),-.04,headY+.015,.11));
  if(has("tripleface")||has("fourfaces")||has("twoface")){
    var angs=has("twoface")?[Math.PI]:has("fourfaces")?[Math.PI/2,Math.PI,-Math.PI/2]:[2.09,-2.09];
    angs.forEach(function(a){ var hh=P(sph(.105),figMat(L.skin!==null&&L.skin!==undefined?L.skin:STATUE.skin,f,false),Math.sin(a)*.06,headY,Math.cos(a)*.06); body.add(hh);
      body.add(P(sph(.014),mG(0x1A1614,1),Math.sin(a)*.16+Math.cos(a)*.04,headY+.015,Math.cos(a)*.16-Math.sin(a)*.04)); });
  }
  if(has("halfface")){ var dark=mL(0x3A4250);
    body.add(P(new THREE.SphereGeometry(.116,12,10,0,Math.PI),dark,0,headY,0,0,-Math.PI/2)); body.add(P(new THREE.CylinderGeometry(.19,.165,.58,10,1,false,0,Math.PI),dark,0,1.28,0,0,-Math.PI/2)); }
  if(has("serpenttail")){ hideParts(["leg","shoe","hips","skirt","dress"]); limbs.ll.visible=false; limbs.rl.visible=false;
    for(var s=0;s<9;s++){ var t=s/8; body.add(P(sph(.2-t*.13),mL(L.top||0x3F7A3A),Math.sin(t*6)*(.2+t*.2),.9-t*.82,Math.cos(t*6)*(.2+t*.2)-.1)); } }
  if(has("formless")){ body.traverse(function(m){ if(m.isMesh&&m.userData.part!=="eye") m.visible=false; }); }
  if(has("onehand")) limbs.ra.children.forEach(function(m){ if(m.userData.part==="hand") m.visible=false; });
  if(has("silverhand")) limbs.ra.children.forEach(function(m){ if(m.userData.part==="hand") m.material=mL(0xDDE3EC); });

  /* more arms, fanned out from the shoulders */
  var extra=has("arms10")?4:has("arms8")?3:has("arms4")?1:0, armMat=null, handMat=null;
  limbs.la.children.forEach(function(m){ if(m.userData.part==="arm") armMat=m.material; if(m.userData.part==="hand") handMat=m.material; });
  var slots=[];
  for(var k=1;k<=extra;k++) [-1,1].forEach(function(sd){
    var pv=new THREE.Group(); pv.position.set(sd*.2,1.47-k*.03,-.02); pv.rotation.set(-.35,0,sd*(.55+k*.28));
    pv.add(P(cyl(.045,.038,.58),armMat||mL(0x888888),0,-.29,0)); pv.add(P(sph(.042),handMat||mL(0x888888),0,-.6,0));
    body.add(pv);
    var hx=sd*.2+Math.sin(sd*(.55+k*.28))*.6, hy=1.47-k*.03-Math.cos(.55+k*.28)*.6*Math.cos(.35), hz=-.02+.6*Math.sin(.35);
    slots.push([hx,hy,hz]);
  });

  /* what they hold: the first in the right hand, then the left, then any other hands */
  var held=ic.map(function(t){ return t.split(":")[0]; }).filter(function(t){ return HELD[t]||t==="torches"; });
  if(held.length){
    g.userData.pose={la:-.45,ra:-.45};
    limbs.la.rotation.x=-.45; limbs.ra.rotation.x=-.45;
    var sh=(L.sex==="f"?.185:L.sex==="m"?.225:.205)+.045;
    var hands=[[-sh-.02,.96,.27],[sh+.02,.96,.27]].concat(slots);
    var list=[]; held.forEach(function(t){ if(t==="torches"){ list.push("torch"); list.push("torch"); } else list.push(t); });
    list.forEach(function(t,i){
      if(i>=hands.length) return;
      var item=HELD[t](), h=hands[i];
      item.position.set(h[0],h[1],h[2]);
      if(t==="shield"){ item.position.set(sh+.08,1.1,.22); item.rotation.y=.3; }
      body.add(item);
    });
  }
  ic.forEach(function(t){ var k=t.split(":")[0];
    if(AT_FEET[k]){ var it=k==="anvil"?P(box(.5,.35,.25),mL(0x3A3C42),0,0,0):P(sph(.35),mL(IRON),0,0,0);
      it.position.set(.55,.2,.4); body.add(it); }
  });
  /* the creatures with them */
  var side=-1;
  ic.forEach(function(t){ var k=t.split(":")[0];
    if(ON_SHOULDER[k]){ var b=companion(k); b.position.set(side*.24,1.58,-.03); body.add(b);
      if(k==="ravens"){ var b2=companion(k); b2.position.set(-side*.24,1.58,-.03); body.add(b2); } side=-side; }
    if(BESIDE[k]){ var q=companion(k); if(!q) return;
      q.position.set(side*.9,0,.35); q.rotation.y=side*.4; g.add(q);
      if(/s$/.test(k)&&k!=="bus"){ var q2=companion(k); q2.position.set(-side*.9,0,.35); q2.rotation.y=-side*.4; g.add(q2); }
      side=-side; }
  });
  /* wings */
  if(has("wings")){ var wc=ICONCOL[iconVal(d,"wings")]||0xF2EEE6;
    [-1,1].forEach(function(sd){ var w=new THREE.Group(); for(var i=0;i<4;i++) w.add(P(box(.9-i*.12,.2,.02),mL(wc),sd*(.45-i*.03),.1-i*.17,0,0,0,sd*(.25+i*.1)));
      w.position.set(sd*.1,1.42,-.14); w.rotation.y=sd*-.35; w.userData.wing=sd; body.add(w); }); }
  /* companions who are people */
  if(has("twins")||has("trio")){
    var n=has("trio")?2:1;
    for(var q3=0;q3<n;q3++){ var sib={id:spec.id+":s"+q3,archetype:"human",attrs:{},look:JSON.parse(JSON.stringify(L))};
      var sibg=buildFigure(sib,f); sibg.position.set((q3?-.8:.8),0,.1); g.add(sibg); }
  }
  /* stature */
  body.scale.multiplyScalar(has("giant")?2.6:has("small")?0.8:1.25);
  /* the air around them */
  ["glow","darkaura","flames","water","storm","smoke","stars"].forEach(function(a){ if(has(a)) addAura(g,a); });
  return g;
}

/* light, darkness, fire, water or storm around a deity, animated */
function addAura(g,kind){
  var runs=g.userData.auraRuns||(g.userData.auraRuns=[]);
  if(kind==="glow"){
    var gl=P(new THREE.PlaneGeometry(2.6,3.4),new THREE.MeshBasicMaterial({color:0xFFE8B0,transparent:true,opacity:.35,depthWrite:false,map:typeof softGlow==="function"?softGlow():null}),0,1.4,-.3);
    g.add(gl); runs.push(function(t){ gl.material.opacity=.28+.1*Math.sin(t*1.3); });
  }
  if(kind==="darkaura"||kind==="smoke"){
    var dk=particles(90,[.8,3,.8],kind==="smoke"?0x9A9690:0x1A1418,1.6,.5); g.add(dk);
    runs.push(function(t,dt){ rise(dk,dt,.6,0); });
  }
  if(kind==="flames"){
    var fl=[]; for(var i=0;i<6;i++){ var a=i*1.047, m=P(cone(.12,.5,6),mG(i%2?0xFF7A1E:0xFFB23A,.85),Math.cos(a)*.55,.25,Math.sin(a)*.55); g.add(m); fl.push(m); }
    runs.push(function(t){ fl.forEach(function(m,k){ var s=.7+.45*Math.abs(Math.sin(t*7+k*1.9)); m.scale.set(1,s,1); m.position.y=.25*s; }); });
  }
  if(kind==="water"){ var wa=particles(120,[.9,2.4,.9],0x7FC8E8,1.2,.7); g.add(wa); runs.push(function(t,dt){ swirl(wa,dt,1.2,.8,false); }); }
  if(kind==="stars"){ var st=particles(60,[1,3,1],0xF2F4FF,1,.95); g.add(st); runs.push(function(t,dt){ swirl(st,dt,.3,.2,false); }); }
  if(kind==="storm"){
    var sm=particles(80,[1,3.2,1],0x44474E,1.8,.5); g.add(sm);
    var bolt=P(box(.04,1.2,.04),mG(0xE8F0FF,1),.5,2.6,0,0,0,.3); bolt.visible=false; g.add(bolt);
    runs.push(function(t,dt){ swirl(sm,dt,1.4,.6,false); bolt.visible=Math.sin(t*2.3)>.985; });
  }
  if(!g.userData.anim) g.userData.anim=function(t,dt){
    (g.userData.auraRuns||[]).forEach(function(r){ r(t,dt); });
    g.traverse(function(m){
      if(m.userData.flicker){ var s=.75+.4*Math.abs(Math.sin(t*8+m.id)); m.scale.set(1,s,1); }
      if(m.userData.spin) m.rotation.z+=dt*3;
    });
  };
}

/* ---------- dragons and great serpents ---------- */
function buildDragon(spec,f,icons){
  var d=spec.deity?DEITY[spec.deity]:null;
  var ic=icons||(d?d.icons:["color:green","size:2","wings","legs"]);
  function val(k,def){ var v=def; ic.forEach(function(t){ var p=t.split(":"); if(p[0]===k) v=p.length>1?p[1]:true; }); return v; }
  var col=ICONCOL[val("color","green")]||0x3F7A3A, size=parseFloat(val("size",2)), heads=parseInt(val("heads",1),10);
  var wings=!!val("wings",false), legs=!!val("legs",false), hood=!!val("hood",false), feathered=!!val("feathered",false), sea=!!val("sea",false);
  var mat=mL(col), belly=mL(shade(col,.25)), dark=mL(shade(col,-.4)), eye=mG(0xE8C27A,1);
  var g=new THREE.Group(), body=new THREE.Group(); g.add(body);
  /* one continuous body: many close-set segments, tapering to the tail */
  var N=30, Lh=26, segs=[];
  for(var i=0;i<N;i++){
    var t=i/(N-1), r=1.15*(0.22+0.78*Math.min(1,t*1.3))*(t>0.93?1-(t-0.93)*3.5:1);
    var x=Math.sin(t*Math.PI*2.2)*2.2, z=(t-0.5)*Lh;
    var y=sea?Math.sin(t*Math.PI*3.2)*r*1.9-r*0.3:(legs?2.3:r*0.9);
    var m=P(sph(r,12,9),mat,x,y,z); m.scale.set(1,0.92,1.25); body.add(m); segs.push({m:m,y0:y,t:t});
    if(i%3===0&&i<N-2) body.add(P(cone(r*.2,r*.55,5),dark,x,y+r*.9,z));
    if(!sea) { var bl=P(sph(r*.8,10,6),belly,x,y-r*.28,z); bl.scale.set(1,.5,1.2); body.add(bl); }
    if(feathered&&i%2===1) [-1,1].forEach(function(sd){ body.add(P(box(.08,r*1.3,.6),mL([0x2E8A5E,0xC0392B,0xC7A043][i%3]),x+sd*r*.9,y+r*.4,z,0,0,sd*.6)); });
  }
  var neck=segs[N-1].m.position;
  /* heads: one reaches forward; many fan out and up on long necks */
  for(var hIdx=0;hIdx<heads;hIdx++){
    var spread=heads>1?(hIdx/(heads-1)-0.5)*2.4:0, lift=heads>1?(1.6+Math.cos(spread*1.3)*2.2):1;
    var reach=heads>1?5.5:2.2;
    var hx=neck.x+Math.sin(spread)*reach, hz=neck.z+Math.cos(spread)*reach*0.8, hy=neck.y+lift;
    var steps=heads>1?6:3;
    for(var n=1;n<=steps;n++){ var k=n/(steps+1), bend=Math.sin(k*Math.PI)*0.9;
      body.add(P(sph(.6-k*.22,10,8),mat,neck.x+(hx-neck.x)*k,neck.y+(hy-neck.y)*k+bend,neck.z+(hz-neck.z)*k)); }
    var head=new THREE.Group(); head.position.set(hx,hy,hz); head.rotation.y=spread*0.6;
    head.add(P(box(1,.8,1.3),mat,0,0,0)); head.add(P(box(.72,.36,1.25),mat,0,.02,1.1)); head.add(P(box(.66,.18,1.1),dark,0,-.3,.95,.18));
    head.add(P(cone(.12,.95,5),dark,-.32,.55,-.45,-.75)); head.add(P(cone(.12,.95,5),dark,.32,.55,-.45,-.75));
    head.add(P(sph(.11),eye,-.37,.2,.42)); head.add(P(sph(.11),eye,.37,.2,.42));
    if(hood) head.add(P(cyl(1.3,1.3,.08,16),mL(shade(col,-.15)),0,.1,-.5,Math.PI/2));
    if(feathered) for(var q=0;q<9;q++){ var a=q*.7; head.add(P(box(.1,1,.1),mL([0x2E8A5E,0xC0392B,0xC7A043][q%3]),Math.cos(a)*.75,Math.sin(a)*.75,-.55,0,0,a-Math.PI/2)); }
    body.add(head);
  }
  var flying=wings&&!sea;
  if(legs) [.3,.66].forEach(function(tt){ var s=segs[Math.round(tt*(N-1))].m.position;
    [-1,1].forEach(function(sd){
      if(flying){ body.add(P(cyl(.3,.22,2.3,7),mat,s.x+sd*1.1,s.y-.9,s.z-1,-1.25)); }
      else { body.add(P(cyl(.3,.22,2.3,7),mat,s.x+sd*1.1,1.15,s.z)); body.add(P(cone(.14,.5,4),dark,s.x+sd*1.1,.1,s.z+.35,Math.PI/2)); }
    }); });
  /* wings: a membrane stretched between finger bones, with a scalloped trailing edge */
  var wingG=[];
  if(wings){ var ws=segs[Math.round(0.6*(N-1))].m.position;
    var shp=new THREE.Shape();
    shp.moveTo(0,0); shp.lineTo(3,4.5); shp.lineTo(11,3.2);
    shp.quadraticCurveTo(9.5,1.2,9,-.6); shp.quadraticCurveTo(7,.4,6,-1.4); shp.quadraticCurveTo(4,-.2,2.8,-1.8); shp.quadraticCurveTo(1.5,-.6,0,-1.2); shp.lineTo(0,0);
    var wgeo=new THREE.ShapeGeometry(shp);
    [-1,1].forEach(function(sd){
      /* w turns about the body's length (the flap); the membrane inside lies in the wing's plane,
         leading edge forward, and its finger bones are children of it, so they can't drift apart */
      var w=new THREE.Group(); w.position.set(ws.x+sd*.9,ws.y+.7,ws.z+1.5);
      var mem=new THREE.Mesh(wgeo,new THREE.MeshLambertMaterial({color:shade(col,-.22),side:THREE.DoubleSide,transparent:true,opacity:.94}));
      mem.rotation.x=Math.PI/2; mem.scale.set(sd,1,1); w.add(mem);
      [[3,4.5],[11,3.2],[9,-.6],[6,-1.4],[2.8,-1.8]].forEach(function(pt){
        var len=Math.sqrt(pt[0]*pt[0]+pt[1]*pt[1]);
        var bone=new THREE.Mesh(new THREE.BoxGeometry(len,.18,.18),dark);
        bone.position.set(pt[0]/2,pt[1]/2,0); bone.rotation.z=Math.atan2(pt[1],pt[0]);
        mem.add(bone);
      });
      body.add(w); wingG.push({g:w,sd:sd}); }); }
  if(val("stars",false)){ var sp=particles(120,[4,4,12],0xF2F4FF,1.4,.9); sp.position.y=3; body.add(sp); }
  body.scale.multiplyScalar(size);
  var fly=wings&&!sea;
  if(!fly) g.add(contactShadow(6*size));
  g.userData.anim=function(t,dt){
    segs.forEach(function(s,k){ s.m.position.y=s.y0+Math.sin(t*1.4+k*.55)*.25; });
    wingG.forEach(function(w){ w.g.rotation.z=w.sd*(.35+Math.sin(t*1.8)*.42); });
    if(fly){ body.position.set(Math.cos(t*.07)*14,16+Math.sin(t*.6)*1.4,Math.sin(t*.07)*14); body.rotation.y=-t*.07; }
  };
  return g;
}

