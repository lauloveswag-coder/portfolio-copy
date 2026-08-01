// Site-wide theme (dark/light) + dyslexia accessibility toolbar.
// The no-FOUC bootstrap (applies saved/OS-preferred state before first
// paint) lives inline in index.html's <head>; this file wires up the
// header controls and keeps localStorage in sync as the user changes them.
(function () {
  var THEME_KEY = 'lg-theme';
  var A11Y_KEY = 'lg-dyslexia-settings';

  var FONT_STACKS = {
    lexend: "'Lexend', sans-serif",
    opendyslexic: "'OpenDyslexic', sans-serif",
    atkinson: "'Atkinson Hyperlegible', sans-serif"
  };

  var root = document.documentElement;

  function readA11y() {
    try {
      return JSON.parse(localStorage.getItem(A11Y_KEY) || 'null') || {};
    } catch (e) {
      return {};
    }
  }

  function writeA11y(settings) {
    try {
      localStorage.setItem(A11Y_KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  // ---------- Theme (dark / light) ----------

  function applyThemeIcon(isDark) {
    var icon = document.getElementById('theme-toggle-icon');
    var btn = document.getElementById('theme-toggle-btn');
    if (icon) icon.textContent = isDark ? '\u{1F319}' : '\u{2600}\u{FE0F}';
    if (btn) {
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function setTheme(theme) {
    root.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    applyThemeIcon(theme === 'dark');
  }

  function initTheme() {
    applyThemeIcon(root.classList.contains('dark'));
    var btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        setTheme(root.classList.contains('dark') ? 'light' : 'dark');
      });
    }
    // Only follow OS-level changes live if the user never made an explicit choice.
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        var saved;
        try { saved = localStorage.getItem(THEME_KEY); } catch (err) {}
        if (!saved) setTheme(e.matches ? 'dark' : 'light');
      });
    }
  }

  // ---------- Dyslexia toolbar ----------

  function initA11yPanel() {
    var toggleBtn = document.getElementById('a11y-toggle-btn');
    var panel = document.getElementById('a11y-panel');
    var closeBtn = document.getElementById('a11y-panel-close');
    if (!toggleBtn || !panel) return;

    var fontSelect = document.getElementById('a11y-font-select');
    var lsRange = document.getElementById('a11y-letterspacing-range');
    var lhRange = document.getElementById('a11y-lineheight-range');
    var fsRange = document.getElementById('a11y-fontsize-range');
    var tintSwatches = panel.querySelectorAll('.a11y-tint-swatch');
    var rulerCheckbox = document.getElementById('a11y-ruler-checkbox');
    var resetBtn = document.getElementById('a11y-reset-btn');

    function openPanel() {
      panel.classList.remove('hidden');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
    function closePanel() {
      panel.classList.add('hidden');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', function () {
      panel.classList.contains('hidden') ? openPanel() : closePanel();
    });
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });
    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('hidden') && !panel.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
        closePanel();
      }
    });

    // --- Restore saved state into the controls ---
    var settings = readA11y();
    if (fontSelect) fontSelect.value = settings.fontKey || 'system';
    if (lsRange && typeof settings.letterSpacing === 'number') lsRange.value = String(settings.letterSpacing);
    if (lhRange && typeof settings.lineHeight === 'number') lhRange.value = String(settings.lineHeight);
    if (fsRange && typeof settings.fontSize === 'number') fsRange.value = String(settings.fontSize);
    if (rulerCheckbox) rulerCheckbox.checked = !!settings.ruler;
    tintSwatches.forEach(function (btn) {
      var active = (settings.tint || 'none') === btn.getAttribute('data-tint');
      btn.setAttribute('aria-pressed', String(active));
    });

    // --- Font family ---
    if (fontSelect) {
      fontSelect.addEventListener('change', function () {
        var key = fontSelect.value;
        settings.fontKey = key;
        if (key === 'system') {
          root.classList.remove('dyslexia-font-active');
          root.style.removeProperty('--dyslexia-font');
        } else {
          root.style.setProperty('--dyslexia-font', FONT_STACKS[key]);
          root.classList.add('dyslexia-font-active');
        }
        writeA11y(settings);
      });
    }

    // --- Letter spacing ---
    if (lsRange) {
      lsRange.addEventListener('input', function () {
        var val = parseFloat(lsRange.value);
        settings.letterSpacing = val;
        root.style.setProperty('--dyslexia-letter-spacing', val + 'em');
        root.classList.toggle('dyslexia-ls-active', val > 0);
        writeA11y(settings);
      });
    }

    // --- Line height ---
    if (lhRange) {
      lhRange.addEventListener('input', function () {
        var val = parseFloat(lhRange.value);
        settings.lineHeight = val;
        root.style.setProperty('--dyslexia-line-height', String(val));
        root.classList.toggle('dyslexia-lh-active', val > 1.6);
        writeA11y(settings);
      });
    }

    // --- Font size ---
    if (fsRange) {
      fsRange.addEventListener('input', function () {
        var val = parseFloat(fsRange.value);
        settings.fontSize = val;
        root.style.setProperty('--dyslexia-font-size', val + '%');
        writeA11y(settings);
      });
    }

    // --- Background tint ---
    tintSwatches.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tint = btn.getAttribute('data-tint');
        settings.tint = tint;
        if (tint === 'none') {
          root.removeAttribute('data-dyslexia-tint');
        } else {
          root.setAttribute('data-dyslexia-tint', tint);
        }
        tintSwatches.forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        writeA11y(settings);
      });
    });

    // --- Reading ruler ---
    if (rulerCheckbox) {
      rulerCheckbox.addEventListener('change', function () {
        settings.ruler = rulerCheckbox.checked;
        root.classList.toggle('dyslexia-ruler-active', rulerCheckbox.checked);
        writeA11y(settings);
      });
    }

    // --- Reset ---
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        settings = {};
        try { localStorage.removeItem(A11Y_KEY); } catch (e) {}
        root.classList.remove('dyslexia-font-active', 'dyslexia-ls-active', 'dyslexia-lh-active', 'dyslexia-ruler-active');
        root.removeAttribute('data-dyslexia-tint');
        root.style.removeProperty('--dyslexia-font');
        root.style.removeProperty('--dyslexia-letter-spacing');
        root.style.removeProperty('--dyslexia-line-height');
        root.style.setProperty('--dyslexia-font-size', '100%');
        if (fontSelect) fontSelect.value = 'system';
        if (lsRange) lsRange.value = '0';
        if (lhRange) lhRange.value = '1.6';
        if (fsRange) fsRange.value = '100';
        if (rulerCheckbox) rulerCheckbox.checked = false;
        tintSwatches.forEach(function (b) {
          b.setAttribute('aria-pressed', String(b.getAttribute('data-tint') === 'none'));
        });
      });
    }
  }

  // ---------- Reading ruler (cursor-follow dimming band) ----------

  function initReadingRuler() {
    var top = document.getElementById('dyslexia-ruler-dim-top');
    var bottom = document.getElementById('dyslexia-ruler-dim-bottom');
    if (!top || !bottom) return;
    var RULER_HEIGHT = 64;
    var ticking = false;
    var lastY = window.innerHeight / 2;

    function render() {
      ticking = false;
      var halfBand = RULER_HEIGHT / 2;
      top.style.height = Math.max(0, lastY - halfBand) + 'px';
      bottom.style.top = (lastY + halfBand) + 'px';
    }

    document.addEventListener('mousemove', function (e) {
      lastY = e.clientY;
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(render);
      }
    });
    render();
  }

  function init() {
    initTheme();
    initA11yPanel();
    initReadingRuler();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
