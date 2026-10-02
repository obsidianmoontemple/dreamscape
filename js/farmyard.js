/* SomnuMatrix — farmyard.js
   things the city asked for that the Atlas could not yet build: the animals of a
   farm, the sheds and stacks that go with them, and a few civic pieces — a museum,
   an obelisk, a roadside shrine, a pond.
   loaded as a plain script; shares scope with the other files */
"use strict";

var TIMBER=0x6B4A32, HAYC=0xD8B45A, STONEG=0x9A958A;

/* ---- the yard ---- */
S("crates","infra",[2.4,1.8,2.4],[
  {g:"box",s:[1,1,1],p:[-.55,.5,-.3],r:[0,.2,0],c:0x8A6A44},
  {g:"box",s:[1,1,1],p:[.55,.5,.25],r:[0,-.15,0],c:0x7A5C3C},
  {g:"box",s:[.9,.9,.9],p:[0,1.45,-.05],r:[0,.35,0],c:0x8A6A44},
  {g:"box",s:[1.04,.08,.1],p:[-.55,.5,.21],c:0x5A4430}
],["crates","a stack of crates","wooden boxes","packing cases","crate"]);
S("barrel","infra",[1.2,1.2,1.2],[
  {g:"cyl",s:[.42,.36,1.1,14],p:[0,.55,0],c:0x7A5230},
  {g:"tor",s:[.42,.05],p:[0,.25,0],r:[Math.PI/2,0,0],c:0x4A4238},
  {g:"tor",s:[.42,.05],p:[0,.85,0],r:[Math.PI/2,0,0],c:0x4A4238}
],["barrel","a barrel","cask","keg","barrels"]);
S("haybale","nature",[1.8,1.4,1.8],[
  {g:"cyl",s:[.7,.7,1.5,14],p:[0,.7,0],r:[0,0,1.5708],c:HAYC},
  {g:"tor",s:[.7,.05],p:[-.7,.7,0],r:[0,1.5708,0],c:0xC8A44A}
],["hay bale","bale of hay","round bale","hay","straw bale"]);
S("silo","structure",[5,14,5],[
  {g:"cyl",s:[2,2,11,16],p:[0,5.5,0],c:0xC8CCD2},
  {g:"cone",s:[2.2,2,16],p:[0,12,0],c:0x8A8C92},
  {g:"cyl",s:[.1,.1,11,6],p:[2,5.5,0],c:0x6A6C72,rep:[4,0,0,0]},
  {g:"box",s:[1,1.4,.2],p:[0,.7,2],c:0x4A4238}
],["silo","grain silo","feed silo","farm silo"]);
S("farmhouse","structure",[12,9,10],[
  {g:"box",s:[10,4.4,8],p:[0,2.2,0],c:0xE8E2D2},
  {g:"box",s:[11,.5,5],p:[0,5.2,-2],r:[.62,0,0],c:0x6E4A3A},
  {g:"box",s:[11,.5,5],p:[0,5.2,2],r:[-.62,0,0],c:0x6E4A3A},
  {g:"box",s:[1.2,2.2,.2],p:[0,1.1,4.1],c:0x5A3A2A},
  {g:"box",s:[1.4,1.2,.16],p:[-3,2.6,4.05],c:"glass",rep:[2,6,0,0]},
  {g:"box",s:[1,2.4,1],p:[3,6.4,-1],c:0xB84A3A},
  {g:"box",s:[3.4,.2,2],p:[0,2.9,4.9],c:0x6E4A3A},
  {g:"cyl",s:[.1,.12,2.6,6],p:[-1.5,1.4,4.8],c:TIMBER},{g:"cyl",s:[.1,.12,2.6,6],p:[1.5,1.4,4.8],c:TIMBER}
],["farm house","the farm","homestead","farmstead"]);
S("stable","structure",[10,6,7],[
  {g:"box",s:[9,3.4,6],p:[0,1.7,0],c:0x8A5A3A},
  {g:"box",s:[9.6,.4,4],p:[0,4.1,-1.4],r:[.5,0,0],c:0x5A4232},
  {g:"box",s:[9.6,.4,4],p:[0,4.1,1.4],r:[-.5,0,0],c:0x5A4232},
  {g:"box",s:[2,1.6,.14],p:[-2.4,1.2,3.05],c:0x4A3222,rep:[3,2.4,0,0]},
  {g:"box",s:[2,.9,.16],p:[-2.4,2.5,3.05],c:0x2A1E16,rep:[3,2.4,0,0]}
],["stable","stables","horse stable","loose boxes"]);
S("tractor","vehicle",[2.6,2.6,4.2],[
  {g:"box",s:[1.6,1,2.6],p:[0,1.2,-.2],c:0x2E7A3A},
  {g:"box",s:[1.2,1,1.2],p:[0,2,-.8],c:0x2E7A3A},
  {g:"box",s:[1.1,.8,.1],p:[0,2.1,-.2],c:"glass"},
  {g:"cyl",s:[.9,.9,.5,14],p:[-1,.9,-1],r:[0,0,1.5708],c:0x1A1C20},
  {g:"cyl",s:[.9,.9,.5,14],p:[1,.9,-1],r:[0,0,1.5708],c:0x1A1C20},
  {g:"cyl",s:[.45,.45,.4,12],p:[-.85,.45,1.4],r:[0,0,1.5708],c:0x1A1C20},
  {g:"cyl",s:[.45,.45,.4,12],p:[.85,.45,1.4],r:[0,0,1.5708],c:0x1A1C20},
  {g:"cyl",s:[.09,.09,.9,6],p:[.5,2.4,.6],c:0x3A3C42}
],["tractor","a tractor","farm tractor"]);
S("pond","nature",[9,1,7],[
  {g:"cyl",s:[3.4,3.6,.4,22],p:[0,.1,0],c:"water"},
  {g:"cyl",s:[3.9,4.1,.5,22],p:[0,.04,0],c:0x6A6A5A},
  {g:"cyl",s:[.5,.5,.06,10],p:[1.2,.32,.6],c:0x3F7A3A,rep:[3,-.9,0,-.5]},
  {g:"cyl",s:[.05,.05,1,5],p:[-2.8,.5,1.4],c:0x6A8A3A,rep:[5,.15,0,.12]}
],["pond","a pond","duck pond","farm pond","still water"]);

