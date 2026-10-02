/* SomnuMatrix — atlantis-bake.js
   Somnucor drawn fast. The city is eight thousand things made of a hundred
   thousand little pieces, and drawing each piece on its own every frame is
   what made walking it feel slow. Here every piece that never moves is
   pressed together, area by area, into a handful of large meshes — its own
   colour carried in the mesh itself — so the whole city costs a few hundred
   draws instead of fifteen thousand.

   Nothing about the city changes: every piece is still there, still clickable
   and inspectable (the originals stay in place, only hidden), and anything
   the keeper changes is re-pressed a moment later. People, creatures,
   vehicles and anything that moves or shimmers are left exactly as they are.
   loaded as a plain script; shares scope with the other files */
"use strict";

var BAKE={chunks:{},queue:[],ready:false,cell:260,bigCell:1100,lamps:[],pools:[],
          checkAt:0,cullAt:0,started:false,off:false};

function bakeSkipObject(o,g){
  if(!g||g.userData.drives||g.userData.nmGone) return true;
  if(o.wild||(typeof CREATURE!=="undefined"&&CREATURE[o.archetype])) return true;
  var d=KIT[o.archetype]; if(!d) return true;
  if(d.cat==="being"||d.cat==="vehicle") return true;
  if(typeof isHidden==="function"&&isHidden(o)) return true;
  if(typeof ROADGOING!=="undefined"&&ROADGOING[o.archetype]) return true;
  return false;
}
function bakeBig(o){
  var d=KIT[o.archetype]; if(!d) return false;
  var s=(o.attrs&&o.attrs.s)||1;
  return Math.max(d.size[0],d.size[1],d.size[2])*s>40;
}
function bakeChunkKey(o){
  if(bakeBig(o)) return "B"+Math.floor(o.x/BAKE.bigCell)+","+Math.floor(o.z/BAKE.bigCell);
  return "S"+Math.floor(o.x/BAKE.cell)+","+Math.floor(o.z/BAKE.cell);
}

/* a thing that moves only in part — a flag that flutters on a still castle, a
   fountain's water on its still stone — keeps those parts moving and has the
   rest pressed. Which parts move is found by letting it move twice and
   seeing what changed. */
function bakeAnimatedSet(g){
  var run=g.userData.anim; if(!run) return null;
  var nodes=[]; g.traverse(function(n){ nodes.push(n); });
  function snap(){ return nodes.map(function(n){
    var mt=n.material&&!Array.isArray(n.material)?n.material:null;
    return [n.position.x,n.position.y,n.position.z,n.rotation.x,n.rotation.y,n.rotation.z,n.scale.x,n.scale.y,n.scale.z,n.visible?1:0,
      mt&&mt.color?mt.color.getHex():-1,mt&&mt.emissive?mt.emissive.getHex():-1,mt?mt.opacity:-1,
      mt&&mt.map?mt.map.offset.x+mt.map.offset.y*7:-1].join(","); }); }
  var a=snap();
  try{ run(1.37,0.11); run(3.91,0.13); run(7.7,0.2); }catch(e){ return "all"; }
  var bb=snap(), moving=new Set();
  for(var i=0;i<nodes.length;i++) if(a[i]!==bb[i]){
    if(nodes[i]===g) return "all";
    nodes[i].traverse(function(c){ moving.add(c); });
    /* anything sharing a changing material changes with it */
    var mt=nodes[i].material; if(mt) nodes.forEach(function(n){ if(n.material===mt) moving.add(n); });
  }
  return moving;
}

/* which pieces can be pressed together: anything plainly drawn. Lettering
   painted on a canvas stays its own piece, and so does anything unusual. */
