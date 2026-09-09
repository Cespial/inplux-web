/**
 * La portada dibuja dos retículas cuyo número de celdas no está fijado en el
 * CSS: el ribbon de productos —que sale de `src/content/work.ts`— y el muro de
 * logos —que sale de la lista de relaciones—. Las dos crecen sin avisar, y en
 * las dos el último renglón tiene que cerrar completo: un renglón a medio
 * llenar deja bordes que prometen una tarjeta que no está.
 *
 * La regla es la misma para ambas: una celda designada se estira sobre las
 * columnas que sobran. Esta función dice cuántas son. Devuelve 1 cuando el
 * conteo ya cierra por su cuenta.
 *
 * El CSS decide cuántas columnas hay en cada breakpoint, así que el componente
 * publica un tramo por cada conteo declarado —`--ribbon-fill-N`, `--wall-fill-N`—
 * y el breakpoint elige el suyo. `scripts/verify-grid-fill.test.mjs` vigila que
 * las listas de conteos del CSS y del componente coincidan.
 *
 * Vive en su propio módulo, sin importar CSS, para que la prueba pueda
 * interrogarlo con `tsx` sin arrastrar el árbol de estilos del sitio.
 */
export function fillSpan(cells: number, columns: number) {
  const remainder = cells % columns;
  return remainder === 0 ? 1 : columns - remainder + 1;
}
