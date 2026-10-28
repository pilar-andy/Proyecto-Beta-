/**
 * composer.js — el campo para escribir. Se usa dos veces (pantalla principal e historial);
 * ambos se bloquean mientras el agente trabaja.
 */

import { state, subscribe, PHASE } from './state.js';

export function createComposer(form, { onSend }) {
  const input = form.querySelector('input');
  const button = form.querySelector('button[type="submit"]');

  function sync() {
    const busy = state.phase === PHASE.WORKING;
    input.disabled = busy;
    input.placeholder = busy ? 'Trabajando…' : 'Escribe un mensaje';
    button.disabled = busy || input.value.trim() === '';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text || state.phase === PHASE.WORKING) return;
    const rect = input.getBoundingClientRect();   // antes de bloquearlo
    input.value = '';
    onSend(text, rect);
    sync();
  });

  input.addEventListener('input', sync);
  subscribe(sync);
}
