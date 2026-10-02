/* SomnuMatrix — joining.js
   Somnucor is somewhere you may go, not somewhere you are put. Until a dreamer
   says yes, none of it is built: no city, no hall, no Temple Row, no housing,
   no yard, and nothing of theirs is sent anywhere. The Atlas is whole without it.
   Saying yes builds it. Saying no again takes it down and leaves the dreamscape
   exactly as it was.
   loaded as a plain script; shares scope with the other files */
"use strict";

function joinedSomnucor(){ return cfg().somnucor===true; }

/* what the city is, said plainly, before anybody agrees to it */
var JOIN_WORDS=
  "Somnucor is a city every dreamer shares: work, wages, a bank, ground to hold, "+
  "a hall where every dreamer has a door, and Temple Row. It is entirely optional. "+
  "The Atlas works exactly as it does now without it, and your own dreamscape is "+
  "yours either way \u2014 nothing you dream is sent anywhere by joining.";

function joinSomnucor(){
  var c=cfg(); c.somnucor=true; setCfg(c);
  setStatus("<b>Building Somnucor\u2026</b> this takes a moment, once.");
  /* built in the order things lean on each other */
  setTimeout(function(){
    if(typeof buildSomnucorCity==="function") buildSomnucorCity();
    if(typeof buildHall==="function") buildHall();
    if(typeof buildTempleRow==="function") buildTempleRow();
    if(typeof buildHousing==="function") buildHousing();
    if(typeof buildEmployeeDistrict==="function") buildEmployeeDistrict();
    if(typeof buildYard==="function") buildYard();
    if(typeof buildGroundWorks==="function") buildGroundWorks();
    /* whatever anybody else has already raised or dressed on their own
       ground, read back and redrawn now — not only once you happen to
       walk up to that one plot's own board */
    if(typeof loadLots==="function"&&typeof signedIn==="function"&&signedIn()) loadLots();
    if(typeof renderRealmList==="function") renderRealmList();
    if(typeof paintJoin==="function") paintJoin();
    save();
    setStatus("<b>Somnucor stands.</b> The city, the Hall of Doors and Temple Row are in The land.");
  },50);
}
/* leaving takes the city down. it does not touch the dreamer's own world, their
   account, their gold or their door — those are theirs whether they visit or not. */
function leaveSomnucor(){
  /* Temple Row is not its own realm kind any more — its houses live under
     the "somnucor" realm itself, so taking that down takes them with it */
  var kinds={somnucor:1,hall:1};
  var ids={};
  realms().forEach(function(r){ if(kinds[r.kind]) ids[r.id]=1; });
  for(var i=store.objects.length-1;i>=0;i--){
    var o=store.objects[i];
    if(!ids[o.realm||0]) continue;
    if(typeof meshes!=="undefined"&&meshes[o.id]){ scene.remove(meshes[o.id]); delete meshes[o.id]; }
    store.objects.splice(i,1);
  }
  for(var c2=store.characters.length-1;c2>=0;c2--){
    var ch=store.characters[c2];
    if(ch.objId&&!specById(ch.objId)) store.characters.splice(c2,1);
  }
  var R=realms();
  for(var k=R.length-1;k>=0;k--) if(kinds[R[k].kind]) R.splice(k,1);
  if(ids[store.here||0]) beHere(0);
  store.plots=[];
  var c=cfg(); c.somnucor=false; setCfg(c);
  if(typeof renderRealmList==="function") renderRealmList();
  paintJoin(); save();
  setStatus("<b>Somnucor is gone from your Atlas.</b> Your own dreamscape is exactly as it was.");
}

function paintJoin(){
  var el=document.getElementById("join-state"); if(!el) return;
  var on=joinedSomnucor();
  el.innerHTML=on
    ? "<b>You are in Somnucor.</b> The city, the Hall of Doors and Temple Row are in The land."
    : "<span style='color:var(--dim)'>You have not joined. Nothing of the city is built, and nothing of yours goes anywhere.</span>";
  var b=document.getElementById("join-btn");
  if(b) b.textContent=on?"Leave Somnucor":"Join Somnucor";
}
function initJoin(){
  var b=document.getElementById("join-btn");
  if(b) b.onclick=function(){
    if(joinedSomnucor()){
      if(confirm("Take Somnucor down? Your own dreamscape, your account and your door are untouched.")) leaveSomnucor();
    } else joinSomnucor();
  };
  paintJoin();
}

