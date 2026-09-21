/* Dream Walker's Atlas — journal.js
   sealing, outcomes, research summaries and the journal
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   12a. THE SEALED RECORD — the first telling is never changed
   ============================================================ */
var viewNight=null;

/* a fingerprint of the text as it was first written. if anything is ever
   altered, the fingerprint will no longer match. */
function seal(text){
  var enc=new TextEncoder().encode(text);
  if(window.crypto&&crypto.subtle&&crypto.subtle.digest){
    return crypto.subtle.digest("SHA-256",enc).then(function(buf){
      return {algo:"SHA-256",hex:Array.prototype.map.call(new Uint8Array(buf),function(b){
        return ("0"+b.toString(16)).slice(-2); }).join("")};
    });
  }
  var h=2166136261;
  for(var i=0;i<enc.length;i++){ h^=enc[i]; h=Math.imul(h,16777619); }
  return Promise.resolve({algo:"FNV-1a (no secure context)",hex:(h>>>0).toString(16)});
}

function nightRecord(n){
  for(var i=0;i<store.sessions.length;i++) if(store.sessions[i].n===n) return store.sessions[i];
  return null;
}

/* every way of finishing a dream goes through here, so a night is only ever filed once */
function closeNight(title,text,full){
  var n=store.session;
  if(nightRecord(n)){ return null; }
  var at=new Date();
  var rec={n:n,title:title||("Night "+n),date:at.toISOString().slice(0,10),
           sealedAt:at.toISOString(),original:text,versions:[],
           lucidity:store.lucidity,emotions:store.emotions.slice(),
           full:!!full,outcomes:[],fingerprint:null};
  store.sessions.push(rec);
  seal(text).then(function(fp){ rec.fingerprint=fp; save(); });
  store.session++;
  store.transcript=""; store.emotions=[]; store.lucidity=0;
  committed=""; draftScanned=0;
  store.grid.lot=0;
  store.grid.bx+=(Math.random()<0.5?1:-1);
  renderTranscript("","");
  save();
  return rec;
}

/* an amendment is kept beside the original, never over it */
function amendNight(n,text){
  var r=nightRecord(n);
  if(!r||!text.trim()||text===currentText(r)) return false;
  r.versions.push({at:new Date().toISOString(),text:text});
  save();
  return true;
}
function currentText(r){ return r.versions.length?r.versions[r.versions.length-1].text:r.original; }

/* checking the fingerprint against the original, now */
function verifyNight(n){
  var r=nightRecord(n);
  if(!r||!r.fingerprint) return Promise.resolve(null);
  return seal(r.original).then(function(fp){ return fp.hex===r.fingerprint.hex; });
}

/* ---- what came of it: hits and misses both ---- */
function recordOutcome(n,kind,note,eventDate){
  var r=nightRecord(n);
  if(!r) return;
  r.outcomes.push({kind:kind,note:note||"",eventDate:eventDate||null,
                   recordedAt:new Date().toISOString()});
  save();
}
function outcomeTally(){
  var t={hit:0,partial:0,miss:0,unchecked:0};
  store.sessions.forEach(function(r){
    if(!r.outcomes||!r.outcomes.length){ t.unchecked++; return; }
    var last=r.outcomes[r.outcomes.length-1].kind;
    t[last]=(t[last]||0)+1;
  });
  return t;
}

/* how common each thing is across all your dreams — a match on something
   you dream every night means far less than a match on something rare */
function baseRates(){
  var total=store.sessions.length||1, count={};
  store.objects.forEach(function(o){
    if(o.filler||!o.nights) return;
    var seen={};
    o.nights.forEach(function(n){ if(n<store.session) seen[n]=1; });
    var k=o.archetype;
    if(!count[k]) count[k]={};
    for(var n in seen) count[k][n]=1;
  });
  var out=[];
  for(var k in count){
    var nights=Object.keys(count[k]).length;
    out.push({archetype:k,nights:nights,rate:nights/total});
  }
  out.sort(function(a,b){ return b.rate-a.rate; });
  return out;
}

/* ============================================================
   12d. RESEARCH — only an abstract summary, and only if agreed.
        this is a whitelist: anything not named here never leaves.
   ============================================================ */
