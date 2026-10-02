/* SomnuMatrix — realm-kit.js
   what each other world is made of. every realm now has its own scenery, set out
   around the way in when it is first reached, and its own inhabitants. all of it
   can also be dreamt by name, in any world.
   loaded as a plain script; shares scope with the other files */
"use strict";

function S(key,cat,size,parts,words,extra){ A(key,cat,size,parts,extra); if(words) MORE_VOCAB[key]=words; }
var GLOWPINK=0xF0B8E8, GLOWBLUE=0x9FD8FF, ICE=0xBFE4F4, BONE=0xE6DCC2, CORAL1=0xE0605A, CORAL2=0xF0A060, CORAL3=0xB060C8;

/* ---- Faerie ---- */
S("fairyring","infra",[8,1,8],[
  {g:"cyl",s:[.08,.1,.35,6],p:[3.5,.17,0],c:0xE6DCC2,rep:[1,0,0,0]},
  {g:"sph",s:[.28],p:[3.5,.4,0],c:GLOWPINK,glow:1,pulse:1}
],["fairy ring","ring of mushrooms","mushroom ring","toadstool ring","fairy circle"]);
S("toadstoolhouse","structure",[7,8,7],[
  {g:"cyl",s:[2,2.4,4.4,14],p:[0,2.2,0],c:0xE6DCC2},
  {g:"sph",s:[3.6],p:[0,5.2,0],c:0xA8322B},
  {g:"sph",s:[.45],p:[1.8,6.8,.9],c:0xF2EEE6,rep:[4,-1.2,.4,-.6]},
  {g:"box",s:[1,1.8,.2],p:[0,.9,2.35],c:"dark"},
  {g:"box",s:[.7,.7,.15],p:[1.2,2.6,2.2],c:"glass"}
],["toadstool house","mushroom house","toadstool cottage","house in a mushroom"]);
S("hollowtree","nature",[8,14,8],[
  {g:"cyl",s:[2.2,3,10,10],p:[0,5,0],c:"bark"},
  {g:"box",s:[1.4,2.4,.4],p:[0,1.2,2.6],c:0x141210},
  {g:"ico",s:[5.5],p:[0,12,0],c:"nature"},{g:"ico",s:[3.4],p:[3,10,1],c:"nature"}
],["hollow tree","tree with a door","hollow oak","tree house of the fae"]);
S("glowflowers","nature",[6,1,6],[
  {g:"cyl",s:[.02,.02,.5,4],p:[0,.25,0],c:0x3F7A3A,rep:[5,.9,0,.3]},
  {g:"sph",s:[.14],p:[0,.52,0],c:GLOWBLUE,glow:1,pulse:1,rep:[5,.9,0,.3]}
],["glowing flowers","luminous flowers","flowers that glowed","shining flowers","moonflowers"]);
S("faethrone","structure",[8,7,6],[
  {g:"box",s:[2.2,1.2,1.6],p:[0,.6,0],c:0x5A4A32},
  {g:"box",s:[2.2,3.4,.4],p:[0,2.9,-.6],c:0x5A4A32},
  {g:"cone",s:[.12,1.2,5],p:[-1,5,-.6],c:0x3F5A2A,rep:[5,.5,.3,0]},
  {g:"tor",s:[3.4,.18],p:[0,3.4,-.9],c:0x3F5A2A},
  {g:"sph",s:[.2],p:[0,4.8,-.6],c:GLOWPINK,glow:1,pulse:1}
],["fairy throne","throne of thorns","fae court","court of the fae","seelie court","unseelie court","fairy court"]);
S("moonpool","nature",[8,1,8],[
  {g:"cyl",s:[3.4,3.4,.06,24],p:[0,.05,0],c:0xBFE8FF,glow:1,opa:.6},
  {g:"cyl",s:[3.7,3.8,.3,24],p:[0,.1,0],c:"stone"}
],["moon pool","moonlit pool","silver pool","scrying pool","enchanted pool"]);
S("briar","nature",[10,3,3],[
  {g:"ico",s:[1.4],p:[-3,1.2,0],c:0x2E4A26,rep:[4,2,0,0]},
  {g:"cone",s:[.05,.4,4],p:[-3.4,1.8,.9],c:0x6A4A3A,rep:[8,.9,0,0]}
],["briar","briars","thorns","wall of thorns","thorn hedge","bramble","brambles"]);

