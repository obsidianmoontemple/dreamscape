/* SomnuMatrix — realms.js
   other worlds entirely, reached through passages: the underworld, the heavens,
   the depths beneath the sea, faerie, the void, the mirror world, the land of
   the dead, a frozen realm, or simply another world. each stands far off in the
   map with its own ground, sky, light and inhabitants. when a dream crosses
   over, what follows is built on the other side, and a way back is left.
   loaded as a plain script; shares scope with the other files */
"use strict";

var REALM_GAP=30000;
var REALMS={
  underworld:{name:"The Underworld",ground:0x2A1E1C,tex:"earth",path:0x3E2C28,skyTop:0x1A0806,skyLow:0x6A2410,dens:1.55,light:0xFF8A5A,amb:0.42,sun:0.42,stars:0,mix:["shadow","shadow","human"]},
  heavens:{name:"The Heavens",ground:0xD8DEE8,tex:"snow",path:0xD8C898,skyTop:0x7FAEE4,skyLow:0xFFF2DA,dens:0.8,light:0xFFF2D6,amb:0.95,sun:0.85,stars:0,mix:["bird","bird","human"]},
  depths:{name:"The Depths",ground:0x4E6A62,tex:"sand",path:0x7A8C7C,skyTop:0x04182A,skyLow:0x1A5A6C,dens:2.6,light:0x7FC8D8,amb:0.5,sun:0.4,stars:0,mix:["creature","creature","bird"]},
  faerie:{name:"Faerie",ground:0x3A7048,tex:"grass",path:0x5A8656,skyTop:0x2A2256,skyLow:0xD08AB8,dens:1.5,light:0xF0C8FF,amb:0.65,sun:0.55,stars:0.5,mix:["creature","bird","human","child"]},
  void:{name:"The Void",ground:0x2A2A3C,tex:"voidgrid",path:0x34344A,skyTop:0x000000,skyLow:0x07070C,dens:1.1,light:0x9AA4C8,amb:0.55,sun:0.45,stars:1,mix:["shadow"]},
  mirror:{name:"The Mirror World",ground:0x9EA6B6,tex:"paving",path:0xC0C6D0,skyTop:0xB0BED4,skyLow:0xECE8E0,dens:1.3,light:0xE8ECF4,amb:0.85,sun:0.7,stars:0,mix:["human","human","child"]},
  dead:{name:"The Land of the Dead",ground:0x7E7C72,tex:"sand",path:0x9C988A,skyTop:0x4E5654,skyLow:0xB0B4A6,dens:1.9,light:0xD8DCD0,amb:0.6,sun:0.42,stars:0,mix:["shadow","human"]},
  frozen:{name:"The Frozen Realm",ground:0xB8CCDA,tex:"snow",path:0xA0B8CA,skyTop:0x223E5E,skyLow:0xB0D2E4,dens:1.5,light:0xD8ECFF,amb:0.72,sun:0.6,stars:0.3,mix:["creature","bird"]},
  elsewhere:{name:"Another World",ground:0x44546A,tex:"earth",path:0x66788C,skyTop:0x1A2A4A,skyLow:0x86C6B4,dens:1.5,light:0xC8F0E0,amb:0.62,sun:0.55,stars:0.4,mix:["creature","human","shadow"]}
};
/* phrases that mean the dream has crossed into another world. bare words that
   turn up in ordinary speech ("what the hell", "good heavens") are left out. */
var REALM_WORDS=[
  ["underworld",["the underworld","underworld","into hell","in hell","down to hell","hades","the netherworld","beneath the earth","under the earth","the land below"]],
  ["heavens",["into heaven","in heaven","up to heaven","above the clouds","into the clouds","into the sky","the sky realm","the celestial realm","paradise"]],
  ["depths",["beneath the sea","under the sea","under the water","underwater","the depths","bottom of the sea","bottom of the ocean","the sea floor","the ocean floor"]],
  ["faerie",["faerie","fairyland","fairy land","land of the fae","elfland","the otherworld","otherworld"]],
  ["void",["the void","into the void","nothingness","the dark between","into the abyss"]],
  ["mirror",["mirror world","through the mirror","through the looking glass","the reflection world","other side of the mirror","inside the mirror"]],
  ["dead",["land of the dead","the afterlife","afterlife","the spirit world","spirit realm","beyond the veil","world of the dead"]],
  ["frozen",["ice realm","frozen world","land of ice","frozen realm"]],
  ["elsewhere",["another world","another realm","another dimension","a different world","a strange world","another place entirely","a parallel world"]]
];
var RETURN_WORDS=["came back","come back","back home","back to the town","back in the town","returned","went back","woke up","i woke","back through"];

