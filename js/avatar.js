/* SomnuMatrix — avatar.js
   the dreamer has a body. walk seeing through your own eyes, or from behind
   yourself, or turn the view round to face yourself while you choose what you
   wear. the look is yours alone to set; nothing is guessed.
   loaded as a plain script; shares scope with the other files */
"use strict";

var meView="eyes";            // eyes | behind | mirror
var meG=null, meLast=null, meBar=null, meClock=0;
var cityView=false;           // held down: looking out over the real city from the penthouse
var VIEWS=["eyes","behind"];
var VIEW_LABEL={eyes:"Your eyes",behind:"Behind you",mirror:"Mirror"};

/* what you can look like, past your own body: worn like a costume over
   whatever skin, hair and clothes you already chose — none of it is taken
   from you, only added to. */
var SPECIES=["human","elf","dwarf","fairy","dragonborn","gnome","halfling","orc","goblin","angel","tiefling","giant"];
var SPECIES_LABEL=["Human","Elf","Dwarf","Fairy","Dragonborn","Gnome","Halfling","Orc","Goblin","Angel","Tiefling","Giant"];
var SPECIES_FEATS={
  elf:{feats:["ears","thin"],s:1.06},
  dwarf:{feats:["beard","wide"],s:.72},
  fairy:{feats:["ears","wings:fairy","glow"],s:.55,hover:.22},
  dragonborn:{feats:["horns","tail:dragon","scales","wings:dragon"],s:1.05},
  gnome:{feats:["beard","ears"],s:.48},
  halfling:{feats:["ears"],s:.64},
  orc:{feats:["wide","tusks"],s:1.08},
  goblin:{feats:["ears","hunched","thin"],s:.66},
  angel:{feats:["wings:feather:0xF2EEE6","glow","halo"],s:1.08},
  tiefling:{feats:["horns","tail:devil"],s:1.02},
  giant:{feats:["wide","beard"],s:1.5}
};

function meLook(){
  var d=dreamer();
  if(!d.look){ d.look=blankLook("human"); d.look.src={}; }
  fillLook(d.look,(typeof myUserId==="function"&&myUserId())||d.seed||(d.seed=String(Math.random()).slice(2)));
  return d.look;
}
/* anything about a dreamer's look they haven't chosen yet is filled from a
   seed of their own, so no two dreamers come out as the same grey statue —
   and what they HAVE chosen is never touched */
function fillLook(L,seed){
  var R=randomLook(seed,"human");
  ["sex","skin","hair","hairStyle","top","topKind","bottom","bottomKind","shoes","hat","build"].forEach(function(k){
    if(L[k]===null||L[k]===undefined) L[k]=R[k];
  });
  return L;
}
function meSpec(){ return {id:"__me",archetype:"human",attrs:{},look:meLook(),solid:true,detail:4,nights:[store.session]}; }
function rebuildMe(){
  if(meG&&scene) scene.remove(meG);
  var spec=meSpec(), sp=meLook().species, o=sp&&SPECIES_FEATS[sp];
  meG=buildFigure(spec,1);
  if(o){ dressFolk(meG,spec,1,o); if(o.hover) meG.children[0].position.y+=o.hover; }
  meG.userData.me=1; shadowsFor(meG,true);
  if(typeof showCarried==="function") setTimeout(showCarried,0);
  if(scene) scene.add(meG);
  meG.visible=false;
  /* how you look just changed — whoever else is in Somnucor should see it
     too, next time their own client asks */
  if(typeof publishMyLook==="function") publishMyLook();
}

/* any floor of the tower with windows to look out of — not the penthouse
   alone. INT.locked only ever gets set on the Somnucor Tower's own plan, so
   this still can't be triggered from some random cottage; level 0 is the
   lobby (no real view to speak of down there), so the lookout starts at the
   first office floor and runs all the way up through the penthouse. */
function onLookoutFloor(){ return !!(INT&&INT.locked&&(INT.level||0)>0); }

