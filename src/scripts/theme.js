/**
 * theme.js — tema claro / oscuro / del sistema.
 * Pone data-theme="light" | "dark" en <html>. El <script> del <head> hace lo mismo
 * antes de pintar para que no haya parpadeo; aquí queda el control en vivo.
 */

import { load, save } from './storage.js';

const query = matchMedia('(prefers-color-scheme: light)');
const BAR = { dark: '#000000', light: '#c9ccd3' };   // color de la barra del navegador

let pref = load('theme', 'system');

function resolved() {
  return pref === 'system' ? (query.matches ? 'light' : 'dark') : pref;
}

function apply() {
  const theme = resolved();
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BAR[theme]);
}

export function getPref() {
  return pref;
}

export function setPref(next) {
  pref = next;
  save('theme', next);
  apply();
}

export function initTheme() {
  apply();
  query.addEventListener('change', () => {
    if (pref === 'system') apply();
  });
}
