/* SomnuMatrix — households.js
   nothing stands empty. a house gets the people who live in it, a shop gets the
   one who keeps it, a hospital keeps somebody awake at four in the morning.
   their hours come from the building they belong to, not from a single template.
   loaded as a plain script; shares scope with the other files */
"use strict";

/* hours by what somebody does, not by what they are */
var SHIFT={
  resident:ROUTINE.human,
  child:ROUTINE.child,
  shopkeeper:[[0,6.5,"home","asleep"],[6.5,7.5,"travel","opening up"],[7.5,13,"work","behind the counter"],
    [13,13.75,"out","a bite to eat"],[13.75,17.5,"work","behind the counter"],[17.5,18.25,"travel","closing up"],
    [18.25,22,"home","at home"],[22,24,"home","asleep"]],
  innkeeper:[[0,2,"work","last orders"],[2,9.5,"home","asleep"],[9.5,11,"work","cleaning through"],
    [11,15,"work","the midday trade"],[15,17,"home","resting"],[17,24,"work","the evening trade"]],
  teacher:[[0,6.5,"home","asleep"],[6.5,8,"travel","on the way in"],[8,15.5,"work","teaching"],
    [15.5,17,"work","marking"],[17,18,"travel","going home"],[18,22.5,"home","at home"],[22.5,24,"home","asleep"]],
  nurse_day:[[0,6,"home","asleep"],[6,7,"travel","on the way in"],[7,19.5,"work","on the ward"],
    [19.5,20.5,"travel","going home"],[20.5,24,"home","at home"]],
  nurse_night:[[0,7.5,"work","on the night ward"],[7.5,8.5,"travel","going home"],[8.5,17,"home","asleep"],
    [17,19,"home","about the house"],[19,20,"travel","on the way in"],[20,24,"work","on the night ward"]],
  clerk:[[0,7,"home","asleep"],[7,8.75,"home","getting ready"],[8.75,9.25,"travel","on the way in"],
    [9.25,13,"work","at the desk"],[13,14,"out","out at midday"],[14,17,"work","at the desk"],
    [17,17.75,"travel","going home"],[17.75,22.5,"home","at home"],[22.5,24,"home","asleep"]],
  priest:[[0,5.5,"home","asleep"],[5.5,7,"work","before anyone comes"],[7,9,"work","morning prayers"],
    [9,12,"out","visiting"],[12,14,"home","at home"],[14,18,"work","about the church"],
    [18,20,"work","evening prayers"],[20,24,"home","at home"]],
  farmer:[[0,4.5,"home","asleep"],[4.5,8,"work","the morning round"],[8,9,"home","breakfast"],
    [9,13,"work","in the fields"],[13,14,"home","dinner"],[14,18.5,"work","in the fields"],
    [18.5,21,"home","at home"],[21,24,"home","asleep"]],
  worker:[[0,5.5,"home","asleep"],[5.5,6.5,"travel","on the way in"],[6.5,14.5,"work","on shift"],
    [14.5,15.5,"travel","going home"],[15.5,22,"home","at home"],[22,24,"home","asleep"]],
  nightwatch:[[0,6,"work","on watch"],[6,7,"travel","going home"],[7,15,"home","asleep"],
    [15,18,"home","about the house"],[18,19,"travel","on the way in"],[19,24,"work","on watch"]],
  keeper:[[0,7,"home","asleep"],[7,9,"work","about the place"],[9,17,"work","about the place"],
    [17,19,"out","out for a while"],[19,23,"home","at home"],[23,24,"home","asleep"]],
  guest:[[0,8,"work","asleep in their room"],[8,9.5,"work","at breakfast"],[9.5,17,"out","out for the day"],
    [17,19,"out","out for the evening"],[19,23,"work","in their room"],[23,24,"work","asleep in their room"]],
  patient:[[0,24,"work","in the ward"]],
  /* Somnucor: the company that keeps the map of everywhere */
  cartographer:[[0,7,"home","asleep"],[7,8.5,"travel","crossing the plaza"],[8.5,12.5,"work","over the map"],
    [12.5,13.5,"out","out at midday"],[13.5,18,"work","over the map"],[18,19,"travel","going home"],
    [19,23,"home","at home"],[23,24,"home","asleep"]],
  archivist:[[0,6.5,"home","asleep"],[6.5,8,"travel","on the way in"],[8,16,"work","in the archive"],
    [16,17,"travel","going home"],[17,23,"home","at home"],[23,24,"home","asleep"]],
  gatekeeper:[[0,8,"work","watching the gate"],[8,9,"travel","going home"],[9,17,"home","asleep"],
    [17,19,"home","about the house"],[19,20,"travel","on the way in"],[20,24,"work","watching the gate"]],
  engineer:[[0,5.5,"home","asleep"],[5.5,6.5,"travel","on the way in"],[6.5,15,"work","keeping it running"],
    [15,16,"travel","going home"],[16,22.5,"home","at home"],[22.5,24,"home","asleep"]],
  runner:[[0,7,"home","asleep"],[7,9,"work","carrying word"],[9,13,"out","across the city"],
    [13,14,"work","back at the desk"],[14,18,"out","across the city"],[18,19,"work","last of the day"],
    [19,23,"home","at home"],[23,24,"home","asleep"]],
  nightdesk:[[0,7,"work","on the night desk"],[7,8,"travel","going home"],[8,16,"home","asleep"],
    [16,19,"home","about the house"],[19,20,"travel","on the way in"],[20,24,"work","on the night desk"]],
  founder:[[0,4,"work","still in the office"],[4,10,"home","asleep"],[10,13,"work","in the office"],
    [13,14,"out","out at midday"],[14,19,"work","in the office"],[19,21,"out","walking the city"],
    [21,24,"work","in the office"]],
  prisoner:[[0,24,"work","in the cell"]]
};

