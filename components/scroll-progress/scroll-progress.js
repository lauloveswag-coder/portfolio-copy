/**
 * <scroll-progress> — a vertical floating capsule docked to the right
 * edge, vertically centered, showing how far down the page the reader has
 * scrolled (0% at top -> 100% at bottom) and doubling as a scrubber:
 * click anywhere on the track (or tab to it and press Up/Down) to jump the
 * page to that position. role="slider" (WAI-ARIA authoring practices) —
 * it's a real control now, not decorative, so it's in the accessibility
 * tree and keyboard-operable rather than aria-hidden + pointer-events:none.
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
      '<div class="track-hit" part="track-hit">' +
        '<div class="track" part="track"><div class="fill" part="fill"></div></div>' +
      '</div>' +
    '</div>';

  var ARROW_STEP = 5; // percentage points nudged per Up/Down arrow press

  class ScrollProgressElement extends HTMLElement {
    connectedCallback() {
      if (this._initialized) return;
      this._initialized = true;

      // Real slider now, not a decorative readout — role/orientation/
      // min/max/label + tabindex are all required for a role="slider" to
      // be considered operable per WAI-ARIA authoring practices.
      // aria-valuenow is kept in sync in _update() below.
      this.setAttribute('role', 'slider');
      this.setAttribute('aria-orientation', 'vertical');
      this.setAttribute('aria-valuemin', '0');
      this.setAttribute('aria-valuemax', '100');
      this.setAttribute('aria-label', 'Page scroll position');
      this.setAttribute('tabindex', '0');

      var root = this.attachShadow({ mode: 'open' });
      root.appendChild(TEMPLATE.content.cloneNode(true));
      this._label = root.querySelector('.label');
      this._fill = root.querySelector('.fill');
      this._track = root.querySelector('.track');
      this._trackHit = root.querySelector('.track-hit');

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

      // Click anywhere on the (padded) hit area — percentage is computed
      // against .track's own rect, not the hit area's, so it lines up with
      // what's actually drawn (.fill's height is a % of .track, not of
      // .track-hit's larger padded box).
      this._onTrackClick = function (event) {
        var rect = self._track.getBoundingClientRect();
        var ratio = (event.clientY - rect.top) / rect.height;
        self._scrollToPercent(Math.min(100, Math.max(0, ratio * 100)));
      };
      this._trackHit.addEventListener('click', this._onTrackClick);

      // Up/Down arrow nudge — standard WAI-ARIA slider convention (Up
      // increases the value, Down decreases it), independent of which way
      // .fill happens to grow visually.
      this._onKeydown = function (event) {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        event.preventDefault();
        var current = parseFloat(self.getAttribute('aria-valuenow')) || 0;
        var step = event.key === 'ArrowUp' ? ARROW_STEP : -ARROW_STEP;
        self._scrollToPercent(Math.min(100, Math.max(0, current + step)));
      };
      this.addEventListener('keydown', this._onKeydown);

      this._update();
    }

    disconnectedCallback() {
      window.removeEventListener('scroll', this._onScrollOrResize);
      window.removeEventListener('resize', this._onScrollOrResize);
      this._trackHit.removeEventListener('click', this._onTrackClick);
      this.removeEventListener('keydown', this._onKeydown);
      if (this._rafId) cancelAnimationFrame(this._rafId);
    }

    _update() {
      var doc = document.scrollingElement || document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var pct = scrollable > 0 ? Math.min(100, Math.max(0, (doc.scrollTop / scrollable) * 100)) : 0;

      this._fill.style.height = pct + '%';
      this._label.textContent = Math.round(pct) + '%';
      this.setAttribute('aria-valuenow', Math.round(pct));
    }

    // Jumps the page to `pct` (0-100) of its scrollable height. Prefers
    // the site's Lenis instance — window.__siteLenis, exposed by
    // scroll-animations.js specifically so independent consumers like this
    // capsule can request a scroll without fighting Lenis's own render
    // loop with a competing native scroll — and falls back to native
    // window.scrollTo when Lenis isn't present (failed to load, or never
    // initialized because prefers-reduced-motion skipped it entirely; see
    // scroll-animations.js). Reduced motion always jumps instantly rather
    // than animating, through either path.
    _scrollToPercent(pct) {
      var doc = document.scrollingElement || document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var targetY = (pct / 100) * scrollable;
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (window.__siteLenis) {
        window.__siteLenis.scrollTo(targetY, reduced ? { immediate: true } : { duration: 1 });
      } else if (reduced) {
        window.scrollTo({ top: targetY, behavior: 'auto' });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
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
