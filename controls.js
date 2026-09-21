/* Dream Walker's Atlas — controls.js
   camera, walking, proximity and inspecting forms
   loaded as a plain script; shares scope with the other files */
"use strict";
var walkMode=false, locked=false, keys={}, yaw=0, pitch=0;
var canFly=false, flyY=0, portalCool=0;
var orb={r:180,t:0.9,p:0.95,tx:0,tz:0}, dragging=null, idle=0;

function initControls(){
  var el=renderer.domElement;

  addEventListener("keydown",function(e){
    if(document.activeElement && document.activeElement.tagName==="TEXTAREA") return;
    keys[e.code]=true;
    if(e.code==="KeyE" && walkMode && nearChar && !talkOpen && !greetOpen){
      e.preventDefault();
      if(nearChar.primary===false) openGreet(nearChar); else openTalk(nearChar);
      return;
    }
    if(e.code==="Escape"){
      if(document.getElementById("interp").classList.contains("open")){ closeInterp(); return; }
      if(storyOpen){ closeStory(); return; }
      if(document.getElementById("journal").classList.contains("open")){ closeJournal(); return; }
      if(document.getElementById("self").classList.contains("open")){ closeSelf(); return; }
      if(greetOpen){ closeGreet(); return; }
      if(talkOpen){ closeTalk(); return; }
      document.getElementById("roster").classList.remove("open");
      if(walkMode) setWalk(false);
      closeInspect();
    }
    if(walkMode && ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].indexOf(e.code)>-1) e.preventDefault();
  });
  addEventListener("keyup",function(e){ keys[e.code]=false; });

  el.addEventListener("mousedown",function(e){
    if(walkMode||plotBusy) return;
    dragging={x:e.clientX,y:e.clientY}; idle=0;
  });
  addEventListener("mouseup",function(){ dragging=null; });
  addEventListener("mousemove",function(e){
    if(locked){
      yaw-=e.movementX*0.0022;
      pitch=Math.max(-1.35,Math.min(1.35,pitch-e.movementY*0.0022));
      return;
    }
    if(dragging && !plotBusy){
      if(plotOn && (e.shiftKey || (e.buttons&2))){
        panOrbit((e.clientX-dragging.x),(e.clientY-dragging.y));
        dragging={x:e.clientX,y:e.clientY}; return;
      }
      orb.t-=(e.clientX-dragging.x)*0.006;
      orb.p=Math.max(0.12,Math.min(1.5,orb.p-(e.clientY-dragging.y)*0.005));
      dragging={x:e.clientX,y:e.clientY}; idle=0;
    }
  });
  el.addEventListener("wheel",function(e){
    if(walkMode) return;
    e.preventDefault();
    orb.r=Math.max(25,Math.min(1400,orb.r*(1+Math.sign(e.deltaY)*0.12)));
    idle=0;
  },{passive:false});

  el.addEventListener("click",function(){
    if(walkMode && !locked && el.requestPointerLock) el.requestPointerLock();
    else if(walkMode && locked) pick();
  });
  document.addEventListener("pointerlockchange",function(){
    locked=(document.pointerLockElement===el);
    document.getElementById("recticle").classList.toggle("gone",!locked);
  });

  var lt=null;
  el.addEventListener("touchstart",function(e){ lt={x:e.touches[0].clientX,y:e.touches[0].clientY,n:e.touches.length}; },{passive:true});
  el.addEventListener("touchmove",function(e){
    if(!lt||plotBusy) return;
    var t=e.touches[0], dx=t.clientX-lt.x, dy=t.clientY-lt.y;
    if(walkMode){ yaw-=dx*0.005; pitch=Math.max(-1.35,Math.min(1.35,pitch-dy*0.005)); }
    else { orb.t-=dx*0.006; orb.p=Math.max(0.12,Math.min(1.5,orb.p-dy*0.005)); idle=0; }
    lt={x:t.clientX,y:t.clientY,n:e.touches.length};
  },{passive:true});
  el.addEventListener("touchend",function(){ lt=null; },{passive:true});
}

function lookTarget(){
  var g=store.grid, o=blockOrigin(g.bx,g.bz);
  return {x:o.x,z:o.z};
}

