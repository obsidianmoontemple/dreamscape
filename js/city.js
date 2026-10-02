/* SomnuMatrix — city.js
   the dreamer's side of Somnucor: what is in your purse, what work you hold,
   which office is yours and what opens its door, and what ground you hold.
   nothing here decides anything — every figure comes back from the server,
   which is the only thing that can move gold.
   loaded as a plain script; shares scope with the other files */
"use strict";

var standing=null, cityBusy=false;

function cityRpc(name,body){
  if(!signedIn()) return Promise.reject(new Error("Sign in first — the city keeps its books by account."));
  return freshToken().then(function(tok){
    return fetch(DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/rpc/"+name,{
      method:"POST",
      headers:{apikey:DW_CONFIG.supabaseKey,Authorization:"Bearer "+tok,"Content-Type":"application/json"},
      body:JSON.stringify(body||{})
    }).then(function(r){ return r.ok?r.json():r.text().then(function(t){ throw new Error(t||"that didn't go through"); }); });
  });
}
function gold(n){ return (n||0).toLocaleString()+" gold"; }
function inDollars(n){ return "about $"+((n||0)/100).toFixed(2); }

/* ---- where you stand ---- */
/* rent that has fallen behind is drawn the moment standing is asked for —
   the same way the bank settles itself before it shows you its figures.
   a lease given up for it is worth knowing about, so it gets its own line. */
function settleRent(){
  return cityRpc("settle_rent").then(function(rows){
    (rows||[]).forEach(function(r){
      if(r.evicted) setStatus("<b>The lease on "+esc(r.lot)+" has lapsed.</b> Rent went unpaid too long, and it is back on the books for somebody else.");
      else if(r.gold) setStatus("<b>"+gold(r.gold)+"</b> in back rent drawn for "+esc(r.lot)+".");
    });
    return rows;
  }).catch(function(){ return []; });
}
function refreshStanding(){
  if(!signedIn()) { standing=null; paintCity(); return Promise.resolve(null); }
  return settleRent().then(function(){ return cityRpc("my_standing"); }).then(function(s){
    standing=s; paintCity();
    if((s&&s.business||[]).length) loadMyJobs();
    return s;
  }).catch(function(){ return null; });
}
function drawPay(){
  return cityRpc("draw_pay").then(function(rows){
    var total=(rows||[]).reduce(function(a,r){ return a+(r.gold||0); },0);
    if(!total) setStatus("Nothing owing just now. Pay is worked out from the hours since you were last paid.");
    else setStatus("<b>"+gold(total)+"</b> drawn for "+(rows.length===1?rows[0].job:(rows.length+" posts"))+".");
    return refreshStanding();
  }).catch(function(e){ setStatus(esc(e.message)); });
}

/* ---- what work there is ---- */
function jobBoard(){ return cityRpc("job_board").catch(function(){ return []; }); }
function applyFor(jobId,said){
  return cityRpc("apply_for",{p_job:jobId,p_said:said||null}).then(function(out){
    if(out==="hired"){
      setStatus("<b>You are hired.</b> Your pay counts the hours you are actually at your post — open your standing for the way there.");
      if(typeof refreshStanding==="function") refreshStanding();
      if(typeof showJobBoard==="function") showJobBoard();
      return;
    }
    setStatus(out==="ok"?"<b>Your application is in.</b> A keeper chooses for this post, and will see it."
                        :esc(String(out)));
  }).catch(function(e){ setStatus(esc(e.message)); });
}
/* leaving your someone at work while you sleep */
function workOffline(jobId,on){
  return cityRpc("set_offline_work",{p_job:jobId,p_on:!!on}).then(function(o){
    setStatus(o==="ok"
      ? (on?"<b>Your someone stays at work.</b> They earn while you are away — less than you would, but the city keeps turning."
          :"<b>Called home.</b> Your someone works no more until you do.")
      : esc(String(o)));
    return refreshStanding();
  }).catch(function(e){ setStatus(esc(e.message)); });
}
function leaveJob(jobId){ return cityRpc("leave_job",{p_job:jobId}).then(refreshStanding); }

