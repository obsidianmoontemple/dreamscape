/* Dream Walker's Atlas — clock.js
   the hours, routines, sky, sun, moon and stars
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   6c. THE CLOCK — the dreamscape keeps its own hours,
       and by default they are yours
   ============================================================ */
var scrubOffset=null;   // null means follow the real clock

function dreamHour(){
  if(scrubOffset!==null) return scrubOffset;
  var d=new Date();
  return d.getHours()+d.getMinutes()/60+d.getSeconds()/3600;
}
function hhmm(h){
  var H=Math.floor(h)%24, M=Math.floor((h-Math.floor(h))*60);
  return (H<10?"0":"")+H+":"+(M<10?"0":"")+M;
}

/* what a kind of figure does with its day.
   [fromHour, toHour, where, what] — where is home | work | travel | out | roam | gone */
var ROUTINE={
  human:[[0,6.5,"home","asleep"],[6.5,7.75,"home","waking, moving about"],
         [7.75,8.5,"travel","on the way to work"],[8.5,12.5,"work","at work"],
         [12.5,13.5,"out","out at midday"],[13.5,17.5,"work","at work"],
         [17.5,18.25,"travel","walking home"],[18.25,19.5,"home","at dinner"],
         [19.5,21.5,"out","out for the evening"],[21.5,22.75,"home","settling for the night"],
         [22.75,24,"home","asleep"]],
  child:[[0,7,"home","asleep"],[7,8.5,"home","getting ready"],
         [8.5,9,"travel","walking to school"],[9,15,"work","at school"],
         [15,15.5,"travel","coming home"],[15.5,18,"out","playing out"],
         [18,19,"home","at dinner"],[19,20.5,"home","being put to bed"],[20.5,24,"home","asleep"]],
  crowd:[[0,7,"gone","not about"],[7,9.5,"out","the morning press"],[9.5,12,"gone","dispersed"],
         [12,14,"out","the midday crowd"],[14,17,"gone","dispersed"],
         [17,19,"out","the evening press"],[19,24,"gone","gone home"]],
  shadow:[[0,5,"roam","abroad in the dark"],[5,19.5,"gone","nowhere to be found"],
          [19.5,24,"roam","abroad in the dark"]],
  creature:[[0,4.5,"roam","hunting"],[4.5,21,"gone","gone to ground"],[21,24,"roam","hunting"]],
  dog:[[0,6,"home","asleep by the door"],[6,8,"home","wanting out"],[8,18,"roam","wandering"],
       [18,20,"home","fed"],[20,24,"home","asleep by the door"]],
  cat:[[0,5.5,"roam","out on the walls"],[5.5,17,"home","asleep somewhere warm"],
       [17,21,"home","waiting"],[21,24,"roam","out on the walls"]],
  horse:[[0,6,"home","standing asleep"],[6,19,"out","in the field"],[19,24,"home","standing asleep"]],
  bird:[[0,5,"gone","roosting"],[5,9,"roam","at the dawn"],[9,17,"roam","circling"],
        [17,20,"roam","at the dusk"],[20,24,"gone","roosting"]]
};
function routineOf(c){
  if(c.routine) return c.routine;                 // came out of the dream
  if(!c.primary) return ROUTINE[c.archetype]||ROUTINE.human;  // fillers may borrow
  return null;                                     // a primary with no recorded life
}

function slotAt(c,h){
  var r=routineOf(c);
  if(!r) return null;
  for(var i=0;i<r.length;i++) if(h>=r[i][0] && h<r[i][1]) return {i:i,s:r[i],
    t:(h-r[i][0])/Math.max(0.01,r[i][1]-r[i][0])};
  return {i:0,s:r[0],t:0};
}

/* ---- building a life out of what the dream said ---- */
var ROLEWORK={nurse:"hospital",doctor:"hospital",surgeon:"hospital",patient:"hospital",
priest:"church",nun:"church",minister:"church",teacher:"school",pupil:"school",student:"school",
librarian:"library",clerk:"bank",teller:"bank",banker:"bank",guard:"institution",
warden:"institution",driver:"station",conductor:"station",porter:"station",
shopkeeper:"shop",baker:"shop",barman:"shop",waitress:"shop",butcher:"shop",
worker:"factory",foreman:"factory",machinist:"factory",judge:"courthouse",
keeper:"lighthouse",farmer:"barn",miller:"windmill",soldier:"institution",nightwatchman:"institution"};

