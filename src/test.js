const client = solidClientAuthentication.default;

function login (idp) {
  console.log('login(): Calling solidClientAuthentication.login():'); 
  console.log('for idp: ' + idp);
  // CMSB: TO DO: 
  // Bolster error handling and logging.
  // What error reporting does solidClientAuthentication.login() support?
  client.login({
    oidcIssuer: idp,
    redirectUrl: window.location.href,
    clientName: "OSDS"
  });
}

function logout () {
  console.log('Logging out...')
  client.logout();
  window.location.reload();
  hide('logged')
  hide('logout')
}



function initButton(id, action) {
  document.getElementById(id).addEventListener('click', action)
}


function checkSession() {
  const session = client.getDefaultSession();
  console.log('handleRedirectAfterLogin(): session:', session);
  console.log('handleRedirectAfterLogin(): session.info.isLoggedIn: ', session.info.isLoggedIn);
  if (session.info.isLoggedIn) {
    console.log('handleRedirectAfterLogin(): session.info.webId: ', session.info.webId);
    // Update the page with the login status.
    if (session.info && session.info.isLoggedIn && session.info.webId) {
      show('logged')
      show('logout')
      setField("webid", session.info.webId)
    }

  }
}



function initButtons () {
//  initButton('login_opl_uriburner', () => login('https://linkeddata.uriburner.com'))
  initButton('login_opl_uriburner', () => login('https://solid.openlinksw.com:8446'))
  initButton('logout', () => logout())

  initButton('test_restore', async () => {
    var v = localStorage.getItem('myCode');
    if (v) {
      var myCode = JSON.parse(v);
      for(var key in myCode) {
        if (key.startsWith('issuerConfig:') || key.startsWith('solidClientAuthenticationUser:') || key.startsWith('oidc.'))
          localStorage.setItem(key, myCode[key]);
      }

      const ret = await client.handleIncomingRedirect({url:myCode.url, restorePreviousSession: true});
      console.log('ret = ', ret);
      if (ret && ret.tokens)
        localStorage.setItem('myTokens', JSON.stringify(ret.tokens));
      checkSession();
    }
    
  })


  initButton('test_restore2', async () => {
    var v = localStorage.getItem('myCode');
    var stokens = localStorage.getItem('myTokens');
    if (v) {
      var myCode = JSON.parse(v);
      for(var key in myCode) {
        if (key.startsWith('issuerConfig:') || key.startsWith('solidClientAuthenticationUser:') || key.startsWith('oidc.'))
          localStorage.setItem(key, myCode[key]);
      }

      var mtokens = stokens ? JSON.parse(stokens) : null;

      const ret = await client.handleIncomingRedirect({url:myCode.url, restorePreviousSession: true, tokens: mtokens});
      console.log('ret = ', ret);
      checkSession();
    }
    
  })

}

function show (id) {
  document.getElementById(id).classList.remove('hidden')
}
function setField (id, value) {
  var field = document.getElementById(id)
  if (field) {
    field.innerHTML = value
  }
}


  document.addEventListener('DOMContentLoaded', async () => {
    initButtons();
  })

  const authCode =
    new URL(window.location.href).searchParams.get("code") ||
    // FIXME: Temporarily handle both auth code and implicit flow.
    // Should be either removed or refactored.
    new URL(window.location.href).searchParams.get("access_token");

  if (authCode) {
    var myCode = {url: location.href}
//    localStorage.setItem('myCode', location.href);  

      for(var i=0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.startsWith('issuerConfig:') || key.startsWith('solidClientAuthenticationUser:') || key.startsWith('oidc.'))
          myCode[key] = localStorage.getItem(key);
      }
    localStorage.setItem('myCode', JSON.stringify(myCode));  
// -- first --
// --- store ---
//
// issuerConfig:*
// solidClientAuthenticationUser:*
// oidc.*
// + callback URL after Login
  }







  
// Post-login attempt redirect handler.
// When redirected after login, finish the process by retrieving session information.
async function handleRedirectAfterLogin() {
  const ret = await client.handleIncomingRedirect({restorePreviousSession: true});
  console.log('ret = ', ret);

  const session = client.getDefaultSession();
  console.log('handleRedirectAfterLogin(): session:', session);
  console.log('handleRedirectAfterLogin(): session.info.isLoggedIn: ', session.info.isLoggedIn);
  if (session.info.isLoggedIn) {
    console.log('handleRedirectAfterLogin(): session.info.webId: ', session.info.webId);
    // Update the page with the login status.
//??    gAppState.updateLoginState();
    if (session.info && session.info.isLoggedIn && session.info.webId) {
      show('logged')
      show('logout')
      setField("webid", session.info.webId)
    }

  }
}

// Processes login information.
// If the function is called when not part of the login redirect, the function is a no-op.
//??handleRedirectAfterLogin();


