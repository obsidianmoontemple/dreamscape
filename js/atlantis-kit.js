/* SomnuMatrix — atlantis-kit.js
   what the risen city is dressed in: grand sacred houses for Temple Row, the
   gates, gardens and fountains of the High Ring, the arches that stand over
   every stairway, lamps and banners for the streets, the Gaol's walls and
   towers, and the furniture every trade in the city works among.
   loaded as a plain script; shares scope with the other files */
"use strict";

var ATL_GOLD=0xD9B45A, ATL_MARBLE=0xF1ECE0, ATL_DEEP=0x24304A, ATL_CYAN=0x7FE6FF, ATL_BRONZE=0x8A6A3A;


/* ---------------------------------------------------------------- the Warrens' own clutter */
var SLUMWOOD=0x5E4A36, SLUMGREY=0x6A6660, TARP1=0x4E6A7A, TARP2=0x7A5A3A, SOOT=0x2C2A28;
S("leanto","structure",[5,3,4],[
  {g:"cyl",s:[.07,.08,2.8,6],p:[-2.2,1.4,1.6],c:SLUMWOOD},{g:"cyl",s:[.07,.08,2.8,6],p:[2.2,1.4,1.6],c:SLUMWOOD},
  {g:"cyl",s:[.07,.08,1.4,6],p:[-2.2,.7,-1.6],c:SLUMWOOD},{g:"cyl",s:[.07,.08,1.4,6],p:[2.2,.7,-1.6],c:SLUMWOOD},
  {g:"box",s:[4.8,.05,3.8],p:[0,2.1,0],r:[.38,0,0],c:TARP1},
  {g:"box",s:[1.2,.8,.9],p:[-1.2,.4,-.9],c:SLUMWOOD},{g:"box",s:[1.6,.25,1.8],p:[.9,.13,-.4],c:0x7A6A58}
],["lean-to","tarp shelter","makeshift tent"]);
S("rubble","infra",[4,1.4,4],[
  {g:"box",s:[1.6,.7,1.2],p:[-.6,.35,.2],r:[0,.4,.1],c:SLUMGREY},{g:"box",s:[1,.5,1.3],p:[.8,.25,-.3],r:[.1,-.3,0],c:0x7A746A},
  {g:"box",s:[.9,.9,.8],p:[.1,.6,.9],r:[.3,.2,.2],c:0x8A8276},{g:"box",s:[2.4,.08,.18],p:[.2,.9,-.6],r:[0,.6,.35],c:SLUMWOOD},
  {g:"sph",s:[.45,6,5],p:[-1.4,.2,-1],c:0x5E5A54}
],["rubble","heap of bricks","broken stone"]);
S("puddle","infra",[3,.05,2],[
  {g:"cyl",s:[1.4,1.4,.02,18],p:[0,.03,0],c:0x2A3440,opa:.85}
],["puddle","puddles"]);
S("handpump","infra",[2.4,2,1.2],[
  {g:"cyl",s:[.14,.16,1.4,8],p:[0,.7,0],c:0x2E3236},{g:"box",s:[.9,.08,.08],p:[.4,1.45,0],r:[0,0,-.4],c:0x2E3236},
  {g:"cyl",s:[.06,.06,.4,6],p:[0,1.1,.25],r:[1.4,0,0],c:0x2E3236},
  {g:"box",s:[1.8,.5,.8],p:[.2,.25,.7],c:SLUMWOOD},{g:"box",s:[1.6,.05,.6],p:[.2,.46,.7],c:0x3A5060}
],["water pump","hand pump","village pump"]);
S("pallets","infra",[2,1,1.4],[
  {g:"box",s:[1.6,.14,1.2],p:[0,.07,0],c:0x8A6A42,rep:[1,0,0,0],rep2:[5,0,.18,0]},
  {g:"box",s:[1.5,.14,1.1],p:[.1,1.05,0],r:[0,.3,0],c:0x7A5E3A}
],["pallets","stacked pallets"]);
S("sacks","infra",[2,1,1.6],[
  {g:"sph",s:[.45,8,6],p:[-.4,.32,0],c:0x9A8256},{g:"sph",s:[.45,8,6],p:[.45,.3,.2],c:0x8E7650},
  {g:"sph",s:[.4,8,6],p:[0,.78,.05],c:0xA48C5E},{g:"sph",s:[.42,8,6],p:[.2,.3,-.6],c:0x86704C}
],["sacks","sacks of grain","bags"]);
S("brokencart","infra",[3,1.6,2],[
  {g:"box",s:[2.4,.7,1.4],p:[0,.75,0],r:[0,0,.22],c:SLUMWOOD},
  {g:"tor",s:[.55,.07,6,12],p:[-.6,.55,.75],c:0x3A2E24},{g:"tor",s:[.55,.07,6,12],p:[.9,.15,-.6],r:[1.5,0,0],c:0x3A2E24},
  {g:"cyl",s:[.04,.04,1.8,5],p:[1.5,.5,0],r:[0,0,1.2],c:SLUMWOOD}
],["broken cart","abandoned cart","wrecked cart"]);
S("boardedshack","structure",[5,4,4.4],[
  {g:"box",s:[4.6,2.8,4],p:[0,1.4,0],c:0x6E5A44},
  {g:"box",s:[4.7,.12,.22],p:[0,.5,2.02],c:0x5A4834,rep:[1,0,0,0],rep2:[6,0,.45,0]},
  {g:"box",s:[5.2,.1,4.8],p:[0,3,0],r:[0,0,.1],c:0x7A7468},
  {g:"box",s:[1.1,2,.1],p:[-1.1,1,2.05],c:SOOT},
  {g:"box",s:[.9,.7,.06],p:[1.2,1.7,2.05],c:0x6A6058},{g:"box",s:[1.1,.08,.08],p:[1.2,1.7,2.1],r:[0,0,.6],c:0x5A4834},
  {g:"cyl",s:[.2,.22,1.4,8],p:[1.6,3.6,-1],c:0x4A4642}
],["boarded shack","shack","hovel"]);
S("ragline","infra",[8,3.4,.6],[
  {g:"cyl",s:[.05,.06,3.2,5],p:[-3.8,1.6,0],c:SLUMWOOD},{g:"cyl",s:[.05,.06,3.2,5],p:[3.8,1.6,0],c:SLUMWOOD},
  {g:"cyl",s:[.01,.01,7.6,3],p:[0,3,0],r:[0,0,Math.PI/2],c:0xCFC6B4},
  {g:"box",s:[.6,.9,.02],p:[-2.8,2.5,0],c:0xA0523A},{g:"box",s:[.5,.7,.02],p:[-1.7,2.6,0],c:0x5A6E4A},
  {g:"box",s:[.7,1.1,.02],p:[-.5,2.4,0],c:0xB8A880},{g:"box",s:[.5,.6,.02],p:[.7,2.65,0],c:0x6A4A7A},
  {g:"box",s:[.8,.9,.02],p:[1.9,2.5,0],c:0x8A8070},{g:"box",s:[.4,.5,.02],p:[3,2.7,0],c:0xC0603A}
],["rags on a line","patched washing"]);
S("dimlamp","infra",[1,4,1],[
  {g:"cyl",s:[.07,.09,3.6,6],p:[0,1.8,0],r:[0,0,.06],c:0x3A3632},
  {g:"box",s:[.5,.08,.08],p:[.2,3.55,0],c:0x3A3632},
  {g:"sph",s:[.16,8,6],p:[.42,3.38,0],c:0xE8B060,glow:1}
],["gas lamp","dim lamp","old street lamp"]);
S("soupkitchen","structure",[8,4,6],[
  {g:"box",s:[7,3,5],p:[0,1.5,0],c:0x7A6450},
  {g:"box",s:[7.6,.15,6.2],p:[0,3.1,.4],r:[.08,0,0],c:0x5A4A3A},
  {g:"box",s:[5,.9,1],p:[0,.45,3.2],c:SLUMWOOD},
  {g:"cyl",s:[.55,.5,.7,12],p:[-1.5,1.25,3.2],c:0x3A3A3A},{g:"cyl",s:[.55,.5,.7,12],p:[1.4,1.25,3.2],c:0x3A3A3A},
  {g:"box",s:[2.4,.6,.1],p:[0,2.6,2.56],c:0xE8DCC0}
],["soup kitchen","food bank","charity kitchen"],{sign:[0,2.6,2.62,2.4,.6]});

