/* SomnuMatrix — render.js
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
  else if(kind==="cyl") g=new THREE.CylinderGeometry(s[0],s[1],s[2],s[3]||10,s[4]||1,!!s[5],s[6]||0,s[7]||Math.PI*2);
  else if(kind==="cone") g=new THREE.ConeGeometry(s[0],s[1],s[2]||8);
  else if(kind==="sph") g=new THREE.SphereGeometry(s[0],10,8);
  else if(kind==="ico") g=new THREE.IcosahedronGeometry(s[0],0);
  else if(kind==="pln") g=new THREE.PlaneGeometry(s[0],s[1]);
  else if(kind==="tor") g=new THREE.TorusGeometry(s[0],s[1],6,Math.max(14,Math.round(s[0]*9)));
  else g=new THREE.BoxGeometry(s[0]||1,s[1]||1,s[2]||1);
  metreUVs(g,kind,s);
  GEOCACHE[k]=g; return g;
}

function resolveColor(c, spec){
  if(typeof c==="number") return c;
  if(c==="body" && spec.attrs && spec.attrs.c!==undefined) return spec.attrs.c;
  if(c==="nature") return natureColor(spec);
  if(c==="water") return waterColor();
  return ROLE[c]!==undefined ? ROLE[c] : ROLE.body;
}

/* fidelity: how well this thing is remembered, 0..1 */
function fidelity(spec){
  if(spec.city||spec.hub) return 1;          /* Somnucor is a real place: nothing half-there */
  if(spec.filler) return spec.solid?1:0.34;
  if(viewNight!==null && spec.nights && spec.nights.indexOf(viewNight)===-1) return 0.06;
  var d=1, a=spec.attrs||{};
  if(spec.nights && spec.nights.length>1) d+=Math.min(3,spec.nights.length-1);
  if(a.c!==undefined) d++;
  if(a.m||a.rm) d++;
  if(a.s||a.h||a.w||a.d) d++;
  if(spec.sign) d++;
  if(spec.note) d++;
  if(spec.solid) d+=2;
  if(spec.placed) d+=2;
  return Math.min(d/5,1);
}

/* lettering that fits: the whole name, shrunk or wrapped onto two lines
   as it needs, never cut short */
