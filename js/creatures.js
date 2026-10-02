/* SomnuMatrix — creatures.js
   the bestiary: folk of other realms, beasts real and mythical, sea creatures,
   serpents, flyers, crawlers, swarms, and the things that come at night.
   each has its own form. night:1 marks the ones a nightmare can be made of.
   loaded as a plain script; shares scope with the other files */
"use strict";

/* C(key, words, kind, options)
   kind: folk (a body like ours, changed) | beast (four-footed) | serpent | swim |
         float | tentacle | crawl | flyer | swarm
   options: s size, col colour, skin, top, hat, feats [..], big (stands out in open
   land), night (can be a nightmare), roam (wanders), speaks (default for folk) */
var CREATURE={};
function C(key,words,kind,o){
  o=o||{}; o.kind=kind; o.key=key; o.feats=o.feats||[]; CREATURE[key]=o;
  var sz=o.big?[20*(o.s||1),10*(o.s||1),20*(o.s||1)]:kind==="folk"?[1,1.8*(o.s||1),1]:[2*(o.s||1),1.6*(o.s||1),3*(o.s||1)];
  A(key,"being",sz,[{g:"sph",s:[.4],p:[0,.6,0],c:o.col||0x7A7064}],{big:!!o.big});
  MORE_VOCAB[key]=words;
  if(kind==="folk") PEOPLE[key]=1;
}
function sc(obj,v){ obj.scale.set(v,v,v); }
function hasFeat(o,f){ return o.feats.indexOf(f)>-1; }

/* ---- folk of the other realms ---- */
C("fairy",["fairy","fairies","faery","the fae","fair folk","fair one"],"folk",{s:.34,feats:["wings:fairy","glow","hover","ears"],top:0x9AD0B8,realm:"faerie"});
C("pixie",["pixie","pixies","sprite","sprites"],"folk",{s:.26,feats:["wings:fairy","glow","hover","ears"],top:0xC8A0E0,realm:"faerie"});
C("elf",["elf","elves","elven","elvish"],"folk",{s:1.06,feats:["ears","thin"],top:0x3F7A3A,realm:"faerie"});
C("dwarf",["dwarf","dwarves","dwarfs"],"folk",{s:.66,feats:["beard","wide","held:axe"],top:0x8A4A2A,sex:"m"});
C("gnome",["gnome","gnomes"],"folk",{s:.42,feats:["beard","hat:pointed:0xA8322B"],top:0x2F5E9E,sex:"m",realm:"faerie"});
C("goblin",["goblin","goblins","hobgoblin","boggart"],"folk",{s:.6,skin:0x6A8A3A,feats:["ears","hunched"],top:0x5A4A32,night:1,realm:"faerie"});
C("troll",["troll","trolls"],"folk",{s:1.7,skin:0x6A7A68,feats:["hunched","wide","held:club","ears"],top:0x5A4A32,night:1});
C("ogre",["ogre","ogres"],"folk",{s:1.9,skin:0x8A9A5A,feats:["wide","held:club"],top:0x6B4A32,night:1});
C("giant",["a giant","the giant","giants","great giant"],"folk",{s:5,big:1,feats:["wide","beard"],top:0x6B4A32,night:1});
C("frostgiant",["frost giant","ice giant","jotun","frost giants"],"folk",{s:5,big:1,skin:0xA8C8E0,feats:["wide","beard","held:club","aura:stars"],top:0xE8F0F8,realm:"frozen",night:1});
C("witch",["witch","witches","hag","crone","sorceress"],"folk",{feats:["hat:witch","held:staff"],top:0x1B1C20,sex:"f",night:1});
C("wizard",["wizard","wizards","sorcerer","mage","warlock","magician","enchanter"],"folk",{feats:["hat:pointed:0x2F5E9E","beard","held:staff","orb"],top:0x2F5E9E,sex:"m"});
C("knight",["knight","knights","paladin"],"folk",{feats:["armor","helm","held:sword","held:shield"]});
C("vampire",["vampire","vampires","nosferatu"],"folk",{skin:0xDCD6D2,feats:["cape","fangs"],top:0x1B1C20,night:1});
C("werewolf",["werewolf","werewolves","wolfman","lycan","lycanthrope"],"folk",{s:1.2,skin:0x5A4A3A,feats:["head:wolf","hunched","claws"],top:0x5A4A3A,night:1});
C("zombie",["zombie","zombies","ghoul","ghouls","undead","walking dead"],"folk",{skin:0x7A8A6A,feats:["reach","hunched"],top:0x5A5448,night:1});
C("skeleton",["skeleton","skeletons","skeletal"],"folk",{skin:0xE6DCC2,feats:["bones","thin"],top:0xE6DCC2,night:1});
C("mummy",["mummies","a mummy","the mummy","egyptian mummy"],"folk",{skin:0xD8CCAE,feats:["wrapped","reach"],top:0xD8CCAE,night:1});
C("ghost",["ghost","ghosts","phantom","phantoms","apparition","poltergeist","a spirit","the spirit","spirits"],"float",{col:0xE8EEF4,feats:["see-through"],night:1});
C("wraith",["wraith","wraiths","spectre","specter","revenant"],"float",{col:0x2A2E38,feats:["see-through","dark"],night:1});
C("banshee",["banshee","banshees","keening woman"],"float",{col:0xDCE4F0,feats:["see-through","hair"],night:1});
C("angel",["angel","angels","seraph","seraphim","cherub","archangel"],"folk",{s:1.15,feats:["wings:feather:0xF2EEE6","glow","halo"],top:0xF2EEE6,realm:"heavens"});
C("demon",["demon","demons","devil","devils","fiend","fiends"],"folk",{s:1.25,skin:0xA8322B,feats:["horns","wings:bat","tail:devil","claws"],top:0x1B1C20,night:1,realm:"underworld"});
C("imp",["imp","imps"],"folk",{s:.5,skin:0xB0503A,feats:["horns","wings:bat","tail:devil","ears"],top:0x2A1E1C,night:1,realm:"underworld"});
C("mermaid",["mermaid","mermaids"],"folk",{sex:"f",feats:["fishtail:0x2F7A7A","hover"],realm:"depths"});
C("merman",["merman","mermen","merfolk","merrow","triton","mer people","merpeople"],"folk",{sex:"m",feats:["fishtail:0x2F5E9E","hover","held:trident"],realm:"depths"});
C("siren",["sea siren","sirens sang","siren song","sirens of the sea"],"folk",{sex:"f",feats:["fishtail:0x5E3A7E","hover","glow"],night:1,realm:"depths"});
C("selkie",["selkie","selkies","seal woman","seal folk"],"folk",{skin:0xB0A89A,feats:["cape"],top:0x6E6A66,realm:"depths"});
C("nymph",["nymph","nymphs","naiad","naiads","dryad","dryads","oread"],"folk",{feats:["glow","ears"],top:0x6AA86A,sex:"f",realm:"faerie"});
C("satyr",["satyr","satyrs","faun","fauns"],"folk",{feats:["horns","goatlegs","held:flute"],sex:"m",realm:"faerie"});
C("centaur",["centaur","centaurs"],"folk",{feats:["horsebody","held:bow"],realm:"faerie"});
C("minotaur",["minotaur","bull-headed man","bull headed man"],"folk",{s:1.45,feats:["head:bull","wide","held:axe"],top:0x5A3A22,night:1});
C("harpy",["harpy","harpies"],"folk",{feats:["wings:feather:0x6B4A32","claws","birdlegs"],top:0x6B4A32,sex:"f",night:1});
C("gorgon",["gorgon","gorgons","medusa"],"folk",{feats:["snakehair"],top:0x3F5A3A,sex:"f",night:1});
C("golem",["golem","golems","stone man","clay man","living statue"],"folk",{s:2.1,skin:0x8A8478,feats:["wide","blocky"],top:0x8A8478});
C("genie",["genie","djinn","jinn","djinni","jinni","ifrit"],"folk",{skin:0x4E7AB0,feats:["smoketail","hover","glow"],top:0xC7A043});
C("oni",["oni","ogre demon"],"folk",{s:1.6,skin:0x3E5EA8,feats:["horns","wide","held:club"],top:0xC7A043,night:1});
C("fireelemental",["fire elemental","fire spirit","being of fire","salamander"],"folk",{s:1.3,feats:["see-through:0xFF7A1E","aura:flames","glow"],realm:"fire"});
C("waterelemental",["water elemental","water spirit","being of water"],"folk",{s:1.3,feats:["see-through:0x4EA8D8","aura:water"],realm:"depths"});
C("earthelemental",["earth elemental","being of stone","rock creature"],"folk",{s:1.8,skin:0x6B5A48,feats:["wide","blocky"],top:0x6B5A48});
C("airelemental",["air elemental","wind spirit","being of air"],"float",{col:0xDCE8F0,feats:["see-through","aura:smoke"]});
C("faceless",["faceless man","faceless woman","faceless figure","faceless people","someone with no face","a man with no face","a woman with no face"],"folk",{feats:["faceless"],top:0x3A3C42,night:1});
C("tallman",["tall man","tall thin man","slender man","slenderman","the tall man"],"folk",{s:1.55,feats:["faceless","thin"],top:0x141418,night:1});
C("nighthag",["night hag","old hag","sleep paralysis demon","something on my chest","the hag"],"folk",{skin:0x6E6A66,feats:["hunched","claws","hair"],top:0x1B1C20,sex:"f",night:1});
C("boogeyman",["boogeyman","bogeyman","bogeymen","the thing under the bed","monster under the bed","thing in the closet"],"folk",{s:1.4,skin:0x1E1C22,feats:["hunched","claws","faceless","aura:darkaura"],top:0x1E1C22,night:1});
C("clown",["clown","clowns","jester"],"folk",{feats:["clown"],top:0xC0392B,night:1});

