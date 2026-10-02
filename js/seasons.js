/* SomnuMatrix — seasons.js
   the turning year. the eight sabbats, and the feasts people keep alongside them.
   dream any of it by name, or let the season set it out: the world knows what time
   of year it is, and dresses accordingly when you ask it to.
   loaded as a plain script; shares scope with the other files */
"use strict";

var EVERGREEN=0x2C4F2A, RIBBON=0xA8322B, CANDLEW=0xF2EEE6, PUMPKIN=0xE0761E, WHEATC=0xD8B45A;

/* ---------- the wheel of the year ---------- */
S("yuletree","nature",[5,7,5],[
  {g:"cyl",s:[.3,.4,1,8],p:[0,.5,0],c:"bark"},
  {g:"cone",s:[2.2,2.6,10],p:[0,2,0],c:EVERGREEN},
  {g:"cone",s:[1.7,2.2,10],p:[0,3.6,0],c:EVERGREEN},
  {g:"cone",s:[1.1,1.8,10],p:[0,5.1,0],c:EVERGREEN},
  {g:"sph",s:[.16],p:[1.4,2.4,.6],c:0xC0392B,glow:1,pulse:1,rep:[7,-.36,.42,-.18]},
  {g:"sph",s:[.16],p:[-1.2,2.8,-.5],c:0xD4B83C,glow:1,pulse:1,rep:[6,.34,.36,.2]},
  {g:"cone",s:[.26,.5,5],p:[0,6.3,0],c:GOLD,glow:1,pulse:1}
],["yule tree","christmas tree","decorated tree","tree with lights","tannenbaum","the tree was lit"]);
S("yulelog","infra",[2.6,1,1.2],[
  {g:"cyl",s:[.42,.42,2.2,10],p:[0,.42,0],r:[0,0,1.5708],c:0x5A3A22},
  {g:"cyl",s:[.14,.14,.3,6],p:[.5,.8,.2],c:0x2C4F2A},
  {g:"sph",s:[.09],p:[-.4,.75,.1],c:0xC0392B},
  {g:"cone",s:[.12,.3,6],p:[0,.85,0],c:0xFFB23A,glow:1,pulse:1}
],["yule log","the yule log","great log on the fire","midwinter log"]);
S("wreath","infra",[1.4,1.4,.4],[
  {g:"tor",s:[.55,.16],p:[0,1.7,0],c:EVERGREEN},
  {g:"sph",s:[.08],p:[.5,1.9,.12],c:0xC0392B,rep:[6,-.2,-.26,0]},
  {g:"box",s:[.3,.5,.03],p:[0,1.1,.1],c:RIBBON}
],["wreath","holly wreath","door wreath","advent wreath","garland ring"]);
S("maypoleribbons","infra",[7,9,7],[
  {g:"cyl",s:[.2,.24,8,10],p:[0,4,0],c:0xF2EEE6},
  {g:"sph",s:[.4],p:[0,8.2,0],c:0x3F7A3A},
  {g:"box",s:[.12,7,.05],p:[-.8,4.4,0],r:[0,0,.2],c:0xC0392B,rep:[8,.2,0,.2]},
  {g:"box",s:[.12,7,.05],p:[.8,4.4,0],r:[0,0,-.2],c:0x2F5EE8,rep:[8,-.2,0,-.2]}
],["beltane pole","ribboned maypole","pole with ribbons flying","dancing pole"]);
S("beltanefire","infra",[6,5,6],[
  {g:"cyl",s:[.18,.18,3,7],p:[-.6,1.3,0],r:[0,0,.35],c:0x6B4A32,rep:[6,.24,0,.2]},
  {g:"cone",s:[1.5,3.4,10],p:[0,1.8,0],c:0xFF8A2E,glow:1,pulse:1},
  {g:"cone",s:[.9,2.2,8],p:[0,1.4,0],c:0xFFD08A,glow:1},
  {g:"ico",s:[2.6],p:[0,.2,0],c:0x3A2A22}
],["beltane fire","need-fire","great fire","balefire","midsummer fire","bonfire night"]);
S("samhainlanterns","infra",[8,2,8],[
  {g:"sph",s:[.45],p:[0,.42,0],c:PUMPKIN},
  {g:"cyl",s:[.06,.06,.16,6],p:[0,.86,0],c:0x4A6A2A},
  {g:"box",s:[.1,.1,.1],p:[-.16,.44,.42],c:0xFFB23A,glow:1,pulse:1},
  {g:"box",s:[.1,.1,.1],p:[.16,.44,.42],c:0xFFB23A,glow:1,pulse:1},
  {g:"box",s:[.3,.06,.1],p:[0,.26,.44],c:0xFFB23A,glow:1}
],["jack o lantern","jack-o-lantern","carved pumpkin","pumpkin lantern","samhain lantern","turnip lantern"]);
S("ostaraeggs","infra",[3,1,3],[
  {g:"cyl",s:[.7,.6,.3,12],p:[0,.15,0],c:0x8A6A3A},
  {g:"sph",s:[.16],p:[-.2,.36,0],c:0x6AC8E8,rep:[3,.2,.02,.12]},
  {g:"sph",s:[.16],p:[.1,.36,-.2],c:0xE8A0C8,rep:[3,-.16,.02,.1]}
],["painted eggs","ostara eggs","basket of eggs","easter eggs","coloured eggs"]);
S("imbolccandles","infra",[3,1.6,3],[
  {g:"cyl",s:[.9,.9,.12,16],p:[0,.06,0],c:0xE6DCC2},
  {g:"cyl",s:[.06,.06,.5,6],p:[0,.36,0],c:CANDLEW,rep:[8,.18,0,.1]},
  {g:"cone",s:[.05,.12,5],p:[0,.68,0],c:0xFFD08A,glow:1,pulse:1,rep:[8,.18,0,.1]}
],["candlemas candles","imbolc candles","ring of candles","candles for brigid","candle wheel"]);
S("lithawheel","infra",[3,3.4,1],[
  {g:"tor",s:[1.2,.12],p:[0,1.6,0],c:0x8A5A2A},
  {g:"box",s:[2.4,.1,.1],p:[0,1.6,0],c:0x8A5A2A,rep:[4,0,0,0]},
  {g:"sph",s:[.3],p:[0,1.6,0],c:0xFFB23A,glow:1,pulse:1}
],["sun wheel","litha wheel","wheel of the sun","midsummer wheel","fire wheel"]);
S("lughcorn","infra",[1.4,2,1.4],[
  {g:"cyl",s:[.12,.14,1.4,7],p:[0,.7,0],c:WHEATC},
  {g:"sph",s:[.22],p:[0,1.5,0],c:WHEATC},
  {g:"box",s:[.9,.1,.1],p:[0,1.1,0],c:WHEATC},
  {g:"box",s:[.24,.3,.02],p:[0,1.26,0],c:RIBBON}
],["corn dolly","corn mother","harvest doll","lughnasadh doll","wheat figure"]);
S("mabontable","structure",[5,1.6,3],[
  {g:"box",s:[4.4,.12,2.4],p:[0,1,0],c:0x6B4A32},
  {g:"box",s:[.14,1,.14],p:[-1.9,.5,-.9],c:0x6B4A32,rep:[2,3.8,0,0]},
  {g:"box",s:[.14,1,.14],p:[-1.9,.5,.9],c:0x6B4A32,rep:[2,3.8,0,0]},
  {g:"sph",s:[.3],p:[-1.2,1.2,0],c:PUMPKIN},{g:"sph",s:[.22],p:[-.4,1.16,.3],c:0xC0392B},
  {g:"sph",s:[.2],p:[.3,1.15,-.2],c:0xD4B83C},{g:"cyl",s:[.16,.2,.4,8],p:[1.2,1.2,.2],c:0x8A5A2A},
  {g:"cyl",s:[.06,.06,.5,6],p:[1.8,1.3,-.4],c:WHEATC,rep:[5,-.08,0,.06]}
],["harvest table","mabon table","harvest feast","thanksgiving table","feast of the harvest","groaning board"]);
S("harvestsheaf","nature",[2,2.4,2],[
  {g:"cyl",s:[.06,.05,2,6],p:[0,1,0],r:[0,0,.06],c:WHEATC,rep:[12,.06,0,.05]},
  {g:"box",s:[.9,.12,.9],p:[0,.9,0],c:RIBBON}
],["sheaf of wheat","harvest sheaf","bound sheaf","stook of corn","last sheaf"]);

