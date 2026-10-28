/**
 * pager.js — pasar de la Interfaz 1 a la Interfaz 2 deslizando.
 *
 * Reglas del diseño:
 *  · Solo se puede ir a la Interfaz 2 mientras el agente trabaja (canEnter()).
 *  · Si no se puede, el arrastre ofrece una pequeña resistencia y vuelve: así se nota que
 *    existe pero está bloqueada.
 *  · Volver a la Interfaz 1 siempre se puede (deslizando, con el punto o automáticamente).
 *
 * Solo se mueve `translate` del carril, mediante dos variables CSS (--base y --drag).
 * El gesto no arranca sobre campos, botones ni enlaces: ahí manda el elemento.
 */

const INTERACTIVE = 'input, textarea, button, a, label, select';
const COMMIT = 0.22;      // fracción del ancho que hay que arrastrar para cambiar
const FLICK = 0.5;        // px/ms: un gesto rápido cambia aunque sea corto
const RESIST = 24;        // px máximos de resistencia cuando el cambio no está permitido

export function createPager({ viewport, track, panes, dots, canEnter, onChange }) {
  let index = 0;
  let drag = null;
  let raf = 0;

  const setVar = (name, value) => track.style.setProperty(name, value);

  function render() {
    setVar('--base', String(index));
    panes.forEach((pane, i) => { pane.inert = i !== index; });
    dots.forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function go(target) {
    const next = target === 1 && !canEnter() ? 0 : target;
    if (drag?.on) cancelDrag();
    const changed = next !== index;
    index = next;
    render();
    if (changed) onChange?.(index);
  }

  /* ---------- Arrastre ---------- */

  const rubber = (dx) => Math.sign(dx) * Math.min(RESIST, Math.abs(dx) * 0.18);

  function effective(dx, width) {
    const toSecond = index === 0 && canEnter();   // arrastrar a la izquierda
    const toFirst = index === 1;                  // arrastrar a la derecha
    if (dx < 0 && !toSecond) return rubber(dx);
    if (dx > 0 && !toFirst) return rubber(dx);
    return Math.max(-width, Math.min(width, dx));
  }

  function paint() {
    raf = 0;
    if (drag?.on) setVar('--drag', `${effective(drag.dx, drag.w)}px`);
  }

  function cancelDrag() {
    cancelAnimationFrame(raf);
    raf = 0;
    if (drag?.on) {
      try { viewport.releasePointerCapture(drag.id); } catch { /* ya liberado */ }
    }
    drag = null;
    track.classList.remove('is-dragging');
    setVar('--drag', '0px');
  }

  viewport.addEventListener('pointerdown', (e) => {
    if (drag) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest(INTERACTIVE)) return;
    drag = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      dx: 0,
      on: false,
      w: viewport.clientWidth,
      lastX: e.clientX,
      lastT: performance.now(),
      vx: 0,
    };
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;

    const dx = e.clientX - drag.x0;
    const dy = e.clientY - drag.y0;

    if (!drag.on) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { drag = null; return; }   // es un desplazamiento vertical
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        drag.on = true;
        drag.x0 = e.clientX;                 // el arrastre empieza en 0: sin salto de 10 px
        viewport.setPointerCapture(e.pointerId);
        track.classList.add('is-dragging');
      } else {
        return;
      }
    }

    const now = performance.now();
    const dt = now - drag.lastT;
    if (dt > 0) drag.vx = (e.clientX - drag.lastX) / dt;
    drag.lastX = e.clientX;
    drag.lastT = now;

    drag.dx = e.clientX - drag.x0;
    if (!raf) raf = requestAnimationFrame(paint);
  });

  function end(e, cancelled) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    if (!d.on) { drag = null; return; }

    const moved = effective(d.dx, d.w);
    const far = Math.abs(moved) > d.w * COMMIT;
    const flick = !cancelled && Math.abs(d.vx) > FLICK;

    let target = index;
    if (index === 0 && moved < 0 && (far || (flick && d.vx < 0))) target = 1;
    if (index === 1 && moved > 0 && (far || (flick && d.vx > 0))) target = 0;

    cancelDrag();       // quita is-dragging y pone --drag a 0: el carril se asienta con transición
    go(target);
  }

  viewport.addEventListener('pointerup', (e) => end(e, false));
  viewport.addEventListener('pointercancel', (e) => end(e, true));

  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));

  render();

  return {
    go,
    get index() { return index; },
  };
}
