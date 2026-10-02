/* SomnuMatrix — atlantis-terrain.js
   Somnucor as a drowned-and-risen city: a great stepped cone of nine rings,
   the Tower on its crown, each ring a terrace a full twenty-five metres below
   the one inside it, and water pouring over every rim into the canal below.

     0  The Tower Plaza            the crown, and the Hall of Doors gate
     1  The Civic Ring             courts, treasury, archive, hospital, post
     2  The High Ring              the estates: the Crescent, and Backers Street
     3  Temple Row                 every house of every power, churches and all
     4  The Market Ring            bazaars, guild shops, inns, the transport yard
     5  The Commons                homes, schools, workshops, the menagerie
     6  The Warrens                the poorest streets, the Gaol and its yard
     7  The Harvest Ring           quarry, gem pits, timber, fields, the docks
        The Outer Moat
     8  The Nightmare Wilds        where what we dreamt in the dark lives

   One number decides the ground under anyone's feet in the city —
   terrainY(x,z) — and everything else (walking, falling, the figures, the
   other dreamers, the sun's shadows) asks it. Crossing from ring to ring is
   by the grand stairways that bridge each canal: eight great ones on the
   avenues and eight lesser ones between.
   loaded as a plain script; shares scope with the other files */
"use strict";

var ATL_RINGS=[
 {k:"plaza",   name:"The Tower Plaza",     S:0,    E:140,  H:200, tex:"marble", col:0xBDB6A8},
 {k:"civic",   name:"The Civic Ring",      S:160,  E:330,  H:175, tex:"paving", col:0xC4BCAA},
 {k:"estates", name:"The High Ring",       S:350,  E:640,  H:150, tex:"grass",  col:0x5E9048},
 {k:"temples", name:"Temple Row",          S:660,  E:960,  H:125, tex:"grass",  col:0x5A8A4C},
 {k:"markets", name:"The Market Ring",     S:980,  E:1180, H:100, tex:"paving", col:0xC8B492},
 {k:"commons", name:"The Commons",         S:1200, E:1500, H:75,  tex:"grass",  col:0x6A9A4E},
 {k:"warrens", name:"The Warrens",         S:1520, E:1720, H:50,  tex:"earth",  col:0x74644E},
 {k:"harvest", name:"The Harvest Ring",    S:1740, E:2100, H:25,  tex:"grass",  col:0x7C9A4C},
 {k:"wilds",   name:"The Nightmare Wilds", S:2160, E:3000, H:0,   tex:"earth",  col:0x2A2230}
];
var ATL_STAIR_RUN=44;                 /* how far a stairway reaches out onto the ring below */
var ATL_MAIN=8, ATL_MAIN_HALF=8, ATL_MINOR_HALF=5;
function atlStairAngles(){
  var out=[];
  for(var i=0;i<ATL_MAIN;i++){
    var a=(i/ATL_MAIN)*Math.PI*2+0.19;
    out.push({a:a,half:ATL_MAIN_HALF,main:true});
    out.push({a:a+Math.PI/ATL_MAIN,half:ATL_MINOR_HALF,main:false});
  }
  return out;
}
var ATL_STAIRS=atlStairAngles();
function atlRing(k){ for(var i=0;i<ATL_RINGS.length;i++) if(ATL_RINGS[i].k===k) return ATL_RINGS[i]; return null; }
function atlRingIndex(k){ for(var i=0;i<ATL_RINGS.length;i++) if(ATL_RINGS[i].k===k) return i; return -1; }

/* where the cone stands: the Somnucor realm's own origin */
var ATLC=null;
function atlRefresh(){
  var r=(typeof somnucorRealm==="function")?somnucorRealm():null;
  if(!r||!r.atlantis){ ATLC=null; return null; }
  var h=blockOrigin(r.grid.bx,r.grid.bz);
  ATLC={x:h.x,z:h.z,id:r.id};
  return ATLC;
}
function atlOn(){ return !!ATLC; }
function atlLocal(x,z){ return ATLC?{x:x-ATLC.x,z:z-ATLC.z}:null; }

