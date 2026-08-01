import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Separate build from vite.config.js (which builds the isolated demo app).
// This one produces the bundle the REAL site actually loads: a classic
// (non-module) IIFE script, because `<script type="module">` is blocked
// by CORS when loaded from a file:// page in real Chrome (see
// react-components/project-detail/vite.embed.config.js for the full
// story — same constraint applies here).
//
// React/ReactDOM are bundled IN (not external) since the host page has
// no other copy of React.
export default defineConfig({
  plugins: [react()],
  define: {
    // Vite's app build auto-replaces process.env.NODE_ENV, but lib mode
    // doesn't — without this, React's own bundled code throws
    // "process is not defined" the instant this script runs in a real
    // browser (there's no Node `process` global on a static page).
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'dist-embed',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: 'src/mount.embed.jsx',
      name: 'SocialMediaEmbed',
      formats: ['iife'],
      // Deliberately NOT "social-media.js" — that literal filename gets
      // silently dropped by common ad/tracker content-blocker filter
      // lists (they match generic "social widget" script paths), even
      // over file://. Verified: the exact same file loads fine under
      // this name and 404s/blocks under "social-media.js". Real visitors
      // running uBlock Origin etc. would otherwise see a blank section.
      fileName: () => 'creator-feed.js',
    },
    rollupOptions: {
      output: {
        // Fixed asset name so the real site's <link> doesn't need
        // updating on every rebuild (lib mode's default is generically
        // "style.css"). Same block-list reasoning as fileName above.
        assetFileNames: 'creator-feed.css',
      },
    },
  },
});