function bakeable(m){
  if(!m.isMesh||m.isSkinnedMesh) return false;
  if(m.isInstancedMesh&&m.count>400) return false;
  var mt=m.material; if(!mt||Array.isArray(mt)) return false;
  /* painted lettering (a sign, a name) keeps its own piece; shared surface
     textures — stone, brick, bark — press like anything else */
  if(mt.map&&typeof SIGN_TEX!=="undefined"&&bakeIsSign(mt.map)) return false;
  if(!(mt.isMeshLambertMaterial||mt.isMeshBasicMaterial||mt.isMeshPhongMaterial||mt.isMeshStandardMaterial||mt.isMeshToonMaterial)) return false;
  if(mt.vertexColors||mt.alphaMap||mt.envMap) return false;
  var ge=m.geometry; if(!ge||!ge.isBufferGeometry||!ge.attributes.position) return false;
  if(ge.morphAttributes&&Object.keys(ge.morphAttributes).length) return false;
  return true;
}
var BAKE_SIGNS=null, BAKE_SIGNN=-1;
function bakeIsSign(t){
  var keys=Object.keys(SIGN_TEX);
  if(!BAKE_SIGNS||BAKE_SIGNN!==keys.length){ BAKE_SIGNS=new Set(keys.map(function(k){ return SIGN_TEX[k]; })); BAKE_SIGNN=keys.length; }
  return BAKE_SIGNS.has(t);
}
function bakeMatKey(mt,special){
  return [special||"",mt.type,mt.transparent?1:0,mt.transparent?Math.round(mt.opacity*100):100,mt.side,
    mt.depthWrite?1:0,mt.map?mt.map.uuid:"",mt.emissive?mt.emissive.getHex():"",
    mt.shininess!==undefined?Math.round(mt.shininess):"",mt.specular?mt.specular.getHex():"",
    mt.flatShading?1:0,mt.blending,mt.polygonOffset?1:0,mt.wireframe?1:0].join("|");
}
function bakeMakeMaterial(mt){
  var m=mt.clone();
  if(mt.onBeforeCompile&&mt.userData&&mt.userData.toon){ m.onBeforeCompile=mt.onBeforeCompile; m.userData.toon=1; }
  if(m.color) m.color.setHex(0xFFFFFF);
  m.vertexColors=true;
  m.needsUpdate=true;
  return m;
}

function bakePressGroups(groups,origin,key,big){
  var v=new THREE.Vector3(), nm=new THREE.Matrix3(), col=new THREE.Color(), rad=0;
  var out=[];
  Object.keys(groups).forEach(function(k){
    var G=groups[k];
    var pos=new Float32Array(G.verts*3), nor=new Float32Array(G.verts*3), clr=new Float32Array(G.verts*3);
    var uvs=G.uv?new Float32Array(G.verts*2):null;
    var big32=G.verts>65535, idx=big32?new Uint32Array(G.idx):new Uint16Array(G.idx);
    var vo=0, io=0;
    G.parts.forEach(function(P){
      var ge=P.ge, pa=ge.attributes.position, na=ge.attributes.normal, ua=ge.attributes.uv, ia=ge.index;
      nm.getNormalMatrix(P.mat);
      col.setHex(P.col);
      var flip=P.mat.determinant()<0;
      for(var i=0;i<pa.count;i++){
        v.fromBufferAttribute(pa,i).applyMatrix4(P.mat).sub(origin);
        pos[(vo+i)*3]=v.x; pos[(vo+i)*3+1]=v.y; pos[(vo+i)*3+2]=v.z;
        if(v.x*v.x+v.z*v.z>rad) rad=v.x*v.x+v.z*v.z;
        if(na){ v.fromBufferAttribute(na,i).applyMatrix3(nm).normalize(); nor[(vo+i)*3]=v.x; nor[(vo+i)*3+1]=v.y; nor[(vo+i)*3+2]=v.z; }
        clr[(vo+i)*3]=col.r; clr[(vo+i)*3+1]=col.g; clr[(vo+i)*3+2]=col.b;
        if(uvs&&ua){ uvs[(vo+i)*2]=ua.getX(i); uvs[(vo+i)*2+1]=ua.getY(i); }
      }
      if(ia){
        for(var j=0;j<ia.count;j+=3){
          var a=ia.getX(j)+vo, b=ia.getX(j+1)+vo, c=ia.getX(j+2)+vo;
          if(flip){ idx[io++]=a; idx[io++]=c; idx[io++]=b; } else { idx[io++]=a; idx[io++]=b; idx[io++]=c; }
        }
      } else {
        for(var q=0;q<pa.count;q+=3){
          if(flip){ idx[io++]=vo+q; idx[io++]=vo+q+2; idx[io++]=vo+q+1; } else { idx[io++]=vo+q; idx[io++]=vo+q+1; idx[io++]=vo+q+2; }
        }
      }
      vo+=pa.count;
    });
    var bg=new THREE.BufferGeometry();
    bg.setAttribute("position",new THREE.BufferAttribute(pos,3));
    bg.setAttribute("normal",new THREE.BufferAttribute(nor,3));
    bg.setAttribute("color",new THREE.BufferAttribute(clr,3));
    if(uvs) bg.setAttribute("uv",new THREE.BufferAttribute(uvs,2));
    bg.setIndex(new THREE.BufferAttribute(idx.subarray(0,io),1));
    bg.computeBoundingSphere(); bg.computeBoundingBox();
    var mat=bakeMakeMaterial(G.mat);
    var mesh=new THREE.Mesh(bg,mat);
    mesh.position.copy(origin);
    mesh.castShadow=G.cast; mesh.receiveShadow=!G.mat.transparent;
    mesh.matrixAutoUpdate=false; mesh.updateMatrix();
    mesh.raycast=function(){};            // picking still finds the real piece underneath
    mesh.userData.bakedChunk=key;
    if(G.mat.transparent) mesh.renderOrder=1;
    if(G.special==="lamp") BAKE.lamps.push(mat);
    if(G.special==="pool") BAKE.pools.push(mat);
    scene.add(mesh); out.push(mesh);
  });
  return {meshes:out,rad:rad};
}
/* press a loose list of pieces (not belonging to any one thing in the city) */
function bakePress(list,cx,cz,key){
  var groups={}, origin=new THREE.Vector3(cx,0,cz);
  list.forEach(function(it){
    var m=it.m, mt=m.material, k=bakeMatKey(mt,it.special);
    var G=groups[k]||(groups[k]={mat:mt,special:it.special,parts:[],verts:0,idx:0,cast:false,uv:!!mt.map});
    bakeAddParts(G,m);
  });
  return bakePressGroups(groups,origin,key,false);
}

