/* SomnuMatrix — atlantis-life.js
   living in the risen city:
     - every workplace furnished for its trade before anybody moves a chair,
       and rearranged by the people who work there, for everyone
     - the way to your own work, pointed out as you walk
     - the Gaol, which holds whoever Somnucor holds, and counts their hours
       only at the benches in its yard
     - the Nightmare Wilds, where the dark things of every dreamer's dreams
       roam; after dark, the kinds you have dreamt come for you
   loaded as a plain script; shares scope with the other files */
"use strict";

/* ================================================================ workplaces */
var WP_DECOR={}, WP_MINE={}, wpBoardAt=0, wpDraft=null, wpEditing=null;

function workplaceKeyOf(spec){ return (spec&&spec.workplace&&WP_BY_KEY[spec.workplace])?spec.workplace:null; }
function workplaceDecor(key){
  if(wpEditing===key&&wpDraft) return wpDraft;
  var d=WP_DECOR[key];
  return (d&&d.length)?d:null;
}
function loadWorkplaces(force){
  if(!(typeof signedIn==="function"&&signedIn())) return Promise.resolve(null);
  if(!force&&Date.now()-wpBoardAt<120000) return Promise.resolve(WP_DECOR);
  wpBoardAt=Date.now();
  return cityRpc("workplace_board").then(function(rows){
    var changed=false;
    (rows||[]).forEach(function(r){
      var before=JSON.stringify(WP_DECOR[r.key]||null);
      WP_DECOR[r.key]=Array.isArray(r.decor)?r.decor:null;
      WP_MINE[r.key]=!!r.mine;
      if(before!==JSON.stringify(WP_DECOR[r.key]||null)) changed=true;
    });
    /* standing in a workplace whose furnishing just changed: redraw it */
    if(changed&&INT&&INT.wpKey&&!wpEditing) rebuildHere();
    paintWorkButton();
    return WP_DECOR;
  }).catch(function(){ return null; });
}
/* furnishing the trade: the plan's own furniture, then the trade's own pieces set along the walls */
function workplaceFit(key,W,D,asBuilt){
  var wp=WP_BY_KEY[key]; if(!wp||!wp.fit||!wp.fit.length) return [];
  var ground=asBuilt.filter(function(p){ return (p.l||0)===0; }), out=[];
  function free(x,z){
    if(Math.abs(x)<2.4&&z>D/2-4.5) return false;                 /* keep the way in clear */
    for(var i=0;i<ground.length;i++){ var g=ground[i]; if(Math.hypot(g.x-x,g.z-z)<1.7) return false; }
    for(var j=0;j<out.length;j++){ var o=out[j]; if(Math.hypot(o.x-x,o.z-z)<1.9) return false; }
    return true;
  }
  var spots=[];
  for(var x=-W/2+1.6;x<=W/2-1.6;x+=2.3) spots.push([x,-D/2+1.1,0]);
  for(var z=-D/2+2.6;z<=D/2-4;z+=2.4){ spots.push([-W/2+1.1,z,Math.PI/2]); spots.push([W/2-1.1,z,-Math.PI/2]); }
  for(var x2=-W/4;x2<=W/4;x2+=3.2) spots.push([x2,0,0]);
  var si=0;
  wp.fit.forEach(function(k){
    if(!FURN[k]) return;
    while(si<spots.length&&!free(spots[si][0],spots[si][1])) si++;
    if(si>=spots.length) return;
    var s=spots[si++]; out.push({k:k,x:+s[0].toFixed(2),z:+s[1].toFixed(2),r:s[2],l:0});
  });
  return out;
}
function rebuildHere(){
  if(!INT) return;
  var spec=INT.spec, P={x:camera.position.x,y:camera.position.y,z:camera.position.z}, lv=INT.level||0, un=INT.unlocked;
  scene.remove(INT.root); INT=makeInterior(spec); scene.add(INT.root);
  INT.level=lv; INT.unlocked=un; wallsAt=-1;
  camera.position.set(P.x,P.y,P.z);
  if(typeof bringOccupants==="function") bringOccupants();
}
function canArrange(key){
  if(!key) return false;
  if(typeof heldNow==="function"&&heldNow()) return false;      /* nobody rearranges anything while held */
  if(WP_MINE[key]) return true;                                    /* the server's own say */
  return typeof mayArrangeAny==="function"&&mayArrangeAny();
}