/* who belongs in what. n is how many, kind is what they look like */
var BELONGS={
  house:[{n:[2,4],kind:"human",role:"resident",lives:true},{n:[0,2],kind:"child",role:"child",lives:true}],
  cottage:[{n:[1,3],kind:"human",role:"resident",lives:true},{n:[0,1],kind:"child",role:"child",lives:true}],
  apartment:[{n:[3,6],kind:"human",role:"resident",lives:true},{n:[0,3],kind:"child",role:"child",lives:true}],
  toadstoolhouse:[{n:[1,2],kind:"fairy",role:"resident",lives:true}],
  hanok:[{n:[2,4],kind:"human",role:"resident",lives:true}],
  izba:[{n:[2,3],kind:"human",role:"resident",lives:true}],
  yurt:[{n:[2,4],kind:"human",role:"resident",lives:true}],
  pueblo:[{n:[3,5],kind:"human",role:"resident",lives:true}],
  hacienda:[{n:[2,4],kind:"human",role:"resident",lives:true},{n:[1,2],kind:"human",role:"worker"}],
  riad:[{n:[2,4],kind:"human",role:"resident",lives:true}],
  roundhouse:[{n:[2,4],kind:"human",role:"resident",lives:true}],
  longhouse:[{n:[3,6],kind:"human",role:"resident",lives:true}],
  stilthouse:[{n:[2,4],kind:"human",role:"resident",lives:true}],
  cycladic:[{n:[2,3],kind:"human",role:"resident",lives:true}],
  machiya:[{n:[2,3],kind:"human",role:"resident",lives:true}],
  shanty:[{n:[1,3],kind:"scavenger",role:"resident",lives:true}],
  castle:[{n:[2,3],kind:"human",role:"keeper"},{n:[2,4],kind:"knight",role:"nightwatch"}],
  shop:[{n:[1,2],kind:"human",role:"shopkeeper"}],
  gasstation:[{n:[1,1],kind:"human",role:"shopkeeper"}],
  school:[{n:[2,4],kind:"human",role:"teacher"},{n:[5,10],kind:"child",role:"child"}],
  somnucortower:[{n:[4,6],kind:"human",role:"cartographer"},{n:[2,3],kind:"human",role:"archivist"},
    {n:[2,3],kind:"human",role:"engineer"},{n:[2,2],kind:"human",role:"gatekeeper"},
    {n:[2,3],kind:"human",role:"runner"},{n:[1,2],kind:"human",role:"nightdesk"},
    {n:[1,1],kind:"android",role:"nightdesk"}],
  hospital:[{n:[2,3],kind:"human",role:"nurse_day"},{n:[1,2],kind:"human",role:"nurse_night"},{n:[2,4],kind:"human",role:"patient"}],
  church:[{n:[1,1],kind:"human",role:"priest"}],
  cathedral:[{n:[2,3],kind:"human",role:"priest"}],
  mosque:[{n:[1,2],kind:"human",role:"priest"}],
  mandir:[{n:[1,2],kind:"human",role:"priest"}],
  stupa:[{n:[1,1],kind:"human",role:"priest"}],
  bank:[{n:[2,3],kind:"human",role:"clerk"}],
  courthouse:[{n:[2,4],kind:"human",role:"clerk"}],
  library:[{n:[1,2],kind:"human",role:"keeper"}],
  station:[{n:[1,2],kind:"human",role:"clerk"}],
  hotel:[{n:[1,2],kind:"human",role:"keeper"},{n:[2,5],kind:"human",role:"guest"}],
  motel:[{n:[1,1],kind:"human",role:"keeper"},{n:[1,3],kind:"human",role:"guest"}],
  institution:[{n:[2,3],kind:"human",role:"keeper"},{n:[3,6],kind:"human",role:"prisoner"}],
  factory:[{n:[3,6],kind:"human",role:"worker"}],
  warehouse:[{n:[2,4],kind:"human",role:"worker"}],
  barn:[{n:[1,2],kind:"human",role:"farmer"},{n:[2,4],kind:"horse",role:"beast"}],
  windmill:[{n:[1,1],kind:"human",role:"worker"}],
  lighthouse:[{n:[1,1],kind:"human",role:"nightwatch"}],
  skyscraper:[{n:[4,8],kind:"human",role:"clerk"}],
  garage:[{n:[1,2],kind:"human",role:"worker"}],
  bunker:[{n:[1,3],kind:"human",role:"nightwatch"}],
  falloutshelter:[{n:[1,3],kind:"scavenger",role:"resident",lives:true}],
  merpalace:[{n:[2,4],kind:"merman",role:"keeper"}],
  icepalace:[{n:[1,3],kind:"frostgiant",role:"keeper"}],
  cloudpalace:[{n:[2,4],kind:"angel",role:"keeper"}],
  faethrone:[{n:[2,4],kind:"fairy",role:"keeper"}],
  volcanolair:[{n:[2,5],kind:"human",role:"worker"}],
  bedouintent:[{n:[2,4],kind:"human",role:"resident",lives:true}],
  igloo:[{n:[1,3],kind:"human",role:"resident",lives:true}],
  hollowtree:[{n:[1,2],kind:"pixie",role:"resident",lives:true}],
  crypt:[{n:[0,1],kind:"ghost",role:"nightwatch"}],
  graveyard:[{n:[0,2],kind:"ghost",role:"nightwatch"}]
};

