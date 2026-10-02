/* SomnuMatrix — housing.js
   where people live. Somnucor's neighbourhoods, each with its own grade of home:
   rooms over a shop in Saltmarket, flats in the Terraces, cottages and houses in
   the Old Quarter, grand houses along Northgate, hotels for those not staying.
   Every plot is a lot in the city's books. Walk up to the board on it and you
   can see what it costs, take the lease, or buy it outright. The server decides
   whether you can — the sign only asks.
   loaded as a plain script; shares scope with the other files */
"use strict";

var HOUSE_BUILD=2;

/* a neighbourhood: where it lies, what stands in it, and what such a place costs.
   price is what the realtor asks to sell; rent is by the week. */
var NEIGHBOURHOODS=[
 {name:"Saltmarket", at:3.30, r:250, kind:"home", grade:"rooms",
  note:"Rooms over the shops. Cheap, loud, and near everything.",
  homes:["shanty","shanty","tenementblock","tenementblock","shanty"],
  price:[2600,4200], rent:[90,150], ground:null, dress:["washing","firebarrel","crates","barrel"]},

 {name:"The Terraces", at:5.60, r:340, kind:"home", grade:"flat",
  note:"Flats stacked six deep, and a bench outside every door.",
  homes:["apartment","apartment","tenementblock","apartment","apartment","apartment"],
  price:[7000,12000], rent:[210,340], ground:"groundpad", dress:["bench","streetlight","trashcan","bicycle","hedge"]},

 {name:"The Old Quarter", at:0.00, r:300, kind:"home", grade:"house",
  note:"Cottages and houses, the oldest streets in the city.",
  homes:["cottage","house","cottage","house","cottage","house","farmhouse"],
  price:[14000,26000], rent:[380,620], ground:"lawn", dress:["fence","hedge","flowers","tree","well"]},

 {name:"Lantern Street", at:0.35, r:430, kind:"home", grade:"house",
  note:"Machiya and hanok under strung lanterns, with gardens behind.",
  homes:["machiya","hanok","machiya","teahouse","hanok"],
  price:[16000,30000], rent:[420,680], ground:"groundpad", dress:["redlanterns","bonsai","koipond","hedge"]},

 {name:"The Riad Quarter", at:1.80, r:400, kind:"home", grade:"house",
  note:"Blank walls to the street, and a fountain in every court.",
  homes:["riad","hacienda","riad","cycladic"],
  price:[18000,34000], rent:[460,720], ground:"groundpad", dress:["tiledfountain","palm","marketawning"]},

 {name:"Northgate", at:6.00, r:520, kind:"home", grade:"grand",
  note:"Great houses behind gates, with ground enough to lose somebody in.",
  homes:["manor","manor","palace","castle","manor"],
  price:[90000,320000], rent:[1600,4800], ground:"lawn", dress:["fence","tree","tree","fountain","statue","pergola","hedge"]},

 {name:"Bellwater", at:4.75, r:470, kind:"home", grade:"house",
  note:"Quiet streets by the water, and a longer walk to work.",
  homes:["house","cottage","stilthouse","house","izba"],
  price:[15000,28000], rent:[400,640], ground:"lawn", dress:["reeds","pond","tree","fence","bench"]},

 {name:"The Warrens", at:2.60, r:280, kind:"home", grade:"rooms",
  note:"What the city would rather you did not see. It houses people all the same.",
  homes:["shanty","shanty","shanty","ruin","shanty"],
  price:[1400,2600], rent:[50,95], ground:null, dress:["firebarrel","scrapheap","washing","barrel"]},

 {name:"The Hotels", at:1.20, r:360, kind:"business", grade:"hotel",
  note:"For those not staying. Rooms by the week, and somebody at the desk.",
  homes:["hotel","motel","hotel","hotel"],
  price:[60000,140000], rent:[900,2200], ground:"groundpad", dress:["streetlight","bench","hedge","busstop"]}
];

