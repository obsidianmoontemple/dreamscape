/* SomnuMatrix — somnucor-city.js
   Somnucor: the city at the middle of the world map. Built as places rather than
   scatter — buildings front onto streets and squares, decoration stands where
   somebody would have put it (lanterns over the market lane, stalls along the
   kerb, benches by the fountain), and the four seasons are gardens you walk into.
   The Hall of Doors is not here: the Gate Plaza at the heart opens onto it.
   loaded as a plain script; shares scope with the other files */
"use strict";

var CITY_IN=210, CITY_OUT=980, CITY_BUILD=4;   /* raise this and every dreamer's city is rebuilt */
var _cs=7761109;
function cityRand(){ _cs=(_cs*1664525+1013904223)%4294967296; return _cs/4294967296; }
function jit(n){ return (cityRand()-0.5)*n; }

/* CITY_OUT used to be a number picked once and never revisited, and every
   district's placement was hand-set against it — which is exactly how
   Temple Row and the Employee District ended up drifting past it unseen.
   it is recomputed here instead, from the city's own static lists: the
   farthest ring any QUARTERS or NEIGHBOURHOODS entry actually stands at,
   and how far out the Employee District's own block reaches given how
   many plots it currently holds. add a new quarter, a new neighbourhood,
   or grow the District past sixty-odd homes, and this number moves with
   it — nobody has to remember to bump a constant by hand again.
   this only ever reads STATIC data (array lengths, fixed KIT sizes) —
   never cityRand() or anything seeded — so it comes out bit-for-bit the
   same for every dreamer, exactly like the rest of this deterministic
   build. */
function cityOutward(){
  var far=0;
  if(typeof QUARTERS!=="undefined") QUARTERS.forEach(function(q){ if(q.r>far) far=q.r; });
  if(typeof NEIGHBOURHOODS!=="undefined") NEIGHBOURHOODS.forEach(function(n){ if(n.r>far) far=n.r; });
  if(typeof districtReach==="function"){ var dr=districtReach(); if(dr>far) far=dr; }
  return far>0?Math.round(far+190):980;   // the same margin the ring has always kept past its farthest quarter
}

