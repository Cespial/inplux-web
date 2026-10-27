import type { Lang } from "@/content/i18n";

/**
 * Las etiquetas fijas de las plantillas que comparten las dos lenguas: la ficha
 * de producto, el directorio de productos, la página de sector y los
 * componentes de producto (`ProductInterface`, `CapabilityRail`, `WorkPreview`
 * y los mockups). El contenido —perfiles, sectores— vive en `work.ts`,
 * `work.en.ts`, `sectores.ts` y `sectores.en.ts`; aquí solo va lo que la
 * plantilla escribe alrededor.
 *
 * Es un módulo de cadenas, sin datos de producto: lo importan componentes
 * cliente y no arrastra los perfiles al navegador.
 */

export const productComponentsUi = {
  es: {
    demoTabsLabel: (name: string) => `Vista demostrativa de ${name}`,
    interfaceTab: "Interfaz",
    evidenceTab: "Evidencia",
    evidenceHeader: "REGISTRO DE EVIDENCIA",
    sourceOne: "FUENTE",
    sourceMany: "FUENTES",
    declarationOnly: "DECLARACIÓN DE INPLUX",
    attribution: "Atribución",
    disclosure: "Demostración editorial construida en HTML/CSS. No es una captura del producto.",
    previewLabel: (name: string) => `Demostración editorial de interfaz de ${name}`,
    railPrevious: "Capacidad anterior",
    railNext: "Capacidad siguiente",
  },
  en: {
    demoTabsLabel: (name: string) => `Demo view of ${name}`,
    interfaceTab: "Interface",
    evidenceTab: "Evidence",
    evidenceHeader: "EVIDENCE LOG",
    sourceOne: "SOURCE",
    sourceMany: "SOURCES",
    declarationOnly: "INPLUX STATEMENT",
    attribution: "Attribution",
    disclosure: "Editorial demo built in HTML/CSS. It is not a screenshot of the product.",
    previewLabel: (name: string) => `Editorial interface demo of ${name}`,
    railPrevious: "Previous capability",
    railNext: "Next capability",
  },
} as const satisfies Record<Lang, unknown>;

/** Lo que cada mockup escribe fuera de los datos del perfil. */
export const mockupUi = {
  es: {
    tribai: {
      label: "Ejemplo ilustrativo de una consulta al servidor MCP de Tribai",
      footer: "Ejemplo ilustrativo. La respuesta real trae la fuente oficial de cada dato.",
      call: "# Claude llama la herramienta de Tribai",
      answer: "# Respuesta, con la fuente oficial",
    },
    gobia: {
      label: "Figura del tablero municipal de Gobia con las cifras de su demo pública",
      footer:
        "Cifras de la demo pública. El seguimiento lo hace el equipo del municipio; Gobia lo deja a la vista.",
    },
    kelsen: {
      label: "Figura del explorador de Kelsen con resultados y su ruta de fuente",
      footer: "Figura de lectura. Cada resultado del explorador conserva la ruta hasta su documento.",
      query: "Biblioteca legal · vigencia = modificado",
      path: "Norma › artículo › fuente oficial",
      window: "kelsen.io · explorador",
    },
    laudos: {
      label: "Figura del laboratorio de Laudos con el tamaño del corpus y sus filtros",
      footer: (date: string) => `Cifras del laboratorio público, revisadas el ${date.toLowerCase()}.`,
      tabs: ["Predecir", "Buscar", "Explorar"],
      window: "laudos.co · predecir",
    },
    porkia: {
      label: "Figura de la ficha de finca de Porkia con sus frentes de seguimiento",
      footer: "Datos de ejemplo de la demostración pública. La finca real lleva los suyos.",
    },
    mimotoya: {
      label: "Tres pantallas reales de la aplicación MiMotoYa: la portada, los lugares con su precio y la tarifa antes de pedir",
      footer: "Pantallas reales de la aplicación, entregadas por INPLUX.",
      window: "MiMotoYa · iOS y Android",
    },
  },
  en: {
    tribai: {
      label: "Illustrative example of a query to the Tribai MCP server",
      footer: "Illustrative example. The real response carries the official source of every figure.",
      call: "# Claude calls the Tribai tool",
      answer: "# Response, with the official source",
    },
    gobia: {
      label: "Gobia's municipal dashboard with the figures from its public demo",
      footer:
        "Figures from the public demo. The municipality's team does the follow-up; Gobia keeps it in view.",
    },
    kelsen: {
      label: "Kelsen's explorer with results and their source path",
      footer: "Reading figure. Every explorer result keeps the path to its document.",
      query: "Legal library · validity = amended",
      path: "Law › article › official source",
      window: "kelsen.io · explorer",
    },
    laudos: {
      label: "The Laudos lab with the size of the corpus and its filters",
      footer: (date: string) => `Figures from the public lab, reviewed on ${date}.`,
      tabs: ["Predict", "Search", "Explore"],
      window: "laudos.co · predict",
    },
    porkia: {
      label: "Porkia's farm record with the fronts it tracks",
      footer: "Sample data from the public demo. A real farm keeps its own.",
    },
    mimotoya: {
      label: "Three real screens of the MiMotoYa app: the opening screen, places with their price and the fare before ordering",
      footer: "Real app screens, provided by INPLUX.",
      window: "MiMotoYa · iOS and Android",
    },
  },
} as const;

