/* SomnuMatrix — textures.js
   every texture is painted in code: brick, stone, wood, siding, plaster, concrete,
   glass, marble, metal, shingle, tile, slate, thatch, foliage, bark, and ground.
   they are pale detail maps, multiplied by a colour, so the colour system still
   decides what colour a wall is; the texture only decides what it's made of.
   loaded as a plain script; shares scope with the other files */
"use strict";

/* metres of wall one copy of each texture covers */
var TILE={brick:1.6,stone:2.4,wood:2.4,siding:2.4,plaster:4,concrete:3,glass:3.2,marble:3,metal:2,
  shingle:2,tile:2,slate:2,thatch:2.5,metalroof:2,foliage:2,bark:1.2,asphalt:6,
  grass:8,earth:8,sand:8,snow:8,paving:4,void:8,dash:6,voidgrid:20};

function rng(seed){ var s=seed>>>0||1; return function(){ s^=s<<13; s^=s>>>17; s^=s<<5; return ((s>>>0)%100000)/100000; }; }
function grey(v){ v=Math.max(0,Math.min(255,Math.round(v))); return "rgb("+v+","+v+","+v+")"; }
function speckle(x,N,r,amt,count){
  for(var i=0;i<count;i++){ x.fillStyle=grey(200+(r()-0.5)*amt*2); x.globalAlpha=0.35; x.fillRect(r()*N,r()*N,1+r()*2,1+r()*2); }
  x.globalAlpha=1;
}

