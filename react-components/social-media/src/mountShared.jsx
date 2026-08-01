import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Shared by both entry points (mount.jsx for dev, mount.embed.jsx for the
// production build) — mounts a single App instance into #social-media-root
// on the real site's index.html. Same split as
// react-components/project-detail/src/mountShared.jsx, for the same
// reason: dev needs a real ES module so Vite can serve it, prod needs a
// classic IIFE script because file:// pages block type="module" by CORS.
export function mountApp() {
  const el = document.getElementById('social-media-root');
  if (!el || el.dataset.smMounted) return;
  el.dataset.smMounted = 'true';

  ReactDOM.createRoot(el).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export function runWhenReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}
