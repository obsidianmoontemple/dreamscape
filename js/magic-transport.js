/* SomnuMatrix — magic-transport.js
   ways of travelling that aren't roads. stand on a carpet, a broom, a sleigh or a
   chariot and you can rise and fly while you are on it. step into a teleport ring,
   a wardrobe, a whirlpool or onto the rainbow bridge and, if there is another of
   its kind, it carries you there.
   loaded as a plain script; shares scope with the other files */
"use strict";

var RIDDEN={broomstick:1,flyingcarpet:1,sleigh:1,firechariot:1},
    GATEWAY={teleportpad:1,wardrobedoor:1,whirlpool:1,rainbowbridge:1,soulferry:1},
    magicCool=0, magicRiding=null, magicGranted=false;

S("broomstick","infra",[2.4,1.2,.6],[
  {g:"cyl",s:[.05,.06,2.2,8],p:[0,.95,0],r:[0,0,Math.PI/2],c:0x6B4A32},
  {g:"cone",s:[.16,.5,8],p:[-1.1,.95,0],r:[0,0,-Math.PI/2],c:0xB8945A},
  {g:"cyl",s:[.09,.09,.16,8],p:[-.82,.95,0],r:[0,0,Math.PI/2],c:0x4A3A2A},
  {g:"sph",s:[.09],p:[.9,.95,0],c:0xE8C27A,glow:1,pulse:1}
],["broomstick","witch's broom","flying broom","a broom","besom"]);
S("flyingcarpet","infra",[3.4,.6,2.4],[
  {g:"box",s:[3.2,.08,2.2],p:[0,.55,0],r:[.04,0,.02],c:0x8A2A3A},
  {g:"box",s:[2.9,.05,1.9],p:[0,.6,0],r:[.04,0,.02],c:0xC7A043},
  {g:"box",s:[2.5,.04,1.5],p:[0,.63,0],r:[.04,0,.02],c:0x2E5EA8},
  {g:"sph",s:[.07],p:[1.5,.5,1],c:0xE8C27A,glow:1,rep:[2,-3,0,-2]}
],["flying carpet","magic carpet","carpet that flew","persian carpet in the air"]);
S("sleigh","vehicle",[2.6,1.8,4.4],[
  {g:"box",s:[2,1,3.4],p:[0,.9,0],c:0x7A1E22},
  {g:"box",s:[2.1,.3,3.5],p:[0,1.45,0],c:0xC7A043},
  {g:"cyl",s:[.07,.07,4.2,8],p:[-.9,.3,0],r:[Math.PI/2,0,0],c:0x8A8C92},
  {g:"cyl",s:[.07,.07,4.2,8],p:[.9,.3,0],r:[Math.PI/2,0,0],c:0x8A8C92},
  {g:"tor",s:[.5,.07,Math.PI],p:[-.9,.45,2.1],r:[0,Math.PI/2,0],c:0x8A8C92},
  {g:"tor",s:[.5,.07,Math.PI],p:[.9,.45,2.1],r:[0,Math.PI/2,0],c:0x8A8C92}
],["sleigh","flying sleigh","sledge","sled pulled through the air"]);
S("firechariot","vehicle",[2.6,2.4,3.4],[
  {g:"box",s:[1.8,1.1,2],p:[0,1,0],c:0x6A1A14},
  {g:"box",s:[1.9,.2,2.1],p:[0,1.6,0],c:GOLD},
  {g:"tor",s:[.8,.12],p:[-1,.8,-.3],r:[0,Math.PI/2,0],c:GOLD},
  {g:"tor",s:[.8,.12],p:[1,.8,-.3],r:[0,Math.PI/2,0],c:GOLD},
  {g:"cyl",s:[.06,.06,2.4,6],p:[0,1.1,1.8],r:[Math.PI/2,0,0],c:GOLD},
  {g:"cone",s:[.3,.9,6],p:[-1,.8,-.3],c:0xFF7A1E,glow:1,pulse:1},
  {g:"cone",s:[.3,.9,6],p:[1,.8,-.3],c:0xFF7A1E,glow:1,pulse:1}
],["chariot of fire","fiery chariot","burning chariot","chariot that flew"]);
S("teleportpad","infra",[6,1,6],[
  {g:"cyl",s:[2.6,2.6,.12,28],p:[0,.07,0],c:0x2A2C38},
  {g:"tor",s:[2.2,.1],p:[0,.18,0],r:[Math.PI/2,0,0],c:0x6AE8FF,glow:1,pulse:1},
  {g:"tor",s:[1.4,.07],p:[0,.18,0],r:[Math.PI/2,0,0],c:0xC050FF,glow:1,pulse:1},
  {g:"cyl",s:[.1,.1,2.4,6],p:[2.2,1.2,0],c:0x3A3C48,rep:[4,-1.47,0,1.47]}
],["teleport ring","teleport pad","ring of light on the ground","circle that moved me","transporter ring"]);
S("wardrobedoor","structure",[2.4,3.2,1.2],[
  {g:"box",s:[2.2,3,1],p:[0,1.5,0],c:0x4A3222},
  {g:"box",s:[.95,2.6,.08],p:[-.52,1.5,.52],c:0x5E4230},
  {g:"box",s:[.95,2.6,.08],p:[.52,1.5,.52],c:0x5E4230},
  {g:"sph",s:[.06],p:[-.06,1.4,.6],c:GOLD},{g:"sph",s:[.06],p:[.06,1.4,.6],c:GOLD},
  {g:"box",s:[2.4,.18,1.2],p:[0,3.05,0],c:0x3A2A1E},
  {g:"pln",s:[.9,2.4],p:[0,1.5,.58],c:0x9FD8FF,glow:1,opa:.35}
],["wardrobe that led somewhere","magic wardrobe","door in a wardrobe","cupboard that went through"]);
S("whirlpool","nature",[10,1,10],[
  {g:"cyl",s:[4.4,3.6,.4,28],p:[0,.1,0],c:"water"},
  {g:"cyl",s:[3,2,.8,24],p:[0,-.1,0],c:0x1A3A4A},
  {g:"cyl",s:[1.4,.3,1.4,18],p:[0,-.5,0],c:0x0E2430},
  {g:"tor",s:[3.8,.16],p:[0,.24,0],r:[Math.PI/2,0,0],c:0xBFE8FF,glow:1,opa:.7}
],["whirlpool","maelstrom","spinning water","vortex in the water"]);
S("rainbowbridge","structure",[10,14,46],[
  {g:"box",s:[7,.4,44],p:[0,7,0],r:[0,0,0],c:0xC0392B,glow:1,opa:.55},
  {g:"box",s:[7,.4,44],p:[0,7.45,0],c:0xE8A04A,glow:1,opa:.55},
  {g:"box",s:[7,.4,44],p:[0,7.9,0],c:0xD4D43C,glow:1,opa:.55},
  {g:"box",s:[7,.4,44],p:[0,8.35,0],c:0x3FA03A,glow:1,opa:.55},
  {g:"box",s:[7,.4,44],p:[0,8.8,0],c:0x2F5EE8,glow:1,opa:.55},
  {g:"box",s:[7,.4,44],p:[0,9.25,0],c:0x8A3AE8,glow:1,opa:.55}
],["rainbow bridge","bifrost","bridge of light","bridge of colours"]);
S("soulferry","vehicle",[3.4,3.4,11],[
  {g:"box",s:[2.6,1,9.4],p:[0,.7,0],c:0x2A2622},
  {g:"box",s:[2.8,.2,9.6],p:[0,1.25,0],c:0x3A342E},
  {g:"cone",s:[1.3,2,4],p:[0,.9,4.9],r:[Math.PI/2,0,0],c:0x2A2622},
  {g:"cyl",s:[.07,.07,4,6],p:[.9,2.6,-2],r:[0,0,.2],c:0x4A4238},
  {g:"box",s:[.4,.5,.4],p:[0,2.9,3.4],c:0xFFB23A,glow:1,pulse:1}
],["ferry of the dead","black boat","ferryman's boat","boat that crossed the dark water"]);

