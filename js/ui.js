/* SomnuMatrix — ui.js
   the interface: transcript, panels, import and export
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   14. UI
   ============================================================ */
function renderTranscript(fin,interim){
  var el=document.getElementById("transcript");
  el.innerHTML=esc(fin)+(interim?'<span class="interim">'+esc(interim)+"</span>":"");
  el.scrollTop=el.scrollHeight;
}
function esc(s){ return String(s).replace(/[&<>"']/g,function(c){
  return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
function setStatus(h){ document.getElementById("status").innerHTML=h; }
function updateCount(){
  var n=store.objects.length;
  document.getElementById("count").textContent=n?n+(n===1?" form":" forms"):"empty";
}

/* --- typing: the box never clears itself and never sends half a thought --- */
var draftScanned=0;
function onDraftInput(){
  var ta=document.getElementById("freetext");
  ta.style.height="auto";
  ta.style.height=Math.min(ta.scrollHeight,window.innerHeight*0.26)+"px";
  var v=ta.value;
  if(v.length<draftScanned){ draftScanned=v.length; return; }
  var upto=v.lastIndexOf(" ");
  if(upto<=draftScanned) return;
  var fresh=v.slice(draftScanned,upto);
  draftScanned=upto;
  var n=scanText(fresh);
  if(n) setStatus("<b>"+n+" form"+(n>1?"s":"")+" took shape</b>");
}
function commitDraft(){
  var ta=document.getElementById("freetext");
  var v=ta.value.trim();
  if(!v){ setStatus("Nothing to commit."); return; }
  var tail=v.slice(draftScanned).trim();
  if(tail) scanText(tail);
  feedContext(v);
  scanAbilities(v);
  committed+=v+" ";
  store.transcript=committed;
  ta.value=""; ta.style.height="auto";
  draftScanned=0;
  renderTranscript(committed,"");
  populate();
  scheduleParse(400);
  save();
  setStatus("Committed.");
}

/* ---- reading a dreamscape back in ---- */
function importJSON(file){
  var r=new FileReader();
  r.onerror=function(){ setStatus("<i>Could not read that file.</i>"); };
  r.onload=function(){
    var d;
    try{ d=JSON.parse(r.result); }
    catch(e){ setStatus("<i>That is not a dreamscape file.</i>"); return; }
    if(!d||!d.objects||!Array.isArray(d.objects)){
      setStatus("<i>That file has no dreamscape in it.</i>"); return;
    }
    var mine=store.objects.filter(function(o){ return !o.filler; }).length;
    var theirs=d.objects.filter(function(o){ return !o.filler; }).length;
    var merge=false;
    if(mine){
      merge=confirm("You already have "+mine+" form"+(mine===1?"":"s")+" standing.\n\n"+
        "OK to add the "+theirs+" incoming form"+(theirs===1?"":"s")+" alongside them.\n"+
        "Cancel to replace everything with the file.");
    }
    if(merge) mergeWorld(d); else replaceWorld(d);
  };
  r.readAsText(file);
}

function clearScene(){
  Object.keys(meshes).forEach(function(k){ scene.remove(meshes[k]); });
  meshes={};
  drawnEdges={};
  for(var i=scene.children.length-1;i>=0;i--){
    var c=scene.children[i];
    if(c.isMesh&&c.userData&&c.userData.street)
      scene.remove(c);
  }
}

function rebuild(){
  store.blocks={};
  store.streets=[];
  store.objects.forEach(function(o){
    if(!KIT[o.archetype]) o.archetype="house";
    ensureStreets(Math.round(o.x/PITCH),Math.round(o.z/PITCH));
    addMesh(o);
  });
  store.characters.forEach(assignLife);
  populate();
  tickClock(true);
  updateCount();
  save();
}

function replaceWorld(d){
  clearScene();
  store=Object.assign(blank(),d);
  store.objects=store.objects.filter(function(o){ return !o.filler; });
  store.characters=(store.characters||[]).filter(function(c){ return c.primary!==false; });
  store.blocks={};
  if(!store.lots) store.lots={};
  committed=store.transcript||"";
  draftScanned=0;
  document.getElementById("freetext").value="";
  renderTranscript(committed,"");
  rebuild();
  setStatus("<b>Dreamscape restored \u2014 "+store.objects.length+" forms.</b>");
}

/* an incoming world is shifted clear of the one already standing */
function mergeWorld(d){
  var maxB=0;
  store.objects.forEach(function(o){
    maxB=Math.max(maxB,Math.abs(Math.round(o.x/PITCH)),Math.abs(Math.round(o.z/PITCH)));
  });
  var shift=(maxB+2)*PITCH;
  var idMap={};
  (d.objects||[]).filter(function(o){ return !o.filler; }).forEach(function(o){
    var old=o.id; o.id=uid(); idMap[old]=o.id;
    o.x+=shift;
    if(o.bx!==undefined&&o.bx!==null) o.bx+=(maxB+2);
    if(o.lot!==undefined&&o.lot!==null&&o.bx!==undefined&&o.bx!==null)
      takeLot(o.bx,o.bz,o.lot,o.id);
    store.objects.push(o);
    addMesh(o);
  });
  (d.characters||[]).filter(function(c){ return c.primary!==false; }).forEach(function(c){
    c.id=uid();
    if(c.objId&&idMap[c.objId]) c.objId=idMap[c.objId]; else c.objId=null;
    if(c.home&&idMap[c.home]) c.home=idMap[c.home]; else c.home=null;
    if(c.work&&idMap[c.work]) c.work=idMap[c.work]; else c.work=null;
    c.x+=shift;
    if(c.anchor) c.anchor.x+=shift;
    store.characters.push(c);
    var sp=c.objId?specById(c.objId):null;
    if(sp) sp.charId=c.id;
  });
  rebuild();
  setStatus("<b>Merged \u2014 "+store.objects.length+" forms now standing.</b>");
}

/* a clean slate: every place, figure and sealed dream goes. who you are, your
   settings, and your decisions about the books are kept. */
function cleanSlate(){
  var n=store.objects.filter(function(o){ return !o.filler; }).length;
  var f=store.characters.filter(function(c){ return c.primary!==false; }).length;
  var d=store.sessions.length;
  if(!confirm("Start from a clean slate?\n\nThis erases "+n+" place"+(n===1?"":"s")+", "+f+" figure"+(f===1?"":"s")+
     " and "+d+" sealed dream"+(d===1?"":"s")+" from this browser. It cannot be undone.\n\n"+
     "Who is dreaming, your settings, and your choices about the books are kept.")) return;
  if(n||d){
    if(confirm("Save a copy of everything first?\n\nOK saves a file, then erases.\nCancel erases without saving.")) exportJSON();
  }
  var keep={dreamer:store.dreamer,research:store.research,released:store.released};
  if(typeof setPlot==="function"&&plotOn) setPlot(false);
  if(typeof clearView==="function") clearView();
  clearScene();
  store=blank();
  if(keep.dreamer) store.dreamer=keep.dreamer;
  if(keep.research) store.research=keep.research;
  if(keep.released) store.released=keep.released;
  realmGroundsAll(); viewAt=null;
  committed=""; draftScanned=0;
  document.getElementById("freetext").value="";
  renderTranscript("","");
  orb.tx=0; orb.tz=0;
  save(); updateCount(); tickClock(true);
  setStatus("Clean slate. Nothing is standing yet.");
}

function exportJSON(){
  var blob=new Blob([JSON.stringify(store,null,2)],{type:"application/json"});
  var a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="dreamscape-"+new Date().toISOString().slice(0,10)+".json";
  a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); },4000);
}
function newDream(){
  var text=store.transcript.trim();
  if(!text){ setStatus("Nothing recorded tonight yet."); return; }
  if(!confirm("Seal this dream and begin another?\n\nWhat you recorded tonight is filed exactly as written and can never be altered. The dreamscape and everyone in it stays.")) return;
  closeNight(null,text,false);
  document.getElementById("freetext").value="";
  setStatus("Sealed. Night "+store.session+" \u2014 everything you built is still standing.");
}