/* ---------- the feasts people keep ---------- */
S("menorah","infra",[1.6,1.8,.5],[
  {g:"cyl",s:[.1,.14,.14,10],p:[0,.07,0],c:GOLD},
  {g:"cyl",s:[.05,.05,1,8],p:[0,.6,0],c:GOLD},
  {g:"box",s:[1.3,.07,.07],p:[0,1.05,0],c:GOLD},
  {g:"cyl",s:[.035,.035,.3,6],p:[-.6,1.25,0],c:CANDLEW,rep:[9,.15,0,0]},
  {g:"cone",s:[.035,.1,5],p:[-.6,1.45,0],c:0xFFD08A,glow:1,pulse:1,rep:[9,.15,0,0]}
],["menorah","hanukkah lamp","nine-branched lamp","festival of lights lamp"]);
S("diyas","infra",[4,.6,4],[
  {g:"cyl",s:[.14,.1,.09,10],p:[0,.05,0],c:0xC8763A,rep:[5,.7,0,.35]},
  {g:"cone",s:[.05,.12,5],p:[0,.14,0],c:0xFFB23A,glow:1,pulse:1,rep:[5,.7,0,.35]},
  {g:"cyl",s:[.14,.1,.09,10],p:[.35,.05,.7],c:0xC8763A,rep:[4,.7,0,.35]},
  {g:"cone",s:[.05,.12,5],p:[.35,.14,.7],c:0xFFB23A,glow:1,pulse:1,rep:[4,.7,0,.35]}
],["diyas","oil lamps in a row","lamps for diwali","row of little lamps","festival lamps"]);
S("fireworks","infra",[10,26,10],[
  {g:"sph",s:[.22],p:[0,18,0],c:0xFF4A6A,glow:1,pulse:1},
  {g:"sph",s:[.16],p:[2.4,20,1],c:0x4AE8FF,glow:1,pulse:1,rep:[6,-.9,-.6,-.4]},
  {g:"sph",s:[.16],p:[-2,16,-1.4],c:0xFFD08A,glow:1,pulse:1,rep:[6,.7,.7,.5]}
],["fireworks","rockets in the sky","new year fireworks","bursts of light in the sky","firework display"]);
S("hearts","infra",[3,3,1],[
  {g:"box",s:[.34,.34,.06],p:[0,2,0],r:[0,0,.785],c:0xE8455E},
  {g:"cyl",s:[.17,.17,.06,10],p:[-.12,2.12,0],c:0xE8455E},
  {g:"cyl",s:[.17,.17,.06,10],p:[.12,2.12,0],c:0xE8455E},
  {g:"cyl",s:[.01,.01,1.6,4],p:[0,2.8,0],c:0xE6DCC2}
],["paper hearts","hearts hung up","valentine hearts","hearts on strings"]);
S("eidlanterns","infra",[6,5,3],[
  {g:"cyl",s:[.01,.01,6,3],p:[0,4.6,0],r:[0,0,Math.PI/2],c:0x2A2622},
  {g:"box",s:[.32,.44,.32],p:[-2,3.9,0],c:0x2E8A6A,glow:1,pulse:1,rep:[5,1,0,0]},
  {g:"tor",s:[.5,.06,Math.PI],p:[0,4.9,0],r:[0,0,Math.PI],c:GOLD,glow:1}
],["crescent and lanterns","eid lanterns","fanous lanterns","festival crescent"]);
S("lunarlanterns","infra",[8,5,3],[
  {g:"cyl",s:[.01,.01,8,3],p:[0,4.4,0],r:[0,0,Math.PI/2],c:0x2A2622},
  {g:"sph",s:[.4],p:[-3,3.8,0],c:0xC0392B,glow:1,pulse:1,rep:[7,1,0,0]},
  {g:"box",s:[.5,.7,.02],p:[-3,3.1,0],c:0xE8C27A,rep:[7,1,0,0]}
],["new year lanterns","lunar new year lanterns","spring festival lanterns","red lanterns strung up"]);
S("snowman","nature",[1.6,2.4,1.6],[
  {g:"sph",s:[.7],p:[0,.65,0],c:0xF6F8FC},
  {g:"sph",s:[.5],p:[0,1.5,0],c:0xF6F8FC},
  {g:"sph",s:[.34],p:[0,2.1,0],c:0xF6F8FC},
  {g:"cone",s:[.06,.28,5],p:[0,2.12,.34],r:[1.5708,0,0],c:0xE0761E},
  {g:"sph",s:[.05],p:[-.12,2.2,.3],c:0x141414},{g:"sph",s:[.05],p:[.12,2.2,.3],c:0x141414},
  {g:"cyl",s:[.36,.36,.06,12],p:[0,2.4,0],c:0x1A1A1E},{g:"cyl",s:[.22,.22,.3,12],p:[0,2.55,0],c:0x1A1A1E},
  {g:"cyl",s:[.03,.03,.7,5],p:[-.55,1.55,0],r:[0,0,-.7],c:0x6B4A32},
  {g:"cyl",s:[.03,.03,.7,5],p:[.55,1.55,0],r:[0,0,.7],c:0x6B4A32}
],["snowman","a snowman","man of snow","snow figure"]);
S("giftpile","infra",[2.4,1,2.4],[
  {g:"box",s:[.7,.6,.7],p:[0,.3,0],c:0xC0392B},{g:"box",s:[.74,.08,.12],p:[0,.34,0],c:GOLD},
  {g:"box",s:[.5,.45,.5],p:[.7,.22,.3],c:0x2F5E9E},{g:"box",s:[.54,.06,.1],p:[.7,.25,.3],c:0xE8E4DA},
  {g:"box",s:[.6,.4,.6],p:[-.6,.2,-.3],c:0x3F7A3A},{g:"box",s:[.1,.44,.64],p:[-.6,.22,-.3],c:GOLD}
],["presents","wrapped gifts","pile of presents","gifts under the tree"]);
S("altarseasonal","structure",[3,1.6,2],[
  {g:"box",s:[2.4,1,1.4],p:[0,.5,0],c:0x5A4A3A},
  {g:"box",s:[2.5,.06,1.5],p:[0,1.03,0],c:0x3A2E26},
  {g:"cyl",s:[.05,.05,.32,6],p:[-.7,1.22,0],c:CANDLEW},{g:"cone",s:[.05,.1,5],p:[-.7,1.42,0],c:0xFFD08A,glow:1,pulse:1},
  {g:"cyl",s:[.05,.05,.32,6],p:[.7,1.22,0],c:CANDLEW},{g:"cone",s:[.05,.1,5],p:[.7,1.42,0],c:0xFFD08A,glow:1,pulse:1},
  {g:"sph",s:[.16],p:[0,1.2,.2],c:0xC0392B},{g:"cyl",s:[.05,.05,.5,6],p:[.25,1.28,-.2],r:[0,0,.3],c:WHEATC,rep:[4,-.07,0,.05]}
],["seasonal altar","sabbat altar","altar dressed for the season","festival altar"]);

