/**
 * storage.js — guardado local (localStorage) con tolerancia a fallos.
 * Si el almacenamiento no está disponible (modo privado, bloqueado…), la app sigue
 * funcionando: simplemente no recuerda nada entre visitas.
 */

const PREFIX = 'beta.';
const MAX_MESSAGES = 200;

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* sin almacenamiento: se ignora */
  }
}

/* ---------- Historial del chat ---------- */

export function getHistory() {
  const list = load('history', []);
  return Array.isArray(list) ? list : [];
}

export function addMessage(role, text) {
  const list = getHistory();
  list.push({ role, text, t: Date.now() });
  save('history', list.slice(-MAX_MESSAGES));
}

export function clearHistory() {
  save('history', []);
}
