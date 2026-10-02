/* SomnuMatrix — lot-build.js
   your own ground in Somnucor. A dreamer who owns or leases a lot has the
   full run of it: say what should stand there and it stands there, move it,
   turn it, take it away, and arrange the house inside however they like.
   What is built is kept on the server with the lot, so it stands in the city
   for every dreamer whether its owner is online or not — and, if they want,
   a copy goes into their own dream as well.
   loaded as a plain script; shares scope with the other files */
"use strict";

var LOT_R=20;                                   /* how far a lot reaches round its house */
var LOTB={open:false,lot:null,items:[],copy:true,saved:null,msg:""};
var LOT_SCAN=(typeof scanText==="function")?scanText:null;   /* the dream's own reading, before it was redirected */

function lotPlots(){ return (store.plots||[]).concat(store.districtPlots||[]); }
function lotHome(name){
  var p=lotPlots().filter(function(q){ return q.name===name; })[0];
  return p&&p.homeId?specById(p.homeId):null;
}
function lotToLocal(h,x,z){ var c=Math.cos(h.rot||0), s=Math.sin(h.rot||0), dx=x-h.x, dz=z-h.z;
  return {x:dx*c-dz*s, z:dx*s+dz*c}; }
function lotToWorld(h,lx,lz){ var c=Math.cos(h.rot||0), s=Math.sin(h.rot||0);
  return {x:h.x+lx*c+lz*s, z:h.z-lx*s+lz*c}; }

/* the lot you are standing on, if it is yours */
function myLotHere(){
  if(!walkMode||store.inside) return null;
  var r=(typeof somnucorRealm==="function")?somnucorRealm():null;
  if(!r||(store.here||0)!==r.id) return null;
  var mine=(typeof standing!=="undefined"&&standing&&standing.lots)||[], P=camera.position;
  for(var i=0;i<mine.length;i++){
    var h=lotHome(mine[i].lot); if(!h) continue;
    if(Math.hypot(P.x-h.x,P.z-h.z)<LOT_R) return {id:mine[i].lot_id,name:mine[i].lot,home:h};
  }
  return null;
}

/* ---- drawing what stands on every lot, for everyone ---- */
function lotItemSpecs(lotId,home,items){
  var r=somnucorRealm(); if(!r||!home) return [];
  return (items||[]).map(function(it,i){
    if(!it||!KIT[it.a]) return null;
    var w=lotToWorld(home,+it.x||0,+it.z||0), d=KIT[it.a];
    var attrs={}; if(it.s&&it.s!==1) attrs.s=Math.max(0.3,Math.min(3,+it.s));
    if(it.c!==undefined&&it.c!==null) attrs.c=it.c;
    return {id:"lt"+lotId+"_"+i,archetype:it.a,attrs:attrs,x:w.x,z:w.z,rot:(home.rot||0)+(+it.r||0),
      solid:d.cat!=="being",detail:3,nights:[store.session],realm:r.id,hub:true,city:true,lotItem:lotId,
      name:it.n||null,label:it.n||null,named:it.n?"stated":null,peopled:true};
  }).filter(Boolean);
}
function lotDrawItems(lotId,home,items){
  var pre="lt"+lotId+"_";
  for(var i=store.objects.length-1;i>=0;i--){
    var o=store.objects[i];
    if(o.id.indexOf(pre)!==0) continue;
    if(meshes[o.id]){ scene.remove(meshes[o.id]); delete meshes[o.id]; }
    store.objects.splice(i,1);
  }
  lotItemSpecs(lotId,home,items).forEach(function(sp){ store.objects.push(sp); if(typeof addMesh==="function") addMesh(sp); });
  if(typeof wallsAt!=="undefined") wallsAt=-1;
}
function lotDrawAll(){
  if(typeof cityLots==="undefined") return;
  cityLots.forEach(function(rec){
    var d=rec.decor||{};
    if(d.inside&&typeof WP_DECOR!=="undefined") WP_DECOR["lot:"+rec.lot_id]=d.inside;
    if(LOTB.open&&LOTB.lot&&LOTB.lot.id===rec.lot_id) return;        /* the owner's draft is showing */
    var h=lotHome(rec.name); if(!h) return;
    var key=JSON.stringify(d.items||[]);
    if(rec._drawn===key) return;
    rec._drawn=key;
    lotDrawItems(rec.lot_id,h,d.items||[]);
  });
}

