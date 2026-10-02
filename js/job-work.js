/* SomnuMatrix — job-work.js
   every post in Somnucor is real work. Each worker has their own panel with
   the tasks of their trade: work done at their own desk, bench or counter;
   rounds walked about the city (the post delivered, the lamps lit, the beat
   walked, a lot shown to a buyer); gathering at the seam, the stand, the
   fields and the quay; and, for the hunters, nightmares faced in the Wilds.
   Pay needs both: the hours you were there, and the work you did in them.
   Every task keeps one of the city's services going — the lamps that are lit
   at night and the trams that run depend on somebody doing the work.
   loaded as a plain script; shares scope with the other files */
"use strict";

/* where each trade's rounds go, and what it gathers at */
var JOBWORK_TARGETS={"Bailiff":{"Serve a summons":["homes"]},"Ferryman":{"Run the ferry round the moat":["docks"]},"Harbourmaster":{"Inspect the moorings":["docks"]},"Shepherd":{"Walk the flock round the fields":["fields"]},"Forester":{"Mark trees for felling":["trees"]},"Dream warden":{"Walk the Hall of Doors":["gate"]},"Gate technician":{"Inspect the gate lamps":["lamps"]},"Guide":{"Show a newcomer the city":["workplaces"]},"Hall porter":{"Sweep the Hall's steps":["gate"]},"Gazette writer":{"Gather the news about the city":["workplaces"]},"Midwife":{"Visit new mothers at home":["homes"]},"Physician":{"Make house calls":["homes"]},"Cartographer":{"Survey a street":["streets"]},"City planner":{"Inspect the rings":["workplaces"]},"Surveyor":{"Measure out plots":["plots"]},"Pit foreman":{"Inspect the pits":["rocks"]},"Dragon rider":{"Fly your sector's patrol":["sector"]},"Night rider":{"Fly the night patrol over your sector":["sector"]},"Wing commander":{"Inspect your wing's sector":["sector"]},"Corp marshal":{"Fly over the whole city":["stations"]},"Letter carrier":{"Deliver the post":["homes"]},"Gaoler":{"Check the cells":["gaol"]},"Warden":{"Inspect the yard":["gaol"]},"Land assessor":{"Value a property":["plots"]},"Letting agent":{"Show a lot to let":["plots"]},"Realtor":{"Show a lot for sale":["plots"]},"Rent collector":{"Collect the rents":["plots"]},"Courier":{"Carry a parcel across the city":["workplaces"]},"Runner":{"Run a message":["workplaces"],"Run errands for the shops":["shops"]},"Teacher":{"Walk the children home":["homes"]},"Bell ringer":{"Ring the bells along the Row":["temples"]},"Candle keeper":{"Light the candles in the houses":["temples"]},"Gravedigger":{"Tend the graveyard":["temples"]},"Temple keeper":{"Open the houses of Temple Row":["temples"]},"Temple warden":{"Keep watch along Temple Row":["temples"]},"Bus driver":{"Drive the omnibus round":["stations"]},"Carriage driver":{"Drive a fare across the city":["workplaces"]},"Driver":{"Drive a delivery":["shops"]},"Tram driver":{"Drive the tram round the ring":["stations"]},"Tax clerk":{"Deliver tax notices":["shops"]},"Carpenter":{"Repair woodwork about the city":["workplaces"]},"Dome keeper":{"Check the dome's panes":["gardens"]},"Electrician":{"Mend the wiring about the city":["lamps"]},"Engineer":{"Inspect the pumps":["fountains"]},"Gardener":{"Tend the city's gardens":["gardens"]},"Glazier":{"Replace broken panes":["workplaces"]},"Groundskeeper":{"Mow the greens":["gardens"]},"Lamplighter":{"Light the street lamps":["lamps"]},"Mason":{"Repair the city's walls":["streets"]},"Plumber":{"Fix the city's pipes":["fountains"]},"Road crew":{"Mend the road":["streets"]},"Roofer":{"Repair roofs about the city":["homes"]},"Sanitation":{"Clear the bins":["streets"]},"Sign writer":{"Repaint the street signs":["signs"]},"Street sweeper":{"Sweep the streets":["streets"]},"Water keeper":{"Check the falls and canals":["fountains"]}};
var JOBWORK_STOPS={"Bailiff|Serve a summons":2,"Ferryman|Run the ferry round the moat":3,"Harbourmaster|Inspect the moorings":3,"Shepherd|Walk the flock round the fields":3,"Forester|Mark trees for felling":4,"Dream warden|Walk the Hall of Doors":3,"Gate technician|Inspect the gate lamps":3,"Guide|Show a newcomer the city":4,"Hall porter|Sweep the Hall's steps":3,"Gazette writer|Gather the news about the city":3,"Midwife|Visit new mothers at home":2,"Physician|Make house calls":3,"Cartographer|Survey a street":4,"City planner|Inspect the rings":3,"Surveyor|Measure out plots":3,"Pit foreman|Inspect the pits":3,"Dragon rider|Fly your sector's patrol":5,"Night rider|Fly the night patrol over your sector":5,"Wing commander|Inspect your wing's sector":4,"Corp marshal|Fly over the whole city":4,"Letter carrier|Deliver the post":5,"Gaoler|Check the cells":3,"Warden|Inspect the yard":3,"Land assessor|Value a property":2,"Letting agent|Show a lot to let":2,"Realtor|Show a lot for sale":2,"Rent collector|Collect the rents":4,"Courier|Carry a parcel across the city":3,"Runner|Run a message":2,"Runner|Run errands for the shops":3,"Teacher|Walk the children home":2,"Bell ringer|Ring the bells along the Row":3,"Candle keeper|Light the candles in the houses":4,"Gravedigger|Tend the graveyard":2,"Temple keeper|Open the houses of Temple Row":4,"Temple warden|Keep watch along Temple Row":3,"Bus driver|Drive the omnibus round":4,"Carriage driver|Drive a fare across the city":3,"Driver|Drive a delivery":3,"Tram driver|Drive the tram round the ring":4,"Tax clerk|Deliver tax notices":3,"Carpenter|Repair woodwork about the city":3,"Dome keeper|Check the dome's panes":3,"Electrician|Mend the wiring about the city":3,"Engineer|Inspect the pumps":3,"Gardener|Tend the city's gardens":4,"Glazier|Replace broken panes":3,"Groundskeeper|Mow the greens":4,"Lamplighter|Light the street lamps":6,"Mason|Repair the city's walls":3,"Plumber|Fix the city's pipes":3,"Road crew|Mend the road":4,"Roofer|Repair roofs about the city":3,"Sanitation|Clear the bins":5,"Sign writer|Repaint the street signs":3,"Street sweeper|Sweep the streets":5,"Water keeper|Check the falls and canals":3};
var JOBWORK_NODE={"Dock hand|Haul crates off the quay":"crates","Fisherman|Cast a net from the quay":"water","Dairyman|Milk the herd":"animals","Farmhand|Bring in the harvest":"fields","Shepherd|Shear the sheep":"animals","Charcoal burner|Gather deadwood":"trees","Forester|Plant saplings":"trees","Lumberjack|Fell a tree":"trees","Herbalist|Gather healing herbs":"gardens","Miner|Dig at the seam":"crystal","Quarryman|Quarry stone":"rocks","Gardener|Grow flowers":"gardens"};
var WORK={data:null,at:0,busy:null,open:false,svc:{},svcAt:0,toast:""};

