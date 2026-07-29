import ProjectDetail from './ProjectDetail.jsx';

// Demo harness only — shows the same component fed two different data
// sets, proving it's reusable rather than hardcoded to one discipline.
// Real integration into the Crochet / Sewing interior pages is a
// separate step (this stays out of index.html for now, per scope).
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
    </div>
  );
}