function countFor(pair,seed){
  var lo=pair[0], hi=pair[1];
  return lo+(Math.abs(hash(seed+"n"))%(hi-lo+1));
}
/* fill a building with the people who belong to it, once */
function housePeople(spec){
  if(!spec||spec.peopled||spec.filler) return 0;
  var plan=BELONGS[spec.archetype]; if(!plan) return 0;
  spec.peopled=true;
  var made=0;
  plan.forEach(function(row,ri){
    var n=countFor(row.n,spec.id+":"+ri);
    for(var i=0;i<n;i++){
      var seed=spec.id+":"+ri+":"+i, a=(hash(seed)%628)/100, r=6+(hash(seed+"r")%9);
      var x=spec.x+Math.cos(a)*r, z=spec.z+Math.sin(a)*r;
      var ps={id:uid(),archetype:row.kind,label:null,attrs:{},x:x,z:z,rot:(hash(seed+"t")%628)/100,
        sign:null,note:null,solid:!!spec.city,detail:spec.city?3:0,addr:spec.addr||null,name:null,named:null,
        filler:!spec.city,city:spec.city||undefined,hub:spec.hub||undefined,belongs:spec.id};
      if(spec.realm) ps.realm=spec.realm;
      var c={id:uid(),archetype:row.kind,name:"someone",aka:[],details:[],sessions:[],awake:false,log:[],
        objId:ps.id,x:x,z:z,primary:false,src:{role:"belongs"},role:row.role,shift:null,
        routine:SHIFT[row.role]||null,home:null,work:null,anchor:{x:x,z:z},born:""};
      if(row.role==="beast") c.routine=null;
      if(row.lives) c.home=spec.id; else c.work=spec.id;
      /* somebody who works here still sleeps somewhere: the nearest home, if there is one */
      if(!c.home){ var h=nearestOf(spec.x,spec.z,RESIDENTIAL); if(h) c.home=h.id; }
      if(!c.work&&row.lives){ var w=nearestOf(spec.x,spec.z,WORKPLACE); if(w) c.work=w.id; }
      ps.charId=c.id;
      store.objects.push(ps); store.characters.push(c);
      if(typeof addMesh==="function"&&typeof scene!=="undefined"&&scene) addMesh(ps);
      made++;
    }
  });
  return made;
}
/* anything already standing that nobody lives in yet */
function peopleEverything(){
  var n=0;
  store.objects.slice().forEach(function(o){ if(!o.filler&&BELONGS[o.archetype]) n+=housePeople(o); });
  return n;
}

