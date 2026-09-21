/* Dream Walker's Atlas — voice.js
   how a figure speaks when no model is connected. everything it says comes from
   what the dream recorded; it answers what was asked; it does not repeat itself.
   loaded as a plain script; shares scope with the other files */
"use strict";

/* ---- turning a recorded detail into the figure's own memory ----
   "A woman stood at the door"        -> "I stood at the door"
   "I saw the woman near the church"  -> "you saw me near the church"
   "He works nights at the mill"      -> "I work nights at the mill" */
function toFirstPerson(text,c){
  var t=" "+String(text).trim().replace(/\s+/g," ")+" ";
  // the dreamer becomes "you"
  t=t.replace(/([\s"(])I'm(\W)/g,"$1you're$2").replace(/([\s"(])I am(\W)/g,"$1you are$2")
     .replace(/([\s"(])I was(\W)/g,"$1you were$2").replace(/([\s"(])I\b/g,"$1you")
     .replace(/\bmyself\b/gi,"yourself").replace(/\bmy\b/gi,"your").replace(/\bme\b/gi,"you");
  // the figure becomes "I" at the head of the sentence and "me" anywhere else
  var names=(c.aka||[]).concat([normName(c.name)]).filter(Boolean)
    .sort(function(a,b){ return b.length-a.length; });
  var found=false;
  names.forEach(function(a){
    var esc2=a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    var head=new RegExp("^\\s(?:a|an|the|this|that)?\\s?"+esc2+"\\b","i");
    if(head.test(t)){ t=t.replace(head," I"); found=true; }
    var mid=new RegExp("\\b(?:a|an|the|this|that)\\s+"+esc2+"\\b","gi");
    if(mid.test(t)){ t=t.replace(mid,"me"); found=true; }
    var bare=new RegExp("\\b"+esc2+"\\b","gi");
    if(bare.test(t)){ t=t.replace(bare,"me"); found=true; }
  });
  // "He works nights" as the dreamer described them
  var lead=/^\s(he|she|they)\s+(\w+)/i.exec(t);
  if(!found && lead){
    var v=lead[2].toLowerCase(), fix={is:"am",are:"am",was:"was",were:"was",has:"have",does:"do",goes:"go",says:"say"}[v];
    if(!fix) fix=(/[^s]s$/.test(v)&&v.length>3)?v.slice(0,-1):v;
    t=t.replace(lead[0]," I "+fix);
    t=t.replace(/\b(?:his|their)\b/gi,"my").replace(/\bhim\b|\bthem\b/gi,"me")
       .replace(/\bher(?=\s+(?:at|in|on|to|by|with|from|for|again|$))/gi,"me").replace(/\bher\b/gi,"my");
    found=true;
  }
  if(!found) return null;
  t=t.replace(/\bI is\b/g,"I am").replace(/\bI has\b/g,"I have").replace(/\bI does\b/g,"I do")
     .replace(/\byou was\b/g,"you were");
  if(/^\s*I\b/.test(t)){
    var IRR={does:"do",goes:"go",has:"have",is:"am"};
    var ADV=/^(never|always|still|often|also|sometimes|usually|rarely|just|only|then)$/;
    function agree(m,a,v){
      if(ADV.test(v)) return m;
      if(IRR[v]) return a+" "+IRR[v];
      if(/[^s]s$/.test(v)&&v.length>3&&!/(ous|ss|us|is)$/.test(v)) return a+" "+v.slice(0,-1);
      return m;
    }
    t=t.replace(/\b(never|always|still|often|also|sometimes|usually|rarely|just|only)\s+([a-z]+)\b/g,agree);
    t=t.replace(/\b(and|but|or|then)\s+([a-z]+)\b/g,agree);
  }
  t=t.trim();
  t=t.charAt(0).toUpperCase()+t.slice(1);
  if(!/[.!?]$/.test(t)) t+=".";
  return t;
}

function figureFacts(c){
  var h=dreamHour();
  var at=c.atId?specById(c.atId):null, home=c.home?specById(c.home):null, work=c.work?specById(c.work):null;
  var mem=[];
  c.details.forEach(function(d){
    if(/^said: /.test(d)||/^recognised at/.test(d)||/^coloured #/.test(d)) return;
    if(/\bname (is|was)\b|\b(called|named|goes by)\s+[A-Z]/i.test(d)) return;
    var m=toFirstPerson(d,c); if(m) mem.push(m);
  });
  var near=[], recur=[];
  store.objects.forEach(function(o){
    if(o.filler||!KIT[o.archetype]||KIT[o.archetype].cat!=="structure") return;
    var dx=o.x-c.x, dz=o.z-c.z; if(dx*dx+dz*dz<150*150) near.push(placeName(o));
    if(o.nights&&o.nights.length>1) recur.push({n:placeName(o),k:o.nights.length});
  });
  recur.sort(function(a,b){ return b.k-a.k; });
  return {name:c.name,role:c.role,doing:c.doing,asleep:/asleep/.test(c.doing||""),
          at:at?placeName(at):null,home:home?placeName(home):null,work:work?placeName(work):null,
          nights:c.sessions.length,band:greetBand(h),time:hhmm(h),mem:mem,near:near.slice(0,6),
          you:dreamer().name||null,feeling:(store.emotions||[])[0]||null,recur:recur};
}

/* a place name in the middle of a sentence: "the Harrow house", not "The Harrow house" */
function mid(n){ return String(n||"").replace(/^The /,"the "); }

/* the question names something the dreamscape has: which one? */
function askedPlace(q,F,c){
  var low=" "+String(q||"").toLowerCase().replace(/[^a-z' ]/g," ").replace(/\s+/g," ")+" ";
  for(var i=0;i<PHRASES.length;i++){
    if(low.indexOf(" "+PHRASES[i][0]+" ")===-1) continue;
    var o=placeFromWords(PHRASES[i][0],c);
    if(o) return {word:PHRASES[i][0],name:placeName(o),o:o};
  }
  return null;
}

function pickOne(a){ return a[Math.floor(Math.random()*a.length)]; }
function ordinal(n){ return ["","first","second","third","fourth","fifth","sixth","seventh","eighth","ninth","tenth"][n]||(n+"th"); }

/* what the dreamer seems to be asking */
function intentOf(q){
  q=" "+String(q||"").toLowerCase()+" ";
  if(/^\s*(hi|hello|hey|good (morning|evening|night|afternoon)|greetings)\b/.test(q)) return "hello";
  if(/what are you doing|why are you (here|standing|waiting|out)|what('re| are) you (up to|waiting)/.test(q)) return "doing";
  if(/who are you|your name|what are you\b|what's your name/.test(q)) return "who";
  if(/where (do|did) you (live|sleep|stay)|your home|go home|where.*live/.test(q)) return "home";
  if(/(where|what) (do|did) you work|your job|what do you do|by day/.test(q)) return "work";
  if(/what are you doing|why are you (here|standing|waiting)|what('re| are) you (up to|waiting)/.test(q)) return "doing";
  if(/where (am i|are we|is this)|what (is this place|place is this)|what is this/.test(q)) return "place";
  if(/(do you )?(know|remember|recognise|recognize) me/.test(q)) return "known";
  if(/what time|what hour|is it (night|day|late|early)/.test(q)) return "time";
  if(/\b(future|warn|warning|coming|going to happen|will happen|what will|should i)\b/.test(q)) return "ahead";
  if(/how (do|did) (it|you|this) feel|are you (afraid|scared|happy|sad)|how are you/.test(q)) return "feel";
  if(/what happened|tell me|what do you (know|remember)|what('s| is) (behind|beyond|past|inside)/.test(q)) return "tell";
  if(/^\s*why\b/.test(q)) return "why";
  return "other";
}

function keyNoun(q){
  var w=String(q||"").toLowerCase().replace(/[^a-z' ]/g," ").split(/\s+/)
    .filter(function(x){ return x.length>3 && !STOP[normEM(x)] && !/^(what|where|when|which|there|about|would|could|should|your|you're|this|that|here|know|tell)$/.test(x); });
  return w.length?w[w.length-1]:null;
}

/* every line is written against the record; a line that needs a fact the dream never
   gave simply isn't offered */
function candidates(intent,F,q){
  var L=[], mem=F.mem, n=keyNoun(q);
  var memLine=mem.length?pickOne(mem):null;
  function add(ok,s){ if(ok&&s) L.push(s); }
  var P=F.asked;
  if(P && (intent==="tell"||intent==="other"||intent==="place"||intent==="why")){
    add(true,"The "+P.word+" \u2014 "+mid(P.name)+". You haven't dreamt past it yet.");
    add(true,mid(P.name).charAt(0).toUpperCase()+mid(P.name).slice(1)+"? Only what you've seen of it. Go and look.");
    mem.forEach(function(m){ if(m.toLowerCase().indexOf(P.word)>-1) add(true,m); });
  }

  if(intent==="hello"){
    add(true,{night:"You're up late. Or I am.",dawn:"It's nearly light. You should be waking.",morning:"Morning.",day:"Afternoon.",evening:"Evening."}[F.band]);
    add(F.nights>1,"You again. That's the "+ordinal(F.nights)+" time.");
    add(!!F.you,F.you+".");
    add(!!memLine,"Hello. "+memLine);
  }
  if(intent==="who"){
    add(true,"I'm "+F.name+". That's what you've been calling me.");
    add(true,F.name+". You named me yourself.");
    add(!!F.role,"I'm "+F.name+". A "+F.role+", in the part of this you remember.");
    add(!!F.work,"I'm "+F.name+". I'm at "+mid(F.work)+" most nights.");
    add(F.nights>1,F.name+". You've dreamt me "+F.nights+" times and still ask.");
    add(mem.length<2,"I'm what you remember of me. It isn't much yet.");
  }
  if(intent==="home"){
    add(!!F.home,"At "+F.home+". Where else would I go.");
    add(!!F.home,F.home+". You've walked past it.");
    add(!F.home,"You never dreamt me a home. So I stay where you left me.");
    add(!F.home,"Nowhere you've seen. Tell the dream where, and I'll go there.");
  }
  if(intent==="work"){
    add(!!F.work,"By day I'm at "+F.work+".");
    add(!!(F.work&&F.role),"I'm a "+F.role+" at "+F.work+".");
    add(!!(F.role&&!F.work),"I'm a "+F.role+". You haven't dreamt where.");
    add(!F.work&&!F.role,"You never dreamt what I do. I stand here. That's the work.");
  }
  if(intent==="doing"){
    add(F.asleep,"I'm asleep. You're the one walking around.");
    add(!!F.doing&&!F.asleep&&!/dreamt them/.test(F.doing),"I'm "+F.doing+(F.at?(/^at work/.test(F.doing)?" \u2014 "+mid(F.at):", near "+mid(F.at)):"")+".");
    add(!!F.doing&&!!F.at&&!F.asleep&&!/dreamt them/.test(F.doing),"This hour, I'm always "+(/^at work/.test(F.doing)?"at "+mid(F.at):F.doing)+".");
    add(/dreamt them/.test(F.doing||""),"Standing where you dreamt me. I haven't been told to do anything else.");
    add(!!memLine,"The same as before. "+memLine);
  }
  if(intent==="place"){
    add(!!F.at,"This is "+F.at+". Or near enough.");
    add(F.near.length>1,"There's "+F.near.slice(0,3).join(", ")+" around us. You built all of it.");
    add(true,"You tell me. You made this place.");
  }
  if(intent==="known"){
    add(F.nights>1,"I know you. This is the "+ordinal(F.nights)+" night you've come.");
    add(!!F.you,"You're "+F.you+".");
    add(!!memLine,"I remember. "+memLine);
    add(F.nights===1,"Only a little. You've dreamt me once.");
  }
  if(intent==="time"){
    add(true,"It's "+F.time+".");
    add(F.band==="night","It's "+F.time+". The hour when most of them have gone in.");
    add(F.band==="dawn","It's nearly light. You'll wake soon and lose me.");
  }
  if(intent==="ahead"){
    add(true,"I can't tell you what's coming. I'm made of what already happened.");
    add(F.recur.length>0,F.recur.length?(F.recur[0].n+" has come back "+F.recur[0].k+" nights now. That's the only thing I'd watch."):"");
    add(true,"If something's coming, write it down tonight. Then you'll know whether I was right.");
  }
  if(intent==="feel"){
    add(!!F.feeling,"It felt "+F.feeling+" here, the night you came. It still does.");
    add(true,"About the way you left me.");
  }
  if(intent==="tell"){
    mem.forEach(function(m){
      add(true,"What I know is this. "+m);
      add(true,m);
      add(true,"I remember this much. "+m);
    });
    F.near.forEach(function(p){ add(true,"Past "+mid(p)+" there's more you haven't dreamt yet."); });
    add(!mem.length,"Not much. You haven't told the dream much about me.");
  }
  if(intent==="why"){
    add(true,"Because you put me here.");
    add(!!memLine,"Because of this: "+(/^I\b/.test(memLine)?memLine:memLine.charAt(0).toLowerCase()+memLine.slice(1)));
    add(true,"Ask the part of you that remembers. It isn't me.");
  }
  if(intent==="other"){
    add(!!n,"The "+n+"? You'd know better than me. You dreamt it.");
    add(!!n&&F.near.length>0,"The "+n+". Somewhere near "+pickOne(F.near)+", I think.");
    mem.forEach(function(m){ add(true,m); });
    add(true,"Say it another way.");
    add(true,"I only know what you wrote down.");
  }
  if(intent==="spent"){
    add(true,"You keep asking me that.");
    add(true,"I've told you everything you gave me.");
    add(true,"There's no more of me yet. Tell the dream more and there will be.");
    add(true,"Ask me something else.");
    add(true,"Same answer as before. I haven't changed.");
    add(true,"You already know this. You're the one who dreamt it.");
  }
  return L;
}

/* the figure's reply: answers the question, sometimes offers a memory, never repeats */
function localVoice(c,q){
  var F=figureFacts(c);
  var intent=intentOf(q);
  F.asked=askedPlace(q,F,c);
  var said=c.said||(c.said=[]);
  function fresh(s){
    if(said.indexOf(s)>-1) return false;
    for(var i=0;i<F.mem.length;i++) if(s.indexOf(F.mem[i])>-1 && said.indexOf(F.mem[i])>-1) return false;
    return true;
  }
  var opens=c.opens||(c.opens=[]);
  function firstWord(s){ return String(s).split(/\s+/)[0].replace(/[^A-Za-z']/g,"").toLowerCase(); }
  function freshForm(s){ return fresh(s) && opens.indexOf(firstWord(s))===-1; }
  var pool=candidates(intent,F,q).filter(freshForm);
  if(!pool.length) pool=candidates("other",F,q).filter(freshForm);
  if(!pool.length) pool=candidates("spent",F,q).filter(fresh);
  if(!pool.length){ said.length=0; pool=candidates(intent,F,q); }
  /* a line that shares words with the question beats one that doesn't */
  var qw={}; tokensOf(q).forEach(function(t){ if(!STOP[t]) qw[t]=1; });
  var scored=pool.map(function(s){ var k=0; tokensOf(s).forEach(function(t){ if(qw[t]) k++; }); return {s:s,k:k}; });
  var top=Math.max.apply(null,scored.map(function(x){ return x.k; }).concat([0]));
  if(top>0) pool=scored.filter(function(x){ return x.k===top; }).map(function(x){ return x.s; });
  var line=pickOne(pool);
  if(intent!=="tell" && intent!=="spent" && Math.random()<0.28){
    var extras=F.mem.filter(function(m){ return line.indexOf(m)===-1 && said.indexOf(m)===-1; });
    if(extras.length) line+=" "+pickOne(extras);
  }
  F.mem.forEach(function(m){ if(line.indexOf(m)>-1 && said.indexOf(m)===-1) said.push(m); });
  said.push(line);
  if(said.length>40) said.splice(0,said.length-40);
  opens.push(firstWord(line)); if(opens.length>2) opens.shift();
  return line;
}

/* "the mill", "the tall house on the corner", "St Mara's" -> something already standing.
   a place the dreamscape doesn't have is not invented for them. */
function placeFromWords(words,c){
  var w=String(words).trim(); if(!w) return null;
  var named=byName(w); if(named&&!named.filler) return named;
  var low=" "+w.toLowerCase()+" ", arch=null;
  for(var i=0;i<PHRASES.length;i++){ if(low.indexOf(" "+PHRASES[i][0]+" ")>-1){ arch=PHRASES[i][1]; break; } }
  if(!arch) return null;
  var ax=c.anchor?c.anchor.x:c.x, az=c.anchor?c.anchor.z:c.z, best=null, bd=Infinity;
  store.objects.forEach(function(o){
    if(o.filler||o.archetype!==arch) return;
    var d=(o.x-ax)*(o.x-ax)+(o.z-az)*(o.z-az); if(d<bd){ bd=d; best=o; }
  });
  return best;
}

/* ---- telling the dream about a figure: each sentence becomes something recorded ---- */
function wakeNeed(c){
  return Math.max(0,WAKE_AT-(c.details.length+(c.sessions.length-1)*2));
}
function describeFigure(c,text){
  var added=0;
  if(!c.src) c.src={};
  var nm=/\b(?:[Hh]is|[Hh]er|[Tt]heir|[Ii]ts) name (?:is|was) ([A-Z][a-zA-Z'-]+)/.exec(text)||
         /\b(?:[Cc]alled|[Nn]amed|[Gg]oes by) ([A-Z][a-zA-Z'-]+)/.exec(text);
  if(nm){
    var was=c.name; c.name=nm[1];
    var al=normName(nm[1]); if(c.aka.indexOf(al)===-1) c.aka.push(al);
    if(!c.src) c.src={}; c.src.name="stated";
    var sp=c.objId?specById(c.objId):null; if(sp){ sp.label=c.name; }
    if(was!==c.name) added++;
  }
  String(text).split(/(?<=[.!?])\s+|\n+/).forEach(function(s){
    s=s.trim(); if(s.length<4) return;
    if(addDetail(c,s)) added++;
    var low=s.toLowerCase();
    if(/\bnights?\b|\bafter dark\b|\bat night\b/.test(low)&&/\bwork|shift|job\b/.test(low)){ c.shift="night"; c.src.shift="stated"; }
    else if(/\b(days|by day|daytime)\b/.test(low)&&/\bwork|shift|job\b/.test(low)){ c.shift="day"; c.src.shift="stated"; }
    var wm=/\b(?:works?|worked|working|job is|shifts?)\b[^.]*?\b(?:at|in)\s+(?:the\s+|a\s+)?([a-z' -]+?)\s*(?:[.,;!?]|$)/i.exec(s);
    var hm=/\b(?:lives?|lived|living|sleeps?|stays?|home is)\b[^.]*?\b(?:at|in)\s+(?:the\s+|a\s+)?([a-z' -]+?)\s*(?:[.,;!?]|$)/i.exec(s);
    if(wm){ var w=placeFromWords(wm[1],c); if(w){ c.work=w.id; c.src.work="stated"; } }
    if(hm){ var h=placeFromWords(hm[1],c); if(h){ c.home=h.id; c.src.home="stated"; } }
  });
  if(c.shift&&!c.routine){ var r0=routineFrom(c.details.join(". "),c.role||"worker",c.shift); if(r0){ c.routine=r0; c.src.routine="stated"; } }
  if(c.sessions.indexOf(store.session)===-1) c.sessions.push(store.session);
  if(typeof assignLife==="function") assignLife(c);
  var woke=checkWake(c);
  var sp2=c.objId?specById(c.objId):null; if(sp2) refresh(sp2);
  save();
  return {added:added,woke:woke};
}
