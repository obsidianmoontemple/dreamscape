/* SomnuMatrix — deity-look.js
   no two powers alike. Every deity is dressed from who they are:
     - their own people: skin, hair and face from their tradition, never a
       grey statue; goddesses as goddesses
     - their tradition's own dress, on top of their own colours: a Greek
       himation, a Norse fur mantle, an Egyptian broad collar and headcloth,
       Hindu gold and a sash, a Japanese obi and sleeves, a Chinese court
       robe, a Sumerian fleece skirt, a Mexica feather crown, orisha beads,
       a Celtic torc and cloak, a Slavic embroidered belt, a Polynesian lei,
       the tattered cloak of the adversaries
     - their own sign: the sun, the moon, a wave, a flame, a leaf, a bolt…
       hung glowing behind them, and carved over their temple's door
   and every temple on Temple Row takes its colours, its banners and its sign
   from the power who lives there.
   loaded as a plain script; shares scope with the other files */
"use strict";

var DEITY_F={hera:1,demeter:1,athena:1,artemis:1,aphrodite:1,hestia:1,persephone:1,hecate:1,nemesis:1,nyx:1,selene:1,gaia:1,echidna:1,
  juno:1,minerva:1,venus:1,vesta:1,diana:1,ceres:1,fortuna:1,frigg:1,sif:1,idunn:1,freyja:1,skadi:1,hel:1,
  isis:1,maat:1,nephthys:1,sekhmet:1,hathor:1,bastet:1,nut:1,taweret:1,lakshmi:1,saraswati:1,parvati:1,durga:1,kali:1,ganga:1,
  amaterasu:1,izanami:1,inari:1,benzaiten:1,inanna:1,ereshkigal:1,ninhursag:1,tiamat:1,oya:1,osun:1,yemoja:1,
  brigid:1,morrigan:1,airmid:1,eriu:1,rhiannon:1,cerridwen:1,arianrhod:1,orddu:1,mokosh:1,morana:1,babayaga:1,
  erzulie:1,mamanbrigitte:1,nuwa:1,xiwangmu:1,change:1,guanyin:1,mazu:1,hexiangu:1,xochiquetzal:1,coatlicue:1,chalchiuhtlicue:1,
  pachamama:1,mamaquilla:1,asaseyaa:1,pele:1,hina:1,papatuanuku:1,anahita:1,lilith:1,naamah:1,matres:1,epona:1,ixchel:1};
var TRAD_SKIN={
  Greek:[0xC89A70,0xD8B08A,0xB88660],Roman:[0xD0A27A,0xC08E66,0xDDB592],Hebrew:[0xC8986C],
  Norse:[0xF0D2B8,0xE8C4A6,0xDDB596],Slavic:[0xF0D4BC,0xE6C2A2],Irish:[0xF2D6C0,0xE8C6A8],Welsh:[0xF0D2BA,0xE4C0A0],Gaulish:[0xE8C8A8,0xDCB896],"Anglo-Saxon":[0xEED0B6],
  Egyptian:[0x9A6A44,0xB07A50,0x8A5A38],Hindu:[0xB07A50,0x9A6844,0xC48A5C],Japanese:[0xEAC8A2,0xDDB890],Chinese:[0xE6C49C,0xDAB48A],
  Mesopotamian:[0xB8885E,0xA87A52],Persian:[0xC0906A,0xB08060],Aztec:[0xA8724A,0x9A6440],Maya:[0x9E6A44,0xA8724A],Inca:[0xA06A44,0x946040],
  Yoruba:[0x5A3A26,0x6A4430,0x4A2E1E],Akan:[0x5E3C28,0x4E3220],Vodou:[0x5A3A26,0x6A4632],Hawaiian:[0x9A6640],Polynesian:[0x9A6640,0x8A5A38],
  Demonology:[0xB8A8A0,0x8A3A30,0x6A6070],Qliphothic:[0xC8C0C8,0x5A4A5A],Adversarial:[0xD8C8B8,0x9A4A3A]};
var TRAD_HAIR={Norse:[0xD8B46A,0xB0702E,0x8A5A2A],Irish:[0xA0441E,0xC86A2E,0x3A2A1A],Welsh:[0x3A2A1A,0x8A4A22],Slavic:[0xC8A060,0x6A4A2A],
  Gaulish:[0xB07A3A,0x5A3A22],Greek:[0x2A1E16,0x4A3220,0x8A6A3A],Roman:[0x2A1E16,0x3A2A1A],
  Demonology:[0x111114,0x6A1A1A],Qliphothic:[0x0E0E12,0xE8E4DA],Adversarial:[0x1A1418,0xC8C0B0]};
