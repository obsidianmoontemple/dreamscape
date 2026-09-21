/* Dream Walker's Atlas — render.js
   turning parts lists into 3D, and the world they stand in
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   4. BUILDER — parts list to three.js group
   ============================================================ */
var GEOCACHE={};
function geo(kind,s){
  var k=kind+":"+s.join(",");
  if(GEOCACHE[k]) return GEOCACHE[k];
  var g;
  if(kind==="box") g=new THREE.BoxGeometry(s[0],s[1],s[2]);
  else if(kind==="cyl") g=new THREE.CylinderGeometry(s[0],s[1],s[2],s[3]||10);
  else if(kind==="cone") g=new THREE.ConeGeometry(s[0],s[1],s[2]||8);
  else if(kind==="sph") g=new THREE.SphereGeometry(s[0],10,8);
  else if(kind==="ico") g=new THREE.IcosahedronGeometry(s[0],0);
  else if(kind==="pln") g=new THREE.PlaneGeometry(s[0],s[1]);
  else if(kind==="tor") g=new THREE.TorusGeometry(s[0],s[1],6,14);
  else g=new THREE.BoxGeometry(s[0]||1,s[1]||1,s[2]||1);
  GEOCACHE[k]=g; return g;
}

function resolveColor(c, spec){
  if(typeof c==="number") return c;
  if(c==="body" && spec.attrs && spec.attrs.c!==undefined) return spec.attrs.c;
  return ROLE[c]!==undefined ? ROLE[c] : ROLE.body;
}

/* fidelity: how well this thing is remembered, 0..1 */
function fidelity(spec){
  if(spec.filler) return 0.34;
  if(viewNight!==null && spec.nights && spec.nights.indexOf(viewNight)===-1) return 0.06;
  var d=1, a=spec.attrs||{};
  if(spec.nights && spec.nights.length>1) d+=Math.min(3,spec.nights.length-1);
  if(a.c!==undefined) d++;
  if(a.s||a.h||a.w||a.d) d++;
  if(spec.sign) d++;
  if(spec.note) d++;
  if(spec.solid) d+=2;
  if(spec.placed) d+=2;
  return Math.min(d/5,1);
}

function signTexture(text){
  var c=document.createElement("canvas"); c.width=512; c.height=128;
  var x=c.getContext("2d");
  x.fillStyle="#15161B"; x.fillRect(0,0,512,128);
  x.strokeStyle="#4A463C"; x.lineWidth=6; x.strokeRect(3,3,506,122);
  x.fillStyle="#C9BEA8";
  var t=String(text).slice(0,20);
  var size=t.length>12?46:64;
  x.font="400 "+size+"px Georgia, serif";
  x.textAlign="center"; x.textBaseline="middle";
  x.fillText(t,256,68);
  var tex=new THREE.CanvasTexture(c); tex.anisotropy=4; return tex;
}

/* how many floors each kind of building has before the dream says otherwise */
var LEVELS={house:2,cottage:1,apartment:8,tower:20,skyscraper:40,motel:2,hotel:10,institution:4,
  hospital:5,school:3,church:1,cathedral:1,bank:3,library:3,station:2,courthouse:3,shop:1,
  warehouse:1,factory:2,barn:1,shed:1,garage:1,gasstation:1,bunker:1,ruin:1,lighthouse:6,windmill:4};

/* a building with more floors is taller in its walls, not stretched: the body grows,
   everything above it rises by the same amount, and each new floor gets its windows */
function levelParts(def,spec){
  var base=LEVELS[spec.archetype], lv=spec.attrs&&spec.attrs.lv;
  if(!base||!lv||lv===base||def.cat!=="structure") return def.parts;
  var body=def.parts[0];
  if(!body||body.g!=="box") return def.parts;
  var H=body.s[1], floor=H/base, dh=floor*(lv-base);
  var top=body.p[1]+H/2;
  return def.parts.map(function(pt,i){
    var q=JSON.parse(JSON.stringify(pt));
    if(i===0){ q.s[1]=Math.max(floor,H+dh); q.p[1]=q.s[1]/2; return q; }
    var partTop=q.p[1]+(q.g==="box"?q.s[1]/2:0);
    if(q.c==="glass" && q.p[1]<top){
      if(q.rep2){ q.rep2[0]=Math.max(1,Math.round(q.rep2[0]*lv/base)); }
      else if(lv>base){ q.rep2=[1+(lv-base),0,floor,0]; }
      return q;
    }
    if(q.p[1]>=top-0.01 || partTop>top+0.01){ q.p[1]+=dh; }
    else if(q.g==="box" && Math.abs(q.s[1]-H)<0.01){ q.s[1]=Math.max(floor,H+dh); q.p[1]=q.s[1]/2; }
    return q;
  });
}