/* ---- the city's services, read by everyone, worked by the workers ---- */
function workServices(){
  var now=Date.now(); if(now-WORK.svcAt<120000) return;
  WORK.svcAt=now;
  var f=(typeof signedIn==="function"&&signedIn())?cityRpc("city_services_board"):null;
  if(!f) return;
  f.then(function(rows){ (rows||[]).forEach(function(r){ WORK.svc[r.key]=r.level; }); }).catch(function(){});
}
function svcLevel(k){ var v=WORK.svc[k]; return v===undefined?70:v; }

/* the lamps the lamplighters lit; the trams the drivers drive */
(function(){
  if(typeof lampsForNight==="function"){
    var lf=lampsForNight;
    lampsForNight=function(night){ lf(night*(0.25+0.75*svcLevel("lighting")/100)); };
  }
})();

/* ---- where the work is ---- */
function wpReach(key){ var w=WP_BY_KEY&&WP_BY_KEY[key]; return w&&w.ring==="harvest"?200:(key==="The Hunters' Lodge"?80:60); }
function wpAt(key){ return store.workplaceAt&&store.workplaceAt[key]; }
function inCityNow(){ var r=somnucorRealm(); return !!(r&&walkMode&&(store.here||0)===r.id); }
function onSite(job){
  if(!inCityNow()) return false;
  if(job.roams) return true;
  if(store.inside&&INT&&INT.spec) return INT.spec.workplace===job.workplace||(INT.spec.label===job.workplace);
  var w=wpAt(job.workplace); if(!w) return false;
  return Math.hypot(camera.position.x-w.x,camera.position.z-w.z)<wpReach(job.workplace);
}
function inWilds(){ if(!inCityNow()||store.inside||!ATLC) return false; return Math.hypot(camera.position.x-ATLC.x,camera.position.z-ATLC.z)>2160; }

