/* SomnuMatrix — atlantis-city.js
   standing the risen city up, ring by ring (see atlantis-terrain.js for the
   rings themselves). Every street is a circle; every ring is crossed by the
   sixteen stairway avenues, and nothing is ever built across one of them, so
   a dreamer can always walk straight from the Wilds to the Tower.
   All of it is laid from a fixed seed, so every dreamer's Somnucor is the
   same city, stone for stone — the same streets, the same numbered plots,
   the same doors.
   loaded as a plain script; shares scope with the other files */
"use strict";

var ATL_BUILD=1;
/* things you walk under or through, not into */
var ATL_WALKTHROUGH={ringarch:1,estategate:1,torii:1,paifang:1,stringlights:1,redlanterns:1,papelpicado:1,eidlanterns:1,
  groundpad:1,lawn:1,snowfield:1,blossomground:1,leaffall:1,zengarden:1,flowerbed:1,reflectpool:1,wisps:1,shardfield:1,moonpool:1};
var ATL_ROAD=6, ATL_SETBACK=5;

/* the streets of each ring, as radii — the terrain draws them, the city fronts onto them */
var ATL_STREETS={civic:[245],estates:[430,565],temples:[740,880],markets:[1080],commons:[1280,1420],warrens:[1620],harvest:[1790]};

function rotIn(a){ return Math.atan2(-Math.cos(a),-Math.sin(a)); }   /* front faces the centre */
function rotOut(a){ return Math.atan2(Math.cos(a),Math.sin(a)); }   /* front faces outward */
function rotAlong(a){ return Math.atan2(-Math.sin(a),Math.cos(a)); } /* front faces along the circle */
function atlWrap(d){ return ((d%(Math.PI*2))+Math.PI*3)%(Math.PI*2)-Math.PI; }

/* the arcs between stairway avenues where something of half-width hw can stand at radius rad */
function atlGaps(rad,hw,margin){
  var m=(margin===undefined)?6:margin, S=ATL_STAIRS.slice().sort(function(p,q){ return p.a-q.a; }), out=[];
  for(var i=0;i<S.length;i++){
    var s0=S[i], s1=S[(i+1)%S.length], a1=s1.a+(i+1===S.length?Math.PI*2:0);
    var lo=s0.a+(s0.half+hw+m)/rad, hi=a1-(s1.half+hw+m)/rad;
    if(hi>lo) out.push({a0:lo,a1:hi,mid:(s0.a+a1)/2,i:i,afterMain:s0.main});
  }
  return out;
}
function atlClearAt(rad,a,hw,margin){
  for(var i=0;i<ATL_STAIRS.length;i++){
    var s=ATL_STAIRS[i];
    if(Math.abs(atlWrap(a-s.a))*rad<s.half+hw+(margin===undefined?6:margin)) return false;
  }
  return true;
}
function kitW(arch,s){ var d=KIT[arch]; return d?d.size[0]*(s||1):10; }
function kitD(arch,s){ var d=KIT[arch]; return d?d.size[2]*(s||1):10; }

/* ---- the builder's hands ---- */
function atlHands(r,h){
  var C={r:r,h:h,made:0,seq:0,plots:[],district:[],workplaces:{}};
  C.put=function(arch,x,z,rot,name,attrs,extra){
    if(!KIT[arch]) return null;
    /* every thing in the city has the same fixed name on every dreamer's device,
       so a change the keeper makes to it is a change to the one city */
    var spec={id:(C.pre||"sc")+(++C.seq),archetype:arch,label:name||null,attrs:attrs||{},x:h.x+x,z:h.z+z,rot:rot||0,
      solid:KIT[arch].cat!=="being"&&!ATL_WALKTHROUGH[arch],detail:3,nights:[store.session],realm:r.id,hub:true,city:true,
      addr:null,name:name||null,named:name?"stated":null,peopled:true};
    if(extra) Object.keys(extra).forEach(function(k){ spec[k]=extra[k]; });
    store.objects.push(spec); C.made++;
    /* drawn a little at a time, nearest first, rather than all at once */
    if(typeof addMesh==="function"&&typeof scene!=="undefined"&&scene) atlMeshQueue.push(spec);
    return spec;
  };
  C.at=function(arch,rad,a,rot,name,attrs,extra){
    return C.put(arch,Math.cos(a)*rad,Math.sin(a)*rad,rot,name,attrs,extra);
  };
  /* something at radius rad, angle a, pushed along the street by t metres and outward by u */
  C.off=function(rad,a,t,u){
    var rr=rad+(u||0), aa=a+(t||0)/rad;
    return {x:Math.cos(aa)*rr,z:Math.sin(aa)*rr,a:aa,r:rr};
  };
  C.sign=function(rad,a,rot,title,note){
    var sg=C.at("signboard",rad,a,rot,title);
    if(sg){ sg.sign=title; sg.note=note||""; }
    return sg;
  };
  /* a building fronting a street: side +1 stands outside the street, -1 inside */
  C.front=function(arch,rs,side,a,s,name,extra){
    var d=kitD(arch,s), rb=rs+side*(ATL_ROAD+ATL_SETBACK+d/2);
    var sp=C.at(arch,rb,a,side>0?rotIn(a):rotOut(a),name,s&&s!==1?{s:s}:{},extra);
    return {spec:sp,rb:rb,depth:d,w:kitW(arch,s)};
  };
  /* where the door-side kerb of a fronting building is */
  C.kerb=function(rs,side){ return rs+side*(ATL_ROAD+1.5); };
  /* line a run of fronting things along a street, from angle a0 to a1; each item
     is {arch,s,name,extra,after(spec,a,rb)}; returns the items that did not fit */
  C.row=function(items,rs,side,a0,a1,gap){
    var rb0=rs+side*(ATL_ROAD+ATL_SETBACK+10), a=a0, i=0;
    for(;i<items.length;i++){
      var it=items[i], w=kitW(it.arch,it.s), rb=rs+side*(ATL_ROAD+ATL_SETBACK+kitD(it.arch,it.s)/2);
      var ac=a+(w/2)/rb;
      var guard=0;
      while(!atlClearAt(rb,ac,w/2)&&guard++<400) ac+=2/rb;
      if(ac+(w/2)/rb>a1) break;
      var f=C.front(it.arch,rs,side,ac,it.s,it.name,it.extra);
      if(it.after&&f.spec) it.after(f.spec,ac,f.rb,f);
      a=ac+(w/2+(gap||8))/rb;
    }
    return items.slice(i);
  };
  /* a workplace: the building, its name on a board by the kerb, and its key */
  C.workplace=function(key,rs,side,a){
    var wp=WP_BY_KEY[key]; if(!wp) return null;
    var f=C.front(wp.arch,rs,side,a,wp.s,wp.key,{workplace:wp.key,sign:wp.key});
    if(f.spec&&(wp.ring==="civic"||wp.ring==="temples")){ f.spec.attrs.c=0xE2DCCE; f.spec.attrs.rc=0x3A4A6A; }
    if(f.spec){
      var kb=C.kerb(rs,side);
      C.sign(kb,a+(f.w/2+3)/kb,side>0?rotIn(a):rotOut(a),wp.key,wp.note);
      C.workplaces[wp.key]={x:f.spec.x,z:f.spec.z,id:f.spec.id};
    }
    return f;
  };
  return C;
}

