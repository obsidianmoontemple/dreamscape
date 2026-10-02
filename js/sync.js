/* SomnuMatrix — sync.js
   a dreamscape kept to an account rather than to one browser. it is locked on this
   device with a phrase only the dreamer knows, and only then sent. what reaches the
   Temple is a block of nonsense: no one there can open it, and neither can we.
   lose the phrase and the copy is lost with it — that is the price of the promise.
   loaded as a plain script; shares scope with the other files */
"use strict";

var vaultKey=null, vaultSalt=null, vaultBusy=false, lastSaved=null, SYNCKEY="dreamwalker.sync";

function subtle(){ return (typeof crypto!=="undefined"&&crypto.subtle)?crypto.subtle:null; }
function syncOn(){ return cfg().sync===true; }
function b64(buf){ var b=new Uint8Array(buf), s=""; for(var i=0;i<b.length;i++) s+=String.fromCharCode(b[i]); return btoa(s); }
function unb64(str){ var s=atob(str), b=new Uint8Array(s.length); for(var i=0;i<s.length;i++) b[i]=s.charCodeAt(i); return b; }
function randBytes(n){ var b=new Uint8Array(n); crypto.getRandomValues(b); return b; }

/* the phrase becomes a key here, on this device, and the key never leaves it */
function makeKey(phrase,salt){
  var S=subtle(); if(!S) return Promise.reject(new Error("this browser cannot lock things"));
  var enc=new TextEncoder();
  return S.importKey("raw",enc.encode(phrase),{name:"PBKDF2"},false,["deriveKey"])
    .then(function(base){
      return S.deriveKey({name:"PBKDF2",salt:salt,iterations:210000,hash:"SHA-256"},base,
        {name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
    });
}
function lockUp(text,key){
  var iv=randBytes(12), enc=new TextEncoder();
  return subtle().encrypt({name:"AES-GCM",iv:iv},key,enc.encode(text))
    .then(function(ct){ return {cipher:b64(ct),iv:b64(iv)}; });
}
function unlock(cipher,iv,key){
  return subtle().decrypt({name:"AES-GCM",iv:unb64(iv)},key,unb64(cipher))
    .then(function(pt){ return new TextDecoder().decode(pt); });
}

/* setting, or entering, the phrase */
function openVault(phrase){
  if(!phrase||phrase.length<8) return Promise.reject(new Error("Use at least eight characters."));
  return vaultRow().then(function(row){
    vaultSalt=row&&row.salt?unb64(row.salt):randBytes(16);
    return makeKey(phrase,vaultSalt).then(function(k){
      vaultKey=k;
      if(!row) return {fresh:true};
      /* prove the phrase before trusting it */
      return unlock(row.cipher,row.iv,k).then(function(){ return {fresh:false,row:row}; })
        .catch(function(){ vaultKey=null; throw new Error("That phrase doesn't open this vault."); });
    });
  });
}
function vaultLocked(){ return !vaultKey; }

function restHeaders(tok){
  return {"Content-Type":"application/json",apikey:DW_CONFIG.supabaseKey,
    Authorization:"Bearer "+tok,Prefer:"resolution=merge-duplicates,return=representation"};
}
function vaultRow(){
  return freshToken().then(function(tok){
    if(!tok) return null;
    return fetch(DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/vault?select=*",{headers:restHeaders(tok)})
      .then(function(r){ return r.ok?r.json():[]; })
      .then(function(rows){ return (rows&&rows[0])||null; });
  });
}

/* what is kept: the dreamscape itself, and nothing about this device */
function dreamscapeText(){
  var keep={};
  ["objects","characters","sessions","transcript","dreamer","passages","realms","hoods","grid","townGrid",
   "here","session","blocks","streets","land","research","insideSlots","lastId","lastAny","lastLot"].forEach(function(k){
    if(store[k]!==undefined) keep[k]=store[k];
  });
  return JSON.stringify({v:1,at:Date.now(),store:keep});
}
function keepToAccount(quiet){
  if(!signedIn()) return Promise.reject(new Error("Sign in first."));
  if(vaultLocked()) return Promise.reject(new Error("Unlock the vault with your phrase first."));
  if(vaultBusy) return Promise.resolve(null);
  vaultBusy=true;
  var text=dreamscapeText();
  return lockUp(text,vaultKey).then(function(sealed){
    return freshToken().then(function(tok){
      return fetch(DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/vault",{
        method:"POST",headers:restHeaders(tok),
        body:JSON.stringify({user_id:session.user.id,cipher:sealed.cipher,iv:sealed.iv,
          salt:b64(vaultSalt),bytes:text.length,updated_at:new Date().toISOString(),version:1})
      });
    });
  }).then(function(r){
    vaultBusy=false;
    if(!r.ok) throw new Error("It didn't go up. Try again in a moment.");
    lastSaved=Date.now();
    try{ localStorage.setItem(SYNCKEY,String(lastSaved)); }catch(e){}
    if(!quiet) setStatus("<b>Kept to your account.</b> Locked on this device before it left it.");
    syncStatus();
    return true;
  }).catch(function(e){ vaultBusy=false; if(!quiet) setStatus(esc(e.message)); throw e; });
}
/* bringing it down to whatever device you are on */
function bringToThisDevice(){
  if(!signedIn()) return Promise.reject(new Error("Sign in first."));
  if(vaultLocked()) return Promise.reject(new Error("Unlock the vault with your phrase first."));
  return vaultRow().then(function(row){
    if(!row) throw new Error("There is nothing kept to this account yet.");
    return unlock(row.cipher,row.iv,vaultKey).then(function(text){
      var got=JSON.parse(text);
      if(!got||!got.store) throw new Error("What came down could not be read.");
      Object.keys(got.store).forEach(function(k){ store[k]=got.store[k]; });
      save();
      if(typeof rebuildAll==="function") rebuildAll();
      else if(typeof rebuildWorld==="function") rebuildWorld();
      setStatus("<b>Your dreamscape is on this device.</b> "+(store.objects||[]).length+" things standing.");
      syncStatus();
      return true;
    });
  });
}
/* after a night is written down, keep it — quietly */
function syncAfterNight(){
  if(!syncOn()||!signedIn()||vaultLocked()) return;
  keepToAccount(true).catch(function(){});
}

/* ---- what the dreamer sees ---- */
function syncStatus(){
  var el=document.getElementById("sync-state"); if(!el) return;
  if(!signedIn()){ el.textContent="Sign in above to keep your dreamscape to your account."; return; }
  var when=lastSaved||(function(){ try{ return +localStorage.getItem(SYNCKEY)||0; }catch(e){ return 0; } })();
  el.innerHTML=(vaultLocked()?"<b>Locked.</b> Enter your phrase to keep or fetch it. ":"<b>Unlocked on this device.</b> ")+
    (when?("Last kept "+new Date(when).toLocaleString()+"."):"Nothing kept yet.");
}
function initSync(){
  var b;
  if((b=document.getElementById("sync-unlock"))) b.onclick=function(){
    var ph=document.getElementById("sync-phrase").value;
    setStatus("Working on it\u2026");
    openVault(ph).then(function(res){
      document.getElementById("sync-phrase").value="";
      setStatus(res.fresh?"<b>Vault ready.</b> Nothing kept to this account yet \u2014 press Keep it now."
                        :"<b>Vault open.</b> You can keep this dreamscape, or bring down the one on your account.");
      syncStatus();
    }).catch(function(e){ setStatus(esc(e.message)); });
  };
  if((b=document.getElementById("sync-save"))) b.onclick=function(){ keepToAccount(false).catch(function(){}); };
  if((b=document.getElementById("sync-fetch"))) b.onclick=function(){
    if(!confirm("Bring down the dreamscape kept to your account? What is on this device will be replaced.")) return;
    bringToThisDevice().catch(function(e){ setStatus(esc(e.message)); });
  };
  if((b=document.getElementById("sync-on"))) b.onchange=function(){
    var c=cfg(); c.sync=(b.value==="on"); setCfg(c);
    setStatus(c.sync?"Your dreamscape will be kept to your account after each night."
                    :"Kept on this device only.");
  };
  var s=document.getElementById("sync-on"); if(s) s.value=syncOn()?"on":"off";
  syncStatus();
}

