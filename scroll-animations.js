/**
 * Lenis kinetic scroll + GSAP ScrollTrigger reveals/pins/parallax for the
 * one-page exhibition layout in index.html.
 *
 * Loaded as a deferred <script> after gsap/ScrollTrigger/lenis (see the CDN
 * tags at the end of index.html's <body>), so `gsap`, `ScrollTrigger` and
 * `Lenis` are already global by the time this file runs. This script
 * registers its own 'DOMContentLoaded' listener rather than relying on
 * document.readyState, because as a deferred script it always finishes
 * executing (and thus always finishes *registering* that listener) before
 * the event fires — the page's own inline script (index.html) registers its
 * DOMContentLoaded listener earlier, during HTML parsing, so its handler
 * (which calls renderDisciplineFolders(), the renderManifestFilmstrip()
 * calls, showHub(), etc.) always runs first. By the time our handler below
 * runs, every element it looks for already exists in the DOM.
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    // Reduced motion: leave native scroll in place and never touch these
    // elements with GSAP — they simply render in their normal, fully
    // visible layout (no .js-reveal class ever gets added, so styles.css's
    // .js-reveal{opacity:0} rule never applies). No flash, no hidden state.
    if (prefersReducedMotion) return;

    var hasScrollLibs =
      typeof window.gsap !== 'undefined' &&
      typeof window.ScrollTrigger !== 'undefined';
    if (!hasScrollLibs) return;

    gsap.registerPlugin(ScrollTrigger);

    initLenis();
    initReveals();
    initPinnedHeaders();
    initParallax();

    ScrollTrigger.refresh();
    window.addEventListener('load', function () {
      ScrollTrigger.refresh();
    });
    // Google Fonts (Caveat/Lexend/Atkinson, see index.html <head>) can swap
    // in after 'load' and shift #site-header's rendered height by a few px.
    // The pinned panel-headers' offset is measured once at setup (a plain
    // 'top NNpx' string — see createPinnedHeaderTriggers()), so a height
    // change afterward needs the pins actually rebuilt with a fresh
    // measurement, not just a refresh (refreshing doesn't re-resolve a
    // static string).
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        ScrollTrigger.getAll().forEach(function (st) { if (st.pin) st.kill(); });
        if (window.matchMedia('(min-width: 768px)').matches) createPinnedHeaderTriggers();
        ScrollTrigger.refresh();
      });
    }
  });

  // ---- 1. Kinetic scroll -------------------------------------------------

  function initLenis() {
    if (typeof window.Lenis === 'undefined') return;

    var lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    window.__siteLenis = lenis; // exposed so other independent scroll consumers (e.g. the scroll-progress capsule) can request a programmatic scroll without fighting Lenis's own render loop
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // ---- 2. Scroll-triggered reveals ---------------------------------------

  // Only ever animates opacity/y/scale — never rotation — so any static
  // tilt an element already carries (Tailwind rotate-[...] utilities on
  // .polaroid-frame, the --tilt custom property on .hub-node folder cards)
  // is read off the element's current transform and preserved untouched
  // rather than being flattened to 0deg.
  function prepareReveal(el) {
    el.classList.add('js-reveal');
    gsap.set(el, { opacity: 0, y: 50, scale: 0.96 });
  }

  // Hands control of `transform` back to CSS once an element has fully
  // revealed, so any of its own CSS hover transforms (.polaroid-frame:hover,
  // .hub-node:hover) keep working afterward instead of being stuck behind
  // the inline style GSAP used to animate the reveal. Only ever called on
  // forward completion (not reverse), so the hidden/reversed state is
  // untouched.
  function clearRevealTransform(els) {
    (Array.isArray(els) ? els : [els]).forEach(function (el) {
      gsap.set(el, { clearProps: 'transform' });
    });
  }

  function revealOne(el) {
    prepareReveal(el);
    gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: 'power2.out',
      onComplete: function () { clearRevealTransform(el); },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  function revealGroup(container, els, stagger) {
    if (!els.length) return;
    els.forEach(prepareReveal);
    gsap.to(els, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: 'power2.out',
      stagger: stagger || 0.15,
      onComplete: function () { clearRevealTransform(els); },
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  var FILMSTRIP_GALLERY_IDS = [
    'sketches-filmstrip',
    '3d-ai-filmstrip',
    'sewing-filmstrip',
    'archive-filmstrip',
    'crochet-filmstrip'
  ];

  function initReveals() {
    // Each "EXHIBIT / ..." panel-header plaque (one per .editorial-panel —
    // About, CV, Portfolio, Services, Journal).
    document.querySelectorAll('.editorial-panel .panel-header').forEach(revealOne);

    // "Freelance Services" (#panel-universe) and "Want to start a new.
    // project?" (#panel-journal) — each is the only <h3> in its panel.
    var servicesHeading = document.querySelector('#panel-universe h3');
    if (servicesHeading) revealOne(servicesHeading);

    var journalHeading = document.querySelector('#panel-journal h3');
    if (journalHeading) revealOne(journalHeading);

    // Service cards: direct children of the Services accordion group
    // (data-reveal-group="services" — added specifically so this doesn't
    // also pick up the FAQ accordion further down the same panel, which
    // shares the .accordion-group-clean class but isn't made of cards).
    var servicesGroup = document.querySelector('[data-reveal-group="services"]');
    if (servicesGroup) {
      revealGroup(servicesGroup, Array.prototype.slice.call(servicesGroup.children), 0.15);
    }

    // Polaroid-style photo cards in the Personal Universe / Crochet Archive
    // filmstrip (#panel-universe) — each already carries a static Tailwind
    // rotate-[...] tilt; prepareReveal()/revealGroup() never touch rotation,
    // so that tilt survives the reveal untouched.
    var polaroidRow = document.querySelector('#panel-universe .filmstrip-row');
    if (polaroidRow) {
      var polaroids = Array.prototype.slice.call(polaroidRow.querySelectorAll('.polaroid-frame'));
      revealGroup(polaroidRow, polaroids, 0.15);
    }

    // Portfolio cards: the 5 discipline-folder cards in the default hub view
    // (renderDisciplineFolders(), already rendered and visible by the time
    // this runs) plus the filmstrip cards inside each discipline's gallery
    // (renderManifestFilmstrip()) — those galleries start hidden until a
    // discipline is picked, so their reveal ScrollTriggers are created now
    // but only measure correctly once initPortfolioVisibilityRefresh()
    // below calls ScrollTrigger.refresh() after they become visible.
    var archiveBoard = document.getElementById('archive-board');
    if (archiveBoard) {
      var folderCards = Array.prototype.slice.call(archiveBoard.querySelectorAll('.archive-card'));
      revealGroup(archiveBoard, folderCards, 0.15);
    }

    FILMSTRIP_GALLERY_IDS.forEach(function (id) {
      var gallery = document.getElementById(id);
      if (!gallery) return;
      // Excludes the aria-hidden duplicate half of the infinite-loop track
      // (see renderManifestFilmstrip() in index.html) so it isn't animated
      // as a separate, visually redundant reveal.
      var cards = Array.prototype.slice.call(
        gallery.querySelectorAll('.dock-scroll__card:not([aria-hidden="true"])')
      );
      revealGroup(gallery, cards, 0.06);
    });

    initPortfolioVisibilityRefresh();
  }

  // #panel-portfolio toggles discipline galleries in/out of view by
  // adding/removing Tailwind's "hidden" class (showHub()/selectDiscipline(),
  // both in index.html) — elements can't be measured correctly by
  // ScrollTrigger while display:none, so re-measure whenever that
  // visibility changes.
  function initPortfolioVisibilityRefresh() {
    var root = document.getElementById('panel-portfolio');
    if (!root || typeof MutationObserver === 'undefined') return;

    var pending = null;
    var observer = new MutationObserver(function () {
      if (pending) return;
      pending = requestAnimationFrame(function () {
        pending = null;
        ScrollTrigger.refresh();
      });
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'], subtree: true });
  }

  // ---- 3. Pinned panel headers --------------------------------------------

  // #site-header is position:sticky at the true top of the viewport — read
  // its live rendered height (rather than a hardcoded guess) so the pinned
  // panel-header docks just below it instead of underneath it.
  function getSiteHeaderOffset() {
    var header = document.getElementById('site-header');
    return header ? Math.round(header.getBoundingClientRect().height) : 0;
  }

  // Builds the 5 pin ScrollTriggers using a single offset measurement taken
  // right now (a plain 'top NNpx' string, not a function re-evaluated on
  // every refresh) — GSAP's pin position, once engaged, is derived from the
  // element's natural flow position at that fixed offset, and re-resolving
  // that offset function on every ScrollTrigger.refresh() while a pin is
  // already active was observed to make the frozen position drift further
  // off (not converge) with each refresh, rather than correct itself.
  // Static strings avoid that entirely and are GSAP's standard pin pattern.
  function createPinnedHeaderTriggers() {
    var offset = getSiteHeaderOffset();
    document.querySelectorAll('.editorial-panel .panel-header').forEach(function (header) {
      var panel = header.closest('.editorial-panel');
      var content = panel ? panel.querySelector('.panel-content') : null;
      if (!content) return;

      // z-index 40: above normal panel content, below #site-header (45) and
      // the always-on-top lang/theme controls (9995) — the docked
      // panel-header must never render on top of either.
      gsap.set(header, { zIndex: 40 });

      ScrollTrigger.create({
        trigger: header,
        start: 'top ' + offset + 'px',
        endTrigger: content,
        end: 'bottom ' + offset + 'px',
        pin: true,
        pinSpacing: false
      });
    });
  }

  function initPinnedHeaders() {
    ScrollTrigger.matchMedia({
      '(min-width: 768px)': createPinnedHeaderTriggers
      // Below 768px: no ScrollTriggers are created in this branch at all,
      // so pinning is simply never applied on mobile viewports.
    });
  }

  // ---- 4. Floating / parallax ---------------------------------------------

  // Wraps `el` in a plain div so the parallax drift can animate the
  // wrapper's own `y` while the element's reveal tween (and its static
  // Tailwind tilt) animate/live on `el` itself — keeping both effects on
  // separate elements avoids them fighting over the same `transform`.
  function wrapForParallax(el) {
    var wrap = document.createElement('div');
    wrap.className = 'js-parallax-wrap';
    wrap.style.flexShrink = '0';
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);
    return wrap;
  }

  function initParallax() {
    var polaroidRow = document.querySelector('#panel-universe .filmstrip-row');
    if (polaroidRow) {
      Array.prototype.slice.call(polaroidRow.querySelectorAll('.polaroid-frame')).forEach(function (el) {
        var wrap = wrapForParallax(el);
        gsap.to(wrap, {
          y: -40,
          ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
      });
    }

    // Large rotated "about myself / à propos de moi" handwriting overlay —
    // relative y offset (not an absolute value) so the parallax nudges it
    // from wherever it already sits (it's also statically centered via
    // Tailwind's -translate-x/-translate-y utilities) rather than resetting
    // that position, and its rotate-[-6deg] tilt is left untouched since
    // rotation is never part of this tween.
    var handwriting = document.querySelector('#panel-about .overlapping-handwriting');
    if (handwriting) {
      gsap.to(handwriting, {
        y: '-=40',
        ease: 'none',
        scrollTrigger: { trigger: handwriting, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    }
  }
})();
