export type PressCategory =
  | "Medios"
  | "Escenarios públicos"
  | "Investigación"
  | "Ideas firmadas"
  | "Proyectos";

export type PressStory = {
  slug: string;
  category: PressCategory;
  format:
    | "Entrevista"
    | "Prensa"
    | "Selección editorial"
    | "Panel"
    | "Hackathon"
    | "Patrocinio"
    | "Cumbre"
    | "Ranking"
    | "Preprint"
    | "Working paper"
    | "Columna firmada"
    | "Lanzamiento";
  outlet: string;
  publishedAt: `${number}-${number}-${number}`;
  publishedLabel: string;
  title: string;
  sourceTitle?: string;
  byline?: string;
  editorialStatus?: string;
  summary: string;
  href: string;
  /**
   * Cómo se dibuja la tarjeta. `cover` enmarca una portada publicada; `photo`
   * una fotografía real del escenario, que la hoja pasa a blanco y negro;
   * `clients` un par de logotipos de clientes; `allies` la retícula de aliados
   * del Día D; `event` la placa de un evento por venir.
   */
  visualKind:
    | "cover"
    | "photo"
    | "stat"
    | "mark"
    | "panel"
    | "paper"
    | "archive"
    | "clients"
    | "allies"
    | "event";
  visualSignal: string;
  visualCode?: string;
  image?: string;
  imageAlt?: string;
  stat?: string;
  /** Logotipos de la tarjeta `clients`, con su tamaño real en píxeles. */
  logos?: readonly {
    src: string;
    alt: string;
    width: number;
    height: number;
  }[];
  /** Placa de la tarjeta `event`: antetítulo, nombre por líneas y lugar. */
  event?: {
    eyebrow: string;
    name: readonly string[];
    place: string;
  };
  /**
   * Lugar del escenario, para el `Event` de JSON-LD de /prensa. Solo lo
   * declaran las piezas que son eventos (panel, hackathon, cumbre, patrocinio).
   */
  place?: string;
  featured: boolean;
  /**
   * Orden entre las destacadas de la portada (menor primero). Sin él, las
   * destacadas van por fecha. La primera puede ocupar toda la fila con
   * `homeFeature`.
   */
  homeRank?: number;
  homeFeature?: boolean;
};

/**
 * Archivo editorial con enlaces externos verificables.
 * Las publicaciones personales y la investigación se etiquetan por separado
 * para no presentarlas como cobertura periodística de INPLUX.
 */
