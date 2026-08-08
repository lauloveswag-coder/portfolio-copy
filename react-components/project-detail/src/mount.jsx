import { mountAll, runWhenReady } from './mountShared.jsx';

// Dev entry — loaded as a real ES module when the site is served through
// Vite's dev server (see /vite.config.js at the project root). This is
// what gives Crochet/Sewing's data-auto-folder images true live
// discovery: this glob re-runs on each module evaluation (i.e. on the
// full-page reload Vite's file watcher triggers when a matching file is
// added/removed/renamed in the folder), so a new photo just appears.
//
// The production build (vite.embed.config.js) does NOT use this file —
// see mount.embed.jsx. Reason: Vite's library/IIFE build mode inlines
// every referenced asset as base64 regardless of size (assetsInlineLimit
// is ignored there), which blew a ~145KB bundle up to ~7.7MB for three
// real photos. mount.embed.jsx resolves the file list a different way
// (plain Node fs at build time, injected via `define`) specifically to
// avoid that — so this glob call, and its inlining behavior, has to stay
// physically absent from that build entirely, not just unused at runtime
// (Vite transforms import.meta.glob calls at compile time regardless of
// whether the surrounding code path actually executes).
//
// File-relative (../../../assets/projects/...), not root-absolute
// (/assets/projects/...) — this file lives at
// react-components/project-detail/src/mount.jsx, three levels below the
// actual project root where assets/projects lives, and root-absolute
// patterns resolve against each Vite config's own `root` (which isn't
// the project root for every config that might load this file).
const AUTO_DISCOVERY_GLOB = import.meta.glob(
  '../../../assets/projects/{crochet,sewing}/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP}',
  { eager: true, query: '?url', import: 'default' }
);

function resolveAutoFolder(folderPath) {
  const normalized = folderPath.replace(/^\/+/, '').replace(/\/+$/, '') + '/';
  return Object.keys(AUTO_DISCOVERY_GLOB)
    .filter((p) => p.includes(normalized))
    .sort()
    .map((p) => ({ src: AUTO_DISCOVERY_GLOB[p], alt: '' }));
}

runWhenReady(() => mountAll(resolveAutoFolder));