/* ---- The Deep, where the merfolk live ---- */
S("coral","nature",[8,4,8],[
  {g:"cyl",s:[.2,.35,2.6,6],p:[0,1.3,0],c:CORAL1},{g:"cyl",s:[.15,.25,1.8,6],p:[.9,.9,.4],r:[0,0,-.5],c:CORAL1},
  {g:"sph",s:[1.1],p:[-1.6,.6,.8],c:CORAL2},{g:"cyl",s:[.12,.2,2,6],p:[-.8,1,-1],r:[.4,0,.3],c:CORAL3},
  {g:"ico",s:[.9],p:[1.8,.5,-1.2],c:0xE8C26A}
],["coral","coral reef","reef","corals"]);
S("kelp","nature",[4,10,4],[
  {g:"box",s:[.25,9,.04],p:[0,4.5,0],c:0x3E6A2A,rep:[5,.5,0,.3]}
],["kelp","kelp forest","seaweed","sea grass","waving weed"]);
S("shipwreck","structure",[10,8,26],[
  {g:"box",s:[7,4,22],p:[0,1.6,0],r:[0,0,.25],c:0x4A3A2A},
  {g:"cyl",s:[.3,.35,12,8],p:[.6,7,2],r:[0,0,.6],c:0x3A2A1E},
  {g:"box",s:[6,.3,4],p:[0,3.6,-8],r:[0,0,.25],c:0x3A2A1E},
  {g:"box",s:[5,3,.2],p:[2,5,2],r:[0,0,.9],c:0xC8BCA8,opa:.7}
],["shipwreck","sunken ship","wrecked ship","ghost ship","drowned ship"]);
S("giantclam","nature",[4,3,4],[
  {g:"sph",s:[1.8],p:[0,.3,0],c:0xB0A8C8},
  {g:"sph",s:[.5],p:[0,1,.4],c:0xF2F0FF,glow:1,pulse:1}
],["giant clam","great clam","pearl","giant pearl","oyster"]);
S("anemones","nature",[5,1.5,5],[
  {g:"cyl",s:[.3,.35,.6,8],p:[0,.3,0],c:0xE070A8,rep:[4,1,0,.5]},
  {g:"cone",s:[.3,.6,10],p:[0,.8,0],c:0xF0A0C8,rep:[4,1,0,.5]}
],["anemone","anemones","sea anemones"]);
S("merpalace","structure",[34,30,34],[
  {g:"cyl",s:[12,14,10,16],p:[0,5,0],c:0xE8C8B8},
  {g:"sph",s:[9],p:[0,12,0],c:0xF0D8C8},
  {g:"cyl",s:[1.4,2,22,10],p:[12,11,0],c:CORAL1},{g:"cone",s:[2,5,10],p:[12,24,0],c:CORAL2},
  {g:"cyl",s:[1.4,2,18,10],p:[-12,9,0],c:CORAL3},{g:"cone",s:[2,5,10],p:[-12,20,0],c:CORAL2},
  {g:"cyl",s:[1.2,1.8,16,10],p:[0,8,12],c:CORAL2},{g:"cone",s:[1.8,4,10],p:[0,18,12],c:CORAL1},
  {g:"sph",s:[1.4],p:[0,21,0],c:0xF2F0FF,glow:1,pulse:1},
  {g:"box",s:[3,5,.4],p:[0,2.5,14],c:"dark"}
],["mer palace","merfolk palace","palace under the sea","underwater palace","coral palace","palace of the sea","sea king's palace","sea queen's palace"]);
S("bubbles","infra",[3,12,3],[{g:"sph",s:[.2],p:[0,1,0],c:0xDFF4FF,glow:1,opa:.5}],["bubbles","column of bubbles","stream of bubbles","rising bubbles"]);
S("sunkenruins","structure",[24,10,24],[
  {g:"cyl",s:[1,1.1,8,10],p:[-8,4,-8],c:"stone"},{g:"cyl",s:[1,1.1,5,10],p:[8,2.5,-8],c:"stone"},
  {g:"cyl",s:[1,1.1,7,10],p:[-8,3.5,8],c:"stone"},{g:"box",s:[3,1,3],p:[8,.5,8],r:[.3,.2,.4],c:"stone"},
  {g:"box",s:[20,.6,20],p:[0,.3,0],c:"stone"},{g:"box",s:[9,1.2,2],p:[-8,8.6,0],c:"stone"}
],["sunken ruins","sunken city","drowned city","sunken temple","atlantean ruins","ruins under the water"]);
S("treasurechest","infra",[1.4,1.2,1],[
  {g:"box",s:[1.2,.7,.8],p:[0,.35,0],c:0x6B4A32},{g:"cyl",s:[.4,.4,1.2,10],p:[0,.75,0],r:[0,0,Math.PI/2],c:0x6B4A32},
  {g:"box",s:[1.24,.08,.84],p:[0,.3,0],c:GOLD},{g:"sph",s:[.12],p:[0,.9,.25],c:0xE8C27A,glow:1,pulse:1}
],["treasure chest","chest of treasure","treasure","chest of gold","pirate chest"]);

