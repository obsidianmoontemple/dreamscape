/* SomnuMatrix — colors.js
   the colour vocabulary, materials, and how residents look.
   a dreamt figure's look comes only from the dream or from the dreamer's hand;
   the nameless crowd is varied at random. skin is never inferred from words.
   loaded as a plain script; shares scope with the other files */
"use strict";

/* ---- fifty-odd named colours, tuned to read well under the Atlas's light ---- */
var NAMED={
  white:0xE8E4DA, ivory:0xE6DCC2, cream:0xE0D2B0, bone:0xC9BEA8, silver:0xA7AAB0,
  grey:0x7B7D82, gray:0x7B7D82, charcoal:0x3A3C42, black:0x1B1C20,
  red:0xA8322B, crimson:0x8E1F2A, scarlet:0xC0392B, maroon:0x5E1E22, burgundy:0x6B1E2E,
  rose:0xC47A86, pink:0xD99AAE, coral:0xD9745A, salmon:0xD98E78,
  orange:0xC8662A, amber:0xC8902E, rust:0x8A4526, copper:0xA35F3A, ochre:0xB08A3A,
  gold:0xC7A043, golden:0xC7A043, yellow:0xD4B83C, mustard:0xB89A2E,
  brown:0x6B4A32, tan:0xB08F66, beige:0xC9B38E, khaki:0xA89A6C, chestnut:0x7A4028, chocolate:0x4E3222,
  green:0x3F7A3A, olive:0x6B6A34, emerald:0x2E8A5E, forest:0x2C4F2A, sage:0x8FA283,
  lime:0x8FB83A, mint:0x9CCDB0, jade:0x3E8C73,
  teal:0x2F7A7A, turquoise:0x3AA3A0, cyan:0x4AA8C0, aqua:0x5BB8C4,
  blue:0x2F5E9E, navy:0x1F2E55, azure:0x4A86C8, cobalt:0x2A4DA0, indigo:0x3A2E6E, denim:0x3A4E72,
  purple:0x5E3A7E, violet:0x7A55A8, lavender:0xC4ADE8, plum:0x6A3B5A, lilac:0xB7A0C6, magenta:0xA83A7E,
  blonde:0xC9A96A, auburn:0x7A3A22
};
var TWOWORD={"sky blue":0x86AED4,"navy blue":0x1F2E55,"dark green":0x24462A,"light blue":0x9DBCDC,
  "dark blue":0x1E3560,"blood red":0x7A1414,"bright red":0xD03A2E,"light grey":0xB0B2B6,"dark grey":0x45474C,
  "light gray":0xB0B2B6,"dark gray":0x45474C,"forest green":0x2C4F2A,"bottle green":0x1F4A34,"midnight blue":0x1A2244};

function colorWord(w){ return NAMED[String(w).toLowerCase()]; }
function shade(c,k){ return blend(c,k>0?0xFFFFFF:0x000000,Math.abs(k)); }

/* ---- what walls and roofs are made of ---- */
var WALLWORDS={brick:"brick",bricks:"brick",stone:"stone",stones:"stone",wooden:"wood",wood:"wood",timber:"wood",
  log:"wood",plank:"siding",clapboard:"siding",concrete:"concrete",cement:"concrete",glass:"glass",mirrored:"glass",
  marble:"marble",plaster:"plaster",stucco:"plaster",whitewashed:"plaster",adobe:"plaster",iron:"metal",
  steel:"metal",metal:"metal",tin:"metal",corrugated:"metal"};
var ROOFWORDS={thatched:"thatch",thatch:"thatch",tiled:"tile",slate:"slate",shingled:"shingle",flat:"flat"};

var MATCOLOR={brick:0x8E5040,stone:0x8A857A,wood:0x7A5A3C,siding:0xA9A294,plaster:0xB7AD98,concrete:0x8E8C88,
  glass:0x5E7C94,marble:0xC9C4B8,metal:0x7A7F86,shingle:0x4A4744,tile:0x9A5238,slate:0x3E4450,
  thatch:0x9A8456,metalroof:0x6E747A};

var WALL_DEFAULT={house:"siding",cottage:"plaster",apartment:"brick",tower:"concrete",skyscraper:"glass",
  motel:"plaster",hotel:"concrete",institution:"stone",hospital:"plaster",school:"brick",church:"stone",
  cathedral:"stone",bank:"stone",library:"stone",station:"brick",courthouse:"stone",shop:"brick",
  warehouse:"metal",factory:"brick",barn:"wood",shed:"wood",garage:"concrete",gasstation:"concrete",
  bunker:"concrete",ruin:"stone",lighthouse:"plaster",windmill:"stone",altar:"stone"};
var ROOF_DEFAULT={house:"shingle",cottage:"thatch",church:"slate",cathedral:"slate",barn:"metalroof",
  tower:"slate",lighthouse:"metalroof",windmill:"shingle",courthouse:"slate",shed:"metalroof",tent:"",well:"shingle"};

