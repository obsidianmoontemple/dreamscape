/* SomnuMatrix — effects.js
   things that move: smoke and embers from a volcano, blowing sand, a turning
   funnel, falling snow and rain, flickering flame, lightning, drifting wisps,
   hovering islands, turning wheels. only what's near you is animated.
   loaded as a plain script; shares scope with the other files */
"use strict";

var DOT=null;
function dotTexture(){
  if(DOT!==null) return DOT||null;
  DOT=(typeof softGlow==="function"&&softGlow())||false;
  return DOT||null;
}

function glowMat(col,opa){
  return new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:opa===undefined?0.9:opa,depthWrite:false});
}

/* a cloud of points that an animation moves about */
function particles(n,spread,col,size,opa){
  var pos=new Float32Array(n*3), seed=[];
  for(var i=0;i<n;i++){
    var r=Math.random(), a=Math.random()*6.283;
    pos[i*3]=Math.cos(a)*r*spread[0]; pos[i*3+1]=Math.random()*spread[1]; pos[i*3+2]=Math.sin(a)*r*spread[2];
    seed.push({a:a,r:r,y:pos[i*3+1],s:0.5+Math.random()});
  }
  var g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.BufferAttribute(pos,3));
  var p=new THREE.Points(g,new THREE.PointsMaterial({color:col,size:size,transparent:true,opacity:opa||0.8,depthWrite:false,
    map:dotTexture(),alphaTest:0.02}));
  p.userData.seed=seed; p.userData.spread=spread;
  return p;
}
function pts(p){ return p.geometry&&p.geometry.attributes&&p.geometry.attributes.position; }

/* motion kinds for a cloud of points */
function rise(p,dt,speed,drift){
  var A=pts(p); if(!A) return; var a=A.array, S=p.userData.seed, sp=p.userData.spread;
  for(var i=0;i<S.length;i++){
    a[i*3+1]+=speed*S[i].s*dt; a[i*3]+=drift*dt*S[i].s;
    if(a[i*3+1]>sp[1]){ a[i*3+1]=0; var ang=Math.random()*6.283, r=Math.random(); a[i*3]=Math.cos(ang)*r*sp[0]; a[i*3+2]=Math.sin(ang)*r*sp[2]; }
  }
  A.needsUpdate=true;
}
function fall(p,dt,speed,wind){
  var A=pts(p); if(!A) return; var a=A.array, S=p.userData.seed, sp=p.userData.spread;
  for(var i=0;i<S.length;i++){
    a[i*3+1]-=speed*S[i].s*dt; a[i*3]+=wind*dt;
    if(a[i*3+1]<0){ a[i*3+1]=sp[1]; a[i*3]=(Math.random()*2-1)*sp[0]; }
    if(a[i*3]>sp[0]) a[i*3]-=sp[0]*2;
  }
  A.needsUpdate=true;
}
function swirl(p,dt,spin,lift,funnel){
  var A=pts(p); if(!A) return; var a=A.array, S=p.userData.seed, sp=p.userData.spread;
  for(var i=0;i<S.length;i++){
    var s=S[i]; s.a+=spin*s.s*dt; s.y+=lift*s.s*dt; if(s.y>sp[1]) s.y=0;
    var rr=funnel?(0.15+0.85*(s.y/sp[1]))*sp[0]*(0.6+0.4*s.r):s.r*sp[0];
    a[i*3]=Math.cos(s.a)*rr; a[i*3+1]=s.y; a[i*3+2]=Math.sin(s.a)*rr*(funnel?1:sp[2]/sp[0]);
  }
  A.needsUpdate=true;
}