/* ---- beasts real and mythic ---- */
C("unicorn",["unicorn","unicorns"],"beast",{col:0xF2EEE6,head:"horse",feats:["horn","glow","mane:0xE8D8F0"],realm:"faerie",roam:1});
C("pegasus",["pegasus","winged horse","pegasi"],"beast",{col:0xF2EEE6,head:"horse",feats:["wings:0xF2EEE6","mane:0xE6E0D2"],realm:"heavens",roam:1});
C("nightmare",["nightmare horse","night mare","demon horse","black stallion"],"beast",{col:0x141418,head:"horse",feats:["eyes:red","aura:flames","mane:0x2A1410"],night:1,roam:1});
C("kelpie",["kelpie","kelpies","water horse"],"beast",{col:0x4E6A62,head:"horse",feats:["mane:0x2F5A3A","aura:water"],realm:"depths",night:1,roam:1});
C("griffin",["griffin","griffins","gryphon","griffon"],"beast",{col:0xB8883A,head:"eagle",s:1.4,feats:["wings:0x7A5A3A"],roam:1});
C("hippogriff",["hippogriff","hippogryph"],"beast",{col:0x8A6A4A,head:"eagle",s:1.3,feats:["wings:0x7A5A3A"],roam:1});
C("sphinx",["sphinx"],"beast",{col:0xC9A060,head:"human",s:2,feats:["headdress"]});
C("manticore",["manticore"],"beast",{col:0xA8583A,head:"lion",s:1.4,feats:["tail:scorpion","wings:0x6A2A22"],night:1,roam:1});
C("chimera",["chimera","chimaera"],"beast",{col:0xB8883A,head:"lion",s:1.4,feats:["tail:serpent","goathead"],night:1,roam:1});
C("cerberus",["cerberus","three-headed dog","three headed dog"],"beast",{col:0x1A1A1E,head:"dog",s:2.2,heads:3,feats:["eyes:red"],realm:"underworld",night:1});
C("hellhound",["hellhound","hell hound","hellhounds","barghest","black shuck","grim"],"beast",{col:0x141418,head:"dog",s:1.3,feats:["eyes:red","aura:flames"],night:1,roam:1});
C("fenrir",["fenrir","fenris","fenris wolf","giant wolf"],"beast",{col:0x5E5A58,head:"dog",s:4,big:1,feats:["eyes:gold"],night:1,roam:1});
C("kitsune",["kitsune","fox spirit","nine-tailed fox","nine tailed fox"],"beast",{col:0xE8E0D6,head:"fox",s:.8,tails:9,feats:["glow"],realm:"faerie",roam:1});
C("fox",["a fox","the fox","foxes","red fox"],"beast",{col:0xC8662A,head:"fox",s:.55,roam:1});
C("bear",["a bear","the bear","bears","grizzly","black bear","polar bear"],"beast",{col:0x5A3A22,head:"bear",s:1.5,roam:1,night:1});
C("lion",["lion","lions","lioness"],"beast",{col:0xC89A4A,head:"lion",s:1.2,roam:1});
C("tiger",["tiger","tigers","tigress"],"beast",{col:0xD8782A,head:"lion",s:1.2,feats:["stripes"],roam:1,night:1});
C("elephant",["elephant","elephants"],"beast",{col:0x8A8A8E,head:"elephant",s:2.6,roam:1});
C("mammoth",["mammoth","mammoths","woolly mammoth"],"beast",{col:0x6A4A32,head:"elephant",s:3,feats:["tusks"],realm:"frozen",roam:1});
C("boar",["boar","boars","wild boar","hog"],"beast",{col:0x4A3A30,head:"boar",s:.8,roam:1});
C("rabbit",["rabbit","rabbits","hare","hares","bunny"],"beast",{col:0xB0A08A,head:"rabbit",s:.25,roam:1});
C("rat",["rat","rats","mouse","mice","rodent"],"beast",{col:0x6E665E,head:"rat",s:.18,roam:1,night:1});
C("frog",["frog","frogs","toad","toads"],"beast",{col:0x4E7A3A,head:"frog",s:.2});
C("turtle",["turtle","turtles","tortoise","sea turtle"],"beast",{col:0x5A6A3A,head:"turtle",s:.7,feats:["shell"]});

