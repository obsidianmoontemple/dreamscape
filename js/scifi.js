/* SomnuMatrix — scifi.js
   the far side of the dream: domes and habitats, reactors and hangars, shuttles
   and saucers, robots, greys and troopers — and a stargate, which works: step
   through one and it carries you to another, across worlds if there is one there.
   loaded as a plain script; shares scope with the other files */
"use strict";

var STEEL=0x9AA4B0, HULL=0x6E7884, DARKM=0x3A4048, PANEL=0x545E6A, NEONC=0x4AE8FF, NEONM=0xFF4AE0,
    GLASSB=0x7FC8E8, WARN=0xE8A63A, REACT=0x6AF0C4;

/* ---------- places ---------- */
S("stargate","structure",[10,11,3],[
  {g:"tor",s:[4.2,.55,Math.PI*2],p:[0,5,0],c:0x8A8E96},
  {g:"tor",s:[3.62,.14],p:[0,5,0],c:0x5A5E66},
  {g:"cyl",s:[3.55,3.55,.12,32],p:[0,5,0],r:[Math.PI/2,0,0],c:0x3AA8E8,glow:1,opa:.62,pulse:1},
  {g:"box",s:[.8,.55,1.05],p:[0.0,9.15,0],r:[0,0,0.0],c:WARN,glow:1,pulse:1},
  {g:"box",s:[.8,.55,1.05],p:[-2.67,8.18,0],r:[0,0,0.7],c:0xAEB4BC},
  {g:"box",s:[.8,.55,1.05],p:[-4.09,5.72,0],r:[0,0,1.4],c:0xAEB4BC},
  {g:"box",s:[.8,.55,1.05],p:[-3.59,2.93,0],r:[0,0,2.09],c:0xAEB4BC},
  {g:"box",s:[.8,.55,1.05],p:[-1.42,1.1,0],r:[0,0,2.79],c:0xAEB4BC},
  {g:"box",s:[.8,.55,1.05],p:[1.42,1.1,0],r:[0,0,3.49],c:0xAEB4BC},
  {g:"box",s:[.8,.55,1.05],p:[3.59,2.92,0],r:[0,0,4.19],c:0xAEB4BC},
  {g:"box",s:[.8,.55,1.05],p:[4.09,5.72,0],r:[0,0,4.89],c:0xAEB4BC},
  {g:"box",s:[.8,.55,1.05],p:[2.67,8.18,0],r:[0,0,5.59],c:0xAEB4BC},
  {g:"box",s:[5,.3,4],p:[0,.15,3],c:DARKM},
  {g:"box",s:[6,.6,.4],p:[0,.3,5.1],c:0x4A5058},
  {g:"box",s:[1,1.4,.8],p:[4.6,.7,4],c:PANEL},
  {g:"box",s:[.8,.5,.1],p:[4.6,1.5,4.45],c:NEONC,glow:1,pulse:1}
],["stargate","star gate","ring gate","great ring","gate of the ancients","the ring stood upright"]);
S("biodome","structure",[30,26,30],[
  {g:"sph",s:[14],p:[0,0,0],c:GLASSB,opa:.34},
  {g:"cyl",s:[14.2,14.2,.6,28],p:[0,.3,0],c:PANEL},
  {g:"cyl",s:[.3,.3,14,6],p:[0,7,0],r:[0,0,1.5708],c:STEEL,rep:[4,0,0,0]},
  {g:"box",s:[3,3,1],p:[0,1.5,14],c:DARKM},
  {g:"box",s:[2.4,2.4,.2],p:[0,1.5,14.5],c:NEONC,glow:1,opa:.5},
  {g:"ico",s:[2.2],p:[-5,2,3],c:0x3F7A3A},{g:"ico",s:[1.6],p:[5,1.6,-4],c:0x4A8A42}
],["biodome","dome city","glass dome","domed habitat","greenhouse dome"]);
S("habitat","structure",[16,7,10],[
  {g:"cyl",s:[3.4,3.4,13,16],p:[0,3.6,0],r:[0,0,1.5708],c:STEEL},
  {g:"cyl",s:[3.5,3.5,.4,16],p:[-6.4,3.6,0],r:[0,0,1.5708],c:PANEL},
  {g:"cyl",s:[3.5,3.5,.4,16],p:[6.4,3.6,0],r:[0,0,1.5708],c:PANEL},
  {g:"box",s:[1.6,2,.3],p:[0,1,3.5],c:DARKM},
  {g:"cyl",s:[.7,.7,.2,12],p:[-3,3.6,3.45],r:[Math.PI/2,0,0],c:GLASSB,rep:[3,3,0,0]},
  {g:"cyl",s:[.5,.5,1.6,8],p:[0,7.6,0],c:PANEL},{g:"sph",s:[.3],p:[0,8.6,0],c:WARN,glow:1,pulse:1},
  {g:"box",s:[5,.15,3],p:[0,.1,4.6],c:0x4A5058}
],["habitat","habitat module","living module","colony module","pressurised module"]);
S("researchlab","structure",[18,8,14],[
  {g:"box",s:[16,5,12],p:[0,2.5,0],c:0xD8DCE2},
  {g:"box",s:[16.4,.5,12.4],p:[0,5.2,0],c:PANEL},
  {g:"box",s:[2.4,2.6,.3],p:[0,1.3,6.1],c:GLASSB,opa:.7},
  {g:"box",s:[3.4,1.4,.2],p:[-5,3.4,6.05],c:GLASSB,opa:.6,rep:[3,5,0,0]},
  {g:"box",s:[1,.4,.1],p:[0,4.4,6.1],c:NEONC,glow:1,pulse:1},
  {g:"cyl",s:[.5,.5,3,10],p:[6.4,6.7,-4],c:STEEL},{g:"sph",s:[.8],p:[6.4,8.4,-4],c:REACT,glow:1,pulse:1}
],["research lab","laboratory","science station","research station","lab complex"]);
S("reactor","structure",[14,18,14],[
  {g:"cyl",s:[5,6,12,20],p:[0,6,0],c:PANEL},
  {g:"cyl",s:[6.4,6.4,1,20],p:[0,12.4,0],c:DARKM},
  {g:"cyl",s:[3,3,4,16],p:[0,14.6,0],c:STEEL},
  {g:"tor",s:[5.4,.4],p:[0,7,0],c:REACT,glow:1,pulse:1},
  {g:"tor",s:[5.4,.4],p:[0,10,0],c:REACT,glow:1,pulse:1},
  {g:"box",s:[2,3,.4],p:[0,1.5,6.2],c:DARKM},
  {g:"box",s:[1.2,.5,.1],p:[0,3.4,6.25],c:WARN,glow:1,pulse:1}
],["reactor","fusion reactor","power core","generator tower","energy plant"]);
S("hangar","structure",[34,22,26],[
  {g:"box",s:[32,10,24],p:[0,5,0],c:HULL},
  {g:"cyl",s:[16,16,24,18,1,false,0,Math.PI],p:[0,10,0],r:[1.5708,0,0],c:HULL},
  {g:"box",s:[16,9,.6],p:[0,4.5,12.2],c:DARKM},
  {g:"box",s:[.5,9,.5],p:[-7,4.5,12.5],c:WARN,rep:[3,7,0,0]},
  {g:"box",s:[24,.2,8],p:[0,.1,16],c:0x4A5058},
  {g:"sph",s:[.4],p:[-12,10.5,12],c:WARN,glow:1,pulse:1},{g:"sph",s:[.4],p:[12,10.5,12],c:WARN,glow:1,pulse:1}
],["hangar","ship hangar","launch bay","docking bay","landing bay"]);
S("spaceport","structure",[30,22,22],[
  {g:"box",s:[26,8,18],p:[0,4,0],c:0xC8CED6},
  {g:"cyl",s:[3,3.6,18,14],p:[9,9,-4],c:0xD8DCE2},
  {g:"cyl",s:[5,5,2.4,14],p:[9,18.4,-4],c:PANEL},
  {g:"cyl",s:[4.6,4.6,1.6,14],p:[9,18.4,-4],c:GLASSB,opa:.6},
  {g:"box",s:[10,5,.3],p:[-6,3,9.2],c:GLASSB,opa:.55},
  {g:"box",s:[26,.5,18.4],p:[0,8.3,0],c:PANEL},
  {g:"sph",s:[.4],p:[9,20,-4],c:0xE84A4A,glow:1,pulse:1}
],["spaceport","space port","launch terminal","shuttle terminal","port for ships"]);
S("controltower","structure",[8,24,8],[
  {g:"cyl",s:[2,2.6,18,12],p:[0,9,0],c:0xD0D6DE},
  {g:"cyl",s:[4.4,4,4,12],p:[0,19.5,0],c:PANEL},
  {g:"cyl",s:[4.1,3.7,2.6,12],p:[0,19.6,0],c:GLASSB,opa:.62},
  {g:"cyl",s:[4.6,4.6,.4,12],p:[0,21.8,0],c:DARKM},
  {g:"cyl",s:[.14,.14,3,6],p:[0,23.4,0],c:STEEL},{g:"sph",s:[.3],p:[0,24.8,0],c:0xE84A4A,glow:1,pulse:1}
],["control tower","flight tower","traffic control tower","tower of the port"]);
S("spaceelevator","structure",[10,120,10],[
  {g:"cyl",s:[3,4,10,14],p:[0,5,0],c:PANEL},
  {g:"cyl",s:[.5,.5,110,10],p:[0,60,0],c:STEEL},
  {g:"cyl",s:[1.4,1.4,3,10],p:[0,18,0],c:0xD8DCE2},
  {g:"box",s:[.2,110,.2],p:[1.2,60,0],c:NEONC,glow:1,opa:.5}
],["space elevator","cable to the sky","tether to orbit","elevator into space"]);
S("satdish","infra",[9,9,9],[
  {g:"cyl",s:[.5,.7,4,10],p:[0,2,0],c:PANEL},
  {g:"cyl",s:[4,3.6,.5,20],p:[0,5.4,0],r:[-.9,0,0],c:0xD8DCE2},
  {g:"cyl",s:[.16,.16,3,6],p:[0,6.4,1.6],r:[-.9,0,0],c:STEEL},
  {g:"sph",s:[.3],p:[0,7.6,2.4],c:WARN,glow:1}
],["satellite dish","radio dish","listening dish","dish array"]);
S("solarfarm","infra",[20,4,14],[
  {g:"box",s:[6,.2,3.4],p:[-6,2.2,-4],r:[-.5,0,0],c:0x2A3A6A,rep:[3,6,0,0]},
  {g:"box",s:[6,.2,3.4],p:[-6,2.2,4],r:[-.5,0,0],c:0x2A3A6A,rep:[3,6,0,0]},
  {g:"cyl",s:[.14,.14,2,6],p:[-6,1,-4],c:PANEL,rep:[3,6,0,0]},
  {g:"cyl",s:[.14,.14,2,6],p:[-6,1,4],c:PANEL,rep:[3,6,0,0]}
],["solar panels","solar farm","panel array","field of solar panels"]);
S("cryopod","infra",[1.8,2.6,3.4],[
  {g:"box",s:[1.4,1,3],p:[0,.6,0],c:PANEL},
  {g:"cyl",s:[.7,.7,2.8,14,1,false,0,Math.PI],p:[0,1.4,0],r:[1.5708,0,0],c:GLASSB,opa:.45},
  {g:"box",s:[.5,.3,.1],p:[0,1.2,1.6],c:NEONC,glow:1,pulse:1}
],["cryopod","stasis pod","sleep pod","freezing pod","hibernation pod"]);
S("forcefield","infra",[10,7,1],[
  {g:"cyl",s:[.3,.4,6,8],p:[-4.6,3,0],c:PANEL},{g:"cyl",s:[.3,.4,6,8],p:[4.6,3,0],c:PANEL},
  {g:"pln",s:[9,6],p:[0,3,0],c:NEONC,glow:1,opa:.3},
  {g:"sph",s:[.24],p:[-4.6,6.2,0],c:NEONC,glow:1,pulse:1},{g:"sph",s:[.24],p:[4.6,6.2,0],c:NEONC,glow:1,pulse:1}
],["force field","energy barrier","shield wall","wall of energy"]);
S("holosign","infra",[5,8,1],[
  {g:"cyl",s:[.2,.25,3,8],p:[0,1.5,0],c:DARKM},
  {g:"pln",s:[4,3],p:[0,4.6,0],c:NEONM,glow:1,opa:.55},
  {g:"pln",s:[3.2,2.2],p:[0,4.6,.06],c:NEONC,glow:1,opa:.45},
  {g:"box",s:[4.4,.1,.1],p:[0,6.3,0],c:NEONM,glow:1}
],["hologram sign","holo sign","neon hologram","floating advertisement","hologram in the air"]);
S("console","infra",[2.4,1.6,1.2],[
  {g:"box",s:[2,1,.9],p:[0,.5,0],c:PANEL},
  {g:"box",s:[1.9,.5,.7],p:[0,1.1,-.1],r:[-.5,0,0],c:DARKM},
  {g:"box",s:[1.7,.4,.06],p:[0,1.18,.08],r:[-.5,0,0],c:REACT,glow:1,pulse:1},
  {g:"sph",s:[.08],p:[.8,1.05,.35],c:0xE84A4A,glow:1}
],["console","control panel","computer bank","control console","instrument panel"]);
S("landinglights","infra",[16,1,16],[
  {g:"cyl",s:[.3,.3,.2,8],p:[-6,.1,-6],c:DARKM,rep:[4,4,0,0]},
  {g:"sph",s:[.22],p:[-6,.3,-6],c:WARN,glow:1,pulse:1,rep:[4,4,0,0]},
  {g:"cyl",s:[.3,.3,.2,8],p:[-6,.1,6],c:DARKM,rep:[4,4,0,0]},
  {g:"sph",s:[.22],p:[-6,.3,6],c:WARN,glow:1,pulse:1,rep:[4,4,0,0]}
],["landing lights","pad lights","guide lights","lights marking the pad"]);
S("wreckedship","structure",[28,10,12],[
  {g:"cyl",s:[3.4,4.6,20,12],p:[0,3,0],r:[0,0,1.5708+.12],c:0x7A6A64},
  {g:"box",s:[9,.4,7],p:[2,4.6,0],r:[0,.2,.12],c:0x6E6058},
  {g:"box",s:[5,3,4],p:[-9,2,1],r:[.3,.5,.2],c:0x6E6058},
  {g:"cyl",s:[1.6,1.6,2,10],p:[9,3.8,0],r:[0,0,1.5708],c:DARKM},
  {g:"box",s:[2,.1,3],p:[-2,5.2,0],c:0x3A3430}
],["crashed ship","wrecked spaceship","downed shuttle","hull of a ship","crashed saucer"]);

