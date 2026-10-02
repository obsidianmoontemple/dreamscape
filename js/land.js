/* SomnuMatrix — land.js
   the ground the dreamscape stands on: what it's made of, whether hills rise beyond
   the town, the season, the colour of water, the mood of the sky, and shadows.
   hills are only ever raised where nothing stands, so nothing floats or sinks.
   loaded as a plain script; shares scope with the other files */
"use strict";

var LAND_DEFAULT={ground:"grass",hills:1,season:"calendar",water:0x2E5E78,sky:"hour",shadows:null,detail:true};
function land(){
  if(!store.land) store.land={};
  for(var k in LAND_DEFAULT) if(store.land[k]===undefined) store.land[k]=LAND_DEFAULT[k];
  if(store.land.shadows===null) store.land.shadows=!(typeof matchMedia==="function"&&matchMedia("(pointer:coarse)").matches);
  return store.land;
}
function landOpt(k){ return land()[k]; }

var GROUNDCOL={grass:0x587A40,earth:0x7A6248,sand:0xB8A47C,snow:0xAEB6BE,paving:0x8A857C,void:0x5B5A52};
var HILLS=[0,9,26,60];

/* ---- seasons ---- */
function seasonNow(){
  var s=landOpt("season");
  if(s!=="calendar") return s;
  var m=new Date().getMonth();
  return m<2||m===11?"winter":m<5?"spring":m<8?"summer":"autumn";
}
var FOLIAGE={spring:[0x6E9A4E,0x7FA85A,0x5E8C44],summer:[0x4A7A3A,0x3F6E34,0x56853F],
  autumn:[0xB0662E,0xC8862E,0x8E3A22,0xA0522D],winter:[0xB4BAC2,0xA8AEB6,0xBEC3CA],still:[ROLE.nature]};
function natureColor(spec){
  var s=seasonNow(), set=FOLIAGE[s]||FOLIAGE.summer;
  if(spec&&spec.attrs&&spec.attrs.c!==undefined) return spec.attrs.c;
  var arch=spec&&spec.archetype;
  if(arch==="grass"){ return s==="winter"?0xB0B8C0:s==="autumn"?0x7A7040:s==="spring"?0x6E9A4E:0x557A40; }
  if(arch==="pine"&&s==="autumn") return 0x3A5E36;
  return set[hash(String(spec&&spec.id||"x"))%set.length];
}
function waterColor(){ return landOpt("water"); }
function groundColor(){
  var g=landOpt("ground"), s=seasonNow();
  if(g==="grass"&&s==="winter") return GROUNDCOL.snow;
  if(g==="grass"&&s==="autumn") return 0x646838;
  if(g==="grass"&&s==="spring") return 0x5E8448;
  return GROUNDCOL[g]||GROUNDCOL.grass;
}
function groundTex(){
  var g=landOpt("ground");
  if(g==="grass"&&seasonNow()==="winter") return "snow";
  return g==="void"?null:g;
}

/* ---- sky mood, laid over the hour's own colours ---- */
var MOODS={hour:null,overcast:[0x6E7278,0.55],pale:[0xD8D4CC,0.4],eerie:[0x2E6A4A,0.45],
  ember:[0x8A3A22,0.45],violet:[0x5A3A7E,0.45]};
function moodSky(sk){
  var m=MOODS[landOpt("sky")]; if(!m) return sk;
  return {top:blend(sk.top,m[0],m[1]),low:blend(sk.low,m[0],m[1]*0.85)};
}

/* ---- the terrain: hills beyond the town, flat wherever anything stands ---- */
var terrain=null, terrainSig="";
function vnoise(x,z){
  function h(i,j){ var n=Math.sin(i*127.1+j*311.7)*43758.5453; return n-Math.floor(n); }
  var xi=Math.floor(x), zi=Math.floor(z), xf=x-xi, zf=z-zi;
  var u=xf*xf*(3-2*xf), v=zf*zf*(3-2*zf);
  var a=h(xi,zi), b=h(xi+1,zi), c=h(xi,zi+1), d=h(xi+1,zi+1);
  return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;
}
function fbm(x,z){ return vnoise(x/300,z/300)*0.6+vnoise(x/120,z/120)*0.3+vnoise(x/48,z/48)*0.1; }
function smooth(a,b,x){ var t=Math.max(0,Math.min(1,(x-a)/(b-a))); return t*t*(3-2*t); }

function flatZones(){
  var z=[];
  (store.streets||[]).forEach(function(k){
    var p=k.split(":"), o=blockOrigin(+p[0],+p[1]); z.push([o.x,o.z,86]);
  });
  store.objects.forEach(function(o){
    if(o.filler) return;
    var d=KIT[o.archetype]; if(!d) return;
    var s=(o.attrs&&o.attrs.s)||1;
    z.push([o.x,o.z,Math.max(d.size[0],d.size[2])*0.6*s+10]);
  });
  return z;
}

