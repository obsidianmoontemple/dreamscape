/* SomnuMatrix — atlantis-shape.js
   Somnucor is one city, and its keeper shapes it. The streets are laid from
   the city's own plan, and every change a keeper makes on top of that plan —
   moving a building, turning it, making it bigger, renaming it, taking it
   away, or setting something new down — is kept on the server
   (schema-update-20) and shown to every dreamer, the moment they next look.
   Nobody else can change the city: its dreamers change only the ground they
   hold (raising and dressing their own lots) and, if they work somewhere,
   the furnishing inside it.
   loaded as a plain script; shares scope with the other files */
"use strict";

var cityEditAt=0, cityEditCool=0, cityEditBusy=false, shapeOpen=false, shapeTarget=null, shapeSkip=0, shapeRing=null;

var cityRemoved={};
function cityIndex(){
  var m={}; Object.keys(cityRemoved).forEach(function(k){ m[k]=cityRemoved[k]; });
  store.objects.forEach(function(o){ if(o.city) m[o.id]=o; }); return m;
}
function seedOf(sp){
  if(!sp._seed) sp._seed={x:sp.x,z:sp.z,rot:sp.rot||0,attrs:JSON.parse(JSON.stringify(sp.attrs||{})),label:sp.label,name:sp.name,sign:sp.sign,note:sp.note};
  return sp._seed;
}
function redraw(sp){
  var had=meshes[sp.id], vis=had?had.visible:true;
  if(had) scene.remove(had);
  addMesh(sp);
  if(meshes[sp.id]) meshes[sp.id].visible=vis;
  wallsAt=-1; if(typeof surfAt!=="undefined") surfAt=-1;
}
/* one change, applied to this dreamer's view of the city */
function applyCityEdit(e,idx){
  if(!ATLC) return;
  var d=e.data||{}, sp=idx[e.key];
  if(e.op==="add"){
    if(sp||!KIT[d.arch]) return;
    var r=somnucorRealm(); if(!r) return;
    sp={id:e.key,archetype:d.arch,label:d.name||null,name:d.name||null,named:d.name?"stated":null,attrs:d.s?{s:+d.s}:{},
        x:ATLC.x+(+d.x||0),z:ATLC.z+(+d.z||0),rot:+d.rot||0,solid:KIT[d.arch].cat!=="being"&&!(typeof ATL_WALKTHROUGH!=="undefined"&&ATL_WALKTHROUGH[d.arch]),
        detail:3,nights:[store.session],realm:r.id,hub:true,city:true,addr:null,peopled:true,added:true};
    if(d.sign){ sp.sign=d.sign; sp.note=d.note||""; }
    store.objects.push(sp); idx[sp.id]=sp; addMesh(sp); wallsAt=-1;
    return;
  }
  if(!sp) return;
  if(e.op==="restore"){
    if(sp.added){ removeSpec(sp); delete idx[sp.id]; wallsAt=-1; return; }
    var s0=seedOf(sp);
    sp.x=s0.x; sp.z=s0.z; sp.rot=s0.rot; sp.attrs=JSON.parse(JSON.stringify(s0.attrs)); sp.label=s0.label; sp.name=s0.name; sp.sign=s0.sign; sp.note=s0.note;
    sp._removed=false; delete cityRemoved[sp.id]; if(store.objects.indexOf(sp)<0) store.objects.push(sp);
    redraw(sp); return;
  }
  seedOf(sp);
  if(e.op==="move"){ sp.x=ATLC.x+(+d.x||0); sp.z=ATLC.z+(+d.z||0); var g=meshes[sp.id];
    if(g){ g.position.set(sp.x,terrainY(sp.x,sp.z)+(sp.y||0),sp.z); } wallsAt=-1; if(typeof surfAt!=="undefined") surfAt=-1; }
  else if(e.op==="turn"){ sp.rot=+d.rot||0; if(meshes[sp.id]) meshes[sp.id].rotation.y=sp.rot; wallsAt=-1; }
  else if(e.op==="scale"){ sp.attrs=Object.assign({},sp.attrs||{},{s:Math.max(0.1,Math.min(6,+d.s||1))}); redraw(sp); }
  else if(e.op==="rename"){ sp.label=d.name||null; sp.name=d.name||null; if(d.sign!==undefined){ sp.sign=d.sign; } if(d.note!==undefined) sp.note=d.note; redraw(sp); }
  else if(e.op==="remove"){
    sp._removed=true; cityRemoved[sp.id]=sp;
    if(meshes[sp.id]){ scene.remove(meshes[sp.id]); delete meshes[sp.id]; }
    var i=store.objects.indexOf(sp); if(i>-1) store.objects.splice(i,1);
    wallsAt=-1;
  }
}
/* bring the city's changes down, and keep them coming while you are there */
function loadCityEdits(fromStart){
  if(cityEditBusy||typeof fetch!=="function"||!cloudOn()) return Promise.resolve(0);
  cityEditBusy=true;
  var after=fromStart?0:cityEditAt;
  return restRpc("city_edits_since",{p_after:after}).then(function(rows){
    cityEditBusy=false;
    if(!Array.isArray(rows)||!rows.length) return 0;
    var idx=cityIndex();
    /* a thing whose changes were struck ("put back") is rebuilt from its plan first */
    rows.forEach(function(e){ applyCityEdit(e,idx); cityEditAt=Math.max(cityEditAt,+e.id||0); });
    cullAt=0;
    return rows.length;
  }).catch(function(){ cityEditBusy=false; return 0; });
}
function cityShapeTick(dt){
  var r=somnucorRealm(); if(!r||!ATLC) return;
  cityEditCool-=dt;
  if(cityEditCool<=0&&(store.here||0)===r.id){ cityEditCool=45; loadCityEdits(false); }
  paintShapeButton();
  if(shapeOpen) shapeFind();
}

