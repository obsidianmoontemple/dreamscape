/* SomnuMatrix — skies.js
   the other worlds do not get our sky. each one gets its own, alive and moving:
   aurora curtains over Faerie and the frozen north, rolling smoke in the
   underworld, shafts of light in the heavens, caustics overhead in the Deep,
   a kaleidoscope in the mirror world, a slow vortex in the void, nebula among
   the stars, dust over the wasteland.
   drawn on a second dome with one shader, so it costs almost nothing.
   loaded as a plain script; shares scope with the other files */
"use strict";

var realmSky=null, realmSkyKind=null, skyT=0, realmMoons=[];

/* mode: 1 aurora · 2 smoke · 3 shafts · 4 caustics · 5 kaleidoscope · 6 vortex · 7 nebula · 8 dust */
var SKYWORK={
  faerie:     {mode:1,a:0x35F0A0,b:0xC050FF,c:0xFFE96A,speed:1.0,lift:0.85,amt:1.7},
  frozen:     {mode:1,a:0x30F0C0,b:0x4A7AFF,c:0xD8F4FF,speed:0.7,lift:0.9,amt:1.5},
  heavens:    {mode:3,a:0xFFD98A,b:0xFFFFFF,c:0xFFC060,speed:0.6,lift:0.8,amt:1.2},
  underworld: {mode:2,a:0x3A0E0E,b:0xC0402A,c:0x1A0A0A,speed:0.8,lift:0.7},
  dead:       {mode:2,a:0x2A2E36,b:0xD8DCE4,c:0x1A1E24,speed:0.35,lift:0.6,amt:1.0},
  depths:     {mode:4,a:0x1E6A8E,b:0xA8F4FF,c:0x2ADCC8,speed:1.0,lift:0.9,amt:1.3},
  mirror:     {mode:5,a:0x9FC0E8,b:0xFFFFFF,c:0xE8A8FF,speed:0.5,lift:0.7,amt:1.2},
  "void":     {mode:6,a:0x2A1050,b:0x9A6AFF,c:0x4AE8E8,speed:0.5,lift:0.5,amt:1.3},
  fire:       {mode:6,a:0x8A1A06,b:0xFFAA2E,c:0xFF3A10,speed:1.2,lift:0.6,amt:1.4},
  stars:      {mode:7,a:0x2A1060,b:0xC050E8,c:0x4AE0FF,speed:0.35,lift:0.4,amt:1.5},
  wasteland:  {mode:8,a:0xC8B078,b:0x8A7A50,c:0xE8D8A8,speed:0.6,lift:0.5},
  desert:     {mode:8,a:0xF0D8A8,b:0xBFD8EC,c:0xFFF0D0,speed:0.4,lift:0.4},
  templerow:  {mode:3,a:0xFFE0B0,b:0xFFFFFF,c:0xC8A8FF,speed:0.4,lift:0.8,amt:1.1},
  hall:       {mode:5,a:0x7A6AD8,b:0xFFFFFF,c:0x6AE8FF,speed:0.3,lift:0.75,amt:1.3},
  somnucor:   {mode:5,a:0x6A5AC8,b:0xE8E4FF,c:0x4AE8FF,speed:0.35,lift:0.6,amt:1.2},
  station:    {mode:7,a:0x0A0A18,b:0x4A6AE8,c:0x6AE8FF,speed:0.3,lift:0.4,amt:1.4},
  future:     {mode:6,a:0x2A0A3A,b:0xFF4AE0,c:0x4AE8FF,speed:0.7,lift:0.55,amt:1.3},
  elsewhere:  {mode:7,a:0x1A4A4A,b:0x6AFFC4,c:0xFF6AC8,speed:0.8,lift:0.6,amt:1.5}
};