/* ============================================================== the city */
function buildSomnucorCity(){
  CITY_OUT=ATL_RINGS[ATL_RINGS.length-2].E;
  var had=somnucorRealm();
  var standing=had&&store.objects.some(function(o){ return o.realm===had.id&&o.city; });
  if(had&&had.atlantis&&(had.atlBuild||0)>=ATL_BUILD&&standing){ atlRefresh(); return had; }
  if(had&&(!had.atlantis||standing)){
    /* an older, flat Somnucor — or a stale build of this one — comes down first */
    razeSomnucor();
    if(typeof realmGrounds!=="undefined"&&realmGrounds[had.id]){ scene.remove(realmGrounds[had.id]); delete realmGrounds[had.id]; }
    had=null;
  }
  if(typeof REALMS==="undefined"||!REALMS.somnucor) return null;
  _cs=7761109;
  var was=store.here||0, wasGrid=store.grid;
  /* the city itself is never kept on the device (it is the same for everyone, and
     too large to keep beside a dreamer's own dreams), so on every visit it is
     stood up again from the same seed, into the same realm */
  var r=had||makeRealm("somnucor");
  r.atlantis=true;
  /* makeRealm laid ordinary rolling ground; the cone replaces it */
  if(typeof realmGrounds!=="undefined"&&realmGrounds[r.id]){ scene.remove(realmGrounds[r.id]); delete realmGrounds[r.id]; }
  atlRefresh();
  if(typeof realmGround==="function") realmGround(r);
  store.here=r.id; store.grid=r.grid;
  var h=blockOrigin(r.grid.bx,r.grid.bz);
  var C=atlHands(r,h);

  atlPlaza(C); atlCivic(C); atlEstates(C); atlTemples(C); atlMarkets(C);
  atlCommons(C); atlWarrens(C); atlHarvest(C); atlWilds(C); atlStairDress(C);
  if(typeof atlTransit==="function") atlTransit(C);

  if(typeof housePeople==="function"&&typeof BELONGS!=="undefined"){
    store.objects.filter(function(o){ return o.city&&o.workplace&&BELONGS[o.archetype]; })
      .slice(0,48).forEach(function(o){ o.peopled=false; housePeople(o); });
  }
  r.dressed=true; r.city=true; r.build=CITY_BUILD; r.atlBuild=ATL_BUILD;
  atlSortQueue();
  /* and on top of the plan, everything the keeper has changed since */
  if(typeof loadCityEdits==="function"){ cityEditAt=0; setTimeout(function(){ loadCityEdits(true); },30); }
  r.housing=99; r.district=99; r.yard=99; r.works=99; r.templerow=99;
  store.somnucor=r.id; store.templerow=r.id;
  store.plots=C.plots; store.districtPlots=C.district;
  store.workplaceAt=C.workplaces;
  store.here=was; store.grid=wasGrid;
  if(typeof save==="function") save();
  return r;
}
/* the separate builders the rest of the Atlas still calls: everything is now
   stood up in one piece by buildSomnucorCity, so these only make sure of it */
function buildTempleRow(){ var r=somnucorRealm(); if(!r&&typeof buildSomnucorCity==="function") r=buildSomnucorCity(); return r; }
function buildHousing(){ return 0; }
function buildEmployeeDistrict(){ return 0; }
function buildYard(){ return 0; }
function buildGroundWorks(){ return 0; }

/* ---------------------------------------------------------------- 0 the Tower Plaza */
function atlPlaza(C){
  var tower=C.put("somnucortower",0,0,0,"Somnucor Tower");
  if(tower){ tower.attrs={}; tower.tower=true; }
  var gate=C.put("hubdoor",0,64,Math.PI,"The Hall of Doors",{s:2.6});
  if(gate){ gate.leadsTo="hall"; gate.gate=true; }
  var gs=C.put("signboard",12,72,Math.PI,"Through the gate");
  if(gs){ gs.sign="Through the gate"; gs.note="The Hall of Doors lies beyond it: a door for every world, and one for every dreamer who takes one."; }
  C.put("maptable",0,44,0,"The map of everywhere");
  for(var p=0;p<12;p++){ var pa=(p/12)*Math.PI*2+0.13; C.at("hubpillar",40,pa,0); }
  for(var L=0;L<16;L++){ var la=(L/16)*Math.PI*2+0.1; C.at("ornatelamp",52,la,0); }
  HUB_SIGNS.forEach(function(s,i){
    var a=(i/HUB_SIGNS.length)*Math.PI*2+0.4;
    C.sign(26,a,-a+Math.PI/2,s[0],s[1]);
  });
  /* four great fountains, and the Needle */
  [0.78,2.36,3.93,5.5].forEach(function(a){ C.at("tierfountain",88,a,0,null,{s:1.5}); });
  C.at("obelisk",104,3.14,0,"The Needle of Somnucor");
  /* the crown's garden ring: statues between the stairways, beds and topiary round them */
  ATL_STAIRS.forEach(function(s,i){
    var a=s.a+Math.PI/16;
    C.at("herostatue",116,a,rotIn(a),null,{s:1.3});
    C.at("flowerbed",106,a,rotAlong(a)); C.at("topiary",116,a+0.06,0); C.at("topiary",116,a-0.06,0);
    C.at("bannerpole",70,s.a,rotAlong(s.a)+Math.PI/2);
  });
  for(var b=0;b<24;b++){ var ba=(b/24)*Math.PI*2+0.05; if(atlClearAt(132,ba,1,2)) C.at("crystalbrazier",132,ba,0); }
  for(var bn=0;bn<8;bn++){ var bna=(bn/8)*Math.PI*2+0.45; C.at("bench",96,bna,rotIn(bna)); }
}

/* ---------------------------------------------------------------- 1 the Civic Ring */
function atlCivic(C){
  var rs=245, G=atlGaps(rs+40,28,4), Gi=atlGaps(rs-40,24,4);
  C.sign(170,0.19+0.12,rotOut(0.31),"The Civic Ring","The city's own business: its courts and its watch, its treasury and archive, its hospital and its post.");
  /* outside the street: the great halls, one to a gap */
  var outer=["The City Hospital","The Dragon Roost","The Courthouse","The City Treasury","The City Archive","The Gate Lodge","The City Museum","The Map House",
             "The Land Office","The Post Office","The Chronicle Press","The Runners' Hall"];
  outer.forEach(function(k,i){
    var g=G[(i*4)%16+Math.floor(i/4)]; if(!g) return;
    C.workplace(k,rs,+1,g.mid);
  });
  /* inside the street: the Bank of Somnucor, and gardens between the stairways */
  var used={}; outer.forEach(function(k,i){ used[(i*4)%16+Math.floor(i/4)]=1; });
  Gi.forEach(function(g,i){
    if(i===2){ C.front("bank",rs,-1,g.mid,1,"The Bank of Somnucor",{sign:"The Bank of Somnucor"}); return; }
    var p=C.off(rs-34,g.mid);
    C.at("tierfountain",p.r,p.a,0,null,{s:1.1});
    C.at("flowerbed",p.r+8,p.a+10/p.r,rotAlong(p.a)); C.at("flowerbed",p.r+8,p.a-10/p.r,rotAlong(p.a));
    C.at("bench",p.r-9,p.a,rotOut(p.a)); C.at("tree",p.r,p.a+22/p.r,0); C.at("tree",p.r,p.a-22/p.r,0);
    if(i%4===1) C.at("herostatue",rs-20,g.mid+30/rs,rotOut(g.mid));
  });
  /* the gaps the halls left: a fountain court on the outside too */
  G.forEach(function(g,i){
    if(used[i]) return;
    var p=C.off(rs+40,g.mid);
    C.at("reflectpool",p.r,p.a,rotAlong(p.a)+Math.PI/2); C.at("herostatue",p.r+16,p.a,rotIn(p.a));
    C.at("topiary",p.r,p.a+14/p.r,0); C.at("topiary",p.r,p.a-14/p.r,0);
  });
}

