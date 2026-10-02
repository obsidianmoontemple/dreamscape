/* SomnuMatrix — figures.js
   people: bodies with jointed limbs, hair, clothes and hats, drawn from a look;
   smooth walking between where they are and where they're going.
   loaded as a plain script; shares scope with the other files */
"use strict";

var PEOPLE={human:1,child:1};
function isPerson(spec){ return !!PEOPLE[spec.archetype]; }

var FIGGEO={};
/* an unremembered figure is a pale stone likeness until the dream says more */
var STATUE={skin:0xB8B0A2,hair:0x6E6860,top:0x8E877B,bottom:0x77716A,shoes:0x55514C};
function fg(key,make){ return FIGGEO[key]||(FIGGEO[key]=make()); }

/* a material for one colour on one figure, honouring how well they're remembered */
function figMat(col,f,filler){
  var opa, c;
  if(filler) c=blend(col,0x8A8C90,0.22);
  else c=f<0.99?blend(col,0xB4BCCB,(1-f)*0.35):col;
  return new THREE.MeshLambertMaterial({color:c});
}

/* the ground-darkening under anything standing, so nothing floats */
function contactShadow(r){
  var m=new THREE.Mesh(fg("shadow",function(){ return new THREE.CircleGeometry(1,20); }),
    new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.28,depthWrite:false,
      polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4}));
  m.rotation.x=-Math.PI/2; m.position.y=0.08; m.scale.set(r,r,r);
  m.userData.contact=1;
  return m;
}

