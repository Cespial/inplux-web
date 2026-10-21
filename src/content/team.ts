export type TeamMember = {
  /** Slug de la ruta /equipo/[slug]. Reproduce el nombre legal completo. */
  slug: string;
  /** Nombre legal completo. Debe ser idéntico en LinkedIn, Scholar y Al Poniente. */
  name: string;
  /**
   * Variantes reales de uso del nombre. Se usan para resolver los bylines de
   * press.ts contra la persona y para declarar `alternateName` en JSON-LD.
   */
  alternateName: readonly string[];
  givenName: string;
  familyName: string;
  code: string;
  role: string;
  jobTitle: string;
  focus: string;
  /** Biografía corta, para la tarjeta de /nosotros. */
  bio: string;
  /** Biografía extendida, para la página de perfil. Un párrafo por entrada. */
  profileBio: readonly string[];
  /**
   * Distingue a la persona de sus homónimos. Es la propiedad que schema.org
   * define para este problema exacto y aquí no es decorativa: ambos nombres
   * compiten en Google con homónimos reales.
   */
  disambiguatingDescription: string;
  knowsAbout: readonly string[];
  /** Perfiles externos verificados. Cada URL respondió 200 al añadirse. */
  sameAs: readonly string[];
  linkedin: string;
  /**
   * Retrato real, en blanco y negro, bajo `public/brand/team/`. Es una foto de
   * la persona, no una imagen generada; la portada lo recorta en cuadrado.
   */
  photo: {
    src: string;
    width: number;
    height: number;
  };
  /** Formación y títulos, tal como los declara la persona en su hoja de vida. */
  credentials: readonly string[];
  /** Tres temas, para la tarjeta de la portada. Subconjunto de `knowsAbout`. */
  tags: readonly [string, string, string];
  /** Segundo enlace público de la tarjeta, además de LinkedIn. */
  secondaryLink: {
    label: string;
    href: string;
  };
};

const SITE_URL = "https://inplux.co";