var TRAD_ROBE={Greek:0xE8E4DA,Roman:0xE0D8C4,Norse:0x5A6A7A,Egyptian:0xEDE6D4,Hindu:0xD8822A,Japanese:0xC0392B,Chinese:0xB03A2E,
  Mesopotamian:0xC8A882,Persian:0x8A2A3A,Aztec:0x2E8A6A,Maya:0x3A8A5A,Inca:0xD4B83C,Yoruba:0xF2EEE6,Akan:0xD4B83C,Vodou:0x8A2A6A,
  Irish:0x3F7A3A,Welsh:0x4A7A5A,Gaulish:0x6A8A4A,Slavic:0xE8E0CC,Hawaiian:0x2E8A8A,Polynesian:0x9A6A3A,
  Demonology:0x2A1A1A,Qliphothic:0x2A1A34,Adversarial:0x2A1820,"Anglo-Saxon":0x6A5A3A,Hebrew:0xE8E4DA};
var HEADWEAR=["crown","crownwhite","crownred","helmet","wingedhelm","cap","hat","laurel","mooncrown","veil","hood","head","sundisc","horns",
  "antlers","cowhorns","feather","plumes","skull","formless","halfface","tripleface","fourfaces","twoface"];

/* the power's own sign, from what they rule */
var DOMAIN_SIGNS=[
  [/\bsun\b|daylight|\bdawn\b|\blight\b/,"sun",0xF2B33A],[/\bmoon\b|\bnight\b|stars|dreams|sleep/,"moon",0xC8D4F0],
  [/\bsea\b|ocean|water|river|rain|lake|flood|tide/,"wave",0x3AA8C8],[/thunder|storm|lightning|\bsky\b|wind/,"bolt",0x9AD0FF],
  [/\bfire\b|forge|hearth|volcano|flame/,"flame",0xF06A2A],[/death|\bdead\b|underworld|grave|souls|decay/,"hourglass",0x8A5AC8],
  [/\bwar\b|battle|warriors|strife|courage/,"sword",0xC83A2A],[/love|beauty|desire|marriage|fertility|childbirth/,"heart",0xF07AA8],
  [/harvest|grain|earth|forest|wild|hunt|crops|farm|plants|healing|herbs|spring/,"leaf",0x5AB84A],
  [/wisdom|knowledge|writing|magic|craft|prophecy|poetry|music|learning|law|justice/,"eye",0x5A8AF0]];
