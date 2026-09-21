/* Dream Walker's Atlas — books.js
   Artemidorus and Miller: indexing, matching, interpreting
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   12f. THE BOOKS — Artemidorus (1644) and Miller (1901), stored
        whole, consulted only when asked, and only for what the
        dream actually holds
   ============================================================ */
var BOOKS=null, BIX=null;

/* one normaliser for 1644, 1901 and the dreamer, so all three meet */
var EMVAR={bloud:"blood",sonne:"son",yron:"iron",woolfe:"wolf",wolfe:"wolf",sunne:"sun",
  moone:"moon",starre:"star",starres:"stars",yeare:"year",eies:"eyes",shippe:"ship"};
function normEM(w){
  w=String(w).toLowerCase().replace(/ſ/g,"s").replace(/é/g,"e").replace(/[^a-z]/g,"");
  if(EMVAR[w]) w=EMVAR[w];
  if(w.length<3) return w;
  w=w.replace(/^v(?=[^aeiou])/,"u").replace(/^y(?=[^aeiou])/,"i");
  w=w.replace(/([aeiou])u(?=[aeiou])/g,"$1v");
  w=w.replace(/ie$/,"y");
  w=w.replace(/(.)y(?=[^aeiou]|$)/g,function(m,a){ return /[aeiou]/.test(a)?m:a+"i"; });
  if(w.length>3 && /s$/.test(w) && !/ss$/.test(w)) w=w.slice(0,-1);
  w=w.replace(/([^aeiou])re$/,"$1er");
  if(w.length>3 && /e$/.test(w)) w=w.slice(0,-1);
  w=w.replace(/([bcdfgklmnprtz])\1$/,"$1");
  return w;
}

var STOPRAW=("the and that this with from have were was had has for but not you your our their them they she her him his "+
 "its are been being into onto upon over under about above after again before then than there here where when what which who "+
 "whom whose while would could should shall will can may might must also just very much many more most some any all each every "+
 "other another such only own same too out off down one two three first last next still even ever never always because though "+
 "through during until unto doth hath thee thou thy thine thereof whereof wherein whereby hee shee wee bee doe goe beene "+
 "dream dreame dreamer dreaming dreamt dreamed dreams dreames signifie signify signifies signifieth denote denotes denoteth "+
 "foretell foretells foretelleth portend portends indicate indicates betoken betokens mean means meaneth "+
 "thing things man men woman women person persons someone something somewhere like felt feel seemed seem looked look saw see "+
 "seeing seen went go going came come coming got get made make making knew know thought think told tell said say "+
 "back way time times day days night nights good bad great little small large long old new began kept left right "+
 "young maid maiden lover affairs fortune business friends enemies interests").split(/\s+/);
var STOP={};
STOPRAW.forEach(function(w){ STOP[normEM(w)]=1; STOP[w]=1; });