/* ---------------------------------------------------------------- sacred */
S("grandtemple","structure",[24,17,36],[
  {g:"box",s:[24,1.2,36],p:[0,.6,0],c:0xE6E0D2},
  {g:"box",s:[22,1,34],p:[0,1.7,0],c:ATL_MARBLE},
  {g:"box",s:[20,.8,32],p:[0,2.6,0],c:0xF4F0E6},
  {g:"cyl",s:[.75,.85,9.4,14],p:[-9,7.7,-14.2],c:ATL_MARBLE,rep:[6,3.6,0,0],rep2:[2,0,0,28.4]},
  {g:"cyl",s:[.75,.85,9.4,14],p:[-9,7.7,-10.2],c:ATL_MARBLE,rep:[2,18,0,0],rep2:[6,0,0,4.1]},
  {g:"box",s:[13,8.6,24],p:[0,7.3,0],c:0xE8E2D2},
  {g:"box",s:[21,1.6,33],p:[0,13.2,0],c:0xEDE7DA},
  {g:"box",s:[21.4,.4,33.4],p:[0,12.4,0],c:ATL_GOLD},
  {g:"cone",s:[15,4.4,4],p:[0,16.1,0],r:[0,.785,0],c:0xE4DCCA},
  {g:"box",s:[1.2,1.8,1.2],p:[0,19,-16],c:ATL_GOLD},{g:"box",s:[1.2,1.8,1.2],p:[0,19,16],c:ATL_GOLD},
  {g:"box",s:[3.2,5,.3],p:[0,5.4,12.05],c:0x3A2A1E},
  {g:"box",s:[3.6,.3,.4],p:[0,8.1,12.1],c:ATL_GOLD}
],["grand temple","great temple","temple of columns","parthenon"],{sign:[0,11,16.4,10,1.6]});

