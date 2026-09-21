/* Dream Walker's Atlas — names.js
   streets, addresses and the names of places
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   5b. NAMES — nowhere in a dream is nameless
   ============================================================ */
var SURNAME=["Halloway","Verrick","Mourne","Ashgrove","Callender","Dray","Enfield","Fenwick",
"Gallow","Harrow","Idris","Jarrow","Kestrel","Larkin","Nettle","Orrin","Pell","Quill",
"Ravensworth","Sable","Thorn","Underhill","Vance","Wrenn","Yarrow","Ambrose","Brandt",
"Cinder","Doyle","Ellery","Fallow","Grieve","Hobb","Innes","Keld","Lowry","Merriden",
"Norrell","Ombry","Pargeter","Rook","Stannard","Tarrant","Usher","Vesper","Whitlock",
"Aldrich","Blackwood","Cotter","Denning","Esker","Frome","Garrow","Holt","Ives","Joyner"];
var SAINT=["Aubin","Cleve","Mara","Oswin","Bride","Alban","Isolde","Ferrin","Gethin","Ninian",
"Dunstan","Perpetua","Cuthbert","Winifred","Malo","Enda","Corbin"];
var STYPE=["Street","Road","Lane","Row","Walk","Crescent","Terrace","Hill","Rise","Way",
"Close","Gate","Passage","Yard","Mews"];

function hash(str){
  var h=2166136261;
  for(var i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619); }
  return h>>>0;
}
function choose(arr,seed){ return arr[seed%arr.length]; }

/* streets run continuously: one name per grid line, not per block */
function streetName(axis,index){
  var h=hash(axis+":"+index+":street");
  return choose(SURNAME,h)+" "+choose(STYPE,h>>>7);
}
/* which street does this lot front onto, and at what number */
function addressOf(bx,bz,k){
  var side=Math.floor(k/5)%4, i=k%5;
  var street, num;
  if(side===0)      street=streetName("ew",bz);
  else if(side===1) street=streetName("ns",bx);
  else if(side===2) street=streetName("ew",bz-1);
  else              street=streetName("ns",bx-1);
  var base=Math.abs((side<2?bx:bz))*20;
  num=base+i*2+((side===1||side===2)?1:2);
  return {street:street,num:num};
}

function nameFor(spec,addr){
  var h=hash(spec.id), sn=choose(SURNAME,h), sn2=choose(SURNAME,h>>>9), st=choose(SAINT,h>>>5);
  var a=spec.archetype;
  switch(a){
    case "house": case "cottage":
      return (h%3===0)?("The "+sn+" house"):(addr.num+" "+addr.street);
    case "apartment": return sn+((h%2)?" Court":" Buildings");
    case "motel":     return "The "+sn+" Motel";
    case "hotel":     return "The "+sn;
    case "tower": case "skyscraper": return sn+" Tower";
    case "church": case "chapel":    return "St "+st+"'s";
    case "cathedral": return st+" Cathedral";
    case "hospital":  return "St "+st+"'s Hospital";
    case "school":    return sn+" School";
    case "bank":      return sn+" & "+sn2.slice(0,1)+"o.";
    case "library":   return "The "+sn+" Library";
    case "station":   return addr.street.split(" ")[0]+" Station";
    case "courthouse":return sn+" Court House";
    case "institution":return "The "+sn+" Institute";
    case "shop":      return sn+"'s";
    case "warehouse": case "factory": return sn+" Works";
    case "barn":      return sn+" Farm";
    case "lighthouse":return sn+" Light";
    case "windmill":  return sn+" Mill";
    case "pier":      return sn+" Pier";
    case "bridge":    return sn+" Bridge";
    case "water":     return "The "+sn;
    case "hill":      return sn+" Hill";
    case "mountain":  return sn+" Fell";
    case "grass":     return sn+" Green";
    case "cave":      return sn+" Hollow";
    case "tomb": case "grave": return "The "+sn+" plot";
    case "monument": case "statue": return "The "+sn+" Memorial";
    case "road": case "sidewalk": return addr.street;
    case "tunnel":    return sn+" Tunnel";
    case "gate":      return sn+" Gate";
    case "fountain":  return sn+" Fountain";
    case "well":      return sn+" Well";
    case "ruin":      return "The old "+sn+" place";
    default: return null;
  }
}

function placeName(spec){
  if(!spec) return "";
  if(spec.filler) return "someone";
  return spec.name || spec.label || spec.archetype;
}
function byName(n){
  if(!n) return null;
  var t=String(n).toLowerCase().replace(/^the\s+/,"").trim();
  for(var i=0;i<store.objects.length;i++){
    var o=store.objects[i];
    var a=(o.name||"").toLowerCase().replace(/^the\s+/,"");
    var b=(o.label||"").toLowerCase().replace(/^the\s+/,"");
    if(a===t||b===t||(a&&a.indexOf(t)>-1)||(b&&b.indexOf(t)>-1)) return o;
  }
  return null;
}
function nearestNamed(x,z,range){
  var best=null,bd=(range||120)*(range||120);
  for(var i=0;i<store.objects.length;i++){
    var o=store.objects[i];
    if(!o.name||o.filler) continue;
    var dx=o.x-x, dz=o.z-z, d=dx*dx+dz*dz;
    if(d<bd){ bd=d; best=o; }
  }
  return best;
}


