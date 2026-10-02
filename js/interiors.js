/* SomnuMatrix — interiors.js
   walk in through a building's front door and you are inside it: rooms off a
   hallway in a house, pews and an altar in a church, stacks in a library, a stair
   winding up a tower. whatever the dream said about the inside — the rooms, the
   furniture, the colour of the walls, the floor, that it was bigger inside than
   out — is built in. walk back out through the door you came in by.
   an interior stands apart from the town, the way a dream moves you into a room.
   loaded as a plain script; shares scope with the other files */
"use strict";

var INT_X0=-40000, INT=null, intCool=0, INT_H=3.2;
/* how far a flight of stairs climbs, and how far it travels doing it.
   set from the building's own floor height before any flight is laid. */
var STAIR_RISE=3.7, STAIR_RUN=4.2;

/* ---- furniture ---- */
var WOOD=0x6B4A32, DARKWOOD=0x3A2A1E, CLOTH=0x7A2A2A, WHITEISH=0xE8E4DA, METAL=0x8A8C92;
function F(parts){ var g=new THREE.Group(); parts.forEach(function(p){ g.add(p); }); return g; }
var FURN={
  bed:function(){ return F([P(box(1.6,.45,2.1),mL(WOOD),0,.25,0),P(box(1.5,.2,2),mL(WHITEISH),0,.55,0),P(box(1.5,.12,1.2),mL(0x5E7A9E),0,.66,.35),P(box(1.6,1,.1),mL(WOOD),0,.7,-1.05),P(box(.5,.12,.35),mL(0xF2EEE6),-.4,.7,-.75),P(box(.5,.12,.35),mL(0xF2EEE6),.4,.7,-.75)]); },
  sofa:function(){ return F([P(box(2.2,.45,.9),mL(0x5E3A3A),0,.25,0),P(box(2.2,.7,.25),mL(0x5E3A3A),0,.7,-.35),P(box(.25,.6,.9),mL(0x5E3A3A),-1.1,.4,0),P(box(.25,.6,.9),mL(0x5E3A3A),1.1,.4,0)]); },
  armchair:function(){ return F([P(box(.9,.45,.9),mL(0x3F5A4A),0,.25,0),P(box(.9,.8,.2),mL(0x3F5A4A),0,.75,-.35),P(box(.18,.55,.9),mL(0x3F5A4A),-.4,.4,0),P(box(.18,.55,.9),mL(0x3F5A4A),.4,.4,0)]); },
  table:function(){ return F([P(box(1.4,.06,.9),mL(WOOD),0,.76,0),P(box(.07,.74,.07),mL(WOOD),-.62,.37,-.38),P(box(.07,.74,.07),mL(WOOD),.62,.37,-.38),P(box(.07,.74,.07),mL(WOOD),-.62,.37,.38),P(box(.07,.74,.07),mL(WOOD),.62,.37,.38)]); },
  longtable:function(){ var g=F([P(box(4.4,.08,1.1),mL(DARKWOOD),0,.78,0)]); [-2,2].forEach(function(x){ g.add(P(box(.12,.76,.9),mL(DARKWOOD),x,.38,0)); });
    for(var i=0;i<5;i++) [-1,1].forEach(function(s){ var c=FURN.chair(); c.position.set(-1.8+i*.9,0,s*.8); c.rotation.y=s>0?Math.PI:0; g.add(c); }); return g; },
  chair:function(){ return F([P(box(.45,.05,.45),mL(WOOD),0,.46,0),P(box(.45,.5,.05),mL(WOOD),0,.72,-.2),P(box(.04,.46,.04),mL(WOOD),-.19,.23,-.19),P(box(.04,.46,.04),mL(WOOD),.19,.23,-.19),P(box(.04,.46,.04),mL(WOOD),-.19,.23,.19),P(box(.04,.46,.04),mL(WOOD),.19,.23,.19)]); },
  runner:function(){ return F([P(box(2.4,.03,13),mL(0x4E1216),0,.02,0),P(box(2.05,.035,12.6),mL(0x6E1A20),0,.025,0),
    P(box(.1,.04,12.4),mL(0x8A6A2A),-.85,.03,0),P(box(.1,.04,12.4),mL(0x8A6A2A),.85,.03,0)]); },
  rug:function(){ return F([P(box(2.6,.02,1.8),mL(CLOTH),0,.02,0),P(box(2.2,.025,1.4),mL(0xC7A043),0,.02,0)]); },
  fireplace:function(){ var g=F([P(box(1.9,1.3,.5),mL(0x8A7A6A),0,.65,0),P(box(1.1,.8,.3),mL(0x141210),0,.45,.12),P(box(2.1,.1,.6),mL(0x6A5A4A),0,1.35,0)]);
    var fl=P(cone(.22,.5,6),mG(0xFF9A3A,.9),0,.35,.15); fl.userData.flicker=1; g.add(fl); return g; },
  bookshelf:function(){ var g=F([P(box(1.6,2.2,.4),mL(DARKWOOD),0,1.1,0)]);
    for(var r=0;r<4;r++) for(var b=0;b<9;b++) g.add(P(box(.14,.36,.28),mL([0x6A2A22,0x2F4A6E,0x3F5A3A,0xA8883A,0x5E3A5E][(r*9+b)%5]),-.64+b*.16,.3+r*.52,.05));
    return g; },
  lamp:function(){ var g=F([P(cyl(.04,.12,1.4,8),mL(METAL),0,.7,0),P(cone(.28,.32,12),mL(0xE6D8B8),0,1.5,0)]); g.add(P(sph(.08),mG(0xFFE8B0,1),0,1.38,0)); return g; },
  stove:function(){ return F([P(box(.8,.9,.7),mL(0xE6E2DA),0,.45,0),P(box(.7,.02,.6),mL(0x1A1A1E),0,.91,0),P(box(.6,.4,.02),mL(0x1A1A1E),0,.45,.36)]); },
  counter:function(){ return F([P(box(2.4,.88,.65),mL(0xD8D0C0),0,.44,0),P(box(2.44,.05,.7),mL(0x3A3A3E),0,.9,0)]); },
  fridge:function(){ return F([P(box(.75,1.8,.7),mL(0xF2F0EA),0,.9,0),P(box(.03,.4,.04),mL(METAL),.3,1.2,.36)]); },
  sink:function(){ return F([P(box(.7,.85,.5),mL(0xF2F0EA),0,.42,0),P(box(.5,.05,.35),mL(0x9AA4AE),0,.86,.02),P(cyl(.02,.02,.25,6),mL(METAL),0,1,-.15)]); },
  bathtub:function(){ return F([P(box(1.7,.55,.8),mL(0xF2F0EA),0,.3,0),P(box(1.5,.05,.6),mL(0x9FC8D8),0,.52,0)]); },
  wardrobe:function(){ return F([P(box(1.3,2,.6),mL(DARKWOOD),0,1,0),P(box(.02,1.8,.02),mL(0x1A1414),0,1,.31),P(sph(.03),mL(GOLD),-.08,1.1,.32),P(sph(.03),mL(GOLD),.08,1.1,.32)]); },
  desk:function(){ return F([P(box(1.4,.06,.7),mL(WOOD),0,.76,0),P(box(.4,.74,.66),mL(WOOD),-.5,.37,0),P(box(.07,.74,.07),mL(WOOD),.62,.37,-.28),P(box(.07,.74,.07),mL(WOOD),.62,.37,.28),P(box(.3,.02,.22),mL(WHITEISH),.2,.8,0)]); },
  piano:function(){ return F([P(box(1.5,1.1,.6),mL(0x141216),0,.8,0),P(box(1.4,.08,.2),mL(WHITEISH),0,.78,.38),P(box(.1,.3,.1),mL(0x141216),-.6,.12,.2),P(box(.1,.3,.1),mL(0x141216),.6,.12,.2)]); },
  clock:function(){ var g=F([P(box(.5,2,.35),mL(DARKWOOD),0,1,0),P(cyl(.18,.18,.03,16),mL(0xF2EEE6),0,1.6,.19,Math.PI/2)]);
    var hand=P(box(.015,.14,.01),mL(0x141414),0,1.62,.21); hand.userData.spin=1; g.add(hand); return g; },
  painting:function(){ return F([P(box(1.1,.8,.05),mL(GOLD),0,1.7,0),P(box(.95,.65,.02),mL([0x3F5A6E,0x6A4A3A,0x2F5A3A][Math.floor(Math.random()*3)]),0,1.7,.03)]); },
  wallmirror:function(){ return F([P(box(.8,1.4,.05),mL(GOLD),0,1.6,0),P(box(.68,1.28,.02),mL(0xDDE3EC),0,1.6,.03)]); },
  chandelier:function(){ var g=F([P(cyl(.01,.01,.8,4),mL(GOLD),0,INT_H-.4,0),P(tor(.45,.03),mL(GOLD),0,INT_H-.85,0,Math.PI/2)]);
    for(var i=0;i<6;i++){ var a=i*1.047; g.add(P(sph(.06),mG(0xFFE8B0,1),Math.cos(a)*.45,INT_H-.75,Math.sin(a)*.45)); } return g; },
  candles:function(){ var g=new THREE.Group(); for(var i=0;i<5;i++){ g.add(P(cyl(.03,.03,.25+i%3*.08,6),mL(0xF2EEE6),(i-2)*.12,.13,((i*7)%3)*.06));
    var fl=P(cone(.02,.06,5),mG(0xFFB23A,1),(i-2)*.12,.3+i%3*.08,((i*7)%3)*.06); fl.userData.flicker=1; g.add(fl); } return g; },
  pew:function(){ return F([P(box(3.4,.08,.5),mL(DARKWOOD),0,.46,0),P(box(3.4,.6,.06),mL(DARKWOOD),0,.8,-.25),P(box(.08,.46,.5),mL(DARKWOOD),-1.66,.23,0),P(box(.08,.46,.5),mL(DARKWOOD),1.66,.23,0)]); },
  altarinside:function(){ var g=F([P(box(2.2,1,.9),mL(0xE6E0D2),0,.5,0),P(box(2.3,.05,1),mL(0xA8322B),0,1.02,0)]); var c=FURN.candles(); c.position.set(0,1.04,0); g.add(c); return g; },
  pulpit:function(){ return F([P(box(.9,1.2,.7),mL(DARKWOOD),0,.6,0),P(box(.95,.05,.5),mL(DARKWOOD),0,1.25,.1,-.3)]); },
  throneseat:function(){ return F([P(box(1.1,.6,.9),mL(0x6A1A1A),0,.5,0),P(box(1.1,2.2,.2),mL(GOLD),0,1.3,-.4),P(box(.15,.5,.9),mL(GOLD),-.55,.9,0),P(box(.15,.5,.9),mL(GOLD),.55,.9,0),P(box(1.4,.25,1.4),mL(0x5A4A3A),0,.12,0)]); },
  shelfgoods:function(){ var g=F([P(box(2.4,1.8,.45),mL(0xB8B4AC),0,.9,0)]); for(var r=0;r<3;r++) for(var b=0;b<8;b++) g.add(P(box(.2,.26,.25),mL([0xC0392B,0xE8A04A,0x2F5E9E,0x3F7A3A][(r+b)%4]),-1+b*.28,.35+r*.55,.08)); return g; },
  till:function(){ return F([P(box(2,1,.7),mL(WOOD),0,.5,0),P(box(.4,.3,.35),mL(0x2A2C30),.5,1.15,0)]); },
  blackboard:function(){ return F([P(box(3,1.3,.06),mL(0x6B4A32),0,1.6,0),P(box(2.8,1.12,.02),mL(0x1E3A2A),0,1.6,.04)]); },
  schooldesk:function(){ var g=FURN.desk(); g.scale.set(.7,.85,.8); var c=FURN.chair(); c.position.z=.55; c.rotation.y=Math.PI; g.add(c); return g; },
  hospitalbed:function(){ return F([P(box(.95,.1,2),mL(WHITEISH),0,.65,0),P(box(.9,.12,1.9),mL(0xDCE8F0),0,.76,0),P(box(.05,.65,.05),mL(METAL),-.45,.32,-.95),P(box(.05,.65,.05),mL(METAL),.45,.32,-.95),P(box(.05,.65,.05),mL(METAL),-.45,.32,.95),P(box(.05,.65,.05),mL(METAL),.45,.32,.95),P(box(.05,2,.8),mL(0x9FC8C0),.7,1,0)]); },
  crates:function(){ return F([P(box(1,1,1),mL(0xA88A5A),0,.5,0),P(box(1,1,1),mL(0x9A7A4A),1.05,.5,.1),P(box(.9,.9,.9),mL(0xA88A5A),.5,1.45,0,0,.3)]); },
  barrel:function(){ return F([P(cyl(.4,.4,1,12),mL(0x6B4A32),0,.5,0),P(tor(.4,.03),mL(METAL),0,.2,0,Math.PI/2),P(tor(.4,.03),mL(METAL),0,.8,0,Math.PI/2)]); },
  machine:function(){ var g=F([P(box(2,1.6,1.4),mL(0x5A6A5E),0,.8,0),P(cyl(.4,.4,.3,12),mL(METAL),.6,1.2,.72,Math.PI/2),P(box(.4,.3,.05),mG(0x6AF08A,1),-.5,1.2,.71)]); return g; },
  benchin:function(){ return F([P(box(2.2,.08,.5),mL(WOOD),0,.45,0),P(box(.1,.45,.45),mL(WOOD),-1,.22,0),P(box(.1,.45,.45),mL(WOOD),1,.22,0)]); },
  judgebench:function(){ return F([P(box(3.4,1.4,1),mL(DARKWOOD),0,.7,0),P(box(3.6,.1,1.1),mL(DARKWOOD),0,1.45,0),P(box(1.2,.5,1.2),mL(0x5A4A3A),0,.25,-1)]); },
  banner:function(){ return F([P(box(.06,.06,1.4),mL(GOLD),0,INT_H-.3,0,0,Math.PI/2),P(box(1.1,1.8,.03),mL(0x6A1A2A),0,INT_H-1.3,0)]); },
  plant:function(){ return F([P(cyl(.22,.18,.4,10),mL(0x8A5A3A),0,.2,0),P(new THREE.IcosahedronGeometry(.45,0),mL(0x3F7A3A),0,.8,0)]); },
  tv:function(){ return F([P(box(1.2,.5,.4),mL(DARKWOOD),0,.25,0),P(box(1.1,.65,.05),mL(0x141416),0,.85,0),P(box(1,.55,.02),mG(0x3A6A8A,1),0,.85,.03)]); },
  crib:function(){ var g=F([P(box(1.2,.08,.7),mL(WHITEISH),0,.5,0)]); for(var i=0;i<9;i++){ g.add(P(box(.03,.6,.03),mL(WHITEISH),-.55+i*.137,.8,-.34)); g.add(P(box(.03,.6,.03),mL(WHITEISH),-.55+i*.137,.8,.34)); } return g; },
  toys:function(){ return F([P(box(.3,.3,.3),mL(0xC0392B),0,.15,0),P(box(.25,.25,.25),mL(0x2F5E9E),.35,.12,.1),P(sph(.14),mL(0xD4B83C),-.3,.14,.2)]); },
  cage:function(){ var g=new THREE.Group(); for(var i=0;i<12;i++){ var a=i*.523; g.add(P(cyl(.015,.015,1.4,4),mL(METAL),Math.cos(a)*.5,.7,Math.sin(a)*.5)); }
    g.add(P(cyl(.52,.52,.05,16),mL(METAL),0,1.4,0)); g.add(P(cyl(.52,.52,.05,16),mL(METAL),0,.02,0)); return g; },
  sarcophagus:function(){ return F([P(box(1,.9,2.3),mL(0x8A8478),0,.45,0),P(box(1.1,.15,2.4),mL(0x9A9488),0,.95,0)]); },
  /* A flight that climbs a whole floor, however tall this building's floors are,
     running toward -z from its own origin, which sits at the bottom step.
     STAIR_RISE and STAIR_RUN are set before any flight is laid, so the steps you
     see and the slope you stand on are the same slope. */
  stairs:function(){ var g=new THREE.Group(), n=14, r=STAIR_RISE/n, run=STAIR_RUN/n,
    ang=Math.atan2(STAIR_RISE,STAIR_RUN), len=Math.hypot(STAIR_RUN,STAIR_RISE);
    for(var i=0;i<n;i++){
      g.add(P(box(1.3,r,run*1.08),mL(WOOD),0,(i+.5)*r,-i*run));       // the tread and its riser
    }
    g.add(P(box(.06,.06,len),mL(DARKWOOD),.68,STAIR_RISE/2+.95,-STAIR_RUN/2,ang));
    g.add(P(box(.06,.06,len),mL(DARKWOOD),-.68,STAIR_RISE/2+.95,-STAIR_RUN/2,ang));
    return g; },
  spiralstair:function(){ var g=F([P(cyl(.15,.15,INT_H*2.5,8),mL(METAL),0,INT_H*1.25,0)]);
    for(var i=0;i<22;i++){ var a=i*.42, st=P(box(1.2,.08,.35),mL(WOOD),Math.cos(a)*.7,.2+i*.33,Math.sin(a)*.7); st.rotation.y=-a; g.add(st); } return g; },
  counterbank:function(){ var g=F([P(box(5,1.1,.7),mL(DARKWOOD),0,.55,0)]); for(var i=0;i<6;i++) g.add(P(box(.03,.9,.03),mL(GOLD),-2.3+i*.9,1.55,0)); g.add(P(box(5,.05,.1),mL(GOLD),0,2,0)); return g; },
  vaultround:function(){ return F([P(cyl(1.2,1.2,.3,24),mL(0x6A6C72),0,1.3,0,Math.PI/2),P(tor(.5,.06),mL(0xA7AAB0),0,1.3,.2),P(box(.8,.08,.08),mL(0xA7AAB0),0,1.3,.2)]); },
  /* a tech-company office: a screen on a stand, a blinking rack in the
     corner, a wall-mounted display — the same low-poly box-and-glow
     furniture as everything else, just wired to look alive */
  monitor:function(){ return F([P(box(.5,.9,.35),mL(0x2A2E36),0,.45,0),P(box(.62,.42,.04),mL(0x14171C),0,1.02,-.16),
    P(box(.54,.34,.02),mG(0x6AC8FF,.95),0,1.02,-.14)]); },
  servertower:function(){ var g=F([P(box(.6,1.9,.6),mL(0x1C1E22),0,.95,0)]);
    var cols=[0x4AE8FF,0x6AF0C4,0xFFD08A]; for(var r=0;r<8;r++){
      g.add(P(box(.06,.06,.02),mG(cols[r%3],1),-.2+(r%2)*.4,.28+Math.floor(r/2)*.42,.31)); }
    return g; },
  wallscreen:function(){ return F([P(box(1.6,.9,.06),mL(0x14171C),0,1.7,0),P(box(1.42,.74,.02),mG(0x6AC8FF,.9),0,1.7,.035)]); },
  /* the map of everywhere, in miniature: a round table with a softly glowing
     map for a top. named in the penthouse's furnishing for a long time
     without ever actually being drawn — this is what was missing. */
  maptable:function(){ return F([P(cyl(.85,.7,.74,14),mL(DARKWOOD),0,.37,0),P(cyl(.95,.95,.06,24),mL(0x1C1E22),0,.77,0),
    P(cyl(.82,.82,.02,24),mG(0x6AC8FF,.85),0,.8,0)]); }
};
var SOLIDFURN={bed:1,sofa:1,table:1,longtable:1,counter:1,piano:1,wardrobe:1,bookshelf:1,fireplace:1,stove:1,fridge:1,bathtub:1,desk:1,pew:1,altarinside:1,
  throneseat:1,shelfgoods:1,till:1,hospitalbed:1,crates:1,machine:1,judgebench:1,counterbank:1,sarcophagus:1,servertower:1,maptable:1};