/* ---------------------------------------------------------------- the keeper's hands */
function shapeEl(){
  var el=document.getElementById("shape"); if(el||!document.body) return el;
  el=document.createElement("div"); el.id="shape";
  el.style.cssText="position:fixed;left:12px;bottom:calc(150px + env(safe-area-inset-bottom,0px));z-index:47;display:none;width:min(340px,calc(100vw - 24px));"+
    "background:rgba(8,10,16,.96);border:1px solid var(--gold,#C9A868);border-radius:4px;padding:12px;font:13px var(--sans);color:var(--bone)";
  document.body.appendChild(el);
  var b=document.createElement("button"); b.id="shape-btn"; b.type="button";
  b.style.cssText="position:fixed;left:12px;bottom:calc(150px + env(safe-area-inset-bottom,0px));z-index:46;display:none;"+
    "background:rgba(10,12,18,.92);color:var(--gold,#C9A868);border:1px solid var(--gold,#C9A868);border-radius:3px;padding:8px 12px;font:13px var(--sans);cursor:pointer";
  b.textContent="Shape the city";
  b.onclick=function(){ shapeOpen=true; shapeSkip=0; paintShape(); };
  document.body.appendChild(b);
  ["keydown","keyup","keypress"].forEach(function(k){ el.addEventListener(k,function(e){ if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) e.stopPropagation(); }); });
  return el;
}
function paintShapeButton(){
  shapeEl();
  var b=document.getElementById("shape-btn"); if(!b) return;
  var r=somnucorRealm();
  var show=walkMode&&!store.inside&&r&&(store.here||0)===r.id&&(typeof mayShape==="function"&&mayShape())&&!shapeOpen;
  b.style.display=show?"block":"none";
  if(!shapeOpen){ var el=document.getElementById("shape"); if(el) el.style.display="none"; if(shapeRing) shapeRing.visible=false; }
}
var SHAPE_SKIP={road:1,groundpad:1,lawn:1,snowfield:1,blossomground:1,leaffall:1,zengarden:1};
function shapeFind(){
  var P=camera.position, list=[];
  store.objects.forEach(function(o){
    if(!o.city||SHAPE_SKIP[o.archetype]) return;
    var d=Math.hypot(o.x-P.x,o.z-P.z); if(d<30) list.push({o:o,d:d});
  });
  /* what was taken away can still be found where it stood, to be put back */
  Object.keys(cityRemoved).forEach(function(k){ var o=cityRemoved[k]; var d=Math.hypot(o.x-P.x,o.z-P.z); if(d<30) list.push({o:o,d:d+0.01}); });
  list.sort(function(a,b){ return a.d-b.d; });
  var pick=list.length?list[shapeSkip%list.length].o:null;
  if(pick!==shapeTarget){ shapeTarget=pick; paintShape(); }
  if(!shapeRing&&scene){
    shapeRing=new THREE.Mesh(new THREE.TorusGeometry(1,0.12,6,40),new THREE.MeshBasicMaterial({color:0xFFD27A}));
    shapeRing.rotation.x=Math.PI/2; scene.add(shapeRing);
  }
  if(shapeRing){
    shapeRing.visible=!!shapeTarget;
    if(shapeTarget){ var k=KIT[shapeTarget.archetype], s=((shapeTarget.attrs&&shapeTarget.attrs.s)||1), rr=k?Math.max(k.size[0],k.size[2])*s*0.6+1:2;
      shapeRing.scale.set(rr,rr,rr); shapeRing.position.set(shapeTarget.x,terrainY(shapeTarget.x,shapeTarget.z)+0.3,shapeTarget.z); }
  }
}
var SHAPE_KINDS=null;
function shapeKinds(){
  if(SHAPE_KINDS) return SHAPE_KINDS;
  SHAPE_KINDS=Object.keys(KIT).filter(function(k){ var c=KIT[k].cat; return (c==="structure"||c==="infra"||c==="nature"||c==="vehicle")&&!SHAPE_SKIP[k]; }).sort();
  return SHAPE_KINDS;
}
function paintShape(msg){
  var el=shapeEl(); if(!el) return;
  if(!shapeOpen){ el.style.display="none"; return; }
  el.style.display="block";
  var t=shapeTarget, nm=t?(t.label||t.name||t.sign||t.archetype):null;
  el.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b style="color:var(--gold,#C9A868)">Shaping Somnucor</b>'+
      '<button class="btn" id="sh-close">Done</button></div>'+
    '<div style="color:var(--dim);font-size:12px;line-height:1.5;margin-bottom:8px">What you change here changes for every dreamer. The ringed thing is what you are working on: walk up to it, or press <b>Next</b> for the one beyond.</div>'+
    '<div style="margin-bottom:8px">'+(t?('<b>'+esc(nm)+'</b> <span style="color:var(--dim)">· '+esc(t.archetype)+(t.added?" · added by a keeper":"")+(t._removed?" \u00b7 taken away":"")+'</span>'):'<span style="color:var(--dim)">Nothing close enough — walk up to what you mean to change.</span>')+'</div>'+
    '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">'+
      '<button class="btn" id="sh-next">Next</button><button class="btn" id="sh-move">Move it here</button><button class="btn" id="sh-turn">Turn it</button>'+
      '<button class="btn" id="sh-big">Bigger</button><button class="btn" id="sh-small">Smaller</button></div>'+
    '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
      '<button class="btn" id="sh-name">Rename</button><button class="btn" id="sh-remove">Take it away</button><button class="btn" id="sh-restore">Put back as planned</button></div>'+
    '<div style="display:flex;gap:6px"><select id="sh-kind" style="flex:1;min-width:0;background:var(--void);border:1px solid var(--line);color:var(--bone);padding:5px">'+
      shapeKinds().map(function(k){ return '<option>'+k+'</option>'; }).join("")+'</select><button class="btn" id="sh-add">Set it down here</button></div>'+
    '<div id="sh-msg" style="color:var(--dim);font-size:12px;margin-top:8px;min-height:16px">'+(msg?esc(msg):"")+'</div>';
  var $=function(i){ return document.getElementById(i); };
  $("sh-close").onclick=function(){ shapeOpen=false; paintShape(); paintShapeButton(); };
  $("sh-next").onclick=function(){ shapeSkip++; shapeTarget=null; shapeFind(); };
  $("sh-move").onclick=function(){ if(!t) return; var h=shapeHere(); shapeSend(t.id,"move",{x:h.x,z:h.z},"Moved."); };
  $("sh-turn").onclick=function(){ if(!t) return; shapeSend(t.id,"turn",{rot:+(((t.rot||0)+Math.PI/12)%(Math.PI*2)).toFixed(4)},"Turned."); };
  $("sh-big").onclick=function(){ if(!t) return; shapeSend(t.id,"scale",{s:+(((t.attrs&&t.attrs.s)||1)*1.15).toFixed(3)},"Bigger."); };
  $("sh-small").onclick=function(){ if(!t) return; shapeSend(t.id,"scale",{s:+(((t.attrs&&t.attrs.s)||1)/1.15).toFixed(3)},"Smaller."); };
  $("sh-name").onclick=function(){ if(!t) return;
    var n=prompt("What is it called? (Leave empty for no name.)",t.label||t.sign||""); if(n===null) return;
    var note=t.archetype==="signboard"?prompt("What does the board say beneath its name?",t.note||""):undefined;
    var data={name:n.trim()||null}; if(t.sign!==undefined||t.archetype==="signboard") data.sign=n.trim()||null; if(note!==undefined&&note!==null) data.note=note;
    shapeSend(t.id,"rename",data,"Renamed."); };
  $("sh-remove").onclick=function(){ if(!t) return; if(!confirm("Take "+nm+" away, for everyone?")) return; shapeSend(t.id,"remove",null,"Taken away, for everyone."); };
  $("sh-restore").onclick=function(){ if(!t) return; shapeSend(t.id,"restore",null,"Back as the plan laid it."); };
  $("sh-add").onclick=function(){
    var k=$("sh-kind").value, h=shapeHere(), fwd=6;
    var nmNew=prompt("A name for it? (Optional.)","")||"";
    var data={arch:k,x:+(h.x+h.fx*fwd).toFixed(2),z:+(h.z+h.fz*fwd).toFixed(2),rot:+(Math.atan2(-h.fx,-h.fz)).toFixed(4)};
    if(nmNew.trim()){ data.name=nmNew.trim(); if(k==="signboard"){ data.sign=data.name; data.note=prompt("What does the board say?","")||""; } }
    shapeSend(null,"add",data,"Set down.");
  };
}
function shapeHere(){
  var P=camera.position;
  return {x:+(P.x-ATLC.x).toFixed(2),z:+(P.z-ATLC.z).toFixed(2),fx:-Math.sin(yaw),fz:-Math.cos(yaw)};
}
function shapeSend(key,op,data,ok){
  cityRpc("city_edit",{p_key:key,p_op:op,p_data:data}).then(function(id){
    if(typeof id!=="number"&&typeof id!=="string"){ paintShape("That didn't take."); return; }
    var idx=cityIndex();
    var e={id:+id,key:op==="add"?("new:"+id):key,op:op,data:data};
    applyCityEdit(e,idx);
    if(+id>cityEditAt&&+id===cityEditAt+1) cityEditAt=+id;
    shapeTarget=null; cullAt=0; paintShape(ok);
  }).catch(function(e){ paintShape((e&&e.message)||"That didn't take — has schema-update-20 been run?"); });
}

/* Plot mode is for a dreamer's own dreamscape; Somnucor is shaped from inside it, by its keeper */
(function(){
  if(typeof setPlot!=="function") return;
  var _setPlot=setPlot;
  setPlot=function(on){
    var r=(typeof somnucorRealm==="function")?somnucorRealm():null;
    if(on&&r&&(store.here||0)===r.id){
      setStatus("<b>Somnucor is one city, shared by every dreamer.</b> "+
        ((typeof amKeeper==="function"&&amKeeper())?"Walk it and press <b>Shape the city</b> to change it for everyone.":"Its keeper shapes it; the ground you hold, you may raise and dress from its own board."));
      return;
    }
    return _setPlot.apply(this,arguments);
  };
})();