function deitySign(d){
  var t=String(d.domains||"").toLowerCase();
  for(var i=0;i<DOMAIN_SIGNS.length;i++) if(DOMAIN_SIGNS[i][0].test(t)) return {kind:DOMAIN_SIGNS[i][1],col:DOMAIN_SIGNS[i][2]};
  return {kind:"star",col:0xE8C27A};
}
/* the sign as a little sculpture, about a metre across, facing +z */
var SIGN_TPL={}, SIGN_MAT={}, SIGN_GEO={};
/* every sign of a kind shares one set of shapes, and every colour one set of paints */
function signShape(kind,col,glow){
  var tpl=SIGN_TPL[kind]||(SIGN_TPL[kind]=signShapeBuild(kind,0xFFFFFF,false));
  var g=tpl.clone(true);
  g.traverse(function(o){
    if(!o.isMesh) return;
    var role=o.userData.role||"m", key=col+"|"+(glow?1:0)+"|"+role;
    o.material=SIGN_MAT[key]||(SIGN_MAT[key]=glow?new THREE.MeshBasicMaterial({color:role==="dk"?blend(col,0x000000,0.55):col,transparent:true,opacity:0.92,depthWrite:false})
      :new THREE.MeshLambertMaterial({color:role==="dk"?blend(col,0x000000,0.55):col}));
  });
  return g;
}
function signShapeBuild(kind,col,glow){
  var g=new THREE.Group(), m=glow?new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.92,depthWrite:false}):new THREE.MeshLambertMaterial({color:col});
  var dk=glow?new THREE.MeshBasicMaterial({color:blend(col,0x000000,0.55),transparent:true,opacity:0.9,depthWrite:false}):new THREE.MeshLambertMaterial({color:blend(col,0x000000,0.55)});
  var gi=0;
  function add(geo,mat,x,y,z,rz,sx,sy){ SIGN_GEO[kind+(gi++)]=geo; var o=new THREE.Mesh(geo,mat||m); o.userData.role=(mat===dk)?"dk":"m"; o.position.set(x||0,y||0,z||0); if(rz) o.rotation.z=rz; if(sx||sy) o.scale.set(sx||1,sy||1,1); g.add(o); return o; }
  var disc=function(r){ var c=new THREE.CylinderGeometry(r,r,0.06,28); c.rotateX(Math.PI/2); return c; };
  if(kind==="sun"){ add(disc(0.26)); for(var i=0;i<10;i++){ var a=i/10*Math.PI*2; add(new THREE.ConeGeometry(0.06,0.2,8),m,Math.cos(a)*0.38,Math.sin(a)*0.38,0,a-Math.PI/2); } }
  else if(kind==="moon"){ add(new THREE.TorusGeometry(0.32,0.09,10,32,Math.PI*1.25),m,0,0,0,Math.PI*0.37); }
  else if(kind==="wave"){ for(var w=0;w<3;w++) add(new THREE.TorusGeometry(0.18,0.045,8,20,Math.PI),m,-0.36+w*0.36,(w%2?-0.04:0.04),0,w%2?Math.PI:0); }
  else if(kind==="bolt"){ [[0.08,0.22,0.5],[-0.06,0,-0.5],[0.06,-0.22,0.5]].forEach(function(b){ add(new THREE.BoxGeometry(0.1,0.32,0.06),m,b[0],b[1],0,b[2]); }); }
  else if(kind==="flame"){ add(new THREE.ConeGeometry(0.2,0.6,16),m,0,0.02); add(new THREE.ConeGeometry(0.11,0.36,12),dk,0,-0.06,0.08); }
  else if(kind==="hourglass"){ add(new THREE.ConeGeometry(0.2,0.3,16),m,0,0.15,0,Math.PI); add(new THREE.ConeGeometry(0.2,0.3,16),m,0,-0.15); add(new THREE.BoxGeometry(0.5,0.05,0.08),dk,0,0.31); add(new THREE.BoxGeometry(0.5,0.05,0.08),dk,0,-0.31); }
  else if(kind==="sword"){ add(new THREE.BoxGeometry(0.07,0.62,0.04),m,0,0.08); add(new THREE.BoxGeometry(0.32,0.06,0.06),dk,0,-0.22); add(new THREE.BoxGeometry(0.06,0.16,0.06),dk,0,-0.33); }
  else if(kind==="heart"){ add(new THREE.SphereGeometry(0.15,16,12),m,-0.1,0.08); add(new THREE.SphereGeometry(0.15,16,12),m,0.1,0.08); add(new THREE.ConeGeometry(0.24,0.34,16),m,0,-0.14,0,Math.PI); }
  else if(kind==="leaf"){ var lf=add(new THREE.SphereGeometry(0.24,16,12),m,0,0.04,0,0.5); lf.scale.set(0.55,1.25,0.25); add(new THREE.BoxGeometry(0.03,0.5,0.03),dk,0,-0.02,0.04,0.5); }
  else if(kind==="eye"){ var ey=add(new THREE.TorusGeometry(0.26,0.04,8,32),m); ey.scale.set(1,0.55,1); add(disc(0.09),dk,0,0,0.02); }
  else { for(var s=0;s<5;s++){ var sa=s/5*Math.PI*2+Math.PI/2; add(new THREE.ConeGeometry(0.08,0.3,8),m,Math.cos(sa)*0.15,Math.sin(sa)*0.15,0,sa-Math.PI/2); } add(disc(0.12)); }
  return g;
}

