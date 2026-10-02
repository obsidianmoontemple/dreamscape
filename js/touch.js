/* SomnuMatrix — touch.js
   phone and tablet controls.
   walking: left thumb on the joystick to move (push further to run), drag
            anywhere else to look, tap a form to inspect it or a figure to speak,
            buttons to speak, rise and fall, and go back.
   overview and Plot: one finger turns the view, two fingers pinch to zoom and
            drag to move across the map, tap a form to inspect it.
   loaded as a plain script; shares scope with the other files */
"use strict";

var isTouch=typeof window!=="undefined"&&(("ontouchstart" in window)||(typeof navigator!=="undefined"&&navigator.maxTouchPoints>0));
var touchRig=false;
var joy={id:null,x0:0,y0:0,dx:0,dy:0};
var fingers={}, pinch=null;

/* what the joystick says, for the walking code: forward, sideways, and whether to run */
function joyInput(){
  if(joy.id===null) return null;
  var R=52, x=joy.dx/R, y=joy.dy/R, m=Math.min(1,Math.sqrt(x*x+y*y));
  if(m<0.12) return null;
  return {f:-y,s:x,mag:m,run:m>0.92};
}

function initTouch(){
  if(!isTouch||!renderer) return;
  touchRig=true;
  document.body.classList.add("touch");
  var el=renderer.domElement;
  el.style.touchAction="none";
  el.addEventListener("touchstart",tStart,{passive:false});
  el.addEventListener("touchmove",tMove,{passive:false});
  el.addEventListener("touchend",tEnd,{passive:false});
  el.addEventListener("touchcancel",tEnd,{passive:false});

  var J=document.getElementById("joy"), knob=document.getElementById("joyknob");
  J.addEventListener("touchstart",function(e){
    e.preventDefault(); var t=e.changedTouches[0], r=J.getBoundingClientRect();
    joy.id=t.identifier; joy.x0=r.left+r.width/2; joy.y0=r.top+r.height/2; joyTo(t,knob);
  },{passive:false});
  J.addEventListener("touchmove",function(e){
    e.preventDefault();
    for(var i=0;i<e.changedTouches.length;i++){ var t=e.changedTouches[i]; if(t.identifier===joy.id) joyTo(t,knob); }
  },{passive:false});
  var jEnd=function(e){
    for(var i=0;i<e.changedTouches.length;i++) if(e.changedTouches[i].identifier===joy.id){
      joy.id=null; joy.dx=joy.dy=0; knob.style.transform="translate(0,0)";
    }
  };
  J.addEventListener("touchend",jEnd); J.addEventListener("touchcancel",jEnd);

  holdKey("t-up","Space"); holdKey("t-down","KeyC");
  tapKey("t-speak","KeyE"); tapKey("t-back","Escape");
}
function joyTo(t,knob){
  var dx=t.clientX-joy.x0, dy=t.clientY-joy.y0, d=Math.sqrt(dx*dx+dy*dy), R=52;
  if(d>R){ dx*=R/d; dy*=R/d; }
  joy.dx=dx; joy.dy=dy; knob.style.transform="translate("+dx+"px,"+dy+"px)";
}
function holdKey(id,code){
  var b=document.getElementById(id); if(!b) return;
  b.addEventListener("touchstart",function(e){ e.preventDefault(); keys[code]=true; },{passive:false});
  var up=function(){ keys[code]=false; };
  b.addEventListener("touchend",up); b.addEventListener("touchcancel",up);
}
function tapKey(id,code){
  var b=document.getElementById(id); if(!b) return;
  b.addEventListener("touchend",function(e){
    e.preventDefault();
    dispatchEvent(new KeyboardEvent("keydown",{code:code,key:code==="Escape"?"Escape":"e",bubbles:true}));
  },{passive:false});
}

