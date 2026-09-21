/* Dream Walker's Atlas — plot.js
   plotting by hand: place any form, drag it, turn it, give it floors, take it away
   loaded as a plain script; shares scope with the other files */
"use strict";

var plotOn=false, plotBusy=false, plotArmed=null, plotSel=null, plotRing=null;
var plotGround=null, plotRay=null;

function plotInit(){
  plotGround=new THREE.Plane(new THREE.Vector3(0,1,0),0);
  plotRay=new THREE.Raycaster();
  var sel=document.getElementById("p-kind");
  var groups={structure:"Buildings",nature:"Land and water",infra:"Streets and things",vehicle:"Vehicles",being:"Figures"};
  var html="";
  Object.keys(groups).forEach(function(cat){
    var names=Object.keys(KIT).filter(function(k){ return KIT[k].cat===cat; }).sort();
    if(!names.length) return;
    html+='<optgroup label="'+groups[cat]+'">'+names.map(function(n){
      return '<option value="'+n+'">'+n.replace(/([a-z])([A-Z])/g,"$1 $2")+"</option>"; }).join("")+"</optgroup>";
  });
  sel.innerHTML=html;
  sel.value="house";

  var el=renderer.domElement;
  el.addEventListener("pointerdown",plotDown);
  addEventListener("pointermove",plotMove);
  addEventListener("pointerup",plotUp);
  el.addEventListener("contextmenu",function(e){ if(plotOn) e.preventDefault(); });
}

function setPlot(on){
  plotOn=on;
  if(on&&walkMode) setWalk(false);
  document.getElementById("scrim").classList.toggle("hidden",on);
  document.getElementById("plotbar").classList.toggle("gone",!on);
  if(!on){ plotArmed=null; plotSelect(null); }
  plotStatus(on?"Choose a form and press Place, or click anything standing to move it. Drag empty ground to turn the view; shift-drag or WASD to move it; scroll to zoom.":"");
}
function plotStatus(t){ document.getElementById("p-status").textContent=t; }

function ndc(e){ return {x:(e.clientX/innerWidth)*2-1, y:-(e.clientY/innerHeight)*2+1}; }
function groundAt(e){
  plotRay.setFromCamera(ndc(e),camera);
  var v=new THREE.Vector3();
  return plotRay.ray.intersectPlane(plotGround,v)?v:null;
}
function objectAt(e){
  plotRay.setFromCamera(ndc(e),camera);
  var list=Object.keys(meshes).map(function(k){ return meshes[k]; });
  var hits=plotRay.intersectObjects(list,true);
  for(var i=0;i<hits.length;i++){
    var o=hits[i].object;
    while(o&&o.userData.id===undefined) o=o.parent;
    if(o){ var sp=specById(o.userData.id); if(sp&&!sp.filler) return sp; }
  }
  return null;
}

/* the ring on the ground that says what is selected */
function plotSelect(spec){
  plotSel=spec;
  if(plotRing){ scene.remove(plotRing); plotRing=null; }
  if(!spec){ return; }
  var s=(KIT[spec.archetype]||KIT.house).size, sc=(spec.attrs&&spec.attrs.s)||1;
  var r=Math.max(s[0],s[2])*0.62*sc+1.2;
  plotRing=new THREE.Mesh(new THREE.RingGeometry(r,r+0.9,48),
    new THREE.MeshBasicMaterial({color:0xB8724A,transparent:true,opacity:0.8,depthWrite:false,
      polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-6}));
  plotRing.rotation.x=-Math.PI/2;
  plotRing.position.set(spec.x,0.2,spec.z);
  scene.add(plotRing);
  var lv=spec.attrs&&spec.attrs.lv, base=LEVELS[spec.archetype];
  plotStatus(placeName(spec)+" \u2014 "+spec.archetype+(base?(" \u00b7 "+(lv||base)+" floor"+((lv||base)===1?"":"s")):"")+
    ". Drag to move, R to turn, Delete to remove.");
}

