/**
 * <scroll-progress> — a vertical floating capsule docked to the right
 * edge, vertically centered, showing how far down the page the reader has
 * scrolled (0% at top -> 100% at bottom). Decorative/supplementary, not a
 * control: aria-hidden and non-interactive (pointer-events: none), so it's
 * skipped by assistive tech and never intercepts clicks.
 *
 * Self-mounting — this one script tag is the whole integration:
 *   <script src="components/scroll-progress/scroll-progress.js" defer></script>
 * It appends its own <scroll-progress> element to <body> once the DOM is
 * ready; nothing else in the page needs to reference it.
 */
(function () {
  'use strict';

  // Resolve scroll-progress.css relative to *this script's own location*,
  // not wherever the HTML using it happens to live.
  var CURRENT_SCRIPT_URL = document.currentScript && document.currentScript.src;
  var CSS_URL = CURRENT_SCRIPT_URL
    ? CURRENT_SCRIPT_URL.replace(/scroll-progress\.js(\?.*)?$/, 'scroll-progress.css')
    : 'components/scroll-progress/scroll-progress.css';

  var TEMPLATE = document.createElement('template');
  TEMPLATE.innerHTML =
    '<link rel="stylesheet" href="' + CSS_URL + '">' +
    '<div class="capsule" part="capsule">' +
      '<span class="label" part="label">0%</span>' +
      '<div class="track" part="track"><div class="fill" part="fill"></div></div>' +
    '</div>';

  class ScrollProgressElement extends HTMLElement {
    connectedCallback() {
      if (this._initialized) return;
      this._initialized = true;

      this.setAttribute('aria-hidden', 'true');

      var root = this.attachShadow({ mode: 'open' });
      root.appendChild(TEMPLATE.content.cloneNode(true));
      this._label = root.querySelector('.label');
      this._fill = root.querySelector('.fill');

      this._ticking = false;
      this._rafId = null;

      var self = this;
      this._onScrollOrResize = function () {
        if (self._ticking) return;
        self._ticking = true;
        self._rafId = requestAnimationFrame(function () {
          self._ticking = false;
          self._update();
        });
      };

      window.addEventListener('scroll', this._onScrollOrResize, { passive: true });
      window.addEventListener('resize', this._onScrollOrResize, { passive: true });

      this._update();
    }

    disconnectedCallback() {
      window.removeEventListener('scroll', this._onScrollOrResize);
      window.removeEventListener('resize', this._onScrollOrResize);
      if (this._rafId) cancelAnimationFrame(this._rafId);
    }

    _update() {
      var doc = document.scrollingElement || document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var pct = scrollable > 0 ? Math.min(100, Math.max(0, (doc.scrollTop / scrollable) * 100)) : 0;

      this._fill.style.height = pct + '%';
      this._label.textContent = Math.round(pct) + '%';
    }
  }

  if (!customElements.get('scroll-progress')) {
    customElements.define('scroll-progress', ScrollProgressElement);
  }

  function mount() {
    if (document.querySelector('scroll-progress')) return;
    document.body.appendChild(document.createElement('scroll-progress'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
