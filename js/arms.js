/* SomnuMatrix — arms.js
   weapons and workings. things lying about that you can pick up and carry, and use:
   a bow looses an arrow, a wand throws fire, a staff calls lightning, a horn sounds.
   the workings themselves — fire, lightning, ice, light, shields, summonings — can
   also simply be dreamt, and they play where they were dreamt.
   nothing here harms a person: what is struck is marked, lit, frozen or scattered.
   loaded as a plain script; shares scope with the other files */
"use strict";

var STEELB=0xB8BCC4, HAFT=0x6B4A32, LEATHER=0x5A4232;

/* ---------- things you can pick up ---------- */
/* held: how it sits in the hand. shot: what it throws, if anything */
var ARMS={
  swordlying:{held:"sword",shot:null,name:"sword"},
  spearlying:{held:"spear",shot:null,name:"spear"},
  axelying:{held:"axe",shot:null,name:"axe"},
  daggerlying:{held:"dagger",shot:null,name:"dagger"},
  maelying:{held:"club",shot:null,name:"mace"},
  shieldlying:{held:"shield",shot:null,name:"shield"},
  bowlying:{held:"bow",shot:"arrow",name:"bow"},
  crossbowlying:{held:"bow",shot:"bolt",name:"crossbow"},
  slinglying:{held:"noose",shot:"stone",name:"sling"},
  rifle:{held:"spear",shot:"shot",name:"rifle"},
  pistol:{held:"dagger",shot:"shot",name:"pistol"},
  wand:{held:"staff",shot:"fire",name:"wand"},
  staffmagic:{held:"staff",shot:"lightning",name:"staff"},
  orbmagic:{held:"orb",shot:"light",name:"orb"},
  icestaff:{held:"staff",shot:"ice",name:"staff of frost"},
  hornlying:{held:"horn",shot:"sound",name:"horn"},
  torchlying:{held:"torch",shot:null,name:"torch"}
};
/* the weapons that already stand about the dreamscape can be picked up too */
ARMS.sword={held:"sword",shot:null,name:"sword"};
ARMS.axe={held:"axe",shot:null,name:"axe"};
ARMS.shield={held:"shield",shot:null,name:"shield"};
ARMS.orb={held:"orb",shot:"light",name:"orb"};
ARMS.swordstone={held:"sword",shot:null,name:"sword from the stone"};
function armLook(key){ return ARMS[key]; }

