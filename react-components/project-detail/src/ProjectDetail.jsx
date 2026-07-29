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
 * on the left, an accessory grid on the right, a color shelf along the
 * bottom. All chrome (traffic lights, tool rail, canvas outline, color
 * shelf) is decorative only — nothing here draws or is wired to state.
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
 */
export default function ProjectDetail({
  title,
  hero,
  accessories = [],
  accentColor,
  swatches = DEFAULT_SWATCHES,
  fullBleed = false,
}) {
  return (
    <div className={'pd-container' + (fullBleed ? ' pd-container--fullbleed' : '')} style={{ '--pd-accent': accentColor }}>
      <div className="pd-header">
        <div className="pd-traffic-lights">
          <span className="pd-light pd-light--red" />
          <span className="pd-light pd-light--yellow" />
          <span className="pd-light pd-light--green" />
        </div>
        <div className="pd-title">{title}</div>
      </div>

      <div className="pd-body">
        <aside className="pd-toolbar">
          {TOOL_ORDER.map((tool, i) => (
            <div key={tool} className={'pd-tool' + (i === 0 ? ' pd-tool--active' : '')}>
              {TOOL_ICONS[tool]}
            </div>
          ))}
          <div className="pd-tool-spacer" />
          <div className="pd-color-indicator" />
        </aside>

        <main className="pd-workspace">
          <div className="pd-canvas-main">
            {hero && <img src={hero.src} alt={hero.alt || ''} className="pd-hero-image" />}
            {/* Chrome only — an empty canvas outline, no drawing logic attached. */}
            <canvas className="pd-canvas-overlay" aria-hidden="true" />
          </div>

          <div className="pd-item-grid">
            {accessories.map((item, i) => (
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