/* ---- what each kind of building holds ---- */
var ROOMFURN={
  hallway:["rug","painting","plant"], living:["sofa","armchair","rug","fireplace","lamp","bookshelf","painting","table"],
  kitchen:["counter","stove","fridge","sink","table","chair","chair"], bedroom:["bed","wardrobe","lamp","rug","wallmirror"],
  bathroom:["bathtub","sink","wallmirror"],
  lobbybig:["till","plant","armchair","armchair","painting","chandelier"], study:["desk","chair","bookshelf","bookshelf","lamp"], dining:["longtable","chandelier","painting"],
  nursery:["crib","toys","rug","lamp"], attic:["crates","barrel","wardrobe"], basement:["crates","barrel","machine"], ballroom:["chandelier","chandelier","piano"],
  office:["desk","chair","desk","chair","plant","bookshelf"], cell:["bed","sink"], lobby:["till","plant","armchair","painting"],
  throneroom:["throneseat","banner","banner","chandelier","rug"], classroom:["blackboard","schooldesk","schooldesk","schooldesk","schooldesk"],
  /* Somnucor's own upper floors: a tech-company office, not a generic one */
  techoffice:["desk","monitor","chair","wallscreen","desk","monitor","chair","servertower","plant","bookshelf"]
};
var ROOMNAME={chapel:"a side chapel",vestry:"the vestry",meeting:"the meeting room",ward:"a ward",
  chamber:"a chamber",kitchenette:"the kitchen",suite:"a suite",archive:"the archive",hallway:"the hallway",living:"the living room",kitchen:"the kitchen",bedroom:"the bedroom",bathroom:"the bathroom",study:"the study",
  dining:"the dining room",nursery:"the nursery",attic:"the attic",basement:"the basement",ballroom:"the ballroom",office:"the office",cell:"a cell",
  lobby:"the lobby",throneroom:"the throne room",classroom:"the classroom",techoffice:"the office"};
