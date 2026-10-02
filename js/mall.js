/* SomnuMatrix — mall.js
   the World Mall: a great glass-roofed hall of shops, reached by the
   Underground, where real stores sell virtual versions of their products
   for gold — and point the way to the real thing. Each store keeps its own
   range up to date through the mall's API (see the keeper's admin page).
   loaded as a plain script; shares scope with the other files */
"use strict";

var MALL={on:false,g:null,units:[],stores:[],at:0,near:null,station:null,cx:-120000,cz:0,A:110,B:62,open:false};
var MALL_UNITS=40;
var MALL_STOP={key:"World Mall",name:"World Mall",ring:"mall",arrive:function(){ mallEnter(); }};

function mallStoresLoad(force){
  if(!force&&Date.now()-MALL.at<60000) return Promise.resolve(MALL.stores);
  MALL.at=Date.now();
  var q=(typeof signedIn==="function"&&signedIn())?cityRpc("mall_board"):
    fetch(DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/rpc/mall_board",{method:"POST",headers:{apikey:DW_CONFIG.supabaseKey,Authorization:"Bearer "+DW_CONFIG.supabaseKey,"Content-Type":"application/json"},body:"{}"}).then(function(r){ return r.ok?r.json():[]; });
  return q.then(function(rows){ MALL.stores=rows||[]; if(MALL.g) mallSigns(); return MALL.stores; })
    .catch(function(){ return MALL.stores; });
}
function mallStoreAt(unit){ return (MALL.stores||[]).filter(function(s){ return s.unit===unit; })[0]||null; }

/* ---- the building ---- */
function mallTex(text,sub,col){
  var c=document.createElement("canvas"); c.width=512; c.height=96; var x=c.getContext("2d");
  x.fillStyle=col||"#1A1D24"; x.fillRect(0,0,512,96);
  x.fillStyle="#F4EEDC"; x.textAlign="center"; x.textBaseline="middle";
  var F=fitLines(x,String(text),480,1,48,18,"700","Georgia, serif");
  x.font="700 "+F.size+"px Georgia, serif"; x.fillText(F.lines[0],256,sub?36:50);
  if(sub){ x.font="400 18px Georgia, serif"; x.fillStyle="#D8CFB8"; x.fillText(String(sub).slice(0,56),256,74); }
  var t=new THREE.CanvasTexture(c); t.anisotropy=4; return t;
}
function mallBuild(){
  if(MALL.g) return;
  var G=new THREE.Group(); G.position.set(MALL.cx,0,MALL.cz);
  function M(c,o){ var m=new THREE.MeshLambertMaterial({color:c}); if(o){ m.transparent=true; m.opacity=o; m.depthWrite=false; } return m; }
  function mesh(geo,mat,x,y,z,ry){ var m=new THREE.Mesh(geo,mat); m.position.set(x,y,z); if(ry) m.rotation.y=ry; m.receiveShadow=true; G.add(m); return m; }
  var A=MALL.A, B=MALL.B;
  /* the floor: polished stone with an inlaid compass, and the concourse ring */
  var fl=new THREE.Mesh(new THREE.CircleGeometry(1,96),M(0xBDB2A0)); fl.scale.set(A+16,B+16,1); fl.rotation.x=-Math.PI/2; fl.position.y=0.02; G.add(fl);
  var inl=new THREE.Mesh(new THREE.RingGeometry(0.42,0.47,96),M(0x8A6A3A)); inl.scale.set(A,B,1); inl.rotation.x=-Math.PI/2; inl.position.y=0.04; G.add(inl);
  var inl2=new THREE.Mesh(new THREE.RingGeometry(0.80,0.82,96),M(0x8A7A62)); inl2.scale.set(A,B,1); inl2.rotation.x=-Math.PI/2; inl2.position.y=0.04; G.add(inl2);
  /* the glass roof and its ribs */
  var roof=new THREE.Mesh(new THREE.SphereGeometry(1,48,16,0,Math.PI*2,0,Math.PI/2),new THREE.MeshLambertMaterial({color:0xBFD8EE,transparent:true,opacity:0.22,side:THREE.DoubleSide,depthWrite:false}));
  roof.scale.set(A+16,26,B+16); roof.position.y=14; G.add(roof);
  for(var k=0;k<16;k++){ var rib=new THREE.Mesh(new THREE.TorusGeometry(1,0.004,4,48,Math.PI),M(0x3A3E46));
    rib.scale.set(A+16,26,1); rib.rotation.y=k/16*Math.PI; rib.position.y=14; rib.scale.z=B+16; G.add(rib); }
  /* the wall behind the shops */
  var wall=new THREE.Mesh(new THREE.CylinderGeometry(1,1,14,96,1,true),new THREE.MeshLambertMaterial({color:0xD8D0C2,side:THREE.DoubleSide}));
  wall.scale.set(A+16,1,B+16); wall.position.y=7; G.add(wall);
  var band=new THREE.Mesh(new THREE.CylinderGeometry(1,1,0.6,96,1,true),new THREE.MeshLambertMaterial({color:0xB8935A,side:THREE.DoubleSide}));
  band.scale.set(A+15.6,1,B+15.6); band.position.y=13.8; G.add(band);
  /* the shops, all round — each one built as its store designed it */
  MALL.units=[];
  for(var i=0;i<MALL_UNITS;i++){
    var t=(i+0.5)/MALL_UNITS*Math.PI*2;
    var ex=Math.cos(t)*(A+4), ez=Math.sin(t)*(B+4);
    var nx=Math.cos(t)/(A+4), nz=Math.sin(t)/(B+4), nl=Math.hypot(nx,nz); nx/=nl; nz/=nl;
    MALL.units.push({i:i+1,x:MALL.cx+ex,z:MALL.cz+ez,ex:ex,ez:ez,nx:nx,nz:nz,ry:Math.atan2(-nx,-nz),grp:null,key:null});
  }
  /* the middle: a great fountain, trees, benches */
  var basin=new THREE.Mesh(new THREE.CylinderGeometry(9,9.6,0.9,48),M(0xD8D0C2)); basin.position.y=0.45; G.add(basin);
  var water=new THREE.Mesh(new THREE.CircleGeometry(8.6,48),new THREE.MeshLambertMaterial({color:0x4A8ABF,transparent:true,opacity:0.85})); water.rotation.x=-Math.PI/2; water.position.y=0.8; G.add(water);
  var col=new THREE.Mesh(new THREE.CylinderGeometry(0.9,1.3,6,24),M(0xEDE6D8)); col.position.y=3.4; G.add(col);
  var bowl=new THREE.Mesh(new THREE.CylinderGeometry(3.4,1.4,0.8,32),M(0xD8D0C2)); bowl.position.y=6.4; G.add(bowl);
  var jet=new THREE.Mesh(new THREE.ConeGeometry(0.9,4,16,1,true),new THREE.MeshBasicMaterial({color:0xBFE6FF,transparent:true,opacity:0.55,depthWrite:false})); jet.position.y=8.8; G.add(jet); MALL.jet=jet;
  var globe=new THREE.Mesh(new THREE.SphereGeometry(1.2,24,16),new THREE.MeshBasicMaterial({color:0xFFE6A0})); globe.position.y=11.4; G.add(globe);
  var trunk=M(0x6A4A30), leaf=M(0x3E7A3A);
  for(var p=0;p<12;p++){
    var pa=p/12*Math.PI*2, px=Math.cos(pa)*(A*0.62), pz=Math.sin(pa)*(B*0.62);
    mesh(new THREE.CylinderGeometry(1.6,1.8,1,20),M(0xB8935A),px,0.5,pz);
    mesh(new THREE.CylinderGeometry(0.22,0.3,5,8),trunk,px,3.4,pz);
    var cr=mesh(new THREE.SphereGeometry(2.2,14,10),leaf,px,6.6,pz); cr.scale.y=0.8;
    var bx=Math.cos(pa+0.13)*(A*0.62), bz=Math.sin(pa+0.13)*(B*0.62);
    mesh(new THREE.BoxGeometry(2.6,0.15,0.8),M(0x6A4A30),bx,0.6,bz,-pa);
    mesh(new THREE.BoxGeometry(2.6,0.6,0.1),M(0x6A4A30),bx-Math.cos(pa)*0.4,0.9,bz-Math.sin(pa)*0.4,-pa);
  }
  /* hanging lights round the hall */
  for(var l=0;l<24;l++){
    var la=l/24*Math.PI*2, lx=Math.cos(la)*A*0.85, lz=Math.sin(la)*B*0.85;
    mesh(new THREE.CylinderGeometry(0.02,0.02,8,4),M(0x2E3238),lx,15,lz);
    mesh(new THREE.SphereGeometry(0.6,16,12),new THREE.MeshBasicMaterial({color:0xFFF0C8}),lx,11,lz);
  }
  /* the Underground's own station at the west end */
  var st=build({id:"__mallug",archetype:"subwayentrance",attrs:{},sign:"Underground · World Mall",solid:false,detail:3,nights:[],city:true});
  st.position.set(-A+18,0,0); st.rotation.y=Math.PI/2; G.add(st);
  MALL.station={x:MALL.cx-A+18,z:MALL.cz};
  /* the hall's own light */
  var hl=new THREE.HemisphereLight(0xFFF6E6,0x5A5048,0.55); hl.position.set(0,30,0); G.add(hl);
  G.visible=false; scene.add(G); MALL.g=G;
  mallSigns();
}
function mallSigns(){
  if(!MALL.units.length||!MALL.g) return;
  MALL.units.forEach(function(u){
    var st=mallStoreAt(u.i), key=st?JSON.stringify([st.name,st.tagline,st.color,st.look,(st.products||[]).map(function(p){ return p.id+":"+p.image; })]):"empty";
    if(u.key===key&&u.grp) return;
    if(u.grp) MALL.g.remove(u.grp);
    var g=mfBuild(THREE,st); g.position.set(u.ex,0,u.ez); g.rotation.y=u.ry;
    if(st) mfFeature(THREE,g,st);
    MALL.g.add(g); u.grp=g; u.key=key;
  });
}
/* ---- going there and back ---- */
function mallEnter(){
  mallBuild(); mallStoresLoad(true);
  MALL.on=true; MALL.g.visible=true;
  if(store.inside&&typeof exitInterior==="function") exitInterior(true);
  camera.position.set(MALL.station.x+8,1.72,MALL.station.z); yaw=-Math.PI/2; pitch=0; if(typeof flyY!=="undefined") flyY=0;
  if(typeof walkResume!=="undefined") walkResume=null;
  setStatus("<b>The World Mall.</b> Walk up to any shop window to step in. The Underground home is at the west end.");
}
function mallLeave(){ MALL.on=false; if(MALL.g) MALL.g.visible=false; mallClose(); if(MALL.lit&&typeof tickClock==="function"){ MALL.lit=false; tickClock(true); } }
(function(){
  if(typeof ugArrive!=="function") return;
  var ua=ugArrive;
  ugArrive=function(to){ if(to&&to.ring!=="mall"&&MALL.on) mallLeave(); return ua(to); };
})();

/* inside the hall: kept within its walls, lit by its own light */
(function(){
  if(typeof blockedAt!=="function") return;
  var ba=blockedAt;
  blockedAt=function(x,z,feet){
    if(MALL.on&&!store.inside&&Math.abs(x-MALL.cx)<400&&Math.abs(z-MALL.cz)<400){
      var dx=(x-MALL.cx)/(MALL.A+1.2), dz=(z-MALL.cz)/(MALL.B+1.2);
      if(dx*dx+dz*dz>1) return true;
      if(Math.hypot(x-MALL.cx,z-MALL.cz)<9.8) return true;          /* the fountain */
      return false;
    }
    return ba(x,z,feet);
  };
})();

/* ---- a shop ---- */
function mallEl(){
  var el=document.getElementById("mall"); if(el||!document.body) return el;
  var css=document.createElement("style");
  css.textContent="#mall{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:60;display:none;width:min(720px,calc(100vw - 24px));max-height:84vh;overflow:auto;"+
    "background:rgba(10,11,16,.97);border:1px solid var(--gold,#C9A868);border-radius:6px;padding:16px 18px;font:14px var(--sans);color:var(--bone)}"+
    "#mall .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-top:12px}"+
    "#mall .card{border:1px solid var(--line,#2A2C34);border-radius:4px;padding:10px;display:flex;flex-direction:column;gap:6px}"+
    "#mall .card img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:3px;background:#1A1D24}"+
    "#mall-prompt{position:fixed;left:50%;bottom:calc(120px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:45;display:none;"+
    "background:rgba(10,12,18,.92);border:1px solid var(--gold,#C9A868);border-radius:3px;padding:9px 14px;font:13px var(--sans);color:var(--bone);cursor:pointer}";
  document.head.appendChild(css);
  el=document.createElement("div"); el.id="mall"; document.body.appendChild(el);
  var pr=document.createElement("div"); pr.id="mall-prompt"; document.body.appendChild(pr);
  return el;
}
function mallOpen(u){
  var el=mallEl(), s=mallStoreAt(u.i); MALL.open=true;
  if(document.exitPointerLock) document.exitPointerLock();
  if(!s){
    el.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:16px">Unit '+u.i+' — to let</b><button class="btn" id="mall-x">Leave</button></div>'+
      '<p style="color:var(--dim);line-height:1.6">A shop in the World Mall for a real store: its own window, its own range sold here for gold, and the way to buy the real thing. Stores are let by the keeper.</p>';
  } else {
    var LK=mfLook(s), acc=mfHex(s.color||0xC9A868), tr=mfHex(LK.trim);
    el.style.borderColor=acc;
    el.innerHTML=(LK.banner?'<div style="margin:-16px -18px 12px;height:150px;border-radius:6px 6px 0 0;background:#111 url(\''+esc(LK.banner).replace(/'/g,"%27")+'\') center/cover"></div>':'<div style="margin:-16px -18px 12px;height:8px;border-radius:6px 6px 0 0;background:linear-gradient(90deg,'+acc+','+tr+')"></div>')+
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span style="display:flex;align-items:center;gap:10px">'+
      (s.logo?'<img src="'+esc(s.logo)+'" alt="" style="width:44px;height:44px;object-fit:contain;border-radius:4px;background:#fff">':'')+
      '<span><b style="font-size:17px">'+esc(s.name)+'</b><br><span style="color:var(--dim)">'+esc(s.tagline||"")+'</span></span></span><button class="btn" id="mall-x">Leave</button></div>'+
      (LK.welcome?'<p style="margin:10px 0 0;line-height:1.6;font-family:'+(MF_FONTS[LK.font]||MF_FONTS.serif)+'">'+esc(LK.welcome)+'</p>':'')+
      (s.site?'<div style="margin-top:6px"><a href="'+esc(s.site)+'" target="_blank" rel="noopener" style="color:'+acc+'">Visit '+esc(s.name)+'</a></div>':'')+
      '<div class="grid">'+(s.products||[]).map(function(p){
        return '<div class="card">'+(p.image?'<img src="'+esc(p.image)+'" alt="" loading="lazy">':'')+
          '<b>'+esc(p.name)+'</b>'+(p.description?'<span style="color:var(--dim);font-size:12px;line-height:1.4">'+esc(p.description)+'</span>':'')+
          '<span>'+p.gold+' gold'+(p.real?' <span style="color:var(--dim)">· the real one '+esc(p.real)+'</span>':'')+'</span>'+
          '<span style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn" data-buy="'+p.id+'">Buy for '+p.gold+' gold</button>'+
          (p.url?'<a class="btn" href="'+esc(p.url)+'" target="_blank" rel="noopener" style="text-decoration:none">Buy the real one</a>':'')+'</span></div>';
      }).join("")+'</div>'+((s.products||[]).length?'':'<p style="color:var(--dim)">The shelves are being stocked.</p>')+
      '<div id="mall-msg" style="margin-top:10px;color:var(--dim)"></div>';
  }
  el.style.display="block";
  document.getElementById("mall-x").onclick=mallClose;
  Array.prototype.forEach.call(el.querySelectorAll("[data-buy]"),function(b){ b.onclick=function(){
    var msg=document.getElementById("mall-msg");
    if(!(typeof signedIn==="function"&&signedIn())){ msg.textContent="Sign in to buy."; return; }
    msg.textContent="Paying…";
    cityRpc("mall_buy",{p_product:+b.getAttribute("data-buy")}).then(function(o){
      msg.innerHTML=o==="ok"?"<b>Bought.</b> It is yours.":esc(String(o));
      if(o==="ok"&&typeof refreshStanding==="function") refreshStanding();
    }).catch(function(e){ msg.textContent=e.message; });
  }; });
}
function mallClose(){ MALL.open=false; var el=document.getElementById("mall"); if(el){ el.style.display="none"; el.style.borderColor=""; } }

/* a link from a store's own website: index.html?mall=5 walks you straight
   to unit 5 in the World Mall */
(function(){
  var m=(typeof location!=="undefined")&&/[?&]mall=(\d+)/.exec(location.search||"");
  if(!m) return;
  var unit=+m[1], tries=0;
  (function go(){
    if(typeof scene==="undefined"||!scene||typeof setWalk!=="function"){ if(tries++<60) setTimeout(go,300); return; }
    setWalk(true); mallEnter();
    mallStoresLoad(true).then(function(){
      var u=MALL.units[unit-1]; if(!u) return;
      camera.position.set(u.x-u.nx*0+u.nx*-5.5,1.72,u.z+u.nz*-5.5); yaw=Math.atan2(u.nx,u.nz)+Math.PI; pitch=0;
      var st=mallStoreAt(unit); setStatus(st?("<b>"+esc(st.name)+"</b> is right in front of you. Press <b>Enter</b> or tap to step in."):"The World Mall.");
    });
  })();
})();

function mallTick(dt){
  if(!MALL.on) return;
  if(!walkMode){ return; }
  if(scene&&scene.fog) scene.fog.density=Math.min(scene.fog.density,0.002);
  /* under glass: softened daylight, never glare and never dark */
  if(typeof sun!=="undefined"&&sun) sun.intensity=Math.min(sun.intensity,0.3);
  if(typeof hemi!=="undefined"&&hemi) hemi.intensity=Math.max(0.35,Math.min(hemi.intensity,0.55));
  MALL.lit=true;
  if(MALL.jet){ MALL.jet.scale.y=1+Math.sin(performance.now()/300)*0.08; }
  var P=camera.position, pr=document.getElementById("mall-prompt")||(mallEl(),document.getElementById("mall-prompt"));
  var near=null;
  MALL.units.forEach(function(u){ if(Math.hypot(u.x-P.x,u.z-P.z)<6.5) near=u; });
  var atStation=MALL.station&&Math.hypot(MALL.station.x-P.x,MALL.station.z-P.z)<6;
  MALL.near=near;
  if(MALL.open||(typeof ugOpen!=="undefined"&&ugOpen)){ pr.style.display="none"; return; }
  if(atStation){ pr.innerHTML="<b>World Mall</b> Underground · 1 gold a ride · <b>press U</b> or tap"; pr.style.display="block"; pr.onclick=function(){ ugShow({key:"World Mall",name:"World Mall",ring:"mall"}); }; MALL.atStation=true; return; }
  MALL.atStation=false;
  if(near){ var s=mallStoreAt(near.i); pr.innerHTML=s?("<b>"+esc(s.name)+"</b> · press <b>Enter</b> or tap to step in"):("Unit "+near.i+" · to let"); pr.style.display="block"; pr.onclick=function(){ mallOpen(near); }; }
  else pr.style.display="none";
}
if(typeof addEventListener==="function") addEventListener("keydown",function(e){
  if(!MALL.on||/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||"")) return;
  if(e.code==="Enter"&&MALL.near&&!MALL.open){ e.preventDefault(); mallOpen(MALL.near); }
  if(e.code==="KeyU"&&MALL.atStation&&!(typeof ugOpen!=="undefined"&&ugOpen)){ e.preventDefault(); ugShow({key:"World Mall",name:"World Mall",ring:"mall"}); }
  if(e.code==="Escape"&&MALL.open) mallClose();
});
