/**
 * agent.js — EL AGENTE (por ahora, una simulación).
 *
 * Todavía no hay ninguna API conectada: esto solo reproduce el ritmo de una tarea
 * (cuatro pasos y una respuesta de demostración) para poder diseñar y probar la interfaz.
 *
 * Cuando exista el agente real, solo hay que reemplazar el cuerpo de runAgent() manteniendo
 * el mismo contrato y el resto de la app no cambia:
 *
 *   runAgent(texto, { onStep(i), signal }) → Promise<string>
 *     · onStep(i)  se llama cada vez que empieza el paso i (índice en STEP_LABELS)
 *     · signal     AbortSignal para cancelar
 *     · resuelve con el texto de la respuesta; rechaza si falla
 */

export const STEP_LABELS = [
  'Mensaje recibido',
  'Planificando',
  'Usando herramientas',
  'Redactando la respuesta',
];

const STEP_MS = 1400;   // duración de cada paso en la simulación

function demoReply(text) {
  const short = text.length > 80 ? `${text.slice(0, 80)}…` : text;
  return (
    'Esta es una respuesta de demostración. Todavía no hay ninguna API conectada, ' +
    `así que no hice nada real con tu mensaje: «${short}».`
  );
}

export function runAgent(text, { onStep, signal } = {}) {
  return new Promise((resolve, reject) => {
    const timers = [];

    const cancel = () => {
      timers.forEach(clearTimeout);
      reject(new DOMException('Cancelado', 'AbortError'));
    };

    if (signal?.aborted) return cancel();
    signal?.addEventListener('abort', cancel, { once: true });

    STEP_LABELS.forEach((_, i) => {
      timers.push(setTimeout(() => onStep?.(i), i * STEP_MS));
    });
    timers.push(setTimeout(() => resolve(demoReply(text)), STEP_LABELS.length * STEP_MS));
  });
}