/* mode rooms: rooms either side of a hallway. mode hall: one great space, laid out by fill() */
var PLANS={
  house:{mode:"rooms",rooms:["living","kitchen","bedroom","bathroom","dining","bedroom"],wall:0xE6DCC8,floor:"wood"},
  cottage:{mode:"rooms",rooms:["living","kitchen","bedroom"],wall:0xE8E0CC,floor:"wood"},
  apartment:{mode:"rooms",rooms:["living","kitchen","bedroom","bathroom"],wall:0xDCD8D0,floor:"wood"},
  motel:{mode:"rooms",rooms:["lobby","bedroom","bedroom","bedroom","bathroom"],wall:0xD8C8A8,floor:"carpet"},
  hotel:{mode:"mixed",ground:"lobby",w:20,d:18,upper:["bedroom","bedroom","suite","bathroom","bedroom","bedroom"],
    wall:0xE0D4BC,floor:"carpet",lift:true},
  institution:{mode:"mixed",ground:"lobby",w:18,d:18,upper:["cell","cell","cell","office","bathroom"],
    wall:0xC8CCC8,floor:"tile",lift:true},
  somnucortower:{mode:"mixed",ground:"lobby",w:26,d:22,upper:["techoffice","meeting","techoffice","kitchenette","archive","bathroom"],
    wall:0xD8E4EE,floor:"tile",lift:true,locked:{level:11,what:"the penthouse"}},
  skyscraper:{mode:"mixed",ground:"lobby",w:22,d:18,upper:["office","office","meeting","kitchenette","bathroom","archive"],
    wall:0xDCDCD8,floor:"carpet",lift:true},
  toadstoolhouse:{mode:"rooms",rooms:["living","bedroom"],wall:0xE8D8C0,floor:"wood"},
  church:{mode:"hall",w:14,d:26,fill:"church",wall:0xD8D0C0,floor:"stone",side:["chapel","vestry"]},
  cathedral:{mode:"hall",w:22,d:40,fill:"church",wall:0xCCC4B4,floor:"marble",h:9,
    side:["chapel","chapel","vestry","chapel","archive"]},
  library:{mode:"hall",w:18,d:22,fill:"library",wall:0xD8CCB0,floor:"wood",side:["archive","office"]},
  school:{mode:"mixed",ground:"school",w:18,d:16,upper:["classroom","classroom","office","bathroom"],
    wall:0xE0DCC8,floor:"tile"},
  shop:{mode:"hall",w:10,d:12,fill:"shop",wall:0xE8E4D8,floor:"tile"},
  gasstation:{mode:"hall",w:8,d:8,fill:"shop",wall:0xE8E4D8,floor:"tile"},
  hospital:{mode:"mixed",ground:"hospital",w:18,d:22,upper:["ward","ward","office","bathroom"],
    wall:0xE8EEF0,floor:"tile",lift:true},
  bank:{mode:"hall",w:16,d:16,fill:"bank",wall:0xE6DCC8,floor:"marble"},
  station:{mode:"hall",w:18,d:14,fill:"station",wall:0xD8D4C8,floor:"tile"},
  courthouse:{mode:"hall",w:16,d:20,fill:"court",wall:0xDCD4C0,floor:"wood"},
  factory:{mode:"hall",w:24,d:24,fill:"works",wall:0x9A9890,floor:"stone",h:6},
  warehouse:{mode:"hall",w:22,d:22,fill:"works",wall:0xA8A49A,floor:"stone",h:6},
  barn:{mode:"hall",w:12,d:16,fill:"barn",wall:0x8A5A3A,floor:"wood",h:5},
  garage:{mode:"hall",w:8,d:8,fill:"works",wall:0xA8A49A,floor:"stone"},
  shed:{mode:"hall",w:5,d:5,fill:"barn",wall:0x8A6A4A,floor:"wood"},
  castle:{mode:"hall",w:18,d:28,fill:"castle",wall:0x8A847A,floor:"stone",h:7,
    side:["chamber","kitchen","study","chamber"]},
  cloudpalace:{mode:"hall",w:22,d:30,fill:"castle",wall:0xF2F2F6,floor:"marble",h:8},
  merpalace:{mode:"hall",w:22,d:30,fill:"castle",wall:0xE8C8B8,floor:"marble",h:8},
  icepalace:{mode:"hall",w:22,d:30,fill:"castle",wall:0xBFE4F4,floor:"marble",h:8},
  faethrone:{mode:"hall",w:14,d:18,fill:"castle",wall:0x3A5A3A,floor:"wood",h:6},
  tower:{mode:"hall",w:10,d:10,fill:"tower",wall:0x9A948A,floor:"stone",h:8},
  lighthouse:{mode:"hall",w:8,d:8,fill:"tower",wall:0xE8E4DA,floor:"stone",h:8},
  windmill:{mode:"hall",w:8,d:8,fill:"tower",wall:0xD8CCB0,floor:"wood",h:6},
  crypt:{mode:"hall",w:10,d:16,fill:"crypt",wall:0x6E6A64,floor:"stone"},
  tomb:{mode:"hall",w:8,d:10,fill:"crypt",wall:0x7A746A,floor:"stone"},
  catacomb:{mode:"hall",w:8,d:30,fill:"crypt",wall:0x6E6A64,floor:"stone"},
  hollowtree:{mode:"hall",w:6,d:6,fill:"cozy",wall:0x6B4A32,floor:"wood"},
  igloo:{mode:"hall",w:6,d:6,fill:"cozy",wall:0xF2F6FA,floor:"carpet"},
  bedouintent:{mode:"hall",w:10,d:7,fill:"cozy",wall:0x4A3A2A,floor:"carpet"},
  shanty:{mode:"hall",w:5,d:5,fill:"cozy",wall:0x6E6A62,floor:"wood"},
  falloutshelter:{mode:"rooms",rooms:["lobby","bedroom","kitchen","basement"],wall:0x9A9A92,floor:"tile"},
  bunker:{mode:"rooms",rooms:["lobby","office","basement"],wall:0x9A9A92,floor:"tile"}
};
var DEFAULT_PLAN={mode:"hall",w:8,d:8,fill:"cozy",wall:0xDCD4C4,floor:"wood"};
/* things you plainly do not walk inside */
var NOT_INSIDE={statue:1,monument:1,obelisk:1,glyphobelisk:1,altar:1,altarseasonal:1,ofrenda:1,torii:1,paifang:1,
  moongate:1,monolith:1,trebuchet:1,ferriswheel:1,carousel:1,pergola:1,wardrobedoor:1,celestialstair:1,goldengate:1,
  bonegate:1,sandpillars:1,brokenhighway:1,rainbowbridge:1,hubdoor:1,hubmirror:1,signboard:1,plinth:1,hubpillar:1,
  maptable:1,groundpad:1,lawn:1,snowfield:1,blossomground:1,leaffall:1,pier:1,shrine:1,stargate:1,spaceelevator:1,
  ruin:1,shipwreck:1,sunkenruins:1,collapsedtower:1,volcanolair:1,forcefield:1,landinglights:1,solarfarm:1,satdish:1};
/* any building can be walked into; if it has no plan of its own, one is cut to its own size */
function planOf(spec){
  if(typeof addSciFurniture==="function") addSciFurniture();
  if(PLANS[spec.archetype]) return PLANS[spec.archetype];
  var d=KIT[spec.archetype]||KIT.house, a=spec.attrs||{}, sc=a.s||1;
  var w=Math.max(6,Math.min(30,d.size[0]*sc*0.8)), dp=Math.max(6,Math.min(34,d.size[2]*sc*0.8));
  var floorArea=w*dp;
  if(floorArea>360) return {mode:"mixed",ground:"lobby",w:w,d:dp,upper:["bedroom","office","bathroom","chamber"],
    wall:0xDCD4C4,floor:"wood",lift:d.size[1]>40};
  if(floorArea>150) return {mode:"rooms",rooms:["living","kitchen","bedroom","bedroom","bathroom"],wall:0xDCD4C4,floor:"wood"};
  return {mode:"hall",w:w,d:dp,fill:"cozy",wall:0xDCD4C4,floor:"wood"};
}
/* how many floors inside: what the dream said, else what the kind of building suggests */
var STOREYS={somnucortower:12,house:2,cottage:1,apartment:3,hotel:3,motel:2,institution:2,skyscraper:6,castle:2,tower:3,
  lighthouse:3,windmill:2,hanok:1,machiya:2,izba:1,hacienda:2,riad:2,longhouse:1,stilthouse:1,cycladic:2,
  pueblo:2,shop:1,school:2,hospital:2,library:2,bank:2,courthouse:2,factory:1,warehouse:1,barn:1};
function levelsOf(spec){
  var a=spec.attrs||{}, n=a.lv||STOREYS[spec.archetype]||1;
  if((spec.inside||{}).endless) n=Math.max(n,3);
  return Math.max(1,Math.min(16,n));
}
/* what belongs on the ground floor, and what belongs upstairs */
var GROUND_ROOMS={living:1,kitchen:1,dining:1,hallway:1,lobby:1,office:1,classroom:1,ballroom:1,throneroom:1};
function roomsByLevel(rooms,levels){
  var out=[]; for(var i=0;i<levels;i++) out.push([]);
  var ground=[], upper=[];
  rooms.forEach(function(r){ (GROUND_ROOMS[r]?ground:upper).push(r); });
  if(!ground.length) ground=upper.splice(0,Math.max(1,Math.ceil(upper.length/levels)));
  out[0]=ground;
  var per=Math.max(1,Math.ceil(upper.length/Math.max(1,levels-1)));
  for(var L=1;L<levels;L++) out[L]=upper.splice(0,per);
  for(var L2=1;L2<levels;L2++) if(!out[L2].length) out[L2]=["bedroom","bathroom"];
  return out;
}
function enterable(spec){
  if(!spec) return false;
  var d=KIT[spec.archetype];
  if(!d||d.cat!=="structure") return false;
  if(NOT_INSIDE[spec.archetype]) return false;
  var a=spec.attrs||{}, sc=a.s||1;
  /* if it is big enough to stand up in, you can go in */
  return d.size[0]*sc>=4&&d.size[2]*sc>=4&&d.size[1]*sc>=3;
}

/* ---- where the front door is, out in the world ---- */
function doorWorld(spec){
  var def=KIT[spec.archetype]||KIT.house, a=spec.attrs||{}, s=(a.s||1);
  var parts=levelParts(def,spec), door=frontDoorOf(parts), B=bodyOf(parts);
  var lx=door?door.p[0]:(B?B.x:0), lz=door?door.p[2]+door.s[2]/2:(B?B.z+B.d/2:def.size[2]/2);
  lx*=s*(a.w||1); lz=lz*s*(a.d||1)+0.6;
  var r=spec.rot||0;
  return {x:spec.x+lx*Math.cos(r)+lz*Math.sin(r), z:spec.z-lx*Math.sin(r)+lz*Math.cos(r), out:{x:Math.sin(r),z:Math.cos(r)}};
}

/* ---- reading the inside from a dream ---- */
var INSIDE_CUE=/\b(inside|indoors|within the|in the (kitchen|bedroom|bathroom|living room|hallway|corridor|attic|basement|study|nursery|parlou?r|lounge|dining room|ballroom|lobby|classroom|throne room|great hall)|the room|a room|the rooms|rooms|hallway|corridor|upstairs|downstairs|wallpaper|the walls were|the floor was|ceiling)\b/;
var ROOMWORDS=[["living",/\b(living room|sitting room|parlou?r|lounge|drawing room)\b/],["kitchen",/\bkitchens?\b/],["bedroom",/\bbedrooms?\b/],["bathroom",/\bbathrooms?\b/],
  ["hallway",/\b(hallway|corridor|passage)\b/],["study",/\bstudy\b/],["dining",/\bdining room\b/],["nursery",/\bnursery\b/],["attic",/\battic\b/],["basement",/\bbasement\b/],
  ["ballroom",/\bballroom\b/],["office",/\boffices?\b/],["cell",/\b(prison )?cells?\b/],["lobby",/\b(lobby|foyer|entrance hall)\b/],["throneroom",/\bthrone room\b/],["classroom",/\bclassrooms?\b/]];
var ITEMWORDS=[["piano",/\bpianos?\b/],["bed",/\bbeds?\b/],["sofa",/\b(sofa|couch|settee)\b/],["armchair",/\barm ?chairs?\b/],["longtable",/\b(long table|dining table|banquet table|feast)\b/],
  ["table",/\btables?\b/],["chair",/\bchairs?\b/],["fireplace",/\b(fireplace|hearth)\b/],["bookshelf",/\b(bookshel(f|ves)|bookcases?|books)\b/],["clock",/\bclocks?\b/],
  ["painting",/\b(paintings?|portraits?|pictures on the wall)\b/],["wallmirror",/\bmirrors?\b/],["chandelier",/\bchandeliers?\b/],["rug",/\b(rug|carpet)\b/],
  ["spiralstair",/\bspiral stair(case|s)?\b/],["stairs",/\b(staircase|stairs|stairway|steps up)\b/],["bathtub",/\b(bathtub|bath tub|a bath)\b/],["sink",/\bsinks?\b/],
  ["stove",/\b(stove|oven)\b/],["fridge",/\b(fridge|refrigerator)\b/],["desk",/\bdesks?\b/],["wardrobe",/\b(wardrobe|closet)\b/],["candles",/\bcandles?\b/],
  ["altarinside",/\baltar\b/],["pew",/\bpews?\b/],["throneseat",/\bthrone\b/],["cage",/\bcages?\b/],["lamp",/\blamps?\b/],["tv",/\b(television|tv)\b/],
  ["plant",/\b(plants|potted plant|houseplants?)\b/],["crib",/\b(crib|cradle)\b/],["toys",/\b(toys|dolls?)\b/],["machine",/\bmachines?\b/],["crates",/\b(crates|boxes)\b/],
  ["barrel",/\bbarrels\b/],["sarcophagus",/\b(sarcophag(us|i)|coffins?)\b/]];