/* ---- The Heavens ---- */
S("cloudbank","nature",[20,6,14],[
  {g:"sph",s:[3.4],p:[0,2.4,0],c:0xF6F8FC},{g:"sph",s:[2.6],p:[3.6,2,1],c:0xF2F4FA},{g:"sph",s:[2.8],p:[-3.8,2.1,-.6],c:0xF4F6FC},
  {g:"sph",s:[2.2],p:[1.4,3.8,-1.2],c:0xFAFBFE},{g:"sph",s:[2],p:[-6.6,1.4,.8],c:0xEEF2FA}
],["cloud bank","bank of clouds","clouds to stand on","cloud island","cloud floor","walking on clouds"]);
S("goldengate","structure",[14,16,3],[
  {g:"cyl",s:[.9,1,14,12],p:[-5,7,0],c:GOLD},{g:"cyl",s:[.9,1,14,12],p:[5,7,0],c:GOLD},
  {g:"tor",s:[5,.5],p:[0,14,0],c:GOLD},
  {g:"box",s:[.12,11,.12],p:[-3.5,5.5,0],c:GOLD,rep:[8,1,0,0]},
  {g:"pln",s:[9,11],p:[0,5.5,0],c:0xFFF2D6,glow:1,opa:.25}
],["golden gates","pearly gates","gates of heaven","heaven's gate","golden gate of heaven"]);
S("lightpillar","nature",[4,60,4],[
  {g:"cyl",s:[1.5,1.5,60,16],p:[0,30,0],c:0xFFF2D6,glow:1,opa:.35,pulse:1}
],["pillar of light","beam of light","column of light","shaft of light","light from above"]);
S("cloudpalace","structure",[34,36,34],[
  {g:"sph",s:[10],p:[0,3,0],c:0xF6F8FC},{g:"sph",s:[7],p:[10,2,4],c:0xF2F4FA},{g:"sph",s:[7],p:[-10,2,-3],c:0xF2F4FA},
  {g:"cyl",s:[5,6,16,16],p:[0,16,0],c:0xF2EEE6},{g:"cone",s:[6,10,16],p:[0,29,0],c:GOLD},
  {g:"cyl",s:[1.6,1.8,14,10],p:[8,15,0],c:0xF2EEE6},{g:"cone",s:[2.2,5,10],p:[8,24.5,0],c:GOLD},
  {g:"cyl",s:[1.6,1.8,14,10],p:[-8,15,0],c:0xF2EEE6},{g:"cone",s:[2.2,5,10],p:[-8,24.5,0],c:GOLD}
],["cloud palace","palace in the clouds","castle in the clouds","castle in the sky","sky palace","celestial palace"]);
S("celestialstair","structure",[4,24,20],[
  {g:"box",s:[3,.3,1.4],p:[0,.4,-9],c:0xFFF2D6,glow:1,opa:.8,rep:[16,0,1.4,1.2]}
],["stairway to heaven","celestial stair","stairs into the sky","staircase of light","stairs of light","jacob's ladder"]);