var TIMEWORD=[
["all night",[20,6]],["after dark",[20,5]],["at night",[20,5]],["in the dark",[20,5]],
["before dawn",[4,6]],["at dawn",[5,7]],["at sunrise",[5.5,7]],["in the morning",[7,12]],
["at midday",[12,13]],["at noon",[12,13]],["in the afternoon",[13,17]],
["at dusk",[19,20.5]],["at sunset",[19,20.5]],["in the evening",[18,21.5]],
["at midnight",[23,1]],["night shift",[21,6]],["nights",[21,6]],["every morning",[7,12]]];

var ACTWORD=[
["working","work"],["at work","work"],["on shift","work"],["serving","work"],["teaching","work"],
["asleep","home"],["sleeping","home"],["in bed","home"],["at dinner","home"],["eating","home"],
["at home","home"],["cooking","home"],["waiting","out"],["watching","out"],["standing","out"],
["sitting","out"],["walking","out"],["wandering","roam"],["following","roam"],["searching","roam"],
["driving","roam"],["running","roam"],["praying","work"],["digging","work"]];

/* returns a routine array, or null if the dream said nothing about hours */
function routineFrom(text,role,shift){
  if(!text&&!shift) return null;
  var low=" "+String(text||"").toLowerCase()+" ";
  var win=null, act=null;
  for(var i=0;i<TIMEWORD.length;i++) if(low.indexOf(" "+TIMEWORD[i][0]+" ")>-1){ win=TIMEWORD[i][1]; break; }
  for(var j=0;j<ACTWORD.length;j++) if(low.indexOf(" "+ACTWORD[j][0]+" ")>-1){ act=ACTWORD[j][1]; break; }
  /* a stated shift is about work unless the dream plainly said otherwise */
  if(shift==="night"){ win=[21,6]; if(act!=="home") act="work"; }
  else if(shift==="day"){ if(!win) win=[8.5,17.5]; if(act!=="home") act="work"; }
  if(!win && !act) return null;
  if(!win) win=[8.5,17.5];
  if(!act) act=role?"work":"out";
  if(role && act==="out" && !shift) act="work";

  var a=win[0], b=win[1], verb=act==="work"?"at work":act==="home"?"at home":act==="roam"?"abroad":"out";
  var rest=act==="home"?"out":"home";
  var restVerb=rest==="home"?"at home":"out";
  var r=[];
  if(b>a){
    if(a>0) r.push([0,a,rest,restVerb]);
    r.push([a,b,act,verb]);
    if(b<24) r.push([b,24,rest,restVerb]);
  } else {                       // the window wraps midnight
    r.push([0,b,act,verb]);
    r.push([b,a,rest,restVerb]);
    r.push([a,24,act,verb]);
  }
  return r;
}

function roleOf(c){
  var hay=(c.role||"")+" "+c.aka.join(" ")+" "+c.details.join(" ");
  hay=hay.toLowerCase();
  for(var k in ROLEWORK) if(hay.indexOf(k)>-1) return k;
  return null;
}

/* homes and workplaces, found among what actually exists */
var RESIDENTIAL={house:1,cottage:1,apartment:1,motel:1,hotel:1,tent:1,ruin:1,barn:1,shed:1};
var WORKPLACE={institution:1,hospital:1,school:1,bank:1,library:1,station:1,courthouse:1,
  shop:1,warehouse:1,factory:1,church:1,cathedral:1,tower:1,skyscraper:1,barn:1,lighthouse:1,windmill:1};

function nearestOf(x,z,test,skipId){
  var best=null,bd=Infinity;
  for(var i=0;i<store.objects.length;i++){
    var o=store.objects[i];
    if(o.id===skipId||!test[o.archetype]) continue;
    var dx=o.x-x,dz=o.z-z,d=dx*dx+dz*dz;
    if(d<bd){ bd=d; best=o; }
  }
  return best;
}