/* ---- who they are: set on their look before they are built ---- */
function pickOf(list,h){ return list[(h>>>0)%list.length]; }
function deityLookMore(spec,d){
  var L=lookOf(spec); L.src=L.src||{};
  var h=hash("dl"+d.key), t=d.trad||"Greek", f=!!DEITY_F[d.key]&&!hasIcon(d,"longbeard")&&!hasIcon(d,"beard");
  L.sex=f?"f":(L.sex||"m");
  if(L.skin===null||L.skin===undefined) L.skin=pickOf(TRAD_SKIN[t]||[0xC89A70],h);
  if(L.hair===null||L.hair===undefined) L.hair=pickOf(TRAD_HAIR[t]||[0x1E1612,0x2A1E16,0x3A2A1A],h>>>4);
  if(hasIcon(d,"longbeard")&&!L.src.hair){ L.hair=pickOf([0xE8E4DA,0xBCB8B0,0x8A847A],h>>>6); L.src.hair="tradition"; }
  if(!L.top){ L.top=TRAD_ROBE[t]||0xE8E4DA; L.bottom=shade(L.top,-0.2); L.topKind=L.topKind||"robe"; }
  var styles=f?["long","bun","braids","long","ponytail"]:["long","short","waves","long","curly"];
  if(t==="Yoruba"||t==="Akan"||t==="Vodou") styles=f?["headwrap","braids","locs","coily"]:["coily","locs","short","afro"];
  if(t==="Japanese"||t==="Chinese") styles=f?["bun","long"]:["bun","long"];
  if(!L.src.hairStyle||L.src.hairStyle==="tradition"){ L.hairStyle=pickOf(styles,h>>>8); L.src.hairStyle="tradition"; }
  L.gear="none"; L.acc=false;
  var sg=deitySign(d);
  L.eyes=(t==="Demonology"||t==="Qliphothic"||t==="Adversarial")?0xC02020:blend(sg.col,0x2A1A10,0.35);
  L.ears=(t==="Demonology"||t==="Qliphothic")?"pointed":"round";
  return L;
}
(function(){
  if(typeof deityLook!=="function") return;
  var dl=deityLook;
  deityLook=function(spec,d){ dl(spec,d); try{ deityLookMore(spec,d); }catch(e){ if(window.console) console.warn("deity look:",e); } };
})();

