/* SomnuMatrix — corp.js
   the Dragon Corp, merit, and community service.
     - the Corp's riders mount their dragons and keep a sector each: their
       panel shows their sector and who rides the others, the reports coming
       in, and the merit rolls; commanders assign the sectors
     - merit: a dreamer who strikes another (press X beside them) does them
       no harm at all — it only marks the striker, and the Corp is told; the
       same for a thief at a market stall (press T)
     - community service: the held may work in the Warrens, under the Corp's
       eye, and every task done takes half an hour off the sentence
   loaded as a plain script; shares scope with the other files */
"use strict";

var CORP={data:null,at:0,mounted:false};
var SECTOR_A0=0.19, SECTOR_W=Math.PI/4;
function sectorAt(x,z){ var a=Math.atan2(z-ATLC.z,x-ATLC.x); return 1+Math.floor((((a-SECTOR_A0)%(Math.PI*2))+Math.PI*2)%(Math.PI*2)/SECTOR_W); }
function amCorp(){ return ((WORK.data&&WORK.data.jobs)||[]).some(function(j){ return j.panel==="police"; }); }

/* the rider's own sector, for their patrol routes */
(function(){
  if(typeof targetsFor!=="function") return;
  var tf=targetsFor;
  targetsFor=function(kind){
    if(kind!=="sector") return tf(kind);
    var sec=(CORP.data&&CORP.data.sector)||sectorAt(camera.position.x,camera.position.z), out=[];
    var a0=SECTOR_A0+(sec-1)*SECTOR_W;
    Object.keys(ATL_STREETS).forEach(function(k){ ATL_STREETS[k].forEach(function(rs){
      for(var i=1;i<6;i++){ var a=a0+SECTOR_W*i/6; out.push({x:ATLC.x+Math.cos(a)*rs,z:ATLC.z+Math.sin(a)*rs,name:"sector "+sec+", "+(atlRingAt?atlRingAt(rs):"the street")}); }
    }); });
    return out;
  };
})();
function atlRingAt(r){ for(var i=0;i<ATL_RINGS.length;i++) if(r>=ATL_RINGS[i].S&&r<=ATL_RINGS[i].E) return ATL_RINGS[i].name; return "the city"; }

/* patrols are flown: the rider's own dragon */
function corpMount(on){
  if(on){
    riding="Corp dragon"; rideSpeed=4; rideArch="dragon"; if(typeof canFly!=="undefined") canFly=true;
    if(rideG){ scene.remove(rideG); rideG=null; }
    var L=meLook(); L.ride="dragon"; if(typeof publishMyLook==="function") publishMyLook();
    CORP.mounted=true; setStatus("<b>Mounted.</b> Space to climb, C to come down. Your sector is yours to keep.");
  } else {
    if(typeof ride==="function") ride(null); CORP.mounted=false;
  }
}