/** La ficha de producto: `/trabajo/[slug]` y `/en/work/[slug]`. */
export const productProfileUi = {
  es: {
    home: "Inicio",
    products: "Productos",
    crumbsLabel: "Ruta",
    titleSuffix: "perfil de producto",
    socialDescription: (short: string, status: string, attribution: string) =>
      `${short} Estado: ${status}. Atribución: ${attribution}.`,
    factsTitle: (name: string) => `${name}: estado, acceso y atribución`,
    status: "Estado",
    access: "Acceso",
    attribution: "Atribución",
    capabilitiesEyebrow: "Qué hace",
    capabilitiesTitle: (name: string) => `Una lectura de ${name}.`,
    capabilitiesLabel: (name: string) => `Capacidades de ${name}`,
    partnersEyebrow: "Responsabilidades",
    partnersTitle: "Un producto, roles visibles.",
    evidenceEyebrow: "Registro de evidencia",
    evidenceTitle: "Qué sostiene este perfil.",
    evidenceLead: "Cada fuente pública, lo que respalda y cuándo la revisamos.",
    evidenceSource: "Fuente",
    evidenceSupports: "Qué respalda",
    evidenceVerified: "Verificada",
    evidenceDeclaredLead:
      "Todavía no hay fuente pública que citar: lo que sostiene este perfil lo declara INPLUX, con la fecha en que lo entregó.",
    evidenceDeclared: "Declarada",
    evidenceDeclaredBy: "Declaración de INPLUX · sin fuente pública",
    screensEyebrow: "Pantallas",
    screensTitle: (name: string) => `Así se ve ${name}.`,
    screensLead: (date: string) => `Pantallas reales de la aplicación, entregadas por INPLUX el ${date.toLowerCase()}.`,
    screensLabel: (name: string) => `Pantallas de ${name}`,
    evidenceNote:
      "La interfaz de arriba es una demostración editorial: no es una captura ni cuenta como evidencia.",
    closingEyebrow: "El siguiente producto",
    closingTitleLead: "¿Un problema parecido en tu ",
    closingTitleEmphasis: "operación?",
    closingLead:
      "Cuéntanos el problema y quién lo vive. Si un producto propio aplica, lo adaptamos; si no, lo construimos.",
    closingCta: "Empezar un proyecto",
    next: (name: string) => `Siguiente: ${name}`,
  },
  en: {
    home: "Home",
    products: "Products",
    crumbsLabel: "Breadcrumb",
    titleSuffix: "product profile",
    socialDescription: (short: string, status: string, attribution: string) =>
      `${short} Status: ${status}. Attribution: ${attribution}.`,
    factsTitle: (name: string) => `${name}: status, access and attribution`,
    status: "Status",
    access: "Access",
    attribution: "Attribution",
    capabilitiesEyebrow: "What it does",
    capabilitiesTitle: (name: string) => `A reading of ${name}.`,
    capabilitiesLabel: (name: string) => `Capabilities of ${name}`,
    partnersEyebrow: "Responsibilities",
    partnersTitle: "One product, visible roles.",
    evidenceEyebrow: "Evidence log",
    evidenceTitle: "What supports this profile.",
    evidenceLead: "Every public source, what it supports and when we reviewed it.",
    evidenceSource: "Source",
    evidenceSupports: "What it supports",
    evidenceVerified: "Verified",
    evidenceDeclaredLead:
      "There is no public source to cite yet: what supports this profile is stated by INPLUX, with the date it was provided.",
    evidenceDeclared: "Stated",
    evidenceDeclaredBy: "INPLUX statement · no public source",
    screensEyebrow: "Screens",
    screensTitle: (name: string) => `What ${name} looks like.`,
    screensLead: (date: string) => `Real app screens, provided by INPLUX on ${date}.`,
    screensLabel: (name: string) => `Screens of ${name}`,
    evidenceNote:
      "The interface above is an editorial demo: it is not a screenshot and doesn't count as evidence.",
    closingEyebrow: "The next product",
    closingTitleLead: "A similar problem in your ",
    closingTitleEmphasis: "operation?",
    closingLead:
      "Tell us the problem and who lives with it. If one of our products fits, we adapt it; if not, we build it.",
    closingCta: "Start a project",
    next: (name: string) => `Next: ${name}`,
  },
} as const satisfies Record<Lang, unknown>;