/* ---------------------------------------------------------------- 2 the High Ring */
function atlEstates(C){
  var CYCLE=[["manor",1],["palace",.58],["manor",1],["castle",.5],["manor",1],["palace",.58]];
  var BACKERS=[["manor",1],["palace",.46],["manor",.95],["castle",.44],["manor",1],["palace",.46]];
  var n=0;
  C.sign(360,0.19+0.1,rotOut(0.29),"The High Ring","Somnucor's own: the Crescent, where the Tower's office holders live, and Backers Street, kept for the backers who made the city possible. Who lives here is assigned, never bought.");
  function estate(rs,side,a,arch,s,plotName,street,grand){
    var f=C.front(arch,rs,side,a,s,null,{estate:true});
    if(!f.spec) return;
    var rb=f.rb, w=f.w, dep=f.depth, face=side>0?rotIn(a):rotOut(a);
    var kb=rs+side*(ATL_ROAD+2.5);
    /* the gate at the kerb, the drive, the garden in front */
    C.at("estategate",kb,a,face,null,grand?{s:1.4}:{});
    var gardenR=(kb+(rb-side*dep/2))/2;
    C.at(grand?"tierfountain":(n%2?"tierfountain":"gazebo"),gardenR,a,0,null,grand?{s:1.6}:{});
    C.at("topiary",kb+side*2,a+9/kb,0); C.at("topiary",kb+side*2,a-9/kb,0);
    C.at("flowerbed",gardenR,a+(w/2-2)/gardenR,face); C.at("flowerbed",gardenR,a-(w/2-2)/gardenR,face);
    C.at("ornatelamp",kb,a+(grand?14:11)/kb,0); C.at("ornatelamp",kb,a-(grand?14:11)/kb,0);
    /* railings down both sides of the grounds */
    [-1,1].forEach(function(sd){
      var aa=a+sd*(w/2+6)/rb;
      for(var t=0;t<(dep+14)/10;t++){ var rr=kb+side*(5+t*10); C.at("ironfence",rr,aa,rotAlong(aa)); }
    });
    C.at("tree",rb+side*(dep/2+6),a+(w/2)/rb,0); C.at("tree",rb+side*(dep/2+6),a-(w/2)/rb,0);
    if(grand){
      C.at("reflectpool",rb+side*(dep/2+14),a,rotAlong(a)+Math.PI/2,null,{s:1.4});
      C.at("herostatue",gardenR,a+(w/2-12)/gardenR,face); C.at("herostatue",gardenR,a-(w/2-12)/gardenR,face);
      C.at("gazebo",rb,a+(w/2+14)/rb,0);
    }
    /* the board: assigned by the penthouse or a keeper, never sold */
    var board=C.at("signboard",kb,a+(grand?19:15)/kb,face,grand?"Private estate":plotName);
    if(board){
      var plot={name:plotName,quarter:"The Somnucor Employee & Backer District",kind:"district",price:0,rent:0,
                x:f.spec.x,z:f.spec.z,homeId:f.spec.id,archetype:arch,street:street};
      board.plot=plot; board.sign=grand?"Private estate":plotName;
      board.note=grand?"":"Kept for Somnucor's own people and its backers. Assigned, never bought.";
      C.district.push(plot);
    }
    n++;
  }
  /* the Crown Estate: the grandest house in the city, facing the Hall of Doors' own bearing */
  var crescent=430, backers=565;
  var gIn=atlGaps(crescent-60,40,6), gOut=atlGaps(crescent+40,28,6);
  var crownGap=gIn.reduce(function(b,g){ return Math.abs(atlWrap(g.mid-Math.PI/2))<Math.abs(atlWrap(b.mid-Math.PI/2))?g:b; },gIn[0]);
  estate(crescent,-1,crownGap.mid,"palace",.82,"The Crown Estate","The Crescent",true);
  var ci=1;
  gIn.forEach(function(g){ if(g===crownGap) return; var c=CYCLE[ci%CYCLE.length]; estate(crescent,-1,g.mid,c[0],c[1],"The Crescent "+(ci++),"The Crescent"); });
  gOut.forEach(function(g){ var c=CYCLE[ci%CYCLE.length]; estate(crescent,+1,g.mid,c[0],c[1],"The Crescent "+(ci++),"The Crescent"); });
  /* Backers Street: two grand houses to every gap, both sides */
  var bi=1;
  [[-1,atlGaps(backers-30,30,6)],[+1,atlGaps(backers+30,30,6)]].forEach(function(pair){
    var side=pair[0];
    pair[1].forEach(function(g){
      var span=g.a1-g.a0;
      [0.27,0.73].forEach(function(t){
        var c=BACKERS[bi%BACKERS.length], a=g.a0+span*t;
        estate(backers,side,a,c[0],c[1],"Backers Street "+(bi++),"Backers Street");
      });
    });
  });
  var bs=C.sign(backers+ATL_ROAD+2,0.19+14/backers,rotIn(0.19),"Backers Street","Every house on this street is kept for a backer of Somnucor, in thanks.");
  var cs=C.sign(crescent+ATL_ROAD+2,0.19+14/crescent,rotIn(0.19),"The Crescent","The houses of the Tower's own: those who hold its offices, and those who keep its desk.");
  /* the gardeners, whose lodge keeps it all in flower */
  var lg=atlGaps(backers+40,20,6)[5];
  C.workplace("The Gardeners' Lodge",backers,+1,lg.a1-10/backers);
}

/* ---------------------------------------------------------------- 3 Temple Row */
function atlTemples(C){
  var RS=[740,880];
  C.sign(670,0.19+0.1,rotOut(0.29),"Temple Row","A house for every power the Atlas knows — two hundred and seventy-five of them, in six-and-twenty precincts — and the churches, cathedrals, mosques and stupas of the city besides. What is left in a bowl is left; nothing here asks anything of anybody.");
  var HOUSE={Greek:"grandtemple",Roman:"grandtemple",Hebrew:"grandtemple",Japanese:"shintoshrine",
    Demonology:"darkfane",Qliphothic:"darkfane",Adversarial:"darkfane"};
  var byTrad={};
  Object.keys(DEITY).forEach(function(key){ var d=DEITY[key], t=d.trad||"Elsewhere"; (byTrad[t]=byTrad[t]||[]).push(d); });
  var trads=Object.keys(byTrad).sort(function(a,b){ return byTrad[b].length-byTrad[a].length; });
  /* the runs of street a precinct may occupy: both sides of both temple streets, gap by gap */
  var runs=[];
  [[RS[0],-1],[RS[0],+1],[RS[1],-1]].forEach(function(p){
    atlGaps(p[0]+p[1]*26,12,6).forEach(function(g){ runs.push({rs:p[0],side:p[1],a:g.a0,a1:g.a1}); });
  });
  var ri=0, STEP=26;
  function nextSlot(){
    while(ri<runs.length){
      var run=runs[ri], rb=run.rs+run.side*26, a=run.a+(12)/rb;
      if(a+12/rb<=run.a1){ run.a=a+(STEP-12)/rb; return {rs:run.rs,side:run.side,a:a,rb:rb}; }
      ri++;
    }
    return null;
  }
  trads.forEach(function(t){
    var P=PRECINCT[t]||{house:"shrine",trim:0xC9A868,note:""};
    var arch=HOUSE[t]||P.house; if(arch==="torii") arch="shintoshrine";
    var list=byTrad[t];
    /* the precinct's board takes the first slot's kerb */
    list.forEach(function(d,i){
      var sl=nextSlot(); if(!sl) return;
      var face=sl.side>0?rotIn(sl.a):rotOut(sl.a), kb=sl.rs+sl.side*(ATL_ROAD+2);
      if(i===0){ var sg=C.sign(kb,sl.a-9/kb,face,t); if(sg){ sg.note=P.note+" · "+list.length+(list.length===1?" house":" houses"); } }
      var sz=KIT[arch].size, s=Math.max(0.3,Math.min(1.2,20/Math.max(sz[0],sz[2])));
      var temple=C.at(arch,sl.rb,sl.a,face,d.name+"'s house",{s:s},{templerow:true,deity:d.key});
      var front=sl.rs+sl.side*(ATL_ROAD+5);
      var bowl=C.at("altarseasonal",front,sl.a,face,"The offering bowl of "+d.name,null,{templerow:true}); if(bowl) bowl.deity=d.key;
      var cd=C.at("imbolccandles",front,sl.a-3.4/front,face,"Candles at "+d.name+"'s house",null,{templerow:true}); if(cd) cd.deity=d.key;
      var ic=C.at("incenseburner",front,sl.a+3.4/front,face,"Incense at "+d.name+"'s house",null,{templerow:true}); if(ic) ic.deity=d.key;
      if(i%4===0) C.at("wisps",front,sl.a+8/front,0);
      /* the deity is at home: on the steps, beside the bowl, facing whoever comes */
      /* the house's own keeper: the same power you would meet in a dream, standing at home.
         the city keeps its own — a dreamer's own dreamt deity is never moved here */
      var at={x:C.h.x+Math.cos(sl.a+5/front)*(front-sl.side*2),z:C.h.z+Math.sin(sl.a+5/front)*(front-sl.side*2)};
      var body={id:"sd"+d.key,archetype:d.dragon?"dragon":"deity",label:d.name,name:d.name,named:"stated",deity:d.key,attrs:{},
        x:at.x,z:at.z,rot:face,solid:true,detail:4,nights:[store.session],realm:C.r.id,hub:true,city:true,templerow:true,addr:null};
      if(!d.dragon&&typeof lookOf==="function"){ lookOf(body); if(typeof deityLook==="function") deityLook(body,d); }
      store.objects.push(body); atlMeshQueue.push(body);
      if(typeof newCharacter==="function"){
        var ch=newCharacter(body.archetype,d.name,{});
        ch.deity=d.key; ch.city=true; ch.awake=true; ch.src={name:"stated"};
        ch.aka=[normName(d.name)].concat((d.aka||[]).map(normName));
        ch.objId=body.id; ch.x=body.x; ch.z=body.z; ch.anchor={x:body.x,z:body.z};
        ch.atId=temple?temple.id:null; ch.home=temple?temple.id:null; ch.routine=null;
        body.charId=ch.id;
      }
    });
  });
  /* the far street's outer side: the great houses of worship, the vestry, the cemetery */
  var rsB=RS[1], outerGaps=atlGaps(rsB+45,34,6);
  var GREAT=[
    ["grandcathedral",.88,"The Cathedral of the Dreaming","The great cathedral of Somnucor: its nave, its two spires, and the rose window that burns at dusk."],
    ["mosque",1.3,"The Great Mosque","Its dome and its minarets, and a courtyard fountain for washing."],
    ["stupa",1.6,"The Great Stupa","Walk round it the way the sun goes."],
    ["grandtemple",1,"The Grand Temple of Somnucor","The largest of the columned houses, kept for no one power in particular and open to all."],
    ["gopuram",1.4,"The Gopuram","A gate-tower of a thousand carved figures."],
    ["chapel",1.2,"The Chapel of Lights","A small church, kept lit through the night."],
    ["church",1,"The Old Church","The oldest church in the city, with a bell that still rings the hours."],
    ["cathedral",.8,"The Abbey","An abbey church, and its quiet close."],
    ["pagoda",1.5,"The Great Pagoda","Nine roofs, and a bell under every one."],
    ["ziggurat",1.1,"The Stepped Temple","Climb it, if you like. The top is closer to the sky."]
  ];
  var gi=0;
  GREAT.forEach(function(g){
    var gp=outerGaps[gi++]; if(!gp) return;
    var f=C.front(g[0],rsB,+1,gp.mid,g[1],g[2],{sign:g[2],templerow:true});
    if(f.spec) C.sign(C.kerb(rsB,+1),gp.mid+(f.w/2+4)/C.kerb(rsB,+1),rotIn(gp.mid),g[2],g[3]);
    if(g[0]==="mosque"&&f.spec){
      C.at("minaret",f.rb,gp.mid+(f.w/2+5)/f.rb,0,null,{s:1.3}); C.at("minaret",f.rb,gp.mid-(f.w/2+5)/f.rb,0,null,{s:1.3});
      C.at("tiledfountain",C.kerb(rsB,+1)+10,gp.mid,0);
    } else if(f.spec){
      C.at("tierfountain",C.kerb(rsB,+1)+8,gp.mid+(f.w/2+10)/rsB,0);
    }
  });
  var vg=outerGaps[gi++], ug=outerGaps[gi++];
  if(vg) C.workplace("The Vestry of Temple Row",rsB,+1,vg.mid-20/rsB);
  if(ug){
    C.workplace("The Undertaker's",rsB,+1,ug.a0+14/rsB);
    /* the cemetery behind it */
    var cr=rsB+ATL_ROAD+30, ca=ug.a0+50/cr;
    for(var gr=0;gr<5;gr++) for(var gc=0;gc<8;gc++){
      C.at("gravestone",cr+gr*4,ca+gc*4/cr,rotIn(ca));
    }
    C.at("deadtree",cr+10,ca+40/cr,0); C.at("tree",cr+6,ca-8/cr,0); C.at("crypt",cr+26,ca+16/cr,rotIn(ca),"The Cemetery Vault");
    C.sign(C.kerb(rsB,+1),ca+10/C.kerb(rsB,+1),rotIn(ca),"The Cemetery","Where the city's own dead are laid, and remembered.");
  }
  /* the Gardens of the Year, between the two temple streets */
  var mid=(RS[0]+RS[1])/2, gg=atlGaps(mid,40,6);
  SEASON_GARDENS.forEach(function(g,i){
    var gp=gg[i*4+2]; if(!gp) return;
    var cx=Math.cos(gp.mid)*mid, cz=Math.sin(gp.mid)*mid;
    if(g.ground&&KIT[g.ground]){ var sz=KIT[g.ground].size; C.put(g.ground,cx,cz,-gp.mid,null,{w:64/sz[0],d:52/sz[2]}); }
    C.sign(mid-24,gp.mid,rotIn(gp.mid),g.name,g.line);
    g.pieces.forEach(function(k,j){ var a=(j/g.pieces.length)*Math.PI*2+0.4, rr=10+(j%3)*6;
      C.put(k,cx+Math.cos(a)*rr,cz+Math.sin(a)*rr,-a); });
    g.planting.forEach(function(k,j){ var a=(j/g.planting.length)*Math.PI*2+1.1; C.put(k,cx+Math.cos(a)*24,cz+Math.sin(a)*20,a); });
    C.put("bench",cx+6,cz+8,0);
  });
}

