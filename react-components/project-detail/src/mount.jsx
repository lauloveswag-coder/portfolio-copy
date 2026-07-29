import React from 'react';
import ReactDOM from 'react-dom/client';
import ProjectDetail from './ProjectDetail.jsx';

// Real-site integration: scans for [data-project-detail] elements and
// mounts a ProjectDetail into each one, reading its props from that
// element's data-* attributes. Lets the real site's index.html configure
// an instance declaratively, no per-page JS required — same spirit as
// this codebase's <sketch-stack data-folder="..."> convention.
//
// Expected attributes:
//   data-title            window title text
//   data-accent           accent color (any valid CSS color)
//   data-hero-src / -alt  the main image
//   data-accessories      JSON array of {"src": "...", "alt": "..."}
//   data-swatches         optional JSON array of color strings
//   data-full-bleed       "true" to fill the parent instead of a fixed
//                         centered card (see .pd-container--fullbleed) —
//                         outer sizing only, doesn't touch the internal
//                         hero + item-grid layout

function parseJSON(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('[project-detail] could not parse JSON attribute:', raw, err);
    return fallback;
  }
}

function mountAll() {
  document.querySelectorAll('[data-project-detail]').forEach((el) => {
    if (el.dataset.pdMounted) return;
    el.dataset.pdMounted = 'true';

    const props = {
      title: el.dataset.title || '',
      accentColor: el.dataset.accent || '#a4b35e',
      hero: { src: el.dataset.heroSrc, alt: el.dataset.heroAlt || '' },
      accessories: parseJSON(el.dataset.accessories, []),
      fullBleed: el.dataset.fullBleed === 'true',
    };
    const swatches = parseJSON(el.dataset.swatches, null);
    if (swatches) props.swatches = swatches;

    ReactDOM.createRoot(el).render(
      <React.StrictMode>
        <ProjectDetail {...props} />
      </React.StrictMode>
    );
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAll);
} else {
  mountAll();
}
