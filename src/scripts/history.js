/**
 * history.js — la lista de mensajes del historial.
 * Mientras el agente trabaja, al final aparece una burbuja con tres puntos.
 */

import { getHistory } from './storage.js';
import { state, subscribe, PHASE } from './state.js';

export function createHistoryView(list) {
  const working = document.createElement('li');
  working.className = 'bubble bubble--agent bubble--working';
  working.setAttribute('aria-hidden', 'true');
  working.innerHTML = '<i></i><i></i><i></i>';   // texto fijo

  const empty = document.createElement('li');
  empty.className = 'history-empty';
  empty.textContent = 'Aún no hay mensajes. Lo que escribas aparecerá aquí.';

  const scrollEnd = () => { list.scrollTop = list.scrollHeight; };

  function makeBubble(message, isNew) {
    const li = document.createElement('li');
    li.className = `bubble bubble--${message.role === 'user' ? 'user' : 'agent'}${isNew ? ' is-new' : ''}`;
    li.textContent = message.text;
    return li;
  }

  function syncWorking() {
    if (state.phase === PHASE.WORKING) list.append(working);
    else working.remove();
  }

  /** Redibuja todo (al abrir el historial o tras borrarlo). */
  function renderAll() {
    list.replaceChildren();
    const messages = getHistory();
    if (messages.length === 0) list.append(empty);
    messages.forEach((m) => list.append(makeBubble(m, false)));
    syncWorking();
    scrollEnd();
  }

  /** Añade un mensaje nuevo al final sin redibujar. */
  function append(message) {
    empty.remove();
    list.insertBefore(makeBubble(message, true), working.isConnected ? working : null);
    scrollEnd();
  }

  subscribe(() => {
    syncWorking();
    scrollEnd();
  });

  return { renderAll, append };
}
