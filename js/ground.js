/* SomnuMatrix — ground.js
   something to stand on. a ship's deck holds you, a stair carries you up a step at
   a time, a bridge and a roof and a cloud bank hold you, and when you walk off the
   edge you fall rather than drift. you can step up about knee height; anything
   taller you have to climb, or fly.
   loaded as a plain script; shares scope with the other files */
"use strict";

var standFall=0, SURF=[], surfAt=-1, STEP_UP=0.62;
/* the level a flying player is currently being held against by a solid
   floor/ceiling — see groundTick and insideSupport. Distinct from levelFor:
   levelFor guesses a level from height alone, which is fine for walking (it
   should round generously — a foot that's 97% of the way up a ramp is close
   enough to say you've arrived) but wrong for a player pinned 8cm under a
   ceiling, who is by that same generous rounding almost indistinguishable
   from having arrived. Only an explicit block, remembered across frames
   while you hold still against it, can tell those two apart. */
var pinnedLevel=null;

/* what you can stand on, and how high its walking surface is.
   top: flat, over the whole footprint. ramp: rises along the thing's own length. */
var SURFACE={
  stairs:{ramp:[0,2.6]}, celestialstair:{ramp:[0,22]}, impossiblestair:{ramp:[0,6]},
  bridge:{top:1.1}, brokenhighway:{top:8.5}, rainbowbridge:{top:9.4}, pier:{top:1.2},
  ship:{top:3.4,board:true}, boat:{top:0.55}, soulferry:{top:1.3}, shipwreck:{top:2.6},
  sleigh:{top:1.25}, firechariot:{top:1.6}, flyingcarpet:{top:0.62}, cloudbank:{top:2.6},
  floatingisland:{top:0}, moonrock:{top:2.2}, dune:{mound:[26,5.6]}, hill:{mound:[16,6]},
  barrow:{mound:[9,3.4]}, rock:{mound:[3,2.2]}, stage:{top:1.2}, platform:{top:1.2},
  watertower:{top:15.2}, skyscraper:{roof:true}, warehouse:{roof:true}, factory:{roof:true},
  hangar:{roof:true}, bunker:{roof:true}, habitat:{roof:true}, reactor:{roof:true},
  falloutshelter:{roof:true}, ziggurat:{top:17}, pueblo:{roof:true}, marketawning:{top:3.2},
  wall:{top:2.4}, stonewall:{top:2}, barricade:{top:1.4}, crates:{top:2}, scrapheap:{top:2.6},
  monolith:{roof:true}, sunkenruins:{top:0.6}, treasurechest:{top:1.1}
};

function surfaceList(){
  if(surfAt>0&&performance.now()-surfAt<500) return SURF;
  surfAt=performance.now(); SURF=[];
  var here=store.here||0;
  store.objects.forEach(function(o){
    var S=SURFACE[o.archetype]; if(!S) return;
    if((o.realm||0)!==here) return;
    if(typeof isHidden==="function"&&isHidden(o)) return;
    var d=KIT[o.archetype]; if(!d) return;
    var a=o.attrs||{}, s=a.s||1, g=meshes[o.id];
    var live=g&&typeof g.position.x==="number";
    var top=S.top;
    if(S.roof) top=d.size[1]*s*(a.h||1)*(a.lv?Math.max(1,a.lv*3.2/d.size[1]):1);
    SURF.push({x:live?g.position.x:o.x, z:live?g.position.z:o.z,
      rot:(live&&typeof g.rotation.y==="number")?g.rotation.y:(o.rot||0),
      hw:d.size[0]*s*(a.w||1)/2, hd:d.size[2]*s*(a.d||1)/2,
      top:(top||0)*(S.roof?1:s), ramp:S.ramp, mound:S.mound, board:S.board, s:s, kind:o.archetype,
      b:(typeof terrainY==="function")?terrainY(o.x,o.z):0});
  });
  return SURF;
}

