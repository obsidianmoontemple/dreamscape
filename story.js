/* Dream Walker's Atlas — story.js
   writing a full dream, and who is dreaming
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   12b. STORY — a whole dream, read in the order it happened
   ============================================================ */
var storyOpen=false;

function openStory(){
  storyOpen=true;
  document.getElementById("story-title").value="";
  document.getElementById("story-text").value="";
  updateStoryCount();
  document.getElementById("story").classList.add("open");
  setTimeout(function(){ document.getElementById("story-text").focus(); },420);
}
function closeStory(){
  storyOpen=false;
  document.getElementById("story").classList.remove("open");
}
function updateStoryCount(){
  var v=document.getElementById("story-text").value.trim();
  var w=v?v.split(/\s+/).length:0;
  document.getElementById("story-count").textContent=w?(w+" words"):"";
}

/* a full dream is built sentence by sentence, so the order you walked it
   becomes the way the places connect */
function renderStory(){
  var title=document.getElementById("story-title").value.trim();
  var text=document.getElementById("story-text").value.trim();
  if(text.length<12){ setStatus("<i>Write a little more first.</i>"); return; }

  var abil=scanAbilities(text);
  var parts=text.split(/(?<=[.!?])\s+|\n+/).filter(function(x){ return x.trim().length>1; });
  var built=0, linked=0, prevPlace=null;

  parts.forEach(function(sentence){
    var before=store.objects.length;
    var n=scanText(sentence);
    feedContext(sentence);
    built+=n;

    /* the last structure this sentence raised, if any */
    var here=null;
    for(var i=store.objects.length-1;i>=before;i--){
      var o=store.objects[i];
      if(o.filler) continue;
      var d=KIT[o.archetype];
      if(d&&(d.cat==="structure"||o.archetype==="portal"||o.archetype==="secretdoor"||
             o.archetype==="rift"||o.archetype==="tunnel"||o.archetype==="cave")){ here=o; break; }
    }
    if(here){
      var kind=linkIn(sentence);
      if(prevPlace){
        var secret=(kind==="secret");
        if(addPassage(prevPlace.id,here.id,kind||"door",secret)) linked++;
      }
      prevPlace=here;
    }
  });

  populate();
  if(store.transcript.trim()){ text=store.transcript.trim()+"\n\n"+text; }
  closeNight(title,text,true);
  scheduleParse(500);
  save(); updateCount(); tickClock(true);
  closeStory();

  var bits=[built+" form"+(built===1?"":"s")];
  if(linked) bits.push(linked+" passage"+(linked===1?"":"s"));
  if(abil) bits.push(abil+" thing"+(abil===1?"":"s")+" you could do");
  setStatus("<b>"+bits.join(", ")+".</b>");
}

/* ============================================================
   12c. WHO IS DREAMING
   ============================================================ */
function openSelf(){
  var d=dreamer();
  document.getElementById("self-name").value=d.name||"";
  document.getElementById("self-about").value=d.about||"";
  document.getElementById("self-practice").value=d.practice||"";
  document.getElementById("self-notes").value=d.notes||"";
  renderAbilities();
  document.getElementById("self").classList.add("open");
}
function closeSelf(){ document.getElementById("self").classList.remove("open"); }
function renderAbilities(){
  var d=dreamer(), el=document.getElementById("self-abilities");
  if(!d.abilities.length){
    el.innerHTML='<span style="font-size:12px;color:var(--dim)">nothing recorded yet</span>';
    return;
  }
  el.innerHTML=d.abilities.map(function(a,i){
    return '<span class="abil" data-i="'+i+'" title="'+
      (a.src==="stated"?"from your dreams":"you added this")+'">'+esc(a.name)+"</span>";
  }).join("");
  Array.prototype.forEach.call(el.querySelectorAll(".abil"),function(sp){
    sp.addEventListener("click",function(){
      d.abilities.splice(parseInt(sp.getAttribute("data-i"),10),1);
      save(); renderAbilities();
    });
  });
}
function saveSelf(){
  var d=dreamer();
  d.name=document.getElementById("self-name").value.trim();
  d.about=document.getElementById("self-about").value.trim();
  d.practice=document.getElementById("self-practice").value.trim();
  d.notes=document.getElementById("self-notes").value.trim();
  save(); closeSelf();
  setStatus("Saved.");
}