/* ---------- things that fly ---------- */
S("shuttle","vehicle",[6,4,12],[
  {g:"cyl",s:[1.6,2,9,12],p:[0,2.4,0],r:[1.5708,0,0],c:0xD8DCE2},
  {g:"cone",s:[1.6,3,12],p:[0,2.4,5.6],r:[1.5708,0,0],c:0xE8ECF2},
  {g:"box",s:[6.4,.25,2.6],p:[0,2,-1.6],c:0xC8CED6},
  {g:"box",s:[.25,2,2],p:[0,3.4,-4],c:0xC8CED6},
  {g:"cyl",s:[.7,.9,1.6,10],p:[-1.4,2.2,-4.8],r:[1.5708,0,0],c:DARKM},
  {g:"cyl",s:[.7,.9,1.6,10],p:[1.4,2.2,-4.8],r:[1.5708,0,0],c:DARKM},
  {g:"pln",s:[1.6,.8],p:[0,3,3.4],c:GLASSB,opa:.7},
  {g:"cyl",s:[.16,.16,1.4,6],p:[-2.4,.7,0],c:STEEL},{g:"cyl",s:[.16,.16,1.4,6],p:[2.4,.7,0],c:STEEL}
],["shuttle","space shuttle","small spacecraft","landing craft","ship on the pad"]);
S("starship","vehicle",[22,12,46],[
  {g:"cyl",s:[4,5,34,16],p:[0,7,0],r:[1.5708,0,0],c:0xC0C8D2},
  {g:"cone",s:[4,7,16],p:[0,7,20],r:[1.5708,0,0],c:0xD8DCE2},
  {g:"box",s:[19,.6,10],p:[0,6,-6],c:0xB8C0CA},
  {g:"cyl",s:[1.6,2,7,12],p:[-8,6,-10],r:[1.5708,0,0],c:DARKM},
  {g:"cyl",s:[1.6,2,7,12],p:[8,6,-10],r:[1.5708,0,0],c:DARKM},
  {g:"cyl",s:[1.5,1.5,.6,12],p:[-8,6,-13.6],r:[1.5708,0,0],c:NEONC,glow:1,pulse:1},
  {g:"cyl",s:[1.5,1.5,.6,12],p:[8,6,-13.6],r:[1.5708,0,0],c:NEONC,glow:1,pulse:1},
  {g:"box",s:[3,1.6,4],p:[0,10.6,8],c:0xD8DCE2},
  {g:"pln",s:[2.4,1],p:[0,10.8,10.1],c:GLASSB,opa:.7}
],["starship","spaceship","great ship","cruiser","vessel among the stars","the mothership"]);
S("saucer","vehicle",[14,5,14],[
  {g:"cyl",s:[6.4,2.4,1.4,28],p:[0,2.2,0],c:0xC8CED6},
  {g:"cyl",s:[2.4,6.4,1.2,28],p:[0,1.2,0],c:0xB8C0CA},
  {g:"sph",s:[2.4,16,10],p:[0,3.4,0],c:GLASSB,opa:.55},
  {g:"sph",s:[.4],p:[-4.6,1.4,0],c:NEONC,glow:1,pulse:1,rep:[6,1.5,0,0]},
  {g:"cyl",s:[2,.6,1.2,16],p:[0,.5,0],c:NEONC,glow:1,opa:.5,pulse:1}
],["flying saucer","ufo","saucer in the sky","disc in the sky","alien craft"]);
S("hovercar","vehicle",[2.6,1.8,5],[
  {g:"box",s:[2.2,.9,4.4],p:[0,1.3,0],c:0x3A6A9A},
  {g:"box",s:[1.8,.6,2],p:[0,1.9,-.2],c:GLASSB,opa:.6},
  {g:"cyl",s:[.5,.6,.5,12],p:[-1,.7,1.5],c:DARKM,rep:[2,2,0,-3]},
  {g:"cyl",s:[.5,.6,.5,12],p:[-1,.7,-1.5],c:DARKM,rep:[2,2,0,0]},
  {g:"sph",s:[.2],p:[-1,.45,1.5],c:NEONC,glow:1,pulse:1,rep:[2,2,0,-3]}
],["hovercar","flying car","hover car","car that floated"]);
S("rover","vehicle",[3,2.4,4.4],[
  {g:"box",s:[2.4,1,3.4],p:[0,1.2,0],c:0xD8DCE2},
  {g:"box",s:[1.4,.7,1.2],p:[0,2,-.6],c:PANEL},
  {g:"cyl",s:[.55,.55,.4,12],p:[-1.3,.55,1.2],r:[0,0,1.5708],c:DARKM,rep:[2,2.6,0,0]},
  {g:"cyl",s:[.55,.55,.4,12],p:[-1.3,.55,-1.2],r:[0,0,1.5708],c:DARKM,rep:[2,2.6,0,0]},
  {g:"box",s:[1.6,.1,1.2],p:[0,2.5,.6],r:[-.3,0,0],c:0x2A3A6A}
],["rover","moon rover","exploration rover","six-wheeled rover"]);
S("mech","vehicle",[5,9,5],[
  {g:"box",s:[3.4,3,2.6],p:[0,5.4,0],c:0x6A7480},
  {g:"box",s:[1.6,1.2,1.4],p:[0,7.4,.4],c:PANEL},
  {g:"box",s:[1,.3,.1],p:[0,7.5,1.15],c:0xE84A4A,glow:1,pulse:1},
  {g:"cyl",s:[.7,.6,3.4,8],p:[-2.4,5,0],c:PANEL},{g:"cyl",s:[.7,.6,3.4,8],p:[2.4,5,0],c:PANEL},
  {g:"cyl",s:[.9,.7,3.4,8],p:[-1.1,2,0],c:STEEL},{g:"cyl",s:[.9,.7,3.4,8],p:[1.1,2,0],c:STEEL},
  {g:"box",s:[1.4,.5,2.2],p:[-1.1,.3,.3],c:DARKM},{g:"box",s:[1.4,.5,2.2],p:[1.1,.3,.3],c:DARKM}
],["mech","walker machine","battle walker","armoured walker","exosuit"]);