/* the height of whatever you are standing on at this spot */
function supportAt(x,z,feet){
  var best=(typeof terrainY==="function")?terrainY(x,z):0, list=surfaceList(), reach=feet+STEP_UP+0.02;
  for(var i=0;i<list.length;i++){
    var w=list[i], dx=x-w.x, dz=z-w.z;
    if(Math.abs(dx)>w.hw+w.hd+2||Math.abs(dz)>w.hw+w.hd+2) continue;
    var c=Math.cos(-w.rot), sn=Math.sin(-w.rot), lx=dx*c+dz*sn, lz=-dx*sn+dz*c;
    var h=null;
    if(w.mound){
      /* a mound: highest in the middle, falling away to nothing at the rim */
      var r=Math.hypot(lx,lz)/(w.mound[0]/2*w.s);
      if(r<1) h=w.mound[1]*w.s*(1-r*r);
    } else if(Math.abs(lx)<w.hw-0.1&&Math.abs(lz)<w.hd-0.1){
      if(w.ramp){
        var t=(lz+w.hd)/(2*w.hd);              // along its length: the bottom step to the top
        h=w.ramp[0]+(w.ramp[1]-w.ramp[0])*Math.max(0,Math.min(1,t))*w.s;
      } else {
        h=w.top;
        /* a ship is boarded at the stern, up a plank */
        if(w.board&&lz<-w.hd+3.5) h=Math.max(0,w.top*(lz+w.hd)/3.5);
      }
    }
    if(h===null) continue;
    h+=(w.b||0);
    if(h>best&&h<=reach) best=h;
  }
  return best;
}

/* Inside a building the floor holds you — unless you have stepped onto a flight
   of stairs, and then the flight holds you, and carries you up or down according
   to which way you walk along it.
   A flight has a footprint. Stand beside it and you are on the floor, not
   halfway up in the air: that is the difference between a staircase and a hill. */
/* If you are standing on a flight, the height of the step under you.
   Deliberately asks nothing about which floor you are "on": the floor you are on
   is worked out from where you are, not the other way round. Letting the two
   decide each other is what made the stairs throw you back upstairs at the bottom. */
function flightAt(P,feet){
  if(!INT) return null;
  var best=null;
  for(var i=0;i<(INT.stairs||[]).length;i++){
    var st=INT.stairs[i];
    var dx=P.x-st.x, dz=P.z-st.z;
    var c=Math.cos(-(st.rot||0)), sn=Math.sin(-(st.rot||0));
    var lx=dx*c+dz*sn, lz=-dx*sn+dz*c;
    if(Math.abs(lx)>st.hw||Math.abs(lz)>st.hd) continue;   /* not on the steps at all */
    var t=Math.max(0,Math.min(1,(lz+st.hd)/(2*st.hd)));    /* 0 at the foot, 1 at the head */
    var h=st.from*INT.floor+t*INT.floor;
    if(h>feet+STEP_UP+0.3) continue;                       /* too tall a step from where you stand */
    if(best===null||Math.abs(h-feet)<Math.abs(best-feet)) best=h;
  }
  return best;
}

/* which floor you are on, judged by how high you are standing. Rounds to
   the nearest floor on purpose — stepping off a ramp a few centimetres shy
   of the top should still read as having arrived. (A flying player pinned
   under a ceiling is a different situation, handled by pinnedLevel instead
   of by tightening this.) */
function levelFor(feet){
  if(!INT) return 0;
  return Math.max(0,Math.min(INT.levels-1,Math.round(feet/INT.floor)));
}

function insideSupport(P,feet){
  if(!INT) return 0;
  var f=flightAt(P,feet);
  if(f!==null) return f;
  if(pinnedLevel!==null) return pinnedLevel*INT.floor;
  return levelFor(feet)*INT.floor;
}

/* Whether a floor/ceiling boundary at height Hb (in the same "feet" units as
   everything else here) is open at this spot — true only at an actual
   stairwell or lift shaft cut into it. The roof, above the top floor, and the
   ground slab, below the bottom one, are never open: there is no legitimate
   way through either, on foot or flying. */
function floorOpenAt(x,z,Hb){
  if(!INT) return true;
  var L=Math.round(Hb/INT.floor);
  if(L<=0||L>=INT.levels) return false;
  var open=false;
  (INT.holes||[]).forEach(function(h){
    if(h.level!==L) return;
    if(Math.abs(x-h.x)<=h.hw&&Math.abs(z-h.z)<=h.hd) open=true;
  });
  (INT.lifts||[]).forEach(function(l){ if(Math.hypot(x-l.x,z-l.z)<1.8) open=true; });
  return open;
}