S("swordlying","infra",[1.6,.4,.5],[
  {g:"box",s:[.09,1.1,.03],p:[0,.08,0],r:[0,0,1.5708],c:STEELB},
  {g:"box",s:[.26,.05,.06],p:[-.5,.08,0],c:GOLD},
  {g:"cyl",s:[.035,.035,.24,8],p:[-.68,.08,0],r:[0,0,1.5708],c:LEATHER},
  {g:"sph",s:[.055],p:[-.82,.08,0],c:GOLD}
],["a sword","blade on the ground","longsword","broadsword","sword lying there"]);
S("spearlying","infra",[2.4,.4,.4],[
  {g:"cyl",s:[.035,.035,2.1,8],p:[0,.08,0],r:[0,0,1.5708],c:HAFT},
  {g:"cone",s:[.07,.32,6],p:[1.1,.08,0],r:[0,0,-1.5708],c:STEELB}
],["a spear","lance","pike","javelin"]);
S("axelying","infra",[1.2,.4,.5],[
  {g:"cyl",s:[.04,.04,1,8],p:[0,.08,0],r:[0,0,1.5708],c:HAFT},
  {g:"box",s:[.3,.26,.04],p:[.42,.14,0],c:STEELB}
],["an axe","woodaxe"]);
S("daggerlying","infra",[.6,.3,.3],[
  {g:"box",s:[.05,.34,.02],p:[0,.06,0],r:[0,0,1.5708],c:STEELB},
  {g:"box",s:[.14,.03,.04],p:[-.17,.06,0],c:GOLD},
  {g:"cyl",s:[.025,.025,.14,6],p:[-.26,.06,0],r:[0,0,1.5708],c:LEATHER}
],["a blade","dirk","stiletto"]);
S("maelying","infra",[1,.5,.4],[
  {g:"cyl",s:[.04,.04,.7,8],p:[0,.08,0],r:[0,0,1.5708],c:HAFT},
  {g:"sph",s:[.14],p:[.4,.12,0],c:0x8A8C92}
],["mace","war hammer","cudgel","flail"]);
S("shieldlying","infra",[1.1,.3,1.1],[
  {g:"cyl",s:[.5,.5,.07,20],p:[0,.06,0],c:0x9A6A3A},
  {g:"sph",s:[.09],p:[0,.11,0],c:GOLD},
  {g:"tor",s:[.48,.03],p:[0,.09,0],c:GOLD}
],["a shield","round shield"]);
S("bowlying","infra",[1.4,.4,.5],[
  {g:"tor",s:[.5,.025,Math.PI],p:[0,.07,0],r:[1.5708,0,0],c:HAFT},
  {g:"box",s:[.006,1,.006],p:[0,.07,0],r:[0,0,1.5708],c:0xE6DCC2},
  {g:"cyl",s:[.02,.02,.5,6],p:[.1,.05,.2],r:[0,0,1.5708],c:0x8A6A3A,rep:[3,0,.01,.06]}
],["bow","a bow","longbow","recurve bow","bow and arrows"]);
S("crossbowlying","infra",[1,.4,.9],[
  {g:"box",s:[.7,.07,.09],p:[0,.09,0],c:HAFT},
  {g:"box",s:[.06,.05,.8],p:[.15,.12,0],c:STEELB},
  {g:"box",s:[.006,.006,.8],p:[.1,.12,0],c:0xE6DCC2}
],["crossbow","a crossbow"]);
S("slinglying","infra",[.6,.2,.4],[
  {g:"box",s:[.18,.02,.1],p:[0,.03,0],c:LEATHER},
  {g:"cyl",s:[.006,.006,.5,4],p:[.24,.03,0],r:[0,0,1.5708],c:LEATHER,rep:[2,0,0,.08]}
],["sling","a sling","slingshot"]);
S("rifle","infra",[1.3,.3,.4],[
  {g:"box",s:[.9,.06,.06],p:[.1,.1,0],c:0x2A2C30},
  {g:"box",s:[.34,.12,.07],p:[-.4,.08,0],r:[0,0,.16],c:0x4A3A2A},
  {g:"cyl",s:[.022,.022,.5,8],p:[.55,.12,0],r:[0,0,1.5708],c:0x1A1C20}
],["rifle","gun","shotgun","musket","a gun on the ground"]);
S("pistol","infra",[.4,.2,.3],[
  {g:"box",s:[.24,.05,.04],p:[.03,.08,0],c:0x2A2C30},
  {g:"box",s:[.07,.14,.05],p:[-.07,.05,0],r:[0,0,.25],c:0x1A1C20}
],["pistol","revolver","handgun","a pistol"]);
S("wand","infra",[.5,.2,.2],[
  {g:"cyl",s:[.018,.012,.42,8],p:[0,.05,0],r:[0,0,1.5708],c:0x4A3A2A},
  {g:"sph",s:[.045],p:[.22,.05,0],c:0xFF8A3A,glow:1,pulse:1}
],["wand","magic wand","a wand","witch's wand"]);
S("staffmagic","infra",[2,.4,.4],[
  {g:"cyl",s:[.045,.05,1.9,8],p:[0,.1,0],r:[0,0,1.5708],c:HAFT},
  {g:"sph",s:[.11],p:[.95,.14,0],c:0x9FD8FF,glow:1,pulse:1},
  {g:"tor",s:[.14,.02],p:[.95,.14,0],c:0xC7A043}
],["staff","wizard's staff","magic staff","a staff on the ground","stave"]);
S("icestaff","infra",[2,.4,.4],[
  {g:"cyl",s:[.045,.05,1.9,8],p:[0,.1,0],r:[0,0,1.5708],c:0x8A94A0},
  {g:"cone",s:[.1,.3,6],p:[.95,.16,0],c:0xBFE4F4,glow:1,pulse:1}
],["staff of frost","frost staff","ice staff","staff of winter"]);
S("orbmagic","infra",[.5,.5,.5],[
  {g:"sph",s:[.18],p:[0,.2,0],c:0xC8A0FF,glow:1,pulse:1,opa:.9},
  {g:"cyl",s:[.14,.16,.08,10],p:[0,.05,0],c:0x4A4238}
],["crystal orb","seeing stone","scrying orb","glowing orb"]);
S("hornlying","infra",[.8,.4,.4],[
  {g:"cone",s:[.14,.7,10],p:[0,.12,0],r:[0,0,1.2],c:0xE6DCC2},
  {g:"tor",s:[.08,.02],p:[-.22,.1,0],c:GOLD}
],["horn","war horn","hunting horn","great horn"]);
S("torchlying","infra",[.8,.3,.3],[
  {g:"cyl",s:[.03,.035,.7,8],p:[0,.06,0],r:[0,0,1.5708],c:HAFT},
  {g:"cone",s:[.08,.26,6],p:[.36,.1,0],c:0xFFB23A,glow:1,pulse:1}
],["torch","a torch","burning brand","lit torch"]);
S("weaponrack2","infra",[2.6,2,.8],[
  {g:"box",s:[2.4,.12,.6],p:[0,.06,0],c:HAFT},
  {g:"box",s:[2.4,.12,.16],p:[0,1.7,-.2],c:HAFT},
  {g:"cyl",s:[.04,.04,1.7,6],p:[-.8,.85,-.1],c:HAFT,rep:[3,.8,0,0]},
  {g:"box",s:[.07,1.2,.02],p:[-.8,.9,0],c:STEELB,rep:[3,.8,0,0]}
],["rack of weapons","armoury rack","weapons on a rack","stand of spears"]);

