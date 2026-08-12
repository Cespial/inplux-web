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
 * `verifyProductNavigation()` en `scripts/verify-public-content.mjs`: si un
 * perfil no tiene su entrada aquí —o si aquí sobra algo que no es un perfil—
 * el build se detiene. Porkia estuvo ausente de este pie, en producción, hasta
 * que ese control existió.
 */
export const productNavigation = [
  ["Tribai", "/trabajo/tribai"],
  ["Gobia", "/trabajo/gobia"],
  ["Kelsen", "/trabajo/kelsen"],
  ["Laudos", "/trabajo/laudos"],
  ["Porkia", "/trabajo/porkia"],
] as const;