/* ---- the buttons: shown only while walking ---- */
function meButtons(){
  if(meBar||typeof document==="undefined"||!document.body) return;
  meBar=document.createElement("div"); meBar.id="me-bar";
  meBar.style.cssText="position:fixed;top:64px;left:12px;z-index:30;display:none;gap:6px;flex-direction:column";
  meBar.innerHTML='<button class="btn" id="me-view" title="Change view (V)">View: Your eyes</button>'+
                  '<button class="btn" id="me-dress" title="How you look (B)">How you look</button>'+
                  '<button class="btn" id="me-cityview" title="Hold to look out over the city (L)" '+
                  'style="display:none">Look down on the city</button>';
  document.body.appendChild(meBar);
  document.getElementById("me-view").onclick=cycleView;
  document.getElementById("me-dress").onclick=openWardrobe;
  var cvBtn=document.getElementById("me-cityview");
  var press=function(e){ e.preventDefault&&e.preventDefault(); if(onLookoutFloor()) cityView=true; };
  var release=function(){ cityView=false; };
  cvBtn.onmousedown=press; cvBtn.onmouseup=release; cvBtn.onmouseleave=release;
  cvBtn.ontouchstart=press; cvBtn.ontouchend=release; cvBtn.ontouchcancel=release;
  addEventListener("keydown",function(e){
    if(!walkMode||/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||"")) return;
    if(e.code==="KeyV") cycleView();
    if(e.code==="KeyB") openWardrobe();
    if(e.code==="KeyL"&&onLookoutFloor()) cityView=true;
  });
  addEventListener("keyup",function(e){ if(e.code==="KeyL") cityView=false; });
}
function setView(v){
  meView=v; var b=document.getElementById("me-view"); if(b) b.textContent="View: "+VIEW_LABEL[v];
}
function cycleView(){ if(meView==="mirror") closeWardrobe(); setView(VIEWS[(VIEWS.indexOf(meView)+1)%VIEWS.length]); }

/* ---- the wardrobe ---- */
var meBefore="eyes";
function openWardrobe(){
  var w=document.getElementById("me-ward");
  if(!w){
    w=document.createElement("div"); w.id="me-ward";
    w.style.cssText="position:fixed;top:64px;right:12px;z-index:31;width:min(300px,calc(100vw - 24px));max-height:calc(100vh - 90px);overflow-y:auto;"+
      "background:rgba(11,13,19,.94);border:1px solid var(--line,#333);padding:14px 16px;border-radius:3px";
    if(document.body) document.body.appendChild(w);
  }
  if(meView!=="mirror") meBefore=meView;
  setView("mirror");
  renderWardrobe(); w.style.display="block";
}
function closeWardrobe(){ var w=document.getElementById("me-ward"); if(w) w.style.display="none"; if(meView==="mirror") setView(meBefore||"eyes"); }
function renderWardrobe(){
  var w=document.getElementById("me-ward"); if(!w) return;
  LKH={};
  var L=meLook(), S=L.src||{};
  function set(k,v){ L[k]=v; L.src=L.src||{}; L.src[k]="chosen"; rebuildMe(); save(); renderWardrobe(); }
  var h='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'+
        '<b style="color:var(--bone,#ddd);font-weight:500">How you look</b><button class="btn" id="me-close">Done</button></div>'+
        '<p style="font-size:12px;color:var(--dim,#999);margin:0 0 10px;line-height:1.5">Turn to see yourself from behind with the View button. Only you choose this.</p>';
  h+=selectRow("Species",S.species,SPECIES,L.species,function(v){ set("species",v||null); },SPECIES_LABEL);
  h+=selectRow("Body",S.sex,["f","m"],L.sex,function(v){ set("sex",v||null); },["woman","man"]);
  h+=swatchRow("Skin",S.skin,SKIN,L.skin,function(v){ set("skin",v); });
  h+=swatchRow("Hair",S.hair,HAIR,L.hair,function(v){ set("hair",v); });
  h+=selectRow("Hair style",S.hairStyle,HAIRSTYLES,L.hairStyle,function(v){ set("hairStyle",v||null); });
  h+=swatchRow("Top",S.top,TOPS,L.top,function(v){ set("top",v); });
  h+=selectRow("What you wear on top",S.topKind,TOPKINDS,L.topKind,function(v){ set("topKind",v||null); },["shirt","coat","dress","robe"]);
  h+=swatchRow("Bottom",S.bottom,BOTTOMS,L.bottom,function(v){ set("bottom",v); });
  h+=selectRow("Below",S.bottomKind,BOTTOMKINDS,L.bottomKind,function(v){ set("bottomKind",v||null); },["trousers","skirt"]);
  h+=swatchRow("Shoes",S.shoes,SHOES,L.shoes,function(v){ set("shoes",v); });
  h+=selectRow("Hat",S.hat,HATS,L.hat,function(v){ set("hat",v||null); },["none","cap","brimmed hat","hood"]);
  w.innerHTML=h;
  document.getElementById("me-close").onclick=closeWardrobe;
  Array.prototype.forEach.call(w.querySelectorAll("[data-lk]"),function(b){ b.onclick=function(){ LKH[b.getAttribute("data-lk")](parseInt(b.getAttribute("data-c"),10)); }; });
  Array.prototype.forEach.call(w.querySelectorAll("[data-lkp]"),function(inp){ inp.onchange=function(){ LKH[inp.getAttribute("data-lkp")](parseInt(inp.value.slice(1),16)); }; });
  Array.prototype.forEach.call(w.querySelectorAll("[data-lks]"),function(s){ s.onchange=function(){ LKH[s.getAttribute("data-lks")](s.value); }; });
}