function inBand(band,t){ return Math.round(band[0]+(band[1]-band[0])*t); }

/* the housing, standing in the world. the lots themselves live in the city's books. */
/* buildHousing() now lives in atlantis-city.js, which stands the whole ringed city up in one piece */

/* ---------------------------------------------------- the Employee & Backer District */
/* a neighbourhood like any other to walk through and see — real houses,
   real addressed plots, signboards the same as everywhere else — except
   that nobody buys or leases one on the open market. Who lives here is a
   power the penthouse holds (see schema-update-17): a keeper, or whoever
   currently holds the penthouse, assigns a dreamer to a numbered plot, the
   same way an office is assigned rather than sold. */
/* the "manor neighbourhood" for the sixty-and-more desks in the Tower,
   and for backers — grand housing stock, the same archetypes Northgate
   already builds its own "grand" grade from (manor, palace, castle), not
   the plain house/cottage/apartment mix a first pass gave it. sixty-six
   plots, comfortably past the sixty desks the Tower already has, with
   room in the cycle to grow past that without a rewrite: raise
   DISTRICT_ROWS and the list grows with it. */
var DISTRICT_AT=5.05, DISTRICT_R=520, DISTRICT_BUILD=2;
var DISTRICT_CYCLE=["manor","manor","palace","manor","manor","castle"];
var DISTRICT_TOTAL=72, DISTRICT_ROW_CAP=24;   // 72 plots in rows of 24, well past 60
var DISTRICT_HOMES=(function(){
  var out=[]; for(var i=0;i<DISTRICT_TOTAL;i++) out.push(DISTRICT_CYCLE[i%DISTRICT_CYCLE.length]);
  return out;
})();
/* how far out the District's own block actually reaches, worked out from
   nothing but its own static numbers (how many homes it holds, and the
   fixed sizes the catalogue already gives manor/palace/castle) — read by
   somnucor-city.js's cityOutward() so the ring grows to meet the District
   if it's ever given more than seventy-two plots, instead of the District
   quietly drifting past a ring that stopped watching it */
function districtReach(){
  if(typeof KIT==="undefined") return 0;
  var widest=0; DISTRICT_CYCLE.forEach(function(a){ if(KIT[a]) widest=Math.max(widest,KIT[a].size[0],KIT[a].size[2]); });
  var step=Math.max(60,widest*1.15), rowGap=widest*0.62+70;
  var rowsNeeded=Math.ceil(DISTRICT_HOMES.length/DISTRICT_ROW_CAP);
  var maxPer=Math.ceil(DISTRICT_ROW_CAP/2), span=maxPer*step;
  var along0=(rowsNeeded-1)*rowGap, depth=widest*0.55+18;
  var rr=DISTRICT_R+along0+depth;
  return Math.hypot(rr,span/2+20);
}
/* buildEmployeeDistrict() now lives in atlantis-city.js, which stands the whole ringed city up in one piece */
/* entering the District's own plots in the books — never for sale, never
   to let, exactly like an office: assigned, not bought */
function sectionDistrict(){
  if(!signedIn()) return Promise.reject(new Error("Sign in first."));
  var plots=(store.districtPlots||[]);
  if(!plots.length) return Promise.reject(new Error("There is no District laid out yet."));
  var done=0, failed=0;
  function one(i){
    if(i>=plots.length){
      setStatus("<b>"+done+" District plots entered in the books.</b>"+(failed?(" "+failed+" were refused."):""));
      return loadLots();
    }
    var p=plots[i];
    return cityRpc("section_lot",{p_name:p.name,p_quarter:p.quarter,p_kind:"district",p_x:p.x,p_z:p.z,p_w:30,p_d:30})
      .then(function(id){ done++; return cityRpc("price_lot",{p_lot:id,p_price:0,p_rent:0,p_sale:false,p_let:false}); })
      .catch(function(){ failed++; })
      .then(function(){ return one(i+1); });
  }
  setStatus("Entering the District's plots in the books…");
  return one(0);
}

