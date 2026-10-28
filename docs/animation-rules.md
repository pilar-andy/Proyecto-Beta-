# Reglas de animación

Todo el movimiento vive en `src/styles/motion.css`. Tiempos y curvas viven en `src/styles/tokens.css`. Estas reglas vienen de Deep Op y se aplican a cualquier animación nueva.

## 1. Solo `transform` / `translate` / `scale` / `rotate` / `opacity`
Para mantener 60 FPS cada fotograma debe caber en 16,6 ms. Esas propiedades solo pasan por la etapa de composición (GPU). `width`, `height`, `top`, `left`, `margin` y `padding` **nunca** se animan; `box-shadow`, `filter` y `border-radius` tampoco (se mantienen estáticos).

En este proyecto:
- El cambio entre Interfaz 1 y 2 mueve `translate` del carril (`--base` + `--drag`).
- Las hojas (historial, ajustes) se mueven con `translate`; el velo, con `opacity`.
- El diagrama anima `scale` y `opacity` en sus halos y `rotate` en la órbita.

## 2. Duraciones y curvas = tokens
No se escriben milisegundos ni `cubic-bezier` sueltos en `motion.css`. **Entrar es más lento que salir** (hojas: 380 ms al abrir, 260 ms al cerrar). Se evita `linear`, salvo el giro continuo de la órbita.

## 3. Movimiento reducido
Todo el movimiento va dentro de `@media (prefers-reduced-motion: no-preference)`. Con «reducir movimiento» solo hay fundidos cortos de opacidad (bloque final): las pantallas se cruzan con fundido, las hojas aparecen con fundido, no hay animaciones continuas.

## 4. `will-change` solo mientras dura
`.track.is-dragging` activa `will-change: translate` solo durante el arrastre.

## 5. Arrastre entre pantallas
`pager.js` solo escribe dos variables CSS (`--base`, `--drag`) dentro de `requestAnimationFrame`. Mientras se arrastra no hay transición (el dedo manda); al soltar, se quita `is-dragging` y el carril se asienta con la transición normal.

## 6. Lista de comprobación para animaciones nuevas
- [ ] ¿Solo anima `transform` / `opacity`?
- [ ] ¿Usa tokens de duración y curva?
- [ ] ¿Entrar es más lento que salir?
- [ ] ¿Está dentro de `prefers-reduced-motion: no-preference`, con un fundido como mucho para movimiento reducido?
- [ ] ¿Si lleva `will-change`, solo mientras dura?
- [ ] ¿Se comprobó en DevTools (Performance y *paint flashing*)?
