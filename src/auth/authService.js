import auth0 from 'auth0-js';
import EventEmitter from 'events';

const localStorageKey = 'loggedIn';
const loginEvent = 'loginEvent';

class AuthService extends EventEmitter {
  idToken = null;

  profile = null;

  tokenExpiry = null;

  webAuth = new auth0.WebAuth({
    domain: process.env.VUE_APP_AUTH0_DOMAIN,
    redirectUri: `${window.location.origin}/callback`,
    clientID: process.env.VUE_APP_AUTH0_CLIENTID,
    responseType: 'id_token',
    scope: 'openid profile email',
  });

  login(customState) {
    this.webAuth.authorize({
      appState: customState,
    });
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.webAuth.parseHash((err, authResult) => {
        if (err) {
          reject(err);
        } else {
          localStorage.setItem('access-token', authResult.idToken);
          this.localLogin(authResult);
          resolve();
        }
      });
    });
  }

  localLogin(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    this.tokenExpiry = new Date(this.profile.exp * 1000);
    localStorage.setItem(localStorageKey, 'true');
    this.emit(loginEvent, {
      loggedIn: true,
      profile: authResult.idTokenPayload,
      state: authResult.appState || {},
    });
  }

  logOut() {
    localStorage.removeItem(localStorageKey);
    localStorage.removeItem('access-token');

    this.idToken = null;
    this.tokenExpiry = null;
    this.profile = null;

    this.webAuth.logout({
      returnTo: window.location.origin,
    });

    this.emit(loginEvent, { loggedIn: false });
  }

  isAuthenticated() {
    return (
      Date.now() < this.tokenExpiry
      && localStorage.getItem(localStorageKey) === 'true'
    );
  }
}

export default new AuthService();
