# Data-Entry-Form-AuthV2

A variant of [OpenLinkSoftware/single-page-apps](https://github.com/OpenLinkSoftware/single-page-apps) which, rather using than [OpenLinkSoftware/oidc-web](https://github.com/OpenLinkSoftware/oidc-web), uses the newer authentication library [inrupt/solid-client-authn-browser](https://github.com/inrupt/solid-client-authn-js).

See also:

* branch `develop`
* [solid-client-authn-browser API](https://docs.inrupt.com/developer-tools/api/javascript/solid-client-authn-browser/)

## Demo instance

<https://openlinksoftware.github.io/Data-Entry-Form-AuthV2>

## Background

This variant of [OpenLinkSoftware/single-page-apps](https://github.com/OpenLinkSoftware/single-page-apps) was motivated by a need to support the latest version of Solid's authentication client (solid-client-authn-browser) which in turn uses and exercises VAL's support for DPoP and ECDSA within its OIDC Authorization Server (IdP) implementation.

For more background, see: [OPL Community Forum: OpenLink SPAs: Supporting DPoP and PKCE](https://community.openlinksw.com/t/openlink-spas-supporting-dpop-and-pkce/2853/)

This SPA variant also does away with the login popup window used by [OpenLinkSoftware/single-page-apps](https://github.com/OpenLinkSoftware/single-page-apps). The design of [solid-client-authn-browser](https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/authenticate-browser/) is such that, by default, refreshing the current page logs out the user. This has implications for the existing SPA's use of a login popup, in that the session established by the login popup will be immediately destroyed when the popup window is closed and the user returned to the main page. For this reason, the new SPA uses a JQuery modal dialog for login rather than a separate popup window rooted to a different URL.