var EVENTS=[
 ["fire",["fire","burning","flames","smoke","blaze","on fire"]],
 ["flood",["flood","drowning","rising water","tidal","the water rose","underwater"]],
 ["collapse",["collapse","collapsed","crumbling","caved in","gave way","fell down"]],
 ["crash",["crash","collision","wreck","derailed","crashed"]],
 ["storm",["storm","lightning","hurricane","tornado","gale"]],
 ["earthquake",["earthquake","the ground shook","tremor"]],
 ["explosion",["explosion","exploded","blast","bomb"]],
 ["illness",["sick","illness","plague","fever","infection"]],
 ["death",["died","dead","death","funeral","corpse","killed"]],
 ["conflict",["war","soldiers","fighting","gunfire","army","invasion"]],
 ["falling",["falling","fell from","plunged"]],
 ["pursuit",["fleeing","running from","chased","hunted","escape"]],
 ["darkness",["darkness","lights went out","blackout","eclipse","the sun went out"]],
 ["crowd",["crowd","panic","stampede","everyone was running"]]
];
var SHAREABLE_ARCH={};
Object.keys(KIT).forEach(function(k){ if(KIT[k].cat!=="being") SHAREABLE_ARCH[k]=1; });

function researchSummary(r){
  var low=" "+currentText(r).toLowerCase()+" ";
  var ev=[];
  EVENTS.forEach(function(e){
    for(var i=0;i<e[1].length;i++) if(low.indexOf(e[1][i])>-1){ ev.push(e[0]); return; }
  });
  var sym={};
  store.objects.forEach(function(o){
    if(o.filler||!o.nights||o.nights.indexOf(r.n)===-1) return;
    if(SHAREABLE_ARCH[o.archetype]) sym[o.archetype]=1;
  });
  return {
    night_of: r.date,
    events: ev,
    forms: Object.keys(sym).sort(),
    feelings: (r.emotions||[]).slice(0,8),
    lucidity: r.lucidity||0
  };
}

function research(){
  if(!store.research) store.research={consent:false,since:null};
  return store.research;
}

/* ============================================================
   12e. THE JOURNAL
   ============================================================ */
var jSel=null;

function openJournal(){
  var rs=research();
  document.getElementById("j-consent").checked=!!rs.consent;
  document.getElementById("j-rstate").textContent=rs.consent?("on since "+rs.since):"off";
  renderTally(); renderRates(); renderJournalList();
  if(jSel!==null && nightRecord(jSel)) renderJournalDetail(jSel);
  document.getElementById("journal").classList.add("open");
}
function closeJournal(){ document.getElementById("journal").classList.remove("open"); }

function wordsIn(t){ t=(t||"").trim(); return t?t.split(/\s+/).length:0; }
function formsIn(n){
  var c=0;
  store.objects.forEach(function(o){ if(!o.filler&&o.nights&&o.nights.indexOf(n)>-1) c++; });
  return c;
}
function outcomeOf(r){ return (r.outcomes&&r.outcomes.length)?r.outcomes[r.outcomes.length-1].kind:null; }

function renderTally(){
  var t=outcomeTally();
  document.getElementById("j-tally").innerHTML=
    "<span><b>"+store.sessions.length+"</b> sealed</span>"+
    "<span><b>"+t.hit+"</b> came true</span>"+
    "<span><b>"+t.partial+"</b> partly</span>"+
    "<span><b>"+t.miss+"</b> came to nothing</span>"+
    "<span><b>"+t.unchecked+"</b> not yet checked</span>";
}

function renderRates(){
  var r=baseRates(), el=document.getElementById("j-rates-body");
  if(!r.length||store.sessions.length<2){
    el.innerHTML='<p>Needs a few sealed dreams before this means anything.</p>'; return;
  }
  el.innerHTML='<p>A match on something near the top means little \u2014 you dream it often. A match on something near the bottom means much more.</p>'+
    r.slice(0,14).map(function(x){
      return '<div class="jr"><span>'+esc(x.archetype)+'</span><span><i style="width:'+
        Math.round(x.rate*100)+'%"></i></span><span>'+Math.round(x.rate*100)+'%</span></div>';
    }).join("");
}

function renderJournalList(){
  var el=document.getElementById("j-list");
  if(!store.sessions.length){
    el.innerHTML='<div class="jd-empty">No sealed dreams yet. Record one, then press New dream, or write a full dream.</div>';
    return;
  }
  el.innerHTML=store.sessions.slice().reverse().map(function(r){
    var o=outcomeOf(r);
    var tag=o==="hit"?' \u00b7 <span class="h">came true</span>':
            o==="partial"?' \u00b7 <span class="p">partly</span>':
            o==="miss"?" \u00b7 came to nothing":"";
    return '<div class="jn'+(jSel===r.n?" on":"")+'" data-n="'+r.n+'">'+
      '<div class="jt">'+esc(r.title)+"</div>"+
      '<div class="jm">'+r.date+" \u00b7 "+wordsIn(currentText(r))+" words \u00b7 "+
        formsIn(r.n)+" forms"+(r.lucidity>=2?" \u00b7 lucid":"")+tag+"</div></div>";
  }).join("");
  Array.prototype.forEach.call(el.querySelectorAll(".jn"),function(d){
    d.addEventListener("click",function(){
      jSel=parseInt(d.getAttribute("data-n"),10);
      renderJournalList(); renderJournalDetail(jSel);
    });
  });
}

