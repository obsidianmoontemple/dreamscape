/* SomnuMatrix — transit.js
   getting about Somnucor.
     - the Underground: a station on every ring, two on the wide ones, one
       gold a ride from any station to any other
     - the streets alive with traffic: trams on their rails, omnibuses,
       hansom cabs, carriages and motor cars going round the rings, the trams
       stopping at their stops
     - a yard full of different things to own and ride — and when you ride
       one, you are seen on it, by you and by every dreamer near you
   loaded as a plain script; shares scope with the other files */
"use strict";

/* ================================================================ the models */
var TR_BRASS=0xC9A050, TR_IRON=0x2E3236, TR_WOOD=0x6A4A30, TR_LEATHER=0x4A2E22;
function trWheels(x,z,r,gap,col){ return {g:"cyl",s:[r,r,.18,14],p:[-gap/2,r,z],r:[0,0,1.5708],c:col||"dark",rep:[2,gap,0,0]}; }
S("coupe","vehicle",[1.8,1.3,4.2],[
  {g:"box",s:[1.8,.62,4.2],p:[0,.6,0],c:"paint"},{g:"box",s:[1.6,.5,1.8],p:[0,1.12,-.35],c:"glass"},
  {g:"box",s:[1.62,.06,1.85],p:[0,1.38,-.35],c:"paint"},
  trWheels(0,1.35,.32,1.8),trWheels(0,-1.35,.32,1.8),
  {g:"box",s:[.3,.12,.05],p:[-.6,.7,2.11],c:0xFFF4D0,glow:1,rep:[2,1.2,0,0]}
],["coupe","two door car"]);
S("roadster","vehicle",[1.8,1.1,4],[
  {g:"box",s:[1.8,.55,4],p:[0,.55,0],c:"paint"},{g:"box",s:[1.6,.35,.08],p:[0,1,.2],r:[-.4,0,0],c:"glass"},
  {g:"box",s:[1.4,.3,1.2],p:[0,.9,-.6],c:TR_LEATHER},
  trWheels(0,1.3,.33,1.8),trWheels(0,-1.3,.33,1.8)
],["roadster","open top car","convertible"]);
S("sportscar","vehicle",[1.9,1.1,4.4],[
  {g:"box",s:[1.9,.5,4.4],p:[0,.5,0],c:"paint"},{g:"box",s:[1.6,.42,1.6],p:[0,.95,-.3],r:[.08,0,0],c:"glass"},
  {g:"box",s:[1.9,.06,.4],p:[0,.85,-2.1],c:"dark"},
  trWheels(0,1.45,.34,1.9),trWheels(0,-1.45,.34,1.9)
],["sports car","racing car","race car"]);
S("limousine","vehicle",[2,1.5,6.6],[
  {g:"box",s:[2,.7,6.6],p:[0,.65,0],c:0x16171C},{g:"box",s:[1.8,.6,4.4],p:[0,1.3,-.3],c:"glass"},
  {g:"box",s:[1.82,.06,4.45],p:[0,1.62,-.3],c:0x16171C},
  trWheels(0,2.3,.34,2),trWheels(0,-2.3,.34,2),
  {g:"box",s:[.3,.12,.05],p:[-.65,.75,3.31],c:0xFFF4D0,glow:1,rep:[2,1.3,0,0]}
],["limousine","limo","stretch car"]);
S("taxicab","vehicle",[1.9,1.7,4.5],[
  {g:"box",s:[1.9,.75,4.5],p:[0,.65,0],c:0xE8C23A},{g:"box",s:[1.72,.6,2.2],p:[0,1.3,-.2],c:"glass"},
  {g:"box",s:[1.74,.06,2.25],p:[0,1.62,-.2],c:0xE8C23A},{g:"box",s:[.6,.22,.3],p:[0,1.76,-.2],c:0xFFF4D0,glow:1},
  {g:"box",s:[1.92,.12,4.52],p:[0,.85,0],c:0x16171C},
  trWheels(0,1.5,.33,1.9),trWheels(0,-1.5,.33,1.9)
],["taxi","taxicab","cab"]);
S("vintagecar","vehicle",[1.9,1.9,4.4],[
  {g:"box",s:[1.5,.7,4.2],p:[0,.85,0],c:"paint"},{g:"box",s:[1.5,.8,1.8],p:[0,1.55,-.6],c:0x1A1A1E},
  {g:"box",s:[1.4,.6,.06],p:[0,1.5,.32],c:"glass"},
  {g:"box",s:[1.9,.08,1],p:[0,.6,1.8],c:0x1A1A1E},{g:"box",s:[1.9,.08,1],p:[0,.6,-1.8],c:0x1A1A1E},
  trWheels(0,1.5,.42,1.8,0x1A1A1E),trWheels(0,-1.5,.42,1.8,0x1A1A1E),
  {g:"cyl",s:[.18,.18,.12,12],p:[-.55,1.05,2.12],r:[1.5708,0,0],c:0xFFF4D0,glow:1,rep:[2,1.1,0,0]}
],["vintage car","old car","antique car","model t"]);
S("van","vehicle",[2,2.2,5],[
  {g:"box",s:[2,1.9,4],p:[0,1.25,-.4],c:"paint"},{g:"box",s:[2,1.2,1.1],p:[0,.95,2.05],c:"paint"},
  {g:"box",s:[1.8,.6,.06],p:[0,1.75,2.6],r:[-.3,0,0],c:"glass"},
  trWheels(0,1.7,.36,2),trWheels(0,-1.7,.36,2)
],["van","delivery van"]);
S("motorbike","vehicle",[.7,1.2,2.1],[
  {g:"tor",s:[.32,.08,8,16],p:[0,.36,.75],r:[0,1.5708,0],c:"dark"},{g:"tor",s:[.32,.08,8,16],p:[0,.36,-.75],r:[0,1.5708,0],c:"dark"},
  {g:"box",s:[.34,.36,.8],p:[0,.6,.05],c:"paint"},{g:"box",s:[.3,.12,.7],p:[0,.86,-.35],c:TR_LEATHER},
  {g:"box",s:[.66,.05,.05],p:[0,1.08,.6],c:0x9A9EA4},{g:"cyl",s:[.04,.04,.6,6],p:[0,.8,.65],r:[.4,0,0],c:0x9A9EA4},
  {g:"sph",s:[.1,8,6],p:[0,.92,.86],c:0xFFF4D0,glow:1}
],["motorbike","motorcycle","motor bike"]);
S("scooter","vehicle",[.6,1.2,1.6],[
  {g:"cyl",s:[.2,.2,.12,12],p:[0,.2,.6],r:[0,0,1.5708],c:"dark"},{g:"cyl",s:[.2,.2,.12,12],p:[0,.2,-.6],r:[0,0,1.5708],c:"dark"},
  {g:"box",s:[.4,.12,1],p:[0,.3,-.05],c:"paint"},{g:"box",s:[.36,.6,.2],p:[0,.6,.55],c:"paint"},
  {g:"box",s:[.3,.12,.5],p:[0,.72,-.35],c:TR_LEATHER},{g:"box",s:[.55,.04,.04],p:[0,1.1,.6],c:0x9A9EA4}
],["scooter","moped","vespa"]);
S("tricycle","vehicle",[.9,1.1,1.6],[
  {g:"tor",s:[.36,.04],p:[0,.38,.55],r:[0,1.5708,0],c:"dark"},
  {g:"tor",s:[.24,.04],p:[-.38,.26,-.5],r:[0,1.5708,0],c:"dark"},{g:"tor",s:[.24,.04],p:[.38,.26,-.5],r:[0,1.5708,0],c:"dark"},
  {g:"box",s:[.05,.05,1.1],p:[0,.5,0],c:"paint"},{g:"box",s:[.8,.05,.05],p:[0,.26,-.5],c:"paint"},
  {g:"box",s:[.5,.05,.05],p:[0,.98,.5],c:"metal"},{g:"box",s:[.6,.3,.4],p:[0,.5,-.55],c:TR_WOOD}
],["tricycle","trike"]);
S("tandem","vehicle",[.5,1.1,2.6],[
  {g:"tor",s:[.33,.04],p:[0,.35,1.05],r:[0,1.5708,0],c:"dark"},{g:"tor",s:[.33,.04],p:[0,.35,-1.05],r:[0,1.5708,0],c:"dark"},
  {g:"box",s:[.05,.05,2.1],p:[0,.6,0],c:"paint"},{g:"box",s:[.05,.5,.05],p:[0,.75,1],c:"metal"},
  {g:"box",s:[.44,.05,.05],p:[0,1,1],c:"metal"},{g:"box",s:[.2,.06,.3],p:[0,.92,.2],c:TR_LEATHER},{g:"box",s:[.2,.06,.3],p:[0,.92,-.7],c:TR_LEATHER}
],["tandem","bicycle built for two"]);
S("carriage","vehicle",[2.2,2.6,6],[
  {g:"box",s:[1.9,1.5,2.4],p:[0,1.55,-1.2],c:"paint"},{g:"box",s:[2,.12,2.6],p:[0,2.36,-1.2],c:0x1A1A1E},
  {g:"box",s:[.9,.6,.04],p:[-.5,1.75,-1.2],r:[0,1.5708,0],c:"glass",rep:[2,1.92,0,0]},
  {g:"cyl",s:[.6,.6,.08,16],p:[-1.05,.6,-2.1],r:[0,0,1.5708],c:TR_WOOD,rep:[2,2.1,0,0]},
  {g:"cyl",s:[.45,.45,.08,16],p:[-1.05,.45,-.1],r:[0,0,1.5708],c:TR_WOOD,rep:[2,2.1,0,0]},
  {g:"box",s:[1.2,.12,.7],p:[0,1.5,.25],c:TR_LEATHER},
  {g:"box",s:[.08,.08,2.2],p:[-.45,.8,1.4],c:TR_WOOD,rep:[2,.9,0,0]},
  {g:"cyl",s:[.06,.06,.3,6],p:[-1,2.5,-.1],c:TR_BRASS,rep:[2,2,0,0]}
],["carriage","coach","stagecoach","horse drawn carriage"]);
S("hansomcab","vehicle",[1.8,2.6,4.6],[
  {g:"box",s:[1.5,1.4,1.4],p:[0,1.5,-.6],c:0x1E2A20},{g:"box",s:[1.6,.1,1.6],p:[0,2.25,-.6],c:0x141414},
  {g:"box",s:[.5,.2,.5],p:[0,2.45,-1.3],c:TR_LEATHER},
  {g:"cyl",s:[.75,.75,.08,16],p:[-.85,.75,-.6],r:[0,0,1.5708],c:TR_WOOD,rep:[2,1.7,0,0]},
  {g:"box",s:[.07,.07,2.4],p:[-.4,.85,1.1],c:TR_WOOD,rep:[2,.8,0,0]}
],["hansom cab","hansom","horse cab"]);
S("omnibus","vehicle",[2.4,3.4,7],[
  {g:"box",s:[2.3,1.8,5.4],p:[0,1.5,-.6],c:0x7A2A26},{g:"box",s:[2.32,.7,5],p:[0,1.75,-.6],c:"glass"},
  {g:"box",s:[2.4,.1,5.6],p:[0,2.45,-.6],c:0x1A1A1E},{g:"box",s:[2.2,.08,4.8],p:[0,3.05,-.6],c:TR_WOOD},
  {g:"cyl",s:[.04,.04,.6,5],p:[-1.05,2.75,-2.8],c:TR_BRASS,rep:[2,2.1,0,0],rep2:[4,0,0,1.5]},
  {g:"box",s:[2.2,.4,.08],p:[0,2.2,2.15],c:0xE8DCC0},
  {g:"cyl",s:[.55,.55,.1,16],p:[-1.2,.55,-2.5],r:[0,0,1.5708],c:TR_WOOD,rep:[2,2.4,0,0]},
  {g:"cyl",s:[.55,.55,.1,16],p:[-1.2,.55,1.1],r:[0,0,1.5708],c:TR_WOOD,rep:[2,2.4,0,0]}
],["omnibus","horse bus","double decker"]);
S("tram","vehicle",[2.6,3.6,12],[
  {g:"box",s:[2.5,2.2,11.4],p:[0,1.55,0],c:0x2E5A4A},{g:"box",s:[2.52,.9,10.6],p:[0,1.95,0],c:"glass"},
  {g:"box",s:[2.6,.25,11.6],p:[0,2.75,0],c:0xE8DCC0},{g:"box",s:[2.4,.25,11],p:[0,2.98,0],c:0x2E5A4A},
  {g:"box",s:[2.52,.14,11.42],p:[0,.95,0],c:TR_BRASS},
  {g:"cyl",s:[.04,.04,1.8,5],p:[0,3.9,0],r:[.9,0,0],c:TR_IRON},{g:"box",s:[.9,.05,.05],p:[0,4.6,-.6],c:TR_IRON},
  {g:"box",s:[1.6,.35,.06],p:[0,2.5,5.73],c:0xE8DCC0},{g:"sph",s:[.15,8,6],p:[0,1.2,5.75],c:0xFFF4D0,glow:1},
  {g:"box",s:[2.2,.4,2.4],p:[0,.3,-3.6],c:TR_IRON},{g:"box",s:[2.2,.4,2.4],p:[0,.3,3.6],c:TR_IRON}
],["tram","streetcar","trolley"]);
S("wagon","vehicle",[2.2,2.4,4.4],[
  {g:"box",s:[2,.6,3.6],p:[0,1.1,-.3],c:TR_WOOD},{g:"cyl",s:[1.05,1.05,3.4,12,1,true,0,3.1416],p:[0,1.4,-.3],r:[1.5708,1.5708,0],c:0xE8E0CC},
  {g:"cyl",s:[.55,.55,.08,14],p:[-1.05,.55,-1.5],r:[0,0,1.5708],c:TR_WOOD,rep:[2,2.1,0,0]},
  {g:"cyl",s:[.55,.55,.08,14],p:[-1.05,.55,.9],r:[0,0,1.5708],c:TR_WOOD,rep:[2,2.1,0,0]}
],["covered wagon","wagon"]);
S("airship","vehicle",[6,8,18],[
  {g:"cyl",s:[3,3,12,20],p:[0,6,0],r:[1.5708,0,0],c:0xB8A880},
  {g:"sph",s:[3,20,14],p:[0,6,6],c:0xB8A880},{g:"sph",s:[3,20,14],p:[0,6,-6],c:0xB8A880},{g:"box",s:[2,1.2,5],p:[0,2.2,0],c:TR_WOOD},
  {g:"box",s:[2.04,.4,4.2],p:[0,2.5,0],c:"glass"},
  {g:"cyl",s:[.03,.03,2.6,4],p:[-.9,3.6,-2],c:TR_IRON,rep:[2,1.8,0,0],rep2:[2,0,0,4]},
  {g:"box",s:[.1,2,2.4],p:[0,6,-8.2],c:0x7A2A26},{g:"box",s:[2.4,.1,2],p:[0,6,-8.2],c:0x7A2A26}
],["airship","zeppelin","dirigible","blimp"]);

