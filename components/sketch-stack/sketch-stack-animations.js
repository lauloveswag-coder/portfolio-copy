/**
 * Pure animation logic for <sketch-stack>.
 *
 * Nothing in this file touches the DOM — it only computes numbers/strings
 * describing where a card should sit or how it should leave. Keeping this
 * separate from sketch-stack.js means the "what does the pile look like"
 * math can be read, tuned, or reused entirely on its own.
 */
(function (global) {
  'use strict';

  var EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'; // same editorial ease used site-wide

  /**
   * Deterministic pseudo-random tilt for a given manifest index, so the same
   * image always gets the same slight tilt instead of re-randomizing on
   * every render (which would look jittery rather than "curated").
   * Returns a value in the range [-maxDeg, maxDeg].
   */
  function tiltForIndex(index, maxDeg) {
    maxDeg = maxDeg || 3;
    // Simple deterministic hash -> stable pseudo-randomness without a seedable RNG dependency.
    var hash = Math.sin(index * 12.9898) * 43758.5453;
    var frac = hash - Math.floor(hash);
    return (frac * 2 - 1) * maxDeg;
  }

  /**
   * Resting transform for a card sitting `offset` positions back from the
   * top of the pile (0 = top/active card). Depth increases translate,
   * scale-down, and shadow softness; opacity fades slightly with depth so
   * the pile reads as thick paper, not a flat cutout.
   */
  function getCardTransform(offset, manifestIndex) {
    var tilt = tiltForIndex(manifestIndex, offset === 0 ? 1.5 : 3);
    var translateY = offset * 7; // px, subtle — not a scattered scrapbook spread
    var translateX = offset * 4 * (manifestIndex % 2 === 0 ? 1 : -1);
    var scale = 1 - offset * 0.025;
    var opacity = Math.max(1 - offset * 0.08, 0.7);
    var shadow = offset === 0
      ? '0 10px 24px rgba(30,30,30,0.14), 0 2px 6px rgba(30,30,30,0.08)'
      : '0 ' + (6 + offset * 4) + 'px ' + (16 + offset * 6) + 'px rgba(30,30,30,' + Math.max(0.1 - offset * 0.015, 0.04) + ')';

    return {
      transform: 'translate(' + translateX + 'px,' + translateY + 'px) rotate(' + tilt.toFixed(2) + 'deg) scale(' + scale.toFixed(3) + ')',
      opacity: opacity,
      boxShadow: shadow,
      zIndex: 100 - offset
    };
  }

  /**
   * Transform applied to the top card as it's dismissed: slides up and
   * away, rotates further, fades toward (but not fully to) transparent,
   * and drops behind the rest of the pile via z-index.
   */
  function getExitTransform(manifestIndex) {
    var tilt = tiltForIndex(manifestIndex, 3) + (manifestIndex % 2 === 0 ? 10 : -10);
    return {
      transform: 'translate(' + (manifestIndex % 2 === 0 ? 26 : -26) + 'px,-54px) rotate(' + tilt.toFixed(2) + 'deg) scale(0.92)',
      opacity: 0.25,
      zIndex: 0
    };
  }

  global.SketchStackAnimations = {
    EASING: EASING,
    getCardTransform: getCardTransform,
    getExitTransform: getExitTransform
  };
})(window);