/* ---- the arranging itself ---- */
function wpEl(){
  var el=document.getElementById("wp-edit"); if(el||!document.body) return el;
  el=document.createElement("div"); el.id="wp-edit";
  el.style.cssText="position:fixed;left:12px;top:calc(96px + env(safe-area-inset-top,0px));z-index:47;display:none;width:min(320px,calc(100vw - 24px));"+
    "background:rgba(8,10,16,.96);border:1px solid var(--gold,#C9A868);border-radius:4px;padding:12px;font:13px var(--sans);color:var(--bone)";
  document.body.appendChild(el);
  var b=document.createElement("button"); b.id="wp-btn"; b.type="button";
  b.style.cssText="position:fixed;left:12px;top:calc(96px + env(safe-area-inset-top,0px));z-index:46;display:none;"+
    "background:rgba(10,12,18,.92);color:var(--bone);border:1px solid var(--gold,#C9A868);border-radius:3px;padding:8px 12px;font:13px var(--sans);cursor:pointer";
  b.onclick=function(){ startArranging(); };
  document.body.appendChild(b);
  ["keydown","keyup","keypress"].forEach(function(k){ el.addEventListener(k,function(e){ if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) e.stopPropagation(); }); });
  return el;
}
function paintWorkButton(){
  wpEl();
  var b=document.getElementById("wp-btn"); if(!b) return;
  var key=INT&&INT.wpKey;
  var show=walkMode&&key&&!wpEditing&&canArrange(key);
  b.style.display=show?"block":"none";
  if(show) b.textContent=/^lot:/.test(key)?"Rearrange your house":("Rearrange "+key);
}
var FURN_NAMES=null;
function furnList(){
  if(FURN_NAMES) return FURN_NAMES;
  FURN_NAMES=Object.keys(FURN).filter(function(k){ return k!=="stairs"&&k!=="spiralstair"; }).sort();
  return FURN_NAMES;
}
function startArranging(){
  var key=INT&&INT.wpKey; if(!key) return;
  if(!canArrange(key)) return setStatus("Only the keeper, the City planner and the Carpenter rearrange Somnucor's buildings.");
  wpEditing=key;
  wpDraft=JSON.parse(JSON.stringify(workplaceDecor(key)||INT.asBuilt||[]));
  if(!WP_DECOR[key]) wpDraft=JSON.parse(JSON.stringify(INT.asBuilt||[]));
  paintArranger(); paintWorkButton();
}
function paintArranger(msg){
  var el=wpEl(); if(!el) return;
  if(!wpEditing){ el.style.display="none"; return; }
  el.style.display="block";
  el.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'+
      '<b style="color:var(--gold,#C9A868)">Arranging '+esc(wpEditing)+'</b></div>'+
    '<div style="color:var(--dim);font-size:12px;line-height:1.5;margin-bottom:8px">Walk to where you want something and place it; stand by a piece to pick it up, turn it or move it. Nobody else sees a change until you save it — then everybody does.</div>'+
    '<div style="display:flex;gap:6px;margin-bottom:6px"><select id="wp-kind" style="flex:1;background:var(--void);border:1px solid var(--line);color:var(--bone);padding:5px">'+
      furnList().map(function(k){ return '<option>'+k+'</option>'; }).join("")+'</select>'+
      '<button class="btn" id="wp-place">Place here</button></div>'+
    '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">'+
      '<button class="btn" id="wp-pick">Pick up nearest</button><button class="btn" id="wp-turn">Turn nearest</button>'+
      '<button class="btn" id="wp-move">Move nearest here</button></div>'+
    '<div style="display:flex;gap:6px;flex-wrap:wrap">'+
      '<button class="btn" id="wp-save">Save for everyone</button><button class="btn" id="wp-built">Back to as built</button>'+
      '<button class="btn" id="wp-cancel">Leave it as it was</button></div>'+
    '<div id="wp-msg" style="color:var(--dim);font-size:12px;margin-top:8px;min-height:16px">'+(msg?esc(msg):(wpDraft.length+" pieces"))+'</div>';
  var $=function(i){ return document.getElementById(i); };
  $("wp-place").onclick=function(){ wpPlace($("wp-kind").value); };
  $("wp-pick").onclick=function(){ wpNearest(function(i){ wpDraft.splice(i,1); return "Picked up."; }); };
  $("wp-turn").onclick=function(){ wpNearest(function(i){ wpDraft[i].r=+(((wpDraft[i].r||0)+Math.PI/4)%(Math.PI*2)).toFixed(3); return "Turned."; }); };
  $("wp-move").onclick=function(){ wpNearest(function(i){ var h=wpHere(); wpDraft[i].x=h.x; wpDraft[i].z=h.z; wpDraft[i].l=h.l; return "Moved."; }); };
  $("wp-save").onclick=wpSave;
  $("wp-built").onclick=function(){
    if(!confirm("Put everything back the way the building was first furnished? Saved for everyone at once.")) return;
    cityRpc("reset_workplace_decor",{p_key:wpEditing}).then(function(o){
      if(o!=="ok") return paintArranger(String(o));
      WP_DECOR[wpEditing]=null; wpEditing=null; wpDraft=null; rebuildHere(); paintArranger(); paintWorkButton();
      setStatus("<b>Back as it was built.</b>");
    }).catch(function(e){ paintArranger(e.message); });
  };
  $("wp-cancel").onclick=function(){ wpEditing=null; wpDraft=null; rebuildHere(); paintArranger(); paintWorkButton(); };
}
/* where you are standing, in the building's own terms: a little in front of you */
function wpHere(){
  var fx=-Math.sin(yaw), fz=-Math.cos(yaw);
  return {x:+(camera.position.x-INT.ox+fx*1.6).toFixed(2),z:+(camera.position.z-INT.oz+fz*1.6).toFixed(2),l:INT.level||0,
          r:+(Math.atan2(-fx,-fz)).toFixed(3)};
}
function wpPlace(k){
  if(!FURN[k]) return;
  if(wpDraft.length>=300) return paintArranger("That is as much as one building can hold.");
  var h=wpHere(); wpDraft.push({k:k,x:h.x,z:h.z,r:h.r,l:h.l});
  rebuildHere(); paintArranger(k+" placed.");
}
function wpNearest(fn){
  var h=wpHere(), best=-1, bd=3.2;
  wpDraft.forEach(function(p,i){ if((p.l||0)!==h.l) return; var d=Math.hypot(p.x-h.x,p.z-h.z); if(d<bd){ bd=d; best=i; } });
  if(best<0) return paintArranger("Nothing close enough — stand right by it.");
  var m=fn(best); rebuildHere(); paintArranger(m);
}
function wpSave(){
  var key=wpEditing;
  cityRpc("save_workplace_decor",{p_key:key,p_decor:wpDraft}).then(function(o){
    if(o!=="ok") return paintArranger(String(o));
    WP_DECOR[key]=wpDraft.slice(); wpEditing=null; wpDraft=null;
    paintArranger(); paintWorkButton();
    setStatus("<b>Saved.</b> Everybody who walks into "+esc(key)+" sees it this way now.");
  }).catch(function(e){ paintArranger(e.message); });
}

