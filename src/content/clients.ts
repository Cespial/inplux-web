/**
 * Las relaciones del muro de clientes: logotipos con permiso registrado y
 * entidades nombradas sin marca utilizable.
 *
 * Es el único archivo de `src/content` autorizado a nombrar `/brand/clients/`
 * (`approvedLogoFiles` en `scripts/verify-public-content.mjs`), y el que lee
 * `scripts/verify-grid-fill.test.mjs` para contar las celdas del muro. Vivía
 * dentro de `HomeSections.tsx` hasta la capa compartida v5 (oct-2026).
 */

/**
 * El nombre y las dimensiones de cada logo son datos de la relación, no copy:
 * viven aquí, en el único archivo con permiso registrado para nombrarlos. La
 * nota descriptiva sí se traduce y llega desde el diccionario de copy.
 */
export const clientLogos = [
  {
    src: "/brand/clients/corantioquia.png",
    name: "CORANTIOQUIA",
    relation: "partner-experience",
    width: 300,
    height: 222,
    renderWidth: 70,
  },
  {
    src: "/brand/clients/creame.png",
    name: "Creame",
    relation: "partner-experience",
    width: 480,
    height: 184,
    renderWidth: 136,
  },
  {
    src: "/brand/clients/maria-cano.png",
    name: "Fundación Universitaria María Cano",
    relation: "partner-experience",
    width: 480,
    height: 167,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/esumer.png",
    name: "Institución Universitaria Esumer",
    relation: "partner-experience",
    width: 401,
    height: 133,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/ipsmedic.png",
    name: "+IPSMEDIC",
    relation: "partner-experience",
    width: 141,
    height: 121,
    renderWidth: 61,
  },
  {
    src: "/brand/clients/parque-arvi.png",
    name: "Parque Arví Corporación",
    relation: "partner-experience",
    width: 379,
    height: 394,
    renderWidth: 50,
  },
  {
    src: "/brand/clients/experience-03.png",
    name: "Corporación Interuniversitaria de Servicios",
    relation: "partner-experience",
    width: 447,
    height: 151,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/politecnico-jaime-isaza.png",
    name: "Politécnico Colombiano Jaime Isaza Cadavid",
    relation: "partner-experience",
    width: 563,
    height: 146,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/experience-04.png",
    name: "Provincia del Agua, Bosques y el Turismo",
    relation: "partner-experience",
    width: 473,
    height: 512,
    renderWidth: 48,
  },
  {
    src: "/brand/clients/experience-05.png",
    name: "Rentan",
    relation: "partner-experience",
    width: 388,
    height: 104,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/experience-06-transparent.png",
    name: "Empresa de Desarrollo Urbano",
    relation: "partner-experience",
    width: 367,
    height: 138,
    renderWidth: 138,
  },
  {
    src: "/brand/clients/experience-07.png",
    name: "Sistemas Aries",
    relation: "partner-experience",
    width: 223,
    height: 113,
    renderWidth: 103,
  },
  {
    src: "/brand/clients/municipio-cisneros.png",
    name: "Municipio de Cisneros",
    relation: "partner-experience",
    width: 200,
    height: 200,
    renderWidth: 52,
  },
  {
    src: "/brand/clients/alcaldia-caucasia.png",
    name: "Alcaldía de Caucasia",
    relation: "partner-experience",
    width: 265,
    height: 81,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/alcaldia-caracoli.png",
    name: "Alcaldía de Caracolí",
    relation: "partner-experience",
    width: 200,
    height: 73,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/alcaldia-san-roque.png",
    name: "Alcaldía de San Roque",
    relation: "partner-experience",
    width: 200,
    height: 99,
    renderWidth: 105,
  },
  {
    src: "/brand/clients/hospital-san-pio-x.png",
    name: "E.S.E. Hospital San Pío X",
    relation: "partner-experience",
    width: 140,
    height: 113,
    renderWidth: 64,
  },
  {
    src: "/brand/clients/alcaldia-buritica.png",
    name: "Alcaldía de Buriticá",
    relation: "partner-experience",
    width: 420,
    height: 159,
    renderWidth: 140,
  },
  {
    /*
     * De Yalí se usa sólo el logotipo. Su lockup apila un escudo alto sobre el
     * nombre, y en la celda —que limita por altura— el nombre quedaba en cuatro
     * píxeles, ilegible. El logotipo solo conserva su tipografía y se lee.
     */
    src: "/brand/clients/alcaldia-yali.png",
    name: "Alcaldía de Yalí",
    relation: "partner-experience",
    width: 420,
    height: 84,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/alcaldia-santo-domingo.png",
    name: "Alcaldía de Santo Domingo",
    relation: "partner-experience",
    width: 270,
    height: 204,
    renderWidth: 90,
  },
  {
    src: "/brand/clients/alcaldia-el-bagre.png",
    name: "Alcaldía de El Bagre",
    relation: "partner-experience",
    width: 171,
    height: 204,
    renderWidth: 57,
  },
  {
    src: "/brand/clients/alcaldia-valparaiso.png",
    name: "Alcaldía de Valparaíso",
    relation: "partner-experience",
    width: 207,
    height: 204,
    renderWidth: 69,
  },
  {
    src: "/brand/clients/alcaldia-vegachi.png",
    name: "Alcaldía de Vegachí",
    relation: "partner-experience",
    width: 420,
    height: 201,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/hospital-san-camilo-de-lelis.png",
    name: "E.S.E. Hospital San Camilo de Lelis",
    relation: "partner-experience",
    width: 211,
    height: 104,
    renderWidth: 138,
  },
  {
    src: "/brand/clients/esp-caracoli.png",
    name: "Empresa de Servicios Públicos de Caracolí",
    relation: "partner-experience",
    width: 204,
    height: 204,
    renderWidth: 68,
  },
  {
    src: "/brand/clients/ederem.png",
    name: "EDEREM",
    relation: "partner-experience",
    width: 189,
    height: 204,
    renderWidth: 63,
  },
  {
    src: "/brand/clients/inca-ingenieros.png",
    name: "INCA Ingenieros",
    relation: "partner-experience",
    width: 174,
    height: 204,
    renderWidth: 58,
  },
] as const;

