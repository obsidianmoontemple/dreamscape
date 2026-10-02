/* SomnuMatrix — mall-front.js
   one World Mall shopfront, built from the look its store chose in the store
   portal. The same code draws it in the game and in the portal's live
   preview, so what a store designs is exactly what dreamers walk past.
     look = { sign, font, trim, facade, awning, display, floor, lights,
              banner, featured:[product ids], welcome }
   loaded as a plain script; shares scope with the other files */
"use strict";

var MF_FACADE={stone:0xD8D0C2,marble:0xF2EEE6,glass:0x9FB8C8,wood:0x7A5634,brick:0x9A4E3A,dark:0x24262C};
var MF_FLOOR={wood:0x8A6440,marble:0xE8E4DC,tile:0xC8C0B4,carpet:0x6A2A34};
var MF_LIGHT={warm:0xFFE2B0,cool:0xD8ECFF,neon:0xFF6AE0};
var MF_FONTS={serif:"Georgia, 'Times New Roman', serif",sans:"'Helvetica Neue', Arial, sans-serif",script:"'Brush Script MT', 'Segoe Script', cursive"};
function mfHex(n){ return "#"+("000000"+((n||0)>>>0).toString(16)).slice(-6); }
function mfLook(store){
  var L=(store&&store.look)||{};
  return {sign:L.sign||"classic",font:L.font||"serif",trim:L.trim!==undefined&&L.trim!==null?L.trim:0xC9A868,facade:L.facade||"stone",
    awning:L.awning||"none",display:L.display||"pedestals",floor:L.floor||"wood",lights:L.lights||"warm",
    banner:L.banner||"",featured:Array.isArray(L.featured)?L.featured.slice(0,3):[],welcome:L.welcome||""};
}
function mfFit(x,text,maxW,big,small,weight,face){
  var size=big; for(;size>small;size-=2){ x.font=weight+" "+size+"px "+face; if(x.measureText(text).width<=maxW) break; }
  x.font=weight+" "+size+"px "+face; return size;
}
/* the sign board, in the style the store chose */
function mfSignTexture(T,store){
  var L=mfLook(store), c=document.createElement("canvas"); c.width=1024; c.height=192;
  var x=c.getContext("2d"), col=mfHex(store?store.color:0x1A1D24), trim=mfHex(L.trim), face=MF_FONTS[L.font]||MF_FONTS.serif;
  var name=store?store.name:"To let", tag=store?(store.tagline||""):"";
  if(L.sign==="neon"){ x.fillStyle="#0A0B10"; x.fillRect(0,0,1024,192); }
  else if(L.sign==="gilded"){ x.fillStyle="#141418"; x.fillRect(0,0,1024,192); x.strokeStyle=trim; x.lineWidth=10; x.strokeRect(10,10,1004,172); x.lineWidth=2; x.strokeRect(24,24,976,144); }
  else if(L.sign==="painted"){ var gr=x.createLinearGradient(0,0,0,192); gr.addColorStop(0,"#C8A878"); gr.addColorStop(1,"#A88458"); x.fillStyle=gr; x.fillRect(0,0,1024,192);
    x.strokeStyle="rgba(90,60,30,.35)"; for(var k=0;k<9;k++){ x.beginPath(); x.moveTo(0,20+k*20); x.lineTo(1024,24+k*20); x.stroke(); } }
  else if(L.sign==="modern"){ x.fillStyle=col; x.fillRect(0,0,1024,192); }
  else { x.fillStyle=col; x.fillRect(0,0,1024,192); x.strokeStyle=trim; x.lineWidth=8; x.strokeRect(6,6,1012,180); }
  x.textAlign="center"; x.textBaseline="middle";
  var weight=L.sign==="modern"?"600":"700", sz=mfFit(x,name,940,tag?92:110,30,weight,face), ty=tag?78:98;
  if(L.sign==="neon"){ x.shadowColor=col; x.shadowBlur=28; x.fillStyle="#FFFFFF"; x.fillText(name,512,ty); x.shadowBlur=12; x.fillStyle=col; x.fillText(name,512,ty); x.shadowBlur=0; }
  else { x.fillStyle=L.sign==="gilded"?trim:(L.sign==="painted"?"#2A1A0C":"#F6F0E2"); x.fillText(name,512,ty); }
  if(tag){ mfFit(x,tag,900,36,16,"400",face); x.fillStyle=L.sign==="painted"?"#4A3420":(L.sign==="neon"?col:"#DCD2BC"); x.fillText(tag,512,152); }
  var t=new T.CanvasTexture(c); t.anisotropy=4; return t;
}
/* the whole shopfront: front at z=0 facing +z, the shop running back to z=-9 */
function mfBuild(T,store,opts){
  opts=opts||{};
  var L=mfLook(store), G=new T.Group(), open=!!store;
  function M(c,o,basic){ var m=basic?new T.MeshBasicMaterial({color:c}):new T.MeshLambertMaterial({color:c}); if(o!==undefined){ m.transparent=true; m.opacity=o; m.depthWrite=false; } return m; }
  function add(geo,mat,x,y,z,rx,ry,rz){ var m=new T.Mesh(geo,mat); m.position.set(x,y,z); if(rx||ry||rz) m.rotation.set(rx||0,ry||0,rz||0); G.add(m); return m; }
  var fc=MF_FACADE[L.facade]||MF_FACADE.stone, trim=L.trim, accent=store?store.color||0xC9A868:0x6A6E76;
  var shell=M(fc), trimM=M(trim), frame=M(L.facade==="dark"?0xC9A868:0x2E3238);
  /* the shell */
  add(new T.BoxGeometry(11.4,7,0.4),shell,0,3.5,-9);
  add(new T.BoxGeometry(0.4,7,9),shell,-5.7,3.5,-4.5); add(new T.BoxGeometry(0.4,7,9),shell,5.7,3.5,-4.5);
  add(new T.BoxGeometry(11.4,0.3,9),shell,0,7,-4.5);
  add(new T.BoxGeometry(11.4,0.3,9),M(MF_FLOOR[L.floor]||MF_FLOOR.wood),0,0.05,-4.5);
  if(L.floor==="tile"||L.floor==="marble") for(var i=0;i<5;i++) add(new T.BoxGeometry(11.2,0.02,0.05),M(0x9A9288),0,0.22,-0.9-i*1.8);
  /* the frontage: pilasters, cornice, glass, the door */
  add(new T.BoxGeometry(1.1,7,0.6),shell,-5.4,3.5,0.1); add(new T.BoxGeometry(1.1,7,0.6),shell,5.4,3.5,0.1);
  add(new T.BoxGeometry(11.8,0.35,0.7),trimM,0,4.65,0.15); add(new T.BoxGeometry(11.8,0.3,0.8),trimM,0,6.85,0.15);
  add(new T.BoxGeometry(3.6,3.9,0.08),M(0xA8C8DC,0.3),-3,2.15,0); add(new T.BoxGeometry(3.6,3.9,0.08),M(0xA8C8DC,0.3),3,2.15,0);
  add(new T.BoxGeometry(0.15,4.2,0.2),frame,-4.85,2.1,0.05); add(new T.BoxGeometry(0.15,4.2,0.2),frame,4.85,2.1,0.05);
  add(new T.BoxGeometry(0.15,4.2,0.2),frame,-1.15,2.1,0.05); add(new T.BoxGeometry(0.15,4.2,0.2),frame,1.15,2.1,0.05);
  add(new T.BoxGeometry(2.2,0.15,0.2),frame,0,4.15,0.05);
  add(new T.BoxGeometry(2.1,0.25,0.5),trimM,0,0.12,0.25);
  /* the sign */
  var sign=add(new T.PlaneGeometry(9.6,1.8),new T.MeshBasicMaterial({map:mfSignTexture(T,store)}),0,5.75,0.52);
  G.userData.sign=sign;
  if(L.sign==="neon"&&open){ var tube=add(new T.BoxGeometry(9.8,0.06,0.06),M(accent,undefined,true),0,6.7,0.55); add(new T.BoxGeometry(9.8,0.06,0.06),M(accent,undefined,true),0,4.82,0.55); }
  if(L.sign==="gilded"&&open){ add(new T.SphereGeometry(0.16,12,10),M(trim),-4.9,5.75,0.6); add(new T.SphereGeometry(0.16,12,10),M(trim),4.9,5.75,0.6); }
  /* the awning */
  if(L.awning!=="none"&&open){
    var aw=new T.Group(); aw.position.set(0,4.5,0.4); aw.rotation.x=0.38; G.add(aw);
    var stripes=L.awning==="striped"?10:1;
    for(var s=0;s<stripes;s++){ var w=11/stripes, m=new T.Mesh(new T.BoxGeometry(w,0.05,2.2),M(stripes>1&&s%2?0xF2EEE6:accent)); m.position.set(-5.5+w/2+s*w,0,1.1); aw.add(m); }
    if(L.awning==="scalloped") for(var q=0;q<11;q++){ var sc=new T.Mesh(new T.CylinderGeometry(0.5,0.5,0.05,12,1,false,0,Math.PI),M(accent)); sc.rotation.set(Math.PI/2,0,0); sc.position.set(-5+q,0,2.2); aw.add(sc); }
  }
  /* the window display */
  var lightCol=MF_LIGHT[L.lights]||MF_LIGHT.warm, dispM=M(L.facade==="dark"?0x3A3E46:0x2E3238), glowM=M(lightCol,undefined,true);
  G.userData.frames=[];
  [-3,3].forEach(function(cx,side){
    if(!open) return;
    if(L.display==="pedestals"){ add(new T.CylinderGeometry(0.45,0.55,1,16),dispM,cx-0.9,0.5,-1.2); add(new T.CylinderGeometry(0.45,0.55,1.4,16),dispM,cx+0.9,0.7,-1.2);
      add(new T.SphereGeometry(0.32,16,12),M(accent),cx-0.9,1.35,-1.2); add(new T.BoxGeometry(0.5,0.5,0.5),M(trim),cx+0.9,1.65,-1.2); }
    else if(L.display==="shelves"){ for(var h=0;h<3;h++){ add(new T.BoxGeometry(3,0.08,0.7),dispM,cx,0.6+h*1.1,-1.4);
        for(var b=0;b<4;b++) add(new T.BoxGeometry(0.35,0.5,0.35),M(b%2?accent:trim),cx-1.1+b*0.73,0.9+h*1.1,-1.4); } }
    else if(L.display==="mannequins"){ [cx-0.8,cx+0.8].forEach(function(mx,k){ add(new T.CylinderGeometry(0.05,0.05,0.9,6),dispM,mx,0.45,-1.3);
        add(new T.CylinderGeometry(0.28,0.22,1.1,12),M(k?trim:accent),mx,1.45,-1.3); add(new T.SphereGeometry(0.18,12,10),M(0xE8E0D4),mx,2.2,-1.3); }); }
    else if(L.display==="plants"){ [cx-0.9,cx+0.9].forEach(function(px){ add(new T.CylinderGeometry(0.35,0.28,0.6,12),M(trim),px,0.3,-1.2);
        var f=add(new T.SphereGeometry(0.6,12,10),M(0x3E7A3A),px,1.1,-1.2); f.scale.y=1.3; }); }
    else if(L.display==="lanterns"){ for(var l=0;l<3;l++){ add(new T.CylinderGeometry(0.01,0.01,1.2,4),dispM,cx-1+l,3.4,-1.0);
        add(new T.CylinderGeometry(0.22,0.26,0.5,8),glowM,cx-1+l,2.6-(l%2)*0.4,-1.0); } }
    /* a framed picture of a featured product */
    var fr=add(new T.PlaneGeometry(1.5,1.5),new T.MeshBasicMaterial({color:0x2A2D34}),cx,L.display==="shelves"?3.65:2.9,-2.4);
    add(new T.BoxGeometry(1.7,1.7,0.06),trimM,cx,fr.position.y,-2.45);
    G.userData.frames.push(fr);
  });
  /* the shop's own light, inside */
  var glow=add(new T.PlaneGeometry(10.6,8.4),M(lightCol,0.16,true),0,6.84,-4.5,Math.PI/2);
  add(new T.BoxGeometry(10.8,0.1,0.1),glowM,0,6.75,-1);
  /* a counter at the back */
  if(open){ add(new T.BoxGeometry(4,1.1,0.9),M(trim),0,0.55,-7.6); add(new T.BoxGeometry(4.2,0.08,1),dispM,0,1.12,-7.6); }
  return G;
}
/* hang the featured products' own pictures in the window, where their
   images allow it (a store's image host must allow it to be shown) */
function mfFeature(T,G,store){
  var L=mfLook(store), prods=(store&&store.products)||[];
  var pick=L.featured.map(function(id){ return prods.filter(function(p){ return String(p.id)===String(id); })[0]; }).filter(Boolean);
  if(pick.length<2) prods.forEach(function(p){ if(pick.length<2&&p.image&&pick.indexOf(p)<0) pick.push(p); });
  (G.userData.frames||[]).forEach(function(fr,i){
    var p=pick[i]; if(!p||!p.image) return;
    var ld=new T.TextureLoader(); ld.setCrossOrigin("anonymous");
    ld.load(p.image,function(tex){ fr.material.map=tex; fr.material.color.setHex(0xFFFFFF); fr.material.needsUpdate=true; },undefined,function(){});
  });
}