function fitLines(x,text,maxW,maxLines,big,small,weight,face){
  var size=big, lines=[text];
  for(;size>=small;size-=2){
    x.font=weight+" "+size+"px "+face;
    lines=[]; var line="";
    String(text).split(/\s+/).forEach(function(w){
      var t=line?line+" "+w:w;
      if(x.measureText(t).width>maxW&&line){ lines.push(line); line=w; } else line=t;
    });
    if(line) lines.push(line);
    if(lines.length<=maxLines&&lines.every(function(l){ return x.measureText(l).width<=maxW; })) break;
  }
  if(lines.length>maxLines){ lines=lines.slice(0,maxLines); lines[maxLines-1]=lines[maxLines-1].replace(/.{0,2}$/,"…"); }
  return {size:Math.max(size,small),lines:lines};
}
var SIGN_TEX={};
function signTexture(text){
  var key="s|"+text; if(SIGN_TEX[key]) return SIGN_TEX[key];
  var c=document.createElement("canvas"); c.width=512; c.height=128;
  var x=c.getContext("2d");
  x.fillStyle="#15161B"; x.fillRect(0,0,512,128);
  x.strokeStyle="#4A463C"; x.lineWidth=6; x.strokeRect(3,3,506,122);
  x.fillStyle="#E2D6BC";
  var F=fitLines(x,String(text),480,2,64,24,"400","Georgia, serif");
  x.font="400 "+F.size+"px Georgia, serif";
  x.textAlign="center"; x.textBaseline="middle";
  var lh=F.size*1.08, y0=66-(F.lines.length-1)*lh/2;
  F.lines.forEach(function(l,i){ x.fillText(l,256,y0+i*lh); });
  var tex=new THREE.CanvasTexture(c); tex.anisotropy=4; SIGN_TEX[key]=tex; return tex;
}
/* a painted notice board: the title, and beneath it what the board says */
function boardTexture(title,note){
  var key="b|"+title+"|"+(note||""); if(SIGN_TEX[key]) return SIGN_TEX[key];
  var c=document.createElement("canvas"); c.width=384; c.height=160;
  var x=c.getContext("2d");
  x.fillStyle="#EAE2CC"; x.fillRect(0,0,384,160);
  x.strokeStyle="#6A5A40"; x.lineWidth=5; x.strokeRect(4,4,376,152);
  x.fillStyle="#2A2018"; x.textAlign="center"; x.textBaseline="middle";
  var hasNote=!!(note&&String(note).trim());
  var T=fitLines(x,String(title),350,hasNote?1:3,hasNote?40:48,hasNote?16:18,"700","Georgia, serif");
  if(hasNote&&T.lines[0].slice(-1)==="\u2026") T=fitLines(x,String(title),350,2,30,16,"700","Georgia, serif");
  x.font="700 "+T.size+"px Georgia, serif";
  var lh=T.size*1.1, top=hasNote?14+lh/2:80-(T.lines.length-1)*lh/2;
  T.lines.forEach(function(l,i){ x.fillText(l,192,top+i*lh); });
  if(hasNote){
    var y=top+T.lines.length*lh+2;
    x.fillStyle="#7A6A50"; x.fillRect(60,y-4,264,2);
    var room=Math.max(1,Math.floor((150-y)/17));
    var N=fitLines(x,String(note),356,room,17,11,"400","Georgia, serif");
    x.font="400 "+N.size+"px Georgia, serif"; x.fillStyle="#3A3024";
    N.lines.forEach(function(l,i){ x.fillText(l,192,y+8+N.size/2+i*N.size*1.2); });
  }
  var tex=new THREE.CanvasTexture(c); tex.anisotropy=4; SIGN_TEX[key]=tex; return tex;
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

var HIDDEN_KINDS={hiddenroom:1,secretstair:1,trapdoor:1,secretdoor:1};
function isHidden(spec){ return !spec.found && ((spec.attrs&&spec.attrs.hidden)||HIDDEN_KINDS[spec.archetype]); }

/* things that are simply floor: they take light, they never throw it */
var FLATGROUND={groundpad:1,lawn:1,snowfield:1,blossomground:1,leaffall:1};
function build(spec){
  var def=KIT[spec.archetype]||KIT.house;
  var a=spec.attrs||{};
  var f=fidelity(spec);
  var opa=0.20+0.80*f;
  /* a hidden thing shows only faintly until it is found */
  if(isHidden(spec)){ f=Math.min(f,0.3); opa=0.12; }
  var ghosty=f<0.99;
  var sx=(a.s||1)*(a.w||1), sy=(a.s||1)*(a.h||1), sz=(a.s||1)*(a.d||1);

  /* dragons, deities, people and crowds have their own builders */
  if(typeof CREATURE!=="undefined"&&CREATURE[spec.archetype]){
    var cg=buildCreature(spec,f); cg.userData.id=spec.id; shadowsFor(cg,true); cg.scale.set(sx,sy,sz); return cg;
  }
  if(spec.archetype==="dragon"){
    var dg=buildDragon(spec,f); dg.userData.id=spec.id; shadowsFor(dg,true); return dg;
  }
  if(isPerson(spec)||spec.archetype==="crowd"){
    var pg=spec.archetype==="crowd"?buildCrowd(spec,f):spec.archetype==="deity"?buildDeity(spec,f):buildFigure(spec,f);
    pg.userData.id=spec.id;
    shadowsFor(pg,true);
    pg.scale.set(sx,sy,sz);
    return pg;
  }

  var g=new THREE.Group();
  g.userData.id=spec.id;

  var parts=levelParts(def,spec), B=def.cat==="structure"?bodyOf(parts):null;
  parts.forEach(function(pt){
    /* windows and a door redrawn to the dream's own style replace the kit's */
    if(B&&pt.c==="glass"&&!pt.glow&&redrawsFront(spec)) return;
    if(B&&restylesDoor(spec)&&isFrontDoor(pt,B,parts)) return;
    var col=resolveColor(pt.c,spec);
    var surf=surfaceOf(pt,def,spec,f);
    if(surf&&surf.wall&&a.c===undefined) col=MATCOLOR[surf.tex]||col;
    if(surf&&surf.roof) col=(a.rc!==undefined)?a.rc:(MATCOLOR[surf.tex]||col);
    var mat;
    if(pt.c==="glass" && !pt.glow && def.cat==="structure"){
      mat=new THREE.MeshBasicMaterial({color:0x3A4654,transparent:true,opacity:0.94,side:THREE.DoubleSide});
    } else if(pt.glow){
      mat=new THREE.MeshBasicMaterial({color:col,transparent:true,
        opacity:(pt.opa!==undefined?pt.opa:1)*Math.max(opa,0.35),side:THREE.DoubleSide});
      if(LAMPED[spec.archetype]){ if(!g.userData.lamps) g.userData.lamps=[]; g.userData.lamps.push(mat); }
      if(pt.pulse) (mat.userData||(mat.userData={})).pulse=1;
    } else {
      mat=new THREE.MeshLambertMaterial({color:ghosty?blend(col,0x7C93B8,1-f):col,
        transparent:opa<0.995||pt.opa!==undefined,
        opacity:(pt.opa!==undefined?pt.opa:1)*opa,
        side:pt.g==="pln"?THREE.DoubleSide:THREE.FrontSide,
        depthWrite:opa>0.24,
        polygonOffset:pt.g==="pln",polygonOffsetFactor:-1,polygonOffsetUnits:-2});
      if(surf){ var tx=texOf(surf.tex); if(tx){ mat.map=tx; mat.needsUpdate=true; } }
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
        var big=Math.max(pt.s[0]||0,pt.s[1]||0,(pt.s[2]||0));
        m.castShadow=!pt.glow&&pt.c!=="glass"&&pt.g!=="pln"&&big>=1.2&&!FLATGROUND[spec.archetype];
        m.receiveShadow=!pt.glow;
        g.add(m);
      }
    }
  });

  if(B&&!isHidden(spec)) addOpenings(g,spec,def,parts,f,opa);

  /* a notice board reads from both sides: its name, and what it says */
  if(spec.archetype==="signboard"){
    var bt=spec.sign||spec.name||spec.label;
    if(bt){
      var btex=boardTexture(bt,spec.note);
      [1,-1].forEach(function(side){
        var bp=new THREE.Mesh(new THREE.PlaneGeometry(2.9,1.2),
          new THREE.MeshLambertMaterial({map:btex,transparent:opa<1,opacity:opa,emissive:0x111111}));
        bp.position.set(0,2.1,side*0.13); if(side<0) bp.rotation.y=Math.PI;
        g.add(bp);
      });
    }
  }
  if(spec.sign && def.sign){
    var sg=def.sign; // [x,y,z,w,h]
    var board=new THREE.Mesh(new THREE.PlaneGeometry(sg[3],sg[4]),
      new THREE.MeshLambertMaterial({map:signTexture(spec.sign),transparent:true,opacity:opa,side:THREE.DoubleSide,emissive:0x222222}));
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
  if(DECOR[spec.archetype]&&!isHidden(spec)) DECOR[spec.archetype](g,spec,f);
  if(!isHidden(spec)) attachEffect(g,spec);
  /* trees, bushes, vehicles and small things get a patch of shade beneath them */
  if(def.cat==="nature"&&def.size[0]<12) g.add(contactShadow(def.size[0]*0.42));
  if(def.cat==="vehicle"&&def.size[2]<14) g.add(contactShadow(Math.max(def.size[0],def.size[2])*0.55));
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
  if(typeof BAKE!=="undefined"){
    BAKE.lamps.forEach(function(mat){ mat.opacity=0.08+night*0.92; });
    BAKE.pools.forEach(function(mat){ mat.opacity=night*0.34; });
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
  renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance",logarithmicDepthBuffer:canFragDepth()});
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
  g.position.set(spec.x,(typeof terrainY==="function")?terrainY(spec.x,spec.z)+(spec.y||0):0,spec.z);
  g.rotation.y=spec.rot||0;
  var ch=charOf(spec);
  if(ch){
    ch.x=spec.x; ch.z=spec.z;
    /* an awake figure has a faint ring at their feet; deities and dragons carry no marker */
    if(ch.awake&&!ch.deity&&spec.archetype!=="deity"&&spec.archetype!=="dragon"){
      var halo=new THREE.Mesh(new THREE.RingGeometry(0.62,0.74,28),
        new THREE.MeshBasicMaterial({color:0x9FB4D8,transparent:true,opacity:0.18,side:THREE.DoubleSide,depthWrite:false}));
      halo.rotation.x=-Math.PI/2; halo.position.y=0.09;
      g.add(halo);
      g.userData.awake=1;
    }
  }
  if(typeof ROADGOING!=="undefined"&&ROADGOING[spec.archetype]){
    g.userData.drives=1;
    /* nothing drives itself: somebody sits in it when it moves, and rides it when it's a bike */
    var seat=new THREE.Group(), sm=new THREE.MeshLambertMaterial({color:0x6B5A4A}), cl=new THREE.MeshLambertMaterial({color:0x3E4A5E});
    var dh=new THREE.Mesh(new THREE.SphereGeometry(0.11,10,8),sm); dh.position.y=0.28; seat.add(dh);
    var db=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.3,0.22),cl); db.position.y=0.05; seat.add(db);
    if(spec.archetype==="bicycle"){
      seat.position.set(0,0.95,-0.05);
      var la=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.035,0.4,6),cl); la.position.set(0,0.02,0.3); la.rotation.x=1.1; seat.add(la);
      var ll=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.04,0.45,6),cl); ll.position.set(0.08,-0.28,0.05); ll.rotation.x=-0.5; seat.add(ll);
      var lr=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.04,0.45,6),cl); lr.position.set(-0.08,-0.3,0.12); lr.rotation.x=0.3; seat.add(lr);
      var ch=charOf(spec);
      seat.visible=!!((ch&&ch.rider)||(spec.attrs&&spec.attrs.ridden));
      g.userData.seatRide=1;
    } else {
      seat.position.set(-0.32,1.0,0.35); seat.visible=false;
    }
    g.userData.seat=seat; g.add(seat);
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

