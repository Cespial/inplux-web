import type { WorkSource } from "./work";

/**
 * Formato de fechas de verificación, sin un solo dato de producto dentro.
 *
 * Vive separado de `work.ts` a propósito. `ProjectShowcase.client.tsx` es un
 * componente cliente y necesita `verificationDateFor`; si la importa del mismo
 * módulo que exporta `workProfiles`, Turbopack no sacude el literal —
 * empaqueta el arreglo completo de perfiles en el chunk de `/trabajo` y lo
 * manda al navegador duplicando lo que ya viaja serializado en el payload RSC.
 * Con las funciones aquí, el cliente importa solo funciones y el tipo (que se
 * borra en compilación), y los perfiles se quedan en el servidor.
 */

const monthLabels = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
] as const;

/**
 * `2026-08-11` → `11 AGO 2026`.
 *
 * Es el registro compacto de los pies en monoespaciada (`CAPTURA DE NAVEGADOR ·
 * 11 AGO 2026`), no el de la tabla de evidencia de `/trabajo/[slug]`, que
 * escribe `11 DE AGO DE 2026` con su propio `formatVerifiedDate` local. Son dos
 * formatos porque son dos superficies distintas, no por descuido.
 *
 * Formatea la cadena literal y nunca construye un `Date`: el servidor y el
 * navegador imprimen exactamente lo mismo, y ninguna zona horaria puede correr
 * la fecha un día. Si la cadena no tiene la forma esperada devuelve el original,
 * que sigue siendo una fecha legible.
 */
export function formatShortDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-");
  const monthLabel = monthLabels[Number(month) - 1];
  return year && monthLabel && day ? `${day} ${monthLabel} ${year}` : isoDate;
}

/**
 * Fecha en que se revisó por última vez la fuente que publica esa `url`.
 *
 * Las pantallas que enmarcan una URL oficial —la vitrina de `/trabajo`, la
 * evidencia de `/capacidades`— la leen de aquí en vez de escribirla a mano: si
 * una fuente se vuelve a verificar, el pie de esa pantalla se mueve con ella y
 * no queda una fecha vieja contradiciendo al perfil.
 *
 * Si la `url` no coincide con ninguna fuente, cae a la verificación más
 * reciente del perfil antes que a una fecha inventada.
 */
export function verificationDateFor(
  sources: readonly WorkSource[],
  url: string,
) {
  const matched = sources.find((source) => source.url === url);
  const latest = sources.reduce(
    (newest, source) => (source.verifiedAt > newest ? source.verifiedAt : newest),
    "",
  );
  return formatShortDate(matched?.verifiedAt ?? latest);
}
