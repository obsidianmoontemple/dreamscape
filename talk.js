/* Dream Walker's Atlas — talk.js
   dialogue, strangers and the roster
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   8b. SPEAKING WITH THE DEAD AIR — dialogue, and continuation
   ============================================================ */
var talkWith=null, talkOpen=false, lastReply="";

function openTalk(c){
  if(!c) return;
  talkWith=c; talkOpen=true;
  if(document.exitPointerLock) document.exitPointerLock();
  document.getElementById("prompt").classList.add("gone");
  document.getElementById("t-name").textContent=c.name;
  talkMeta(c);
  renderLog();
  document.getElementById("talk").classList.add("open");
  setTimeout(function(){ document.getElementById("t-say").focus(); },380);
}
function talkMeta(c){
  var need=wakeNeed(c);
  document.getElementById("t-meta").textContent=c.awake
    ? c.details.length+" remembered \u00b7 "+c.sessions.length+" dream"+(c.sessions.length>1?"s":"")+(c.born?" \u00b7 first seen "+c.born:"")
    : "not yet awake \u00b7 "+need+" more thing"+(need===1?"":"s")+" to wake";
  document.getElementById("t-say").placeholder=c.awake
    ? "say something \u2014 enter to send"
    : "tell the dream about "+c.name+" \u2014 who they are, what they do, where they live. Enter to add.";
  document.getElementById("t-send").textContent=c.awake?"Speak":"Tell the dream";
  document.getElementById("t-build").style.display=c.awake?"":"none";
}

function closeTalk(){
  talkOpen=false; talkWith=null;
  document.getElementById("talk").classList.remove("open");
}
function renderLog(){
  var el=document.getElementById("t-log");
  if(!talkWith) return;
  if(!talkWith.awake){
    var need=wakeNeed(talkWith);
    el.innerHTML='<p class="me">'+esc(talkWith.name)+' is here, but not awake yet.</p>'+
      '<p class="them" style="font-family:var(--sans);font-size:13.5px;color:var(--dim)">A figure wakes once the dream knows enough about them \u2014 '+
      need+' more thing'+(need===1?"":"s")+', or seeing them again on another night. Tell the dream about them below: '+
      'who they are, what they do, where they live, what they were like. Each sentence counts. '+
      'If you say their name ("his name is Silas") they will answer to it.</p>'+
      (talkWith.details.length?'<p class="me">What the dream knows so far:</p>'+
        talkWith.details.filter(function(d){ return !/^said: /.test(d); }).slice(-6).map(function(d){ return '<p class="them">'+esc(d)+"</p>"; }).join(""):"");
    el.scrollTop=el.scrollHeight;
    return;
  }
  if(!talkWith.log.length){
    el.innerHTML='<p class="them">'+esc(firstWords(talkWith))+"</p>";
    return;
  }
  el.innerHTML=talkWith.log.map(function(t){
    return '<p class="'+(t.who==="me"?"me":"them")+'">'+esc(t.text)+"</p>";
  }).join("");
  el.scrollTop=el.scrollHeight;
}
function firstWords(c){
  var d=c.details[c.details.length-1]||"";
  if(c.sessions.length>1) return "You have been here before.";
  return d?"\u2026":"\u2026";
}

function dreamerBrief(){
  var d=dreamer(), bits=[];
  if(d.name) bits.push("The dreamer is called "+d.name+" here.");
  if(d.about) bits.push("About them: "+d.about);
  if(d.practice) bits.push("Their practice: "+d.practice);
  if(d.abilities.length) bits.push("In dreams they can: "+
    d.abilities.map(function(a){ return a.name; }).join(", ")+".");
  if(d.notes) bits.push("They also say: "+d.notes);
  if(!bits.length) return "";
  return bits.join(" ")+" Treat this as true of them, but never claim to know their waking life beyond it.";
}