function realms(){ if(!store.realms) store.realms=[]; return store.realms; }
function realmById(id){ var r=realms(); for(var i=0;i<r.length;i++) if(r[i].id===id) return r[i]; return null; }
function realmAtX(x){
  var id=Math.round(x/REALM_GAP); if(id<=0) return null;
  return realmById(id);
}
function realmTemplate(r){ if(!r) return null; var t=REALMS[r.kind]||REALMS.elsewhere; t.kind=r.kind; return t; }

/* ---- crossing over and coming back ---- */
function makeRealm(kind){
  var ex=realms().filter(function(r){ return r.kind===kind; })[0];
  if(ex) return ex;
  var id=1; realms().forEach(function(r){ if(r.id>=id) id=r.id+1; });
  var x0=id*REALM_GAP;
  var r={id:id,kind:kind,name:REALMS[kind].name,x0:x0,grid:{bx:Math.round(x0/PITCH),bz:0,lot:0},night:store.session};
  realms().push(r);
  realmGround(r);
  if(typeof realmScenery==="function") realmScenery(r);
  return r;
}
function enterRealm(kind,secret,via,guide){
  var r=makeRealm(kind);
  if(typeof realmScenery==="function") realmScenery(r);
  if(store.here===r.id) return r;
  /* the way in: what you passed through, or the last place stood in on this side,
     or a door made for it */
  var dep=via?place("portal",via,secret?{hidden:1}:{}):null;
  if(!dep) dep=store.lastAny?specById(store.lastAny):null;
  if(!dep||(dep.realm||0)!==(store.here||0)) dep=store.lastId?specById(store.lastId):null;
  if(!dep||(dep.realm||0)!==(store.here||0)||dep.filler) dep=place("secretdoor","a door that shouldn't be there",{hidden:secret?1:0});
  if(!store.here) store.townGrid=store.grid; else { var cur=realmById(store.here); if(cur) cur.grid=store.grid; }
  store.here=r.id; store.grid=r.grid; store.lastLot=null;
  /* the way back stands where you arrive */
  var arr=place("portal","the way back",{});
  addPassage(dep.id,arr.id,secret?"secret":"portal",!!secret);
  store.lastId=arr.id; store.lastAny=arr.id;
  /* a deity dreamt leading the way goes across with the dreamer */
  if(guide){
    guide.x=arr.x+3; guide.z=arr.z+2; guide.realm=r.id;
    var gc=charOf(guide);
    if(gc){ gc.x=guide.x; gc.z=guide.z; gc.anchor={x:guide.x,z:guide.z}; addDetail(gc,"led the dreamer into "+r.name); }
    refresh(guide);
  }
  setStatus("<b>Crossed into "+esc(r.name)+".</b>");
  return r;
}
function leaveRealm(){
  if(!store.here) return;
  var cur=realmById(store.here); if(cur) cur.grid=store.grid;
  store.here=0; store.grid=store.townGrid||store.grid; store.lastLot=null; store.lastId=null; store.lastAny=null;
}

/* find where the dream crosses over, and where it comes back; blank those words out
   so "into the abyss" is a journey, not also a sinkhole */