/* ---- civic ---- */
S("museum","structure",[24,13,16],[
  {g:"box",s:[22,8,14],p:[0,4,0],c:0xE6E2D6},
  {g:"box",s:[23,.7,15],p:[0,8.4,0],c:0xC8C2B4},
  {g:"box",s:[10,1,3],p:[0,9.4,5],r:[0,0,0],c:0xE6E2D6},
  {g:"cyl",s:[.7,.7,7,14],p:[-4,3.5,7.4],c:0xF2EEE2,rep:[5,2,0,0]},
  {g:"box",s:[12,.8,2.4],p:[0,7.6,7.4],c:0xE6E2D6},
  {g:"box",s:[3,4,.3],p:[0,2,7.05],c:0x4A4238},
  {g:"box",s:[2,1.6,.2],p:[-7,4.4,7.05],c:"glass",rep:[3,7,0,0]},
  {g:"box",s:[9,.3,4],p:[0,.15,9],c:0xC8C2B4}
],["museum","the museum","gallery of antiquities","hall of exhibits","art gallery"]);
S("obelisk","structure",[3,16,3],[
  {g:"box",s:[2.6,1,2.6],p:[0,.5,0],c:STONEG},
  {g:"box",s:[1.5,12,1.5],p:[0,7,0],c:0xB8A890},
  {g:"cone",s:[1.05,2,4],p:[0,14,0],r:[0,.785,0],c:GOLD}
],["obelisk","a great obelisk","needle of stone","standing needle"]);
S("shrine","structure",[3,3.6,2.6],[
  {g:"box",s:[2.4,.4,2],p:[0,.2,0],c:STONEG},
  {g:"box",s:[1.8,1.8,1.4],p:[0,1.3,0],c:0xD8D2C4},
  {g:"box",s:[2.4,.3,2],p:[0,2.35,0],r:[0,0,0],c:0x6E4A3A},
  {g:"box",s:[2,.9,2.2],p:[0,2.8,0],r:[.5,0,0],c:0x6E4A3A},
  {g:"box",s:[1,1.2,.1],p:[0,1.3,.75],c:0x2A2622},
  {g:"cyl",s:[.05,.05,.3,6],p:[-.6,2.6,.7],c:0xF2EEE6},
  {g:"cone",s:[.05,.12,5],p:[-.6,2.8,.7],c:0xFFD08A,glow:1,pulse:1},
  {g:"cyl",s:[.05,.05,.3,6],p:[.6,2.6,.7],c:0xF2EEE6},
  {g:"cone",s:[.05,.12,5],p:[.6,2.8,.7],c:0xFFD08A,glow:1,pulse:1}
],["shrine","roadside shrine","wayside shrine","little shrine","a shrine by the road"]);