/* The nearest solid floor or ceiling between two heights, if the way is
   blocked at all — the height you'd have to stop at, from whichever side
   you're approaching. Walking never calls this (a step at a time, it always
   lands exactly on a support); it exists for flying, which can otherwise
   cross any height in a single frame and would sail straight through a solid
   pad with nothing to stop it. */
function verticalStop(x,z,fromFeet,toFeet){
  if(!INT||fromFeet===toFeet) return null;
  var up=toFeet>fromFeet, lo=Math.min(fromFeet,toFeet), hi=Math.max(fromFeet,toFeet), first=null;
  for(var L=0;L<=INT.levels;L++){
    var Hb=L*INT.floor;
    if(Hb<=lo+1e-6||Hb>=hi-1e-6) continue;             /* this boundary isn't actually crossed */
    if(floorOpenAt(x,z,Hb)) continue;                  /* a real opening: nothing to stop you */
    if(first===null||(up?Hb<first:Hb>first)) first=Hb;
  }
  return first;
}

/* each frame: stand, step up, fly, or fall — but a solid floor is a solid
   floor whichever way you're moving through it, and a locked floor stays
   locked whichever way you try to reach it */
function groundTick(dt){
  if(!walkMode) return;
  var P=camera.position, feet=P.y-1.72;
  var sup=store.inside?insideSupport(P,feet):supportAt(P.x,P.z,feet);
  /* sitting on what you ride: a saddle, a bicycle seat, a car's seat */
  if(!store.inside&&typeof rideSeatNow==="function") sup+=rideSeatNow();
  var flying=canFly&&flyY>sup+0.05, flyLevel=null;
  if(flying){
    /* flying can cross any height in one frame; a solid pad in between has to
       actually stop you, not just get skipped over */
    var stop=store.inside?verticalStop(P.x,P.z,feet,flyY):null;
    if(stop===null){
      /* genuinely open space this frame, not just holding still against a
         block (fromFeet===toFeet also lands here) — only real movement
         through clear air un-pins you. feet is P.y round-tripped through a
         +1.72/-1.72, which can drift from flyY by a float sliver even when
         nothing moved, so this is a tolerance, not an exact match. */
      if(Math.abs(feet-flyY)>1e-6) pinnedLevel=null;
      feet=flyY;
    } else {
      var goingUp=flyY>feet;
      feet=goingUp?stop-0.15:stop+0.15;
      /* held short of a boundary at L*floor: which floor you were reaching
         for is exact, not a question of which way the clamp margin happens
         to round — and it has to stay exact every following frame you hold
         still against it, not just the one frame the block was found, or
         the held height quietly gets counted as the floor beyond the
         ceiling that is stopping it */
      flyLevel=Math.round(stop/INT.floor)+(goingUp?-1:0);
      pinnedLevel=flyLevel;
    }
    standFall=0;
  } else {
    pinnedLevel=null;
    if(feet>sup+0.02){
      standFall=Math.min(26,standFall+24*dt);
      feet=Math.max(sup,feet-standFall*dt);
    } else { standFall=0; feet=sup; }
  }

  /* going up or down a floor inside: the walls change with you, and a locked
     floor holds you back — flying included, even straight up an open
     stairwell, because a hole you can walk through is not the same as
     permission to be on the floor at the top of it */
  if(store.inside&&INT){
    var lvl=flyLevel!==null?flyLevel:(pinnedLevel!==null?pinnedLevel:levelFor(feet));
    if(!flying&&flightAt(P,feet)!==null&&Math.abs(feet-lvl*INT.floor)>INT.floor*0.12) lvl=INT.level;
    if(lvl!==INT.level&&typeof levelAllowed==="function"&&!levelAllowed(lvl)){
      /* held at the edge of the floor you're allowed on, from whichever side
         you were trying to cross it */
      feet=lvl>INT.level?Math.min(feet,(INT.level+1)*INT.floor-0.1):Math.max(feet,INT.level*INT.floor+0.1);
      lvl=INT.level;
    } else if(lvl!==INT.level){ INT.level=lvl; wallsAt=-1;
      setStatus(lvl?"Floor "+(lvl+1)+" of "+INT.levels+".":"The ground floor."); }
  }

  /* keep flyY tracking your actual (possibly clamped) height, so a held key
     against a locked floor or a solid ceiling doesn't quietly rack up a
     backlog that only unwinds after you let go and press the opposite key
     for a while */
  flyY=feet>0.04?feet:0;
  P.y=1.72+feet;
}

