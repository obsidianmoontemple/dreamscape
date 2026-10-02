/* SomnuMatrix — kit2.js
   the larger library: disasters, hidden chambers, magic, weapons, castles,
   fairgrounds, landforms and more. data like kit.js, plus a few custom builders
   for things that must move as one piece.
   loaded as a plain script; shares scope with the other files */
"use strict";

var LAVA=0xE8561E, EMBER=0xFF8A2A, CRYSTAL=0x8FD3E8, SAND=0xC2A56E, ICE=0xDCE8F0, IRON=0x3A3C42, GOLD=0xC7A043;

/* ---------- disasters ---------- */
A("volcano","nature",[120,60,120],[
  {g:"cone",s:[60,56,14],p:[0,28,0],c:"stone"},
  {g:"cyl",s:[9,12,6,14],p:[0,55,0],c:"dark"},
  {g:"cyl",s:[8,8,.5,14],p:[0,57.6,0],c:LAVA,glow:1},
  {g:"box",s:[2.4,.4,40],p:[6,30,-18],r:[.78,.2,0],c:LAVA,glow:1},
  {g:"box",s:[2,.4,34],p:[-14,26,12],r:[-.86,-.5,0],c:EMBER,glow:1}
]);
A("sandstorm","nature",[80,40,80],[
  {g:"cyl",s:[40,42,36,20],p:[0,18,0],c:SAND,opa:.18}
]);
A("tornado","nature",[30,70,30],[
  {g:"cone",s:[14,70,16],p:[0,35,0],r:[3.14159,0,0],c:"stone",opa:.22}
]);
A("wildfire","nature",[30,8,30],[
  {g:"cyl",s:[15,15,.2,20],p:[0,.1,0],c:0x1C1612}
]);
A("fire","infra",[3,3,3],[
  {g:"cyl",s:[1.6,1.6,.15,12],p:[0,.08,0],c:0x1C1612},
  {g:"box",s:[2,.25,.3],p:[0,.25,0],r:[0,.6,0],c:"bark"},
  {g:"box",s:[2,.25,.3],p:[0,.25,0],r:[0,-.6,0],c:"bark"}
]);
A("flood","nature",[120,2,120],[
  {g:"pln",s:[120,120],p:[0,1.4,0],r:[-1.5708,0,0],c:"water",opa:.82},
  {g:"cyl",s:[.4,.4,5,7],p:[8,1.5,-6],r:[1.5708,.4,0],c:"bark"},
  {g:"box",s:[3,.4,2],p:[-12,1.5,10],r:[.1,.6,.05],c:"bark"}
]);
A("tidalwave","nature",[100,26,24],[
  {g:"cyl",s:[14,14,100,20,1],p:[0,12,0],r:[0,0,1.5708],c:"water",opa:.86},
  {g:"box",s:[100,2.4,6],p:[0,25,-4],c:0xE8F0F4,opa:.8}
]);
A("fissure","nature",[40,2,6],[
  {g:"box",s:[40,.3,2.4],p:[0,.05,0],c:LAVA,glow:1},
  {g:"box",s:[40,1.2,1.6],p:[0,.3,2],r:[.3,0,0],c:"stone"},
  {g:"box",s:[40,1.2,1.6],p:[0,.3,-2],r:[-.3,0,0],c:"stone"}
]);
A("lavaflow","nature",[16,1,60],[
  {g:"pln",s:[14,60],p:[0,.3,0],r:[-1.5708,0,0],c:LAVA,glow:1,opa:.95},
  {g:"box",s:[1.4,1,60],p:[-7.4,.5,0],c:0x2A1E18},{g:"box",s:[1.4,1,60],p:[7.4,.5,0],c:0x2A1E18}
]);
A("crater","nature",[26,3,26],[
  {g:"tor",s:[11,2.2],p:[0,.6,0],r:[1.5708,0,0],c:"stone"},
  {g:"cyl",s:[10,10,.2,20],p:[0,.1,0],c:0x2A2622}
]);
A("meteor","nature",[8,40,8],[
  {g:"ico",s:[2.4],p:[0,6,0],c:EMBER,glow:1},
  {g:"cone",s:[2,14,8],p:[-3.4,13,0],r:[0,0,.5],c:0xFFC27A,glow:1,opa:.55},
  {g:"tor",s:[4,1],p:[0,.4,0],r:[1.5708,0,0],c:"stone"}
]);
A("blizzard","nature",[60,30,60],[
  {g:"cyl",s:[30,30,30,18],p:[0,15,0],c:0xE8EEF4,opa:.12}
]);
A("stormcloud","nature",[40,40,40],[
  {g:"ico",s:[9],p:[0,34,0],c:0x44474E},{g:"ico",s:[7],p:[8,32,3],c:0x3C3F46},{g:"ico",s:[7],p:[-8,33,-2],c:0x4A4D54}
]);
A("lightningstorm","nature",[50,50,50],[
  {g:"ico",s:[12],p:[0,46,0],c:0x2E3138},{g:"ico",s:[9],p:[11,44,4],c:0x33363D},{g:"ico",s:[9],p:[-11,45,-3],c:0x2A2D34}
]);
A("ashcloud","nature",[50,50,50],[
  {g:"ico",s:[14],p:[0,40,0],c:0x2E2C2A,opa:.8}
]);
A("sinkhole","nature",[20,1,20],[
  {g:"cyl",s:[9,6,6,18],p:[0,-2.9,0],c:0x0C0B0A},
  {g:"tor",s:[9.4,1],p:[0,.2,0],r:[1.5708,0,0],c:"stone"}
]);