/* the realtor's work: entering these plots in the city's books, once */
function sectionHousing(){
  if(!signedIn()) return Promise.reject(new Error("Sign in first."));
  var plots=(store.plots||[]);
  if(!plots.length) return Promise.reject(new Error("There are no plots laid out yet."));
  var done=0, failed=0;
  function one(i){
    if(i>=plots.length){
      setStatus("<b>"+done+" plots entered in the books.</b>"+(failed?(" "+failed+" were refused."):""));
      return loadLots();
    }
    var p=plots[i];
    return cityRpc("section_lot",{p_name:p.name,p_quarter:p.quarter,p_kind:p.kind,
        p_x:p.x,p_z:p.z,p_w:34,p_d:34})
      .then(function(id){
        done++;
        return cityRpc("price_lot",{p_lot:id,p_price:p.price,p_rent:p.rent,p_sale:true,p_let:true});
      })
      .catch(function(){ failed++; })
      .then(function(){ return one(i+1); });
  }
  setStatus("Entering the plots in the books\u2026");
  return one(0);
}

/* what the books say, so a board can show it */
var cityLots=[], lotsAt=0;
function loadLots(){
  if(!signedIn()) return Promise.resolve([]);
  if(Date.now()-lotsAt<20000&&cityLots.length) return Promise.resolve(cityLots);
  return cityRpc("lot_board").then(function(rows){ cityLots=rows||[]; lotsAt=Date.now(); applyLotDecor(); return cityLots; })
    .catch(function(){ return []; });
}
function lotByName(name){
  for(var i=0;i<cityLots.length;i++) if(cityLots[i].name===name) return cityLots[i];
  return null;
}
/* the same city for everyone: what somebody has actually raised on their
   own ground is read here and redrawn on the actual building, for every
   dreamer who walks past it — not only the one who built it. raise_
   building() and dress_lot() already check server-side that only a lot's
   own owner or tenant can change it (schema-update-12 and schema-update-7);
   this is the other half, reading what they changed back out again. */
function applyLotDecor(){
  var plots=(store.plots||[]).concat(store.districtPlots||[]);
  if(!plots.length||!cityLots.length) return;
  plots.forEach(function(p){
    var rec=lotByName(p.name); if(!rec||!rec.decor) return;
    var built=rec.decor.built;
    if(built&&KIT[built]&&built!==p.archetype&&p.homeId){
      var home=store.objects.filter(function(o){ return o.id===p.homeId; })[0];
      if(home){ home.archetype=built; p.archetype=built; if(typeof refresh==="function") refresh(home); }
    }
  });
}
/* lot_board() doesn't say who holds a lot, only that it is held — "yours" is
   read off my_standing()'s own lots list, which city.js keeps in `standing` */
function ownLot(lotId){
  return !!(typeof standing!=="undefined"&&standing&&(standing.lots||[]).some(function(l){ return l.lot_id===lotId&&l.own; }));
}

