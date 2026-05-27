# Deployment Guide

AnimeDebt Studio is currently a static site, so it can be hosted on GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any static file host.

## Local test

From the project folder, run:

```bash
python -m http.server 8000
```

Then open:

```txt
http://localhost:8000
```

## GitHub Pages deployment

1. Create a new GitHub repository.
2. Upload all files from this folder.
3. Make sure `index.html` is in the repository root.
4. Open the repository **Settings** tab.
5. Open **Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select the `main` branch and `/root` folder.
8. Save.
9. Wait for GitHub Pages to publish the site.

## Important BYOK note

The Gemini API key is not saved by this app, but it is still typed into a browser page. This is acceptable for prototype testing, but not ideal for a real public SaaS.

Before a serious public launch, move the Gemini request into a backend/proxy such as Cloudflare Workers, Firebase Functions, Supabase Edge Functions, or a small Node/Express API.
