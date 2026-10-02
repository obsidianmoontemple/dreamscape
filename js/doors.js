/* SomnuMatrix — doors.js
   the great hall of doors. every dreamer who accepts gets one, and the hall grows
   to hold them: the oldest doors nearest the middle, newer ones in wider rings,
   however many there come to be.
   a door carries only what its owner wrote on it — a name and a line. It opens on
   nobody's dreams. You may leave a light at somebody's door, and that is all
   anyone can do to a door that is not theirs.
   loaded as a plain script; shares scope with the other files */
"use strict";

var hallDoors=[], hallCount=0, hallAt=0, myDoor=null, hallBusy=false, lightCool=0;
var HALL_R0=46, HALL_GAP=12, HALL_PER=22;   // the first ring, the space between rings, doors in the first ring

/* where the nth door stands: rings that widen as the hall fills */
function doorPlace(n){
  /* the hall is a world of its own now: the rings simply widen, for ever */
  var ring=0, seen=0, per=HALL_PER;
  while(seen+per<=n){ seen+=per; ring++; per=HALL_PER+ring*8; }
  var i=n-seen, r=HALL_R0+ring*HALL_GAP, a=(i/per)*Math.PI*2+(ring%2?Math.PI/per:0);
  return {x:Math.cos(a)*r, z:Math.sin(a)*r, rot:-a+Math.PI/2, ring:ring};
}
function hallRings(count){ var n=0,ring=0,per=HALL_PER; while(n<count){ n+=per; ring++; per=HALL_PER+ring*8; } return ring; }

function restGet(path){
  var tok=(typeof signedIn==="function"&&signedIn())?session.access_token:DW_CONFIG.supabaseKey;
  return fetch(DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/"+path,{
    headers:{apikey:DW_CONFIG.supabaseKey,Authorization:"Bearer "+tok,"Content-Type":"application/json"}
  }).then(function(r){ return r.ok?r.json():null; });
}
function restRpc(name,body){
  var tok=(typeof signedIn==="function"&&signedIn())?session.access_token:DW_CONFIG.supabaseKey;
  return fetch(DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/rpc/"+name,{
    method:"POST",headers:{apikey:DW_CONFIG.supabaseKey,Authorization:"Bearer "+tok,"Content-Type":"application/json"},
    body:JSON.stringify(body||{})
  }).then(function(r){ return r.ok?r.json():null; });
}

/* bring the hall down and stand it up */
function fetchHall(){
  if(hallBusy||!cloudOn()||typeof fetch!=="function") return Promise.resolve(0);
  hallBusy=true;
  return restRpc("hall_of_doors",{p_from:0,p_count:1000}).then(function(rows){
    hallBusy=false;
    hallDoors=rows||[];
    hallCount=hallDoors.length;
    return restRpc("doors_standing").then(function(n){ hallCount=(typeof n==="number")?n:hallCount; return hallCount; });
  }).catch(function(){ hallBusy=false; return 0; });
}
function raiseHall(){
  var r=(typeof hallRealm==="function")?(hallRealm()||(typeof buildHall==="function"?buildHall():null)):null;
  if(!r) return 0;
  var h=blockOrigin(r.grid.bx,r.grid.bz);
  /* clear the dreamers' doors, keep the doors to the worlds */
  for(var i=store.objects.length-1;i>=0;i--){
    var o=store.objects[i];
    if(o.dreamerDoor){ if(meshes[o.id]){ scene.remove(meshes[o.id]); delete meshes[o.id]; } store.objects.splice(i,1); }
  }
  var mine=(typeof signedIn==="function"&&signedIn())?session.user.id:null;
  hallDoors.forEach(function(d,n){
    var p=doorPlace(n);
    var spec={id:uid(),archetype:"hubdoor",label:d.name,name:d.name,named:"stated",attrs:{c:d.colour||undefined},
      x:h.x+p.x*1.0,z:h.z+p.z*1.0,rot:p.rot,solid:true,detail:4,nights:[store.session],realm:r.id,
      dreamerDoor:d.user_id,doorLine:d.line||"",lights:d.lights||0,hub:true,
      note:(d.line?d.line+"\\n":"")+"A door in the great hall. "+(d.lights||0)+" lights left here."};
    if(mine&&d.user_id===mine){ spec.leadsTo="town"; spec.name=d.name+" \u2014 yours"; myDoor=spec; }
    store.objects.push(spec);
    if(typeof addMesh==="function") addMesh(spec);
  });
  save();
  return hallDoors.length;
}
/* the world-doors sit in the middle; the dreamers' doors stand in rings beyond them */
function openHall(){
  return fetchHall().then(function(){
    var n=raiseHall();
    if(n) setStatus("<b>The hall stands.</b> "+hallCount+" door"+(hallCount===1?"":"s")+", and the rings widen as more are taken.");
    return n;
  });
}