/* ---- your office ---- */
var myOffice=null;
function loadOffice(){
  if(!signedIn()) { myOffice=null; return Promise.resolve(null); }
  return cityRpc("my_office").then(function(o){ myOffice=o; paintCity(); return o; }).catch(function(){ return null; });
}
/* an office's code is a keeper's to set now, not the occupant's own — see
   schema-update-16. this stays only so a saved link to the old button
   doesn't error; it just explains where the control actually lives. */
function setMyKeycode(code){
  setStatus("A keeper sets your office's code, from the Keeper's Desk — ask whoever holds it.");
  return Promise.resolve();
}
/* a door in the tower asks the server, never the browser, whether a code fits */
function tryOfficeDoor(officeId){
  var code=prompt("The office door asks for a code.")||"";
  return cityRpc("open_office",{p_office:officeId,p_code:code}).then(function(ok){
    if(ok) setStatus("<b>The door opens.</b>");
    else setStatus("That code is not the one.");
    return !!ok;
  }).catch(function(){ setStatus("The door does not answer just now."); return false; });
}

/* ---- ground ---- */
function lotBoard(){ return cityRpc("lot_board").catch(function(){ return []; }); }
function buyLot(id){ return cityRpc("buy_lot",{p_lot:id}).then(function(o){ setStatus(o==="ok"?"<b>The ground is yours.</b>":esc(String(o))); return refreshStanding(); }).catch(function(e){ setStatus(esc(e.message)); }); }
function takeLease(id){ return cityRpc("take_lease",{p_lot:id}).then(function(o){ setStatus(o==="ok"?"<b>You hold the lease.</b> Rent falls due in a week.":esc(String(o))); return refreshStanding(); }).catch(function(e){ setStatus(esc(e.message)); }); }
function payRent(id){ return cityRpc("pay_rent",{p_lot:id}).then(function(o){ setStatus(o==="ok"?"<b>Rent paid.</b>":esc(String(o))); return refreshStanding(); }).catch(function(e){ setStatus(esc(e.message)); }); }