/* ---- the animals ---- */
C("cow",["cow","cows","cattle","a heifer","dairy cow","bullock"],"beast",
  {col:0xE8E4DA,body:"horse",s:1.05,feats:["horns","patches"]});
C("sheep",["sheep","a ewe","lamb","flock of sheep","ram"],"beast",
  {col:0xF0EDE4,body:"boar",s:.72,feats:["wool"]});
C("pig",["pigs","sow","piglet"],"beast",{col:0xE8B0A8,body:"boar",s:.85});
C("goat",["goat","goats","a nanny goat","billy goat","kid goat"],"beast",
  {col:0xD8D2C4,body:"boar",s:.7,feats:["horns"]});
C("chicken",["chicken","chickens","hen","hens","rooster","cockerel","a clutch of hens"],"flyer",
  {col:0xE8E4DA,s:.32,feats:["comb"]});
C("stag",["stag","a deer","doe","hart","fawn","deer in the trees"],"beast",
  {col:0x9A7A52,body:"horse",s:.92,feats:["antlers"]});
C("owl",["owl","an owl","barn owl","owl in the tree","tawny owl"],"flyer",
  {col:0xB8A88A,s:.45,feats:["bigeyes"]});
C("gull",["gull","gulls","seagull","seagulls","herring gull"],"flyer",{col:0xF2F2EC,s:.4});
S("fishingboat","vehicle",[3.4,3,9],[
  {g:"box",s:[2.4,1.2,7.6],p:[0,.8,0],c:0x3A5A7A},
  {g:"box",s:[2.6,.2,7.8],p:[0,1.45,0],c:0xD8D2C4},
  {g:"cone",s:[1.2,1.6,4],p:[0,.9,4.2],r:[Math.PI/2,0,0],c:0x3A5A7A},
  {g:"box",s:[1.6,1.4,1.8],p:[0,2.1,-1.6],c:0xE8E4DA},
  {g:"cyl",s:[.08,.08,3.4,6],p:[0,3.4,1],c:0x6B4A32},
  {g:"box",s:[.9,.6,.06],p:[.5,3.8,1],c:0xC8763A}
],["fishing boat","trawler","little fishing boat","smack"]);

/* ---- ground you can lay: squares, lawns, snow, sand, orchard floor ---- */
S("groundpad","infra",[20,.12,20],[
  {g:"box",s:[21.4,.12,21.4],p:[0,.06,0],c:0x4E525C}
],["paved square","a paved area","flagstones","plaza floor"]);
S("lawn","nature",[20,.12,20],[
  {g:"box",s:[21.4,.12,21.4],p:[0,.06,0],c:0x3E6434}
],["a stretch of grass","green sward","mown grass","lawn of grass"]);
S("snowfield","nature",[20,.14,20],[
  {g:"box",s:[21.4,.14,21.4],p:[0,.07,0],c:0xDCE4EC}
],["snow on the ground","a field of snow","snowfield","fresh snow"]);
S("blossomground","nature",[20,.14,20],[
  {g:"box",s:[21.4,.12,21.4],p:[0,.06,0],c:0x47713A},
  {g:"box",s:[21,.02,21],p:[0,.13,0],c:0xD8AEC4}
],["fallen blossom","petals on the ground","blossom underfoot"]);
S("leaffall","nature",[20,.14,20],[
  {g:"box",s:[21.4,.12,21.4],p:[0,.06,0],c:0x585A32},
  {g:"box",s:[21,.02,21],p:[0,.13,0],c:0xA85F30}
],["fallen leaves","leaves on the ground","leaf fall","drifts of leaves"]);