function wire(){
  var $=function(id){ return document.getElementById(id); };
  $("mic").addEventListener("click",toggleMic);
  $("commitbtn").addEventListener("click",commitDraft);
  $("walkbtn").addEventListener("click",function(){ setWalk(!walkMode); });
  $("newbtn").addEventListener("click",newDream);
  $("exportbtn").addEventListener("click",exportJSON);
  $("importbtn").addEventListener("click",function(){ $("importfile").click(); });
  $("importfile").addEventListener("change",function(){
    if(this.files&&this.files[0]) importJSON(this.files[0]);
    this.value="";
  });
  $("setbtn").addEventListener("click",openPanel);
  $("closebtn").addEventListener("click",function(){ $("panel").classList.remove("open"); });
  $("savebtn").addEventListener("click",savePanel);
  $("wipebtn").addEventListener("click",function(){
    if(confirm("Erase every dream stored in this browser?")){
      try{ localStorage.removeItem(KEY); }catch(e){} location.reload();
    }
  });
  $("tscrub").addEventListener("input",function(){
    scrubOffset=parseInt(this.value,10)/60;
    tickClock(true);
  });
  $("tnow").addEventListener("click",function(){
    scrubOffset=null;
    document.getElementById("tscrub").value=Math.round(dreamHour()*60);
    tickClock(true);
  });
  $("g-again").addEventListener("click",greetAgain);
  $("g-close").addEventListener("click",closeGreet);
  $("g-know").addEventListener("click",function(){
    $("g-claim").classList.add("open");
    $("g-know").style.display="none";
    $("g-confirm").style.display="";
    $("g-name").focus();
  });
  $("g-confirm").addEventListener("click",claimStranger);
  $("g-name").addEventListener("keydown",function(e){
    if(e.key==="Enter"){ e.preventDefault(); claimStranger(); }
  });
  $("journalbtn").addEventListener("click",openJournal);
  $("interpbtn").addEventListener("click",function(){ openInterp(null); });
  $("x-close").addEventListener("click",closeInterp);
  $("j-close").addEventListener("click",closeJournal);
  $("viewing-clear").addEventListener("click",clearView);
  $("j-consent").addEventListener("change",function(){
    var rs=research();
    rs.consent=this.checked;
    rs.since=this.checked?new Date().toISOString().slice(0,10):null;
    save();
    $("j-rstate").textContent=rs.consent?("on since "+rs.since):"off";
    if(jSel!==null) renderJournalDetail(jSel);
  });
  $("i-link").addEventListener("change",function(){
    if(!picked||!this.value) return;
    var other=specById(this.value);
    if(!other) return;
    if(!confirm("Treat this as the same "+picked.archetype+" as "+placeName(other)+"?\n\nIt becomes one place that has appeared on several nights.")){ this.value=""; return; }
    var keepId=other.id;
    linkPlaces(keepId,picked.id);
    closeInspect();
    setStatus("<b>One place, "+specById(keepId).nights.length+" nights.</b>");
  });
  $("storybtn").addEventListener("click",openStory);
  $("story-close").addEventListener("click",closeStory);
  $("story-render").addEventListener("click",renderStory);
  $("story-text").addEventListener("input",updateStoryCount);
  $("selfbtn").addEventListener("click",openSelf);
  $("self-close").addEventListener("click",closeSelf);
  $("self-save").addEventListener("click",saveSelf);
  $("self-ability-add").addEventListener("keydown",function(e){
    if(e.key!=="Enter") return;
    e.preventDefault();
    var v=this.value.trim();
    if(!v) return;
    dreamer().abilities.push({name:v,nights:[store.session],src:"added"});
    this.value=""; save(); renderAbilities();
  });
  $("slatebtn").addEventListener("click",cleanSlate);
  $("i-floors").addEventListener("change",function(){
    if(!picked) return;
    var v=parseInt(this.value,10);
    if(!LEVELS[picked.archetype]){ this.value=""; return; }
    picked.attrs.lv=Math.max(1,Math.min(120,isNaN(v)?LEVELS[picked.archetype]:v));
    touchPicked();
  });
  $("rosterbtn").addEventListener("click",openRoster);
  $("r-close").addEventListener("click",function(){ $("roster").classList.remove("open"); });
  $("t-send").addEventListener("click",sendTalk);
  $("t-close").addEventListener("click",closeTalk);
  $("t-build").addEventListener("click",buildFromReply);
  $("t-say").addEventListener("keydown",function(e){
    if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendTalk(); }
  });
  $("soundbtn").addEventListener("click",function(){
    if(audio.on){ stopAudio(); this.textContent="Sound off"; this.classList.remove("on"); }
    else{ startAudio(); this.textContent="Sound on"; this.classList.add("on"); }
  });

  var ta=$("freetext");
  ta.addEventListener("input",onDraftInput);
  ta.addEventListener("keydown",function(e){
    if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); commitDraft(); }
  });

  $("density").addEventListener("input",function(){
    setFog(parseInt(this.value,10));
    var c=cfg(); c.density=parseInt(this.value,10); setCfg(c);
  });

  /* inspect */
  $("i-name-in").addEventListener("input",function(){ if(picked){ picked.name=this.value||null; $("i-name").textContent=placeName(picked); save(); } });
  $("i-label").addEventListener("input",function(){ if(picked){ picked.label=this.value; $("i-name").textContent=placeName(picked); save(); } });
  $("i-sign").addEventListener("change",function(){ if(picked){ picked.sign=this.value||null; touchPicked(); } });
  $("i-scale").addEventListener("input",function(){ if(picked){ picked.attrs.s=parseFloat(this.value); touchPicked(); } });
  $("i-height").addEventListener("input",function(){ if(picked){ picked.attrs.h=parseFloat(this.value); touchPicked(); } });
  $("i-solid").addEventListener("click",function(){
    if(!picked) return;
    picked.solid=!picked.solid;
    /* solidifying something the town made keeps it for good, instead of it being swept away */
    if(picked.solid&&picked.filler){
      picked.filler=false; picked.placed=true; picked.nights=[store.session];
      var c=charOf(picked); if(c){ c.primary=true; c.src=c.src||{}; c.src.name=c.src.name||"chosen"; }
      setStatus("<b>"+esc(placeName(picked))+"</b> is yours now, and will stay.");
    }
    touchPicked();
  });
  $("i-del").addEventListener("click",function(){ if(picked){ removeSpec(picked); closeInspect(); updateCount(); save(); } });

  wireLand();
}