/* ---- what the dreamer sees ---- */
function paintCity(){
  var el=document.getElementById("city-state"); if(!el) return;
  if(!signedIn()){ el.innerHTML="Sign in above to work, earn and hold ground in Somnucor."; return; }
  if(!standing){ el.innerHTML="Looking\u2026"; return; }
  var L=[];
  L.push("<b>"+gold(standing.gold)+"</b> <span style='color:var(--dim)'>("+inDollars(standing.gold)+")</span>");
  if(standing.granted) L.push("<span style='color:var(--dim)'>Your starting income was "+gold(standing.granted)+", and it stays with you.</span>");
  (standing.jobs||[]).forEach(function(j){
    L.push("<b>"+esc(j.job)+"</b> at "+esc(j.workplace||j.employer)+" \u2014 "+j.rate+" gold "+(j.kind==="salary"?"a week":"an hour")+
      (j.roams?" <span style='color:var(--dim)'>\u00b7 worked on the streets, anywhere in the city</span>":"")+
      (j.at_work!==undefined?" <span style='color:var(--dim)'>\u00b7 "+Math.floor(j.at_work/60)+"h "+(j.at_work%60)+"m at work since last paid</span>":"")+
      (j.workplace&&!j.roams?(" <button class='btn' data-way='"+esc(j.workplace)+"'>show me the way</button>"):"")+
      (j.job_id?(" <button class='btn' data-off='"+j.job_id+"' data-on='"+(j.offline?"0":"1")+"'>"+
        (j.offline?"call my someone home":"leave my someone at work")+"</button>"):"")+
      (j.offline?" <span style='color:var(--dim)'>\u00b7 at work while you sleep, at two fifths</span>":"")+
      (j.panel==="temple"?" <button class='btn' id='city-temple-collect'>collect the bowls of Temple Row</button>":""));
  });
  if(!(standing.jobs||[]).length) L.push("<span style='color:var(--dim)'>No work yet. The board below shows what the city needs.</span>");
  (standing.lots||[]).forEach(function(l){
    L.push(esc(l.lot)+" \u2014 "+(l.own?"yours":"leased")+(l.rent?" \u00b7 "+gold(l.rent)+" a week":"")+
      (!l.own&&l.rent&&l.lot_id?(" <button class='btn' data-rent='"+l.lot_id+"'>pay rent</button>"):""));
  });
  if(myOffice) L.push("<b>Office "+esc(myOffice.number)+"</b>, floor "+(myOffice.floor+1)+
    (myOffice.name?" \u2014 "+esc(myOffice.name):"")+" \u00b7 "+
    (myOffice.keycode?("code <b>"+esc(myOffice.keycode)+"</b>"):"<span style='color:var(--dim)'>locked \u2014 a keeper hasn't set a code for it yet</span>"));
  if(standing.prison) L.push("<span style='color:#C0603A'>"+(typeof prisonWords==="function"?prisonWords(standing.prison):"<b>Held by Somnucor</b>")+
    " Your own dreamscape is untouched.</span>");
  el.innerHTML=L.join("<br>");
  Array.prototype.forEach.call(el.querySelectorAll("[data-off]"),function(b){
    b.onclick=function(){ workOffline(+b.getAttribute("data-off"),b.getAttribute("data-on")==="1"); };
  });
  Array.prototype.forEach.call(el.querySelectorAll("[data-rent]"),function(b){
    b.onclick=function(){ payRent(+b.getAttribute("data-rent")); };
  });
  Array.prototype.forEach.call(el.querySelectorAll("[data-way]"),function(b){
    b.onclick=function(){ if(typeof showTheWay==="function") showTheWay(b.getAttribute("data-way")); };
  });
  var tc=document.getElementById("city-temple-collect");
  if(tc) tc.onclick=function(){ collectTemplePurse(); };
  var wo=document.getElementById("city-work-off");
  if(wo) wo.onclick=function(){ workOffMySentence(1); };
  paintBusiness();
}
function amOfficer(){ return (standing&&standing.jobs||[]).some(function(j){ return j.panel==="police"||j.panel==="court"; }); }
function collectTemplePurse(){
  return cityRpc("collect_temple_purse").then(function(sum){
    setStatus(sum>0?("<b>"+gold(sum)+"</b> collected from the bowls of Temple Row."):"The bowls are empty just now.");
    return refreshStanding();
  }).catch(function(e){ setStatus(esc(e.message)); });
}
function workOffMySentence(hours){
  if(!standing||!standing.prison) return;
  return cityRpc("work_off",{p_sentence:standing.prison.id,p_hours:hours||1}).then(function(o){
    setStatus(o==="served"?"<b>Time served.</b> You are free.":o==="ok"?"An hour worked off.":esc(String(o)));
    return refreshStanding();
  }).catch(function(e){ setStatus(esc(e.message)); });
}
function showJobBoard(){
  var el=document.getElementById("city-jobs"); if(!el) return;
  el.innerHTML="Looking\u2026";
  jobBoard().then(function(rows){
    if(!rows||!rows.length){ el.innerHTML="<span style='color:var(--dim)'>No work listed. Run schema-update-7 and 8 in the SQL Editor.</span>"; return; }
    var by={};
    rows.forEach(function(r){ (by[r.panel||"the city"]=by[r.panel||"the city"]||[]).push(r); });
    var h="";
    Object.keys(by).sort().forEach(function(k){
      h+="<div style='margin-top:10px;color:var(--gold);font-family:var(--sans);font-size:12px;letter-spacing:.08em;text-transform:uppercase'>"+esc(k)+"</div>";
      by[k].forEach(function(r){
        var left=r.positions-r.taken;
        h+="<div style='display:flex;justify-content:space-between;gap:10px;padding:5px 0;border-bottom:1px solid var(--line)'>"+
          "<span>"+esc(r.title)+" <span style='color:var(--dim)'>\u00b7 "+r.rate+" gold "+(r.pay_kind==="salary"?"a week":"an hour")+
            (r.workplace?" \u00b7 "+esc(r.workplace):"")+(r.auto_hire===false?" \u00b7 a keeper chooses":"")+"</span></span>"+
          "<span>"+(left>0?("<button class='btn' data-apply='"+r.job_id+"'>"+(r.auto_hire===false?"Apply":"Take it")+"</button> <span style='color:var(--dim)'>"+left+" free</span>")
                         :"<span style='color:var(--dim)'>full</span>")+"</span></div>";
      });
    });
    el.innerHTML=h;
    Array.prototype.forEach.call(el.querySelectorAll("[data-apply]"),function(b){
      b.onclick=function(){
        var row=rows.filter(function(x){ return x.job_id===+b.getAttribute("data-apply"); })[0];
        applyFor(+b.getAttribute("data-apply"),(row&&row.auto_hire===false)?(prompt("A word about why you want it?")||null):null);
      };
    });
  });
}
function initCity(){
  var b;
  if((b=document.getElementById("city-pay"))) b.onclick=drawPay;
  if((b=document.getElementById("city-refresh"))) b.onclick=function(){ refreshStanding(); loadOffice(); showJobBoard(); };
  /* the "city-code" self-service button is gone — an office's code is a
     keeper's to set now, from the Keeper's Desk (schema-update-16) */
  if(signedIn()){ refreshStanding(); loadOffice(); }
  setTimeout(showJobBoard,1200);
}

