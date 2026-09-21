/* Dream Walker's Atlas — parse.js
   vocabulary, the instant tier and the Grok tier
   loaded as a plain script; shares scope with the other files */
"use strict";
/* ============================================================
   10. VOCABULARY — instant tier
   ============================================================ */
var VOCAB={
house:["house","home","cabin","bungalow","farmhouse","dwelling","residence"],
cottage:["log cabin","wooden cabin","cottage","shack","hut","cabin"],
apartment:["apartment","flat","tenement","block of flats","condo","projects"],
tower:["tower","highrise","high-rise","spire"],
skyscraper:["skyscraper","tower block"],
motel:["motel","inn","lodge"],
hotel:["hotel","resort"],
institution:["institution","asylum","facility","complex","office","offices","government"],
hospital:["hospital","clinic","infirmary","ward","emergency room","surgery"],
school:["school","classroom","college","university","academy","gymnasium"],
church:["church","chapel","parish","steeple","mosque","synagogue","shrine"],
cathedral:["cathedral","basilica","minster"],
bank:["bank vault","bank","treasury"],
library:["library","archive","records"],
station:["train depot","bus depot","railway station","train station","bus station","station","terminal","platform","airport","depot"],
courthouse:["courthouse","court","tribunal","city hall","town hall"],
shop:["shop","store","market","cafe","diner","bar","pub","restaurant","bakery","boutique","pharmacy"],
warehouse:["storage depot","supply depot","goods depot","warehouse","hangar","storage"],
factory:["steel mill","cotton mill","paper mill","factory","plant","refinery","foundry","mill"],
barn:["barn","stable","silo"],
shed:["garden shed","tool shed","shed","outhouse"],
garage:["garage","carport","workshop"],
ruin:["ruin","ruins","rubble","wreckage","derelict","collapsed"],
tent:["tent","teepee","canopy","marquee"],
bunker:["bomb shelter","air raid shelter","bunker","shelter","pillbox","vault"],
bridge:["bridge","crossing","overpass","viaduct","footbridge"],
stairs:["stairs","staircase","steps","stairway","stairwell","escalator"],
tunnel:["tunnel","underpass","subway","passage","culvert"],
gate:["stone archway","iron gate","garden gate","gateway","entrance","gate"],
statue:["statue","effigy","idol","figure on a plinth"],
monument:["monument","obelisk","memorial","pillar"],
fountain:["fountain","basin"],
well:["well","cistern"],
tomb:["tomb","mausoleum","crypt","sepulchre"],
grave:["grave","headstone","gravestone","graveyard","cemetery"],
lighthouse:["lighthouse","beacon"],
windmill:["windmill","water mill","watermill","old mill"],
pier:["pier","jetty","dock","wharf","boardwalk"],
booth:["booth","phone box","telephone box","kiosk","stall"],
tree:["tree","trees","oak","elm","willow","birch","orchard","grove","woods","forest"],
pine:["pine tree","pine trees","pine","fir tree","fir","spruce","conifer","evergreen"],
deadtree:["dead tree","dead trees","bare tree","burnt tree","skeleton tree"],
palm:["palm tree","palm trees","palm"],
bush:["bush","shrub","thicket","bracken"],
hedge:["hedge","hedgerow"],
grass:["grass","lawn","meadow","field","clearing"],
water:["water","river","lake","sea","ocean","pond","flood","canal","stream","marsh","bay"],
gasstation:["gas station","petrol station","filling station","service station","gas pumps","forecourt"],
parking:["parking lot","car park","parking garage","parking"],
playground:["playground","swings","play park","swing set"],
pool:["swimming pool","pool","lido"],
busstop:["bus stop","bus shelter"],
hill:["hill","mound","rise","dune","knoll"],
mountain:["mountain","peak","summit","range","cliff","ridge"],
rock:["rock","boulder","stone","crag"],
cave:["cave","cavern","grotto","hollow","burrow"],
stump:["stump"],
log:["log","fallen tree","trunk"],
flowers:["flowers","blossom","roses","garden bed","wildflowers"],
road:["road","street","avenue","highway","motorway","hallway","corridor","alley","driveway","path","lane","track","asphalt"],
sidewalk:["sidewalk","pavement","kerb","curb"],
fence:["fence","picket","railing","paling"],
chainlink:["chain link","chainlink","wire fence","mesh fence","chain-link"],
stonewall:["stone wall","brick wall","garden wall","wall","barrier","rampart"],
streetlight:["streetlight","street light","lamp post","lamppost","streetlamp"],
trafficlight:["traffic light","stoplight","signal"],
sign:["sign","signpost","notice","placard","marker"],
billboard:["billboard","hoarding","advertisement","poster board"],
bench:["bench","seat","pew"],
pylon:["pylon","transmission tower","power line","powerline","electricity tower"],
hydrant:["hydrant","fire hydrant"],
mailbox:["mailbox","postbox","letterbox"],
trashcan:["bin","trash can","dumpster","garbage can","rubbish bin"],
bollard:["bollard","post"],
car:["car","automobile","sedan","taxi","cab","vehicle"],
truck:["truck","lorry","van","pickup","tanker"],
bus:["bus","coach","tram","trolley"],
train:["train","carriage","locomotive","railcar","boxcar"],
boat:["boat","ship","ferry","yacht","barge","canoe","raft"],
bicycle:["bicycle","bike","cycle","motorcycle","moped"],
plane:["plane","aeroplane","airplane","aircraft","jet"],
human:["man","woman","person","stranger","someone","somebody","figure","adult","guard","nurse","priest","driver","teacher","doctor","soldier"],
child:["child","kid","boy","girl","infant","baby","toddler"],
crowd:["crowd","people","mob","queue","congregation","audience","throng"],
shadow:["shadow","shade","dark figure","silhouette","presence","watcher"],
dog:["dog","hound","wolf","puppy"],
cat:["cat","kitten","feline"],
horse:["horse","pony","mare","stallion","deer","stag","cow","sheep"],
bird:["bird","crow","raven","gull","owl","pigeon","hawk"],
creature:["creature","beast","monster","thing","entity","animal"],
portal:["door","doorway","portal","threshold","mirror","opening","hatch"],
circle:["ritual circle","stone circle","summoning circle","circle of salt","sigil on the ground","circle"],
altar:["altar","shrine table","offering table"],
standingstones:["standing stones","stone ring","menhirs","henge"],
rift:["rift","tear in the air","fissure","crack in the world","seam"],
impossiblestair:["impossible stairs","escher stairs","stairs that went nowhere","endless staircase","stairs that folded"],
veil:["veil","curtain of light","membrane","barrier of light","shimmer"],
brazier:["brazier","fire bowl","burning bowl","censer"],
secretdoor:["secret door","hidden door","concealed door","false wall","hidden panel","secret passage","hidden passage"]
};

