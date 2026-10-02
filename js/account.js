/* SomnuMatrix — account.js
   signing in. an account records who you are and what you have bought, and
   nothing else: your dreams stay on this device, and nobody at the Temple can
   read them. signing in is optional, and the Atlas works fully without it.
   loaded as a plain script; shares scope with the other files */
"use strict";

var SESSKEY="dreamwalker.session", session=null;

function authUrl(path){ return DW_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/auth/v1/"+path; }
function authHeaders(tok){
  var h={"Content-Type":"application/json",apikey:DW_CONFIG.supabaseKey||""};
  if(tok) h.Authorization="Bearer "+tok;
  return h;
}
function loadSession(){
  try{ session=JSON.parse(localStorage.getItem(SESSKEY)||"null"); }catch(e){ session=null; }
  return session;
}
function keepSession(s){
  session=s;
  try{ s?localStorage.setItem(SESSKEY,JSON.stringify(s)):localStorage.removeItem(SESSKEY); }catch(e){}
  showAccount();
}
function signedIn(){ return !!(session&&session.access_token); }
function myEmail(){ return session&&session.user?session.user.email:""; }

function authPost(path,body,tok){
  return fetch(authUrl(path),{method:"POST",headers:authHeaders(tok),body:JSON.stringify(body||{})})
    .then(function(r){ return r.json().then(function(j){ return r.ok?j:Promise.reject(j); }); });
}
/* the token lasts an hour; this quietly gets another when it's old */
function freshToken(){
  if(!signedIn()) return Promise.resolve(null);
  var age=Date.now()-(session.at||0);
  if(age<45*60*1000) return Promise.resolve(session.access_token);
  return authPost("token?grant_type=refresh_token",{refresh_token:session.refresh_token})
    .then(function(j){ keepSession({access_token:j.access_token,refresh_token:j.refresh_token,user:j.user,at:Date.now()}); return j.access_token; })
    .catch(function(){ keepSession(null); return null; });
}

function accountMsg(t,bad){
  var e=document.getElementById("acc-msg"); if(!e) return;
  e.textContent=t||""; e.style.color=bad?"#C0603A":"var(--dim)";
}
function createAccount(){
  var em=(document.getElementById("acc-email").value||"").trim(), pw=document.getElementById("acc-pass").value||"";
  if(!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(em)) return accountMsg("That doesn't look like an email address.",true);
  if(pw.length<8) return accountMsg("Use at least eight characters for the password.",true);
  accountMsg("Making your account\u2026");
  authPost("signup",{email:em,password:pw}).then(function(j){
    if(j.access_token){ keepSession({access_token:j.access_token,refresh_token:j.refresh_token,user:j.user,at:Date.now()});
      accountMsg("You have an account, and you are signed in."); }
    else accountMsg("Account made. Check your email to confirm it, then sign in.");
  }).catch(function(e){ accountMsg(authWords(e),true); });
}
function signIn(){
  var em=(document.getElementById("acc-email").value||"").trim(), pw=document.getElementById("acc-pass").value||"";
  if(!em||!pw) return accountMsg("Your email and password, please.",true);
  accountMsg("Signing in\u2026");
  authPost("token?grant_type=password",{email:em,password:pw}).then(function(j){
    keepSession({access_token:j.access_token,refresh_token:j.refresh_token,user:j.user,at:Date.now()});
    accountMsg("Signed in.");
    document.getElementById("acc-pass").value="";
  }).catch(function(e){ accountMsg(authWords(e),true); });
}
function signOut(){
  if(typeof vaultKey!=="undefined") vaultKey=null;     /* the key never outlives the sitting */
  var tok=session&&session.access_token;
  keepSession(null); accountMsg("Signed out. Everything you have dreamt stays on this device.");
  if(tok) authPost("logout",{},tok).catch(function(){});
}
function resetPassword(){
  var em=(document.getElementById("acc-email").value||"").trim();
  if(!em) return accountMsg("Put your email in first.",true);
  authPost("recover",{email:em}).then(function(){ accountMsg("If that address has an account, a letter is on its way."); })
    .catch(function(e){ accountMsg(authWords(e),true); });
}
/* supabase's own wording, said plainly */
function authWords(e){
  var m=(e&&(e.msg||e.message||e.error_description||e.error))||"That didn't work.";
  if(/already registered|already exists/i.test(m)) return "There is already an account with that email. Try signing in.";
  if(/invalid login/i.test(m)) return "That email and password don't match.";
  if(/email not confirmed/i.test(m)) return "Confirm your email first \u2014 check for the letter.";
  if(/password/i.test(m)&&/short|least/i.test(m)) return "Use a longer password.";
  return m;
}

function showAccount(){
  if(typeof syncStatus==="function") setTimeout(syncStatus,0);
  if(typeof refreshStanding==="function") setTimeout(function(){ refreshStanding(); loadOffice(); },50);
  /* who you are to the tower and its desk: a keeper walks past a closed tower
     and a sealed penthouse; asked once at sign-in, again whenever the desk opens */
  if(typeof checkKeeper==="function") setTimeout(function(){ if(signedIn()) checkKeeper(); else deskStanding=null; },200);
  var out=document.getElementById("acc-out"), inn=document.getElementById("acc-in");
  if(!out||!inn) return;
  var on=signedIn();
  out.style.display=on?"none":"block";
  inn.style.display=on?"block":"none";
  var who=document.getElementById("acc-who");
  if(who&&on) who.textContent=myEmail()||"signed in";
}
function initAccount(){
  loadSession(); showAccount();
  var b;
  if((b=document.getElementById("acc-signin"))) b.onclick=signIn;
  if((b=document.getElementById("acc-create"))) b.onclick=createAccount;
  if((b=document.getElementById("acc-forgot"))) b.onclick=resetPassword;
  if((b=document.getElementById("acc-signout"))) b.onclick=signOut;
  if(signedIn()) freshToken();
}