/* standing at a board */
var plotNear=null, plotCool=0;
function housingTick(dt){
  if(plotCool>0) plotCool-=dt;
  if(!walkMode||store.inside){ plotNear=null; return; }
  var P=camera.position, found=null;
  for(var i=0;i<store.objects.length;i++){
    var o=store.objects[i];
    if(!o.plot||(o.realm||0)!==(store.here||0)) continue;
    if(Math.abs(o.x-P.x)>7||Math.abs(o.z-P.z)>7) continue;
    if(Math.hypot(o.x-P.x,o.z-P.z)<3.6){ found=o; break; }
  }
  if(found&&found!==plotNear){
    plotNear=found;
    var rec=lotByName(found.plot.name), p=found.plot;
    var held=rec&&rec.held;
    var mine=rec&&ownLot(rec.lot_id);
    setStatus("<b>"+esc(p.name)+"</b> \u2014 "+esc(p.quarter)+". "+
      (held?(mine?"Yours. Press <b>G</b> to raise something new on it, <b>D</b> to dress it.":"Taken.")
           :("To buy <b>"+p.price.toLocaleString()+" gold</b>, or <b>"+p.rent.toLocaleString()+
             " a week</b> to rent. Press <b>B</b> to buy, <b>R</b> to take the lease.")));
    loadLots();
  } else if(!found&&plotNear) plotNear=null;
}
if(typeof addEventListener==="function") addEventListener("keydown",function(e){
  if(/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||"")) return;
  if(!plotNear||plotCool>0) return;
  var rec=lotByName(plotNear.plot.name);
  if(!rec) { setStatus("That plot is not in the books yet. The realtor must enter it first."); return; }
  if(e.code==="KeyB"){ plotCool=1; buyLot(rec.lot_id).then(function(){ lotsAt=0; loadLots(); }); }
  if(e.code==="KeyR"){ plotCool=1; takeLease(rec.lot_id).then(function(){ lotsAt=0; loadLots(); }); }
  if(e.code==="KeyG"){ plotCool=1; offerToRaise(rec,plotNear); }
  if(e.code==="KeyD"){ plotCool=1; offerToDress(rec,plotNear); }
});

/* ---------------------------------------------------------- raising and dressing your own ground */
var buildCostsCache=null;
function loadBuildCosts(){
  if(buildCostsCache) return Promise.resolve(buildCostsCache);
  return freshToken().then(function(tok){
    return fetch(DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/build_costs?select=archetype,kind,amount&order=archetype",{
      headers:{apikey:DW_CONFIG.supabaseKey,Authorization:"Bearer "+(tok||DW_CONFIG.supabaseKey)}
    }).then(function(r){ return r.ok?r.json():[]; });
  }).then(function(rows){
    var byArch={};
    (rows||[]).forEach(function(r){ (byArch[r.archetype]=byArch[r.archetype]||[]).push(r); });
    buildCostsCache=byArch;
    return byArch;
  }).catch(function(){ return {}; });
}
function offerToRaise(rec,board){
  if(!rec||!ownLot(rec.lot_id)) return setStatus("Only ground you hold can be built on.");
  loadBuildCosts().then(function(byArch){
    var archs=Object.keys(byArch);
    if(!archs.length) return setStatus("Nobody knows how to build anything here yet.");
    var menu=archs.map(function(a,i){
      return (i+1)+". "+a+" ("+byArch[a].map(function(c){ return c.amount+" "+c.kind; }).join(", ")+")";
    }).join("\n");
    var pick=(prompt("Raise what on "+rec.name+"?\n\n"+menu+"\n\nType the name:")||"").trim().toLowerCase();
    if(!pick||archs.indexOf(pick)<0) return;
    raiseBuilding(rec.lot_id,pick,board);
  });
}
function raiseBuilding(lotId,archetype,board){
  return cityRpc("raise_building",{p_lot:lotId,p_archetype:archetype}).then(function(o){
    if(o!=="ok"){ setStatus(esc(String(o))); return; }
    setStatus("<b>Raised.</b> "+esc(archetype)+" now stands there.");
    if(board&&board.plot&&board.plot.homeId&&KIT[archetype]){
      var home=store.objects.filter(function(x){ return x.id===board.plot.homeId; })[0];
      if(home){ home.archetype=archetype; if(typeof refresh==="function") refresh(home); if(typeof save==="function") save(); }
      board.plot.archetype=archetype;
    }
    lotsAt=0; return loadLots();
  }).catch(function(e){ setStatus(esc(e.message)); });
}
function offerToDress(rec,board){
  if(!rec||!ownLot(rec.lot_id)) return setStatus("Only ground you hold can be dressed.");
  var choice=(prompt("Dress "+rec.name+" with what? A word or two \u2014 it is remembered on the lot.")||"").trim();
  if(!choice) return;
  dressLot(rec.lot_id,choice);
}
function dressLot(lotId,note){
  /* decor is shared with raise_building's {built:archetype} flag \u2014 read, merge, then write */
  return freshToken().then(function(tok){
    return fetch(DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/lots?select=decor&id=eq."+lotId,{
      headers:{apikey:DW_CONFIG.supabaseKey,Authorization:"Bearer "+(tok||DW_CONFIG.supabaseKey)}
    }).then(function(r){ return r.ok?r.json():[]; });
  }).then(function(rows){
    var decor=(rows&&rows[0]&&rows[0].decor)||{};
    decor.dressed=note;
    return cityRpc("dress_lot",{p_lot:lotId,p_decor:decor});
  }).then(function(o){
    setStatus(o==="ok"?"<b>Dressed.</b>":esc(String(o)));
    lotsAt=0; return loadLots();
  }).catch(function(e){ setStatus(esc(e.message)); });
}

