(function () {
  var MAIN_APP_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://groundedglow.cc';

  var TOKEN_KEY = 'light_blog_token';
  var USER_KEY = 'light_blog_user';

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
  }

  // On standalone load (not iframe), sync cookie → localStorage
  if (window.parent === window) {
    var cookieToken = getCookie(TOKEN_KEY);
    var cookieUser = getCookie(USER_KEY);
    if (cookieToken && !localStorage.getItem(TOKEN_KEY)) {
      localStorage.setItem(TOKEN_KEY, cookieToken);
      if (cookieUser) {
        localStorage.setItem(USER_KEY, cookieUser);
      }
    }
  }

  // Receive auth from parent (iframe mode)
  window.addEventListener('message', function (e) {
    if (e.origin !== MAIN_APP_URL) return;
    if (e.data && e.data.type === 'AUTH_SYNC') {
      var wasLoggedIn = Boolean(localStorage.getItem(TOKEN_KEY));
      if (e.data.token) {
        localStorage.setItem(TOKEN_KEY, e.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(e.data.user));
        if (!wasLoggedIn) {
          window.dispatchEvent(new CustomEvent('japaflow:auth-changed', { detail: { loggedIn: true } }));
        }
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.dispatchEvent(new CustomEvent('japaflow:auth-changed', { detail: { loggedIn: false } }));
      }
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'AUTH_ACK' }, MAIN_APP_URL);
      }
    }
  });

  // Sync route changes to parent (iframe mode)
  if (window.parent !== window) {
    function notifyRoute() {
      window.parent.postMessage(
        { type: 'ROUTE_CHANGE', path: window.location.pathname + window.location.search + window.location.hash },
        MAIN_APP_URL
      );
    }

    var origPushState = history.pushState;
    var origReplaceState = history.replaceState;
    history.pushState = function () {
      origPushState.apply(this, arguments);
      notifyRoute();
    };
    history.replaceState = function () {
      origReplaceState.apply(this, arguments);
      notifyRoute();
    };
    window.addEventListener('popstate', notifyRoute);
  }

  // Tell parent we're ready to receive auth
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'AUTH_READY' }, MAIN_APP_URL);
  }

  // Notify parent or redirect on auth expiry
  window.japaflowAuthExpired = function () {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'AUTH_EXPIRED' }, MAIN_APP_URL);
      return;
    }
    window.location.href = MAIN_APP_URL + '/login?redirect=' + encodeURIComponent(window.location.href);
  };
})();