var FLOORWORD=[["checker",/\b(black and white|checker(ed|board)) (tiled |tile )?floor/],["marble",/\bmarble floors?\b/],["wood",/\b(wooden|wood) floors?\b|\bfloorboards\b/],
  ["tile",/\b(tiled|tile) floors?\b/],["stone",/\bstone floors?\b/],["carpet",/\bcarpeted\b|\bthick carpet\b/]];
/* words that mean a thing in a room when the dream is indoors, not a thing in the street */
var INDOOR_ONLY={stairs:1,altar:1,throne:1,impossiblestair:0};

function insideScan(text){
  if(!text) return;
  (text.match(/[^.!?]+[.!?]?/g)||[]).forEach(function(sent){
    var s=" "+deaccent(sent).toLowerCase()+" ";
    if(!INSIDE_CUE.test(s)) return;
    var b=insideOwner(s); if(!b) return;
    var I=b.inside||(b.inside={rooms:[],items:[]});
    var roomHere=null;
    ROOMWORDS.forEach(function(r){ if(r[1].test(s)){ roomHere=r[0]; if(I.rooms.indexOf(r[0])===-1) I.rooms.push(r[0]); } });
    ITEMWORDS.forEach(function(it){ if(it[1].test(s)&&!I.items.some(function(x){ return x.k===it[0]&&x.room===roomHere; })) I.items.push({k:it[0],room:roomHere}); });
    var m=/\b([a-z]+) (walls|wallpaper)\b/.exec(s)||/\bwalls were ([a-z]+)\b/.exec(s)||/\bpainted ([a-z]+)\b/.exec(s);
    if(m&&NAMED[m[1]]!==undefined) I.wall=NAMED[m[1]];
    FLOORWORD.forEach(function(f){ if(f[1].test(s)) I.floor=f[0]; });
    if(/\b(bigger|larger) (on the )?inside|\bbigger than it looked|\bmuch bigger inside\b/.test(s)) I.big=true;
    if(/\b(endless|never-ending|went on forever|kept going|more and more rooms|rooms that went on)\b/.test(s)) I.endless=true;
    if(meshes&&INT&&INT.spec===b) rebuildInterior();
  });
}
function insideOwner(s){
  /* the building named in the sentence, else the last one dreamt */
  var best=null;
  store.objects.forEach(function(o){
    var d=KIT[o.archetype]; if(!d||d.cat!=="structure"||o.filler) return;
    if((VOCAB[o.archetype]||[]).some(function(w){ return s.indexOf(" "+w+" ")>-1; })) best=o;
  });
  if(best) return best;
  var last=store.lastId?specById(store.lastId):null;
  return last&&KIT[last.archetype]&&KIT[last.archetype].cat==="structure"?last:null;
}

/* ---- building the inside ---- */
var FLOORCOL={wood:0x7A5634,tile:0xD8D4CC,stone:0x6E6A64,carpet:0x7A2A2A,marble:0xE6E2DA,checker:0xE8E4DC};
function intSlot(spec){ if(!store.insideSlots) store.insideSlots={}; if(store.insideSlots[spec.id]===undefined) store.insideSlots[spec.id]=Object.keys(store.insideSlots).length; return store.insideSlots[spec.id]; }