function assignLife(c){
  if(!c.src) c.src={};
  if(!c.anchor) c.anchor={x:c.x,z:c.z};

  if(!c.primary){                       // fillers may borrow whatever stands nearest
    if(!c.home){ var fh=nearestOf(c.x,c.z,RESIDENTIAL); if(fh){ c.home=fh.id; c.src.home="filled"; } }
    if(!c.work){ var fw=nearestOf(c.x,c.z,WORKPLACE);   if(fw){ c.work=fw.id; c.src.work="filled"; } }
    return;
  }

  /* a role the dream named points at the kind of place they'd be found */
  if(!c.work){
    var role=roleOf(c);
    if(role){
      c.role=role;
      var want={}; want[ROLEWORK[role]]=1;
      var w=nearestOf(c.anchor.x,c.anchor.z,want);
      if(w){ c.work=w.id; c.src.work="parsed"; }
    }
  }
  /* hours exist only if the dream described hours */
  if(!c.routine){
    var r=routineFrom(c.details.join(". "),c.role,c.shift);
    if(r){ c.routine=r; c.src.routine="parsed"; }
  }
  /* a home is never guessed for a primary. unknown stays unknown. */
}

/* two names, one person. keep the older record and take everything from the other. */
function mergeCharacters(keepId,dropId){
  var keep=null,drop=null;
  store.characters.forEach(function(c){
    if(c.id===keepId) keep=c;
    if(c.id===dropId) drop=c;
  });
  if(!keep||!drop||keep===drop) return false;

  drop.aka.forEach(function(a){ if(keep.aka.indexOf(a)===-1) keep.aka.push(a); });
  if(drop.name && keep.aka.indexOf(normName(drop.name))===-1) keep.aka.push(normName(drop.name));
  drop.details.forEach(function(d){ addDetail(keep,d); });
  drop.sessions.forEach(function(n){ if(keep.sessions.indexOf(n)===-1) keep.sessions.push(n); });
  keep.sessions.sort(function(a,b){ return a-b; });
  keep.log=(drop.log||[]).concat(keep.log||[]);
  if(drop.born && (!keep.born || drop.born<keep.born)) keep.born=drop.born;

  /* a fact the dream stated beats one that was only read or filled */
  ["home","work","routine","role","shift"].forEach(function(k){
    var ks=(keep.src&&keep.src[k])||null, ds=(drop.src&&drop.src[k])||null;
    var rank={stated:3,parsed:2,filled:1};
    if(drop[k] && (!keep[k] || (rank[ds]||0)>(rank[ks]||0))){
      keep[k]=drop[k];
      if(!keep.src) keep.src={};
      keep.src[k]=ds;
    }
  });

  /* the body the dreamer last saw is the one that stays standing */
  var dropSpec=drop.objId?specById(drop.objId):null;
  var keepSpec=keep.objId?specById(keep.objId):null;
  if(dropSpec){
    if(keepSpec && keepSpec.id!==dropSpec.id){
      if(meshes[keepSpec.id]){ scene.remove(meshes[keepSpec.id]); delete meshes[keepSpec.id]; }
      var ki=store.objects.indexOf(keepSpec); if(ki>-1) store.objects.splice(ki,1);
    }
    dropSpec.charId=keep.id;
    dropSpec.label=keep.name;
    keep.objId=dropSpec.id;
    keep.x=dropSpec.x; keep.z=dropSpec.z;
    keep.anchor={x:dropSpec.x,z:dropSpec.z};
    refresh(dropSpec);
  }

  var di=store.characters.indexOf(drop);
  if(di>-1) store.characters.splice(di,1);
  checkWake(keep);
  save(); tickClock(true); updateCount();
  return true;
}

function knownGaps(c){
  var g=[];
  if(!c.home) g.push("where they live");
  if(!c.work) g.push("where they go by day");
  if(!c.routine) g.push("their hours");
  return g;
}

/* the dreamer may choose to fill the gaps — recorded as filled, never as dreamt */
function giveLife(c){
  if(!c.src) c.src={};
  var h=nearestOf(c.anchor.x,c.anchor.z,RESIDENTIAL);
  if(h&&!c.home){ c.home=h.id; c.src.home="filled"; }
  var w=nearestOf(c.anchor.x,c.anchor.z,WORKPLACE);
  if(w&&!c.work){ c.work=w.id; c.src.work="filled"; }
  if(!c.routine){ c.routine=(ROUTINE[c.archetype]||ROUTINE.human).slice(); c.src.routine="filled"; }
  save(); tickClock(true);
}

