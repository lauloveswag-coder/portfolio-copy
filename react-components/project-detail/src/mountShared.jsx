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
//   data-layers           optional JSON array of single-select swap
//                         entries — [{"id":"...","layerSrc":"...",
//                         "layerAlt":"...","thumbSrc":"...",
//                         "thumbAlt":"..."}, ...]. When present and
//                         non-empty, the item grid becomes clickable
//                         buttons — clicking one shows that image over
//                         the hero, replacing whichever was showing
//                         before (see ProjectDetail.jsx for why this is
//                         single-select, not a multi-layer composite) —
//                         instead of the plain data-accessories gallery.
//
// Image source — pick ONE of:
//   data-auto-folder      a folder path (e.g. "PORTFOLIO ASSESTS/crochet/")
//                         to auto-discover every image in it — first file
//                         (alphabetically) becomes the hero, the rest
//                         become both the plain accessories gallery AND
//                         (unless data-layers is also given) auto-derived
//                         single-select swap entries, one per discovered
//                         photo. Resolved by whichever `resolveAutoFolder`
//                         the calling entry passes in.
//   data-hero-src / -alt
//   + data-accessories    JSON array of {"src": "...", "alt": "..."} —
//                         the original explicit/manual way, still
//                         supported for anything that isn't folder-backed.
//
// data-layers, if present, always wins over the auto-derived layers
// above — use it once you want an explicit, hand-picked set instead of
// "every photo in the folder."
//
// Closing: every window mounted here gets its red traffic light wired as
// a close button, which dispatches a bubbling `project-detail:close`
// CustomEvent from the mount element (detail: { mount }). What "closed"
// actually means is the page's call, not this component's — index.html
// listens for it and returns to the discipline hub. A page that doesn't
// listen simply has a red light that does nothing visible.

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
    let autoLayers = [];
    if (el.dataset.autoFolder) {
      const files = resolveAutoFolder(el.dataset.autoFolder);
      hero = files[0] || null;
      accessories = files.slice(1);
      // One single-select swap entry per discovered photo.
      autoLayers = accessories.map((item, i) => ({
        id: 'auto-' + i,
        layerSrc: item.src,
        layerAlt: item.alt,
        thumbSrc: item.src,
        thumbAlt: item.alt,
      }));
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
      layers: autoLayers,
      onClose: () => {
        el.dispatchEvent(
          new CustomEvent('project-detail:close', {
            bubbles: true,
            detail: { mount: el },
          })
        );
      },
    };
    const swatches = parseJSON(el.dataset.swatches, null);
    if (swatches) props.swatches = swatches;
    // Explicit data-layers (real cutout art) always overrides the
    // auto-derived ones above.
    const explicitLayers = parseJSON(el.dataset.layers, null);
    if (explicitLayers) props.layers = explicitLayers;

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