function makeInterior(spec){
  if(typeof addSciFurniture==="function") addSciFurniture();
  var plan=planOf(spec), I=spec.inside||{rooms:[],items:[]};
  var H=plan.h||INT_H, big=I.big?1.6:1;
  var ox=INT_X0-intSlot(spec)*500, oz=0;
  var root=new THREE.Group(); root.position.set(ox,0,oz);
  var wallCol=I.wall!==undefined?I.wall:plan.wall, floorKind=I.floor||plan.floor;
  var wallMat=new THREE.MeshLambertMaterial({color:wallCol,side:THREE.DoubleSide});
  var walls=[], spots=[], items=[], lights=[], windows=[];
  var yOff=0, lvl=0;
  function wallBox(x,z,w,d,h){
    /* a wall reaches the floor above it: leave no band to see or slip through */
    var hh=h||((typeof FLOOR!=="undefined")?FLOOR:H);
    var m=P(box(w,hh,d),wallMat,x,yOff+hh/2,z); root.add(m);
    walls.push({x:ox+x,z:oz+z,rot:0,hw:w/2,hd:d/2,h:hh,level:lvl});
  }
  /* a wall from (x1,z1) to (x2,z2), axis-aligned, with door gaps at the given centres */
  function wallLine(x1,z1,x2,z2,gaps,gw){
    gw=gw||1.4; var horiz=Math.abs(z1-z2)<0.01, a=horiz?Math.min(x1,x2):Math.min(z1,z2), b=horiz?Math.max(x1,x2):Math.max(z1,z2);
    var cuts=(gaps||[]).slice().sort(function(p,q){ return p-q; }), at=a;
    cuts.concat([null]).forEach(function(c){
      var end=c===null?b:c-gw/2;
      if(end-at>0.05){ var mid=(at+end)/2, len=end-at; if(horiz) wallBox(mid,z1,len,.2); else wallBox(x1,mid,.2,len); }
      if(c!==null){ var lint=P(box(horiz?gw:.2,H-2.3,horiz?.2:gw),wallMat,horiz?c:x1,yOff+2.3+(H-2.3)/2,horiz?z1:c); root.add(lint); at=c+gw/2; }
    });
  }
  /* where a stairwell will stand on a given floor, worked out before any
     furniture is placed on that floor — a desk (or a lobby's front till)
     landing in this rectangle is nudged clear of it instead of sitting on
     the steps, which used to happen because furniture went down first and
     the stairs were only laid afterward */
  var keepouts=[];
  function keepoutAt(k,x,z){
    if(k==="stairs") return null;
    for(var i=0;i<keepouts.length;i++){
      var o=keepouts[i]; if(o.level!==lvl) continue;
      if(Math.abs(x-o.x)<o.hw&&Math.abs(z-o.z)<o.hd) return o;
    }
    return null;
  }
  /* a workplace keeps its own furnishing on the server (workplace.js): the
     plan still lays the walls, stairs and lifts, but the furniture it would
     have put down is only noted — as the "as built" layout the workers can
     go back to — and the saved layout is put down instead */
  var wpKey=(typeof workplaceKeyOf==="function")?workplaceKeyOf(spec):null;
  var wpSaved=(wpKey&&typeof workplaceDecor==="function")?workplaceDecor(wpKey):null;
  var asBuilt=[];
  function put(k,x,z,rot){
    if(!FURN[k]) return;
    if(k!=="stairs"){
      asBuilt.push({k:k,x:+x.toFixed(2),z:+z.toFixed(2),r:+(rot||0).toFixed(3),l:lvl});
      if(wpSaved) return;
    }
    realPut(k,x,z,rot);
  }
  function realPut(k,x,z,rot){
    if(!FURN[k]) return;
    var block=keepoutAt(k,x,z);
    if(block){
      /* pushed straight out along whichever side of the stairwell it landed
         on, clear of the tread and the hole above it */
      z=(z<=block.z)?(block.z-block.hd-1.1):(block.z+block.hd+1.1);
    }
    var it=FURN[k](); it.userData.furn=k; it.position.set(x,yOff,z); it.rotation.y=rot||0; root.add(it);
    if(SOLIDFURN[k]){ var bb=furnBox(k); var c=Math.abs(Math.cos(rot||0)), s=Math.abs(Math.sin(rot||0));
      walls.push({x:ox+x,z:oz+z,rot:0,hw:(c*bb[0]+s*bb[1])/2,hd:(s*bb[0]+c*bb[1])/2,h:1.2,level:lvl}); }
    items.push(it);
  }
  var W,D, exitZ, levels=levelsOf(spec), FLOOR=H+0.5, stairsAt=[];
  var lifts=[], holes=[], slabs=[];
  STAIR_RISE=FLOOR; STAIR_RUN=FLOOR*1.15;          // a comfortable pitch, whatever the floor height

  /* A flight has to climb a whole floor and still fit in the room. In a tall,
     narrow place — a tower with an eight-metre ceiling — a gentle stair would be
     longer than the floor is wide, so it steepens instead of overrunning the wall. */
  function fitStairs(){
    var room=Math.min(W||99,D||99);
    STAIR_RISE=FLOOR;
    STAIR_RUN=Math.max(2.8,Math.min(FLOOR*1.15,room*0.72));
  }

  /* Lay one flight, from the floor `from` to the floor above it.
     (xc,zHead) is where the top of the flight lands. It climbs toward -z. Three things have
     to agree with each other or the stairs misbehave: the mesh you see, the
     sloped surface that carries you, and the hole it needs in the floor above
     so that you have somewhere to arrive. */
  function flight(xc,zHead,from,wide){
    fitStairs();
    var hw=(wide||1.5)/2, hd=STAIR_RUN/2, zc=zHead+hd;
    lvl=from; yOff=from*FLOOR;
    put("stairs",xc,zc+hd,0);                      // the mesh begins at the bottom step
    stairsAt.push({x:ox+xc,z:oz+zc,from:from,rot:Math.PI,hw:hw+0.35,hd:hd});
    holes.push({level:from+1,x:xc,z:zc,hw:hw+0.35,hd:hd+0.25});
  }

  /* Floors are asked for while the plan is being laid but built at the very end,
     once every flight is known and the holes can be cut in the right places. */
  function planSlab(L,Wf,Df,y){ slabs.push({L:L,W:Wf,D:Df,y:y}); }
  function buildSlabs(){ slabs.forEach(function(s){ slab(s.L,s.W,s.D,s.y); }); }

  /* A floor slab with the stairwells cut out of it, so you can climb up through
     it and walk back down again instead of meeting its underside. */
  function slab(L,Wf,Df,y){
    var mat=new THREE.MeshLambertMaterial({color:FLOORCOL[floorKind]||0x7A5634});
    var cut=holes.filter(function(h){ return h.level===L; });
    if(!cut.length){ root.add(P(box(Wf,.12,Df),mat,0,y,0)); return; }
    var h=cut[0];                                   // one stairwell per floor in these plans
    var z0=Math.max(-Df/2,h.z-h.hd), z1=Math.min(Df/2,h.z+h.hd);
    if(z0+Df/2>0.05) root.add(P(box(Wf,.12,z0+Df/2),mat,0,y,(-Df/2+z0)/2));
    if(Df/2-z1>0.05) root.add(P(box(Wf,.12,Df/2-z1),mat,0,y,(z1+Df/2)/2));
    var xL=h.x-h.hw, xR=h.x+h.hw, band=z1-z0, bz=(z0+z1)/2;
    if(xL+Wf/2>0.05) root.add(P(box(xL+Wf/2,.12,band),mat,(-Wf/2+xL)/2,y,bz));
    if(Wf/2-xR>0.05) root.add(P(box(Wf/2-xR,.12,band),mat,(xR+Wf/2)/2,y,bz));
  }
  /* one floor of rooms either side of a corridor — used by houses, and by the
     upper floors of anything with a lobby underneath */
  function roomFloor(L,here,Wf,Df,rw,rd,hall,wayOut){
    lvl=L; yOff=L*FLOOR;
    var zTop=-Df/2, zFront=Df/2, left=[], right=[];
    here.forEach(function(r,i){ (i%2?right:left).push(r); });
    if(wayOut) wallLine(-Wf/2,zFront,Wf/2,zFront,[0],1.8); else wallLine(-Wf/2,zFront,Wf/2,zFront);
    wallLine(-Wf/2,zTop,Wf/2,zTop); wallLine(-Wf/2,zTop,-Wf/2,zFront); wallLine(Wf/2,zTop,Wf/2,zFront);
    [[left,-1],[right,1]].forEach(function(side){
      var list=side[0], sd=side[1], gaps=[];
      list.forEach(function(r,i){
        var z0=zTop+i*rd, zc=z0+rd/2, xc=sd*(hall/2+rw/2);
        gaps.push(zc);
        if(i>0) wallLine(sd*hall/2,z0,sd*Wf/2,z0);
        furnishRoom(r,xc,zc,rw,rd,sd,put);
        spots.push({x:xc,z:zc+rd*.2,room:r,level:L});
        spots.push({x:xc+sd*1.2,z:zc-rd*.25,room:r,level:L});
        lights.push({x:xc,z:zc,y:yOff});
        windows.push({x:sd*(Wf/2-.12),z:zc,ry:sd>0?-Math.PI/2:Math.PI/2,y:yOff,big:(r==="office"||r==="techoffice")});
      });
      if(list.length) wallLine(sd*hall/2,zTop+list.length*rd,sd*Wf/2,zTop+list.length*rd);
      wallLine(sd*hall/2,zTop,sd*hall/2,zTop+list.length*rd,gaps);
    });
    for(var hz=zTop+3;hz<zFront-3;hz+=6) lights.push({x:0,z:hz,y:yOff});
    spots.push({x:0,z:zFront-4,room:"hallway",level:L});
    if(L>0) planSlab(L,Wf,Df,yOff-0.06);
    return {zTop:zTop,zFront:zFront};
  }
  /* small rooms opening off a great hall: side chapels, a vestry, a kitchen */
  function sideRooms(list,Wf,Df,L){
    if(!list||!list.length) return;
    lvl=L; yOff=L*FLOOR;
    var depth=4.6, n=list.length, along=(Df-4)/n;
    list.forEach(function(r,i){
      var sd=i%2?1:-1, k=Math.floor(i/2);
      var zc=-Df/2+2+along*(k+0.5)*2;
      if(zc>Df/2-2) zc=Df/2-2-along*0.5;
      var xc=sd*(Wf/2+depth/2);
      wallLine(sd*Wf/2,zc-along*0.9,sd*(Wf/2+depth),zc-along*0.9);
      wallLine(sd*Wf/2,zc+along*0.9,sd*(Wf/2+depth),zc+along*0.9);
      wallLine(sd*(Wf/2+depth),zc-along*0.9,sd*(Wf/2+depth),zc+along*0.9);
      wallLine(sd*Wf/2,zc-along*0.9,sd*Wf/2,zc+along*0.9,[zc],1.6);
      furnishRoom(r,xc,zc,depth,along*1.6,sd,put);
      spots.push({x:xc,z:zc,room:r,level:L});
      lights.push({x:xc,z:zc,y:yOff});
    });
  }
  /* the way up in a building of rooms off a corridor: every flight stands at
     the front end of the corridor, in one of two lanes beside the walls,
     climbing toward the back — so you arrive at the top facing straight down
     the corridor of the floor above, with the middle of it clear to walk, and
     the next flight up waiting in the other lane */
  function stairLaneX(SL){ return (SL%2?1:-1)*1.75; }
  function stairKeepouts(){
    fitStairs();
    for(var SL=0;SL<levels-1;SL++){
      var zc=D/2-2.2-STAIR_RUN/2, x=stairLaneX(SL);
      keepouts.push({level:SL,x:x,z:zc,hw:0.7+0.6,hd:STAIR_RUN/2+0.6});
      keepouts.push({level:SL+1,x:x,z:zc,hw:0.7+0.6,hd:STAIR_RUN/2+0.6});
    }
  }
  /* the lift stands at the back, in the middle, its doors facing the way you came in */
  function liftKeepouts(){
    if(!(plan.lift&&levels>2)) return;
    for(var L=0;L<levels;L++) keepouts.push({level:L,x:0,z:-D/2+1.45,hw:1.9,hd:1.9});
  }
  /* a lift: step in, and it takes you up or down. reads clearly as an
     elevator rather than a platform in a box — doors at the opening it's
     boarded through, and a small lit dot for each floor beside the call
     button so the one you're standing on is obvious at a glance. */
  function liftShaft(Wf,Df,levels){
    var lx=0, lz=-Df/2+1.45, doorGap=0.55, doorW=(2.6-doorGap)/2;
    for(var L=0;L<levels;L++){
      lvl=L; yOff=L*FLOOR;
      root.add(P(box(2.6,.12,2.6),new THREE.MeshLambertMaterial({color:0x4A4E56}),lx,yOff+.04,lz));
      [-1,1].forEach(function(sd){ root.add(P(box(.14,H-.4,2.6),new THREE.MeshLambertMaterial({color:0x6A6E76}),lx+sd*1.3,yOff+(H-.4)/2,lz)); });
      root.add(P(box(2.6,H-.4,.14),new THREE.MeshLambertMaterial({color:0x6A6E76}),lx,yOff+(H-.4)/2,lz-1.3));
      /* two static door panels, parted around a centre gap you walk through —
         a cab you can recognise even standing still */
      var doorH=H-.7, doorY=yOff+doorH/2+.15, doorMat=new THREE.MeshLambertMaterial({color:0x9AA0AA});
      root.add(P(box(doorW,doorH,.1),doorMat,lx-doorGap/2-doorW/2,doorY,lz+1.28));
      root.add(P(box(doorW,doorH,.1),doorMat,lx+doorGap/2+doorW/2,doorY,lz+1.28));
      root.add(P(box(2.6,.08,.1),new THREE.MeshLambertMaterial({color:0x5A5E68}),lx,yOff+doorH+.19,lz+1.28));
      /* the call button, and a little lit panel of floor dots beside it —
         the dot for the floor you're actually on shines gold */
      root.add(P(box(.5,.22,.1),mG(0xFFD08A,1),lx+1.0,yOff+1.5,lz+1.3));
      for(var d=0;d<levels;d++){
        root.add(P(box(.16,.16,.06),mG(d===L?0xFFD08A:0x3A3E48,1),lx-1.0,yOff+1.1+d*0.22,lz+1.3));
      }
      walls.push({x:ox+lx,z:oz+lz-1.3,rot:0,hw:1.3,hd:.1,h:H,level:L});
    }
    lifts.push({x:ox+lx,z:oz+lz});
    lvl=0; yOff=0;
  }

  if(plan.mode==="rooms"||plan.mode==="mixed"){
    var isMixed=plan.mode==="mixed";
    var rooms=(isMixed?(plan.upper||["office"]):plan.rooms).slice();
    (I.rooms||[]).forEach(function(r){ if(rooms.indexOf(r)===-1) rooms.push(r); });
    (I.items||[]).forEach(function(it){ if(it.room&&rooms.indexOf(it.room)===-1) rooms.push(it.room); });
    if(I.endless) for(var e=0;e<8;e++) rooms.push(["bedroom","study","hallway","living"][e%4]);
    var rw=7*big, rd=6*big, hall=5.2;
    if(isMixed){
      /* the same rooms repeat on every floor above the ground, the way they do */
      W=Math.max(plan.w*big,hall+rw*2); D=Math.max(plan.d*big,Math.ceil(rooms.length/2)*rd+7);
      stairKeepouts(); liftKeepouts();
      var zTop0=-D/2, zFront0=D/2;
      lvl=0; yOff=0;
      wallLine(-W/2,zFront0,W/2,zFront0,[0],2.2);
      wallLine(-W/2,zTop0,W/2,zTop0); wallLine(-W/2,zTop0,-W/2,zFront0); wallLine(W/2,zTop0,W/2,zFront0);
      /* the ground floor's own stairs (SL=0 always lands at the back of the
         corridor, x=0) are worked out now, before the lobby is furnished,
         so the front desk doesn't get set down on the steps */

      fillHall(plan.ground||"lobby",W,D,put,spots);
      spots.forEach(function(q){ if(q.level===undefined) q.level=0; });
      for(var glz=-D/2+4;glz<D/2-2;glz+=7) for(var glx=-W/2+4;glx<W/2-2;glx+=8) lights.push({x:glx,z:glz,y:0});
      for(var gwz=-D/2+3;gwz<D/2-2;gwz+=5){ windows.push({x:-W/2+.12,z:gwz,ry:Math.PI/2,y:0}); windows.push({x:W/2-.12,z:gwz,ry:-Math.PI/2,y:0}); }
      for(var L2=1;L2<levels;L2++){
        if(plan.locked&&L2===plan.locked.level){
          /* the penthouse: one room, the whole floor, and no corridor */
          lvl=L2; yOff=L2*FLOOR;
          wallLine(-W/2,D/2,W/2,D/2); wallLine(-W/2,-D/2,W/2,-D/2);
          wallLine(-W/2,-D/2,-W/2,D/2); wallLine(W/2,-D/2,W/2,D/2);
          fillHall("penthouse",W,D,put,spots);
          spots.forEach(function(q){ if(q.level===undefined) q.level=L2; });
          for(var pz=-D/2+4;pz<D/2-2;pz+=6) lights.push({x:0,z:pz,y:yOff});
          for(var pw=-D/2+3;pw<D/2-2;pw+=4){
            windows.push({x:-W/2+.12,z:pw,ry:Math.PI/2,y:yOff,big:true});
            windows.push({x:W/2-.12,z:pw,ry:-Math.PI/2,y:yOff,big:true});
          }
          planSlab(L2,W,D,yOff-0.06);
        } else roomFloor(L2,rooms,W,D,rw,rd,hall,false);
      }
      exitZ=zFront0;
    } else {
      var byLevel=roomsByLevel(rooms,levels);
      var widest=0;
      byLevel.forEach(function(list){ widest=Math.max(widest,Math.ceil(list.length/2)); });
      W=hall+rw*2; D=Math.max(2,widest)*rd+7;
      stairKeepouts(); liftKeepouts();
      for(var L=0;L<levels;L++) roomFloor(L,byLevel[L],W,D,rw,rd,hall,L===0);
      if(levels) furnishRoom("hallway",0,D/2-2.5,hall,4,1,put);
      exitZ=D/2;
    }
    /* the way between floors: a floor's stair up and its stair down land at
       opposite ends of the corridor, so nobody climbs the whole building
       through one straight shaft — each landing is a walk from the last. */
    fitStairs();
    for(var SL=0;SL<levels-1;SL++) flight(stairLaneX(SL),D/2-2.2-STAIR_RUN,SL,1.4);
    if(plan.lift&&levels>2) liftShaft(W,D,levels);
    lvl=0; yOff=0;
  } else {
    W=plan.w*big; D=plan.d*big;
    if(I.endless) D*=3;
    liftKeepouts();
    for(var HL=0;HL<levels;HL++){
      lvl=HL; yOff=HL*FLOOR;
      if(HL===0) wallLine(-W/2,D/2,W/2,D/2,[0],2.2); else wallLine(-W/2,D/2,W/2,D/2);
      wallLine(-W/2,-D/2,W/2,-D/2); wallLine(-W/2,-D/2,-W/2,D/2); wallLine(W/2,-D/2,W/2,D/2);
      /* this floor's own stairs up, worked out before the floor is furnished
         (see the matching flight() call below, once it's known this floor
         has one) so nothing gets furnished on top of the steps */
      if(HL<levels-1){
        fitStairs();
        var khw2=1.8/2,khd2=STAIR_RUN/2,farCornerK=HL%2===0;
        var kx=farCornerK?(W/2-2.4):(-W/2+2.4), kzh=farCornerK?(-D/2+2.4):(D/2-2.4-STAIR_RUN);
        keepouts.push({level:HL,x:kx,z:kzh+khd2,hw:khw2+0.6,hd:khd2+0.6});
      }
      fillHall(HL===0?plan.fill:(plan.fill==="church"||plan.fill==="castle"?plan.fill:"office"),W,D,put,spots);
      spots.forEach(function(q){ if(q.level===undefined) q.level=HL; });
      for(var lz=-D/2+4;lz<D/2-2;lz+=7) for(var lx=-W/2+4;lx<W/2-2;lx+=8) lights.push({x:lx,z:lz,y:yOff});
      var officeFloor=HL>0&&plan.fill!=="church"&&plan.fill!=="castle";
      for(var wz=-D/2+3;wz<D/2-2;wz+=5){ windows.push({x:-W/2+.12,z:wz,ry:Math.PI/2,y:yOff,big:officeFloor}); windows.push({x:W/2-.12,z:wz,ry:-Math.PI/2,y:yOff,big:officeFloor}); }
      if(HL<levels-1){
        fitStairs();
        var farCorner=HL%2===0;
        if(farCorner) flight(W/2-2.4,-D/2+2.4,HL,1.8);
        else flight(-W/2+2.4,D/2-2.4-STAIR_RUN,HL,1.8);
      }
      lvl=HL; yOff=HL*FLOOR;
      if(HL>0) planSlab(HL,W,D,yOff-0.06);
    }
    sideRooms(plan.side,W,D,0);
    if(plan.lift&&levels>2) liftShaft(W,D,levels);
    lvl=0; yOff=0;
    exitZ=D/2;
  }
  /* a workplace's own saved layout, floor by floor, where the plan's furniture would have gone */
  if(wpSaved){
    var keepL=lvl, keepY=yOff;
    wpSaved.forEach(function(p){
      if(!p||!FURN[p.k]||p.k==="stairs") return;
      var L=Math.max(0,Math.min(levels-1,p.l|0));
      lvl=L; yOff=L*FLOOR;
      realPut(p.k,+p.x||0,+p.z||0,+p.r||0);
    });
    lvl=keepL; yOff=keepY;
  } else if(wpKey&&!/^lot:/.test(wpKey)&&typeof workplaceFit==="function"){
    /* not rearranged yet: furnished for its trade, the trade's own pieces set along the walls */
    var keepL2=lvl, keepY2=yOff; lvl=0; yOff=0;
    workplaceFit(wpKey,W,D,asBuilt).forEach(function(p){ asBuilt.push(p); realPut(p.k,p.x,p.z,p.r); });
    lvl=keepL2; yOff=keepY2;
  }
  /* things dreamt inside that aren't in the plan: set about the room they were dreamt in, or the first */
  (I.items||[]).forEach(function(it,i){
    var sp=spots.filter(function(p){ return it.room&&p.room===it.room; })[0]||spots[i%Math.max(1,spots.length)]||{x:0,z:0};
    put(it.k,sp.x+((i*37)%5-2)*.6,sp.z-1.2-((i*13)%3)*.5,0);
  });
  /* floor, ceiling, windows, light */
  var fl=P(box(W,.1,D),new THREE.MeshLambertMaterial({color:FLOORCOL[floorKind]||0x7A5634}),0,-.05,0);
  var tx=typeof texOf==="function"?texOf(floorKind==="checker"?"tile":floorKind==="carpet"?null:floorKind):null;
  if(tx){ fl.material.map=tx; fl.material.needsUpdate=true; }
  root.add(fl);
  if(floorKind==="checker") for(var ci=0;ci<Math.min(W*D/4,900);ci++){ var cx=-W/2+1+(ci%Math.floor(W/2))*2, cz=-D/2+1+Math.floor(ci/Math.floor(W/2))*2; if(cz>D/2) break;
    if(((Math.round(cx/2)+Math.round(cz/2))&1)===0) root.add(P(box(2,.02,2),mL(0x1A1A1E),cx,.01,cz)); }
  root.add(P(box(W+1.2,.3,D+1.2),new THREE.MeshLambertMaterial({color:shade(wallCol,-.12),side:THREE.DoubleSide}),0,(levels-1)*FLOOR+H+.15,0));
  var winMats=[], winGlints=[];
  /* every interior has a floor of its own: it is built away from the world, where
     no ground reaches. without this you stand on nothing and see under everything. */
  root.add(P(box(W+2.4,.4,D+2.4),new THREE.MeshLambertMaterial({color:FLOORCOL[floorKind]||0x7A5634}),0,-0.2,0));
  windows.forEach(function(w){
    /* windows read as bigger, grander panes generally now — taller than a
       person, not a porthole — and an office or the penthouse gets a still
       grander one again: floor-to-near-ceiling glass befitting the room. */
    var big=!!w.big, pw=big?2.6:1.9, ph=big?3.0:2.0, midY=big?1.9:1.75;
    /* the glass itself: a little shininess so the room's own lights catch it,
       instead of a flat painted-on tint */
    var wm=new THREE.MeshPhongMaterial({color:0xCFE0F0,shininess:70,specular:0x889AB0});
    winMats.push(wm);
    var wp=P(new THREE.PlaneGeometry(pw,ph),wm,w.x,(w.y||0)+midY,w.z); wp.rotation.y=w.ry; root.add(wp);
    /* a bright strip near the top of the pane that flares warm at dawn and
       dusk and fades at night and at noon — the "catching the outdoor light"
       cue, cheap and without any texture work */
    var gm=new THREE.MeshBasicMaterial({color:0xFFC98A,transparent:true,opacity:0});
    winGlints.push(gm);
    var gp=P(new THREE.PlaneGeometry(pw,ph*0.22),gm,w.x+Math.sin(w.ry)*0.01,(w.y||0)+midY+ph*0.42,w.z+Math.cos(w.ry)*0.01);
    gp.rotation.y=w.ry; root.add(gp);
  });
  /* every lamp in the plan is drawn, on every floor; the light itself goes
     with you, floor to floor, so the top floor is as well lit as the lobby */
  lights.forEach(function(l){ root.add(P(sph(.14),mG(0xFFF0D0,1),l.x,(l.y||0)+H-.12,l.z)); });
  var lightPool=[]; for(var lpi=0;lpi<10;lpi++){ var lpl=new THREE.PointLight(0xFFE2B8,0,16,1.6); root.add(lpl); lightPool.push(lpl); }
  var lightFill=new THREE.PointLight(0xFFF0DC,0,Math.max(W,D)*1.3,1.1); root.add(lightFill);
  /* the way out: a door in the front wall */
  var ex=P(box(1.7,2.25,.12),mL(0x5A3A22),0,1.12,exitZ-.1); root.add(ex);
  var amb=new THREE.HemisphereLight(0xFFF0D8,0x2A2018,.3); amb.position.set(0,H,0); root.add(amb);
  buildSlabs();                                   // floors last, with the stairwells cut out
  lvl=0; yOff=0;
  /* holes in world coordinates, for anything that needs to know where a floor
     is actually open — the stairwells and lift shafts, the only legitimate
     ways through a solid floor */
  var holesOut=holes.map(function(h){ return {level:h.level,x:ox+h.x,z:oz+h.z,hw:h.hw,hd:h.hd}; });
  /* what to call each floor on the lift's own floor picker — named from the
     plan itself, so the numbers on the panel mean something instead of just
     counting up blind */
  var floorNames=[];
  (function(){
    function cap(s){ return s?(s.charAt(0).toUpperCase()+s.slice(1)):s; }
    for(var L=0;L<levels;L++){
      if(plan.locked&&L===plan.locked.level){ floorNames[L]=cap((plan.locked.what||"the penthouse").replace(/^the /,"")); continue; }
      if(L===0){
        var g=(plan.mode==="mixed")?(plan.ground||"lobby"):(plan.mode==="hall"?plan.fill:null);
        floorNames[L]=g?cap(ROOMNAME[g]||g):"Ground floor"; continue;
      }
      if(plan.mode==="mixed"){ floorNames[L]="Offices"; continue; }
      if(plan.mode==="hall"){ floorNames[L]=(plan.fill==="church"||plan.fill==="castle")?cap(ROOMNAME[plan.fill]||plan.fill):"Offices"; continue; }
      floorNames[L]="Floor "+(L+1);
    }
  })();
  return {spec:spec,root:root,walls:walls,spots:spots,ox:ox,oz:oz,exit:{x:ox,z:oz+exitZ-1.0},start:{x:ox,z:oz+exitZ-2.4},
    winMats:winMats,winGlints:winGlints,W:W,D:D,levels:levels,floor:FLOOR,stairs:stairsAt,lifts:lifts,level:0,holes:holesOut,
    locked:plan.locked||null,unlocked:false,floorNames:floorNames,
    asBuilt:asBuilt,wpKey:wpKey,wpSaved:!!wpSaved,
    lightSpots:lights,lightPool:lightPool,lightFill:lightFill,ceilH:H,lightAt:-1,lightLevel:-1};
}
/* the lights of the floor you are on: its own lamps nearest you first, and
   where a floor has none of its own, lamps spread evenly across it */
