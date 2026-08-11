/**
 * Interpola una plantilla de copy.
 *
 * El copy viaja del servidor a los componentes de cliente, así que no puede
 * contener funciones: las cadenas con parte variable se declaran como plantillas
 * con marcadores `{nombre}` y se resuelven aquí.
 */
export function formatCopy(
  template: string,
  values: Readonly<Record<string, string | number>>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
