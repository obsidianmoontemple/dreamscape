/* SomnuMatrix — temple-row.js
   Temple Row, a real quarter of Somnucor itself — two hundred and seventy-five
   houses, one for every deity the Atlas knows, in six-and-twenty precincts,
   each precinct in the manner of its own tradition. Every temple has a candle
   stand you may light, an incense burner whose wisps rise while it is lit,
   and an offering bowl.
   It stands exactly where the city's own plan already marks "Temple Row" —
   at the bearing and ring the Somnucor Tower's QUARTERS list has always used
   for it — and runs on outward from there along that same bearing, the way
   the Quarry and the Long Stand run outward from theirs when a district
   needs more room than its wedge of the ring has to spare. It is built into
   the very same realm as the rest of Somnucor, at the city's own origin,
   with the city's own put() pattern — not a separate world behind a portal.
   Walk to it like anywhere else in the city; "Go there" from The Land is
   only ever a shortcut, never the only way in.
   What is left in a bowl is left; nothing here asks anything of anybody, and
   no deity is bought. The count of candles is kept because people like to
   see that others have stood there too.
   loaded as a plain script; shares scope with the other files */
"use strict";

var ROW_GAP=36, ROW_BUILD=8;
/* where the city's own plan has always marked this quarter: the bearing and
   ring radius from somnucor-city.js's QUARTERS scheme (at:0.70, r:360) */
var ROW_AT=0.70, ROW_R0=360, ROW_ENTRY=150;
/* the Row used to be two columns marching straight outward for as long as
   275 houses took to lay down — its far end came out more than two and a
   half times farther from the city's own centre than anything else in
   Somnucor, quarry and timber stand included, so nobody walking the city
   would ever casually reach it. It is laid out now as a genuine block:
   several lanes side by side, each holding a handful of precincts stacked
   outward on its own, so the whole district's reach stays close to the
   rest of the city instead of one line running off the map. */
var ROW_LANES=9, ROW_LANE_GAP=30, ROW_PRECINCT_GAP=24;

/* the shape a tradition builds in — from what the Atlas already knows how to make */
var PRECINCT={
  Greek:{house:"temple",ground:"groundpad",trim:0xE8E4DA,note:"Olympos, and the older powers under it"},
  Roman:{house:"temple",ground:"groundpad",trim:0xE0D8C4,note:"The state gods, and the household ones"},
  Norse:{house:"longhouse",ground:"snowfield",trim:0x8A6A44,note:"Asgard's own, and the giants' kin"},
  Egyptian:{house:"ziggurat",ground:"groundpad",trim:0xE8C27A,note:"The Two Lands, and the hall of judgement"},
  Yoruba:{house:"roundhouse",ground:"lawn",trim:0xC8763A,note:"The orisha, and the roads between"},
  Irish:{house:"roundhouse",ground:"lawn",trim:0x3F7A3A,note:"The Tuatha Dé Danann"},
  Welsh:{house:"roundhouse",ground:"lawn",trim:0x4A7A5A,note:"Annwn, and the houses of the old tales"},
  Gaulish:{house:"roundhouse",ground:"lawn",trim:0x6A8A4A,note:"What the Romans wrote down, and what they did not"},
  Chinese:{house:"pagoda",ground:"groundpad",trim:0xB03A2E,note:"The celestial bureaucracy, and the immortals"},
  Hindu:{house:"mandir",ground:"groundpad",trim:0xE8A63A,note:"The devas, and the great forms"},
  Japanese:{house:"torii",ground:"zengarden",trim:0xC0392B,note:"The kami, at their own gates"},
  Mesopotamian:{house:"ziggurat",ground:"groundpad",trim:0xC8A882,note:"Sumer, Akkad, and what came after"},
  Aztec:{house:"ziggurat",ground:"groundpad",trim:0x2E8A6A,note:"The fifth sun, and its keepers"},
  Maya:{house:"ziggurat",ground:"lawn",trim:0x3A8A5A,note:"The long count, and the hero twins"},
  Inca:{house:"ziggurat",ground:"groundpad",trim:0xD4B83C,note:"The sun, the mountains, and the dead"},
  Slavic:{house:"izba",ground:"snowfield",trim:0x7A5230,note:"The old ones of the forests and the hearth"},
  Akan:{house:"roundhouse",ground:"lawn",trim:0xD4B83C,note:"Nyame, and the spider who told the stories"},
  Hawaiian:{house:"stilthouse",ground:"lawn",trim:0x2E8A8A,note:"The islands, and the fire beneath them"},
  Polynesian:{house:"stilthouse",ground:"lawn",trim:0x2E8A8A,note:"The long voyages, and what was found"},
  Vodou:{house:"shrine",ground:"groundpad",trim:0x8A2A6A,note:"The lwa, and the crossroads"},
  Persian:{house:"mandir",ground:"groundpad",trim:0xC8A040,note:"The light, and what stands against it"},
  Demonology:{house:"crypt",ground:null,trim:0x6A1A1A,note:"Named here because they were named elsewhere first"},
  Qliphothic:{house:"crypt",ground:null,trim:0x3A1A4A,note:"The shells, and the husks of the tree"},
  Adversarial:{house:"crypt",ground:null,trim:0x4A1A2A,note:"Those who refused, in every telling"},
  "Anglo-Saxon":{house:"longhouse",ground:"lawn",trim:0x8A7A4A,note:"What survived in charms and place-names"},
  Hebrew:{house:"temple",ground:"groundpad",trim:0xC9A868,note:"The name, and the hosts about it"}
};