/* taking, changing, or giving up your own door */
function takeDoor(name,line,colour){
  if(!signedIn()) return Promise.reject(new Error("Sign in first \u2014 a door belongs to an account, not a browser."));
  return restRpc("take_door",{p_name:name,p_line:line||null,p_colour:colour||null}).then(function(out){
    if(out!=="ok") throw new Error(out||"That didn't take.");
    return openHall();
  });
}
function giveUpDoor(){
  if(!signedIn()) return Promise.reject(new Error("Sign in first."));
  return restRpc("give_up_door",{}).then(function(){ myDoor=null; return openHall(); });
}
/* leaving a light at somebody's door */
function leaveLight(spec){
  if(!spec||!spec.dreamerDoor||lightCool>0) return;
  lightCool=2;
  restRpc("leave_light",{p_door:spec.dreamerDoor}).then(function(n){
    if(typeof n==="number"){ spec.lights=n; setStatus("<b>A light left at "+esc(spec.name||"their door")+".</b> "+n+" now burn there."); }
    else setStatus("You cannot leave a light at your own door.");
  }).catch(function(){});
}
/* walking up to somebody else's door tells you what they wrote on it */
var doorNear=null;
function doorsTick(dt){
  if(lightCool>0) lightCool-=dt;
  if(!walkMode||store.inside) return;
  var P=camera.position, found=null;
  for(var i=0;i<store.objects.length;i++){
    var o=store.objects[i];
    if(!o.dreamerDoor||(o.realm||0)!==(store.here||0)) continue;
    if(Math.abs(o.x-P.x)>4||Math.abs(o.z-P.z)>4) continue;
    if(Math.hypot(o.x-P.x,o.z-P.z)<2.6){ found=o; break; }
  }
  if(found&&found!==doorNear){
    doorNear=found;
    var mine=(typeof signedIn==="function"&&signedIn())&&found.dreamerDoor===session.user.id;
    setStatus("<b>"+esc(found.name||"A door")+"</b>"+(found.doorLine?" \u2014 <i>"+esc(found.doorLine)+"</i>":"")+
      ". "+(mine?"Yours. Walk in to go home to your own town."
                 :(found.lights||0)+" lights left here. Press <b>L</b> to leave one."));
  } else if(!found&&doorNear){ doorNear=null; }
}

/* ---- what the dreamer sees in Settings ---- */
function doorPanel(){
  var el=document.getElementById("door-state"); if(!el) return;
  if(!signedIn()){ el.textContent="Sign in above to take a door in the great hall."; return; }
  el.innerHTML=myDoor
    ? "<b>Your door stands in the hall.</b> "+esc(myDoor.name||"")+(myDoor.lights?" \u2014 "+myDoor.lights+" lights left there.":"")
    : "You have no door yet. Take one and it joins the hall, however many there come to be.";
}
function initDoors(){
  var b;
  if((b=document.getElementById("door-take"))) b.onclick=function(){
    var nm=(document.getElementById("door-name").value||"").trim();
    var ln=(document.getElementById("door-line").value||"").trim();
    if(!nm) return setStatus("Give the door a name \u2014 yours, or one you dream under.");
    takeDoor(nm,ln,null).then(function(){ setStatus("<b>Your door stands in the hall of Somnucor.</b>"); doorPanel(); })
      .catch(function(e){ setStatus(esc(e.message)); });
  };
  if((b=document.getElementById("door-give"))) b.onclick=function(){
    if(!confirm("Give up your door? It comes down from the hall.")) return;
    giveUpDoor().then(function(){ setStatus("Your door has come down."); doorPanel(); })
      .catch(function(e){ setStatus(esc(e.message)); });
  };
  if((b=document.getElementById("door-hall"))) b.onclick=function(){
    openHall().then(function(){ if(typeof toHall==="function") toHall(); });
  };
  doorPanel();
  if(cloudOn()) setTimeout(function(){ openHall().then(doorPanel); },1500);
}
if(typeof addEventListener==="function") addEventListener("keydown",function(e){
  if(e.code==="KeyL"&&walkMode&&doorNear) leaveLight(doorNear);
});