function renderJournalDetail(n){
  var r=nightRecord(n), el=document.getElementById("j-detail");
  if(!r){ el.innerHTML='<div class="jd-empty">Choose a night.</div>'; return; }
  var edited=r.versions.length>0;
  var outs=(r.outcomes||[]).map(function(o){
    var w={hit:"Came true",partial:"Partly came true",miss:"Came to nothing"}[o.kind]||o.kind;
    return '<p class="jd-out">'+w+(o.eventDate?(" \u2014 "+esc(o.eventDate)):"")+
      (o.note?(": "+esc(o.note)):"")+' <i>recorded '+o.recordedAt.slice(0,10)+"</i></p>";
  }).join("");
  var summary=researchSummary(r);

  el.innerHTML=
    '<div class="jd-title">'+esc(r.title)+"</div>"+
    '<div class="jd-meta">Night '+r.n+" \u00b7 sealed "+r.sealedAt.replace("T"," ").slice(0,16)+
      " \u00b7 "+formsIn(r.n)+" forms"+(r.lucidity>=2?" \u00b7 lucid":"")+
      ((r.emotions&&r.emotions.length)?(" \u00b7 "+esc(r.emotions.slice(0,5).join(", "))):"")+"</div>"+
    '<div class="jd-seal" id="jd-seal">'+(r.fingerprint?("fingerprint "+r.fingerprint.algo+" "+r.fingerprint.hex.slice(0,24)+"\u2026 <span id=\"jd-verify\">checking</span>"):"fingerprint pending")+"</div>"+
    '<div class="jd-h">As first written</div>'+
    '<div class="jd-text">'+esc(r.original)+"</div>"+
    (edited?('<div class="jd-h">Later additions ('+r.versions.length+')</div>'+
      r.versions.map(function(v){ return '<p class="jd-v"><i>'+v.at.replace("T"," ").slice(0,16)+"</i> \u2014 "+esc(v.text)+"</p>"; }).join("")):"")+
    '<div class="jd-row">'+
      '<button class="btn" id="jd-interp">Interpret with the books</button>'+
      '<button class="btn" id="jd-view">See it in the world</button>'+
      '<button class="btn" id="jd-amend-open">Add to it</button>'+
      '<button class="btn" id="jd-del">Delete this dream</button></div>'+
    '<div id="jd-amend" style="display:none">'+
      '<textarea id="jd-amend-t" rows="4" placeholder="What you remembered later. The original stays exactly as it was."></textarea>'+
      '<div class="jd-row"><button class="btn" id="jd-amend-save">Keep this addition</button></div></div>'+
    '<div class="jd-h">What came of it</div>'+
    (outs||'<p class="jd-out"><i>Not checked yet.</i></p>')+
    '<input type="text" id="jd-o-note" placeholder="what happened, in waking life">'+
    '<input type="date" id="jd-o-date" aria-label="when it happened">'+
    '<div class="jd-row">'+
      '<button class="btn" data-o="hit">It came true</button>'+
      '<button class="btn" data-o="partial">Partly</button>'+
      '<button class="btn" data-o="miss">Nothing came of it</button></div>'+
    '<div class="jd-h">What research sharing would send</div>'+
    '<div class="jd-pre">'+esc(JSON.stringify(summary,null,2))+"</div>"+
    '<p class="jd-out"><i>'+(research().consent?"You have agreed to share this. Nothing is connected yet, so nothing has been sent.":"Research sharing is off. Nothing leaves this browser.")+"</i></p>";

  if(r.fingerprint) verifyNight(n).then(function(ok){
    var v=document.getElementById("jd-verify"); if(!v) return;
    v.className=ok?"ok":"bad";
    v.textContent=ok?"\u2014 intact":"\u2014 DOES NOT MATCH";
  });

  document.getElementById("jd-view").onclick=function(){ viewOnly(n); closeJournal(); };
  document.getElementById("jd-interp").onclick=function(){ openInterp(n); };
  document.getElementById("jd-amend-open").onclick=function(){
    var a=document.getElementById("jd-amend"); a.style.display=a.style.display==="none"?"block":"none";
    if(a.style.display==="block") document.getElementById("jd-amend-t").focus();
  };
  document.getElementById("jd-amend-save").onclick=function(){
    var t=document.getElementById("jd-amend-t").value.trim();
    if(!t) return;
    scanText(t); feedContext(t); scanAbilities(t);
    amendNight(n,t);
    renderJournalDetail(n); renderJournalList();
    setStatus("<b>Added. The original is unchanged.</b>");
  };
  document.getElementById("jd-del").onclick=function(){
    if(!confirm("Delete \""+r.title+"\" for good?\n\nPlaces that only appeared in this dream go with it. Places you dreamt on other nights stay, and simply lose this night from their record.")) return;
    deleteNight(n); jSel=null;
    renderTally(); renderRates(); renderJournalList();
    document.getElementById("j-detail").innerHTML='<div class="jd-empty">Deleted.</div>';
  };
  Array.prototype.forEach.call(el.querySelectorAll("[data-o]"),function(b){
    b.onclick=function(){
      recordOutcome(n,b.getAttribute("data-o"),
        document.getElementById("jd-o-note").value.trim(),
        document.getElementById("jd-o-date").value||null);
      renderTally(); renderJournalList(); renderJournalDetail(n);
    };
  });
}