/* ---- their dress, put on after they are built ---- */
var DL_GEO={};
function dlg(k,make){ return DL_GEO[k]||(DL_GEO[k]=make()); }
function dressDeity(g,spec,d){
  var body=g.children[0]; if(!body) return;
  var L=lookOf(spec), t=d.trad||"Greek", f=L.sex==="f", h=hash("dd"+d.key);
  var top=L.top!==null&&L.top!==undefined?L.top:0xE8E4DA, trim=(typeof PRECINCT!=="undefined"&&PRECINCT[t]&&PRECINCT[t].trim)||0xC9A868;
  var gold=0xC9A040, sg=deitySign(d), hy=1.72, limbs=g.userData.limbs||{};
  var formless=hasIcon(d,"formless"), headgear=HEADWEAR.some(function(k){ return hasIcon(d,k); });
  if(formless) return;
  function M(c,ds){ return tmat(c,ds); }
  function add(parent,geo,mat,x,y,z,rx,ry,rz){ var o=new THREE.Mesh(geo,mat); o.position.set(x||0,y||0,z||0); if(rx||ry||rz) o.rotation.set(rx||0,ry||0,rz||0); o.userData.dl=1; parent.add(o); return o; }
  var robe=null; body.children.forEach(function(m){ if(m.userData&&m.userData.part==="robe") robe=m; });
  var gm=M(gold), tm=M(trim), am=M(sg.col);

  /* a robe that falls and flares, with a band at its hem */
  if(robe&&robe.visible!==false){
    robe.geometry=dlg("roberlathe",function(){ var pts=[]; for(var i=0;i<=10;i++){ var u=i/10; pts.push(new THREE.Vector2(0.2+0.17*Math.pow(u,1.6),0.5-u*1.0)); } pts.reverse(); return new THREE.LatheGeometry(pts,28); });
    add(body,dlg("hem",function(){ return new THREE.TorusGeometry(0.36,0.022,8,40); }),tm,0,0.07,0,Math.PI/2);
    add(body,dlg("sash",function(){ return new THREE.CylinderGeometry(0.19,0.195,0.07,24); }),tm,0,1.0,0).scale.z=0.8;
  }
  var arms=[limbs.la,limbs.ra].filter(Boolean);
  function band(parent,y,r,c){ add(parent,dlg("band"+r,function(){ return new THREE.TorusGeometry(r,0.016,8,20); }),c,0,y,0,Math.PI/2); }
  function drape(c){ /* a cloth across the body, shoulder to hip */
    var dm=M(c,true);
    add(body,dlg("drape",function(){ return new THREE.BoxGeometry(0.13,0.95,0.025); }),dm,0.02,1.2,0.125,0.05,0,0.6);
    add(body,dlg("drape",function(){ return new THREE.BoxGeometry(0.13,0.95,0.025); }),dm,0.02,1.2,-0.125,-0.05,0,-0.6);
  }
  function cloak(c){
    var cm=M(c,true);
    add(body,dlg("dlcloak",function(){ return new THREE.CylinderGeometry(0.23,0.4,1.3,24,1,true,Math.PI/2+0.3,Math.PI-0.6); }),cm,0,0.92,-0.03).scale.z=0.72;
  }
  function necklace(r,y,c,beads){
    if(beads){ var bm=M(c); for(var i=0;i<14;i++){ var a=i/14*Math.PI*2; add(body,dlg("bead",function(){ return new THREE.SphereGeometry(0.022,8,6); }),bm,Math.cos(a)*r,y-Math.max(0,Math.sin(a))*0.05,Math.sin(a)*r*0.75+0.01); } }
    else add(body,dlg("neck"+r,function(){ return new THREE.TorusGeometry(r,0.018,8,28); }),M(c),0,y,0.02,Math.PI/2-0.25).scale.y=0.78;
  }
  function headCrown(c,tall){
    add(body,dlg("dlcrown"+tall,function(){ return new THREE.CylinderGeometry(0.1,0.13,tall,10); }),M(c),0,hy+0.12+tall/2,0);
  }

  if(t==="Greek"||t==="Roman"||t==="Hebrew"){
    drape(f?blend(top,0xFFFFFF,0.35):trim===0xE8E4DA?blend(top,0x2E5E9E,0.4):trim);
    necklace(0.12,1.5,gold);
    if(!headgear) add(body,dlg("wreath",function(){ return new THREE.TorusGeometry(0.135,0.022,8,28); }),M(0x6A8A3A),0,hy+0.06,0,Math.PI/2);
  } else if(t==="Norse"||t==="Anglo-Saxon"){
    var fur=add(body,dlg("fur",function(){ return new THREE.TorusGeometry(0.2,0.085,12,28); }),M(f?0xE8E0D0:0x6A5A48),0,1.52,0,Math.PI/2); fur.scale.set(1,0.75,0.9);
    arms.forEach(function(a){ band(a,-0.32,0.05,gm); });
    if(!f) band(body,0.99,0.19,M(0x3A2A1A));
    cloak(shade(top,-0.25));
  } else if(t==="Egyptian"){
    add(body,dlg("usekh",function(){ return new THREE.CylinderGeometry(0.25,0.27,0.03,32); }),gm,0,1.5,0.01).scale.z=0.7;
    add(body,dlg("usekh2",function(){ return new THREE.CylinderGeometry(0.2,0.22,0.035,32); }),M(0x2F5E9E),0,1.52,0.012).scale.z=0.7;
    arms.forEach(function(a){ band(a,-0.18,0.05,gm); band(a,-0.5,0.042,gm); });
    if(!headgear){
      var nm=M(0x2F5E9E,true);
      add(body,dlg("nemes",function(){ return new THREE.SphereGeometry(0.145,24,14,Math.PI/2+0.95,Math.PI*2-1.9,0,1.9); }),nm,0,hy,0);
      [-1,1].forEach(function(sd){ add(body,dlg("lappet",function(){ return new THREE.BoxGeometry(0.07,0.32,0.04); }),gm,sd*0.13,hy-0.2,0.05); });
      band(body,hy+0.04,0.142,gm);
    }
  } else if(t==="Hindu"){
    necklace(0.13,1.5,gold); necklace(0.17,1.42,gold);
    arms.forEach(function(a){ band(a,-0.2,0.05,gm); band(a,-0.55,0.04,gm); });
    drape(blend(sg.col,top,0.3));
    if(!headgear) add(body,dlg("mukuta",function(){ return new THREE.ConeGeometry(0.12,0.34,12); }),gm,0,hy+0.26,0);
    add(body,dlg("bindi",function(){ return new THREE.SphereGeometry(0.014,8,6); }),M(0xC0201E),0,hy+0.07,0.132);
  } else if(t==="Japanese"||t==="Chinese"){
    add(body,dlg("obi",function(){ return new THREE.CylinderGeometry(0.2,0.205,0.16,24); }),M(t==="Japanese"?blend(sg.col,0xE8E0D0,0.3):0x2E6A4A),0,1.02,0).scale.z=0.8;
    [-1,1].forEach(function(sd){ add(body,dlg("collarv",function(){ return new THREE.BoxGeometry(0.045,0.32,0.02); }),M(0xF2EEE6),sd*0.05,1.4,0.125,0,0,sd*0.45); });
    arms.forEach(function(a){ var sl=add(a,dlg("sleeve",function(){ return new THREE.CylinderGeometry(0.07,0.15,0.42,16,1,true); }),M(shade(top,-0.08),true),0,-0.44,-0.02); sl.scale.x=0.6; });
    if(t==="Chinese"){ add(body,dlg("jade",function(){ var c=new THREE.CylinderGeometry(0.04,0.04,0.02,16); c.rotateX(Math.PI/2); return c; }),M(0x5AAA7A),0,1.02,0.17);
      if(!headgear&&!f) add(body,dlg("guan",function(){ return new THREE.BoxGeometry(0.1,0.12,0.16); }),M(0x1A1A1E),0,hy+0.17,-0.01); }
    if(!headgear&&f) add(body,dlg("kanzashi",function(){ return new THREE.BoxGeometry(0.22,0.012,0.012); }),gm,0.02,hy+0.13,-0.06,0,0,0.3);
  } else if(t==="Mesopotamian"||t==="Persian"){
    var fl=M(blend(top,0xF2EEE6,0.4));
    [0.3,0.55,0.8].forEach(function(y,i){ add(body,dlg("tier"+i,function(){ return new THREE.CylinderGeometry(0.27-i*0.03,0.35-i*0.03,0.16,24,1,true); }),fl,0,y,0); });
    if(!headgear){ add(body,dlg("horncap",function(){ return new THREE.CylinderGeometry(0.13,0.14,0.16,16); }),M(t==="Persian"?0xC8A040:0xE8DCC0),0,hy+0.15,0);
      if(t!=="Persian") [-1,1].forEach(function(sd){ add(body,dlg("chorn",function(){ return new THREE.TorusGeometry(0.11,0.016,8,16,Math.PI); }),M(0xC8B890),sd*0.01,hy+0.12+0.03,0,0,Math.PI/2,0); }); }
    necklace(0.12,1.5,gold);
  } else if(t==="Aztec"||t==="Maya"||t==="Inca"){
    var fc=[0x2E9A5A,0x2F6EC8,0xC8322E,0xE8B83A,0x2E9A5A,0x2F6EC8,0xE8B83A,0xC8322E,0x2E9A5A];
    if(!headgear||t!=="Inca") for(var q=0;q<9;q++){ var a=-1.1+q*0.275; var ft=add(body,dlg("plume",function(){ return new THREE.SphereGeometry(0.06,12,8); }),M(fc[q]),Math.sin(a)*0.22,hy+0.08+Math.cos(a)*0.22,-0.1,0,0,-a); ft.scale.set(0.6,3.2,0.3); }
    if(t==="Inca") add(body,dlg("sunpect",function(){ var c=new THREE.CylinderGeometry(0.11,0.11,0.02,24); c.rotateX(Math.PI/2); return c; }),gm,0,1.42,0.14);
    else necklace(0.15,1.47,0x3AAA7A,true);
    [-1,1].forEach(function(sd){ add(body,dlg("spool",function(){ var c=new THREE.CylinderGeometry(0.03,0.03,0.02,12); c.rotateZ(Math.PI/2); return c; }),M(0x3AAA7A),sd*0.14,hy-0.01,0); });
  } else if(t==="Yoruba"||t==="Akan"||t==="Vodou"){
    necklace(0.12,1.52,top,true); necklace(0.16,1.46,0xF2EEE6,true); necklace(0.2,1.4,sg.col,true);
    if(f&&!headgear) { var gl=add(body,dlg("gele",function(){ return new THREE.SphereGeometry(0.17,20,14,0,Math.PI*2,0,1.7); }),M(blend(top,sg.col,0.35)),0,hy+0.07,-0.02); gl.scale.set(1.1,1.0,1.05); }
    if(t==="Akan") drape(0xD4B83C);
  } else if(t==="Irish"||t==="Welsh"||t==="Gaulish"){
    add(body,dlg("torc",function(){ return new THREE.TorusGeometry(0.085,0.018,10,24,Math.PI*1.7); }),gm,0,1.56,0.01,Math.PI/2,0,Math.PI*0.65);
    cloak(shade(top,-0.3));
    add(body,dlg("brooch",function(){ var c=new THREE.CylinderGeometry(0.035,0.035,0.02,16); c.rotateX(Math.PI/2); return c; }),gm,0.12,1.48,0.13);
  } else if(t==="Slavic"){
    var rm=M(0xB0302A); band(body,0.99,0.19,rm);
    if(robe) add(body,dlg("hem2",function(){ return new THREE.TorusGeometry(0.33,0.02,8,40); }),rm,0,0.16,0,Math.PI/2);
    arms.forEach(function(a){ band(a,-0.56,0.045,rm); });
    if(f&&!headgear) add(body,dlg("kokoshnik",function(){ return new THREE.CylinderGeometry(0.17,0.15,0.18,20,1,true,-1.2,2.4); }),M(0xB0302A,true),0,hy+0.13,0.02);
  } else if(t==="Hawaiian"||t==="Polynesian"){
    var lc=[0xF2D04A,0xE84A6A,0xF4F0E6,0xE8823A];
    for(var li=0;li<16;li++){ var la=li/16*Math.PI*2; add(body,dlg("flower",function(){ return new THREE.SphereGeometry(0.028,8,6); }),M(lc[li%4]),Math.cos(la)*0.15,1.49-Math.max(0,Math.sin(la))*0.06,Math.sin(la)*0.11+0.01); }
    if(robe) add(body,dlg("tapa",function(){ return new THREE.TorusGeometry(0.31,0.03,8,40); }),M(0x6A3A1E),0,0.4,0,Math.PI/2);
  } else if(t==="Demonology"||t==="Qliphothic"||t==="Adversarial"){
    cloak(t==="Qliphothic"?0x1A1024:0x2A0E0E);
    [-1,1].forEach(function(sd){ for(var k=0;k<3;k++) add(body,dlg("spike",function(){ return new THREE.ConeGeometry(0.022,0.13,8); }),M(0x1A1418),sd*(0.2+k*0.025),1.56,-0.03+k*0.03,0,0,-sd*0.5); });
    necklace(0.13,1.5,0x6A1A1A);
  }

  /* a pale robe takes on a mantle in the colour of what they rule */
  var pale=(((top>>16)&255)+((top>>8)&255)+(top&255))/3>200;
  if(pale&&robe&&!(t==="Norse"||t==="Irish"||t==="Welsh"||t==="Gaulish"||t==="Demonology"||t==="Qliphothic"||t==="Adversarial")){
    var mc=M(blend(sg.col,0x3A2A4A,0.25),true);
    add(body,dlg("mantle",function(){ return new THREE.CylinderGeometry(0.22,0.36,1.15,24,1,true,Math.PI/2+0.55,Math.PI-1.1); }),mc,0,0.98,-0.02).scale.z=0.75;
    add(body,dlg("stole",function(){ return new THREE.BoxGeometry(0.07,0.62,0.02); }),mc,-0.09,1.22,0.135,0,0,0.04);
    add(body,dlg("stole",function(){ return new THREE.BoxGeometry(0.07,0.62,0.02); }),mc,0.09,1.22,0.135,0,0,-0.04);
  }
  /* their sign, glowing behind them */
  var sgn=signShape(sg.kind,sg.col,true); sgn.position.set(0,hy+0.12,-0.34); sgn.scale.setScalar(0.62); sgn.userData.dl=1; body.add(sgn);
  /* a power stands a head taller than the people who come to them */
  body.scale.multiplyScalar(1.1);
}
(function(){
  if(typeof buildDeity!=="function") return;
  var bd=buildDeity;
  buildDeity=function(spec,f){
    var d=spec&&spec.deity?DEITY[spec.deity]:null;
    /* a power dreamt before this was written is given their own look now too */
    if(d) try{ deityLookMore(spec,d); }catch(e){}
    var g=bd.apply(this,arguments);
    if(d) try{ dressDeity(g,spec,d); }catch(e){ if(window.console) console.warn("deity dress:",e); }
    return g;
  };
})();