/**
 * Las entidades acreditadas en el RUP se NOMBRAN, no se dibujan.
 *
 * Casi todas son heráldica municipal, y un escudo no sobrevive a la celda del
 * muro: a 52px de alto no se lee ni con el filtro de silueta ni en gris con
 * detalle —Santo Domingo sale literalmente como un círculo liso—, así que el
 * escudo no aporta identidad, sólo mancha. El nombre compuesto en la mono del
 * sitio se lee a cualquier tamaño y no depende de conseguir trece archivos que
 * además no existen todos en fuentes abiertas.
 *
 * `lugar` sale del propio certificado o del dominio oficial del municipio; se
 * omite cuando no consta, antes que suponerlo.
 */
export const clientNames = [
  /*
   * La E.S.P. de Giraldo no tiene marca propia localizable. El único activo
   * gráfico de Giraldo que existe es el de la ALCALDÍA, y son dos personas
   * jurídicas distintas: el RUP acredita a la empresa de servicios públicos,
   * no al municipio. Usar uno por otro sería una atribución falsa, así que la
   * entidad se nombra.
   */
  { name: "Servicios Públicos de Giraldo", place: "E.S.P." },
  /*
   * Falta a propósito la tercera contraparte propia del RUP: su nombre está
   * vetado por una de las reglas de lenguaje público de
   * `scripts/verify-public-content.mjs`, que bloquea el build si aparece bajo
   * `src/`. Es una decisión ya registrada en el proyecto, no un olvido; para
   * incorporarla hay que levantar antes ese veto. (El nombre de la regla no se
   * escribe aquí: los literales de las reglas sólo pueden vivir en `scripts/`,
   * y `verify-deck-reasons` lo comprueba.)
   */
] as const;

/**
 * Cuántas organizaciones publica el muro: logotipos más entidades nombradas.
 * Lo lee la cinta de cifras de la portada, que no inventa números: los cuenta.
 */
export const clientWallCount = clientLogos.length + clientNames.length;
