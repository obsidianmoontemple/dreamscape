/* SomnuMatrix — pad.js
   an on-screen direction pad for walking, view controls for the overview and Plot,
   and a switch that turns the on-screen controls on even where a phone isn't
   recognised. the pad can be folded away with one tap so the buttons underneath
   can be reached.
   loaded as a plain script; shares scope with the other files */
"use strict";

var padOn=false, padHidden=false, padKeys={f:0,b:0,l:0,r:0}, padRun=false, PADKEY="dreamwalker.pad";

/* automatic | always | never */
function padMode(){ var m=cfg().pad; return m==="always"||m==="never"?m:"automatic"; }
function padWanted(){
  var m=padMode();
  if(m==="always") return true;
  if(m==="never") return false;
  if(typeof isTouch!=="undefined"&&isTouch) return true;
  return typeof matchMedia==="function"&&matchMedia("(pointer:coarse)").matches;
}

/* what the pad says, in the same shape as the joystick */
function padInput(){
  var f=(padKeys.f?1:0)-(padKeys.b?1:0), s=(padKeys.r?1:0)-(padKeys.l?1:0);
  if(!f&&!s) return null;
  var m=Math.min(1,Math.sqrt(f*f+s*s));
  return {f:f,s:s,mag:padRun?1:0.62,run:padRun};
}