/* ---- seeing one night alone, in the world it belongs to ---- */
function viewOnly(n){
  viewNight=n;
  store.objects.forEach(function(o){ if(!o.filler) refresh(o); });
  var r=nightRecord(n);
  document.getElementById("viewing-t").textContent="Viewing "+(r?r.title:("night "+n));
  document.getElementById("viewing").classList.remove("gone");
  var first=null;
  store.objects.forEach(function(o){ if(!first&&!o.filler&&o.nights&&o.nights.indexOf(n)>-1) first=o; });
  if(first){ orb.tx=first.x; orb.tz=first.z; store.grid.bx=Math.round(first.x/PITCH); store.grid.bz=Math.round(first.z/PITCH); }
}
function clearView(){
  viewNight=null;
  store.objects.forEach(function(o){ if(!o.filler) refresh(o); });
  document.getElementById("viewing").classList.add("gone");
}

/* ---- deleting a night: its own places go, shared places lose it ---- */
function deleteNight(n){
  for(var i=store.objects.length-1;i>=0;i--){
    var o=store.objects[i];
    if(o.filler||!o.nights) continue;
    var k=o.nights.indexOf(n);
    if(k===-1) continue;
    o.nights.splice(k,1);
    if(!o.nights.length){
      if(meshes[o.id]){ scene.remove(meshes[o.id]); delete meshes[o.id]; }
      if(store.lots && o.bx!==undefined && o.lot!==null && o.lot!==undefined)
        delete store.lots[lotKey(o.bx,o.bz,o.lot)];
      store.objects.splice(i,1);
    } else refresh(o);
  }
  for(var j=store.characters.length-1;j>=0;j--){
    var c=store.characters[j];
    if(c.primary===false||!c.sessions) continue;
    var q=c.sessions.indexOf(n);
    if(q>-1) c.sessions.splice(q,1);
    if(!c.sessions.length){
      if(c.objId&&meshes[c.objId]){ scene.remove(meshes[c.objId]); delete meshes[c.objId]; }
      var sp=c.objId?specById(c.objId):null;
      if(sp){ var si=store.objects.indexOf(sp); if(si>-1) store.objects.splice(si,1); }
      store.characters.splice(j,1);
    }
  }
  store.sessions=store.sessions.filter(function(r){ return r.n!==n; });
  if(viewNight===n) clearView();
  save(); updateCount(); tickClock(true);
}

/* ---- telling the world two places are the same, across nights ---- */
function linkPlaces(keepId,dropId){
  var keep=specById(keepId), drop=specById(dropId);
  if(!keep||!drop||keep===drop) return false;
  (drop.nights||[]).forEach(function(n){ if(keep.nights.indexOf(n)===-1) keep.nights.push(n); });
  keep.nights.sort(function(a,b){ return a-b; });
  for(var k in drop.attrs) if(keep.attrs[k]===undefined) keep.attrs[k]=drop.attrs[k];
  if(!keep.sign&&drop.sign) keep.sign=drop.sign;
  store.characters.forEach(function(c){
    if(c.home===drop.id) c.home=keep.id;
    if(c.work===drop.id) c.work=keep.id;
  });
  (store.passages||[]).forEach(function(p){
    if(p.from===drop.id) p.from=keep.id;
    if(p.to===drop.id) p.to=keep.id;
  });
  if(meshes[drop.id]){ scene.remove(meshes[drop.id]); delete meshes[drop.id]; }
  if(store.lots && drop.bx!==undefined && drop.lot!==null && drop.lot!==undefined)
    delete store.lots[lotKey(drop.bx,drop.bz,drop.lot)];
  var di=store.objects.indexOf(drop); if(di>-1) store.objects.splice(di,1);
  refresh(keep); save(); updateCount();
  return true;
}