/* ---------------------------------------------------------------- 4 the Market Ring */
function atlMarkets(C){
  var rs=1080;
  C.sign(990,0.19+0.1,rotOut(0.29),"The Market Ring","Everything that can be carried, and a good deal that cannot: the Guild Street trades, the bazaars, the inns, the transport yard.");
  var gIn=atlGaps(rs-30,10,6), gOut=atlGaps(rs+30,10,6);
  var guild=WORKPLACES.filter(function(w){ return w.ring==="markets"&&w.arch==="shop"; }).map(function(w){ return w.key; });
  /* Guild Street: two gaps, both sides, one trade to a shop, stalls between */
  var SHOPCOL=[0xE8D8B8,0xC98A5A,0x8AA8C0,0xE0C070,0x9AB88A,0xD8A0A0,0xB89AD0,0xF0E6D0,0x7FA0A8,0xD8B890,0xA8C8B0,0xE0B8C8];
  var SHOPROOF=[0x6A3A2A,0x2E4A6A,0x3A5A3A,0x5A2A3A,0x4A4A5A,0x7A5A2A];
  var todo=guild.map(function(k,gi){ return {arch:"shop",s:WP_BY_KEY[k].s||1.2,name:k,extra:{workplace:k,sign:k,
      attrs:{s:WP_BY_KEY[k].s||1.2,c:SHOPCOL[gi%SHOPCOL.length],rc:SHOPROOF[(gi*5)%SHOPROOF.length]}},after:function(sp,a,rb){
      var kb=C.kerb(rs,rb>rs?1:-1); C.sign(kb,a+9/kb,rb>rs?rotIn(a):rotOut(a),k,WP_BY_KEY[k].note);
      C.workplaces[k]={x:sp.x,z:sp.z,id:sp.id};
      C.at("marketstall",kb+(rb>rs?-3:3),a-10/kb,rb>rs?rotIn(a):rotOut(a));
    }}; });
  C.sign(rs-ATL_ROAD-2,gIn[0].a0,rotOut(gIn[0].a0),"Guild Street","One shop to every trade the city keeps: the bakers, the smiths, the tailors and the rest, side by side.");
  todo=C.row(todo,rs,-1,gIn[0].a0,gIn[0].a1,10);
  todo=C.row(todo,rs,+1,gOut[0].a0,gOut[0].a1,10);
  todo=C.row(todo,rs,-1,gIn[1].a0,gIn[1].a1,10);
  todo=C.row(todo,rs,+1,gOut[1].a0,gOut[1].a1,10);
  /* the bazaars: the same dressing the old quarters had, strung along their own gaps */
  function bazaar(g,side,name,note,fronts,stalls,over){
    C.sign(C.kerb(rs,side),g.a0,side>0?rotIn(g.a0):rotOut(g.a0),name,note);
    var i=0, items=[];
    for(var k=0;k<14;k++) items.push({arch:fronts[k%fronts.length],s:1,name:null,after:function(sp,a,rb){
      var kb=C.kerb(rs,rb>rs?1:-1);
      C.at(stalls[i%stalls.length],kb+(rb>rs?-2:2),a+7/kb,rb>rs?rotIn(a):rotOut(a)); i++;
      if(over&&i%2) C.at(over[i%over.length],rs,a,rotAlong(a)+Math.PI/2);
    }});
    C.row(items,rs,side,g.a0,g.a1,6);
  }
  bazaar(gIn[2],-1,"The Bazaar","Everything that can be carried, and a good deal that cannot.",["shop","marketawning","shop"],["marketstall","crates","barrel"],["redlanterns","stringlights"]);
  bazaar(gOut[2],+1,"The Bazaar","Everything that can be carried, and a good deal that cannot.",["shop","marketawning"],["marketstall","crates"],["stringlights"]);
  bazaar(gIn[3],-1,"The Lantern Market","Paper lanterns from end to end, and a gate at either end of it.",["machiya","shop","teahouse"],["marketstall","bonsai"],["redlanterns"]);
  bazaar(gOut[3],+1,"The Riad Souk","Blank walls to the street, and gardens behind every one of them.",["riad","marketawning","shop"],["tiledfountain","marketstall","palm"],["stringlights"]);
  bazaar(gIn[4],-1,"The Night Market","It opens at dusk, and it is lit by everything it sells.",["marketawning","shop"],["marketstall","brazier","crates"],["stringlights","redlanterns"]);
  C.at("torii",rs,gIn[3].a0-4/rs,rotAlong(gIn[3].a0)); C.at("paifang",rs,gIn[3].a1+4/rs,rotAlong(gIn[3].a1));
  /* the transport yard: everything the city sells to get about on, each with its price board */
  var ty=gOut[4], rowsY=[["skateboard","Skateboard"],["bicycle","Bicycle"],["horse","Horse"],["car","Motor car"],
    ["truck","Truck"],["bus","Omnibus"],["broomstick","Broomstick"],["flyingcarpet","Flying carpet"],
    ["sleigh","Sleigh"],["firechariot","Chariot of fire"],["hovercar","Hovercar"],["shuttle","Shuttle"],
    ["saucer","Flying saucer"],["unicorn","Unicorn"],["pegasus","Pegasus"],["griffin","Griffin"],
    ["kitsune","Kitsune"],["dragon","Dragon"]];
  C.sign(C.kerb(rs,1),ty.a0,rotIn(ty.a0),"The Transport Yard","Everything the city sells to get about on, from a skateboard to a saucer. The price is on the board beside each. What you buy is yours, and it carries you faster than your own feet.");
  rowsY.forEach(function(row,i){
    var col=i%9, ln=Math.floor(i/9), rr=rs+ATL_ROAD+14+ln*26, a=ty.a0+(10+col*((ty.a1-ty.a0)*rr-20)/9)/rr;
    if(!KIT[row[0]]) return;
    C.at(row[0],rr,a,rotIn(a),null,{s:row[0]==="shuttle"?0.7:(row[0]==="dragon"?0.6:1)});
    var board=C.at("signboard",rr-8,a,rotIn(a),row[1]); if(board){ board.forSale=row[1]; board.sign=row[1]; }
  });
  C.workplace("The Stables",rs,+1,gOut[5].a0+22/rs);
  C.front("garage",rs,+1,gOut[5].a0+60/rs,1.6,"The yard workshop",{sign:"The yard workshop"});
  /* the inns and hotels: the Somnucor Inn, the Tavern's neighbours, and hotel ground to buy */
  C.workplace("The Somnucor Inn",rs,-1,gIn[5].a0+16/rs);
  var hotels=["hotel","motel","hotel","hotel","motel","hotel"], hi=0;
  C.row(hotels.map(function(arch,i){ return {arch:arch,s:1,name:null,after:function(sp,a,rb){
    var side=rb>rs?1:-1, kb=C.kerb(rs,side), name="The Hotels "+(++hi);
    var board=C.at("signboard",kb,a+8/kb,side>0?rotIn(a):rotOut(a),name);
    if(board){ var p={name:name,quarter:"The Hotels",kind:"business",grade:"hotel",price:inBand([60000,140000],i/5),rent:inBand([900,2200],i/5),
      x:sp.x,z:sp.z,homeId:sp.id,archetype:arch}; board.plot=p; board.sign=name; C.plots.push(p); }
  }}; }),rs,+1,gOut[6].a0,gOut[6].a1,14);
  /* Market Row: shop ground for dreamers' own businesses */
  var mr=0;
  [[gIn[6],-1],[gIn[7],-1],[gOut[7],+1],[gIn[8],-1],[gOut[8],+1]].forEach(function(p){
    if(!p[0]) return;
    var items=[]; for(var k=0;k<12;k++) items.push({arch:(k%3===2)?"marketawning":"shop",s:1.2,name:null,after:function(sp,a,rb){
      var side=rb>rs?1:-1, kb=C.kerb(rs,side), name="Market Row "+(++mr);
      var board=C.at("signboard",kb,a+8/kb,side>0?rotIn(a):rotOut(a),name);
      if(board){ var pl={name:name,quarter:"Market Row",kind:"business",grade:"shop",price:9000+((mr*977)%9)*1000,rent:220+((mr*131)%7)*30,
        x:sp.x,z:sp.z,homeId:sp.id,archetype:sp.archetype}; board.plot=pl; board.sign=name; C.plots.push(pl); }
    }});
    C.row(items,rs,p[1],p[0].a0,p[0].a1,8);
  });
  C.sign(rs-ATL_ROAD-2,gIn[6].a0,rotOut(gIn[6].a0),"Market Row","Shop ground to buy or lease, for anybody who means to open a business of their own.");
  /* the rest of the ring: market squares with fountains, braziers and crowds */
  for(var q=9;q<16;q++){
    var g=gIn[q]; if(!g) continue;
    var a=g.mid;
    C.at("tiledfountain",rs-30,a,0,null,{s:1.6}); C.at("marketstall",rs-18,a+12/rs,rotOut(a)); C.at("marketstall",rs-18,a-12/rs,rotOut(a));
    C.at("crowd",rs-40,a+20/rs,0); C.at("stringlights",rs,a,rotAlong(a)+Math.PI/2); C.at("brazier",rs-24,a+26/rs,0);
    var go=gOut[q]; if(go){ C.at("marketawning",rs+24,go.mid,rotIn(go.mid)); C.at("marketstall",rs+18,go.mid+14/rs,rotIn(go.mid)); C.at("crowd",rs+40,go.mid,0); }
  }
}

