import React from 'react';
import ReactDOM from 'react-dom/client';
import ProjectDetail from './ProjectDetail.jsx';

// Shared by both entry points (mount.jsx for dev, mount.embed.jsx for the
// production build) — scans for [data-project-detail] elements and mounts
// a ProjectDetail into each one, reading its props from that element's
// data-* attributes. Lets index.html configure an instance declaratively,
// no per-page JS required — same spirit as this codebase's
// <sketch-stack data-folder="..."> convention.
//
// Expected attributes:
//   data-title            window title text
//   data-accent           accent color (any valid CSS color)
//   data-full-bleed       "true" to fill the parent instead of a fixed
//                         centered card (see .pd-container--fullbleed) —
//                         outer sizing only, doesn't touch the internal
//                         hero + item-grid layout
//   data-swatches         optional JSON array of color strings
//
// Image source — pick ONE of:
//   data-auto-folder      a folder path (e.g. "PORTFOLIO ASSESTS/crochet/")
//                         to auto-discover every image in it — first file
//                         (alphabetically) becomes the hero, the rest
//                         become accessories. Resolved by whichever
//                         `resolveAutoFolder` the calling entry passes in.
//   data-hero-src / -alt
//   + data-accessories    JSON array of {"src": "...", "alt": "..."} —
//                         the original explicit/manual way, still
//                         supported for anything that isn't folder-backed.

function parseJSON(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('[project-detail] could not parse JSON attribute:', raw, err);
    return fallback;
  }
}

export function mountAll(resolveAutoFolder) {
  document.querySelectorAll('[data-project-detail]').forEach((el) => {
    if (el.dataset.pdMounted) return;
    el.dataset.pdMounted = 'true';

    let hero;
    let accessories;
    if (el.dataset.autoFolder) {
      const files = resolveAutoFolder(el.dataset.autoFolder);
      hero = files[0] || null;
      accessories = files.slice(1);
    } else {
      hero = { src: el.dataset.heroSrc, alt: el.dataset.heroAlt || '' };
      accessories = parseJSON(el.dataset.accessories, []);
    }

    const props = {
      title: el.dataset.title || '',
      accentColor: el.dataset.accent || '#a4b35e',
      hero,
      accessories,
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

export function runWhenReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}
