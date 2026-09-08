/**
 * El ribbon de «Lo que hemos construido» se dibuja como retícula, y el conteo
 * de tarjetas —la intro, los productos confirmados y el enlace al directorio—
 * cambia con `src/content/work.ts`. Para que el último renglón cierre en una
 * retícula de `columns` columnas, la última tarjeta se estira sobre las que
 * sobran; esta función dice cuántas son. Devuelve 1 cuando el conteo ya cierra
 * por su cuenta.
 *
 * El CSS decide cuántas columnas hay en cada breakpoint, así que el componente
 * publica un tramo por cada conteo declarado —`--ribbon-fill-N`— y el
 * breakpoint elige el suyo. `scripts/verify-ribbon-grid.test.mjs` vigila que
 * las dos listas coincidan y que la aritmética cierre para cualquier conteo.
 *
 * Vive en su propio módulo, sin importar CSS, para que la prueba pueda
 * interrogarlo con `tsx` sin arrastrar el árbol de estilos del sitio.
 */
export function ribbonFillSpan(cells: number, columns: number) {
  const remainder = cells % columns;
  return remainder === 0 ? 1 : columns - remainder + 1;
}