S("grandcathedral","structure",[34,74,66],[
  {g:"box",s:[20,26,58],p:[0,13,0],c:0xCFC8B8},
  {g:"box",s:[34,15,30],p:[0,7.5,-8],c:0xC6BEAE},
  {g:"box",s:[20.6,.6,58.6],p:[0,26.2,0],c:0x8A8070},
  {g:"cone",s:[15,11,4],p:[0,31.5,0],r:[0,.785,0],c:0x5A5E6A},
  {g:"box",s:[9,44,9],p:[-8,22,31],c:0xCFC8B8},{g:"box",s:[9,44,9],p:[8,22,31],c:0xCFC8B8},
  {g:"cone",s:[6.6,22,4],p:[-8,55,31],r:[0,.785,0],c:0x5A5E6A},{g:"cone",s:[6.6,22,4],p:[8,55,31],r:[0,.785,0],c:0x5A5E6A},
  {g:"sph",s:[.9],p:[-8,66.6,31],c:ATL_GOLD},{g:"sph",s:[.9],p:[8,66.6,31],c:ATL_GOLD},
  {g:"cyl",s:[5.2,5.2,.4,32],p:[0,20,33.3],r:[1.5708,0,0],c:0xE85A9A,glow:1,opa:.9},
  {g:"cyl",s:[3.6,3.6,.5,32],p:[0,20,33.4],r:[1.5708,0,0],c:0x6A8AFF,glow:1,opa:.9},
  {g:"box",s:[5,9,.6],p:[0,4.5,33.2],c:0x3A2A1E},
  {g:"cyl",s:[10,10,24,24,1,false,0,3.1416],p:[0,12,-29],c:0xC6BEAE},
  {g:"box",s:[1.6,12,6],p:[-12,6,-20],r:[0,0,.35],c:0xBDB5A4,rep:[1,0,0,0],rep2:[4,0,0,12]},
  {g:"box",s:[1.6,12,6],p:[12,6,-20],r:[0,0,-.35],c:0xBDB5A4,rep2:[4,0,0,12]},
  {g:"box",s:[1.4,5.5,.3],p:[-10.05,15,-24],c:0x8AB0FF,glow:1,opa:.75,rep2:[7,0,0,7.6]},
  {g:"box",s:[1.4,5.5,.3],p:[10.05,15,-24],c:0xFFC07A,glow:1,opa:.75,rep2:[7,0,0,7.6]},
  {g:"box",s:[6,14,6],p:[0,33,-6],c:0xCFC8B8},{g:"cone",s:[4.6,18,4],p:[0,49,-6],r:[0,.785,0],c:0x5A5E6A},
  {g:"box",s:[.5,4,.5],p:[0,60,-6],c:ATL_GOLD},{g:"box",s:[2.4,.5,.5],p:[0,59.4,-6],c:ATL_GOLD}
],["grand cathedral","great cathedral","minster","the cathedral"],{sign:[0,10,33.5,12,1.8]});

S("chapel","structure",[11,20,17],[
  {g:"box",s:[10,8,15],p:[0,4,0],c:0xE6DFD0},
  {g:"cone",s:[8,4.4,4],p:[0,10.2,0],r:[0,.785,0],c:0x6A4A3A},
  {g:"box",s:[3.6,12,3.6],p:[0,6,8.6],c:0xE6DFD0},
  {g:"cone",s:[2.8,5,4],p:[0,14.5,8.6],r:[0,.785,0],c:0x5A5E6A},
  {g:"sph",s:[.45],p:[0,17.3,8.6],c:ATL_GOLD},
  {g:"box",s:[1.8,3,.3],p:[0,1.5,10.45],c:0x3A2A1E},
  {g:"cyl",s:[1,1,.2,20],p:[0,9.6,10.45],r:[1.5708,0,0],c:0xFFD27A,glow:1,opa:.9},
  {g:"box",s:[.9,2.6,.2],p:[-5.05,4.4,-4],c:0x8AB0FF,glow:1,opa:.7,rep2:[3,0,0,4]},
  {g:"box",s:[.9,2.6,.2],p:[5.05,4.4,-4],c:0x8AB0FF,glow:1,opa:.7,rep2:[3,0,0,4]}
],["chapel","little church","kirk","small church"],{sign:[0,7,10.5,6,1]});

S("shintoshrine","structure",[16,10,18],[
  {g:"box",s:[14,1.2,14],p:[0,.6,-1],c:0x6E6A64},
  {g:"box",s:[10,4.6,9],p:[0,3.5,-1],c:0xE8DCC4},
  {g:"cyl",s:[.3,.3,4.6,10],p:[-4.6,3.5,3.1],c:0xB23A2A,rep:[4,3.07,0,0]},
  {g:"box",s:[13,.5,12],p:[0,6.2,-1],r:[.18,0,0],c:0x3A3430},
  {g:"box",s:[13,.5,12],p:[0,6.2,-1],r:[-.18,0,0],c:0x3A3430},
  {g:"box",s:[1,.8,12],p:[0,7.4,-1],c:0xC9A868},
  {g:"cyl",s:[.35,.4,6,10],p:[-3.4,3,8.6],c:0xC0392B},{g:"cyl",s:[.35,.4,6,10],p:[3.4,3,8.6],c:0xC0392B},
  {g:"box",s:[9.6,.5,.7],p:[0,6.2,8.6],c:0x2A2420},{g:"box",s:[8.4,.35,.5],p:[0,5.3,8.6],c:0xC0392B},
  {g:"box",s:[1.4,1.4,.1],p:[0,4.2,3.6],c:0xFFFFFF}
],["shinto shrine","jinja","shrine hall","haiden"]);