/* ---------- hidden chambers ---------- */
A("crypt","structure",[8,5,10],[
  {g:"box",s:[8,3.4,10],p:[0,1.7,0],c:"stone"},
  {g:"cone",s:[6,2,4],p:[0,4.4,0],r:[0,.785,0],c:"trim"},
  {g:"box",s:[2.2,2.6,.3],p:[0,1.3,5.05],c:"dark"},
  {g:"box",s:[3,.3,.9],p:[0,.15,6],c:"stone",rep:[3,0,-.2,.9]}
]);
A("trapdoor","infra",[1.8,.3,1.8],[
  {g:"box",s:[1.8,.14,1.8],p:[0,.07,0],c:"bark"},
  {g:"box",s:[1.8,.06,.12],p:[0,.15,-.5],c:IRON,rep:[3,0,0,.5]},
  {g:"tor",s:[.14,.03],p:[0,.17,.6],r:[1.5708,0,0],c:IRON}
]);
A("cellar","infra",[3,1.4,3],[
  {g:"box",s:[1.5,.1,2.6],p:[-.76,.6,0],r:[0,0,-.35],c:"bark"},
  {g:"box",s:[1.5,.1,2.6],p:[.76,.6,0],r:[0,0,.35],c:"bark"},
  {g:"box",s:[3.2,.8,2.8],p:[0,.3,0],c:"stone"}
]);
A("hiddenroom","structure",[6,4,6],[
  {g:"box",s:[6,3.6,6],p:[0,1.8,0],c:"stone"},
  {g:"box",s:[1.2,2.2,.2],p:[0,1.1,3.02],c:"dark"},
  {g:"box",s:[.9,1.9,.1],p:[0,1.1,3.1],c:"light",glow:1,opa:.4}
]);
A("vaultdoor","infra",[4.4,4.4,1],[
  {g:"box",s:[4.4,4.4,.8],p:[0,2.2,0],c:"stone"},
  {g:"cyl",s:[1.8,1.8,.4,24],p:[0,2.2,.5],r:[1.5708,0,0],c:"metal"},
  {g:"box",s:[3.2,.16,.16],p:[0,2.2,.76],c:IRON},{g:"box",s:[.16,3.2,.16],p:[0,2.2,.76],c:IRON}
]);
A("catacomb","structure",[8,5,6],[
  {g:"box",s:[1.4,4,4],p:[-3,2,0],c:"stone"},{g:"box",s:[1.4,4,4],p:[3,2,0],c:"stone"},
  {g:"box",s:[7.4,1.2,4],p:[0,4.4,0],c:"stone"},
  {g:"pln",s:[4.6,4],p:[0,2,-1.9],c:"dark"},
  {g:"box",s:[4.4,.3,.9],p:[0,-.2,1.6],c:"stone",rep:[4,0,-.4,-.9]}
]);
A("secretstair","infra",[3.2,1,7],[
  {g:"box",s:[3.2,.3,7],p:[0,-.1,0],c:"dark"},
  {g:"box",s:[3,.3,.9],p:[0,-.4,2.6],c:"stone",rep:[6,0,-.45,-.9]},
  {g:"box",s:[3.6,.5,.5],p:[0,.2,3.5],c:"stone"}
]);
A("mineshaft","structure",[5,8,5],[
  {g:"box",s:[.4,7,.4],p:[-2,3.5,-2],c:"bark",rep:[2,4,0,0],rep2:[2,0,0,4]},
  {g:"box",s:[4.8,.4,.4],p:[0,7,-2],c:"bark",rep:[2,0,0,4]},
  {g:"cyl",s:[.9,.9,.4,12],p:[0,7.4,0],r:[0,0,1.5708],c:IRON},
  {g:"box",s:[3.4,.2,3.4],p:[0,.1,0],c:"dark"}
]);
A("barrow","nature",[18,6,18],[
  {g:"sph",s:[9],p:[0,-2.6,0],c:"nature"},
  {g:"box",s:[3,3,2],p:[0,1.5,8],c:"stone"},{g:"pln",s:[1.6,2.2],p:[0,1.2,9.02],c:"dark"}
]);

