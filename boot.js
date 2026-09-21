/* Dream Walker's Atlas — boot.js
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
  initWorld(); initControls(); initSpeech(); wire(); wirePlot();
  if(load()){
    committed=store.transcript||"";
    store.streets=[];
    store.blocks={};
    if(!store.dreamer) store.dreamer={name:"",about:"",practice:"",notes:"",abilities:[]};
    if(!store.dreamer.abilities) store.dreamer.abilities=[];
    if(!store.passages) store.passages=[];
    if(!store.research) store.research={consent:false,since:null};
    store.objects.forEach(function(o){ if(!o.nights) o.nights=[0]; });
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
      if(!KIT[s.archetype]) s.archetype="house";
      ensureStreets(Math.round(s.x/PITCH),Math.round(s.z/PITCH));
      addMesh(s);
    });
    renderTranscript(committed,"");
  }
  store.characters.forEach(assignLife);
  populate();
  document.getElementById("tscrub").value=Math.round(dreamHour()*60);
  paintScrub();
  tickClock(true);
  updateCount();
  if(!store.objects.length) setStatus("Press the circle and talk, or type below.");
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