/* ---- the bank ---- */
function bankSettle(){ return cityRpc("bank_settle").then(function(b){ paintBank(b); return refreshStanding(); }); }
function bankDeposit(n){ return cityRpc("bank_deposit",{p_gold:n}).then(function(o){
  setStatus(o==="ok"?("<b>"+gold(n)+"</b> paid into the bank."):esc(String(o))); return refreshStanding(); })
  .catch(function(e){ setStatus(esc(e.message)); }); }
function bankWithdraw(n){ return cityRpc("bank_withdraw",{p_gold:n}).then(function(o){
  setStatus(o==="ok"?("<b>"+gold(n)+"</b> drawn out."):esc(String(o))); return refreshStanding(); })
  .catch(function(e){ setStatus(esc(e.message)); }); }
function bankBorrow(n){ return cityRpc("bank_borrow",{p_gold:n}).then(function(o){
  setStatus(o==="ok"?("<b>"+gold(n)+"</b> borrowed. The bank charges by the week."):esc(String(o))); return refreshStanding(); })
  .catch(function(e){ setStatus(esc(e.message)); }); }
function bankRepay(n){ return cityRpc("bank_repay",{p_gold:n}).then(function(o){
  setStatus(o==="ok"?"<b>Repaid.</b>":esc(String(o))); return refreshStanding(); })
  .catch(function(e){ setStatus(esc(e.message)); }); }
function payDreamer(to,n,note){ return cityRpc("pay_dreamer",{p_to:to,p_gold:n,p_note:note||null})
  .then(function(o){ setStatus(o==="ok"?("<b>"+gold(n)+"</b> paid."):esc(String(o))); return refreshStanding(); })
  .catch(function(e){ setStatus(esc(e.message)); }); }
function paintBank(b){
  var el=document.getElementById("bank-state"); if(!el) return;
  if(!standing){ el.textContent=""; return; }
  var saved=(b&&b.saved!==undefined)?b.saved:standing.saved, owed=(b&&b.owed!==undefined)?b.owed:standing.owed;
  el.innerHTML="In the bank: <b>"+gold(saved)+"</b>"+(owed?(" &middot; owing <b style='color:#C0603A'>"+gold(owed)+"</b>"):"")+
    (b&&b.interest?(" <span style='color:var(--dim)'>&middot; "+gold(b.interest)+" interest</span>"):"");
}