var QUARTERS=[
 {name:"The Old Quarter", at:0.00, r:300, kind:"street", len:200, lane:26, ground:"lawn",
  sign:"Where the city began. Ordinary houses, and the people who keep them.",
  left:["cottage","house","cottage","house","shop","cottage"],
  right:["house","cottage","house","manor","cottage","house"],
  front:["fence","hedge","flowers","bench","streetlight"], extras:["well","fountain","tree","tree","cat","dog"]},
 /* "Temple Row" itself is not a generic facade street any more — it is the
    real, 275-house district temple-row.js builds, standing at exactly this
    bearing and ring (at:0.70, r:360) and running on outward from here. See
    buildTempleRow() in temple-row.js, called right after this city is. */
 {name:"The Bazaar", at:1.45, r:300, kind:"street", len:170, lane:18, ground:"groundpad",
  sign:"Everything that can be carried, and a good deal that cannot.",
  left:["shop","shop","shop","marketawning"], right:["shop","marketawning","shop","shop"],
  front:["marketstall","crates","barrel","streetlight"],
  extras:["tiledfountain","papelpicado","crowd","human","human","bicycle"], over:["redlanterns","stringlights"]},
 {name:"The Wynd", at:2.15, r:330, kind:"street", len:150, lane:14, ground:"groundpad",
  sign:"Witches, workings, and the shops that supply them. Mind the circles.",
  left:["cottage","tower","shop"], right:["cottage","cottage","tower"],
  front:["cauldron","crystal","runestone","streetlight"],
  extras:["summoning","sigil","standingstones","witch","wizard","wisps"], over:["stringlights"]},
 {name:"Cogsfall", at:2.95, r:390, kind:"yard", size:200, ground:"groundpad",
  sign:"The works. Mills, engines, and the din of things being made.",
  big:["factory","warehouse","warehouse","windmill","watertower"],
  against:["crates","barrel","scrapheap","brazier"], extras:["truck","truck","car","garage","pylon","human","human"]},
 {name:"The Harbour", at:3.70, r:430, kind:"yard", size:230, ground:"groundpad",
  sign:"Where the water comes into the city, and what comes in on it.",
  big:["lighthouse","warehouse","pier","pier"],
  against:["crates","barrel","streetlight"], extras:["ship","ship","boat","fishingboat","soulferry","gull","gull","reeds","human"]},
 {name:"The Rim", at:4.45, r:500, kind:"square", size:240, ground:"groundpad",
  sign:"The far quarter: steel, light, and doors that are not doors.",
  around:["spaceport","hangar","reactor","biodome","researchlab","controltower"], middle:"stargate",
  around2:["habitat","habitat","skyscraper","skyscraper"],
  front:["landinglights","forcefield","holosign","satdish"],
  extras:["shuttle","saucer","hovercar","rover","mech","robot","android","spacewalker"]},
 {name:"The Yards", at:5.25, r:340, kind:"yard", size:160, ground:"groundpad",
  sign:"Everything the city travels by, and some of it should not work at all.",
  big:["stable","garage","station"], against:["barrel","crates","haybale","streetlight"],
  extras:["hotairballoon","flyingcarpet","broomstick","teleportpad","sleigh","firechariot","horse","horse","bus","bicycle"]},
 {name:"The New Quarter", at:5.85, r:540, kind:"square", size:230, ground:"groundpad",
  sign:"The city as it will be. Or as somebody dreamt it might.",
  around:["skyscraper","skyscraper","apartment","hotel","bank","courthouse"], middle:"fountain",
  around2:["library","school","hospital","museum"],
  front:["bench","streetlight","trafficlight","busstop"], extras:["car","car","bus","crowd","human","human","billboard"]},
 {name:"The Menagerie", at:1.05, r:580, kind:"garden", size:270, ground:"lawn",
  sign:"Kept, not caged. Some of them were dreamt only once.",
  planting:["tree","tree","tree","giantmushroom","hollowtree","reeds"],
  pieces:["pond","fairyring","fence","fence"],
  life:["unicorn","griffin","phoenix","kitsune","pegasus","centaur","bear","stag","owl","butterflies"]},
 {name:"The Long Fields", at:4.05, r:660, kind:"garden", size:310, ground:"lawn",
  sign:"Farms, barns and the road out. The city has to eat.",
  planting:["tree","tree","hedge","hedge"],
  pieces:["farmhouse","barn","silo","stable","tractor","haybale","haybale","scarecrow","fence","fence","pond","windmill"],
  life:["cow","cow","sheep","sheep","sheep","chicken","chicken","pig","goat","horse","human"]},
 {name:"Lantern Street", at:0.35, r:430, kind:"street", len:190, lane:16, ground:"groundpad",
  sign:"Paper lanterns from end to end, and a gate at either end of it.",
  left:["machiya","machiya","shop","pagoda"], right:["hanok","machiya","shop","teahouse"],
  front:["redlanterns","marketstall","bonsai","streetlight"],
  extras:["torii","paifang","koipond","zengarden","incenseburner","windchimes"], over:["redlanterns","stringlights"]},
 {name:"The Riad Quarter", at:1.80, r:400, kind:"street", len:170, lane:12, ground:"groundpad",
  sign:"Blank walls to the street, and gardens behind every one of them.",
  left:["riad","riad","shop"], right:["riad","hacienda","shop"],
  front:["tiledfountain","marketawning","streetlight"],
  extras:["eidlanterns","marketstall","palm","palm","crates","human"], over:["stringlights"]},
 {name:"The Terraces", at:5.60, r:410, kind:"street", len:210, lane:20, ground:"groundpad",
  sign:"Where most of the city actually lives. Flats stacked six deep.",
  left:["apartment","apartment","apartment","shop"], right:["apartment","apartment","tenementblock","shop"],
  front:["fence","bench","streetlight","trashcan"],
  extras:["playground","busstop","bicycle","car","crowd","human","child","child"], over:["stringlights"]},
 {name:"The Warrens", at:3.30, r:330, kind:"yard", size:170, ground:null,
  sign:"The slums. Corrugated roofs, a standpipe, and everything mended twice.",
  big:["shanty","shanty","shanty","shanty"],
  against:["barrel","crates","firebarrel","scrapheap"],
  extras:["shanty","shanty","well","washing","dog","dog","child","child","human","human","haybale"]},
 {name:"The Docks", at:4.30, r:560, kind:"yard", size:250, ground:"groundpad",
  sign:"Cranes, sheds and a tide. Everything the city imports comes over this stone.",
  big:["warehouse","warehouse","warehouse","hangar"],
  against:["crates","crates","barrel","pylon"],
  extras:["ship","fishingboat","pier","crane","truck","truck","gull","gull","human","human","lighthouse"]},
 {name:"Kiln End", at:2.35, r:470, kind:"yard", size:180, ground:"groundpad",
  sign:"Brickworks and bottle kilns. The smoke never quite clears.",
  big:["factory","kiln","warehouse","windmill"],
  against:["crates","barrel","brazier","scrapheap"],
  extras:["truck","cart","haybale","pylon","human","human","shed","shed"]},
 {name:"The Strange Edge", at:2.55, r:790, kind:"garden", size:310, ground:null,
  sign:"Where the city stops agreeing with itself. Go carefully.",
  planting:["deadtree","deadtree","giantmushroom"],
  pieces:["floatingisland","floatingisland","impossiblestair","monolith","mirrormaze","whirlpool","waterfall","rift","portal","voidshards","shardfield","moonpool"],
  life:["wisps","wisps","ghost"]}
];

