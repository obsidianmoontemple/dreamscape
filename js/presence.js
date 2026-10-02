/* SomnuMatrix — presence.js
   Other dreamers, actually walking Somnucor with you — and the street life
   that goes with them: a name over every head, words that rise over the head
   of whoever said them, talk with whoever is near or with the whole city,
   and trades from hand to hand.

   How it moves: plain REST calls through cityRpc(), the same as everything
   else — there is no websocket client in this codebase. While you are signed
   in, joined, and standing in Somnucor, your own position is sent every few
   seconds and everybody else's is fetched on the same beat, then eased toward
   smoothly so walking reads as walking. It is a few seconds behind, not
   instant.

   Indoors too: inside a building your position is sent relative to the
   building itself, with which building and which floor (schema-update-18),
   so two dreamers in the same room — the penthouse, an office, the lobby —
   see each other there, on the right floor, whoever's device drew it.

   Nothing here moves gold or goods. A trade is an offer the server holds;
   it moves everything at once, or nothing, when the other dreamer accepts.
   loaded as a plain script; shares scope with the other files */
"use strict";

var PRESENCE_INTERVAL=3.0, PRESENCE_STALE=20000, presenceTotal=1;
var presenceCool=0, presenceOthers={}, presencePublished=false, presenceNew=true;

function inSomnucorRealm(){
  var r=(typeof somnucorRealm==="function")?somnucorRealm():null;
  return !!(r&&store.here===r.id);
}
function myUserId(){ return (typeof session!=="undefined"&&session&&session.user)?session.user.id:null; }

/* where you are standing, as the server should hear it: out in the city, or
   inside one building, on one floor, relative to that building's own ground */
function myPlace(){
  if(store.inside&&INT&&INT.spec){
    var s=INT.spec;
    return {place:String(s.archetype||"building")+":"+String(s.label||s.name||""),
            level:INT.level||0, x:camera.position.x-INT.ox, z:camera.position.z-INT.oz};
  }
  /* out in the city: measured from the Tower, since every dreamer's city stands somewhere different in their own world */
  if(typeof ATLC!=="undefined"&&ATLC) return {place:"out",level:0,x:camera.position.x-ATLC.x,z:camera.position.z-ATLC.z};
  return {place:"out",level:0,x:camera.position.x,z:camera.position.z};
}
/* where somebody else's report lands in this device's world, or null if they
   are somewhere this device isn't drawing right now */
function placeToWorld(row){
  var here=myPlace();
  var pl=row.place||"out", lv=row.level||0;
  if(pl!==here.place) return null;
  if(pl==="out"){
    var ox=(typeof ATLC!=="undefined"&&ATLC)?ATLC.x:0, oz=(typeof ATLC!=="undefined"&&ATLC)?ATLC.z:0;
    return {x:row.x+ox,y:(typeof terrainY==="function")?terrainY(row.x+ox,row.z+oz):0,z:row.z+oz};
  }
  if(!INT) return null;
  return {x:INT.ox+row.x,y:lv*INT.floor,z:INT.oz+row.z,level:lv};
}

/* what the rest of the city may see of how you look — never your journal,
   never your notes, only the same look the wardrobe already shows you */
function publishMyLook(){
  if(!(typeof signedIn==="function"&&signedIn())||!(typeof joinedSomnucor==="function"&&joinedSomnucor())) return;
  presencePublished=false;
  cityRpc("set_public_look",{p_look:meLook()}).then(function(){ presencePublished=true; }).catch(function(){});
  /* the name over your head is the one you gave in "Who is dreaming" */
  var nm=(dreamer().name||"").trim();
  if(nm) cityRpc("set_public_name",{p_name:nm}).catch(function(){});
}