/* ---- The Underworld and the Land of the Dead ---- */
S("styx","nature",[60,1,12],[
  {g:"box",s:[60,.1,10],p:[0,.06,0],c:0x0E1014},
  {g:"box",s:[60,.1,10],p:[0,.4,0],c:0x6A6E7A,glow:1,opa:.12}
],["river styx","the styx","river of the dead","black river","river of forgetting","lethe","river acheron","river of souls"]);
S("bonegate","structure",[12,11,3],[
  {g:"cyl",s:[.8,1,9,8],p:[-4.5,4.5,0],c:BONE},{g:"cyl",s:[.8,1,9,8],p:[4.5,4.5,0],c:BONE},
  {g:"box",s:[11,1.4,1.4],p:[0,9.6,0],c:BONE},
  {g:"sph",s:[.45],p:[-4,10.6,.4],c:BONE,rep:[9,1,0,0]},
  {g:"sph",s:[.12],p:[-4.1,10.7,.8],c:0x141210,rep:[9,1,0,0]}
],["gate of bones","bone gate","gate made of bones","gate of skulls","skull gate"]);
S("bonepile","nature",[5,2,5],[
  {g:"cyl",s:[.08,.08,1.4,5],p:[0,.3,0],r:[0,0,1.5],c:BONE,rep:[6,.3,.12,.25]},
  {g:"sph",s:[.24],p:[.6,.5,.3],c:BONE,rep:[4,-.5,.08,-.3]}
],["pile of bones","heap of bones","bones","skulls","pile of skulls"]);
S("chains","infra",[4,10,1],[
  {g:"tor",s:[.18,.05],p:[0,9,0],c:0x3A3C42,rep:[18,0,-.34,0]},
  {g:"tor",s:[.18,.05],p:[1.6,9,0],r:[0,Math.PI/2,0],c:0x3A3C42,rep:[14,0,-.34,0]}
],["chains","hanging chains","chains hung","great chains","shackles"]);
S("spiritlanterns","infra",[8,8,8],[
  {g:"box",s:[.4,.55,.4],p:[0,3,0],c:0xFFD08A,glow:1,opa:.85,pulse:1}
],["floating lanterns","spirit lanterns","lanterns floating","paper lanterns","lanterns in the air","lantern lights"]);
S("bonetree","nature",[8,10,8],[
  {g:"cyl",s:[.5,.9,6,8],p:[0,3,0],c:0xE8E4DA},
  {g:"cyl",s:[.15,.3,3.6,6],p:[1.2,6.6,0],r:[0,0,-.7],c:0xE8E4DA},{g:"cyl",s:[.15,.3,3.2,6],p:[-1.1,6.8,.4],r:[.2,0,.8],c:0xE8E4DA},
  {g:"cyl",s:[.1,.2,2.4,6],p:[.3,7.6,-1],r:[-.7,0,.1],c:0xE8E4DA}
],["white tree","bone tree","bleached tree","pale tree","tree of bone"]);
S("mistbank","nature",[24,4,12],[
  {g:"sph",s:[3],p:[0,1.2,0],c:0xDCE0E4,opa:.35,rep:[5,4,0,.8]}
],["wall of mist","bank of mist","mist rolled","sea of mist","thick mist","the mists"]);