function padBuild(){
  if(padOn||typeof document==="undefined"||!document.body) return;
  padOn=true;
  var wrap=document.createElement("div"); wrap.id="dpad";
  wrap.innerHTML=
    '<button class="pd" data-d="f" aria-label="Forward">&#9650;</button>'+
    '<button class="pd" data-d="l" aria-label="Left">&#9664;</button>'+
    '<button class="pd pd-run" id="pd-run" aria-label="Run">run</button>'+
    '<button class="pd" data-d="r" aria-label="Right">&#9654;</button>'+
    '<button class="pd" data-d="b" aria-label="Back">&#9660;</button>';
  var fold=document.createElement("button"); fold.id="pd-fold"; fold.type="button";
  fold.title="Fold the pad away so you can reach what's under it";
  fold.textContent="pad";
  /* the way out, and the abilities — always reachable, whatever else is on screen */
  var side=document.createElement("div"); side.id="pdside";
  side.innerHTML=
    '<button class="pd pd-wide" id="pd-back">back</button>'+
    '<button class="pd pd-wide" id="pd-abil">powers</button>'+
    '<button class="pd pd-wide" id="pd-take">take</button>'+
    '<button class="pd pd-wide" id="pd-use">use</button>'+
    '<button class="pd pd-wide" id="pd-desk">desk</button>'+
    '<button class="pd" id="pd-rise" aria-label="Rise">&#9650;</button>'+
    '<button class="pd" id="pd-fall" aria-label="Fall">&#9660;</button>';
  document.body.appendChild(side);

  var view=document.createElement("div"); view.id="pdview";
  view.innerHTML=
    '<button class="pd" data-v="in" aria-label="Closer">+</button>'+
    '<button class="pd" data-v="out" aria-label="Further">&minus;</button>'+
    '<button class="pd" data-v="turn" aria-label="Turn the view">&#x27F3;</button>'+
    '<button class="pd" data-v="up" aria-label="Move north">&#9650;</button>'+
    '<button class="pd" data-v="down" aria-label="Move south">&#9660;</button>'+
    '<button class="pd" data-v="left" aria-label="Move west">&#9664;</button>'+
    '<button class="pd" data-v="right" aria-label="Move east">&#9654;</button>';
  document.body.appendChild(wrap); document.body.appendChild(view); document.body.appendChild(fold);

  /* walking: hold a direction */
  function hold(el,d,on){ padKeys[d]=on?1:0; el.classList.toggle("on",!!on); }
  Array.prototype.forEach.call(wrap.querySelectorAll("[data-d]"),function(b){
    var d=b.getAttribute("data-d");
    ["pointerdown","touchstart"].forEach(function(ev){ b.addEventListener(ev,function(e){ e.preventDefault(); hold(b,d,true); },{passive:false}); });
    ["pointerup","pointerleave","pointercancel","touchend","touchcancel"].forEach(function(ev){ b.addEventListener(ev,function(){ hold(b,d,false); }); });
  });
  document.getElementById("pd-run").onclick=function(){ padRun=!padRun; this.classList.toggle("on",padRun); };

  /* the overview and Plot: move, turn and zoom without a mouse */
  Array.prototype.forEach.call(view.querySelectorAll("[data-v]"),function(b){
    var v=b.getAttribute("data-v"), held=false, timer=null;
    function act(){
      var step=Math.max(6,orb.r*0.08);
      if(v==="in") orb.r=Math.max(20,orb.r*0.88);
      if(v==="out") orb.r=Math.min(4000,orb.r*1.14);
      if(v==="turn") orb.t+=0.22;
      var c=Math.cos(orb.t), s=Math.sin(orb.t);
      if(v==="up"){ orb.tx-=s*step; orb.tz-=c*step; }
      if(v==="down"){ orb.tx+=s*step; orb.tz+=c*step; }
      if(v==="left"){ orb.tx-=c*step; orb.tz+=s*step; }
      if(v==="right"){ orb.tx+=c*step; orb.tz-=s*step; }
    }
    function start(e){ e.preventDefault(); held=true; act(); timer=setInterval(function(){ if(held) act(); },110); }
    function stop(){ held=false; if(timer) clearInterval(timer); timer=null; }
    ["pointerdown","touchstart"].forEach(function(ev){ b.addEventListener(ev,start,{passive:false}); });
    ["pointerup","pointerleave","pointercancel","touchend","touchcancel"].forEach(function(ev){ b.addEventListener(ev,stop); });
  });

  document.getElementById("pd-back").onclick=function(){
    if(typeof INT!=="undefined"&&INT) return exitInterior(false);
    if(typeof talkOpen!=="undefined"&&talkOpen&&typeof closeTalk==="function") return closeTalk();
    if(typeof picked!=="undefined"&&picked) closeInspect();
    if(typeof plotOn!=="undefined"&&plotOn) return setPlot(false);
    if(walkMode) return setWalk(false);
  };
  ["pd-rise","pd-fall"].forEach(function(id){
    var b=document.getElementById(id), up=(id==="pd-rise"), held=false, tick=null;
    function go(){
      if(store.inside&&typeof liftMove==="function"&&liftMove(up?1:-1)) return;
      if(typeof flyY==="undefined") return; flyY+=(up?1:-1)*0.55; if(flyY<0) flyY=0;
    }
    function start(e){ e.preventDefault(); held=true; go(); tick=setInterval(function(){ if(held) go(); },60); b.classList.add("on"); }
    function stop(){ held=false; if(tick) clearInterval(tick); tick=null; b.classList.remove("on"); }
    ["pointerdown","touchstart"].forEach(function(ev){ b.addEventListener(ev,start,{passive:false}); });
    ["pointerup","pointerleave","pointercancel","touchend","touchcancel"].forEach(function(ev){ b.addEventListener(ev,stop); });
  });
  document.getElementById("pd-abil").onclick=openPowers;
  document.getElementById("pd-take").onclick=function(){ if(typeof armsReach==="function") armsReach(); };
  document.getElementById("pd-use").onclick=function(){ if(typeof useCarried==="function") useCarried(); };
  document.getElementById("pd-desk").onclick=function(){ if(typeof openDesk==="function") openDesk(); };

  fold.onclick=function(){
    padHidden=!padHidden;
    try{ localStorage.setItem(PADKEY,padHidden?"1":""); }catch(e){}
    fold.textContent=padHidden?"pad":"hide";
    padTick();
  };
  try{ padHidden=!!localStorage.getItem(PADKEY); }catch(e){}
  fold.textContent=padHidden?"pad":"hide";
}