/* ---------- magic ---------- */
A("crystal","infra",[3,4,3],[
  {g:"cyl",s:[.3,.5,3,6],p:[0,1.5,0],c:CRYSTAL,glow:1,opa:.7,pulse:1},
  {g:"cyl",s:[.2,.4,2.2,6],p:[.7,1.1,.3],r:[0,0,-.4],c:CRYSTAL,glow:1,opa:.7,pulse:1},
  {g:"cyl",s:[.2,.35,1.8,6],p:[-.6,.9,-.3],r:[.2,0,.45],c:CRYSTAL,glow:1,opa:.7,pulse:1},
  {g:"cyl",s:[.9,1.1,.5,8],p:[0,.25,0],c:"stone"}
]);
A("crystalspire","nature",[12,24,12],[
  {g:"cyl",s:[1.4,2.6,22,6],p:[0,11,0],c:CRYSTAL,glow:1,opa:.65,pulse:1},
  {g:"cyl",s:[.9,1.8,15,6],p:[3,7,1],r:[0,0,-.3],c:CRYSTAL,glow:1,opa:.65,pulse:1},
  {g:"cyl",s:[.8,1.6,12,6],p:[-3,6,-1.4],r:[.2,0,.35],c:CRYSTAL,glow:1,opa:.65,pulse:1},
  {g:"cyl",s:[5,6,1.4,8],p:[0,.7,0],c:"stone"}
]);
A("runestone","infra",[2,4.4,1],[
  {g:"box",s:[1.8,4.2,.8],p:[0,2.1,0],r:[0,0,.04],c:"stone"},
  {g:"box",s:[.12,.9,.06],p:[-.35,3.1,.42],c:0x7FD0FF,glow:1},{g:"box",s:[.6,.12,.06],p:[0,2.4,.42],c:0x7FD0FF,glow:1},
  {g:"box",s:[.12,.7,.06],p:[.35,1.7,.42],r:[0,0,.5],c:0x7FD0FF,glow:1}
]);
A("cauldron","infra",[2,2,2],[
  {g:"sph",s:[.9],p:[0,1,0],c:IRON},
  {g:"cyl",s:[.75,.75,.1,16],p:[0,1.55,0],c:0x5FCF6A,glow:1},
  {g:"cyl",s:[.06,.06,1,5],p:[-.6,.4,0],r:[0,0,.3],c:IRON,rep:[2,1.2,0,0]},
  {g:"cone",s:[.5,.8,6],p:[0,.3,0],c:EMBER,glow:1,opa:.8}
]);
A("floatingisland","nature",[30,18,30],[
  {g:"cone",s:[10,14,9],p:[0,14,0],r:[3.14159,0,0],c:"stone"},
  {g:"cyl",s:[10.2,10.2,1.2,12],p:[0,21.6,0],c:"nature"},
  {g:"cyl",s:[.4,.6,4,7],p:[2,24,1],c:"bark"},{g:"ico",s:[2.6],p:[2,27,1],c:"nature"}
]);
A("orb","infra",[1.6,3,1.6],[
  {g:"cyl",s:[.4,.6,1.8,8],p:[0,.9,0],c:"stone"},
  {g:"sph",s:[.6],p:[0,2.4,0],c:0x9FD8FF,glow:1,opa:.8,pulse:1}
]);
A("lectern","infra",[1.2,1.8,1],[
  {g:"cyl",s:[.12,.2,1.2,8],p:[0,.6,0],c:"bark"},
  {g:"box",s:[.9,.08,.6],p:[0,1.25,0],r:[-.4,0,0],c:"bark"},
  {g:"box",s:[.4,.03,.55],p:[-.21,1.32,0],r:[-.4,0,.12],c:0xE6DCC2},{g:"box",s:[.4,.03,.55],p:[.21,1.32,0],r:[-.4,0,-.12],c:0xE6DCC2}
]);
A("wisps","infra",[10,4,10],[
  {g:"sph",s:[.3],p:[0,1.5,0],c:0xBFE8FF,glow:1,opa:.9}
]);
A("worldtree","nature",[36,44,36],[
  {g:"cyl",s:[2.6,4.6,26,10],p:[0,13,0],c:"bark"},
  {g:"cyl",s:[1,1.8,12,7],p:[5,4,3],r:[.5,0,-1],c:"bark"},{g:"cyl",s:[1,1.8,12,7],p:[-5,4,-2],r:[-.4,0,1],c:"bark"},
  {g:"ico",s:[16],p:[0,34,0],c:"nature"},{g:"ico",s:[10],p:[12,28,4],c:"nature"},{g:"ico",s:[10],p:[-11,29,-5],c:"nature"}
]);
A("sigil","infra",[10,.3,10],[
  {g:"tor",s:[4.6,.14],p:[0,.1,0],r:[1.5708,0,0],c:0xE8C27A,glow:1},
  {g:"tor",s:[3.6,.1],p:[0,.1,0],r:[1.5708,0,0],c:0xE8C27A,glow:1},
  {g:"sph",s:[.12],p:[0,.1,0],c:0xE8C27A,glow:1}
]);
A("hourglass","infra",[3,6,3],[
  {g:"cone",s:[1.2,2.4,10],p:[0,1.6,0],r:[3.14159,0,0],c:"glass",opa:.5},{g:"cone",s:[1.2,2.4,10],p:[0,4,0],c:"glass",opa:.5},
  {g:"cyl",s:[1.5,1.5,.2,12],p:[0,.3,0],c:"bark",rep:[2,0,5.2,0]},
  {g:"cyl",s:[.08,.08,5.2,5],p:[-1.3,2.9,0],c:"bark",rep:[2,2.6,0,0]},
  {g:"cone",s:[.9,.9,10],p:[0,.9,0],c:SAND}
]);
A("orrery","infra",[6,6,6],[
  {g:"cyl",s:[.2,.4,2.6,8],p:[0,1.3,0],c:"metal"},
  {g:"sph",s:[.6],p:[0,3.4,0],c:GOLD,glow:1},
  {g:"tor",s:[1.6,.05],p:[0,3.4,0],c:"metal"},{g:"tor",s:[2.2,.05],p:[0,3.4,0],r:[.6,0,0],c:"metal"},
  {g:"tor",s:[2.8,.05],p:[0,3.4,0],r:[0,0,.9],c:"metal"}
]);
A("spiritfire","infra",[2,3,2],[
  {g:"cyl",s:[.8,1,.4,10],p:[0,.2,0],c:"stone"}
]);
A("mirrorstand","infra",[2,4.4,.5],[
  {g:"box",s:[1.9,3.6,.2],p:[0,2.4,0],c:GOLD},
  {g:"box",s:[1.6,3.3,.05],p:[0,2.4,.12],c:0xB8C8D6},
  {g:"box",s:[.8,.6,.8],p:[0,.3,0],c:"bark"}
]);
A("glyphobelisk","structure",[3.4,16,3.4],[
  {g:"box",s:[4,1.4,4],p:[0,.7,0],c:"stone"},
  {g:"box",s:[2.4,13,2.4],p:[0,7.9,0],c:0x2A2C34},
  {g:"cone",s:[1.7,2.4,4],p:[0,15.6,0],r:[0,.785,0],c:GOLD},
  {g:"box",s:[.16,9,.05],p:[0,7.5,1.22],c:0x7FD0FF,glow:1},{g:"box",s:[1.4,.12,.05],p:[0,5,1.22],c:0x7FD0FF,glow:1,rep:[4,0,2,0]}
]);