/* ---------------------------------------------------------------- 5 the Commons */
function atlCommons(C){
  var A=1280, B=1420;
  C.sign(1210,0.19+0.1,rotOut(0.29),"The Commons","Where most of the city lives: the old streets and the new flats, the schools, the workshops and the menagerie.");
  var gA_in=atlGaps(A-20,8,6), gA_out=atlGaps(A+20,8,6), gB_in=atlGaps(B-30,16,6), gB_out=atlGaps(B+40,24,6);
  /* the neighbourhoods: every house a plot in the city's books, to buy or to rent */
  var HOODS=NEIGHBOURHOODS.filter(function(N){ return N.grade!=="rooms"&&N.name!=="The Hotels"; });
  var num=0;
  function hood(N,g,side,rs){
    if(!g) return;
    C.sign(C.kerb(rs,side),g.a0,side>0?rotIn(g.a0):rotOut(g.a0),N.name,N.note);
    var items=[], k=0;
    for(var i=0;i<(N.grade==="grand"?8:18);i++) items.push({arch:N.homes[i%N.homes.length],s:(N.grade==="grand"?0.6:1),name:null,after:function(sp,a,rb){
      var sd=rb>rs?1:-1, kb=C.kerb(rs,sd), t=(k%7)/6, name=N.name+" "+(++num);
      var board=C.at("signboard",kb,a+7/kb,sd>0?rotIn(a):rotOut(a),name);
      if(board){ var p={name:name,quarter:N.name,kind:N.kind,grade:N.grade,price:inBand(N.price,t),rent:inBand(N.rent,t),
        x:sp.x,z:sp.z,homeId:sp.id,archetype:sp.archetype}; board.plot=p; board.sign=name; C.plots.push(p); }
      if(k%3===0&&N.dress&&N.dress.length){ var dk=N.dress[k%N.dress.length]; if(KIT[dk]) C.at(dk,kb+sd*3,a-6/kb,sd>0?rotIn(a):rotOut(a)); }
      k++;
    }});
    C.row(items,rs,side,g.a0,g.a1,N.grade==="grand"?16:9);
  }
  /* street A, both sides, gap by gap */
  var order=["The Old Quarter","The Terraces","Lantern Street","The Riad Quarter","Bellwater","The Old Quarter","The Terraces","Bellwater",
             "Lantern Street","The Old Quarter","The Terraces","The Riad Quarter","Bellwater","The Old Quarter","The Terraces","Lantern Street"];
  var byName={}; HOODS.forEach(function(N){ byName[N.name]=N; });
  order.forEach(function(nm,i){
    var N=byName[nm]; if(!N) return;
    if(i%2===0){ hood(N,gA_in[i],-1,A); hood(N,gA_out[i],+1,A); return; }
    /* every other stretch of street A is the neighbourhood's own green: allotments, a well, a bench, trees */
    var g=gA_in[i]; if(!g) return;
    C.sign(C.kerb(A,-1),g.a0,rotOut(g.a0),N.name+" Green","The neighbourhood's own green, kept by the people who live round it.");
    for(var k=0;k<5;k++){ var a=g.a0+(20+k*((g.a1-g.a0)*(A-30)-40)/4)/(A-30);
      C.at(k%2?"tree":"flowerbed",A-30,a,rotAlong(a)); if(k===2){ C.at("well",A-48,a,0); C.at("bench",A-20,a,rotOut(a)); C.at("human",A-40,a+6/A,0); } }
    var go=gA_out[i]; if(go){ C.at("fountain",A+34,go.mid,0); C.at("tree",A+24,go.mid+30/A,0); C.at("tree",A+24,go.mid-30/A,0); C.at("bench",A+22,go.mid,rotIn(go.mid)); }
  });
  /* street B, inside: Northgate's great houses on four gaps, playgrounds and parks elsewhere */
  [0,4,8,12].forEach(function(i){ if(byName.Northgate) hood(byName.Northgate,gB_in[i],-1,B); });
  [2,6,10,14].forEach(function(i){
    var g=gB_in[i]; if(!g) return;
    C.at("playground",B-24,g.mid,rotOut(g.mid)); C.at("fountain",B-24,g.mid+30/B,0); C.at("bench",B-14,g.mid-14/B,rotOut(g.mid));
    C.at("tree",B-30,g.mid-30/B,0); C.at("tree",B-34,g.mid+48/B,0); C.at("child",B-20,g.mid+6/B,0); C.at("child",B-26,g.mid-4/B,0);
  });
  /* street B, outside: the school, the workshops, the depot, the Rim works, the menagerie */
  var WK=["The City School","The Transport Depot","The Joinery","The Masons' Yard","The Glassworks","The Engine House","The Waterworks",
          "The City Depot","The Wheelwright's","The Reactor","The Biodome"];
  WK.forEach(function(k,i){ var g=gB_out[i]; if(g) C.workplace(k,B,+1,g.mid); });
  var rim=gB_out[9]; if(rim){ C.at("spaceport",B+ATL_ROAD+30,rim.a1-20/B,rotIn(rim.a1),"The Rim Port"); }
  var wt=gB_out[6]; if(wt){ C.at("watertower",B+ATL_ROAD+14,wt.mid+36/B,0); }
  /* the menagerie: kept, not caged */
  var mg=gB_out[12]||gB_out[11];
  if(mg){
    var mr=B+ATL_ROAD+40;
    C.sign(C.kerb(B,1),mg.a0,rotIn(mg.a0),"The Menagerie","Kept, not caged. Some of them were dreamt only once.");
    C.workplace("The Menagerie Lodge",B,+1,mg.a0+14/B);
    ["unicorn","griffin","phoenix","kitsune","pegasus","centaur","bear","stag","owl","butterflies"].forEach(function(k,i){
      if(KIT[k]||(typeof CREATURE!=="undefined"&&CREATURE[k])) C.at(k,mr+(i%3)*12,mg.a0+(50+i*14)/mr,cityRand()*6.28);
    });
    ["pond","fairyring","giantmushroom","hollowtree","tree","tree","reeds"].forEach(function(k,i){ C.at(k,mr+18+(i%2)*14,mg.a0+(60+i*20)/mr,cityRand()*6.28); });
  }
  /* a second, smaller school, for the far side of the ring */
  var s2=gB_out[14]; if(s2) C.front("school",B,+1,s2.mid,.7,"The Commons School",{sign:"The Commons School"});
}

