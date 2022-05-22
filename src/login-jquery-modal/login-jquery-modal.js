// --------------------------------------------------------------------------
// Globals

var dialog;
var form;
var customIdp;

// CMSB: At what point is this function called relative to event handler 
// for DOMContentLoaded?
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

    // CMSB: FIX ME
    // customIdp must be a jQuery object (initialized above)
    // var customIdp = document.getElementById('login_custom_idp').value;
    // if (customIdp.endsWith("/"))
    //  customIdp = customIdp.substring(0, customIdp.length - 1)

    valid = valid && checkLength( customIdp, "identity provider URL", 10, 80 );
    valid = valid && checkRegexp( customIdp, /^https?:\/\//, "The identity provider URL must begin with http[s]://" );

    if ( valid ) {
      console.log('customIdpLogin(): About to try login() with ' + customIdp.val());
      console.log('customIdp:', customIdp);
      // CMSB: TO DO: Make sure error handling and error logging is correct.
      //
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
  solidClientAuthentication.login({
    oidcIssuer: idp,
    redirectUrl: window.location.href,
    clientName: "OpenLink Data Entry SPA"
  });
}

// Login Redirect. Call handleIncomingRedirect() function.
// When redirected after login, finish the process by retrieving session information.
async function handleRedirectAfterLogin() {
  await solidClientAuthentication.handleIncomingRedirect();

  const session = solidClientAuthentication.getDefaultSession();
  console.log('handleRedirectAfterLogin(): session:', session);
  if (session.info.isLoggedIn) {
    // Update the page with the login status.
    // TO DO: Fix me
    // document.getElementById("labelStatus").textContent = "Your session is logged in.";
    // document.getElementById("labelStatus").setAttribute("role", "alert");
    // document.getElementById("labelProfile").textContent = "WebID: " + session.info.webId;
    console.log('handleRedirectAfterLogin(): session.info.isLoggedIn: ', session.info.isLoggedIn);
    console.log('handleRedirectAfterLogin(): session.info.webId: ', session.info.webId);
    gAppState.updateLoginState();
  }
}


// Processes login information.
// If the function is called when not part of the login redirect, the function is a no-op.
handleRedirectAfterLogin();