/* ================================================================ the way to work */
var guideTo=null;
function showTheWay(key){
  var at=store.workplaceAt&&store.workplaceAt[key];
  if(!at) return setStatus("That place is not in your city yet — join Somnucor once more to raise it.");
  guideTo={key:key,x:at.x,z:at.z};
  var r=somnucorRealm(); if(r&&(store.here||0)!==r.id&&typeof toSomnucor==="function") toSomnucor();
  setStatus("<b>"+esc(key)+"</b> — follow the pointer at the top of the screen.");
}
function guideEl(){
  var el=document.getElementById("guide"); if(el||!document.body) return el;
  el=document.createElement("div"); el.id="guide";
  el.style.cssText="position:fixed;left:50%;top:calc(52px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:44;display:none;"+
    "background:rgba(10,12,18,.9);border:1px solid var(--gold,#C9A868);border-radius:3px;padding:6px 12px;font:13px var(--sans);color:var(--bone);cursor:pointer";
  el.title="Click to stop";
  el.onclick=function(){ guideTo=null; el.style.display="none"; };
  document.body.appendChild(el); return el;
}
function guideTick(){
  var el=guideEl(); if(!el) return;
  if(!guideTo||!walkMode){ el.style.display="none"; return; }
  if(store.inside){ if(INT&&INT.wpKey===guideTo.key){ guideTo=null; setStatus("<b>You are at work.</b>"); } el.style.display="none"; return; }
  var P=camera.position, dx=guideTo.x-P.x, dz=guideTo.z-P.z, d=Math.hypot(dx,dz);
  if(d<14){ guideTo=null; el.style.display="none"; setStatus("<b>Here it is.</b> Walk in through the door."); return; }
  var want=Math.atan2(-dx,-dz), turn=atlWrap(want-yaw);
  var arrows=["↑","↗","→","↘","↓","↙","←","↖"];
  var ai=Math.round(((-turn/(Math.PI*2))*8+8))%8;
  var lvl="";
  if(typeof atlRingAt==="function"){ var here=atlRingAt(P.x,P.z), there=atlRingAt(guideTo.x,guideTo.z);
    if(here&&there&&here!==there) lvl=" · "+(there.H>here.H?"up":"down")+" to "+there.name; }
  el.style.display="block";
  el.innerHTML='<b style="font-size:16px">'+arrows[ai]+'</b> '+esc(guideTo.key)+' · '+Math.round(d)+' m'+esc(lvl);
}