function realmSwitchesIn(low){
  var out=[];
  REALM_WORDS.forEach(function(pair){
    pair[1].forEach(function(w){
      var needle=" "+w+" ", i=0;
      while((i=low.indexOf(needle,i))>-1){
        var before=low.slice(Math.max(0,i-16),i);
        if(typeof crossingMeant==="function"&&!crossingMeant(low,i,w)){ i+=needle.length-1; continue; }
        out.push({at:i,end:i+needle.length-1,kind:pair[0],secret:/\b(hidden|secret)\b/.test(before)||/\b(hidden|secret) (door|way|passage|path|stair)/.test(low.slice(Math.max(0,i-60),i))});
        i+=needle.length-1;
      }
    });
  });
  RETURN_WORDS.forEach(function(w){
    var needle=" "+w+" ", i=0;
    while((i=low.indexOf(needle,i))>-1){ out.push({at:i,end:i+needle.length-1,kind:null}); i+=needle.length-1; }
  });
  if(typeof CROSS_FALLBACK!=="undefined"){
    var m=CROSS_FALLBACK.exec(low);
    if(m&&!out.length) out.push({at:m.index,end:m.index+m[0].length,kind:"elsewhere"});
  }
  out.sort(function(a,b){ return a.at-b.at||(b.end-b.at)-(a.end-a.at); });
  var kept=[], last=-1;
  out.forEach(function(s){ if(s.at>last){ kept.push(s); last=s.end; } });
  /* the thing you pass through, when it's named in the crossing */
  kept.forEach(function(s){ var w=low.slice(s.at,s.end); if(/mirror|looking glass/.test(w)) s.via="mirror"; });
  /* "through the mirror into another world" is one crossing: the second phrase is
     where you arrive, the first is how you got there */
  var merged=[];
  kept.forEach(function(s){
    var p=merged[merged.length-1];
    if(p&&p.kind&&s.kind&&s.at-p.end<28){ s.via=s.via||p.via; s.secret=s.secret||p.secret; s.at=p.at; merged[merged.length-1]=s; }
    else merged.push(s);
  });
  return merged;
}

/* ---- the ground of each realm ---- */
var realmGrounds={};
function realmGround(r){
  if(!scene||realmGrounds[r.id]) return;
  /* Somnucor is not rolling land but a stepped cone of terraces and water */
  if(r.kind==="somnucor"&&r.atlantis&&typeof atlBuildTerrain==="function"){
    var ag=atlBuildTerrain(r); if(ag) realmGrounds[r.id]=ag; return;
  }
  var t=realmTemplate(r);
  /* real ground, not a sheet: it rises and falls, and keeps clear of what stands on it */
  var SEG=90, SIZE=3000;
  var g=new THREE.PlaneGeometry(SIZE,SIZE,SEG,SEG); metreUVs(g,"pln",[SIZE,SIZE]);
  var pos=g.attributes&&g.attributes.position;
  var amp=(t.flat===true)?0:(t.amp!==undefined?t.amp:5);
  if(pos&&amp>0&&typeof vnoise==="function"){
    var keep=[];
    store.objects.forEach(function(o){
      if((o.realm||0)!==r.id) return;
      var d=KIT[o.archetype]; if(!d) return;
      keep.push([o.x-r.x0,o.z,Math.max(d.size[0],d.size[2])*((o.attrs&&o.attrs.s)||1)*0.6+14]);
    });
    for(var i=0;i<pos.count;i++){
      var x=pos.getX(i), zz=-pos.getY(i), near=Infinity;
      for(var k=0;k<keep.length;k++){
        var dx=x-keep[k][0], dz=zz-keep[k][1];
        near=Math.min(near,Math.sqrt(dx*dx+dz*dz)-keep[k][2]);
      }
      var flat=near<0?0:Math.min(1,near/70);
      var hgt=(vnoise(x/180,zz/180)-0.5)*amp*2+(vnoise(x/60,zz/60)-0.5)*amp*0.6;
      pos.setZ(i,hgt*flat);
    }
    pos.needsUpdate=true; if(g.computeVertexNormals) g.computeVertexNormals();
  }
  var tx=t.tex&&landOpt("detail")?texOf(t.tex):null;
  var m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:t.ground,map:tx,polygonOffset:true,polygonOffsetFactor:2,polygonOffsetUnits:4}));
  m.rotation.x=-Math.PI/2; m.position.set(r.x0,-0.06,0); m.receiveShadow=true;
  m.userData.realmGround=r.id;
  scene.add(m); realmGrounds[r.id]=m;
}
function realmGroundsAll(){
  Object.keys(realmGrounds).forEach(function(k){ if(!realmById(+k)){ scene.remove(realmGrounds[k]); delete realmGrounds[k]; } });
  realms().forEach(realmGround);
}

