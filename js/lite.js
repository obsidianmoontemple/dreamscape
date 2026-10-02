/* SomnuMatrix — lite.js
   Somnucor on a phone. The whole city is a quarter of a million pieces; a
   phone's browser is shut down by the phone the moment it holds too much,
   which is what made walking the city crash. On phones (and small-memory
   machines) the city is held lightly:
     - every area, once pressed into its few large meshes, lets its hundreds
       of thousands of original pieces go — they are rebuilt only if that area
       ever has to be pressed again (the keeper changed something in it)
     - the people, creatures and powers of the city are made when you come
       near them and let go when you walk away
     - no sun shadows, a capped pixel density, fewer stand-ins drawn at once
   Nothing about the city changes; it just is not all held in memory at once.
   Settings → "Low memory mode" can force it on or off on any device.
   loaded as a plain script; shares scope with the other files */
"use strict";

var LITE=(function(){
  var c={}; try{ c=JSON.parse(localStorage.getItem(/[?&]test=1\b/.test(location.search)?"dreamwalker.testcfg":"dreamwalker.cfg2")||"{}")||{}; }catch(e){}
  if(c.lite==="on") return true; if(c.lite==="off") return false;
  var ua=navigator.userAgent||"";
  var phone=/Android|iPhone|iPad|iPod|Mobile/i.test(ua)||(navigator.maxTouchPoints>1&&/Macintosh/.test(ua));
  var mem=navigator.deviceMemory;
  return !!(phone||(mem&&mem<=4));
})();
var LITE_NEAR=260, LITE_FAR=340;

/* ---- what is shared and must never be thrown away ---- */
var LITE_KEEP=null, LITE_KEEP_N=-1;
function liteShared(){
  var n=(typeof FIGGEO!=="undefined"?Object.keys(FIGGEO).length:0)+(typeof GEOCACHE!=="undefined"?Object.keys(GEOCACHE).length:0)+(typeof DL_GEO!=="undefined"?Object.keys(DL_GEO).length:0);
  if(LITE_KEEP&&n===LITE_KEEP_N) return LITE_KEEP;
  LITE_KEEP=new Set(); LITE_KEEP_N=n;
  [typeof FIGGEO!=="undefined"?FIGGEO:{},typeof GEOCACHE!=="undefined"?GEOCACHE:{},typeof DL_GEO!=="undefined"?DL_GEO:{},typeof SIGN_GEO!=="undefined"?SIGN_GEO:{}].forEach(function(o){ Object.keys(o).forEach(function(k){ LITE_KEEP.add(o[k]); }); });
  return LITE_KEEP;
}
function liteRelease(root){
  var keep=liteShared();
  root.traverse(function(m){
    if(m.material){ (Array.isArray(m.material)?m.material:[m.material]).forEach(function(mt){ if(mt&&mt.dispose&&!(mt.map&&typeof SIGN_TEX!=="undefined"&&bakeIsSign&&bakeIsSign(mt.map))) mt.dispose(); }); }
    if(m.geometry&&!keep.has(m.geometry)&&m.geometry.dispose) m.geometry.dispose();
    if(m.isInstancedMesh&&m.dispose) m.dispose();
  });
}

if(LITE){
  /* a phone's screen is sharp enough at a lower pixel density, and has no room for sun shadows */
  (function(){
    if(typeof applyShadows==="function"){
      var as=applyShadows;
      applyShadows=function(){ as.apply(this,arguments); if(renderer&&renderer.shadowMap){ renderer.shadowMap.enabled=false; } if(typeof sun!=="undefined"&&sun) sun.castShadow=false; };
    }
    try{ if(typeof renderer!=="undefined"&&renderer) renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5)); }catch(e){}
    if(typeof TEMPS!=="undefined"){ TEMPS.maxNear=6; TEMPS.maxFly=2; }
  })();

  /* ---- the city's areas: once pressed, the original pieces are let go ---- */
  (function(){
    if(typeof bakeChunk!=="function") return;
    var bc=bakeChunk;
    bakeChunk=function(key){
      var ch=BAKE.chunks[key];
      /* pressing an area again: anything let go is made again first */
      if(ch) ch.ids.forEach(function(id){
        var g=meshes[id]; if(!g||!g.userData.liteStripped) return;
        var o=specById(id); if(!o) return;
        scene.remove(g); delete meshes[id]; addMesh(o);
      });
      bc(key);
      ch=BAKE.chunks[key]; if(!ch||!ch.members) return;
      ch.members.forEach(function(M){
        M.took.forEach(function(m){
          if(m.parent) m.parent.remove(m);
          var tmp=new THREE.Object3D(); tmp.add(m); liteRelease(tmp);
        });
        M.took=[]; M.g.userData.liteStripped=true;
      });
    };
    if(typeof bakeTerrain==="function"){
      var bt=bakeTerrain;
      bakeTerrain=function(){
        bt.apply(this,arguments);
        (BAKE.terrainTook||[]).forEach(function(m){ if(m.parent) m.parent.remove(m); var tmp=new THREE.Object3D(); tmp.add(m); liteRelease(tmp); });
        BAKE.terrainTook=[];
      };
    }
  })();

  /* ---- the city's people, creatures and powers: made near, let go far ---- */
  function liteBeing(spec){
    if(!spec||!spec.city) return false;
    var d=KIT[spec.archetype];
    return !!((d&&d.cat==="being")||(typeof CREATURE!=="undefined"&&CREATURE[spec.archetype])||spec.archetype==="deity"||spec.archetype==="dragon");
  }
  function liteNear(spec,R){
    var r=(typeof somnucorRealm==="function")?somnucorRealm():null;
    if(!r||(store.here||0)!==r.id||store.inside) return false;
    var P=camera.position; return Math.hypot(spec.x-P.x,spec.z-P.z)<R;
  }
  (function(){
    var am=addMesh;
    addMesh=function(spec){
      if(liteBeing(spec)&&!liteNear(spec,LITE_NEAR)){ spec._liteOut=true; return; }
      spec._liteOut=false;
      return am.apply(this,arguments);
    };
  })();
  var liteAt=0;
  function liteTick(dt){
    liteAt-=dt; if(liteAt>0) return; liteAt=1;
    var r=(typeof somnucorRealm==="function")?somnucorRealm():null; if(!r) return;
    var P=camera.position, inCity=(store.here||0)===r.id&&!store.inside, made=0;
    store.objects.forEach(function(o){
      if(o.realm!==r.id||!liteBeing(o)) return;
      var g=meshes[o.id], d=Math.hypot(o.x-P.x,o.z-P.z);
      var ch=typeof charOf==="function"?charOf(o):null; if(ch&&ch.x!==undefined) d=Math.min(d,Math.hypot(ch.x-P.x,ch.z-P.z));
      if(g&&(!inCity||d>LITE_FAR)){ scene.remove(g); delete meshes[o.id]; liteRelease(g); o._liteOut=true; }
      else if(!g&&o._liteOut&&inCity&&d<LITE_NEAR&&made<12){
        o._liteOut=false; addMesh(o); made++;
        var g2=meshes[o.id]; if(g2&&ch&&ch.x!==undefined){ g2.position.x=ch.x; g2.position.z=ch.z; }
      }
    });
  }
  (function(){
    if(typeof transitTick!=="function") return;
    var tt=transitTick;
    transitTick=function(dt){ tt(dt); try{ liteTick(dt); }catch(e){ if(window.console) console.warn("lite:",e); } };
  })();
}
