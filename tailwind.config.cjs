/**
 * Replaces the `tailwind.config = {...}` object that used to sit inline in
 * index.html next to the cdn.tailwindcss.com script. Same theme, but the
 * stylesheet is now compiled ahead of time into tailwind.css instead of
 * being generated in the visitor's browser on every page load.
 *
 * .cjs, not .js: package.json sets "type": "module", so a plain .js file
 * here would be loaded as ESM and `module.exports` would throw.
 *
 * Colors resolve through the CSS custom properties defined in styles.css
 * (:root for light / html.dark for dark) so every bg, text and border
 * utility re-themes automatically — see the "Legacy aliases" comment in
 * styles.css for the cream/charcoal/etc -> token mapping. The
 * rgb(var(...) / <alpha-value>) form is Tailwind's documented pattern for
 * CSS-variable colors that still support opacity modifiers (e.g.
 * bg-cream/30, border-charcoal/10).
 *
 * `content` has to cover every file that can put a class name into the
 * DOM, not just index.html: the sketch-stack and the page's own inline
 * scripts build markup as strings. Tailwind scans them as plain text, so
 * literal class names in those strings are picked up — nothing in this
 * codebase assembles a class name by concatenation, which is what would
 * actually defeat the scanner.
 */
module.exports = {
  content: [
    './index.html',
    './site-accessibility.js',
    './components/**/*.js',
    // The embedded React islands (Social Media, Crochet/Sewing project
    // windows) ship their own bundled JS, but this precompiled tailwind.css
    // is what actually supplies their utility classes at runtime — the
    // island's own build has no Tailwind step of its own. Missing this
    // entry is why Social Media rendered completely unstyled after Tailwind
    // moved from the CDN (JIT, scanned the live DOM) to this ahead-of-time
    // build (only scans these listed files): every bg-[...]/rounded-.../
    // backdrop-blur-... class it uses was silently absent from the output.
    './react-components/**/*.jsx',
  ],
  theme: {
    extend: {
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem'
      },
      colors: {
        cream: 'rgb(var(--color-bg-primary) / <alpha-value>)',
        creamdark: 'rgb(var(--color-card-bg) / <alpha-value>)',
        charcoal: 'rgb(var(--color-text-primary) / <alpha-value>)',
        sage: 'rgb(var(--color-accent-3) / <alpha-value>)',
        sagelight: 'color-mix(in srgb, rgb(var(--color-accent-3)) 22%, rgb(var(--color-bg-primary)) 78%)',
        purple: 'rgb(var(--color-accent-1) / <alpha-value>)',
        purplelight: 'color-mix(in srgb, rgb(var(--color-accent-1)) 22%, rgb(var(--color-bg-primary)) 78%)',
        pink: 'rgb(var(--color-accent-2) / <alpha-value>)',
        pinklight: 'color-mix(in srgb, rgb(var(--color-accent-2)) 22%, rgb(var(--color-bg-primary)) 78%)',
        hotpink: 'rgb(var(--color-accent-2) / <alpha-value>)'
      }
    }
  },
  plugins: [],
};