/* in the Stylized look every lamp lights the whole of a room in bands, so the
   same lamps there are turned well down, or the rooms wash out white */
var INT_TOONED=(typeof TOON!=="undefined"&&!!TOON);
var INT_LAMP=INT_TOONED?0.12:0.42, INT_FILL=INT_TOONED?0.06:0.22, INT_HEMI=INT_TOONED?0.7:0.78;
function intLightTick(dt){
  if(!INT||!INT.lightPool) return;
  var L=INT.level||0, now=performance.now();
  if(L===INT.lightLevel&&now-INT.lightAt<500) return;
  INT.lightLevel=L; INT.lightAt=now;
  var F=INT.floor, H=INT.ceilH||3, rp=INT.root.position, P=camera.position, cx=P.x-rp.x, cz=P.z-rp.z;
  var spots=(INT.lightSpots||[]).filter(function(l){ return Math.round((l.y||0)/F)===L; });
  if(spots.length<4){
    var nx=Math.max(2,Math.round(INT.W/7)), nz=Math.max(2,Math.round(INT.D/7));
    for(var i=0;i<nx;i++) for(var j=0;j<nz;j++) spots.push({x:-INT.W/2+INT.W*(i+0.5)/nx,z:-INT.D/2+INT.D*(j+0.5)/nz,y:L*F});
  }
  spots.sort(function(a,b){ return Math.hypot(a.x-cx,a.z-cz)-Math.hypot(b.x-cx,b.z-cz); });
  INT.lightPool.forEach(function(pl,i){
    var s=spots[i]; if(!s){ pl.intensity=0; return; }
    pl.position.set(s.x,L*F+H-0.3,s.z); pl.intensity=INT_LAMP;
  });
  INT.lightFill.position.set(0,L*F+H*0.8,0); INT.lightFill.intensity=INT_FILL;
}
function furnBox(k){ var s={bed:[1.6,2.1],sofa:[2.3,.9],table:[1.4,.9],longtable:[4.4,2.4],counter:[2.4,.7],piano:[1.5,.8],wardrobe:[1.3,.6],bookshelf:[1.6,.4],
  fireplace:[2,.6],stove:[.8,.7],fridge:[.75,.7],bathtub:[1.7,.8],desk:[1.4,.7],pew:[3.4,.6],altarinside:[2.3,1],throneseat:[1.4,1.4],shelfgoods:[2.4,.5],till:[2,.7],
  hospitalbed:[1,2],crates:[2,1.1],machine:[2,1.4],judgebench:[3.6,1.2],counterbank:[5,.7],sarcophagus:[1.1,2.4]}; return s[k]||[1,1]; }