/* ---- residents ---- */
var SKIN=[0xF6E0D0,0xF1D5C0,0xE6BD9C,0xDCAF8E,0xD6A27C,0xC28862,0xB07A52,0xA66C48,0x93603E,0x875335,0x74492E,0x683F28,0x553324,0x48291B,0x3A2118];
var HAIR=[0x0B0908,0x16130F,0x2A1F18,0x3A2618,0x5E3E26,0x7A5230,0x7A3A22,0xA4472A,0xC9A96A,0xE0D6B8,0xEFE6CE,0x8E8C88,0xB8B4AE,0xE4E1DA,0x6B2A5E,0x2F5E9E,0x3F7A3A];
var TOPS=[NAMED.white,NAMED.black,NAMED.grey,NAMED.navy,NAMED.blue,NAMED.red,NAMED.maroon,NAMED.green,
          NAMED.olive,NAMED.mustard,NAMED.cream,NAMED.purple];
var BOTTOMS=[NAMED.black,NAMED.charcoal,NAMED.denim,NAMED.khaki,NAMED.brown,NAMED.grey,NAMED.navy,NAMED.olive,NAMED.tan,NAMED.burgundy];
var SHOES=[NAMED.black,NAMED.brown,NAMED.white,NAMED.tan,NAMED.red,NAMED.grey];
var HAIRSTYLES=["short","buzz","waves","curly","coily","afro","locs","braids","long","bun","ponytail","headwrap","bald"];
var HATS=["none","cap","brimmed","hood"];
var TOPKINDS=["shirt","coat","dress","robe"];
var BOTTOMKINDS=["trousers","skirt"];

/* how an unremembered figure looks: plainly not yet dreamt */
var UNSEEN={skin:0x8F8C86,hair:0x5A5854,top:0x5E5E64,bottom:0x4E4E54,shoes:0x3A3A3E};

var FEMALE=/^(goddess|woman|women|girl|lady|mother|mum|mom|grandmother|grandma|granny|sister|daughter|aunt|nun|queen|wife|bride|widow|maiden|old woman|she)$/;
var MALE=/^(god|man|men|boy|gentleman|father|dad|grandfather|grandpa|brother|son|uncle|monk|king|husband|groom|widower|old man|he)$/;
function sexOfWord(w){
  w=String(w||"").toLowerCase().trim();
  if(FEMALE.test(w)) return "f";
  if(MALE.test(w)) return "m";
  /* phrases too: "the woman", "an old man", "my sister" — the telling word is the last one */
  var last=w.split(/[\s-]+/).pop();
  return FEMALE.test(last)?"f":MALE.test(last)?"m":null;
}

function pickSeed(arr,seed){ return arr[Math.abs(seed)%arr.length]; }

/* the crowd: varied, seeded so a stranger keeps their clothes while you watch */
function randomLook(seed,kind){
  var h=hash(String(seed));
  var sex=(h%2)?"f":"m";
  var top=pickSeed(TOPKINDS.slice(0,2).concat(sex==="f"?["dress"]:["shirt"]),h>>>3);
  return {sex:sex,age:kind==="child"?"child":"adult",
    skin:pickSeed(SKIN,h>>>5),hair:pickSeed(HAIR,h>>>7),
    hairStyle:pickSeed(sex==="f"?["long","bun","ponytail","curly","short"]:["short","short","curly","bald","long"],h>>>9),
    top:pickSeed(TOPS,h>>>11),topKind:top,
    bottom:pickSeed(BOTTOMS,h>>>13),bottomKind:(sex==="f"&&(h>>>15)%3===0)?"skirt":"trousers",
    shoes:pickSeed(SHOES,h>>>17),hat:((h>>>19)%7===0)?pickSeed(["cap","brimmed","hood"],h>>>21):"none",
    build:0.94+((h>>>23)%12)/100,src:{}};
}
/* a dreamt figure starts with nothing but what the dream said */
function blankLook(kind){
  return {sex:null,age:kind==="child"?"child":"adult",skin:null,hair:null,hairStyle:null,top:null,topKind:null,
    bottom:null,bottomKind:null,shoes:null,hat:null,build:1,src:{}};
}
function lookOf(spec){
  if(!spec.look) spec.look=spec.filler?randomLook(spec.id,spec.archetype):blankLook(spec.archetype);
  return spec.look;
}
function setLook(spec,field,value,src){
  var L=lookOf(spec); L[field]=value; if(!L.src) L.src={}; L.src[field]=src||"stated";
}

/* ---- reading appearance out of a dream ----
   "a woman in a red coat", "wearing a navy dress", "grey-haired", "with long black hair" */
