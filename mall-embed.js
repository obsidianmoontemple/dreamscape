/* Somnucor World Mall — the live shelf a store puts on its own website.
   Paste on any page:
     <div data-somnucor-store="STORE_NUMBER"></div>
     <script src="https://YOUR-SITE/mall-embed.js" async></script>
   It shows the store's newest pieces from the mall, with their gold prices,
   and a way into the shop in Somnucor. It changes nothing on the page around it. */
(function(){
  "use strict";
  var SB_URL="https://ryxmrkwgdyphcdlglwka.supabase.co";
  var SB_KEY="sb_publishable_rsf04iH4Pph9ZfLt8g6Ovg_EI_Zk9GY";
  /* where the game is: beside this file, unless the page says otherwise with data-game="https://..." */
  var me=document.currentScript, here=me&&me.src?me.src:location.href;
  var GAME=new URL("index.html",here).href;

  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function hex(n){ return "#"+("000000"+((n||0)>>>0).toString(16)).slice(-6); }

  function render(el,s){
    var game=(el.getAttribute("data-game")||GAME)+"?mall="+s.unit, acc=hex(s.color!=null?s.color:0x7A2A3A);
    var max=Math.max(1,Math.min(24,parseInt(el.getAttribute("data-count")||"8",10)||8));
    var root=el.attachShadow?el.attachShadow({mode:"open"}):el;
    var css="<style>:host{all:initial;display:block}"+
      ".w{font-family:Georgia,'Times New Roman',serif;background:#0D1017;color:#E4DAC4;border:2px solid "+acc+";border-radius:8px;padding:18px;box-sizing:border-box}"+
      ".h{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}.h img{width:44px;height:44px;object-fit:contain;background:#fff;border-radius:6px}"+
      ".t{flex:1;min-width:180px}.k{font:11px/1.2 Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#C9A868}.n{font-size:20px;margin-top:3px}"+
      ".go{display:inline-block;padding:10px 16px;background:"+acc+";color:#fff;text-decoration:none;border-radius:5px;font:600 13px Arial,sans-serif}"+
      ".g{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px}"+
      ".c{background:#141822;border-radius:6px;overflow:hidden;display:flex;flex-direction:column}.c img{width:100%;aspect-ratio:1;object-fit:cover;background:#1A1D24;display:block}"+
      ".c div{padding:9px 10px;font-size:14px;line-height:1.3}.c small{display:block;font:12px Arial,sans-serif;color:#C9A868;margin-top:4px}"+
      ".c a{color:#E4DAC4;text-decoration:none}.f{margin-top:12px;font:11px Arial,sans-serif;color:#7D7766}</style>";
    var cards=(s.products||[]).slice(0,max).map(function(p){
      return "<div class='c'>"+(p.image?"<img src='"+esc(p.image)+"' alt='' loading='lazy'>":"")+
        "<div><a href='"+esc(p.url||game)+"' target='_blank' rel='noopener'>"+esc(p.name)+"</a><small>"+p.gold.toLocaleString()+" gold in the mall"+(p.real?" &middot; "+esc(p.real):"")+"</small></div></div>";
    }).join("");
    root.innerHTML=css+"<div class='w'><div class='h'>"+(s.logo?"<img src='"+esc(s.logo)+"' alt=''>":"")+
      "<div class='t'><div class='k'>In the Somnucor World Mall</div><div class='n'>"+esc(s.name)+"</div></div>"+
      "<a class='go' href='"+esc(game)+"' target='_blank' rel='noopener'>Step into our shop &rarr;</a></div>"+
      (cards?"<div class='g'>"+cards+"</div>":"")+"<div class='f'>Unit "+s.unit+" &middot; SomnuMatrix by Somnucor</div></div>";
  }
  function load(el){
    if(el.getAttribute("data-somnucor-done")) return;
    el.setAttribute("data-somnucor-done","1");
    var id=parseInt(el.getAttribute("data-somnucor-store"),10); if(!id) return;
    fetch(SB_URL+"/rest/v1/rpc/mall_store_public",{method:"POST",
      headers:{apikey:SB_KEY,Authorization:"Bearer "+SB_KEY,"Content-Type":"application/json"},body:JSON.stringify({p_store:id})})
      .then(function(r){ return r.ok?r.json():null; })
      .then(function(s){ if(s&&s.unit) render(el,s); })      /* not open yet: nothing shows */
      .catch(function(){});
  }
  function all(){ Array.prototype.forEach.call(document.querySelectorAll("[data-somnucor-store]"),load); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",all); else all();
})();