S("darkfane","structure",[18,26,22],[
  {g:"box",s:[18,2,22],p:[0,1,0],c:0x14101A},
  {g:"box",s:[12,11,16],p:[0,7,0],c:0x1E1826},
  {g:"cone",s:[4,14,4],p:[-6,12,-8],c:0x100C14},{g:"cone",s:[4,14,4],p:[6,12,-8],c:0x100C14},
  {g:"cone",s:[4,14,4],p:[-6,12,8],c:0x100C14},{g:"cone",s:[4,14,4],p:[6,12,8],c:0x100C14},
  {g:"cone",s:[6,16,4],p:[0,20.5,0],r:[0,.785,0],c:0x0C0810},
  {g:"box",s:[3,6,.3],p:[0,4.4,8.05],c:0x3A0A0A},
  {g:"box",s:[3.6,.3,.4],p:[0,7.6,8.1],c:0xC0303A,glow:1,pulse:1},
  {g:"box",s:[.2,5,.2],p:[-6.05,6,-4],c:0xE0304A,glow:1,pulse:1,rep2:[3,0,0,4]},
  {g:"box",s:[.2,5,.2],p:[6.05,6,-4],c:0xE0304A,glow:1,pulse:1,rep2:[3,0,0,4]},
  {g:"sph",s:[1.1],p:[0,29,0],c:0xFF2A3A,glow:1,pulse:1}
],["dark fane","black temple","obsidian temple","temple of shadows"]);
EFFECTS.darkfane=EFFECTS.crystal;

/* ---------------------------------------------------------------- gardens and estates */
S("tierfountain","infra",[11,7.5,11],[
  {g:"cyl",s:[5.4,5.6,.9,28],p:[0,.45,0],c:0xE8E2D4},
  {g:"cyl",s:[5,5,.2,28],p:[0,.85,0],c:0x5AC8E8,glow:1,opa:.8},
  {g:"cyl",s:[.7,.9,3.6,12],p:[0,2.6,0],c:0xE8E2D4},
  {g:"cyl",s:[3,2.2,.6,24],p:[0,4.3,0],c:0xE8E2D4},
  {g:"cyl",s:[2.7,2.7,.15,24],p:[0,4.6,0],c:0x6AD8F0,glow:1,opa:.75},
  {g:"cyl",s:[.4,.55,1.6,10],p:[0,5.4,0],c:0xE8E2D4},
  {g:"cyl",s:[1.5,1,.4,20],p:[0,6.3,0],c:ATL_GOLD},
  {g:"sph",s:[.45],p:[0,6.9,0],c:ATL_GOLD}
],["tiered fountain","grand fountain","three tier fountain","great fountain"]);
EFFECTS.tierfountain=function(g){
  var jet=particles(90,[.5,2.4,.5],0xDDF6FF,.5,.8); jet.position.y=6.8; g.add(jet);
  var fallA=particles(160,[3,4.2,3],0xCFEFFF,.45,.55); fallA.position.y=.9; g.add(fallA);
  return function(t,dt){ rise(jet,dt,2.2,0); if(typeof fall==="function") fall(fallA,dt,3,0); };
};

S("estategate","infra",[16,8,2],[
  {g:"box",s:[1.8,7,1.8],p:[-7,3.5,0],c:0xE8E2D4},{g:"box",s:[1.8,7,1.8],p:[7,3.5,0],c:0xE8E2D4},
  {g:"box",s:[2.2,.5,2.2],p:[-7,7.2,0],c:ATL_GOLD},{g:"box",s:[2.2,.5,2.2],p:[7,7.2,0],c:ATL_GOLD},
  {g:"sph",s:[.8],p:[-7,8.1,0],c:ATL_GOLD},{g:"sph",s:[.8],p:[7,8.1,0],c:ATL_GOLD},
  {g:"box",s:[.12,5,.12],p:[-5.6,2.5,0],c:0x1A1A22,rep:[23,.5,0,0]},
  {g:"box",s:[12,.25,.25],p:[0,.6,0],c:0x1A1A22},{g:"box",s:[12,.25,.25],p:[0,4.6,0],c:0x1A1A22},
  {g:"tor",s:[2.4,.12],p:[0,5,0],c:ATL_GOLD},
  {g:"sph",s:[.45],p:[-7,9.4,0],c:0xFFE2A0,glow:1},{g:"sph",s:[.45],p:[7,9.4,0],c:0xFFE2A0,glow:1}
],["estate gate","grand gate","wrought iron gate","gilded gate"]);

S("ironfence","infra",[10,2.4,.4],[
  {g:"box",s:[10,.12,.12],p:[0,2,0],c:0x1A1A22},{g:"box",s:[10,.12,.12],p:[0,.4,0],c:0x1A1A22},
  {g:"box",s:[.08,2.2,.08],p:[-4.8,1.1,0],c:0x1A1A22,rep:[25,.4,0,0]},
  {g:"cone",s:[.12,.3,4],p:[-4.8,2.35,0],c:ATL_GOLD,rep:[25,.4,0,0]},
  {g:"box",s:[.5,2.6,.5],p:[-5,1.3,0],c:0xE8E2D4},{g:"box",s:[.5,2.6,.5],p:[5,1.3,0],c:0xE8E2D4}
],["iron fence","wrought iron fence","railings","gilded railings"]);

S("topiary","nature",[2,3.6,2],[
  {g:"cyl",s:[.7,.55,.9,12],p:[0,.45,0],c:0xB88A5A},
  {g:"sph",s:[.8],p:[0,1.5,0],c:0x2F6A34},{g:"sph",s:[.6],p:[0,2.5,0],c:0x2F6A34},{g:"sph",s:[.4],p:[0,3.25,0],c:0x2F6A34}
],["topiary","clipped shrub","shaped hedge"]);