function corpRefresh(force){
  if(!amCorp()&&!(typeof amKeeper==="function"&&amKeeper())) return Promise.resolve(null);
  if(!force&&Date.now()-CORP.at<20000) return Promise.resolve(CORP.data);
  CORP.at=Date.now();
  return cityRpc("corp_status").then(function(d){ CORP.data=d&&d.corp?d:null; if(WORK.open) workPaint(); return CORP.data; }).catch(function(){ return null; });
}
/* the Corp's part of the work panel */
function corpHtml(){
  var d=CORP.data; if(!d) return "";
  var h='<div class="job"><b style="color:#E8C27A">The Dragon Corp</b>'+(d.sector?' <span style="color:var(--dim)">· you keep the <b style="color:var(--bone)">'+esc(((d.sectors||[])[d.sector-1]||{}).name||("sector "+d.sector))+'</b></span>':'')+
    '<div style="margin:6px 0"><button class="btn" id="corp-mount">'+(CORP.mounted?"Dismount":"Mount your dragon")+'</button></div>';
  h+='<div style="color:var(--dim);margin-top:4px">Sectors</div>';
  (d.sectors||[]).forEach(function(s){
    h+='<div style="padding:3px 0">'+esc(s.name)+' · <span style="color:var(--dim)">'+(s.riders.length?s.riders.map(function(r){ return esc(r.name)+(r.online?" ●":""); }).join(", "):"no rider")+
      (s.open?' · <b style="color:#C0603A">'+s.open+' open</b>':'')+'</span>'+
      (d.command?s.riders.map(function(r){ return ' <select data-rider="'+r.id+'">'+[1,2,3,4,5,6,7,8].map(function(n){ return '<option'+(n===s.n?" selected":"")+'>'+n+'</option>'; }).join("")+'</select>'; }).join(""):"")+'</div>';
  });
  h+='<div style="color:var(--dim);margin-top:8px">Reports</div>';
  if(!(d.reports||[]).length) h+='<div style="color:var(--dim)">Nothing open. The city is quiet.</div>';
  (d.reports||[]).forEach(function(r){
    h+='<div class="tk"><span><b>'+esc(r.kind)+'</b> · '+esc(r.offender||"?")+(r.victim?' against '+esc(r.victim):'')+' · sector '+(r.sector||"?")+
      '<br><span style="color:var(--dim);font-size:12px">'+esc(r.note||"")+'</span></span><span style="white-space:nowrap">'+
      (r.x!==null&&r.x!==undefined?'<button class="btn" data-fly="'+r.id+'">Go</button> ':'')+'<button class="btn" data-close="'+r.id+'">Close</button></span></div>';
  });
  h+='<div style="color:var(--dim);margin-top:8px">Merit rolls <span style="font-size:12px">(100 is good standing)</span></div>';
  (d.rolls||[]).slice(0,25).forEach(function(m){
    h+='<div class="tk"><span>'+esc(m.name)+' · <b style="color:'+(m.score<80?'#C0603A':m.score>110?'#8FCB8A':'var(--bone)')+'">'+m.score+'</b>'+
      ((m.recent&&m.recent[0])?' <span style="color:var(--dim);font-size:12px">· '+esc(m.recent[0].kind)+(m.recent[0].note?": "+esc(m.recent[0].note):"")+'</span>':'')+'</span>'+
      '<span style="white-space:nowrap"><button class="btn" data-mark="'+m.id+'" data-d="1">+</button> <button class="btn" data-mark="'+m.id+'" data-d="-1">−</button></span></div>';
  });
  return h+'</div>';
}
function corpWire(el){
  var d=CORP.data; if(!d) return;
  var mb=document.getElementById("corp-mount"); if(mb) mb.onclick=function(){ corpMount(!CORP.mounted); workPaint(); };
  Array.prototype.forEach.call(el.querySelectorAll("[data-rider]"),function(sel){ sel.onchange=function(){
    cityRpc("corp_assign_sector",{p_user:sel.getAttribute("data-rider"),p_sector:+sel.value}).then(function(o){ setStatus(o==="ok"?"Sector assigned.":esc(String(o))); corpRefresh(true); }); }; });
  Array.prototype.forEach.call(el.querySelectorAll("[data-close]"),function(b){ b.onclick=function(){
    var why=prompt("How was it seen to?","warned them"); if(why===null) return;
    cityRpc("corp_resolve",{p_report:+b.getAttribute("data-close"),p_outcome:why}).then(function(o){ setStatus(o==="ok"?"Report closed.":esc(String(o))); corpRefresh(true); }); }; });
  Array.prototype.forEach.call(el.querySelectorAll("[data-fly]"),function(b){ b.onclick=function(){
    var r=(d.reports||[]).filter(function(x){ return String(x.id)===b.getAttribute("data-fly"); })[0]; if(!r) return;
    var j=((WORK.data&&WORK.data.jobs)||[]).filter(function(x){ return x.panel==="police"; })[0];
    WORK.busy={job:j,task:{task:"Answer a report",kind:"report"},stops:[{x:ATLC.x+r.x,z:ATLC.z+r.z,name:"where it happened"}],i:0,t:0,need:0,report:r.id};
    WORK.open=false; workPaint(); workRunPaint(); }; });
  Array.prototype.forEach.call(el.querySelectorAll("[data-mark]"),function(b){ b.onclick=function(){
    var up=b.getAttribute("data-d")==="1", n=prompt(up?"Commend them — how much (1 to 5)?":"Caution them — how much (1 to 10)?",up?"2":"3"); if(!n) return;
    var why=prompt("Why?",""); if(!why) return;
    cityRpc("corp_mark",{p_user:b.getAttribute("data-mark"),p_delta:(up?1:-1)*Math.abs(parseInt(n,10)||1),p_note:why}).then(function(o){ setStatus(o==="ok"?"Marked.":esc(String(o))); corpRefresh(true); }); }; });
}
(function(){
  if(typeof workPaint!=="function") return;
  var wp=workPaint;
  workPaint=function(){
    wp();
    var el=document.getElementById("work"); if(!el||el.style.display==="none") return;
    var h=corpHtml(); if(!h&&!MERIT.score) return;
    var box=document.createElement("div");
    box.innerHTML=(MERIT.score?'<div class="job">Your merit: <b>'+MERIT.score+'</b> <span style="color:var(--dim)">· 100 is good standing; work and errands raise it, misdeeds lower it</span></div>':'')+h;
    el.appendChild(box); corpWire(box);
  };
  var wr=workRefresh;
  workRefresh=function(force){ return wr(force).then(function(d){ meritRefresh(); if(amCorp()) corpRefresh(force); return d; }); };
})();
/* a report answered when the rider reaches the place */
(function(){
  if(typeof workTick!=="function") return;
  var wt=workTick;
  workTick=function(dt){
    var B=WORK.busy;
    if(B&&B.task&&B.task.kind==="report"){
      var s=B.stops[0], P=camera.position;
      if(Math.hypot(s.x-P.x,s.z-P.z)<12){
        WORK.busy=null; var r=document.getElementById("work-run"); if(r) r.style.display="none";
        setStatus("<b>You are there.</b> See to it, then close the report from your panel.");
      } else workRunPaint();
      return;
    }
    wt(dt);
    corpTick(dt);
  };
})();

