import { mountApp, runWhenReady } from './mountShared.jsx';
import './index.css';

// Dev entry — loaded as a real ES module when the real site is served
// through the root Vite dev server (see /vite.config.js at the project
// root). The production build (vite.embed.config.js) does NOT use this
// file — see mount.embed.jsx.
runWhenReady(mountApp);