function placeOfSlot(c,where){
  if(where==="home") return c.home?specById(c.home):null;
  if(where==="work") return c.work?specById(c.work):null;
  return null;
}

/* where is this figure right now, and what are they doing */
function whereabouts(c,h){
  assignLife(c);
  var sl=slotAt(c,h);
  if(!sl){
    var an=c.anchor||{x:c.x,z:c.z};
    return {x:an.x, z:an.z, at:nearestNamed(an.x,an.z,45), doing:"where you dreamt them",
            where:"anchor", visible:true, asleep:false, unknown:true};
  }
  var where=sl.s[2], doing=sl.s[3];
  var home=c.home?specById(c.home):null;
  var work=c.work?specById(c.work):null;
  var anchor=c.anchor||{x:c.x,z:c.z};
  var pos, at=null, visible=true;

  if(where==="gone"){ visible=false; pos=anchor; }
  else if(where==="home"){ at=home; pos=home?offsetAt(home,c,3):anchor; }
  else if(where==="work"){
    at=work||null;
    if(!at){ doing=doing+" \u2014 somewhere you never saw"; pos=anchor; }
    else pos=offsetAt(at,c,4);
  }
  else if(where==="out"){
    var pub=nearestOf(anchor.x,anchor.z,{fountain:1,grass:1,shop:1,station:1,pier:1,bench:1});
    at=pub; pos=pub?offsetAt(pub,c,6):{x:anchor.x+14,z:anchor.z+14};
  }
  else if(where==="roam"){
    var a=(h*0.9+hash(c.id)%100)*0.6, r=26+((hash(c.id)>>>3)%40);
    pos={x:anchor.x+Math.cos(a)*r, z:anchor.z+Math.sin(a)*r};
  }
  else if(where==="travel"){
    var from=home, to=work;
    if(sl.s[3].indexOf("home")>-1){ from=work; to=home; }
    var A=from?offsetAt(from,c,3):anchor, B=to?offsetAt(to,c,4):anchor;
    pos={x:A.x+(B.x-A.x)*sl.t, z:A.z+(B.z-A.z)*sl.t};
    at=null;
  }
  return {x:pos.x, z:pos.z, at:at, doing:doing, where:where, visible:visible,
          asleep:doing.indexOf("asleep")>-1};
}
/* stand beside a building rather than inside it */
function offsetAt(o,c,d){
  var s=(KIT[o.archetype]||KIT.house).size;
  var a=(hash(c.id)%628)/100;
  var r=Math.max(s[0],s[2])*0.6+d;
  return {x:o.x+Math.cos(a)*r, z:o.z+Math.sin(a)*r};
}

/* ---- sky, light and the hour ----
   two colours per key hour: the zenith overhead and the horizon at the edge.
   the fog takes the horizon, so the world fades into the sky at its rim. */
var SKYKEY=[
 [0,   0x04050B,0x0B0E1C],
 [4.5, 0x060812,0x121729],
 [5.5, 0x141A33,0x3B3148],
 [6.25,0x2A3558,0x9A5E4E],
 [7,   0x4A6A98,0xD69A72],
 [8.5, 0x5E8CC2,0xB8C6D2],
 [12,  0x5A8FD0,0xC7D7E4],
 [16,  0x5C88C0,0xC4CFD6],
 [17.75,0x55709E,0xE0A878],
 [18.75,0x3A3F6A,0xC56A52],
 [19.6,0x1C2040,0x5A3A50],
 [20.75,0x0A0D1E,0x1A1B30],
 [22,  0x05060E,0x0D1020],
 [24,  0x04050B,0x0B0E1C]];

