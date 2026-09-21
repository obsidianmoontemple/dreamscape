/* Dream Walker's Atlas — store.js
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
  try{
    var keep={};
    for(var k in store) if(k!=="blocks") keep[k]=store[k];
    keep.objects=store.objects.filter(function(o){ return !o.filler; });
    var live={};
    keep.objects.forEach(function(o){ if(o.charId) live[o.charId]=1; });
    keep.characters=store.characters.filter(function(c){ return c.primary!==false; });
    localStorage.setItem(KEY, JSON.stringify(keep));
  }catch(e){}
}
function load(){ try{ var r=localStorage.getItem(KEY); if(!r) return false;
  var d=JSON.parse(r); if(d&&d.objects){ store=Object.assign(blank(),d); return true; } }catch(e){} return false; }
function cfg(){ try{ return Object.assign({mode:"off",model:"grok-4.3",density:26}, JSON.parse(localStorage.getItem(CFGKEY))||{}); }
  catch(e){ return {mode:"off",model:"grok-4.3",density:26}; } }
function setCfg(c){ try{ localStorage.setItem(CFGKEY, JSON.stringify(c)); }catch(e){} }

