import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// This folder's own isolated demo entry (npm run dev / vite.config.js's
// build) — renders the two-instance harness into #root. The real site
// does NOT load this bundle; it loads the separate embed build (see
// vite.embed.config.js + src/mount.jsx), a classic IIFE script that
// works over file://, unlike this module-based dev/demo build.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
