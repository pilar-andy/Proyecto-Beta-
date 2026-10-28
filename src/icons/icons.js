/**
 * icons.js — todos los iconos de la interfaz en un solo archivo.
 *
 * Uso en el HTML:  <svg data-icon="send"></svg>
 * hydrateIcons() rellena cada <svg data-icon="…"> con el dibujo correspondiente.
 * Todos usan una cuadrícula de 24 × 24 y toman el color del texto (currentColor).
 */

const STROKE = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';

export const ICONS = {
  // Marca de la app: anillo abierto con un núcleo y un punto que orbita.
  // Es el mismo dibujo que el ícono de la app (src/icons/app/icon.svg).
  mark:
    '<circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="36.75 10.37" transform="rotate(-10 12 12)"/>' +
    '<circle cx="12" cy="12" r="2.2" fill="currentColor"/>' +
    '<circle cx="16.87" cy="6.3" r="1.5" fill="currentColor"/>',

  message:
    `<path ${STROKE} d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6.5L8 20.5V17H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/>`,

  settings:
    `<g ${STROKE}><path d="M4 7h7M17 7h3M4 12h2M12 12h8M4 17h9M19 17h1"/>` +
    '<circle cx="14" cy="7" r="2.2"/><circle cx="9" cy="12" r="2.2"/><circle cx="16" cy="17" r="2.2"/></g>',

  send:
    `<path ${STROKE} d="M12 19V6M6.5 11.5 12 6l5.5 5.5"/>`,

  close:
    `<path ${STROKE} d="M6 6l12 12M18 6 6 18"/>`,
};

export function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((svg) => {
    const markup = ICONS[svg.dataset.icon];
    if (!markup) return;
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML = markup;   // texto fijo definido arriba, nunca datos del usuario
  });
}