/* ---- a name over a head, and words that rise above it ---- */
function tagCanvas(text,bubble){
  var c=document.createElement("canvas"), x=c.getContext("2d");
  var W=bubble?640:512, lines=[text];
  x.font=(bubble?"30px ":"bold 34px ")+"ui-sans-serif,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif";
  if(bubble){
    /* wrap the words to the width of the bubble */
    lines=[]; var line="";
    String(text).split(/\s+/).forEach(function(w){
      var t=line?line+" "+w:w;
      if(x.measureText(t).width>W-48&&line){ lines.push(line); line=w; } else line=t;
    });
    if(line) lines.push(line);
    if(lines.length>4){ lines=lines.slice(0,4); lines[3]=lines[3].replace(/.{0,2}$/,"…"); }
  }
  var lh=bubble?38:44, H=bubble?(lines.length*lh+34):64;
  c.width=W; c.height=H;
  x=c.getContext("2d");
  x.font=(bubble?"30px ":"bold 34px ")+"ui-sans-serif,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif";
  x.textAlign="center"; x.textBaseline="middle";
  var tw=bubble?W-8:Math.min(W-8,x.measureText(text).width+40);
  x.fillStyle=bubble?"rgba(236,228,210,0.95)":"rgba(10,12,18,0.72)";
  var bx=(W-tw)/2, r=bubble?18:26;
  x.beginPath();
  x.moveTo(bx+r,4); x.lineTo(bx+tw-r,4); x.quadraticCurveTo(bx+tw,4,bx+tw,4+r);
  x.lineTo(bx+tw,H-4-r); x.quadraticCurveTo(bx+tw,H-4,bx+tw-r,H-4);
  x.lineTo(bx+r,H-4); x.quadraticCurveTo(bx,H-4,bx,H-4-r);
  x.lineTo(bx,4+r); x.quadraticCurveTo(bx,4,bx+r,4); x.closePath(); x.fill();
  if(!bubble){ x.strokeStyle="rgba(201,168,104,0.8)"; x.lineWidth=2; x.stroke(); }
  x.fillStyle=bubble?"#1A1712":"#E8DFC8";
  lines.forEach(function(l,i){ x.fillText(l,W/2,bubble?(17+lh/2+i*lh):H/2+1); });
  return c;
}
function makeTag(text,bubble){
  var c=tagCanvas(text,bubble);
  var tex=new THREE.CanvasTexture(c);
  var mat=new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false});
  var sp=new THREE.Sprite(mat);
  var w=bubble?3.0:2.6;
  sp.scale.set(w,w*c.height/c.width,1);
  sp.renderOrder=10;
  return sp;
}
function dropTag(sp){
  if(!sp) return;
  if(sp.parent) sp.parent.remove(sp);
  if(sp.material){ if(sp.material.map) sp.material.map.dispose(); sp.material.dispose(); }
}
function sayOver(id,text){
  var p=presenceOthers[id]; if(!p||!p.group) return;
  dropTag(p.bubble);
  p.bubble=makeTag(text,true);
  p.bubble.position.y=2.02+p.bubble.scale.y/2+0.28;
  p.group.add(p.bubble);
  p.bubbleLeft=7;
}

function presenceGroupFor(row){
  var sp=row.look&&row.look.species, o=sp&&SPECIES_FEATS[sp];
  var look=fillLook(JSON.parse(JSON.stringify(row.look||blankLook("human"))),row.user_id);
  var spec={id:"presence_"+row.user_id,archetype:"human",attrs:{},look:look,
    solid:false,detail:4,nights:[]};
  var g=buildFigure(spec,1);
  if(o){ dressFolk(g,spec,1,o); if(o.hover) g.children[0].position.y+=o.hover; }
  g.userData.presence=row.user_id;
  var tag=makeTag((row.name||"a dreamer")+(row.away?" \u00b7 away":""),false);
  tag.position.y=2.02; g.add(tag);
  g.userData.tag=tag;
  return g;
}
function removePresence(id){
  var p=presenceOthers[id]; if(!p) return;
  dropTag(p.bubble);
  if(p.group){ dropTag(p.group.userData.tag); if(scene) scene.remove(p.group); }
  delete presenceOthers[id];
}
function clearAllPresence(){
  Object.keys(presenceOthers).forEach(removePresence);
}
/* everybody drawn right now, nearest first — the desk and the panel use this */
function presenceList(){
  var P=camera.position;
  return Object.keys(presenceOthers).map(function(id){
    var p=presenceOthers[id], g=p.group;
    return {id:id,name:p.name||"a dreamer",dist:g?Math.hypot(g.position.x-P.x,g.position.z-P.z):0};
  }).sort(function(a,b){ return a.dist-b.dist; });
}

