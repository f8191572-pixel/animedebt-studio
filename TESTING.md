# Testing Checklist

## Basic UI

- Open `index.html` through a local server.
- Confirm the navigation links scroll correctly.
- Confirm mobile layout works by resizing the browser.
- Confirm the menu opens and closes on small screens.

## Generator

- Click **Load demo**.
- Confirm project readiness becomes high.
- Click **Generate Full Pack** in Free Prompt Mode.
- Confirm the Result, Prompt, Summary, and JSON tabs work.
- Confirm Copy works.
- Confirm Download works.

## Validation

- Click Clear.
- Try generating with an empty story idea.
- Confirm the story idea field is highlighted.

## Local storage

- Load demo.
- Save project.
- Confirm it appears under Saved Projects.
- Load the saved project.
- Export the project JSON.
- Delete the saved project.
- Import the JSON again.

## Gemini BYOK

- Select Gemini Key Mode.
- Try generating with no key and confirm a helpful error appears.
- Paste a valid Gemini API key.
- Generate a smaller module first, such as Story Debts.
- Confirm the Result tab shows the Gemini output.
- Confirm the API key is not present in saved project JSON.
- Click Clear API key.

## Browser console

- Open DevTools.
- Confirm there are no syntax errors.
- Confirm failed Gemini requests show readable messages in the UI.