/* the powers a dreamer has in dreams — switched on by the dream, or by hand */
function openPowers(){
  var p=document.getElementById("pd-powers");
  if(p&&p.style.display==="block"){ p.style.display="none"; return; }
  if(!p){
    p=document.createElement("div"); p.id="pd-powers";
    p.style.cssText="position:fixed;z-index:20;left:50%;top:14%;transform:translateX(-50%);width:min(340px,92vw);"+
      "max-height:70vh;overflow-y:auto;background:rgba(9,11,16,.96);border:1px solid var(--line,#333);border-radius:4px;padding:16px 18px";
    document.body.appendChild(p);
  }
  var d=dreamer(), have={};
  (d.abilities||[]).forEach(function(a){ have[a.name]=a; });
  var h='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'+
        '<b style="color:var(--bone,#ddd);font-weight:500">What you can do in dreams</b>'+
        '<button class="btn" id="pw-close">Done</button></div>'+
        '<p style="font-size:12px;color:var(--dim,#999);margin:0 0 12px;line-height:1.5">These come from your dreams. You can also switch one on yourself &mdash; it is your dream.</p>';
  ABILITY.forEach(function(pair){
    var on=!!have[pair[0]], src=on&&have[pair[0]].src==="stated"?" <span style=\"color:var(--gold,#C9A868)\">dreamt</span>":"";
    h+='<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--line,#333)">'+
       '<input type="checkbox" data-ab="'+esc(pair[0])+'"'+(on?" checked":"")+' style="width:auto">'+
       '<span style="flex:1;font-size:14px">'+esc(pair[0])+src+"</span></div>";
  });
  p.innerHTML=h; p.style.display="block";
  document.getElementById("pw-close").onclick=function(){ p.style.display="none"; };
  Array.prototype.forEach.call(p.querySelectorAll("[data-ab]"),function(c){
    c.onchange=function(){
      var nm=c.getAttribute("data-ab"), d2=dreamer();
      if(c.checked){ if(!hasAbility(nm)) d2.abilities.push({name:nm,nights:[store.session],src:"chosen"}); }
      else d2.abilities=d2.abilities.filter(function(a){ return a.name!==nm; });
      if(typeof canFly!=="undefined") canFly=hasAbility("flying")||hasAbility("floating");
      save();
    };
  });
}

/* each frame: show the right controls for what the dreamer is doing */
function padTick(){
  if(!padWanted()){
    if(padOn){ ["dpad","pdview","pd-fold"].forEach(function(id){ var e=document.getElementById(id); if(e) e.style.display="none"; }); }
    return;
  }
  padBuild();
  var pad=document.getElementById("dpad"), view=document.getElementById("pdview"), fold=document.getElementById("pd-fold");
  if(!pad) return;
  var talking=(typeof talkOpen!=="undefined"&&talkOpen)||(typeof greetOpen!=="undefined"&&greetOpen);
  var wantPad=walkMode&&!talking;
  var wantView=!walkMode&&!talking;
  pad.style.display=(wantPad&&!padHidden)?"grid":"none";
  view.style.display=(wantView&&!padHidden)?"grid":"none";
  fold.style.display=(wantPad||wantView)?"block":"none";
  var side=document.getElementById("pdside");
  if(side){
    side.style.display=(wantPad||wantView||(typeof plotOn!=="undefined"&&plotOn))?"grid":"none";
    var fly=(typeof canFly!=="undefined"&&canFly)&&walkMode;
    document.getElementById("pd-rise").style.display=fly?"flex":"none";
    document.getElementById("pd-fall").style.display=fly?"flex":"none";
    document.getElementById("pd-abil").style.display=walkMode?"flex":"none";
    document.getElementById("pd-take").style.display=walkMode?"flex":"none";
    document.getElementById("pd-use").style.display=(walkMode&&typeof carrying!=="undefined"&&carrying)?"flex":"none";
    document.getElementById("pd-desk").style.display=(typeof deskNear!=="undefined"&&(deskNear||deskOpen))?"flex":"none";
  }
  if(padHidden&&(padKeys.f||padKeys.b||padKeys.l||padKeys.r)) padKeys={f:0,b:0,l:0,r:0};
}

