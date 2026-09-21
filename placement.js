/* Dream Walker's Atlas — placement.js
   blocks, lots, occupancy and where things land
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   6. PLACEMENT — real metres, real blocks
   ============================================================ */
var BLOCK=90, STREET=18, PITCH=BLOCK+STREET, LOTS=20;

function blockOrigin(bx,bz){ return {x:bx*PITCH, z:bz*PITCH}; }

/* ---- lot occupancy: one building to a lot, ever ---- */
function lotKey(bx,bz,k){ return bx+":"+bz+":"+k; }
function lotFree(bx,bz,k){
  if(!store.lots) store.lots={};
  return !store.lots[lotKey(bx,bz,k)];
}
function takeLot(bx,bz,k,id){
  if(!store.lots) store.lots={};
  store.lots[lotKey(bx,bz,k)]=id;
}
/* nearest free lot on the same side, then anywhere on the block, then next block */
function freeLotNear(bx,bz,k){
  if(lotFree(bx,bz,k)) return {bx:bx,bz:bz,k:k};
  var side=Math.floor(k/5)%4, i=k%5;
  for(var d=1;d<5;d++){
    if(i+d<5 && lotFree(bx,bz,side*5+i+d)) return {bx:bx,bz:bz,k:side*5+i+d};
    if(i-d>=0 && lotFree(bx,bz,side*5+i-d)) return {bx:bx,bz:bz,k:side*5+i-d};
  }
  for(var j=0;j<LOTS;j++) if(lotFree(bx,bz,j)) return {bx:bx,bz:bz,k:j};
  for(var r=1;r<4;r++){
    for(var dx=-r;dx<=r;dx++) for(var dz=-r;dz<=r;dz++){
      if(Math.abs(dx)!==r&&Math.abs(dz)!==r) continue;
      for(var m=0;m<LOTS;m++) if(lotFree(bx+dx,bz+dz,m)) return {bx:bx+dx,bz:bz+dz,k:m};
    }
  }
  return {bx:bx,bz:bz,k:k};
}

/* ---- what the dreamer said about where it stands ---- */
var SPATIAL=[
  [/\b(?:on|at)\s+the\s+(?:other|opposite)\s+side(?:\s+of\s+the\s+(?:street|road))?\b/,"opposite",1],
  [/\bacross\s+(?:the\s+(?:street|road)\s+)?from\b/,"opposite",1],
  [/\bopposite\b/,"opposite",1],
  [/\b(?:two|2)\s+blocks?\b/,"blocks",2],
  [/\b(?:three|3)\s+blocks?\b/,"blocks",3],
  [/\b(?:four|4)\s+blocks?\b/,"blocks",4],
  [/\b(?:a|one|1)\s+block\b/,"blocks",1],
  [/\bblocks?\s+(?:down|over|away|up)\b/,"blocks",1],
  [/\baround\s+the\s+corner\b/,"corner",1],
  [/\bon\s+the\s+corner\b/,"cornerlot",1],
  [/\bat\s+the\s+(?:end|bottom|top)\s+of\s+the\s+(?:street|road|block)\b/,"end",1],
  [/\b(?:next\s+to|beside|alongside|adjacent\s+to|right\s+by)\b/,"next",1],
  [/\b(?:behind|at\s+the\s+back\s+of|round\s+the\s+back)\b/,"behind",1],
  [/\b(?:further\s+)?(?:down|along|up)\s+the\s+(?:street|road)\b/,"along",2]
];
function spatialIn(text){
  if(!text) return null;
  var low=" "+String(text).toLowerCase()+" ";
  for(var i=0;i<SPATIAL.length;i++) if(SPATIAL[i][0].test(low))
    return {rel:SPATIAL[i][1], n:SPATIAL[i][2]};
  return null;
}