/* ---- reading "a stone fountain and two oak trees" into things ---- */
var LOT_NUM={a:1,an:1,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,pair:2,couple:2,few:3,several:4};
function lotRead(text){
  var low=" "+deaccent(String(text||"")).toLowerCase().replace(/[^a-z\s'-]/g," ").replace(/\s+/g," ")+" ";
  var found=[];
  for(var i=0;i<PHRASES.length;i++){
    var ph=" "+PHRASES[i][0]+" ", at;
    while((at=low.indexOf(ph))>-1){
      found.push({at:at,end:at+ph.length-1,arch:PHRASES[i][1],word:PHRASES[i][0]});
      low=low.slice(0,at)+" "+new Array(ph.length-1).join("_")+" "+low.slice(at+ph.length);
    }
  }
  found.sort(function(a,b){ return a.at-b.at; });
  /* "oak trees" is one tree, not an oak and some trees */
  found=found.filter(function(f,i){ var q=found[i-1]; return !(q&&q.arch===f.arch&&f.at-q.end<=1); });
  var before=" "+deaccent(String(text||"")).toLowerCase().replace(/[^a-z\s'-]/g," ").replace(/\s+/g," ")+" ";
  return found.map(function(f){
    var pre=before.slice(Math.max(0,f.at-40),f.at).trim().split(" ").slice(-3), n=1, c;
    pre.forEach(function(w){ if(LOT_NUM[w]) n=LOT_NUM[w]; if(/^\d+$/.test(w)) n=Math.min(10,+w); if(MODIFIERS[w]&&MODIFIERS[w].c!==undefined) c=MODIFIERS[w].c; });
    return {arch:f.arch,word:f.word,n:Math.min(10,n),c:c};
  });
}
function lotBuildFromText(text,L){
  L=L||myLotHere(); if(!L) return 0;
  if(!LOTB.open||!LOTB.lot||LOTB.lot.id!==L.id) lotOpen(L);
  var want=lotRead(text), P=camera.position, fx=-Math.sin(yaw), fz=-Math.cos(yaw), made=0, refused=[];
  var k=0;
  want.forEach(function(w){
    var d=KIT[w.arch]; if(!d) return;
    if(d.cat==="structure"&&Math.max(d.size[0],d.size[2])>16){ refused.push(w.word); return; }
    for(var j=0;j<w.n;j++){
      if(LOTB.items.length>=150){ refused.push("(the lot is full)"); return; }
      var side=((k%5)-2)*3.2, ahead=6+Math.floor(k/5)*4+Math.max(d.size[2],2)/2;
      var x=P.x+fx*ahead+fz*side, z=P.z+fz*ahead-fx*side;
      /* kept on your own ground */
      var h=L.home, dx=x-h.x, dz=z-h.z, dd=Math.hypot(dx,dz), lim=LOT_R-Math.max(d.size[0],d.size[2])/2-1;
      if(dd>lim){ x=h.x+dx/dd*lim; z=h.z+dz/dd*lim; }
      var loc=lotToLocal(h,x,z);
      LOTB.items.push({a:w.arch,x:+loc.x.toFixed(2),z:+loc.z.toFixed(2),r:+(-(yaw-(h.rot||0))+Math.PI).toFixed(3),c:w.c,n:null});
      k++; made++;
    }
  });
  lotPreview();
  LOTB.msg=(made?("<b>"+made+"</b> "+(made>1?"things":"thing")+" set on your lot. Save to make it stand for everyone."):"Nothing there I know how to build.")+
    (refused.length?("<br><span style='color:#C0603A'>Too big for a lot: "+esc(refused.join(", "))+"</span>"):"");
  lotPaint();
  return made;
}

/* ---- the builder ---- */
function lotEl(){
  var el=document.getElementById("lotb"); if(el||!document.body) return el;
  var css=document.createElement("style");
  css.textContent="#lotb-btn{position:fixed;left:12px;bottom:calc(96px + env(safe-area-inset-bottom,0px));z-index:45;display:none;"+
    "background:rgba(10,12,18,.92);color:var(--bone);border:1px solid var(--gold,#C9A868);border-radius:3px;padding:9px 13px;font:13px var(--sans);cursor:pointer}"+
    "#lotb{position:fixed;left:12px;bottom:calc(96px + env(safe-area-inset-bottom,0px));z-index:46;display:none;width:min(380px,calc(100vw - 24px));max-height:min(64vh,600px);overflow:auto;"+
    "background:rgba(8,10,16,.96);border:1px solid var(--gold,#C9A868);border-radius:4px;padding:12px 14px;font:13px var(--sans);color:var(--bone)}"+
    "#lotb input[type=text]{width:100%;box-sizing:border-box;background:var(--void,#07080B);border:1px solid var(--line,#2A2C34);color:var(--bone);padding:8px;font:14px var(--sans);border-radius:2px}"+
    "#lotb .li{display:flex;justify-content:space-between;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid var(--line,#2A2C34)}"+
    "#lotb .li button{padding:3px 7px;font-size:12px}";
  document.head.appendChild(css);
  var b=document.createElement("button"); b.id="lotb-btn"; b.type="button"; b.textContent="Build on your lot";
  b.onclick=function(){ var L=myLotHere(); if(L) lotOpen(L); };
  document.body.appendChild(b);
  el=document.createElement("div"); el.id="lotb"; document.body.appendChild(el);
  return el;
}
function lotOpen(L){
  lotEl();
  var rec=(typeof lotByName==="function")?lotByName(L.name):null;
  LOTB.open=true; LOTB.lot=L;
  LOTB.items=JSON.parse(JSON.stringify((rec&&rec.decor&&rec.decor.items)||[]));
  LOTB.saved=JSON.stringify(LOTB.items); LOTB.msg="";
  lotPaint(); lotPreview();
}
function lotClose(keep){
  LOTB.open=false;
  var L=LOTB.lot; LOTB.lot=null;
  if(L&&!keep){
    /* put back what was saved */
    var rec=lotByName(L.name); if(rec){ rec._drawn=null; }
    lotDrawItems(L.id,L.home,JSON.parse(LOTB.saved||"[]"));
  }
  lotPaint();
}
function lotPreview(){ if(LOTB.open&&LOTB.lot) lotDrawItems(LOTB.lot.id,LOTB.lot.home,LOTB.items); }
function lotName(it){ var d=KIT[it.a]; return it.n||(it.a.replace(/([a-z])([A-Z])/g,"$1 $2")); }
function lotPaint(){
  var el=lotEl(); if(!el) return;
  if(!LOTB.open){ el.style.display="none"; return; }
  el.style.display="block";
  var L=LOTB.lot, dirty=JSON.stringify(LOTB.items)!==LOTB.saved;
  el.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'+
    '<b style="font-size:14px">'+esc(L.name)+'</b><button class="btn" id="lotb-x">Close</button></div>'+
    '<div style="color:var(--dim);margin-bottom:8px;line-height:1.5">Your own ground. Say what should stand here — <i>a stone fountain, two oak trees and a red bench</i> — and it is set in front of you.</div>'+
    '<div style="display:flex;gap:6px"><input type="text" id="lotb-say" placeholder="what should stand here?"><button class="btn" id="lotb-go">Build</button></div>'+
    '<label style="display:flex;gap:6px;align-items:center;margin:8px 0;color:var(--dim)"><input type="checkbox" id="lotb-copy"'+(LOTB.copy?" checked":"")+'> Also put a copy in my own dream</label>'+
    (LOTB.msg?'<div style="margin:6px 0">'+LOTB.msg+'</div>':'')+
    '<div>'+LOTB.items.map(function(it,i){
      return '<div class="li"><span>'+esc(lotName(it))+'</span><span style="white-space:nowrap">'+
        '<button class="btn" data-turn="'+i+'">Turn</button> <button class="btn" data-here="'+i+'">Move here</button> <button class="btn" data-del="'+i+'">Remove</button></span></div>';
    }).join("")+'</div>'+
    '<div style="display:flex;gap:8px;margin-top:10px"><button class="btn" id="lotb-save"'+(dirty?'':' disabled')+'>Save for everyone</button>'+
    '<button class="btn" id="lotb-undo"'+(dirty?'':' disabled')+'>Undo changes</button></div>'+
    '<div style="color:var(--dim);margin-top:8px;font-size:12px">Inside the house, use the <b>Rearrange</b> button.</div>';
  function $l(id){ return document.getElementById(id); }
  $l("lotb-x").onclick=function(){ lotClose(false); };
  var say=$l("lotb-say");
  function go(){ var t=say.value.trim(); if(!t) return; lotBuildFromText(t,L); if(LOTB.copy) lotCopyToDream(t); var s2=document.getElementById("lotb-say"); if(s2){ s2.value=""; s2.focus(); } }
  $l("lotb-go").onclick=go;
  say.onkeydown=function(e){ e.stopPropagation(); if(e.key==="Enter"){ e.preventDefault(); go(); } };
  say.onkeyup=function(e){ e.stopPropagation(); };
  $l("lotb-copy").onchange=function(){ LOTB.copy=this.checked; };
  Array.prototype.forEach.call(el.querySelectorAll("[data-turn]"),function(b){ b.onclick=function(){ var it=LOTB.items[+b.getAttribute("data-turn")]; it.r=+(((+it.r||0)+Math.PI/4)%(Math.PI*2)).toFixed(3); lotPreview(); lotPaint(); }; });
  Array.prototype.forEach.call(el.querySelectorAll("[data-del]"),function(b){ b.onclick=function(){ LOTB.items.splice(+b.getAttribute("data-del"),1); lotPreview(); lotPaint(); }; });
  Array.prototype.forEach.call(el.querySelectorAll("[data-here]"),function(b){ b.onclick=function(){
    var it=LOTB.items[+b.getAttribute("data-here")], P=camera.position, h=L.home;
    var x=P.x-Math.sin(yaw)*4, z=P.z-Math.cos(yaw)*4, dx=x-h.x, dz=z-h.z, dd=Math.hypot(dx,dz);
    if(dd>LOT_R-2){ x=h.x+dx/dd*(LOT_R-2); z=h.z+dz/dd*(LOT_R-2); }
    var loc=lotToLocal(h,x,z); it.x=+loc.x.toFixed(2); it.z=+loc.z.toFixed(2); lotPreview(); lotPaint(); }; });
  $l("lotb-undo").onclick=function(){ LOTB.items=JSON.parse(LOTB.saved||"[]"); LOTB.msg=""; lotPreview(); lotPaint(); };
  $l("lotb-save").onclick=function(){
    LOTB.msg="Saving…"; lotPaint();
    cityRpc("set_lot_build",{p_lot:L.id,p_items:LOTB.items,p_inside:null}).then(function(o){
      if(o!=="ok"){ LOTB.msg="<span style='color:#C0603A'>"+esc(String(o))+"</span>"; lotPaint(); return; }
      LOTB.saved=JSON.stringify(LOTB.items);
      var rec=lotByName(L.name); if(rec){ rec.decor=rec.decor||{}; rec.decor.items=JSON.parse(LOTB.saved); rec._drawn=LOTB.saved; }
      LOTB.msg="<b>Saved.</b> It stands on "+esc(L.name)+" for every dreamer now, whether you are here or not.";
      lotPaint(); lotsAt=0;
    }).catch(function(e){ LOTB.msg="<span style='color:#C0603A'>"+esc(e.message)+"</span>"; lotPaint(); });
  };
}
/* a copy of what was said goes into the dreamer's own dream, built the way
   any dream is */
function lotCopyToDream(text){
  if(!LOT_SCAN) return;
  var was=store.here;
  beHere(0);
  try{ LOT_SCAN(text); if(typeof populate==="function") populate(); if(typeof save==="function") save(); }
  finally{ beHere(was); }
}

/* the button appears when you stand on ground of your own */
var lotTickAt=0;
function lotTick(dt){
  lotTickAt-=dt; if(lotTickAt>0) return; lotTickAt=0.4;
  lotDrawAll();
  var L=myLotHere(), b=document.getElementById("lotb-btn");
  if(!b){ if(!L) return; lotEl(); b=document.getElementById("lotb-btn"); }
  b.style.display=(L&&!LOTB.open)?"block":"none";
  if(L&&!LOTB.open) b.textContent="Build on "+L.name;
  if(LOTB.open&&(!L||L.id!==LOTB.lot.id)) lotClose(false);   /* walked off your ground */
}

/* inside your own house: arranging is yours */
(function(){
  if(typeof workplaceKeyOf==="function"){
    var wk=workplaceKeyOf;
    workplaceKeyOf=function(spec){
      var k=wk(spec); if(k) return k;
      if(!spec||!spec.city) return null;
      var p=lotPlots().filter(function(q){ return q.homeId===spec.id; })[0];
      var rec=p&&typeof lotByName==="function"?lotByName(p.name):null;
      return rec&&rec.held?("lot:"+rec.lot_id):null;
    };
  }
  if(typeof canArrange==="function"){
    var ca=canArrange;
    canArrange=function(key){
      if(key&&/^lot:/.test(key)){
        if(typeof heldNow==="function"&&heldNow()) return false;
        var id=+key.slice(4);
        return !!(typeof standing!=="undefined"&&standing&&(standing.lots||[]).some(function(l){ return l.lot_id===id; }));
      }
      return ca(key);
    };
  }
  if(typeof wpSave==="function"){
    var ws=wpSave;
    wpSave=function(){
      var key=wpEditing;
      if(!key||!/^lot:/.test(key)) return ws();
      cityRpc("set_lot_build",{p_lot:+key.slice(4),p_items:null,p_inside:wpDraft}).then(function(o){
        if(o!=="ok") return paintArranger(String(o));
        WP_DECOR[key]=wpDraft.slice(); wpEditing=null; wpDraft=null;
        paintArranger(); paintWorkButton();
        setStatus("<b>Saved.</b> Your house is arranged this way for everyone who comes in.");
        lotsAt=0;
      }).catch(function(e){ paintArranger(e.message); });
    };
  }
  if(typeof applyLotDecor==="function"){
    var ald=applyLotDecor;
    applyLotDecor=function(){ ald(); lotDrawAll(); };
  }
})();
