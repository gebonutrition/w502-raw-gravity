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
	  'influencer',
	  'email'
	];

	const urlSource = new URLSearchParams(window.location.search)
	  .get('source')
	  ?.trim()
	  .toLowerCase();

	if (urlSource && allowedSources.includes(urlSource)) {
	  sessionStorage.setItem(SOURCE_KEY, urlSource);
	}

	const source = sessionStorage.getItem(SOURCE_KEY) || 'direct';

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
		  source
		})
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error('Subscribe failed:', data);
        throw new Error(data.error || 'Subscription failed');
      }

      formState.style.display = 'none';
      successState.style.display = 'block';
	  
	  setTimeout(() => {
	  window.location.href = 'https://amazon.com';
	}, 1500);

    } catch (error) {
      console.error('Form submission error:', error);

      submitButton.disabled = false;
      submitButton.textContent = 'Get my 25% code →';

      alert('Something went wrong. Please try again.');
    }
  });
})();