import { mountApp, runWhenReady } from './mountShared.jsx';
import './index.css';

// Production entry (see vite.embed.config.js) — the file that's actually
// bundled into dist-embed/social-media.js, what the real site loads
// when opened via file://.
runWhenReady(mountApp);