/* ================================================================ the Gaol */
var gaolCool=0, gaolLastSay=0;
function heldNow(){
  return !!(typeof standing!=="undefined"&&standing&&standing.prison&&(!standing.prison.until||new Date(standing.prison.until)>new Date()));
}
function gaolSpec(){
  for(var i=0;i<store.objects.length;i++){ var o=store.objects[i]; if(o.workplace==="The Gaol") return o; }
  return null;
}
function inYard(x,z){
  var y=store.gaolYard; if(!y) return false;
  var dx=x-y.cx, dz=z-y.cz, r=Math.hypot(dx,dz), a=Math.atan2(dz,dx);
  return r>y.r0-1&&r<y.r1+1&&Math.abs(atlWrap(a-y.a))*r<y.half+1;
}
function toYard(msg){
  var y=store.gaolYard; if(!y) return;
  if(INT) exitInterior(true);
  camera.position.set(y.x,terrainY(y.x,y.z)+1.72,y.z);
  if(typeof flyY!=="undefined") flyY=0;
  setStatus(msg||"<b>You are held in the Gaol yard.</b>");
}
/* a cell of your own: the same one each time you are brought back */
function toCell(msg,where){
  var g=gaolSpec(); if(!g) return toYard(msg);
  if(!(INT&&INT.spec===g)) enterBuilding(g);
  INT.level=0; wallsAt=-1;
  var cells=(INT.spots||[]).filter(function(s){ return s.room===(where||"cell"); });
  if(!cells.length) cells=INT.spots||[];
  var id=(typeof myUserId==="function"&&myUserId())||"x", hsh=0;
  for(var i=0;i<id.length;i++) hsh=(hsh*31+id.charCodeAt(i))>>>0;
  var c=cells[hsh%Math.max(1,cells.length)]||{x:0,z:0};
  camera.position.set(INT.ox+c.x,1.72,INT.oz+c.z); if(typeof flyY!=="undefined") flyY=0;
  setStatus(msg);
}
function prisonWords(p){
  var s="<b>Held by Somnucor</b> for "+esc(p.crime)+". ";
  if(p.serve_hours) s+=Math.floor((p.served||0)/60)+"h "+((p.served||0)%60)+"m of "+p.serve_hours+" hours served. ";
  if(p.work_off&&p.hours) s+="Or work it off: "+Math.floor((p.worked||0)/60)+"h "+((p.worked||0)%60)+"m of "+p.hours+" hours at the yard benches. ";
  return s+"Every moment in the Gaol counts; nothing counts while you are away from Somnucor.";
}
function gaolTick(dt){
  gaolCool-=dt;
  if(!walkMode||!heldNow()) return;
  var r=somnucorRealm(); if(!r||(store.here||0)!==r.id) return;     /* your own dreamscape is untouched */
  var P=camera.position;
  var insideGaol=store.inside&&INT&&INT.spec&&INT.spec.workplace==="The Gaol";
  if(!insideGaol&&!inYard(P.x,P.z)){
    toCell(prisonWords(standing.prison));
  } else if(!insideGaol){
    /* from the yard, the way back in is the Gaol's own back door */
    var y=store.gaolYard;
    if(y){ var bx=y.cx+Math.cos(y.a)*(y.r0+3), bz=y.cz+Math.sin(y.a)*(y.r0+3);
      if(Math.hypot(P.x-bx,P.z-bz)<5) toCell("<b>Back inside.</b> The cell block.","the cell block"); }
  }
  if(gaolCool<=0){
    gaolCool=45;
    var p2=standing.prison;
    if(p2&&typeof cityRpc==="function"&&standing.prison.id) cityRpc("work_off",{p_sentence:p2.id,p_hours:1}).catch(function(){});
    if(typeof refreshStanding==="function") refreshStanding().then(function(s){
      if(s&&!s.prison) setStatus("<b>Your time is served.</b> The gate is open — you are free to go.");
      else if(s&&s.prison&&Date.now()-gaolLastSay>120000){
        gaolLastSay=Date.now();
        setStatus(prisonWords(s.prison));
      }
    });
  }
}
/* the Gaol's door lets its prisoners out only into its own yard */
(function(){
  if(typeof exitInterior!=="function") return;
  var orig=exitInterior;
  exitInterior=function(quiet){
    var wasGaol=INT&&INT.spec&&INT.spec.workplace==="The Gaol";
    if(wasGaol&&heldNow()&&!quiet){ toYard("<b>The door opens only onto the yard.</b> Walk back to the Gaol's back wall to go in again."); return; }
    return orig.apply(this,arguments);
  };
})();

