/**
 * El Día D — datos del evento y de los aliados que lo acompañan.
 *
 * Viven aquí, separados del diccionario de copy, por dos razones. La primera es
 * que son DATOS, no redacción: la fecha, la sede y los nombres de los aliados no
 * se traducen. La segunda es que este aviso es temporal —caduca el 15 de octubre
 * de 2026, ver `ALLY_NOTICE_EXPIRES`— y cuando se retire conviene que todo lo
 * suyo salga junto: este archivo, su componente, su hoja y `public/brand/diad/`.
 *
 * Los descriptores de cada aliado son los del propio sitio del evento; se
 * traducen y por eso viven en el diccionario de copy, indexados por `id`.
 */

/** Enlace público del evento. */
export const DIA_D_URL = "https://eldiad.10am.pro/";

/**
 * El aviso deja de mostrarse pasado el evento.
 *
 * El Día D es el miércoles 14 de octubre de 2026; la marca es la medianoche
 * siguiente en hora de Colombia (UTC-5), de modo que el aviso acompaña todo el
 * día del evento y desaparece solo. Así no depende de que alguien se acuerde de
 * retirarlo —aunque el código sí conviene retirarlo después—.
 */
export const ALLY_NOTICE_EXPIRES = Date.parse("2026-10-15T00:00:00-05:00");

/**
 * Los DEMÁS aliados. INPLUX no se incluye a propósito: el aviso se muestra en
 * su propio sitio y el mensaje es «estamos con estos», no un listado en el que
 * uno se nombra a sí mismo.
 *
 * Los logotipos se tomaron del sitio del evento. Tres traían caja opaca
 * —Veronorte y EAFIT sobre negro, MBS sobre blanco— y se les levantó el fondo:
 * el aviso los pinta en silueta, igual que el muro de la portada, y una caja
 * opaca habría salido como un rectángulo macizo.
 */
export const DIA_D_ALLIES = [
  {
    id: "veronorte",
    name: "Veronorte",
    href: "https://veronorte.com/diad",
    src: "/brand/diad/veronorte.png",
    width: 360,
    height: 75,
  },
  {
    id: "eafit",
    name: "Universidad EAFIT",
    href: "https://www.eafit.edu.co/",
    src: "/brand/diad/eafit.png",
    width: 251,
    height: 83,
  },
  {
    id: "makeno",
    name: "Makeno",
    href: "https://www.makeno.co/",
    src: "/brand/diad/makeno.png",
    width: 360,
    height: 72,
  },
  {
    id: "mbs",
    name: "MBS & Associates",
    /** Es el único aliado que el sitio del evento no enlaza. */
    href: null,
    src: "/brand/diad/mbs.png",
    width: 159,
    height: 120,
  },
  {
    id: "macrowise",
    name: "MacroWise",
    href: "https://macrowise.capital/",
    src: "/brand/diad/macrowise.png",
    width: 360,
    height: 54,
  },
  {
    id: "celsia",
    name: "Celsia",
    href: "https://www.celsia.com/es/",
    src: "/brand/diad/celsia.png",
    width: 360,
    height: 105,
  },
] as const;

export type DiaDAllyId = (typeof DIA_D_ALLIES)[number]["id"];
