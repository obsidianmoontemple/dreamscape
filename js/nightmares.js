/* SomnuMatrix — nightmares.js
   what chased you in the dream comes out after dark. it hunts you when you walk
   the dreamscape at night, and when it reaches you, you face it — in the way the
   dream said it ended, or any way you choose, which then becomes true.
   a defeated nightmare stays gone until you dream it again.
   loaded as a plain script; shares scope with the other files */
"use strict";

var THREAT=/\b(chased|chasing|chase me|hunted|hunting me|stalked|stalking|pursued|pursuing|attacked|attacking|haunted|haunting|came after me|was after me|were after me|followed me|coming for me|came for me|grabbed me|tried to kill|wanted to kill|crept toward|crawled toward|terrified me|attacked me|lunged at|ran at me|tore at|was hunting)\b/;
var FRIENDLY=/\b(friendly|kind|gentle|helped me|my friend|protected me|guided me|smiled at me|comforted me|was harmless|meant no harm|tame)\b/;
var DEFEAT=[
  ["light",/\b(light|lamp|torch|flashlight|sunlight|shone|shining|glowed|lantern)\b/,"with light"],
  ["face",/\b(faced it|faced them|faced him|faced her|turned and faced|turned to face|stood my ground|looked it in the eye|stared it down|stopped running)\b/,"by facing it"],
  ["name",/\b(named it|said its name|called it by (its )?name|knew its name|its true name|spoke its name)\b/,"by naming it"],
  ["command",/\b(told it to (go|leave)|commanded it|shouted at it|banished|ordered it|told them to leave|told it no)\b/,"by commanding it to go"],
  ["strike",/\b(killed|stabbed|struck|shot|slew|slain|fought (it|them|him|her|back)|punched|kicked|beat it|cut it|cut off)\b/,"by striking it down"],
  ["song",/\b(sang|singing|sung|hummed|chanted)\b/,"with a song"],
  ["prayer",/\b(prayed|prayer|invoked|called on|called upon|recited)\b/,"with a prayer"],
  ["laugh",/\b(laughed at it|laughed at them|laughed)\b/,"by laughing at it"],
  ["embrace",/\b(hugged|embraced|held it|forgave|comforted it|made friends)\b/,"by embracing it"],
  ["fire",/\b(burned it|set it on fire|burned them|with fire)\b/,"with fire"],
  ["wake",/\b(woke up|i woke|awoke|jolted awake)\b/,"by waking"]
];
var DEFEAT_LABEL={}; DEFEAT.forEach(function(d){ DEFEAT_LABEL[d[0]]=d[2]; });
var GENERIC_WAYS=["face","light","command","name","strike","song","prayer","embrace"];
var WAY_BUTTON={face:"Face it",light:"Bring light",command:"Command it to go",name:"Name it",strike:"Strike it down",
  song:"Sing",prayer:"Pray",laugh:"Laugh at it",embrace:"Embrace it",fire:"Burn it",wake:"Wake up"};

function isNightmare(c){ return !!(c&&c.nightmare); }
function lastDreamt(c){ return (c.sessions||[]).reduce(function(m,s){ return Math.max(m,s); },0); }
function beaten(c){ return c.beaten!==undefined&&c.beaten>=lastDreamt(c); }

/* read a stretch of dream for who was a threat and how it ended */
function nightmareScan(text){
  if(!text) return;
  var sents=(text.match(/[^.!?]+[.!?]?/g)||[]).map(function(s){ return s.toLowerCase(); });
  store.characters.forEach(function(c){
    if(!c.objId||c.primary===false||!c.aka||!c.aka.length) return;
    sents.forEach(function(s,i){
      if(!c.aka.some(function(a){ return a&&s.indexOf(a)>-1; })) return;
      var o=typeof CREATURE!=="undefined"?CREATURE[c.archetype]:null;
      var threat=THREAT.test(s), friendly=FRIENDLY.test(s);
      if(friendly){ c.nightmare=false; c.src=c.src||{}; c.src.nightmare="stated"; return; }
      if(threat||(o&&o.night&&!(c.src&&c.src.nightmare==="stated"))){ c.nightmare=true; if(threat){ c.src=c.src||{}; c.src.nightmare="stated"; } }
      if(!c.nightmare) return;
      /* how it ended: in this sentence or the next two */
      var tail=sents.slice(i,i+3).join(" ");
      DEFEAT.forEach(function(d){
        if(d[1].test(tail)){ c.defeat=c.defeat||[]; if(c.defeat.indexOf(d[0])===-1) c.defeat.push(d[0]); }
      });
    });
  });
}