function pollPresence(){
  var at=myPlace();
  cityRpc("upsert_presence_at",{p_x:at.x,p_z:at.z,p_rot:yaw,p_realm:"somnucor",p_place:at.place,p_level:at.level})
    .catch(function(){
      /* a database without schema-update-18 still has the older call */
      if(at.place==="out") cityRpc("upsert_presence",{p_x:at.x,p_z:at.z,p_rot:yaw,p_realm:"somnucor"}).catch(function(){});
    });
  if(!presencePublished) publishMyLook();
  cityRpc("list_presence",{p_realm:"somnucor"}).then(function(rows){
    var seen={}, me=myUserId(), arrived=[];
    /* everyone in Somnucor right now, wherever they are standing — out in the
       streets or inside any building — and you as well */
    var others={}; (rows||[]).forEach(function(r){ if(r&&r.user_id&&r.user_id!==me&&!r.away) others[r.user_id]=1; });
    presenceTotal=Object.keys(others).length+1;
    (rows||[]).forEach(function(row){
      if(!row||row.user_id===me) return;
      var w=placeToWorld(row);
      if(!w) return;                         // somewhere this device isn't drawing
      seen[row.user_id]=1;
      var p=presenceOthers[row.user_id];
      var lk=JSON.stringify(row.look||{}), nm=(row.name||"a dreamer")+(row.away?" \u00b7 away":"");
      if(!p){
        var g=presenceGroupFor(row);
        g.position.set(w.x,w.y,w.z); g.rotation.y=row.rot||0;
        if(scene) scene.add(g);
        p=presenceOthers[row.user_id]={group:g,target:{x:w.x,y:w.y,z:w.z,rot:row.rot||0},lastLook:lk,name:nm,away:!!row.away};
        if(!row.away) arrived.push(nm);
      } else {
        p.target.x=w.x; p.target.y=w.y; p.target.z=w.z; p.target.rot=row.rot||0;
        /* their look or their name changed since we last drew them — rebuild
           the figure, not just its position */
        if(lk!==p.lastLook||nm!==p.name){
          var bub=p.bubble; p.bubble=null;
          if(p.group){ dropTag(p.group.userData.tag); if(scene) scene.remove(p.group); }
          var g2=presenceGroupFor(row); g2.position.set(w.x,w.y,w.z); g2.rotation.y=row.rot||0;
          if(scene) scene.add(g2); p.group=g2; p.lastLook=lk; p.name=nm;
          if(bub){ g2.add(bub); p.bubble=bub; }
        }
      }
    });
    Object.keys(presenceOthers).forEach(function(id){ if(!seen[id]) removePresence(id); });
    if(arrived.length&&!presenceNew)
      streetNote(arrived.length===1?("<b>"+esc(arrived[0])+"</b> is here."):("<b>"+arrived.length+" dreamers</b> are here now."));
    presenceNew=false;
    paintStreetButton();
    if(streetOpen&&streetTab==="people") paintStreet();
  }).catch(function(){});
}