/* Temple Row is the Somnucor realm itself now — there is no realm of its own
   any more to look up */
function templeRowRealm(){ return (typeof somnucorRealm==="function")?somnucorRealm():null; }
function candleCount(key){
  try{ return +((JSON.parse(localStorage.getItem("somnu.candles")||"{}"))[key]||0); }catch(e){ return 0; }
}
function lightCandle(key,name){
  var all={};
  try{ all=JSON.parse(localStorage.getItem("somnu.candles")||"{}"); }catch(e){}
  all[key]=(all[key]||0)+1;
  try{ localStorage.setItem("somnu.candles",JSON.stringify(all)); }catch(e){}
  setStatus("<b>A candle lit at the house of "+esc(name)+".</b> "+all[key]+" from you, so far.");
  return all[key];
}
/* what is left in a bowl goes to the temple's own keeping, not to anybody's purse */
function leaveOffering(key,name,howMuch){
  if(typeof signedIn!=="function"||!signedIn()) { setStatus("An offering is left by account, so it can be remembered."); return; }
  cityRpc("move_offering",{p_deity:key,p_gold:howMuch}).then(function(o){
    setStatus(o==="ok"?("<b>Left at the bowl of "+esc(name)+".</b> Nothing is asked in return.")
                      :esc(String(o)));
    if(typeof refreshStanding==="function") refreshStanding();
  }).catch(function(){ setStatus("The bowl is not ready yet — run schema-update-10."); });
}

/* buildTempleRow() now lives in atlantis-city.js, which stands the whole ringed city up in one piece */
function toTempleRow(){
  var r=templeRowRealm()||buildTempleRow();
  if(!r) return;
  if(typeof beHere==="function") beHere(r.id);
  if(typeof atlRefresh==="function") atlRefresh();
  /* the foot of the great stairway down from the High Ring, where the Row begins */
  var T=(typeof atlRing==="function")?atlRing("temples"):null, a=0.19, rr=T?T.S+ATL_STAIR_RUN+14:700;
  var gx=(ATLC?ATLC.x:0)+Math.cos(a)*rr, gz=(ATLC?ATLC.z:0)+Math.sin(a)*rr;
  if(walkMode) camera.position.set(gx,1.72,gz);
  else if(typeof visitRealm==="function") visitRealm(r.id);
  setStatus("<b>Temple Row.</b> A house for every power the Atlas knows. Light a candle, or leave what you wish.");
}

/* standing before a house: the candle, the incense, the bowl */
var rowNear=null, rowCool=0;
function templeTick(dt){
  if(rowCool>0) rowCool-=dt;
  if(!walkMode||store.inside){ rowNear=null; return; }
  var P=camera.position, found=null;
  for(var i=0;i<store.objects.length;i++){
    var o=store.objects[i];
    if(!o.deity||(o.realm||0)!==(store.here||0)) continue;
    if(Math.abs(o.x-P.x)>6||Math.abs(o.z-P.z)>6) continue;
    if(Math.hypot(o.x-P.x,o.z-P.z)<3.4){ found=o; break; }
  }
  if(found&&found!==rowNear){
    rowNear=found;
    var d=DEITY[found.deity]||{name:found.deity};
    var lit=candleCount(found.deity);
    setStatus("<b>"+esc(d.name)+"</b>"+(d.domains?" — "+esc(d.domains):"")+
      ". Press <b>C</b> to light a candle"+(lit?(" ("+lit+" so far)"):"")+
      ", <b>O</b> to leave something in the bowl, <b>T</b> to see what the bowl holds.");
  } else if(!found&&rowNear) rowNear=null;
}
function templeStanding(key,name){
  return cityRpc("temple_standing",{p_deity:key}).then(function(s){
    if(!s||!s.offerings) return setStatus("Nothing left at "+esc(name)+"'s house yet.");
    setStatus("<b>"+esc(name)+"</b> — "+s.offerings+" offering"+(s.offerings===1?"":"s")+
      " left over time, "+gold(s.gold||0)+" in all"+
      (s.waiting?(", "+gold(s.waiting)+" still waiting in the bowl"):"")+".");
  }).catch(function(e){ setStatus(esc(e.message)); });
}
if(typeof addEventListener==="function") addEventListener("keydown",function(e){
  if(/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||"")) return;
  if(!rowNear||rowCool>0) return;
  var d=DEITY[rowNear.deity]||{name:rowNear.deity};
  if(e.code==="KeyC"){ rowCool=0.6; lightCandle(rowNear.deity,d.name); }
  if(e.code==="KeyO"){
    rowCool=0.6;
    var n=+(prompt("How much to leave in the bowl of "+d.name+"?")||0);
    if(n>0) leaveOffering(rowNear.deity,d.name,Math.floor(n));
  }
  if(e.code==="KeyT"){ rowCool=0.6; templeStanding(rowNear.deity,d.name); }
});

