export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { email, landing, source, creative } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Valid email is required'
      });
    }

	const cleanEmail = email.trim();
	const cleanLanding = String(landing || 'w502').trim();
	const cleanSource = String(source || 'direct').trim();
	const cleanCreative = String(creative || 'unknown').trim();

    const apiKey = process.env.KLAVIYO_API_KEY;

    if (!apiKey) {
      console.error('Missing KLAVIYO_API_KEY');

      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    const headers = {
      'Authorization': `Klaviyo-API-Key ${apiKey}`,
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
      'revision': '2026-07-15'
    };

    /*
     * STEP 1
     * Create or update Klaviyo profile.
     */
    const profileResponse = await fetch(
      'https://a.klaviyo.com/api/profile-import/',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          data: {
            type: 'profile',
            attributes: {
              email: cleanEmail,
              properties: {
				landing: cleanLanding,
                source: cleanSource,
                creative: cleanCreative
              }
            }
          }
        })
      }
    );

    const profileText = await profileResponse.text();

    if (!profileResponse.ok) {
      console.error(
        'Klaviyo profile error:',
        profileResponse.status,
        profileText
      );

      return res.status(502).json({
        success: false,
        error: 'Klaviyo profile update failed'
      });
    }

    /*
     * STEP 2
     * Subscribe profile to the W502 Klaviyo list.
     */
    const subscribeResponse = await fetch(
      'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          data: {
            type: 'profile-subscription-bulk-create-job',
            attributes: {
              profiles: {
                data: [
                  {
                    type: 'profile',
                    attributes: {
                      email: cleanEmail,
                      subscriptions: {
                        email: {
                          marketing: {
                            consent: 'SUBSCRIBED'
                          }
                        }
                      }
                    }
                  }
                ]
              }
            },
            relationships: {
              list: {
                data: {
                  type: 'list',
                  id: 'RiQaUD'
                }
              }
            }
          }
        })
      }
    );

    const subscribeText = await subscribeResponse.text();

    if (!subscribeResponse.ok) {
      console.error(
        'Klaviyo subscription error:',
        subscribeResponse.status,
        subscribeText
      );

      return res.status(502).json({
        success: false,
        error: 'Klaviyo subscription failed'
      });
    }

    /*
     * STEP 3
     * Amazon attribution by source.
     */
    const amazonUrls = {
      tiktok:
        'https://www.amazon.com/dp/B0GTWB11LW?maas=maas_adg_2A88665EB9ECA432C54E7A806AF52010_afap_abs&ref_=aa_maas&tag=maas',

      meta:
        'https://www.amazon.com/dp/B0GTWB11LW?maas=maas_adg_8834E9BB8D74B433FF189A3983F9C467_afap_abs&ref_=aa_maas&tag=maas',
    };

    const normalizedSource = cleanSource.toLowerCase();

    const amazonUrl =
      amazonUrls[normalizedSource] ||
      amazonUrls.meta;

    return res.status(200).json({
      success: true,
      amazonUrl
    });

  } catch (error) {
    console.error('Vercel API error:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}