function charSystem(c){
  var where=[];
  store.objects.forEach(function(o){
    if(KIT[o.archetype] && KIT[o.archetype].cat==="structure"){
      var dx=o.x-c.x, dz=o.z-c.z;
      if(dx*dx+dz*dz<160*160) where.push(placeName(o));
    }
  });
  return [
    "You are "+c.name+", a figure inside a dream that the dreamer recorded.",
    dreamerBrief(),
    "It is "+hhmm(dreamHour())+". You are "+(c.doing||"here")+
      (c.atId&&specById(c.atId)?(" at "+placeName(specById(c.atId))):"")+".",
    c.home&&specById(c.home)?("You live at "+placeName(specById(c.home))+"."):"",
    c.work&&specById(c.work)?("By day you are found at "+placeName(specById(c.work))+"."):"",
    knownGaps(c).length?("The dream never recorded "+knownGaps(c).join(", ")+
      ". You do not know these things about yourself either. If asked, say so, or answer the way a dream answers \u2014 and if you do give an answer, it becomes true."):"",
    "Everything the dreamer wrote down about you: "+(c.details.length?c.details.join(" / "):"almost nothing"),
    "You have appeared in "+c.sessions.length+" of their dreams.",
    where.length?("Near you stand: "+where.slice(0,7).join(", ")+"."):"",
    store.emotions.length?("The dream felt: "+store.emotions.slice(0,6).join(", ")+"."):"",
    "Speak as this figure, in first person, in under 70 words.",
    "Answer what the dreamer actually asked. Be particular: name the places near you, use what was recorded about you, notice the hour. Vary how you begin; never open two replies the same way. Sometimes ask them something back. Never lecture and never explain that you are a figure in a dream unless asked.",
    (c.log&&c.log.length)?("You have already said the following. Never repeat any of it, in whole or in part: "+
      c.log.filter(function(t){ return t.who!=="me"; }).slice(-6).map(function(t){ return "\u201c"+t.text+"\u201d"; }).join(" ")):"",
    "You are made only of what the dream contained. You know nothing of their waking life, and you never claim to be a real person, a spirit, a god, or a messenger. If asked something outside the dream, deflect the way a dream deflects.",
    "You may be fragmentary, evasive or strange. You need not be comforting, but you are never cruel.",
    "If you speak of a place, describe it in concrete physical nouns, because what you describe will be built."
  ].filter(Boolean).join(" ");
}

/* kept for anything that still calls it: the old four lines are gone */
function localReply(c,q){ return localVoice(c,q||""); }

function sendTalk(){
  if(!talkWith) return;
  var ta=document.getElementById("t-say");
  var text=ta.value.trim();
  if(!text) return;
  if(!talkWith.awake){
    var r=describeFigure(talkWith,text);
    ta.value="";
    document.getElementById("t-name").textContent=talkWith.name;
    talkMeta(talkWith);
    if(talkWith.awake){
      talkWith.log.push({who:"them",text:localVoice(talkWith,"hello")});
      setStatus("<b>"+esc(talkWith.name)+" is awake.</b>");
    }
    renderLog(); save();
    return;
  }
  talkWith.log.push({who:"me",text:text});
  ta.value=""; renderLog(); save();

  var c=cfg();
  if(c.mode==="off"){
    var who0=talkWith;
    setTimeout(function(){
      who0.log.push({who:"them",text:localVoice(who0,text)});
      lastReply=who0.log[who0.log.length-1].text;
      if(talkWith===who0) renderLog();
      save();
    },450+Math.random()*500);
    return;
  }
  var url=c.mode==="proxy"?c.proxy:"https://api.x.ai/v1/chat/completions";
  var headers={"Content-Type":"application/json"};
  if(c.mode==="direct"&&c.key) headers["Authorization"]="Bearer "+c.key;

  var msgs=[{role:"system",content:charSystem(talkWith)}];
  talkWith.log.slice(-12).forEach(function(t){
    msgs.push({role:t.who==="me"?"user":"assistant",content:t.text});
  });

  var who=talkWith;
  talkWith.log.push({who:"them",text:"\u2026"});
  renderLog();

  fetch(url,{method:"POST",headers:headers,body:JSON.stringify({
    model:c.model||"grok-4.3",temperature:1.0,max_tokens:320,messages:msgs
  })})
  .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
  .then(function(d){
    var t=(d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content||"").trim();
    who.log[who.log.length-1]={who:"them",text:t||localVoice(who,text)};
    lastReply=who.log[who.log.length-1].text;
    addDetail(who,"said: "+lastReply.slice(0,120));
    if(talkWith===who) renderLog();
    save();
  })
  .catch(function(){
    who.log[who.log.length-1]={who:"them",text:localVoice(who,text)};
    lastReply=who.log[who.log.length-1].text;
    if(talkWith===who) renderLog();
    save();
  });
}

/* a figure speaks in the first person; the record needs it in the third,
   or nothing it says about itself can be attached to it */
