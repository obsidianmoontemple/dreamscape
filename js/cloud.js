/* SomnuMatrix — cloud.js
   the Atlas's shared settings, set from the admin page: which held-back book
   readings are released, any announcement, whether the Dream Walker inbox is
   open. read once at start and remembered for when there is no connection.
   this file only ever reads; it sends nothing about the dreamer.
   loaded as a plain script; shares scope with the other files */
"use strict";

var DW_CLOUD={config:{},live:false};
var CLOUDKEY="dreamwalker.cloudcfg";

function cloudOn(){
  return typeof DW_CONFIG!=="undefined" && !!DW_CONFIG.supabaseUrl && /^sb_publishable_/.test(DW_CONFIG.supabaseKey||"");
}
function cloudHeaders(){
  return {apikey:DW_CONFIG.supabaseKey, Authorization:"Bearer "+DW_CONFIG.supabaseKey};
}
function loadCloudConfig(){
  try{ var kept=JSON.parse(localStorage.getItem(CLOUDKEY)||"null"); if(kept) DW_CLOUD.config=kept; }catch(e){}
  if(!cloudOn()||typeof fetch!=="function") return Promise.resolve(DW_CLOUD.config);
  return fetch(DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/app_config?select=key,value",{headers:cloudHeaders()})
    .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
    .then(function(rows){
      var c={}; rows.forEach(function(r){ c[r.key]=r.value; });
      DW_CLOUD.config=c; DW_CLOUD.live=true;
      try{ localStorage.setItem(CLOUDKEY,JSON.stringify(c)); }catch(e){}
      applyCloud();
      return c;
    })
    .catch(function(){ return DW_CLOUD.config; });
}
function cloudReleased(key){
  var a=DW_CLOUD.config.miller_released;
  return Array.isArray(a) && a.indexOf(key)>-1;
}
/* ---- being counted: one random code for this device, nothing else ---- */
var DEVKEY="dreamwalker.device", APP_VERSION="15";
function deviceId(make){
  var id=null; try{ id=localStorage.getItem(DEVKEY); }catch(e){}
  if(!id&&make){
    id=(typeof crypto!=="undefined"&&crypto.randomUUID)?crypto.randomUUID():
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(ch){ var r=Math.random()*16|0; return (ch==="x"?r:(r&3|8)).toString(16); });
    try{ localStorage.setItem(DEVKEY,id); }catch(e){}
  }
  return id;
}
function platformWord(){
  var coarse=typeof matchMedia==="function"&&matchMedia("(pointer:coarse)").matches;
  var small=Math.min(innerWidth||1000,innerHeight||1000)<600;
  return coarse?(small?"phone":"tablet"):"computer";
}
function rpc(name,body){
  return fetch(DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/rpc/"+name,{method:"POST",
    headers:Object.assign({"Content-Type":"application/json"},cloudHeaders()),body:JSON.stringify(body)});
}
function checkin(){
  if(!cloudOn()||typeof fetch!=="function"||DW_TESTING) return;
  if(cfg().counted===false) return;
  var id=deviceId(true);
  rpc("checkin",{p_id:id,p_platform:platformWord(),p_version:APP_VERSION}).catch(function(){});
}
function forgetDevice(){
  var id=deviceId(false); if(!id) return;
  try{ localStorage.removeItem(DEVKEY); }catch(e){}
  if(cloudOn()&&typeof fetch==="function") rpc("forget_device",{p_id:id}).catch(function(){});
}

function applyCloud(){
  var a=DW_CLOUD.config.announcement;
  if(typeof a==="string" && a.trim() && typeof setStatus==="function") setStatus(esc(a.trim()));
}

