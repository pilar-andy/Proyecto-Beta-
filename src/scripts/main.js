/**
 * main.js — arranque y conexión de todas las piezas.
 *
 * Flujo de una tarea:
 *   enviar mensaje → el texto se desvanece → phase 'working' (se puede deslizar a la
 *   Interfaz 2) → el agente responde → phase 'done' → vuelve sola a la Interfaz 1
 *   y muestra la respuesta.
 */

import { hydrateIcons } from '../icons/icons.js';
import { initTheme } from './theme.js';
import { state, set, subscribe, PHASE } from './state.js';
import { runAgent, STEP_LABELS } from './agent.js';
import { addMessage, clearHistory } from './storage.js';
import { initHero } from './hero.js';
import { createPager } from './pager.js';
import { createComposer } from './composer.js';
import { createSheet } from './sheets.js';
import { createHistoryView } from './history.js';
import { initSettings } from './settings.js';
import { initStructure } from './structure.js';

const $ = (id) => document.getElementById(id);

hydrateIcons();
initTheme();

const panel = $('panel');
const ui = $('ui');
let hero = null;   // se crea más abajo; los callbacks lo usan cuando ya existe

/* ---------- Hojas: historial y ajustes ---------- */

const historyView = createHistoryView($('historyList'));

const sheets = {
  history: createSheet({
    sheet: $('sheetHistory'),
    scrim: $('scrimHistory'),
    ui,
    onChange: (open) => {
      if (open) historyView.renderAll();
      hero?.sync();
    },
  }),
  settings: createSheet({
    sheet: $('sheetSettings'),
    scrim: $('scrimSettings'),
    ui,
    onChange: () => hero?.sync(),
  }),
};

const anySheetOpen = () => sheets.history.isOpen || sheets.settings.isOpen;

$('btnHistory').addEventListener('click', (e) => sheets.history.open(e.currentTarget));
$('btnSettings').addEventListener('click', (e) => sheets.settings.open(e.currentTarget));

initSettings({
  form: $('settingsForm'),
  clearButton: $('btnClear'),
  onClear: () => {
    clearHistory();
    historyView.renderAll();
  },
});

/* ---------- Interfaz 1 ↔ Interfaz 2 ---------- */

const dots = [...document.querySelectorAll('.dot')];

const pager = createPager({
  viewport: $('panes'),
  track: $('track'),
  panes: [$('paneMain'), $('paneInfo')],
  dots,
  canEnter: () => state.phase === PHASE.WORKING,
  onChange: () => hero?.sync(),
});

hero = initHero($('hero'), { isActive: () => pager.index === 0 && !anySheetOpen() });

initStructure({ diagram: $('diagram'), steps: $('steps'), layers: $('layers') });

/* ---------- Texto principal (bienvenida · trabajando · respuesta) ---------- */

const msgTitle = $('msgTitle');
const msgBody = $('msgBody');
const msgHint = $('msgHint');
const announceEl = $('announce');

const STATUS_TEXT = {
  [PHASE.IDLE]: 'En espera',
  [PHASE.WORKING]: 'Trabajando',
  [PHASE.DONE]: 'Listo',
};

/** Reinicia la animación de entrada de un elemento. */
function retrigger(el) {
  el.classList.remove('swap');
  void el.offsetWidth;   // fuerza el recálculo para que la animación arranque de nuevo
  el.classList.add('swap');
}

/** Avisa a los lectores de pantalla sin ocupar espacio en la interfaz. */
function announce(text) {
  announceEl.textContent = '';
  requestAnimationFrame(() => { announceEl.textContent = text; });
}

let lastKey = null;

function renderMessage(s) {
  const key = `${s.phase}:${s.turn}`;
  const isNewBlock = key !== lastKey;

  let title = 'Hola.';
  let body = 'Escríbeme lo que necesitas y me pongo a trabajar.';
  let showHint = false;

  if (s.phase === PHASE.WORKING) {
    title = 'Trabajando…';
    body = `${STEP_LABELS[s.step] ?? STEP_LABELS[0]}…`;
    showHint = true;
  } else if (s.phase === PHASE.DONE) {
    title = 'Listo.';
    body = s.reply ?? '';
  }

  if (isNewBlock) {
    msgTitle.textContent = title;
    retrigger(msgTitle);
    msgBody.textContent = body;
    retrigger(msgBody);
    if (showHint) retrigger(msgHint);
  } else if (msgBody.textContent !== body) {
    msgBody.textContent = body;      // solo cambia el paso: se anima solo la línea
    retrigger(msgBody);
  }

  msgHint.hidden = !showHint;
  lastKey = key;
}

let lastPhase = state.phase;

subscribe((s) => {
  const status = $('status');
  status.dataset.phase = s.phase;
  $('statusText').textContent = STATUS_TEXT[s.phase];

  $('hero').classList.toggle('is-working', s.phase === PHASE.WORKING);

  // La Interfaz 2 solo está disponible mientras el agente trabaja.
  dots[1].disabled = s.phase !== PHASE.WORKING;

  renderMessage(s);

  if (s.phase !== lastPhase) {
    if (s.phase === PHASE.WORKING) announce('El agente está trabajando. Puedes ver la estructura en la segunda pantalla.');
    if (s.phase === PHASE.DONE) announce(`Listo. ${s.reply ?? ''}`);
    lastPhase = s.phase;
  }
});

/* ---------- Enviar un mensaje ---------- */

/** El mensaje enviado se queda un instante flotando y se desvanece. */
function spawnGhost(text, rect) {
  const p = panel.getBoundingClientRect();
  const ghost = document.createElement('div');
  ghost.className = 'ghost';
  ghost.textContent = text;
  ghost.style.left = `${rect.left - p.left - 18}px`;
  ghost.style.top = `${rect.top - p.top}px`;
  ghost.style.width = `${rect.width + 36}px`;
  ghost.style.height = `${rect.height}px`;
  ghost.style.lineHeight = `${rect.height}px`;
  panel.append(ghost);

  const remove = () => ghost.remove();
  ghost.addEventListener('animationend', remove, { once: true });
  setTimeout(remove, 1200);   // por si la animación no llega a correr
}

function finish(reply) {
  addMessage('agent', reply);
  historyView.append({ role: 'agent', text: reply });
  set({ phase: PHASE.DONE, step: -1, reply });
  pager.go(0);                 // al terminar, vuelve sola a la Interfaz 1
}

async function send(text, rect) {
  if (state.phase === PHASE.WORKING) return;

  addMessage('user', text);
  historyView.append({ role: 'user', text });
  spawnGhost(text, rect);
  set({ phase: PHASE.WORKING, step: 0, reply: null, turn: state.turn + 1 });

  try {
    const reply = await runAgent(text, { onStep: (i) => set({ step: i }) });
    finish(reply);
  } catch (error) {
    if (error?.name === 'AbortError') return;
    finish('No se pudo completar la tarea. Inténtalo de nuevo.');
  }
}

createComposer($('composerMain'), { onSend: send });
createComposer($('composerSheet'), { onSend: send });

/* ---------- Funcionar sin conexión ---------- */

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* sin sw: la app funciona igual */ });
  });
}