function skyAt(h){
  for(var i=0;i<SKYKEY.length-1;i++){
    var a=SKYKEY[i], b=SKYKEY[i+1];
    if(h>=a[0]&&h<=b[0]){
      var t=(h-a[0])/(b[0]-a[0]);
      return {top:blend(a[1],b[1],t), low:blend(a[2],b[2],t)};
    }
  }
  return {top:SKYKEY[0][1], low:SKYKEY[0][2]};
}
function daylight(h){
  if(h<5||h>=20.5) return 0;
  if(h<7.25) return (h-5)/2.25;
  if(h<17.5) return 1;
  return 1-(h-17.5)/3;
}

/* the moon is the real one: its phase comes from today's date */
function moonPhase(d){
  var ref=Date.UTC(2000,0,6,18,14);
  var days=((d||new Date()).getTime()-ref)/86400000;
  var p=(days/29.530588853)%1;
  return p<0?p+1:p;
}
function moonName(p){
  if(p<0.03||p>=0.97) return "new moon";
  if(p<0.22) return "waxing crescent";
  if(p<0.28) return "first quarter";
  if(p<0.47) return "waxing gibbous";
  if(p<0.53) return "full moon";
  if(p<0.72) return "waning gibbous";
  if(p<0.78) return "last quarter";
  return "waning crescent";
}
function moonLit(p){ return (1-Math.cos(p*2*Math.PI))/2; }

function moonTexture(p){
  var c=document.createElement("canvas"); c.width=c.height=128;
  var x=c.getContext("2d"), r=58, cx=64, cy=64;
  x.clearRect(0,0,128,128);
  var glow=x.createRadialGradient(cx,cy,r*0.9,cx,cy,r*1.08);
  glow.addColorStop(0,"rgba(220,226,240,0.28)"); glow.addColorStop(1,"rgba(220,226,240,0)");
  x.fillStyle=glow; x.beginPath(); x.arc(cx,cy,r*1.08,0,Math.PI*2); x.fill();
  x.fillStyle="#1a1d27"; x.beginPath(); x.arc(cx,cy,r,0,Math.PI*2); x.fill();
  var waxing=p<0.5, k=Math.cos(p*2*Math.PI);
  x.fillStyle="#E4E6EE";
  x.beginPath();
  x.arc(cx,cy,r,-Math.PI/2,Math.PI/2,!waxing);
  x.ellipse(cx,cy,Math.abs(k)*r,r,0,Math.PI/2,-Math.PI/2,(k>0)===waxing);
  x.closePath(); x.fill();
  x.globalAlpha=0.12; x.fillStyle="#5a5f72";
  [[-18,-14,9],[14,10,12],[-6,22,7],[20,-20,6]].forEach(function(m){
    x.beginPath(); x.arc(cx+m[0],cy+m[1],m[2],0,Math.PI*2); x.fill();
  });
  var t=new THREE.CanvasTexture(c); return t;
}

var sky=null, sunDisc=null, moonDisc=null, stars=null, curPhase=-1;
var SKY_R=2600;

function buildSky(){
  var geo=new THREE.SphereGeometry(SKY_R,32,20);
  var mat=new THREE.ShaderMaterial({
    uniforms:{top:{value:new THREE.Color(0x04050B)},low:{value:new THREE.Color(0x0B0E1C)}},
    vertexShader:"varying vec3 vP; void main(){ vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader:"uniform vec3 top; uniform vec3 low; varying vec3 vP; void main(){ float h=clamp(vP.y,0.0,1.0); float t=pow(h,0.55); gl_FragColor=vec4(mix(low,top,t),1.0); }",
    side:THREE.BackSide, depthWrite:false, depthTest:false, fog:false
  });
  sky=new THREE.Mesh(geo,mat);
  sky.renderOrder=-10;
  scene.add(sky);

  sunDisc=new THREE.Mesh(new THREE.CircleGeometry(90,40),
    new THREE.MeshBasicMaterial({color:0xFFF1D0,transparent:true,opacity:1,fog:false,depthWrite:false}));
  var halo=new THREE.Mesh(new THREE.CircleGeometry(230,40),
    new THREE.MeshBasicMaterial({color:0xFFD9A0,transparent:true,opacity:0.18,fog:false,depthWrite:false}));
  halo.position.z=-2; sunDisc.add(halo); sunDisc.userData.halo=halo;
  sunDisc.renderOrder=-9;
  scene.add(sunDisc);

  moonDisc=new THREE.Mesh(new THREE.PlaneGeometry(210,210),
    new THREE.MeshBasicMaterial({transparent:true,opacity:1,fog:false,depthWrite:false}));
  moonDisc.renderOrder=-9;
  scene.add(moonDisc);

  var n=1400, pos=new Float32Array(n*3);
  for(var i=0;i<n;i++){
    var u=Math.random(), v=Math.random()*0.92+0.04;
    var th=u*Math.PI*2, ph=Math.acos(1-v);
    var r=SKY_R*0.97;
    pos[i*3]=r*Math.sin(ph)*Math.cos(th);
    pos[i*3+1]=r*Math.cos(ph);
    pos[i*3+2]=r*Math.sin(ph)*Math.sin(th);
  }
  var sg=new THREE.BufferGeometry();
  sg.setAttribute("position",new THREE.BufferAttribute(pos,3));
  stars=new THREE.Points(sg,new THREE.PointsMaterial({color:0xE8ECF6,size:2.2,sizeAttenuation:false,
    transparent:true,opacity:0,fog:false,depthWrite:false}));
  stars.renderOrder=-9;
  scene.add(stars);
}