/* one step of a relative instruction. no lot is claimed here. */
function stepLot(dir,from){
  var bx=from.bx, bz=from.bz, k=from.lot;
  var side=Math.floor(k/5)%4, i=k%5;
  if(dir.rel==="opposite"){
    var ob={0:[0,1,2],1:[1,0,3],2:[0,-1,0],3:[-1,0,1]}[side];
    return {bx:bx+ob[0], bz:bz+ob[1], lot:ob[2]*5+(4-i)};
  }
  if(dir.rel==="blocks"){
    var step=(side===0||side===2)?[dir.n,0]:[0,dir.n];
    return {bx:bx+step[0], bz:bz+step[1], lot:k};
  }
  if(dir.rel==="along")     return {bx:bx, bz:bz, lot:side*5+Math.min(4,i+dir.n)};
  if(dir.rel==="corner")    return {bx:bx, bz:bz, lot:((side+1)%4)*5+0};
  if(dir.rel==="cornerlot") return {bx:bx, bz:bz, lot:side*5+(i<2?0:4)};
  if(dir.rel==="end")       return {bx:bx, bz:bz, lot:side*5+4};
  if(dir.rel==="next")      return {bx:bx, bz:bz, lot:side*5+Math.min(4,i+1)};
  if(dir.rel==="behind")    return {bx:bx, bz:bz, lot:((side+2)%4)*5+(4-i)};
  return {bx:bx, bz:bz, lot:k};
}

/* "two blocks down, on the opposite side" is two steps, applied in order */
function relativeLot(dirs,from){
  if(!from || from.lot===undefined || from.lot===null) return null;
  if(!dirs || !dirs.length) return null;
  var at={bx:from.bx, bz:from.bz, lot:from.lot};
  for(var i=0;i<dirs.length;i++) at=stepLot(dirs[i],at);
  return freeLotNear(at.bx,at.bz,at.lot);
}

function nextLot(dir){
  var g=store.grid;
  var slot=null;
  if(dir && store.lastLot) slot=relativeLot(dir,store.lastLot);
  if(!slot) slot=freeLotNear(g.bx,g.bz,g.lot);
  ensureStreets(slot.bx,slot.bz);
  var spot=lotSpot(slot.bx,slot.bz,slot.k);
  spot.addr=addressOf(slot.bx,slot.bz,slot.k);
  spot.lot=slot.k; spot.bx=slot.bx; spot.bz=slot.bz;
  g.bx=slot.bx; g.bz=slot.bz;
  g.lot=slot.k+1;
  if(g.lot>=LOTS){
    g.lot=0;
    if(Math.random()<0.5) g.bx+=(Math.random()<0.5?1:-1);
    else g.bz+=(Math.random()<0.5?1:-1);
  }
  return spot;
}

function lotSpot(bx,bz,k){
  var o=blockOrigin(bx,bz);
  var side=Math.floor(k/5)%4, i=k%5;
  var off=-36+i*18, back=30;
  if(side===0) return {x:o.x+off, z:o.z+back, rot:0};
  if(side===1) return {x:o.x+back, z:o.z-off, rot:Math.PI/2};
  if(side===2) return {x:o.x-off, z:o.z-back, rot:Math.PI};
  return {x:o.x-back, z:o.z+off, rot:-Math.PI/2};
}

function ensureStreets(bx,bz){
  var k=bx+":"+bz;
  if(store.streets.indexOf(k)>-1) return;
  store.streets.push(k);
  var o=blockOrigin(bx,bz), h=(BLOCK+STREET)/2;
  drawStreet(o.x-h,o.z+h,o.x+h,o.z+h);
  drawStreet(o.x-h,o.z-h,o.x+h,o.z-h);
  drawStreet(o.x+h,o.z-h,o.x+h,o.z+h);
  drawStreet(o.x-h,o.z-h,o.x-h,o.z+h);
}

/* push a point out from a lot toward the street it faces, and
   give the along-street direction so things can line up on it */