var presenceActive=false;
function presenceTick(dt){
  var active=walkMode&&(typeof signedIn==="function"&&signedIn())&&(typeof joinedSomnucor==="function"&&joinedSomnucor())&&inSomnucorRealm()&&!(typeof amVisiting==="function"&&amVisiting());
  if(!active){
    if(Object.keys(presenceOthers).length) clearAllPresence();
    if(presenceActive){
      /* leaving Somnucor: take our own figure off the map at once, rather
         than leaving a stale one standing there for twenty seconds */
      if(typeof signedIn==="function"&&signedIn()) cityRpc("clear_presence").catch(function(){});
      presenceActive=false; presenceNew=true;
    }
    showStreet(false);
    updateDeskButton();
    return;
  }
  if(!presenceActive){ presenceActive=true; presenceCool=0; showStreet(true); }
  /* stepping into or out of a building changes who you can see: ask at once */
  var pk=myPlace(); pk=pk.place+"#"+pk.level;
  if(pk!==presenceTick.lastPlace){
    presenceTick.lastPlace=pk; clearAllPresence(); presenceCool=Math.min(presenceCool,0.25); presenceNew=true;
  }
  if(presenceCool<=0){ presenceCool=PRESENCE_INTERVAL; pollPresence(); }
  else presenceCool-=dt;
  /* eased toward the latest reported position every frame, so a report a
     few seconds old still reads as walking rather than teleporting */
  var ease=Math.min(1,dt*2.2);
  Object.keys(presenceOthers).forEach(function(id){
    var p=presenceOthers[id]; if(!p.group) return;
    p.group.position.x+=(p.target.x-p.group.position.x)*ease;
    p.group.position.z+=(p.target.z-p.group.position.z)*ease;
    p.group.position.y=p.target.y||0;
    var dr=((p.target.rot-p.group.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;
    p.group.rotation.y+=dr*ease;
    if(p.bubble){ p.bubbleLeft-=dt; if(p.bubbleLeft<=0){ dropTag(p.bubble); p.bubble=null; } }
  });
  streetTick(dt);
  updateDeskButton();
}

/* ======================================================================
   The street: talking and trading with whoever is in the city
   ====================================================================== */
var streetOpen=false, streetTab="talk", streetChan="near";
var chatAfter=0, chatLines=[], chatCool=0, tradeCool=0, myTradeRows=[], seenTrades={};
var besideId=null, streetMaterials=null;

function streetEl(){
  var el=document.getElementById("street");
  if(el||!document.body) return el;
  var css=document.createElement("style");
  css.textContent=
    "#street-btn{position:fixed;right:12px;top:calc(96px + env(safe-area-inset-top,0px));z-index:45;display:none;"+
      "background:rgba(10,12,18,.92);color:var(--bone);border:1px solid var(--gold,#C9A868);border-radius:3px;"+
      "padding:8px 12px;font:13px var(--sans);cursor:pointer}"+
    "#street-btn .badge{display:inline-block;min-width:18px;padding:0 5px;margin-left:6px;border-radius:9px;background:#B8724A;color:#fff;font-size:11px;text-align:center}"+
    "#street{position:fixed;right:12px;top:calc(136px + env(safe-area-inset-top,0px));z-index:46;display:none;"+
      "width:min(380px,calc(100vw - 24px));max-height:min(62vh,560px);flex-direction:column;"+
      "background:rgba(8,10,16,.96);border:1px solid var(--gold,#C9A868);border-radius:4px;font:13px var(--sans);color:var(--bone)}"+
    "#street .st-tabs{display:flex;border-bottom:1px solid var(--line)}"+
    "#street .st-tabs button{flex:1;background:none;border:0;color:var(--dim);padding:9px 4px;font:13px var(--sans);cursor:pointer}"+
    "#street .st-tabs button.on{color:var(--bone);box-shadow:inset 0 -2px 0 var(--gold,#C9A868)}"+
    "#street .st-body{overflow-y:auto;padding:10px 12px;flex:1;min-height:120px}"+
    "#street .st-foot{border-top:1px solid var(--line);padding:8px;display:flex;gap:6px}"+
    "#street input,#street select,#street textarea{background:var(--void);border:1px solid var(--line);color:var(--bone);padding:6px 8px;font:13px var(--sans);border-radius:2px}"+
    "#street .st-line{margin:0 0 6px;line-height:1.45;word-wrap:break-word}"+
    "#street .st-who{color:var(--gold,#C9A868)}"+
    "#street .st-city{color:#7C93B8;font-size:11px;margin-right:4px}"+
    "#street .st-row{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--line)}"+
    "#street .st-dim{color:var(--dim)}"+
    "#street .btn{padding:4px 9px;font-size:12px}"+
    "#desk-btn{position:fixed;left:50%;bottom:calc(150px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:44;display:none;"+
      "background:rgba(10,12,18,.94);color:var(--gold,#C9A868);border:1px solid var(--gold,#C9A868);border-radius:3px;"+
      "padding:10px 18px;font:15px var(--serif);cursor:pointer;letter-spacing:.02em}";
  document.head.appendChild(css);

  var b=document.createElement("button"); b.id="street-btn"; b.type="button";
  b.onclick=function(){ streetOpen=!streetOpen; paintStreetButton(); paintStreet(); };
  document.body.appendChild(b);

  el=document.createElement("div"); el.id="street";
  el.innerHTML='<div class="st-tabs"><button data-st="talk">Talk</button><button data-st="people">People</button><button data-st="trades">Trades</button></div>'+
    '<div class="st-body" id="st-body"></div>'+
    '<div class="st-foot" id="st-foot">'+
      '<select id="st-chan" title="who hears you"><option value="near">Nearby</option><option value="city">Whole city</option></select>'+
      '<input id="st-say" maxlength="240" placeholder="Say something…" style="flex:1;min-width:0" autocomplete="off">'+
      '<button class="btn" id="st-send">Say</button></div>';
  document.body.appendChild(el);
  Array.prototype.forEach.call(el.querySelectorAll("[data-st]"),function(t){
    t.onclick=function(){ streetTab=t.getAttribute("data-st"); if(streetTab==="trades") loadTrades(); paintStreet(); };
  });
  /* typing here must not walk you about the city */
  ["keydown","keyup","keypress"].forEach(function(k){
    el.addEventListener(k,function(e){
      if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)){
        e.stopPropagation();
        if(k==="keydown"&&e.key==="Enter"&&e.target.id==="st-say"){ e.preventDefault(); sendSay(); }
        if(k==="keydown"&&e.key==="Escape"){ e.target.blur(); }
      }
    });
  });
  document.getElementById("st-send").onclick=sendSay;
  document.getElementById("st-chan").onchange=function(){ streetChan=this.value; };

  var d=document.createElement("button"); d.id="desk-btn"; d.type="button";
  d.onclick=function(){
    if(typeof deskNear!=="undefined"&&deskNear) openDesk();
    else if(typeof officeDeskNear!=="undefined"&&officeDeskNear) openOfficeDesk();
  };
  document.body.appendChild(d);
  return el;
}
function showStreet(on){
  var el=streetEl(); if(!el) return;
  var b=document.getElementById("street-btn");
  if(b) b.style.display=on?"block":"none";
  el.style.display=(on&&streetOpen)?"flex":"none";
  if(on) paintStreetButton();
}
function incomingOpen(){ return myTradeRows.filter(function(t){ return t.incoming&&t.state==="open"; }).length; }
function paintStreetButton(){
  var b=document.getElementById("street-btn"); if(!b) return;
  var n=Object.keys(presenceOthers).filter(function(id){ return !presenceOthers[id].away; }).length, inc=incomingOpen(), all=Math.max(presenceTotal||1,n+1);
  b.innerHTML=(streetOpen?"Close":"The street")+" <span class='st-dim'>· "+all+" in the city"+(n?", "+n+" near you":"")+"</span>"+(inc?"<span class='badge'>"+inc+"</span>":"");
  var el=document.getElementById("street");
  if(el) el.style.display=(presenceActive&&streetOpen)?"flex":"none";
}
/* the desk, reachable by a button too — not every dreamer has a K key */
function updateDeskButton(){
  var d=document.getElementById("desk-btn");
  if(!d){ if(!((typeof deskNear!=="undefined"&&deskNear)||(typeof officeDeskNear!=="undefined"&&officeDeskNear))) return; streetEl(); d=document.getElementById("desk-btn"); if(!d) return; }
  var dn=typeof deskNear!=="undefined"&&deskNear, on=typeof officeDeskNear!=="undefined"&&officeDeskNear;
  var open=typeof deskOpen!=="undefined"&&deskOpen;
  var show=walkMode&&(dn||on)&&!open;
  d.style.display=show?"block":"none";
  if(show){
    var want=dn?"Sit at the Keeper’s Desk":"Sit at the desk";
    if(d.textContent!==want) d.textContent=want;
  }
}
function streetNote(html){
  chatLines.push({sys:true,html:html});
  if(chatLines.length>80) chatLines.shift();
  if(streetOpen&&streetTab==="talk") paintStreet();
}