/* ---- merit ---- */
var MERIT={score:0,at:0};
function meritRefresh(){
  if(!(typeof signedIn==="function"&&signedIn())) return;
  if(Date.now()-MERIT.at<60000) return;
  MERIT.at=Date.now();
  cityRpc("my_merit").then(function(m){ if(m) MERIT.score=m.score; }).catch(function(){});
}
/* striking another dreamer: it never hurts them. It only marks you. */
function nearestDreamer(maxD){
  if(typeof presenceOthers==="undefined") return null;
  var P=camera.position, best=null, bd=maxD;
  Object.keys(presenceOthers).forEach(function(id){ var p=presenceOthers[id]; if(!p.group) return;
    var d=Math.hypot(p.group.position.x-P.x,p.group.position.z-P.z); if(d<bd){ bd=d; best={id:id,name:p.name,p:p}; } });
  return best;
}
var misdeedCool=0;
function misdeed(kind,victim,note){
  if(misdeedCool>0) return; misdeedCool=3;
  cityRpc("merit_misdeed",{p_kind:kind,p_victim:victim||null,p_note:note}).catch(function(){});
  MERIT.at=0;
}
if(typeof addEventListener==="function") addEventListener("keydown",function(e){
  if(/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||"")) return;
  if(!walkMode||!inCityNow()) return;
  if(e.code==="KeyX"){
    var v=nearestDreamer(3); if(!v) return;
    misdeed("assault",v.id,"struck at "+(v.name||"a dreamer"));
    if(v.p&&typeof sayOver==="function") sayOver(v.id,"…unhurt.");
    cityRpc("say_in_city",{p_body:"* strikes at "+(v.name||"a dreamer")+" — it does them no harm *",p_channel:"near"}).catch(function(){});
    setStatus("You strike at <b>"+esc(v.name||"them")+"</b>. It does them no harm at all — here, it cannot. It only marks you, and the Dragon Corp is told.");
  }
  if(e.code==="KeyT"){
    var P=camera.position, stall=cityObjs().filter(function(o){ return /marketstall|marketawning|shop/.test(o.archetype)&&Math.hypot(o.x-P.x,o.z-P.z)<4; })[0];
    if(!stall) return;
    misdeed("theft",null,"took from "+(stall.label||stall.name||"a market stall"));
    setStatus("You pocket something from the stall. It is worth nothing to you — but it is marked against you, and the Dragon Corp is told.");
  }
});

