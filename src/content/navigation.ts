export const publicNavigation = [
  ["La fábrica", "/fabrica"],
  ["Trabajo real", "/trabajo"],
  ["Qué construimos", "/capacidades"],
  ["Nosotros", "/nosotros"],
  ["Prensa", "/prensa"],
] as const;

/**
 * Los productos del pie, escritos a mano y vigilados por el build.
 *
 * No se derivan de `workProfiles` a propósito. `src/content/copy/es.ts` importa
 * este módulo y a su vez lo importan media docena de componentes cliente
 * (`HeroSignal`, `FactoryScrolly`, `SolutionsShowcase`, `ProjectCreateDemo`,
 * `FactoryRun`…), así que un import de valor de `work.ts` desde aquí arrastra
 * los cinco perfiles enteros al navegador: medido, +33.387 bytes de JS cliente
 * repartidos en tres chunks. Es el mismo problema que obligó a mover las
 * funciones de fecha a `work-format.ts`.
 *
 * Lo que impide que esta lista se desincronice de `work.ts` es
 * `verifyProductFooter()` en `scripts/verify-build-output.mjs`, que no lee este
 * archivo: lee los `<a href>` del `<nav aria-label="Productos documentados">`
 * del HTML ya construido y exige biyección con los perfiles —ruta y etiqueta—.
 * Da igual cómo se escriba esta lista, e incluso da igual que el pie deje de
 * consumirla: lo que se juzga es el enlace que recibe el navegador. Porkia
 * estuvo ausente de este pie, en producción, hasta que ese control existió.
 */
export const productNavigation = [
  ["Tribai", "/trabajo/tribai"],
  ["Gobia", "/trabajo/gobia"],
  ["Kelsen", "/trabajo/kelsen"],
  ["Laudos", "/trabajo/laudos"],
  ["Porkia", "/trabajo/porkia"],
] as const;