/* ---------- who is out there ---------- */
C("robot",["robot","robots","automaton","machine man","clanking machine"],"folk",
  {s:1.1,skin:0x9AA4B0,feats:["blocky","helm","held:staff"],top:0x6E7884});
C("android",["android","synthetic","artificial person","humanlike machine"],"folk",
  {skin:0xE0E4EA,feats:["faceless"],top:0x4A5058});
C("grey",["grey alien","little grey","the greys","big-eyed alien","alien with black eyes"],"folk",
  {s:.75,skin:0x9AB0A4,feats:["bighead","blackeyes","thin"],top:0x9AB0A4,night:1,realm:"stars"});
C("alien",["alien","aliens","visitor from elsewhere","being from another world","extraterrestrial"],"folk",
  {skin:0x7AA890,feats:["bighead","blackeyes","ears"],top:0x3A5A6A,realm:"elsewhere"});
C("trooper",["trooper","space soldier","soldier in white armour","armoured soldier","marine in armour"],"folk",
  {feats:["armor","helm","held:spear","spikes"],top:0xE8ECF2});
C("cyborg",["cyborg","half machine man","man with a metal arm","augmented person"],"folk",
  {feats:["silverhand","helm"],top:0x4A5058,night:1});
C("xeno",["xenomorph","alien beast","clawed alien","creature from the ship"],"crawl",
  {col:0x1A1C22,body:"scorpion",s:1.1,night:1});