/* ---- The Frozen Realm ---- */
S("icepalace","structure",[36,34,32],[
  {g:"box",s:[22,12,18],p:[0,6,0],c:ICE,opa:.82},
  {g:"cone",s:[3,16,6],p:[-9,20,-7],c:ICE,opa:.85},{g:"cone",s:[3,20,6],p:[9,22,-7],c:ICE,opa:.85},
  {g:"cone",s:[4,22,6],p:[0,23,0],c:0xDFF4FF,opa:.9},{g:"cone",s:[2.4,12,6],p:[-9,17,7],c:ICE,opa:.85},{g:"cone",s:[2.4,12,6],p:[9,17,7],c:ICE,opa:.85},
  {g:"box",s:[3.4,5,.4],p:[0,2.5,9.1],c:0x6A8AA8}
],["ice palace","ice castle","palace of ice","frozen palace","castle of ice","snow queen's palace"]);
S("icespire","nature",[6,18,6],[
  {g:"cone",s:[2.2,16,6],p:[0,8,0],c:ICE,opa:.85},{g:"cone",s:[1.2,9,6],p:[1.8,4.5,.8],r:[0,0,-.2],c:ICE,opa:.85}
],["ice spire","spire of ice","ice pillar","icebergs","iceberg"]);
S("igloo","structure",[6,3,6],[
  {g:"sph",s:[2.8],p:[0,0,0],c:0xF2F6FA},{g:"box",s:[1.2,1.2,1.6],p:[0,.6,2.6],c:0xF2F6FA},{g:"box",s:[.8,.9,.1],p:[0,.5,3.42],c:"dark"}
],["igloo","igloos","snow house","ice hut"]);
S("frozenlake","nature",[30,1,24],[
  {g:"cyl",s:[12,12,.12,28],p:[0,.06,0],c:0xBFD8E8},
  {g:"box",s:[6,.02,.05],p:[2,.14,1],r:[0,.7,0],c:0x8AA8C0,rep:[3,-2,0,1.4]}
],["frozen lake","frozen pond","lake of ice","ice lake","frozen river"]);
S("icecrystals","nature",[5,3,5],[
  {g:"cyl",s:[.1,.3,2.2,6],p:[0,1.1,0],c:ICE,glow:1,opa:.7,pulse:1},
  {g:"cyl",s:[.08,.25,1.5,6],p:[.6,.7,.3],r:[0,0,-.4],c:ICE,glow:1,opa:.7},
  {g:"cyl",s:[.08,.22,1.3,6],p:[-.5,.6,-.4],r:[.3,0,.5],c:ICE,glow:1,opa:.7}
],["ice crystals","icicles","frost crystals","crystals of ice"]);

/* ---- The Void and the Mirror World ---- */
S("voidshards","nature",[20,16,20],[
  {g:"ico",s:[1.4],p:[0,6,0],c:0x2A2A3C,rep:[5,3,1.6,-2]},
  {g:"ico",s:[.8],p:[-4,9,3],c:0x9AA4C8,glow:1,opa:.6,rep:[4,2.4,-1,1.5]}
],["floating shards","shards floating","floating debris","pieces of the world","broken pieces floating","fragments floating"]);
S("mirrormaze","structure",[20,4,20],[
  {g:"box",s:[6,3.2,.2],p:[-6,1.6,-6],c:0xDDE3EC},{g:"box",s:[.2,3.2,6],p:[-3,1.6,-3],c:0xDDE3EC},
  {g:"box",s:[6,3.2,.2],p:[3,1.6,0],c:0xDDE3EC},{g:"box",s:[.2,3.2,6],p:[6,1.6,4],c:0xDDE3EC},
  {g:"box",s:[6,3.2,.2],p:[-2,1.6,7],c:0xDDE3EC},{g:"box",s:[.2,3.2,5],p:[-8,1.6,3],c:0xDDE3EC}
],["hall of mirrors","mirror maze","maze of mirrors","room of mirrors","house of mirrors"]);
S("shardfield","nature",[12,1,12],[
  {g:"box",s:[.6,.02,.4],p:[0,.03,0],r:[0,.4,0],c:0xDDE3EC,glow:1,opa:.7,rep:[9,1.2,0,.8]}
],["broken glass","shattered glass","shards of glass","glass on the ground","shattered mirror"]);