/* ---- serpents: drawn by the dragon builder, without legs or wings ---- */
C("snake",["snake","snakes","viper","cobra","adder","rattlesnake"],"serpent",{icons:"color:green size:.14",night:1});
C("basilisk",["basilisk"],"serpent",{icons:"color:olive size:.6",night:1});
C("seaserpent",["sea serpent","sea monster","sea serpents"],"serpent",{icons:"color:teal size:3 sea",big:1,realm:"depths",night:1});
C("eel",["eel","eels","moray"],"serpent",{icons:"color:olive size:.12 sea",realm:"depths"});
C("giantworm",["giant worm","sandworm","great worm","sand worm"],"serpent",{icons:"color:bronze size:2.5 sea",big:1,night:1});

/* ---- the sea ---- */
C("fish",["fish","fishes","school of fish","shoal of fish","koi","goldfish"],"swim",{col:0xE8A04A,school:14,s:.3,realm:"depths"});
C("shark",["shark","sharks"],"swim",{col:0x6E7A86,fin:"shark",s:1.6,night:1,realm:"depths"});
C("whale",["whale","whales","blue whale","humpback"],"swim",{col:0x3A4A5A,fin:"whale",s:8,big:1,realm:"depths"});
C("dolphin",["dolphin","dolphins","porpoise"],"swim",{col:0x8A98A6,fin:"dolphin",s:1,realm:"depths"});
C("seahorse",["seahorse","seahorses","sea-horse"],"swim",{col:0xE8A04A,fin:"seahorse",s:.3,realm:"depths"});
C("jellyfish",["jellyfish","jellyfishes","jelly fish"],"float",{col:0xE8A0D8,feats:["see-through","jelly","glow"],realm:"depths"});
C("octopus",["octopus","octopuses","octopi","squid"],"tentacle",{col:0xA8583A,s:.5,realm:"depths"});
C("kraken",["kraken","giant squid","giant octopus"],"tentacle",{col:0x6A2A32,s:9,big:1,realm:"depths",night:1});
C("tentacles",["tentacles","tentacles rose","tentacle"],"tentacle",{col:0x3A2A3A,s:2,bare:1,night:1});

/* ---- flyers and crawlers ---- */
C("phoenix",["a phoenix","the phoenix","phoenixes","firebird"],"flyer",{col:0xE8561E,s:2.2,feats:["aura:flames","glow"],realm:"fire"});
C("roc",["roc","great bird","giant bird","thunder bird"],"flyer",{col:0x6B4A32,s:10,big:1});
C("spider",["spider","spiders","giant spider","tarantula"],"crawl",{col:0x1E1A1C,body:"spider",s:.5,night:1});
C("scorpion",["scorpion","scorpions"],"crawl",{col:0x3A2A1E,body:"scorpion",s:.5,night:1});
C("crab",["crab","crabs","lobster"],"crawl",{col:0xA8322B,body:"crab",s:.4,realm:"depths"});
C("floatingeye",["giant eye","floating eye","an eye in the sky","eyes in the dark","staring eye"],"float",{col:0xF2EEE6,feats:["eye"],night:1,realm:"void"});

/* ---- swarms ---- */
C("butterflies",["butterfly","butterflies"],"swarm",{col:[0xE8A04A,0x2F5E9E,0xE8E0D6,0xC0392B],n:14,s:.12});
C("moths",["moth","moths"],"swarm",{col:[0xC8BCA8,0xA89A88],n:18,s:.1,night:1});
C("bats",["a bat","the bat","bats","vampire bat"],"swarm",{col:[0x1A1A1E],n:14,s:.2,night:1});
C("bees",["bees","bee","wasps","hornets","swarm of bees"],"swarm",{col:[0xD4B83C,0x1A1A1E],n:30,s:.05,night:1});
C("insects",["swarm of insects","insects","locusts","swarm of flies","cockroaches"],"swarm",{col:[0x2A2420],n:60,s:.04,night:1});

/* ---------------------------------------------------------------- building them */
function creatureOf(spec){ return CREATURE[spec.archetype]||null; }

/* the look a creature starts with; the dream can change any of it */
function creatureLook(spec){
  var o=creatureOf(spec); if(!o||o.kind!=="folk") return;
  var L=lookOf(spec); L.src=L.src||{};
  if(o.skin!==undefined&&!(L.src.skin==="stated")){ L.skin=o.skin; L.src.skin="kind"; }
  if(o.top!==undefined&&!(L.src.top==="stated")){ L.top=o.top; L.bottom=shade(o.top,-.25); L.src.top="kind"; }
  if(o.sex&&!L.sex) L.sex=o.sex;
  if(hasFeat(o,"armor")){ L.top=0x8A8C92; L.bottom=0x55575C; }
  if(hasFeat(o,"bones")||hasFeat(o,"wrapped")){ L.hair=null; L.hairStyle="bald"; }
}

function featVal(o,k){ var v=null; o.feats.forEach(function(f){ var p=f.split(":"); if(p[0]===k) v=p.slice(1); }); return v; }

function buildCreature(spec,f){
  var o=creatureOf(spec);
  if(o.kind==="folk") return buildFolk(spec,f,o);
  if(o.kind==="beast") return buildBeast(spec,f,o);
  if(o.kind==="serpent"){ var ic=o.icons.split(" ").concat(o.icons.indexOf("sea")>-1?[]:[]); return buildDragon(spec,f,ic); }
  if(o.kind==="swim") return buildSwim(spec,f,o);
  if(o.kind==="float") return buildFloat(spec,f,o);
  if(o.kind==="tentacle") return buildTentacle(spec,f,o);
  if(o.kind==="flyer") return buildFlyer(spec,f,o);
  if(o.kind==="crawl") return buildCrawl(spec,f,o);
  if(o.kind==="swarm") return buildSwarm(spec,f,o);
  return buildFigure(spec,f);
}

/* ---- folk: a body, then what makes them what they are ---- */
function wolfHead(col){ var g=new THREE.Group(), m=mL(col);
  g.add(P(box(.2,.2,.24),m,0,0,0)); g.add(P(box(.1,.1,.24),m,0,-.04,.2));
  g.add(P(cone(.045,.14,4),m,-.07,.14,-.02)); g.add(P(cone(.045,.14,4),m,.07,.14,-.02));
  g.add(P(sph(.02),mG(0xE8C27A,1),-.06,.03,.1)); g.add(P(sph(.02),mG(0xE8C27A,1),.06,.03,.1)); return g; }