var GARMENT={coat:["top","coat"],overcoat:["top","coat"],raincoat:["top","coat"],jacket:["top","coat"],
  blazer:["top","coat"],cloak:["top","robe"],cape:["top","robe"],robe:["top","robe"],robes:["top","robe"],
  gown:["top","dress"],dress:["top","dress"],frock:["top","dress"],shirt:["top","shirt"],blouse:["top","shirt"],
  sweater:["top","shirt"],jumper:["top","shirt"],hoodie:["top","shirt"],top:["top","shirt"],vest:["top","shirt"],
  uniform:["top","shirt"],suit:["suit","shirt"],trousers:["bottom","trousers"],pants:["bottom","trousers"],
  jeans:["bottom","trousers"],slacks:["bottom","trousers"],shorts:["bottom","trousers"],skirt:["bottom","skirt"],
  shoes:["shoes",null],boots:["shoes",null],sneakers:["shoes",null],heels:["shoes",null],sandals:["shoes",null],
  slippers:["shoes",null],hat:["hat","brimmed"],cap:["hat","cap"],hood:["hat","hood"],bonnet:["hat","hood"]};

function colorAt(words,i){
  var two=(words[i-1]&&(words[i-1]+" "+words[i]));
  if(two&&TWOWORD[two]) return {c:TWOWORD[two],n:2};
  var c=NAMED[words[i]]; if(c===undefined) return null;
  if(words[i-1]==="dark"||words[i-1]==="deep") return {c:shade(c,-0.35),n:2};
  if(words[i-1]==="light"||words[i-1]==="pale"||words[i-1]==="bright") return {c:shade(c,0.3),n:2};
  return {c:c,n:1};
}

/* returns what each clothing phrase says, with the span of text it used,
   so those colour words are not also read as the colour of some building */
function appearanceIn(low){
  var out=[], words=[], pos=[], m, re=/[a-z]+(?:-[a-z]+)?/g;
  while((m=re.exec(low))){ words.push(m[0]); pos.push(m.index); }
  for(var i=0;i<words.length;i++){
    var w=words[i];
    var hy=/^([a-z]+)-haired$/.exec(w);
    if(hy){
      var hc=NAMED[hy[1]]!==undefined?NAMED[hy[1]]:({fair:NAMED.blonde,dark:HAIR[0],white:HAIR[8],silver:HAIR[7]})[hy[1]];
      if(hc!==undefined) out.push({at:pos[i],end:pos[i]+w.length,field:"hair",value:hc});
      continue;
    }
    if(w==="hair"){
      var c=null, start=pos[i], style=null;
      for(var k=i-1;k>=Math.max(0,i-3);k--){
        var ca=colorAt(words,k); if(ca&&c===null){ c=ca.c; start=pos[k-ca.n+1]; }
        if(/^(long|flowing)$/.test(words[k])) style="long";
        if(/^(curly|wild|frizzy)$/.test(words[k])) style="curly";
        if(/^(short|cropped)$/.test(words[k])) style="short";
      }
      if(c!==null) out.push({at:start,end:pos[i]+4,field:"hair",value:c});
      if(style) out.push({at:start,end:pos[i]+4,field:"hairStyle",value:style});
      continue;
    }
    if(/^(bald|shaven)$/.test(w)){ out.push({at:pos[i],end:pos[i]+w.length,field:"hairStyle",value:"bald"}); continue; }
    var G=GARMENT[w]; if(!G) continue;
    var col=null, st=pos[i];
    for(var j=i-1;j>=Math.max(0,i-3);j--){
      var cj=colorAt(words,j); if(cj){ col=cj.c; st=pos[j-cj.n+1]; break; }
      if(/^(in|wearing|with|and)$/.test(words[j])) break;
    }
    /* without a colour, a garment word only counts when the sentence is about wearing it:
       "in a coat", "wearing boots", "her dress" — not "the top of the stairs" */
    if(col===null){
      var ctx=false;
      for(var c2=i-1;c2>=Math.max(0,i-3);c2--) if(/^(in|wearing|wore|dressed|his|her|their|with)$/.test(words[c2])) ctx=true;
      if(!ctx) continue;
    }
    var slot=G[0], kind=G[1];
    if(slot==="suit"){
      if(col!==null){ out.push({at:st,end:pos[i]+w.length,field:"top",value:col}); out.push({at:st,end:pos[i]+w.length,field:"bottom",value:col}); }
      out.push({at:st,end:pos[i]+w.length,field:"topKind",value:"coat"});
      continue;
    }
    if(slot==="hat"){ out.push({at:st,end:pos[i]+w.length,field:"hat",value:kind}); continue; }
    if(col!==null) out.push({at:st,end:pos[i]+w.length,field:slot,value:col});
    if(kind&&slot==="top") out.push({at:st,end:pos[i]+w.length,field:"topKind",value:kind});
    if(kind&&slot==="bottom") out.push({at:st,end:pos[i]+w.length,field:"bottomKind",value:kind});
    if(kind==="dress"&&col!==null) out.push({at:st,end:pos[i]+w.length,field:"bottom",value:col});
  }
  return out;
}