/* ---- the nearest free lot to a point, for snapping ---- */
function nearestFreeLot(x,z,maxd){
  var bx=Math.round(x/PITCH), bz=Math.round(z/PITCH), best=null, bd=(maxd||60)*(maxd||60);
  for(var dx=-1;dx<=1;dx++) for(var dz=-1;dz<=1;dz++){
    for(var k=0;k<LOTS;k++){
      if(!lotFree(bx+dx,bz+dz,k)) continue;
      var sp=lotSpot(bx+dx,bz+dz,k), d=(sp.x-x)*(sp.x-x)+(sp.z-z)*(sp.z-z);
      if(d<bd){ bd=d; best={bx:bx+dx,bz:bz+dz,k:k,x:sp.x,z:sp.z,rot:sp.rot}; }
    }
  }
  return best;
}
function releaseLot(o){
  if(o.lot===null||o.lot===undefined||o.bx===undefined) return;
  var k=lotKey(o.bx,o.bz,o.lot);
  if(store.lots&&store.lots[k]===o.id) delete store.lots[k];
  o.lot=null;
}
function settle(o,x,z){
  var snap=document.getElementById("p-snap").checked && KIT[o.archetype].cat==="structure";
  var old={x:o.x,z:o.z};
  releaseLot(o);
  var L=snap?nearestFreeLot(x,z,70):null;
  if(L){
    o.x=L.x; o.z=L.z; o.rot=L.rot; o.bx=L.bx; o.bz=L.bz; o.lot=L.k;
    o.addr=addressOf(L.bx,L.bz,L.k);
    takeLot(L.bx,L.bz,L.k,o.id);
    ensureStreets(L.bx,L.bz);
  } else {
    o.x=x; o.z=z; o.bx=Math.round(x/PITCH); o.bz=Math.round(z/PITCH);
  }
  if(o.named!=="stated" && o.addr && (o.archetype==="house"||o.archetype==="cottage"))
    o.name=nameFor(o,o.addr);
  var ch=charOf(o);
  if(ch){ ch.x=o.x; ch.z=o.z; ch.anchor={x:o.x,z:o.z}; }
  markStale(old.x,old.z); markStale(o.x,o.z);
  refresh(o); plotSelect(o); save();
}

/* ---- placing something new, exactly where the dreamer puts it ---- */
function plotPlace(arch,x,z){
  var snap=document.getElementById("p-snap").checked && KIT[arch].cat==="structure";
  var L=snap?nearestFreeLot(x,z,70):null;
  var bx=L?L.bx:Math.round(x/PITCH), bz=L?L.bz:Math.round(z/PITCH);
  var near=L||nearestFreeLot(x,z,200)||{bx:bx,bz:bz,k:0};
  var spec={id:uid(),archetype:arch,label:arch,attrs:{},x:L?L.x:x,z:L?L.z:z,
            rot:L?L.rot:(Math.round(orb.t/(Math.PI/2))*Math.PI/2),
            sign:null,note:null,solid:true,placed:true,detail:1,
            addr:addressOf(near.bx,near.bz,near.k),name:null,named:"provisional",
            bx:bx,bz:bz,lot:L?L.k:null,nights:[store.session]};
  spec.name=nameFor(spec,spec.addr);
  store.objects.push(spec);
  if(L){ takeLot(L.bx,L.bz,L.k,spec.id); ensureStreets(L.bx,L.bz); }
  if(KIT[arch].cat==="being"){
    var c=newCharacter(arch,arch,{});
    c.src={name:"placed"}; c.objId=spec.id; c.x=spec.x; c.z=spec.z; c.anchor={x:spec.x,z:spec.z};
    spec.charId=c.id;
  }
  addMesh(spec);
  markStale(spec.x,spec.z);
  updateCount(); save();
  return spec;
}

/* ---- pointer ---- */
var plotDrag=null;
function plotDown(e){
  if(!plotOn||e.button===2) return;
  if(plotArmed){
    var g=groundAt(e); if(!g) return;
    var sp=plotPlace(plotArmed,g.x,g.z);
    plotSelect(sp);
    if(!e.shiftKey){ plotArmed=null; document.getElementById("p-place").classList.remove("on"); }
    plotBusy=true; setTimeout(function(){ plotBusy=false; },0);
    return;
  }
  var hit=objectAt(e);
  if(hit){
    plotSelect(hit);
    plotDrag={spec:hit,moved:false};
    plotBusy=true; dragging=null;
  } else plotSelect(null);
}
function plotMove(e){
  if(!plotDrag) return;
  var g=groundAt(e); if(!g) return;
  plotDrag.moved=true;
  var o=plotDrag.spec, m=meshes[o.id];
  if(m){ m.position.x=g.x; m.position.z=g.z; }
  if(plotRing){ plotRing.position.x=g.x; plotRing.position.z=g.z; }
  plotDrag.x=g.x; plotDrag.z=g.z;
}
function plotUp(){
  if(!plotDrag){ return; }
  var d=plotDrag; plotDrag=null; plotBusy=false;
  if(d.moved) settle(d.spec,d.x,d.z);
}