/* ---- each frame: place the body under the eyes, and render from the chosen view ---- */
function avatarTick(dt){
  meButtons();
  if(meBar) meBar.style.display=walkMode?"flex":"none";
  var cvBtn=document.getElementById("me-cityview");
  if(cvBtn) cvBtn.style.display=(walkMode&&onLookoutFloor())?"block":"none";
  if(!walkMode||!onLookoutFloor()) cityView=false;
  if(!walkMode){ if(meG) meG.visible=false; closeWardrobeIfOpen(); return; }
  if(!meG) rebuildMe();
  var P=camera.position, feet=P.y-1.72;
  meG.visible=meView!=="eyes";
  meG.position.set(P.x,feet,P.z);
  meG.rotation.y=yaw+Math.PI;
  /* the legs walk when you do */
  var moved=meLast?Math.hypot(P.x-meLast.x,P.z-meLast.z):0; meLast={x:P.x,z:P.z};
  var L=meG.userData.limbs, u=meG.userData;
  if(L){ var mv=moved>0.01;
    u.amp=(u.amp||0)+((mv?0.55:0)-(u.amp||0))*Math.min(dt*6,1);
    u.phase=(u.phase||0)+dt*(mv?(moved/dt>12?11:7.2):0);
    var s=Math.sin(u.phase)*u.amp; L.ll.rotation.x=s; L.rl.rotation.x=-s; L.la.rotation.x=-s*.75; L.ra.rotation.x=s*.75; }
  /* a fairy's wings, or anything else a species feat set in motion */
  meClock+=dt; if(u.anim) u.anim(meClock,dt);
}
function closeWardrobeIfOpen(){ var w=document.getElementById("me-ward"); if(w&&w.style.display!=="none") closeWardrobe(); }

function renderView(){
  /* held down, from the penthouse only: swap out to a bird's-eye camera
     positioned over the tower's real spot in the city outside — the
     interior is built off in its own private slot of world space, but the
     city itself was never hidden or moved, so looking down at the REAL
     coordinates the tower stands at shows the real, live city below.
     one render pass, then straight back to the ordinary view, exactly like
     the over-the-shoulder trick below does for a single frame. */
  if(walkMode&&cityView&&onLookoutFloor()&&INT){
    var spec=INT.spec, P0=camera.position, px0=P0.x, py0=P0.y, pz0=P0.z;
    var def=(typeof KIT!=="undefined")?KIT[spec.archetype]:null;
    var sc=(spec.attrs&&spec.attrs.s)||1;
    var towerH=(def&&def.size?def.size[1]*sc:210);
    camera.position.set(spec.x,towerH+60,spec.z+80);
    camera.lookAt(spec.x,towerH*0.25,spec.z);
    (typeof gfxRender==="function"?gfxRender():renderer.render(scene,camera));
    camera.position.set(px0,py0,pz0);
    camera.rotation.order="YXZ"; camera.rotation.set(pitch,yaw,0);
    return;
  }
  if(!walkMode||meView==="eyes"||!meG){ (typeof gfxRender==="function"?gfxRender():renderer.render(scene,camera)); return; }
  var P=camera.position, px=P.x, py=P.y, pz=P.z;
  var fx=-Math.sin(yaw), fz=-Math.cos(yaw);
  if(meView==="behind"){
    /* over the shoulder; the camera comes in closer rather than through a wall */
    var dist=4.4;
    while(dist>1.2&&blockedAt(px-fx*dist,pz-fz*dist,py-1.72)) dist-=0.4;
    camera.position.set(px-fx*dist,py+0.55,pz-fz*dist);
    camera.lookAt(px+fx*2,py-0.25+Math.sin(pitch)*2,pz+fz*2);
  } else {
    camera.position.set(px+fx*2.6,py-0.35,pz+fz*2.6);
    camera.lookAt(px,py-0.55,pz);
  }
  (typeof gfxRender==="function"?gfxRender():renderer.render(scene,camera));
  camera.position.set(px,py,pz);
  camera.rotation.order="YXZ"; camera.rotation.set(pitch,yaw,0);
}

