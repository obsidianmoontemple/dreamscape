/* SomnuMatrix — cultural.js
   buildings and decorations from around the world, so a dreamscape can look like
   the places people actually come from. public architecture and public festival
   decoration only: nothing sacred that belongs to a closed tradition, and nothing
   borrowed that isn't ours to build.
   loaded as a plain script; shares scope with the other files */
"use strict";

var LACQ=0xB03A2E, JADE=0x3E8C73, IVORYW=0xEDE6D6, TILEBLUE=0x2E5EA8, ADOBE=0xC8865A, TEAK=0x6B4A32, GOLDLF=0xC7A043;

/* ---------- gates and thresholds ---------- */
S("torii","structure",[9,7,2],[
  {g:"cyl",s:[.34,.4,6,10],p:[-3.4,3,0],r:[0,0,.03],c:LACQ},
  {g:"cyl",s:[.34,.4,6,10],p:[3.4,3,0],r:[0,0,-.03],c:LACQ},
  {g:"box",s:[9.6,.5,.7],p:[0,6.2,0],r:[0,0,.02],c:LACQ},
  {g:"box",s:[10.6,.34,.9],p:[0,6.7,0],c:0x141210},
  {g:"box",s:[7,.34,.5],p:[0,5.3,0],c:LACQ}
],["torii","torii gate","shrine gate","red gate"]);
S("paifang","structure",[12,9,2],[
  {g:"cyl",s:[.36,.42,7,10],p:[-4.6,3.5,0],c:LACQ},{g:"cyl",s:[.36,.42,7,10],p:[4.6,3.5,0],c:LACQ},
  {g:"box",s:[11,.7,1],p:[0,7.2,0],c:LACQ},{g:"box",s:[12.4,.3,1.6],p:[0,7.9,0],c:JADE},
  {g:"box",s:[6,.5,1.2],p:[0,8.5,0],c:JADE},{g:"box",s:[3.4,1,.2],p:[0,6,.3],c:GOLDLF}
],["paifang","chinese archway","memorial arch","painted archway"]);
S("moongate","structure",[6,6,1.2],[
  {g:"tor",s:[2.4,.55],p:[0,2.8,0],c:0xD8D2C4},
  {g:"box",s:[6,.5,1],p:[0,.25,0],c:0xD8D2C4}
],["moon gate","round gateway","circular gate","moon door"]);
S("gopuram","structure",[14,26,8],[
  {g:"box",s:[13,5,7],p:[0,2.5,0],c:0xE0D0B0},
  {g:"box",s:[11,5,6],p:[0,7.5,0],c:0xE8C27A},{g:"box",s:[9,4.5,5],p:[0,12.2,0],c:0xD98A5A},
  {g:"box",s:[7,4,4.2],p:[0,16.5,0],c:0xE0D0B0},{g:"box",s:[5,3,3.4],p:[0,20,0],c:0xE8C27A},
  {g:"sph",s:[.9],p:[-1.6,22,0],c:GOLDLF},{g:"sph",s:[.9],p:[0,22.4,0],c:GOLDLF},{g:"sph",s:[.9],p:[1.6,22,0],c:GOLDLF},
  {g:"box",s:[3,5,.3],p:[0,2.5,3.6],c:"dark"}
],["gopuram","temple gate tower","tiered temple gate","south indian temple"]);