function buildFigure(spec,f){
  var L=lookOf(spec), filler=!!spec.filler;
  /* the city's own people are dressed, every one differently — never a grey statue */
  if((spec.city||spec.hub)&&typeof fillLook==="function") fillLook(L,spec.id);
  var child=spec.archetype==="child"||L.age==="child";
  var sex=L.sex;
  function pick(v,fallback){ return v!==null&&v!==undefined?v:fallback; }
  var U=STATUE;
  var skin=pick(L.skin,U.skin), hair=pick(L.hair,U.hair), top=pick(L.top,U.top),
      bottom=pick(L.bottom,U.bottom), shoes=pick(L.shoes,U.shoes);
  var topKind=L.topKind||"shirt", bottomKind=L.bottomKind||"trousers";
  var style=L.hairStyle||(sex==="f"?"long":sex==="m"?"short":"short");
  var M={skin:figMat(skin,f,filler),hair:figMat(hair,f,filler),top:figMat(top,f,filler),
         bottom:figMat(bottom,f,filler),shoes:figMat(shoes,f,filler)};

  var shoulder=sex==="f"?0.185:sex==="m"?0.225:0.205;
  var hip=sex==="f"?0.19:sex==="m"?0.165:0.175;
  var g=new THREE.Group(), body=new THREE.Group();
  g.add(body);
  function mesh(geoKey,make,mat,x,y,z){
    var m=new THREE.Mesh(fg(geoKey,make),mat); m.position.set(x||0,y||0,z||0);
    m.userData.part=geoKey.replace(/[\d.]+/g,"");
    return m;
  }

  /* legs, each on a hip joint so they can swing */
  var legs=[];
  [-1,1].forEach(function(sd){
    var pivot=new THREE.Group(); pivot.position.set(sd*0.095,0.92,0);
    var legMat=(bottomKind==="skirt"||topKind==="dress")?M.skin:M.bottom;
    pivot.add(mesh("leg",function(){ return new THREE.CylinderGeometry(0.072,0.058,0.84,8); },legMat,0,-0.42,0));
    pivot.add(mesh("shoe",function(){ return new THREE.BoxGeometry(0.11,0.08,0.25); },M.shoes,0,-0.87,0.045));
    body.add(pivot); legs.push(pivot);
  });

  var dressLike=topKind==="dress", robe=topKind==="robe";
  body.add(mesh("hips"+hip,function(){ return new THREE.CylinderGeometry(hip-0.01,hip,0.17,10); },
    dressLike?M.top:M.bottom,0,0.95,0));
  if(bottomKind==="skirt"&&!dressLike&&!robe)
    body.add(mesh("skirt",function(){ return new THREE.CylinderGeometry(0.185,0.27,0.44,12); },M.bottom,0,0.76,0));
  if(dressLike)
    body.add(mesh("dress",function(){ return new THREE.CylinderGeometry(0.19,0.3,0.56,12); },M.top,0,0.7,0));
  if(robe)
    body.add(mesh("robe",function(){ return new THREE.CylinderGeometry(0.2,0.31,1.0,12); },M.top,0,0.55,0));
  if(topKind==="coat")
    body.add(mesh("coattail",function(){ return new THREE.CylinderGeometry(0.19,0.235,0.38,10); },M.top,0,0.8,0));

  var torso=mesh("torso"+shoulder,function(){ return new THREE.CylinderGeometry(shoulder,0.165,0.58,10); },M.top,0,1.28,0);
  torso.scale.z=0.62; body.add(torso);
  if(sex==="f"){ var bust=mesh("bust",function(){ return new THREE.SphereGeometry(0.07,8,6); },M.top,0,1.36,0.07); bust.scale.set(2.1,0.9,0.8); body.add(bust); }

  /* arms on shoulder joints */
  var arms=[];
  [-1,1].forEach(function(sd){
    var pivot=new THREE.Group(); pivot.position.set(sd*(shoulder+0.045),1.52,0);
    pivot.rotation.z=sd*0.07;
    pivot.add(mesh("arm",function(){ return new THREE.CylinderGeometry(0.052,0.043,0.6,8); },M.top,0,-0.3,0));
    pivot.add(mesh("hand",function(){ return new THREE.SphereGeometry(0.046,8,6); },M.skin,0,-0.63,0));
    body.add(pivot); arms.push(pivot);
  });

  body.add(mesh("neck",function(){ return new THREE.CylinderGeometry(0.05,0.055,0.1,8); },M.skin,0,1.6,0));
  var head=mesh("head",function(){ return new THREE.SphereGeometry(0.112,14,10); },M.skin,0,1.72,0);
  head.scale.y=1.1; body.add(head);
  /* a face arrives with memory: the barely remembered have none yet */
  if(filler||f>=0.5){
    var eyeMat=new THREE.MeshBasicMaterial({color:0x1A1614});
    [-1,1].forEach(function(sd){ body.add(mesh("eye",function(){ return new THREE.SphereGeometry(0.014,6,4); },eyeMat,sd*0.04,1.735,0.1)); });
  }

  /* hair */
  var cap=function(r,t){ return function(){ return new THREE.SphereGeometry(r,14,8,0,Math.PI*2,0,Math.PI*t); }; };
  if(style!=="bald" && !(L.hat==="hood")){
    if(style==="afro"){
      var af=mesh("afro",function(){ return new THREE.SphereGeometry(0.2,14,12); },M.hair,0,1.79,-0.012); af.scale.set(1,0.94,1); body.add(af);
    } else if(style==="coily"){
      body.add(mesh("haircap",cap(0.124,0.58),M.hair,0,1.735,-0.005));
      for(var ci=0;ci<10;ci++){ var ca=ci*0.628;
        body.add(mesh("coily",function(){ return new THREE.SphereGeometry(0.05,8,6); },M.hair,Math.cos(ca)*0.105,1.80+((ci%3)-1)*0.018,Math.sin(ca)*0.105-0.01)); }
    } else if(style==="locs"){
      body.add(mesh("haircap",cap(0.123,0.56),M.hair,0,1.735,-0.005));
      /* they hang behind the head and at the sides, never across the face */
      for(var li=0;li<10;li++){ var la=Math.PI*1.06+li*(Math.PI*0.88/9);
        var lc=mesh("locs",function(){ return new THREE.CylinderGeometry(0.019,0.016,0.5,5); },M.hair,Math.cos(la)*0.112,1.57,Math.sin(la)*0.112-0.015);
        lc.rotation.x=0.1; body.add(lc); }
    } else if(style==="braids"){
      body.add(mesh("haircap",cap(0.123,0.56),M.hair,0,1.735,-0.005));
      [-1,1].forEach(function(sd){
        var br=mesh("braid",function(){ return new THREE.CylinderGeometry(0.032,0.022,0.52,6); },M.hair,sd*0.115,1.55,-0.04);
        br.rotation.x=0.18; br.rotation.z=sd*0.12; body.add(br);
        body.add(mesh("braidband",function(){ return new THREE.TorusGeometry(0.026,0.008,4,8); },M.shoes,sd*0.122,1.31,-0.055));
      });
    } else if(style==="buzz"){
      var bz=mesh("buzzcap",cap(0.118,0.5),M.hair,0,1.735,-0.004); bz.scale.y=0.86; body.add(bz);
    } else if(style==="waves"){
      body.add(mesh("haircap",cap(0.122,0.55),M.hair,0,1.735,-0.005));
      for(var wi=0;wi<4;wi++) body.add(mesh("waves",function(){ return new THREE.TorusGeometry(0.086,0.009,4,12,Math.PI); },M.hair,0,1.77-wi*0.022,-0.012+wi*0.004));
    } else if(style==="headwrap"){
      var wr=mesh("wrap",cap(0.138,0.6),M.top,0,1.74,-0.005); wr.scale.y=1.12; body.add(wr);
      body.add(mesh("wrapknot",function(){ return new THREE.SphereGeometry(0.052,8,6); },M.top,0.06,1.86,-0.06));
    } else if(style==="curly"){
      var cu=mesh("curly",function(){ return new THREE.IcosahedronGeometry(0.15,1); },M.hair,0,1.77,-0.015); cu.scale.y=0.85; body.add(cu);
    } else {
      var hc=mesh("haircap",cap(0.121,0.56),M.hair,0,1.735,-0.005); hc.scale.y=1.08; body.add(hc);
      if(style==="long") body.add(mesh("hairlong",function(){ return new THREE.BoxGeometry(0.235,0.36,0.07); },M.hair,0,1.56,-0.085));
      if(style==="bun") body.add(mesh("bun",function(){ return new THREE.SphereGeometry(0.058,10,8); },M.hair,0,1.82,-0.085));
      if(style==="ponytail"){ var pt=mesh("tail",function(){ return new THREE.CylinderGeometry(0.03,0.02,0.28,6); },M.hair,0,1.6,-0.14); pt.rotation.x=0.35; body.add(pt); }
    }
  }
  /* hats */
  var hatMat=L.hatColor!==undefined&&L.hatColor!==null?figMat(L.hatColor,f,filler):(L.hat==="hood"?M.top:M.shoes);
  if(L.hat==="cap"){
    body.add(mesh("hatcap",cap(0.126,0.5),hatMat,0,1.74,0));
    body.add(mesh("brimcap",function(){ return new THREE.BoxGeometry(0.17,0.014,0.11); },hatMat,0,1.745,0.1));
  } else if(L.hat==="brimmed"){
    body.add(mesh("crown",function(){ return new THREE.CylinderGeometry(0.1,0.11,0.13,12); },hatMat,0,1.84,0));
    body.add(mesh("brim",function(){ return new THREE.CylinderGeometry(0.2,0.2,0.014,16); },hatMat,0,1.775,0));
  } else if(L.hat==="hood"){
    var hd=mesh("hood",cap(0.145,0.66),hatMat,0,1.72,-0.02); hd.scale.y=1.1; body.add(hd);
  }

  body.scale.set(L.build||1,1,L.build||1);
  var H=child?0.7:(sex==="f"?0.965:sex==="m"?1.015:1);
  body.scale.multiplyScalar(H);
  g.add(contactShadow(child?0.26:0.36));
  g.userData.limbs={ll:legs[0],rl:legs[1],la:arms[0],ra:arms[1]};
  return g;
}