C("drone",["drone","drones","hovering drone","little flying machine","camera drone"],"flyer",
  {col:0x8A9098,s:.5,feats:["glow"]});
C("spacewalker",["astronaut","cosmonaut","person in a spacesuit","figure in a suit"],"folk",
  {feats:["helm","armor","pack"],top:0xF2F4F8});

/* two more things a figure can be */
(function(){
  var extend=function(){
    if(typeof buildFolk!=="function") return;
    /* handled inside creatures.js through the feats list; these are the shapes for them */
  };
  extend();
})();

/* ---------- worlds ---------- */
function extendRealms3(){
  addSciFurniture();
  REALMS.station={name:"The Orbital",ground:0x6A7480,tex:"paving",path:0x545E6A,skyTop:0x02030A,skyLow:0x0A1020,
    dens:.5,light:0xDCE8FF,amb:.7,sun:.6,stars:1,mix:["spacewalker","robot","android","drone","human"]};
  REALMS.future={name:"The City to Come",ground:0x2A2E38,tex:"asphalt",path:0x3A4048,skyTop:0x120A2A,skyLow:0x4A1A5A,
    dens:1.6,light:0xC8A8FF,amb:.55,sun:.45,stars:0,mix:["human","human","android","drone","cyborg","crowd"]};
  REALM_WORDS.push(["station",["a space station","the space station","aboard the station","in orbit","the orbital","aboard the ship","on the starship","the space colony"]]);
  REALM_WORDS.push(["future",["the future","a future city","the city of the future","neon city","cyberpunk city","a hundred years from now","the world to come"]]);
  REALM_SCENERY.station=["habitat","console","cryopod","satdish","solarfarm","landinglights","shuttle","habitat","forcefield"];
  REALM_SCENERY.future=["holosign","holosign","hovercar","forcefield","console","skyscraper","stringlights","hovercar"];
  /* a stargate is a way through, like the others */
  if(typeof GATEWAY!=="undefined") GATEWAY.stargate=1;
  if(typeof BELONGS!=="undefined"){
    BELONGS.researchlab=[{n:[2,4],kind:"human",role:"worker"},{n:[1,2],kind:"android",role:"nightwatch"}];
    BELONGS.habitat=[{n:[2,4],kind:"human",role:"resident",lives:true}];
    BELONGS.hangar=[{n:[2,5],kind:"human",role:"worker"},{n:[1,2],kind:"robot",role:"nightwatch"}];
    BELONGS.spaceport=[{n:[2,4],kind:"human",role:"clerk"},{n:[1,3],kind:"spacewalker",role:"guest"}];
    BELONGS.controltower=[{n:[1,2],kind:"human",role:"nightwatch"}];
    BELONGS.reactor=[{n:[1,3],kind:"human",role:"worker"}];
    BELONGS.biodome=[{n:[2,4],kind:"human",role:"resident",lives:true}];
  }
}