/* ---- the pieces the new quarters wanted ---- */
S("teahouse","structure",[10,7,12],[
  {g:"box",s:[9,3.6,11],p:[0,1.8,0],c:0x6B5A46},
  {g:"box",s:[10,.3,12],p:[0,3.8,0],c:0x3A3C42},
  {g:"box",s:[10.4,.4,4],p:[0,4.7,-3.6],r:[.5,0,0],c:0x3A3C42},
  {g:"box",s:[10.4,.4,4],p:[0,4.7,3.6],r:[-.5,0,0],c:0x3A3C42},
  {g:"box",s:[6.4,2.4,.12],p:[0,1.6,5.55],c:0xF0E8D0},
  {g:"box",s:[.08,2.4,.08],p:[-2.6,1.6,5.62],c:0x4A3A2A,rep:[7,.87,0,0]},
  {g:"box",s:[1.1,2.2,.2],p:[3,1.1,5.6],c:0x2A2622},
  {g:"sph",s:[.3],p:[2,3.2,5.7],c:0xC0392B,glow:1,pulse:1}
],["teahouse","tea house","chashitsu","a house for tea"]);
S("tenementblock","structure",[16,18,12],[
  {g:"box",s:[15,16,11],p:[0,8,0],c:0xB8A492},
  {g:"box",s:[15.6,.5,11.6],p:[0,16.3,0],c:0x7A6A58},
  {g:"box",s:[1.5,1.8,.2],p:[-5,3,5.6],c:"glass",rep:[4,3.3,0,0]},
  {g:"box",s:[1.5,1.8,.2],p:[-5,7,5.6],c:"glass",rep:[4,3.3,0,0]},
  {g:"box",s:[1.5,1.8,.2],p:[-5,11,5.6],c:"glass",rep:[4,3.3,0,0]},
  {g:"box",s:[1.5,1.8,.2],p:[-5,14.6,5.6],c:"glass",rep:[4,3.3,0,0]},
  {g:"box",s:[13,.2,1.4],p:[0,5.2,6.2],c:0x5A5248},
  {g:"box",s:[13,.2,1.4],p:[0,9.2,6.2],c:0x5A5248},
  {g:"box",s:[.1,4,.1],p:[-6,7,6.8],c:0x4A4238,rep:[6,2.4,0,0]},
  {g:"box",s:[1.6,2.6,.3],p:[0,1.3,5.7],c:0x3A2E26}
],["tenement","tenement block","block of flats with a fire escape","walk-up block"]);
S("washing","infra",[9,4,1],[
  {g:"cyl",s:[.06,.06,3.4,6],p:[-4.2,1.7,0],c:0x6B4A32},
  {g:"cyl",s:[.06,.06,3.4,6],p:[4.2,1.7,0],c:0x6B4A32},
  {g:"cyl",s:[.01,.01,8.4,3],p:[0,3.2,0],r:[0,0,Math.PI/2],c:0xE8E4DA},
  {g:"box",s:[.7,1,.02],p:[-3,2.7,0],c:0xE8E4DA,rep:[4,1.1,0,0]},
  {g:"box",s:[.6,.8,.02],p:[1.4,2.8,0],c:0x6AB8E8,rep:[3,1,0,0]}
],["washing on a line","laundry strung across","clothes line","washing line"]);
S("crane","infra",[8,22,14],[
  {g:"box",s:[3,3,3],p:[0,1.5,0],c:0xE8A63A},
  {g:"cyl",s:[.5,.6,18,8],p:[0,10,0],c:0xE8A63A},
  {g:"box",s:[.8,.8,13],p:[0,19,3],c:0xE8A63A},
  {g:"box",s:[.6,.6,4],p:[0,19,-4],c:0xE8A63A},
  {g:"cyl",s:[.02,.02,9,4],p:[0,14.6,8],c:0x3A3C42},
  {g:"box",s:[1,.8,1],p:[0,10.2,8],c:0x4A4238},
  {g:"box",s:[1.4,1.2,1.4],p:[0,19,-1],c:0x2A2C30}
],["crane","dock crane","loading crane","gantry crane"]);
S("kiln","structure",[9,14,9],[
  {g:"cyl",s:[3.4,3.8,7,14],p:[0,3.5,0],c:0xB06A3A},
  {g:"cone",s:[3.4,4,14],p:[0,9,0],c:0xA05A32},
  {g:"cyl",s:[1,1,3,10],p:[0,12,0],c:0x8A4A2A},
  {g:"box",s:[1.6,2,.4],p:[0,1,3.6],c:0x2A1E16},
  {g:"box",s:[1.2,.6,.2],p:[0,1.2,3.75],c:0xFF8A2E,glow:1,pulse:1},
  {g:"tor",s:[3.6,.2],p:[0,5.4,0],r:[Math.PI/2,0,0],c:0x6A4A2A}
],["kiln","bottle kiln","brick kiln","pottery kiln"]);
S("cart","vehicle",[2,2,3.4],[
  {g:"box",s:[1.6,.8,2.8],p:[0,1,0],c:0x7A5230},
  {g:"box",s:[1.7,.12,2.9],p:[0,1.45,0],c:0x8A6238},
  {g:"cyl",s:[.6,.6,.16,12],p:[-.85,.6,-.6],r:[0,0,1.5708],c:0x4A3222},
  {g:"cyl",s:[.6,.6,.16,12],p:[.85,.6,-.6],r:[0,0,1.5708],c:0x4A3222},
  {g:"cyl",s:[.07,.07,2.4,6],p:[-.5,.9,2.2],r:[.1,0,0],c:0x6B4A32},
  {g:"cyl",s:[.07,.07,2.4,6],p:[.5,.9,2.2],r:[.1,0,0],c:0x6B4A32}
],["handcart","a cart","barrow cart","wooden cart"]);