var PAINT={
  brick:function(x,N,r){
    x.fillStyle=grey(150); x.fillRect(0,0,N,N);
    var rows=8, h=N/rows, w=N/4;
    for(var j=0;j<rows;j++){ var off=(j%2)?w/2:0;
      for(var i=-1;i<5;i++){ x.fillStyle=grey(214+(r()-0.5)*56); x.fillRect(i*w+off+3,j*h+3,w-6,h-6); } }
    speckle(x,N,r,40,900);
  },
  stone:function(x,N,r){
    x.fillStyle=grey(150); x.fillRect(0,0,N,N);
    var y=0; while(y<N){ var h=34+r()*30, px=0;
      while(px<N){ var w=44+r()*70; x.fillStyle=grey(200+(r()-0.5)*56); x.fillRect(px+3,y+3,w-6,h-6); px+=w; } y+=h; }
    speckle(x,N,r,60,1400);
  },
  wood:function(x,N,r){
    var rows=6, h=N/rows;
    for(var j=0;j<rows;j++){ x.fillStyle=grey(200+(r()-0.5)*36); x.fillRect(0,j*h,N,h);
      x.strokeStyle=grey(150); x.globalAlpha=0.35;
      for(var k=0;k<5;k++){ x.beginPath(); var yy=j*h+r()*h; x.moveTo(0,yy);
        for(var s=0;s<=8;s++) x.lineTo(s*N/8,yy+Math.sin(s+r()*3)*2); x.stroke(); }
      x.globalAlpha=1; x.fillStyle=grey(110); x.fillRect(0,j*h,N,2); }
  },
  siding:function(x,N,r){
    var rows=10, h=N/rows;
    for(var j=0;j<rows;j++){ var gr=x.createLinearGradient(0,j*h,0,(j+1)*h);
      gr.addColorStop(0,grey(232)); gr.addColorStop(0.85,grey(206)); gr.addColorStop(1,grey(150));
      x.fillStyle=gr; x.fillRect(0,j*h,N,h); }
    speckle(x,N,r,20,500);
  },
  plaster:function(x,N,r){
    x.fillStyle=grey(222); x.fillRect(0,0,N,N);
    for(var i=0;i<40;i++){ x.fillStyle=grey(205+r()*30); x.globalAlpha=0.18; x.beginPath(); x.arc(r()*N,r()*N,10+r()*40,0,7); x.fill(); }
    x.globalAlpha=1; speckle(x,N,r,30,1600);
  },
  concrete:function(x,N,r){
    x.fillStyle=grey(208); x.fillRect(0,0,N,N); speckle(x,N,r,50,2200);
    x.fillStyle=grey(150); x.fillRect(0,N/2-1,N,2); x.fillRect(N/2-1,0,2,N);
    for(var i=0;i<4;i++) for(var j=0;j<4;j++){ x.fillStyle=grey(160); x.beginPath(); x.arc(i*64+32,j*64+32,2,0,7); x.fill(); }
  },
  glass:function(x,N,r){
    for(var i=0;i<4;i++) for(var j=0;j<4;j++){ var gr=x.createLinearGradient(i*64,j*64,i*64+64,j*64+64);
      var b=190+r()*40; gr.addColorStop(0,grey(b+25)); gr.addColorStop(1,grey(b-20)); x.fillStyle=gr; x.fillRect(i*64,j*64,64,64); }
    x.fillStyle=grey(95); for(var k=0;k<=4;k++){ x.fillRect(k*64-2,0,4,N); x.fillRect(0,k*64-2,N,4); }
  },
  marble:function(x,N,r){
    x.fillStyle=grey(236); x.fillRect(0,0,N,N); x.strokeStyle=grey(170); x.lineWidth=1.3;
    for(var i=0;i<9;i++){ x.globalAlpha=0.25+r()*0.3; x.beginPath(); var px=r()*N, py=0; x.moveTo(px,py);
      while(py<N){ px+=(r()-0.5)*30; py+=10+r()*16; x.lineTo(px,py); } x.stroke(); }
    x.globalAlpha=1;
  },
  metal:function(x,N,r){
    for(var i=0;i<16;i++){ var gr=x.createLinearGradient(i*16,0,i*16+16,0);
      gr.addColorStop(0,grey(170)); gr.addColorStop(0.5,grey(232)); gr.addColorStop(1,grey(170)); x.fillStyle=gr; x.fillRect(i*16,0,16,N); }
    speckle(x,N,r,30,500);
  },
  metalroof:function(x,N,r){
    x.fillStyle=grey(205); x.fillRect(0,0,N,N);
    for(var i=0;i<8;i++){ x.fillStyle=grey(236); x.fillRect(i*32,0,4,N); x.fillStyle=grey(160); x.fillRect(i*32+4,0,2,N); }
  },
  shingle:function(x,N,r){
    x.fillStyle=grey(120); x.fillRect(0,0,N,N);
    for(var j=0;j<8;j++){ var off=(j%2)?16:0;
      for(var i=-1;i<9;i++){ x.fillStyle=grey(190+(r()-0.5)*50); x.fillRect(i*32+off+1,j*32+1,30,30);
        x.fillStyle=grey(140); x.fillRect(i*32+off+1,j*32+26,30,5); } }
  },
  tile:function(x,N,r){
    x.fillStyle=grey(140); x.fillRect(0,0,N,N);
    for(var j=0;j<9;j++) for(var i=-1;i<9;i++){ var cx=i*32+((j%2)?16:0)+16, cy=j*30;
      var gr=x.createRadialGradient(cx,cy,2,cx,cy,20); gr.addColorStop(0,grey(232)); gr.addColorStop(1,grey(176));
      x.fillStyle=gr; x.beginPath(); x.arc(cx,cy+8,16,0,Math.PI); x.fill(); x.fillRect(cx-16,cy-8,32,16); }
  },
  slate:function(x,N,r){
    x.fillStyle=grey(100); x.fillRect(0,0,N,N);
    for(var j=0;j<9;j++){ var off=(j%2)?20:0;
      for(var i=-1;i<7;i++){ x.fillStyle=grey(176+(r()-0.5)*40); x.fillRect(i*40+off+2,j*28+2,36,24); } }
  },
  thatch:function(x,N,r){
    x.fillStyle=grey(170); x.fillRect(0,0,N,N);
    for(var i=0;i<2600;i++){ var px=r()*N, py=r()*N; x.strokeStyle=grey(150+r()*95); x.globalAlpha=0.6;
      x.beginPath(); x.moveTo(px,py); x.lineTo(px+(r()-0.5)*4,py+8+r()*10); x.stroke(); }
    x.globalAlpha=1;
  },
  foliage:function(x,N,r){
    x.fillStyle=grey(180); x.fillRect(0,0,N,N);
    for(var i=0;i<1800;i++){ x.fillStyle=grey(150+r()*105); x.globalAlpha=0.55; x.beginPath(); x.arc(r()*N,r()*N,2+r()*5,0,7); x.fill(); }
    x.globalAlpha=1;
  },
  bark:function(x,N,r){
    x.fillStyle=grey(185); x.fillRect(0,0,N,N);
    for(var i=0;i<70;i++){ x.strokeStyle=grey(110+r()*60); x.lineWidth=1+r()*3; x.globalAlpha=0.6; x.beginPath();
      var px=r()*N; x.moveTo(px,0); for(var y=0;y<=N;y+=16) x.lineTo(px+(r()-0.5)*8,y); x.stroke(); }
    x.globalAlpha=1;
  },
  asphalt:function(x,N,r){ x.fillStyle=grey(190); x.fillRect(0,0,N,N); speckle(x,N,r,70,5200); },
  grass:function(x,N,r){
    x.fillStyle=grey(196); x.fillRect(0,0,N,N);
    for(var i=0;i<3600;i++){ x.fillStyle=grey(150+r()*105); x.globalAlpha=0.45; x.beginPath(); x.arc(r()*N,r()*N,0.8+r()*1.8,0,7); x.fill(); }
    for(var k=0;k<24;k++){ x.fillStyle=grey(170+r()*60); x.globalAlpha=0.12; x.beginPath(); x.arc(r()*N,r()*N,20+r()*50,0,7); x.fill(); }
    x.globalAlpha=1;
  },
  earth:function(x,N,r){
    x.fillStyle=grey(196); x.fillRect(0,0,N,N); speckle(x,N,r,70,3800);
    for(var k=0;k<30;k++){ x.fillStyle=grey(160+r()*70); x.globalAlpha=0.14; x.beginPath(); x.arc(r()*N,r()*N,14+r()*40,0,7); x.fill(); }
    x.globalAlpha=1;
  },
  sand:function(x,N,r){
    x.fillStyle=grey(220); x.fillRect(0,0,N,N); speckle(x,N,r,30,3000);
    x.strokeStyle=grey(190); x.globalAlpha=0.3;
    for(var j=0;j<14;j++){ x.beginPath(); for(var i=0;i<=16;i++) x.lineTo(i*16,j*19+Math.sin(i*0.9+j)*4); x.stroke(); }
    x.globalAlpha=1;
  },
  snow:function(x,N,r){ x.fillStyle=grey(238); x.fillRect(0,0,N,N); speckle(x,N,r,14,1600); },
  paving:function(x,N,r){
    x.fillStyle=grey(140); x.fillRect(0,0,N,N);
    for(var j=0;j<8;j++) for(var i=0;i<8;i++){ x.fillStyle=grey(190+(r()-0.5)*50); x.beginPath();
      x.arc(i*32+16+(r()-0.5)*6,j*32+16+(r()-0.5)*6,13,0,7); x.fill(); }
  },
  void:function(x,N,r){ x.fillStyle=grey(200); x.fillRect(0,0,N,N); },
  voidgrid:function(x,N,r){
    x.fillStyle=grey(60); x.fillRect(0,0,N,N);
    x.fillStyle=grey(150); x.fillRect(0,0,N,2); x.fillRect(0,0,2,N);
  },
  dash:function(x,N,r){ x.clearRect(0,0,N,N); x.fillStyle="#ffffff"; x.fillRect(0,0,N,N*0.5); }
};