/* ---- sky and light where you are ---- */
var lastRealmSeen=null;
function focusX(){ return walkMode?camera.position.x:orb.tx; }
function applyRealmLight(dl){
  var r=realmAtX(focusX()), t=realmTemplate(r);
  if(sunDisc) sunDisc.visible=sunDisc.visible&&!t;
  if(moonDisc) moonDisc.visible=moonDisc.visible&&!t;
  if(!t) return;
  /* Somnucor keeps real days and real nights: dark enough after sundown that
     its lamps, its windows and the Tower's lights mean something */
  var nd=t.daynight?0.82:0.35;
  var top=blend(t.skyTop,0x000000,(1-dl)*nd), low=blend(t.skyLow,t.daynight?0x0A0C1A:0x000000,(1-dl)*(t.daynight?0.85:0.3));
  if(sky){ sky.material.uniforms.top.value.setHex(top); sky.material.uniforms.low.value.setHex(low); }
  scene.background.setHex(low);
  if(scene.fog){ scene.fog.color.setHex(low); if(scene.fog.density!==undefined) scene.fog.density*=t.dens; }
  if(t.daynight){
    if(hemi){ hemi.color.setHex(blend(0x5A6AA8,t.light,dl)); hemi.groundColor.setHex(blend(t.ground,0x000000,0.6)); hemi.intensity=t.amb*(0.42+0.58*dl); }
    if(sun){ sun.color.setHex(blend(0x8A9AD8,t.light,dl)); sun.intensity=t.sun*(0.06+0.94*dl); }
  } else {
    if(hemi){ hemi.color.setHex(t.light); hemi.groundColor.setHex(blend(t.ground,0x000000,0.6)); hemi.intensity=t.amb*(0.75+0.25*dl); }
    if(sun){ sun.color.setHex(t.light); sun.intensity=t.sun*(0.7+0.3*dl); }
  }
  if(stars) stars.material.opacity=Math.max(stars.material.opacity,t.stars);
}
/* stepping through a portal changes the world at once, not at the next tick */
/* move the books to a world without crossing into it: you are simply there */
function beHere(id){
  if((store.here||0)===(id||0)) return;
  if(!store.here) store.townGrid=store.grid;
  else { var cur=realmById(store.here); if(cur) cur.grid=store.grid; }
  if(id){ var r=realmById(id); if(!r) return; store.here=r.id; store.grid=r.grid; }
  else { store.here=0; store.grid=store.townGrid||store.grid; }
  store.lastLot=null;
  /* whatever was last dreamt stands in the world you just left; it is no longer "here" */
  var l=store.lastId?specById(store.lastId):null;
  if(!l||(l.realm||0)!==(store.here||0)) store.lastId=null;
  var a=store.lastAny?specById(store.lastAny):null;
  if(!a||(a.realm||0)!==(store.here||0)) store.lastAny=null;
  save();
}

function realmWatch(){
  if(store.inside) return;   // an interior stands apart; you are still in the world you walked in from
  var r=realmAtX(focusX()), id=r?r.id:0;
  /* where you are is where you build: this runs every look, and does nothing when nothing moved */
  beHere(id);
  if(id!==lastRealmSeen){
    lastRealmSeen=id;
    tickClock(true);
    var badge=document.getElementById("realmname");
    if(badge){ badge.textContent=r?r.name:""; badge.classList.toggle("gone",!r); }
  }
}

