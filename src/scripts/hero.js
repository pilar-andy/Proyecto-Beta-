/**
 * hero.js — monta la imagen o el video central según src/media/hero.js.
 * Los videos solo se reproducen cuando se ven y cuando el usuario no pidió menos movimiento.
 */

import { HERO } from '../media/hero.js';

export function initHero(container, { isActive }) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let el;

  if (HERO.type === 'video') {
    el = document.createElement('video');
    el.muted = true;
    el.loop = true;
    el.playsInline = true;
    el.setAttribute('muted', '');
    el.setAttribute('playsinline', '');
    el.preload = 'auto';
    if (HERO.poster) el.poster = HERO.poster;
    el.src = HERO.src;
    if (HERO.alt) el.setAttribute('aria-label', HERO.alt);
    else el.setAttribute('aria-hidden', 'true');
  } else {
    el = document.createElement('img');
    el.src = HERO.src;
    el.alt = HERO.alt || '';
    el.decoding = 'async';
    el.draggable = false;
  }

  el.className = 'hero-media';
  container.append(el);

  /** Reproduce o pausa el video según lo que se vea. Con una imagen no hace nada. */
  function sync() {
    if (!(el instanceof HTMLVideoElement)) return;
    const shouldPlay = isActive() && !document.hidden && !reduce.matches;
    if (shouldPlay) el.play().catch(() => {});
    else el.pause();
  }

  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', sync);
  sync();

  return { sync };
}
