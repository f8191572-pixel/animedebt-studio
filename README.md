# AnimeDebt Studio

AnimeDebt Studio is a zero-budget MVP for turning story ideas into production-ready anime trailer plans.

## Phase 8 status

Updated on: 2026-05-27 16:07

Phase 8 is the deploy-ready polish package.

### Included

- Static website files
- Free Prompt Mode
- Gemini BYOK Mode
- Session-only API key input
- Local project saving
- JSON export/import
- Copy/download outputs
- Demo project
- Project readiness score
- Launch checklist section
- Deployment guide
- Security notes
- Testing checklist
- `.nojekyll` for GitHub Pages
- local server helper scripts

## Files

```txt
index.html
style.css
app.js
prompts.js
gemini.js
storage.js
DEPLOYMENT.md
SECURITY.md
TESTING.md
.nojekyll
local-server.bat
local-server.sh
README.md
```

## How to run locally

Use a local server so JavaScript modules load correctly.

```bash
python -m http.server 8000
```

Then open:

```txt
http://localhost:8000
```

On Windows, you can also double-click `local-server.bat`.

## How to test quickly

1. Click **Load demo**.
2. Click **Generate Full Pack**.
3. Open the **Prompt**, **Summary**, and **JSON** tabs.
4. Click **Save**.
5. Scroll to **Saved Projects**.
6. Test Load, Export, Delete, and Import.

## Gemini BYOK testing

1. Select **Gemini Key Mode**.
2. Paste your Gemini API key.
3. Choose a model.
4. Generate a smaller module first, such as Story Debts.

The key is not saved to localStorage or exported project JSON.

## Production warning

This is a browser-side BYOK prototype. It is useful for testing, but a real public SaaS should move Gemini requests behind a backend/proxy before launch.

Read `SECURITY.md` before publishing publicly.

## Deployment

Read `DEPLOYMENT.md` for GitHub Pages steps.