/* ---- The Burning Lands (new) ---- */
S("obsidianspire","nature",[8,26,8],[
  {g:"cone",s:[3,24,5],p:[0,12,0],c:0x141216},{g:"cone",s:[1.4,10,5],p:[2.6,5,1],r:[0,0,-.25],c:0x1E1A20},
  {g:"box",s:[.2,20,.2],p:[.9,10,.9],c:0xFF7A1E,glow:1,opa:.8,pulse:1}
],["obsidian spire","black spire","spire of obsidian","black glass tower","volcanic glass"]);
S("firepillar","nature",[5,24,5],[
  {g:"cyl",s:[1.2,2,22,12],p:[0,11,0],c:0xFF7A1E,glow:1,opa:.75,pulse:1},
  {g:"cyl",s:[.6,1,24,10],p:[0,12,0],c:0xFFD08A,glow:1,opa:.8}
],["pillar of fire","column of fire","tower of flame","fire pillar","wall of fire"]);
S("emberfield","nature",[16,4,16],[
  {g:"sph",s:[.12],p:[0,.3,0],c:0xFF8A3A,glow:1,pulse:1,rep:[10,1.4,.2,.9]},
  {g:"cyl",s:[7,7,.05,24],p:[0,.04,0],c:0x3A1A10}
],["embers","field of embers","burning ground","hot coals","glowing coals","ash field"]);

/* ---- Among the Stars (new) ---- */
S("planet","nature",[60,60,60],[
  {g:"sph",s:[22],p:[0,90,0],c:0xC8784A},
  {g:"tor",s:[34,1.6],p:[0,90,0],r:[1.2,0,.3],c:0xE8D8B8,opa:.8}
],["a planet","planets","another planet in the sky","huge planet","ringed planet","saturn in the sky"]);
S("moonrock","nature",[10,4,10],[
  {g:"ico",s:[2.4],p:[0,1.2,0],c:0x9A9A9E},{g:"ico",s:[1.2],p:[2.6,.6,1.4],c:0x8A8A8E},
  {g:"cyl",s:[3,3.4,.3,20],p:[-4,.1,-2],c:0x7A7A7E}
],["moon rock","moon rocks","lunar surface","grey dust","surface of the moon"]);
S("starcrystal","infra",[4,6,4],[
  {g:"ico",s:[1.2],p:[0,3,0],c:0xF2F4FF,glow:1,opa:.85,pulse:1},
  {g:"ico",s:[.5],p:[1.4,4.2,.6],c:0xC8D8FF,glow:1,opa:.8}
],["fallen star","star on the ground","a star fell","piece of a star","star crystal","star that fell"]);

/* ---- Another World ---- */
S("alienflora","nature",[8,7,8],[
  {g:"cyl",s:[.15,.25,5,6],p:[0,2.5,0],c:0x4A6A7A,rep:[4,1.6,0,.8]},
  {g:"sph",s:[.6],p:[0,5.2,0],c:0x86F0C4,glow:1,opa:.85,pulse:1,rep:[4,1.6,0,.8]}
],["strange plants","alien plants","glowing plants","plants that glowed","unearthly plants","strange trees"]);
S("monolith","structure",[3,14,1.2],[
  {g:"box",s:[2.4,13,.8],p:[0,6.5,0],c:0x0E0E12}
],["monolith","black monolith","great slab","standing slab","obelisk of black stone"]);