/* the slider's track is a strip of the day itself, midnight to midnight */
function paintScrub(){
  var stops=[];
  for(var h=0;h<=24;h+=1){
    var c=skyAt(Math.min(h,23.99)).low;
    stops.push("#"+("000000"+c.toString(16)).slice(-6)+" "+(h/24*100).toFixed(1)+"%");
  }
  document.getElementById("tscrub").style.background="linear-gradient(90deg,"+stops.join(",")+")";
}

function openPanel(){
  var c=cfg(),$=function(i){return document.getElementById(i);};
  $("mode").value=c.mode||"off"; $("key").value=c.key||"";
  $("proxy").value=c.proxy||""; $("model").value=c.model||LLM_MODEL;
  $("density").value=c.density||26; $("err").textContent="";
  $("counted").checked=c.counted!==false;
  $("nm-on").value=c.nightmares===false?"off":"on"; $("nm-catch").value=c.nightmareCatch||"wake";
  $("padmode").value=c.pad||"automatic"; $("skies").value=c.skies===false?"off":"on";
  $("solidall").value=c.solidAll===false?"half":"solid";
  renderHeld();
  $("panel").classList.add("open"); var gsel=document.getElementById("gfx"); if(gsel) gsel.value=cfg().gfx||"auto"; var isel=document.getElementById("ink"); if(isel) isel.value=cfg().ink||"off"; var lsel=document.getElementById("lite"); if(lsel) lsel.value=cfg().lite||"auto";
}
function savePanel(){
  var $=function(i){return document.getElementById(i);};
  var was=cfg().counted!==false;
  /* start from the saved config and only change what this panel owns —
     building a bare object here once silently wiped out flags this panel
     never shows (somnucor membership, sync on/off), un-joining Somnucor
     the moment anybody opened Settings and hit Save for an unrelated reason */
  var c=Object.assign({},cfg(),{mode:$("mode").value,key:$("key").value.trim(),proxy:$("proxy").value.trim(),
         model:$("model").value.trim()||LLM_MODEL,density:parseInt($("density").value,10),
         counted:$("counted").checked,nightmares:$("nm-on").value!=="off",nightmareCatch:$("nm-catch").value,pad:$("padmode").value,skies:$("skies").value!=="off",solidAll:$("solidall").value!=="half"});
  if(was&&!c.counted) forgetDevice();
  if(!was&&c.counted) setTimeout(checkin,50);
  if(c.mode==="direct"&&!c.key){ $("err").textContent="Direct mode needs a key."; return; }
  if(c.mode==="direct"&&!/^gsk_/.test(c.key)){ $("err").textContent="That doesn\u2019t look like a Groq key \u2014 they begin gsk_."; return; }
  if(c.mode==="proxy"&&!c.proxy){ $("err").textContent="Proxy mode needs an endpoint URL."; return; }
  setCfg(c); setFog(c.density);
  $("panel").classList.remove("open"); setStatus("Saved.");
}