var MODIFIERS={
tall:{h:1.9},towering:{h:2.6},huge:{s:1.9},giant:{s:2.3},enormous:{s:2.4},massive:{s:2.1},
vast:{s:2},endless:{h:3},immense:{s:2.2},high:{h:1.6},"double":{s:1.4},
tiny:{s:.45},small:{s:.6},little:{s:.6},low:{h:.55},squat:{h:.6},miniature:{s:.35},
narrow:{w:.45},thin:{w:.45},slim:{w:.5},wide:{w:1.9},broad:{w:1.8},long:{d:2.3},deep:{d:1.9},
old:{c:0x453F34},ancient:{c:0x3E3830},ruined:{c:0x37322A},broken:{c:0x37322A},
burnt:{c:0x221D19},charred:{c:0x1C1815},abandoned:{c:0x3D392F},rotting:{c:0x33301F},
dark:{c:0x181A20},black:{c:0x101116},white:{c:0xB9B3A6},pale:{c:0x9A9486},
red:{c:0x7A3128},crimson:{c:0x6B2420},blue:{c:0x2E4566},green:{c:0x33502F},
yellow:{c:0x8A7A2E},gold:{c:0x8A6A2E},golden:{c:0x8A6A2E},grey:{c:0x4B4C50},gray:{c:0x4B4C50},
brown:{c:0x4C3B2C},rust:{c:0x6A3A22},rusted:{c:0x6A3A22},silver:{c:0x6E7278},
brick:{c:0x5E3A30},stone:{c:0x4E4C46},wooden:{c:0x503C29},concrete:{c:0x4A4A4C},
glass:{c:0x2E4560},marble:{c:0xA8A398},iron:{c:0x3C3E44},steel:{c:0x53565C}
};