/** El directorio de productos: `/trabajo` y `/en/work`. */
export const workIndexUi = {
  es: {
    home: "Inicio",
    crumb: "Productos",
    crumbsLabel: "Ruta",
    pageTitle: "Productos propios — Tribai, Gobia, Kelsen, Laudos, Porkia y MiMotoYa",
    pageDescription:
      "Seis productos construidos y operados por INPLUX, cada uno con su evidencia y la fecha en que la revisamos.",
    socialDescription: "Cada producto documentado, con su evidencia y su fecha de revisión.",
    socialImageAlt: "INPLUX, directorio de trabajo y productos con fuentes verificadas",
    eyebrow: "Productos propios",
    title: "Seis productos construidos por INPLUX.",
    lead: "Cada uno nació de un problema de un cliente, y los seis ya funcionan por su cuenta.",
    leadMuted:
      "Lo que ves abajo sale de sus páginas públicas, con la fecha en que lo revisamos.",
    productsCta: "Ver los productos",
    projectCta: "Empezar un proyecto",
    statementLead: "Cada producto, con su ",
    statementEmphasis: "fuente",
    statementTail: " y su estado a la vista.",
    rowLink: (name: string) => `Ver ${name}`,
    inDevelopment: "En desarrollo",
    closingEyebrow: "El siguiente producto",
    closingTitleLead: "Construyamos lo que ",
    closingTitleEmphasis: "sigue.",
    closingLead:
      "Cuéntanos el problema, quién lo vive y qué debería cambiar. No necesitas tener los requisitos ni el alcance definidos.",
    closingCta: "Empezar un proyecto",
    aboutCta: "Quiénes somos",
  },
  en: {
    home: "Home",
    crumb: "Products",
    crumbsLabel: "Breadcrumb",
    pageTitle: "Our own products — Tribai, Gobia, Kelsen, Laudos, Porkia and MiMotoYa",
    pageDescription:
      "Six products built and run by INPLUX, each with its evidence and the date we reviewed it.",
    socialDescription: "Every documented product, with its evidence and review date.",
    socialImageAlt: "INPLUX, product directory with verified sources",
    eyebrow: "Our own products",
    title: "Six products built by INPLUX.",
    lead: "Each one started with a client's problem, and all six already run on their own.",
    leadMuted:
      "What you see below comes from their public pages, with the date we reviewed it.",
    productsCta: "See the products",
    projectCta: "Start a project",
    statementLead: "Every product, with its ",
    statementEmphasis: "source",
    statementTail: " and its status in plain view.",
    rowLink: (name: string) => `See ${name}`,
    inDevelopment: "In development",
    closingEyebrow: "The next product",
    closingTitleLead: "Let's build what ",
    closingTitleEmphasis: "comes next.",
    closingLead:
      "Tell us the problem, who lives with it and what should change. You don't need defined requirements or scope.",
    closingCta: "Start a project",
    aboutCta: "Who we are",
  },
} as const satisfies Record<Lang, unknown>;