function tokensOf(text){
  var out=[], m, re=/[A-Za-zſé']+/g;
  while((m=re.exec(String(text||"")))){ var t=normEM(m[0]); if(t.length>=3) out.push(t); }
  return out;
}

function books(){
  if(BOOKS) return BOOKS;
  if(typeof DW_BOOKS==="undefined"||!DW_BOOKS) return null;
  BOOKS=DW_BOOKS;
  indexBooks();
  return BOOKS;
}

function indexBooks(){
  BIX={art:{},artHead:{},mExact:{},mNorm:{},mPhrase:[]};
  function add(map,t,i,w){ if(!map[t]) map[t]={}; map[t][i]=(map[t][i]||0)+w; }
  BOOKS.art.sections.forEach(function(s,i){
    if(!s.b) return;
    tokensOf(String(s.h).replace(/([A-Za-zſé]+)-([A-Za-zſé]+)/g,"$1$2")).forEach(function(t){
      if(STOP[t]) return; add(BIX.art,t,i,6); (BIX.artHead[i]=BIX.artHead[i]||{})[t]=1; });
    var c={};
    tokensOf(s.t).forEach(function(t){ if(!STOP[t]) c[t]=(c[t]||0)+1; });
    for(var t in c) add(BIX.art,t,i,Math.min(3,c[t]));
  });
  BOOKS.miller.entries.forEach(function(e,i){
    var w=e.w.toLowerCase().replace(/[^a-z' -]/g,"").trim();
    if(/[\s-]/.test(w)) BIX.mPhrase.push({p:w.replace(/-/g," "),i:i});
    if(!(w in BIX.mExact)) BIX.mExact[w]=i;
    var n=normEM(w); if(n && !(n in BIX.mNorm)) BIX.mNorm[n]=i;
  });
  resolveActions();
}

/* the verbs of dreaming don't share their spelling with their chapters,
   and "flye" and "flyes" look alike once endings go — so the common ones
   are pointed at their chapters directly */
var ACTIONS={};
[
 [["fly","flew","flown","flying","soar","soared","soaring"],["To flye"],["Flying","Flight"]],
 [["flies","flys"],["Of Flyes"],["Flies"]],
 [["float","floated","floating","hover","hovered","hovering"],[],["Floating"]],
 [["fall","fell","fallen","falling"],[],["Fall"]],
 [["drown","drowned","drowning"],[],["Drowning"]],
 [["climb","climbed","climbing"],[],["Climbing"]],
 [["run","ran","running","fled","fleeing"],[],["Running"]],
 [["hunt","hunted","hunting"],["Of Dogs and the Cha"],[]],
 [["die","died","dying"],["Of the dead reviving"],["Dying"]],
 [["dead","corpse","corpses"],["Of the Dead"],["Dead"]],
 [["death"],[],["Death"]],
 [["naked","nude"],[],["Naked"]],
 [["kill","killed","killing"],[],["Killing"]],
 [["murder","murdered","murdering"],[],["Murder"]],
 [["marry","married","marrying","wedding","wed"],["Of Weddings"],["Marriage","Wedding"]],
 [["pregnant","pregnancy"],["To be big with child"],["Pregnancy"]],
 [["born","birth"],["Of the birth"],["Birth"]],
 [["baby","babies","infant"],["To have Children"],["Baby"]],
 [["snake","snakes","serpent","serpents"],[],["Snakes","Serpents"]],
 [["spider","spiders"],[],["Spider"]],
 [["key","keys"],["Of the Key"],["Key"]],
 [["hair"],["Of Long Haire"],["Hair"]],
 [["money","coins","treasure"],["Of Money"],["Money"]],
 [["war","battle","soldiers","army"],["Of Warre"],["War"]],
 [["ghost","ghosts","phantom","apparition"],[],["Ghost","Apparition"]],
 [["tooth","teeth"],["Of the Teeth"],["Teeth"]],
 [["mirror","mirrors"],["Of the Looking"],["Mirror"]],
 [["storm","storms"],[],["Storm"]],
 [["earthquake"],[],["Earthquake"]]
].forEach(function(row){
  var verb=/^(fly|float|fall|drown|climb|run|hunt|die|kill|murder|marry)$/.test(row[0][0]);
  row[0].forEach(function(w){ ACTIONS[w]={a:row[1],m:row[2],wt:verb?22:10}; });
});
function resolveActions(){
  for(var w in ACTIONS){
    var A=ACTIONS[w];
    A.ai=[]; A.mi=[];
    A.a.forEach(function(pre){
      var p=pre.toLowerCase().replace(/ſ/g,"s");
      BOOKS.art.sections.forEach(function(s,i){
        if(s.b && s.h.toLowerCase().replace(/ſ/g,"s").indexOf(p)===0) A.ai.push(i);
      });
    });
    A.m.forEach(function(h){ var i=BIX.mExact[h.toLowerCase()]; if(i!==undefined) A.mi.push(i); });
  }
}

/* ---- what the dreamer has decided about the held-back 1901 material ---- */
function released(){ if(!store.released) store.released={}; return store.released; }
function entryHeld(e){
  var k="w:"+e.w;
  return e.hold && !released()[k] && !(typeof cloudReleased==="function" && cloudReleased(k));
}
function readingHeld(e,k){
  var key="r:"+e.w+":"+k;
  return e.hr && e.hr.indexOf(k)>-1 && !released()[key] && !(typeof cloudReleased==="function" && cloudReleased(key));
}

/* a Miller entry that only says "See Cask" hands you to Cask */
function followSee(i,depth){
  var e=BOOKS.miller.entries[i];
  if(!e||depth>3) return i;
  if(e.p.length) return i;
  var n=(e.n||[]).join(" "), m=/See\s+([A-Z][A-Za-z' -]+?)[.,;]/.exec(n+".");
  if(!m) return i;
  var j=BIX.mExact[m[1].toLowerCase().trim()];
  return (j===undefined)?i:followSee(j,(depth||0)+1);
}

var PHYSICAL=/\b(sick|ill|fever|feverish|pain|painful|aching|ache|hungry|starving|thirst|thirsty|freezing|sweating|bathroom|toilet|alarm clock|deadline|exam|worried|anxious|anxiety|medicine|pills|drunk|hungover|hangover|injured|nauseous|couldn't breathe|could not breathe)\b/i;

function interpretText(text,night){
  var B=books(); if(!B) return null;
  var raw=String(text||"");
  var weight={}, acts=[];
  (" "+raw.toLowerCase().replace(/[^a-z']/g," ")+" ").split(/\s+/).forEach(function(w){ if(ACTIONS[w]) acts.push(ACTIONS[w]); });
  var actWords={};
  raw.toLowerCase().replace(/[^a-z']/g," ").split(/\s+/).forEach(function(w){ if(ACTIONS[w]) actWords[normEM(w)]=1; });
  tokensOf(raw).forEach(function(t){ if(!STOP[t]&&!actWords[t]) weight[t]=(weight[t]||0)+1; });

  var objs=store.objects.filter(function(o){
    if(o.filler||!o.nights) return false;
    return night===null ? o.nights.indexOf(store.session)>-1 : o.nights.indexOf(night)>-1;
  });
  objs.forEach(function(o){ tokensOf(o.label||"").forEach(function(t){ if(!STOP[t]) weight[t]=(weight[t]||0)+1; }); });

  /* ---- Miller: his headwords, exact first, then loose ---- */
  var low=" "+raw.toLowerCase().replace(/[^a-z' ]/g," ").replace(/\s+/g," ")+" ";
  var mHit={};
  BIX.mPhrase.forEach(function(ph){ if(low.indexOf(" "+ph.p+" ")>-1) mHit[ph.i]=(mHit[ph.i]||0)+5; });
  var words=low.trim().split(" ").concat(objs.map(function(o){ return (o.label||"").toLowerCase(); }));
  words.forEach(function(w){
    w=w.trim(); if(w.length<3) return;
    var n=normEM(w); if(STOP[n]||STOP[w]||ACTIONS[w]) return;
    var i=BIX.mExact[w];
    if(i===undefined) i=BIX.mExact[w.replace(/s$/,"")];
    if(i===undefined) i=BIX.mNorm[n];
    if(i!==undefined) mHit[i]=(mHit[i]||0)+2;
  });
  acts.forEach(function(A){ A.mi.forEach(function(i){ mHit[i]=(mHit[i]||0)+(A.wt>15?9:5); }); });
  var mOut={}, mList=[];
  for(var k in mHit){
    var j=followSee(+k,0), e=B.miller.entries[j];
    if(!e||!e.p.length||entryHeld(e)) continue;
    mOut[j]=(mOut[j]||0)+mHit[k];
  }
  for(var j2 in mOut){
    var ent=B.miller.entries[j2];
    var rs=[];
    ent.p.forEach(function(p,ix){
      if(readingHeld(ent,ix)) return;
      var sc=0; tokensOf(p).forEach(function(t){ if(weight[t]&&!STOP[t]) sc+=1; });
      rs.push({i:ix,t:p,s:sc});
    });
    if(!rs.length) continue;
    rs.sort(function(a,b){ return b.s-a.s; });
    mList.push({w:ent.w,score:mOut[j2]+rs[0].s*0.5,readings:rs,notes:ent.n||[]});
  }
  mList.sort(function(a,b){ return b.score-a.score; });
  mList=mList.slice(0,14);

  /* ---- Artemidorus: headings weigh far more than a passing mention ---- */
  var aSc={}, aWhy={};
  for(var t in weight){
    var post=BIX.art[t]; if(!post) continue;
    for(var si in post){
      aSc[si]=(aSc[si]||0)+post[si]*Math.min(2,weight[t]);
      (aWhy[si]=aWhy[si]||{})[t]=1;
    }
  }
  acts.forEach(function(A){
    A.ai.forEach(function(si){
      aSc[si]=(aSc[si]||0)+A.wt;
      var hw=BIX.artHead[si]||{}; aWhy[si]=aWhy[si]||{};
      for(var t in hw) aWhy[si][t]=1;
    });
  });
  /* a chapter answers only if its heading does, or its body matches strongly on several words */
  var aList=Object.keys(aSc).map(function(si){ return {i:+si,s:aSc[si]}; })
    .filter(function(x){
      var head=BIX.artHead[x.i]||{}, hit=false;
      for(var t in aWhy[x.i]) if(head[t]) hit=true;
      return hit ? x.s>=6 : (x.s>=10 && Object.keys(aWhy[x.i]).length>=3);
    })
    .sort(function(a,b){ return b.s-a.s; }).slice(0,5)
    .map(function(x){
      var sec=B.art.sections[x.i];
      var paras=sec.t.split(/\n\n/);
      var show;
      if(sec.t.length<1100) show=paras.map(function(p,ix){ return ix; });
      else {
        var pr=paras.map(function(p,ix){
          var sc=0; tokensOf(p).forEach(function(t){ if(aWhy[x.i][t]) sc++; }); return {ix:ix,sc:sc};
        }).filter(function(o){ return o.sc>0; }).sort(function(a,b){ return b.sc-a.sc; }).slice(0,2)
          .map(function(o){ return o.ix; }).sort(function(a,b){ return a-b; });
        show=pr.length?pr:[0];
      }
      return {book:sec.b,head:sec.h,paras:paras,show:show,why:aWhy[x.i],full:sec.t.length<1100};
    });

  /* ---- your own record: what this tends to arrive alongside ---- */
  var own=personalReading(objs,night);

  return {miller:mList,art:aList,own:own,physical:PHYSICAL.test(raw),
          matched:Object.keys(weight),dreamer:dreamerBrief()};
}

function personalReading(objs,night){
  var sealed=store.sessions.map(function(r){ return r.n; });
  if(sealed.length<2) return [];
  var kinds={};
  objs.forEach(function(o){ kinds[o.archetype]=1; });
  var out=[];
  Object.keys(kinds).forEach(function(k){
    var nightsOf={};
    store.objects.forEach(function(o){
      if(o.filler||o.archetype!==k||!o.nights) return;
      o.nights.forEach(function(n){ if(sealed.indexOf(n)>-1) nightsOf[n]=1; });
    });
    var ns=Object.keys(nightsOf).map(Number);
    if(ns.length<2) return;
    var co={}, out3={hit:0,partial:0,miss:0};
    ns.forEach(function(n){
      store.objects.forEach(function(o){
        if(o.filler||o.archetype===k||!o.nights||o.nights.indexOf(n)===-1) return;
        co[o.archetype]=(co[o.archetype]||0)+1;
      });
      var r=nightRecord(n);
      if(r&&r.outcomes&&r.outcomes.length){ var last=r.outcomes[r.outcomes.length-1].kind; out3[last]=(out3[last]||0)+1; }
    });
    var top=Object.keys(co).sort(function(a,b){ return co[b]-co[a]; }).slice(0,3);
    out.push({kind:k,nights:ns.length,of:sealed.length,with:top,outcomes:out3});
  });
  out.sort(function(a,b){ return b.nights-a.nights; });
  return out.slice(0,6);
}

/* ============================================================
   12g. INTERPRETING — the books speak first, in their own words
   ============================================================ */
var lastInterp=null;

function marked(text,why){
  return String(text).split(/([A-Za-zſé']+)/).map(function(part,ix){
    if(ix%2===0) return esc(part);
    var n=normEM(part);
    return (why[n]&&!STOP[n]&&n.length>=3)?"<mark>"+esc(part)+"</mark>":esc(part);
  }).join("");
}

function openInterp(night){
  var text, title;
  if(night===null){
    text=(store.transcript||"").trim();
    title="Tonight\u2019s dream";
    if(!text){ setStatus("<i>Nothing recorded tonight to interpret.</i>"); return; }
  } else {
    var r=nightRecord(night); if(!r) return;
    text=currentText(r); title=r.title;
  }
  var B=books();
  if(!B){ setStatus("<i>The books are not in this build.</i>"); return; }
  var res=interpretText(text,night);
  lastInterp={night:night,text:text,res:res,title:title};
  var why={}; res.matched.forEach(function(t){ why[t]=1; });

  var h="";
  var d=dreamer();
  h+='<p class="x-for">'+(d.name||d.about||d.practice
      ? "Read for "+esc(d.name||"the dreamer")+(d.practice?", "+esc(d.practice.split(/[.\n]/)[0]):"")+". Both books hold that the dreamer\u2019s own life decides what a symbol means \u2014 weigh these with that in mind."
      : "Both books hold that the dreamer\u2019s own life decides what a symbol means. Filling in <i>Who is dreaming</i> lets the readings account for it.")+"</p>";

  if(res.physical){
    h+='<div class="x-kind"><h4>This may be a dream of the body</h4>'+
       '<p>'+esc(B.principles.miller)+'</p><cite>Miller, 1901, preface</cite>'+
       '<p>'+esc(B.principles.art)+'</p><cite>Artemidorus, trans. Wood, 1644, the preface</cite>'+
       '<p style="font-family:var(--sans);font-size:12.5px;color:var(--dim)">Something in what you recorded touches the body or the waking mind\u2019s worries. Both books would weigh such a dream lightly as a foretelling.</p></div>';
  }

  h+='<div class="x-cols">';
  h+='<div class="x-col"><h3>Artemidorus</h3><div class="x-src">'+esc(B.art.title)+', '+B.art.year+', trans. R. Wood</div>';
  if(!res.art.length) h+='<p class="x-none">Nothing in the five books answers closely to this dream.</p>';
  res.art.forEach(function(a){
    var bk=["","First","Second","Third","Fourth","Fifth"][a.book]||"";
    h+='<div class="x-e"><h5>'+esc(a.head)+'<small>'+bk+' Booke</small></h5>';
    a.show.forEach(function(ix){ h+='<p>'+marked(a.paras[ix],a.why)+'</p>'; });
    if(!a.full && a.paras.length>a.show.length){
      h+='<details><summary>the whole of this chapter</summary>'+
        a.paras.map(function(p,ix){ return a.show.indexOf(ix)>-1?"":'<p class="dim">'+marked(p,a.why)+'</p>'; }).join("")+'</details>';
    }
    h+='</div>';
  });
  h+='</div>';

  h+='<div class="x-col"><h3>Miller</h3><div class="x-src">'+esc(B.miller.title)+', '+B.miller.year+'</div>';
  if(!res.miller.length) h+='<p class="x-none">None of Miller\u2019s headings appear in this dream.</p>';
  res.miller.forEach(function(m){
    var best=m.readings.filter(function(r){ return r.s>0; });
    if(!best.length) best=[m.readings[0]];
    var rest=m.readings.filter(function(r){ return best.indexOf(r)===-1; });
    h+='<div class="x-e"><h5>'+esc(m.w)+'</h5>';
    best.slice(0,2).forEach(function(r){ h+='<p>'+marked(r.t,why)+'</p>'; });
    var more=best.slice(2).concat(rest);
    if(more.length) h+='<details><summary>'+more.length+' more reading'+(more.length>1?"s":"")+'</summary>'+
      more.map(function(r){ return '<p class="dim">'+marked(r.t,why)+'</p>'; }).join("")+'</details>';
    m.notes.forEach(function(n){ if(!/^See\s/.test(n)) h+='<p class="fn">'+esc(n)+'</p>'; });
    h+='</div>';
  });
  h+='</div></div>';

  h+='<div class="x-own"><h3>In your own record</h3>';
  if(!res.own.length){
    h+='<p><i>Once a place has turned up on at least two sealed nights, this shows what it tends to arrive alongside, and what came of those nights.</i></p>';
  } else res.own.forEach(function(o){
    var oc=o.outcomes, checked=oc.hit+oc.partial+oc.miss;
    h+='<p><b>'+esc(o.kind)+'</b> \u2014 '+o.nights+' of your '+o.of+' sealed dreams'+
      (o.with.length?'; most often alongside '+o.with.map(esc).join(", "):"")+'.'+
      (checked?' <i>Of those you checked: '+oc.hit+' came true, '+oc.partial+' partly, '+oc.miss+' came to nothing.</i>':' <i>None of those nights checked yet.</i>')+'</p>';
  });
  h+='</div>';

  var c=cfg();
  h+='<div class="x-read"><h3>A reading drawn from these passages</h3>';
  if(c.mode==="off"){
    h+='<p class="note">Connect Grok in Settings and a reading can be drawn from the passages above \u2014 only from them, with each point credited to its book.</p>';
  } else {
    h+='<div class="out" id="x-out"></div><div class="row" style="margin-top:10px"><button class="btn" id="x-draw">Draw a reading</button></div>'+
       '<p class="note">Built only from the passages shown and your own record. Sealed dream text is sent to your model to do this.</p>';
  }
  h+='</div>';

  h+='<div class="x-foot">Artemidorus: '+esc(B.art.rights)+'. Miller: '+esc(B.miller.rights)+
     '. Spelling as printed. Some 1901 readings are held back for review in Settings.</div>';

  document.getElementById("x-title").textContent="Interpreting \u2014 "+title;
  document.getElementById("x-body").innerHTML=h;
  document.getElementById("x-body").scrollTop=0;
  var dr=document.getElementById("x-draw");
  if(dr) dr.onclick=drawReading;
  document.getElementById("interp").classList.add("open");
}
function closeInterp(){ document.getElementById("interp").classList.remove("open"); }

/* the model may only speak from what the books said */
function drawReading(){
  if(!lastInterp) return;
  var c=cfg(), res=lastInterp.res, out=document.getElementById("x-out");
  var url=c.mode==="proxy"?c.proxy:"https://api.x.ai/v1/chat/completions";
  var headers={"Content-Type":"application/json"};
  if(c.mode==="direct"&&c.key) headers["Authorization"]="Bearer "+c.key;
  var passages=[];
  res.art.forEach(function(a){
    passages.push("[Artemidorus, 1644 \u2014 "+a.head+"]\n"+a.show.map(function(ix){ return a.paras[ix]; }).join("\n"));
  });
  res.miller.forEach(function(m){
    passages.push("[Miller, 1901 \u2014 "+m.w+"]\n"+m.readings.slice(0,3).map(function(r){ return r.t; }).join("\n"));
  });
  var own=res.own.map(function(o){ return o.kind+": "+o.nights+" of "+o.of+" dreams, alongside "+(o.with.join(", ")||"nothing in particular"); }).join("\n");
  var sys=[
    "You interpret one dream using ONLY the passages supplied from two books: Artemidorus, The Interpretation of Dreames (1644, trans. R. Wood), and Gustavus Hindman Miller, Ten Thousand Dreams Interpreted (1901).",
    "Credit each point to its book by name. Where they disagree, say so plainly. Where both are silent on something in the dream, say it is not addressed.",
    "Do not add meanings from any other tradition or from your own knowledge. Do not invent passages.",
    "Both books hold that the dreamer's circumstances decide what a symbol means; use what is known of the dreamer where it bears.",
    res.physical?"Both books would class dreams arising from bodily state or waking worry as carrying little prophetic weight; note this.":"",
    "Plain prose, no headings, no lists, under 230 words."
  ].filter(Boolean).join(" ");
  var user="THE DREAMER\n"+(res.dreamer||"Nothing recorded about them.")+
    "\n\nTHE DREAM\n"+lastInterp.text.slice(0,3500)+
    "\n\nPASSAGES\n"+passages.join("\n\n").slice(0,9000)+
    (own?"\n\nTHEIR OWN RECORD\n"+own:"");
  out.textContent="Reading\u2026";
  fetch(url,{method:"POST",headers:headers,body:JSON.stringify({
    model:c.model||"grok-4.3",temperature:0.4,max_tokens:700,
    messages:[{role:"system",content:sys},{role:"user",content:user}]
  })})
  .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
  .then(function(d){
    out.textContent=((d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||"").trim()||"No reading came back.";
  })
  .catch(function(e){
    var m=String(e.message||e);
    out.textContent=/Failed to fetch|NetworkError/i.test(m)?"The browser blocked that call. Use proxy mode.":"Could not draw a reading ("+m+").";
  });
}

/* ---- the review list for held-back 1901 material ---- */
function renderHeld(){
  var B=books(); if(!B) return;
  var rel=released(), items=[];
  B.miller.entries.forEach(function(e){
    if(e.hold) items.push({key:"w:"+e.w,w:e.w,t:"the whole entry",q:e.p[0]||""});
    (e.hr||[]).forEach(function(k){ items.push({key:"r:"+e.w+":"+k,w:e.w,t:"reading "+(k+1)+" of "+e.p.length,q:e.p[k]}); });
  });
  document.getElementById("held-n").textContent=items.filter(function(i){ return !rel[i.key]; }).length;
  document.getElementById("held-list").innerHTML=items.map(function(i){
    var on=!!rel[i.key];
    return '<div class="hl"><b>'+esc(i.w)+'</b> \u2014 '+i.t+' \u00b7 '+(on?"released":"held")+
      '<q>'+esc(i.q.slice(0,220))+(i.q.length>220?"\u2026":"")+'</q>'+
      '<button class="btn" data-k="'+esc(i.key)+'">'+(on?"Hold it back again":"Release it")+'</button></div>';
  }).join("");
  Array.prototype.forEach.call(document.querySelectorAll("#held-list [data-k]"),function(b){
    b.onclick=function(){
      var k=b.getAttribute("data-k");
      if(rel[k]) delete rel[k]; else rel[k]=1;
      save(); renderHeld();
    };
  });
}

