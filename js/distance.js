/* SomnuMatrix — distance.js
   what "two blocks away" means. a block is a block, a street away is the next one
   over, a neighbourhood is a cluster of blocks that keeps its own name, and across
   town is the far side of everything standing.
   loaded as a plain script; shares scope with the other files */
"use strict";

var WORDNUM={a:1,an:1,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,
  "a couple of":2,"a few":3,"several":4,"a dozen":12};

/* read a distance out of the words around a thing */
function distanceIn(seg){
  var m;
  if((m=/\b(a|an|one|two|three|four|five|six|seven|eight|nine|ten|a couple of|a few|several)\s+(blocks?|streets?|roads?)\s*(away|over|down|up|along|from here|further on|further)?\b/.exec(seg)))
    return {blocks:WORDNUM[m[1]]||1,why:m[0].trim()};
  if(/\bnext door\b|\bnext to it\b|\bbeside it\b/.test(seg)) return {blocks:0,near:true,why:"next door"};
  if(/\b(down|up) the (street|road|lane)\b|\bfurther along\b|\bat the end of the (street|road)\b/.test(seg))
    return {blocks:0,along:true,why:"down the street"};
  if(/\baround the corner\b|\bround the corner\b|\bon the corner of the next\b/.test(seg))
    return {blocks:1,corner:true,why:"around the corner"};
  if(/\bacross town\b|\bother side of town\b|\bfar side of town\b|\bright across the city\b/.test(seg))
    return {blocks:5,far:true,why:"across town"};
  if(/\b(the )?next neighbou?rhood\b|\bthe next part of town\b|\banother neighbou?rhood\b/.test(seg))
    return {blocks:3,hood:true,why:"the next neighbourhood"};
  if(/\bin (my|our|the) (old )?neighbou?rhood\b|\bmy street\b|\bour street\b|\bmy road\b/.test(seg))
    return {blocks:0,home:true,why:"the home neighbourhood"};
  if(/\bout of town\b|\boutside the town\b|\bon the edge of town\b|\bout past the houses\b/.test(seg))
    return {blocks:6,edge:true,why:"out of town"};
  if(/\bmiles (away|off)\b|\ba long way (away|off)\b|\bfar away\b/.test(seg))
    return {blocks:9,far:true,why:"miles away"};
  return null;
}

/* every distance phrase in a stretch of dream, with where it was said */
var DIST_ALL=new RegExp("(\\b(?:a|an|one|two|three|four|five|six|seven|eight|nine|ten|a couple of|a few|several)\\s+(?:blocks?|streets?|roads?)\\s*(?:away|over|down|up|along|from here|further on|further)?)"+
  "|(\\bnext door\\b|\\bnext to it\\b|\\bbeside it\\b)"+
  "|(\\b(?:down|up) the (?:street|road|lane)\\b|\\bfurther along\\b|\\bat the end of the (?:street|road)\\b)"+
  "|(\\baround the corner\\b|\\bround the corner\\b)"+
  "|(\\bacross town\\b|\\bother side of town\\b|\\bfar side of town\\b)"+
  "|(\\b(?:the )?next neighbou?rhood\\b|\\bthe next part of town\\b|\\banother neighbou?rhood\\b)"+
  "|(\\bin (?:my|our|the) (?:old )?neighbou?rhood\\b|\\bmy street\\b|\\bour street\\b)"+
  "|(\\bout of town\\b|\\boutside the town\\b|\\bon the edge of town\\b)"+
  "|(\\bmiles (?:away|off)\\b|\\ba long way (?:away|off)\\b|\\bfar away\\b)","g");
function distancesIn(low){
  var out=[], m; DIST_ALL.lastIndex=0;
  while((m=DIST_ALL.exec(low))){
    var d=distanceIn(m[0]);
    if(d) out.push({at:m.index,end:m.index+m[0].length,d:d});
    if(DIST_ALL.lastIndex===m.index) DIST_ALL.lastIndex++;
  }
  return out;
}
/* a distance belongs to the thing it describes: the one just after it, else the one just before */
function shareDistances(spans,nouns,low){
  var map={};
  spans.forEach(function(sp){
    /* "two blocks away stood a church" — what stands there comes next.
       "a church two blocks away" — it belongs to what was just named. */
    var after=(low||"").slice(sp.end,sp.end+14);
    var pointsForward=/^\s*(stood|stands|sat|sits|was|were|there|lay|lies|rose|is|are|i (saw|found))/.test(after);
    var best=null, bd=1e9;
    nouns.forEach(function(n){
      var forward=n.at>=sp.end;
      var gap=forward?(n.at-sp.end):(sp.at-n.at);
      if(gap<0) return;
      if(pointsForward&&!forward) return;
      var limit=forward?70:40;
      var score=gap+(forward===pointsForward?0:25);
      if(gap<limit&&score<bd){ bd=score; best=n; }
    });
    if(best&&map[best.at]===undefined) map[best.at]=sp.d;
  });
  return map;
}

