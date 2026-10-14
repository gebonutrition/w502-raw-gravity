(function () {
  const params = new URLSearchParams(window.location.search);
  const requestedFbPixelId = params.get('fbpixel');

  // Always initialize the main Raw Gravity Meta Pixel.
  // Allow an additional campaign-specific pixel through the URL.
  const fbPixelIds = [
    ...new Set([
      '1632582321547641',
      requestedFbPixelId
    ].filter(Boolean))
  ];

  !function(f,b,e,v,n,t,s)
  {
    if(f.fbq)return;

    n=f.fbq=function(){
      n.callMethod ?
        n.callMethod.apply(n,arguments) :
        n.queue.push(arguments)
    };

    if(!f._fbq)f._fbq=n;

    n.push=n;
    n.loaded=!0;
    n.version='2.0';
    n.queue=[];

    t=b.createElement(e);
    t.async=!0;
    t.src=v;

    s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s);
  }(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  );

  fbPixelIds.forEach((id) => window.fbq('init', id));

  window.fbq('track', 'PageView');

  let leadTracked = false;

  window.rawGravityTrackMetaLead = function () {
    if (leadTracked) {
      return;
    }

    leadTracked = true;

    if (window.fbq) {
      window.fbq('track', 'Lead');
      window.fbq('track', 'Contact');
    }
  };
})();