/* ---- community service ---- */
var CS={out:0,busy:null};
var CS_TASKS=[
  {task:"Sweep the Warrens streets",kind:"round",stops:4},
  {task:"Clear the rubble",kind:"gather",node:"rubble",secs:12},
  {task:"Serve at the soup kitchen",kind:"desk",at:"soup",secs:16},
  {task:"Scrub the Gaol yard",kind:"desk",at:"yard",secs:14}
];
function csAllowed(){ return CS.out>Date.now(); }
function csInWarrens(){ if(!ATLC) return false; var P=camera.position, r=Math.hypot(P.x-ATLC.x,P.z-ATLC.z); return r>1520&&r<1720&&!store.inside; }
(function(){
  if(typeof gaolTick!=="function") return;
  var gt=gaolTick;
  gaolTick=function(dt){
    /* out on service: anywhere in the Warrens, under the Corp's eye — but not beyond it */
    if(csAllowed()&&walkMode&&typeof heldNow==="function"&&heldNow()){
      if(csInWarrens()||(store.inside&&INT&&INT.spec&&INT.spec.workplace==="The Gaol")) return;
      CS.out=0; toCell("<b>Back to your cell.</b> Community service is done in the Warrens, nowhere else.");
      return;
    }
    gt(dt);
  };
})();
function csPanel(){
  var el=workEl(); if(!el) return;
  el.style.display="block";
  var left=standing&&standing.prison?prisonWords(standing.prison):"";
  el.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:14px">Community service</b><button class="btn" id="cs-x">Close</button></div>'+
    '<div style="color:var(--dim);margin:6px 0;line-height:1.5">Work in the Warrens under the Dragon Corp\'s eye. Each task done takes <b style="color:var(--bone)">half an hour</b> off your sentence and earns back a little merit. Leave the Warrens and you are taken back to your cell.</div>'+
    (left?'<div style="margin-bottom:6px">'+left+'</div>':'')+
    CS_TASKS.map(function(t,i){ return '<div class="tk"><span>'+esc(t.task)+'</span><button class="btn" data-cs="'+i+'">Start</button></div>'; }).join("");
  document.getElementById("cs-x").onclick=function(){ el.style.display="none"; };
  Array.prototype.forEach.call(el.querySelectorAll("[data-cs]"),function(b){ b.onclick=function(){ csStart(CS_TASKS[+b.getAttribute("data-cs")]); }; });
}
function csSpot(which){
  if(which==="yard"&&store.gaolYard) return {x:store.gaolYard.x,z:store.gaolYard.z,name:"the Gaol yard"};
  var k=cityObjs().filter(function(o){ return o.archetype==="soupkitchen"; }).sort(function(a,b){ return Math.hypot(a.x-camera.position.x,a.z-camera.position.z)-Math.hypot(b.x-camera.position.x,b.z-camera.position.z); })[0];
  return k?{x:k.x,z:k.z,name:"the soup kitchen"}:null;
}
function csStart(t){
  CS.out=Date.now()+15*60000;               /* fifteen minutes out, renewed with every task */
  if(store.inside&&typeof exitInterior==="function"&&typeof toYard==="function") toYard("<b>Out to work.</b> The Warrens, under the Corp's eye.");
  var B={task:t,t:0,need:t.secs||0,i:0,cs:true};
  if(t.kind==="round"){
    var W=atlRing("warrens"), P=camera.position, a0=Math.atan2(P.z-ATLC.z,P.x-ATLC.x); B.stops=[];
    for(var i=1;i<=t.stops;i++){ var a=a0+i*40/1620; B.stops.push({x:ATLC.x+Math.cos(a)*1620,z:ATLC.z+Math.sin(a)*1620,name:"the Warrens street"}); }
  } else if(t.kind==="desk"){ B.spot=csSpot(t.at); }
  CS.busy=B; var el=document.getElementById("work"); if(el) el.style.display="none";
}
function csTick(dt){
  var held=typeof heldNow==="function"&&heldNow();
  var b=document.getElementById("work-btn");
  if(held&&inCityNow()){ workEl(); b=document.getElementById("work-btn"); b.style.display="block"; b.textContent="Community service"; b.onclick=csPanel; }
  if(!held&&b&&b.textContent==="Community service"){ b.textContent="Your work"; b.onclick=function(){ WORK.open=!WORK.open; if(WORK.open) workRefresh(true); workPaint(); }; }
  var B=CS.busy, run=document.getElementById("work-run"); if(!B){ return; }
  if(!held){ CS.busy=null; if(run) run.style.display="none"; return; }
  var P=camera.position, msg="";
  if(B.task.kind==="round"){
    var s=B.stops[B.i]; if(Math.hypot(s.x-P.x,s.z-P.z)<8){ B.i++; if(B.i>=B.stops.length){ csDone(); return; } }
    s=B.stops[B.i]; var bearing=Math.atan2(s.x-P.x,s.z-P.z), rel=(bearing-(yaw+Math.PI))*180/Math.PI;
    msg="Stop "+(B.i+1)+" of "+B.stops.length+" · "+Math.round(Math.hypot(s.x-P.x,s.z-P.z))+" m <span class='arrow' style='transform:rotate("+(-rel).toFixed(0)+"deg)'>↑</span>";
  } else {
    var at=false;
    if(B.task.kind==="gather"){ var rub=cityObjs().filter(function(o){ return o.archetype==="rubble"&&Math.hypot(o.x-P.x,o.z-P.z)<8; })[0]; at=!!rub;
      msg=at?"Clearing…":"Find a heap of rubble in the Warrens"; }
    else { at=B.spot&&Math.hypot(B.spot.x-P.x,B.spot.z-P.z)<14; msg=at?"Working…":("Go to "+(B.spot?B.spot.name:"the place")+(B.spot?" · "+Math.round(Math.hypot(B.spot.x-P.x,B.spot.z-P.z))+" m":"")); }
    if(at) B.t+=dt;
    if(B.t>=B.need){ csDone(); return; }
    msg+="<div class='bar'><i style='width:"+Math.min(100,B.t/B.need*100).toFixed(0)+"%'></i></div>";
  }
  if(run){ run.style.display="block"; run.innerHTML="<b>"+esc(B.task.task)+"</b><div style='margin-top:6px'>"+msg+"</div><div style='margin-top:6px'><button class='btn' id='cs-stop'>Stop</button></div>";
    var st=document.getElementById("cs-stop"); if(st) st.onclick=function(){ CS.busy=null; run.style.display="none"; }; }
}
function csDone(){
  var B=CS.busy; CS.busy=null; var run=document.getElementById("work-run"); if(run) run.style.display="none";
  cityRpc("community_service",{p_task:B.task.task}).then(function(o){
    if(!o||!o.ok){ setStatus(esc((o&&o.say)||"That did not count.")); return; }
    CS.out=Date.now()+15*60000;
    if(o.free){ CS.out=0; setStatus("<b>Your time is served.</b> The Corp signs you off — you are free to go."); }
    else setStatus("<b>"+esc(B.task.task)+"</b> — done. Half an hour off your sentence; "+o.left_min+" minutes left to serve.");
    if(typeof refreshStanding==="function") refreshStanding();
  }).catch(function(e){ setStatus(esc(e.message)); });
}