function furnishRoom(kind,xc,zc,w,d,sd,put){
  /* the hallway has no end wall of its own: things hang and stand along its sides */
  if(kind==="hallway"){ put("rug",xc,zc,0); put("painting",xc-w/2+.12,zc-.6,Math.PI/2); put("plant",xc+w/2-.45,zc-1.6,0); return; }
  var list=ROOMFURN[kind]||ROOMFURN.living, far=xc+sd*(w/2-.6);
  list.forEach(function(k,i){
    if(k==="rug"||k==="chandelier"){ put(k,xc,zc,0); return; }
    if(k==="painting"||k==="wallmirror"||k==="wallscreen"){ put(k,xc,zc-d/2+.15,0); return; }
    if(k==="bed"||k==="hospitalbed"){ put(k,far-sd*.4,zc-d/2+1.3,0); return; }
    if(k==="bookshelf"||k==="wardrobe"||k==="fridge"||k==="shelfgoods"){ put(k,xc+(i%2?1:-1)*1.6,zc-d/2+.35,0); return; }
    if(k==="fireplace"){ put(k,far-sd*.35,zc,sd>0?-Math.PI/2:Math.PI/2); return; }
    if(k==="counter"||k==="stove"||k==="sink"){ put(k,xc-1.6+i*.9,zc-d/2+.4,0); return; }
    var a=i*1.9, r=Math.min(w,d)*.22; put(k,xc+Math.cos(a)*r,zc+Math.sin(a)*r,-a);
  });
}
function fillHall(kind,W,D,put,spots){
  var i,z;
  if(kind==="church"){ for(z=-D/2+6;z<D/2-4;z+=1.6){ put("pew",-W/4-.3,z,Math.PI); put("pew",W/4+.3,z,Math.PI); }
    put("runner",0,D/8,0);
    put("altarinside",0,-D/2+2,Math.PI); put("pulpit",W/4,-D/2+4,Math.PI); put("candles",-W/4,-D/2+1.2,0); put("candles",W/4-1,-D/2+1.2,0);
    put("chandelier",0,0,0); spots.push({x:0,z:-D/2+3.4,room:"nave"},{x:2,z:D/4,room:"nave"}); }
  else if(kind==="library"){ for(z=-D/2+3;z<D/2-6;z+=3) for(i=-1;i<=1;i+=2){ put("bookshelf",i*W/4-.9,z,0); put("bookshelf",i*W/4+.9,z,0); }
    put("table",0,D/2-5,0); put("lamp",1,D/2-5,0); put("desk",-W/4,D/2-3,Math.PI); spots.push({x:0,z:D/2-6,room:"stacks"},{x:-W/4,z:D/2-4,room:"desk"}); }
  else if(kind==="school"){ put("blackboard",0,-D/2+.2,0); put("desk",0,-D/2+2,Math.PI); for(z=-D/2+4;z<D/2-3;z+=2) for(i=-2;i<=2;i++) put("schooldesk",i*2,z,Math.PI);
    spots.push({x:0,z:-D/2+2.8,room:"classroom"}); }
  else if(kind==="shop"){ put("till",0,-D/2+3,Math.PI); for(z=-D/2+1;z<D/2-2;z+=2.6){ put("shelfgoods",-W/2+.4,z,Math.PI/2); put("shelfgoods",W/2-.4,z,-Math.PI/2); }
    put("shelfgoods",0,D/6,0); spots.push({x:0,z:-D/2+1.8,room:"counter"}); }
  else if(kind==="hospital"){ for(z=-D/2+2;z<D/2-4;z+=3){ put("hospitalbed",-W/2+1.2,z,Math.PI/2); put("hospitalbed",W/2-1.2,z,-Math.PI/2); }
    put("till",0,D/2-4,0); spots.push({x:0,z:D/2-5,room:"reception"},{x:0,z:0,room:"ward"}); }
  else if(kind==="bank"){ put("counterbank",0,-D/6,0); put("vaultround",0,-D/2+.2,0); put("plant",-W/2+1,D/2-2,0); put("plant",W/2-1,D/2-2,0); put("chandelier",0,D/6,0);
    spots.push({x:0,z:-D/6-1.4,room:"counter"}); }
  else if(kind==="penthouse"){
    /* the whole top floor, dressed as the reward it's meant to be: a proper
       executive office up front, a lounge spread through the middle instead
       of huddled at its centre, a library wall and a cabinet facing each
       other, and the map of everywhere actually built this time — it used to
       be named here and never drawn. */
    put("desk",0,-D/2+3,Math.PI); put("chair",0,-D/2+5,0);
    put("monitor",-.9,-D/2+3,Math.PI); put("wallscreen",-W/4,-D/2+.15,0);
    put("maptable",W/4,-D/4,0);
    put("sofa",-W/4,D/8,0.4); put("armchair",W/4-1.6,D/8,-0.5); put("armchair",-W/4-1.8,D/6+2,0.9);
    put("table",-W/6,D/8,0); put("lamp",W/4,D/8+1.7,0); put("rug",-W/6,D/8,0);
    put("bookshelf",-W/2+1.2,-D/6,Math.PI/2); put("bookshelf",-W/2+1.2,-D/6+4,Math.PI/2);
    put("wardrobe",W/2-1.3,D/4,-Math.PI/2);      // dressed here as a dark-wood, gilt-handled cabinet
    put("wallmirror",W/2-.15,-D/6,-Math.PI/2);
    put("chandelier",0,0,0); put("candles",-W/6+1,D/8,0);
    put("plant",W/2-1.4,-D/2+1.6,0); put("plant",-W/2+1.4,-D/2+1.6,0); put("plant",0,D/2-2,0);
    put("painting",0,-D/2+.2,0); put("painting",-W/2+.15,D/2-4,Math.PI/2);
    spots.push({x:0,z:-D/2+4.4,room:"the office"},{x:-W/4,z:D/8,room:"the office"});
  }
  else if(kind==="lobby"){
    put("till",0,-D/2+2.2,Math.PI);
    put("armchair",-W/4,D/6,0.6); put("armchair",-W/4+2,D/6-1.4,-0.8); put("table",-W/4+1,D/6-0.7,0);
    put("plant",-W/2+1.2,-D/2+1.4,0); put("plant",W/2-1.2,-D/2+1.4,0);
    put("rug",0,D/6,0); put("chandelier",0,0,0); put("painting",0,-D/2+.2,0);
    spots.push({x:0,z:-D/2+3.4,room:"lobby",level:0},{x:-W/4,z:D/6,room:"lobby",level:0},
      {x:W/4,z:-D/6,room:"lobby",level:0});
  }
  else if(kind==="station"){ put("till",-W/2+3,-D/2+2,0); for(i=-1;i<=1;i++) put("benchin",i*5,0,0); put("clock",W/2-.5,-D/2+.4,0);
    spots.push({x:0,z:1.5,room:"waiting room"}); }
  else if(kind==="court"){ put("judgebench",0,-D/2+2,Math.PI); for(z=0;z<D/2-3;z+=1.8){ put("pew",-W/4,z,Math.PI); put("pew",W/4,z,Math.PI); }
    spots.push({x:0,z:-D/2+3.5,room:"court"}); }
  else if(kind==="works"){ for(i=0;i<6;i++) put(i%2?"machine":"crates",-W/2+3+(i%3)*(W/3),-D/2+3+Math.floor(i/3)*(D/2.5),0); put("barrel",W/2-2,D/2-3,0);
    spots.push({x:0,z:D/4,room:"floor"}); }
  else if(kind==="lab"){
    for(z=-D/2+3;z<D/2-4;z+=4){ put("labbench",-W/4,z,0); put("labbench",W/4,z,0); }
    put("bigconsole",0,-D/2+1.2,Math.PI); put("podbed",W/2-1.6,D/2-3,Math.PI/2); put("podbed",-W/2+1.6,D/2-3,-Math.PI/2);
    spots.push({x:0,z:-D/2+2.6,room:"the laboratory",level:0});
  }
  else if(kind==="barn"){ put("crates",-W/2+2,-D/2+2,0); put("barrel",W/2-1.5,-D/2+1.5,0); put("barrel",W/2-2.5,-D/2+1.5,0); spots.push({x:0,z:0,room:"barn"}); }
  else if(kind==="castle"){ put("throneseat",0,-D/2+2,Math.PI); put("longtable",0,0,Math.PI/2); put("fireplace",-W/2+.4,-D/4,Math.PI/2);
    for(z=-D/2+3;z<D/2-3;z+=6){ put("banner",-W/2+.2,z,Math.PI/2); put("banner",W/2-.2,z,-Math.PI/2); } put("chandelier",0,-D/4,0); put("chandelier",0,D/4,0);
    spots.push({x:0,z:-D/2+4,room:"throne room"},{x:2,z:D/4,room:"hall"}); }
  else if(kind==="tower"){ put("spiralstair",0,-1,0); put("table",W/4,W/4,0); put("chair",W/4+.8,W/4,0); spots.push({x:-W/4,z:W/4,room:"tower"}); }
  else if(kind==="crypt"){ for(z=-D/2+2;z<D/2-3;z+=3){ put("sarcophagus",-W/4,z,0); put("sarcophagus",W/4,z,0); } put("candles",0,-D/2+.6,0); spots.push({x:0,z:0,room:"crypt"}); }
  else { put("rug",0,0,0); put("table",0,-D/4,0); put("lamp",W/2-1,-D/2+1,0); put("chair",1,-D/4,Math.PI); spots.push({x:0,z:D/6,room:"room"}); }
}

/* ---- going in and coming out ---- */
function enterBuilding(spec){
  if(INT) exitInterior(true);
  INT=makeInterior(spec); scene.add(INT.root);
  store.inside=spec.id; intCool=1.2; wallsAt=-1;
  INT.outside={x:camera.position.x,z:camera.position.z,y:camera.position.y,here:store.here||0};
  camera.position.set(INT.start.x,1.72,INT.start.z); yaw=0; pitch=0;
  if(typeof flyY!=="undefined") flyY=0;
  /* a level you were pinned against belongs to the building you were just
     in — its floor height and floor count both differ building to building,
     so carrying it into a new interior can hold you at a nonsense height */
  if(typeof pinnedLevel!=="undefined") pinnedLevel=null;
  bringOccupants();
  setStatus("<b>Inside "+esc(placeName(spec))+".</b> Walk back out through the door you came in by.");
}
function exitInterior(quiet){
  if(!INT) return;
  var spec=INT.spec;
  scene.remove(INT.root); INT=null; store.inside=null; wallsAt=-1; intCool=1.2;
  if(typeof pinnedLevel!=="undefined") pinnedLevel=null;
  var D=doorWorld(spec);
  camera.position.set(D.x+D.out.x*2.2,1.72,D.z+D.out.z*2.2); yaw=Math.atan2(-D.out.x,-D.out.z)+Math.PI; pitch=0;
  if(!quiet) setStatus("Back outside "+esc(placeName(spec))+".");
  if(typeof moveEveryone==="function") moveEveryone(dreamHour(),daylight(dreamHour()));
}
function rebuildInterior(){ if(!INT) return; var spec=INT.spec, p={x:camera.position.x,z:camera.position.z};
  scene.remove(INT.root); INT=makeInterior(spec); scene.add(INT.root); wallsAt=-1; camera.position.x=p.x; camera.position.z=p.z; bringOccupants(); }

/* how strongly a window's glass should be catching outdoor light right now:
   dim at night, dim again at flat noon, and warmest right around dawn and
   dusk, when the sun is low enough to actually flare off a pane of glass.
   `day` is daylight()'s own 0..1 value, already ramping through both. */
function daySunAngle(day){
  var low=4*day*(1-day);                     // 0 at night and at full day, peaks mid-ramp
  return {col:0xFFC98A, o:Math.min(0.62,low*0.7)};
}

/* the lift: stand in it and rise or fall a floor at a time */
var liftCool=0, liftNear=false;
function inLift(){
  if(!INT||!INT.lifts||!INT.lifts.length) return null;
  var P=camera.position;
  for(var i=0;i<INT.lifts.length;i++){
    var L=INT.lifts[i];
    if(Math.hypot(P.x-L.x,P.z-L.z)<1.7) return L;
  }
  return null;
}
/* the penthouse door. the code lives on the server, where nobody can read it,
   and the server alone decides who goes up (schema-update-18): a keeper and
   whoever holds the penthouse walk straight in; anyone else is asked for the
   code if the keeper has left the door on "anyone with the code".
   the answer takes a moment to come back, so the lift or the stair holds you
   at the floor below until it does, then carries you up. */