/* ---------- weapons ---------- */
A("swordstone","infra",[2.4,3,2.4],[
  {g:"ico",s:[1.1],p:[0,.8,0],r:[.3,.5,.1],c:"stone"},
  {g:"box",s:[.14,1.8,.04],p:[0,2,0],c:"metal"},
  {g:"box",s:[.7,.1,.12],p:[0,2.9,0],c:GOLD},
  {g:"cyl",s:[.05,.05,.4,6],p:[0,3.15,0],c:"bark"}
]);
A("sword","infra",[.8,1.8,.2],[
  {g:"box",s:[.12,1.4,.03],p:[0,.7,0],c:"metal"},{g:"box",s:[.5,.08,.1],p:[0,1.45,0],c:GOLD},
  {g:"cyl",s:[.04,.04,.34,6],p:[0,1.66,0],c:"bark"},{g:"sph",s:[.05],p:[0,1.86,0],c:GOLD}
]);
A("weaponrack","infra",[4,2.6,1],[
  {g:"box",s:[4,.16,.3],p:[0,.4,0],c:"bark",rep:[2,0,1.6,0]},
  {g:"box",s:[.16,2.4,.3],p:[-1.9,1.2,0],c:"bark",rep:[2,3.8,0,0]},
  {g:"cyl",s:[.04,.04,2.6,5],p:[-1.2,1.3,.1],c:"bark",rep:[5,.6,0,0]},
  {g:"cone",s:[.08,.3,4],p:[-1.2,2.7,.1],c:"metal",rep:[5,.6,0,0]}
]);
A("shield","infra",[1.2,1.8,.4],[
  {g:"cyl",s:[.08,.08,1.2,5],p:[0,.6,0],c:"bark"},
  {g:"cyl",s:[.6,.6,.08,18],p:[0,1.2,.08],r:[1.5708,0,0],c:"paint"},
  {g:"sph",s:[.14],p:[0,1.2,.14],c:"metal"}
]);
A("axe","infra",[1.4,1.5,1.4],[
  {g:"cyl",s:[.55,.65,.7,10],p:[0,.35,0],c:"bark"},
  {g:"cyl",s:[.04,.04,1,5],p:[0,1.1,0],r:[0,0,.35],c:"bark"},
  {g:"box",s:[.4,.3,.05],p:[.18,.72,0],c:"metal"}
]);
A("arrows","infra",[2,1.2,2],[
  {g:"cyl",s:[.02,.02,1,4],p:[-.5,.4,-.3],r:[.3,0,.2],c:"bark",rep:[6,.2,0,.12]},
  {g:"box",s:[.1,.12,.02],p:[-.4,.88,-.15],r:[.3,0,.2],c:0xE8E4DA,rep:[6,.2,0,.12]}
]);
A("cannon","infra",[2,1.6,3.6],[
  {g:"cyl",s:[.28,.36,2.8,12],p:[0,1,.2],r:[1.4,0,0],c:IRON},
  {g:"cyl",s:[.55,.55,.14,12],p:[-.55,.55,0],r:[0,0,1.5708],c:"bark",rep:[2,1.1,0,0]},
  {g:"box",s:[.9,.5,1.6],p:[0,.6,-.4],c:"bark"}
]);
A("trebuchet","structure",[7,10,9],[
  {g:"box",s:[.4,6,.4],p:[-2,3,0],r:[0,0,.2],c:"bark"},{g:"box",s:[.4,6,.4],p:[2,3,0],r:[0,0,-.2],c:"bark"},
  {g:"box",s:[5,.4,.4],p:[0,5.8,0],c:"bark"},
  {g:"box",s:[.3,.3,9],p:[0,6.4,0],r:[-.5,0,0],c:"bark"},
  {g:"box",s:[1.6,1.6,1.6],p:[0,4.2,-2.8],c:"stone"},
  {g:"box",s:[5,.4,7],p:[0,.2,0],c:"bark"}
]);
A("armorstand","infra",[1,2.2,.7],[
  {g:"cyl",s:[.06,.06,.3,5],p:[0,.15,0],c:"bark"},
  {g:"cyl",s:[.1,.08,.9,7],p:[-.12,.75,0],c:"metal",rep:[2,.24,0,0]},
  {g:"cyl",s:[.28,.2,.7,10],p:[0,1.5,0],c:"metal"},
  {g:"sph",s:[.17],p:[0,2.02,0],c:"metal"},{g:"box",s:[.2,.03,.1],p:[0,2.02,.15],c:"dark"}
]);
A("banner","infra",[1.4,5.6,.2],[
  {g:"cyl",s:[.06,.06,5.6,6],p:[0,2.8,0],c:"bark"},
  {g:"box",s:[1.2,2,.04],p:[.62,4.3,0],c:"paint"},
  {g:"cone",s:[.12,.3,6],p:[0,5.75,0],c:GOLD}
]);

