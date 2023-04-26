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

function logout () {
  console.log('Logging out...')
  solidClientAuthentication.logout();
  window.location.reload();
  hide('logged')
  hide('logout')
}



function initButton(id, action) {
  document.getElementById(id).addEventListener('click', action)
}

function initButtons () {
  initButton('login_opl_uriburner', () => login('https://linkeddata.uriburner.com'))
  initButton('login_opl_netid', () => login('https://netid-qa.openlinksw.com:8443'))
  
  initButton('logout', () => logout())
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
    if (session.info && session.info.isLoggedIn && session.info.webId) {
      show('logged')
      show('logout')
      setField("webid", session.info.webId)
    }

  }
}

// Processes login information.
// If the function is called when not part of the login redirect, the function is a no-op.
handleRedirectAfterLogin();


