import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev-only server for the real site (see package.json at this same level
// for why this exists). Serves the actual index.html and every other file
// in this directory exactly as a static server would — Vite only steps in
// to process files that are explicitly loaded as ES modules, which today
// is just react-components/project-detail/src/mount.jsx (loaded instead
// of the production dist-embed/ bundle, but only when the page is served
// from here rather than opened via file:// — see the loader script in
// index.html). Everything else (Tailwind CDN script, sketch-stack,
// styles.css, every image) passes through untouched.
export default defineConfig({
  root: '.',
  plugins: [react()],
});
