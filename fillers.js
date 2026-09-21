/* Dream Walker's Atlas — fillers.js
   population drawn from buildings, and the nameless others
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   6d. FILLERS — a town needs bodies, but none of them are yours
   ============================================================ */
var FILLER_KINDS=["human","human","human","child","car","dog","crowd"];

/* how many souls a building accounts for: [who sleeps there, who is there by day] */
var CAPACITY={
house:[3,0], cottage:[2,0], apartment:[26,0], motel:[9,2], hotel:[44,9], tent:[2,0],
bunker:[3,0], ruin:[1,0], shed:[0,0], garage:[0,1], barn:[2,3],
tower:[0,70], skyscraper:[0,320], institution:[0,90], hospital:[24,130], school:[0,220],
church:[0,14], cathedral:[0,36], bank:[0,20], library:[0,14], station:[0,60],
courthouse:[0,28], shop:[1,5], warehouse:[0,14], factory:[0,70], windmill:[1,2],
lighthouse:[1,1], booth:[0,1], pier:[0,6], fountain:[0,3], grass:[0,4], bench:[0,2]
};

/* how much of a place's population is out where you can see it, hour by hour */
function outFraction(h){
  if(h<4.5) return 0.012;
  if(h<6.5) return 0.05;
  if(h<9)   return 0.24;
  if(h<12)  return 0.11;
  if(h<14)  return 0.20;
  if(h<17)  return 0.11;
  if(h<19)  return 0.26;
  if(h<21.5)return 0.13;
  if(h<23)  return 0.06;
  return 0.02;
}

function blockKeyOf(x,z){ return Math.round(x/PITCH)+":"+Math.round(z/PITCH); }

/* what stands on this block decides how many live there and what kind of crowd it is */
function census(bx,bz){
  var res=0,day=0,kinds={res:0,com:0,ind:0,rural:0,civic:0};
  var o=blockOrigin(bx,bz), R=(BLOCK+STREET)/2;
  for(var i=0;i<store.objects.length;i++){
    var s=store.objects[i];
    if(s.filler) continue;
    if(Math.abs(s.x-o.x)>R||Math.abs(s.z-o.z)>R) continue;
    var cap=CAPACITY[s.archetype];
    var sc=(s.attrs&&s.attrs.s?s.attrs.s:1)*(s.attrs&&s.attrs.h?s.attrs.h:1);
    if(cap){ res+=cap[0]*sc; day+=cap[1]*sc; }
    if(RESIDENTIAL[s.archetype]) kinds.res++;
    else if(s.archetype==="shop"||s.archetype==="station"||s.archetype==="bank"||s.archetype==="hotel") kinds.com++;
    else if(s.archetype==="factory"||s.archetype==="warehouse") kinds.ind++;
    else if(s.archetype==="barn"||s.archetype==="tree"||s.archetype==="grass"||s.archetype==="hedge") kinds.rural++;
    else if(WORKPLACE[s.archetype]) kinds.civic++;
  }
  var flavour="res",top=-1;
  for(var k in kinds) if(kinds[k]>top){ top=kinds[k]; flavour=k; }
  return {res:Math.round(res), day:Math.round(day), flavour:flavour, any:(res+day)>0};
}

/* the visible crowd is a sample of the notional population at this hour */
function crowdSize(c,h){
  if(!c.any) return 0;
  var pool=(h>=8&&h<19)?(c.day*0.75+c.res*0.35):(c.res*0.8+c.day*0.12);
  var n=Math.sqrt(Math.max(pool,0))*outFraction(h)*3.0;
  return Math.max(0,Math.min(18,Math.round(n)));
}

var MIX={
 res:  ["human","human","child","dog","car","cat"],
 com:  ["human","human","human","crowd","car","bicycle"],
 ind:  ["human","human","truck","car","bird"],
 rural:["human","dog","horse","bird","bird"],
 civic:["human","human","crowd","car","child"]
};

