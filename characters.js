/* Dream Walker's Atlas — characters.js
   figures: resolution, detail, waking, merging
   loaded as a plain script; shares scope with the other files */
"use strict";
var WAKE_AT=4;

function normName(s){
  return String(s||"").toLowerCase().replace(/^(a|an|the|some)\s+/,"").trim();
}

/* the same figure across dreams is one character, not many */
function resolveCharacter(arch,label,attrs){
  var n=normName(label)||arch;
  for(var i=0;i<store.characters.length;i++){
    var c=store.characters[i];
    if(c.archetype!==arch) continue;
    if(normName(c.name)===n || c.aka.indexOf(n)>-1){
      noteDetail(c,n,attrs);
      return c;
    }
  }
  return newCharacter(arch,label,attrs,n);
}

function newCharacter(arch,label,attrs,n){
  n=n||normName(label)||arch;
  var ch={id:uid(),archetype:arch,name:label||arch,aka:[n],details:[],
          sessions:[store.session],awake:false,log:[],objId:null,x:0,z:0,
          primary:true,src:{name:"stated"},role:null,shift:null,routine:null,
          home:null,work:null,anchor:null,
          born:new Date().toISOString().slice(0,10)};
  seedDetails(ch,attrs);
  store.characters.push(ch);
  return ch;
}

function seedDetails(ch,attrs){
  var a=attrs||{};
  if(a.s&&a.s>1.4) addDetail(ch,"larger than they should be");
  if(a.s&&a.s<0.7) addDetail(ch,"small, smaller than expected");
  if(a.h&&a.h>1.5) addDetail(ch,"unusually tall");
  if(a.c!==undefined) addDetail(ch,"coloured "+("#"+("000000"+a.c.toString(16)).slice(-6)));
}

function addDetail(ch,text){
  text=String(text).trim();
  if(!text || ch.details.indexOf(text)>-1) return false;
  ch.details.push(text);
  return true;
}

function noteDetail(ch,alias,attrs){
  if(alias && ch.aka.indexOf(alias)===-1) ch.aka.push(alias);
  if(ch.sessions.indexOf(store.session)===-1) ch.sessions.push(store.session);
  seedDetails(ch,attrs);
  checkWake(ch);
}

/* context from the sentence they appeared in counts as detail */
function feedContext(text){
  if(!text) return;
  var low=text.toLowerCase();
  store.characters.forEach(function(c){
    if(c.primary===false) return;
    var hit=c.aka.some(function(a){ return a && low.indexOf(a)>-1; });
    if(!hit) return;
    // take the clause around the mention
    var idx=-1;
    c.aka.forEach(function(a){ var i=low.indexOf(a); if(i>-1&&(idx<0||i<idx)) idx=i; });
    var from=Math.max(0,low.lastIndexOf(".",idx)+1);
    var to=low.indexOf(".",idx); if(to<0) to=low.length;
    var clause=text.slice(from,to).trim();
    if(clause.length>8 && clause.length<220) addDetail(c,clause);
    if(c.sessions.indexOf(store.session)===-1) c.sessions.push(store.session);
    checkWake(c);
  });
}

function awareness(c){
  return Math.min(1,(c.details.length + (c.sessions.length-1)*2)/WAKE_AT);
}

function checkWake(c){
  if(c.awake) return false;
  if(awareness(c)<1) return false;
  c.awake=true;
  var sp=c.objId?specById(c.objId):null;
  if(sp){ sp.solid=true; refresh(sp); }
  setStatus("<b>"+esc(c.name)+" has become aware of you.</b>");
  save();
  return true;
}

function charOf(spec){
  if(!spec||!spec.charId) return null;
  for(var i=0;i<store.characters.length;i++) if(store.characters[i].id===spec.charId) return store.characters[i];
  return null;
}

function awakeNear(pos,range){
  var best=null,bd=range*range;
  for(var i=0;i<store.characters.length;i++){
    var c=store.characters[i];
    if(!c.objId) continue;
    if(c.visible===false) continue;
    var dx=c.x-pos.x, dz=c.z-pos.z, d=dx*dx+dz*dz;
    if(d<bd){ bd=d; best=c; }
  }
  return best;
}