var NODE_RE={crystal:/crystal|gem|mineshaft/,rocks:/^rock$|crater|boulder|quarry/,trees:/^(tree|pine|oak|birch|willow|deadtree)$/,
  fields:/field|crop|wheat|hay|orchard|vineyard|scarecrow|barn/,animals:/^(cow|sheep|goat|pig|horse|chicken)$/,water:/pier|boat|quay|dock|crane|fishingboat/,
  gardens:/flower|hedge|topiary|garden|fountain|bush|lawn/,crates:/crates|barrel|pallets|sacks/};
var TARGET_RE={lamps:/streetlight|ornatelamp|dimlamp|lamppost|crystalbrazier|gaslamp/,fountains:/fountain|well|handpump/,signs:/^signboard$/,
  docks:NODE_RE.water,trees:NODE_RE.trees,fields:NODE_RE.fields,rocks:NODE_RE.rocks,gardens:NODE_RE.gardens};
function cityObjs(){ var r=somnucorRealm(); return r?store.objects.filter(function(o){ return o.realm===r.id; }):[]; }
function targetsFor(kind){
  var out=[], rr=function(o){ return Math.hypot(o.x-ATLC.x,o.z-ATLC.z); };
  if(kind==="homes") lotPlots().forEach(function(p){ var h=p.homeId&&specById(p.homeId); if(h) out.push({x:h.x,z:h.z,name:p.name}); });
  else if(kind==="plots") cityObjs().forEach(function(o){ if(o.plot) out.push({x:o.x,z:o.z,name:o.plot.name,plot:o.plot}); });
  else if(kind==="workplaces"||kind==="shops") Object.keys(store.workplaceAt||{}).forEach(function(k){
    var w=store.workplaceAt[k], wp=WP_BY_KEY[k]; if(kind==="shops"&&!(wp&&wp.ring==="markets")) return; out.push({x:w.x,z:w.z,name:k}); });
  else if(kind==="stations"){ (UNDERGROUND||[]).forEach(function(s){ out.push({x:s.x,z:s.z,name:s.name}); });
    cityObjs().forEach(function(o){ if(o.archetype==="tramstop") out.push({x:o.x,z:o.z,name:"the tram stop"}); }); }
  else if(kind==="temples") cityObjs().forEach(function(o){ var d=KIT[o.archetype], r=rr(o); if(d&&d.cat==="structure"&&r>660&&r<960&&Math.max(d.size[0],d.size[2])>9) out.push({x:o.x,z:o.z,name:o.label||o.name||"the house"}); });
  else if(kind==="gate") cityObjs().forEach(function(o){ if(rr(o)<140&&KIT[o.archetype]&&KIT[o.archetype].cat!=="being") out.push({x:o.x,z:o.z,name:o.label||"the plaza"}); });
  else if(kind==="gaol"){ var Y=store.gaolYard; if(Y) cityObjs().forEach(function(o){ if(/prisonwall|watchtower|brazier|crates/.test(o.archetype)&&Math.hypot(o.x-Y.x,o.z-Y.z)<80) out.push({x:o.x,z:o.z,name:"the yard"}); }); }
  else if(kind==="streets"){
    var P=camera.position, d=Math.hypot(P.x-ATLC.x,P.z-ATLC.z), best=null;
    Object.keys(ATL_STREETS).forEach(function(k){ ATL_STREETS[k].forEach(function(rs){ if(best===null||Math.abs(rs-d)<Math.abs(best-d)) best=rs; }); });
    var a0=Math.atan2(P.z-ATLC.z,P.x-ATLC.x);
    for(var i=-12;i<=12;i++){ var a=a0+i*30/best; out.push({x:ATLC.x+Math.cos(a)*best,z:ATLC.z+Math.sin(a)*best,name:"the street"}); }
  }
  else { var re=TARGET_RE[kind]; if(re) cityObjs().forEach(function(o){ if(re.test(o.archetype)) out.push({x:o.x,z:o.z,name:o.label||o.archetype}); }); }
  return out;
}
function pickStops(kinds,n){
  var P=camera.position, all=[];
  kinds.forEach(function(k){ all=all.concat(targetsFor(k)); });
  all.forEach(function(t){ t.d=Math.hypot(t.x-P.x,t.z-P.z); });
  var farLim=kinds.indexOf("sector")>-1?4000:420;       /* a rider's sector may be across the city: they fly */
  all=all.filter(function(t){ return t.d>12&&t.d<farLim; }).sort(function(a,b){ return a.d-b.d; });
  var out=[];
  for(var i=0;i<all.length&&out.length<n;i++){
    var t=all[i], far=out.every(function(q){ return Math.hypot(q.x-t.x,q.z-t.z)>25; });
    if(far) out.push(t);
  }
  if(out.length<n&&farLim<1000) targetsFor("streets").forEach(function(t){ if(out.length<n&&out.every(function(q){ return Math.hypot(q.x-t.x,q.z-t.z)>25; })) out.push(t); });
  return out;
}
function nearestNode(node,job){
  var re=NODE_RE[node], P=camera.position, w=wpAt(job.workplace), reach=wpReach(job.workplace), best=null, bd=1e9;
  if(re) cityObjs().forEach(function(o){
    if(!re.test(o.archetype)) return;
    if(w&&Math.hypot(o.x-w.x,o.z-w.z)>reach) return;
    var d=Math.hypot(o.x-P.x,o.z-P.z); if(d<bd){ bd=d; best=o; }
  });
  /* nothing of the kind by this workplace: the work is done at the workplace itself */
  if(!best&&w) best={x:w.x,z:w.z,label:job.workplace,fallback:true};
  return best;
}