function seeThrough(root,col,o){
  root.traverse(function(m){ if(!m.isMesh) return;
    m.material=new THREE.MeshBasicMaterial({color:col!==undefined?col:(m.material.color?m.material.color.getHex():0xFFFFFF),transparent:true,opacity:o||0.5,depthWrite:false}); });
}
function buildFolk(spec,f,o){
  creatureLook(spec);
  var g=buildFigure(spec,f);
  return dressFolk(g,spec,f,o);
}
/* the feats loop on its own, apart from creatureLook — so anything already
   built by buildFigure (the player's own body, dressed however they chose)
   can be given a folk's features without its chosen skin, hair or clothes
   being overwritten by the creature's own defaults. */
function dressFolk(g,spec,f,o){
  var body=g.children[0], L=lookOf(spec), limbs=g.userData.limbs, headY=1.72;
  function hide(names){ body.traverse(function(m){ if(m.userData&&names.indexOf(m.userData.part)>-1) m.visible=false; }); }
  var skinMat=mL(L.skin!==null&&L.skin!==undefined?L.skin:STATUE.skin), dark=mL(0x2A2622);
  o.feats.forEach(function(ft){
    var p=ft.split(":"), k=p[0];
    if(k==="ears"){ body.add(P(cone(.03,.14,4),skinMat,-.12,headY+.03,0,0,0,1.1)); body.add(P(cone(.03,.14,4),skinMat,.12,headY+.03,0,0,0,-1.1)); }
    if(k==="horns"){ body.add(P(cone(.035,.2,6),dark,-.07,headY+.16,0,0,0,.35)); body.add(P(cone(.035,.2,6),dark,.07,headY+.16,0,0,0,-.35)); }
    if(k==="tusks"){ var tuC=mG(0xEFE8D8,1);
      body.add(P(cone(.018,.09,5),tuC,-.05,headY-.09,.09,Math.PI*.62)); body.add(P(cone(.018,.09,5),tuC,.05,headY-.09,.09,Math.PI*.62)); }
    if(k==="beard") body.add(P(box(.13,.22,.06),mL(L.hair!==null&&L.hair!==undefined?L.hair:0x9A9690),0,headY-.2,.08));
    if(k==="hat"){ var hc=p[2]?parseInt(p[2]):0x1B1C20;
      if(p[1]==="witch"){ body.add(P(cyl(.24,.24,.02,16),mL(0x1B1C20),0,headY+.1,0)); body.add(P(cone(.12,.46,10),mL(0x1B1C20),0,headY+.34,0,-.15)); }
      else body.add(P(cone(.12,.42,10),mL(hc),0,headY+.28,0)); hide(["hatcap","brimcap","crown","brim","hood"]); }
    if(k==="helm"){ hide(["haircap","hairlong","bun","tail","curly","afro","coily","locs","braid","braidband","buzzcap","waves","wrap","wrapknot","hatcap","brimcap","crown","brim","hood"]); body.add(P(box(.26,.28,.28),mL(0x8A8C92),0,headY+.02,0)); body.add(P(box(.2,.03,.02),mL(0x141418),0,headY+.03,.141)); }
    if(k==="armor"){ body.add(P(sph(.09),mL(0xA7AAB0),-.25,1.5,0)); body.add(P(sph(.09),mL(0xA7AAB0),.25,1.5,0)); }
    if(k==="cape") body.add(P(box(.5,1.1,.03),mL(0x1B1C20),0,1.0,-.16,.08));
    if(k==="fangs"){ body.add(P(cone(.008,.03,4),mL(0xF2EEE6),-.02,headY-.06,.11,Math.PI)); body.add(P(cone(.008,.03,4),mL(0xF2EEE6),.02,headY-.06,.11,Math.PI)); }
    if(k==="head"){ hide(["head","haircap","hairlong","bun","tail","curly","afro","coily","locs","braid","braidband","buzzcap","waves","wrap","wrapknot","eye","hatcap","brimcap","crown","brim","hood"]);
      var H=p[1]==="wolf"?wolfHead(L.skin||0x5A4A3A):HEADS[p[1]]?HEADS[p[1]]():null; if(H){ H.position.set(0,headY,0); body.add(H); } }
    if(k==="hunched") body.rotation.x=.22;
    if(k==="reach"){ g.userData.pose={la:-1.35,ra:-1.35}; limbs.la.rotation.x=-1.35; limbs.ra.rotation.x=-1.35; }
    if(k==="thin") body.scale.x*=.78;
    if(k==="wide") body.scale.x*=1.3;
    if(k==="claws") [limbs.la,limbs.ra].forEach(function(a){ for(var i=0;i<3;i++) a.add(P(cone(.01,.07,4),mL(0x2A2420),(i-1)*.025,-.7,.02,Math.PI)); });
    if(k==="bones"){ for(var r=0;r<4;r++) body.add(P(box(.3,.025,.02),mL(0x3A3430),0,1.2+r*.09,.13)); body.add(P(sph(.03),mG(0x141418,1),-.04,headY+.02,.1)); body.add(P(sph(.03),mG(0x141418,1),.04,headY+.02,.1)); }
    if(k==="wrapped") for(var w=0;w<9;w++) body.add(P(cyl(.21,.21,.02,12),mL(0xB8AC8E),0,.35+w*.16,0,.0,0,(w%2?.08:-.08)));
    if(k==="snakehair") for(var sn=0;sn<9;sn++){ var a=sn*.7; body.add(P(cyl(.015,.008,.2,5),mL(0x3F7A3A),Math.cos(a)*.1,headY+.1,Math.sin(a)*.1,Math.sin(a)*.8,0,-Math.cos(a)*.8)); }
    if(k==="bighead"){ body.traverse(function(m){ if(m.userData&&/^(head|eye)$/.test(m.userData.part||"")) m.scale.multiplyScalar(1.55); }); }
    if(k==="blackeyes"){ hide(["eye"]);
      [-1,1].forEach(function(sd){ var e=P(sph(.045,10,8),mG(0x0A0A0E,1),sd*.055,headY+.02,.1); e.scale.set(.8,1.5,.6); body.add(e); }); }
    if(k==="faceless") hide(["eye"]);
    if(k==="hair"){ body.add(P(box(.26,.7,.08),mL(0xDCE4F0),0,headY-.25,-.1)); }
    if(k==="halo") body.add(P(tor(.18,.015),mG(0xE8C27A,.95),0,headY+.24,0,Math.PI/2));
    if(k==="orb") body.add(P(sph(.07),mG(0x9FD8FF,.95),-.3,2.02,.27));
    if(k==="clown"){ body.add(P(sph(.03),mL(0xC0392B),0,headY,.12)); body.add(P(sph(.09),mL(0xE8561E),-.1,headY+.08,0)); body.add(P(sph(.09),mL(0xE8561E),.1,headY+.08,0)); }
    if(k==="blocky"){ body.add(P(box(.5,.5,.35),mL(L.skin||0x8A8478),0,1.3,0)); body.add(P(box(.3,.28,.28),mL(L.skin||0x8A8478),0,headY,0)); hide(["head","haircap","hairlong","eye"]); }
    if(k==="goatlegs"){ [limbs.ll,limbs.rl].forEach(function(l){ l.traverse(function(m){ if(m.isMesh) m.material=mL(m.userData.part==="shoe"?0x1A1614:0x5A4232); }); }); }
    if(k==="birdlegs"){ [limbs.ll,limbs.rl].forEach(function(l){ l.traverse(function(m){ if(m.isMesh) m.material=mL(0xC8A04A); }); }); }
    if(k==="wings"){ var wk=p[1], wc=p[2]?parseInt(p[2]):(wk==="dragon"?shade(L.skin!==null&&L.skin!==undefined?L.skin:0x6B4A32,-.35):0xF2EEE6);
      [-1,1].forEach(function(sd){ var wg=new THREE.Group();
        if(wk==="fairy"){ var fm=new THREE.MeshBasicMaterial({color:0xDFF4FF,transparent:true,opacity:.5,side:THREE.DoubleSide,depthWrite:false});
          wg.add(P(new THREE.PlaneGeometry(.55,.8),fm,sd*.3,.2,0,0,0,sd*-.3)); wg.add(P(new THREE.PlaneGeometry(.4,.5),fm,sd*.24,-.28,0,0,0,sd*.4)); }
        else if(wk==="bat"){ var bm=new THREE.MeshLambertMaterial({color:0x2A1A1A,side:THREE.DoubleSide});
          wg.add(P(new THREE.PlaneGeometry(.9,.6),bm,sd*.48,.05,0,0,0,sd*-.25)); wg.add(P(cyl(.015,.015,.95,4),mL(0x1A1010),sd*.48,.35,0,0,0,Math.PI/2+sd*.25)); }
        else if(wk==="dragon"){ var dm=new THREE.MeshLambertMaterial({color:wc,side:THREE.DoubleSide});
          wg.add(P(new THREE.PlaneGeometry(1.3,.85),dm,sd*.68,.05,0,0,0,sd*-.28));
          wg.add(P(cyl(.02,.02,1.35,5),mL(shade(wc,-.3)),sd*.68,.4,0,0,0,Math.PI/2+sd*.28));
          wg.add(P(cyl(.014,.014,.7,4),mL(shade(wc,-.3)),sd*1.1,-.1,0,0,0,Math.PI/2+sd*.5)); }
        else for(var i=0;i<4;i++) wg.add(P(box(.9-i*.12,.2,.02),mL(wc),sd*(.45-i*.03),.1-i*.17,0,0,0,sd*(.25+i*.1)));
        wg.position.set(sd*.08,1.42,-.14); wg.rotation.y=sd*-.35; wg.userData.flap=sd; body.add(wg); }); }
    if(k==="tail"){
      if(p[1]==="devil"){ body.add(P(cyl(.015,.015,.7,5),mL(0x6A1A14),0,.7,-.35,-.9)); body.add(P(cone(.05,.1,3),mL(0x6A1A14),0,.46,-.64,-2.5)); }
      if(p[1]==="dragon"){
        var tm=p[2]?mL(parseInt(p[2])):skinMat;
        for(var tg=0;tg<6;tg++){ var tt=tg/5;
          body.add(P(cone(.075-tt*.05,.22,6),tm,0,.86-tt*.55,-.16-tt*.42,Math.PI/2-tt*.22,0,0));
        }
      }
    }
    if(k==="scales") for(var rg=0;rg<5;rg++) body.add(P(cone(.03,.09,4),skinMat,0,1.05+rg*.13,-.14-rg*.01,Math.PI));
    if(k==="fishtail"||k==="smoketail"||k==="horsebody"){
      hide(["leg","shoe","hips","skirt","dress"]); limbs.ll.visible=false; limbs.rl.visible=false;
      if(k==="fishtail"){ var tc=parseInt(p[1]);
        for(var s=0;s<8;s++){ var t=s/7; body.add(P(sph(.19-t*.13),mL(tc),0,.88-t*.78,-t*.35)); }
        body.add(P(new THREE.PlaneGeometry(.5,.3),new THREE.MeshLambertMaterial({color:shade(tc,.2),side:THREE.DoubleSide}),0,.06,-.42,-1.2)); }
      if(k==="smoketail") for(var s2=0;s2<7;s2++){ var t2=s2/6; body.add(P(sph(.2-t2*.15),mG(L.skin||0x4E7AB0,.55-t2*.4),Math.sin(t2*5)*.1,.9-t2*.8,-t2*.2)); }
      if(k==="horsebody"){ var hb=quad(0x7A5A3A,2.2); hb.position.set(0,-.25,-.55); body.position.y=.45; body.add(hb); }
    }
    if(k==="mask"){ body.add(P(box(.2,.16,.08),mL(0x2A2C30),0,headY-.03,.1)); body.add(P(cyl(.04,.04,.08,8),mL(0x5A5C62),-.07,headY-.08,.15,Math.PI/2)); body.add(P(cyl(.04,.04,.08,8),mL(0x5A5C62),.07,headY-.08,.15,Math.PI/2));
      body.add(P(sph(.035),mG(0x9AB0A0,1),-.045,headY+.02,.115)); body.add(P(sph(.035),mG(0x9AB0A0,1),.045,headY+.02,.115)); }
    if(k==="spikes") [-1,1].forEach(function(sd){ body.add(P(sph(.1),mL(0x5A5C62),sd*.24,1.5,0)); for(var q=0;q<3;q++) body.add(P(cone(.025,.14,4),mL(0xA7AAB0),sd*(.26+q*.03),1.6,-.04+q*.04,0,0,-sd*.6)); });
    if(k==="pack"){ body.add(P(box(.36,.46,.2),mL(0x5A4A32),0,1.25,-.2)); body.add(P(cyl(.07,.07,.36,8),mL(0x3A5A3A),0,1.52,-.2,0,0,Math.PI/2)); }
    if(k==="growths") for(var gq=0;gq<6;gq++) body.add(P(sph(.05+gq%3*.02),mL(0x9AAA6A),((gq*37)%10/10-.5)*.3,1.1+gq*.1,.12));
    if(k==="glow") addAura(g,"glow");
    if(k==="aura") addAura(g,p[1]);
    if(k==="see-through") seeThrough(body,p[1]?parseInt(p[1]):undefined,.55);
    if(k==="held"&&HELD[p[1]]){ var it=HELD[p[1]](), sh=.26;
      var side=p[1]==="shield"?1:-1;
      if(!g.userData.pose){ g.userData.pose={la:-.45,ra:-.45}; limbs.la.rotation.x=-.45; limbs.ra.rotation.x=-.45; }
      it.position.set(side*sh,.96,.27); if(p[1]==="shield"){ it.position.set(sh+.06,1.1,.22); it.rotation.y=.3; } body.add(it); }
  });
  if(hasFeat(o,"hover")){
    var base=body.position.y;
    var prev=g.userData.anim;
    g.userData.hover=1;
    g.userData.anim=function(t,dt){ if(prev) prev(t,dt); body.position.y=base+.25+Math.sin(t*1.6+(hash(spec.id)%7))*.12;
      body.traverse(function(m){ if(m.userData.flap) m.rotation.y=m.userData.flap*(-.35+Math.sin(t*14)*.4); }); };
  } else if(featVal(o,"wings")){
    var prev2=g.userData.anim;
    g.userData.anim=function(t,dt){ if(prev2) prev2(t,dt); body.traverse(function(m){ if(m.userData.flap) m.rotation.y=m.userData.flap*(-.35+Math.sin(t*2)*.12); }); };
  }
  body.scale.multiplyScalar(o.s||1);
  return g;
}

