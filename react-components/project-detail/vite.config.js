import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standalone build for this one component — deliberately not wired into
// the main site's own (build-free) index.html yet. `npm run build` here
// outputs a self-contained dist/ bundle that can be dropped in later.
export default defineConfig({
  root: '.',
  base: './',
  plugins: [react()],
});