/* ---- the catalogue, and what you own ---- */
var myThings=[], riding=null, rideSpeed=1;
function loadThings(){
  if(!signedIn()) { myThings=[]; return Promise.resolve([]); }
  return cityRpc("my_belongings").then(function(rows){ myThings=rows||[]; paintThings(); return myThings; })
    .catch(function(){ return []; });
}
function buyItem(id,lot){
  return cityRpc("buy_item",{p_item:id,p_lot:lot||null}).then(function(o){
    setStatus(o==="ok"?"<b>Bought.</b> It is yours, and it is in your things.":esc(String(o)));
    return Promise.all([refreshStanding(),loadThings()]);
  }).catch(function(e){ setStatus(esc(e.message)); });
}
/* getting on something you own: it carries you faster about the city */
function ride(name){
  if(!name){ riding=null; rideSpeed=1; setStatus("On foot again."); paintThings(); return; }
  var t=myThings.filter(function(x){ return x.name===name&&x.speed; })[0];
  if(!t) return setStatus("You do not own that, or it is not for riding.");
  riding=t.name; rideSpeed=+t.speed||1;
  setStatus("<b>On the "+esc(t.name.toLowerCase())+".</b> "+(rideSpeed.toFixed(1))+" times your own pace."+
    ((t.archetype==="broomstick"||t.archetype==="flyingcarpet")?" It rises while you are on it.":""));
  if((t.archetype==="broomstick"||t.archetype==="flyingcarpet"||t.archetype==="saucer")&&typeof canFly!=="undefined") canFly=true;
  paintThings();
}
function paintThings(){
  var el=document.getElementById("things-state"); if(!el) return;
  if(!myThings.length){ el.innerHTML="<span style='color:var(--dim)'>Nothing of your own yet. The shop is below.</span>"; return; }
  var h=myThings.map(function(t){
    return "<span style='display:inline-block;margin:0 10px 6px 0'>"+esc(t.name)+
      (t.speed?(" <button class='btn' data-ride='"+esc(t.name)+"'>"+(riding===t.name?"riding":"ride")+"</button>"):"")+"</span>";
  }).join("");
  if(riding) h+="<div style='margin-top:6px'><button class='btn' id='ride-off'>Get off</button></div>";
  el.innerHTML=h;
  Array.prototype.forEach.call(el.querySelectorAll("[data-ride]"),function(b){ b.onclick=function(){ ride(b.getAttribute("data-ride")); }; });
  var off=document.getElementById("ride-off"); if(off) off.onclick=function(){ ride(null); };
}
function showShop(){
  var el=document.getElementById("city-shop"); if(!el) return;
  el.innerHTML="Looking\u2026";
  cityRpc("catalogue_board").catch(function(){
    /* the catalogue is a plain table: read it directly */
    return freshToken().then(function(tok){
      return fetch(DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/catalogue?select=id,kind,archetype,name,price,speed,note&listed=eq.true&order=kind,price",{
        headers:{apikey:DW_CONFIG.supabaseKey,Authorization:"Bearer "+(tok||DW_CONFIG.supabaseKey)}
      }).then(function(r){ return r.ok?r.json():[]; });
    });
  }).then(function(rows){
    if(!rows||!rows.length){ el.innerHTML="<span style='color:var(--dim)'>The shop is empty. Run schema-update-9 in the SQL Editor.</span>"; return; }
    var by={};
    rows.forEach(function(r){ (by[r.kind]=by[r.kind]||[]).push(r); });
    var h="";
    Object.keys(by).forEach(function(k){
      h+="<div style='margin-top:10px;color:var(--gold);font-family:var(--sans);font-size:12px;letter-spacing:.08em;text-transform:uppercase'>"+esc(k)+"</div>";
      by[k].forEach(function(r){
        h+="<div style='display:flex;justify-content:space-between;gap:10px;padding:5px 0;border-bottom:1px solid var(--line)'>"+
          "<span>"+esc(r.name)+(r.speed?(" <span style='color:var(--dim)'>\u00b7 "+(+r.speed).toFixed(1)+"\u00d7 pace</span>"):"")+
          (r.note?("<br><span style='color:var(--dim);font-size:12px'>"+esc(r.note)+"</span>"):"")+"</span>"+
          "<span style='white-space:nowrap'>"+gold(r.price)+" <button class='btn' data-buy='"+r.id+"'>Buy</button></span></div>";
      });
    });
    el.innerHTML=h;
    Array.prototype.forEach.call(el.querySelectorAll("[data-buy]"),function(b){
      b.onclick=function(){ buyItem(+b.getAttribute("data-buy"),null); };
    });
  });
}
function initShop(){
  var b;
  if((b=document.getElementById("bank-in"))) b.onclick=function(){ var n=+prompt("How much to pay in?")||0; if(n>0) bankDeposit(n); };
  if((b=document.getElementById("bank-out"))) b.onclick=function(){ var n=+prompt("How much to draw out?")||0; if(n>0) bankWithdraw(n); };
  if((b=document.getElementById("bank-borrow"))) b.onclick=function(){ var n=+prompt("How much to borrow? The bank lends against what you have earned.")||0; if(n>0) bankBorrow(n); };
  if((b=document.getElementById("bank-repay"))) b.onclick=function(){ var n=+prompt("How much to repay?")||0; if(n>0) bankRepay(n); };
  if((b=document.getElementById("bank-settle"))) b.onclick=bankSettle;
  if((b=document.getElementById("shop-show"))) b.onclick=showShop;
  if(signedIn()){ loadThings(); setTimeout(function(){ bankSettle().catch(function(){}); },900); }
}