/* the Underground's own pieces */
S("subwayentrance","infra",[5,4.4,7],[
  {g:"box",s:[4.6,.3,6.6],p:[0,.15,0],c:0x3A3E46},
  {g:"box",s:[3.2,.4,5.6],p:[0,.12,.3],c:0x0A0B0E},
  {g:"box",s:[.2,1.1,6],p:[-2.2,.85,0],c:0x2A2E36,rep:[2,4.4,0,0]},{g:"box",s:[4.6,1.1,.2],p:[0,.85,-3.1],c:0x2A2E36},
  {g:"box",s:[.08,.08,6],p:[-2.2,1.45,0],c:TR_BRASS,rep:[2,4.4,0,0]},
  {g:"box",s:[2.6,.18,4],p:[0,.0,.6],r:[-.42,0,0],c:0x4A4E58},
  {g:"cyl",s:[.08,.08,3.4,8],p:[-2.2,2.5,2.9],c:TR_IRON,rep:[2,4.4,0,0]},
  {g:"box",s:[4.8,.12,3.4],p:[0,4.2,1.6],r:[-.12,0,0],c:"glass"},
  {g:"cyl",s:[.1,.1,3.8,8],p:[2.9,1.9,3.2],c:TR_IRON},
  {g:"cyl",s:[.55,.55,.14,24],p:[2.9,4,3.2],r:[1.5708,0,0],c:0xC03A2E,glow:1},
  {g:"cyl",s:[.36,.36,.16,24],p:[2.9,4,3.2],r:[1.5708,0,0],c:0xF4F0E6,glow:1},
  {g:"box",s:[1.1,.18,.2],p:[2.9,4,3.2],c:0x1E3A8A,glow:1}
],["underground station","subway station","tube station","metro"],{sign:[0,3,3.25,3.6,.6]});
S("tramstop","infra",[4,3,2],[
  {g:"box",s:[3.8,.12,1.6],p:[0,2.7,0],c:0x2E5A4A},{g:"cyl",s:[.06,.06,2.7,6],p:[-1.8,1.35,-.6],c:TR_IRON,rep:[2,3.6,0,0]},
  {g:"box",s:[3.6,1.8,.06],p:[0,1.6,-.7],c:"glass"},{g:"box",s:[2.6,.1,.5],p:[0,.5,-.4],c:TR_WOOD},
  {g:"cyl",s:[.05,.05,2.6,6],p:[2.2,1.3,.6],c:TR_IRON},{g:"box",s:[.5,.5,.06],p:[2.2,2.5,.6],c:0x2E5A4A}
],["tram stop","bus stop shelter"]);