export const teamMembers = [
  {
    slug: "jaime-alonso-cano-pino",
    name: "Jaime Alonso Cano Pino",
    // «Jaime Cano» se retiró a propósito el 08-sep-2026: es el string exacto del
    // titular «Consejo de Estado inhabilitó a diputado Jaime Cano», un homónimo
    // real. Declararlo aquí le dice a Google que esta persona también se llama
    // así, y el «Pino» es justamente lo que la distingue. No reintroducir.
    alternateName: ["Jaime Cano Pino", "Jaime Alonso Cano"],
    givenName: "Jaime Alonso",
    familyName: "Cano Pino",
    code: "DIR–01",
    role: "CEO Y FUNDADOR",
    jobTitle: "CEO y fundador",
    focus: "Estrategia, criterio tributario, financiero e institucional.",
    bio:
      "Dirige la estrategia y el criterio con el que INPLUX convierte experiencia de contextos complejos en productos que puedan operar y producir resultados verificables.",
    profileBio: [
      "Jaime Alonso Cano Pino es CEO y fundador de INPLUX S.A.S., empresa con sede en Medellín, Colombia, que desarrolla e implementa transformación con IA. Dirige la estrategia de la compañía y el criterio con el que se decide qué construir: qué problema merece un producto, qué evidencia debe producir y bajo qué responsabilidad opera.",
      "Su trabajo se concentra en contextos donde la norma y el dato se cruzan —gestión tributaria, financiera e institucional—, y en trasladar ese criterio a productos digitales que puedan usarse y mejorarse con evidencia de su operación.",
      "Escribe con regularidad en Al Poniente sobre el sistema tributario colombiano, el trabajo de la profesión contable y los límites de la inteligencia artificial aplicada a materias reguladas. Sus columnas insisten en una misma tesis: una respuesta que no se puede verificar no sirve, por rápida que sea.",
    ],
    disambiguatingDescription:
      "CEO y fundador de INPLUX S.A.S., empresa que desarrolla e implementa transformación con IA, con sede en Medellín, Colombia. Autor de columnas sobre el sistema tributario colombiano y la inteligencia artificial aplicada en Al Poniente.",
    knowsAbout: [
      "Gestión tributaria",
      "Hacienda pública territorial",
      "Gestión financiera institucional",
      "Profesión contable",
      "Inteligencia artificial aplicada a materias reguladas",
      "Dirección de producto",
    ],
    sameAs: [
      "https://jaimecanopino.com",
      "https://www.linkedin.com/in/jaime-alonso-cano-pino-a11a6246/",
      "https://alponiente.com/author/jaimealonsocano/",
    ],
    linkedin: "https://www.linkedin.com/in/jaime-alonso-cano-pino-a11a6246/",
    photo: { src: "/brand/team/jaime-alonso-cano-pino.jpg", width: 900, height: 1200 },
    credentials: [
      "CFO Program · International Finance, University of Miami Herbert Business School",
      "Normas Internacionales de Contabilidad, Universidad EAFIT",
      "Contador público · tributarista",
    ],
    tags: ["Hacienda territorial", "Gestión tributaria", "Dirección de producto"],
    secondaryLink: {
      label: "Columnas en Al Poniente",
      href: "https://alponiente.com/author/jaimealonsocano/",
    },
  },
  {
    slug: "cristian-espinal-maya",
    name: "Cristian Espinal Maya",
    alternateName: ["Cristian Espinal", "Cristian Josué Espinal Maya"],
    givenName: "Cristian",
    familyName: "Espinal Maya",
    code: "DIR–02",
    role: "CTO",
    jobTitle: "CTO",
    focus: "Producto, arquitectura tecnológica e inteligencia artificial.",
    bio:
      "Lidera la definición y construcción de productos digitales. Coordina cómo diseño, software, datos e inteligencia artificial trabajan como un solo sistema de entrega.",
    profileBio: [
      "Cristian Espinal Maya es CTO de INPLUX S.A.S., empresa con sede en Medellín, Colombia, que desarrolla e implementa transformación con IA. Lidera la definición y la construcción de los productos digitales de la compañía, y coordina cómo diseño, ingeniería, datos e inteligencia artificial operan como un solo sistema de entrega.",
      "Es economista e investigador. Publica trabajo revisable en arXiv y SSRN sobre el efecto de la inteligencia artificial en el trabajo y el capital humano, y sobre métodos para medir lo que estos sistemas hacen y lo que no.",
      "Esa doble posición —construir los sistemas y estudiar sus efectos— define su criterio técnico: la inteligencia artificial acelera tareas concretas y verificables, mientras la dirección de las decisiones críticas permanece en manos de personas expertas.",
    ],
    disambiguatingDescription:
      "CTO de INPLUX S.A.S., empresa que desarrolla e implementa transformación con IA, con sede en Medellín, Colombia. Economista e investigador; autor de working papers en arXiv y SSRN sobre inteligencia artificial, trabajo y capital humano.",
    knowsAbout: [
      "Arquitectura de software",
      "Inteligencia artificial aplicada",
      "Ingeniería de datos",
      "Economía",
      "Capital humano",
      "Dirección de producto",
    ],
    sameAs: [
      "https://www.linkedin.com/in/cespial/",
      "https://scholar.google.com/citations?hl=es&user=o_I-xnoAAAAJ",
    ],
    linkedin: "https://www.linkedin.com/in/cespial/",
    photo: { src: "/brand/team/cristian-espinal-maya.jpg", width: 900, height: 1200 },
    credentials: [
      "Doctorando en Ingeniería, Universidad Nacional de Colombia",
      "Maestría en Economía · métodos cuantitativos, Universidad EAFIT",
      "Economista, Universidad de Medellín",
    ],
    tags: ["Arquitectura de software", "IA aplicada", "Ingeniería de datos"],
    secondaryLink: {
      label: "Google Scholar",
      href: "https://scholar.google.com/citations?hl=es&user=o_I-xnoAAAAJ",
    },
  },
] as const satisfies readonly TeamMember[];

export type TeamMemberSlug = (typeof teamMembers)[number]["slug"];

/**
 * Identificador canónico de una persona en todo el grafo JSON-LD del sitio.
 *
 * Toda referencia a un integrante del equipo —en /nosotros, en /prensa o en su
 * propio perfil— debe apuntar aquí. Sin un `@id` compartido, cada mención crea
 * una entidad distinta y Google no puede saber que la persona que aparece en
 * once columnas es la misma que dirige la compañía.
 */
export function personId(slug: string): string {
  return `${SITE_URL}/equipo/${slug}#person`;
}

export function profileUrl(slug: string): string {
  return `${SITE_URL}/equipo/${slug}`;
}

export function getTeamMember(slug: string): TeamMember | undefined {
  return teamMembers.find((member) => member.slug === slug);
}

/**
 * Resuelve un byline de press.ts contra el equipo.
 *
 * Los bylines no siempre son un nombre limpio: hay coautorías separadas por
 * “·”, y notas redactadas en prosa (“Entrevista a …”, “Nota sobre investigación
 * de …”). Se comprueba el nombre legal y sus variantes como subcadena para
 * cubrir los tres casos.
 */
