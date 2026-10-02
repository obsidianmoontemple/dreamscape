/* SomnuMatrix — store.js
   the saved record: schema, save, load, settings
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   3. STORE
   ============================================================ */
/* ?test=1 runs against its own storage, so tests can never touch a real dreamscape */
var DW_TESTING=(typeof location!=="undefined" && /[?&]test=1\b/.test(location.search)) ||
               (typeof window!=="undefined" && window.DW_TEST===true);
var KEY=DW_TESTING?"dreamwalker.test":"dreamwalker.v2";
var CFGKEY=DW_TESTING?"dreamwalker.testcfg":"dreamwalker.cfg2";
var store = blank();
function blank(){
  return {objects:[],passages:[],transcript:"",emotions:[],lucidity:0,
          grid:{bx:0,bz:0,lot:0},streets:[],lastId:null,open:0,
          characters:[],sessions:[],session:1,blocks:{},lots:{},lastLot:null,
          dreamer:{name:"",about:"",practice:"",notes:"",abilities:[]},
          research:{consent:false,since:null}};
}
function uid(){ return Math.random().toString(36).slice(2,10); }
function save(){
  if(typeof visiting!=="undefined"&&visiting) return;   /* a guest changes nothing */
  try{
    var keep={};
    for(var k in store) if(k!=="blocks") keep[k]=store[k];
    /* Somnucor's own streets are the same for every dreamer and are stood up
       again from their seed each visit — only what is the dreamer's own is kept */
    keep.objects=store.objects.filter(function(o){ return !o.filler&&!o.city; });
    var live={};
    keep.objects.forEach(function(o){ if(o.charId) live[o.charId]=1; });
    keep.characters=store.characters.filter(function(c){ return c.primary!==false&&!c.city; });
    ["plots","districtPlots","workplaceAt","wildsNightmares","gaolYard"].forEach(function(k){ delete keep[k]; });
    if(keep.inside&&!keep.objects.some(function(o){ return o.id===keep.inside; })) keep.inside=null;
    localStorage.setItem(KEY, JSON.stringify(keep));
  }catch(e){}
}
function load(){ try{ var r=localStorage.getItem(KEY); if(!r) return false;
  var d=JSON.parse(r); if(d&&d.objects){ store=Object.assign(blank(),d); return true; } }catch(e){} return false; }
/* the second pass runs on Groq (OpenAI-shaped, with a free tier) */
var LLM_URL="https://api.groq.com/openai/v1/chat/completions", LLM_MODEL="openai/gpt-oss-120b";
function cfg(){
  var c;
  try{ c=Object.assign({mode:"off",model:LLM_MODEL,density:26}, JSON.parse(localStorage.getItem(CFGKEY))||{}); }
  catch(e){ c={mode:"off",model:LLM_MODEL,density:26}; }
  /* settings saved in the Grok days: the old model name and an xAI key won't work on Groq */
  if(!c.model||/^grok/i.test(c.model)) c.model=LLM_MODEL;
  if(c.key&&/^xai-/i.test(c.key)){ c.key=""; if(c.mode==="direct") c.mode="off"; }
  return c;
}
/* what every request to the model carries: think briefly, and leave room to answer after thinking */
function llmBody(c,extra){
  var b=Object.assign({model:c.model||LLM_MODEL},extra);
  if(/gpt-oss|qwen/i.test(b.model)){ b.reasoning_effort="low"; b.include_reasoning=false; }
  return b;
}
function setCfg(c){ try{ localStorage.setItem(CFGKEY, JSON.stringify(c)); }catch(e){} }


