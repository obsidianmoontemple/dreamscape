/* Dream Walker's Atlas — sound.js
   procedural positional audio
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   9. SOUND — procedural, positional, no assets
   ============================================================ */
var audio={on:false,ctx:null,nodes:{},master:null};
var VOICE={
  water:"surf", tree:"rustle", pine:"rustle", hedge:"rustle", grass:"rustle",
  road:"traffic", car:"traffic", truck:"traffic", bus:"traffic", train:"rumble",
  factory:"rumble", crowd:"murmur", bird:"chirp", station:"murmur",
  fountain:"surf", streetlight:"hum", pylon:"hum", portal:"hum", creature:"rumble"
};
function noiseBuffer(ctx){
  var n=ctx.sampleRate*2, b=ctx.createBuffer(1,n,ctx.sampleRate), d=b.getChannelData(0);
  for(var i=0;i<n;i++) d[i]=Math.random()*2-1;
  return b;
}
function startAudio(){
  if(audio.ctx) { audio.ctx.resume(); audio.on=true; return; }
  var C=window.AudioContext||window.webkitAudioContext;
  if(!C) return;
  audio.ctx=new C();
  audio.master=audio.ctx.createGain();
  audio.master.gain.value=0.5;
  audio.master.connect(audio.ctx.destination);
  audio.buf=noiseBuffer(audio.ctx);
  audio.on=true;
  // ambient bed
  var src=audio.ctx.createBufferSource();
  src.buffer=audio.buf; src.loop=true;
  var f=audio.ctx.createBiquadFilter(); f.type="lowpass"; f.frequency.value=320;
  var g=audio.ctx.createGain(); g.gain.value=0.05;
  src.connect(f); f.connect(g); g.connect(audio.master); src.start();
  audio.bed=g;
}
function voiceFor(spec){
  var v=VOICE[spec.archetype]; if(!v) return null;
  var ctx=audio.ctx;
  var src=ctx.createBufferSource(); src.buffer=audio.buf; src.loop=true;
  var f=ctx.createBiquadFilter();
  var g=ctx.createGain();
  var p=ctx.createPanner();
  p.panningModel="equalpower"; p.distanceModel="inverse";
  p.refDistance=8; p.maxDistance=260; p.rolloffFactor=1.4;
  if(p.positionX){ p.positionX.value=spec.x; p.positionY.value=2; p.positionZ.value=spec.z; }
  else p.setPosition(spec.x,2,spec.z);
  if(v==="surf"){ f.type="lowpass"; f.frequency.value=520; g.gain.value=0.30; }
  else if(v==="rustle"){ f.type="highpass"; f.frequency.value=2400; g.gain.value=0.10; }
  else if(v==="traffic"){ f.type="lowpass"; f.frequency.value=180; g.gain.value=0.26; }
  else if(v==="rumble"){ f.type="lowpass"; f.frequency.value=90; g.gain.value=0.40; }
  else if(v==="murmur"){ f.type="bandpass"; f.frequency.value=650; f.Q.value=1.2; g.gain.value=0.22; }
  else if(v==="hum"){ f.type="bandpass"; f.frequency.value=120; f.Q.value=8; g.gain.value=0.18; }
  else if(v==="chirp"){ f.type="bandpass"; f.frequency.value=4200; f.Q.value=14; g.gain.value=0.16; }
  src.connect(f); f.connect(g); g.connect(p); p.connect(audio.master); src.start();
  return {src:src,pan:p,gain:g};
}
function audioTick(){
  if(!audio.ctx) return;
  var L=audio.ctx.listener;
  if(L.positionX){
    L.positionX.value=camera.position.x; L.positionY.value=camera.position.y; L.positionZ.value=camera.position.z;
    var d=new THREE.Vector3(); camera.getWorldDirection(d);
    L.forwardX.value=d.x; L.forwardY.value=d.y; L.forwardZ.value=d.z;
    L.upX.value=0; L.upY.value=1; L.upZ.value=0;
  } else if(L.setPosition){
    L.setPosition(camera.position.x,camera.position.y,camera.position.z);
  }
  // attach voices lazily to nearby objects
  for(var i=0;i<store.objects.length;i++){
    var s=store.objects[i];
    if(!VOICE[s.archetype]) continue;
    var dx=s.x-camera.position.x, dz=s.z-camera.position.z;
    var near=(dx*dx+dz*dz)<300*300;
    if(near && !audio.nodes[s.id]) audio.nodes[s.id]=voiceFor(s);
    else if(!near && audio.nodes[s.id]){
      try{ audio.nodes[s.id].src.stop(); }catch(e){}
      delete audio.nodes[s.id];
    }
  }
}
function stopAudio(){
  audio.on=false;
  Object.keys(audio.nodes).forEach(function(k){ try{audio.nodes[k].src.stop();}catch(e){} delete audio.nodes[k]; });
  if(audio.ctx) audio.ctx.suspend();
}