/* ---- after dark ---- */
var nmOpen=null, nmTimer=0, nmCool=0, NM_RANGE=70, NM_REACH=2.6, NM_WAIT=10;
function isNightHour(h){ return h>=20.5||h<5.5; }
function nightTick(dt){
  if(nmCool>0) nmCool-=dt;
  if(!walkMode||cfg().nightmares===false){ if(nmOpen) closeEncounter(); return; }
  var night=isNightHour(dreamHour());
  var P=camera.position, here=store.here||0;
  store.characters.forEach(function(c){
    if(!isNightmare(c)||!c.objId) return;
    var sp=specById(c.objId), g=meshes[c.objId]; if(!sp||!g) return;
    g.userData.hunt=0;
    if(!night||beaten(c)||(sp.realm||0)!==here||g.visible===false) return;
    var dx=P.x-g.position.x, dz=P.z-g.position.z, d=Math.sqrt(dx*dx+dz*dz);
    if(d>NM_RANGE) return;
    if(store.inside) return;
    if(nmOpen){ g.userData.target={x:g.position.x,z:g.position.z}; g.userData.path=null; return; }
    g.userData.hunt=1;
    g.userData.target={x:P.x-dx/d*1.2,z:P.z-dz/d*1.2};
    /* it finds its way round walls to you, working the route out afresh every second or so */
    g.userData.repath=(g.userData.repath||0)-dt;
    if(g.userData.repath<=0){ g.userData.repath=1.2; g.userData.path=null; if(walksOnGround(g,sp)) wantPath(c.objId); }
    if(d<NM_REACH&&nmCool<=0) openEncounter(c);
  });
  if(nmOpen){ nmTimer-=dt; var bar=document.getElementById("nm-bar"); if(bar) bar.style.width=Math.max(0,nmTimer/NM_WAIT*100)+"%";
    if(nmTimer<=0) caught(nmOpen); }
}

/* ---- the encounter ---- */
function encounterWays(c){
  var dreamt=(c.defeat||[]).slice();
  var abil=(dreamer().abilities||[]).map(function(a){ return "ability:"+a.name; });
  var rest=GENERIC_WAYS.filter(function(w){ return dreamt.indexOf(w)===-1; });
  return {dreamt:dreamt,abilities:abil,rest:rest};
}
function openEncounter(c){
  nmOpen=c; nmTimer=NM_WAIT;
  var W=encounterWays(c), el=document.getElementById("nm-panel");
  if(!el){ el=document.createElement("div"); el.id="nm-panel";
    el.style.cssText="position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:40;width:min(560px,92vw);"+
      "background:rgba(8,6,10,.95);border:1px solid #5A2A2A;padding:16px 18px;border-radius:3px;box-shadow:0 0 40px rgba(120,0,0,.35)";
    if(document.body) document.body.appendChild(el); }
  function btn(way,label,mark){ return '<button class="btn" data-way="'+esc(way)+'" style="margin:3px'+(mark?';border-color:#C9A868;color:#E8C27A':"")+'">'+esc(label)+"</button>"; }
  var h='<div style="color:#E8D8D0;font-size:15px;margin-bottom:4px"><b>'+esc(c.name&&c.name!=="someone"?c.name:"It")+'</b> has reached you.</div>'+
        '<div style="height:3px;background:#2A1414;margin:8px 0 12px"><div id="nm-bar" style="height:3px;width:100%;background:#A8322B"></div></div>';
  if(W.dreamt.length) h+='<div style="font-size:12px;color:#C9A868;margin-bottom:4px">As you dreamt it ending</div>'+W.dreamt.map(function(w){ return btn(w,WAY_BUTTON[w]||w,true); }).join("");
  if(W.abilities.length) h+='<div style="font-size:12px;color:#9FB4D8;margin:8px 0 4px">What you can do in dreams</div>'+W.abilities.map(function(a){ return btn(a,a.slice(8)); }).join("");
  h+='<div style="font-size:12px;color:#999;margin:8px 0 4px">'+(W.dreamt.length?"Or another way \u2014 whatever you choose becomes true":"The dream never said how it ended. Whatever you choose becomes true")+'</div>'+
     W.rest.map(function(w){ return btn(w,WAY_BUTTON[w]); }).join("")+
     '<div style="margin-top:10px">'+btn("run","Run")+btn("wake","Wake up")+"</div>";
  el.innerHTML=h; el.style.display="block";
  Array.prototype.forEach.call(el.querySelectorAll("[data-way]"),function(b){ b.onclick=function(){ chooseWay(c,b.getAttribute("data-way")); }; });
  if(typeof audio!=="undefined"&&audio.on&&typeof playTone==="function") try{ playTone(70,0.8); }catch(e){}
}
function closeEncounter(){ nmOpen=null; var el=document.getElementById("nm-panel"); if(el) el.style.display="none"; }

