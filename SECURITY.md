# Security Notes

## Current prototype behavior

AnimeDebt Studio Phase 8 uses a Bring Your Own Key model. The user pastes a Gemini API key into the browser.

The app currently:

- does not hardcode an API key
- does not save the API key to localStorage
- does not include the API key in exported project JSON
- includes a clear-key button
- sends the key directly to the Gemini API only when the user chooses Gemini Key Mode

## What this does not protect against

Browser-side API keys can still be exposed to the page runtime, extensions, copied files, browser dev tools, or modified versions of the app.

This means the current setup is fine for personal testing, but not ideal for a public SaaS.

## Production recommendation

For public release, use a backend/proxy:

1. The user sends the prompt to your backend.
2. Your backend calls Gemini.
3. The browser never directly handles your platform key.
4. Add rate limits, abuse protection, and logging that excludes secrets.

If you continue with user-owned keys, consider OAuth or provider-supported secure authorization flows when available.

## Never commit secrets

Do not put real API keys in:

- `index.html`
- `app.js`
- `gemini.js`
- GitHub commits
- screenshots
- exported JSON files