/* ---- beasts ---- */
function beastHead(kind,col,s){
  var g=new THREE.Group(), m=mL(col), eye=mG(0x141414,1);
  if(kind==="horse"){ g.add(P(box(.24,.28,.62),m,0,0,.2)); g.add(P(cone(.05,.14,4),m,-.07,.2,-.04)); g.add(P(cone(.05,.14,4),m,.07,.2,-.04)); }
  else if(kind==="eagle"){ g.add(P(sph(.2),mL(0xF2EEE6),0,0,0)); g.add(P(cone(.07,.24,6),mL(0xC8A04A),0,-.04,.24,Math.PI/2)); }
  else if(kind==="lion"){ g.add(P(new THREE.IcosahedronGeometry(.36,1),mL(shade(col,-.3)),0,0,-.05)); g.add(P(sph(.24),m,0,0,.1)); g.add(P(sph(.12),m,0,-.06,.3)); }
  else if(kind==="dog"||kind==="fox"){ g.add(P(box(.26,.24,.28),m,0,0,0)); g.add(P(box(.12,.12,.28),m,0,-.05,.24));
    g.add(P(cone(.05,kind==="fox"?.18:.14,4),m,-.08,.18,-.02)); g.add(P(cone(.05,kind==="fox"?.18:.14,4),m,.08,.18,-.02)); }
  else if(kind==="bear"){ g.add(P(sph(.26),m,0,0,0)); g.add(P(sph(.12),m,0,-.05,.24)); g.add(P(sph(.07),m,-.16,.2,0)); g.add(P(sph(.07),m,.16,.2,0)); }
  else if(kind==="elephant"){ g.add(P(sph(.42),m,0,0,0)); g.add(P(cyl(.12,.06,1.1,8),m,0,-.55,.35,.3));
    g.add(P(cyl(.4,.4,.04,14),m,-.42,0,-.05,0,0,Math.PI/2)); g.add(P(cyl(.4,.4,.04,14),m,.42,0,-.05,0,0,Math.PI/2)); }
  else if(kind==="boar"){ g.add(P(box(.3,.28,.36),m,0,0,.05)); g.add(P(cone(.03,.14,5),mL(0xE6DCC2),.09,-.08,.24,-1.2)); g.add(P(cone(.03,.14,5),mL(0xE6DCC2),-.09,-.08,.24,-1.2)); }
  else if(kind==="rabbit"){ g.add(P(sph(.2),m,0,0,0)); g.add(P(box(.08,.4,.04),m,-.07,.3,-.04)); g.add(P(box(.08,.4,.04),m,.07,.3,-.04)); }
  else if(kind==="rat"){ g.add(P(cone(.16,.4,8),m,0,0,.1,Math.PI/2)); g.add(P(sph(.07),m,-.1,.1,-.02)); g.add(P(sph(.07),m,.1,.1,-.02)); }
  else if(kind==="frog"){ g.add(P(sph(.3),m,0,0,0)); g.add(P(sph(.09),m,-.15,.2,.1)); g.add(P(sph(.09),m,.15,.2,.1)); }
  else if(kind==="turtle"){ g.add(P(sph(.16),m,0,0,.05)); }
  else if(kind==="human"){ g.add(P(sph(.3),mL(0xC9A060),0,0,0)); g.add(P(cone(.42,.6,4),mL(0x2F5E9E),0,.05,-.12,0,.785)); }
  else g.add(P(sph(.24),m,0,0,0));
  g.add(P(sph(.035),eye,-.09,.06,.22)); g.add(P(sph(.035),eye,.09,.06,.22));
  return g;
}
function buildBeast(spec,f,o){
  var g=new THREE.Group(), body=new THREE.Group(); g.add(body);
  var col=o.col, m=mL(col), s=1;
  var low=["rabbit","rat","frog","turtle"].indexOf(o.head)>-1;
  var legH=low?.25:.9, bodyY=legH+.35;
  var torso=P(sph(.5,14,10),m,0,bodyY,0); torso.scale.set(o.head==="elephant"?1.3:0.95,o.head==="elephant"?1.15:0.8,1.6); body.add(torso);
  if(hasFeat(o,"stripes")) for(var i=0;i<6;i++) body.add(P(box(.05,.7,.1),mL(0x1A1614),0,bodyY+.02,-.6+i*.24));
  if(hasFeat(o,"hump")){ var hp=P(sph(.4,12,8),m,0,bodyY+.45,-.1); hp.scale.set(.8,1,1.2); body.add(hp); }
  if(hasFeat(o,"shell")) { var sh=P(sph(.62,14,8),mL(0x4A5A2A),0,bodyY+.1,0); sh.scale.set(1,.55,1.25); body.add(sh); }
  if(!low||o.head==="turtle") [[-.3,-.5],[.3,-.5],[-.3,.5],[.3,.5]].forEach(function(p){ body.add(P(cyl(.09,.07,legH+.2,7),m,p[0],legH/2,p[1])); body.add(P(cyl(.1,.1,.06,7),mL(0x1A1614),p[0],.03,p[1])); });
  var heads=o.heads||1;
  for(var h=0;h<heads;h++){
    var off=heads>1?(h-(heads-1)/2)*.42:0;
    var neck=P(cyl(.16,.2,.6,8),m,off,bodyY+.35,.7,.7); body.add(neck);
    var hd=beastHead(o.head,col); hd.position.set(off,bodyY+.62,.95); hd.rotation.y=off*.4; body.add(hd);
    if(hasFeat(o,"horn")) body.add(P(cone(.04,.5,8),mG(0xE8C27A,1),off,bodyY+.95,1.1,.5));
    if(featVal(o,"eyes")){ var ec=featVal(o,"eyes")[0]==="red"?0xFF3A1E:0xE8C27A; body.add(P(sph(.045),mG(ec,1),off-.09,bodyY+.68,1.17)); body.add(P(sph(.045),mG(ec,1),off+.09,bodyY+.68,1.17)); }
    if(hasFeat(o,"headdress")) body.add(P(box(.7,.5,.1),mL(0xC7A043),off,bodyY+.55,.85));
  }
  if(hasFeat(o,"goathead")){ var gh=HEADS.goat(); gh.position.set(0,bodyY+.6,.2); sc(gh,2); body.add(gh); }
  if(hasFeat(o,"tusks")){ body.add(P(tor(.35,.04,Math.PI*.8),mL(0xE6DCC2),-.18,bodyY+.2,1.25,0,Math.PI/2)); body.add(P(tor(.35,.04,Math.PI*.8),mL(0xE6DCC2),.18,bodyY+.2,1.25,0,Math.PI/2)); }
  var mane=featVal(o,"mane"); if(mane) body.add(P(box(.1,.5,.8),mL(parseInt(mane[0])),0,bodyY+.55,.6,.6));
  var tails=o.tails||1, tf=featVal(o,"tail");
  for(var t=0;t<tails;t++){ var ta=tails>1?(t-(tails-1)/2)*.25:0;
    if(tf&&tf[0]==="scorpion"){ for(var k=0;k<5;k++) body.add(P(sph(.09-k*.01),mL(0x3A2A1E),0,bodyY+.2+k*.18,-.8-Math.sin(k*.6)*.3)); body.add(P(cone(.05,.2,5),mL(0x1A1614),0,bodyY+1.1,-.7,.8)); }
    else if(tf&&tf[0]==="serpent"){ for(var k2=0;k2<6;k2++) body.add(P(sph(.1-k2*.01),mL(0x3F7A3A),Math.sin(k2)*.15,bodyY+k2*.08,-.8-k2*.16)); }
    else body.add(P(cyl(.05,.02,.7,6),mL(o.tails?0xF2EEE6:col),ta,bodyY+.15,-.95,-.6,0,ta*2));
  }
  var wv=featVal(o,"wings");
  if(wv){ var wc=parseInt(wv[0]);
    [-1,1].forEach(function(sd){ var w=new THREE.Group(); for(var i=0;i<4;i++) w.add(P(box(1.3-i*.2,.26,.03),mL(wc),sd*(.65-i*.04),.1-i*.2,0,0,0,sd*(.2+i*.12)));
      w.position.set(sd*.35,bodyY+.35,.2); w.userData.flap=sd; body.add(w); }); }
  if(hasFeat(o,"glow")) addAura(g,"glow");
  var au=featVal(o,"aura"); if(au) addAura(g,au[0]);
  body.scale.multiplyScalar(o.s||1);
  if(!o.big) g.add(contactShadow(.9*(o.s||1)));
  var prev=g.userData.anim;
  g.userData.anim=function(tt,dt){ if(prev) prev(tt,dt);
    body.traverse(function(x){ if(x.userData.flap) x.rotation.z=x.userData.flap*Math.sin(tt*2.2)*.35; }); };
  return g;
}