var EMOTIONS=["afraid","scared","terrified","fear","dread","panic","calm","peaceful","safe",
"joy","happy","elated","sad","grief","crying","weeping","angry","rage","furious","confused",
"lost","watched","chased","hunted","ashamed","guilt","urgent","relieved","numb","longing",
"awe","nostalgia","dreadful","uneasy","trapped","free","falling"];

var LUCID=["lucid","knew i was dreaming","realised i was dreaming","realized i was dreaming",
"aware i was dreaming","i was dreaming","took control","woke up inside","knew it was a dream"];

/* longest phrases first so "dead tree" beats "tree" */
var PHRASES=[];
Object.keys(VOCAB).forEach(function(arch){
  VOCAB[arch].forEach(function(w){ PHRASES.push([w,arch]); });
});
PHRASES.sort(function(a,b){ return b[0].length-a[0].length; });

/* ============================================================
   11. INSTANT TIER
   ============================================================ */
function scanText(chunk){
  if(!chunk || chunk.length<3) return 0;
  var low=" "+chunk.toLowerCase().replace(/[^a-z\s'-]/g," ").replace(/\s+/g," ")+" ";

  /* where-it-stands phrases are read first and then blanked out, so that
     "on the opposite side of the street" positions a building instead of
     building a street */
  var spats=[];
  SPATIAL.forEach(function(sp){
    var re=new RegExp(sp[0].source,"g"), m;
    while((m=re.exec(low))!==null){
      spats.push({at:m.index, rel:sp[1], n:sp[2]});
      low=low.slice(0,m.index)+new Array(m[0].length+1).join("\u0000")+low.slice(m.index+m[0].length);
      re.lastIndex=m.index+m[0].length;
    }
  });
  spats.sort(function(a,b){ return a.at-b.at; });

  var found=[];
  PHRASES.forEach(function(pr){
    var needle=" "+pr[0]+" ", idx=0;
    while((idx=low.indexOf(needle,idx))>-1){
      found.push({at:idx,len:needle.length,arch:pr[1],word:pr[0]});
      low=low.slice(0,idx+1)+"\u0000".repeat(needle.length-2)+low.slice(idx+needle.length-1);
      idx+=needle.length-1;
    }
  });
  /* "a three-storey house", "a tower of twelve floors", "4 story" */
  var NUMW={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,
    thirteen:13,fourteen:14,fifteen:15,twenty:20,thirty:30,forty:40,fifty:50,single:1,double:2};
  var levelsAt=[], lre=/\b(\d{1,3}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|twenty|thirty|forty|fifty|single|double)[\s-]*(?:stor(?:e?y|ies|eys)|floors?|levels?|flights?)\b/g, lm;
  while((lm=lre.exec(low))) levelsAt.push({at:lm.index,lv:Math.max(1,Math.min(120,NUMW[lm[1]]||parseInt(lm[1],10)))});
  var mods=[];
  Object.keys(MODIFIERS).forEach(function(m){
    var needle=" "+m+" ", idx=0;
    while((idx=low.indexOf(needle,idx))>-1){ mods.push({at:idx,m:m}); idx+=needle.length-1; }
  });
  found.sort(function(a,b){ return a.at-b.at; });

  /* a where-phrase belongs to the noun it sits nearest, which in English
     is usually the one just before it: "a gas station two blocks down" */
  spats.forEach(function(sp){
    var best=null,bd=Infinity;
    found.forEach(function(f){
      var d=Math.abs(sp.at-f.at)*(sp.at>f.at?1:1.6);
      if(d<bd){ bd=d; best=f; }
    });
    sp.owner=best?best.at:null;
  });

  /* a modifier belongs to the next noun after it, and to nothing else.
     the words before a noun also say whether it is new and where it stands. */
  var fired=0, prev=-1;
  found.forEach(function(f){
    var attrs={};
    mods.forEach(function(md){
      if(md.at>prev && md.at<f.at) Object.assign(attrs,MODIFIERS[md.m]);
    });
    /* floors stated just before the noun, or just after it ("a tower of twelve floors") */
    levelsAt.forEach(function(L){
      if((L.at>prev && L.at<f.at) || (L.at>f.at && L.at-f.at<24)) attrs.lv=L.lv;
    });
    var dirs=[];
    for(var si=0;si<spats.length;si++) if(spats[si].owner===f.at) dirs.push(spats[si]);
    var art=articleBefore(low,f.at);
    var fresh=/\b(another|other|different|second|third|new)\s*$/.test(low.slice(Math.max(0,f.at-22),f.at));
    var again=(art!=="indefinite"&&!fresh)?findExisting(f.arch,f.word):null;
    if(again){
      /* the same place, mentioned again — sharpen it, do not build a second one */
      var grew=false;
      for(var k in attrs){ if(again.attrs[k]===undefined){ again.attrs[k]=attrs[k]; grew=true; } }
      again.detail=(again.detail||1)+1;
      if(grew||again.detail===2) refresh(again);
    } else {
      place(f.arch,f.word,attrs,{dir:dirs.length?dirs:null,forceNew:fresh});
      fired++;
    }
    prev=f.at;
  });

  var raw=chunk.toLowerCase();
  EMOTIONS.forEach(function(e){ if(raw.indexOf(e)>-1 && store.emotions.indexOf(e)===-1) store.emotions.push(e); });
  LUCID.forEach(function(l){ if(raw.indexOf(l)>-1) store.lucidity=Math.max(store.lucidity,2); });
  return fired;
}

var DEFINITE=["the","that","this","same","her","his","its","their","my","our","said"];
var INDEFINITE=["a","an","another","one","some","new","other","second","third"];

function articleBefore(low,at){
  var before=low.slice(Math.max(0,at-24),at).trim();
  var words=before.split(/\s+/);
  for(var i=words.length-1;i>=0 && i>=words.length-3;i--){
    var w=words[i];
    if(INDEFINITE.indexOf(w)>-1) return "indefinite";
    if(DEFINITE.indexOf(w)>-1) return "definite";
    if(/'s$|s'$/.test(w)) return "definite";
  }
  return "none";
}

/* the most recent thing of that kind, which is what "the house" means */
function findExisting(arch,word){
  for(var i=store.objects.length-1;i>=0;i--){
    var o=store.objects[i];
    if(o.filler||o.archetype!==arch) continue;
    if(!o.nights || o.nights.indexOf(store.session)===-1) continue;
    return o;
  }
  return null;
}

/* ============================================================
   12. SECOND TIER — Grok
   ============================================================ */
var ARCHLIST=Object.keys(KIT).join(", ");
var SYS=[
"You read a remembered dream fragment and return the physical world it implies.",
"Return ONLY valid JSON, no prose, no markdown fences:",
'{"objects":[{"archetype":"","label":"","name":"","sign":"","attrs":{"h":1,"w":1,"d":1,"s":1,"lv":2,"c":"#RRGGBB"}}],"people":[{"label":"","role":"","shift":"day|night|none","livesAt":"","worksAt":"","doing":""}],"emotions":[""],"lucidity":0}',
"archetype MUST be exactly one of: "+ARCHLIST+".",
"label is the dreamer's own words for the thing, short.",
"sign is any lettering visible on it, else omit.",
"attrs are multipliers around 1 - h height, w width, d depth, s overall scale. lv is the number of floors, only if stated. Omit what you cannot infer.",
"c is an approximate colour only if described or strongly implied.",
"lucidity: 0 none, 1 faint unease, 2 knew it was a dream, 3 partial control, 4 full control.",
"name is the proper name of the place ONLY if the dreamer gave one. Never invent a name.",
"people: every person, animal or presence in the fragment. role is their stated occupation if given, else omit. shift is day or night ONLY if the dream said when they are about, else \"none\". livesAt and worksAt are place names ONLY if the dream said. doing is what they were doing, in the dreamer\u2019s words.",
"This is the strict rule: report only what the fragment states or unmistakably implies. Leave a field out rather than filling it. An empty field is correct; an invented one is not.",
"Include only what is actually present in the fragment. Do not invent scenery.",
"The dreamer's dreams contain magic, secret ways and impossible things. Take them literally. A hidden door is a hidden door, not a metaphor.",
"passages: any way the dreamer moved between two named places. kind is door, stairs, street, portal, secret or fall. Use portal when the way is not physically possible, secret when it was hidden. Only report ways actually travelled or described.",
"Add a passages array: [{\"from\":\"\",\"to\":\"\",\"kind\":\"\"}] using place names as given."
].join(" ");

var parseTimer=null;
function scheduleParse(delay){
  if(cfg().mode==="off") return;
  clearTimeout(parseTimer);
  parseTimer=setTimeout(runParse,delay||2000);
}
function runParse(){
  var c=cfg(), text=store.transcript.trim();
  if(!text||c.mode==="off") return;
  var url=c.mode==="proxy"?c.proxy:"https://api.x.ai/v1/chat/completions";
  if(!url){ setStatus("<i>No endpoint set.</i>"); return; }
  var headers={"Content-Type":"application/json"};
  if(c.mode==="direct"){
    if(!c.key){ setStatus("<i>No key set.</i>"); return; }
    headers["Authorization"]="Bearer "+c.key;
  }
  setStatus("Listening closer&hellip;");
  fetch(url,{method:"POST",headers:headers,body:JSON.stringify({
    model:c.model||"grok-4.3",temperature:0.2,max_tokens:1600,
    messages:[{role:"system",content:SYS},{role:"user",content:text}]
  })})
  .then(function(r){ if(!r.ok) return r.text().then(function(t){ throw new Error(r.status+" "+t.slice(0,160)); }); return r.json(); })
  .then(function(d){
    var raw=(d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||"";
    reconcile(JSON.parse(raw.replace(/```json|```/g,"").trim()));
  })
  .catch(function(e){
    var m=String(e.message||e);
    if(/Failed to fetch|NetworkError|CORS/i.test(m)) setStatus("<i>The browser blocked that call. Use proxy mode.</i>");
    else setStatus("<i>"+m.slice(0,110)+"</i>");
  });
}
function hexToInt(h){
  if(typeof h!=="string") return undefined;
  var n=parseInt(h.replace("#",""),16);
  return isNaN(n)?undefined:n;
}
function reconcile(p){
  var objs=p.objects||[], used={}, solid=0, added=0;
  objs.forEach(function(o){
    if(!o||!o.archetype||!KIT[o.archetype]) return;
    var attrs={};
    ["h","w","d","s"].forEach(function(k){
      if(o.attrs&&typeof o.attrs[k]==="number") attrs[k]=Math.max(0.2,Math.min(6,o.attrs[k]));
    });
    if(o.attrs&&typeof o.attrs.lv==="number"&&o.attrs.lv>=1) attrs.lv=Math.min(120,Math.round(o.attrs.lv));
    if(o.attrs&&o.attrs.c){ var ci=hexToInt(o.attrs.c); if(ci!==undefined) attrs.c=ci; }
    var match=null, want=normName(o.label||"");
    /* first, something already standing that carries the same name */
    if(want) for(var i=store.objects.length-1;i>=0;i--){
      var s1=store.objects[i];
      if(s1.filler||used[s1.id]||s1.archetype!==o.archetype) continue;
      if(normName(s1.label||"")===want||normName(s1.name||"")===want){ match=s1; break; }
    }
    /* otherwise the nearest unresolved ghost of that kind */
    if(!match) for(var j=0;j<store.objects.length;j++){
      var s2=store.objects[j];
      if(s2.filler) continue;
      if(!s2.solid&&!used[s2.id]&&s2.archetype===o.archetype){ match=s2; break; }
    }
    /* otherwise anything of that kind already standing from tonight: the pass
       re-reads the whole night each time, so it may only add what is truly new */
    if(!match) for(var q=store.objects.length-1;q>=0;q--){
      var s3=store.objects[q];
      if(s3.filler||used[s3.id]||s3.archetype!==o.archetype) continue;
      if(!s3.nights||s3.nights.indexOf(store.session)===-1) continue;
      match=s3; break;
    }
    if(match){
      used[match.id]=true; match.solid=true;
      if(o.label) match.label=o.label;
      if(o.name){ match.name=o.name; match.named="stated"; }
      if(o.sign) match.sign=o.sign;
      match.attrs=Object.assign({},match.attrs,attrs);
      refresh(match); solid++;
    } else {
      var sp=place(o.archetype,o.label,attrs,{solid:true,sign:o.sign||null,name:o.name||null});
      used[sp.id]=true; added++;
    }
  });
  (p.passages||[]).forEach(function(pa){
    if(!pa||!pa.from||!pa.to) return;
    var A=byName(pa.from), B=byName(pa.to);
    if(A&&B) addPassage(A.id,B.id,pa.kind||"door",pa.kind==="secret");
  });
  var lives=0;
  (p.people||[]).forEach(function(pe){
    if(!pe||!pe.label) return;
    var n=normName(pe.label), c=null;
    for(var i=0;i<store.characters.length;i++){
      var x=store.characters[i];
      if(normName(x.name)===n||x.aka.indexOf(n)>-1){ c=x; break; }
    }
    if(!c) return;
    if(!c.src) c.src={};
    if(pe.role){ c.role=pe.role; c.src.role="parsed"; addDetail(c,"is a "+pe.role); }
    if(pe.shift&&pe.shift!=="none"){ c.shift=pe.shift; c.src.shift="parsed";
      addDetail(c,"is about by "+pe.shift); }
    if(pe.doing) addDetail(c,"was "+pe.doing);
    if(pe.livesAt){ var h=byName(pe.livesAt); if(h){ c.home=h.id; c.src.home="stated"; } }
    if(pe.worksAt){ var w=byName(pe.worksAt); if(w){ c.work=w.id; c.src.work="stated"; } }
    var RANK={stated:3,parsed:2,filled:1};
    if(!c.routine || (RANK[c.src.routine]||0)<2){
      var r=routineFrom((c.details.join(". ")+" "+(pe.doing||"")),c.role,c.shift);
      if(r){ c.routine=r; c.src.routine="parsed"; lives++; }
    }
    /* if the figure itself named its hours, that outranks anything inferred */
    if(pe.shift&&pe.shift!=="none"){
      var r2=routineFrom((pe.doing||""),c.role,pe.shift);
      if(r2 && (RANK[c.src.routine]||0)<3){ c.routine=r2; c.src.routine="stated"; lives++; }
    }
    checkWake(c);
  });
  (p.emotions||[]).forEach(function(e){ if(e&&store.emotions.indexOf(e)===-1) store.emotions.push(e); });
  if(typeof p.lucidity==="number") store.lucidity=Math.max(store.lucidity,p.lucidity);
  populate();
  save(); updateCount();
  var bits=[];
  if(solid) bits.push(solid+" sharpened");
  if(added) bits.push(added+" added");
  if(lives) bits.push(lives+" given hours");
  tickClock(true);
  setStatus(bits.length?"<b>"+bits.join(", ")+"</b>":"Nothing new in that.");
}

