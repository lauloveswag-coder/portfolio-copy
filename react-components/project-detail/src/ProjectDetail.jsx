import { useState } from 'react';
import './ProjectDetail.css';

// Decorative-only tool icons — no icon asset files exist for this yet, so
// these are minimal inline SVGs rather than broken <img> references.
const TOOL_ICONS = {
  pen: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 20l1-4.5L15.5 5l3.5 3.5L8.5 19 4 20z" strokeLinejoin="round" />
    </svg>
  ),
  eraser: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M18 13l-7 7H7l-3-3a2 2 0 010-2.8l9-9 6.8 6.8-1.8 1z" strokeLinejoin="round" />
    </svg>
  ),
  text: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 6h14M12 6v12" strokeLinecap="round" />
    </svg>
  ),
  shape: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="4" width="10" height="10" rx="2" />
      <circle cx="16.5" cy="16.5" r="4.5" />
    </svg>
  ),
};

const TOOL_ORDER = ['pen', 'eraser', 'text', 'shape'];

const DEFAULT_SWATCHES = ['#000000', '#E84545', '#3E5C76', '#FFFFFF'];

/**
 * ProjectDetail — a "project window" template for a discipline's interior
 * pages, styled like a macOS paint app: title bar, tool rail, a hero shot
 * on the left, an item grid on the right, a color shelf along the bottom.
 * All chrome (traffic lights, tool rail, canvas outline, color shelf) is
 * decorative only — nothing here draws or is wired to state, except the
 * single-select photo swap described below.
 *
 * Fully data-driven so one component serves every discipline: pass a new
 * hero/accessories/accentColor and it's a different project.
 *
 * `fullBleed` switches from a fixed-size centered card (the default —
 * used by this folder's own demo) to filling 100% of its parent's box,
 * for pages that want the window to BE the page rather than sit on one
 * (see the real site's [data-project-detail][data-full-bleed] wrapper,
 * which additionally breaks that parent out to the full viewport width).
 * This only affects the outer container's sizing — the internal layout
 * below (hero + item grid, side by side) is unchanged either way.
 *
 * `layers` (optional) turns the item grid into a single-select photo
 * swap: each entry is { id, layerSrc, layerAlt, thumbSrc, thumbAlt }.
 * Clicking a thumbnail shows that image absolutely-positioned on top of
 * the hero ("base body"), replacing whichever one (if any) was showing
 * before — mutually exclusive, not an independent per-thumbnail toggle.
 * Clicking the currently-selected thumbnail again (or the eraser tool)
 * clears the selection back to just the hero. This is deliberately
 * single-select rather than a true multi-layer composite: these are
 * real opaque photos, not transparent garment cutouts, so showing more
 * than one "layer" at once would just have the last one fully hide the
 * rest — single-select is the honest version of that. When `layers` is
 * omitted/empty, the item grid falls back to the original plain
 * `accessories` gallery (non-interactive photos) — existing usage is
 * unaffected.
 *
 * `onClose` (optional) is the one piece of window chrome that isn't
 * decorative: pass it and the red traffic light becomes a real close
 * button (the yellow/green ones stay purely cosmetic — there's nothing
 * to minimize or zoom here). The component doesn't decide what closing
 * means; the host does (see mountShared.jsx, which turns it into a
 * `project-detail:close` event the page listens for). Omit it and the
 * red light stays a plain decorative dot, as before.
 */
export default function ProjectDetail({
  title,
  hero,
  accessories = [],
  layers = [],
  accentColor,
  swatches = DEFAULT_SWATCHES,
  fullBleed = false,
  onClose,
}) {
  const [activeLayerId, setActiveLayerId] = useState(null);

  // Mutually exclusive: picking a new thumbnail swaps away from whatever
  // was selected before. Clicking the already-selected one deselects
  // back to just the hero, same end state as the eraser.
  function selectLayer(id) {
    setActiveLayerId((prev) => (prev === id ? null : id));
  }

  function clearSelection() {
    setActiveLayerId(null);
  }

  const hasLayers = layers.length > 0;

  return (
    <div className={'pd-container' + (fullBleed ? ' pd-container--fullbleed' : '')} style={{ '--pd-accent': accentColor }}>
      <div className="pd-header">
        <div className="pd-traffic-lights">
          {onClose ? (
            <button
              type="button"
              className="pd-light pd-light--red pd-light--action"
              onClick={onClose}
              aria-label={title ? `Close ${title}` : 'Close'}
              title="Close"
            />
          ) : (
            <span className="pd-light pd-light--red" />
          )}
          <span className="pd-light pd-light--yellow" />
          <span className="pd-light pd-light--green" />
        </div>
        <div className="pd-title">{title}</div>
      </div>

      <div className="pd-body">
        <aside className="pd-toolbar">
          {TOOL_ORDER.map((tool, i) => {
            const isEraser = tool === 'eraser';
            return (
              <div
                key={tool}
                className={
                  'pd-tool' +
                  (i === 0 ? ' pd-tool--active' : '') +
                  (isEraser && hasLayers ? ' pd-tool--clickable' : '')
                }
                role={isEraser && hasLayers ? 'button' : undefined}
                aria-label={isEraser && hasLayers ? 'Clear selection' : undefined}
                aria-disabled={isEraser && hasLayers ? activeLayerId === null : undefined}
                onClick={isEraser && hasLayers ? clearSelection : undefined}
              >
                {TOOL_ICONS[tool]}
              </div>
            );
          })}
          <div className="pd-tool-spacer" />
          <div className="pd-color-indicator" />
        </aside>

        <main className="pd-workspace">
          <div className="pd-canvas-main">
            {hero && <img src={hero.src} alt={hero.alt || ''} className="pd-hero-image" />}
            {/* Single-select swap (see the layers prop doc above) — at
                most one of these is ever active at a time, crossfading
                in over the hero when its matching item-grid thumbnail
                below is clicked, not drawn on. */}
            {hasLayers &&
              layers.map((layer) => (
                <img
                  key={layer.id}
                  src={layer.layerSrc}
                  alt={layer.layerAlt || ''}
                  className={'pd-layer-overlay' + (activeLayerId === layer.id ? ' pd-layer-overlay--active' : '')}
                />
              ))}
            {/* Chrome only — an empty canvas outline, no drawing logic attached. */}
            <canvas className="pd-canvas-overlay" aria-hidden="true" />
          </div>

          <div className="pd-item-grid">
            {hasLayers
              ? layers.map((layer) => {
                  const selected = activeLayerId === layer.id;
                  return (
                    <button
                      key={layer.id}
                      type="button"
                      className={'pd-detail-box' + (selected ? ' pd-detail-box--selected' : '')}
                      aria-pressed={selected}
                      onClick={() => selectLayer(layer.id)}
                    >
                      <img src={layer.thumbSrc} alt={layer.thumbAlt || ''} />
                    </button>
                  );
                })
              : accessories.map((item, i) => (
                  <div className="pd-detail-box" key={item.src || i}>
                    <img src={item.src} alt={item.alt || ''} />
                  </div>
                ))}
          </div>
        </main>
      </div>

      <footer className="pd-bottom-bar">
        <div className="pd-color-shelf">
          {swatches.map((color, i) => (
            <button
              key={color + i}
              className="pd-swatch"
              style={{ background: color }}
              disabled
              aria-hidden="true"
              tabIndex={-1}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