/* ---- the list of realms, in The land ---- */
function renderRealmList(){
  var el=document.getElementById("l-realms"); if(!el) return;
  var R=realms();
  if(!R.length){
    el.innerHTML='<p class="small-note">No other worlds yet. Dream your way into one &mdash; <i>"I went down into the underworld", "I found myself somewhere else"</i> &mdash; or cross straight into one here.</p>'+
      (joined?'':'')+'<div class="l-realm"><span>Cross into\u2026</span><select id="l-cross"><option value="">choose a world</option>'+
      Object.keys(REALMS).map(function(k){ return '<option value="'+k+'">'+esc(REALMS[k].name)+"</option>"; }).join("")+'</select></div>';
    var c0=document.getElementById("l-cross");
    if(c0) c0.onchange=function(){
      var k=c0.value; if(!k) return;
      enterRealm(k,false,null,null);
      var r=realms()[realms().length-1];
      setStatus("<b>"+esc(REALMS[k].name)+".</b> A way back stands where you came in.");
      visitRealm(r?r.id:0); closeLand(); save();
    };
    return;
  }
  var joined=(typeof joinedSomnucor==="function")&&joinedSomnucor();
  var chooser=!joined
    ? '<div class="l-realm"><span><b>Somnucor</b> &mdash; the shared city, if you want it. Joining is in Settings.</span></div>'
    : '<div class="l-realm"><span><b>Somnucor</b> &mdash; the city at the middle of everything</span><button class="btn" id="l-hub">Go there</button></div>'+
    (joined?'<div class="l-realm"><span><b>Temple Row</b> &mdash; a house for every power the Atlas knows</span><button class="btn" id="l-row">Go there</button></div>':'')+
    (joined?'<div class="l-realm"><span><b>The Hall of Doors</b> &mdash; a door for every world, and for every dreamer</span><button class="btn" id="l-hall">Go there</button></div>':'')+
    '<div class="l-realm"><span>Cross into\u2026</span><select id="l-cross">'+
    '<option value="">choose a world</option>'+
    Object.keys(REALMS).map(function(k){ return '<option value="'+k+'">'+esc(REALMS[k].name)+"</option>"; }).join("")+
    '</select></div>';
  el.innerHTML=chooser+R.map(function(r){
    return '<div class="l-realm"><span>'+esc(r.name)+'</span><button class="btn" data-visit="'+r.id+'">Go there</button></div>';
  }).join("")+'<div class="l-realm"><span>The town</span><button class="btn" data-visit="0">Go there</button></div>';
  var rowBtn=document.getElementById("l-row");
  if(rowBtn) rowBtn.onclick=function(){ if(typeof toTempleRow==="function") toTempleRow(); closeLand(); };
  var hallBtn=document.getElementById("l-hall");
  if(hallBtn) hallBtn.onclick=function(){ if(typeof toHall==="function") toHall(); if(typeof openHall==="function") openHall(); closeLand(); };
  var hubBtn=document.getElementById("l-hub");
  if(hubBtn) hubBtn.onclick=function(){ toSomnucor(); closeLand(); };
  var cross=document.getElementById("l-cross");
  if(cross) cross.onchange=function(){
    var k=cross.value; if(!k) return;
    enterRealm(k,false,null,null);
    var r=realms()[realms().length-1];
    setStatus("<b>"+esc(REALMS[k].name)+".</b> A way back stands where you came in.");
    visitRealm(r?r.id:0); closeLand(); save();
  };
  Array.prototype.forEach.call(el.querySelectorAll("[data-visit]"),function(b){
    b.onclick=function(){ visitRealm(+b.getAttribute("data-visit")); closeLand(); };
  });
}
function visitRealm(id){
  if(walkMode) setWalk(false);
  var r=realmById(id), g=r?r.grid:(store.here?store.townGrid:store.grid)||{bx:0,bz:0};
  var o=blockOrigin(r?Math.round(r.x0/PITCH):0,0);
  if(!r){ var h=heartOf(0); o={x:h.x,z:h.z}; }
  orb.tx=o.x; orb.tz=o.z; viewAt={x:o.x,z:o.z};
  realmWatch();
}

/* the other worlds' scenery, new worlds and mythic names (realm-kit.js) */
if(typeof extendRealms==="function") extendRealms();
if(typeof extendRealms2==="function") extendRealms2();
if(typeof extendRealms3==="function") extendRealms3();
if(typeof widenRealmWords==="function") widenRealmWords();