function outward(base,dist,along){
  var r=base.rot, a=along||0;
  if(Math.abs(r)<0.01)                      return {x:base.x+a, z:base.z+dist};
  if(Math.abs(r-Math.PI/2)<0.01)            return {x:base.x+dist, z:base.z-a};
  if(Math.abs(Math.abs(r)-Math.PI)<0.01)    return {x:base.x-a, z:base.z-dist};
  return {x:base.x-dist, z:base.z+a};
}

function spotFor(arch,dir){
  var def=KIT[arch]||KIT.house, cat=def.cat;
  var g=store.grid, o=blockOrigin(g.bx,g.bz);

  if(cat==="structure") return nextLot(dir);

  var base=lotSpot(g.bx,g.bz,Math.max(0,g.lot-1));
  base.addr=addressOf(g.bx,g.bz,Math.max(0,g.lot-1));
  var jitter=function(){ return (Math.random()-0.5)*14; };

  if(cat==="vehicle"){
    var v=outward(base,BLOCK/2+STREET/2-4,jitter()*1.6);
    return {x:v.x, z:v.z, rot:base.rot, addr:base.addr};
  }
  if(cat==="being"){
    var b=outward(base,BLOCK/2-3,jitter());
    return {x:b.x, z:b.z, rot:Math.random()*6.283, addr:base.addr};
  }
  if(cat==="infra"){
    var i=outward(base,BLOCK/2-1.5,jitter());
    return {x:i.x, z:i.z, rot:base.rot, addr:base.addr};
  }

  // nature: big features take open land beyond the built ring
  if(def.size[0]>25){
    store.open++;
    var ang=store.open*2.4, rad=320+store.open*90;
    return {x:o.x+Math.cos(ang)*rad, z:o.z+Math.sin(ang)*rad, rot:Math.random()*6.283, addr:base.addr};
  }
  var n=outward(base,BLOCK/2-6,jitter());
  return {x:n.x+jitter()*0.4, z:n.z+jitter()*0.4, rot:Math.random()*6.283, addr:base.addr};
}

function place(arch,label,attrs,opts){
  if(!KIT[arch]) arch="house";
  opts=opts||{};
  if(KIT[arch].cat==="being" && !opts.forceNew){
    /* fall through to a new body when the dreamer said "another" */
    var ch=resolveCharacter(arch,label,attrs);
    if(ch.objId){
      var ex=specById(ch.objId);
      if(ex){
        ex.attrs=Object.assign({},ex.attrs,attrs||{});
        if(ch.awake) ex.solid=true;
        refresh(ex); save();
        return ex;
      }
    }
  }
  var s=spotFor(arch,opts.dir);
  var spec={id:uid(),archetype:arch,label:label||arch,attrs:attrs||{},
            x:s.x,z:s.z,rot:s.rot,sign:opts.sign||null,note:opts.note||null,
            solid:!!opts.solid,detail:1,addr:s.addr||null,name:null,nights:[store.session],
            bx:s.bx,bz:s.bz,lot:(s.lot===undefined?null:s.lot)};
  if(opts.name){ spec.name=opts.name; spec.named="stated"; }
  else { spec.name=nameFor(spec,s.addr||{num:1,street:streetName("ns",0)}); spec.named="provisional"; }
  markStale(spec.x,spec.z);
  if(KIT[arch].cat==="structure" && s.lot!==undefined){
    takeLot(s.bx,s.bz,s.lot,spec.id);
    store.lastLot={bx:s.bx,bz:s.bz,lot:s.lot};
  }
  store.objects.push(spec);
  addMesh(spec);
  if(KIT[arch].cat==="being"){
    clearFillersNear(spec.x,spec.z,12);
    var c=opts.forceNew?newCharacter(arch,label,attrs):resolveCharacter(arch,label,attrs);
    c.objId=spec.id; c.x=spec.x; c.z=spec.z; c.anchor={x:spec.x,z:spec.z};
    spec.charId=c.id;
  }
  if(KIT[arch].cat==="structure") store.lastId=spec.id;
  updateCount(); save();
  return spec;
}