/* how far across a stairway's corridor a point is, and which stairway */
function atlNearStair(r,ang){
  var best=null;
  for(var i=0;i<ATL_STAIRS.length;i++){
    var s=ATL_STAIRS[i];
    var d=((ang-s.a)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI;
    var lat=Math.abs(d)*r;
    if(lat<s.half&&(!best||lat<best.lat)) best={s:s,lat:lat};
  }
  return best;
}

/* the ground, anywhere in the city */
function terrainY(x,z){
  if(!ATLC) return 0;
  var dx=x-ATLC.x, dz=z-ATLC.z;
  if(dx>3400||dx<-3400||dz>3400||dz<-3400) return 0;
  var r=Math.sqrt(dx*dx+dz*dz);
  var R=ATL_RINGS;
  for(var i=0;i<R.length;i++){
    var ring=R[i], next=R[i+1];
    if(r<=ring.E||!next){
      if(r>=ring.S||i===0){
        /* on a terrace — unless a stairway from the ring above lands here */
        if(i>0&&r<ring.S+ATL_STAIR_RUN){
          var st=atlNearStair(r,Math.atan2(dz,dx));
          if(st) return atlRamp(R[i-1],ring,r);
        }
        return ring.H;
      }
    }
    if(next&&r>ring.E&&r<next.S){
      /* the canal between this ring and the next — bridged by the stairways */
      var st2=atlNearStair(r,Math.atan2(dz,dx));
      if(st2) return atlRamp(ring,next,r);
      return next.H-3;
    }
  }
  return 0;
}
function atlRamp(up,down,r){
  var r0=up.E, r1=down.S+ATL_STAIR_RUN;
  var t=Math.max(0,Math.min(1,(r-r0)/(r1-r0)));
  return up.H+(down.H-up.H)*t;
}
/* which ring a point stands in, by name — for signs and status lines */
function atlRingAt(x,z){
  if(!ATLC) return null;
  var r=Math.hypot(x-ATLC.x,z-ATLC.z);
  for(var i=0;i<ATL_RINGS.length;i++) if(r<=ATL_RINGS[i].E+10) return ATL_RINGS[i];
  return ATL_RINGS[ATL_RINGS.length-1];
}
/* walking: the terraces hold you in. you cannot step up a cliff, and you
   will not be let walk off a rim into the water — the stairways are the way
   down, and flying is the way over */
function atlBlocks(x0,z0,x1,z1,feet){
  if(!ATLC) return false;
  var a=terrainY(x1,z1);
  if(a>feet+1.0) return true;
  if(typeof canFly!=="undefined"&&canFly&&typeof flyY!=="undefined"&&flyY>a+0.5) return false;
  var b=terrainY(x0,z0);
  if(b-a>1.5&&feet<=b+0.5) return true;
  return false;
}

/* ================================================================ drawing */
var atlGroup=null, atlWater=[], atlFalls=[], atlMist=[], atlGlow=[], atlEyes=null, atlT=0;

/* canvas textures of our own: moving water, falling water, stair treads */
function atlCanvasTex(w,h,paint){
  var c=document.createElement("canvas"); c.width=w; c.height=h;
  var x=c.getContext("2d"); paint(x,w,h);
  var t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping;
  return t;
}
function atlWaterTex(){
  return atlCanvasTex(256,256,function(x,w,h){
    var g=x.createLinearGradient(0,0,0,h); g.addColorStop(0,"#1E6E86"); g.addColorStop(1,"#155A74");
    x.fillStyle=g; x.fillRect(0,0,w,h);
    var r=rng(771);
    for(var i=0;i<220;i++){
      x.strokeStyle="rgba(190,240,255,"+(0.08+r()*0.22)+")"; x.lineWidth=1+r()*2;
      var yy=r()*h, xx=r()*w, len=18+r()*60;
      x.beginPath(); x.moveTo(xx,yy);
      x.quadraticCurveTo(xx+len/2,yy+(r()-0.5)*8,xx+len,yy); x.stroke();
    }
  });
}
function atlFallTex(){
  return atlCanvasTex(128,256,function(x,w,h){
    x.clearRect(0,0,w,h);
    /* a sheet of water, not a few threads: pale and half-clear, with brighter ropes running down it */
    for(var cx=0;cx<w;cx++){
      var a=0.42+0.22*Math.sin(cx*0.21)+0.12*Math.sin(cx*0.057+1.3);
      x.fillStyle="rgba(214,238,250,"+Math.max(0.18,Math.min(0.8,a)).toFixed(3)+")"; x.fillRect(cx,0,1,h);
    }
    var r=rng(313);
    for(var i=0;i<160;i++){
      var xx=r()*w, len=30+r()*140, yy=r()*h;
      var g=x.createLinearGradient(0,yy,0,yy+len);
      g.addColorStop(0,"rgba(255,255,255,0)"); g.addColorStop(0.3,"rgba(235,248,255,"+(0.35+r()*0.5)+")"); g.addColorStop(1,"rgba(255,255,255,0)");
      x.fillStyle=g; x.fillRect(xx,yy,1+r()*3,len);
      if(yy+len>h){ x.fillRect(xx,yy-h,1+r()*3,len); }
    }
  });
}
function atlStepTex(){
  return atlCanvasTex(64,64,function(x,w,h){
    x.fillStyle="#D9D2C2"; x.fillRect(0,0,w,h);
    x.fillStyle="#AFA48F"; x.fillRect(w*0.72,0,w*0.28,h);
    x.fillStyle="#F2ECE0"; x.fillRect(0,0,w*0.08,h);
  });
}
function atlRailTex(){
  return atlCanvasTex(64,64,function(x,w,h){
    x.clearRect(0,0,w,h);
    x.fillStyle="#E8E0CC"; x.fillRect(0,0,w,10); x.fillRect(0,h-8,w,8);
    for(var i=0;i<4;i++){ x.beginPath(); x.ellipse(i*16+8,h/2,4,18,0,0,Math.PI*2); x.fill(); }
  });
}
function atlTiled(kind,repeatU,repeatV){
  var base=texOf(kind); if(!base) return null;
  var t=base.clone(); t.needsUpdate=true; t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.repeat.set(repeatU,repeatV); return t;
}
function atlMat(col,map,extra){
  var o={color:col}; if(map) o.map=map;
  if(extra) Object.keys(extra).forEach(function(k){ o[k]=extra[k]; });
  return new THREE.MeshLambertMaterial(o);
}
/* angular gaps where stairways cross a rim, as [start,length] arcs of solid rim */
function atlRimArcs(r){
  var gaps=ATL_STAIRS.map(function(s){ var half=(s.half+1.5)/r; return [s.a-half,s.a+half]; })
    .map(function(g){ var a=((g[0]%(Math.PI*2))+Math.PI*2)%(Math.PI*2); return [a,a+(g[1]-g[0])]; })
    .sort(function(p,q){ return p[0]-q[0]; });
  var arcs=[];
  for(var i=0;i<gaps.length;i++){
    var end=gaps[i][1], nxt=(i+1<gaps.length)?gaps[i+1][0]:gaps[0][0]+Math.PI*2;
    if(nxt-end>0.001) arcs.push([end,nxt-end]);
  }
  return arcs;
}
/* an open cylinder band, only along the given arcs (three's theta runs the other way to atan2) */
function atlBand(radius,y0,y1,arcs,mat,segPerRad){
  var g=new THREE.Group();
  arcs.forEach(function(a){
    var seg=Math.max(2,Math.ceil(a[1]*(segPerRad||40)));
    var geo=new THREE.CylinderGeometry(radius,radius,y1-y0,seg,1,true,Math.PI/2-(a[0]+a[1]),a[1]);
    var m=new THREE.Mesh(geo,mat); m.position.y=(y0+y1)/2; g.add(m);
  });
  return g;
}
function atlDisc(r0,r1,y,mat,seg){
  var geo=new THREE.RingGeometry(Math.max(0.01,r0),r1,seg||256,2);
  var m=new THREE.Mesh(geo,mat); m.rotation.x=-Math.PI/2; m.position.y=y; m.receiveShadow=true;
  return m;
}

function atlBuildTerrain(r){
  if(!scene) return null;
  if(atlGroup){ scene.remove(atlGroup); }
  atlWater=[]; atlFalls=[]; atlMist=[]; atlGlow=[];
  atlRefresh();
  var h=blockOrigin(r.grid.bx,r.grid.bz);
  var G=new THREE.Group(); G.position.set(h.x,0,h.z); G.userData.realmGround=r.id;
  var R=ATL_RINGS;
  var waterTex=atlWaterTex(), fallTex=atlFallTex(), stepTex=atlStepTex(), railTex=atlRailTex();
  var stoneWall=atlMat(0xB8AE9C,atlTiled("stone",60,6));
  var darkStone=atlMat(0x5A5260,atlTiled("stone",60,6));

  R.forEach(function(ring,i){
    /* the terrace itself */
    var seg=ring.E>1200?384:256;
    var rep=2*ring.E/((TILE[ring.tex]||4)*1.0);
    var top=atlDisc(ring.S,ring.E,ring.H,atlMat(ring.col,atlTiled(ring.tex,rep,rep),{polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:2}),seg);
    G.add(top);
    if(i===0){
      /* the crown: marble, inlaid with rings of dark stone and gold */
      [[30,32,0x2E3448],[58,60,0x8A6A34],[96,99,0x2E3448],[128,131,0x8A6A34]].forEach(function(b){
        G.add(atlDisc(b[0],b[1],ring.H+0.02,atlMat(b[2]),128));
      });
    }
    var next=R[i+1];
    if(!next) return;
    /* the rim wall, down into the canal */
    var arcs=atlRimArcs(ring.E);
    var wallMat=(next.k==="wilds")?darkStone:stoneWall;
    G.add(atlBand(ring.E,next.H-3,ring.H,arcs,wallMat));
    /* the balustrade round the rim */
    var rail=new THREE.MeshLambertMaterial({color:0xF2ECDE,map:(function(){ var t=railTex.clone(); t.needsUpdate=true; t.repeat.set(ring.E*2*Math.PI/1.6,1); return t; })(),
      transparent:true,alphaTest:0.4,side:THREE.DoubleSide});
    G.add(atlBand(ring.E-0.4,ring.H,ring.H+1.1,arcs,rail));
    /* the waterfall pouring over it, in two veils */
    [[0.7,1.0,0.9],[1.6,1.4,0.55]].forEach(function(v,vi){
      var t=fallTex.clone(); t.needsUpdate=true; t.repeat.set(ring.E*2*Math.PI/26,(ring.H-next.H)/22);
      var fm=new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:v[2],depthWrite:false,side:THREE.DoubleSide,color:0xDDF4FF});
      var band=atlBand(ring.E+v[0],next.H-1.2,ring.H-0.2,arcs,fm,30);
      G.add(band); atlFalls.push({tex:t,speed:v[1]*(0.55+vi*0.2)});
    });
    /* the lip where the water leaves the terrace: a glowing sill */
    var sill=new THREE.MeshBasicMaterial({color:0x9FEAFF,transparent:true,opacity:0.55,depthWrite:false});
    G.add(atlBand(ring.E+0.25,ring.H-0.25,ring.H+0.05,arcs,sill,30));
    /* white water where the falls land */
    var foam=new THREE.MeshBasicMaterial({color:0xF2FAFF,transparent:true,opacity:0.7,depthWrite:false});
    G.add(atlDisc(ring.E+0.3,ring.E+4.5,next.H-1.05,foam,seg));
    /* the canal */
    var wt=waterTex.clone(); wt.needsUpdate=true; var wr=2*next.S/14; wt.repeat.set(wr,wr);
    var water=atlDisc(ring.E,next.S,next.H-1.2,new THREE.MeshLambertMaterial({color:0x2A8AA8,map:wt,transparent:true,opacity:0.92,emissive:0x0A2A34}),seg);
    G.add(water); atlWater.push({tex:wt,speed:(i%2?1:-1)*0.004});
    G.add(atlDisc(ring.E,next.S,next.H-3,atlMat(0x1A3A44),seg));        // the canal bed
    /* the far bank, a low wall so the canal reads as a canal */
    G.add(atlBand(next.S,next.H-3,next.H+0.6,atlRimArcs(next.S),stoneWall));
    /* mist where the falls land: drifting points all the way round */
    var n=Math.min(1600,Math.round(ring.E*0.55)), pos=new Float32Array(n*3), rr=rng(900+i);
    for(var p=0;p<n;p++){
      var a=rr()*Math.PI*2, rad=ring.E+1+rr()*(next.S-ring.E-2);
      pos[p*3]=Math.cos(a)*rad; pos[p*3+1]=next.H-1+rr()*6; pos[p*3+2]=Math.sin(a)*rad;
    }
    var pg=new THREE.BufferGeometry(); pg.setAttribute("position",new THREE.BufferAttribute(pos,3));
    var pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0xF4FBFF,size:3.6,transparent:true,opacity:0.5,depthWrite:false,map:(typeof dotTexture==="function")?dotTexture():null,alphaTest:0.02}));
    G.add(pts); atlMist.push({pts:pts,speed:(i%2?1:-1)*0.01});
    /* lanterns set adrift over the canal, turning slowly round the city */
    var ln=Math.round(ring.E*2*Math.PI/40), lp=new Float32Array(ln*3), lr=rng(1300+i);
    for(var q=0;q<ln;q++){ var qa=lr()*Math.PI*2, qr=ring.E+2+lr()*(next.S-ring.E-4);
      lp[q*3]=Math.cos(qa)*qr; lp[q*3+1]=next.H+3+lr()*14; lp[q*3+2]=Math.sin(qa)*qr; }
    var lg=new THREE.BufferGeometry(); lg.setAttribute("position",new THREE.BufferAttribute(lp,3));
    var lpts=new THREE.Points(lg,new THREE.PointsMaterial({color:i%3===0?0xFFD27A:(i%3===1?0x9FF2FF:0xFFB0E0),size:2.6,transparent:true,opacity:0.95,
      depthWrite:false,map:(typeof dotTexture==="function")?dotTexture():null,alphaTest:0.02}));
    G.add(lpts); atlMist.push({pts:lpts,speed:(i%2?-1:1)*0.006,bob:true});
    /* glowing orbs along every rim: the city's own lights, cyan and gold */
    var orbs=Math.round(ring.E*2*Math.PI/24);
    var inst=new THREE.InstancedMesh(new THREE.SphereGeometry(0.45,10,8),
      new THREE.MeshBasicMaterial({color:i%2?0x9FF2FF:0xFFE2A0}),orbs);
    var M=new THREE.Matrix4(), k2=0;
    for(var o=0;o<orbs;o++){
      var oa=(o/orbs)*Math.PI*2;
      if(atlNearStair(ring.E,oa)) continue;
      M.makeTranslation(Math.cos(oa)*(ring.E-0.4),ring.H+1.55,Math.sin(oa)*(ring.E-0.4));
      inst.setMatrixAt(k2++,M);
    }
    inst.count=k2; G.add(inst); atlGlow.push(inst);
  });

  /* the grand stairways, bridging every canal */
  var stairSide=atlMat(0xCFC4AE,atlTiled("stone",1,1));
  for(var i2=0;i2<R.length-1;i2++){
    var up=R[i2], dn=R[i2+1];
    var L=dn.S+ATL_STAIR_RUN-up.E, drop=up.H-dn.H;
    ATL_STAIRS.forEach(function(s){
      var wdt=s.half*2;
      var shape=new THREE.Shape();
      shape.moveTo(0,-4); shape.lineTo(0,drop); shape.lineTo(L,0); shape.lineTo(L,-4); shape.lineTo(0,-4);
      var geo=new THREE.ExtrudeGeometry(shape,{depth:wdt,bevelEnabled:false});
      /* the treads: one tread every 0.36 m of rise, on the sloping face only */
      var slope=Math.hypot(L,drop), steps=Math.round(drop/0.36);
      var tt=stepTex.clone(); tt.needsUpdate=true; tt.repeat.set(steps/L,1/wdt);
      var tm=atlMat(0xE4DCCA,tt);
      var st=new THREE.Mesh(geo,[stairSide,tm]);
      /* local x runs outward along the stair, local z across it */
      var holder=new THREE.Group();
      st.position.set(0,0,-wdt/2); holder.add(st);
      /* balustrades up both sides, with lamps top and bottom */
      [-1,1].forEach(function(side){
        var bal=new THREE.Mesh(new THREE.BoxGeometry(slope,1.1,0.5),atlMat(0xF0EADC));
        bal.position.set(L/2,drop/2+0.55,side*(wdt/2-0.25)); bal.rotation.z=-Math.atan2(drop,L); holder.add(bal);
        [[0,drop],[L,0]].forEach(function(pp){
          var post=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.45,4.2,10),atlMat(0x2E3448));
          post.position.set(pp[0],pp[1]+2.1,side*(wdt/2-0.25)); holder.add(post);
          var lamp=new THREE.Mesh(new THREE.SphereGeometry(0.6,12,10),new THREE.MeshBasicMaterial({color:s.main?0xFFE2A0:0x9FF2FF}));
          lamp.position.set(pp[0],pp[1]+4.6,side*(wdt/2-0.25)); holder.add(lamp);
        });
      });
      holder.position.set(Math.cos(s.a)*up.E,dn.H,Math.sin(s.a)*up.E);
      holder.rotation.y=-s.a;
      G.add(holder);
    });
  }

  /* the streets: a paved circle for every street, kerbed, and the avenues
     running out from the foot of every stairway to the rim of the next */
  var pave=function(rep){ return atlMat(0xB8B0A0,atlTiled("paving",rep,rep),{polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2}); };
  var kerb=atlMat(0xE8E2D4,null,{polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-3});
  var lampPos=[], treePos=[];
  if(typeof ATL_STREETS!=="undefined") Object.keys(ATL_STREETS).forEach(function(k){
    var ring=atlRing(k); if(!ring) return;
    var green={estates:1,temples:1,commons:1,harvest:1,civic:1,markets:1}[k];
    ATL_STREETS[k].forEach(function(rs){
      G.add(atlDisc(rs-6,rs+6,ring.H+0.05,pave(2*(rs+6)/4),rs>1200?384:256));
      G.add(atlDisc(rs-6.7,rs-6,ring.H+0.1,kerb,rs>1200?384:256));
      G.add(atlDisc(rs+6,rs+6.7,ring.H+0.1,kerb,rs>1200?384:256));
      var n=Math.round(rs*2*Math.PI/32);
      for(var i=0;i<n;i++){
        var a=(i/n)*Math.PI*2, a2=((i+0.5)/n)*Math.PI*2;
        [-1,1].forEach(function(sd){
          var rl=rs+sd*7.6, rt=rs+sd*10.5;
          if(!atlNearStair(rl,a)&&atlClearLamp(rl,a)) lampPos.push([Math.cos(a)*rl,ring.H,Math.sin(a)*rl]);
          if(green&&!atlNearStair(rt,a2)&&atlClearLamp(rt,a2)) treePos.push([Math.cos(a2)*rt,ring.H,Math.sin(a2)*rt,(i*7+sd*3)%5]);
        });
      }
    });
  });
  for(var ri=1;ri<R.length;ri++){
    var ring2=R[ri], r0=ring2.S+ATL_STAIR_RUN+2, r1=ring2.E-1;
    if(ring2.k==="wilds") r1=ring2.S+ATL_STAIR_RUN+160;
    ATL_STAIRS.forEach(function(st){
      var len=r1-r0, wd=st.half*2-2;
      var pl=new THREE.Mesh(new THREE.PlaneGeometry(len,wd),pave(len/4));
      pl.material.map&&pl.material.map.repeat.set(len/4,wd/4);
      pl.rotation.x=-Math.PI/2;
      var hold=new THREE.Group(); hold.add(pl); hold.rotation.y=-st.a;
      hold.position.set(Math.cos(st.a)*(r0+len/2),ring2.H+0.04,Math.sin(st.a)*(r0+len/2));
      G.add(hold);
      /* lamps up both sides of every main avenue */
      if(st.main) for(var rr=r0+10;rr<r1;rr+=30) [-1,1].forEach(function(sd){
        var aa=st.a+sd*(st.half+1.5)/rr; lampPos.push([Math.cos(aa)*rr,ring2.H,Math.sin(aa)*rr]);
      });
    });
  }
  /* drawn as instances: thousands of lamps and trees for a handful of draw calls */
  var Mx=new THREE.Matrix4();
  function inst(geo,mat,list,yOff,scaleFn){
    if(!list.length) return;
    var im=new THREE.InstancedMesh(geo,mat,list.length);
    list.forEach(function(p,i){
      var sc=scaleFn?scaleFn(p):1;
      Mx.makeScale(sc,sc,sc); Mx.setPosition(p[0],p[1]+yOff*sc,p[2]); im.setMatrixAt(i,Mx);
    });
    im.instanceMatrix.needsUpdate=true; G.add(im);
  }
  inst(new THREE.CylinderGeometry(0.13,0.2,5.6,6),atlMat(0x1E2230),lampPos,2.8);
  inst(new THREE.SphereGeometry(0.42,8,6),new THREE.MeshBasicMaterial({color:0xFFE6A8}),lampPos,5.8);
  inst(new THREE.CylinderGeometry(0.28,0.4,4.2,6),atlMat(0x5A4030),treePos,2.1,function(p){ return 0.8+p[3]*0.1; });
  inst(new THREE.IcosahedronGeometry(2.6,1),atlMat(0x3E7A3A),treePos,6.2,function(p){ return 0.8+p[3]*0.1; });
  inst(new THREE.IcosahedronGeometry(1.8,1),atlMat(0x4E8A42),treePos,8.2,function(p){ return 0.8+p[3]*0.1; });

  /* the Nightmare Wilds: a dead forest, a mist that never lifts, and eyes */
  var WR=R[R.length-1], wr=rng(4242), trees=[];
  for(var t=0;t<1800;t++){
    var ta=wr()*Math.PI*2, tr=WR.S+ATL_STAIR_RUN+20+wr()*(WR.E-WR.S-ATL_STAIR_RUN-40);
    if(atlNearStair(tr,ta)) continue;
    trees.push([Math.cos(ta)*tr,WR.H,Math.sin(ta)*tr,0.7+wr()*1.1,wr()*Math.PI*2]);
  }
  var trunkG=new THREE.CylinderGeometry(0.18,0.55,9,5), limbG=new THREE.ConeGeometry(0.16,5,4);
  var trunkM=atlMat(0x1C1618), limbM=atlMat(0x241C20);
  var ti=new THREE.InstancedMesh(trunkG,trunkM,trees.length), Q=new THREE.Quaternion(), E3=new THREE.Euler(), V=new THREE.Vector3(), SC=new THREE.Vector3();
  var limbs=[new THREE.InstancedMesh(limbG,limbM,trees.length),new THREE.InstancedMesh(limbG,limbM,trees.length),new THREE.InstancedMesh(limbG,limbM,trees.length)];
  trees.forEach(function(p,i){
    E3.set(0,p[4],0.06); Q.setFromEuler(E3); SC.set(p[3],p[3],p[3]); V.set(p[0],p[1]+4.5*p[3],p[2]);
    Mx.compose(V,Q,SC); ti.setMatrixAt(i,Mx);
    limbs.forEach(function(im,k){
      E3.set(0.9+k*0.2,p[4]+k*2.1,0.7-k*0.3); Q.setFromEuler(E3); V.set(p[0],p[1]+(6+k*1.3)*p[3],p[2]);
      Mx.compose(V,Q,SC); im.setMatrixAt(i,Mx);
    });
  });
  G.add(ti); limbs.forEach(function(im){ G.add(im); });
  var mn=7000, mp=new Float32Array(mn*3);
  for(var m=0;m<mn;m++){ var ma=wr()*Math.PI*2, mr=WR.S+10+wr()*(WR.E-WR.S-20); mp[m*3]=Math.cos(ma)*mr; mp[m*3+1]=WR.H+0.4+wr()*3.5; mp[m*3+2]=Math.sin(ma)*mr; }
  var mg=new THREE.BufferGeometry(); mg.setAttribute("position",new THREE.BufferAttribute(mp,3));
  var wmist=new THREE.Points(mg,new THREE.PointsMaterial({color:0x8A7AA0,size:9,transparent:true,opacity:0.18,depthWrite:false,map:(typeof dotTexture==="function")?dotTexture():null,alphaTest:0.01}));
  G.add(wmist); atlMist.push({pts:wmist,speed:0.004});
  var en=420, ep=new Float32Array(en*6);
  for(var e=0;e<en;e++){ var ea=wr()*Math.PI*2, er=WR.S+80+wr()*(WR.E-WR.S-140), ey=WR.H+0.9+wr()*2.2, ex=Math.cos(ea)*er, ez=Math.sin(ea)*er;
    var sx=-Math.sin(ea)*0.22, sz=Math.cos(ea)*0.22;
    ep[e*6]=ex-sx; ep[e*6+1]=ey; ep[e*6+2]=ez-sz; ep[e*6+3]=ex+sx; ep[e*6+4]=ey; ep[e*6+5]=ez+sz; }
  var eg=new THREE.BufferGeometry(); eg.setAttribute("position",new THREE.BufferAttribute(ep,3));
  var eyes=new THREE.Points(eg,new THREE.PointsMaterial({color:0xFF2A2A,size:0.5,transparent:true,opacity:0.95,depthWrite:false}));
  G.add(eyes); atlEyes=eyes;

  /* the outer dark, past the Wilds: the land simply goes on into the fog */
  var far=atlMat(0x1A1620,atlTiled("earth",300,300));
  G.add(atlDisc(3000,5200,0,far,256));

  scene.add(G); atlGroup=G;
  return G;
}

