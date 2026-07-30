import { mountAll, runWhenReady } from './mountShared.jsx';

// Production entry (see vite.embed.config.js) — the file that's actually
// bundled into dist-embed/project-detail.js, what the real site loads
// when opened via file://. Deliberately does NOT use import.meta.glob
// (see mount.jsx for why: it forces base64-inlining of every matched
// asset in library/IIFE build mode, regardless of size — ~145KB became
// ~7.7MB for three real photos). Instead, __PD_AUTO_FILES__ is a plain
// JSON object injected via esbuild `define`, computed by vite.embed.
// config.js at build time using Node's fs — so images stay on disk as
// normal files, referenced by plain relative path strings exactly like
// every other <img src="PORTFOLIO ASSESTS/..."> on this site, no asset
// pipeline involved at all. New photos need a rebuild to appear here
// (there is no way around that for a file://-opened static page — see
// the audit this was built from), but nothing needs hand-editing: the
// list itself is discovered by the build, not typed by a person.
/* global __PD_AUTO_FILES__ */
const BUILD_TIME_FILES = __PD_AUTO_FILES__;

function resolveAutoFolder(folderPath) {
  const normalized = folderPath.replace(/^\/+/, '').replace(/\/+$/, '') + '/';
  const files = BUILD_TIME_FILES[normalized] || [];
  return files.map((filename) => ({ src: normalized + filename, alt: '' }));
}

runWhenReady(() => mountAll(resolveAutoFolder));