/* ---- the panel ---- */
function workEl(){
  var el=document.getElementById("work"); if(el||!document.body) return el;
  var css=document.createElement("style");
  css.textContent="#work-btn{position:fixed;right:12px;bottom:calc(96px + env(safe-area-inset-bottom,0px));z-index:45;display:none;"+
    "background:rgba(10,12,18,.92);color:var(--bone);border:1px solid var(--gold,#C9A868);border-radius:3px;padding:9px 13px;font:13px var(--sans);cursor:pointer}"+
    "#work{position:fixed;right:12px;bottom:calc(140px + env(safe-area-inset-bottom,0px));z-index:46;display:none;width:min(400px,calc(100vw - 24px));max-height:min(66vh,620px);overflow:auto;"+
    "background:rgba(8,10,16,.96);border:1px solid var(--gold,#C9A868);border-radius:4px;padding:12px 14px;font:13px var(--sans);color:var(--bone)}"+
    "#work .job{border-top:1px solid var(--line,#2A2C34);padding-top:8px;margin-top:8px}"+
    "#work .tk{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:4px 0}"+
    "#work .bar{height:5px;background:#22252C;border-radius:3px;overflow:hidden;margin-top:2px}#work .bar i{display:block;height:5px;background:#C9A868}"+
    "#work-run{position:fixed;left:50%;bottom:calc(150px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:47;display:none;min-width:280px;max-width:calc(100vw - 24px);"+
    "background:rgba(8,10,16,.94);border:1px solid var(--gold,#C9A868);border-radius:4px;padding:10px 14px;font:13px var(--sans);color:var(--bone);text-align:center}"+
    "#work-run .bar{height:6px;background:#22252C;border-radius:3px;overflow:hidden;margin:8px 0 6px}#work-run .bar i{display:block;height:6px;background:#E8C27A}"+
    "#work-run .arrow{display:inline-block;font-size:22px;color:#E8C27A;transition:transform .15s}";
  document.head.appendChild(css);
  var b=document.createElement("button"); b.id="work-btn"; b.type="button"; b.textContent="Your work";
  b.onclick=function(){ WORK.open=!WORK.open; if(WORK.open) workRefresh(true); workPaint(); };
  document.body.appendChild(b);
  el=document.createElement("div"); el.id="work"; document.body.appendChild(el);
  var run=document.createElement("div"); run.id="work-run"; document.body.appendChild(run);
  return el;
}
function workRefresh(force){
  if(!(typeof signedIn==="function"&&signedIn())) return Promise.resolve(null);
  if(!force&&Date.now()-WORK.at<30000) return Promise.resolve(WORK.data);
  WORK.at=Date.now();
  return cityRpc("my_work").then(function(d){
    WORK.data=d||null;
    ((d&&d.services)||[]).forEach(function(r){ WORK.svc[r.key]=r.level; }); WORK.svcAt=Date.now();
    workPaint(); return d;
  }).catch(function(){ return null; });
}
function workPaint(){
  var el=workEl(); if(!el) return;
  var b=document.getElementById("work-btn"), jobs=(WORK.data&&WORK.data.jobs)||[];
  var show=inCityNow()&&jobs.length>0;
  b.style.display=show?"block":"none";
  if(!show||!WORK.open){ el.style.display="none"; return; }
  el.style.display="block";
  var h='<div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:14px">Your work</b>'+
    '<span><button class="btn" id="work-pay">Draw pay</button> <button class="btn" id="work-x">Close</button></span></div>'+
    '<div style="color:var(--dim);margin:6px 0 2px;line-height:1.5">Be at your post and do the work: pay is for the hours you were there <i>and</i> working.</div>';
  jobs.forEach(function(j,ji){
    var here=onSite(j), hunt=j.panel==="hunt";
    h+='<div class="job"><b>'+esc(j.title)+'</b> <span style="color:var(--dim)">· '+esc(j.workplace||"")+'</span><br>'+
      '<span style="color:'+(here?'#8FCB8A':'#C0603A')+'">'+(here?(j.roams?"On your rounds":"On site"):"Not at your post")+'</span>'+
      ' <span style="color:var(--dim)">· '+j.credit_min+' min of work done, '+j.at_work_min+' min on site since last paid</span>'+
      (j.quota?('<br><span style="color:var(--dim)">'+(hunt?"Nightmares faced":"Brought in")+': <b style="color:var(--bone)">'+j.units+'</b> · quota '+j.quota+' an hour · '+j.bonus+' gold for each over</span>'):'')+
      (!here&&!j.roams?' <button class="btn" data-way="'+esc(j.workplace)+'">Show me the way</button>':'');
    (j.tasks||[]).forEach(function(t,ti){
      h+='<div class="tk"><span>'+esc(t.task)+' <span style="color:var(--dim);font-size:12px">'+
        ({desk:"at your post",round:"rounds",gather:"gathering",hunt:"in the Wilds"}[t.kind]||"")+'</span></span>'+
        '<button class="btn" data-job="'+ji+'" data-task="'+ti+'"'+(WORK.busy?' disabled':'')+'>'+(t.kind==="hunt"?"Go":"Start")+'</button></div>';
    });
    h+='</div>';
  });
  var sv=(WORK.data&&WORK.data.services)||[];
  if(sv.length){
    h+='<div class="job"><b>What the city needs</b><div style="color:var(--dim);margin:2px 0 6px">Every service wears down by the hour unless somebody works at it.</div>';
    sv.slice().sort(function(a,b){ return a.level-b.level; }).forEach(function(s){
      h+='<div style="margin:4px 0"><span>'+esc(s.name)+'</span> <span style="color:var(--dim)">'+s.level+'%</span><div class="bar"><i style="width:'+s.level+'%;background:'+(s.level<30?'#C0603A':s.level<60?'#C9A868':'#8FCB8A')+'"></i></div></div>';
    });
    h+='</div>';
  }
  el.innerHTML=h;
  document.getElementById("work-x").onclick=function(){ WORK.open=false; workPaint(); };
  document.getElementById("work-pay").onclick=function(){ drawPay().then(function(){ workRefresh(true); }); };
  Array.prototype.forEach.call(el.querySelectorAll("[data-way]"),function(x){ x.onclick=function(){ showTheWay(x.getAttribute("data-way")); }; });
  Array.prototype.forEach.call(el.querySelectorAll("[data-task]"),function(x){ x.onclick=function(){
    var j=jobs[+x.getAttribute("data-job")], t=j.tasks[+x.getAttribute("data-task")]; workStart(j,t); }; });
}