/* ---------------------------------------------------------------- 6 the Warrens */
function atlWarrens(C){
  var rs=1620;
  C.sign(1530,0.19+0.1,rotOut(0.29),"The Warrens","What the city would rather you did not see. It houses people all the same — and the Gaol stands here, with its yard.");
  var gIn=atlGaps(rs-20,6,6), gOut=atlGaps(rs+20,6,6), num=0;
  var SLUM=NEIGHBOURHOODS.filter(function(N){ return N.grade==="rooms"; });
  function slum(N,g,side){
    if(!g) return;
    C.sign(C.kerb(rs,side),g.a0,side>0?rotIn(g.a0):rotOut(g.a0),N.name,N.note);
    var items=[], k=0;
    for(var i=0;i<16;i++) items.push({arch:N.homes[i%N.homes.length],s:1,name:null,after:function(sp,a,rb){
      var sd=rb>rs?1:-1, kb=C.kerb(rs,sd), t=(k%5)/4, name=N.name+" "+(++num);
      var board=C.at("signboard",kb,a+5/kb,sd>0?rotIn(a):rotOut(a),name);
      if(board){ var p={name:name,quarter:N.name,kind:N.kind,grade:N.grade,price:inBand(N.price,t),rent:inBand(N.rent,t),
        x:sp.x,z:sp.z,homeId:sp.id,archetype:sp.archetype}; board.plot=p; board.sign=name; C.plots.push(p); }
      var dk=N.dress[k%N.dress.length]; if(k%2===0&&KIT[dk]) C.at(dk,kb+sd*2,a-5/kb,0);
      k++;
    }});
    C.row(items,rs,side,g.a0,g.a1,5);
  }
  for(var i=0;i<16;i++){
    if(i===4||i===5) continue;             /* the Gaol and its yard */
    var N=SLUM[i%SLUM.length];
    slum(N,gIn[i],-1); if(i%2===0) slum(N,gOut[i],+1);
    else if(gOut[i]){ var a=gOut[i].mid; C.at("firebarrel",rs+20,a,0); C.at("washing",rs+26,a+10/rs,rotIn(a)); C.at("scrapheap",rs+34,a-12/rs,0); C.at("crowd",rs+30,a+24/rs,0); C.at("dog",rs+24,a-26/rs,0); }
  }
  /* the Gaol: the building on the street, the walled yard behind it */
  var g=gOut[4], gaA=g.mid;
  var f=C.workplace("The Gaol",rs,+1,gaA);
  var yr0=f.rb+f.depth/2+2, yr1=Math.min(yr0+52,atlRing("warrens").E-6), half=48;
  var Y={a:gaA,r0:yr0,r1:yr1,half:half};
  /* walls: two long runs across, two short runs outward */
  for(var t=-half;t<=half;t+=20){
    C.at("prisonwall",yr1,gaA+t/yr1,rotAlong(gaA)+Math.PI/2);
    if(Math.abs(t)>12) C.at("prisonwall",yr0,gaA+t/yr0,rotAlong(gaA)+Math.PI/2);
  }
  [-1,1].forEach(function(sd){
    for(var rr=yr0+10;rr<yr1;rr+=20) C.at("prisonwall",rr,gaA+sd*half/rr,rotAlong(gaA));
    C.at("watchtower",yr0,gaA+sd*(half+3)/yr0,rotOut(gaA)); C.at("watchtower",yr1,gaA+sd*(half+3)/yr1,rotIn(gaA));
  });
  /* in the yard: the workbenches a sentence is worked off at */
  var benchR=(yr0+yr1)/2;
  ["crates","barrel","scrapheap","crates","barrel","crates"].forEach(function(k,i){ C.at(k,benchR+((i%2)?6:-6),gaA+(i-2.5)*9/benchR,0); });
  C.at("brazier",benchR+18,gaA,0); C.at("brazier",benchR-18,gaA,0);
  var ys=C.sign(yr0+6,gaA+14/yr0,rotOut(gaA),"The Gaol Yard","Those held by Somnucor work their hours off here. Stand at the benches, and each hour worked counts.");
  store.gaolYard={x:C.h.x+Math.cos(gaA)*benchR,z:C.h.z+Math.sin(gaA)*benchR,a:gaA,r0:yr0,r1:yr1,half:half,
    cx:C.h.x,cz:C.h.z};
  /* the poorhouse soup queue and the rest of the street's dressing */
  var sp=gIn[5]; if(sp){ C.front("tenementblock",rs,-1,sp.mid,1,"The Poorhouse",{sign:"The Poorhouse"}); C.at("crowd",rs-12,sp.mid+14/rs,0); C.at("firebarrel",rs-14,sp.mid-10/rs,0); }
  atlWarrensDress(C,rs,gIn,gOut);
}

/* the Warrens lived in: what gathers in streets nobody sweeps. Clutter at the
   kerbs, rags strung between posts, puddles, pumps where water is fetched,
   shanties and lean-tos in every back lot, fire barrels with people round
   them, dim old lamps, and a soup kitchen or two. Laid by a fixed hand, so it
   is the same Warrens on every dreamer's device. */
