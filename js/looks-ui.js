/* SomnuMatrix — looks-ui.js
   the inspector's colour and look editor: walls and roofs for buildings,
   everything about a person for people, a plain colour for everything else.
   anything set here is recorded as chosen by the dreamer, never as dreamt.
   loaded as a plain script; shares scope with the other files */
"use strict";

var GENERAL=[NAMED.white,NAMED.cream,NAMED.bone,NAMED.silver,NAMED.grey,NAMED.charcoal,NAMED.black,
  NAMED.red,NAMED.maroon,NAMED.rust,NAMED.ochre,NAMED.gold,NAMED.brown,NAMED.tan,NAMED.olive,
  NAMED.green,NAMED.teal,NAMED.navy,NAMED.blue,NAMED.purple];
var WALLMATS=["brick","stone","wood","siding","plaster","concrete","glass","marble","metal"];
var ROOFMATS=["shingle","tile","slate","thatch","metalroof","flat"];
function hex6(c){ return "#"+("000000"+(c>>>0).toString(16)).slice(-6); }

function provenance(src){
  return src==="stated"?"dreamt":src==="chosen"?"chosen by you":src==="parsed"?"read from the dream":"";
}

/* one row: a label, its provenance, swatches, and a free colour picker */
function swatchRow(title,src,colors,current,onPick){
  var id="lk"+Math.floor(Math.random()*1e9);
  var h='<div class="lk-row"><div class="lk-h">'+title+
    (current===null||current===undefined?' <span class="lk-p">not dreamt</span>':(src?' <span class="lk-p">'+provenance(src)+"</span>":""))+'</div><div class="swatches">';
  colors.forEach(function(c,i){
    h+='<button type="button" class="sw'+(c===current?" on":"")+'" data-lk="'+id+'" data-c="'+c+'" style="background:'+hex6(c)+'" aria-label="colour '+(i+1)+'"></button>';
  });
  h+='<input type="color" class="lk-pick" data-lkp="'+id+'" value="'+hex6(current===null||current===undefined?0x888888:current)+'" aria-label="any colour"></div></div>';
  LKH[id]=onPick;
  return h;
}
function selectRow(title,src,options,current,onPick,labels){
  var id="lk"+Math.floor(Math.random()*1e9);
  var h='<div class="lk-row"><div class="lk-h">'+title+(src?' <span class="lk-p">'+provenance(src)+"</span>":"")+'</div><select data-lks="'+id+'">';
  if(current===null||current===undefined) h+='<option value="" selected>not dreamt</option>';
  options.forEach(function(o,i){ h+='<option value="'+o+'"'+(o===current?" selected":"")+">"+((labels&&labels[i])||o)+"</option>"; });
  h+="</select></div>";
  LKH[id]=onPick;
  return h;
}
var LKH={};