/* ---------- castles and old things ---------- */
A("castle","structure",[76,44,76],[
  {g:"box",s:[26,34,26],p:[0,17,0],c:"stone"},
  {g:"box",s:[3,2.4,3],p:[-11,35.3,-11],c:"stone",rep:[4,7.3,0,0],rep2:[4,0,0,7.3]},
  {g:"cyl",s:[6,6.6,30,12],p:[-32,15,-32],c:"stone",rep:[2,64,0,0],rep2:[2,0,0,64]},
  {g:"cone",s:[7.2,10,12],p:[-32,35,-32],c:"trim",rep:[2,64,0,0],rep2:[2,0,0,64]},
  {g:"cyl",s:[4,4.4,22,10],p:[0,11,-32],c:"stone"},{g:"cone",s:[4.8,7,10],p:[0,25.5,-32],c:"trim"},
  {g:"box",s:[64,16,2.6],p:[0,8,-32],c:"stone"},{g:"box",s:[64,16,2.6],p:[0,8,32],c:"stone"},
  {g:"box",s:[2.6,16,64],p:[-32,8,0],c:"stone"},{g:"box",s:[2.6,16,64],p:[32,8,0],c:"stone"},
  {g:"box",s:[2,2,2],p:[-30,16.8,-32],c:"stone",rep:[16,4,0,0]},
  {g:"box",s:[2,2,2],p:[-30,16.8,32],c:"stone",rep:[16,4,0,0]},
  {g:"box",s:[8,11,1],p:[0,5.5,33],c:"dark"},
  {g:"box",s:[10,1.4,7],p:[0,.7,37],c:"stone"}
]);
/* a palace is not a fortress: long ranges, courts, gardens and gilding */
A("palace","structure",[84,34,60],[
  {g:"box",s:[40,22,26],p:[0,11,-12],c:0xE8E0CC},
  {g:"box",s:[41,1.6,27],p:[0,22.6,-12],c:0xC8A882},
  {g:"box",s:[24,26,24],p:[0,13,-12],c:0xF0E8D4},
  {g:"cyl",s:[8,8,4,16],p:[0,27,-12],c:0xC8A882},{g:"sph",s:[7.4,16,10],p:[0,31,-12],c:GOLD},
  {g:"box",s:[24,18,22],p:[-29,9,4],c:0xE8E0CC},{g:"box",s:[25,1.4,23],p:[-29,18.4,4],c:0xC8A882},
  {g:"box",s:[24,18,22],p:[29,9,4],c:0xE8E0CC},{g:"box",s:[25,1.4,23],p:[29,18.4,4],c:0xC8A882},
  {g:"cyl",s:[1.1,1.1,16,12],p:[-12,8,1],c:0xF6F2E6,rep:[9,3,0,0]},
  {g:"box",s:[28,1.6,3],p:[0,16.6,1],c:0xF0E8D4},
  {g:"box",s:[6,9,.8],p:[0,4.5,2],c:0x6B4A32},
  {g:"cyl",s:[3,3.2,.7,16],p:[0,.35,24],c:0xC8A882},{g:"cyl",s:[2.6,2.6,.5,16],p:[0,.5,24],c:"water"},
  {g:"sph",s:[.6],p:[0,1.4,24],c:GOLD},
  {g:"box",s:[54,.3,12],p:[0,.1,24],c:0xBFCBA8}
]);
/* a manor: a great house, and no more than that */
A("manor","structure",[34,18,26],[
  {g:"box",s:[26,12,18],p:[0,6,0],c:0xD8CCB4},
  {g:"box",s:[27,.6,19],p:[0,12.4,0],r:[0,0,0],c:0x5A4238},
  {g:"box",s:[27,.7,10],p:[0,14.4,-4.6],r:[.55,0,0],c:0x5A4238},
  {g:"box",s:[27,.7,10],p:[0,14.4,4.6],r:[-.55,0,0],c:0x5A4238},
  {g:"box",s:[8,13,7],p:[-13,6.5,2],c:0xD8CCB4},{g:"box",s:[8,13,7],p:[13,6.5,2],c:0xD8CCB4},
  {g:"box",s:[2.4,4.4,.5],p:[0,2.2,9.2],c:0x4A3222},
  {g:"cyl",s:[.5,.5,4.4,10],p:[-2.2,2.2,9.6],c:0xF2EEE2},{g:"cyl",s:[.5,.5,4.4,10],p:[2.2,2.2,9.6],c:0xF2EEE2},
  {g:"box",s:[6,.5,3],p:[0,4.5,10.4],c:0xD8CCB4},
  {g:"box",s:[2,2.6,.2],p:[-7,3.4,9.1],c:"glass",rep:[2,14,0,0]},
  {g:"box",s:[2,2.2,.2],p:[-7,8.6,9.1],c:"glass",rep:[2,14,0,0]},
  {g:"box",s:[1.4,3,1.4],p:[-8,14,-3],c:0x8A5A3A},{g:"box",s:[1.4,3,1.4],p:[8,14,-3],c:0x8A5A3A}
]);
A("castlewall","infra",[20,9,3],[
  {g:"box",s:[20,8,2.4],p:[0,4,0],c:"stone"},
  {g:"box",s:[1.6,1.4,2.4],p:[-9,8.7,0],c:"stone",rep:[7,3,0,0]}
]);
A("throne","infra",[2,3.4,2],[
  {g:"box",s:[1.8,.9,1.6],p:[0,.45,0],c:GOLD},
  {g:"box",s:[1.8,2.6,.3],p:[0,2,-.65],c:GOLD},
  {g:"box",s:[1.4,.2,1.3],p:[0,.95,.05],c:0x7A1E2A}
]);
A("graveyard","nature",[22,2,22],[
  {g:"box",s:[1,1.2,.25],p:[-8,.6,-8],c:"stone",rep:[5,4,0,0],rep2:[5,0,0,4]},
  {g:"box",s:[.14,1.6,.14],p:[-11,.8,-11],c:IRON,rep:[12,2,0,0]},
  {g:"box",s:[.14,1.6,.14],p:[-11,.8,11],c:IRON,rep:[12,2,0,0]}
]);
A("scarecrow","infra",[1.6,2.6,.5],[
  {g:"cyl",s:[.06,.06,2.4,5],p:[0,1.2,0],c:"bark"},{g:"cyl",s:[.05,.05,1.6,5],p:[0,1.8,0],r:[0,0,1.5708],c:"bark"},
  {g:"box",s:[.5,.7,.3],p:[0,1.6,0],c:"paint"},{g:"sph",s:[.2],p:[0,2.2,0],c:SAND},
  {g:"cone",s:[.34,.3,8],p:[0,2.44,0],c:"bark"}
]);
A("ship","vehicle",[8,16,28],[
  {g:"box",s:[7,3,24],p:[0,1.5,0],c:"bark"},{g:"cone",s:[3.5,5,4],p:[0,1.5,14],r:[1.5708,.785,0],c:"bark"},
  {g:"cyl",s:[.25,.3,14,6],p:[0,10,-3],c:"bark"},{g:"cyl",s:[.2,.25,11,6],p:[0,8.5,6],c:"bark"},
  {g:"box",s:[7,6,.1],p:[0,11,-3],c:0xE6DCC2},{g:"box",s:[5.5,4.6,.1],p:[0,9.6,6],c:0xE6DCC2}
]);
A("hotairballoon","vehicle",[8,17,8],[
  {g:"sph",s:[4.4],p:[0,12,0],c:"paint"},{g:"cone",s:[2.6,3,12],p:[0,8.2,0],r:[3.14159,0,0],c:"paint"},
  {g:"box",s:[1.6,1.1,1.6],p:[0,4.4,0],c:"bark"},
  {g:"cyl",s:[.02,.02,2.6,4],p:[-.7,5.9,-.7],c:"dark",rep:[2,1.4,0,0],rep2:[2,0,0,1.4]}
]);