/* ---- doing the work ---- */
function workStart(job,task){
  if(WORK.busy) return;
  if(typeof heldNow==="function"&&heldNow()) return setStatus("You are held. Work at the yard benches instead.");
  var B={job:job,task:task,t:0,need:task.secs,stops:null,i:0,node:null,ref:null};
  if(task.kind==="round"){
    var tgt=(JOBWORK_TARGETS[job.title]&&JOBWORK_TARGETS[job.title][task.task])||["streets"];
    B.stops=pickStops(tgt,JOBWORK_STOPS[job.title+"|"+task.task]||3);
    if(!B.stops.length) return setStatus("Nowhere to go for that just now.");
    var last=B.stops[B.stops.length-1]; B.ref=last.plot?last.plot.name:(last.name||null);
  }
  if((task.kind==="desk"||task.kind==="gather")&&!onSite(job)){
    setStatus("You have to be at <b>"+esc(job.workplace)+"</b> to do that. Follow the pointer.");
    showTheWay(job.workplace); return;
  }
  WORK.busy=B; WORK.open=false; workPaint(); workRunPaint();
}
function workCancel(why){ WORK.busy=null; var r=document.getElementById("work-run"); if(r) r.style.display="none"; if(why) setStatus(why); workPaint(); }
function workDone(){
  var B=WORK.busy; if(!B) return;
  B.sending=true; workRunPaint();
  cityRpc("do_task",{p_job:B.job.job_id,p_task:B.task.task,p_ref:B.ref}).then(function(o){
    WORK.busy=null; var r=document.getElementById("work-run"); if(r) r.style.display="none";
    if(!o||!o.ok){ setStatus(esc((o&&o.say)||"That did not count.")); workRefresh(true); return; }
    if(o.service) WORK.svc[o.service]=o.level;
    setStatus("<b>"+esc(B.task.task)+"</b> — done. "+Math.round(o.credit/60)+" minutes of work to your name"+
      (o.units&&o.stock?(", "+o.units+" "+esc(o.stock)+" brought in"):(o.units&&B.task.kind==="hunt"?", one more for the count":""))+
      (o.service?(". "+esc((WORK.data&&(WORK.data.services||[]).filter(function(s){ return s.key===o.service; })[0]||{}).name||o.service)+" stands at "+o.level+"%."):"."));
    workRefresh(true);
  }).catch(function(e){ WORK.busy=null; setStatus(esc(e.message)); });
}
function workRunPaint(){
  var el=document.getElementById("work-run"); if(!el) return;
  var B=WORK.busy; if(!B){ el.style.display="none"; return; }
  el.style.display="block";
  var h="<b>"+esc(B.task.task)+"</b>";
  if(B.sending) h+="<div style='margin-top:6px;color:var(--dim)'>Recording the work…</div>";
  else if(B.task.kind==="round"){
    var s=B.stops[B.i], P=camera.position, d=Math.hypot(s.x-P.x,s.z-P.z);
    var bearing=Math.atan2(s.x-P.x,s.z-P.z), rel=(bearing-(yaw+Math.PI))*180/Math.PI;
    h+="<div style='margin-top:6px'>Stop "+(B.i+1)+" of "+B.stops.length+": <b>"+esc(s.name)+"</b> · "+Math.round(d)+" m "+
      "<span class='arrow' style='transform:rotate("+(-rel).toFixed(0)+"deg)'>↑</span></div>";
  } else if(B.task.kind==="hunt"){
    h+="<div style='margin-top:6px;color:var(--dim)'>"+(inWilds()?"Find a nightmare and face it — walk up to one and press <b>H</b>.":"Go down past the Harvest Ring into the Nightmare Wilds.")+"</div>";
  } else {
    var pct=Math.min(100,B.t/B.need*100);
    if(B.task.kind==="gather"&&!B.atNode) h+="<div style='margin-top:6px;color:var(--dim)'>Go to "+esc(B.node?(B.node.label||B.node.archetype||"the work"):"the work")+
      (B.node&&!B.node.fallback?" · "+Math.round(Math.hypot(B.node.x-camera.position.x,B.node.z-camera.position.z))+" m":"")+"</div>";
    h+="<div class='bar'><i style='width:"+pct.toFixed(0)+"%'></i></div><span style='color:var(--dim)'>"+(B.paused?"Paused — come back to your post":"Working…")+"</span>";
  }
  h+="<div style='margin-top:6px'><button class='btn' id='work-stop'>Stop</button></div>";
  el.innerHTML=h;
  var st=document.getElementById("work-stop"); if(st) st.onclick=function(){ workCancel("Left off."); };
}
var workPaintAt=0, hunterNear=null;
function workTick(dt){
  workServices();
  if(typeof signedIn==="function"&&signedIn()&&inCityNow()&&!WORK.data&&Date.now()-WORK.at>30000) workRefresh(false);
  var b=document.getElementById("work-btn"); if(!b&&WORK.data&&(WORK.data.jobs||[]).length) workEl();
  workPaintAt-=dt;
  if(workPaintAt<=0){ workPaintAt=0.5; var bb=document.getElementById("work-btn"); if(bb) bb.style.display=(inCityNow()&&WORK.data&&(WORK.data.jobs||[]).length)?"block":"none"; }
  hunterTick();
  var B=WORK.busy; if(!B||B.sending) return;
  if(!inCityNow()){ workCancel("You left the city; the work is left off."); return; }
  var P=camera.position;
  if(B.task.kind==="desk"){
    B.paused=!onSite(B.job);
    if(!B.paused) B.t+=dt;
    if(B.t>=B.need){ workDone(); return; }
  } else if(B.task.kind==="gather"){
    if(!B.node||Math.random()<0.02) B.node=nearestNode(JOBWORK_NODE[B.job.title+"|"+B.task.task]||"crates",B.job);
    B.atNode=B.node&&(B.node.fallback?onSite(B.job):Math.hypot(B.node.x-P.x,B.node.z-P.z)<9);
    B.paused=!B.atNode;
    if(!B.paused) B.t+=dt;
    if(B.t>=B.need){ workDone(); return; }
  } else if(B.task.kind==="round"){
    var s=B.stops[B.i];
    if(Math.hypot(s.x-P.x,s.z-P.z)<7){ B.i++; if(B.i>=B.stops.length){ workDone(); return; } setStatus("<b>"+esc(s.name)+"</b> — done. On to the next."); }
  }
  if(workPaintAt<=0.01||B.task.kind==="round") workRunPaint();
}

