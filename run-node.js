/* Runs the regression suite with no browser: node tests/run-node.js
   The GitHub check runs exactly this on every push. */
var fs=require("fs"), path=require("path"), vm=require("vm");
var root=path.join(__dirname,"..");
var realTimeout=setTimeout;

global.require=require;
vm.runInThisContext(fs.readFileSync(path.join(__dirname,"stub.js"),"utf8"),{filename:"stub.js"});
global.setTimeout=realTimeout;                      // the stub stills timers; tests need real ones
global.window.DW_TEST=true;
global.window.__node=true;
global.location={search:"?test=1"};

var html=fs.readFileSync(path.join(root,"index.html"),"utf8");
var files=[], re=/<script src="((?:data|js)\/[^"]+)"><\/script>/g, m;
while((m=re.exec(html))) files.push(m[1]);
files.forEach(function(f){ vm.runInThisContext(fs.readFileSync(path.join(root,f),"utf8"),{filename:f}); });
["harness.js","cases.js"].forEach(function(f){
  vm.runInThisContext(fs.readFileSync(path.join(__dirname,f),"utf8"),{filename:"tests/"+f});
});

T.run(function(results){
  var failed=results.filter(function(r){ return !r.pass; });
  results.forEach(function(r){
    console.log((r.pass?"  pass  ":"  FAIL  ")+r.name+(r.pass?"":"\n          "+r.err));
  });
  console.log("\n"+(results.length-failed.length)+" of "+results.length+" passed");
  process.exit(failed.length?1:0);
});