/* ---------------------------------------------------------------- the yard */
/* The transport lot: everything the city sells to get about on, standing in rows
   with a price board at each. Walk up and buy it where it stands. */
var YARD_BUILD=1;
/* buildYard() now lives in atlantis-city.js, which stands the whole ringed city up in one piece */

/* standing before something for sale in the yard */
var yardNear=null, yardCool=0, yardPrices=null;
function yardTick(dt){
  if(yardCool>0) yardCool-=dt;
  if(!walkMode||store.inside){ yardNear=null; return; }
  var P=camera.position, found=null;
  for(var i=0;i<store.objects.length;i++){
    var o=store.objects[i];
    if(!o.forSale||(o.realm||0)!==(store.here||0)) continue;
    if(Math.abs(o.x-P.x)>7||Math.abs(o.z-P.z)>7) continue;
    if(Math.hypot(o.x-P.x,o.z-P.z)<3.6){ found=o; break; }
  }
  if(found&&found!==yardNear){
    yardNear=found;
    yardLook(found.forSale).then(function(item){
      if(!item) return setStatus("<b>"+esc(found.forSale)+"</b> — the yard has no price on it yet.");
      setStatus("<b>"+esc(item.name)+"</b> — "+item.price.toLocaleString()+" gold"+
        (item.speed?(", "+(+item.speed).toFixed(1)+" times your own pace"):"")+
        (item.note?(". "+esc(item.note)):"")+". Press <b>B</b> to buy it.");
    });
  } else if(!found&&yardNear) yardNear=null;
}
function yardLook(name){
  if(yardPrices) return Promise.resolve(yardPrices[name]||null);
  return freshToken().then(function(tok){
    return fetch(DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/catalogue?select=id,name,price,speed,note&listed=eq.true",{
      headers:{apikey:DW_CONFIG.supabaseKey,Authorization:"Bearer "+(tok||DW_CONFIG.supabaseKey)}
    }).then(function(r){ return r.ok?r.json():[]; });
  }).then(function(rows){
    yardPrices={}; (rows||[]).forEach(function(r){ yardPrices[r.name]=r; });
    return yardPrices[name]||null;
  }).catch(function(){ return null; });
}
if(typeof addEventListener==="function") addEventListener("keydown",function(e){
  if(/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||"")) return;
  if(e.code!=="KeyB"||!yardNear||yardCool>0) return;
  yardCool=1.2;
  yardLook(yardNear.forSale).then(function(item){
    if(!item) return setStatus("The yard cannot price that yet.");
    if(typeof buyItem==="function") buyItem(item.id,null);
  });
});

/* ---------------------------------------------------------- the ground works */
/* The quarries and the stands: where the city's stone and timber come from.
   They lie beyond the last ring road, because nobody wants a pit for a neighbour. */
var WORKS_BUILD=1;
/* buildGroundWorks() now lives in atlantis-city.js, which stands the whole ringed city up in one piece */

