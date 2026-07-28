export type PressCategory =
  | "Medios"
  | "Escenarios públicos"
  | "Investigación"
  | "Ideas firmadas";

export type PressStory = {
  slug: string;
  category: PressCategory;
  format:
    | "Entrevista"
    | "Prensa"
    | "Selección editorial"
    | "Panel"
    | "Preprint"
    | "Working paper"
    | "Columna firmada";
  outlet: string;
  publishedAt: `${number}-${number}-${number}`;
  publishedLabel: string;
  title: string;
  sourceTitle?: string;
  byline?: string;
  editorialStatus?: string;
  summary: string;
  href: string;
  visualKind: "cover" | "stat" | "mark" | "panel" | "paper" | "archive";
  visualSignal: string;
  visualCode?: string;
  image?: string;
  imageAlt?: string;
  stat?: string;
  featured: boolean;
};

/**
 * Archivo editorial con enlaces externos verificables.
 * Las publicaciones personales y la investigación se etiquetan por separado
 * para no presentarlas como cobertura periodística de INPLUX.
 */
export const pressStories = [
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
    visualKind: "panel",
    visualSignal: "XIV CONGRESO / MEDELLÍN",
    visualCode: "PANEL 11",
    featured: true,
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

export const pressCategories = [
  {
    id: "medios",
    label: "Medios",
    description: "Notas, una entrevista identificada por su autoría y una selección editorial externa.",
  },
  {
    id: "escenarios-publicos",
    label: "Escenarios públicos",
    description: "Paneles y conversaciones donde el equipo comparte práctica y criterio.",
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
] as const satisfies readonly {
  id: string;
  label: PressCategory;
  description: string;
}[];