EFFECTS.fireworks=function(g){
  var p=particles(90,[8,10,8],0xFFD08A,1.4,.95); p.position.y=18; g.add(p);
  return function(t,dt){ rise(p,dt,3,.4);
    g.children.forEach(function(m,i){ if(i<3) m.visible=Math.sin(t*1.6+i)>-.2; }); };
};
EFFECTS.beltanefire=function(g){
  var p=particles(70,[2,5,2],0xFFB23A,1.2,.9); p.position.y=2; g.add(p);
  return function(t,dt){ rise(p,dt,3.4,.2);
    g.children.forEach(function(m){ if(m.geometry&&m.geometry.type==="ConeGeometry"){ var s=.85+.3*Math.abs(Math.sin(t*5+m.id)); m.scale.set(1,s,1); } }); };
};
EFFECTS.samhainlanterns=function(g){ return function(t){ g.children.forEach(function(m,i){ if(i>1) m.visible=Math.sin(t*3+i)>-0.7; }); }; };

/* ---------- what the season wants ---------- */
var SEASON_SETS={
  winter:["yuletree","wreath","yulelog","snowman","giftpile","imbolccandles","fireworks","lunarlanterns","menorah"],
  spring:["ostaraeggs","maypoleribbons","beltanefire","hearts","altarseasonal","flowers"],
  summer:["lithawheel","beltanefire","harvestsheaf","stringlights","altarseasonal"],
  autumn:["samhainlanterns","mabontable","lughcorn","harvestsheaf","diyas","altarseasonal","ofrenda"]
};
/* set the season's things about the place, near where the dreamer is */
function dressSeason(which){
  var s=which||landOpt("season")||"summer";
  var list=SEASON_SETS[s]||SEASON_SETS.summer, made=0;
  var h=(typeof heartOf==="function")?heartOf(store.here||0):{x:0,z:0};
  list.forEach(function(arch,i){
    if(!KIT[arch]) return;
    var a=i*2.39996+1.2, r=14+(i%5)*9;
    var spec={id:uid(),archetype:arch,label:null,attrs:{},x:h.x+Math.cos(a)*r,z:h.z+Math.sin(a)*r,
      rot:(i*1.7)%6.283,solid:false,detail:2,nights:[store.session],seasonal:s,addr:null,name:null};
    if(store.here) spec.realm=store.here;
    store.objects.push(spec); if(typeof addMesh==="function") addMesh(spec);
    made++;
  });
  if(typeof save==="function") save();
  return made;
}
/* clear away last season's things */
function undressSeason(){
  var gone=0;
  for(var i=store.objects.length-1;i>=0;i--){
    var o=store.objects[i];
    if(!o.seasonal) continue;
    if(meshes[o.id]){ scene.remove(meshes[o.id]); delete meshes[o.id]; }
    store.objects.splice(i,1); gone++;
  }
  if(typeof save==="function") save();
  return gone;
}