function bakeAddParts(G,m){
  var mt=m.material, ge=m.geometry, pc=ge.attributes.position.count, base=mt.color?mt.color.getHex():0xFFFFFF;
  if(m.isInstancedMesh){
    var im=new THREE.Matrix4(), c=new THREE.Color();
    for(var i=0;i<m.count;i++){
      m.getMatrixAt(i,im);
      var col=base; if(m.instanceColor){ m.getColorAt(i,c); if(mt.color) c.multiply(mt.color); col=c.getHex(); }
      G.parts.push({ge:ge,mat:m.matrixWorld.clone().multiply(im),col:col});
      G.verts+=pc; G.idx+=ge.index?ge.index.count:pc;
    }
  } else {
    G.parts.push({ge:ge,mat:m.matrixWorld.clone(),col:base});
    G.verts+=pc; G.idx+=ge.index?ge.index.count:pc;
  }
  if(m.castShadow) G.cast=true;
}
/* gather one area's still pieces and press them into meshes, one per kind
   of surface */
function bakeChunk(key){
  var ch=BAKE.chunks[key]; if(!ch) return;
  bakeUnbake(key,true);
  var groups={}, members=[], big=key.charAt(0)==="B";
  var cx=0,cz=0,n=0;
  ch.ids.forEach(function(id){
    var o=specById(id), g=meshes[id];
    if(!o||!g||bakeSkipObject(o,g)) return;
    cx+=o.x; cz+=o.z; n++;
  });
  if(!n){ ch.meshes=[]; ch.members=[]; return; }
  cx/=n; cz/=n; ch.cx=cx; ch.cz=cz;
  var origin=new THREE.Vector3(cx,0,cz), v=new THREE.Vector3(), nm=new THREE.Matrix3(), col=new THREE.Color();
  var rad=0;
  ch.ids.forEach(function(id){
    var o=specById(id), g=meshes[id];
    if(!o||!g||bakeSkipObject(o,g)) return;
    var moving=bakeAnimatedSet(g); if(moving==="all") return;
    var lampSet=g.userData.lamps?new Set(g.userData.lamps):null;
    var poolMat=g.userData.pool?g.userData.pool.material:null;
    g.updateMatrixWorld(true);
    var took=[];
    g.traverse(function(m){
      if(!bakeable(m)||m.userData.baked||(moving&&moving.has(m))) return;
      /* a piece somebody hid on purpose stays hidden: only what shows is pressed */
      var p=m, shown=true; while(p&&p!==g){ if(!p.visible){ shown=false; break; } p=p.parent; }
      if(!shown) return;
      var mt=m.material, special=(lampSet&&lampSet.has(mt))?"lamp":(mt===poolMat?"pool":"");
      var k=bakeMatKey(mt,special);
      var G=groups[k]||(groups[k]={mat:mt,special:special,parts:[],verts:0,idx:0,cast:false,uv:!!mt.map});
      bakeAddParts(G,m);
      took.push(m);
    });
    if(took.length) members.push({id:id,g:g,x:g.position.x,z:g.position.z,ry:g.rotation.y,y:g.position.y,took:took});
  });
  var pr=bakePressGroups(groups,origin,key,big);
  var out=pr.meshes; rad=pr.rad;
  /* the originals stay where they are, hidden, so clicking and inspecting
     anything in the city works exactly as before */
  members.forEach(function(M){ M.took.forEach(function(m){ m.visible=false; m.userData.baked=key; }); });
  ch.meshes=out; ch.members=members; ch.big=big; ch.rad=Math.sqrt(rad);
  ch.shown=null;
}
/* the terraces' own fittings — stair lamps, posts, balustrades — are pressed too */
function bakeTerrain(){
  if(BAKE.terrain){ BAKE.terrain.forEach(function(m){ scene.remove(m); m.geometry.dispose(); m.material.dispose(); });
    (BAKE.terrainTook||[]).forEach(function(m){ m.visible=true; m.userData.baked=null; }); }
  BAKE.terrain=[]; BAKE.terrainTook=[]; BAKE.terrainOf=atlGroup;
  if(!atlGroup) return;
  atlGroup.updateMatrixWorld(true);
  var cells={}, v=new THREE.Vector3();
  atlGroup.traverse(function(m){
    if(!bakeable(m)||m.userData.baked||!m.visible) return;
    v.setFromMatrixPosition(m.matrixWorld);
    var k=Math.floor(v.x/BAKE.cell)+","+Math.floor(v.z/BAKE.cell);
    (cells[k]||(cells[k]=[])).push(m);
  });
  Object.keys(cells).forEach(function(k){
    var list=cells[k], cx=0, cz=0;
    list.forEach(function(m){ v.setFromMatrixPosition(m.matrixWorld); cx+=v.x; cz+=v.z; });
    var made=bakePress(list.map(function(m){ return {m:m,special:""}; }),cx/list.length,cz/list.length,"T"+k);
    made.meshes.forEach(function(mm){ BAKE.terrain.push(mm); });
    list.forEach(function(m){ m.visible=false; m.userData.baked="T"+k; BAKE.terrainTook.push(m); });
  });
}
function bakeUnbake(key,quiet){
  var ch=BAKE.chunks[key]; if(!ch) return;
  (ch.meshes||[]).forEach(function(m){
    scene.remove(m);
    var i=BAKE.lamps.indexOf(m.material); if(i>-1) BAKE.lamps.splice(i,1);
    i=BAKE.pools.indexOf(m.material); if(i>-1) BAKE.pools.splice(i,1);
    m.geometry.dispose(); m.material.dispose();
  });
  (ch.members||[]).forEach(function(M){ M.took.forEach(function(m){ if(m.userData.baked===key){ m.visible=true; m.userData.baked=null; } }); });
  ch.meshes=[]; ch.members=[];
}