var SKY_FRAG=[
"precision mediump float;",
"uniform float t; uniform int mode; uniform vec3 cA; uniform vec3 cB; uniform vec3 cC;",
"uniform float lift; uniform float amt;",
"varying vec3 vP;",
"float h21(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }",
"float vnoi(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);",
"  return mix(mix(h21(i),h21(i+vec2(1.0,0.0)),f.x), mix(h21(i+vec2(0.0,1.0)),h21(i+vec2(1.0,1.0)),f.x), f.y); }",
"float fbm(vec2 p){ float s=0.0, m=0.5; for(int i=0;i<5;i++){ s+=m*vnoi(p); p*=2.03; m*=0.5; } return s; }",
"void main(){",
"  vec3 d=normalize(vP);",
"  float y=clamp(d.y*0.5+0.5,0.0,1.0);",
"  float up=smoothstep(-0.25,0.85,d.y);",
"  vec2 uv=vec2(atan(d.z,d.x), asin(clamp(d.y,-1.0,1.0)));",
"  vec3 col=cA; float a=0.0;",
"  if(mode==1){",
"    float wob=fbm(vec2(uv.x*2.2+t*0.05, t*0.03));",
"    float wob2=fbm(vec2(uv.x*3.7-t*0.04, 4.0+t*0.02));",
"    float c1=0.30+0.38*wob, c2=0.55+0.30*wob2;",
"    float band=exp(-pow((uv.y-c1)*5.0,2.0))+0.7*exp(-pow((uv.y-c2)*7.0,2.0));",
"    float streak=0.45+0.55*abs(sin(uv.x*70.0+wob*12.0+t*0.4));",
"    float foot=smoothstep(-0.15,0.35,d.y);",
"    col=mix(cA,cB,clamp(uv.y*1.5+wob*0.5,0.0,1.0));",
"    col=mix(col,cC,streak*0.25);",
"    a=band*streak*foot*0.82;",
"  } else if(mode==2){",
"    float f=fbm(vec2(uv.x*2.2+t*0.03, uv.y*2.6+sin(t*0.07)*0.3));",
"    float g=fbm(vec2(uv.x*4.0-t*0.05, uv.y*5.0));",
"    col=mix(cA,cB,pow(f,2.0)); col=mix(col,cC,g*0.4);",
"    a=smoothstep(0.18,0.95,f)*0.85;",
"  } else if(mode==3){",
"    float ang=uv.x*7.0+t*0.10;",
"    float sh=pow(abs(sin(ang)),9.0)+pow(abs(sin(ang*0.37+1.3)),14.0);",
"    float cl=fbm(vec2(uv.x*2.0+t*0.02,uv.y*3.0));",
"    col=mix(cA,cB,sh); col=mix(col,cC,cl*0.4);",
"    a=(sh*0.6+cl*0.25)*up;",
"  } else if(mode==4){",
"    float c=sin(uv.x*11.0+t*0.8+fbm(uv*3.0)*4.0)*sin(uv.y*13.0-t*0.5);",
"    c=pow(abs(c),3.0);",
"    col=mix(cA,cB,c); col=mix(col,cC,0.3*(1.0-c));",
"    a=(c*0.85+0.10)*up;",
"  } else if(mode==5){",
"    vec2 k=uv; k.x=abs(mod(k.x+0.3927,0.7854)-0.3927); k.y=abs(k.y);",
"    float f=fbm(k*7.0+vec2(t*0.04,-t*0.03));",
"    float e=smoothstep(0.46,0.54,f);",
"    col=mix(cA,cB,e); col=mix(col,cC,smoothstep(0.7,1.0,f));",
"    a=(0.35+0.4*e)*up;",
"  } else if(mode==6){",
"    float r=1.0-y;",
"    float sp=sin(uv.x*3.0+r*16.0-t*0.6+fbm(uv*2.0)*2.0);",
"    col=mix(cA,cB,sp*0.5+0.5); col=mix(col,cC,r*0.5);",
"    a=smoothstep(0.25,1.0,abs(sp))*0.7;",
"  } else if(mode==7){",
"    float f=fbm(vec2(uv.x*2.0,uv.y*2.2)+vec2(t*0.012,t*0.008));",
"    float g=fbm(vec2(uv.x*5.0,uv.y*5.0)-t*0.01);",
"    col=mix(cA,mix(cB,cC,g),f);",
"    float spark=step(0.9985,h21(floor(uv*220.0)));",
"    a=smoothstep(0.30,1.0,f)*0.9+spark;",
"  } else {",
"    float f=fbm(vec2(uv.x*3.0+t*0.06, uv.y*6.0));",
"    col=mix(cA,cB,f); col=mix(col,cC,up*0.35);",
"    a=((1.0-y)*0.75*f+0.06);",
"  }",
"  a*=amt*mix(1.0,up,lift);",
"  gl_FragColor=vec4(col,clamp(a,0.0,1.0));",
"}"].join("\n");