function buildTerrain(){
  if(!scene) return;
  var amp=HILLS[landOpt("hills")]||0, SIZE=3000, SEG=150;
  var fresh=!terrain;
  var geo=terrain?terrain.geometry:new THREE.PlaneGeometry(SIZE,SIZE,SEG,SEG);
  if(!geo.attributes||!geo.attributes.position) return;
  var pos=geo.attributes.position, Z=flatZones();
  for(var i=0;i<pos.count;i++){
    var x=pos.getX(i), zz=-pos.getY(i), h=0;
    if(amp>0){
      var near=Infinity;
      for(var k=0;k<Z.length;k++){ var dx=x-Z[k][0], dz=zz-Z[k][1]; var d=Math.sqrt(dx*dx+dz*dz)-Z[k][2]; if(d<near) near=d; }
      var mask=smooth(8,90,near)*(1-smooth(1150,1450,Math.sqrt(x*x+zz*zz)));
      h=fbm(x+5000,zz+5000)*amp*mask*1.6;
    }
    pos.setZ(i,h);
  }
  pos.needsUpdate=true;
  if(geo.computeVertexNormals) geo.computeVertexNormals();
  if(fresh) metreUVs(geo,"pln",[SIZE,SIZE]);
  if(ground&&!ground.userData.uv){ metreUVs(ground.geometry,"pln",[6000,6000]); ground.userData.uv=1; }
  if(!terrain){
    terrain=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:groundColor(),polygonOffset:true,polygonOffsetFactor:2,polygonOffsetUnits:4}));
    terrain.rotation.x=-Math.PI/2;
    terrain.position.y=-0.06;
    terrain.receiveShadow=true;
    terrain.userData.terrain=1;
    scene.add(terrain);
  }
  var t=groundTex(), tx=t&&landOpt("detail")?texOf(t):null;
  terrain.material.map=tx; terrain.material.needsUpdate=true;
  if(ground){ ground.position.y=-0.35; ground.material.map=tx; ground.material.polygonOffset=true;
    ground.material.polygonOffsetFactor=4; ground.material.polygonOffsetUnits=8; ground.material.needsUpdate=true; }
  terrainSig=landSignature();
}
function landSignature(){
  var n=0; store.objects.forEach(function(o){ if(!o.filler) n++; });
  return n+"|"+(store.streets||[]).length+"|"+landOpt("hills");
}
function terrainTick(){ if(scene&&landSignature()!==terrainSig) buildTerrain(); }

/* ---- shadows: the sun's light follows wherever you're looking ---- */
var sunDir={x:-0.5,y:0.8,z:0.3};
function applyShadows(){
  if(!renderer||!sun||!renderer.shadowMap) return;
  var on=!!landOpt("shadows");
  renderer.shadowMap.enabled=on;
  if(THREE.PCFSoftShadowMap!==undefined) renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  sun.castShadow=on;
  if(on&&sun.shadow){
    sun.shadow.mapSize.width=sun.shadow.mapSize.height=2048;
    var c=sun.shadow.camera; c.left=-150; c.right=150; c.top=150; c.bottom=-150; c.near=10; c.far=1600;
    if(c.updateProjectionMatrix) c.updateProjectionMatrix();
    sun.shadow.bias=-0.0006; if("normalBias" in sun.shadow) sun.shadow.normalBias=0.35;
    if(sun.target&&!sun.target.parent) scene.add(sun.target);
  }
}
function followSun(){
  if(!sun||!sun.target) return;
  var fx=walkMode?camera.position.x:orb.tx, fz=walkMode?camera.position.z:orb.tz;
  var fy=(typeof terrainY==="function")?terrainY(fx,fz):0;
  sun.position.set(fx+sunDir.x*600,fy+Math.max(40,sunDir.y*600),fz+sunDir.z*600);
  sun.target.position.set(fx,fy,fz);
  sun.target.updateMatrixWorld&&sun.target.updateMatrixWorld();
}

/* ---- applying a change: everything that shows the land is redrawn ---- */
function reland(){
  buildTerrain();
  applyShadows();
  store.objects.forEach(function(o){ if(meshes[o.id]) refresh(o); });
  tickClock(true);
  save();
}

/* ---- the panel ---- */
var WATERS=[0x2E5E78,0x2F7A7A,0x2C5A3A,0x14161C,0x9AA6B0,0x7A1E1E];
function openLand(){
  var L=land(), $=function(i){ return document.getElementById(i); };
  $("l-ground").value=L.ground; $("l-hills").value=String(L.hills); $("l-season").value=L.season;
  $("l-sky").value=L.sky; $("l-shadows").checked=!!L.shadows; $("l-detail").checked=!!L.detail;
  $("l-now").textContent=L.season==="calendar"?("(it's "+seasonNow()+" now)"):"";
  renderRealmList();
  var sw=$("l-water"); sw.innerHTML="";
  WATERS.forEach(function(c){
    var b=document.createElement("button"); b.type="button"; b.className="sw"+(c===L.water?" on":"");
    b.style.background="#"+("000000"+c.toString(16)).slice(-6); b.setAttribute("aria-label","water colour");
    b.onclick=function(){ L.water=c; reland(); openLand(); };
    sw.appendChild(b);
  });
  $("land").classList.add("open");
}
function closeLand(){ document.getElementById("land").classList.remove("open"); }
function wireLand(){
  var $=function(i){ return document.getElementById(i); };
  $("landbtn").addEventListener("click",openLand);
  $("l-close").addEventListener("click",closeLand);
  $("l-ground").addEventListener("change",function(){ land().ground=this.value; reland(); });
  $("l-hills").addEventListener("change",function(){ land().hills=parseInt(this.value,10); reland(); });
  $("l-season").addEventListener("change",function(){ land().season=this.value; reland(); openLand(); });
  $("l-sky").addEventListener("change",function(){ land().sky=this.value; tickClock(true); save(); });
  $("l-shadows").addEventListener("change",function(){ land().shadows=this.checked; reland(); });
  $("l-detail").addEventListener("change",function(){ land().detail=this.checked; reland(); });
}