/* ---- animated scenery ---- */
EFFECTS.kelp=function(g){ return function(t){ g.children.forEach(function(m,i){ m.rotation.z=Math.sin(t*.8+i)*.12; m.rotation.x=Math.sin(t*.6+i*1.7)*.08; }); }; };
EFFECTS.bubbles=function(g){ var p=particles(60,[1.2,12,1.2],0xDFF4FF,1.4,.7); g.add(p); return function(t,dt){ rise(p,dt,2.2,0); }; };
EFFECTS.spiritlanterns=function(g){ var base=g.children.map(function(m,i){ m.position.set(Math.cos(i*2.4)*3,3+i*.8,Math.sin(i*2.4)*3); return m.position.y; });
  for(var i=0;i<6;i++){ var c=g.children[0].clone(); c.position.set(Math.cos(i*1.1)*(2+i*.6),2.5+i*.7,Math.sin(i*1.1)*(2+i*.6)); g.add(c); base.push(c.position.y); }
  return function(t){ g.children.forEach(function(m,i){ if(base[i]!==undefined) m.position.y=base[i]+Math.sin(t*.7+i)*.4; }); }; };
EFFECTS.voidshards=function(g){ return function(t){ g.children.forEach(function(m,i){ m.rotation.x=t*.2+i; m.rotation.y=t*.15+i*2; m.position.y+=Math.sin(t+i)*.004; }); }; };
EFFECTS.emberfield=function(g){ var p=particles(80,[7,4,7],0xFF8A3A,1.2,.9); g.add(p); return function(t,dt){ rise(p,dt,.8,.1); }; };
EFFECTS.firepillar=function(g){ var p=particles(90,[2,24,2],0xFFB23A,1.4,.8); g.add(p); return function(t,dt){ rise(p,dt,5,0); }; };
EFFECTS.mistbank=function(g){ return function(t){ g.children.forEach(function(m,i){ m.position.x+=Math.sin(t*.2+i)*.01; }); }; };
EFFECTS.styx=function(g){ var p=particles(70,[28,2,4],0xA8B0C0,1.8,.4); p.position.y=.6; g.add(p); return function(t,dt){ swirl(p,dt,.05,.1,false); }; };

/* ---- two new worlds, and the mythic names that lead into every world ----
   run once realms.js has loaded */
var realmsExtended=false;
function extendRealms(){
  if(realmsExtended) return; realmsExtended=true;
  REALMS.templerow={name:"Temple Row",ground:0x6A7058,tex:"grass",amp:4,path:0x8A8470,skyTop:0x1A2A56,skyLow:0xC8A8D8,
    dens:.05,light:0xF0ECFF,amb:1.1,sun:.95,stars:.3,mix:["human","human"]};
  REALMS.hall={name:"The Hall of Doors",ground:0x1A1A24,tex:"marble",path:0x2A2A38,skyTop:0x05060E,skyLow:0x1E1840,
    dens:.05,light:0xD8DCFF,amb:1.2,sun:.5,stars:1,mix:[]};
  REALMS.somnucor={name:"Somnucor",ground:0x55684A,tex:"grass",amp:7,path:0x5A6070,skyTop:0x24306A,skyLow:0x8A6AB8,
    dens:.04,light:0xF0ECFF,amb:0.95,sun:0.9,stars:.45,daynight:true,mix:["human","human","child"]};
  REALMS.fire={name:"The Burning Lands",ground:0x2A1A14,tex:"earth",path:0x4A2A1C,skyTop:0x1A0604,skyLow:0xC24A14,dens:1.8,light:0xFF9A5A,amb:.5,sun:.5,stars:0};
  REALMS.stars={name:"Among the Stars",ground:0x7E7E84,tex:"sand",path:0x9A9AA0,skyTop:0x000002,skyLow:0x06060E,dens:.55,light:0xE8ECFF,amb:.6,sun:.8,stars:1};
  REALMS.fire.mix=["fireelemental","imp","demon","fireelemental"];
  REALMS.stars.mix=["airelemental","ghost","floatingeye"];
  REALMS.depths.name="The Deep";
  REALMS.faerie.mix=["fairy","pixie","elf","fairy","gnome","nymph","satyr","unicorn","centaur","goblin"];
  REALMS.depths.mix=["fish","merman","mermaid","fish","jellyfish","dolphin","seahorse","crab","octopus","eel","shark"];
  REALMS.underworld.mix=["shadow","skeleton","ghost","demon","imp","shadow","wraith"];
  REALMS.heavens.mix=["angel","bird","angel","pegasus"];
  REALMS.void.mix=["shadow","floatingeye","wraith"];
  REALMS.dead.mix=["ghost","shadow","human","skeleton","banshee"];
  REALMS.frozen.mix=["mammoth","bird","dog","frostgiant"];
  REALMS.elsewhere.mix=["creature","human","golem","shadow","airelemental"];
  REALM_WORDS.push(["fire",["muspelheim","realm of fire","land of fire","the burning lands","world of fire","the fire realm","a world of flame"]]);
  REALM_WORDS.push(["stars",["outer space","into space","among the stars","on the moon","to the moon","the cosmos","another planet","on another planet","into the stars","through the stars"]]);
  (function(){
    var more={
      underworld:["duat","mictlan","xibalba","yomi","helheim","tartarus","irkalla","naraka","diyu","sheol","the pit"],
      heavens:["olympus","mount olympus","asgard","valhalla","svarga","the pure land","the celestial court","the jade palace"],
      faerie:["annwn","tir na nog","avalon","the summer country","hy-brasil","mag mell","the sidhe","the fairy mound"],
      depths:["atlantis","lyonesse","beneath the waves","under the waves","the mer kingdom","mermaid kingdom","kingdom under the sea","the sunken kingdom"],
      frozen:["niflheim","jotunheim","the frozen north","the land of winter","endless winter"],
      dead:["the halls of the dead","realm of the dead","the grey lands","asphodel","the fields of asphodel"]
    };
    REALM_WORDS.forEach(function(r){ if(more[r[0]]) r[1]=r[1].concat(more[r[0]]); });
  })();
}