/* the logarithmic depth buffer only helps where the device can write depth per
   pixel. without that it falls back to a rough approximation that loses flat things
   near the ground and punches holes by the camera, so it is only used where it works. */
function canFragDepth(){
  try{
    var c=document.createElement("canvas");
    if(c.getContext&&c.getContext("webgl2")) return true;
    var g=c.getContext&&(c.getContext("webgl")||c.getContext("experimental-webgl"));
    return !!(g&&g.getExtension&&g.getExtension("EXT_frag_depth"));
  }catch(e){ return false; }
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
  var sg=new THREE.PlaneGeometry(STREET,len); metreUVs(sg,"pln",[STREET,len]);
  /* in another realm the streets are paths of that world, not asphalt */
  var inRealm=typeof realmAtX==="function"?realmAtX(ax):null, rt=inRealm?realmTemplate(inRealm):null;
  var detail=landOpt("detail"), at=detail&&!rt?texOf("asphalt"):(detail&&rt?texOf(rt.kind==="mirror"?"paving":(rt.tex||"paving")):null);
  var m=new THREE.Mesh(sg,
    new THREE.MeshLambertMaterial({color:rt?rt.path:(at?0x55575C:ROLE.road),map:at||null}));
  m.rotation.x=-Math.PI/2;
  m.rotation.z=-Math.atan2(dx,dz);
  m.position.set(ax+dx/2,0.02,az+dz/2);
  m.receiveShadow=true;
  m.userData.street=1;
  scene.add(m);
  var dash=detail&&!rt?texOf("dash"):null;
  if(dash){
    var lg=new THREE.PlaneGeometry(0.28,len); metreUVs(lg,"pln",[0.28,len]);
    var line=new THREE.Mesh(lg,new THREE.MeshLambertMaterial({map:dash,transparent:true,alphaTest:0.4,
      color:0xE8E0C0,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2}));
    line.rotation.copy?line.rotation.copy(m.rotation):null;
    line.position.set(ax+dx/2,0.05,az+dz/2);
    line.renderOrder=1;
    line.userData.street=1;
    scene.add(line);
  }
}