/* a car's colour: what the dream said, else one of the city's own paints */
var PAINTS=[0x7A2A26,0x1E3A5A,0x2E4A2E,0xE8E4DA,0x16171C,0x8A8E94,0xB8862E,0x4A2A5A,0x5A7A8A,0xC0603A,0x2E5A4A,0xD4C49A];
(function(){
  if(typeof resolveColor!=="function") return;
  var rc=resolveColor;
  resolveColor=function(c,spec){
    if(c==="paint"){
      if(spec&&spec.attrs&&spec.attrs.c!==undefined) return spec.attrs.c;
      if(spec&&spec.id&&typeof hash==="function") return PAINTS[hash(String(spec.id))%PAINTS.length];
    }
    return rc(c,spec);
  };
})();

/* ================================================================ stations */
var TR_RINGS=[["plaza",60],["civic",245],["estates",430],["temples",740],["markets",1080],["commons",1280],["warrens",1620],["harvest",1790]];
var UNDERGROUND=[];       /* {key,name,ring,x,z,a,spec} — the same on every device */
function trStationName(ring,a){
  var R=atlRing(ring), base=R?R.name.replace(/^The /,""):ring;
  if(ring==="plaza") return "Tower Plaza";
  var deg=((Math.atan2(Math.sin(a),Math.cos(a))*180/Math.PI)+360)%360;
  var side=deg<45||deg>=315?"East":deg<135?"South":deg<225?"West":"North";
  return base+" "+side;
}
/* laid with the city, under its own run of names so nothing else is renumbered */
function atlTransit(C){
  var keepSeq=C.seq, keepPre=C.pre; C.pre="su"; C.seq=0;
  try{ atlTransitBuild(C); } finally { C.pre=keepPre; C.seq=keepSeq; }
}
function atlTransitBuild(C){
  UNDERGROUND=[];
  var main=ATL_STAIRS.filter(function(s){ return s.main; });
  /* a clear patch for a station: off the street, between whatever already stands there */
  var stand=store.objects.filter(function(o){ return o.realm===C.r.id&&KIT[o.archetype]&&KIT[o.archetype].cat!=="being"; })
    .map(function(o){ var d=KIT[o.archetype], s=(o.attrs&&o.attrs.s)||1; return {x:o.x,z:o.z,r:Math.max(d.size[0],d.size[2])*s*0.5}; });
  function clear(rr,a,rad){
    if(!atlClearAt(rr,a,rad,3)) return false;
    var x=C.h.x+Math.cos(a)*rr, z=C.h.z+Math.sin(a)*rr;
    for(var i=0;i<stand.length;i++){ var q=stand[i], dx=q.x-x, dz=q.z-z, m=q.r+rad; if(dx*dx+dz*dz<m*m) return false; }
    return true;
  }
  TR_RINGS.forEach(function(rr){
    var ring=rr[0], rs=rr[1];
    var picks=ring==="plaza"?[main[1].a+0.35]:(ring==="civic"?[main[0].a+40/rs]:[main[0].a+40/rs,main[4].a+40/rs]);
    picks.forEach(function(a0){
      var a=a0, r0=ring==="plaza"?rs:rs+(ATL_ROAD+6), side=1, ok=false;
      for(var t=0;t<160&&!ok;t+=4){
        for(var sg=-1;sg<=1&&!ok;sg+=2){
          for(var sd=1;sd>=-1&&!ok;sd-=2){
            var rt=ring==="plaza"?rs:rs+sd*(ATL_ROAD+6), at=a0+sg*t/rs;
            if(clear(rt,at,4.4)){ a=at; r0=rt; side=sd; ok=true; }
          }
        }
      }
      var name=trStationName(ring,a);
      var sp=C.at("subwayentrance",r0,a,ring==="plaza"?rotOut(a):(side>0?rotIn(a):rotOut(a)),name+" Underground",null,{sign:"Underground · "+name,underground:name,ugRing:ring});
      if(sp) stand.push({x:sp.x,z:sp.z,r:4.4});
      if(sp) UNDERGROUND.push({key:name,name:name,ring:ring,x:sp.x,z:sp.z,a:a,spec:sp});
    });
    /* tram stops at the stations' streets, and a timetable board */
    if(ring!=="plaza"&&ring!=="civic"&&ring!=="estates"){
      for(var k=0;k<8;k++){
        var ta=main[k].a+90/rs;
        C.at("tramstop",rs-(ATL_ROAD+3),ta,rotOut(ta),"Tram stop");
      }
    }
  });
  atlHuntersLodge(C,clear);
}