/* ---- fingers on the world itself ---- */
function tStart(e){
  e.preventDefault();
  for(var i=0;i<e.changedTouches.length;i++){
    var t=e.changedTouches[i];
    fingers[t.identifier]={x:t.clientX,y:t.clientY,x0:t.clientX,y0:t.clientY,t0:Date.now()};
  }
  var ids=Object.keys(fingers);
  if(ids.length===2&&!walkMode){
    var a=fingers[ids[0]], b=fingers[ids[1]];
    pinch={d:Math.hypot(a.x-b.x,a.y-b.y),cx:(a.x+b.x)/2,cy:(a.y+b.y)/2,r:orb.r};
  }
  idle=0;
}
function tMove(e){
  e.preventDefault();
  var moved={};
  for(var i=0;i<e.changedTouches.length;i++){
    var t=e.changedTouches[i], f=fingers[t.identifier]; if(!f) continue;
    moved[t.identifier]={dx:t.clientX-f.x,dy:t.clientY-f.y};
    f.x=t.clientX; f.y=t.clientY;
  }
  if(plotBusy) return;
  var ids=Object.keys(fingers);
  if(walkMode){
    /* every finger that isn't on the joystick turns the head */
    for(var k in moved){ yaw-=moved[k].dx*0.006; pitch=Math.max(-1.35,Math.min(1.35,pitch-moved[k].dy*0.006)); }
    return;
  }
  if(ids.length>=2&&pinch){
    var a=fingers[ids[0]], b=fingers[ids[1]], d=Math.hypot(a.x-b.x,a.y-b.y);
    orb.r=Math.max(22,Math.min(900,pinch.r*pinch.d/Math.max(20,d)));
    var cx=(a.x+b.x)/2, cy=(a.y+b.y)/2;
    if(typeof panOrbit==="function"){ panOrbit(cx-pinch.cx,cy-pinch.cy); viewAt={x:orb.tx,z:orb.tz}; }
    pinch.cx=cx; pinch.cy=cy;
    idle=0; return;
  }
  if(ids.length===1){
    var m=moved[ids[0]]; if(!m) return;
    orb.t-=m.dx*0.006; orb.p=Math.max(0.12,Math.min(1.5,orb.p-m.dy*0.005)); idle=0;
  }
}
function tEnd(e){
  e.preventDefault();
  for(var i=0;i<e.changedTouches.length;i++){
    var t=e.changedTouches[i], f=fingers[t.identifier];
    if(f){
      var still=Math.hypot(t.clientX-f.x0,t.clientY-f.y0)<12, quick=Date.now()-f.t0<320;
      if(still&&quick&&Object.keys(fingers).length===1&&!plotOn) tapAt(t.clientX,t.clientY);
    }
    delete fingers[t.identifier];
  }
  if(Object.keys(fingers).length<2) pinch=null;
}

/* a tap: speak to a figure close by, otherwise inspect what was tapped */
function tapAt(x,y){
  var hit=typeof objectAt==="function"?objectAt({clientX:x,clientY:y}):null;
  if(!hit) return;
  var ch=typeof charOf==="function"?charOf(hit):null;
  if(walkMode&&ch){
    var dx=hit.x-camera.position.x, dz=hit.z-camera.position.z;
    if(dx*dx+dz*dz<12*12){
      if(ch.primary===false) openGreet(ch); else openTalk(ch);
      return;
    }
  }
  openInspect(hit.id);
}

/* ---- which controls show, and when ---- */
function touchUI(){
  if(!touchRig) return;
  var J=document.getElementById("joy"), B=document.getElementById("tbtns");
  var show=walkMode&&!(typeof talkOpen!=="undefined"&&talkOpen)&&!(typeof greetOpen!=="undefined"&&greetOpen);
  if(J.classList.contains("gone")===show) J.classList.toggle("gone",!show);
  if(B.classList.contains("gone")===show) B.classList.toggle("gone",!show);
  var sp=document.getElementById("t-speak"), up=document.getElementById("t-up"), dn=document.getElementById("t-down");
  var near=!!(typeof nearChar!=="undefined"&&nearChar);
  if(sp.classList.contains("gone")===near) sp.classList.toggle("gone",!near);
  var fly=!!(typeof canFly!=="undefined"&&canFly);
  if(up.classList.contains("gone")===fly){ up.classList.toggle("gone",!fly); dn.classList.toggle("gone",!fly); }
}