function paintStreet(){
  var el=streetEl(); if(!el) return;
  el.style.display=(presenceActive&&streetOpen)?"flex":"none";
  if(!streetOpen) return;
  Array.prototype.forEach.call(el.querySelectorAll("[data-st]"),function(t){
    var k=t.getAttribute("data-st"), inc=incomingOpen();
    t.className=k===streetTab?"on":"";
    if(k==="trades") t.innerHTML="Trades"+(inc?" <span class='badge' style='display:inline-block;min-width:16px;padding:0 4px;border-radius:8px;background:#B8724A;color:#fff;font-size:11px'>"+inc+"</span>":"");
    if(k==="people") t.textContent="People ("+Object.keys(presenceOthers).length+")";
  });
  document.getElementById("st-foot").style.display=streetTab==="talk"?"flex":"none";
  var body=document.getElementById("st-body");
  if(streetTab==="talk"){
    var atEnd=body.scrollTop+body.clientHeight>=body.scrollHeight-20;
    body.innerHTML=chatLines.length?chatLines.map(function(l){
      if(l.sys) return '<div class="st-line st-dim">'+l.html+'</div>';
      return '<div class="st-line">'+(l.channel==="city"?'<span class="st-city">CITY</span>':'')+
        '<span class="st-who">'+esc(l.mine?"You":l.name)+'</span> '+esc(l.body)+'</div>';
    }).join(""):'<div class="st-dim">Nobody has said anything yet. <b>Nearby</b> is heard by whoever stands within forty paces of you, in the same room; <b>Whole city</b> by everyone walking Somnucor.</div>';
    if(atEnd) body.scrollTop=body.scrollHeight;
  }
  else if(streetTab==="people"){
    var rows=presenceList();
    body.innerHTML=rows.length?rows.map(function(p){
      return '<div class="st-row"><span><b>'+esc(p.name)+'</b> <span class="st-dim">· '+(p.dist<3?"beside you":Math.round(p.dist)+" m")+'</span></span>'+
        '<span style="white-space:nowrap"><button class="btn" data-trade="'+p.id+'">Trade</button> '+
        '<button class="btn" data-pay="'+p.id+'">Pay</button></span></div>';
    }).join(""):'<div class="st-dim">Nobody else is here just now. When another dreamer walks the city, or the same room as you, they appear here and in the street itself.</div>';
    Array.prototype.forEach.call(body.querySelectorAll("[data-trade]"),function(b){ b.onclick=function(){ tradeForm(b.getAttribute("data-trade")); }; });
    Array.prototype.forEach.call(body.querySelectorAll("[data-pay]"),function(b){
      b.onclick=function(){
        var id=b.getAttribute("data-pay"), nm=(presenceOthers[id]&&presenceOthers[id].name)||"them";
        var n=Math.floor(+(prompt("How much gold to give "+nm+"?")||0));
        if(n>0&&typeof payDreamer==="function") payDreamer(id,n,"given in the street");
      };
    });
  }
  else if(streetTab==="trades"){
    var open=myTradeRows.filter(function(t){ return t.state==="open"; });
    var done=myTradeRows.filter(function(t){ return t.state!=="open"; });
    body.innerHTML=(open.length?open.map(function(t){
      return '<div class="st-row" style="display:block">'+
        '<div>'+(t.incoming?'<b>'+esc(t.other_name)+'</b> offers you ':'You offer <b>'+esc(t.other_name)+'</b> ')+tradeWords(t,true)+'</div>'+
        ((t.want_gold||t.want_amount)?'<div class="st-dim">'+(t.incoming?"for ":"for ")+tradeWords(t,false)+'</div>':'<div class="st-dim">as a gift</div>')+
        (t.note?'<div class="st-dim"><i>“'+esc(t.note)+'”</i></div>':'')+
        '<div style="margin-top:6px">'+(t.incoming
          ?'<button class="btn" data-accept="'+t.trade_id+'">Accept</button> <button class="btn" data-decline="'+t.trade_id+'">Decline</button>'
          :'<button class="btn" data-cancel="'+t.trade_id+'">Take it back</button> <span class="st-dim">waiting on them</span>')+'</div></div>';
    }).join(""):'<div class="st-dim" style="margin-bottom:8px">No offers waiting. Open <b>People</b> and press <b>Trade</b> beside somebody to make one. An offer lasts fifteen minutes.</div>')+
    (done.length?'<div class="st-dim" style="margin-top:10px">Just now</div>'+done.map(function(t){
      var w={done:"settled",declined:"declined",cancelled:"taken back",expired:"ran out"}[t.state]||t.state;
      return '<div class="st-line st-dim">'+(t.incoming?"From ":"To ")+esc(t.other_name)+' — '+w+'</div>';
    }).join(""):"");
    Array.prototype.forEach.call(body.querySelectorAll("[data-accept]"),function(b){ b.onclick=function(){ answerTrade("accept_trade",+b.getAttribute("data-accept")); }; });
    Array.prototype.forEach.call(body.querySelectorAll("[data-decline]"),function(b){ b.onclick=function(){ answerTrade("decline_trade",+b.getAttribute("data-decline")); }; });
    Array.prototype.forEach.call(body.querySelectorAll("[data-cancel]"),function(b){ b.onclick=function(){ answerTrade("cancel_trade",+b.getAttribute("data-cancel")); }; });
  }
  paintStreetButton();
}
function tradeWords(t,giving){
  var bits=[];
  if(giving){
    if(t.give_gold) bits.push("<b>"+gold(t.give_gold)+"</b>");
    if(t.give_amount) bits.push("<b>"+t.give_amount+"</b> "+esc(t.give_name||t.give_kind));
    if(t.give_item) bits.push("the <b>"+esc(t.give_item_name||"thing")+"</b>");
  } else {
    if(t.want_gold) bits.push("<b>"+gold(t.want_gold)+"</b>");
    if(t.want_amount) bits.push("<b>"+t.want_amount+"</b> "+esc(t.want_name||t.want_kind));
  }
  return bits.length?bits.join(" and "):"nothing";
}