/* ================================================================ the Nightmare Wilds */
var wildsBeaten={}, wildsCool=0, wildsNight=-1;
function nightNumber(){ return Math.floor((Date.now()/3600000+(typeof scrubOffset!=="undefined"?scrubOffset:0)+4)/24); }
function myNightmareKinds(){
  var k={};
  (store.characters||[]).forEach(function(c){ if(typeof isNightmare==="function"&&isNightmare(c)&&c.archetype) k[c.archetype]=c; });
  return k;
}
function wildCreatureName(kind){
  var w=(typeof MORE_VOCAB!=="undefined"&&MORE_VOCAB[kind])||[];
  var n=(w[0]||kind).replace(/^(a|an|the) /,"");
  return "The "+n;
}
function wildsTick(dt){
  var list=store.wildsNightmares; if(!list||!list.length||!ATLC) return;
  var r=somnucorRealm(); if(!r||(store.here||0)!==r.id) return;
  var night=typeof isNightHour==="function"&&isNightHour(dreamHour());
  var nn=nightNumber(); if(nn!==wildsNight){ wildsNight=nn; wildsBeaten={}; list.forEach(function(w){ var g=meshes[w.id]; if(g){ g.userData.nmGone=false; g.visible=true; g.scale.set(1,1,1); } }); }
  wildsCool-=dt; var re=wildsCool<=0; if(re) wildsCool=1.1;
  var P=camera.position, mine=myNightmareKinds(), walking=walkMode&&!store.inside;
  var W=atlRing("wilds");
  list.forEach(function(w){
    var g=meshes[w.id]; if(!g) return;
    if(wildsBeaten[w.id]){ g.visible=false; g.userData.nmGone=true; return; }
    var u=g.userData;
    var dx=P.x-g.position.x, dz=P.z-g.position.z, d=Math.hypot(dx,dz);
    var hunts=walking&&night&&!!mine[w.kind]&&d<70&&!nmOpen;
    /* nothing from the Wilds climbs the stairs into the city */
    var pr=Math.hypot(P.x-ATLC.x,P.z-ATLC.z);
    if(pr<W.S+ATL_STAIR_RUN) hunts=false;
    u.hunt=hunts?1:0;
    if(hunts){
      u.target={x:P.x-dx/d*1.2,z:P.z-dz/d*1.2}; u.path=null;
      if(d<NM_REACH+0.4&&nmCool<=0) openEncounter(wildChar(w,mine[w.kind]));
    } else if(walking&&d<26&&d>0.1){
      /* the others only watch: they keep their distance, and turn to follow you */
      u.target={x:g.position.x-dx/d*0.6,z:g.position.z-dz/d*0.6};
      g.rotation.y=Math.atan2(dx,dz);
    } else if(re&&(!u.target||Math.random()<0.18)){
      var a=Math.random()*Math.PI*2, rr=Math.random()*34;
      u.target={x:w.home.x+Math.cos(a)*rr,z:w.home.z+Math.sin(a)*rr};
    }
  });
}
function wildChar(w,dreamt){
  return {wild:true,id:"wild_"+w.id,objId:w.id,kind:w.kind,name:dreamt&&dreamt.name&&dreamt.name!=="someone"?dreamt.name:wildCreatureName(w.kind),
          defeat:(dreamt&&dreamt.defeat)?dreamt.defeat.slice():[],sessions:[]};
}
/* defeat and capture, for the Wilds' own */
(function(){
  if(typeof defeatNightmare!=="function"||typeof caught!=="function") return;
  var origDefeat=defeatNightmare, origCaught=caught;
  defeatNightmare=function(c,way){
    if(!c||!c.wild) return origDefeat.apply(this,arguments);
    var label=way.indexOf("ability:")===0?("with "+way.slice(8)):(DEFEAT_LABEL[way]||way);
    wildsBeaten[c.objId]=true;
    var g=meshes[c.objId];
    if(g){
      var burst=particles(80,[1.5,3,1.5],way==="light"||way==="prayer"||way==="song"?0xFFF2D6:way==="fire"?0xFF8A3A:0xB8C4D8,1.4,.9);
      burst.position.set(g.position.x,g.position.y,g.position.z); scene.add(burst);
      var t0=0, s0=g.scale.x||1;
      nmFades.push(function(dt){ t0+=dt; var k=Math.max(0,1-t0/1.6); g.scale.set(s0*k,s0*k,s0*k); rise(burst,dt,3,0);
        if(t0>=1.6){ g.visible=false; g.userData.nmGone=true; g.scale.set(s0,s0,s0); scene.remove(burst); return true; } return false; });
    }
    nmCool=4;
    setStatus("<b>"+esc(c.name)+" is gone</b> — defeated "+esc(label)+". The Wilds will not send it for you again tonight.");
  };
  caught=function(c){
    if(!c||!c.wild) return origCaught.apply(this,arguments);
    closeEncounter(); nmCool=6;
    backToMyDoor("<b>"+esc(c.name)+" took you.</b> You wake at your own door.");
  };
})();
function backToMyDoor(msg){
  var r=somnucorRealm();
  var mine=(typeof myDoor!=="undefined"&&myDoor)?myDoor:null;
  if(mine&&typeof toHall==="function"){
    toHall();
    setTimeout(function(){
      var d=(typeof specById==="function")?specById(mine.id):null; d=d||mine;
      var out={x:Math.sin(d.rot||0),z:Math.cos(d.rot||0)};
      camera.position.set(d.x+out.x*3,1.72,d.z+out.z*3); if(typeof flyY!=="undefined") flyY=0;
      setStatus(msg);
    },60);
    return;
  }
  if(r&&typeof beHere==="function") beHere(r.id);
  if(ATLC){ camera.position.set(ATLC.x,terrainY(ATLC.x,ATLC.z+56)+1.72,ATLC.z+56); if(typeof flyY!=="undefined") flyY=0; }
  setStatus(msg+" (Take a door of your own in the Hall and it is there you will wake.)");
}

/* ================================================================ the beat */
var lifeCool=0;
function atlLifeTick(dt){
  guideTick(); gaolTick(dt); wildsTick(dt);
  if(typeof cityShapeTick==="function") cityShapeTick(dt);
  lifeCool-=dt;
  if(lifeCool<=0){ lifeCool=1; paintWorkButton();
    var r=somnucorRealm(); if(r&&(store.here||0)===r.id&&typeof signedIn==="function"&&signedIn()) loadWorkplaces(false); }
}