/* what grows up around the way in, the first time a world is reached */
var REALM_SCENERY={
  faerie:["fairyring","toadstoolhouse","hollowtree","glowflowers","faethrone","moonpool","briar","giantmushroom","wisps","glowflowers","standingstones","fairyring"],
  depths:["coral","kelp","shipwreck","giantclam","anemones","merpalace","bubbles","sunkenruins","treasurechest","coral","kelp","kelp"],
  heavens:["cloudbank","goldengate","lightpillar","cloudpalace","celestialstair","cloudbank","cloudbank"],
  underworld:["styx","bonegate","bonepile","chains","spiritfire","lavaflow","bonepile","deadtree"],
  dead:["spiritlanterns","bonetree","mistbank","graveyard","deadtree","spiritlanterns","mistbank"],
  frozen:["icepalace","icespire","igloo","frozenlake","icecrystals","pine","icespire","icecrystals"],
  void:["voidshards","floatingisland","voidshards","orb"],
  mirror:["mirrormaze","shardfield","mirrorstand","mirrorstand"],
  fire:["obsidianspire","firepillar","emberfield","lavaflow","volcano","obsidianspire","emberfield"],
  stars:["planet","moonrock","starcrystal","floatingisland","moonrock","crater"],
  elsewhere:["alienflora","monolith","crystalspire","alienflora","standingstones"]
};
function realmScenery(r){
  var list=REALM_SCENERY[r.kind]; if(!list||r.dressed) return;
  r.dressed=true;
  /* set out around the world's own ground, not around the town */
  var h=(r.grid&&typeof blockOrigin==="function")?blockOrigin(r.grid.bx,r.grid.bz):heartOf(r.id);
  list.forEach(function(arch,i){
    if(!KIT[arch]) return;
    var a=i*2.39996+.7, rad=70+(i%4)*38+((i*37)%23);
    if(arch==="planet") rad=260;
    var spec={id:uid(),archetype:arch,label:null,attrs:{},x:h.x+Math.cos(a)*rad,z:h.z+Math.sin(a)*rad,rot:(i*1.7)%6.283,
      solid:false,detail:1,nights:[store.session],realm:r.id,scenery:true,addr:null,name:null};
    store.objects.push(spec); addMesh(spec);
  });
}