/* ---- talking ---- */
function sendSay(){
  var inp=document.getElementById("st-say"); if(!inp) return;
  var t=(inp.value||"").trim(); if(!t) return;
  inp.value="";
  cityRpc("say_in_city",{p_body:t,p_channel:streetChan}).then(function(o){
    if(o!=="ok") streetNote(esc(String(o)));
    chatCool=0.15;                                     // fetch it straight back
  }).catch(function(e){ streetNote("That wasn't heard: "+esc(e.message||"")); });
}
function pollChat(){
  cityRpc("city_chat_since",{p_after:chatAfter}).then(function(rows){
    (rows||[]).forEach(function(r){
      chatAfter=Math.max(chatAfter,+r.id||0);
      chatLines.push({id:r.id,name:r.name||"a dreamer",body:r.body,channel:r.channel,mine:!!r.mine});
      if(!r.mine&&presenceOthers[r.user_id]) sayOver(r.user_id,r.body);
      if(!r.mine&&!streetOpen) streetUnread++;
    });
    if(chatLines.length>80) chatLines.splice(0,chatLines.length-80);
    if((rows||[]).length&&streetOpen&&streetTab==="talk") paintStreet();
    if((rows||[]).length&&!streetOpen){
      var last=rows[rows.length-1];
      if(!last.mine) setStatus("<b>"+esc(last.name||"Somebody")+"</b>"+(last.channel==="city"?" (to the city)":"")+": "+esc(last.body));
    }
  }).catch(function(){});
}
var streetUnread=0;