export const pressStories = [
  {
    /*
     * Lanzamiento propio, no cobertura: el enlace lleva al producto en vivo.
     * SE Holdings autorizó nombre y logo (Cristian, 20-oct-2026).
     */
    slug: "seagricolas-sudafrica",
    category: "Proyectos",
    format: "Lanzamiento",
    outlet: "INPLUX",
    editorialStatus: "Johannesburgo · Plataforma de SE Holdings en producción",
    publishedAt: "2026-10-20",
    publishedLabel: "20 OCT 2026",
    title: "Software de INPLUX en producción en Sudáfrica",
    summary:
      "Para SE Holdings, en Johannesburgo, construimos seagricolas.com: la plataforma con la que rentan su flota de maquinaria agrícola, siempre con operador. Catálogo de 37 unidades, tarifas por hectárea, mapa de las zonas donde trabaja la flota y solicitudes en línea que se piden por mes, porque la siembra espera la primera lluvia.",
    href: "https://seagricolas.com",
    visualKind: "clients",
    visualSignal: "seagricolas.com · Johannesburgo",
    visualCode: "Cliente en Sudáfrica",
    logos: [
      { src: "/brand/press/se-holdings.png", alt: "SE Holdings", width: 900, height: 234 },
    ],
    featured: false,
  },
  {
    /*
     * El ranking es de Dinero (Semana). Que las dos compañías sean clientes lo
     * declaramos nosotros, no la fuente; por eso el estado editorial lo dice y
     * el enlace lleva al especial, no a una nota sobre INPLUX. Cristian
     * confirmó la relación con ambas el 17-oct-2026.
     */
    slug: "clientes-5000-dinero-2026",
    category: "Medios",
    format: "Ranking",
    outlet: "Semana · Dinero",
    editorialStatus: "Oncolife · IPSmedic · Ranking anual de Dinero por ventas de 2025",
    publishedAt: "2026-09-20",
    publishedLabel: "20 SEP 2026",
    title: "Dos de nuestros clientes están entre las 5.000 empresas más grandes de Colombia",
    summary:
      "El ranking reúne a las compañías que vendieron más de $62.164 millones en 2025. Oncolife, institución oncológica de Bogotá, e IPSmedic, IPS con 23 sedes en el Valle del Cauca, hacen parte de la lista. Con las dos trabajamos.",
    href:
      "https://www.semana.com/especiales-editoriales/articulo/las-5000-empresas-mas-grandes-de-colombia-el-salto-de-las-companias-tecnologicas/202631/",
    visualKind: "clients",
    visualSignal: "Las 5.000 empresas más grandes · Dinero 2026",
    visualCode: "Clientes en el ranking",
    logos: [
      { src: "/brand/press/oncolife.png", alt: "Oncolife", width: 250, height: 155 },
      { src: "/brand/press/ipsmedic.png", alt: "IPSmedic", width: 572, height: 476 },
    ],
    featured: true,
    homeRank: 1,
    homeFeature: true,
  },
  {
    slug: "odr-2026-hackathon-amparo",
    category: "Escenarios públicos",
    format: "Hackathon",
    outlet: "AAA · odr.com · Suffolk University",
    byline: "Cristian Espinal",
    editorialStatus: "Encuentro de Online Dispute Resolution · Boston",
    publishedAt: "2026-06-13",
    publishedLabel: "JUN 2026",
    title: "Amparo.help ganó un lugar en el hackathon de ODR 2026",
    summary:
      "En el encuentro de ODR en Harvard Business School llevamos Amparo.help al hackathon de la American Arbitration Association y odr.com, en Suffolk University: un prototipo para resolver disputas de salud sin abogados ni costos de juzgado, con la decisión final en manos humanas.",
    href: "https://amparo.help",
    visualKind: "photo",
    visualSignal: "Harvard Business School / Boston",
    visualCode: "ODR 2026",
    image: "/brand/press/harvard-hbs.jpg",
    imageAlt: "Letrero de Harvard Business School en Soldiers Field Park, Boston",
    place: "Boston, Estados Unidos",
    featured: true,
    homeRank: 3,
  },
  {
    slug: "dia-d-2026-aliado-software",
    category: "Escenarios públicos",
    format: "Patrocinio",
    outlet: "10ampro · Universidad EAFIT",
    editorialStatus: "Medellín · Patrocinio en la categoría Software",
    publishedAt: "2026-10-14",
    publishedLabel: "14 OCT 2026",
    title: "INPLUX, aliado de software de El Día D",
    summary:
      "Acompañamos El Día D de 10ampro junto a Veronorte, Universidad EAFIT, Makeno, MBS & Associates, MacroWise y Celsia.",
    href: "https://eldiad.10am.pro/",
    visualKind: "allies",
    visualSignal: "Aliados del Día D",
    visualCode: "Aliado de software",
    place: "Medellín, Colombia",
    featured: true,
    homeRank: 4,
  },
  {
    slug: "govai-coalition-summit-2026",
    category: "Escenarios públicos",
    format: "Cumbre",
    outlet: "GovAI Coalition · Government Technology",
    editorialStatus: "San José, California · Cumbre 9 y 10 de diciembre · Government Town Hall el 11",
    publishedAt: "2026-12-09",
    publishedLabel: "09 DIC 2026",
    title: "Vamos al GovAI Coalition Summit, en Silicon Valley",
    summary:
      "La cumbre reúne a gobiernos y equipos que construyen IA para el sector público: tendencias, prácticas éticas, gestión de datos y aplicaciones reales.",
    href: "https://events.govtech.com/GovAI-Coalition-Summit",
    visualKind: "event",
    visualSignal: "San Jose Convention Center",
    visualCode: "09–11 dic",
    event: {
      eyebrow: "Próximo · Diciembre 2026",
      name: ["GovAI", "Coalition", "Summit"],
      place: "San José, CA · Silicon Valley",
    },
    place: "San José, California, Estados Unidos",
    featured: true,
    homeRank: 5,
  },
  {
    slug: "temporada-renta-herramientas",
    category: "Ideas firmadas",
    format: "Columna firmada",
    outlet: "Al Poniente",
    byline: "Jaime Alonso Cano Pino",
    editorialStatus: "Publicación del equipo · no es cobertura independiente",
    publishedAt: "2026-07-15",
    publishedLabel: "15 JUL 2026",
    title: "El 12 de agosto arranca la temporada de renta. La pregunta es con qué herramientas la va a enfrentar",
    summary:
      "Una columna de Jaime Alonso Cano Pino sobre preparación, criterio profesional y herramientas para la temporada de renta.",
    href:
      "https://alponiente.com/el-12-de-agosto-arranca-la-temporada-de-renta-la-pregunta-es-con-que-herramientas-la-va-a-enfrentar/",
    visualKind: "archive",
    visualSignal: "IDEAS FIRMADAS / TRIBAI",
    visualCode: "JACP / 09",
    featured: false,
  },
  {
    slug: "ia-inventa-articulo-estatuto",
    category: "Ideas firmadas",
    format: "Columna firmada",
    outlet: "Al Poniente",
    byline: "Jaime Alonso Cano Pino",
    editorialStatus: "Publicación del equipo · no es cobertura independiente",
    publishedAt: "2026-07-06",
    publishedLabel: "06 JUL 2026",
    title: "Una IA que se inventa el artículo del Estatuto es peor que no tener ninguna",
    summary:
      "Jaime Alonso Cano Pino escribe sobre trazabilidad, fuentes y el costo de una respuesta tributaria que no se puede verificar.",
    href:
      "https://alponiente.com/una-ia-que-se-inventa-el-articulo-del-estatuto-es-peor-que-no-tener-ninguna/",
    visualKind: "archive",
    visualSignal: "IDEAS FIRMADAS / CONFIANZA",
    visualCode: "JACP / 08",
    featured: false,
  },
  {
    slug: "profesion-contable-ia",
    category: "Ideas firmadas",
    format: "Columna firmada",
    outlet: "Al Poniente",
    byline: "Jaime Alonso Cano Pino",
    editorialStatus: "Publicación del equipo · no es cobertura independiente",
    publishedAt: "2026-06-22",
    publishedLabel: "22 JUN 2026",
    title: "La profesión contable no está amenazada por la IA. Está atrapada en una tarea que la IA puede quitarle",
    summary:
      "Una reflexión firmada sobre automatización, tiempo profesional y el trabajo de mayor criterio que queda por recuperar.",
    href:
      "https://alponiente.com/la-profesion-contable-no-esta-amenazada-por-la-ia-esta-atrapada-en-una-tarea-que-la-ia-puede-quitarle/",
    visualKind: "archive",
    visualSignal: "IDEAS FIRMADAS / TRABAJO",
    visualCode: "JACP / 07",
    featured: false,
  },
  {
    slug: "maquina-no-puede-firmar",
    category: "Ideas firmadas",
    format: "Columna firmada",
    outlet: "Al Poniente",
    byline: "Jaime Alonso Cano Pino",
    editorialStatus: "Publicación del equipo · no es cobertura independiente",
    publishedAt: "2026-06-12",
    publishedLabel: "12 JUN 2026",
    title: "Lo que la máquina no puede firmar",
    summary:
      "Una columna de Jaime Alonso Cano Pino sobre responsabilidad, revisión y aquello que permanece bajo dirección humana.",
    href: "https://alponiente.com/lo-que-la-maquina-no-puede-firmar/",
    visualKind: "archive",
    visualSignal: "IDEAS FIRMADAS / CRITERIO",
    visualCode: "JACP / 06",
    featured: false,
  },
  {
    slug: "adios-horas-perdidas-tribai",
    category: "Ideas firmadas",
    format: "Columna firmada",
    outlet: "Al Poniente",
    byline: "Jaime Alonso Cano Pino",
    editorialStatus: "Publicación del equipo · no es cobertura independiente",
    publishedAt: "2026-06-07",
    publishedLabel: "07 JUN 2026",
    title: "Adiós a las 15 horas perdidas: así funciona Tribai.co",
    summary:
      "Una explicación firmada del problema operativo que Tribai busca resolver y de cómo se recorre el producto.",
    href: "https://alponiente.com/adios-a-las-15-horas-perdidas-asi-funciona-tribai-co/",
    visualKind: "archive",
    visualSignal: "IDEAS FIRMADAS / PRODUCTO",
    visualCode: "JACP / 05",
    featured: false,
  },
  {
    slug: "acuerdo-que-nadie-leyo",
    category: "Ideas firmadas",
    format: "Columna firmada",
    outlet: "Al Poniente",
    byline: "Jaime Alonso Cano Pino",
    editorialStatus: "Publicación del equipo · no es cobertura independiente",
    publishedAt: "2026-05-19",
    publishedLabel: "19 MAY 2026",
    title: "El acuerdo que nadie leyó",
    summary:
      "Jaime Alonso Cano Pino examina la distancia entre producir normas y conseguir que quienes las necesitan puedan encontrarlas y entenderlas.",
    href: "https://alponiente.com/el-acuerdo-que-nadie-leyo-tribai-co/",
    visualKind: "archive",
    visualSignal: "IDEAS FIRMADAS / NORMA",
    visualCode: "JACP / 04",
    featured: false,
  },
  {
    slug: "ia-arbitraje-congreso-cca",
    category: "Escenarios públicos",
    format: "Panel",
    outlet: "Comité Colombiano de Arbitraje",
    byline: "Cristian Espinal",
    editorialStatus: "Participación en panel · programa oficial del evento",
    publishedAt: "2026-05-07",
    publishedLabel: "07 MAY 2026",
    title: "Herramientas de inteligencia artificial para un arbitraje exitoso",
    summary:
      "Cristian Espinal participó en el panel 11 del XIV Congreso Nacional e Internacional de Arbitraje, celebrado en Medellín.",
    href:
      "https://es.linkedin.com/posts/comit%C3%A9-colombiano-de-arbitraje_programa-xiv-congreso-nacional-e-internacional-activity-7447352459167051776-_YO7",
    visualKind: "photo",
    visualSignal: "XIV Congreso / Medellín",
    visualCode: "Panel 11",
    image: "/brand/press/panel-11.jpg",
    imageAlt:
      "Panel 11 del XIV Congreso Nacional e Internacional de Arbitraje: cuatro panelistas en el escenario bajo la pantalla con el título del panel",
    place: "Medellín, Colombia",
    featured: true,
    homeRank: 2,
  },
  {
    slug: "sistema-tributario-mas-normas",
    category: "Ideas firmadas",
    format: "Columna firmada",
    outlet: "Al Poniente",
    byline: "Jaime Alonso Cano Pino",
    editorialStatus: "Publicación del equipo · no es cobertura independiente",
    publishedAt: "2026-05-03",
    publishedLabel: "03 MAY 2026",
    title: "El sistema tributario colombiano produce más normas de las que cualquier contador puede leer",
    summary:
      "Una columna sobre sobrecarga normativa, acceso al conocimiento y el papel de una herramienta con fuentes visibles.",
    href:
      "https://alponiente.com/el-sistema-tributario-colombiano-produce-mas-normas-de-las-que-cualquier-contador-puede-leer/",
    visualKind: "archive",
    visualSignal: "IDEAS FIRMADAS / INFORMACIÓN",
    visualCode: "JACP / 03",
    featured: false,
  },
  {
    slug: "capa-sistema-tributario",
    category: "Ideas firmadas",
    format: "Columna firmada",
    outlet: "Al Poniente",
    byline: "Jaime Alonso Cano Pino",
    editorialStatus: "Publicación del equipo · no es cobertura independiente",
    publishedAt: "2026-04-16",
    publishedLabel: "16 ABR 2026",
    title: "La capa que le falta al sistema tributario colombiano",
    summary:
      "Jaime Alonso Cano Pino plantea por qué el acceso y la organización del conocimiento también forman parte de la infraestructura tributaria.",
    href: "https://alponiente.com/la-capa-que-le-falta-al-sistema-tributario-colombiano/",
    visualKind: "archive",
    visualSignal: "IDEAS FIRMADAS / INFRAESTRUCTURA",
    visualCode: "JACP / 02",
    featured: false,
  },
  {
    slug: "commonplace-ia-trabajo",
    category: "Medios",
    format: "Selección editorial",
    outlet: "The Commonplace",
    byline: "Curaduría editorial: The Commonplace",
    editorialStatus: "Selección editorial externa",
    publishedAt: "2026-04-06",
    publishedLabel: "06 ABR 2026",
    title: "Dos investigaciones sobre IA y trabajo, destacadas por The Commonplace",
    sourceTitle: "The Commonplace — 2026-04-06",
    summary:
      "El boletín internacional Workforce Futures seleccionó dos investigaciones del equipo sobre capital humano e IA centrada en las personas.",
    href: "https://buttondown.com/workforcefutures/archive/the-commonplace-2026-04-06/",
    visualKind: "mark",
    visualSignal: "WEEKLY RESEARCH DIGEST",
    image: "/brand/press/the-commonplace.svg",
    imageAlt: "Símbolo de The Commonplace",
    featured: true,
    homeRank: 6,
  },
  {
    slug: "hablando-cerebros-tributarios",
    category: "Ideas firmadas",
    format: "Columna firmada",
    outlet: "Al Poniente",
    byline: "Jaime Alonso Cano Pino",
    editorialStatus: "Publicación del equipo · no es cobertura independiente",
    publishedAt: "2026-04-04",
    publishedLabel: "04 ABR 2026",
    title: "Hablando de cerebros tributarios",
    summary:
      "El primer texto de la serie firmada por Jaime Alonso Cano Pino sobre conocimiento tributario y producto.",
    href: "https://alponiente.com/hablando-de-cerebros-tributarios/",
    visualKind: "archive",
    visualSignal: "IDEAS FIRMADAS / ORIGEN",
    visualCode: "JACP / 01",
    featured: false,
  },
  {
    slug: "medir-variables-cognitivas-llm",
    category: "Investigación",
    format: "Working paper",
    outlet: "arXiv",
    byline: "Cristian Espinal Maya",
    editorialStatus: "Working paper · no revisado por pares",
    publishedAt: "2026-04-02",
    publishedLabel: "02 ABR 2026",
    title: "Medir lo que una encuesta no alcanza a observar con modelos de lenguaje",
    sourceTitle: "Measuring What Cannot Be Surveyed: LLMs as Instruments for Latent Cognitive Variables in Labor Economics",
    summary:
      "Una propuesta metodológica para usar LLM como instrumentos de medición de variables cognitivas latentes, con validación sobre tareas ocupacionales.",
    href: "https://arxiv.org/abs/2604.02403",
    visualKind: "paper",
    visualSignal: "ECONOMÍA DEL TRABAJO / MEDICIÓN",
    visualCode: "2604.02403",
    featured: false,
  },
  {
    slug: "automatizacion-a-aumentacion",
    category: "Investigación",
    format: "Working paper",
    outlet: "arXiv",
    byline: "Cristian Espinal Maya",
    editorialStatus: "Working paper · no revisado por pares",
    publishedAt: "2026-04-01",
    publishedLabel: "01 ABR 2026",
    title: "De la automatización a la aumentación: diseñar trabajo centrado en las personas",
    sourceTitle: "From Automation to Augmentation: A Framework for Designing Human-Centric Work Environments in Society 5.0",
    summary:
      "Un marco de cinco dimensiones para estudiar cómo el diseño del trabajo cambia el valor que una organización obtiene de la IA.",
    href: "https://arxiv.org/abs/2604.01364",
    visualKind: "paper",
    visualSignal: "HUMAN–AI / WORKPLACE DESIGN",
    visualCode: "2604.01364",
    featured: false,
  },
  {
    slug: "capital-humano-aumentado",
    category: "Investigación",
    format: "Working paper",
    outlet: "arXiv",
    byline: "Cristian Espinal Maya",
    editorialStatus: "Working paper · no revisado por pares",
    publishedAt: "2026-04-01",
    publishedLabel: "01 ABR 2026",
    title: "Capital humano aumentado en economías atravesadas por inteligencia artificial",
    sourceTitle: "Augmented Human Capital: A Unified Theory and LLM-Based Measurement Framework for Cognitive Factor Decomposition in AI-Augmented Economies",
    summary:
      "Una teoría y un marco de medición para distinguir trabajo rutinario, trabajo manual y capacidad cognitiva amplificable por IA.",
    href: "https://arxiv.org/abs/2604.01066",
    visualKind: "paper",
    visualSignal: "CAPITAL HUMANO / IA",
    visualCode: "2604.01066",
    featured: false,
  },
  {
    slug: "riesgo-inundacion-antioquia",
    category: "Investigación",
    format: "Preprint",
    outlet: "SSRN",
    byline: "Cristian Espinal Maya · Santiago Jiménez Londoño",
    editorialStatus: "Preprint · no revisado por pares",
    publishedAt: "2026-03-25",
    publishedLabel: "25 MAR 2026",
    title: "Riesgo de inundación a escala municipal en Antioquia con Sentinel-1 y aprendizaje automático",
    sourceTitle: "Municipality-Scale Flood Risk Mapping in Antioquia, Colombia, Using Sentinel-1 SAR and Ensemble Machine Learning (2015–2025)",
    summary:
      "Un marco reproducible que traduce imágenes satelitales y modelos de ensamble en evidencia útil para decisiones territoriales.",
    href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6321538",
    visualKind: "paper",
    visualSignal: "TERRITORIO / RIESGO CLIMÁTICO",
    visualCode: "SSRN 6321538",
    featured: false,
  },
  {
    slug: "tribai-cerebro-tributario",
    category: "Medios",
    format: "Entrevista",
    outlet: "Al Poniente",
    byline: "Entrevista a Jaime Alonso Cano Pino",
    editorialStatus: "Publicada por Notas Al Poniente",
    publishedAt: "2026-03-24",
    publishedLabel: "24 MAR 2026",
    title: "Construimos el cerebro tributario que Colombia necesitaba",
    summary:
      "Una conversación sobre el origen de Tribai, el problema de buscar conocimiento tributario en documentos dispersos y la construcción del producto.",
    href:
      "https://alponiente.com/dejamos-de-buscar-en-pdfs-y-construimos-el-cerebro-tributario-que-colombia-necesitaba/",
    visualKind: "cover",
    visualSignal: "TRIBAI / ENTREVISTA",
    image: "/brand/press/tribai-al-poniente.png",
    imageAlt: "Portada de la entrevista sobre Tribai publicada por Al Poniente",
    featured: true,
    homeRank: 7,
  },
  {
    slug: "autonomia-horaria-colombia",
    category: "Medios",
    format: "Prensa",
    outlet: "Al Poniente",
    byline: "Nota sobre investigación de Cristian Espinal Maya y Santiago Jiménez Londoño",
    editorialStatus: "Nota editorial externa sobre investigación del equipo",
    publishedAt: "2026-03-05",
    publishedLabel: "05 MAR 2026",
    title: "Solo 3 de cada 10 empleados formales en Colombia deciden a qué hora trabajan",
    summary:
      "Resultados de una investigación sobre autonomía horaria, tamaño de empresa, ingreso, permanencia y satisfacción laboral en Colombia.",
    href:
      "https://alponiente.com/solo-3-de-cada-10-empleados-formales-en-colombia-deciden-a-que-hora-trabajan/",
    visualKind: "stat",
    visualSignal: "AUTONOMÍA HORARIA",
    stat: "3 / 10",
    featured: false,
  },
  {
    slug: "determinantes-flexibilidad-horaria",
    category: "Investigación",
    format: "Preprint",
    outlet: "arXiv",
    byline: "Cristian Espinal Maya · Santiago Jiménez Londoño",
    editorialStatus: "Preprint · no revisado por pares",
    publishedAt: "2024-09-22",
    publishedLabel: "22 SEP 2024",
    title: "Determinantes de la flexibilidad horaria en el lugar de trabajo",
    sourceTitle: "Determinants of Workplace Flextime Flexibility: An Empirical Analysis",
    summary:
      "La investigación de base que analiza qué factores están relacionados con la autonomía para elegir horarios entre empleados formales en Colombia.",
    href: "https://arxiv.org/abs/2409.14271",
    visualKind: "paper",
    visualSignal: "TRABAJO / AUTONOMÍA",
    visualCode: "2409.14271",
    featured: false,
  },
] satisfies readonly PressStory[];

