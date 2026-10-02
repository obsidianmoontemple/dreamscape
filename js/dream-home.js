/* SomnuMatrix — dream-home.js
   whatever you dream, say or have built while you stand in Somnucor goes to
   your own dreamscape, never into the shared city */
"use strict";
function inSharedWorld(){
  var r=(typeof realmById==="function"&&store.here)?realmById(store.here):null;
  return !!(r&&(r.kind==="somnucor"||r.kind==="hall"));
}
function intoOwnDream(fn,name){
  return function(){
    if(!inSharedWorld()) return fn.apply(this,arguments);
    /* standing on ground you hold: what you say is built there, in the city,
       for everyone — and your dream keeps a copy as it always would */
    if(name==="scanText"&&typeof myLotHere==="function"&&typeof arguments[0]==="string"){
      var L=myLotHere(); if(L) lotBuildFromText(arguments[0],L);
    }
    var was=store.here, out;
    beHere(0);
    try{ out=fn.apply(this,arguments); }
    finally{ beHere(was); }
    return out;
  };
}
/* choosing somewhere else to go means starting there, not where you left off */
/* words for things defined after the vocabulary was first gathered (the
   city's own kit, the Warrens' clutter, the trams and cars) are learnt too */
(function(){
  if(typeof MORE_VOCAB==="undefined"||typeof PHRASES==="undefined") return;
  var have={}; PHRASES.forEach(function(p){ have[p[0]]=1; });
  var added=0;
  Object.keys(MORE_VOCAB).forEach(function(k){
    if(!KIT[k]) return;
    (MORE_VOCAB[k]||[]).forEach(function(w){
      if(have[w]) return; have[w]=1;
      (VOCAB[k]=VOCAB[k]||[]).push(w); PHRASES.push([w,k]); added++;
    });
  });
  if(added) PHRASES.sort(function(a,b){ return b[0].length-a[0].length; });
})();
["visitRealm","toSomnucor","toHall","newDream"].forEach(function(n){
  if(typeof window[n]!=="function") return;
  var f=window[n]; window[n]=function(){ walkResume=null; if(typeof mallLeave==="function"&&MALL.on) mallLeave(); return f.apply(this,arguments); };
});
["scanText","populate","reconcile","buildFromReply"].forEach(function(n){
  if(typeof window[n]==="function") window[n]=intoOwnDream(window[n],n);
});