/* ---------- workings, which can simply be dreamt ---------- */
var WORKING={
  fireball:{col:0xFF7A1E,kind:"burst"}, lightning:{col:0xE8F0FF,kind:"bolt"},
  iceblast:{col:0xBFE4F4,kind:"shards"}, healinglight:{col:0xFFF0C0,kind:"rise"},
  shieldspell:{col:0x9FD8FF,kind:"dome"}, summoning:{col:0xC050FF,kind:"ring"},
  curse:{col:0x6A1A6A,kind:"fall"}, blessing:{col:0xFFE8B0,kind:"rise"},
  banishing:{col:0xE8E4DA,kind:"ring"}, transmute:{col:0x6AF0C4,kind:"swirl"},
  stormcall:{col:0x8AA8D8,kind:"bolt"}, veilspell:{col:0xC8BCE8,kind:"dome"}
};
S("fireball","infra",[3,3,3],[{g:"sph",s:[.9],p:[0,1.6,0],c:0xFF7A1E,glow:1,pulse:1,opa:.9}],
  ["ball of fire","fire from my hands","i threw fire","a burst of flame"]);
S("lightningbolt","infra",[3,14,3],[
  {g:"box",s:[.18,6,.18],p:[0,7,0],r:[0,0,.12],c:0xE8F0FF,glow:1,pulse:1},
  {g:"box",s:[.14,4,.14],p:[.5,4,.2],r:[0,0,-.3],c:0xE8F0FF,glow:1}
],["bolt of lightning","lightning from the sky","a thunderbolt struck","lightning from my hands"]);
S("iceblast","infra",[4,3,4],[
  {g:"cone",s:[.22,1.6,6],p:[0,.8,0],c:0xBFE4F4,glow:1,opa:.85},
  {g:"cone",s:[.16,1.1,6],p:[.7,.55,.4],r:[0,0,-.3],c:0xBFE4F4,glow:1,opa:.8,rep:[3,-.7,-.1,-.5]}
],["ice blast","shards of ice","frost spell","a wave of cold","ice from my hands"]);
S("healinglight","infra",[3,4,3],[
  {g:"cyl",s:[1.1,1.3,3.2,16],p:[0,1.6,0],c:0xFFF0C0,glow:1,opa:.4,pulse:1}
],["healing light","light that healed","a warm light","mending light","the wound closed in light"]);
S("shieldspell","infra",[5,5,5],[
  {g:"sph",s:[2.3],p:[0,1.6,0],c:0x9FD8FF,glow:1,opa:.3,pulse:1},
  {g:"tor",s:[2.3,.06],p:[0,1.6,0],r:[Math.PI/2,0,0],c:0x9FD8FF,glow:1}
],["shield of light","a shield around me","barrier i made","circle of protection"]);
S("summoning","infra",[6,3,6],[
  {g:"cyl",s:[2.6,2.6,.06,32],p:[0,.05,0],c:0xC050FF,glow:1,opa:.45,pulse:1},
  {g:"tor",s:[2.4,.08],p:[0,.1,0],r:[Math.PI/2,0,0],c:0xC050FF,glow:1},
  {g:"tor",s:[1.5,.05],p:[0,.12,0],r:[Math.PI/2,0,0],c:0xE8B0FF,glow:1},
  {g:"box",s:[.1,.02,5],p:[0,.11,0],r:[0,.6,0],c:0xE8B0FF,glow:1,rep:[3,0,0,0]}
],["circle of summoning","i summoned something","calling circle"]);
S("curse","infra",[4,4,4],[
  {g:"sph",s:[1.2],p:[0,1.4,0],c:0x6A1A6A,glow:1,opa:.55,pulse:1},
  {g:"tor",s:[1.4,.06],p:[0,1.4,0],r:[1,0,.4],c:0x3A0A3A,glow:1}
],["a curse","curse laid on it","hex","malediction","an ill wish"]);
S("blessing","infra",[4,5,4],[
  {g:"cyl",s:[.9,1.6,4,16],p:[0,2,0],c:0xFFE8B0,glow:1,opa:.35,pulse:1}
],["a blessing","blessed light","grace fell on it","benediction"]);
S("transmute","infra",[4,4,4],[
  {g:"tor",s:[1.2,.12],p:[0,1.2,0],r:[Math.PI/2,0,0],c:0x6AF0C4,glow:1,pulse:1},
  {g:"tor",s:[.8,.08],p:[0,1.6,0],r:[.6,.4,0],c:0x6AF0C4,glow:1}
],["transmutation","it changed into something else","transformation","shape-changing","it turned into"]);
S("banishing","infra",[5,4,5],[
  {g:"tor",s:[2,.1],p:[0,.6,0],r:[Math.PI/2,0,0],c:0xE8E4DA,glow:1,pulse:1},
  {g:"cyl",s:[.06,.06,3.4,6],p:[1.6,1.8,0],c:0xE8E4DA,glow:1,opa:.7,rep:[4,-.8,0,.9]}
],["banishing","i banished it","sent away","exorcism","driven out"]);

