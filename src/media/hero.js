/**
 * hero.js — QUÉ SE MUESTRA EN EL CENTRO DE LA PANTALLA PRINCIPAL (sustituye al orbe).
 *
 * Para usar tu propia imagen o video:
 *   1. Copia el archivo a esta carpeta (src/media/).
 *   2. Cambia los valores de abajo.
 *   3. Añade el archivo a PRECACHE en sw.js (y sube VERSION) para que funcione sin conexión.
 *
 * Imagen:  { type: 'image', src: 'src/media/mi-imagen.jpg', alt: 'Descripción' }
 * Video:   { type: 'video', src: 'src/media/mi-video.mp4', poster: 'src/media/mi-poster.jpg', alt: '' }
 *          (se reproduce en bucle y sin sonido; se detiene si el teléfono tiene «reducir
 *          animaciones», cuando no está a la vista y con la pestaña en segundo plano)
 *
 * El contenido se recorta para llenar el espacio (object-fit: cover): usa algo cuyo
 * centro sea lo importante.
 */

export const HERO = {
  type: 'image',
  src: 'src/media/hero-placeholder.svg',
  poster: '',
  alt: '',   // vacío = decorativa. Si la imagen aporta información, descríbela aquí.
};