export function findTeamMemberInByline(
  byline: string | undefined,
): TeamMember | undefined {
  if (!byline) return undefined;
  return teamMembers.find((member) =>
    [member.name, ...member.alternateName].some((candidate) =>
      byline.includes(candidate),
    ),
  );
}

/**
 * Integrante del equipo de ingeniería. Tarjeta en /equipo, sin página propia:
 * por eso no tiene `code`, `bio` ni `sameAs`, y su `@id` vive en /equipo.
 */
export type TeamCrewMember = {
  /** Ancla `/equipo#<slug>`. Reproduce el nombre legal completo. */
  slug: string;
  name: string;
  givenName: string;
  familyName: string;
  jobTitle: string;
  focus: string;
  /** Formación, tal como la declara la persona en LinkedIn. */
  credentials: readonly string[];
  /** Retrato real, en blanco y negro, bajo `public/brand/team/` (≤ 150 KB). */
  photo: {
    src: string;
    width: number;
    height: number;
  };
  /** Solo si la URL respondió 200 y el nombre coincide. */
  linkedin?: string;
};

/*
 * El equipo que construye y opera los sistemas (PR P, 20-oct-2026).
 *
 * Autorización: Cristian Espinal Maya (cristian@inplux.co) declaró el
 * 20-oct-2026 que Alejandro Estrada Gómez, Daniel Alejandro López Naranjo,
 * Cristian David Ajavi Aguilar y Alejandro López Durango autorizaron que el
 * sitio publique su foto y su nombre.
 *
 * Fuente única: el texto de LinkedIn de cada persona que pegó Cristian; el
 * cargo de Alejandro Estrada y la maestría en curso de Cristian David los dio
 * Cristian directamente. No se nombran empleadores ni cifras de logros. Sin
 * `linkedin` porque las URL públicas no se pudieron confirmar; se añaden
 * cuando Cristian las pase.
 *
 * Orden: coordinación primero, después ingeniería.
 *
 * Alejandro López Durango entra cuando lleguen sus datos: no se inventa cargo,
 * formación ni enlaces.
 *
 * Aparte de `teamMembers` a propósito: /equipo/[slug], el sitemap, la portada y
 * `founder` siguen siendo solo la dirección.
 */
export const teamCrew = [
  {
    slug: "alejandro-estrada-gomez",
    name: "Alejandro Estrada Gómez",
    givenName: "Alejandro",
    familyName: "Estrada Gómez",
    jobTitle: "Coordinador de proyectos",
    focus:
      "Planeación y seguimiento de proyectos, control de costos y análisis financiero con Power BI.",
    credentials: [
      "Contador público, Universidad de Medellín",
      "Mercadólogo, Universidad de Medellín",
    ],
    photo: { src: "/brand/team/alejandro-estrada-gomez.jpg", width: 900, height: 1200 },
  },
  {
    slug: "daniel-alejandro-lopez-naranjo",
    name: "Daniel Alejandro López Naranjo",
    givenName: "Daniel Alejandro",
    familyName: "López Naranjo",
    jobTitle: "Product Engineer",
    focus:
      "Producto de punta a punta: web, móvil y servicios con React, React Native, NestJS y TypeScript, y recuperación con fuentes (RAG).",
    credentials: ["Técnico en Desarrollo de Software, CESDE"],
    photo: { src: "/brand/team/daniel-alejandro-lopez-naranjo.jpg", width: 900, height: 1200 },
  },
  {
    slug: "cristian-david-ajavi-aguilar",
    name: "Cristian David Ajavi Aguilar",
    givenName: "Cristian David",
    familyName: "Ajavi Aguilar",
    jobTitle: "Automation Engineer",
    focus: "Automatización con Python y modelos de lenguaje en procesos financieros.",
    credentials: [
      "Maestría en Ingeniería (en curso), Universidad EAFIT",
      "Negocios Internacionales, Fundación Universitaria Luis Amigó",
      "Diplomado en Mercado de Capitales, Universidad del Rosario",
    ],
    photo: { src: "/brand/team/cristian-david-ajavi-aguilar.jpg", width: 900, height: 1200 },
  },
] as const satisfies readonly TeamCrewMember[];

/** `@id` de un integrante de `teamCrew`: se define en /equipo, no en un perfil. */
export function crewPersonId(slug: string): string {
  return `${SITE_URL}/equipo#${slug}`;
}