function skyStrange(){ return cfg().skies!==false; }

function buildRealmSky(kind){
  clearRealmSky();
  var W=SKYWORK[kind]; if(!W||!skyStrange()) return;
  if(typeof THREE==="undefined"||!THREE.ShaderMaterial) return;
  var mat=new THREE.ShaderMaterial({
    uniforms:{t:{value:0},mode:{value:W.mode},cA:{value:new THREE.Color(W.a)},cB:{value:new THREE.Color(W.b)},
              cC:{value:new THREE.Color(W.c)},lift:{value:W.lift},amt:{value:W.amt||1}},
    vertexShader:"varying vec3 vP; void main(){ vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader:SKY_FRAG,
    side:THREE.BackSide, transparent:true, depthWrite:false, depthTest:true, fog:false,
    /* light-like skies add their glow; smoke and dust veil instead */
    blending:(W.mode===2||W.mode===8)?THREE.NormalBlending:THREE.AdditiveBlending
  });
  realmSky=new THREE.Mesh(new THREE.SphereGeometry(SKY_R*0.985,40,24),mat);
  realmSky.renderOrder=-9.5; realmSky.userData.speed=W.speed;
  scene.add(realmSky);
  realmSkyKind=kind;
  /* a couple of worlds get something hanging in them */
  if(kind==="stars"||kind==="elsewhere"){
    [[0.55,0.42,120,0xE8DCC8],[ -0.7,0.30,70,0xC88A6A]].forEach(function(m){
      var disc=new THREE.Mesh(new THREE.CircleGeometry(m[2],36),
        new THREE.MeshBasicMaterial({color:m[3],transparent:true,opacity:.95,fog:false,depthWrite:false}));
      disc.renderOrder=-9;
      disc.userData.at=[m[0],m[1]];
      scene.add(disc); realmMoons.push(disc);
    });
    if(kind==="stars"){
      var ring=new THREE.Mesh(new THREE.RingGeometry(150,215,48),
        new THREE.MeshBasicMaterial({color:0xE8D8B8,transparent:true,opacity:.5,side:THREE.DoubleSide,fog:false,depthWrite:false}));
      ring.renderOrder=-9; ring.userData.at=[0.55,0.42]; ring.userData.ring=1;
      scene.add(ring); realmMoons.push(ring);
    }
  }
}
function clearRealmSky(){
  if(realmSky){ scene.remove(realmSky); realmSky=null; }
  realmMoons.forEach(function(m){ scene.remove(m); }); realmMoons=[];
  realmSkyKind=null;
}

/* each frame: the right sky for where you are, kept centred on you, moving */
function realmSkyTick(dt){
  if(typeof scene==="undefined"||!scene) return;
  var r=(typeof realmById==="function"&&store.here)?realmById(store.here):null;
  var kind=r?r.kind:null;
  if(store.inside) kind=null;
  if(!skyStrange()) kind=null;
  if(kind!==realmSkyKind){ if(kind) buildRealmSky(kind); else clearRealmSky(); }
  if(!realmSky) return;
  skyT+=dt*(realmSky.userData.speed||1);
  realmSky.material.uniforms.t.value=skyT;
  var p=camera.position;
  realmSky.position.set(p.x,0,p.z);
  realmMoons.forEach(function(m,i){
    var at=m.userData.at, R=SKY_R*0.93;
    var az=at[0]*Math.PI+skyT*0.004, el=at[1];
    m.position.set(p.x+Math.cos(az)*Math.cos(el)*R, Math.sin(el)*R, p.z+Math.sin(az)*Math.cos(el)*R);
    m.lookAt(p.x,camera.position.y,p.z);
    if(m.userData.ring) m.rotation.x+=0.35;
  });
}