/* ---------- houses and halls ---------- */
S("pagoda","structure",[12,22,12],[
  {g:"cyl",s:[3.2,3.4,4,8],p:[0,2,0],c:0xE6DCC8},
  {g:"cyl",s:[6,6.4,.3,8],p:[0,4.2,0],c:LACQ},{g:"cyl",s:[2.8,3,3.4,8],p:[0,6,0],c:0xE6DCC8},
  {g:"cyl",s:[5.2,5.6,.3,8],p:[0,7.9,0],c:LACQ},{g:"cyl",s:[2.4,2.6,3,8],p:[0,9.6,0],c:0xE6DCC8},
  {g:"cyl",s:[4.4,4.8,.3,8],p:[0,11.3,0],c:LACQ},{g:"cyl",s:[2,2.2,2.6,8],p:[0,12.8,0],c:0xE6DCC8},
  {g:"cyl",s:[3.6,4,.3,8],p:[0,14.3,0],c:LACQ},{g:"cone",s:[2.4,3,8],p:[0,16,0],c:LACQ},
  {g:"cyl",s:[.12,.12,3,6],p:[0,18.6,0],c:GOLDLF},
  {g:"box",s:[1.4,2.4,.2],p:[0,1.2,3.45],c:"dark"}
],["pagoda","tiered tower","japanese pagoda","chinese pagoda"]);
S("hanok","structure",[14,7,10],[
  {g:"box",s:[13,3,9],p:[0,1.5,0],c:0xE8DCC4},
  {g:"box",s:[15,.4,11],p:[0,3.4,0],r:[0,0,0],c:0x4A4E56},
  {g:"box",s:[15.6,.5,4.6],p:[0,4.1,-3],r:[.32,0,0],c:0x4A4E56},
  {g:"box",s:[15.6,.5,4.6],p:[0,4.1,3],r:[-.32,0,0],c:0x4A4E56},
  {g:"cyl",s:[.2,.22,3,8],p:[-6,1.5,4.4],c:TEAK,rep:[5,3,0,0]},
  {g:"box",s:[2.6,2,.12],p:[0,1.4,4.5],c:0xF2EEDE},{g:"box",s:[1.6,2,.14],p:[-3.6,1.4,4.5],c:0xF2EEDE}
],["hanok","korean house","tiled-roof house","courtyard house with curved roof"]);
S("machiya","structure",[10,8,12],[
  {g:"box",s:[9,5,11],p:[0,2.5,0],c:0x6B5A46},
  {g:"box",s:[10,.3,12],p:[0,5.4,0],c:0x3A3C42},{g:"box",s:[10.4,.4,4],p:[0,6.4,-3.4],r:[.5,0,0],c:0x3A3C42},
  {g:"box",s:[10.4,.4,4],p:[0,6.4,3.4],r:[-.5,0,0],c:0x3A3C42},
  {g:"box",s:[7,2.6,.1],p:[0,2,5.55],c:0xE8DCC0},
  {g:"box",s:[.08,2.6,.08],p:[-3,2,5.62],c:TEAK,rep:[9,.75,0,0]},
  {g:"box",s:[1,2.2,.2],p:[3.4,1.1,5.6],c:"dark"}
],["machiya","japanese townhouse","wooden townhouse"]);
S("izba","structure",[10,8,8],[
  {g:"box",s:[9,3.6,7],p:[0,1.8,0],c:0x8A6A48},
  {g:"box",s:[.2,3.6,7.2],p:[-4.5,1.8,0],c:0x6B4A32},{g:"box",s:[.2,3.6,7.2],p:[4.5,1.8,0],c:0x6B4A32},
  {g:"box",s:[9.6,.4,4.6],p:[0,4.6,-1.7],r:[.6,0,0],c:0x4A4238},
  {g:"box",s:[9.6,.4,4.6],p:[0,4.6,1.7],r:[-.6,0,0],c:0x4A4238},
  {g:"box",s:[1.4,1.2,.14],p:[-2.2,2.6,3.55],c:"glass"},{g:"box",s:[1.4,1.2,.14],p:[2.2,2.6,3.55],c:"glass"},
  {g:"box",s:[1.9,1.7,.1],p:[-2.2,2.6,3.62],c:0x2E5EA8},{g:"box",s:[1.9,1.7,.1],p:[2.2,2.6,3.62],c:0x2E5EA8},
  {g:"box",s:[1.1,2.2,.2],p:[0,1.1,3.6],c:"dark"}
],["izba","russian wooden house","carved wooden cottage","dacha"]);
S("yurt","structure",[9,5,9],[
  {g:"cyl",s:[4.2,4.2,2.6,20],p:[0,1.3,0],c:0xF2EEE2},
  {g:"cone",s:[4.4,1.8,20],p:[0,3.5,0],c:0xF2EEE2},
  {g:"cyl",s:[.7,.7,.5,12],p:[0,4.5,0],c:0xC8A04A},
  {g:"box",s:[.12,2.6,.12],p:[0,1.3,4.2],c:LACQ,rep:[6,1.3,0,0]},
  {g:"box",s:[1.2,2,.16],p:[0,1,4.25],c:LACQ}
],["yurt","ger","round tent","nomad house","mongolian tent"]);
S("pueblo","structure",[18,9,14],[
  {g:"box",s:[16,3.4,12],p:[0,1.7,0],c:ADOBE},
  {g:"box",s:[11,3,9],p:[-2,4.8,-1],c:0xD0946A},
  {g:"box",s:[6,2.8,6],p:[-4,7.6,-1],c:ADOBE},
  {g:"cyl",s:[.16,.16,2.4,6],p:[-7,3.2,5.8],r:[Math.PI/2,0,0],c:TEAK,rep:[6,2.4,0,0]},
  {g:"box",s:[1.2,2.2,.3],p:[2,1.1,6],c:"dark"},
  {g:"box",s:[1.1,1,.2],p:[-3,2.2,6],c:"glass"}
],["pueblo","adobe house","adobe village","earthen house","mud-brick house"]);
S("hacienda","structure",[22,8,16],[
  {g:"box",s:[20,4.6,14],p:[0,2.3,0],c:0xF0E2CC},
  {g:"box",s:[21,.5,15],p:[0,4.8,0],c:0xB0563A},
  {g:"cyl",s:[.28,.3,3.4,8],p:[-8,1.7,7.6],c:0xE8DCC4,rep:[6,3.2,0,0]},
  {g:"box",s:[20,.4,2.6],p:[0,3.6,7.8],c:0xB0563A},
  {g:"box",s:[1.8,3,.3],p:[0,1.5,7.1],c:TEAK},
  {g:"box",s:[1.4,1.6,.16],p:[-5,2.6,7.1],c:"glass"},{g:"box",s:[1.4,1.6,.16],p:[5,2.6,7.1],c:"glass"}
],["hacienda","spanish villa","colonial house with a veranda","tiled villa"]);
S("riad","structure",[18,9,18],[
  {g:"box",s:[17,6,17],p:[0,3,0],c:0xE8D8B8},
  {g:"box",s:[9,6.6,9],p:[0,3,0],c:0x2E2C2A},
  {g:"box",s:[17.6,.5,17.6],p:[0,6.2,0],c:0xC8A882},
  {g:"box",s:[2,3.4,.4],p:[0,1.7,8.6],c:TILEBLUE},
  {g:"cyl",s:[1,1,.5,16],p:[0,.3,0],c:TILEBLUE},{g:"cyl",s:[.2,.2,1.6,8],p:[0,1.1,0],c:0xE8E4DA}
],["riad","moroccan house","courtyard house","house around a courtyard"]);
S("roundhouse","structure",[10,7,10],[
  {g:"cyl",s:[4.4,4.6,2.6,16],p:[0,1.3,0],c:0xD8C8A8},
  {g:"cone",s:[5.2,3.4,16],p:[0,4.3,0],c:0x8A6A3A},
  {g:"box",s:[1.3,2,.3],p:[0,1,4.5],c:"dark"}
],["roundhouse","thatched roundhouse","round hut","thatched hut"]);
S("longhouse","structure",[10,8,26],[
  {g:"box",s:[8,3.4,24],p:[0,1.7,0],c:0x7A5A3A},
  {g:"box",s:[9.4,.5,12],p:[0,4.9,-6],r:[.6,0,0],c:0x4A6A3A},{g:"box",s:[9.4,.5,12],p:[0,4.9,6],r:[-.6,0,0],c:0x4A6A3A},
  {g:"box",s:[9.4,.5,12],p:[0,4.9,-6],r:[.6,0,0],c:0x4A6A3A},
  {g:"box",s:[1.4,2.2,.3],p:[0,1.1,12.2],c:"dark"},
  {g:"cyl",s:[.22,.26,4,7],p:[-4.4,2,-10],c:TEAK,rep:[6,0,0,4]}
],["longhouse","long hall","mead hall","viking hall","long wooden house"]);
S("stilthouse","structure",[10,8,10],[
  {g:"cyl",s:[.24,.28,3,7],p:[-3.4,1.5,-3.4],c:TEAK,rep:[2,6.8,0,0]},
  {g:"cyl",s:[.24,.28,3,7],p:[-3.4,1.5,3.4],c:TEAK,rep:[2,6.8,0,0]},
  {g:"box",s:[8,.4,8],p:[0,3.1,0],c:TEAK},
  {g:"box",s:[7,2.6,7],p:[0,4.6,0],c:0xC8A878},
  {g:"cone",s:[6.4,2.6,4],p:[0,7.2,0],r:[0,.785,0],c:0x8A6A3A},
  {g:"box",s:[1.2,.16,3],p:[0,1.6,5],r:[-.5,0,0],c:TEAK}
],["stilt house","house on stilts","water village house","raised house"]);
S("cycladic","structure",[10,7,9],[
  {g:"box",s:[9,4,8],p:[0,2,0],c:0xF4F2EC},
  {g:"box",s:[5,2.6,4.6],p:[-2,5.3,-1],c:0xF4F2EC},
  {g:"cyl",s:[2.6,2.6,.6,14],p:[2.6,4.4,1],c:TILEBLUE},
  {g:"box",s:[1.1,2.1,.2],p:[0,1.05,4.1],c:TILEBLUE},
  {g:"box",s:[1.1,1.1,.16],p:[-3,2.4,4.1],c:TILEBLUE},{g:"box",s:[1.1,1.1,.16],p:[3,2.4,4.1],c:TILEBLUE}
],["white house with blue shutters","cycladic house","greek island house","whitewashed house"]);
S("stupa","structure",[14,14,14],[
  {g:"cyl",s:[6,6.4,1.6,20],p:[0,.8,0],c:0xF2EEE2},
  {g:"sph",s:[5],p:[0,4.4,0],c:0xF2EEE2},
  {g:"box",s:[2.6,2,2.6],p:[0,8.4,0],c:GOLDLF},
  {g:"cone",s:[1.4,4,12],p:[0,11.2,0],c:GOLDLF},
  {g:"sph",s:[.5],p:[0,13.4,0],c:GOLDLF}
],["stupa","white dome shrine","domed monument","reliquary mound"]);
S("mosque","structure",[24,26,20],[
  {g:"box",s:[20,7,18],p:[0,3.5,0],c:0xE8E0CC},
  {g:"sph",s:[6.4],p:[0,8,0],c:TILEBLUE},{g:"cyl",s:[1,1,1.4,12],p:[0,14.2,0],c:GOLDLF},{g:"cone",s:[.5,1.6,8],p:[0,15.6,0],c:GOLDLF},
  {g:"cyl",s:[1.2,1.4,18,12],p:[-11,9,7],c:0xE8E0CC},{g:"cyl",s:[1.8,1.8,.5,12],p:[-11,17.6,7],c:0xE8E0CC},
  {g:"cone",s:[1.5,2.6,12],p:[-11,19,7],c:TILEBLUE},
  {g:"box",s:[3,5,.4],p:[0,2.5,9.2],c:TEAK},
  {g:"box",s:[1.6,2.6,.2],p:[-5,3,9.1],c:"glass"},{g:"box",s:[1.6,2.6,.2],p:[5,3,9.1],c:"glass"}
],["mosque","masjid","domed mosque","mosque with a minaret"]);
S("minaret","structure",[5,22,5],[
  {g:"cyl",s:[1.2,1.5,18,12],p:[0,9,0],c:0xE8E0CC},
  {g:"cyl",s:[2,2,.5,12],p:[0,17.6,0],c:0xE8E0CC},
  {g:"cone",s:[1.6,3,12],p:[0,19.4,0],c:TILEBLUE},
  {g:"box",s:[.5,1.2,.2],p:[0,14,1.4],c:"dark",rep:[3,0,-3,0]}
],["minaret","tower of a mosque","slender tower"]);
S("mandir","structure",[16,20,16],[
  {g:"box",s:[14,4,14],p:[0,2,0],c:0xE8D8B8},
  {g:"box",s:[10,3,10],p:[0,5.5,0],c:0xE0CCA8},
  {g:"cone",s:[6,9,8],p:[0,11,0],c:0xD8B888},
  {g:"cyl",s:[.8,.8,1.2,10],p:[0,16.4,0],c:GOLDLF},{g:"sph",s:[.7],p:[0,17.4,0],c:GOLDLF},
  {g:"cyl",s:[.5,.5,3.6,8],p:[-5,4,6.4],c:0xE8D8B8,rep:[3,5,0,0]},
  {g:"box",s:[2.4,3.4,.3],p:[0,1.7,7.2],c:"dark"}
],["mandir","hindu temple","temple with a tower","shikhara temple"]);
S("ziggurat","structure",[30,18,30],[
  {g:"box",s:[28,5,28],p:[0,2.5,0],c:0xC8A882},
  {g:"box",s:[21,4.6,21],p:[0,7.3,0],c:0xC09A76},
  {g:"box",s:[14,4.2,14],p:[0,11.7,0],c:0xC8A882},
  {g:"box",s:[8,3,8],p:[0,15.3,0],c:0xB08A66},
  {g:"box",s:[4,.5,16],p:[0,3,13],r:[-.32,0,0],c:0xA88A66}
],["ziggurat","stepped temple","terraced tower","great stepped pyramid"]);