function atlWarrensDress(C,rs,gIn,gOut){
  /* its own run of names, so nothing already in the city is renumbered and
     every change the keeper has made still lands on the thing it was made to */
  var keepSeq=C.seq, keepPre=C.pre; C.pre="sw"; C.seq=0;
  try{ atlWarrensDressing(C,rs,gIn,gOut); } finally { C.pre=keepPre; C.seq=keepSeq; }
}
function atlWarrensDressing(C,rs,gIn,gOut){
  var W=atlRing("warrens"), clutter=["crates","barrel","pallets","sacks","rubble","brokencart","scrapheap","trashcan","crates","puddle"];
  var seq=0; function pick(list){ seq++; return list[(seq*7+Math.floor(seq/3))%list.length]; }
  /* clear of the stairways, and of every house, wall and sign already standing */
  var stand=store.objects.filter(function(o){ if(o.realm!==C.r.id) return false; var dx=o.x-C.h.x, dz=o.z-C.h.z, rr=Math.sqrt(dx*dx+dz*dz); return rr>W.S-30&&rr<W.E+30; })
    .map(function(o){ var d=KIT[o.archetype]; var s=(o.attrs&&o.attrs.s)||1; return {x:o.x,z:o.z,r:d?Math.max(d.size[0],d.size[2])*s*0.5:2}; });
  function free(rr,a,r){
    r=r||3;
    if(typeof atlClearAt==="function"&&!atlClearAt(rr,a,r,2)) return false;
    var x=C.h.x+Math.cos(a)*rr, z=C.h.z+Math.sin(a)*rr;
    for(var i=0;i<stand.length;i++){ var q=stand[i], dx=q.x-x, dz=q.z-z, m=q.r+r+1; if(dx*dx+dz*dz<m*m) return false; }
    stand.push({x:x,z:z,r:r});
    return true;
  }
  /* along both kerbs of the Warrens street, all the way round */
  var circ=Math.PI*2*rs;
  for(var d=0;d<circ;d+=17){
    var a=d/rs, side=(Math.floor(d/17)%2)?1:-1, kb=C.kerb(rs,side)+side*1.5;
    var Y=store.gaolYard; if(Y&&Math.abs(((a-Y.a+Math.PI*3)%(Math.PI*2))-Math.PI)<0.07) continue;   // not across the Gaol's front
    if(!free(kb,a,2.5)) continue;
    var k=pick(clutter); if(KIT[k]) C.at(k,kb,a,(seq*1.3)%6.28);
    if(seq%5===0&&KIT.dimlamp) C.at("dimlamp",C.kerb(rs,-side)-side*0.8,a+4/rs,side>0?rotOut(a):rotIn(a));
    if(seq%9===0&&KIT.ragline) C.at("ragline",rs,a+8/rs,rotAlong(a));                       // strung across the street
  }
  /* where the city never built, the poor built for themselves: the street is
     lined end to end with shacks, boarded huts, lean-tos and the odd crumbling
     tenement, every one facing the street */
  var front=["boardedshack","shanty","boardedshack","leanto","shanty","boardedshack","tenementblock","shanty"];
  for(var fd=4;fd<circ;fd+=9){
    var fa=fd/rs;
    [-1,1].forEach(function(sd){
      var hut=front[(Math.floor(fd/9)*3+(sd>0?1:0))%front.length];
      var dep=KIT[hut]?KIT[hut].size[2]:5, wid=KIT[hut]?KIT[hut].size[0]:5;
      var rr=rs+sd*(ATL_ROAD+ATL_SETBACK+dep/2);
      if(!free(rr,fa,Math.max(dep,wid)*0.5)) return;
      C.at(hut,rr,fa,sd>0?rotIn(fa):rotOut(fa));
    });
  }
  /* the back lots: shanty towns between the rows and the rim */
  var inner=W.S+ATL_STAIR_RUN+14, outer=W.E-10;
  var huts=["shanty","leanto","boardedshack","tent","shanty","boardedshack","leanto","shanty"];
  for(var bd=0;bd<circ;bd+=10){
    var ba=bd/rs;
    [inner+8,inner+20,outer-20,outer-8].forEach(function(rr,j){
      var a=ba+((j*5+Math.floor(bd/10))%3)*3/rr;
      var hut=huts[(Math.floor(bd/10)+j*3)%huts.length];
      if(!free(rr,a,3.6)) return;
      C.at(hut,rr,a,(j<2?rotOut(a):rotIn(a))+((Math.floor(bd/10)+j)%3-1)*0.3);
      var cl=clutter[(Math.floor(bd/10)*5+j)%clutter.length], cr=rr+(j<2?5:-5);
      if((Math.floor(bd/10)+j)%2===0&&KIT[cl]&&free(cr,a+3/rr,1.4)) C.at(cl,cr,a+3/rr,j);
    });
  }
  for(var i=0;i<72;i++){
    var a0=i/72*Math.PI*2+0.011;
    var Y2=store.gaolYard; if(Y2&&Math.abs(((a0-Y2.a+Math.PI*3)%(Math.PI*2))-Math.PI)<0.09) continue;
    [inner+6, outer-8].forEach(function(rr,j){
      var a=a0+j*0.006;
      if(!free(rr,a,6)) return;
      var hut=["shanty","leanto","boardedshack","tent","shanty","leanto"][(i+j)%6];
      if(KIT[hut]) C.at(hut,rr,a,(j?rotIn(a):rotOut(a))+((i%3)-1)*0.25);
      var near=rr+(j?-7:7);
      if(i%3===0&&KIT.firebarrel&&free(near,a+5/rr,1.5)){ C.at("firebarrel",near,a+5/rr,0); if(i%6===0&&KIT.crowd) C.at("crowd",near+(j?-3:3),a+5/rr,0); }
      if(i%4===1&&KIT.ragline&&free(near,a-6/rr,2)) C.at("ragline",near,a-6/rr,rotAlong(a));
      if(i%5===2&&KIT.handpump&&free(near,a,1.5)) C.at("handpump",near,a,j?rotIn(a):rotOut(a));
      if(i%7===3&&KIT.cat&&free(near,a+9/rr,1)) C.at("cat",near,a+9/rr,i);
      if(i%8===5&&KIT.rat) C.at("rat",near,a-3/rr,i);
    });
  }
  /* two soup kitchens, on the far sides of the ring from the Poorhouse */
  [Math.PI*0.62,Math.PI*1.38].forEach(function(da){
    var base=(gIn[5]?gIn[5].mid:0)+da;
    if(KIT.soupkitchen&&free(rs-24,base,6)){ C.at("soupkitchen",rs-24,base,rotOut(base),"Soup kitchen",null,{sign:"Soup kitchen"});
      if(KIT.crowd) C.at("crowd",rs-14,base+8/rs,0); }
  });
}