/* ---------- fairground and market ---------- */
A("ferriswheel","structure",[24,28,6],[
  {g:"box",s:[1,26,1],p:[-4,12,0],r:[0,0,.18],c:"metal"},{g:"box",s:[1,26,1],p:[4,12,0],r:[0,0,-.18],c:"metal"},
  {g:"box",s:[12,1,3],p:[0,.5,0],c:"metal"}
]);
A("carousel","structure",[12,7,12],[
  {g:"cyl",s:[5.8,6,.6,20],p:[0,.3,0],c:"white"},
  {g:"cyl",s:[.4,.4,6,10],p:[0,3.3,0],c:GOLD}
]);
A("marketstall","infra",[4,3.2,3],[
  {g:"box",s:[3.6,1,1.4],p:[0,.5,.4],c:"bark"},
  {g:"cyl",s:[.06,.06,2.6,5],p:[-1.7,1.3,-.8],c:"bark",rep:[2,3.4,0,0],rep2:[2,0,0,2]},
  {g:"box",s:[4,.1,2.8],p:[0,2.7,.2],r:[.2,0,0],c:"paint"},
  {g:"sph",s:[.18],p:[-1.2,1.15,.5],c:0xC0392B,rep:[6,.48,0,0]}
]);

/* ---------- landforms and growing things ---------- */
A("waterfall","nature",[30,22,10],[
  {g:"box",s:[30,20,6],p:[0,10,-4],c:"stone"},
  {g:"pln",s:[8,20],p:[0,10,-0.95],c:"water",opa:.8},
  {g:"cyl",s:[8,8,.4,16],p:[0,.2,3],c:"water",opa:.85}
]);
A("geyser","nature",[4,14,4],[
  {g:"cyl",s:[1.8,2.2,.6,12],p:[0,.3,0],c:0xB8A890},{g:"cyl",s:[.8,.8,.1,10],p:[0,.62,0],c:"water"}
]);
A("giantmushroom","nature",[7,9,7],[
  {g:"cyl",s:[.8,1.1,6,10],p:[0,3,0],c:0xE6DCC2},
  {g:"sph",s:[3.4],p:[0,6.6,0],c:0xA8322B},{g:"sph",s:[.4],p:[1.6,8.4,.6],c:0xF2EEE6,rep:[3,-1.4,.3,-.5]}
]);
A("cactus","nature",[1.6,4.4,1.6],[
  {g:"cyl",s:[.4,.45,4,8],p:[0,2,0],c:0x4F7A3A},
  {g:"cyl",s:[.25,.25,1.4,8],p:[.6,2.4,0],r:[0,0,-.8],c:0x4F7A3A},{g:"cyl",s:[.25,.25,1.2,8],p:[-.55,2.8,0],r:[0,0,.8],c:0x4F7A3A}
]);
A("reeds","nature",[3,1.8,3],[
  {g:"cyl",s:[.03,.03,1.6,4],p:[-1,.8,-1],c:0x7A8A4A,rep:[6,.4,0,.35]},
  {g:"cyl",s:[.06,.06,.3,5],p:[-1,1.65,-1],c:0x5A3A22,rep:[6,.4,0,.35]}
]);
A("dune","nature",[54,7,36],[]);

