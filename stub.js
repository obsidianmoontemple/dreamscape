/* A stand-in browser for running the app's logic under Node, with no screen.
   Only what the app touches is imitated. Used by run-node.js and the GitHub check. */
function V(){return {set:function(){},value:0,x:0,y:0,z:0};}
function Obj(){
  this.children=[]; this.position={x:0,y:0,z:0,set:function(a,b,c){this.x=a;this.y=b;this.z=c;}};
  this.rotation={x:0,y:0,z:0,order:"",set:function(a,b,c){this.x=a;this.y=b;this.z=c;}};
  this.scale={set:function(){}}; this.userData={};
  this.add=function(o){this.children.push(o);}; this.remove=function(o){
    var i=this.children.indexOf(o); if(i>-1) this.children.splice(i,1); };
  this.traverse=function(f){f(this); this.children.forEach(function(c){c.traverse&&c.traverse(f);});};
  this.lookAt=function(){}; this.getWorldDirection=function(){return {x:0,y:0,z:-1};};
  this.updateProjectionMatrix=function(){};
}
function G(){ this.dispose=function(){}; this.type="Geo"; }
function MatStub(o){ Object.assign(this,o||{}); var c=(o&&o.color!==undefined)?o.color:0xffffff;
  this.color={hex:c,setHex:function(x){this.hex=x;return this;}}; this.dispose=function(){}; }
global.THREE={
  Scene:function(){ Obj.call(this); this.background=null; this.fog=null; },
  Color:function(h){ this.hex=h; this.setHex=function(x){this.hex=x;return this;}; },
  FogExp2:function(c,d){ this.color={hex:c,setHex:function(x){this.hex=x;}}; this.density=d; },
  PerspectiveCamera:function(){ Obj.call(this); this.aspect=1; },
  WebGLRenderer:function(){ this.domElement={addEventListener:function(){},requestPointerLock:function(){},style:{}};
    this.setPixelRatio=function(){}; this.setSize=function(){}; this.render=function(){}; },
  HemisphereLight:function(){Obj.call(this); this.intensity=1; this.color={setHex:function(){}}; this.groundColor={setHex:function(){}};},
  DirectionalLight:function(){Obj.call(this); this.intensity=1; this.color={setHex:function(){}};},
  Mesh:function(g,m){ Obj.call(this); this.isMesh=true; this.geometry=g||new G(); this.material=m||{}; },
  Group:function(){ Obj.call(this); },
  BoxGeometry:G, CylinderGeometry:G, ConeGeometry:G, SphereGeometry:G,
  IcosahedronGeometry:G, PlaneGeometry:function(){G.call(this); this.type="PlaneGeometry";},
  TorusGeometry:G, RingGeometry:G, CircleGeometry:G,
  BufferGeometry:function(){ G.call(this); this.setAttribute=function(){}; },
  BufferAttribute:function(){},
  Points:function(g,m){ Obj.call(this); this.geometry=g; this.material=m; },
  PointsMaterial:MatStub,
  ShaderMaterial:function(o){ Object.assign(this,o); this.dispose=function(){}; }, GridHelper:function(){Obj.call(this);},
  MeshLambertMaterial:MatStub,
  MeshBasicMaterial:MatStub,
  CanvasTexture:function(){ this.anisotropy=0; },
  Raycaster:function(){ this.setFromCamera=function(){}; this.intersectObjects=function(){return [];};
    this.ray={intersectPlane:function(pl,v){ v.x=0; v.y=0; v.z=0; return v; }}; },
  Plane:function(n,c){ this.normal=n; this.constant=c; },
  Clock:function(){ this.t=0; this.getDelta=function(){return 0.016;}; this.getElapsedTime=function(){return this.t+=0.016;}; },
  Vector3:function(){ return V(); },
  DoubleSide:2, FrontSide:0
};
var _els={};
function El(id){ this.id=id; this.style={}; this.classList={
    _s:{}, add:function(c){this._s[c]=1;}, remove:function(c){delete this._s[c];},
    toggle:function(c,v){ if(v===undefined) v=!this._s[c]; if(v)this._s[c]=1; else delete this._s[c]; },
    contains:function(c){return !!this._s[c];} };
  this.value=""; this.textContent=""; this.innerHTML=""; this.children=[];
  this.addEventListener=function(){}; this.setAttribute=function(){}; this.getAttribute=function(){return null;};
  this.appendChild=function(c){this.children.push(c);};
  this.querySelectorAll=function(){return [];};
  this.focus=function(){}; this.scrollTop=0; this.scrollHeight=0; this.disabled=false;
  this.tagName="DIV";
}
global.document={
  readyState:"complete",
  getElementById:function(id){ if(!_els[id]){ _els[id]=new El(id); } return _els[id]; },
  createElement:function(t){ if(t==="canvas") return {width:0,height:0,getContext:function(){ var n=function(){}; return {
      fillRect:n,strokeRect:n,fillText:n,clearRect:n,beginPath:n,arc:n,ellipse:n,closePath:n,fill:n,
      measureText:function(){return{width:10};},
      createRadialGradient:function(){return {addColorStop:n};}};}};
    return new El(t); },
  addEventListener:function(){}, querySelectorAll:function(){return [];}, activeElement:null, exitPointerLock:function(){}, pointerLockElement:null,
  documentElement:{}
};
global.window={ innerWidth:1200, innerHeight:800, devicePixelRatio:1,
  addEventListener:function(){}, AudioContext:null, webkitAudioContext:null,
  SpeechRecognition:null, webkitSpeechRecognition:null };
global.innerWidth=1200; global.innerHeight=800; global.devicePixelRatio=1;
global.addEventListener=function(){};
var _store={};
global.localStorage={ getItem:function(k){return _store[k]||null;}, setItem:function(k,v){_store[k]=v;},
  removeItem:function(k){delete _store[k];} };
global.confirm=function(){return true;};
global.TextEncoder=require('util').TextEncoder;
global.crypto=require('crypto').webcrypto;
global.window.crypto=global.crypto;
global.requestAnimationFrame=function(){};
global.setTimeout=function(f){ return 0; };
global.clearTimeout=function(){};
global.fetch=function(){ return Promise.reject(new Error("offline in test")); };
global.Blob=function(){}; global.URL={createObjectURL:function(){return "";},revokeObjectURL:function(){}};
