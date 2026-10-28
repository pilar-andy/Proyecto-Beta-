/**
 * structure-data.js — contenido de la Interfaz 2 (información de la estructura de IA).
 * Es solo texto: al cambiar algo aquí, la pantalla se actualiza sola.
 * Los estados son honestos: hoy no hay nada real conectado.
 */

export const LAYERS = [
  { id: 'input',  name: 'Entrada',      tag: 'Demo',         text: 'Tu mensaje llega al agente.' },
  { id: 'agent',  name: 'Agente',       tag: 'Pendiente',    text: 'El modelo de IA que decide qué hacer. Aún sin definir.' },
  { id: 'tools',  name: 'Herramientas', tag: 'Sin conectar', text: 'GitHub y otros servicios por API (podrían ser hasta 40). Ninguno conectado todavía.' },
  { id: 'memory', name: 'Memoria',      tag: 'Pendiente',    text: 'Lo que el agente recuerda entre una tarea y otra.' },
  { id: 'output', name: 'Salida',       tag: 'Demo',         text: 'La respuesta que aparece en la pantalla principal.' },
];

/** Qué parte de la estructura se ilumina en cada paso de la tarea (ver STEP_LABELS). */
export const STEP_NODES = ['input', 'agent', 'tools', 'output'];
