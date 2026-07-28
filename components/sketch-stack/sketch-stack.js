/**
 * <sketch-stack> — an interactive layered pile of images.
 *
 * Usage:
 *   <sketch-stack data-folder="PORTFOLIO ASSESTS/SKETCHES/" data-manifest-key="sketches"></sketch-stack>
 *
 * Requires, loaded before this script:
 *   - sketch-stack-animations.js   (defines window.SketchStackAnimations)
 *   - a manifest script that fills window.STACK_MANIFESTS[<data-manifest-key>]
 *     with an array of filenames living inside <data-folder>.
 *
 * To reuse for another category: duplicate this whole components/sketch-stack/
 * folder, give the new copy its own manifest, and drop a
 * <sketch-stack data-folder="..." data-manifest-key="..."> tag wherever
 * you want it — nothing in this file needs to change.
 */
(function () {
  'use strict';

  // Resolve sketch-stack.css relative to *this script's own location*, not
  // wherever the HTML using it happens to live — so a duplicated component
  // folder keeps working without edits.
  var CURRENT_SCRIPT_URL = document.currentScript && document.currentScript.src;
  var CSS_URL = CURRENT_SCRIPT_URL
    ? CURRENT_SCRIPT_URL.replace(/sketch-stack\.js(\?.*)?$/, 'sketch-stack.css')
    : 'components/sketch-stack/sketch-stack.css';

  var WINDOW_SIZE = 4; // how many cards are mounted at once (current + 3 waiting)
  var PRELOAD_AHEAD = 1; // how many images beyond the visible window to warm in cache

  var TEMPLATE = document.createElement('template');
  TEMPLATE.innerHTML =
    '<link rel="stylesheet" href="' + CSS_URL + '">' +
    '<div class="stack" part="stack"></div>' +
    '<p class="sr-hint" id="hint">Click or press Enter on the top sketch to see the next one.</p>';

  class SketchStackElement extends HTMLElement {
    connectedCallback() {
      if (this._initialized) return;
      this._initialized = true;

      var root = this.attachShadow({ mode: 'open' });
      root.appendChild(TEMPLATE.content.cloneNode(true));
      this._stackEl = root.querySelector('.stack');

      var folder = this.getAttribute('data-folder') || '';
      if (folder && folder.charAt(folder.length - 1) !== '/') folder += '/';
      this._folder = folder;

      var key = this.getAttribute('data-manifest-key') || '';
      var manifests = window.STACK_MANIFESTS || {};
      var files = manifests[key];

      if (!Array.isArray(files) || files.length === 0) {
        this._renderEmptyState('No sketches found for "' + key + '". Add filenames to the matching manifest.js.');
        return;
      }

      var animations = window.SketchStackAnimations;
      if (!animations) {
        this._renderEmptyState('Sketch stack could not load its animation logic.');
        return;
      }

      this._files = files;
      this._animations = animations;
      this._currentIndex = 0;
      this._cards = []; // { el, manifestIndex, offset }

      this._buildInitialWindow();
    }

    _renderEmptyState(message) {
      var p = document.createElement('p');
      p.textContent = message;
      p.style.fontFamily = 'inherit';
      p.style.fontSize = '13px';
      p.style.opacity = '0.6';
      this._stackEl.appendChild(p);
    }

    _buildInitialWindow() {
      var count = Math.min(WINDOW_SIZE, this._files.length);
      for (var offset = 0; offset < count; offset++) {
        var manifestIndex = (this._currentIndex + offset) % this._files.length;
        var card = this._createCard(manifestIndex, offset, /*instant*/ true);
        this._cards.push(card);
        this._stackEl.appendChild(card.el);
      }
      this._preloadAhead();
    }

    _createCard(manifestIndex, offset, instant) {
      var self = this;
      var el = document.createElement('button');
      el.className = 'card';
      el.type = 'button';
      el.setAttribute('aria-describedby', 'hint');

      var mat = document.createElement('span');
      mat.className = 'card__mat';
      var img = document.createElement('img');
      img.className = 'card__img';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = this._folder + this._files[manifestIndex];
      img.alt = 'Sketch ' + (manifestIndex + 1) + ' of ' + this._files.length;
      mat.appendChild(img);
      el.appendChild(mat);

      el.addEventListener('click', function () {
        self._advance();
      });

      var card = { el: el, manifestIndex: manifestIndex, offset: offset };

      if (instant) {
        el.style.transition = 'none';
      }
      this._applyOffsetStyles(card);
      if (instant) {
        // Force layout so the transition-less initial position is committed
        // before we re-enable transitions for future updates.
        void el.offsetWidth;
        el.style.transition = '';
      }

      return card;
    }

    _applyOffsetStyles(card) {
      var isTop = card.offset === 0;
      card.el.classList.toggle('card--top', isTop);
      card.el.tabIndex = isTop ? 0 : -1;
      card.el.setAttribute('aria-hidden', isTop ? 'false' : 'true');

      var t = this._animations.getCardTransform(card.offset, card.manifestIndex);
      card.el.style.transform = t.transform;
      card.el.style.opacity = String(t.opacity);
      card.el.style.boxShadow = t.boxShadow;
      card.el.style.zIndex = String(t.zIndex);
    }

    _advance() {
      if (this._animating || this._cards.length === 0) return;
      this._animating = true;

      var self = this;
      var topCard = this._cards[0];
      var exit = this._animations.getExitTransform(topCard.manifestIndex);

      topCard.el.classList.add('card--exiting');
      topCard.el.classList.remove('card--top');
      topCard.el.tabIndex = -1;
      topCard.el.style.pointerEvents = 'none';
      topCard.el.style.transform = exit.transform;
      topCard.el.style.opacity = String(exit.opacity);
      topCard.el.style.zIndex = String(exit.zIndex);

      // Advance every remaining card one position closer to the top; CSS
      // transitions animate the change since transform/opacity are already
      // transitionable properties on .card.
      for (var i = 1; i < this._cards.length; i++) {
        this._cards[i].offset -= 1;
        this._applyOffsetStyles(this._cards[i]);
      }

      var settle = function () {
        topCard.el.removeEventListener('transitionend', settle);
        if (topCard.el.parentNode) topCard.el.parentNode.removeChild(topCard.el);

        self._cards.shift();
        self._currentIndex = (self._currentIndex + 1) % self._files.length;

        // Bring in a fresh card at the back of the window.
        if (self._files.length > self._cards.length) {
          var newOffset = self._cards.length;
          var newManifestIndex = (self._currentIndex + newOffset) % self._files.length;
          var newCard = self._createCard(newManifestIndex, newOffset, true);
          self._cards.push(newCard);
          self._stackEl.appendChild(newCard.el);
        }

        self._preloadAhead();
        self._animating = false;
      };
      topCard.el.addEventListener('transitionend', settle);
    }

    _preloadAhead() {
      if (!this._files || this._files.length <= this._cards.length) return;
      for (var i = 0; i < PRELOAD_AHEAD; i++) {
        var idx = (this._currentIndex + this._cards.length + i) % this._files.length;
        var img = new Image();
        img.src = this._folder + this._files[idx];
      }
    }
  }

  if (!customElements.get('sketch-stack')) {
    customElements.define('sketch-stack', SketchStackElement);
  }
})();