var TEXCACHE={};
function texOf(kind){
  if(TEXCACHE[kind]) return TEXCACHE[kind];
  if(!PAINT[kind]||typeof document==="undefined") return null;
  var c=document.createElement("canvas"); c.width=c.height=256;
  var x=c.getContext("2d"); if(!x) return null;
  try{ PAINT[kind](x,256,rng(hash(kind))); }catch(e){ return null; }
  var t=new THREE.CanvasTexture(c);
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  var tile=TILE[kind]||2; if(t.repeat&&t.repeat.set) t.repeat.set(1/tile,1/tile);
  t.anisotropy=(renderer&&renderer.capabilities&&renderer.capabilities.getMaxAnisotropy)?Math.min(8,renderer.capabilities.getMaxAnisotropy()):4;
  TEXCACHE[kind]=t; return t;
}

/* geometry UVs measured in metres, so a texture's tile is the same size on a
   shed and on a cathedral, rather than one brick stretched over a whole wall */
function metreUVs(g,kind,s){
  var uv=g.attributes&&g.attributes.uv; if(!uv||!uv.array) return;
  var a=uv.array;
  if(kind==="box"){
    var w=s[0],h=s[1],d=s[2], dims=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];
    for(var f=0;f<6;f++) for(var v=0;v<4;v++){ var i=(f*4+v)*2; if(i+1<a.length){ a[i]*=dims[f][0]; a[i+1]*=dims[f][1]; } }
  } else if(kind==="cyl"||kind==="cone"){
    var r=kind==="cyl"?Math.max(s[0],s[1]):s[0], hh=kind==="cyl"?s[2]:s[1], circ=2*Math.PI*r;
    for(var k=0;k<a.length;k+=2){ a[k]*=circ; a[k+1]*=hh; }
  } else if(kind==="pln"){
    for(var p=0;p<a.length;p+=2){ a[p]*=s[0]; a[p+1]*=s[1]; }
  } else if(kind==="sph"||kind==="ico"){
    var R=s[0]; for(var q=0;q<a.length;q+=2){ a[q]*=2*Math.PI*R; a[q+1]*=Math.PI*R; }
  }
  uv.needsUpdate=true;
}

/* which texture a part of a form wears, if any. vague memories stay smooth:
   detail arrives with detail. */
function surfaceOf(pt,def,spec,f){
  if(!landOpt("detail")) return null;
  if(f<0.5||pt.glow||pt.c==="glass") return null;
  var big=Math.max.apply(null,(pt.s||[0]).slice(0,3));
  if(big<0.7) return null;
  var a=spec.attrs||{}, arch=spec.archetype;
  if(def.cat==="structure"){
    if(pt.c==="body") return {tex:a.m||WALL_DEFAULT[arch]||"plaster",wall:true};
    if(pt.c==="stone") return {tex:"stone"};
    if(pt.c==="trim"&&(pt.g==="cone"||(pt.g==="cyl"&&big>6))) {
      var rm=a.rm||ROOF_DEFAULT[arch]||"shingle"; return rm&&rm!=="flat"?{tex:rm,roof:true}:null;
    }
    if(pt.c==="white") return {tex:"marble"};
    if(pt.c==="bark") return {tex:"wood"};
    if(pt.c==="metal") return {tex:"metal"};
    return null;
  }
  if(pt.c==="nature"&&(pt.g==="ico"||pt.g==="cone"||pt.g==="sph")) return {tex:"foliage"};
  if(pt.c==="bark") return {tex:(pt.g==="cyl"&&def.cat==="nature")?"bark":"wood"};
  if(pt.c==="road") return {tex:"asphalt"};
  if(pt.c==="stone"&&big>1.5) return {tex:"stone"};
  return null;
}