/* the hunters' own lodge, at the edge of the harvest where the Wilds begin */
if(typeof WORKPLACES!=="undefined"&&typeof WP_BY_KEY!=="undefined"&&!WP_BY_KEY["The Hunters' Lodge"]){
  var HUNTLODGE={key:"The Hunters' Lodge",ring:"harvest",arch:"cottage",s:1.7,jobs:[],fit:["noticeboard","workbench","crates","fireplace","bunk"],
    note:"The nightmare hunters. Out past the harvest, into the Wilds, and back with the count."};
  WORKPLACES.push(HUNTLODGE); WP_BY_KEY[HUNTLODGE.key]=HUNTLODGE;
}
function atlHuntersLodge(C,clear){
  var main=ATL_STAIRS.filter(function(s){ return s.main; }), rs=1790;
  var d=kitD("cottage",1.7), rb=rs+(ATL_ROAD+ATL_SETBACK+d/2);
  for(var t=0;t<300;t+=6){
    for(var sg=-1;sg<=1;sg+=2){
      var a=main[2].a+70/rs+sg*t/rs;
      if(clear(rb,a,Math.max(d,kitW("cottage",1.7))*0.6+2)){ C.workplace("The Hunters' Lodge",rs,+1,a); return; }
    }
  }
}

/* ================================================================ riding the Underground */
var ugNear=null, ugCool=0, ugOpen=false;
function ugEl(){
  var el=document.getElementById("ug"); if(el||!document.body) return el;
  var css=document.createElement("style");
  css.textContent="#ug{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:60;display:none;width:min(420px,calc(100vw - 24px));max-height:80vh;overflow:auto;"+
    "background:rgba(8,10,16,.97);border:1px solid #C03A2E;border-radius:4px;padding:14px 16px;font:13px var(--sans);color:var(--bone)}"+
    "#ug .st{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--line,#2A2C34)}"+
    "#ug-ride{position:fixed;inset:0;z-index:70;display:none;background:#05060A;overflow:hidden;font:15px var(--sans);color:#E8E2D2}"+
    "#ug-ride .lt{position:absolute;left:-30%;width:28%;height:3px;background:linear-gradient(90deg,transparent,#FFD890,transparent);animation:ugl .55s linear infinite}"+
    "@keyframes ugl{from{left:-30%}to{left:110%}}"+
    "#ug-ride .win{position:absolute;left:8%;right:8%;top:22%;bottom:30%;border:10px solid #1C2A24;border-radius:18px;box-shadow:inset 0 0 60px #000}"+
    "#ug-ride .say{position:absolute;left:0;right:0;bottom:12%;text-align:center;letter-spacing:.06em}"+
    "#ug-prompt{position:fixed;left:50%;bottom:calc(120px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:45;display:none;"+
    "background:rgba(10,12,18,.92);border:1px solid #C03A2E;border-radius:3px;padding:9px 14px;font:13px var(--sans);color:var(--bone);cursor:pointer}";
  document.head.appendChild(css);
  el=document.createElement("div"); el.id="ug"; document.body.appendChild(el);
  var rd=document.createElement("div"); rd.id="ug-ride";
  var h='<div class="win"></div>'; for(var i=0;i<9;i++) h+='<div class="lt" style="top:'+(26+i*5)+'%;animation-delay:'+(i*0.07)+'s"></div>';
  rd.innerHTML=h+'<div class="say" id="ug-say"></div>'; document.body.appendChild(rd);
  var pr=document.createElement("div"); pr.id="ug-prompt"; pr.onclick=function(){ if(ugNear) ugShow(ugNear); }; document.body.appendChild(pr);
  return el;
}
function ugTick(dt){
  if(ugCool>0) ugCool-=dt;
  var pr=document.getElementById("ug-prompt");
  if(!walkMode||store.inside||!UNDERGROUND.length||ugOpen){ if(pr) pr.style.display="none"; ugNear=null; return; }
  var P=camera.position, near=null;
  for(var i=0;i<UNDERGROUND.length;i++){ var s=UNDERGROUND[i]; if(Math.hypot(s.x-P.x,s.z-P.z)<5){ near=s; break; } }
  ugNear=near;
  if(!near){ if(pr) pr.style.display="none"; return; }
  ugEl(); pr=document.getElementById("ug-prompt");
  pr.innerHTML="<b>"+esc(near.name)+"</b> Underground · 1 gold a ride · <b>press U</b> or tap";
  pr.style.display="block";
}
function ugShow(from){
  var el=ugEl(); ugOpen=true;
  var list=UNDERGROUND.filter(function(s){ return s!==from; });
  var ringOrder=TR_RINGS.map(function(r){ return r[0]; });
  list.sort(function(a,b){ return ringOrder.indexOf(a.ring)-ringOrder.indexOf(b.ring)||a.name.localeCompare(b.name); });
  if(typeof MALL_STOP!=="undefined"&&MALL_STOP&&from.ring!=="mall") list.push(MALL_STOP);
  el.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b style="font-size:15px;color:#E8C27A">The Underground</b>'+
    '<button class="btn" id="ug-x">Leave</button></div>'+
    '<div style="color:var(--dim);margin-bottom:8px">You are at <b>'+esc(from.name)+'</b>. Every ride is one gold, to anywhere on the line.</div>'+
    list.map(function(s){ return '<div class="st"><span>'+esc(s.name)+'</span><button class="btn" data-go="'+esc(s.key)+'">Ride — 1 gold</button></div>'; }).join("")+
    '<div id="ug-msg" style="margin-top:8px;color:#C0603A"></div>';
  el.style.display="block";
  if(document.exitPointerLock) document.exitPointerLock();
  document.getElementById("ug-x").onclick=ugHide;
  Array.prototype.forEach.call(el.querySelectorAll("[data-go]"),function(b){ b.onclick=function(){
    var to=list.filter(function(s){ return s.key===b.getAttribute("data-go"); })[0]; if(to) ugRide(from,to); }; });
}
function ugHide(){ ugOpen=false; ugCool=1; var el=document.getElementById("ug"); if(el) el.style.display="none"; }
function ugRide(from,to){
  var msg=document.getElementById("ug-msg");
  if(!(typeof signedIn==="function"&&signedIn())){ if(msg) msg.textContent="Sign in to ride: the fare comes from your purse."; return; }
  if(msg){ msg.style.color="var(--dim)"; msg.textContent="Paying the fare…"; }
  cityRpc("ride_underground",{p_from:from.key,p_to:to.key}).then(function(o){
    if(o!=="ok"){ if(msg){ msg.style.color="#C0603A"; msg.textContent=String(o); } return; }
    ugHide();
    var rd=document.getElementById("ug-ride"), say=document.getElementById("ug-say");
    rd.style.display="block"; say.innerHTML="The Underground · next stop <b>"+esc(to.name)+"</b>";
    if(typeof audio!=="undefined"&&audio.on&&typeof playTone==="function") try{ playTone(110,1.2); }catch(e){}
    setTimeout(function(){
      ugArrive(to);
      say.innerHTML="<b>"+esc(to.name)+"</b> · mind the gap";
      setTimeout(function(){ rd.style.display="none"; },700);
    },2600);
    if(typeof refreshStanding==="function") refreshStanding();
  }).catch(function(e){ if(msg){ msg.style.color="#C0603A"; msg.textContent=e.message; } });
}
function ugArrive(to){
  if(to.arrive){ to.arrive(); return; }
  var sp=to.spec, fx=Math.sin(sp.rot||0), fz=Math.cos(sp.rot||0);
  var x=sp.x+fx*5.5, z=sp.z+fz*5.5;
  camera.position.set(x,terrainY(x,z)+1.72,z); yaw=Math.atan2(fx,fz); pitch=0; if(typeof flyY!=="undefined") flyY=0;
  if(typeof walkResume!=="undefined") walkResume=null;
  setStatus("<b>"+esc(to.name)+".</b> Up the steps and out into the city.");
}
if(typeof addEventListener==="function") addEventListener("keydown",function(e){
  if(/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||"")) return;
  if(e.code==="KeyU"&&ugNear&&!ugOpen&&ugCool<=0){ e.preventDefault(); ugShow(ugNear); }
  if(e.code==="Escape"&&ugOpen) ugHide();
});
/* stations are found again whenever the city stands (it is built afresh on every device) */
function ugFind(){
  if(UNDERGROUND.length&&UNDERGROUND[0].spec&&specById(UNDERGROUND[0].spec.id)) return;
  UNDERGROUND=[];
  store.objects.forEach(function(o){ if(o.underground) UNDERGROUND.push({key:o.underground,name:o.underground,ring:o.ugRing||"markets",x:o.x,z:o.z,spec:o}); });
}