/* ---- the hunt: a hunter may face any nightmare in the Wilds, day or night ---- */
function amHunter(){ return ((WORK.data&&WORK.data.jobs)||[]).some(function(j){ return j.panel==="hunt"; }); }
function hunterTick(){
  hunterNear=null;
  if(!amHunter()||!inWilds()||typeof nmOpen==="undefined"||nmOpen) return;
  var P=camera.position, list=store.wildsNightmares||[], best=null, bd=7;
  list.forEach(function(w){ var g=meshes[w.id]; if(!g||!g.visible||g.userData.nmGone) return;
    var d=Math.hypot(g.position.x-P.x,g.position.z-P.z); if(d<bd){ bd=d; best=w; } });
  hunterNear=best;
  if(best&&!WORK.huntSaid){ WORK.huntSaid=best.id; setStatus("A nightmare is close — press <b>H</b> to hunt it."); }
  if(!best) WORK.huntSaid=null;
}
if(typeof addEventListener==="function") addEventListener("keydown",function(e){
  if(/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||"")) return;
  if(e.code==="KeyH"&&hunterNear&&typeof openEncounter==="function"&&typeof wildChar==="function"){
    e.preventDefault(); openEncounter(wildChar(hunterNear,null));
  }
});
(function(){
  if(typeof defeatNightmare!=="function") return;
  var dn=defeatNightmare;
  defeatNightmare=function(c,way){
    var r=dn.apply(this,arguments);
    if(c&&c.wild&&amHunter()){
      var jobs=(WORK.data.jobs||[]).filter(function(j){ return j.panel==="hunt"; });
      var j=jobs[0], t=j&&(j.tasks||[]).filter(function(x){ return x.kind==="hunt"; })[0];
      if(j&&t){ WORK.busy={job:j,task:t,t:0,need:0,ref:c.objId||null}; workDone(); }
    }
    return r;
  };
})();
