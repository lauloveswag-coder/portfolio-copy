/**
 * Pure animation logic for <sketch-stack>.
 *
 * Nothing in this file touches the DOM — it only computes numbers/strings
 * describing where a card should sit or how it should leave. Keeping this
 * separate from sketch-stack.js means the "what does the pile look like"
 * math can be read, tuned, or reused entirely on its own.
 *
 * Visual language: a shuffled stack of index cards/polaroids on a desk —
 * pronounced (but still legible) tilt, uneven jitter between neighbors,
 * and a soft directional shadow so each card reads as a physical object
 * sitting on top of the one below it.
 */
(function (global) {
  'use strict';

  var EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'; // same editorial ease used site-wide

  /**
   * Deterministic pseudo-random value in [-1, 1] for a given index + salt,
   * so the same card always gets the same tilt/jitter instead of
   * re-randomizing on every render (stable, not jittery on re-render).
   */
  function noise(index, salt) {
    var hash = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
    return (hash - Math.floor(hash)) * 2 - 1;
  }

  /** Rotation for a card, in the -8deg..+8deg range the brief calls for. */
  function tiltForIndex(index, maxDeg) {
    maxDeg = maxDeg || 8;
    return noise(index, 1) * maxDeg;
  }

  /**
   * Resting transform for a card sitting `offset` positions back from the
   * top of the pile (0 = top/active card). Depth increases jittered
   * translate, scale-down, and shadow softness; opacity fades slightly
   * with depth so the pile reads as thick paper, not a flat cutout.
   */
  function getCardTransform(offset, manifestIndex) {
    var tilt = tiltForIndex(manifestIndex, 8);
    // Base fan-out per depth layer, plus per-card jitter so neighbours
    // don't sit in a neat radial fan — a shuffled pile, not a hand of cards.
    var jitterX = noise(manifestIndex, 2) * 10;
    var jitterY = noise(manifestIndex, 3) * 8;
    var translateY = offset * 9 + jitterY * (offset === 0 ? 0.3 : 1);
    var translateX = offset * 6 * (manifestIndex % 2 === 0 ? 1 : -1) + jitterX * (offset === 0 ? 0.3 : 1);
    var scale = 1 - offset * 0.03;
    var opacity = Math.max(1 - offset * 0.07, 0.72);

    // Soft, directional shadow (down-right light source) so each card reads
    // as a physical object resting on the one beneath it, not a flat
    // Material-style elevation glow.
    var shadow = offset === 0
      ? '3px 8px 0 rgba(30,30,30,0.05), 6px 16px 22px rgba(30,30,30,0.16)'
      : (3 + offset) + 'px ' + (6 + offset * 5) + 'px ' + (14 + offset * 7) + 'px rgba(30,30,30,' + Math.max(0.13 - offset * 0.018, 0.05) + ')';

    return {
      transform: 'translate(' + translateX.toFixed(1) + 'px,' + translateY.toFixed(1) + 'px) rotate(' + tilt.toFixed(2) + 'deg) scale(' + scale.toFixed(3) + ')',
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
    var tilt = tiltForIndex(manifestIndex, 8) + (manifestIndex % 2 === 0 ? 14 : -14);
    return {
      transform: 'translate(' + (manifestIndex % 2 === 0 ? 34 : -34) + 'px,-60px) rotate(' + tilt.toFixed(2) + 'deg) scale(0.9)',
      opacity: 0.2,
      zIndex: 0
    };
  }

  /**
   * Starting point for a card's cascade-in entrance: further off its
   * resting spot, more sharply rotated, faded — settles into
   * getCardTransform(offset, manifestIndex) over ~350-450ms ease-out.
   */
  function getEntranceStartTransform(offset, manifestIndex) {
    var tilt = tiltForIndex(manifestIndex, 8) + (noise(manifestIndex, 4) * 14);
    var dx = noise(manifestIndex, 5) * 40;
    var dy = 26 + offset * 6;
    return {
      transform: 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) rotate(' + tilt.toFixed(2) + 'deg) scale(0.94)',
      opacity: 0
    };
  }

  global.SketchStackAnimations = {
    EASING: EASING,
    getCardTransform: getCardTransform,
    getExitTransform: getExitTransform,
    getEntranceStartTransform: getEntranceStartTransform
  };
})(window);