function build(spec){
  var def=KIT[spec.archetype]||KIT.house;
  var a=spec.attrs||{};
  var f=fidelity(spec);
  var opa=0.20+0.80*f;
  var ghosty=f<0.99;
  var sx=(a.s||1)*(a.w||1), sy=(a.s||1)*(a.h||1), sz=(a.s||1)*(a.d||1);

  var g=new THREE.Group();
  g.userData.id=spec.id;

  levelParts(def,spec).forEach(function(pt){
    var col=resolveColor(pt.c,spec);
    var mat;
    if(pt.c==="glass" && !pt.glow && def.cat==="structure"){
      mat=new THREE.MeshBasicMaterial({color:ROLE.light,transparent:true,opacity:0.1,side:THREE.DoubleSide});
    } else if(pt.glow){
      mat=new THREE.MeshBasicMaterial({color:col,transparent:true,
        opacity:(pt.opa!==undefined?pt.opa:1)*Math.max(opa,0.35),side:THREE.DoubleSide});
      if(LAMPED[spec.archetype]){ if(!g.userData.lamps) g.userData.lamps=[]; g.userData.lamps.push(mat); }
    } else {
      mat=new THREE.MeshLambertMaterial({color:ghosty?blend(col,0x7C93B8,1-f):col,
        transparent:opa<0.995||pt.opa!==undefined,
        opacity:(pt.opa!==undefined?pt.opa:1)*opa,
        side:pt.g==="pln"?THREE.DoubleSide:THREE.FrontSide,
        depthWrite:opa>0.24,
        polygonOffset:pt.g==="pln",polygonOffsetFactor:-1,polygonOffsetUnits:-2});
    }
    if(pt.c==="glass" && !pt.glow){ if(!g.userData.glass) g.userData.glass=[]; g.userData.glass.push(mat); mat.transparent=true; }
    var G=geo(pt.g,pt.s);
    var n1=pt.rep?pt.rep[0]:1, n2=pt.rep2?pt.rep2[0]:1;
    for(var i=0;i<n1;i++){
      for(var j=0;j<n2;j++){
        var m=new THREE.Mesh(G,mat);
        var px=pt.p[0]+(pt.rep?pt.rep[1]*i:0)+(pt.rep2?pt.rep2[1]*j:0);
        var py=pt.p[1]+(pt.rep?pt.rep[2]*i:0)+(pt.rep2?pt.rep2[2]*j:0);
        var pz=pt.p[2]+(pt.rep?pt.rep[3]*i:0)+(pt.rep2?pt.rep2[3]*j:0);
        m.position.set(px,py,pz);
        if(pt.r) m.rotation.set(pt.r[0],pt.r[1],pt.r[2]);
        g.add(m);
      }
    }
  });

  if(spec.sign && def.sign){
    var sg=def.sign; // [x,y,z,w,h]
    var board=new THREE.Mesh(new THREE.PlaneGeometry(sg[3],sg[4]),
      new THREE.MeshBasicMaterial({map:signTexture(spec.sign),transparent:true,opacity:opa,side:THREE.DoubleSide}));
    board.position.set(sg[0],sg[1],sg[2]);
    g.add(board);
  }

  if(LAMPED[spec.archetype]){
    var pool=new THREE.Mesh(new THREE.CircleGeometry(spec.archetype==="streetlight"?7:4.5,24),
      new THREE.MeshBasicMaterial({color:0xE8C27A,transparent:true,opacity:0,depthWrite:false}));
    pool.rotation.x=-Math.PI/2;
    pool.position.set(spec.archetype==="streetlight"?2.1:0,0.16,0);
    pool.material.polygonOffset=true; pool.material.polygonOffsetFactor=-2; pool.material.polygonOffsetUnits=-4;
    g.add(pool); g.userData.pool=pool;
  }
  g.scale.set(sx,sy,sz);
  return g;
}

var LAMPED={streetlight:1,brazier:1,altar:1,lighthouse:1,gasstation:1,busstop:1};
function lampsForNight(night){
  for(var id in meshes){
    var m=meshes[id];
    if(m.userData.lamps) m.userData.lamps.forEach(function(mat){ mat.opacity=0.08+night*0.92; });
    if(m.userData.pool) m.userData.pool.material.opacity=night*0.34;
  }
}

