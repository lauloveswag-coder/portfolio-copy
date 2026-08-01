import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This same build is loaded in two places:
//  - this folder's own index.html (the isolated demo, mounts into #root)
//  - the real site's index.html, which loads dist-embed/social-media.js
//    directly (see vite.embed.config.js + src/mount.embed.jsx) and mounts
//    into #social-media-root. Fixed (non-hashed) output filenames so the
//    real site's <script>/<link> tags don't need updating on every rebuild.
export default defineConfig({
  root: '.',
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/social-media.js',
        chunkFileNames: 'assets/social-media-[name].js',
        assetFileNames: 'assets/social-media[extname]',
      },
    },
  },
});