/* ================================================================ traffic */
/* lines: a street, its lane (outside + going one way, inside - the other) and what runs on it */
var TRAM_LINES=[
  {r:740,kinds:["tram","tram","hansomcab","carriage","vintagecar"]},
  {r:1080,kinds:["tram","tram","omnibus","taxicab","van","hansomcab","coupe"]},
  {r:1280,kinds:["tram","tram","omnibus","taxicab","car","motorbike","wagon"]},
  {r:1620,kinds:["tram","hansomcab","wagon","cart","bicycle"]},
  {r:245,kinds:["omnibus","limousine","hansomcab","taxicab","coupe"]},
  {r:430,kinds:["carriage","limousine","roadster","vintagecar"]},
  {r:565,kinds:["carriage","limousine","sportscar","coupe"]},
  {r:880,kinds:["omnibus","carriage","taxicab"]},
  {r:1420,kinds:["omnibus","van","car","scooter","bicycle"]},
  {r:1790,kinds:["wagon","tractor","cart","truck","omnibus"]}
];
var TRAFFIC=[], trafficReady=false, trafficCull=0;
var TR_SPEED={tram:7,omnibus:6,carriage:6,hansomcab:7,wagon:4,cart:3.5,tractor:5,bicycle:5,motorbike:13,scooter:9};
function trafficBuild(){
  trafficClear();
  if(!ATLC) return;
  var seq=0;
  TRAM_LINES.forEach(function(L){
    L.kinds.forEach(function(k,i){
      if(!KIT[k]) return;
      var dir=(i%2)?-1:1, lane=L.r+dir*2.6, a0=(i/L.kinds.length)*Math.PI*2+L.r*0.001;
      var spec={id:"tf"+(++seq),archetype:k,attrs:{},x:ATLC.x,z:ATLC.z,rot:0,solid:false,detail:3,nights:[],city:true,traffic:true};
      var g=build(spec); g.visible=false; scene.add(g);
      TRAFFIC.push({g:g,spec:spec,r:lane,a:a0,dir:dir,v:TR_SPEED[k]||9,tram:k==="tram",wait:0,rank:i/L.kinds.length,
        stops:k==="tram"||k==="omnibus"?ATL_STAIRS.filter(function(s){ return s.main; }).map(function(s){ return s.a+90/L.r; }):null});
    });
  });
  /* the rails */
  [740,1080,1280,1620].forEach(function(r){
    var H=terrainY(ATLC.x+r,ATLC.z)+0.04;
    [-1,1].forEach(function(dir){
      [-0.72,0.72].forEach(function(off){
        var rr=r+dir*2.6+off, geo=new THREE.RingGeometry(rr-0.06,rr+0.06,720,1);
        var m=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:0x6A6E74}));
        m.rotation.x=-Math.PI/2; m.position.set(ATLC.x,H,ATLC.z); m.userData.rail=1; m.raycast=function(){};
        scene.add(m); TRAFFIC.push({rail:m});
      });
    });
  });
  trafficReady=true;
}
function trafficClear(){
  TRAFFIC.forEach(function(t){ var g=t.g||t.rail; if(g){ scene.remove(g); } });
  TRAFFIC=[]; trafficReady=false;
}
function trafficTick(dt){
  var r=(typeof somnucorRealm==="function")?somnucorRealm():null;
  if(!r||!ATLC){ if(trafficReady) trafficClear(); return; }
  if(!trafficReady){ if(typeof atlMeshQueue==="undefined"||!atlMeshQueue.length) trafficBuild(); return; }
  var P=camera.position, inCity=(store.here||0)===r.id&&!store.inside;
  trafficCull-=dt; var cull=trafficCull<=0; if(cull) trafficCull=0.3;
  for(var i=0;i<TRAFFIC.length;i++){
    var t=TRAFFIC[i];
    if(t.rail){ if(cull) t.rail.visible=inCity; continue; }
    if(t.wait>0) t.wait-=dt;
    else {
      var prev=t.a;
      t.a+=t.dir*t.v*dt/t.r;
      if(t.stops) for(var k=0;k<t.stops.length;k++){
        var s=t.stops[k], d0=((prev-s)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI, d1=((t.a-s)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI;
        if(d0*d1<=0&&Math.abs(d0-d1)<0.5){ t.wait=t.tram?6:4; break; }
      }
    }
    var x=ATLC.x+Math.cos(t.a)*t.r, z=ATLC.z+Math.sin(t.a)*t.r;
    /* how much of the city's traffic runs depends on its drivers and signalmen */
    if(cull){ var dx=x-P.x, dz=z-P.z, run=(typeof svcLevel==="function")?(0.35+0.65*svcLevel("transport")/100):1;
      t.g.visible=inCity&&dx*dx+dz*dz<520*520&&t.rank<run; }
    if(!t.g.visible) continue;
    t.g.position.set(x,terrainY(x,z),z);
    /* facing along the way it goes */
    t.g.rotation.y=Math.atan2(-Math.sin(t.a)*t.dir,Math.cos(t.a)*t.dir);
  }
}

/* ================================================================ riding what you own */
var RIDE_SEAT={horse:1.25,unicorn:1.25,pegasus:1.3,stag:1.2,camel:1.9,elephant:2.7,griffin:1.5,hippogriff:1.4,dragon:2.6,
  bicycle:.55,tandem:.55,tricycle:.45,motorbike:.55,scooter:.45,broomstick:.6,flyingcarpet:.4,
  car:-.45,coupe:-.5,roadster:-.6,sportscar:-.6,limousine:-.45,taxicab:-.45,vintagecar:-.2,van:-.2,
  carriage:.9,hansomcab:1.3,omnibus:.6,wagon:.5,airship:2.1,saucer:1.4,hovercar:-.3,sleigh:.4,firechariot:.5};
var RIDE_FLIES={pegasus:1,griffin:1,hippogriff:1,dragon:1,broomstick:1,flyingcarpet:1,airship:1,saucer:1};
var rideArch=null, rideG=null;
function rideSeatNow(){ return (rideArch&&walkMode&&!store.inside&&RIDE_SEAT[rideArch]!==undefined)?RIDE_SEAT[rideArch]:0; }
(function(){
  if(typeof ride!=="function") return;
  var rd=ride;
  ride=function(name){
    rd(name);
    var t=name?(myThings||[]).filter(function(x){ return x.name===name; })[0]:null;
    rideArch=(riding&&t)?t.archetype:null;
    if(rideArch&&RIDE_FLIES[rideArch]&&typeof canFly!=="undefined") canFly=true;
    if(rideG){ scene.remove(rideG); rideG=null; }
    var L=meLook(); L.ride=rideArch||null;
    if(typeof publishMyLook==="function") publishMyLook();
  };
})();
function rideTick(dt){
  var show=rideArch&&walkMode&&!store.inside&&KIT[rideArch];
  if(!show){ if(rideG) rideG.visible=false; return; }
  if(!rideG){ rideG=build({id:"__ride",archetype:rideArch,attrs:{},solid:false,detail:4,nights:[],city:true}); rideG.traverse(function(m){ m.raycast=function(){}; }); scene.add(rideG); }
  var P=camera.position, seat=rideSeatNow();
  rideG.visible=true;
  rideG.position.set(P.x,P.y-1.72-seat,P.z);
  rideG.rotation.y=yaw+Math.PI;
  if(rideG.userData.anim) try{ rideG.userData.anim(performance.now()/1000,dt); }catch(e){}
}
/* other dreamers are drawn on what they ride */
(function(){
  if(typeof presenceGroupFor!=="function") return;
  var pg=presenceGroupFor;
  presenceGroupFor=function(row){
    var g=pg(row), k=row&&row.look&&row.look.ride;
    if(k&&KIT[k]){
      var v, seat=RIDE_SEAT[k]||0;
      if(k==="dragon"&&typeof buildMountDragon==="function"){
        /* a Corp rider's own dragon, in its colour; the rider sits astride, whatever their size */
        v=buildMountDragon(row.look.rideColor||"green");
        seat=DRAGON_SADDLE-DRAGON_HIP*speciesScale(row.look);
        g.userData.mount=v;
      } else v=build({id:"__pride_"+row.user_id,archetype:k,attrs:{},solid:false,detail:3,nights:[],city:true});
      g.children.forEach(function(c){ if(c!==g.userData.tag) c.position.y+=seat; });
      if(g.userData.tag) g.userData.tag.position.y+=Math.max(0,seat);
      v.rotation.y=Math.PI; g.add(v);
    }
    return g;
  };
})();


/* ================================================================ the Tower by night */
/* it never sleeps: its offices lit floor upon floor, light thrown up its
   faces from the plaza, and a beacon on its crown seen from every ring */
var TOWERLIGHT=null;
function towerLightTick(dt){
  var r=(typeof somnucorRealm==="function")?somnucorRealm():null;
  var tw=r?store.objects.filter(function(o){ return o.realm===r.id&&o.archetype==="somnucortower"; })[0]:null;
  if(!tw||!meshes[tw.id]){ if(TOWERLIGHT){ scene.remove(TOWERLIGHT.g); TOWERLIGHT=null; } return; }
  if(!TOWERLIGHT||TOWERLIGHT.id!==tw.id){
    if(TOWERLIGHT) scene.remove(TOWERLIGHT.g);
    var G=new THREE.Group(), s=(tw.attrs&&tw.attrs.s)||1;
    var geo=new THREE.PlaneGeometry(1.4,1.8), n=0, cols=9, rows=36, faces=4;
    var inst=new THREE.InstancedMesh(geo,new THREE.MeshBasicMaterial({color:0xFFFFFF}),cols*rows*faces);
    var m4=new THREE.Matrix4(), q=new THREE.Quaternion(), e=new THREE.Euler(), v=new THREE.Vector3(), sc=new THREE.Vector3(1,1,1), c=new THREE.Color();
    for(var f=0;f<faces;f++) for(var row=0;row<rows;row++) for(var col=0;col<cols;col++){
      var h=hash("tw"+f+"_"+row+"_"+col); if(h%10<3) continue;           /* not every office is lit */
      var off=(col-(cols-1)/2)*2.5, y=10+row*4;
      var ang=f*Math.PI/2; e.set(0,ang,0); q.setFromEuler(e);
      v.set(Math.sin(ang)*15.6+Math.cos(ang)*off,y,Math.cos(ang)*15.6-Math.sin(ang)*off);
      m4.compose(v,q,sc); inst.setMatrixAt(n,m4);
      c.setHex(h%7===0?0x9FE8FF:(h%5===0?0xFFF2D0:0xFFD890)); inst.setColorAt(n,c); n++;
    }
    inst.count=n; inst.instanceMatrix.needsUpdate=true; if(inst.instanceColor) inst.instanceColor.needsUpdate=true;
    inst.raycast=function(){}; G.add(inst);
    for(var k=0;k<4;k++){
      var a=k*Math.PI/2+Math.PI/4;
      var beam=new THREE.Mesh(new THREE.CylinderGeometry(2,7,170,16,1,true),
        new THREE.MeshBasicMaterial({color:0x7FD8FF,transparent:true,opacity:0.09,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));
      beam.position.set(Math.cos(a)*24,85,Math.sin(a)*24); beam.rotation.z=Math.cos(a)*0.06; beam.rotation.x=-Math.sin(a)*0.06; beam.raycast=function(){}; G.add(beam);
    }
    var beacon=new THREE.Mesh(new THREE.SphereGeometry(3,20,14),new THREE.MeshBasicMaterial({color:0xFF5A6A}));
    beacon.position.y=212; beacon.raycast=function(){}; G.add(beacon);
    G.scale.set(s,s,s);
    G.position.copy(meshes[tw.id].position); G.rotation.y=meshes[tw.id].rotation.y;
    scene.add(G); TOWERLIGHT={id:tw.id,g:G,beacon:beacon};
  }
  var night=(typeof daylight==="function")?(1-daylight(dreamHour())):0;
  var show=night>0.35&&(store.here||0)===r.id&&!store.inside;
  TOWERLIGHT.g.visible=show;
  if(show) TOWERLIGHT.beacon.material.color.setHex((Math.floor(performance.now()/900)%2)?0xFF5A6A:0x5A1A20);
}
/* ================================================================ every frame */
function transitTick(dt){
  if(typeof ATLC==="undefined") return;
  ugFind(); ugTick(dt); trafficTick(dt); rideTick(dt); towerLightTick(dt);
}
