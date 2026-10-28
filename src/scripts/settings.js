/**
 * settings.js — hoja de ajustes: tema y borrar historial.
 * Borrar pide una segunda pulsación (se desarma solo a los 4 s) para evitar accidentes.
 */

import { getPref, setPref } from './theme.js';

const ARM_MS = 4000;
const LABEL = 'Borrar historial';
const LABEL_ARMED = '¿Seguro? Toca otra vez';

export function initSettings({ form, clearButton, onClear }) {
  const current = form.querySelector(`input[name="theme"][value="${getPref()}"]`);
  if (current) current.checked = true;

  form.addEventListener('change', (e) => {
    if (e.target.name === 'theme') setPref(e.target.value);
  });

  let timer = 0;

  function disarm() {
    clearTimeout(timer);
    clearButton.dataset.armed = 'false';
    clearButton.textContent = LABEL;
  }

  clearButton.addEventListener('click', () => {
    if (clearButton.dataset.armed === 'true') {
      disarm();
      onClear();
      return;
    }
    clearButton.dataset.armed = 'true';
    clearButton.textContent = LABEL_ARMED;
    timer = setTimeout(disarm, ARM_MS);
  });
}