S("gazebo","infra",[9,7,9],[
  {g:"cyl",s:[4.4,4.4,.5,8],p:[0,.25,0],c:0xE8E2D4},
  {g:"cyl",s:[.22,.22,3.6,8],p:[3.6,2.3,0],c:0xF4F0E6},{g:"cyl",s:[.22,.22,3.6,8],p:[-3.6,2.3,0],c:0xF4F0E6},
  {g:"cyl",s:[.22,.22,3.6,8],p:[0,2.3,3.6],c:0xF4F0E6},{g:"cyl",s:[.22,.22,3.6,8],p:[0,2.3,-3.6],c:0xF4F0E6},
  {g:"cyl",s:[.22,.22,3.6,8],p:[2.55,2.3,2.55],c:0xF4F0E6},{g:"cyl",s:[.22,.22,3.6,8],p:[-2.55,2.3,2.55],c:0xF4F0E6},
  {g:"cyl",s:[.22,.22,3.6,8],p:[2.55,2.3,-2.55],c:0xF4F0E6},{g:"cyl",s:[.22,.22,3.6,8],p:[-2.55,2.3,-2.55],c:0xF4F0E6},
  {g:"cone",s:[5,2.6,8],p:[0,5.4,0],c:0x3A6A6A},{g:"sph",s:[.4],p:[0,6.9,0],c:ATL_GOLD}
],["gazebo","bandstand","garden pavilion","belvedere"]);

S("flowerbed","nature",[6,.9,3],[
  {g:"box",s:[6,.5,3],p:[0,.25,0],c:0xD8D0C0},
  {g:"box",s:[5.6,.2,2.6],p:[0,.55,0],c:0x4A3A2A},
  {g:"sph",s:[.32],p:[-2.4,.75,-.8],c:0xE84A6A,rep:[7,.8,0,0],rep2:[3,0,0,.8]},
  {g:"sph",s:[.26],p:[-2,.85,-.4],c:0xFFE27A,rep:[6,.8,0,0]}
],["flower bed","flowerbed","bed of flowers","parterre"]);

S("reflectpool","infra",[18,.6,7],[
  {g:"box",s:[18,.5,7],p:[0,.25,0],c:0xE8E2D4},
  {g:"box",s:[17,.1,6],p:[0,.52,0],c:0x3AAAD0,glow:1,opa:.85}
],["reflecting pool","ornamental pool","long pool"]);

S("ornatelamp","infra",[1.2,6.4,1.2],[
  {g:"cyl",s:[.5,.7,.6,10],p:[0,.3,0],c:0x1E2230},
  {g:"cyl",s:[.14,.2,5,8],p:[0,3,0],c:0x1E2230},
  {g:"box",s:[1.6,.12,.12],p:[0,5.3,0],c:0x1E2230},
  {g:"sph",s:[.42],p:[-.75,5.55,0],c:0xFFE2A0,glow:1},{g:"sph",s:[.42],p:[.75,5.55,0],c:0xFFE2A0,glow:1},
  {g:"sph",s:[.5],p:[0,6.1,0],c:0xFFE2A0,glow:1}
],["ornate lamp","lamp standard","gas lamp","ornate streetlight"]);
if(typeof LAMPED!=="undefined") LAMPED.ornatelamp=1;

S("crystalbrazier","infra",[1.8,3.2,1.8],[
  {g:"cyl",s:[.9,.5,.8,10],p:[0,1.6,0],c:ATL_DEEP},
  {g:"cyl",s:[.2,.35,1.2,8],p:[0,.6,0],c:ATL_DEEP},
  {g:"cone",s:[.45,1.6,6],p:[0,2.7,0],c:ATL_CYAN,glow:1,pulse:1},
  {g:"cone",s:[.3,1,6],p:[.35,2.4,.2],r:[0,0,-.3],c:ATL_CYAN,glow:1,pulse:1},
  {g:"cone",s:[.3,1,6],p:[-.35,2.4,-.2],r:[0,0,.3],c:ATL_CYAN,glow:1,pulse:1}
],["crystal brazier","glowing crystal","atlantean crystal","orichalcum lamp"]);
EFFECTS.crystalbrazier=EFFECTS.crystal;

S("herostatue","infra",[3.4,10,3.4],[
  {g:"box",s:[3.4,2.4,3.4],p:[0,1.2,0],c:0xE8E2D4},
  {g:"box",s:[3.8,.3,3.8],p:[0,2.5,0],c:ATL_GOLD},
  {g:"cyl",s:[.9,1.2,4.2,12],p:[0,4.8,0],c:ATL_BRONZE},
  {g:"sph",s:[.55],p:[0,7.4,0],c:ATL_BRONZE},
  {g:"cyl",s:[.18,.22,2.6,8],p:[.9,7.6,0],r:[0,0,-.5],c:ATL_BRONZE},
  {g:"sph",s:[.6],p:[1.6,8.9,0],c:ATL_CYAN,glow:1,pulse:1}
],["hero statue","bronze statue","statue on a plinth","monument figure"]);
EFFECTS.herostatue=EFFECTS.crystal;

