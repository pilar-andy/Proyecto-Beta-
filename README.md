# Proyecto Beta

Interfaz de un agente de IA. **Esto es solo diseño y estructura:** todavía no hay ninguna API conectada. El agente es una simulación (`src/scripts/agent.js`) que reproduce el ritmo de una tarea para poder diseñar y probar la interfaz.

HTML, CSS y JavaScript con módulos ES, sin compilación. Instalable como app (PWA) y funciona sin conexión.

## Cómo verla

Los módulos ES necesitan un servidor (no se pueden abrir con doble clic):

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

También funciona en GitHub Pages sin tocar nada (las rutas son relativas).

## Cómo funciona

**Interfaz 1 — pantalla principal.** Al entrar solo hay un mensaje de bienvenida, la imagen o el video central, un campo para escribir y dos botones arriba: **historial** y **ajustes**.

1. Escribes y envías: tu mensaje se desvanece.
2. El agente trabaja (estado «Trabajando») y se puede deslizar a la Interfaz 2.
3. Al terminar, la app vuelve sola a la Interfaz 1 y muestra la respuesta.

El botón de mensaje abre el **historial** (también se puede escribir desde ahí). Al cerrarlo, la pantalla principal solo muestra la conversación del momento.

**Interfaz 2 — estructura.** Se llega deslizando hacia la izquierda, **solo mientras el agente trabaja** (con el punto de abajo también). Muestra el diagrama de la IA, los pasos de la tarea en curso y las capas de la estructura. Si se intenta deslizar fuera de ese momento, el arrastre se resiste y vuelve.

| Estado | Qué se ve | ¿Interfaz 2? |
|---|---|---|
| En espera | Bienvenida | No |
| Trabajando | «Trabajando…» + paso actual | Sí |
| Listo | Respuesta del agente | No (vuelve sola) |

## Estructura del proyecto

```
index.html                 esqueleto, nada de lógica
manifest.webmanifest       datos de instalación
sw.js                      funcionar sin conexión (ver «Regla» abajo)
src/
  styles/
    tokens.css             única fuente de colores, medidas, tiempos y curvas
    base.css  layout.css  motion.css
    components/            buttons · hero · message · composer · sheet · structure
  scripts/
    main.js                arranque y flujo de una tarea
    state.js               estado del agente (en espera · trabajando · listo)
    agent.js               EL AGENTE (simulación; aquí se conectará la API)
    pager.js               deslizar entre las dos interfaces
    structure.js · structure-data.js   contenido de la Interfaz 2
    history.js · sheets.js · settings.js · composer.js · hero.js · theme.js · storage.js
  icons/
    icons.js               todos los iconos de la interfaz
    app/                   ícono de la app (SVG + PNG)
  media/
    hero.js                qué se muestra en el centro (imagen o video)
docs/
  decisions.md             decisiones de diseño y preguntas abiertas
  animation-rules.md       reglas de movimiento
```

## Cosas que se cambian en un solo sitio

- **Imagen o video central:** `src/media/hero.js` (instrucciones dentro).
- **Colores, tamaños, tiempos:** `src/styles/tokens.css`.
- **Textos de la estructura:** `src/scripts/structure-data.js`.
- **Conectar el agente real:** reemplazar el cuerpo de `runAgent()` en `src/scripts/agent.js`. El contrato (`runAgent(texto, { onStep, signal }) → Promise<string>`) está documentado arriba del archivo; el resto de la app no cambia.

## Regla

Al añadir, borrar o renombrar archivos, actualiza `PRECACHE` y sube `VERSION` en `sw.js`.

## Relación con Deep Op

Se reutilizó solo un poco del diseño de Deep Op: estructura «panel dentro de marco», radios, violeta y azul de acento, tipografía Outfit, curvas y duraciones de movimiento, y sus reglas de animación. Son proyectos separados: no comparten código ni dependencias.