/* consoles and pods for a laboratory — added once the furnishings exist */
function addSciFurniture(){
  if(typeof PLANS!=="undefined"&&!PLANS.researchlab){

    PLANS.researchlab={mode:"hall",w:14,d:12,fill:"lab",wall:0xE0E6EC,floor:"tile"};
    PLANS.habitat={mode:"rooms",rooms:["lobby","bedroom","kitchen","office"],wall:0xD8DEE6,floor:"tile"};
    PLANS.hangar={mode:"hall",w:26,d:20,fill:"works",wall:0x8A929C,floor:"stone",h:8};
    PLANS.spaceport={mode:"hall",w:20,d:16,fill:"station",wall:0xD8DEE6,floor:"marble"};
    PLANS.biodome={mode:"hall",w:20,d:20,fill:"cozy",wall:0xDCE8DC,floor:"stone"};
    PLANS.controltower={mode:"hall",w:8,d:8,fill:"lab",wall:0xD0D6DE,floor:"tile",h:4};
    PLANS.reactor={mode:"hall",w:10,d:10,fill:"works",wall:0x8A929C,floor:"stone",h:8};
  }
  if(typeof FURN==="undefined"||FURN.labbench) return;
  FURN.labbench=function(){ return F([P(box(2.6,.9,.9),mL(0xC8CED6),0,.45,0),P(box(2.7,.06,1),mL(0xE8ECF2),0,.92,0),
    P(box(.3,.4,.3),mG(0x6AF0C4,.9),-.8,1.15,0),P(box(.25,.3,.25),mG(0x4AE8FF,.9),.6,1.1,0)]); };
  FURN.podbed=function(){ return F([P(box(1.2,.8,2.6),mL(0x545E6A),0,.4,0),
    P(new THREE.CylinderGeometry(.6,.6,2.4,14,1,false,0,Math.PI),mG(0x7FC8E8,.45),0,1,0,Math.PI/2),
    P(box(.4,.2,.1),mG(0x4AE8FF,1),0,.95,1.35)]); };
  FURN.bigconsole=function(){ return F([P(box(3.4,1.2,1),mL(0x545E6A),0,.6,0),P(box(3.2,1,.1),mG(0x6AF0C4,.85),0,1.6,-.4,-.25),
    P(box(.5,.2,.4),mL(0x3A4048),1.2,1.25,.2)]); };
  SOLIDFURN.labbench=1; SOLIDFURN.podbed=1; SOLIDFURN.bigconsole=1;
}