S("ringarch","infra",[24,17,3],[
  {g:"box",s:[3,15,3],p:[-10,7.5,0],c:0xE8E2D4},{g:"box",s:[3,15,3],p:[10,7.5,0],c:0xE8E2D4},
  {g:"box",s:[3.6,1,3.6],p:[-10,.5,0],c:0xC9C0AE},{g:"box",s:[3.6,1,3.6],p:[10,.5,0],c:0xC9C0AE},
  {g:"box",s:[24,2.4,3.4],p:[0,15.8,0],c:0xE8E2D4},
  {g:"box",s:[24.4,.4,3.8],p:[0,14.5,0],c:ATL_GOLD},
  {g:"box",s:[6,3,1],p:[0,18.3,0],c:0xE8E2D4},
  {g:"sph",s:[1],p:[0,20.4,0],c:ATL_CYAN,glow:1,pulse:1},
  {g:"box",s:[2.2,7,.1],p:[-10,9.5,1.6],c:0x2A4A8A},{g:"box",s:[2.2,7,.1],p:[10,9.5,1.6],c:0x2A4A8A},
  {g:"box",s:[1.2,1.2,.12],p:[-10,11,1.66],c:ATL_GOLD},{g:"box",s:[1.2,1.2,.12],p:[10,11,1.66],c:ATL_GOLD}
],["ring arch","grand arch","triumphal arch","city arch"]);
EFFECTS.ringarch=EFFECTS.crystal;

S("bannerpole","infra",[1.2,11,1.2],[
  {g:"cyl",s:[.12,.16,11,8],p:[0,5.5,0],c:0x2A2A30},
  {g:"sph",s:[.3],p:[0,11.1,0],c:ATL_GOLD},
  {g:"box",s:[1.8,5.2,.06],p:[.95,8,0],c:0x2A4A8A},
  {g:"box",s:[1.8,.3,.08],p:[.95,5.4,0],c:ATL_GOLD}
],["banner pole","flagpole with a banner","standard"]);

S("gravestone","infra",[1,1.3,.5],[
  {g:"box",s:[.9,1.1,.25],p:[0,.55,0],c:0x9A968E},{g:"cyl",s:[.45,.45,.25,12,1,false,0,3.1416],p:[0,1.1,0],r:[1.5708,0,1.5708],c:0x9A968E}
],["gravestone","headstone","tombstone","grave"]);

/* ---------------------------------------------------------------- the Gaol */
S("prisonwall","infra",[20,7,1.4],[
  {g:"box",s:[20,6.4,1.4],p:[0,3.2,0],c:0x8A847A},
  {g:"box",s:[20.4,.5,1.8],p:[0,6.6,0],c:0x6E6A62},
  {g:"cyl",s:[.06,.06,20,4],p:[0,7.1,0],r:[0,0,1.5708],c:0x4A4A4A,rep:[1,0,0,0],rep2:[3,0,.25,0]}
],["prison wall","gaol wall","high wall","yard wall"]);
S("watchtower","structure",[6,15,6],[
  {g:"box",s:[4,11,4],p:[0,5.5,0],c:0x8A847A},
  {g:"box",s:[6,3,6],p:[0,12.5,0],c:0x6E6A62},
  {g:"box",s:[5.6,1.2,.2],p:[0,12.8,3.05],c:0x3A4654},
  {g:"cone",s:[4.6,2.4,4],p:[0,15.2,0],r:[0,.785,0],c:0x3A3A40},
  {g:"cyl",s:[.4,.6,.8,10],p:[2.6,13,2.6],r:[.6,0,-.6],c:0xFFF2C0,glow:1}
],["watchtower","guard tower","sentry tower"]);

/* ---------------------------------------------------------------- the Gaol, inside */
/* a hall of its own: the guard room at the door, a barred gate, and a block of
   cells round the walls, each with its bars, its bunk and its basin. the
   warden's office is upstairs. */
if(typeof PLANS!=="undefined") PLANS.gaol={mode:"hall",w:44,d:26,fill:"gaol",wall:0x8E8A82,floor:"stone"};
(function(){
  if(typeof planOf==="function"){ var _planOf=planOf;
    planOf=function(spec){ if(spec&&spec.workplace==="The Gaol"&&PLANS.gaol) return PLANS.gaol; return _planOf.apply(this,arguments); }; }
  if(typeof furnBox==="function"){ var _furnBox=furnBox, MORE={cellwall:[.25,4.6],cellbars:[3.1,.25],bunk:[.9,2],anvil:[1.1,.5],forge:[1.8,1.4],oven:[2,1.6],
    loom:[1.8,1],potterswheel:[1,1],workbench:[2.4,.9],cask:[1.6,1.4],printpress:[1.6,1.2],filecabinet:[.6,.7],coffin:[.7,2],displaycase:[1.6,.7],
    butcherblock:[1.2,.8],mapchest:[1.8,1.1],herbrack:[1.6,.4],cot:[.8,1.9]};
    furnBox=function(k){ return MORE[k]||_furnBox(k); }; }
  if(typeof fillHall==="function"){ var _fillHall=fillHall;
    fillHall=function(kind,W,D,put,spots){
      if(kind!=="gaol") return _fillHall.apply(this,arguments);
      var i, CW=4.4;
      /* the guard room, across the front */
      put("desk",-W/2+4,D/2-4.2,Math.PI); put("chair",-W/2+4,D/2-3,0);
      put("keyrack",-W/2+.3,D/2-4,Math.PI/2); put("noticeboard",W/2-.3,D/2-4,-Math.PI/2);
      put("filecabinet",-W/2+7.5,D/2-6.2,0); put("filecabinet",-W/2+8.3,D/2-6.2,0);
      put("benchin",W/2-6,D/2-2.2,Math.PI); put("clock",W/2-10,D/2-.4,Math.PI);
      spots.push({x:-W/2+4,z:D/2-3.4,room:"the guard room",level:0});
      /* the barred gate between the guard room and the cells, open in the middle */
      for(var gx=-W/2+1.6;gx<W/2-1;gx+=3.1){ if(Math.abs(gx)<2.4) continue; put("cellbars",gx,D/2-8,0); }
      /* the back row of cells */
      var backZ=-D/2+2.3, n=0;
      for(var cx=-W/2+CW/2;cx<W/2-6-CW/2;cx+=CW){
        put("cellwall",cx-CW/2,backZ,0);
        put("cellbars",cx-.35,-D/2+4.7,0);
        put("bunk",cx+1.2,backZ,0); put("sink",cx-1.4,-D/2+.5,0);
        spots.push({x:cx,z:backZ+.6,room:"cell",level:0,cell:++n});
      }
      put("cellwall",-W/2+CW/2+(n)*CW-CW/2,backZ,0);
      /* a row down each side */
      [-1,1].forEach(function(sd){
        for(var cz=-D/2+7.6;cz<D/2-10;cz+=CW){
          var wx=sd*(W/2-2.3);
          put("cellwall",wx,cz-CW/2,Math.PI/2);
          put("cellbars",sd*(W/2-4.7),cz+.35,Math.PI/2);
          put("bunk",sd*(W/2-1.2),cz-1.1,Math.PI/2);
          spots.push({x:wx,z:cz,room:"cell",level:0,cell:++n});
        }
        put("cellwall",sd*(W/2-2.3),D/2-10-CW/2+1.2,Math.PI/2);
      });
      /* the long table where the held eat, down the middle */
      put("longtable",0,-1,0); put("benchin",0,-2.4,0); put("benchin",0,.4,Math.PI);
      spots.push({x:0,z:2,room:"the cell block",level:0});
    };
  }
})();