/* ---- trading ---- */
function loadTrades(){
  return cityRpc("my_trades").then(function(rows){
    myTradeRows=rows||[];
    myTradeRows.forEach(function(t){
      if(t.incoming&&t.state==="open"&&!seenTrades[t.trade_id]){
        seenTrades[t.trade_id]=1;
        setStatus("<b>"+esc(t.other_name)+"</b> offers you "+tradeWords(t,true)+". Open <b>The street</b> → Trades to answer.");
      }
      if(!t.incoming&&t.state!=="open"&&!seenTrades["s"+t.trade_id]){
        seenTrades["s"+t.trade_id]=1;
        if(t.state==="done"){
          setStatus("<b>"+esc(t.other_name)+" accepted your trade.</b>");
          if(typeof refreshStanding==="function") refreshStanding();
          if(typeof loadStock==="function") loadStock();
          if(typeof loadThings==="function") loadThings();
        }
        else if(t.state==="declined") setStatus(esc(t.other_name)+" turned your offer down.");
      }
    });
    paintStreetButton();
    if(streetOpen&&streetTab==="trades") paintStreet();
    return myTradeRows;
  }).catch(function(){ return myTradeRows; });
}
function answerTrade(fn,id){
  cityRpc(fn,{p_trade:id}).then(function(o){
    if(o==="ok"){
      setStatus(fn==="accept_trade"?"<b>Done.</b> The trade has gone through, both ways at once."
               :fn==="decline_trade"?"Declined.":"Taken back.");
      if(fn==="accept_trade"){
        if(typeof refreshStanding==="function") refreshStanding();
        if(typeof loadStock==="function") loadStock();
        if(typeof loadThings==="function") loadThings();
      }
    } else setStatus(esc(String(o)));
    loadTrades();
  }).catch(function(e){ setStatus(esc(e.message)); });
}
function loadMaterials(){
  if(streetMaterials) return Promise.resolve(streetMaterials);
  return restGet("materials?select=kind,name&order=name").then(function(rows){ streetMaterials=rows||[]; return streetMaterials; })
    .catch(function(){ return []; });
}
function tradeForm(toId){
  var who=(presenceOthers[toId]&&presenceOthers[toId].name)||"them";
  var body=document.getElementById("st-body"); if(!body) return;
  document.getElementById("st-foot").style.display="none";
  body.innerHTML="Looking at what you have…";
  Promise.all([
    (typeof loadStock==="function"?loadStock():Promise.resolve([])),
    (typeof loadThings==="function"?loadThings():Promise.resolve([])),
    loadMaterials(),
    (typeof refreshStanding==="function"?refreshStanding():Promise.resolve(null))
  ]).then(function(r){
    var stockRows=(r[0]||[]).filter(function(s){ return s.amount>0; }), things=r[1]||[], mats=r[2]||[], st=r[3]||standing;
    var num='type="number" min="0" step="1" style="width:90px"';
    body.innerHTML='<div style="margin-bottom:8px">A trade with <b>'+esc(who)+'</b>. Nothing moves until they accept, and then all of it moves at once.</div>'+
      '<div class="st-dim" style="margin:8px 0 4px">You give</div>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">'+
        '<input id="tf-gg" '+num+' placeholder="gold"> <span class="st-dim">gold'+(st?" (you have "+(st.gold||0).toLocaleString()+")":"")+'</span></div>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:6px">'+
        '<input id="tf-ga" '+num+' placeholder="how many"> <select id="tf-gk"><option value="">— stock —</option>'+
        stockRows.map(function(s){ return '<option value="'+esc(s.kind)+'">'+esc(s.name)+' ('+s.amount+')</option>'; }).join("")+'</select></div>'+
      '<div style="margin-top:6px"><select id="tf-gi" style="max-width:100%"><option value="">— nothing of your own —</option>'+
        things.map(function(t){ return '<option value="'+t.id+'">'+esc(t.name)+'</option>'; }).join("")+'</select></div>'+
      '<div class="st-dim" style="margin:12px 0 4px">You ask for</div>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">'+
        '<input id="tf-wg" '+num+' placeholder="gold"> <span class="st-dim">gold</span></div>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:6px">'+
        '<input id="tf-wa" '+num+' placeholder="how many"> <select id="tf-wk"><option value="">— stock —</option>'+
        mats.map(function(m){ return '<option value="'+esc(m.kind)+'">'+esc(m.name||m.kind)+'</option>'; }).join("")+'</select></div>'+
      '<input id="tf-note" maxlength="140" placeholder="a word with it (optional)" style="width:100%;margin-top:10px">'+
      '<div style="margin-top:10px;display:flex;gap:8px"><button class="btn" id="tf-send">Offer it</button><button class="btn" id="tf-back">Never mind</button></div>'+
      '<div id="tf-msg" class="st-dim" style="margin-top:6px"></div>';
    document.getElementById("tf-back").onclick=function(){ streetTab="people"; paintStreet(); };
    document.getElementById("tf-send").onclick=function(){
      var v=function(id){ return Math.max(0,Math.floor(+(document.getElementById(id).value||0))); };
      var gk=document.getElementById("tf-gk").value||null, wk=document.getElementById("tf-wk").value||null;
      var gi=document.getElementById("tf-gi").value;
      var args={p_to:toId,p_give_gold:v("tf-gg"),p_give_kind:gk,p_give_amount:gk?v("tf-ga"):0,p_give_item:gi?+gi:null,
        p_want_gold:v("tf-wg"),p_want_kind:wk,p_want_amount:wk?v("tf-wa"):0,
        p_note:(document.getElementById("tf-note").value||"").trim()||null};
      document.getElementById("tf-msg").textContent="Sending…";
      cityRpc("offer_trade",args).then(function(o){
        if(o==="ok"){ setStatus("<b>Offered.</b> "+esc(who)+" has fifteen minutes to answer."); streetTab="trades"; loadTrades(); paintStreet(); }
        else document.getElementById("tf-msg").textContent=String(o);
      }).catch(function(e){ document.getElementById("tf-msg").textContent=e.message||"That didn't go."; });
    };
  });
}

/* ---- the beat of the street ---- */
function streetTick(dt){
  chatCool-=dt; tradeCool-=dt;
  if(chatCool<=0){ chatCool=2.5; pollChat(); }
  if(tradeCool<=0){ tradeCool=6; loadTrades(); }
  /* walking up beside somebody says so, once */
  var near=presenceList()[0];
  if(near&&near.dist<3.2){
    if(besideId!==near.id){
      besideId=near.id;
      if(!streetOpen) setStatus("<b>"+esc(near.name)+"</b> is beside you. Open <b>The street</b> to talk or trade.");
    }
  } else besideId=null;
}

/* Enter opens the street and puts you in the talking box */
if(typeof addEventListener==="function") addEventListener("keydown",function(e){
  if(e.key!=="Enter"||!presenceActive) return;
  var t=(e.target&&e.target.tagName)||"";
  if(/INPUT|TEXTAREA|SELECT|BUTTON/.test(t)) return;
  if(typeof deskOpen!=="undefined"&&deskOpen) return;
  e.preventDefault();
  streetOpen=true; streetTab="talk"; paintStreet();
  var inp=document.getElementById("st-say"); if(inp) setTimeout(function(){ inp.focus(); },0);
});

