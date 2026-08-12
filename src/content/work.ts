export type WorkSlug = "tribai" | "gobia" | "kelsen" | "laudos" | "porkia";

export type WorkSource = {
  label: string;
  url: string;
  supports: string;
  verifiedAt: `${number}-${number}-${number}`;
};

export type WorkProfile = {
  kind: "product-profile";
  slug: WorkSlug;
  number: `0${number}`;
  name: string;
  category: string;
  shortDescription: string;
  headline: string;
  description: string;
  status: {
    label: string;
    detail: string;
  };
  access: {
    label: string;
    href: string;
    detail: string;
  };
  attribution: {
    state: "confirmed" | "unconfirmed";
    label: string;
    statement: string;
  };
  partners: readonly {
    name: string;
    role: string;
  }[];
  capabilities: readonly {
    title: string;
    description: string;
  }[];
  interface: {
    theme: "tributary" | "civic" | "legal" | "arbitration" | "livestock";
    eyebrow: string;
    primaryMetric: string;
    metricLabel: string;
    items: readonly {
      label: string;
      value: string;
      state?: "accent" | "muted";
    }[];
  };
  sources: readonly WorkSource[];
};

export const workProfiles = [
  {
    kind: "product-profile",
    slug: "tribai",
    number: "01",
    name: "Tribai",
    category: "Tributación",
    shortDescription:
      "Consulta tributaria con fuentes, vigencia y herramientas visibles.",
    headline: "Encontrar criterio tributario sin perder la fuente.",
    description:
      "Tribai reúne consulta y herramientas tributarias en un entorno orientado a revisar el sustento y la vigencia de la información.",
    status: {
      label: "Producto público",
      detail: "El sitio y sus herramientas se encuentran públicamente accesibles.",
    },
    access: {
      label: "Abrir asistente",
      href: "https://app.tribai.co/",
      detail: "El asistente tributario puede explorarse públicamente en el dominio oficial.",
    },
    attribution: {
      state: "confirmed",
      label: "Desarrollo de INPLUX",
      statement:
        "Tribai es un desarrollo de INPLUX. La autoría la declaramos nosotros: las fuentes de este perfil respaldan lo que el producto publica —capacidades, interfaz y disponibilidad—, no quién lo construyó.",
    },
    partners: [],
    capabilities: [
      {
        title: "Consulta con contexto",
        description:
          "La respuesta se presenta junto a referencias que permiten continuar la revisión.",
      },
      {
        title: "Fuentes visibles",
        description:
          "El producto expone el origen de la información para que la lectura no termine en una respuesta aislada.",
      },
      {
        title: "Vigencia",
        description:
          "La interfaz hace visible el estado temporal de la información tributaria.",
      },
      {
        title: "Herramientas",
        description:
          "Incluye utilidades especializadas que acompañan la consulta tributaria.",
      },
    ],
    interface: {
      theme: "tributary",
      eyebrow: "CONSULTA / TRIBUTARIA",
      primaryMetric: "4",
      metricLabel: "fuentes verificadas",
      items: [
        { label: "Art. 383 ET", value: "Vigente", state: "accent" },
        { label: "Confianza", value: "88% · Alta" },
        { label: "Cálculo", value: "7/7 coincidencias" },
      ],
    },
    sources: [
      {
        label: "Sitio oficial de Tribai",
        url: "https://tribai.co/",
        supports:
          "Existencia pública del producto, enfoque tributario, consulta, fuentes, vigencia y herramientas.",
        verifiedAt: "2026-08-11",
      },
      {
        label: "Asistente público de Tribai",
        url: "https://app.tribai.co/",
        supports:
          "Disponibilidad pública de la interfaz del asistente tributario mostrada en la captura.",
        verifiedAt: "2026-08-11",
      },
    ],
  },
  {
    kind: "product-profile",
    slug: "gobia",
    number: "02",
    name: "Gobia",
    category: "Gestión pública",
    shortDescription:
      "Información y seguimiento municipal reunidos en un solo entorno.",
    headline: "Hacer visible la operación de un municipio.",
    description:
      "Gobia organiza información y seguimiento municipal para apoyar la lectura de lo que ocurre en una entidad. Su sitio declara públicamente que es una solución de INPLUX y presenta una demostración del producto.",
    status: {
      label: "Piloto activo",
      detail: "Estado publicado por el producto al momento de la verificación.",
    },
    access: {
      label: "Abrir demo",
      href: "https://www.gobia.co/demo",
      detail: "La demo pública permite explorar el centro de mando con datos de Medellín.",
    },
    attribution: {
      state: "confirmed",
      label: "Solución de INPLUX",
      statement:
        "La relación con INPLUX está declarada públicamente en el sitio de Gobia. Este perfil documenta esa atribución sin convertirla en una afirmación de resultados.",
    },
    partners: [],
    capabilities: [
      {
        title: "Lectura municipal",
        description:
          "Reúne información que normalmente está distribuida entre dependencias y reportes.",
      },
      {
        title: "Seguimiento",
        description:
          "Permite observar asuntos, responsables y estados desde una vista común.",
      },
      {
        title: "Trazabilidad operativa",
        description:
          "Conserva contexto suficiente para comprender cómo avanza cada frente.",
      },
      {
        title: "Demostración",
        description:
          "El producto cuenta con una ruta pública para conocer su funcionamiento.",
      },
    ],
    interface: {
      theme: "civic",
      eyebrow: "MUNICIPIO / OPERACIÓN",
      primaryMetric: "16+",
      metricLabel: "fuentes conectadas",
      items: [
        { label: "Recaudo", value: "92,1% de la meta", state: "accent" },
        { label: "Reporte FUT", value: "15 minutos" },
        { label: "Estatuto municipal", value: "Beta activa" },
      ],
    },
    sources: [
      {
        label: "Sitio oficial de Gobia",
        url: "https://gobia.co/",
        supports:
          "Descripción del producto, atribución pública a INPLUX, estado de piloto y disponibilidad de demostración.",
        verifiedAt: "2026-08-11",
      },
      {
        label: "Demo pública de Gobia",
        url: "https://www.gobia.co/demo",
        supports:
          "Disponibilidad pública del mapa y el centro de mando fiscal mostrados en la captura.",
        verifiedAt: "2026-08-11",
      },
    ],
  },
  {
    kind: "product-profile",
    slug: "kelsen",
    number: "03",
    name: "Kelsen",
    category: "Derecho",
    shortDescription:
      "Análisis, redacción y monitoreo jurídico con trazabilidad.",
    headline: "Trabajar conocimiento jurídico con una ruta verificable.",
    description:
      "Kelsen presenta capacidades para investigar, analizar, redactar y monitorear trabajo jurídico conservando trazabilidad.",
    status: {
      label: "Explorador público",
      detail: "La biblioteca jurídica y sus filtros se encuentran públicamente accesibles.",
    },
    access: {
      label: "Abrir explorador",
      href: "https://kelsen.io/explorador",
      detail:
        "La biblioteca legal puede explorarse públicamente en kelsen.io.",
    },
    attribution: {
      state: "confirmed",
      label: "Desarrollo de INPLUX",
      statement:
        "Kelsen es un desarrollo de INPLUX. La autoría la declaramos nosotros: las fuentes de este perfil respaldan lo que el producto publica —capacidades, biblioteca y disponibilidad—, no quién lo construyó.",
    },
    partners: [],
    capabilities: [
      {
        title: "Análisis",
        description:
          "Organiza el estudio de documentos y preguntas jurídicas en una superficie de trabajo.",
      },
      {
        title: "Redacción",
        description:
          "Acompaña la construcción de documentos manteniendo el contexto de la investigación.",
      },
      {
        title: "Monitoreo",
        description:
          "Permite seguir asuntos y cambios relevantes dentro del trabajo jurídico.",
      },
      {
        title: "Trazabilidad",
        description:
          "Hace visible la ruta entre una afirmación, su documento y su fuente.",
      },
    ],
    interface: {
      theme: "legal",
      eyebrow: "EXPEDIENTE / ANÁLISIS",
      primaryMetric: "RUTA",
      metricLabel: "documental verificable",
      items: [
        { label: "Análisis", value: "Documento y contexto" },
        { label: "Redacción", value: "Evidencia vinculada", state: "accent" },
        { label: "Monitoreo", value: "Fuente oficial" },
      ],
    },
    sources: [
      {
        label: "Sitio oficial de Kelsen",
        url: "https://kelsen.io/",
        supports:
          "Presentación pública de capacidades de análisis, redacción, monitoreo y trazabilidad jurídica.",
        verifiedAt: "2026-08-11",
      },
      {
        label: "Explorador público de Kelsen",
        url: "https://kelsen.io/explorador?vigencia=modificado",
        supports:
          "Disponibilidad pública de la biblioteca legal, búsqueda, filtros y resultados del corpus; es la vista exacta usada en la captura.",
        verifiedAt: "2026-08-11",
      },
    ],
  },
  {
    kind: "product-profile",
    slug: "laudos",
    number: "04",
    name: "Laudos",
    category: "Arbitraje",
    shortDescription:
      "Búsqueda de laudos y jurisprudencia arbitral con criterio legal.",
    headline: "Explorar conocimiento arbitral con estructura.",
    description:
      "Laudos ofrece búsqueda sobre laudos y jurisprudencia arbitral. Su sitio atribuye el desarrollo técnico a INPLUX y el criterio legal a REDEK, y presenta el producto en beta abierta.",
    status: {
      label: "Beta abierta",
      detail: "Estado y modalidad de acceso publicados por el producto.",
    },
    access: {
      label: "Abrir laboratorio",
      href: "https://laudos.co/?view=predecir",
      detail: "El Laboratorio de Predicción puede explorarse públicamente en la beta abierta.",
    },
    attribution: {
      state: "confirmed",
      label: "Desarrollo técnico de INPLUX",
      statement:
        "La atribución pública separa responsabilidades: INPLUX realiza el desarrollo técnico y REDEK aporta el criterio legal.",
    },
    partners: [
      {
        name: "REDEK",
        role: "Criterio legal",
      },
      {
        name: "INPLUX",
        role: "Desarrollo técnico",
      },
    ],
    capabilities: [
      {
        title: "Búsqueda especializada",
        description:
          "Permite explorar laudos y jurisprudencia arbitral desde una consulta orientada al dominio.",
      },
      {
        title: "Criterio legal",
        description:
          "La estructura del producto se desarrolla junto a una contraparte especializada en la materia.",
      },
      {
        title: "Lectura de resultados",
        description:
          "Organiza coincidencias y referencias para continuar el análisis del documento.",
      },
      {
        title: "Beta abierta",
        description:
          "El acceso permite observar y evaluar el producto mientras sigue evolucionando.",
      },
    ],
    interface: {
      theme: "arbitration",
      eyebrow: "ARBITRAJE / BÚSQUEDA",
      primaryMetric: "5.447",
      metricLabel: "documentos del corpus",
      items: [
        { label: "Laudos", value: "2.660", state: "accent" },
        { label: "Consejo de Estado", value: "2.787" },
        { label: "Cobertura", value: "1985–2026" },
      ],
    },
    sources: [
      {
        label: "Sitio oficial de Laudos",
        url: "https://laudos.co/",
        supports:
          "Objeto del producto, beta abierta y atribución diferenciada entre INPLUX y REDEK.",
        verifiedAt: "2026-08-11",
      },
      {
        label: "Laboratorio de Predicción de Laudos",
        url: "https://laudos.co/?view=predecir",
        supports:
          "Disponibilidad pública del formulario de análisis arbitral mostrado en la captura.",
        verifiedAt: "2026-08-11",
      },
    ],
  },
  {
    kind: "product-profile",
    slug: "porkia",
    number: "05",
    name: "Porkia",
    category: "Porcicultura",
    shortDescription:
      "Lotes, cuido, sanidad y cuentas de una finca porcícola en una sola app.",
    headline: "Llevar una finca porcícola sin volver al cuaderno.",
    description:
      "Porkia reúne el seguimiento de lotes, el cuido, la sanidad y las cuentas de una finca porcícola en una aplicación móvil que funciona sin conexión y guarda los datos en el teléfono.",
    status: {
      // El sitio anuncia la salida a tiendas para junio de 2026 y esa fecha ya
      // pasó cuando se verificó. El perfil publica lo que el producto sostiene
      // hoy —la inscripción a la beta cerrada— y anota el anuncio vencido en
      // vez de repetirlo como si siguiera vigente.
      label: "Beta cerrada",
      detail:
        "El sitio inscribe a porcicultores de Antioquia en una beta cerrada. Sus fichas de tienda seguían anunciando junio de 2026 en la fecha de verificación.",
    },
    access: {
      label: "Abrir demostración",
      href: "https://porkia.co/#demo",
      detail:
        "Las pantallas de la aplicación pueden recorrerse públicamente en el navegador, con datos de ejemplo. La aplicación todavía no se entrega: el sitio inscribe a la beta cerrada y anuncia que enviará el enlace cuando esté lista.",
    },
    attribution: {
      state: "confirmed",
      label: "Desarrollo de INPLUX",
      statement:
        "Porkia es un desarrollo de INPLUX. La autoría la declaramos nosotros: las fuentes de este perfil respaldan lo que el producto publica —capacidades, demostración y modalidad de acceso—, no quién lo construyó.",
    },
    partners: [],
    capabilities: [
      {
        title: "Lotes y crecimiento",
        description:
          "Registra cada lote de cerdas con sus crías, el peso de los animales y el avance de la ceba.",
      },
      {
        title: "Cuido y bodega",
        description:
          "Lleva el inventario de bultos y su consumo por lote, y avisa cuando la bodega baja.",
      },
      {
        title: "Plan sanitario",
        description:
          "Programa vacunas, vermifugaciones e inspecciones, y recuerda cada una el día que corresponde.",
      },
      {
        title: "Cuentas por lote",
        description:
          "Reúne ventas, kilos entregados e ingreso para leer qué dejó cada lote.",
      },
    ],
    interface: {
      theme: "livestock",
      eyebrow: "FINCA / PORCÍCOLA",
      // La demostración pública corre sobre datos de ejemplo de una granja
      // ficticia: sus cifras describen el escenario de la demo, no el producto.
      // Por eso este bloque usa etiquetas cualitativas, como el de Kelsen.
      primaryMetric: "CERDO",
      metricLabel: "seguido desde el día del parto",
      items: [
        { label: "Cuido", value: "Bultos y consumo" },
        { label: "Sanidad", value: "Plan programado", state: "accent" },
        { label: "Cuentas", value: "Ingreso por lote" },
      ],
    },
    sources: [
      {
        label: "Sitio oficial de Porkia",
        url: "https://porkia.co/",
        supports:
          "Existencia pública del producto, alcance sobre lotes, cuido, sanidad y cuentas, funcionamiento sin conexión y la beta cerrada para porcicultores de Antioquia.",
        verifiedAt: "2026-08-11",
      },
      {
        label: "Demostración pública de Porkia",
        url: "https://porkia.co/#demo",
        supports:
          "Disponibilidad pública de la demostración navegable con datos de ejemplo; es la vista exacta usada en la captura.",
        verifiedAt: "2026-08-11",
      },
    ],
  },
] as const satisfies readonly WorkProfile[];

export const workDirectory = [
  ...workProfiles.map((profile) => ({
    name: profile.name,
    category: profile.category,
    status: profile.status.label,
    attribution: profile.attribution.label,
    href: `/trabajo/${profile.slug}` as const,
    hasProfile: true as const,
  })),
  {
    name: "MiMotoYa",
    category: "Movilidad",
    status: "En desarrollo",
    // Es un desarrollo de INPLUX como los perfiles anteriores; lo que todavía
    // no tiene es una superficie pública que citar, y por eso `hasProfile` es
    // falso y no hay `href`.
    attribution: "Desarrollo de INPLUX",
    href: null,
    hasProfile: false as const,
  },
] as const;

export function getWorkProfile(slug: string) {
  return workProfiles.find((profile) => profile.slug === slug);
}
