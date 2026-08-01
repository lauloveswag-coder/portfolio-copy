import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// This folder's own isolated demo entry (npm run dev / vite.config.js).
// The real site does NOT load this bundle; it loads the separate embed
// build (see vite.embed.config.js + src/mount.embed.jsx), a classic
// IIFE script that works over file://, unlike this module-based build.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
