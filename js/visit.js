/* SomnuMatrix — visit.js
   walking into somebody's door. if they opened it, you walk in their world: their
   streets, their houses, the people they dreamt. while you are there nothing you
   do touches anything — theirs or yours. your own dreamscape is set aside whole
   and put back the moment you leave.
   publishing is the other half: a plain copy you choose to share. it is never the
   vault, and the words you wrote are left out unless you ask for them too.
   loaded as a plain script; shares scope with the other files */
"use strict";

var visiting=null, visitKept=null, visitCool=0;

function amVisiting(){ return !!visiting; }

/* what a visitor is given: the world, and the writing only if it was offered */
function scapeForVisitors(withWords){
  var keep={};
  ["objects","characters","realms","hoods","grid","townGrid","land","insideSlots"].forEach(function(k){
    if(store[k]!==undefined) keep[k]=store[k];
  });
  keep.dreamer={name:(store.dreamer&&store.dreamer.name)||"",abilities:[]};
  if(withWords){ keep.sessions=store.sessions||[]; keep.transcript=store.transcript||""; }
  else {
    keep.sessions=(store.sessions||[]).map(function(r){ return {n:r.n,date:r.date,title:r.title}; });
    keep.transcript="";
  }
  /* nothing of the visitor's own account, device or vault travels with it */
  return {v:1,at:Date.now(),name:(store.dreamer&&store.dreamer.name)||"",words:!!withWords,store:keep};
}
function publishScape(withWords){
  if(!signedIn()) return Promise.reject(new Error("Sign in first \u2014 a shared world belongs to an account."));
  return restRpc("publish_scape",{p_scape:scapeForVisitors(withWords),p_words:!!withWords}).then(function(out){
    if(out!=="ok") throw new Error(out||"It didn't publish.");
    return true;
  });
}
function unpublishScape(){ return restRpc("unpublish_scape",{}); }
function setDoorOpen(open){
  return restRpc("set_door_open",{p_open:!!open}).then(function(out){
    if(out!=="ok") throw new Error(out||"That didn't take.");
    return true;
  });
}

/* ---- walking in ---- */
function walkIntoDoor(spec){
  if(visitCool>0||amVisiting()) return;
  if(!spec.dreamerDoor) return;
  if(signedIn()&&spec.dreamerDoor===session.user.id){ return; }   // your own door goes home
  visitCool=2;
  setStatus("<b>Knocking at "+esc(spec.name||"a door")+"\u2026</b>");
  restRpc("walk_in",{p_door:spec.dreamerDoor}).then(function(got){
    if(!got||!got.store){
      setStatus("<b>"+esc(spec.name||"That door")+"</b> is shut. "+(spec.doorLine?"<i>"+esc(spec.doorLine)+"</i> \u2014 ":"")+
        "Only a door its owner has opened can be walked through.");
      return;
    }
    beginVisit(spec,got);
  }).catch(function(){ setStatus("That door would not open just now."); });
}
function beginVisit(spec,got){
  /* your own world, set aside whole */
  visitKept={};
  Object.keys(store).forEach(function(k){ visitKept[k]=store[k]; });
  visiting={id:spec.dreamerDoor,name:spec.name||"a dreamer",line:spec.doorLine||"",was:visitKept.here||0,
    wasAt:{x:camera.position.x,y:camera.position.y,z:camera.position.z}};
  Object.keys(store).forEach(function(k){ if(k!=="dreamer") delete store[k]; });
  Object.keys(got.store).forEach(function(k){ store[k]=got.store[k]; });
  store.here=0; store.inside=null; store.visiting=true;
  if(typeof rebuildAll==="function") rebuildAll();
  var h=heartOf(0);
  camera.position.set(h.x,1.72,h.z+26);
  showVisitBar(true);
  setStatus("<b>You are walking in "+esc(visiting.name)+"'s world.</b> "+(visiting.line?"<i>"+esc(visiting.line)+"</i>. ":"")+
    "Nothing you do here changes anything. Press <b>Back to your own</b> when you are done.");
}
function endVisit(){
  if(!visiting) return;
  var back=visiting;
  visiting=null;
  Object.keys(store).forEach(function(k){ delete store[k]; });
  Object.keys(visitKept).forEach(function(k){ store[k]=visitKept[k]; });
  visitKept=null; visitCool=2;
  if(typeof rebuildAll==="function") rebuildAll();
  camera.position.set(back.wasAt.x,back.wasAt.y,back.wasAt.z);
  showVisitBar(false);
  setStatus("<b>Home.</b> Your own dreamscape is exactly as you left it.");
  save();
}
/* while visiting: a bar that says whose world this is, and the way home */
function showVisitBar(on){
  var el=document.getElementById("visit-bar");
  if(!el&&on&&document.body){
    el=document.createElement("div"); el.id="visit-bar";
    el.style.cssText="position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:40;display:flex;gap:12px;align-items:center;"+
      "background:rgba(10,12,18,.94);border:1px solid var(--gold,#C9A868);border-radius:3px;padding:8px 14px;font-family:var(--sans);font-size:14px";
    el.innerHTML='<span id="visit-who"></span><button class="btn" id="visit-out">Back to your own</button>';
    document.body.appendChild(el);
    document.getElementById("visit-out").onclick=endVisit;
  }
  if(!el) return;
  el.style.display=on?"flex":"none";
  if(on) document.getElementById("visit-who").innerHTML="Walking in <b>"+esc(visiting.name)+"</b>'s world";
}
function visitTick(dt){ if(visitCool>0) visitCool-=dt; }

/* ---- the panel ---- */
function initVisit(){
  var b;
  if((b=document.getElementById("share-publish"))) b.onclick=function(){
    var words=document.getElementById("share-words").value==="yes";
    setStatus("Publishing a copy\u2026");
    publishScape(words).then(function(){
      setStatus("<b>A copy of your world is published.</b> "+(words?"Your written dreams are included.":"The world only \u2014 your written dreams stay with you.")+
        " Open your door to let people in.");
    }).catch(function(e){ setStatus(esc(e.message)); });
  };
  if((b=document.getElementById("share-open"))) b.onchange=function(){
    var on=b.value==="open";
    setDoorOpen(on).then(function(){
      setStatus(on?"<b>Your door stands open.</b> Anyone in the hall may walk in."
                  :"<b>Your door is shut.</b> The way in closes at once.");
    }).catch(function(e){ b.value="shut"; setStatus(esc(e.message)); });
  };
  if((b=document.getElementById("share-remove"))) b.onclick=function(){
    if(!confirm("Take down the copy people can visit? Your door closes with it.")) return;
    unpublishScape().then(function(){
      var s=document.getElementById("share-open"); if(s) s.value="shut";
      setStatus("The copy is gone, and your door is shut.");
    });
  };
}

