(function () {
  const params = new URLSearchParams(window.location.search);
  const pixelId = params.get('pixel');

  if (!pixelId) {
    return;
  }

  !function (w, d, t) {
    w.TiktokAnalyticsObject = t;
    var ttq = w[t] = w[t] || [];

    ttq.methods = [
      "page",
      "track",
      "identify",
      "instances",
      "debug",
      "on",
      "off",
      "once",
      "ready",
      "alias",
      "group",
      "enableCookie",
      "disableCookie"
    ];

    ttq.setAndDefer = function (t, e) {
      t[e] = function () {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };

    for (var i = 0; i < ttq.methods.length; i++) {
      ttq.setAndDefer(ttq, ttq.methods[i]);
    }

    ttq.instance = function (t) {
      var e = ttq._i[t] || [];

      for (var n = 0; n < ttq.methods.length; n++) {
        ttq.setAndDefer(e, ttq.methods[n]);
      }

      return e;
    };

    ttq.load = function (e, n) {
      var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
      var i = "?sdkid=" + e + "&lib=" + t;

      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = r;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date;
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};

      var o = d.createElement("script");
      o.type = "text/javascript";
      o.async = true;
      o.src = r + i;

      var a = d.getElementsByTagName("script")[0];
      a.parentNode.insertBefore(o, a);
    };

    ttq.load(pixelId);
    ttq.page();
  }(window, document, 'ttq');

  let leadTracked = false;

  window.rawGravityTrackTikTokLead = function () {
    if (leadTracked) {
      return;
    }

    leadTracked = true;

    if (window.ttq) {
      window.ttq.track('SubmitForm');
      window.ttq.track('Contact');
    }
  };
})();