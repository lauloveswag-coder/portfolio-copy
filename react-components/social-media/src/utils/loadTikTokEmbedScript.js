const EMBED_SCRIPT_SRC = 'https://www.tiktok.com/embed.js';

// TikTok's own embed.js turns any <blockquote class="tiktok-embed"> on
// the page into a real player iframe, and watches the DOM for new ones
// (so it's safe to insert oEmbed `html` fragments after this has
// already loaded, e.g. when a modal opens). Loaded once, lazily, only
// when a video is actually being played — not on every page load.
let loadPromise = null;

export function loadTikTokEmbedScript() {
  if (loadPromise) return loadPromise;

  const existing = document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`);
  if (existing) {
    loadPromise = Promise.resolve();
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = EMBED_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load TikTok embed.js'));
    document.body.appendChild(script);
  });

  return loadPromise;
}
