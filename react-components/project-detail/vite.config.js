import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This same build is loaded in two places:
//  - this folder's own index.html (the isolated demo, mounts into #root)
//  - the real site's index.html, which loads dist/assets/project-detail.js
//    directly and it mounts into any [data-project-detail] element it finds
//    (see src/mount.js). Fixed (non-hashed) output filenames so the real
//    site's <script>/<link> tags don't need updating on every rebuild.
export default defineConfig({
  root: '.',
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/project-detail.js',
        chunkFileNames: 'assets/project-detail-[name].js',
        assetFileNames: 'assets/project-detail[extname]',
      },
    },
  },
});