/* a classical temple: columns, pediment, and a step up to it */
S("temple","structure",[18,13,26],[
  {g:"box",s:[17,1.6,25],p:[0,.8,0],c:0xE8E4D8},
  {g:"box",s:[15,1,23],p:[0,1.8,0],c:0xF0ECE0},
  {g:"box",s:[10,7,17],p:[0,5.3,-1],c:0xE6E2D4},
  {g:"cyl",s:[.75,.8,8,14],p:[-6.4,5.8,9.6],c:0xF2EEE2,rep:[5,3.2,0,0]},
  {g:"cyl",s:[.75,.8,8,14],p:[-6.4,5.8,-9.6],c:0xF2EEE2,rep:[5,3.2,0,0]},
  {g:"cyl",s:[.75,.8,8,14],p:[-6.4,5.8,4],c:0xF2EEE2,rep:[2,12.8,0,0]},
  {g:"cyl",s:[.75,.8,8,14],p:[-6.4,5.8,-4],c:0xF2EEE2,rep:[2,12.8,0,0]},
  {g:"box",s:[15.4,1.4,25.4],p:[0,10.4,0],c:0xE8E4D8},
  {g:"box",s:[14,3,3],p:[0,12.2,11.6],r:[0,0,0],c:0xF0ECE0},
  {g:"box",s:[3,3,14],p:[7,12.2,0],r:[0,0,0],c:0xF0ECE0},
  {g:"box",s:[3.4,5.6,.4],p:[0,4.6,7.6],c:0x3A322A},
  {g:"box",s:[16,.4,2.4],p:[0,.3,13.4],c:0xE8E4D8}
],["temple","a temple","colonnaded temple","house of a god","pillared temple"]);

