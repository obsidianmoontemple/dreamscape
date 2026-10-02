/* SomnuMatrix — realm-words.js
   people don't cross over in the app's words. they write "I ended up in a forest
   that wasn't a forest", "the lift went down too far", "we came out under the sea".
   this widens what counts as a crossing, adds a plain fallback for "somewhere
   else", and — when a dream comes close without crossing — says so, instead of
   leaving the dreamer to guess.
   loaded as a plain script; shares scope with the other files */
"use strict";

var MORE_REALM_WORDS={
  templerow:["temple row","the temple row","the row of temples","the street of the gods","the north pole"],
  hall:["the hall of doors","the great hall of doors","the hall of all doors","the door hall"],
  somnucor:["somnucor","the hall of doors","the hall of mirrors and doors","the great hall of doors","the hub",
    "the place all the doors open from","the meeting hall of the worlds"],
  underworld:["underworld","the underworld","the land of the dead","land of the dead","the lower world","the world below",
    "the world beneath","down among the dead","the kingdom of the dead","into hell","the inferno","the abyss below",
    "the dark below","beneath the earth","under the earth","the deep places","the halls below","the dead lands","perdition",
    "the shades","the caverns of the dead","the place of the dead","the realm below"],
  heavens:["the heavens","into heaven","the upper world","the world above","the sky country","the country above",
    "above the clouds","beyond the clouds","the shining place","the halls of light","the high places","paradise",
    "the golden country","the realm above","up among the clouds","the courts of heaven"],
  faerie:["faerie","fairyland","fairy land","the fairy world","the otherworld","the other world","the hidden country",
    "the green world","the land of the fae","the fae lands","elfland","the enchanted wood","the wild wood",
    "a forest that was not a forest","the greenwood","under the hill","the hollow hills","the perilous realm"],
  depths:["the deep","under the sea","beneath the sea","under the water","beneath the water","under the ocean",
    "the ocean floor","the sea floor","the drowned world","the water world","below the waves","the sunken world",
    "down in the water","the deep places of the sea","the kingdom of the sea"],
  dead:["the realm of the dead","the grey country","the quiet lands","the still lands","the country of ghosts",
    "the land of ghosts","where the dead go","the resting lands","the long grey fields"],
  frozen:["the frozen lands","the frozen world","the land of ice","a world of ice","the white lands","the ice country",
    "the winter lands","the frozen waste","the endless winter","a place of snow and ice"],
  void:["the void","the nothing","the empty place","the emptiness","the dark between","the space between",
    "the place with nothing in it","the black nowhere","the gap between worlds","nowhere at all"],
  mirror:["the mirror world","the other side of the mirror","behind the mirror","through the looking glass",
    "the looking-glass world","the reflected world","the world in the mirror","the reversed world"],
  fire:["the world of fire","a world of fire","the land of fire","the burning world","the fire lands","the world on fire",
    "the place of flames","the furnace world"],
  stars:["among the stars","out among the stars","into the sky and beyond","beyond the sky","out in space","in space",
    "the black between stars","the star fields","up among the planets","off the world"],
  wasteland:["the ruined world","the dead world","the world after","after everything ended","the world that ended",
    "the burnt world","the poisoned lands","the broken world"],
  desert:["a world of sand","the sand sea","endless sand","the great desert","a land of dunes","nothing but sand"],
  station:["up on the station","the ring station","the orbital station","above the world","out in orbit"],
  future:["a city that hadn't been built yet","a city of the future","years from now","the coming world",
    "a world of neon","the city of lights and rain"],
  elsewhere:["another world","a different world","some other world","a world that wasn't ours","a place that wasn't here",
    "somewhere else entirely","a strange country","an unfamiliar world","a world i had never seen","the other place",
    "a place unlike anywhere","another place entirely","a world not my own"]
};

/* the plainest way anybody says it: a verb of going, then somewhere that isn't here */
var CROSS_VERB="(stepped|walked|went|came|fell|crossed|passed|slipped|drifted|climbed|swam|flew|sank|rose|was pulled|was taken|was carried|found myself|ended up|arrived|emerged|woke up|opened onto|led me|took me|brought me)";
var CROSS_FALLBACK=new RegExp("\\b"+CROSS_VERB+"\\b[^.]{0,40}\\b(into|through|in|to|out into|down into|up into|onto)\\b[^.]{0,40}\\b(another world|a different world|somewhere else|another place|the other side|elsewhere|a new world|a strange place|a place i did not know|a place i didn't know)\\b");
/* a word that means a world, even when the sentence isn't shaped as a crossing */
var REALM_NEAR=[["underworld",/\b(underworld|land of the dead|hell)\b/],["heavens",/\b(heaven|the heavens|paradise)\b/],
  ["faerie",/\b(faerie|fairyland|the otherworld|elfland)\b/],["depths",/\b(under the sea|the deep|ocean floor)\b/],
  ["frozen",/\b(frozen world|land of ice|winter lands)\b/],["void",/\b(the void|the emptiness)\b/],
  ["mirror",/\b(mirror world|looking glass)\b/],["fire",/\b(world of fire|burning world)\b/],
  ["stars",/\b(outer space|among the stars|in orbit)\b/],["wasteland",/\b(wasteland|ruined world)\b/],
  ["desert",/\b(endless desert|sea of sand)\b/],["station",/\b(space station|the orbital)\b/],
  ["future",/\b(the future|neon city)\b/],["elsewhere",/\b(another world|somewhere else)\b/]];

function widenRealmWords(){
  if(typeof REALM_WORDS==="undefined") return;
  var have={};
  REALM_WORDS.forEach(function(p){ p[1].forEach(function(w){ have[w]=1; }); });
  REALM_WORDS.forEach(function(p){
    var add=MORE_REALM_WORDS[p[0]]; if(!add) return;
    add.forEach(function(w){ if(!have[w]){ have[w]=1; p[1].push(w); } });
  });
  Object.keys(MORE_REALM_WORDS).forEach(function(k){
    if(REALM_WORDS.some(function(p){ return p[0]===k; })) return;
    REALM_WORDS.push([k,MORE_REALM_WORDS[k].slice()]);
  });
}

/* said plainly, when a dream came close but didn't cross */
function crossingHint(low){
  for(var i=0;i<REALM_NEAR.length;i++){
    if(REALM_NEAR[i][1].test(low)){
      var name=(REALMS[REALM_NEAR[i][0]]||{}).name||"another world";
      return "You spoke of "+name+" but not of going there. Say how you got in \u2014 <i>\u201cI went down into it\u201d, \u201cI stepped through\u201d, \u201cI found myself there\u201d</i> \u2014 or use <b>Cross into\u2026</b> in The land.";
    }
  }
  return null;
}

/* widen them as soon as this file is read: the realms are already known by now */
if(typeof REALM_WORDS!=="undefined") widenRealmWords();

/* a bare name of a world only counts with a verb of going near it: "faerie" on its
   own is a thought, "I stepped into faerie" is a crossing */
var BARE_REALM=/^(faerie|fairyland|fairy land|the underworld|underworld|the heavens|the void|the deep|the future|elfland|paradise|in space|the otherworld|the other world|the abyss below|the nothing|the emptiness)$/;
var CROSS_NEAR=new RegExp("\\b"+CROSS_VERB+"\\b[^.]{0,30}$|\\b(into|through|down into|up into|out into|inside|beyond|across into)\\s*$");
function crossingMeant(low,at,word){
  if(!BARE_REALM.test(word)) return true;
  return CROSS_NEAR.test(low.slice(Math.max(0,at-46),at+1));
}