/* sort the city into areas once it stands, then press them nearest first,
   a few each frame so nothing ever stalls */
function bakeStart(){
  var r=(typeof somnucorRealm==="function")?somnucorRealm():null; if(!r) return;
  Object.keys(BAKE.chunks).forEach(function(k){ bakeUnbake(k,true); });
  BAKE.chunks={}; BAKE.queue=[];
  store.objects.forEach(function(o){
    if(!o.city||o.realm!==r.id) return;
    o._bakeKnown=1;
    var k=bakeChunkKey(o);
    (BAKE.chunks[k]||(BAKE.chunks[k]={ids:[],meshes:[],members:[]})).ids.push(o.id);
  });
  var P=camera.position;
  BAKE.queue=Object.keys(BAKE.chunks).sort(function(a,b){
    function d(k){ var s=k.slice(1).split(","), c=k.charAt(0)==="B"?BAKE.bigCell:BAKE.cell;
      var x=(+s[0]+0.5)*c, z=(+s[1]+0.5)*c; return (x-P.x)*(x-P.x)+(z-P.z)*(z-P.z); }
    return d(a)-d(b);
  });
  BAKE.started=true; BAKE.ready=false;
}
function bakeTick(dt){
  if(BAKE.off||typeof scene==="undefined"||!scene||typeof ATLC==="undefined"||!ATLC) return;
  var r=somnucorRealm(); if(!r) { if(BAKE.started){ Object.keys(BAKE.chunks).forEach(function(k){ bakeUnbake(k,true); }); BAKE.chunks={}; BAKE.started=false; } return; }
  /* not while the city is still being put up */
  if(typeof atlMeshQueue!=="undefined"&&atlMeshQueue.length) return;
  if(!BAKE.started) bakeStart();
  if(typeof atlGroup!=="undefined"&&BAKE.terrainOf!==atlGroup) bakeTerrain();
  var t0=performance.now();
  while(BAKE.queue.length&&performance.now()-t0<12){ bakeChunk(BAKE.queue.shift()); }
  if(!BAKE.queue.length&&!BAKE.ready){ BAKE.ready=true; }
  /* anything moved, changed or taken away since it was pressed: press its area again */
  BAKE.checkAt-=dt;
  if(BAKE.checkAt<=0){
    BAKE.checkAt=1.5;
    Object.keys(BAKE.chunks).forEach(function(k){
      var ch=BAKE.chunks[k]; if(!ch.members||!ch.members.length) return;
      for(var i=0;i<ch.members.length;i++){
        var M=ch.members[i], g=meshes[M.id];
        if(g!==M.g||Math.abs(g.position.x-M.x)>0.01||Math.abs(g.position.z-M.z)>0.01||Math.abs(g.position.y-M.y)>0.01||Math.abs(g.rotation.y-M.ry)>0.001||(g.userData.nmGone)){
          if(BAKE.queue.indexOf(k)<0) BAKE.queue.unshift(k); break;
        }
      }
    });
    /* new things in the city (a keeper's addition) find their area */
    store.objects.forEach(function(o){
      if(!o.city||o.realm!==r.id||o._bakeKnown) return;
      o._bakeKnown=1;
      var k=bakeChunkKey(o), ch=BAKE.chunks[k]||(BAKE.chunks[k]={ids:[],meshes:[],members:[]});
      if(ch.ids.indexOf(o.id)<0){ ch.ids.push(o.id); if(BAKE.queue.indexOf(k)<0) BAKE.queue.push(k); }
    });
  }
  /* near areas drawn, far ones not; the great buildings show from across the city */
  var P=camera.position, inCity=(store.here||0)===r.id&&!store.inside;
  /* every third of a second — or at once after a jump: a door, a stairway
     taken in one step, being shown the way */
  var L=BAKE.lastAt, jumped=!L||L.inCity!==inCity||Math.abs(L.x-P.x)+Math.abs(L.z-P.z)>40;
  BAKE.cullAt-=dt; if(BAKE.cullAt>0&&!jumped) return; BAKE.cullAt=0.3;
  BAKE.lastAt={x:P.x,z:P.z,inCity:inCity};
  Object.keys(BAKE.chunks).forEach(function(k){
    var ch=BAKE.chunks[k]; if(!ch.meshes||!ch.meshes.length) return;
    var reach=(ch.big?3400:1100)*(window.BAKE_REACH||1)+(ch.rad||0);
    var dx=ch.cx-P.x, dz=ch.cz-P.z, show=inCity&&dx*dx+dz*dz<reach*reach;
    if(show!==ch.shown){ ch.shown=show; ch.meshes.forEach(function(m){ m.visible=show; }); }
  });
  (BAKE.terrain||[]).forEach(function(m){
    var dx=m.position.x-P.x, dz=m.position.z-P.z, rr=1400+(m.geometry.boundingSphere?m.geometry.boundingSphere.radius:0);
    m.visible=inCity&&dx*dx+dz*dz<rr*rr;
  });
}