/** La plantilla de sector: `/sectores/[slug]` y `/en/sectors/[slug]`. */
export const sectorPageUi = {
  es: {
    home: "Inicio",
    sectors: "Sectores",
    crumbsLabel: "Ruta",
    heroCta: "Contar el caso",
    promisesCta: "Ver qué cambia",
    claimEyebrow: (name: string) => `Qué cambia en ${name.toLowerCase()}`,
    promisesLabel: "Tres promesas",
    piecesEyebrow: "Qué construimos",
    piecesTitleLead: "Cada pieza dice ",
    piecesTitleEmphasis: "en qué estado está.",
    piecesLead: "En operación corre con un cliente; en construcción aún no tiene usuarios reales.",
    productsEyebrow: "Productos que aplican",
    productsTitleLead: "Construidos por INPLUX, ",
    productsTitleEmphasis: "en producción.",
    productsLink: "Ver todos los productos",
    frameworkEyebrow: "Lo que incorporamos en el diseño",
    frameworkTitleLead: "La norma entra en el diseño, ",
    frameworkTitleEmphasis: "no al final.",
    frameworkLead:
      "Cada pieza se diseña con la regulación que le aplica a la vista. El enlace lleva a la fuente oficial.",
    closingEyebrow: "El siguiente paso",
    closingTitle: "¿Quieres ver por dónde entra la IA en tu operación?",
    closingCta: "Empezar un proyecto",
    reviewed: (date: string) =>
      `Contenido revisado el ${date} · Sin nombres de clientes hasta contar con su autorización escrita.`,
    catalogName: (name: string) => `Capacidades · ${name}`,
    statusTitles: {
      "En operación": "Corre con un cliente",
      "En construcción": "Trabajo contratado, aún sin usuarios",
      Prototipo: "Existe y se puede abrir",
      Oferta: "Diseñado y cotizado",
    } as Record<string, string>,
  },
  en: {
    home: "Home",
    sectors: "Sectors",
    crumbsLabel: "Breadcrumb",
    heroCta: "Tell us the case",
    promisesCta: "See what changes",
    claimEyebrow: (name: string) => `What changes in ${name.toLowerCase()}`,
    promisesLabel: "Three promises",
    piecesEyebrow: "What we build",
    piecesTitleLead: "Every piece states ",
    piecesTitleEmphasis: "where it stands.",
    piecesLead: "In operation runs with a client; under construction has no real users yet.",
    productsEyebrow: "Products that apply",
    productsTitleLead: "Built by INPLUX, ",
    productsTitleEmphasis: "in production.",
    productsLink: "See all products",
    frameworkEyebrow: "What we build into the design",
    frameworkTitleLead: "Regulation goes into the design, ",
    frameworkTitleEmphasis: "not at the end.",
    frameworkLead:
      "Every piece is designed with the regulation that applies to it in view. The link goes to the official source.",
    closingEyebrow: "The next step",
    closingTitle: "Want to see where AI fits into your operation?",
    closingCta: "Start a project",
    reviewed: (date: string) =>
      `Content reviewed on ${date} · No client names until we have their written authorization.`,
    catalogName: (name: string) => `Capabilities · ${name}`,
    statusTitles: {
      "En operación": "Runs with a client",
      "En construcción": "Contracted work, no users yet",
      Prototipo: "Exists and can be opened",
      Oferta: "Designed and quoted",
    } as Record<string, string>,
  },
} as const satisfies Record<Lang, unknown>;

/** Los rótulos del diagrama de salud (`SectorSaludDiagram`). */
export const saludDiagramUi = {
  es: {
    title: "El sistema alrededor de la historia clínica de una IPS",
    desc: "En el centro, la historia clínica que la IPS ya opera. Conectadas a ella por una capa de integración: la app del paciente, la central de telemonitoreo y la mesa de ayuda.",
    plate: "HISTORIA CLÍNICA",
    plateSub: "LA QUE LA IPS YA OPERA",
    ring: "CAPA DE INTEGRACIÓN · LECTURA Y AGENDA · BITÁCORA INMUTABLE",
    app: "APP DEL PACIENTE",
    appSub: "CITAS · RESULTADOS · PQR-F",
    appPlatforms: "ANDROID · IOS · WEB",
    monitoring: "CENTRAL DE TELEMONITOREO",
    monitoringSub: "COLA POR SEMÁFORO · GUION · CIERRE",
    helpdesk: "MESA DE AYUDA",
    helpdeskSub: "TICKETS · CORREO EN HILO · SLA",
    stamp: "INPLUX / SALUD · 01",
    rule: "NADA ESCRIBE EN LA HISTORIA CLÍNICA SIN AUTORIZACIÓN",
  },
  en: {
    title: "The system around a healthcare provider's clinical record",
    desc: "At the center, the provider's clinical record. Around it, through an integration layer: patient app, remote monitoring and help desk.",
    plate: "CLINICAL RECORD",
    plateSub: "THE ONE THE PROVIDER ALREADY RUNS",
    ring: "INTEGRATION LAYER · READ AND SCHEDULE · IMMUTABLE LOG",
    app: "PATIENT APP",
    appSub: "APPOINTMENTS · RESULTS · REQUESTS",
    appPlatforms: "ANDROID · IOS · WEB",
    monitoring: "REMOTE MONITORING CENTER",
    monitoringSub: "TRAFFIC-LIGHT QUEUE · SCRIPT · CLOSURE",
    helpdesk: "HELP DESK",
    helpdeskSub: "TICKETS · THREADED EMAIL · SLA",
    stamp: "INPLUX / HEALTH · 01",
    rule: "NOTHING WRITES TO THE CLINICAL RECORD WITHOUT AUTHORIZATION",
  },
} as const satisfies Record<Lang, unknown>;
