# Pratyush Sahu — Portfolio

React + TypeScript portfolio deployed to https://ppsahu.github.io/ with GitHub Actions.

## Development

Requires Node.js 22.12+.

```sh
npm ci
npm run dev
npm run build
```

Project and experience content lives in `src/data.ts`. UI components and interaction state live in `src/main.tsx`; responsive themes and motion are in `src/style.css`. The four themes persist locally. Project details use native modal dialogs, including keyboard navigation and focus restoration. Motion can be paused and respects reduced-motion preferences.

Pushes to `main` type-check, build, and deploy to GitHub Pages automatically. The resume is in `public/resume.pdf`.
