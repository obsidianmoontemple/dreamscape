/* Dream Walker's Atlas — speech.js
   speech recognition
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   13. SPEECH
   ============================================================ */
var rec=null,listening=false,committed="";
function initSpeech(){
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){
    var m=document.getElementById("mic");
    m.disabled=true; m.style.opacity=.28;
    setStatus("No speech recognition in this browser. Type instead.");
    return;
  }
  rec=new SR(); rec.continuous=true; rec.interimResults=true; rec.lang="en-US";
  rec.onresult=function(e){
    var interim="",fresh="";
    for(var i=e.resultIndex;i<e.results.length;i++){
      var t=e.results[i][0].transcript;
      if(e.results[i].isFinal) fresh+=t+" "; else interim+=t;
    }
    if(fresh){
      committed+=fresh;
      store.transcript=committed;
      var n=scanText(fresh);
      feedContext(fresh);
      scanAbilities(fresh);
      if(n) setStatus("<b>"+n+" form"+(n>1?"s":"")+" took shape</b>");
      scheduleParse(2200);
      save();
    }
    renderTranscript(committed,interim);
  };
  rec.onerror=function(e){
    if(e.error==="not-allowed") setStatus("<i>Microphone permission refused.</i>");
    else if(e.error!=="no-speech") setStatus("<i>"+e.error+"</i>");
  };
  rec.onend=function(){ if(listening){ try{ rec.start(); }catch(err){} } };
}
function toggleMic(){
  if(!rec) return;
  listening=!listening;
  var m=document.getElementById("mic");
  m.classList.toggle("live",listening);
  m.setAttribute("aria-label",listening?"Stop listening":"Start listening");
  if(listening){ try{ rec.start(); setStatus("Listening."); }catch(e){} }
  else{ rec.stop(); setStatus("Stopped."); }
}

