import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
  // Vite's app build auto-replaces process.env.NODE_ENV, but lib mode
  // doesn't — without this, React's own bundled code throws
  // "process is not defined" the instant this script runs in a real
  // browser (there's no Node `process` global on a static page).
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'dist-embed',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: 'src/mount.jsx',
      name: 'ProjectDetailEmbed',
      formats: ['iife'],
      fileName: () => 'project-detail.js',
    },
    rollupOptions: {
      output: {
        // Fixed asset name so the real site's <link> doesn't need updating
        // on every rebuild (lib mode's default is generically "style.css").
        assetFileNames: 'project-detail.css',
      },
    },
  },
});
