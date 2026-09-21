/* The smallest possible test runner. Works in Node and in the browser. */
var T=(function(){
  var cases=[];
  function test(name,fn){ cases.push({name:name,fn:fn}); }
  function ok(v,msg){ if(!v) throw new Error(msg||"expected true"); }
  function eq(a,b,msg){ if(a!==b) throw new Error((msg?msg+": ":"")+"expected "+JSON.stringify(b)+", got "+JSON.stringify(a)); }
  function near(a,b,tol,msg){ if(Math.abs(a-b)>tol) throw new Error((msg?msg+": ":"")+"expected about "+b+", got "+a); }

  /* each case starts from an empty dreamscape at a fixed hour */
  function fresh(){
    if(typeof clearScene==="function") clearScene();
    store=blank(); store.blocks={};
    committed=""; draftScanned=0; viewNight=null; scrubOffset=12;
  }
  function run(report){
    var results=[], i=0;
    function next(){
      if(i>=cases.length){ report(results); return; }
      var c=cases[i++], t0=Date.now();
      fresh();
      var done=function(err){ results.push({name:c.name,pass:!err,err:err?String(err.message||err):"",ms:Date.now()-t0}); next(); };
      try{
        var r=c.fn();
        if(r&&typeof r.then==="function") r.then(function(){ done(); },done);
        else done();
      }catch(e){ done(e); }
    }
    next();
  }
  return {test:test,ok:ok,eq:eq,near:near,run:run,fresh:fresh};
})();
if(typeof module!=="undefined") module.exports=T;