/* what this device can do — for working out why something won't run on a phone */
function deviceReport(){
  var info="", ver="";
  try{
    var c=renderer&&renderer.getContext?renderer.getContext():null;
    if(c){ ver=c.getParameter(c.VERSION);
      var dbg=c.getExtension("WEBGL_debug_renderer_info");
      info=dbg?c.getParameter(dbg.UNMASKED_RENDERER_WEBGL):"(hidden by the browser)"; }
    else { var g=document.createElement("canvas").getContext("webgl"); info=g?"a context can be made, but the app has none":"no WebGL at all"; }
  }catch(e){ info="could not be read: "+e.message; }
  var L=[];
  L.push("screen: "+innerWidth+" x "+innerHeight+" at "+(window.devicePixelRatio||1)+"x");
  L.push("touch detected: "+(isTouch?"yes":"no")+"    coarse pointer: "+((typeof matchMedia==="function"&&matchMedia("(pointer:coarse)").matches)?"yes":"no"));
  L.push("touch controls started: "+(touchRig?"yes":"no")+"    on-screen pad: "+padMode()+(padWanted()?" (showing)":" (hidden)"));
  L.push("graphics: "+(info||"unknown"));
  L.push("webgl version: "+(ver||"unknown"));
  L.push("things standing: "+store.objects.length+"    figures: "+store.characters.length);
  L.push("app version: "+(typeof APP_VERSION!=="undefined"?APP_VERSION:"?"));
  L.push("browser: "+navigator.userAgent);
  return L.join("\n");
}
(function(){
  var b=typeof document!=="undefined"&&document.getElementById?document.getElementById("diagbtn"):null;
  if(!b) return;
  b.onclick=function(){
    var d=document.getElementById("diag");
    d.textContent=deviceReport();
    d.style.display=d.style.display==="none"?"block":"none";
  };
})();