/* ---------------------------------------------------------------- 7 the Harvest Ring */
function atlHarvest(C){
  var rs=1790, R=atlRing("harvest");
  C.sign(1750,0.19+0.1,rotOut(0.29),"The Harvest Ring","Stone, ore and gems from the pits; timber from the Long Stand; grain, milk and wool from the Long Fields; and the docks on the Outer Moat.");
  var G=atlGaps(1920,60,8);
  /* the quarry */
  var q=G[0], qa=q.mid, qr=1930;
  C.sign(C.kerb(rs,1),q.a0,rotIn(q.a0),"The Quarry","Stone, ore, coal and clay. A quarryman's shift brings up what the city builds with. The pit foreman counts the gemstones.");
  C.workplace("The Pit Office",rs,+1,q.a0+16/rs);
  C.at("crater",qr,qa,0,"The seam",{s:2.4});
  for(var i=0;i<16;i++){ var a=qa+((i/16)-0.5)*120/qr, rr=qr+((i*37)%70)-35; C.at("rock",rr,a,i); }
  C.at("crane",qr+60,qa+30/qr,rotIn(qa)); ["crates","barrel","scrapheap","brazier","cart"].forEach(function(k,j){ C.at(k,rs+30,qa+(j-2)*14/rs,rotIn(qa)); });
  /* the gem pits */
  var gp=G[1], ga=gp.mid;
  C.sign(C.kerb(rs,1),gp.a0,rotIn(gp.a0),"The Gem Pits","Where the miners go down. What glitters in the dark down there is counted twice.");
  C.workplace("The Mine Head",rs,+1,gp.a0+16/rs);
  C.at("mineshaft",1930,ga,rotIn(ga),"The shaft");
  for(var c=0;c<18;c++){ var ca=ga+((c/18)-0.5)*140/1960; C.at("crystal",1960+((c*29)%60)-30,ca,c,null,{s:1+(c%3)*0.4}); }
  /* the Long Stand */
  [2,3,4].forEach(function(gi,j){
    var g=G[gi]; if(!g) return;
    if(j===0){ C.sign(C.kerb(rs,1),g.a0,rotIn(g.a0),"The Long Stand","Timber and charcoal. A forester's shift fells it and sends it down to the sawyers."); }
    for(var t=0;t<46;t++){ var ta=g.a0+((t*0.618)%1)*(g.a1-g.a0), tr=1830+((t*53)%230); C.at(t%3===0?"pine":"tree",tr,ta,ta); }
  });
  C.workplace("The Sawmill",rs,+1,G[2].a0+20/rs);
  C.workplace("The Forester's Lodge",rs,+1,G[3].a0+16/rs);
  C.workplace("The Charcoal Burner's Hut",rs,+1,G[4].a0+14/rs);
  for(var d2=0;d2<6;d2++) C.at("deadtree",2060,G[4].mid+(d2-3)*14/2060,d2*0.7);
  /* the Long Fields */
  [5,6,7,8].forEach(function(gi,j){
    var g=G[gi]; if(!g) return;
    if(j===0) C.sign(C.kerb(rs,1),g.a0,rotIn(g.a0),"The Long Fields","Farms, barns and the road out. The city has to eat.");
    for(var rr=1850;rr<2060;rr+=26){ for(var k=0;k<5;k++){ C.at("haybale",rr,g.a0+(30+k*((g.a1-g.a0)*rr-60)/5)/rr,k); } }
    C.at("scarecrow",1950,g.mid,0); C.at("silo",1900,g.mid+40/1900,0);
    ["cow","cow","sheep","sheep","chicken","pig","goat","horse"].forEach(function(k,a){ C.at(k,1990+(a%3)*14,g.mid+(a-4)*12/1990,a); });
  });
  C.workplace("The Farmhouse",rs,+1,G[5].a0+16/rs);
  C.workplace("The Dairy",rs,+1,G[6].a0+18/rs);
  C.workplace("The Mill",rs,+1,G[7].a0+14/rs);
  C.workplace("The Sheepfold",rs,+1,G[8].a0+16/rs);
  /* orchards */
  [9,10].forEach(function(gi){ var g=G[gi]; if(!g) return;
    for(var rr=1850;rr<2060;rr+=18) for(var k=0;k<8;k++) C.at("tree",rr,g.a0+(12+k*((g.a1-g.a0)*rr-24)/8)/rr,rr+k,null,{s:0.7}); });
  C.sign(C.kerb(rs,1),G[9].a0,rotIn(G[9].a0),"The Orchards","Apples, pears and plums, and whatever else the dreamers planted.");
  /* the docks on the Outer Moat */
  var dk=G[12]||G[11];
  C.sign(C.kerb(rs,1),dk.a0,rotIn(dk.a0),"The Docks","Cranes, sheds and a tide. Everything the city imports comes over this rim.");
  C.workplace("The Dock Office",rs,+1,dk.a0+20/rs);
  C.workplace("The Fish Quay",rs,+1,dk.a0+70/rs);
  C.workplace("The Harbourmaster's House",rs,-1,dk.a0+30/rs);
  var lf=G[13]||dk; C.workplace("The Ferry Light",rs,+1,lf.a0+14/rs);
  for(var cr=0;cr<4;cr++) C.at("crane",R.E-10,dk.a0+(40+cr*40)/R.E,rotOut(dk.a0));
  /* ships riding the moat below the rim */
  var moat=(R.E+atlRing("wilds").S)/2;
  ["ship","fishingboat","ship","boat","fishingboat","soulferry"].forEach(function(k,i){
    var a=dk.a0+(30+i*34)/moat; C.at(k,moat,a,rotAlong(a),null,null,{y:1.8});
  });
}

/* ---------------------------------------------------------------- 8 the Nightmare Wilds */
function atlWilds(C){
  var W=atlRing("wilds"), inner=W.S+20;
  var pieces=["deadtree","deadtree","deadtree","giantmushroom","monolith","rift","voidshards","shardfield","mirrormaze","floatingisland",
              "impossiblestair","moonpool","bonegate","collapsedtower","ruin","wisps","wisps","standingstones"];
  for(var i=0;i<520;i++){
    var a=cityRand()*Math.PI*2, rr=inner+30+cityRand()*(W.E-inner-120);
    var k=pieces[i%pieces.length]; if(!KIT[k]) continue;
    if(!atlClearAt(rr,a,6,4)) continue;
    C.at(k,rr,a,cityRand()*6.28);
  }
  /* a warning at the foot of every stairway down */
  ATL_STAIRS.forEach(function(s){
    if(!s.main) return;
    C.sign(W.S+ATL_STAIR_RUN+6,s.a+12/(W.S+50),rotIn(s.a),"The Nightmare Wilds","What we dreamt in the dark lives out here. By day they only watch. After dark, the ones you have dreamt will come for you — face them the way the dream ended, or any way you choose. If they take you, you wake at your own door.");
  });
  /* the ones who live here */
  var kinds=(typeof CREATURE!=="undefined")?Object.keys(CREATURE).filter(function(k){ return CREATURE[k].night; }):[];
  store.wildsNightmares=[];
  for(var n=0;n<72&&kinds.length;n++){
    var ka=kinds[n%kinds.length], na=(n/72)*Math.PI*2+cityRand()*0.05, nr=inner+80+cityRand()*(W.E-inner-240);
    var sp=C.at(ka,nr,na,cityRand()*6.28,null,null,{wild:true,solid:false});
    if(sp) store.wildsNightmares.push({id:sp.id,kind:ka,home:{x:sp.x,z:sp.z}});
  }
}

/* ---------------------------------------------------------------- the stairways' own dressing */
function atlStairDress(C){
  var R=ATL_RINGS;
  for(var i=0;i<R.length-1;i++){
    var up=R[i], dn=R[i+1];
    ATL_STAIRS.forEach(function(s){
      if(s.main){
        C.at("ringarch",up.E-8,s.a,rotOut(s.a));
        var foot=dn.S+ATL_STAIR_RUN+4;
        C.at("bannerpole",foot,s.a+(s.half+3)/foot,0); C.at("bannerpole",foot,s.a-(s.half+3)/foot,0);
      } else {
        C.at("crystalbrazier",up.E-5,s.a+(s.half+2)/up.E,0); C.at("crystalbrazier",up.E-5,s.a-(s.half+2)/up.E,0);
      }
      /* crystal spires stand guard where every great stairway lands */
      if(s.main&&dn.k!=="wilds"){ var land=dn.S+ATL_STAIR_RUN+18;
        C.at("crystalspire",land,s.a+(s.half+9)/land,0,null,{s:0.45}); C.at("crystalspire",land,s.a-(s.half+9)/land,0,null,{s:0.45}); }
    });
  }
}

/* ---------------------------------------------------------------- keeping it fast */
/* nothing far off is drawn: small things go first, the great buildings last,
   so the skyline stands while the street furniture of the far rings rests */
var cullAt=0;
var cullLast=null;
function cityLifeTick(dt){
  var Pq=camera.position, jumped=!cullLast||Math.abs(cullLast.x-Pq.x)+Math.abs(cullLast.z-Pq.z)>40||cullLast.here!==(store.here||0)||cullLast.inside!==!!store.inside;
  cullAt-=dt; if(cullAt>0&&!jumped) return; cullAt=0.35;
  cullLast={x:Pq.x,z:Pq.z,here:store.here||0,inside:!!store.inside};
  if(!ATLC) return;
  var P=camera.position, here=store.here||0;
  var r=somnucorRealm(); if(!r) return;
  var inCity=(here===r.id)&&!store.inside;
  store.objects.forEach(function(o){
    if(!o.city||o.realm!==r.id) return;
    var g=meshes[o.id]; if(!g) return;
    if(g.userData.nmGone) return;
    if(!inCity){ if(g.userData.culled!==true){ g.visible=false; g.userData.culled=true; } return; }
    var d=KIT[o.archetype], big=d?Math.max(d.size[0],d.size[1],d.size[2])*((o.attrs&&o.attrs.s)||1):5;
    var alive=(d&&d.cat==="being")||(typeof CREATURE!=="undefined"&&CREATURE[o.archetype]);
    var reach=d&&d.cat==="structure"?(big>40?2600:(big>18?1200:700)):(alive?(big>12?420:200):(big>12?700:360));
    var dx=o.x-P.x, dz=o.z-P.z, show=dx*dx+dz*dz<reach*reach;
    /* a figure whose hour has them indoors or away stays unseen even when near */
    var ch=(d&&d.cat==="being"&&typeof charOf==="function")?charOf(o):null;
    var want=show&&!(ch&&ch.visible===false);
    g.userData.culled=!show;
    if(g.visible!==want) g.visible=want;
  });
}