/* where a body sits on the sky dome for a given hour.
   the sun rises in the east at six and sets in the west at eighteen. */
function arcPos(hourAngle){
  var a=hourAngle*Math.PI;
  var R=SKY_R*0.9;
  return {x:Math.cos(a)*R, y:Math.sin(a)*R*0.92, z:-R*0.34};
}

function phaseWord(h){
  if(h<4.5||h>=22) return "Night";
  if(h<5.75) return "Before dawn";
  if(h<7.25) return "Dawn";
  if(h<11.5) return "Morning";
  if(h<13.5) return "Midday";
  if(h<17.25) return "Afternoon";
  if(h<19.25) return "Dusk";
  return "Evening";
}

var hemi,sun,lastHour=-1;
function tickClock(force){
  var h=dreamHour();
  if(!force && Math.abs(h-lastHour)<0.004) return;
  lastHour=h;

  var sk=skyAt(h), dl=daylight(h);
  var ph=moonPhase(), lit=moonLit(ph);

  if(sky){
    sky.material.uniforms.top.value.setHex(sk.top);
    sky.material.uniforms.low.value.setHex(sk.low);
  }
  scene.background.setHex(sk.low);
  if(scene.fog) scene.fog.color.setHex(sk.low);

  /* the sun: up from six to eighteen */
  var sa=arcPos((h-6)/12);
  var sunUp=sa.y>-SKY_R*0.05;
  if(sunDisc){
    sunDisc.visible=sunUp;
    sunDisc.userData.base=sa;
    var warm=1-Math.min(1,Math.max(0,sa.y/(SKY_R*0.35)));
    sunDisc.material.color.setHex(blend(0xFFF6E0,0xFF9A5A,warm));
    sunDisc.userData.halo.material.color.setHex(blend(0xFFE6B8,0xFF7A4A,warm));
    sunDisc.userData.halo.material.opacity=0.14+warm*0.22;
  }

  /* the moon rises later each night as it waxes, as the real one does */
  if(Math.abs(ph-curPhase)>0.005 && moonDisc){
    curPhase=ph;
    if(moonDisc.material.map) moonDisc.material.map.dispose();
    moonDisc.material.map=moonTexture(ph);
    moonDisc.material.needsUpdate=true;
  }
  var ma=arcPos((h-6-ph*24)/12);
  var moonUp=ma.y>-SKY_R*0.05 && lit>0.03;
  if(moonDisc){
    moonDisc.visible=moonUp;
    moonDisc.userData.base=ma;
    moonDisc.material.opacity=Math.max(0.25,1-dl*0.72);
  }

  if(stars) stars.material.opacity=Math.max(0,1-dl*1.6)*0.95;

  /* the light comes from whichever body is up */
  if(hemi){
    hemi.intensity=0.22+dl*1.05;
    hemi.color.setHex(blend(0x3A4468,0xCFDCEA,dl));
    hemi.groundColor.setHex(blend(0x07080D,0x5A5040,dl));
  }
  if(sun){
    if(sunUp && dl>0.02){
      sun.position.set(sa.x,Math.max(sa.y,40),sa.z);
      sun.intensity=0.15+dl*1.05;
      var warm2=1-Math.min(1,Math.max(0,sa.y/(SKY_R*0.35)));
      sun.color.setHex(blend(0xFFF4E2,0xFF9E6A,warm2));
    } else if(moonUp){
      sun.position.set(ma.x,Math.max(ma.y,40),ma.z);
      sun.intensity=0.06+lit*0.30;
      sun.color.setHex(0x9FB4D8);
    } else {
      sun.position.set(-300,500,180);
      sun.intensity=0.05;
      sun.color.setHex(0x6E7FA0);
    }
  }
  if(ground) ground.material.color.setHex(blend(0x0F1118,0x5B5A52,dl));
  fogForLight(dl);
  lampsForNight(1-dl);

  var el=document.getElementById("clock");
  if(el){
    var word=phaseWord(h);
    var glyph=(dl>0.35)?SUN_SVG:MOON_SVG;
    el.innerHTML=glyph+'<span class="cw">'+word+'</span><span class="ct">'+hhmm(h)+
      (scrubOffset!==null?" \u25b8":"")+"</span>"+
      (dl<0.35?'<span class="cm">'+moonName(ph)+"</span>":"");
  }

  seedNearby();
  balanceCrowds(h);
  moveEveryone(h,dl);
}

