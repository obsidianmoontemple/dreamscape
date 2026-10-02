/* SomnuMatrix — custom-kit.js
   something dreamed that isn't in the catalogue, yet.
   the second tier (parse.js) is allowed to invent an archetype when
   nothing on the built-in list is close to what the dreamer described.
   this file turns that invention into a real KIT entry — built from the
   same box/cylinder/cone primitives every hand-authored archetype in
   kit.js already uses, so it stands in the world in the house visual
   style, not a mismatched one — and, once it's real, saves it to a
   small shared table so every dreamer's client ends up with the same
   grown catalogue. a dreamt thing nobody had a word for yet never just
   vanishes: it renders now, and it's there next time, for anyone.
   loaded as a plain script; shares scope with the other files */
"use strict";

var CUSTOM_CAT={structure:1,nature:1,infra:1,vehicle:1};
var CUSTOM_SHAPE={box:3,cyl:3,cone:2};

/* a dreamt thing whose own recipe didn't hold up, or that arrived with
   no recipe at all: a plain, clearly-marked box, so it stands for
   something rather than for nothing. the sign draws whatever word the
   dreamer actually used for it. */
A("dreamplaceholder","structure",[3,3,4],[
  {g:"box",s:[3,3,4],p:[0,1.5,0],c:"body"}
],{sign:[0,3.3,2.05,2.6,.9]});

function numOK(n,lo,hi){ return typeof n==="number"&&isFinite(n)&&n>=lo&&n<=hi; }

/* one part of a recipe, turned into a KIT part — or null, if it isn't
   actually one of the shapes the rest of the kit is built from */
function compilePart(pt){
  if(!pt||typeof pt!=="object") return null;
  var g=pt.g, need=CUSTOM_SHAPE[g];
  if(!need) return null;                       /* box / cyl / cone only */
  var s=pt.s;
  if(!Array.isArray(s)||s.length<need) return null;
  for(var i=0;i<s.length;i++) if(!numOK(s[i],0.03,60)) return null;
  var p=pt.p;
  if(!Array.isArray(p)||p.length!==3) return null;
  if(!numOK(p[0],-60,60)||!numOK(p[1],0,220)||!numOK(p[2],-60,60)) return null;
  var out={g:g,s:s.slice(0,Math.max(need,s.length)),p:[p[0],p[1],p[2]]};
  if(Array.isArray(pt.r)&&pt.r.length===3&&pt.r.every(function(v){ return numOK(v,-6.3,6.3); })) out.r=pt.r.slice();
  var c=pt.c;
  if(typeof c==="string"&&ROLE[c]!==undefined) out.c=c;
  else if(typeof c==="string"&&hexToInt(c)!==undefined) out.c=hexToInt(c);
  else out.c="body";
  return out;
}

/* the whole recipe, as one real KIT entry — or null, if the model's
   answer didn't actually hold together. never something half-built:
   either every part of it is sound, or none of it is used. */
function compileArchetype(key,def){
  if(typeof key!=="string"||!/^[a-z][a-z0-9]{1,23}$/.test(key)) return null;
  if(KIT[key]) return KIT[key];                /* already real; never overwritten */
  if(!def||!CUSTOM_CAT[def.cat]) return null;
  var size=def.size;
  if(!Array.isArray(size)||size.length!==3||!size.every(function(v){ return numOK(v,0.2,220); })) return null;
  var parts=def.parts;
  if(!Array.isArray(parts)||!parts.length||parts.length>12) return null;
  var built=[];
  for(var i=0;i<parts.length;i++){
    var cp=compilePart(parts[i]);
    if(!cp) return null;
    built.push(cp);
  }
  KIT[key]=Object.assign({cat:def.cat,size:size,parts:built},{grown:true});
  return KIT[key];
}

/* the word for it — so if this dreamer, or any dreamer, says the same
   thing again, the instant tier (parse.js's VOCAB/PHRASES) recognises
   it at once, rather than asking the model to invent it all over again */
function learnWord(key,word){
  if(!key||!word||!KIT[key]) return;
  word=String(word).toLowerCase().trim();
  if(!word||(VOCAB[key]&&VOCAB[key].indexOf(word)>-1)) return;
  if(!VOCAB[key]) VOCAB[key]=[];
  VOCAB[key].push(word);
  PHRASES.push([word,key]);
  PHRASES.sort(function(a,b){ return b[0].length-a[0].length; });
}

/* what the shared catalogue already holds, pulled down once at the
   start so this client's KIT matches everyone else's before a single
   saved object is drawn from it. skipped entirely, at no cost, when
   signed out — Somnucor's sharing was always opt-in, and this is no
   different: signed out, a dreamt thing still renders and still saves
   to VOCAB for this session, it just isn't shared beyond it. */
var customArchetypesLoaded=false;
function loadCustomArchetypes(){
  if(customArchetypesLoaded) return Promise.resolve();
  if(typeof cityRpc!=="function"||typeof signedIn!=="function"||!signedIn()) return Promise.resolve();
  customArchetypesLoaded=true;
  return cityRpc("list_custom_archetypes").then(function(rows){
    (rows||[]).forEach(function(row){
      if(!row||KIT[row.key]) return;
      var recipe=row.recipe||{};
      var got=compileArchetype(row.key,{cat:row.cat,size:row.size,parts:recipe.parts||recipe});
      if(got&&row.label) learnWord(row.key,row.label);
    });
  }).catch(function(){ customArchetypesLoaded=false; });
}

/* a brand new archetype, just proposed by the model for this fragment:
   compiled and standing at once, in this browser, whether or not this
   dreamer is signed in — and saved up to the shared table, once, only
   when signing in makes that possible and this key genuinely hasn't
   been saved there before (checked by key, so two dreamers describing
   the same new thing in the same minute don't spam two near-duplicate
   rows: whichever save reaches the server first wins, the table's own
   primary key on the way a duplicate insert is quietly ignored). */
var savedArchetypeKeys={};
function growArchetype(key,def,label){
  if(!key) return null;
  if(KIT[key]){ if(label) learnWord(key,label); return KIT[key]; }
  var got=compileArchetype(key,def);
  if(!got) return null;
  if(label) learnWord(key,label);
  if(!savedArchetypeKeys[key]&&typeof cityRpc==="function"&&typeof signedIn==="function"&&signedIn()){
    savedArchetypeKeys[key]=true;
    cityRpc("save_custom_archetype",
      {p_key:key,p_recipe:{parts:def.parts},p_cat:def.cat,p_size:def.size,p_label:label||null}
    ).catch(function(){ savedArchetypeKeys[key]=false; });
  }
  return got;
}

