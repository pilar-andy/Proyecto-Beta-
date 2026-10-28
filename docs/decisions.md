# Decisiones de diseño

Cada decisión dice **qué** se decidió y **por qué**, para no discutirla dos veces.

## D1. Sin chat tradicional como pantalla principal
La pantalla principal es una bienvenida y una sola conversación del momento. El historial vive aparte, en una hoja. Así la app se siente como un agente que trabaja, no como una ventana de mensajes.

## D2. El orbe se sustituye por una imagen o un video
El centro de la pantalla principal es un hueco configurable (`src/media/hero.js`). Hoy hay un campo de color de relleno que no es un orbe. Los videos se reproducen sin sonido y en bucle, y se pausan si el teléfono tiene «reducir animaciones», si la pantalla no se ve o si la pestaña está en segundo plano.

## D3. El botón de compra de la referencia se reemplaza por ajustes y mensaje
Los dos botones están arriba a la derecha, donde la referencia tenía el carrito.

## D4. El mensaje enviado desaparece
Al enviar, el texto sube y se desvanece (`.ghost`). No queda en la pantalla principal; está en el historial.

## D5. La Interfaz 2 solo existe mientras el agente trabaja
- Se llega deslizando a la izquierda (o con el segundo punto).
- Fuera de ese momento el arrastre ofrece resistencia y vuelve: se nota que existe pero está bloqueada.
- Al terminar la tarea, la app vuelve sola a la Interfaz 1.
- Volver a mano (deslizar a la derecha o el primer punto) siempre se puede.

## D6. Consistencia entre las dos interfaces
Mismo título grande (`--fs-title`), misma fila de etiquetas diminutas (`01 — AGENTE`, `02 — ESTRUCTURA`), mismos radios, mismo violeta/azul, mismo panel. Los colores y medidas salen de `tokens.css`; no hay valores sueltos.

## D7. Inspiración de las referencias (sin copiar)
- Referencia 1 (menú circular): la idea de un diagrama en anillo para la estructura, dibujado desde cero.
- Referencia 2 (web minimalista gris): tipografía diminuta en mayúsculas, numeración `01/02`, puntos de paginación y el panel redondeado.
- Referencia 3 (íconos): superficies redondeadas con degradado y brillo suave. El ícono es original: un anillo abierto con un núcleo y un punto que orbita.

## D8. Tema claro, oscuro o del sistema
Por defecto sigue al teléfono. Se cambia en Ajustes.

## D9. Instalable y sin conexión
Se incluyó manifiesto y service worker porque la idea es una app. Regla: al tocar archivos, actualizar `PRECACHE` y subir `VERSION` en `sw.js`.

## D10. Accesibilidad
Todo el movimiento va en `prefers-reduced-motion: no-preference`. Las hojas bloquean el resto con `inert`, devuelven el foco al botón que las abrió y se cierran con Esc. El estado del agente se avisa a lectores de pantalla con una región oculta, sin repetir cada paso.

## Preguntas abiertas
- Nombre definitivo de la app (hoy «Proyecto Beta» / «Beta»; está en `index.html` y en `manifest.webmanifest`).
- Imagen o video definitivo del centro.
- Qué debe mostrar la Interfaz 2 cuando haya APIs reales (hoy: capas y pasos de demostración).
- Si la Interfaz 2 debe poder abrirse también con la tarea terminada, para consultar qué hizo (hoy no, por diseño).
