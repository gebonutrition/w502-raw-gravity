(() => {
  const form = document.getElementById('lead-form');
  const emailInput = document.getElementById('email-input');
  const submitButton = document.getElementById('email-submit');

  const formState = document.getElementById('email-form-state');
  const successState = document.getElementById('success-state');

  const SOURCE_KEY = 'rawGravityLeadSource';

  const allowedSources = [
    'instagram',
    'tiktok',
    'facebook',
    'meta',
    'influencer',
    'email'
  ];

  const urlParams = new URLSearchParams(window.location.search);

  const urlSource = urlParams.get('source')
    ?.trim()
    .toLowerCase();

  const creative =
    urlParams.get('creative')?.trim() || 'unknown';

  if (urlSource && allowedSources.includes(urlSource)) {
    sessionStorage.setItem(SOURCE_KEY, urlSource);
  }

  const source =
    sessionStorage.getItem(SOURCE_KEY) || 'direct';

  const normalizedSource = source.toLowerCase();

  const AMAZON_URLS = {
    tiktok:
      'https://www.amazon.com/dp/B0GTWB11LW?maas=maas_adg_9EAB36473ED1EB5F2AC4DBD00BF649CE_afap_abs&ref_=aa_maas&tag=maas',

    facebook:
      'https://www.amazon.com/dp/B0GTWB11LW?maas=maas_adg_B05D582BAB7E5BC8F40DEBA1EBC61AEE_afap_abs&ref_=aa_maas&tag=maas',

    meta:
      'https://www.amazon.com/dp/B0GTWB11LW?maas=maas_adg_B05D582BAB7E5BC8F40DEBA1EBC61AEE_afap_abs&ref_=aa_maas&tag=maas',

    klavio:
      'https://www.amazon.com/dp/B0GTWB11LW?maas=maas_adg_25B95FF8BD805EF1A9DF6465C32333F9_afap_abs&ref_=aa_maas&tag=maas',

    klaviyo:
      'https://www.amazon.com/dp/B0GTWB11LW?maas=maas_adg_25B95FF8BD805EF1A9DF6465C32333F9_afap_abs&ref_=aa_maas&tag=maas',

    instagram:
      'https://www.amazon.com/dp/B0GTWB11LW?maas=maas_adg_DA3922AD16009007A17A120E9C2F3E79_afap_abs&ref_=aa_maas&tag=maas',

    influencer:
      'https://www.amazon.com/dp/B0GTWB11LW?maas=maas_adg_B05D582BAB7E5BC8F40DEBA1EBC61AEE_afap_abs&ref_=aa_maas&tag=maas',

    email:
      'https://www.amazon.com/dp/B0GTWB11LW?maas=maas_adg_25B95FF8BD805EF1A9DF6465C32333F9_afap_abs&ref_=aa_maas&tag=maas'
  };

  const DEFAULT_AMAZON_URL = AMAZON_URLS.meta;

  if (!form || !emailInput || !submitButton || !formState || !successState) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      emailInput.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          source,
          creative
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        console.error('Subscribe failed:', data);
        throw new Error(data.error || 'Subscription failed');
      }

      formState.style.display = 'none';
      successState.style.display = 'block';

      window.rawGravityTrackTikTokLead();
      window.rawGravityTrackMetaLead();

      setTimeout(() => {
        window.location.href =
          AMAZON_URLS[normalizedSource] ||
          data.amazonUrl ||
          DEFAULT_AMAZON_URL;
      }, 1500);

    } catch (error) {
      console.error('Form submission error:', error);

      submitButton.disabled = false;
      submitButton.textContent = 'Get my 25% code →';

      alert('Something went wrong. Please try again.');
    }
  });
})();