function renderLookEditor(){
  var el=document.getElementById("i-look"); if(!el||!picked) return;
  LKH={};
  var p=picked, a=p.attrs||(p.attrs={}), def=KIT[p.archetype]||{}, h="";
  function done(){ touchPicked(); renderLookEditor(); }
  if(isPerson(p)){
    /* any figure can be named as a deity, when the dream didn't say so in so many words */
    var dname=p.deity&&DEITY[p.deity]?DEITY[p.deity].name:"";
    h+='<div class="lk-row"><div class="lk-h">Who is this?'+(dname?' <span class="lk-p">'+esc(DEITY[p.deity].trad)+"</span>":"")+'</div>'+
      '<input type="text" id="lk-deity" list="lk-deities" placeholder="a person \u2014 or type a deity\u2019s name" value="'+esc(dname)+'" '+
      'style="width:100%;background:var(--void);border:1px solid var(--line);color:var(--bone);padding:6px 8px;font-size:12.5px;border-radius:2px;outline:none">'+
      '<datalist id="lk-deities">'+Object.keys(DEITY).filter(function(k){ return !DEITY[k].dragon; }).sort(function(a,b){ return DEITY[a].name.localeCompare(DEITY[b].name); })
        .map(function(k){ return '<option value="'+esc(DEITY[k].name)+'">'+esc(DEITY[k].trad)+"</option>"; }).join("")+"</datalist></div>";
    var L=lookOf(p), S=L.src||{};
    function set(k,v){ setLook(p,k,v,"chosen"); done(); }
    h+=selectRow("Body",S.sex,["f","m"],L.sex,function(v){ set("sex",v||null); },["woman","man"]);
    h+=swatchRow("Skin",S.skin,SKIN,L.skin,function(v){ set("skin",v); });
    h+=swatchRow("Hair",S.hair,HAIR,L.hair,function(v){ set("hair",v); });
    h+=selectRow("Hair style",S.hairStyle,HAIRSTYLES,L.hairStyle,function(v){ set("hairStyle",v||null); });
    h+=swatchRow("Top",S.top,TOPS,L.top,function(v){ set("top",v); });
    h+=selectRow("What they wear on top",S.topKind,TOPKINDS,L.topKind,function(v){ set("topKind",v||null); },["shirt","coat","dress","robe"]);
    h+=swatchRow("Bottom",S.bottom,BOTTOMS,L.bottom,function(v){ set("bottom",v); });
    h+=selectRow("Below",S.bottomKind,BOTTOMKINDS,L.bottomKind,function(v){ set("bottomKind",v||null); },["trousers","skirt"]);
    h+=swatchRow("Shoes",S.shoes,SHOES,L.shoes,function(v){ set("shoes",v); });
    h+=selectRow("Hat",S.hat,HATS,L.hat,function(v){ set("hat",v||null); },["none","cap","brimmed hat","hood"]);
  } else if(def.cat==="structure"){
    h+=selectRow("Walls made of",a.m?"stated":null,WALLMATS,a.m||WALL_DEFAULT[p.archetype]||"plaster",function(v){ a.m=v; done(); });
    h+=swatchRow("Wall colour",a.c!==undefined?"stated":null,GENERAL,a.c,function(v){ a.c=v; done(); });
    if(ROOF_DEFAULT[p.archetype]!==undefined||p.archetype==="house"||p.archetype==="cottage"){
      h+=selectRow("Roof",a.rm?"stated":null,ROOFMATS,a.rm||ROOF_DEFAULT[p.archetype]||"shingle",function(v){ a.rm=v; done(); },
        ["shingle","tile","slate","thatch","metal","flat"]);
      h+=swatchRow("Roof colour",a.rc!==undefined?"stated":null,GENERAL,a.rc,function(v){ a.rc=v; done(); });
    }
    /* doors and windows */
    h+=selectRow("Windows",a.ws?"stated":null,WINSTYLES,a.ws||"square",function(v){ a.ws=v; done(); },
      ["square","arched","round","tall","shuttered","stained glass","barred","boarded up","no windows"]);
    h+=selectRow("Windows on the sides and back",a.sw===false?"stated":null,["yes","no"],a.sw===false?"no":"yes",function(v){ a.sw=(v!=="no"); done(); });
    h+=swatchRow(a.ws==="shuttered"?"Shutters":"Window frames",a.wf!==undefined?"stated":null,GENERAL,a.wf,function(v){ a.wf=v; done(); });
    h+=selectRow("Front door",a.ds?"stated":null,DOORSTYLES,a.ds||"plain",function(v){ a.ds=v; done(); },
      ["plain","arched","double doors","round","barn doors","iron","glass"]);
    h+=swatchRow("Door colour",a.dc!==undefined?"stated":null,GENERAL,a.dc,function(v){ a.dc=v; done(); });
    /* the inside */
    if(enterable(p)){
      var I=p.inside||{rooms:[],items:[]}, PL=planOf(p);
      function inI(){ return p.inside||(p.inside={rooms:[],items:[]}); }
      function redo(){ save(); if(INT&&INT.spec===p) rebuildInterior(); renderLookEditor(); }
      h+='<div class="lk-row"><div class="lk-h">Inside</div><button class="btn" id="lk-inside" type="button">Walk inside</button>';
      var said=(I.rooms||[]).map(function(r){ return ROOMNAME[r]||r; }).concat((I.items||[]).map(function(x){ return x.k.replace("altarinside","altar").replace("throneseat","throne").replace("wallmirror","mirror"); }));
      h+='<p class="lk-p" style="margin:6px 0 0">'+(said.length?"Dreamt inside: "+esc(said.join(", ")):"Nothing dreamt of the inside yet \u2014 it is furnished for what it is.")+"</p></div>";
      h+=swatchRow("Walls inside",I.wall!==undefined?"stated":null,GENERAL,I.wall!==undefined?I.wall:PL.wall,function(v){ inI().wall=v; redo(); });
      h+=selectRow("Floor inside",I.floor?"stated":null,["wood","tile","stone","carpet","marble","checker"],I.floor||PL.floor,function(v){ inI().floor=v; redo(); },
        ["wooden boards","tiles","stone","carpet","marble","black and white"]);
      h+=selectRow("Bigger inside than out",I.big?"stated":null,["no","yes"],I.big?"yes":"no",function(v){ inI().big=(v==="yes"); redo(); });
      if(PL.mode==="rooms") h+=selectRow("Add a room",null,Object.keys(ROOMNAME),null,function(v){ if(v){ var J=inI(); J.rooms=J.rooms||[]; J.rooms.push(v); redo(); } },
        Object.keys(ROOMNAME).map(function(k){ return ROOMNAME[k].replace(/^(the|a) /,""); }));
    }
    var od=a.doors||[];
    h+=selectRow("More doors",od.length?"stated":null,["none","back","back and side","all sides"],
      od.length>=3?"all sides":od.length===2?"back and side":od.length?"back":"none",
      function(v){ a.doors=v==="all sides"?["back","left","right"]:v==="back and side"?["back","left"]:v==="back"?["back"]:[]; done(); });
  } else {
    h+=swatchRow("Colour",a.c!==undefined?"stated":null,GENERAL,a.c,function(v){ a.c=v; done(); });
  }
  /* anyone or anything living can be a nightmare, or not */
  var nc=charOf(p);
  if(nc&&def.cat==="being"&&!nc.deity){
    h+=selectRow("A nightmare?",nc.src&&nc.src.nightmare?nc.src.nightmare:null,["no","yes"],nc.nightmare?"yes":"no",
      function(v){ nc.nightmare=(v==="yes"); nc.src=nc.src||{}; nc.src.nightmare="chosen"; save(); renderLookEditor(); },
      ["no","yes \u2014 it hunts after dark"]);
    if(nc.defeat&&nc.defeat.length) h+='<p class="lk-p" style="margin:-4px 0 10px">Dreamt ending: '+nc.defeat.map(function(w){ return DEFEAT_LABEL[w]||w; }).join(", ")+"</p>";
  }
  el.innerHTML=h;
  var gi=document.getElementById("lk-inside");
  if(gi) gi.onclick=function(){ var target=p; closeInspect(); setWalk(true); enterBuilding(target); };
  var di=document.getElementById("lk-deity");
  if(di) di.onchange=function(){
    var v=deaccent(di.value).toLowerCase().trim(), key=null;
    Object.keys(DEITY).forEach(function(k){ if(!DEITY[k].dragon&&(deaccent(DEITY[k].name).toLowerCase()===v||DEITY[k].aka.indexOf(v)>-1)) key=k; });
    if(key){ makeDeity(p,key); document.getElementById("i-name").textContent=placeName(p); done(); }
  };
  Array.prototype.forEach.call(el.querySelectorAll("[data-lk]"),function(b){
    b.onclick=function(){ LKH[b.getAttribute("data-lk")](parseInt(b.getAttribute("data-c"),10)); };
  });
  Array.prototype.forEach.call(el.querySelectorAll("[data-lkp]"),function(inp){
    inp.onchange=function(){ LKH[inp.getAttribute("data-lkp")](parseInt(inp.value.slice(1),16)); };
  });
  Array.prototype.forEach.call(el.querySelectorAll("[data-lks]"),function(s){
    s.onchange=function(){ LKH[s.getAttribute("data-lks")](s.value); };
  });
}

/* a figure named as a deity by the dreamer's hand */
function makeDeity(spec,key){
  var d=DEITY[key], c=charOf(spec);
  var existing=deityCharacter(key);
  if(existing&&existing!==c){ existing.objId=spec.id; spec.charId=existing.id; c=existing; }
  spec.archetype="deity"; spec.deity=key; spec.label=d.name; spec.name=d.name; spec.named="stated";
  deityLook(spec,d);
  if(c){ c.deity=key; c.name=d.name; c.awake=true; c.archetype="deity";
    c.aka=[normName(d.name)].concat(d.aka.map(normName)); if(!c.src) c.src={}; c.src.name="chosen"; }
  refresh(spec); save();
}

