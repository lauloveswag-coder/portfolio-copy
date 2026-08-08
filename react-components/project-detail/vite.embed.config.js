import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

// Same supported-extensions set as components/sketch-stack/generate-
// manifest.py, for consistency across the site's two auto-discovery
// mechanisms.
const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const AUTO_FOLDERS = ['assets/projects/crochet/', 'assets/projects/sewing/'];

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '../..');

// Computed with plain Node fs, at build time, in this Node-side config
// file — never touches Vite's browser-bundled asset pipeline, which is
// what forces base64-inlining in library/IIFE mode (see mount.embed.jsx
// for the full story). Injected into the bundle via `define` below as a
// plain JSON object; new photos need a rebuild to be picked up (same as
// any static build), but nothing needs hand-editing — this scan replaces
// what used to be a manually maintained data-accessories list.
function scanAutoFolders() {
  const result = {};
  for (const folder of AUTO_FOLDERS) {
    const abs = path.join(projectRoot, folder);
    const files = fs.existsSync(abs)
      ? fs
          .readdirSync(abs)
          .filter((f) => !f.startsWith('.') && SUPPORTED_EXTENSIONS.has(path.extname(f).toLowerCase()))
          .sort()
      : [];
    result[folder] = files;
  }
  return result;
}

// Separate build from vite.config.js (which builds the isolated demo app).
// This one produces the bundle the REAL site actually loads: a classic
// (non-module) IIFE script, because `<script type="module">` is blocked
// by CORS when loaded from a file:// page in real Chrome (it only ever
// worked in the dev tool's preview browser, which doesn't enforce that
// restriction the same way — that mismatch was the actual bug). A plain
// `<script src="...">` has no such restriction and works over file://.
//
// React/ReactDOM are bundled IN (not external) since the host page has
// no other copy of React — that's the ~140KB of this bundle.
export default defineConfig({
  plugins: [react()],
  define: {
    // Vite's app build auto-replaces process.env.NODE_ENV, but lib mode
    // doesn't — without this, React's own bundled code throws
    // "process is not defined" the instant this script runs in a real
    // browser (there's no Node `process` global on a static page).
    'process.env.NODE_ENV': JSON.stringify('production'),
    __PD_AUTO_FILES__: JSON.stringify(scanAutoFolders()),
  },
  build: {
    outDir: 'dist-embed',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: 'src/mount.embed.jsx',
      name: 'ProjectDetailEmbed',
      formats: ['iife'],
      fileName: () => 'project-detail.js',
    },
    rollupOptions: {
      output: {
        // Fixed asset name so the real site's <link> doesn't need
        // updating on every rebuild (lib mode's default is generically
        // "style.css"). Safe to leave this simple again now that no
        // photos go through the asset pipeline in this build at all.
        assetFileNames: 'project-detail.css',
      },
    },
  },
});