/* ================================================================ their temples */
/* every house on Temple Row in its power's own colours: the walls taking a
   little of their robe, the roof in it, two banners at the door, and their
   sign carved over it */
(function(){
  if(typeof atlTemples!=="function") return;
  var at=atlTemples;
  atlTemples=function(C){
    at(C);
    store.objects.forEach(function(o){
      if(!o.templerow||!o.deity||o.realm!==C.r.id) return;
      var k=KIT[o.archetype], d=DEITY[o.deity]; if(!k||k.cat!=="structure"||!d) return;
      var t=d.trad||"Greek", rc=null;
      d.icons.forEach(function(x){ var p=x.split(":"); if(p[0]==="robe"&&ICONCOL[p[1]]!==undefined) rc=ICONCOL[p[1]]; });
      if(rc===null) rc=TRAD_ROBE[t]||0xC9A868;
      var base=(PRECINCT[t]&&PRECINCT[t].trim)||0xE8E4DA, stone=(t==="Demonology"||t==="Qliphothic"||t==="Adversarial")?0x4A4048:0xE6E0D2;
      o.attrs=o.attrs||{};
      if(o.attrs.c===undefined) o.attrs.c=blend(stone,rc,0.22);
      if(o.attrs.rc===undefined) o.attrs.rc=blend(shade(rc,-0.15),base,0.25);
      o.deityTemple=true;
    });
  };
})();
(function(){
  if(typeof build!=="function") return;
  var bl=build;
  build=function(spec,f){
    var g=bl.apply(this,arguments);
    if(spec&&spec.deityTemple&&spec.deity&&DEITY[spec.deity]) try{ templeDress(g,spec,DEITY[spec.deity]); }catch(e){ if(window.console) console.warn("temple dress:",e); }
    return g;
  };
})();
var TMAT={};
function tmat(c,ds){ var k=c+(ds?"d":""); if(!TMAT[k]){ TMAT[k]=new THREE.MeshLambertMaterial({color:c}); if(ds) TMAT[k].side=THREE.DoubleSide; } return TMAT[k]; }
function templeDress(g,spec,d){
  var def=KIT[spec.archetype], parts=levelParts(def,spec), door=frontDoorOf(parts), B=bodyOf(parts);
  var sx=g.scale.x||1;
  var front=door?door.p[2]+door.s[2]/2:(B?B.z+B.d/2:def.size[2]/2), dw=door?door.s[0]:2, dtop=door?door.p[1]+door.s[1]/2:3;
  var rc=null; d.icons.forEach(function(x){ var p=x.split(":"); if(p[0]==="robe"&&ICONCOL[p[1]]!==undefined) rc=ICONCOL[p[1]]; });
  if(rc===null) rc=TRAD_ROBE[d.trad]||0xC9A868;
  var sg=deitySign(d), gold=tmat(0xC9A040);
  /* the sign over the door, on a round plaque */
  var pl=new THREE.Mesh(dlg("plaque",function(){ return new THREE.CylinderGeometry(0.75,0.75,0.12,32); }),tmat(shade(rc,-0.25)));
  pl.rotation.x=Math.PI/2; pl.position.set(0,dtop+1.1,front+0.12); g.add(pl);
  var ring=new THREE.Mesh(dlg("plring",function(){ return new THREE.TorusGeometry(0.75,0.06,8,40); }),gold); ring.position.set(0,dtop+1.1,front+0.16); g.add(ring);
  var s=signShape(sg.kind,sg.col,false); s.position.set(0,dtop+1.1,front+0.22); s.scale.setScalar(1.55); g.add(s);
  /* two banners in their colours, either side of the door */
  var paleR=(((rc>>16)&255)+((rc>>8)&255)+(rc&255))/3>200, bc=paleR?blend(sg.col,0x2A2040,0.3):rc;
  var bm=tmat(bc,true), tm=tmat(paleR?0xC9A040:sg.col);
  [-1,1].forEach(function(sd){
    var x=sd*(dw/2+1.2);
    var pole=new THREE.Mesh(dlg("bpole",function(){ return new THREE.CylinderGeometry(0.05,0.05,1.64,8); }),gold); pole.rotation.z=Math.PI/2; pole.position.set(x,dtop+0.9,front+0.35); g.add(pole);
    var bh=Math.round((dtop+0.4)*4)/4, ban=new THREE.Mesh(dlg("banner"+bh,function(){ return new THREE.PlaneGeometry(1.3,bh); }),bm); ban.position.set(x,(dtop+0.9)/2+0.2,front+0.36); g.add(ban);
    var stripe=new THREE.Mesh(dlg("bstripe",function(){ return new THREE.PlaneGeometry(1.3,0.18); }),tm); stripe.position.set(x,0.75,front+0.37); g.add(stripe);
    var mini=signShape(sg.kind,sg.col,false); mini.position.set(x,(dtop+0.9)*0.6,front+0.4); mini.scale.setScalar(0.8); g.add(mini);
  });
}