/* ---------------------------------------------------------------- the trades' own furniture */
(function(){
  if(typeof FURN==="undefined") return;
  var M=function(c){ return mL(c); };
  var add=function(k,f,solid){ FURN[k]=f; if(solid&&typeof SOLIDFURN!=="undefined") SOLIDFURN[k]=1; };
  add("anvil",function(){ return F([P(box(.5,.5,.5),M(0x3A3A40),0,.25,0),P(box(1.1,.3,.45),M(0x2A2A30),0,.65,0),P(cyl(.08,.2,.4,6),M(0x2A2A30),.7,.65,0,0,0,1.5708)]); },true);
  add("forge",function(){ return F([P(box(1.8,1,1.4),M(0x6E5A4A),0,.5,0),P(box(1.4,.1,1),mG(0xFF6A1E,.9),0,1.02,0),P(box(.8,2.6,.8),M(0x5A4A3E),0,2.3,-.3)]); },true);
  add("oven",function(){ return F([P(box(2,1.6,1.6),M(0xB8704A),0,.8,0),P(cyl(.6,.6,.1,16,1,false,0,3.1416),mG(0xFF8A3A,.85),0,.8,.81,1.5708,0,0),P(box(.5,1.4,.5),M(0x8A5A3A),.6,2.3,-.4)]); },true);
  add("loom",function(){ var g=F([P(box(1.8,.1,1),M(WOOD),0,.8,0),P(box(.1,1.8,.1),M(WOOD),-.85,.9,-.45),P(box(.1,1.8,.1),M(WOOD),.85,.9,-.45),P(box(.1,1.8,.1),M(WOOD),-.85,.9,.45),P(box(.1,1.8,.1),M(WOOD),.85,.9,.45),P(box(1.6,1.2,.02),M(0xB84A4A),0,1.2,0)]); return g; },true);
  add("potterswheel",function(){ return F([P(box(1,.6,1),M(WOOD),0,.3,0),P(cyl(.4,.4,.08,18),M(0x8A8A8A),0,.64,0),P(cyl(.18,.22,.35,12),M(0xB8704A),0,.85,0)]); },true);
  add("workbench",function(){ return F([P(box(2.4,.12,.9),M(0x8A6A44),0,.9,0),P(box(.1,.9,.8),M(WOOD),-1.1,.45,0),P(box(.1,.9,.8),M(WOOD),1.1,.45,0),P(box(.5,.2,.3),M(METAL),-.6,1.05,.1),P(box(.1,.4,.1),M(METAL),.5,1.15,-.2)]); },true);
  add("barberchair",function(){ return F([P(cyl(.3,.4,.5,10),M(METAL),0,.25,0),P(box(.8,.18,.7),M(0x8A2A2A),0,.6,0),P(box(.8,.9,.15),M(0x8A2A2A),0,1.1,-.3),P(box(.5,.9,.05),mL(0xCFE0F0),0,1.6,-.9)]); },false);
  add("dressform",function(){ return F([P(cyl(.05,.05,1.2,6),M(0x2A2A2A),0,.6,0),P(cyl(.25,.3,.7,12),M(0xC8B8A0),0,1.5,0)]); },false);
  add("flowerbucket",function(){ return F([P(cyl(.3,.25,.5,10),M(0x6A7A8A),0,.25,0),P(sph(.28),M(0xE84A6A),0,.62,0),P(sph(.22),M(0xFFE27A),.18,.7,.1)]); },false);
  add("cask",function(){ return F([P(cyl(.7,.7,1.6,14),M(0x7A5234),0,.9,0,0,0,1.5708),P(box(1.6,.5,1),M(WOOD),0,.25,0)]); },true);
  add("printpress",function(){ return F([P(box(1.6,1,1.2),M(0x3A3A40),0,.5,0),P(box(1.2,1.4,.2),M(0x2A2A30),0,1.7,0),P(cyl(.06,.06,1.4,6),M(METAL),0,2.2,.4,0,0,1.5708)]); },true);
  add("filecabinet",function(){ return F([P(box(.6,1.4,.7),M(0x6A7280),0,.7,0),P(box(.3,.04,.02),M(METAL),0,1.2,.36),P(box(.3,.04,.02),M(METAL),0,.8,.36),P(box(.3,.04,.02),M(METAL),0,.4,.36)]); },true);
  add("noticeboard",function(){ return F([P(box(1.6,1.1,.08),M(0xB8905A),0,1.6,0),P(box(.3,.4,.02),mL(0xF2EEE6),-.4,1.7,.05),P(box(.3,.3,.02),mL(0xF2E8C0),.2,1.5,.05),P(box(.25,.35,.02),mL(0xE8F0F2),.5,1.8,.05)]); },false);
  add("coffin",function(){ return F([P(box(.7,.5,2),M(0x3A2418),0,.35,0),P(box(.72,.08,2.02),M(0x5A3A24),0,.64,0),P(box(.3,.02,.05),M(ATL_GOLD),0,.69,.3)]); },true);
  add("displaycase",function(){ return F([P(box(1.6,.9,.7),M(DARKWOOD),0,.45,0),P(box(1.6,.5,.7),mL(0xCFE0F0),0,1.15,0),P(sph(.08),mG(0xFFE27A,1),-.4,1.0,0),P(sph(.08),mG(0x9FE8FF,1),.2,1.0,.1)]); },true);
  add("butcherblock",function(){ return F([P(box(1.2,.9,.8),M(0xC8A070),0,.45,0),P(box(1,.12,.1),M(METAL),0,1.8,-.3),P(box(.12,.5,.12),M(0xB84A4A),-.3,1.5,-.3),P(box(.12,.5,.12),M(0xB84A4A),.3,1.5,-.3)]); },true);
  add("lectern",function(){ return F([P(box(.5,1.1,.4),M(DARKWOOD),0,.55,0),P(box(.7,.05,.5),M(DARKWOOD),0,1.2,0,-.35,0,0),P(box(.5,.03,.35),mL(0xF2EEE6),0,1.25,0,-.35,0,0)]); },false);
  add("bunk",function(){ return F([P(box(.9,.35,2),M(0x5A5A60),0,.35,0),P(box(.9,.35,2),M(0x5A5A60),0,1.5,0),P(box(.06,1.9,.06),M(METAL),-.42,.95,-.95),P(box(.06,1.9,.06),M(METAL),.42,.95,-.95),P(box(.06,1.9,.06),M(METAL),-.42,.95,.95),P(box(.06,1.9,.06),M(METAL),.42,.95,.95)]); },true);
  add("cellbars",function(){ var g=new THREE.Group(); for(var i=0;i<12;i++) g.add(P(cyl(.03,.03,2.6,6),M(0x3A3A40),-1.4+i*.25,1.3,0)); g.add(P(box(3,.08,.08),M(0x3A3A40),0,2.55,0)); g.add(P(box(3,.08,.08),M(0x3A3A40),0,.1,0)); return g; },true);
  add("keyrack",function(){ return F([P(box(1,.6,.06),M(DARKWOOD),0,1.6,0),P(cyl(.04,.04,.12,6),M(ATL_GOLD),-.3,1.55,.08,1.5708,0,0),P(cyl(.04,.04,.12,6),M(ATL_GOLD),0,1.55,.08,1.5708,0,0),P(cyl(.04,.04,.12,6),M(ATL_GOLD),.3,1.55,.08,1.5708,0,0)]); },false);
  add("weighscale",function(){ return F([P(box(.5,.9,.5),M(0x6A7280),0,.45,0),P(cyl(.3,.3,.04,16),M(METAL),0,.95,0),P(box(.3,.4,.1),mL(0xF2EEE6),0,1.2,-.15)]); },false);
  add("mapchest",function(){ return F([P(box(1.8,.9,1.1),M(DARKWOOD),0,.45,0),P(box(1.6,.04,.02),M(ATL_GOLD),0,.3,.56),P(box(1.6,.04,.02),M(ATL_GOLD),0,.6,.56),P(box(1.2,.02,.8),mL(0xE8DCC0),0,.92,0)]); },true);
  add("herbrack",function(){ return F([P(box(1.6,1.8,.4),M(WOOD),0,.9,0),P(sph(.14),M(0x4A7A3A),-.5,1.6,.2),P(sph(.14),M(0x6A8A3A),0,1.6,.2),P(sph(.14),M(0x8A6A3A),.5,1.6,.2),P(cyl(.08,.08,.2,8),mL(0x8AB0D0),-.4,1.0,.2),P(cyl(.08,.08,.2,8),mL(0xB08AD0),.1,1.0,.2)]); },true);
  add("cellwall",function(){ return F([P(box(.25,3.1,4.6),M(0x8E8A82),0,1.55,0)]); },true);
  add("cot",function(){ return F([P(box(.8,.4,1.9),M(0x6A6A70),0,.3,0),P(box(.75,.1,1.85),mL(0xE8E4DA),0,.55,0)]); },true);
})();
