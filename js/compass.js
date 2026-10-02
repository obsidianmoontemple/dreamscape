/* SomnuMatrix — compass.js
   north is a real direction in the dreamscape: north is -z, east is +x, so the
   east–west streets truly run east and west. a dial turns as you look around;
   in Plot, every building has a facing and a bearing from the heart of the town.
   loaded as a plain script; shares scope with the other files */
"use strict";

var POINTS=["N","NE","E","SE","S","SW","W","NW"];
var POINTNAMES={N:"north",NE:"north-east",E:"east",SE:"south-east",S:"south",SW:"south-west",W:"west",NW:"north-west"};

function bearingOf(dx,dz){ var b=Math.atan2(dx,-dz)*180/Math.PI; return (b+360)%360; }
function pointOf(b){ return POINTS[Math.round(((b%360)+360)%360/45)%8]; }
function cameraBearing(){
  if(walkMode) return bearingOf(-Math.sin(yaw),-Math.cos(yaw));
  return bearingOf(orb.tx-camera.position.x,orb.tz-camera.position.z);
}
/* a building's front faces its local +z, turned by its rotation */
function facingBearing(o){ return bearingOf(Math.sin(o.rot||0),Math.cos(o.rot||0)); }
function rotForBearing(b){ var r=b*Math.PI/180; return Math.atan2(Math.sin(r),-Math.cos(r)); }

/* the heart of the town: the middle of everything dreamt in this realm */
function heartOf(realm){
  var n=0,x=0,z=0;
  store.objects.forEach(function(o){
    if(o.filler||(o.realm||0)!==(realm||0)) return;
    var d=KIT[o.archetype]; if(!d||d.cat!=="structure") return;
    x+=o.x; z+=o.z; n++;
  });
  if(n) return {x:x/n,z:z/n};
  /* a world with nothing built in it yet still has a place of its own */
  if(realm){
    var r=(typeof realmById==="function")?realmById(realm):null;
    if(r&&r.grid&&typeof blockOrigin==="function"){ var o=blockOrigin(r.grid.bx,r.grid.bz); return {x:o.x,z:o.z}; }
    return {x:(typeof REALM_GAP!=="undefined"?REALM_GAP:30000)*realm,z:0};
  }
  return {x:0,z:0};
}
function whereFromHeart(o){
  var h=heartOf(o.realm||0), dx=o.x-h.x, dz=o.z-h.z, d=Math.round(Math.sqrt(dx*dx+dz*dz));
  if(d<15) return "at the heart of the town";
  return d+" m "+pointOf(bearingOf(dx,dz))+" of the heart of the town";
}

/* ---- the dial ---- */
var lastB=-1;
function updateCompass(){
  var el=document.getElementById("compass"); if(!el) return;
  var show=walkMode||plotOn;
  if(el.classList.contains("gone")===show) el.classList.toggle("gone",!show);
  if(!show) return;
  var b=cameraBearing();
  if(Math.abs(b-lastB)<0.4) return;
  lastB=b;
  var dial=document.getElementById("c-dial");
  if(dial&&dial.setAttribute) dial.setAttribute("transform","rotate("+(-b).toFixed(1)+")");
  var rd=document.getElementById("c-read");
  if(rd) rd.textContent="facing "+pointOf(b)+" "+Math.round(b)+"\u00b0";
}

/* ---- in Plot: facing and bearing ---- */
function plotFace(b){
  if(!plotSel) return;
  plotSel.rot=rotForBearing(b);
  if(KIT[plotSel.archetype]&&KIT[plotSel.archetype].cat==="structure"){
    var fp=footprint(plotSel.archetype,plotSel.attrs,plotSel.rot), box=boxOf(plotSel.x,plotSel.z,fp);
    if(!clearOf(box,standingBoxes(plotSel.id,plotSel.realm||0))){
      plotStatus("It won't turn that way without touching its neighbours. Move it first, or turn off snapping.");
      if(document.getElementById("p-snap").checked){ plotSel.rot=rotForBearing(facingBearing(plotSel)); return; }
    }
    releaseLots(plotSel); claimLots(plotSel);
  }
  refresh(plotSel); plotSelect(plotSel); save();
}
function compassLine(o){
  var fb=facingBearing(o);
  return "faces "+POINTNAMES[pointOf(fb)]+" ("+Math.round(fb)+"\u00b0) \u00b7 "+whereFromHeart(o);
}
function wireCompass(){
  var $=function(i){ return document.getElementById(i); };
  Array.prototype.forEach.call(document.querySelectorAll("[data-face]"),function(b){
    b.addEventListener("click",function(){ plotFace(parseFloat(b.getAttribute("data-face"))); });
  });
  $("p-bearing").addEventListener("change",function(){
    var v=parseFloat(this.value); if(isNaN(v)) return;
    plotFace(((v%360)+360)%360);
  });
}