function animate(){
  requestAnimationFrame(animate);
  var dt=Math.min(clock.getDelta(),0.1);

  if(walkMode){
    var sp=(keys["ShiftLeft"]||keys["ShiftRight"])?20:7;
    var f=0,s=0;
    if(keys["KeyW"]||keys["ArrowUp"]) f+=1;
    if(keys["KeyS"]||keys["ArrowDown"]) f-=1;
    if(keys["KeyA"]||keys["ArrowLeft"]) s-=1;
    if(keys["KeyD"]||keys["ArrowRight"]) s+=1;
    if(f||s){
      var l=Math.hypot(f,s); f/=l; s/=l;
      camera.position.x+=(Math.sin(yaw)*-f+Math.cos(yaw)*s)*sp*dt;
      camera.position.z+=(Math.cos(yaw)*-f-Math.sin(yaw)*s)*sp*dt;
    }
    if(canFly){
      if(keys["Space"]) flyY+=sp*dt;
      if(keys["KeyC"]||keys["ControlLeft"]) flyY-=sp*dt;
      flyY=Math.max(0,Math.min(420,flyY));
      camera.position.y=1.72+flyY;
    } else camera.position.y=1.72;
    camera.rotation.order="YXZ";
    camera.rotation.set(pitch,yaw,0);
    stepThrough();
    proximity(dt);
  } else {
    idle+=dt;
    if(idle>4 && !dragging && !plotOn) orb.t+=dt*0.045;
    if(plotOn) plotKeys(dt);
    var tgt=lookTarget();
    if(!plotOn) orb.tx+=(tgt.x-orb.tx)*Math.min(dt*1.4,1);
    if(!plotOn) orb.tz+=(tgt.z-orb.tz)*Math.min(dt*1.4,1);
    camera.position.set(
      orb.tx+Math.cos(orb.t)*Math.cos(orb.p)*orb.r,
      Math.max(6,Math.sin(orb.p)*orb.r),
      orb.tz+Math.sin(orb.t)*Math.cos(orb.p)*orb.r
    );
    camera.rotation.order="XYZ";
    camera.lookAt(orb.tx,12,orb.tz);
  }
  tickClock(false);
  skyFollow();
  if(audio.on) audioTick();
  renderer.render(scene,camera);
}

/* a portal or a secret way moves you when you step into it */
function stepThrough(){
  if(portalCool>0){ portalCool-=1; return; }
  var hit=passageAt(camera.position.x,camera.position.z,3.2);
  if(!hit) return;
  var ang=Math.random()*6.283;
  camera.position.x=hit.to.x+Math.cos(ang)*5;
  camera.position.z=hit.to.z+Math.sin(ang)*5;
  flyY=0;
  portalCool=140;
  var nm=placeName(hit.to);
  setStatus("<b>Through \u2014 "+esc(nm)+".</b>");
  var pel=document.getElementById("place");
  pel.innerHTML=esc(nm); pel.classList.remove("gone");
  lastPlace=hit.to;
}