EFFECTS.fireball=function(g){ var p=particles(70,[1.6,2,1.6],0xFF8A3A,1.2,.9); p.position.y=1.6; g.add(p);
  return function(t,dt){ rise(p,dt,1.6,.2); g.children[0].scale.setScalar(1+Math.sin(t*4)*0.08); }; };
EFFECTS.lightningbolt=function(g){ return function(t){ var on=Math.sin(t*3.1)>0.6;
  g.children.forEach(function(m,i){ if(i<2) m.visible=on; }); }; };
EFFECTS.summoning=function(g){ return function(t){ g.children.forEach(function(m,i){ if(i>0) m.rotation.z=t*(0.3+i*0.2)*(i%2?-1:1); }); }; };
EFFECTS.shieldspell=function(g){ return function(t){ g.children[0].scale.setScalar(1+Math.sin(t*1.6)*0.04); g.children[1].rotation.z=t*0.4; }; };
EFFECTS.transmute=EFFECTS.summoning;
EFFECTS.healinglight=function(g){ var p=particles(50,[1.4,3.4,1.4],0xFFF0C0,1,.8); g.add(p);
  return function(t,dt){ rise(p,dt,1.1,0); }; };
EFFECTS.curse=function(g){ var p=particles(60,[1.6,2.4,1.6],0x6A1A6A,1.4,.7); p.position.y=1.4; g.add(p);
  return function(t,dt){ swirl(p,dt,1.2,.5,false); }; };