function chooseWay(c,way){
  closeEncounter();
  if(way==="run"){ nmCool=4; var P=camera.position, g=meshes[c.objId];
    if(g){ var dx=P.x-g.position.x, dz=P.z-g.position.z, d=Math.sqrt(dx*dx+dz*dz)||1; walkBy(dx/d*6,dz/d*6); }
    setStatus("You run. It is still coming."); return; }
  if(way==="wake"){ wakeAtDawn("You woke."); return; }
  defeatNightmare(c,way);
}
function defeatNightmare(c,way){
  var label=way.indexOf("ability:")===0?("with "+way.slice(8)):(DEFEAT_LABEL[way]||way);
  c.beaten=lastDreamt(c);
  if(way.indexOf("ability:")!==0){ c.defeat=c.defeat||[]; if(c.defeat.indexOf(way)===-1) c.defeat.push(way); }
  addDetail(c,"was defeated "+label+" when the dreamer faced it at night");
  var g=meshes[c.objId];
  if(g){
    var burst=particles(80,[1.5,3,1.5],way==="light"||way==="prayer"||way==="song"?0xFFF2D6:way==="fire"?0xFF8A3A:0xB8C4D8,1.4,.9);
    burst.position.set(g.position.x,0,g.position.z); scene.add(burst);
    var t0=0, s0=g.scale.x||1;
    var fade=function(dt){ t0+=dt; var k=Math.max(0,1-t0/1.6); g.scale.set(s0*k,s0*k,s0*k); rise(burst,dt,3,0);
      if(t0>=1.6){ g.visible=false; g.scale.set(s0,s0,s0); scene.remove(burst); return true; } return false; };
    nmFades.push(fade);
  }
  setStatus("<b>"+esc(c.name&&c.name!=="someone"?c.name:"It")+" is gone</b> \u2014 defeated "+esc(label)+". It will not come again until you dream it again.");
  save();
}
var nmFades=[];
function nightFades(dt){ nmFades=nmFades.filter(function(f){ return !f(dt); }); }
function caught(c){
  closeEncounter();
  addDetail(c,"caught the dreamer at night");
  if(cfg().nightmareCatch==="none"){ nmCool=6; setStatus("It has you \u2014 and it only waits. Face it when you are ready."); save(); return; }
  wakeAtDawn("It caught you. You woke.");
}
function wakeAtDawn(msg){
  if(store.here&&typeof leaveRealm==="function") leaveRealm();
  var h=heartOf(0); camera.position.set(h.x,1.72,h.z+30); if(typeof flyY!=="undefined") flyY=0;
  scrubOffset=6.2; tickClock(true);
  nmCool=3; setStatus("<b>"+msg+"</b> It is dawn, and you are back in the town.");
}