/* ---- what each moving thing does ---- */
var EFFECTS={
  volcano:function(g){
    var smoke=particles(260,[10,90,10],0x55504C,5,0.55); smoke.position.y=58; g.add(smoke);
    var embers=particles(80,[6,30,6],0xFF6A1E,1.6,0.95); embers.position.y=58; g.add(embers);
    return function(t,dt){ rise(smoke,dt,6,1.5); rise(embers,dt,10,0); };
  },
  sandstorm:function(g){
    var sand=particles(700,[40,34,40],0xC8A46A,2.6,0.55); g.add(sand);
    return function(t,dt){ swirl(sand,dt,0.5,1.5,false); };
  },
  tornado:function(g){
    var fun=particles(600,[14,70,14],0x8C8A86,2.2,0.6); g.add(fun);
    var deb=particles(60,[18,8,18],0x4A3A2A,1.5,0.9); g.add(deb);
    return function(t,dt){ swirl(fun,dt,3.2,6,true); swirl(deb,dt,2.2,2,false); };
  },
  wildfire:function(g){
    var flames=[], smoke=particles(220,[16,40,16],0x3E3A38,4.5,0.5); smoke.position.y=4; g.add(smoke);
    for(var i=0;i<14;i++){
      var fl=new THREE.Mesh(new THREE.ConeGeometry(1.2,4,6),glowMat(i%2?0xFF7A1E:0xFFB23A,0.85));
      var a=Math.random()*6.283, r=Math.random()*12; fl.position.set(Math.cos(a)*r,2,Math.sin(a)*r); g.add(fl); flames.push(fl);
    }
    return function(t,dt){ rise(smoke,dt,4,1);
      flames.forEach(function(fl,k){ var s=0.7+0.4*Math.abs(Math.sin(t*6+k*1.7)); fl.scale.set(1,s,1); fl.position.y=2*s; }); };
  },
  fire:function(g){
    var flames=[], smoke=particles(70,[2,14,2],0x3E3A38,2,0.5); smoke.position.y=2; g.add(smoke);
    for(var i=0;i<5;i++){
      var fl=new THREE.Mesh(new THREE.ConeGeometry(0.6,2.2,6),glowMat(i%2?0xFF7A1E:0xFFB23A,0.9));
      fl.position.set((i-2)*0.5,1.1,(i%2)*0.4); g.add(fl); flames.push(fl);
    }
    return function(t,dt){ rise(smoke,dt,3,0.6);
      flames.forEach(function(fl,k){ var s=0.7+0.45*Math.abs(Math.sin(t*7+k*2.1)); fl.scale.set(1,s,1); fl.position.y=1.1*s; }); };
  },
  flood:function(g){ return function(t){ g.position.y=Math.sin(t*0.6)*0.12; }; },
  tidalwave:function(g){ return function(t){ g.scale.y=1+Math.sin(t*0.8)*0.05; }; },
  fissure:function(g){
    var steam=particles(120,[16,14,1.5],0xC9C4BE,2.4,0.4); g.add(steam);
    return function(t,dt){ rise(steam,dt,3,0.2); };
  },
  blizzard:function(g){
    var snow=particles(900,[30,30,30],0xF2F4F8,1.4,0.85); g.add(snow);
    return function(t,dt){ fall(snow,dt,4,4); };
  },
  stormcloud:function(g){
    var rain=particles(700,[16,22,16],0x9FB0C4,1,0.6); g.add(rain);
    return function(t,dt){ fall(rain,dt,26,1); };
  },
  lightningstorm:function(g){
    var rain=particles(500,[20,40,20],0x9FB0C4,1,0.5); g.add(rain);
    var bolt=g.userData.bolt;
    return function(t,dt){ fall(rain,dt,26,1);
      if(bolt) bolt.visible=(Math.sin(t*1.7)>0.985)||(Math.sin(t*2.9+1)>0.99); };
  },
  ashcloud:function(g){
    var ash=particles(500,[24,50,24],0x3C3A38,6,0.5); g.add(ash);
    return function(t,dt){ rise(ash,dt,2,1); };
  },
  meteor:function(g){
    var trail=particles(90,[1.2,34,1.2],0xFFC27A,2,0.8); trail.position.set(0,6,0); trail.rotation.z=0.5; g.add(trail);
    return function(t,dt){ rise(trail,dt,14,0); };
  },
  geyser:function(g){
    var jet=particles(260,[1.4,14,1.4],0xDCE8F0,1.8,0.7); g.add(jet);
    return function(t,dt){ var on=Math.sin(t*0.5)>-0.3; jet.visible=on; if(on) rise(jet,dt,16,0); };
  },
  cauldron:function(g){
    var bub=particles(40,[0.7,2.4,0.7],0x7FE08A,0.9,0.85); bub.position.y=1.5; g.add(bub);
    return function(t,dt){ rise(bub,dt,1.4,0); };
  },
  wisps:function(g){
    var w=particles(26,[8,4,8],0xBFE8FF,1.8,0.95); w.position.y=1; g.add(w);
    return function(t,dt){ swirl(w,dt,0.35,0.2,false); };
  },
  spiritfire:function(g){
    var fl=[]; for(var i=0;i<3;i++){ var m=new THREE.Mesh(new THREE.ConeGeometry(0.5-i*0.1,2-i*0.3,6),glowMat(i?0x8FD3FF:0x4FA3E8,0.8)); m.position.y=1; g.add(m); fl.push(m); }
    return function(t){ fl.forEach(function(m,k){ var s=0.8+0.3*Math.abs(Math.sin(t*5+k)); m.scale.set(1,s,1); }); };
  },
  floatingisland:function(g){ var y0=g.position.y; return function(t){ g.children.forEach(function(c){ if(!c.userData.contact) c.position.y=(c.userData.y0!==undefined?c.userData.y0:(c.userData.y0=c.position.y))+Math.sin(t*0.5)*0.8; }); }; },
  hotairballoon:function(g){ return function(t){ g.children.forEach(function(c){ if(!c.userData.contact) c.position.y=(c.userData.y0!==undefined?c.userData.y0:(c.userData.y0=c.position.y))+Math.sin(t*0.4)*1.2; }); }; },
  orrery:function(g){ var rings=g.children.filter(function(c){ return c.geometry&&c.geometry.type==="TorusGeometry"; });
    return function(t,dt){ rings.forEach(function(r,k){ r.rotation.y+=dt*(0.3+k*0.25); r.rotation.x+=dt*0.1*(k%2?1:-1); }); }; },
  ferriswheel:function(g){ var wheel=g.userData.wheel; return function(t,dt){ if(wheel) wheel.rotation.z+=dt*0.12; }; },
  carousel:function(g){ var top=g.userData.spin; return function(t,dt){ if(top) top.rotation.y+=dt*0.5; }; },
  crystal:function(g){ var mats=[]; g.traverse(function(c){ if(c.material&&c.material.userData&&c.material.userData.pulse) mats.push(c.material); });
    return function(t){ mats.forEach(function(m,k){ m.opacity=0.55+0.3*Math.abs(Math.sin(t*1.2+k)); }); }; },
  orb:function(g){ var mats=[]; g.traverse(function(c){ if(c.material&&c.material.userData&&c.material.userData.pulse) mats.push(c.material); });
    return function(t){ mats.forEach(function(m){ m.opacity=0.6+0.35*Math.abs(Math.sin(t*1.5)); }); }; },
  waterfall:function(g){
    var mist=particles(120,[6,6,3],0xE6EEF4,2.2,0.45); mist.position.set(0,0,3); g.add(mist);
    var spray=particles(260,[4,20,0.6],0xCFE2EE,1.2,0.6); spray.position.set(0,0,1.2); g.add(spray);
    return function(t,dt){ rise(mist,dt,1.2,0); fall(spray,dt,12,0); };
  }
};
EFFECTS.crystalspire=EFFECTS.crystal;

/* build-time: attach an effect; run-time: animate only what's near */
function attachEffect(g,spec){
  var fx=EFFECTS[spec.archetype]; if(!fx) return;
  try{ var run=fx(g,spec); if(run) g.userData.anim=run; }catch(e){}
}
var fxClock=0;
function animateEffects(dt){
  fxClock+=dt;
  var cx=camera.position.x, cz=camera.position.z;
  for(var id in meshes){
    var m=meshes[id], run=m.userData.anim; if(!run||!m.visible) continue;
    var dx=m.position.x-cx, dz=m.position.z-cz;
    if(dx*dx+dz*dz>700*700) continue;
    run(fxClock,dt);
  }
}