var SEASON_GARDENS=[
 {name:"Winter", ground:"snowfield", pieces:["yuletree","yulelog","snowman","giftpile","imbolccandles","menorah","wreath"],
  planting:["pine","pine","deadtree"], line:"Midwinter, and it stays midwinter here."},
 {name:"Spring", ground:"blossomground", pieces:["ostaraeggs","maypoleribbons","beltanefire","hearts","pergola"],
  planting:["tree","tree","flowers","flowers"], line:"The eggs are painted and the fire is lit."},
 {name:"Summer", ground:"lawn", pieces:["lithawheel","stringlights","koipond","zengarden","tiledfountain"],
  planting:["tree","flowers","flowers","bonsai"], line:"The longest day, held."},
 {name:"Autumn", ground:"leaffall", pieces:["mabontable","lughcorn","harvestsheaf","samhainlanterns","ofrenda","diyas"],
  planting:["tree","tree","haybale"], line:"The harvest in, and the dead remembered."}
];

/* an older Somnucor is taken down and built again, so nobody is left walking
   through a city from a previous build */
function razeSomnucor(){
  var r=somnucorRealm(); if(!r) return;
  for(var i=store.objects.length-1;i>=0;i--){
    var o=store.objects[i];
    if((o.realm||0)!==r.id) continue;
    if(typeof meshes!=="undefined"&&meshes[o.id]){ scene.remove(meshes[o.id]); delete meshes[o.id]; }
    o._gone=true;
    store.objects.splice(i,1);
  }
  if(typeof atlMeshQueue!=="undefined") atlMeshQueue.length=0;
  for(var c=store.characters.length-1;c>=0;c--){
    var ch=store.characters[c];
    if(ch.objId&&!specById(ch.objId)) store.characters.splice(c,1);
  }
  var R=realms(), k=R.indexOf(r); if(k>-1) R.splice(k,1);
  if(store.here===r.id) store.here=0;
}
/* buildSomnucorCity() now lives in atlantis-city.js, which stands the whole ringed city up in one piece */

/* ---------------------------------------------------------------- the heart */
/* Somnucor Tower: the company's own building, and the only one in the city with
   a floor you cannot simply walk into. */
S("somnucortower","structure",[40,210,40],[
  {g:"box",s:[38,6,38],p:[0,3,0],c:0x2A3040},
  {g:"box",s:[30,150,30],p:[0,78,0],c:0x3A4458},
  {g:"box",s:[30.4,2,30.4],p:[0,26,0],c:0x4AE8FF,glow:1,pulse:1},
  {g:"box",s:[30.4,2,30.4],p:[0,62,0],c:0x4AE8FF,glow:1,pulse:1},
  {g:"box",s:[30.4,2,30.4],p:[0,98,0],c:0x4AE8FF,glow:1,pulse:1},
  {g:"box",s:[30.4,2,30.4],p:[0,134,0],c:0x4AE8FF,glow:1,pulse:1},
  {g:"box",s:[26,1.4,.4],p:[0,20,15.3],c:0x9FD8FF,glow:1,opa:.8},
  {g:"box",s:[24,146,.5],p:[0,80,15.3],c:0x6AB8E8,opa:.45},
  {g:"box",s:[24,146,.5],p:[0,80,-15.3],c:0x6AB8E8,opa:.45},
  {g:"box",s:[.5,146,24],p:[15.3,80,0],c:0x6AB8E8,opa:.45},
  {g:"box",s:[.5,146,24],p:[-15.3,80,0],c:0x6AB8E8,opa:.45},
  {g:"box",s:[36,10,36],p:[0,158,0],c:0x2E3648},
  {g:"box",s:[34,1.6,34],p:[0,163.4,0],c:0xC050FF,glow:1,pulse:1},
  {g:"cyl",s:[13,15,14,8],p:[0,170,0],c:0x3A4458},
  {g:"tor",s:[17,.8],p:[0,170,0],r:[Math.PI/2,0,0],c:0x4AE8FF,glow:1,pulse:1},
  {g:"tor",s:[20,.5],p:[0,176,0],r:[Math.PI/2,.2,0],c:0xC050FF,glow:1,pulse:1},
  {g:"cyl",s:[2,2,14,8],p:[0,184,0],c:0x2E3648},
  {g:"sph",s:[3.4],p:[0,192,0],c:0x6AF0C4,glow:1,pulse:1},
  {g:"box",s:[8,14,1],p:[0,7,19],c:0x1A2028},
  {g:"box",s:[7,1.2,.3],p:[0,15,19.4],c:0x4AE8FF,glow:1,pulse:1}
],["somnucor tower","the tower","somnucor","the company tower","the glass tower at the middle"]);
EFFECTS.somnucortower=function(g){
  return function(t){
    g.children.forEach(function(m,i){
      if(!m.material||!m.material.emissive) return;
      if(m.geometry&&m.geometry.type==="TorusGeometry") m.rotation.z=t*(i%2?0.25:-0.18);
    });
  };
};