/**
 * Las destacadas de la portada, en su orden editorial.
 *
 * `homeRank` manda; sin él se ordena por fecha. La portada muestra hasta
 * siete: la primera, si lleva `homeFeature`, ocupa la fila entera.
 */
export function featuredPressStories(limit = 7): PressStory[] {
  return pressStories
    .filter((story) => story.featured)
    .sort((a, b) => {
      const rankA = a.homeRank ?? Number.POSITIVE_INFINITY;
      const rankB = b.homeRank ?? Number.POSITIVE_INFINITY;
      if (rankA !== rankB) return rankA - rankB;
      return b.publishedAt.localeCompare(a.publishedAt);
    })
    .slice(0, limit);
}

/** Los formatos que son un hecho en un lugar y una fecha, no una publicación. */
export const eventFormats: ReadonlySet<PressStory["format"]> = new Set([
  "Panel",
  "Hackathon",
  "Patrocinio",
  "Cumbre",
]);

export const pressCategories = [
  {
    id: "medios",
    label: "Medios",
    description: "Notas, una entrevista identificada por su autoría, una selección editorial externa y un ranking.",
  },
  {
    id: "escenarios-publicos",
    label: "Escenarios públicos",
    description: "Paneles, encuentros y eventos donde el equipo comparte práctica y criterio.",
  },
  {
    id: "investigacion",
    label: "Investigación",
    description: "Preprints y working papers abiertos, identificados como trabajos sin revisión por pares.",
  },
  {
    id: "ideas-firmadas",
    label: "Ideas firmadas",
    description: "Columnas del equipo publicadas por un medio externo, separadas de la cobertura editorial.",
  },
  {
    id: "proyectos",
    label: "Proyectos",
    description: "Lanzamientos de software que construimos y que ya está en producción, enlazados al producto en vivo.",
  },
] as const satisfies readonly {
  id: string;
  label: PressCategory;
  description: string;
}[];
