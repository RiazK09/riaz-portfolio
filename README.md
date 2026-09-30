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

## Media
The Canva media export has been mapped and optimized for web use.

Expected files under `/assets`:

- `hero-portrait.jpg`
- `about-portrait.jpg`
- `why-portrait.jpg`
- `portrait-alt.jpg`
- `workspace.jpg` — optional replacement visual
- `project-cloud-faction.jpg`
- `project-cloud-faction.mp4`
- `project-little-lanterns.jpg`
- `project-little-lanterns.mp4`
- `project-the-ghetto.jpg`
- `project-the-ghetto.mp4`
- `project-wedding.jpg`
- `project-wedding.mp4`
- `project-zaakirah.jpg`
- `project-zaakirah.mp4`

Project images act as poster/fallback images. When a matching MP4 is present, the site automatically plays the project recording silently, on loop, like the Canva showcase.

## Main files
- `index.html` — portfolio content/sections
- `styles.css` — all layout, typography and responsive styling
- `script.js` — navigation, progress indicator, local asset loading and project video enhancement

## Updating
This repository is intentionally simple so ChatGPT/GitHub edits can be made directly without a build pipeline.