/* a knot of strangers, each dressed differently */
/* a crowd is seven people, each moving on their own: shifting, turning,
   stepping about — never one block sliding as a piece */
function buildCrowd(spec,f){
  var g=new THREE.Group(), members=[];
  for(var i=0;i<7;i++){
    var p={id:spec.id+":"+i,archetype:(i===5?"child":"human"),filler:true,attrs:{}};
    p.look=randomLook(p.id,p.archetype);
    var one=buildFigure(p,f);
    var hx=((hash(p.id)%100)/100-0.5)*6, hz=((hash(p.id+"z")%100)/100-0.5)*4.4;
    one.position.set(hx,0,hz);
    one.rotation.y=((hash(p.id+"r")%628)/100);
    g.add(one);
    members.push({g:one,hx:hx,hz:hz,tx:hx,tz:hz,wait:(hash(p.id+"w")%50)/10,pace:0.5+(hash(p.id+"p")%50)/100});
  }
  g.userData.anim=function(t,dt){
    members.forEach(function(m){
      var L=m.g.userData.limbs, dx=m.tx-m.g.position.x, dz=m.tz-m.g.position.z, d=Math.sqrt(dx*dx+dz*dz), moving=false;
      if(d>0.05){ var st=Math.min(d,m.pace*dt); m.g.position.x+=dx/d*st; m.g.position.z+=dz/d*st; moving=true;
        var want=Math.atan2(dx,dz), diff=((want-m.g.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI; m.g.rotation.y+=diff*Math.min(dt*4,1); }
      else { m.wait-=dt; if(m.wait<=0){ var a=Math.random()*6.283, r=Math.random()*1.4;
        m.tx=m.hx+Math.cos(a)*r; m.tz=m.hz+Math.sin(a)*r; m.wait=2+Math.random()*6; } }
      if(L){ var u=m.g.userData; u.amp=(u.amp||0)+((moving?0.4:0)-(u.amp||0))*Math.min(dt*6,1);
        u.phase=(u.phase||0)+dt*(moving?5.5:0); var s=Math.sin(u.phase)*u.amp;
        L.ll.rotation.x=s; L.rl.rotation.x=-s; L.la.rotation.x=-s*0.75; L.ra.rotation.x=s*0.75; }
    });
  };
  return g;
}

/* ---- walking: figures move to where the hour puts them, at a walking pace ---- */
function stepFigures(dt){
  for(var id in meshes){
    var g=meshes[id], u=g.userData;
    if(!u.target) continue;
    /* vehicles follow their route corner by corner */
    var aim=u.target;
    if(u.path&&u.path.length){ aim=u.path[0];
      var px=aim.x-g.position.x, pz=aim.z-g.position.z;
      if(px*px+pz*pz<0.36){ u.path.shift(); aim=u.path.length?u.path[0]:u.target; } }
    var dx=aim.x-g.position.x, dz=aim.z-g.position.z, d=Math.sqrt(dx*dx+dz*dz), moving=false;
    if(u.walker===undefined) u.walker=walksOnGround(g,specById(id));
    if(d>160){ g.position.x=u.target.x; g.position.z=u.target.z; }
    else if(d>0.2){
      /* everyone keeps their own pace */
      var pace=u.hunt?3.4:u.drives?9*(0.85+(hash(id)%30)/100):1.35*(0.8+(hash(id)%45)/100)*(d>30?2.6:1);
      var st=Math.min(d,pace*dt), mx=dx/d*st, mz=dz/d*st;
      if(u.walker&&blockedAt(g.position.x+mx,g.position.z+mz,0)&&!blockedAt(g.position.x,g.position.z,0)){
        /* something solid in the way: slide along it, and find a way round */
        if(!blockedAt(g.position.x+mx,g.position.z,0)) mz=0;
        else if(!blockedAt(g.position.x,g.position.z+mz,0)) mx=0;
        else { mx=0; mz=0; }
        if(!u.path||!u.path.length) wantPath(id);
      }
      if(u.walker&&typeof atlBlocks==="function"&&atlOn()&&(mx||mz)){
        var gy=terrainY(g.position.x,g.position.z);
        if(atlBlocks(g.position.x,g.position.z,g.position.x+mx,g.position.z+mz,gy)){ mx=0; mz=0; }
      }
      g.position.x+=mx; g.position.z+=mz; moving=mx!==0||mz!==0;
      if(typeof terrainY==="function"&&atlOn()) g.position.y=terrainY(g.position.x,g.position.z)+(u.lift||0);
      if(!u.facingPlayer){
        var want=Math.atan2(dx,dz), diff=((want-g.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;
        g.rotation.y+=diff*Math.min(dt*5,1);
      }
    }
    var L=u.limbs;
    if(L){
      u.amp=(u.amp||0)+((moving?0.55:0)-(u.amp||0))*Math.min(dt*6,1);
      u.phase=(u.phase||0)+dt*(moving?(d>30?11:7.2):0);
      /* nobody sits in a parked vehicle */
      if(u.seat&&u.drives&&!u.seatRide) u.seat.visible=moving;
      var s=Math.sin(u.phase)*u.amp;
      var pz=u.pose||{la:0,ra:0};
      L.ll.rotation.x=s; L.rl.rotation.x=-s; L.la.rotation.x=pz.la-s*0.75; L.ra.rotation.x=pz.ra+s*0.75;
    }
  }
  keepApart();
}

/* people passing close step round one another instead of walking through */
function keepApart(){
  var cell={}, list=[];
  for(var id in meshes){ var g=meshes[id]; if(!g.userData.limbs||g.visible===false) continue;
    var k=Math.floor(g.position.x/2)+":"+Math.floor(g.position.z/2); (cell[k]=cell[k]||[]).push(g); list.push(g); }
  list.forEach(function(a){
    var cx=Math.floor(a.position.x/2), cz=Math.floor(a.position.z/2);
    for(var ix=-1;ix<=1;ix++) for(var iz=-1;iz<=1;iz++){
      (cell[(cx+ix)+":"+(cz+iz)]||[]).forEach(function(b){
        if(b===a) return;
        var dx=a.position.x-b.position.x, dz=a.position.z-b.position.z, d2=dx*dx+dz*dz;
        if(d2<0.81&&d2>1e-6){ var d=Math.sqrt(d2), push=(0.9-d)*0.25, nx=a.position.x+dx/d*push, nz=a.position.z+dz/d*push;
          if(!blockedAt(nx,nz,0)){ a.position.x=nx; a.position.z=nz; } }
      });
    }
  });
}

/* people cast shadows; the patch of shade beneath them does not */
function shadowsFor(g,cast){
  if(!g.traverse) return;
  g.traverse(function(m){
    if(!m.isMesh||m.userData.contact) return;
    m.castShadow=!!cast; m.receiveShadow=true;
  });
}

