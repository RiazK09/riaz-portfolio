# Riaz Karolia Portfolio

A dependency-free static portfolio site rebuilt from the Canva portfolio structure.

## Run locally
Open `index.html` in a browser, or run a small local server:

```bash
python -m http.server 8080
```

Then visit http://localhost:8080

## Deploy to existing hosting
Upload the contents of this repository to the document root used by `portfolio.riazkarolia.co.za`.
No build command, Node.js, database or WordPress installation is required.

## Media to add
Export/download the original Canva media and save it under `/assets` with these filenames:

- `hero-portrait.jpg`
- `about-portrait.jpg`
- `why-portrait.jpg`
- `workspace.jpg`
- `project-cloud-faction.jpg`
- `project-little-lanterns.jpg`
- `project-the-ghetto.jpg`
- `project-wedding.jpg`
- `project-zaakirah.jpg`

The website detects each image automatically. Until an asset is present, an intentional styled placeholder is shown.

## Main files
- `index.html` — portfolio content/sections
- `styles.css` — all layout, typography and responsive styling
- `script.js` — navigation, progress indicator and local asset loading

## Updating
This repository is intentionally simple so ChatGPT/GitHub edits can be made directly without a build pipeline.