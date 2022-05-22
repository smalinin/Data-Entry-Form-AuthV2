# Status

## 2022-May-22

CMSB

* Using a locally hosted SPA instance, login and logout against `https://ods-qa.openlinksw.com` works using either the pre-configured IdP button "OpenLink QA Server" or the text input control for an ad-hoc IdP. On successful login, the user icon is displayed and its underlying link shows the authenticated user's WebID.

  * `ods-qa` was patched to include the changes in the VAL VAD repository up to and including commit  `dd44cc 26-Apr-2022`. These changes add the necessary support for DPoP and ECC to VAL's OIDC IdP implementation, as required by the Solid OIDC client [inrupt/solid-client-authn-browser](https://github.com/inrupt/solid-client-authn-js). The installed VAL VAD needs updating to this point. Testing against the other pre-configured OpenLink authorization servers hasn't yet been done; they likewise need updating to this version of VAL. 

  * The CORS settings for VAL's `/token` endpoint need updating. At present, when run using Chrome, the SPA returns error:

    > Access to fetch at 'https://ods-qa.openlinksw.com/OAuth2/token' from origin 'http://127.0.0.1:8080' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
    
  * As a workaround, CORS security in Chrome can be temporarily disabled by starting Chrome using:

  ```
  open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome 
  --args --user-data-dir="/tmp/chrome_dev_test" 
  --disable-web-security http://localhost:8080/data-entry-form.html
  ```
  