/* ---- the toolbar and the keys ---- */
function plotTurn(dir){
  if(!plotSel) return;
  plotSel.rot=(plotSel.rot||0)+dir*Math.PI/12;
  refresh(plotSel); plotSelect(plotSel); save();
}
function plotFloors(dir){
  if(!plotSel) return;
  var base=LEVELS[plotSel.archetype];
  if(!base){ plotStatus("A "+plotSel.archetype+" has no floors to add."); return; }
  var lv=(plotSel.attrs.lv||base)+dir;
  plotSel.attrs.lv=Math.max(1,Math.min(120,lv));
  refresh(plotSel); plotSelect(plotSel); save();
}
function plotRemove(){
  if(!plotSel) return;
  var o=plotSel, ch=charOf(o);
  if(ch&&ch.primary!==false&&!confirm("Remove "+ch.name+" and everything recorded about them?")) return;
  releaseLot(o);
  if(ch){ var ci=store.characters.indexOf(ch); if(ci>-1) store.characters.splice(ci,1); }
  removeSpec(o);
  markStale(o.x,o.z);
  plotSelect(null); updateCount(); save();
  plotStatus("Removed.");
}
/* the camera sits at angle t around its target: forward on the ground is (-cos t, -sin t)
   and right is (sin t, -cos t). dragging the ground carries the world with the pointer. */
function panOrbit(dx,dy){
  var sc=orb.r/600, c=Math.cos(orb.t), s=Math.sin(orb.t);
  orb.tx+=(-s*dx - c*dy)*sc;
  orb.tz+=( c*dx - s*dy)*sc;
}
function plotKeys(dt){
  var sp=orb.r*0.9*dt, f=0, r=0;
  if(keys["KeyW"]||keys["ArrowUp"]) f+=1;
  if(keys["KeyS"]||keys["ArrowDown"]) f-=1;
  if(keys["KeyD"]||keys["ArrowRight"]) r+=1;
  if(keys["KeyA"]||keys["ArrowLeft"]) r-=1;
  if(!f&&!r) return;
  var c=Math.cos(orb.t), s=Math.sin(orb.t);
  orb.tx+=(-c*f + s*r)*sp;
  orb.tz+=(-s*f - c*r)*sp;
}
function plotKeyDown(e){
  if(!plotOn) return false;
  var tag=document.activeElement&&document.activeElement.tagName;
  if(tag==="INPUT"||tag==="TEXTAREA"||tag==="SELECT") return false;
  if(e.code==="KeyR"){ plotTurn(e.shiftKey?-1:1); return true; }
  if(e.code==="Delete"||e.code==="Backspace"){ plotRemove(); return true; }
  if(e.code==="Escape"){ if(plotArmed){ plotArmed=null; document.getElementById("p-place").classList.remove("on"); plotStatus("Placing cancelled."); } else setPlot(false); return true; }
  return false;
}

function wirePlot(){
  var $=function(i){ return document.getElementById(i); };
  plotInit();
  $("plotbtn").addEventListener("click",function(){ setPlot(true); });
  $("p-done").addEventListener("click",function(){ setPlot(false); });
  $("p-place").addEventListener("click",function(){
    plotArmed=$("p-kind").value;
    this.classList.add("on");
    plotStatus("Click the ground to place a "+plotArmed+". Hold shift to place several.");
  });
  $("p-rotl").addEventListener("click",function(){ plotTurn(-1); });
  $("p-rotr").addEventListener("click",function(){ plotTurn(1); });
  $("p-down").addEventListener("click",function(){ plotFloors(-1); });
  $("p-up").addEventListener("click",function(){ plotFloors(1); });
  $("p-del").addEventListener("click",plotRemove);
  $("p-detail").addEventListener("click",function(){ if(plotSel) openInspect(plotSel.id); });
  addEventListener("keydown",function(e){ if(plotKeyDown(e)){ e.preventDefault(); e.stopImmediatePropagation(); } },true);
}
