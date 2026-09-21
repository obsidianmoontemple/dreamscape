/* Dream Walker's Atlas — dreamer.js
   the dreamer, their abilities, and passages between places
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   6e. THE DREAMER — what you are, and what you can do in there
   ============================================================ */
function dreamer(){
  if(!store.dreamer) store.dreamer={name:"",about:"",practice:"",notes:"",abilities:[]};
  if(!store.dreamer.abilities) store.dreamer.abilities=[];
  return store.dreamer;
}

/* powers are recorded the way everything else is: only if the dream said so */
var ABILITY=[
["flying",["i flew","i was flying","i could fly","i lifted off","i rose into the air"]],
["floating",["i floated","floating above","i hovered","i was hovering"]],
["passing through walls",["through the wall","through solid","i passed through","walked through walls"]],
["breathing underwater",["breathe underwater","breathing underwater","i could breathe under"]],
["becoming unseen",["i was invisible","became invisible","i could not be seen"]],
["changing shape",["i changed shape","shapeshift","i took the form"]],
["summoning",["i summoned","i conjured","i called forth"]],
["stopping time",["time stopped","i stopped time","everything froze"]],
["moving without walking",["teleport","i blinked to","i was suddenly in","i appeared in"]],
["changing size",["i grew huge","i shrank","i became small","i was enormous"]],
["speaking with the dead",["spoke with the dead","the dead spoke","i heard the dead"]],
["knowing it was a dream",["i knew i was dreaming","i realised i was dreaming","i realized i was dreaming"]],
["changing the dream",["i willed it","i remade","i rewrote it","i made it become"]],
["seeing what was hidden",["i could see through","i saw what was hidden","the true shape"]],
["walking on water",["walked on the water","i walked on water"]],
["healing",["i healed","i mended","the wound closed"]]
];

function scanAbilities(text){
  if(!text) return 0;
  var low=" "+String(text).toLowerCase().replace(/\s+/g," ")+" ";
  var d=dreamer(), found=0;
  ABILITY.forEach(function(pair){
    for(var i=0;i<pair[1].length;i++){
      if(low.indexOf(pair[1][i])>-1){
        var have=null;
        d.abilities.forEach(function(a){ if(a.name===pair[0]) have=a; });
        if(have){ if(have.nights.indexOf(store.session)===-1) have.nights.push(store.session); }
        else { d.abilities.push({name:pair[0],nights:[store.session],src:"stated"}); found++; }
        return;
      }
    }
  });
  return found;
}
function hasAbility(name){
  var d=dreamer();
  for(var i=0;i<d.abilities.length;i++) if(d.abilities[i].name===name) return true;
  return false;
}

/* ============================================================
   6f. PASSAGES — how one place reaches another, including the
       ways that should not be possible
   ============================================================ */
var LINKWORD=[
[/\bcame\s+out\s+(?:in|at|into)\b/,"portal"],
[/\btook\s+me\s+(?:to|into)\b/,"portal"],
[/\bstepped\s+through\s+(?:it\s+)?(?:in)?to\b/,"portal"],
[/\bon\s+the\s+other\s+side\b/,"portal"],
[/\b(?:behind|beneath|under)\s+(?:it|the\s+\w+)\s+(?:was|lay|i\s+found)\b/,"secret"],
[/\b(?:a\s+)?(?:secret|hidden|concealed)\s+(?:door|passage|way|stair)\b/,"secret"],
[/\bclimbed\s+(?:up|down)\s+(?:in)?to\b/,"stairs"],
[/\bfell\s+(?:in)?to\b/,"fall"],
[/\b(?:led|leads|opened|opens)\s+(?:through\s+)?(?:on)?to\b/,"door"]
];

function linkIn(text){
  if(!text) return null;
  var low=" "+String(text).toLowerCase()+" ";
  for(var i=0;i<LINKWORD.length;i++) if(LINKWORD[i][0].test(low)) return LINKWORD[i][1];
  return null;
}

function addPassage(fromId,toId,kind,hidden){
  if(!fromId||!toId||fromId===toId) return null;
  if(!store.passages) store.passages=[];
  for(var i=0;i<store.passages.length;i++){
    var p=store.passages[i];
    if((p.from===fromId&&p.to===toId)||(p.from===toId&&p.to===fromId)) return p;
  }
  var pg={id:uid(),from:fromId,to:toId,kind:kind||"door",hidden:!!hidden,found:!hidden};
  store.passages.push(pg);
  return pg;
}

/* a portal or secret way carries you across the map when you step into it */
function passageAt(x,z,r){
  if(!store.passages) return null;
  for(var i=0;i<store.passages.length;i++){
    var p=store.passages[i];
    if(p.kind!=="portal"&&p.kind!=="secret") continue;
    if(!p.found) continue;
    var a=specById(p.from), b=specById(p.to);
    if(!a||!b) continue;
    if((a.x-x)*(a.x-x)+(a.z-z)*(a.z-z)<r*r) return {at:a,to:b,p:p};
    if((b.x-x)*(b.x-x)+(b.z-z)*(b.z-z)<r*r) return {at:b,to:a,p:p};
  }
  return null;
}