/* awake figures turn to watch you when you come close */
var nearChar=null, lastPlace=null;
function proximity(dt){
  var p=camera.position;
  for(var i=0;i<store.characters.length;i++){
    var c=store.characters[i];
    if(!c.awake||!c.objId) continue;
    var g=meshes[c.objId];
    if(!g) continue;
    var dx=p.x-c.x, dz=p.z-c.z, d2=dx*dx+dz*dz;
    if(d2<900){
      var want=Math.atan2(dx,dz);
      var diff=((want-g.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;
      g.rotation.y+=diff*Math.min(dt*1.6,1);
    }
    g.children.forEach(function(ch){ if(ch.userData.spin) ch.rotation.z+=dt*0.6; });
  }
  var here=nearestNamed(p.x,p.z,70);
  var pel=document.getElementById("place");
  if(here!==lastPlace){
    lastPlace=here;
    if(here){
      pel.innerHTML=esc(placeName(here))+
        (here.addr&&here.archetype!=="road"?("<small>"+esc(here.addr.street)+"</small>"):"");
      pel.classList.remove("gone");
    } else pel.classList.add("gone");
  }
  var n=awakeNear(p,7);
  if(n!==nearChar){
    nearChar=n;
    var el=document.getElementById("prompt");
    if(n && !talkOpen && !greetOpen){
      document.getElementById("prompt-who").textContent=(n.primary===false?"someone":
        n.awake?n.name:(n.name+" \u00b7 not yet awake"));
      el.classList.remove("gone");
    } else el.classList.add("gone");
  }
}

function setWalk(on){
  walkMode=on;
  document.getElementById("scrim").classList.toggle("hidden",on);
  document.getElementById("walkhint").classList.toggle("gone",!on);
  document.getElementById("walkbtn").textContent=on?"Back to capture":"Walk it";
  if(!on){ if(document.exitPointerLock) document.exitPointerLock(); closeInspect();
           document.getElementById("place").classList.add("gone"); lastPlace=null; }
  else{
    var t=lookTarget();
    yaw=0; pitch=0; flyY=0; portalCool=60;
    canFly=hasAbility("flying")||hasAbility("floating");
    document.getElementById("walkhint").innerHTML=
      "click to look &middot; wasd move &middot; shift run"+
      (canFly?" &middot; space/c to rise and fall":"")+
      " &middot; click a form to inspect &middot; e to speak &middot; esc back";
    camera.position.set(t.x, 1.72, t.z+70);
  }
}

/* ============================================================
   8. INSPECT — click a form and change what it is
   ============================================================ */
var picked=null;
var SWATCH=[0x4A4640,0xB9B3A6,0x16171C,0x7A3128,0x2E4566,0x33502F,0x8A6A2E,0x5E3A30,0x4E4C46,0x6B4A3A];

function pick(){
  raycaster.setFromCamera({x:0,y:0},camera);
  var hits=raycaster.intersectObjects(scene.children,true);
  for(var i=0;i<hits.length;i++){
    var o=hits[i].object;
    while(o && o.userData.id===undefined) o=o.parent;
    if(o && o.userData.id){ openInspect(o.userData.id); return; }
  }
  closeInspect();
}
function specById(id){
  for(var i=0;i<store.objects.length;i++) if(store.objects[i].id===id) return store.objects[i];
  return null;
}
function openInspect(id){
  picked=specById(id);
  if(!picked) return;
  if(document.exitPointerLock) document.exitPointerLock();
  document.getElementById("i-name").textContent=placeName(picked);
  var fl=document.getElementById("i-floors"), fb=LEVELS[picked.archetype];
  fl.disabled=!fb; fl.value=fb?(picked.attrs.lv||fb):"";
  var lk=document.getElementById("i-link"), opts=['<option value="">\u2014</option>'];
  store.objects.forEach(function(o){
    if(o===picked||o.filler||o.archetype!==picked.archetype||!o.nights||!picked.nights) return;
    var shared=o.nights.some(function(n){ return picked.nights.indexOf(n)>-1; });
    if(shared) return;
    opts.push('<option value="'+o.id+'">'+esc(placeName(o))+" \u2014 night"+(o.nights.length>1?"s ":" ")+o.nights.join(", ")+"</option>");
  });
  lk.innerHTML=opts.join("");
  lk.disabled=opts.length<2;
  document.getElementById("i-name-in").value=picked.name||"";
  document.getElementById("i-sub").textContent=picked.archetype+" \u00b7 "+Math.round(fidelity(picked)*100)+"% remembered"+
    (picked.nights&&picked.nights.length>1?(" \u00b7 "+picked.nights.length+" nights"):"");
  document.getElementById("i-label").value=picked.label||"";
  document.getElementById("i-sign").value=picked.sign||"";
  document.getElementById("i-scale").value=picked.attrs.s||1;
  document.getElementById("i-height").value=picked.attrs.h||1;
  document.getElementById("inspect").classList.add("open");
}
function closeInspect(){ picked=null; document.getElementById("inspect").classList.remove("open"); }
function touchPicked(){
  if(!picked) return;
  refresh(picked);
  document.getElementById("i-sub").textContent=picked.archetype+" \u00b7 "+Math.round(fidelity(picked)*100)+"% remembered";
  save();
}

