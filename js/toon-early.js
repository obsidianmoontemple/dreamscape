/* SomnuMatrix — toon-early.js
   the "Stylized" look begins here, before anything in the world is made:
   every surface that would have been drawn with soft, per-corner lighting
   (which reads muddy and faceted on simple shapes) is drawn instead with
   clean cel-shading — light worked out at every pixel, stepped into a few
   bright bands — and a soft rim of light round every edge.
   Which look is used is read once, when the page loads. */
"use strict";
var GFX_STYLE=(function(){
  var c={}; try{ c=JSON.parse(localStorage.getItem(/[?&]test=1\b/.test(location.search)?"dreamwalker.testcfg":"dreamwalker.cfg2")||"{}")||{}; }catch(e){}
  if(c.gfx==="stylized"||c.gfx==="high"||c.gfx==="standard") return c.gfx;
  var phone=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent||"")||(navigator.maxTouchPoints>1&&!/Windows|Macintosh|Linux x86/i.test(navigator.userAgent||""));
  return phone?"standard":"stylized";
})();
var TOON=null;
if(GFX_STYLE==="stylized"&&typeof THREE!=="undefined"&&THREE.MeshToonMaterial){
  TOON={};
  /* four bands of light: the shadow side stays bright and coloured, never muddy */
  var tg=new Uint8Array([112,112,112,255, 168,168,168,255, 212,212,212,255, 238,238,238,255]);
  TOON.gradient=new THREE.DataTexture(tg,4,1,THREE.RGBAFormat);
  TOON.gradient.minFilter=TOON.gradient.magFilter=THREE.NearestFilter; TOON.gradient.generateMipmaps=false; TOON.gradient.needsUpdate=true;
  TOON.rim={rimColor:{value:new THREE.Color(0xFFF2DC)},rimStrength:{value:0.32}};
  TOON.hook=function(shader){
    shader.uniforms.rimColor=TOON.rim.rimColor; shader.uniforms.rimStrength=TOON.rim.rimStrength;
    shader.fragmentShader=shader.fragmentShader
      .replace("uniform vec3 diffuse;","uniform vec3 diffuse;\nuniform vec3 rimColor;\nuniform float rimStrength;")
      .replace("vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;",
        "vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n"+
        "float rimF = 1.0 - saturate( dot( normalize( vViewPosition ), normal ) );\n"+
        "vec3 upV = normalize( ( viewMatrix * vec4( 0.0, 1.0, 0.0, 0.0 ) ).xyz );\n"+
        "rimF *= 1.0 - abs( dot( normal, upV ) );\n"+
        "outgoingLight += rimColor * diffuseColor.rgb * smoothstep( 0.55, 0.95, rimF ) * rimStrength;");
  };
  var probe=new THREE.MeshToonMaterial();
  function toonParams(p){
    var o={gradientMap:TOON.gradient};
    if(p) Object.keys(p).forEach(function(k){ if(k in probe&&k!=="gradientMap") o[k]=p[k]; });
    return o;
  }
  function makeToon(p){ var m=new THREE.MeshToonMaterial(toonParams(p)); m.onBeforeCompile=TOON.hook; m.userData.toon=1; return m; }
  TOON.Lambert=THREE.MeshLambertMaterial; TOON.Phong=THREE.MeshPhongMaterial;
  THREE.MeshLambertMaterial=function(p){ return makeToon(p); };
  THREE.MeshLambertMaterial.prototype=TOON.Lambert.prototype;
  THREE.MeshPhongMaterial=function(p){ var m=makeToon(p); if(p&&p.shininess>40){ m.userData.shiny=1; } return m; };
  THREE.MeshPhongMaterial.prototype=TOON.Phong.prototype;
}