/* ---- the Corp's dragons, circling the Roost and flying the sectors ---- */
var CORP_SKY=[];
function corpTick(dt){
  if(misdeedCool>0) misdeedCool-=dt;
  csTick(dt);
  if(typeof eyrieTick==="function") try{ eyrieTick(dt); }catch(e){ if(window.console) console.warn("eyrie:",e); }
  var r=somnucorRealm(); if(!r||!ATLC||typeof buildMountDragon!=="function") return;
  var roost=store.workplaceAt&&store.workplaceAt["The Dragon Roost"]; if(!roost) return;
  if(!CORP_SKY.length){
    for(var i=0;i<4;i++){
      /* a rider of the Corp on a dragon of their own colour, in the Corp's blue */
      var g=buildMountDragon(["red","blue","bronze","black"][i],{lod:true}); g.userData.pose="fly";
      var rider=buildFigure({id:"corpsky_r"+i,archetype:"human",attrs:{},nights:[],city:true,detail:3,
        look:{sex:i%2?"f":"m",top:0x23324E,bottom:0x1E2638,topKind:"shirt",bottomKind:"trousers",shoes:0x2A1E14,gear:"cloak",gearColor:0x23324E,hairStyle:i%2?"long":"short"}},1);
      rider.position.y=DRAGON_SADDLE-DRAGON_HIP; riderPose(rider); g.add(rider);
      g.traverse(function(m){ m.raycast=function(){}; }); scene.add(g);
      CORP_SKY.push({g:g,a:i*Math.PI/2,r:i<2?60:900+i*300,h:i<2?70:140+i*20,v:i<2?0.25:0.06,cx:i<2?roost.x:ATLC.x,cz:i<2?roost.z:ATLC.z});
    }
  }
  var P=camera.position, show=(store.here||0)===r.id&&!store.inside;
  CORP_SKY.forEach(function(d){
    d.a+=d.v*dt;
    var x=d.cx+Math.cos(d.a)*d.r, z=d.cz+Math.sin(d.a)*d.r;
    d.g.visible=show&&Math.hypot(x-P.x,z-P.z)<1500;
    if(!d.g.visible) return;
    d.g.position.set(x,terrainY(x,z)+d.h,z);
    d.g.rotation.y=Math.atan2(-Math.sin(d.a),Math.cos(d.a));
    if(d.g.userData.anim) try{ d.g.userData.anim(performance.now()/1000,dt); }catch(e){}
  });
}