/* ---------- carrying, and using ---------- */
var carrying=null, carryMesh=null, shots=[], shotCool=0;
function carriedName(){ return carrying?(ARMS[carrying.archetype]||{}).name||"it":""; }
function pickUp(spec){
  if(!ARMS[spec.archetype]) return false;
  dropCarried(true);
  carrying=spec;
  spec.carried=true;
  var g=meshes[spec.id]; if(g) g.visible=false;
  setStatus("<b>You are carrying the "+esc(carriedName())+".</b> "+(ARMS[spec.archetype].shot?"Use it with <b>F</b>, or the <b>use</b> button.":"Drop it with <b>G</b>."));
  showCarried();
  return true;
}
function dropCarried(quiet){
  if(!carrying) return;
  var spec=carrying, g=meshes[spec.id];
  spec.carried=false;
  if(g){ g.visible=true; g.position.x=camera.position.x; g.position.z=camera.position.z; spec.x=g.position.x; spec.z=g.position.z; }
  carrying=null;
  if(carryMesh&&carryMesh.parent) carryMesh.parent.remove(carryMesh);
  carryMesh=null;
  if(!quiet) setStatus("You set it down.");
  save();
}
/* what you hold shows in your own hand when you can see yourself */
function showCarried(){
  if(carryMesh&&carryMesh.parent) carryMesh.parent.remove(carryMesh);
  carryMesh=null;
  if(!carrying||!meG) return;
  var A=ARMS[carrying.archetype];
  if(!A||!HELD[A.held]) return;
  carryMesh=HELD[A.held]();
  carryMesh.position.set(-0.3,0.98,0.3);
  meG.children[0].add(carryMesh);
}
/* using it: something leaves your hand and lands somewhere */
var SHOT={
  arrow:{col:0x8A6A3A,speed:42,len:.7,trail:null},
  bolt:{col:0x6A6A6A,speed:48,len:.5,trail:null},
  stone:{col:0x8A8C92,speed:30,len:.16,trail:null},
  shot:{col:0xFFE8B0,speed:120,len:.3,trail:0xFFE8B0},
  fire:{col:0xFF7A1E,speed:26,len:.5,trail:0xFF8A3A,lands:"fireball"},
  lightning:{col:0xE8F0FF,speed:90,len:1.2,trail:0xE8F0FF,lands:"lightningbolt"},
  ice:{col:0xBFE4F4,speed:32,len:.6,trail:0xBFE4F4,lands:"iceblast"},
  light:{col:0xFFF0C0,speed:24,len:.5,trail:0xFFF0C0,lands:"healinglight"},
  sound:{col:0xE6DCC2,speed:18,len:.4,trail:null,lands:null}
};
function useCarried(){
  if(!carrying||shotCool>0) return;
  var A=ARMS[carrying.archetype];
  if(!A||!A.shot){ setStatus("You swing the "+esc(carriedName())+"."); shotCool=0.5; return; }
  var S=SHOT[A.shot]; shotCool=0.55;
  var dir={x:-Math.sin(yaw)*Math.cos(pitch),y:Math.sin(pitch),z:-Math.cos(yaw)*Math.cos(pitch)};
  var g=new THREE.Group();
  var body=new THREE.Mesh(new THREE.CylinderGeometry(S.len*0.09,S.len*0.05,S.len,6),
    new THREE.MeshBasicMaterial({color:S.col}));
  body.rotation.x=Math.PI/2; g.add(body);
  if(S.trail){ var tr=new THREE.Mesh(new THREE.SphereGeometry(S.len*0.3,8,6),
    new THREE.MeshBasicMaterial({color:S.trail,transparent:true,opacity:.75})); g.add(tr); }
  g.position.set(camera.position.x+dir.x,camera.position.y-0.2+dir.y,camera.position.z+dir.z);
  scene.add(g);
  shots.push({g:g,dir:dir,speed:S.speed,life:4,lands:S.lands});
  if(A.shot==="sound") setStatus("The horn sounds, and carries further than it should.");
}
function armsTick(dt){
  if(shotCool>0) shotCool-=dt;
  for(var i=shots.length-1;i>=0;i--){
    var s=shots[i], p=s.g.position;
    p.x+=s.dir.x*s.speed*dt; p.y+=s.dir.y*s.speed*dt-1.6*dt*dt*40*0.02; p.z+=s.dir.z*s.speed*dt;
    s.g.lookAt(p.x+s.dir.x,p.y+s.dir.y,p.z+s.dir.z);
    s.life-=dt;
    var feet=(typeof supportAt==="function")?supportAt(p.x,p.z,p.y):0;
    var hitWall=(typeof blockedAt==="function")&&blockedAt(p.x,p.z,Math.max(0,p.y-0.2));
    if(p.y<=feet+0.1||hitWall||s.life<=0){
      if(s.lands&&KIT[s.lands]) landWorking(s.lands,p.x,Math.max(feet,0),p.z);
      else if(typeof particles==="function"){
        var b=particles(24,[.8,.8,.8],0xE8E4DA,.6,.9); b.position.set(p.x,Math.max(feet+.3,.3),p.z); scene.add(b);
        setTimeout(function(){ scene.remove(b); },900);
      }
      scene.remove(s.g); shots.splice(i,1);
    }
  }
}
/* where a working lands, it stands for a while and then fades */
function landWorking(kind,x,y,z){
  var spec={id:uid(),archetype:kind,label:null,attrs:{},x:x,z:z,rot:Math.random()*6.283,solid:false,detail:3,
    nights:[store.session],working:true};
  if(store.here) spec.realm=store.here;
  store.objects.push(spec); addMesh(spec);
  setTimeout(function(){
    var k=store.objects.indexOf(spec);
    if(k>-1){ store.objects.splice(k,1); if(meshes[spec.id]){ scene.remove(meshes[spec.id]); delete meshes[spec.id]; } }
  },9000);
}
/* reaching for what is at your feet */
function armsReach(){
  if(carrying) return dropCarried(false);
  var P=camera.position, best=null, bd=9;
  store.objects.forEach(function(o){
    if(!ARMS[o.archetype]||o.carried) return;
    if((o.realm||0)!==(store.here||0)) return;
    var d=(o.x-P.x)*(o.x-P.x)+(o.z-P.z)*(o.z-P.z);
    if(d<bd){ bd=d; best=o; }
  });
  if(best) pickUp(best);
  else setStatus("Nothing within reach to pick up.");
}

