/* SomnuMatrix — boot.js
   starting it all up — loads last
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   15. BOOT
   ============================================================ */
function boot(){
  if(typeof THREE==="undefined"){
    document.getElementById("status").innerHTML="<i>three.js did not load. Check the connection and reload.</i>";
    return;
  }
  initWorld(); initControls(); initSpeech(); wire(); wirePlot(); wireCompass(); initTouch();
  loadCloudConfig(); checkin(); initAccount(); initSync(); initDoors(); initVisit(); initCity(); initShop(); initJoin(); initGround(); initMarket(); initBusiness();
  /* a grown archetype from an earlier night is still just a name in this
     object's saved record — the shape it actually built to only lives in
     KIT, in memory, on whichever browser grew it. asking the shared
     catalogue for it takes a real round trip, so boot never waits on it:
     it renders anything not yet in KIT as a plain house for now (the very
     same fallback build() already falls back to on its own, below), keeps
     a note of which objects that was, and quietly redraws the true shape
     over them the moment the catalogue answers — rather than delay
     everything else boot does, or, worse, overwrite the object's own
     saved archetype with "house" for good before the answer even arrives. */
  var awaitingCustom=[];
  if(load()){
    committed=store.transcript||"";
    store.streets=[];
    store.blocks={};
    if(!store.dreamer) store.dreamer={name:"",about:"",practice:"",notes:"",abilities:[]};
    if(!store.dreamer.abilities) store.dreamer.abilities=[];
    if(!store.passages) store.passages=[];
    if(!store.research) store.research={consent:false,since:null};
    store.objects.forEach(function(o){ if(!o.nights) o.nights=[0]; });
    /* worlds reached before they had scenery of their own are dressed now */
    store.dressLater=true;
    store.peopleLater=true;
    (store.sessions||[]).forEach(function(r){
      if(r.original===undefined){
        r.original=r.transcript||"";
        r.sealedAt=(r.date||new Date().toISOString().slice(0,10))+"T00:00:00.000Z";
        r.title=r.title||("Night "+r.n);
        r.versions=[]; r.outcomes=[]; r.fingerprint=null;
        (function(rec){ seal(rec.original).then(function(fp){ rec.fingerprint=fp; save(); }); })(r);
      }
      if(!r.versions) r.versions=[];
      if(!r.outcomes) r.outcomes=[];
    });
    store.characters.forEach(function(c){
      if(!c.aka) c.aka=[normName(c.name)]; if(!c.log) c.log=[];
      if(c.primary===undefined) c.primary=true;
      if(!c.src) c.src={};
      if(c.primary && c.src.home!=="stated" && c.src.home!=="parsed" && c.src.home!=="filled"){
        c.home=c.home||null; c.work=c.work||null; c.routine=c.routine||null;
      }
    });
    store.objects.forEach(function(o){
      if(!o.addr) o.addr=addressOf(Math.round(o.x/PITCH),Math.round(o.z/PITCH),0);
      if(!o.name) o.name=nameFor(o,o.addr);
    });
    store.objects.forEach(function(s){
      if(!KIT[s.archetype]) awaitingCustom.push(s);   /* build() itself falls back to a house meanwhile */
      ensureStreets(Math.round(s.x/PITCH),Math.round(s.z/PITCH));
      addMesh(s);
    });
    renderTranscript(committed,"");
  }
  /* Somnucor is opt-in: nothing of it exists until the dreamer says yes */
  if(typeof joinedSomnucor==="function"&&joinedSomnucor()){
    if(typeof buildSomnucorCity==="function") buildSomnucorCity();
    if(typeof buildHall==="function") buildHall();
    if(typeof buildTempleRow==="function") buildTempleRow();
    if(typeof buildHousing==="function") buildHousing();
    if(typeof buildYard==="function") buildYard();
    if(typeof buildGroundWorks==="function") buildGroundWorks();
  }
  buildTerrain(); applyShadows(); realmGroundsAll();
  store.characters.forEach(assignLife);
  populate();
  document.getElementById("tscrub").value=Math.round(dreamHour()*60);
  paintScrub();
  tickClock(true);
  updateCount();
  if(!store.objects.length) setStatus("Press the circle and talk, or type below.");
  if(awaitingCustom.length&&typeof loadCustomArchetypes==="function"){
    loadCustomArchetypes().then(function(){
      awaitingCustom.forEach(function(s){ if(KIT[s.archetype]) refresh(s); });
    });
  }
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot);
else boot();

/* index.html?test=1 runs the regression suite in this browser, on its own storage */
if(DW_TESTING && typeof document!=="undefined" && typeof window!=="undefined" && !window.__node){
  window.addEventListener("load",function(){
    ["tests/harness.js","tests/cases.js"].reduce(function(p,src){
      return p.then(function(){ return new Promise(function(res,rej){
        var sc=document.createElement("script"); sc.src=src; sc.onload=res; sc.onerror=rej; document.body.appendChild(sc); }); });
    },Promise.resolve()).then(function(){
      T.run(function(results){
        var bad=results.filter(function(r){ return !r.pass; });
        var box=document.createElement("div");
        box.style.cssText="position:fixed;z-index:99;inset:40px;overflow:auto;background:#0B0D13;border:1px solid #333;padding:22px;font:13px/1.6 ui-monospace,Menlo,monospace;color:#C9BEA8";
        box.innerHTML="<b style='font:20px Georgia,serif'>"+(results.length-bad.length)+" of "+results.length+" passed</b><br><br>"+
          results.map(function(r){ return (r.pass?"<span style='color:#7C93B8'>pass</span>  ":"<span style='color:#B8724A'>FAIL</span>  ")+
            r.name.replace(/</g,"&lt;")+(r.pass?"":"<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+r.err.replace(/</g,"&lt;")); }).join("<br>")+
          "<br><br><i>These ran on separate test storage. Your dreamscape was not touched.</i>";
        document.body.appendChild(box);
      });
    });
  });
}



/* everything drawn again, after a dreamscape arrives from an account */
function rebuildAll(){
  Object.keys(meshes).forEach(function(id){ scene.remove(meshes[id]); delete meshes[id]; });
  store.streets=[]; store.blocks={};
  var awaitingCustom=[];
  store.objects.forEach(function(s){
    if(!KIT[s.archetype]) awaitingCustom.push(s);   /* build() itself falls back to a house meanwhile */
    if(!s.addr) s.addr=addressOf(Math.round(s.x/PITCH),Math.round(s.z/PITCH),0);
    if(!s.name) s.name=nameFor(s,s.addr);
    ensureStreets(Math.round(s.x/PITCH),Math.round(s.z/PITCH));
    addMesh(s);
  });
  store.characters.forEach(assignLife);
  buildTerrain(); applyShadows(); realmGroundsAll();
  populate(); tickClock(true); updateCount();
  renderTranscript(store.transcript||"","");
  if(awaitingCustom.length&&typeof loadCustomArchetypes==="function"){
    loadCustomArchetypes().then(function(){
      awaitingCustom.forEach(function(s){ if(KIT[s.archetype]) refresh(s); });
    });
  }
}