/* ---- what the ground gives up ---- */
var myStock=[];
function loadStock(){
  if(!signedIn()) { myStock=[]; return Promise.resolve([]); }
  return cityRpc("my_stock").then(function(rows){ myStock=rows||[]; paintStock(); return myStock; })
    .catch(function(){ return []; });
}
function workGround(){
  return cityRpc("work_the_ground").then(function(rows){
    if(!rows||!rows.length) setStatus("Nothing came up. Either your work is not of the ground, or you have only just been paid.");
    else setStatus("<b>Brought up:</b> "+rows.map(function(r){ return r.got+" "+r.kind; }).join(", ")+".");
    return loadStock();
  }).catch(function(e){ setStatus(esc(e.message)); });
}
function sellStock(kind,n){
  return cityRpc("sell_stock",{p_kind:kind,p_amount:n}).then(function(o){
    setStatus(o==="ok"?"<b>Sold to the city.</b>":esc(String(o)));
    return Promise.all([loadStock(),refreshStanding()]);
  }).catch(function(e){ setStatus(esc(e.message)); });
}
function paintStock(){
  var el=document.getElementById("stock-state"); if(!el) return;
  var have=myStock.filter(function(s){ return s.amount>0; });
  if(!have.length){ el.innerHTML="<span style='color:var(--dim)'>Nothing in your stock. Work the quarry or the stand and it fills.</span>"; return; }
  el.innerHTML=have.map(function(s){
    return "<span style='display:inline-block;margin:0 10px 6px 0'>"+esc(s.name)+" <b>"+s.amount+"</b>"+
      " <button class='btn' data-sell='"+esc(s.kind)+"'>sell to the city at "+s.buys+"</button>"+
      " <button class='btn' data-list='"+esc(s.kind)+"'>list on the market</button></span>";
  }).join("");
  Array.prototype.forEach.call(el.querySelectorAll("[data-sell]"),function(b){
    b.onclick=function(){
      var k=b.getAttribute("data-sell"), row=myStock.filter(function(s){ return s.kind===k; })[0];
      var n=+(prompt("How much "+row.name.toLowerCase()+" to sell? You have "+row.amount+".")||0);
      if(n>0) sellStock(k,Math.min(n,row.amount));
    };
  });
  Array.prototype.forEach.call(el.querySelectorAll("[data-list]"),function(b){
    b.onclick=function(){
      var k=b.getAttribute("data-list"), row=myStock.filter(function(s){ return s.kind===k; })[0];
      var n=+(prompt("How much "+row.name.toLowerCase()+" to list? You have "+row.amount+".")||0);
      if(n<=0) return;
      var each=+(prompt("Gold apiece? The city itself buys at "+row.buys+", so the market is worth more than that.")||0);
      if(each>0) listStock(k,Math.min(n,row.amount),each);
    };
  });
}
function initGround(){
  var b;
  if((b=document.getElementById("ground-work"))) b.onclick=workGround;
  if((b=document.getElementById("ground-refresh"))) b.onclick=loadStock;
  if(signedIn()) setTimeout(loadStock,1400);
}

