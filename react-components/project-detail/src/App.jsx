import ProjectDetail from './ProjectDetail.jsx';

// Demo harness only — shows the same component fed different data sets,
// proving it's reusable rather than hardcoded to one discipline. Real
// integration into the Crochet / Sewing interior pages is a separate
// step (this stays out of index.html for now, per scope).

// No real transparent garment-cutout PNGs exist in the project yet, so
// this demo's "layers" are simple inline SVG shapes instead of actual
// clothing art — purely to exercise/prove the single-select swap
// mechanic (click a thumbnail, it replaces whichever one was showing).
function swatchLayer(fill, d) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">` +
    `<path d="${d}" fill="${fill}" fill-opacity="0.82"/></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

const DEMO_LAYERS = [
  { id: 'shorts', layerSrc: swatchLayer('#E84545', 'M90 230 h120 v110 h-120 z'), thumbSrc: swatchLayer('#E84545', 'M40 40 h220 v320 h-220 z'), thumbAlt: 'Shorts swatch' },
  { id: 'jacket', layerSrc: swatchLayer('#3E5C76', 'M70 90 h160 v170 h-160 z'), thumbSrc: swatchLayer('#3E5C76', 'M40 40 h220 v320 h-220 z'), thumbAlt: 'Jacket swatch' },
  { id: 'boots', layerSrc: swatchLayer('#4B3A2C', 'M95 320 h45 v60 h-45 z M160 320 h45 v60 h-45 z'), thumbSrc: swatchLayer('#4B3A2C', 'M40 40 h220 v320 h-220 z'), thumbAlt: 'Boots swatch' },
  { id: 'bag', layerSrc: swatchLayer('#A4B35E', 'M150 150 m-45 0 a45 45 0 1 0 90 0 a45 45 0 1 0 -90 0'), thumbSrc: swatchLayer('#A4B35E', 'M40 40 h220 v320 h-220 z'), thumbAlt: 'Bag swatch' },
];

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', padding: '48px 16px' }}>
      <ProjectDetail
        title="Crochet — Project_01"
        accentColor="#A4B35E"
        hero={{ src: 'assets/crochet/hero.jpg', alt: 'Crochet piece, full look' }}
        accessories={[
          { src: 'assets/crochet/hero.jpg', alt: 'Detail, stitch close-up' },
          { src: 'assets/crochet/hero.jpg', alt: 'Detail, yarn texture' },
          { src: 'assets/crochet/hero.jpg', alt: 'Detail, silhouette' },
        ]}
      />
      <ProjectDetail
        title="Sewing — Project_01"
        accentColor="#3E5C76"
        hero={{ src: 'assets/sewing/hero.jpeg', alt: 'Sewn garment, full look' }}
        accessories={[
          { src: 'assets/sewing/detail-1.jpeg', alt: 'Construction detail' },
          { src: 'assets/sewing/hero.jpeg', alt: 'Fabric detail' },
        ]}
      />
      <div>
        <p style={{ font: '12px monospace', color: '#888', margin: '0 0 12px' }}>
          Single-select photo swap demo — colored swatches stand in for real garment cutout PNGs, which don't exist yet.
        </p>
        <ProjectDetail
          title="Style_Editor_v1.app"
          accentColor="#3E5C76"
          hero={{ src: 'assets/sewing/hero.jpeg', alt: 'Base model' }}
          layers={DEMO_LAYERS}
        />
      </div>
    </div>
  );
}