/* ---- the sea ---- */
function fishShape(col,fin){
  var g=new THREE.Group(), m=mL(col);
  var b=P(sph(.5,14,10),m,0,0,0); b.scale.set(fin==="whale"?1:0.55,fin==="whale"?0.7:0.75,fin==="seahorse"?0.6:1.5); g.add(b);
  g.add(P(new THREE.PlaneGeometry(.5,.45),new THREE.MeshLambertMaterial({color:shade(col,-.15),side:THREE.DoubleSide}),0,0,-.85,0,Math.PI/2));
  if(fin==="shark"||fin==="dolphin") g.add(P(cone(.15,.4,4),m,0,.45,-.05,-.3));
  if(fin==="seahorse"){ b.scale.set(.5,1.3,.6); g.add(P(cone(.12,.4,6),m,0,.55,.2,1.2)); }
  g.add(P(sph(.05),mG(0x111111,1),-.2,.1,.55)); g.add(P(sph(.05),mG(0x111111,1),.2,.1,.55));
  return g;
}
function buildSwim(spec,f,o){
  var g=new THREE.Group(), fishes=[];
  var n=o.school||1;
  for(var i=0;i<n;i++){ var fsh=fishShape(n>1?[o.col,0xE8E0D6,0xC0392B][i%3]:o.col,o.fin); sc(fsh,(o.s||1)*(n>1?(.8+Math.random()*.4):1));
    g.add(fsh); fishes.push({m:fsh,a:i*.6,r:n>1?1.5+Math.random()*2.5:3*(o.s||1),y:1.2+Math.random()*2.5*(n>1?1:0)+(o.s||1)*.6,sp:.3+Math.random()*.3}); }
  g.userData.anim=function(t,dt){ fishes.forEach(function(q){ q.a+=dt*q.sp*(n>1?1.2:.25);
    q.m.position.set(Math.cos(q.a)*q.r,q.y+Math.sin(t+q.a)*.25,Math.sin(q.a)*q.r); q.m.rotation.y=-q.a; }); };
  return g;
}
function buildFloat(spec,f,o){
  var g=new THREE.Group(), body=new THREE.Group(); g.add(body);
  if(hasFeat(o,"jelly")){
    var dome=P(new THREE.SphereGeometry(.6,16,10,0,Math.PI*2,0,Math.PI/2),mG(o.col,.55),0,2.4,0); body.add(dome);
    for(var i=0;i<10;i++){ var a=i*.63; body.add(P(cyl(.015,.005,1.6,4),mG(o.col,.4),Math.cos(a)*.4,1.6,Math.sin(a)*.4)); }
    addAura(g,"glow");
  } else if(hasFeat(o,"eye")){
    body.add(P(sph(1.2,20,16),mL(0xF2EEE6),0,4,0)); body.add(P(sph(.6,16,12),mL(0x6A2A22),0,4,.75)); body.add(P(sph(.3,12,10),mG(0x0A0808,1),0,4,1.05));
    addAura(g,"darkaura");
  } else {
    /* a ghost: a head and a fading robe, no feet */
    var dk=hasFeat(o,"dark"), col=o.col;
    body.add(P(sph(.16),mG(col,.6),0,1.7,0));
    body.add(P(cone(.42,1.5,14,1,true),mG(col,.45),0,.95,0));
    body.add(P(sph(.03),mG(dk?0xFF3A1E:0x1A1A22,1),-.05,1.72,.14)); body.add(P(sph(.03),mG(dk?0xFF3A1E:0x1A1A22,1),.05,1.72,.14));
    [-1,1].forEach(function(sd){ body.add(P(cyl(.04,.02,.6,5),mG(col,.45),sd*.3,1.25,.05,0,0,sd*.6)); });
    if(hasFeat(o,"hair")) body.add(P(box(.3,.9,.05),mG(0xE8EEF4,.5),0,1.35,-.12));
    addAura(g,dk?"darkaura":"smoke");
  }
  var au=featVal(o,"aura"); if(au) addAura(g,au[0]);
  var prev=g.userData.anim, seed=hash(spec.id)%10;
  g.userData.anim=function(t,dt){ if(prev) prev(t,dt); body.position.y=.3+Math.sin(t*1.1+seed)*.2; body.rotation.y=Math.sin(t*.3+seed)*.5; };
  return g;
}
function buildTentacle(spec,f,o){
  var g=new THREE.Group(), body=new THREE.Group(); g.add(body);
  var m=mL(o.col), s=o.s||1, arms=[];
  if(!o.bare){ var hd=P(sph(.6,14,10),m,0,1.4,0); hd.scale.set(1,1.3,1); body.add(hd); body.add(P(sph(.09),mG(0xE8C27A,1),-.3,1.3,.5)); body.add(P(sph(.09),mG(0xE8C27A,1),.3,1.3,.5)); }
  for(var i=0;i<8;i++){ var a=i*.785, arm=new THREE.Group(); arm.position.set(Math.cos(a)*(o.bare?1.2:.4),o.bare?0:.9,Math.sin(a)*(o.bare?1.2:.4)); arm.rotation.y=-a;
    for(var k=0;k<7;k++){ var seg=P(sph(.16-k*.018,8,6),m,0,0,0); arm.add(seg); }
    body.add(arm); arms.push(arm); }
  sc(body,s);
  g.userData.anim=function(t){ arms.forEach(function(arm,i){ var c=arm.children;
    for(var k=0;k<c.length;k++){ var u=k/6, bend=Math.sin(t*1.3+i+k*.5)*.5;
      if(o.bare) c[k].position.set(Math.sin(u*2+bend)*.4,u*2.4,0); else c[k].position.set(u*1.4,-u*.8+Math.sin(bend)*.2,Math.sin(t+i+k)*.15*u); } }); };
  return g;
}
function buildFlyer(spec,f,o){
  var g=new THREE.Group(), body=new THREE.Group(); g.add(body);
  var m=mL(o.col), s=o.s||1;
  var b=P(sph(.35,12,8),m,0,0,0); b.scale.set(.8,.7,1.6); body.add(b);
  body.add(P(sph(.18),m,0,.12,.55)); body.add(P(cone(.06,.2,6),mL(0xC8A04A),0,.1,.75,Math.PI/2));
  var wings=[]; [-1,1].forEach(function(sd){ var w=P(new THREE.PlaneGeometry(1.6,.6),new THREE.MeshLambertMaterial({color:o.col,side:THREE.DoubleSide}),sd*.9,0,0,-Math.PI/2); body.add(w); wings.push({m:w,sd:sd}); });
  body.add(P(new THREE.PlaneGeometry(.5,.6),new THREE.MeshLambertMaterial({color:shade(o.col,.2),side:THREE.DoubleSide}),0,0,-.8,-Math.PI/2));
  var au=featVal(o,"aura"); if(au) addAura(body,au[0]);
  if(hasFeat(o,"glow")) addAura(body,"glow");
  sc(body,s);
  var inner=body.userData.anim, R=6+s*2, H=6+s*1.5, seed=hash(spec.id)%10;
  g.userData.anim=function(t,dt){ if(inner) inner(t,dt);
    var a=t*.25+seed; body.position.set(Math.cos(a)*R,H+Math.sin(t*.7)*1.2,Math.sin(a)*R); body.rotation.y=-a;
    wings.forEach(function(w){ w.m.rotation.z=w.sd*Math.sin(t*5)*.5; }); };
  return g;
}
function buildCrawl(spec,f,o){
  var g=new THREE.Group(), body=new THREE.Group(); g.add(body);
  var m=mL(o.col), legs=[];
  if(o.body==="spider"){ var ab=P(sph(.5),m,0,.55,-.45); ab.scale.set(1,.85,1.2); body.add(ab); body.add(P(sph(.3),m,0,.5,.25));
    for(var e=0;e<4;e++) body.add(P(sph(.04),mG(0xFF3A1E,1),(e-1.5)*.08,.62,.5)); }
  else if(o.body==="crab"){ var cb=P(sph(.5),m,0,.4,0); cb.scale.set(1.3,.5,1); body.add(cb);
    [-1,1].forEach(function(sd){ body.add(P(sph(.16),m,sd*.7,.45,.55)); body.add(P(box(.1,.2,.14),m,sd*.72,.55,.72)); }); }
  else { var sb=P(sph(.35),m,0,.3,0); sb.scale.set(1,.5,1.8); body.add(sb);
    for(var k=0;k<6;k++) body.add(P(sph(.09-k*.008),m,0,.3+Math.sin(k*.5)*.5,-.6-k*.1+Math.max(0,k-3)*.25));
    body.add(P(cone(.05,.2,5),mL(0x1A1614),0,1,-.65,.8)); [-1,1].forEach(function(sd){ body.add(P(box(.1,.08,.3),m,sd*.35,.3,.7)); }); }
  for(var i=0;i<8;i++){ var sd=i<4?-1:1, j=i%4, leg=P(cyl(.03,.02,.9,5),m,sd*.5,.4,-.35+j*.25,0,0,sd*1.0); body.add(leg); legs.push({m:leg,j:j,sd:sd}); }
  sc(body,o.s||1);
  g.add(contactShadow(.6*(o.s||1)));
  g.userData.anim=function(t){ legs.forEach(function(l){ l.m.rotation.x=Math.sin(t*6+l.j*1.3+(l.sd>0?Math.PI:0))*.25; }); };
  return g;
}
function buildSwarm(spec,f,o){
  var g=new THREE.Group(), bits=[], cols=o.col, s=o.s||.1;
  var night=o.key==="bats";
  for(var i=0;i<o.n;i++){ var b=new THREE.Group(), c=cols[i%cols.length];
    var wm=new THREE.MeshLambertMaterial({color:c,side:THREE.DoubleSide});
    b.add(P(new THREE.PlaneGeometry(s*2,s*1.6),wm,-s,0,0)); b.add(P(new THREE.PlaneGeometry(s*2,s*1.6),wm,s,0,0));
    g.add(b); bits.push({m:b,a:Math.random()*6.3,r:1+Math.random()*3,y:1+Math.random()*3,sp:.5+Math.random()*1.2,ph:Math.random()*6}); }
  g.userData.anim=function(t,dt){ bits.forEach(function(q){ q.a+=dt*q.sp*(night?1.5:1);
    q.m.position.set(Math.cos(q.a)*q.r,q.y+Math.sin(t*2+q.ph)*.5,Math.sin(q.a*1.3)*q.r); q.m.rotation.y=-q.a;
    q.m.children[0].rotation.y=Math.sin(t*20+q.ph)*.9; q.m.children[1].rotation.y=-Math.sin(t*20+q.ph)*.9; }); };
  return g;
}