/* ---------- builders for things that must move as one ---------- */
var DECOR={
  /* a dune is a ridge of sand, not a buried ball: the surface falls to nothing at the
     edges so it meets the ground without an edge to shimmer, with a steep slip face
     on the lee side and ripples across the back */
  dune:function(g,spec,f){
    var W=54, D=36, SX=54, SZ=36;
    var geo=new THREE.PlaneGeometry(W,D,SX,SZ), pos=geo.attributes&&geo.attributes.position;
    var h=hash(spec.id), turn=(h%628)/100, A=5.2+((h>>>5)%30)/10;
    for(var i=0;pos&&i<pos.count;i++){
      var x=pos.getX(i), z=-pos.getY(i);
      var u=x/(W/2), v=z/(D/2);
      var edge=Math.max(0,1-(u*u+v*v));          // nothing left at the rim
      var crest=Math.exp(-(u*u)/0.34);            // a ridge running across
      var lee=v<0?Math.exp(-(v*v)/0.10):Math.exp(-(v*v)/0.62);  // steep one side, long the other
      var ripple=(typeof vnoise==="function"?vnoise(x/7+h%50,z/7):0)*0.35*edge;
      pos.setZ(i,Math.max(0,A*crest*lee*edge*edge+ripple));
    }
    if(pos){ pos.needsUpdate=true; if(geo.computeVertexNormals) geo.computeVertexNormals(); }
    if(typeof metreUVs==="function") metreUVs(geo,"pln",[W,D]);
    var mat=new THREE.MeshLambertMaterial({color:SAND});
    var tx=(typeof texOf==="function"&&f>0.5)?texOf("sand"):null;
    if(tx) mat.map=tx;
    var m=new THREE.Mesh(geo,mat);
    m.rotation.x=-Math.PI/2; m.position.y=0.02;
    m.receiveShadow=true; m.castShadow=false;    // a smooth mound casting on itself is what flickers
    g.rotation.y=turn;
    g.add(m);
  },
  /* five chords joining every second point of a circle make the star */
  sigil:function(g){
    var R=3.6, m=new THREE.MeshBasicMaterial({color:0xE8C27A,transparent:true,opacity:0.9,depthWrite:false});
    for(var k=0;k<5;k++){
      var a1=Math.PI/2+k*2*Math.PI/5, a2=Math.PI/2+(k+2)*2*Math.PI/5;
      var x1=Math.cos(a1)*R, z1=-Math.sin(a1)*R, x2=Math.cos(a2)*R, z2=-Math.sin(a2)*R;
      var len=Math.sqrt((x2-x1)*(x2-x1)+(z2-z1)*(z2-z1));
      var bar=new THREE.Mesh(new THREE.BoxGeometry(len,.05,.14),m);
      bar.position.set((x1+x2)/2,.1,(z1+z2)/2); bar.rotation.y=-Math.atan2(z2-z1,x2-x1);
      g.add(bar);
    }
  },
  ferriswheel:function(g,spec,f){
    var wheel=new THREE.Group(); wheel.position.set(0,14,1.4);
    var m=new THREE.MeshLambertMaterial({color:ROLE.metal});
    var rim=new THREE.Mesh(new THREE.TorusGeometry(11,.25,6,40),m); wheel.add(rim);
    for(var i=0;i<8;i++){
      var sp=new THREE.Mesh(new THREE.BoxGeometry(.2,22,.2),m); sp.rotation.z=i*Math.PI/8; wheel.add(sp);
    }
    var cabCol=[0xA8322B,0x2F5E9E,0xC7A043,0x3F7A3A];
    for(var k=0;k<12;k++){
      var a=k*Math.PI/6, cab=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.4,1.4),new THREE.MeshLambertMaterial({color:cabCol[k%4]}));
      cab.position.set(Math.cos(a)*11,Math.sin(a)*11,0); wheel.add(cab);
    }
    g.add(wheel); g.userData.wheel=wheel;
  },
  carousel:function(g){
    var spin=new THREE.Group();
    var roof=new THREE.Mesh(new THREE.ConeGeometry(6.4,2.6,20),new THREE.MeshLambertMaterial({color:0xA8322B})); roof.position.y=7; spin.add(roof);
    var disc=new THREE.Mesh(new THREE.CylinderGeometry(6.2,6.2,.4,20),new THREE.MeshLambertMaterial({color:0xC7A043})); disc.position.y=5.6; spin.add(disc);
    for(var i=0;i<8;i++){
      var a=i*Math.PI/4, pole=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,5,5),new THREE.MeshLambertMaterial({color:GOLD}));
      pole.position.set(Math.cos(a)*4.6,3.2,Math.sin(a)*4.6); spin.add(pole);
      var horse=new THREE.Mesh(new THREE.BoxGeometry(.4,.7,1.3),new THREE.MeshLambertMaterial({color:i%2?0xF2EEE6:0x5E3A2A}));
      horse.position.set(Math.cos(a)*4.6,2+(i%2)*.5,Math.sin(a)*4.6); horse.rotation.y=-a; spin.add(horse);
    }
    g.add(spin); g.userData.spin=spin;
  },
  lightningstorm:function(g){
    var bolt=new THREE.Group(), m=new THREE.MeshBasicMaterial({color:0xE8F0FF});
    var y=40, x=0;
    for(var i=0;i<6;i++){ var len=7, seg=new THREE.Mesh(new THREE.BoxGeometry(.5,len,.5),m);
      var nx=x+(Math.random()-.5)*5; seg.position.set((x+nx)/2,y-len/2,0); seg.rotation.z=Math.atan2(nx-x,len)*-1; bolt.add(seg); x=nx; y-=len; }
    bolt.visible=false; g.add(bolt); g.userData.bolt=bolt;
  }
};

