// --------------------------------------------------------------------------
// Globals

var dialog;
var form;
var customIdp;

// jQuery initialization after DOM/document is ready.
// See also DOMContentLoaded listener.
$( function() {

    customIdp = $("#login_custom_idp"),
    allFields = $([]).add(customIdp),
    validationHint = $(".tip");

  function updateTip( t ) {
    var originalHint = validationHint.text();
    validationHint
      .text( t )
      .addClass( "ui-state-highlight" );
    setTimeout(function() {
      validationHint.removeClass( "ui-state-highlight");
      validationHint.text(originalHint);
    }, 2000 );
  }

  function checkLength( o, n, min, max ) {
    if ( o.val().length > max || o.val().length < min ) {
      o.addClass( "ui-state-error" );
      updateTip( "The length of the " + n + " must be between " +
        min + " and " + max + " characters" );
      return false;
    } else {
      return true;
    }
  }

  function checkRegexp( o, regexp, n ) {
    if ( !( regexp.test( o.val() ) ) ) {
      o.addClass( "ui-state-error" );
      updateTip( n );
      return false;
    } else {
      return true;
    }
  }

  function customIdpLogin() {
    var valid = true;
    allFields.removeClass( "ui-state-error" );

    var txtCustomIdp = customIdp.val();
    if (txtCustomIdp.endsWith("/")) {
      customIdp.val(txtCustomIdp.substring(0, txtCustomIdp.length - 1));
    }

    valid = valid && checkLength( customIdp, "identity provider URL", 10, 80 );
    valid = valid && checkRegexp( customIdp, /^https?:\/\//, "The identity provider URL must begin with http[s]://" );

    if ( valid ) {
      console.log('customIdpLogin(): About to try login() with ' + customIdp.val());
      login(customIdp.val());
      dialog.dialog( "close" );
    }
    return valid;
  }

  dialog = $( "#dialog-form" ).dialog({
    autoOpen: false,
    height: 500,
    width: 600,
    modal: true,
    buttons: {
      "Login (Custom IdP)": customIdpLogin,
      Cancel: function() {
        dialog.dialog( "close" );
      }
    },
    close: function() {
      form[ 0 ].reset();
      allFields.removeClass( "ui-state-error" );
    }
  });

  form = dialog.find( "form" ).on( "submit", function( event ) {
    event.preventDefault();
    customIdpLogin();
  });

  $( "#loginID" ).button().on( "click", function() {
    dialog.dialog( "open" );
  });
});

/**
 * Gets called when the page loads
 */
document.addEventListener('DOMContentLoaded', () => {
  initButtons()
})

function initButtons () {
  initButton('login_community', () => login('https://solid.community'))
  initButton('login_test_space', () => login('https://solidtest.space'))
  initButton('login_opl_oidc', () => login('https://solid.openlinksw.com:8444'))
  initButton('login_opl_v5', () => login('https://solid.openlinksw.com:8445'))
  initButton('login_opl_ds', () => login('https://ods-qa.openlinksw.com'))
  initButton('login_opl_uriburner', () => login('https://linkeddata.uriburner.com'))
  initButton('login_opl_myopl', () => login('https://id.myopenlink.net'))
  initButton('login_ods_qa', () => login('https://ods-qa.openlinksw.com'))
}

function initButton(id, action) {
  document.getElementById(id).addEventListener('click', action)
}

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
    gAppState.updateLoginState();
  }
}

// Processes login information.
// If the function is called when not part of the login redirect, the function is a no-op.
handleRedirectAfterLogin();