/* the city's buildings, waiting to be drawn: nearest to wherever you are first */
var atlMeshQueue=[];
function atlSortQueue(){
  var P=(typeof camera!=="undefined"&&camera)?camera.position:{x:0,z:0};
  var fx=P.x, fz=P.z;
  if(ATLC&&Math.hypot(P.x-ATLC.x,P.z-ATLC.z)>4000){ fx=ATLC.x; fz=ATLC.z+60; }
  atlMeshQueue.sort(function(a,b){ return ((a.x-fx)*(a.x-fx)+(a.z-fz)*(a.z-fz))-((b.x-fx)*(b.x-fx)+(b.z-fz)*(b.z-fz)); });
}
function atlDrainQueue(budgetMs){
  if(!atlMeshQueue.length) return;
  var t0=performance.now();
  while(atlMeshQueue.length&&performance.now()-t0<budgetMs){
    var sp=atlMeshQueue.shift();
    if(meshes[sp.id]||sp._gone) continue;
    addMesh(sp);
    var g=meshes[sp.id]; if(g){ g.visible=false; g.userData.culled=true; }
  }
  cullAt=0;
}
/* keep street furniture off the doorsteps of the buildings that already stand */
function atlClearLamp(r,a){ return true; }
/* the water moves, the falls fall, the mist drifts */
function atlTick(dt){
  atlDrainQueue(atlMeshQueue.length>3000?14:9);
  if(!atlGroup||!atlGroup.visible) return;
  atlWater.forEach(function(w){ w.tex.offset.x+=w.speed*dt*8; w.tex.offset.y+=w.speed*dt*3; });
  atlFalls.forEach(function(f){ f.tex.offset.y+=f.speed*dt; });
  atlT+=dt;
  atlMist.forEach(function(m){ m.pts.rotation.y+=m.speed*dt; if(m.bob) m.pts.position.y=Math.sin(atlT*0.4)*1.2; });
  /* the eyes in the Wilds blink, and burn brighter after dark */
  if(atlEyes){ var night=typeof isNightHour==="function"&&typeof dreamHour==="function"&&isNightHour(dreamHour());
    atlEyes.material.opacity=(Math.sin(atlT*0.7)>0.93?0.05:(night?0.95:0.25)); }
}