/* ---------- trigger words for all of the above ---------- */
var MORE_VOCAB={
  volcano:["volcano","volcanic","erupting mountain","eruption"],
  sandstorm:["sandstorm","sand storm","dust storm","haboob"],
  tornado:["tornado","twister","whirlwind","hurricane","cyclone","waterspout"],
  wildfire:["wildfire","forest fire","inferno","burning forest","brush fire"],
  fire:["fire","flames","blaze","bonfire","campfire","burning"],
  flood:["flood","flooding","floodwaters","flood waters","rising water","deluge"],
  tidalwave:["tidal wave","tsunami","giant wave","huge wave","wall of water"],
  fissure:["fissure","crack in the ground","crack in the earth","chasm","earthquake","the ground split"],
  lavaflow:["lava","lava flow","molten rock","magma"],
  crater:["crater","impact crater"],
  meteor:["meteor","falling star","shooting star","comet","fireball","meteorite"],
  blizzard:["blizzard","snowstorm","snow storm","whiteout"],
  stormcloud:["storm","storm cloud","thunderstorm","raincloud","rain cloud","downpour","rainstorm"],
  lightningstorm:["lightning","lightning storm","thunder and lightning"],
  ashcloud:["ash cloud","column of smoke","black smoke"],
  sinkhole:["sinkhole","pit","abyss","bottomless pit"],
  crypt:["crypt","tomb chamber","ossuary"],
  trapdoor:["trapdoor","trap door","hatch in the floor"],
  cellar:["cellar","cellar door","root cellar","basement"],
  hiddenroom:["hidden room","secret room","hidden chamber","secret chamber","priest hole"],
  vaultdoor:["vault door","round door","great round door"],
  catacomb:["catacomb","catacombs","underground tomb"],
  secretstair:["secret stair","secret stairs","hidden stairs","stairs going down","stairs into the ground"],
  mineshaft:["mineshaft","mine shaft"],
  barrow:["barrow","burial mound","mound tomb"],
  crystal:["crystal","crystals","gem","gemstone"],
  crystalspire:["crystal spire","crystal tower","giant crystal"],
  runestone:["runestone","rune stone","runes","carved stone"],
  cauldron:["cauldron","pot bubbling"],
  floatingisland:["floating island","island in the sky","floating rock"],
  orb:["orb","glowing sphere","scrying ball","crystal ball"],
  lectern:["lectern","grimoire","spellbook","book of spells","open book"],
  wisps:["wisps","will-o-the-wisp","will o the wisp","lights in the air","floating lights","fireflies"],
  worldtree:["world tree","great tree","tree of life","yggdrasil","ancient tree"],
  sigil:["sigil","glowing symbol","pentacle","pentagram","magic circle"],
  hourglass:["hourglass","sand glass"],
  orrery:["orrery","armillary","astrolabe"],
  spiritfire:["blue fire","spirit fire","ghost fire","witch fire"],
  mirrorstand:["standing mirror","looking glass","tall mirror"],
  glyphobelisk:["glowing obelisk","carved obelisk","obelisk of glyphs","glyphs"],
  swordstone:["sword in the stone","sword in a stone","sword stuck in stone"],
  sword:["sword","blade","dagger","knife"],
  weaponrack:["weapon rack","weapons","armoury","armory","spears","spear","rack of spears"],
  shield:["shield","buckler"],
  axe:["axe","battle axe","hatchet"],
  arrows:["arrows","arrow","quiver","bow and arrow"],
  cannon:["cannon","artillery"],
  trebuchet:["trebuchet","catapult","siege engine"],
  armorstand:["suit of armor","suit of armour","armor","armour","knight's armor"],
  banner:["banner","war banner","flag"],
  castle:["castle","fortress","citadel","stronghold"],
  castlewall:["battlements","castle wall","rampart wall","parapet"],
  throne:["throne","great chair"],
  graveyard:["graveyard","cemetery","churchyard","burial ground"],
  scarecrow:["scarecrow"],
  ship:["sailing ship","galleon","pirate ship","tall ship","ship"],
  hotairballoon:["hot air balloon","balloon","airship"],
  ferriswheel:["ferris wheel","big wheel"],
  carousel:["carousel","merry-go-round","merry go round"],
  marketstall:["market stall","stall","fruit stand","vendor"],
  waterfall:["waterfall","cascade"],
  geyser:["geyser","hot spring","steam vent"],
  giantmushroom:["giant mushroom","toadstool","mushroom"],
  cactus:["cactus","cacti"],
  reeds:["reeds","bulrushes","cattails","rushes"],
  dune:["dune","sand dune","dunes","desert"]
};