/* ---- the materials market: dreamers building their own ground, buying and selling to each other ---- */
function listStock(kind,amount,each){
  return cityRpc("list_stock",{p_kind:kind,p_amount:amount,p_each:each}).then(function(o){
    setStatus(o==="ok"?"<b>Listed.</b> Somebody building their own ground will find it.":esc(String(o)));
    return Promise.all([loadStock(),loadMarket()]);
  }).catch(function(e){ setStatus(esc(e.message)); });
}
function unlistStock(id){
  return cityRpc("unlist_stock",{p_listing:id}).then(function(o){
    setStatus(o==="ok"?"<b>Taken down.</b> What was left is back in your stock.":esc(String(o)));
    return Promise.all([loadStock(),loadMarket()]);
  }).catch(function(e){ setStatus(esc(e.message)); });
}
function buyFromMarket(id,amount){
  return cityRpc("buy_stock",{p_listing:id,p_amount:amount}).then(function(o){
    setStatus(o==="ok"?"<b>Bought.</b> It is in your stock.":esc(String(o)));
    return Promise.all([loadStock(),loadMarket(),refreshStanding()]);
  }).catch(function(e){ setStatus(esc(e.message)); });
}
var myMarket=[];
function loadMarket(){
  return cityRpc("market_board").then(function(rows){ myMarket=rows||[]; paintMarket(); return myMarket; })
    .catch(function(){ myMarket=[]; paintMarket(); return []; });
}
function paintMarket(){
  var el=document.getElementById("market-state"); if(!el) return;
  if(!myMarket.length){ el.innerHTML="<span style='color:var(--dim)'>Nothing listed just now. What comes up in the quarry or the stand can go up here, at whatever price its owner asks.</span>"; return; }
  el.innerHTML='<table style="width:100%;border-collapse:collapse">'+
    myMarket.map(function(m){
      return '<tr><td style="padding:3px 6px;border-bottom:1px solid var(--line)">'+esc(m.name)+'</td>'+
        '<td style="border-bottom:1px solid var(--line)">'+m.amount+'</td>'+
        '<td style="border-bottom:1px solid var(--line)">'+m.each+' gold each</td>'+
        '<td style="border-bottom:1px solid var(--line)">'+
          (m.mine?'<button class="btn" data-unlist="'+m.listing_id+'">take down</button>'
                 :'<button class="btn" data-buyfrom="'+m.listing_id+'" data-max="'+m.amount+'">buy</button>')+
        '</td></tr>';
    }).join("")+'</table>';
  Array.prototype.forEach.call(el.querySelectorAll("[data-unlist]"),function(b){
    b.onclick=function(){ unlistStock(+b.getAttribute("data-unlist")); };
  });
  Array.prototype.forEach.call(el.querySelectorAll("[data-buyfrom]"),function(b){
    b.onclick=function(){
      var max=+b.getAttribute("data-max");
      var n=+(prompt("How much to buy? Up to "+max+".")||0);
      if(n>0) buyFromMarket(+b.getAttribute("data-buyfrom"),Math.min(n,max));
    };
  });
}
function initMarket(){
  var b;
  if((b=document.getElementById("market-refresh"))) b.onclick=loadMarket;
  setTimeout(loadMarket,1600);
}

/* ---- a business of your own: open one, post work, hire who applies ---- */
var dreamerEmailsCache=null;
function dreamerEmails(){
  if(dreamerEmailsCache) return Promise.resolve(dreamerEmailsCache);
  return cityRpc("admin_list_dreamers").then(function(rows){
    var map={}; (rows||[]).forEach(function(r){ map[r.id]=r.email; });
    dreamerEmailsCache=map; return map;
  }).catch(function(){ return {}; });
}
function openBusiness(name,lotId){
  return cityRpc("open_business",{p_name:name,p_lot:lotId||null}).then(function(o){
    setStatus(o==="ok"?"<b>Opened.</b> Post work under it whenever you like.":esc(String(o)));
    return Promise.all([refreshStanding(),loadMyJobs()]);
  }).catch(function(e){ setStatus(esc(e.message)); });
}
function postJobFor(employerId,title,kind,rate,positions){
  return cityRpc("post_job",{p_employer:employerId,p_title:title,p_kind:kind,p_rate:rate,p_positions:positions}).then(function(o){
    setStatus(o==="ok"?"<b>Posted.</b> It is on the job board now.":esc(String(o)));
    return Promise.all([loadMyJobs(),showJobBoard()]);
  }).catch(function(e){ setStatus(esc(e.message)); });
}
/* applications, read straight from the table — RLS already lets an
   operator or a keeper see the ones on their own jobs */