/* blocks are only populated once you have reason to be near them */
function markStale(x,z){
  if(!store.blocks) return;
  var b=store.blocks[blockKeyOf(x,z)];
  if(b) b.stale=true;
}
function seedBlock(bx,bz){
  var key=bx+":"+bz;
  if(!store.blocks) store.blocks={};
  if(store.blocks[key]){
    if(store.blocks[key].stale){ refreshCensus(bx,bz); store.blocks[key].stale=false; }
    return store.blocks[key];
  }
  var c=census(bx,bz);
  store.blocks[key]={bx:bx,bz:bz,res:c.res,day:c.day,flavour:c.flavour,any:c.any,ids:[],stale:false};
  return store.blocks[key];
}
function refreshCensus(bx,bz){
  var key=bx+":"+bz;
  if(!store.blocks||!store.blocks[key]) return;
  var c=census(bx,bz);
  var b=store.blocks[key];
  b.res=c.res; b.day=c.day; b.flavour=c.flavour; b.any=c.any;
}

function spawnFiller(b,seed){
  var mix=MIX[b.flavour]||MIX.res;
  var k=mix[seed%mix.length];
  var g=store.grid, keep={bx:g.bx,bz:g.bz,lot:g.lot};
  store.grid={bx:b.bx,bz:b.bz,lot:(seed%LOTS)};
  var s=spotFor(k);
  store.grid=keep;
  var spec={id:uid(),archetype:k,label:null,attrs:{},x:s.x,z:s.z,
            rot:Math.random()*6.283,sign:null,note:null,solid:false,detail:0,
            addr:s.addr||null,name:null,named:null,filler:true,block:b.bx+":"+b.bz};
  var c={id:uid(),archetype:k,name:"someone",aka:[],details:[],sessions:[],
         awake:false,log:[],objId:spec.id,x:spec.x,z:spec.z,primary:false,
         src:{},role:null,shift:null,routine:null,home:null,work:null,
         anchor:{x:spec.x,z:spec.z},born:""};
  spec.charId=c.id;
  store.objects.push(spec); store.characters.push(c);
  addMesh(spec);
  b.ids.push(spec.id);
  return spec;
}

function despawnFiller(id,b){
  if(meshes[id]){ scene.remove(meshes[id]); delete meshes[id]; }
  for(var i=store.objects.length-1;i>=0;i--)
    if(store.objects[i].id===id){ store.objects.splice(i,1); break; }
  for(var j=store.characters.length-1;j>=0;j--)
    if(store.characters[j].objId===id){ store.characters.splice(j,1); break; }
  if(b){ var k=b.ids.indexOf(id); if(k>-1) b.ids.splice(k,1); }
}

/* bring each seeded block to the crowd the hour calls for */
function balanceCrowds(h){
  if(!store.blocks) return;
  for(var key in store.blocks){
    var b=store.blocks[key];
    if(!b.any) continue;
    var want=crowdSize(b,h);
    var seed=hash(key)>>>3;
    while(b.ids.length<want) spawnFiller(b,(seed+b.ids.length*7)>>>0);
    while(b.ids.length>want) despawnFiller(b.ids[b.ids.length-1],b);
  }
}

/* someone you actually dreamt always outranks a filler standing there */
function clearFillersNear(x,z,r){
  for(var i=store.objects.length-1;i>=0;i--){
    var o=store.objects[i];
    if(!o.filler) continue;
    var dx=o.x-x, dz=o.z-z;
    if(dx*dx+dz*dz>r*r) continue;
    var b=store.blocks&&o.block?store.blocks[o.block]:null;
    despawnFiller(o.id,b);
  }
}

/* keep this for the moment a new dream is committed */
function populate(){
  for(var k in store.blocks) store.blocks[k].stale=true;
  seedBlock(store.grid.bx,store.grid.bz);
  seedNearby();
  balanceCrowds(dreamHour());
}

