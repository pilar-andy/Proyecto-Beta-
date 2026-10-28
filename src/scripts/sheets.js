/**
 * sheets.js — hojas modales (historial y ajustes).
 *
 * Mientras una hoja está abierta, el resto de la interfaz queda `inert` (sin foco ni
 * clics); al cerrar, el foco vuelve al botón que la abrió. Esc y tocar el velo cierran.
 */

export function createSheet({ sheet, scrim, ui, onChange }) {
  let isOpen = false;
  let opener = null;

  sheet.inert = true;

  function open(trigger) {
    if (isOpen) return;
    isOpen = true;
    opener = trigger ?? document.activeElement;
    sheet.inert = false;
    ui.inert = true;
    sheet.classList.add('is-open');
    scrim.classList.add('is-open');
    sheet.querySelector('[data-close]')?.focus({ preventScroll: true });
    onChange?.(true);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    sheet.classList.remove('is-open');
    scrim.classList.remove('is-open');
    ui.inert = false;
    sheet.inert = true;
    opener?.focus?.({ preventScroll: true });
    onChange?.(false);
  }

  scrim.addEventListener('click', close);
  sheet.querySelectorAll('[data-close]').forEach((btn) => btn.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });

  return {
    open,
    close,
    get isOpen() { return isOpen; },
  };
}