function blend(a,b,t){
  var ar=(a>>16)&255, ag=(a>>8)&255, ab=a&255;
  var br=(b>>16)&255, bg=(b>>8)&255, bb=b&255;
  return (Math.round(ar+(br-ar)*t)<<16)|(Math.round(ag+(bg-ag)*t)<<8)|Math.round(ab+(bb-ab)*t);
}

/* ============================================================
   5. WORLD
   ============================================================ */
var scene,camera,renderer,clock,meshes={},raycaster,ground,SKY=0x090B11;

function initWorld(){
  scene=new THREE.Scene();
  scene.background=new THREE.Color(SKY);
  setFog(cfg().density);

  /* near plane pulled in no closer than it needs to be, and a logarithmic depth
     buffer, so surfaces a few centimetres apart stay apart even far away */
  camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,0.3,6000);
  renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance",logarithmicDepthBuffer:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(innerWidth,innerHeight);
  document.getElementById("world").appendChild(renderer.domElement);

  hemi=new THREE.HemisphereLight(0x3A4160,0x0A0C11,0.9);
  scene.add(hemi);
  sun=new THREE.DirectionalLight(0xA6B6D0,0.6);
  sun.position.set(-300,500,180); scene.add(sun);

  ground=new THREE.Mesh(new THREE.PlaneGeometry(6000,6000),
    new THREE.MeshLambertMaterial({color:0x101219}));
  ground.rotation.x=-Math.PI/2; scene.add(ground);
  buildSky();

  raycaster=new THREE.Raycaster();
  clock=new THREE.Clock();
  addEventListener("resize",onResize);
  animate();
}
var fogBase=26;
function setFog(sl){
  fogBase=sl;
  if(scene){ scene.fog=new THREE.FogExp2(SKY,1.9/(sl*10)); }
}
function fogForLight(dl){
  if(!scene||!scene.fog) return;
  var dist=fogBase*10*(0.55+dl*1.1);
  scene.fog.density=1.9/Math.max(dist,20);
}
function onResize(){
  camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
}
function addMesh(spec){
  var g=build(spec);
  g.position.set(spec.x,0,spec.z);
  g.rotation.y=spec.rot||0;
  var ch=charOf(spec);
  if(ch){
    ch.x=spec.x; ch.z=spec.z;
    if(ch.awake){
      var h=(KIT[spec.archetype]||KIT.human).size[1];
      var ring=new THREE.Mesh(new THREE.RingGeometry(0.5,0.75,18),
        new THREE.MeshBasicMaterial({color:0xC9A868,transparent:true,opacity:0.5,side:THREE.DoubleSide}));
      ring.rotation.x=-Math.PI/2;
      ring.position.y=h+0.55;
      ring.userData.spin=1;
      g.add(ring);
      var halo=new THREE.Mesh(new THREE.RingGeometry(0.85,1.15,22),
        new THREE.MeshBasicMaterial({color:0x7C93B8,transparent:true,opacity:0.22,side:THREE.DoubleSide}));
      halo.rotation.x=-Math.PI/2; halo.position.y=0.07;
      g.add(halo);
      g.userData.awake=1;
    }
  }
  scene.add(g); meshes[spec.id]=g;
}
function refresh(spec){
  if(meshes[spec.id]){ scene.remove(meshes[spec.id]); }
  addMesh(spec);
}
function removeSpec(spec){
  if(meshes[spec.id]){ scene.remove(meshes[spec.id]); delete meshes[spec.id]; }
  var i=store.objects.indexOf(spec);
  if(i>-1) store.objects.splice(i,1);
}

/* street slabs. neighbouring blocks share streets, so each street is drawn once;
   north-south streets stop short of the crossings, which the east-west ones carry,
   so no two surfaces ever lie on the same ground */
var drawnEdges={};
function drawStreet(ax,az,bx2,bz2){
  var k1=[ax,az,bx2,bz2].map(Math.round).join(","), k2=[bx2,bz2,ax,az].map(Math.round).join(",");
  if(drawnEdges[k1]||drawnEdges[k2]) return;
  drawnEdges[k1]=1;
  var dx=bx2-ax, dz=bz2-az, len=Math.sqrt(dx*dx+dz*dz);
  if(len<1) return;
  var ns=Math.abs(dz)>Math.abs(dx);
  if(ns) len=Math.max(1,len-STREET);
  var m=new THREE.Mesh(new THREE.PlaneGeometry(STREET,len),
    new THREE.MeshLambertMaterial({color:ROLE.road,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}));
  m.rotation.x=-Math.PI/2;
  m.rotation.z=-Math.atan2(dx,dz);
  m.position.set(ax+dx/2,0.03,az+dz/2);
  m.userData.street=1;
  scene.add(m);
}