var SUN_SVG='<svg class="cg" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3.3" fill="currentColor"/>'+
  '<g stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M8 1.2v1.9M8 12.9v1.9M1.2 8h1.9M12.9 8h1.9M3.2 3.2l1.3 1.3M11.5 11.5l1.3 1.3M3.2 12.8l1.3-1.3M11.5 4.5l1.3-1.3"/></g></svg>';
var MOON_SVG='<svg class="cg" viewBox="0 0 16 16" aria-hidden="true"><path d="M10.6 2.2A6 6 0 1 0 13.8 10 4.8 4.8 0 0 1 10.6 2.2z" fill="currentColor"/></svg>';

/* the sky and its bodies stay centred on you, so the horizon never arrives */
function skyFollow(){
  if(!sky) return;
  var p=camera.position;
  sky.position.set(p.x,0,p.z);
  stars.position.set(p.x,0,p.z);
  [sunDisc,moonDisc].forEach(function(d){
    if(!d||!d.userData.base) return;
    var b=d.userData.base;
    d.position.set(p.x+b.x,b.y,p.z+b.z);
    d.lookAt(p.x,p.y,p.z);
  });
}

/* a block is only populated once there is a reason to be near it */
function seedNearby(){
  var p=walkMode?camera.position:{x:orb.tx,z:orb.tz};
  var bx=Math.round(p.x/PITCH), bz=Math.round(p.z/PITCH);
  for(var dx=-1;dx<=1;dx++) for(var dz=-1;dz<=1;dz++) seedBlock(bx+dx,bz+dz);
}

function moveEveryone(h,dl){
  var lit={};
  for(var i=0;i<store.characters.length;i++){
    var c=store.characters[i];
    if(!c.objId) continue;
    var w=whereabouts(c,h);
    c.x=w.x; c.z=w.z; c.doing=w.doing; c.atId=w.at?w.at.id:null; c.visible=w.visible;
    var g=meshes[c.objId];
    if(g){
      g.visible=w.visible;
      g.position.x+=(w.x-g.position.x)*0.25;
      g.position.z+=(w.z-g.position.z)*0.25;
    }
    if(w.at && !w.asleep) lit[w.at.id]=1;
    if(w.at && w.asleep && w.where==="home") lit[w.at.id]=lit[w.at.id]||0;
  }
  // window glow: bright where someone is up, dim where they sleep, off by day
  var night=1-dl;
  for(var id in meshes){
    var m=meshes[id];
    if(!m.userData.glass) continue;
    var base=night*(lit[id]?0.92:0.16);
    m.userData.glass.forEach(function(mat,k){
      mat.opacity=Math.min(1,base*(0.55+((hash(id+k)%100)/100)*0.75));
    });
  }
}