function deFirstPerson(text,name){
  if(!name) return text;
  var t=" "+text+" ";
  var poss=name+(/s$/i.test(name)?"'":"'s");
  t=t.replace(/([\s"(])I'm(\W)/gi,"$1"+name+" is$2");
  t=t.replace(/([\s"(])I've(\W)/gi,"$1"+name+" has$2");
  t=t.replace(/([\s"(])I'll(\W)/gi,"$1"+name+" will$2");
  t=t.replace(/([\s"(])I am(\W)/g,"$1"+name+" is$2");
  t=t.replace(/([\s"(])I have(\W)/g,"$1"+name+" has$2");
  t=t.replace(/([\s"(])I was(\W)/g,"$1"+name+" was$2");
  t=t.replace(/([\s"(])I do(\W)/g,"$1"+name+" does$2");
  t=t.replace(/([\s"(])I don't(\W)/gi,"$1"+name+" does not$2");
  t=t.replace(/([\s"(])I (\w+)/g,function(m,p,v){
    if(/^(am|is|was|have|has|do|does|will|would|can|could|had)$/i.test(v)) return p+name+" "+v;
    return p+name+" "+v+(/[sd]$/.test(v)?"":"s");
  });
  t=t.replace(/([\s"(])my(\W)/gi,"$1"+poss+"$2");
  t=t.replace(/([\s"(])me(\W)/gi,"$1"+name+"$2");
  t=t.replace(/([\s"(])myself(\W)/gi,"$1"+name+"$2");
  return t.trim();
}

/* what a figure describes becomes part of the dreamscape */
function buildFromReply(){
  if(!lastReply){ setStatus("<i>Nothing said yet.</i>"); return; }
  var who=talkWith?talkWith.name:null;
  var said=deFirstPerson(lastReply,who);
  var n=scanText(said);
  feedContext(said);
  committed+=said+" ";
  store.transcript=committed;
  renderTranscript(committed,"");
  scheduleParse(300);
  save(); updateCount();
  setStatus(n?("<b>"+n+" form"+(n>1?"s":"")+" rose from what they said</b>"):"Taken down.");
}

/* ============================================================
   8d. STRANGERS — they have nothing to say, until you know them
   ============================================================ */
var GREET={
  night:["Can't sleep either.","You shouldn't be out at this hour.","Nothing open now.",
         "Quiet, isn't it.","I'm only passing through.","Don't mind me."],
  dawn:["Early.","Cold one.","You're up before the rest.","Morning, near enough."],
  morning:["Morning.","Busy today.","Mind how you go.","Afternoon \u2014 no, morning. I've lost it."],
  day:["Afternoon.","Warm enough.","Long way round, that.","You look lost."],
  evening:["Evening.","Long day.","Heading back now.","Nearly done."],
};
var GREET2=["Nothing more to tell you.","That's all there is of me.","I only came this way.",
  "Ask someone else.","I wasn't really here.","You didn't dream me, did you."];
var ANIMAL={dog:["It looks at you and does not move."],cat:["It watches, then looks away."],
  horse:["It shifts its weight and ignores you."],bird:["It does not acknowledge you."],
  crowd:["Nobody in it turns round."],car:["Empty. The engine is not running."],
  truck:["Empty. Somebody left the door open."],bicycle:["Leaning against nothing in particular."]};

function greetBand(h){
  if(h<4.5||h>=22) return "night";
  if(h<7) return "dawn";
  if(h<12) return "morning";
  if(h<17.5) return "day";
  return "evening";
}
function greetLine(c,again){
  if(ANIMAL[c.archetype]) return ANIMAL[c.archetype][0];
  if(again) return GREET2[hash(c.id+String(again))%GREET2.length];
  var band=GREET[greetBand(dreamHour())];
  return band[hash(c.id)%band.length];
}

var greetWith=null, greetOpen=false, greetCount=0;

function openGreet(c){
  if(!c) return;
  greetWith=c; greetOpen=true; greetCount=0;
  if(document.exitPointerLock) document.exitPointerLock();
  document.getElementById("prompt").classList.add("gone");
  document.getElementById("g-line").textContent=greetLine(c,0);
  var at=nearestNamed(c.x,c.z,70);
  document.getElementById("g-sub").textContent=
    "a stranger \u00b7 "+hhmm(dreamHour())+(at?(" \u00b7 near "+placeName(at)):"");
  document.getElementById("g-claim").classList.remove("open");
  document.getElementById("g-confirm").style.display="none";
  document.getElementById("g-know").style.display="";
  document.getElementById("g-name").value="";
  fillMergeList();
  document.getElementById("greet").classList.add("open");
}
function closeGreet(){
  greetOpen=false; greetWith=null;
  document.getElementById("greet").classList.remove("open");
}
function greetAgain(){
  if(!greetWith) return;
  greetCount++;
  document.getElementById("g-line").textContent=greetLine(greetWith,greetCount);
}
function fillMergeList(){
  var sel=document.getElementById("g-merge");
  var opts=['<option value="">\u2014</option>'];
  store.characters.forEach(function(c){
    if(c.primary===false||!greetWith) return;
    if(c.archetype!==greetWith.archetype) return;
    opts.push('<option value="'+c.id+'">'+esc(c.name)+"</option>");
  });
  sel.innerHTML=opts.join("");
}

/* the dreamer says who a stranger is, and the stranger stops being one */
function claimStranger(){
  if(!greetWith) return;
  var nameEl=document.getElementById("g-name");
  var mergeId=document.getElementById("g-merge").value;
  var spec=specById(greetWith.objId);
  var where=nearestNamed(greetWith.x,greetWith.z,80);
  var note="recognised at "+hhmm(dreamHour())+(where?(" near "+placeName(where)):"");

  if(mergeId){
    var target=null;
    store.characters.forEach(function(c){ if(c.id===mergeId) target=c; });
    if(!target){ setStatus("<i>Could not place them.</i>"); return; }
    /* the body they are standing in becomes theirs */
    if(target.objId && meshes[target.objId] && target.objId!==greetWith.objId){
      var old=specById(target.objId);
      if(old){ scene.remove(meshes[old.id]); delete meshes[old.id];
        var oi=store.objects.indexOf(old); if(oi>-1) store.objects.splice(oi,1); }
    }
    var bm=store.blocks&&spec&&spec.block?store.blocks[spec.block]:null;
    if(bm){ var km=bm.ids.indexOf(spec.id); if(km>-1) bm.ids.splice(km,1); }
    if(spec){ spec.filler=false; spec.charId=target.id; spec.label=target.name;
              spec.name=null; spec.solid=true; refresh(spec); }
    var gi=store.characters.indexOf(greetWith); if(gi>-1) store.characters.splice(gi,1);
    target.objId=spec?spec.id:target.objId;
    target.x=greetWith.x; target.z=greetWith.z;
    target.anchor={x:greetWith.x,z:greetWith.z};
    addDetail(target,note);
    if(target.sessions.indexOf(store.session)===-1) target.sessions.push(store.session);
    checkWake(target);
    setStatus("<b>"+esc(target.name)+" again.</b>");
    closeGreet(); save(); tickClock(true); updateCount();
    return;
  }

  var nm=nameEl.value.trim();
  if(!nm){ setStatus("<i>Give them a name first.</i>"); nameEl.focus(); return; }
  var bf=store.blocks&&spec&&spec.block?store.blocks[spec.block]:null;
  if(bf){ var kf=bf.ids.indexOf(spec.id); if(kf>-1) bf.ids.splice(kf,1); }
  greetWith.primary=true;
  greetWith.name=nm;
  greetWith.aka=[normName(nm)];
  greetWith.src={name:"stated"};
  greetWith.sessions=[store.session];
  greetWith.born=new Date().toISOString().slice(0,10);
  greetWith.anchor={x:greetWith.x,z:greetWith.z};
  addDetail(greetWith,note);
  if(spec){ spec.filler=false; spec.label=nm; spec.name=null; spec.detail=1; refresh(spec); }
  setStatus("<b>"+esc(nm)+" is someone now.</b>");
  closeGreet(); save(); tickClock(true); updateCount();
}

/* ============================================================
   8c. ROSTER
   ============================================================ */
function srcMark(c,k){
  var v=c.src&&c.src[k];
  if(!v) return "";
  if(v==="stated") return ' <u>dreamt</u>';
  if(v==="parsed") return ' <u>read from the dream</u>';
  return ' <s>filled in</s>';
}

function mergeControl(c){
  var others=store.characters.filter(function(x){
    return x.primary!==false && x.id!==c.id && x.archetype===c.archetype;
  });
  if(!others.length) return "";
  var opts=['<option value="">\u2014 same as someone else? \u2014</option>'];
  others.forEach(function(x){ opts.push('<option value="'+x.id+'">'+esc(x.name)+"</option>"); });
  return '<select class="rmerge" data-keep="'+c.id+'">'+opts.join("")+"</select>";
}

function openRoster(){
  tickClock(true);
  var el=document.getElementById("r-list");
  var prim=store.characters.filter(function(c){ return c.primary!==false; });
  var fill=store.characters.length-prim.length;
  if(!prim.length){
    el.innerHTML='<div class="rd">No one yet. Dream someone into it.</div>';
  } else {
    el.innerHTML=prim.slice().sort(function(a,b){ return awareness(b)-awareness(a); })
    .map(function(c){
      var gaps=knownGaps(c);
      var at=c.atId?specById(c.atId):null;
      return '<div class="rc" data-id="'+c.id+'">'+
        '<div class="rn">'+esc(c.name)+(c.role?' <span class="rq">'+esc(c.role)+'</span>':"")+"</div>"+
        '<div class="rd">'+esc(c.doing||"\u2014")+(at?(" at "+esc(placeName(at))):"")+
          (c.visible===false?" \u00b7 not about":"")+"</div>"+
        '<div class="rd">lives: '+(c.home?esc(placeName(specById(c.home))):"<b>not dreamt</b>")+srcMark(c,"home")+"</div>"+
        '<div class="rd">by day: '+(c.work?esc(placeName(specById(c.work))):"<b>not dreamt</b>")+srcMark(c,"work")+"</div>"+
        '<div class="rd">hours: '+(c.routine?"recorded":"<b>not dreamt</b>")+srcMark(c,"routine")+"</div>"+
        '<div class="rd">'+c.details.length+" remembered \u00b7 "+c.sessions.length+
          " dream"+(c.sessions.length>1?"s":"")+(c.awake?' \u00b7 <em>awake</em>':"")+"</div>"+
        (gaps.length?('<div class="rd"><button class="btn rfill" data-fill="'+c.id+
          '" type="button">Fill in '+gaps.length+' gap'+(gaps.length>1?"s":"")+"</button></div>"):"")+
        mergeControl(c)+
        '<div class="rbar"><i style="width:'+Math.min(Math.round(awareness(c)*100),100)+'%"></i></div></div>';
    }).join("")+
    (fill?('<div class="rd" style="margin-top:12px">and '+fill+" nameless others, who were never dreamt</div>"):"");

    Array.prototype.forEach.call(el.querySelectorAll(".rmerge"),function(sel){
      sel.addEventListener("click",function(ev){ ev.stopPropagation(); });
      sel.addEventListener("change",function(ev){
        ev.stopPropagation();
        var keepId=sel.getAttribute("data-keep"), dropId=sel.value;
        if(!dropId) return;
        var kn="",dn="";
        store.characters.forEach(function(x){
          if(x.id===keepId) kn=x.name;
          if(x.id===dropId) dn=x.name;
        });
        if(!confirm("Fold \""+dn+"\" into \""+kn+"\"?\n\nEverything recorded about both becomes one person, under the name \""+kn+"\".")){
          sel.value=""; return;
        }
        if(mergeCharacters(keepId,dropId)){
          setStatus("<b>"+esc(dn)+" and "+esc(kn)+" were the same person.</b>");
          openRoster();
        }
      });
    });
    Array.prototype.forEach.call(el.querySelectorAll(".rfill"),function(b){
      b.addEventListener("click",function(ev){
        ev.stopPropagation();
        var id=b.getAttribute("data-fill"),c=null;
        store.characters.forEach(function(x){ if(x.id===id) c=x; });
        if(c){ giveLife(c); openRoster(); }
      });
    });
    Array.prototype.forEach.call(el.querySelectorAll(".rc"),function(d){
      d.addEventListener("click",function(){
        var c=null,id=d.getAttribute("data-id");
        store.characters.forEach(function(x){ if(x.id===id) c=x; });
        if(!c) return;
        document.getElementById("roster").classList.remove("open");
        if(!walkMode) setWalk(true);
        camera.position.set(c.x,1.72,c.z+6);
        yaw=Math.PI; pitch=0;
        if(c.awake) setTimeout(function(){ openTalk(c); },220);
      });
    });
  }
  document.getElementById("roster").classList.add("open");
}