function loadApplications(jobId){
  return freshToken().then(function(tok){
    return fetch(DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/applications?select=id,user_id,said,at&job_id=eq."+jobId+"&state=eq.waiting&order=at",{
      headers:{apikey:DW_CONFIG.supabaseKey,Authorization:"Bearer "+(tok||DW_CONFIG.supabaseKey)}
    }).then(function(r){ return r.ok?r.json():[]; });
  }).catch(function(){ return []; });
}
function hireApplicant(applicationId){
  return cityRpc("hire",{p_application:applicationId}).then(function(o){
    setStatus(o==="ok"?"<b>Hired.</b> They start drawing pay from now.":esc(String(o)));
    return loadMyJobs();
  }).catch(function(e){ setStatus(esc(e.message)); });
}
var myJobs=[];
function loadMyJobs(){
  if(!standing||!(standing.business||[]).length){ myJobs=[]; paintBusiness(); return Promise.resolve([]); }
  return jobBoard().then(function(rows){
    var mine=(standing.business||[]).map(function(b){ return b.name; });
    myJobs=(rows||[]).filter(function(r){ return mine.indexOf(r.employer)>=0; });
    return Promise.all(myJobs.map(function(j){
      return loadApplications(j.job_id).then(function(apps){ j.applications=apps; });
    })).then(function(){ return dreamerEmails(); }).then(function(emails){
      myJobs.forEach(function(j){ (j.applications||[]).forEach(function(a){ a.email=emails[a.user_id]||a.user_id; }); });
      paintBusiness();
      return myJobs;
    });
  });
}
function paintBusiness(){
  var el=document.getElementById("business-state"); if(!el) return;
  if(!signedIn()){ el.innerHTML=""; return; }
  var biz=(standing&&standing.business)||[];
  var h="";
  if(!biz.length) h="<span style='color:var(--dim)'>You run nothing yet. Opening one costs 2,000 gold, and can stand on ground you hold.</span>";
  else h=biz.map(function(b){ return "<b>"+esc(b.name)+"</b>"; }).join(", ")+"<br>";
  h+=myJobs.map(function(j){
    return "<div style='margin-top:8px;padding-top:6px;border-top:1px solid var(--line)'>"+
      "<b>"+esc(j.title)+"</b> — "+j.rate+" gold "+(j.pay_kind==="salary"?"a week":"an hour")+
      " · "+j.taken+" of "+j.positions+" filled"+
      (j.applications&&j.applications.length?j.applications.map(function(a){
        return "<div style='margin-left:10px'>"+esc(a.email)+(a.said?(" — “"+esc(a.said)+"”"):"")+
          " <button class='btn' data-hire='"+a.id+"'>hire</button></div>";
      }).join(""):"<div style='margin-left:10px;color:var(--dim)'>No applications waiting.</div>")+
      "</div>";
  }).join("");
  el.innerHTML=h;
  Array.prototype.forEach.call(el.querySelectorAll("[data-hire]"),function(b){
    b.onclick=function(){ hireApplicant(+b.getAttribute("data-hire")); };
  });
}
function initBusiness(){
  var b;
  if((b=document.getElementById("business-open"))) b.onclick=function(){
    var name=(prompt("What is the business called?")||"").trim();
    if(!name) return;
    var lot=(prompt("A lot number it stands on, if it stands on one you hold? Leave blank otherwise.")||"").trim();
    openBusiness(name,lot?+lot:null);
  };
  if((b=document.getElementById("business-post"))) b.onclick=function(){
    var biz=(standing&&standing.business)||[];
    if(!biz.length) return setStatus("Open a business first.");
    var employerId=biz.length===1?biz[0].id:+(prompt("Which business? "+biz.map(function(x){ return x.id+"="+x.name; }).join(", "))||0);
    if(!employerId) return;
    var title=(prompt("What is the post called?")||"").trim(); if(!title) return;
    var kind=(prompt("Hourly or salary?","hourly")||"hourly").trim().toLowerCase();
    var rate=+(prompt("Gold "+(kind==="salary"?"a week":"an hour")+"?")||0); if(rate<=0) return;
    var positions=+(prompt("How many positions?","1")||1);
    postJobFor(employerId,title,kind,rate,positions);
  };
  if((b=document.getElementById("business-refresh"))) b.onclick=loadMyJobs;
  if(signedIn()) setTimeout(loadMyJobs,1800);
}

