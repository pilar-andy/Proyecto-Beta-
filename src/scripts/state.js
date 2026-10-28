/**
 * state.js — el estado del agente. Todo lo que cambia en pantalla sale de aquí.
 *
 *   phase  'idle' (en espera) · 'working' (trabajando) · 'done' (listo)
 *   step   paso actual mientras trabaja (0, 1, 2…), -1 si no trabaja
 *   reply  última respuesta del agente (solo en 'done')
 *   turn   contador de tareas; sirve para saber cuándo hay que animar un texto nuevo
 */

export const PHASE = Object.freeze({ IDLE: 'idle', WORKING: 'working', DONE: 'done' });

export const state = { phase: PHASE.IDLE, step: -1, reply: null, turn: 0 };

const listeners = new Set();

export function set(patch) {
  Object.assign(state, patch);
  listeners.forEach((fn) => fn(state));
}

/** Llama a fn ahora mismo y cada vez que cambie el estado. */
export function subscribe(fn) {
  listeners.add(fn);
  fn(state);
  return () => listeners.delete(fn);
}