/* ---------- decoration and small things ---------- */
S("redlanterns","infra",[10,5,1],[
  {g:"cyl",s:[.01,.01,10,3],p:[0,4.6,0],r:[0,0,Math.PI/2],c:0x2A2622},
  {g:"sph",s:[.42],p:[-3.6,3.9,0],c:LACQ,glow:1,pulse:1,rep:[6,1.45,0,0]},
  {g:"cyl",s:[.14,.14,.12,8],p:[-3.6,4.3,0],c:GOLDLF,rep:[6,1.45,0,0]}
],["red lanterns","string of lanterns","hanging lanterns","lantern string"]);
S("prayerflags","infra",[16,6,1],[
  {g:"cyl",s:[.01,.01,16,3],p:[0,4.4,0],r:[0,0,.06],c:0x2A2622},
  {g:"box",s:[.8,1,.02],p:[-6.4,3.7,0],c:TILEBLUE,rep:[3,3.2,-.1,0]},
  {g:"box",s:[.8,1,.02],p:[-5.3,3.65,0],c:0xF2F2EC,rep:[3,3.2,-.1,0]},
  {g:"box",s:[.8,1,.02],p:[-4.2,3.6,0],c:LACQ,rep:[3,3.2,-.1,0]},
  {g:"box",s:[.8,1,.02],p:[-3.1,3.55,0],c:0x3F7A3A,rep:[3,3.2,-.1,0]},
  {g:"box",s:[.8,1,.02],p:[-2,3.5,0],c:0xD4B83C,rep:[3,3.2,-.1,0]}
],["prayer flags","strings of flags","colourful flags on a line","flag line"]);
S("papelpicado","infra",[14,5,1],[
  {g:"cyl",s:[.01,.01,14,3],p:[0,4.2,0],r:[0,0,-.05],c:0x2A2622},
  {g:"box",s:[1.1,.9,.02],p:[-5.4,3.6,0],c:0xE85A9E,rep:[4,1.6,.04,0]},
  {g:"box",s:[1.1,.9,.02],p:[-4.6,3.64,0],c:0xF0C43A,rep:[4,1.6,.04,0]},
  {g:"box",s:[1.1,.9,.02],p:[-3.8,3.68,0],c:0x3FB0E8,rep:[4,1.6,.04,0]}
],["papel picado","cut paper banners","fiesta banners","paper bunting"]);
S("ofrenda","structure",[4,3,2],[
  {g:"box",s:[3.4,.9,1.4],p:[0,.45,0],c:0x8A2A3A},
  {g:"box",s:[2.6,.8,1.1],p:[0,1.3,-.1],c:0xC0503A},
  {g:"box",s:[1.8,.7,.9],p:[0,2,-.2],c:0xE8A04A},
  {g:"sph",s:[.16],p:[-1.2,1.85,.4],c:0xF0C43A,glow:1,pulse:1,rep:[3,1.2,0,0]},
  {g:"cyl",s:[.07,.07,.4,6],p:[-.8,2.55,-.2],c:0xF2EEE6},{g:"cyl",s:[.07,.07,.4,6],p:[.8,2.55,-.2],c:0xF2EEE6},
  {g:"sph",s:[.12],p:[-.8,2.8,-.2],c:0xFFB23A,glow:1},{g:"sph",s:[.12],p:[.8,2.8,-.2],c:0xFFB23A,glow:1}
],["ofrenda","altar of the dead","day of the dead altar","remembrance altar"]);
S("zengarden","nature",[16,1,12],[
  {g:"box",s:[15,.3,11],p:[0,.15,0],c:0xE8E2D2},
  {g:"cyl",s:[7,7,.06,32],p:[0,.32,0],c:0xF0EADC},
  {g:"ico",s:[.9],p:[-3,.5,-1.6],c:0x6E6A64},{g:"ico",s:[.6],p:[-1.8,.4,-.4],c:0x7A766E},
  {g:"ico",s:[1.1],p:[3.2,.55,1.4],c:0x6E6A64},{g:"ico",s:[.5],p:[4.4,.35,-.2],c:0x7A766E},
  {g:"box",s:[15.4,.4,.3],p:[0,.3,5.6],c:TEAK},{g:"box",s:[15.4,.4,.3],p:[0,.3,-5.6],c:TEAK}
],["zen garden","raked sand garden","rock garden","dry garden"]);
S("koipond","nature",[12,1,10],[
  {g:"cyl",s:[4.6,4.8,.4,24],p:[0,.1,0],c:"water"},
  {g:"cyl",s:[5.2,5.4,.5,24],p:[0,.05,0],c:0x6E6A64},
  {g:"cyl",s:[.5,.5,.06,10],p:[1.6,.32,.8],c:0x3F7A3A,rep:[4,-1.1,0,-.7]},
  {g:"sph",s:[.22],p:[-1.4,.3,-1],c:0xE8763A},{g:"sph",s:[.2],p:[.6,.3,1.8],c:0xF0F0E8}
],["koi pond","carp pond","ornamental pond","lily pond"]);
S("pergola","structure",[8,4,6],[
  {g:"cyl",s:[.18,.2,3.2,8],p:[-3.4,1.6,-2.4],c:TEAK,rep:[2,6.8,0,0]},
  {g:"cyl",s:[.18,.2,3.2,8],p:[-3.4,1.6,2.4],c:TEAK,rep:[2,6.8,0,0]},
  {g:"box",s:[7.4,.2,.2],p:[0,3.3,-2.4],c:TEAK},{g:"box",s:[7.4,.2,.2],p:[0,3.3,2.4],c:TEAK},
  {g:"box",s:[.16,.16,5.4],p:[-3,3.5,0],c:TEAK,rep:[7,1,0,0]},
  {g:"ico",s:[.55],p:[-2.6,3.7,-1.4],c:0x4A7A3A,rep:[5,1.3,.05,.7]}
],["pergola","vine arbour","arbor","shaded walkway","trellis"]);
S("incenseburner","infra",[2,2.4,2],[
  {g:"cyl",s:[.8,.9,1,12],p:[0,.5,0],c:0x6A5A3A},
  {g:"cyl",s:[.85,.85,.12,12],p:[0,1.06,0],c:0x8A7A4A},
  {g:"cyl",s:[.16,.16,.7,6],p:[-.6,1.4,0],c:0x4A4238},{g:"cyl",s:[.16,.16,.7,6],p:[.6,1.4,0],c:0x4A4238}
],["incense burner","brazier of incense","offering burner"]);
S("windchimes","infra",[2,4,2],[
  {g:"cyl",s:[.06,.06,2.4,6],p:[0,3,0],c:0x3A3C42},
  {g:"cyl",s:[.5,.5,.1,10],p:[0,1.8,0],c:TEAK},
  {g:"cyl",s:[.05,.05,.9,6],p:[-.32,1.3,0],c:0xB8B4AE,rep:[5,.16,-.06,.1]}
],["wind chimes","chimes","hanging chimes","bells on a string"]);
S("maypole","infra",[8,9,8],[
  {g:"cyl",s:[.22,.26,8,10],p:[0,4,0],c:0xE8E4DA},
  {g:"tor",s:[.9,.12],p:[0,7.6,0],c:0x3F7A3A},
  {g:"box",s:[.14,6,.06],p:[-.7,4.6,0],r:[0,0,.22],c:LACQ,rep:[6,.28,0,.2]},
  {g:"box",s:[.14,6,.06],p:[.7,4.6,0],r:[0,0,-.22],c:TILEBLUE,rep:[6,-.28,0,-.2]}
],["maypole","ribbon pole","may pole"]);
S("stringlights","infra",[14,5,1],[
  {g:"cyl",s:[.01,.01,14,3],p:[0,4,0],r:[0,0,.08],c:0x2A2622},
  {g:"sph",s:[.14],p:[-6,3.7,0],c:0xFFE8B0,glow:1,pulse:1,rep:[12,1.1,.02,0]}
],["string lights","fairy lights","festoon lights","lights strung overhead"]);
S("bonsai","nature",[2,1.6,2],[
  {g:"cyl",s:[.55,.6,.35,12],p:[0,.18,0],c:0x6A4A3A},
  {g:"cyl",s:[.09,.12,.6,6],p:[0,.6,0],r:[0,0,.2],c:"bark"},
  {g:"cyl",s:[.06,.08,.5,6],p:[.18,1,.1],r:[0,0,-.7],c:"bark"},
  {g:"ico",s:[.42],p:[.4,1.25,.1],c:0x3F7A3A},{g:"ico",s:[.3],p:[-.2,1.15,-.1],c:0x4A8A42}
],["bonsai","bonsai tree","miniature tree","potted tree"]);
S("tiledfountain","infra",[7,3,7],[
  {g:"cyl",s:[3,3.2,.7,16],p:[0,.35,0],c:TILEBLUE},
  {g:"cyl",s:[2.6,2.6,.5,16],p:[0,.5,0],c:"water"},
  {g:"cyl",s:[.5,.6,1.4,12],p:[0,1.3,0],c:0xE8E0CC},
  {g:"cyl",s:[1.2,1.2,.25,12],p:[0,2.1,0],c:TILEBLUE},
  {g:"sph",s:[.28],p:[0,2.4,0],c:0xE8E0CC}
],["tiled fountain","moorish fountain","courtyard fountain","mosaic fountain"]);
S("marketawning","infra",[8,4,6],[
  {g:"cyl",s:[.1,.12,3,6],p:[-3.4,1.5,-2.2],c:0x4A4238,rep:[2,6.8,0,0]},
  {g:"cyl",s:[.1,.12,3,6],p:[-3.4,1.5,2.2],c:0x4A4238,rep:[2,6.8,0,0]},
  {g:"box",s:[7.6,.14,5],p:[0,3.1,0],r:[.06,0,0],c:0xC0503A},
  {g:"box",s:[7.6,.5,.12],p:[0,2.9,2.5],c:0xE8C27A}
],["market awning","striped awning","canopy over a stall","souk awning"]);

/* the lanterns and lights sway and glow a little */
EFFECTS.redlanterns=function(g){ return function(t){ g.children.forEach(function(m,i){ if(m.geometry&&m.geometry.type==="SphereGeometry") m.rotation.z=Math.sin(t*.8+i)*.08; }); }; };
EFFECTS.prayerflags=function(g){ return function(t){ g.children.forEach(function(m,i){ if(i) m.rotation.y=Math.sin(t*1.6+i*.7)*.28; }); }; };
EFFECTS.papelpicado=EFFECTS.prayerflags;
EFFECTS.windchimes=function(g){ return function(t){ g.children.forEach(function(m,i){ if(i>1) m.rotation.z=Math.sin(t*2+i)*.12; }); }; };