/* a neighbourhood: a patch of blocks that keeps its own name */
function hoods(){ if(!store.hoods) store.hoods=[]; return store.hoods; }
var HOOD_NAME=["the Old Quarter","Northgate","the Hollows","Kiln End","Saltmarket","the Rookery","Greenside","Underhill",
  "Bellwater","the Shambles","Fairmount","the Warrens","Mill Row","Candlewick","the Terraces"];
function hoodAt(bx,bz){
  var H=hoods();
  for(var i=0;i<H.length;i++) if(Math.abs(H[i].bx-bx)<=1&&Math.abs(H[i].bz-bz)<=1) return H[i];
  var h={bx:bx,bz:bz,name:HOOD_NAME[H.length%HOOD_NAME.length],realm:store.here||0};
  H.push(h); if(typeof save==="function") save();
  return h;
}
function hoodName(x,z){
  var bx=Math.round(x/PITCH), bz=Math.round(z/PITCH);
  var H=hoods();
  for(var i=0;i<H.length;i++) if((H[i].realm||0)===(store.here||0)&&Math.abs(H[i].bx-bx)<=1&&Math.abs(H[i].bz-bz)<=1) return H[i].name;
  return null;
}

/* move the grid the right number of blocks before something is built there */
function stepAway(d){
  if(!d) return null;
  var g=store.grid, from={bx:g.bx,bz:g.bz,lot:g.lot};
  if(d.near||d.along||d.home){
    /* beside the last thing dreamt, not beside wherever the grid happens to sit */
    var last=store.lastId?specById(store.lastId):null;
    if(last&&(last.realm||0)===(store.here||0)&&last.bx!==undefined&&last.bx!==null){
      g.bx=last.bx; g.bz=last.bz;
      g.lot=(last.lot===undefined||last.lot===null)?0:((last.lot+1)%LOTS);
    }
    return from;
  }
  var n=d.blocks||1;
  if(d.far||d.edge){
    /* the far side of everything standing */
    var minx=1e9,maxx=-1e9,minz=1e9,maxz=-1e9,any=false;
    store.objects.forEach(function(o){
      if(o.filler||(o.realm||0)!==(store.here||0)) return;
      var d2=KIT[o.archetype]; if(!d2||d2.cat!=="structure") return;
      any=true; minx=Math.min(minx,o.x); maxx=Math.max(maxx,o.x); minz=Math.min(minz,o.z); maxz=Math.max(maxz,o.z);
    });
    if(any){
      var cx=Math.round(((minx+maxx)/2)/PITCH), cz=Math.round(((minz+maxz)/2)/PITCH);
      var away=Math.max(n,Math.ceil(Math.max(maxx-minx,maxz-minz)/PITCH));
      var a=(hash(String(store.objects.length))%4);
      g.bx=cx+(a===0?away:a===1?-away:0); g.bz=cz+(a===2?away:a===3?-away:0);
    } else { g.bx+=n; }
  } else if(d.corner){
    g.bx+=(Math.random()<0.5?1:-1);
  } else {
    /* straight out: the way you are already facing, if you are walking */
    var dir=(typeof walkMode!=="undefined"&&walkMode)?yaw:(hash(String(g.bx+g.bz))%4)*Math.PI/2;
    var dx=Math.round(-Math.sin(dir)), dz=Math.round(-Math.cos(dir));
    if(!dx&&!dz) dz=-1;
    g.bx+=dx*n; g.bz+=dz*n;
  }
  g.lot=0;
  if(d.hood||d.far||d.edge||(d.blocks||0)>=2) hoodAt(g.bx,g.bz);
  return from;
}
function stepBack(from){ if(from){ store.grid.bx=from.bx; store.grid.bz=from.bz; } }

