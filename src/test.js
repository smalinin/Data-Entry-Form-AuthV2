function login (idp) {
  console.log('login(): Calling solidClientAuthentication.login():'); 
  console.log('for idp: ' + idp);
  // CMSB: TO DO: 
  // Bolster error handling and logging.
  // What error reporting does solidClientAuthentication.login() support?
  solidClientAuthentication.login({
    oidcIssuer: idp,
    redirectUrl: window.location.href,
    clientName: "OpenLink Data Entry SPA"
  });
}

function initButton(id, action) {
  document.getElementById(id).addEventListener('click', action)
}

function initButtons () {
  initButton('login_opl_uriburner', () => login('https://linkeddata.uriburner.com'))
}


  document.addEventListener('DOMContentLoaded', async () => {
    initButtons();
  })



// Post-login attempt redirect handler.
// When redirected after login, finish the process by retrieving session information.
async function handleRedirectAfterLogin() {
  await solidClientAuthentication.handleIncomingRedirect();

  const session = solidClientAuthentication.getDefaultSession();
  console.log('handleRedirectAfterLogin(): session:', session);
  console.log('handleRedirectAfterLogin(): session.info.isLoggedIn: ', session.info.isLoggedIn);
  if (session.info.isLoggedIn) {
    console.log('handleRedirectAfterLogin(): session.info.webId: ', session.info.webId);
    // Update the page with the login status.
//??    gAppState.updateLoginState();
  }
}

// Processes login information.
// If the function is called when not part of the login redirect, the function is a no-op.
handleRedirectAfterLogin();