EFFECTS.whirlpool=function(g){ return function(t){ g.children.forEach(function(m,i){ m.rotation.y=t*(0.6+i*0.4)*(i%2?-1:1); }); }; };
EFFECTS.teleportpad=function(g){ return function(t){ g.children.forEach(function(m,i){ if(m.geometry&&m.geometry.type==="TorusGeometry") m.rotation.z=t*(i%2?0.8:-0.5); }); }; };
EFFECTS.flyingcarpet=function(g){ var y=g.position.y; return function(t){ g.position.y=y+0.25+Math.sin(t*1.1)*0.12; g.rotation.z=Math.sin(t*0.9)*0.05; }; };
EFFECTS.broomstick=EFFECTS.flyingcarpet;

/* ---- riding, and being carried ---- */
function magicTick(dt){
  if(magicCool>0) magicCool-=dt;
  if(!walkMode||store.inside){ endRide(); return; }
  var P=camera.position, feet=P.y-1.72, here=store.here||0, on=null, gate=null;
  for(var i=0;i<store.objects.length;i++){
    var o=store.objects[i];
    if((o.realm||0)!==here||o.filler) continue;
    if(Math.abs(o.x-P.x)>6||Math.abs(o.z-P.z)>6) continue;
    var d=Math.hypot(o.x-P.x,o.z-P.z);
    if(RIDDEN[o.archetype]&&d<2.2&&feet<3) on=o;
    if(GATEWAY[o.archetype]&&d<2.2&&magicCool<=0) gate=o;
  }
  if(on&&magicRiding!==on.id) startRide(on);
  else if(!on&&magicRiding) endRide();
  if(gate) goThrough(gate);
}
function startRide(o){
  magicRiding=o.id;
  if(typeof canFly!=="undefined"&&!canFly){ canFly=true; magicGranted=true; }
  setStatus("<b>You are on "+esc(placeName(o))+".</b> Rise and fall while you ride it.");
}
function endRide(){
  if(!magicRiding) return;
  magicRiding=null;
  if(magicGranted&&typeof canFly!=="undefined"){
    canFly=hasAbility("flying")||hasAbility("floating");
    magicGranted=false;
    if(!canFly&&typeof flyY!=="undefined"&&flyY>0) setStatus("You step off, and come back down.");
  }
}
/* a gateway takes you to the next one of its kind */
function goThrough(o){
  var same=store.objects.filter(function(x){ return x.archetype===o.archetype&&x.id!==o.id&&!x.filler; });
  if(!same.length){ if(magicCool<=0){ magicCool=3; setStatus("<b>"+esc(placeName(o))+"</b> — and nowhere yet on the other side. Dream another one."); } return; }
  var far=same[0], best=1e9;
  same.forEach(function(x){ var d=Math.hypot(x.x-o.x,x.z-o.z); if(d<best&&d>8){ best=d; far=x; } });
  magicCool=3;
  var ang=Math.random()*6.283;
  camera.position.set(far.x+Math.cos(ang)*3,camera.position.y,far.z+Math.sin(ang)*3);
  if((far.realm||0)!==(store.here||0)&&typeof beHere==="function") beHere(far.realm||0);
  setStatus("<b>Carried through "+esc(placeName(o))+".</b> You are somewhere else now.");
}