var penthouseCleared=null;      // the account the server has already let in, this sitting
var penthouseAsking=false, penthouseRefusedAt=0;
function towerRule(k){ return (typeof DW_CLOUD!=="undefined"&&DW_CLOUD.config&&DW_CLOUD.config[k])||null; }
function penthouseLetIn(I,to){
  if(!INT||INT!==I) return;            // walked out of the tower while the door was thinking
  INT.unlocked=true;
  penthouseCleared=(typeof session!=="undefined"&&session&&session.user)?session.user.id:null;
  setStatus("<b>The door opens.</b> Somnucor, "+esc(INT.locked.what)+".");
  if(inLift()){
    INT.level=to; camera.position.y=1.72+to*INT.floor; liftCool=0.7; wallsAt=-1;
    setStatus("<b>The door opens.</b> Floor "+(to+1)+" of "+INT.levels+" — "+esc(INT.locked.what)+".");
  }
  else {
    /* held at the top of the stairs while the door decided: carried up the last step */
    var P=camera.position, near=(INT.stairs||[]).some(function(st){ return st.from===to-1&&Math.abs(P.x-st.x)<st.hw+1.5&&Math.abs(P.z-st.z)<st.hd+2; });
    if(near){ INT.level=to; camera.position.y=1.72+to*INT.floor; if(typeof flyY!=="undefined") flyY=0; pinnedLevel=null; wallsAt=-1;
      setStatus("<b>The door opens.</b> Floor "+(to+1)+" of "+INT.levels+" — "+esc(INT.locked.what)+"."); }
  }
}
function askPenthouse(to){
  var I=INT;
  if(penthouseAsking||!I) return;
  if(Date.now()-penthouseRefusedAt<4000) return;       // pressing against a shut door doesn't knock a hundred times
  if(!(typeof signedIn==="function"&&signedIn())){
    penthouseRefusedAt=Date.now();
    setStatus("<b>The door does not know you.</b> Sign in first — the penthouse admits people by account.");
    return;
  }
  penthouseAsking=true;
  setStatus("<b>The door is looking at you…</b>");
  /* first, without a code: a keeper or the holder needs none */
  cityRpc("enter_penthouse",{p_code:null}).then(function(r){
    if(r&&r.ok){ penthouseAsking=false; penthouseLetIn(I,to); return; }
    var why=(r&&r.why)||"";
    if(!/not the one/i.test(why)){          // sealed, keepers only, no code set, too many tries
      penthouseAsking=false; penthouseRefusedAt=Date.now();
      setStatus("<b>"+esc(why||"The door will not open.")+"</b>");
      return;
    }
    var tries=(typeof prompt==="function")?prompt("The way to "+I.locked.what+" is locked.\nCode:"):null;
    if(tries===null||!String(tries).trim()){ penthouseAsking=false; penthouseRefusedAt=Date.now(); setStatus("You step back from the door."); return; }
    return cityRpc("enter_penthouse",{p_code:String(tries).trim()}).then(function(r2){
      penthouseAsking=false;
      if(r2&&r2.ok) penthouseLetIn(I,to);
      else { penthouseRefusedAt=Date.now(); setStatus(esc((r2&&r2.why)||"That code is not the one.")); }
    });
  }).catch(function(){
    penthouseAsking=false; penthouseRefusedAt=Date.now();
    setStatus("The penthouse door does not answer just now. Run schema-update-18 if you have not yet.");
  });
}
function levelAllowed(to){
  if(!INT) return true;
  /* the keeper can shut the whole tower above the lobby */
  if(INT.locked&&to>0&&towerRule("towerOpen")==="lobby"&&!(typeof amKeeper==="function"&&amKeeper())){
    setStatus("<b>The lift will not go up.</b> Somnucor has the upper floors closed today.");
    return false;
  }
  if(!INT.locked) return true;
  if(to!==INT.locked.level) return true;
  var me=(typeof session!=="undefined"&&session&&session.user)?session.user.id:null;
  if(INT.unlocked&&me&&penthouseCleared===me) return true;
  if(me&&penthouseCleared===me){ INT.unlocked=true; return true; }
  INT.unlocked=false;
  askPenthouse(to);
  return false;
}

function liftMove(dir){
  if(!INT||liftCool>0||!inLift()) return false;
  var to=(INT.level||0)+dir;
  if(to<0||to>INT.levels-1) return false;
  if(!levelAllowed(to)){ liftCool=1.2; return false; }
  INT.level=to; camera.position.y=1.72+to*INT.floor; liftCool=0.7; wallsAt=-1;
  setStatus("<b>Floor "+(to+1)+" of "+INT.levels+".</b>");
  return true;
}
/* pick a floor directly, from the panel, instead of stepping to it one press
   at a time — the same rules (a locked floor still asks, a shut tower still
   refuses) apply exactly as they do to Space/Control */
function liftGoTo(to){
  if(!INT||liftCool>0||!inLift()) return false;
  to=Math.max(0,Math.min(INT.levels-1,to|0));
  if(to===(INT.level||0)) return true;
  if(!levelAllowed(to)){ liftCool=1.2; return false; }
  INT.level=to; camera.position.y=1.72+to*INT.floor; liftCool=0.7; wallsAt=-1;
  setStatus("<b>Floor "+(to+1)+" of "+INT.levels+".</b>");
  return true;
}
/* the floor picker: shown only while standing in a lift, one button per
   floor, named the way the plan itself names that floor */
var liftPanel=null;
function liftButtons(){
  if(liftPanel||typeof document==="undefined"||!document.body) return;
  liftPanel=document.createElement("div");
  liftPanel.id="lift-panel";
  liftPanel.style.cssText="position:fixed;bottom:96px;left:12px;z-index:30;display:none;flex-direction:column-reverse;gap:4px;max-width:calc(100vw - 24px);max-height:56vh;overflow-y:auto;padding:6px;background:rgba(11,13,19,.7);border-radius:4px";
  document.body.appendChild(liftPanel);
}
function paintLiftPanel(){
  liftButtons();
  if(!liftPanel) return;
  var show=walkMode&&!!INT&&!!inLift();
  liftPanel.style.display=show?"flex":"none";
  if(!show) return;
  var key=INT.spec.id+":"+INT.levels;
  if(liftPanel.dataset.key!==key){
    var h="";
    for(var L=0;L<INT.levels;L++){
      var nm=(INT.floorNames&&INT.floorNames[L])||("Floor "+(L+1));
      h+='<button class="btn" data-floor="'+L+'" style="text-align:left;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis;display:block">'+(L+1)+" — "+esc(nm)+"</button>";
    }
    liftPanel.innerHTML=h;
    Array.prototype.forEach.call(liftPanel.querySelectorAll("[data-floor]"),function(b){
      b.onclick=function(){ liftGoTo(parseInt(b.getAttribute("data-floor"),10)); };
    });
    liftPanel.dataset.key=key;
  }
  var here=INT.level||0;
  Array.prototype.forEach.call(liftPanel.querySelectorAll("[data-floor]"),function(b){
    var mine=parseInt(b.getAttribute("data-floor"),10)===here;
    b.style.fontWeight=mine?"700":"400";
    b.style.opacity=mine?"1":".82";
  });
}

/* the people whose hour has them in this building are in here with you */
var ROLE_ROOM={cartographer:"techoffice",archivist:"archive",engineer:"kitchenette",gatekeeper:"lobby",
  runner:"lobby",nightdesk:"lobby",founder:"the office",nurse_day:"ward",nurse_night:"ward",patient:"ward",clerk:"office",guest:"bedroom",
  resident:"living",teacher:"classroom",child:"classroom",priest:"nave",shopkeeper:"counter",
  keeper:"lobby",worker:"floor",prisoner:"cell",farmer:"barn",innkeeper:"lobby",nightwatch:"lobby"};
function bringOccupants(){
  if(!INT) return;
  var used={}, n=0;
  var mine=store.characters.filter(function(c){ return c.objId&&c.atId===INT.spec.id; });
  mine.forEach(function(c){
    var g=meshes[c.objId]; if(!g) return;
    /* the room that suits what they do, else any room nobody is standing in yet */
    var want=ROLE_ROOM[c.role]||null;
    var free=INT.spots.filter(function(q,i){ return !used[i]; });
    var pick=-1;
    INT.spots.forEach(function(q,i){ if(pick<0&&!used[i]&&want&&q.room===want) pick=i; });
    if(pick<0) INT.spots.forEach(function(q,i){ if(pick<0&&!used[i]) pick=i; });
    if(pick<0) pick=n%Math.max(1,INT.spots.length);
    used[pick]=1;
    var sp=INT.spots[pick]||{x:0,z:0,level:0};
    var lift=(sp.level||0)*INT.floor;
    var x=INT.ox+sp.x+((n%3)-1)*.5, z=INT.oz+sp.z+(((n>>1)%3)-1)*.5; n++;
    g.position.x=x; g.position.z=z;
    if(g.position.y!==undefined) g.position.y=lift;
    g.userData.target={x:x,z:z}; g.userData.path=null; g.visible=true;
    c.x=x; c.z=z; c.insideAt=INT.spec.id; c.onLevel=sp.level||0;
  });
}
/* each frame while walking: step into a doorway to go in; step into the way out to leave */
/* indoors the light is the building's own: the same comfortable level at noon
   and at midnight. the sun and sky light the city outside; let in through a
   roof they washed floors white by day and left rooms murky by night. */
var indoorLit=false;
function indoorLight(on){
  if(on){
    indoorLit=true;
    if(typeof sun!=="undefined"&&sun) sun.intensity=0;
    if(typeof hemi!=="undefined"&&hemi){ hemi.color.setHex(0xFFF2E2); hemi.groundColor.setHex(0x6A5E50); hemi.intensity=INT_HEMI; }
    if(scene&&scene.fog) scene.fog.density=Math.min(scene.fog.density,0.002);
  } else if(indoorLit){
    indoorLit=false;
    if(typeof tickClock==="function") tickClock(true);
  }
}
function interiorTick(dt){
  if(intCool>0) intCool-=dt;
  if(liftCool>0) liftCool-=dt;
  paintLiftPanel();
  if(!walkMode){ if(INT) exitInterior(true); indoorLight(false); return; }
  var P=camera.position;
  indoorLight(!!INT);
  if(INT) intLightTick(dt);
  if(INT){
    var day=daylight(dreamHour()), wc=blend(0x1A2238,0xCFE0F0,day);
    var sun=daySunAngle(day);
    INT.winMats.forEach(function(m){ m.color.setHex(wc); });
    if(INT.winGlints) INT.winGlints.forEach(function(m){ m.color.setHex(sun.col); m.opacity=sun.o; });
    /* the lift: a status line the first time you step near it, the same way
       the keeper's desk announces itself, so nobody has to guess it exists */
    var near=inLift();
    if(near&&!liftNear){ liftNear=true; setStatus("<b>The lift.</b> Pick a floor from the panel, or press <b>Space</b> to rise and <b>C</b> to descend one at a time."); }
    else if(!near&&liftNear) liftNear=false;
    /* the stairs are walked up, not stepped through: ground.js carries you */
    if(intCool<=0&&(INT.level||0)===0&&Math.hypot(P.x-INT.exit.x,P.z-INT.exit.z)<0.9) exitInterior(false);
    return;
  }
  /* on the ground you're standing on — in the risen city that ground is a terrace
     a hundred metres up, so measure from it, not from sea level */
  var gy=(typeof terrainY==="function")?terrainY(P.x,P.z):0;
  if(intCool>0||P.y-1.72-gy>2) return;
  for(var i=0;i<store.objects.length;i++){
    var o=store.objects[i];
    if((o.realm||0)!==(store.here||0)||o.filler||!enterable(o)) continue;
    if(Math.abs(o.x-P.x)>60||Math.abs(o.z-P.z)>60) continue;
    var D=doorWorld(o);
    if(Math.hypot(P.x-D.x,P.z-D.z)<0.9){ enterBuilding(o); return; }
  }
}

