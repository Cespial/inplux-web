/**
 * Páginas de sector: `/sectores/[slug]`.
 *
 * Un sector es una lectura transversal del trabajo —qué construimos para un
 * tipo de organización— y no un producto. Por eso vive aparte de `work.ts`,
 * que documenta productos con fuentes, y de `home.ts`, que lista el
 * portafolio. Añadir un sector es añadir un registro aquí: la ruta, el
 * sitemap, la fila de la portada y el pie lo recogen solos.
 *
 * Regla de evidencia, igual que en el resto del sitio: cada capacidad lleva
 * un estado honesto. «En construcción» es trabajo contratado que aún no
 * opera con usuarios reales; «En operación» corre con un cliente; «Prototipo»
 * existe y se puede abrir, pero no es un producto; «Oferta» es lo que
 * diseñamos y cotizamos, sin un caso publicable todavía. Ningún cliente se
 * nombra aquí: la decisión del 17-oct-2026 fue publicar capacidades, no casos,
 * hasta tener autorización escrita de cada organización.
 *
 * Desde octubre de 2026 las cuatro páginas comparten una plantilla: hero con
 * imagen, un reclamo, tres promesas de dos tiempos, los productos que aplican
 * y, donde la hay, la norma. Salud conserva además sus principios y sus piezas
 * con estado, que ya estaban escritos y revisados.
 */

import type { WorkSlug } from "./work";

export type SectorSlug = "publico" | "salud" | "legal-tributario" | "empresas";

export type SectorCapabilityStatus =
  | "En operación"
  | "En construcción"
  | "Prototipo"
  | "Oferta";

export type SectorCapability = {
  code: string;
  title: string;
  description: string;
  /** Qué incluye, en frases cortas. */
  items: readonly string[];
  status: SectorCapabilityStatus;
  /** Enlace público, solo cuando existe algo que abrir. */
  href?: string;
  hrefLabel?: string;
};

export type SectorFrameworkItem = {
  /** Norma o estándar, tal como se cita. */
  label: string;
  /** Qué resuelve en el diseño, en una frase. */
  detail: string;
  /** Fuente oficial consultada. */
  href: string;
};

/** Una promesa de dos tiempos, como las tarjetas de sector de octubre de 2026: «Cada expediente, / comprobado.» */
export type SectorPromise = {
  /** Etiqueta corta de la línea de trabajo. */
  label: string;
  /** Primer tiempo, termina en coma. */
  lineA: string;
  /** Segundo tiempo, termina en punto. */
  lineB: string;
};

export type SectorProfile = {
  slug: SectorSlug;
  /** Nombre corto, para la fila de la portada y el pie. */
  name: string;
  /** Título de la página y de la pestaña. */
  title: string;
  /** Descripción para buscadores (≤ 160 caracteres). */
  description: string;
  eyebrow: string;
  /** Lead del hero: «IA para X, Y y Z.» */
  lead: string;
  /** Para quién es la página, en una frase. */
  audience: string;
  /** Imagen a sangre del hero (3:2) y su texto alternativo. */
  hero: { image: string; alt: string };
  /** El reclamo de la página (H2) y el párrafo que lo sostiene. */
  claim: string;
  intro: string;
  /** Tres promesas de dos tiempos. */
  promises: readonly [SectorPromise, SectorPromise, SectorPromise];
  /** Productos propios que aplican en el sector; vacío cuando ninguno. */
  products: readonly WorkSlug[];
  /** `serviceType` y `audienceType` del JSON-LD, sin cobertura geográfica. */
  serviceType: string;
  audienceType: string;
  /** Principios de diseño, solo donde ya estaban escritos. */
  principles?: readonly { title: string; detail: string }[];
  /** Piezas con estado honesto, solo donde ya estaban documentadas. */
  capabilities?: readonly SectorCapability[];
  /** Marco normativo, solo en los sectores regulados. */
  framework?: readonly SectorFrameworkItem[];
  closing: {
    title: string;
    lead: string;
  };
  /** Fecha en que se revisó por última vez el contenido de la página. */
  verifiedAt: `${number}-${number}-${number}`;
};

export const sectorProfiles = [
  {
    slug: "salud",
    name: "Salud",
    title: "Software para IPS y prestadores de salud",
    description:
      "Lo que INPLUX construye para IPS y prestadores de salud en Colombia: app de pacientes, central de telemonitoreo, integración con la historia clínica, mesa de ayuda, tableros y sistemas a la medida.",
    eyebrow: "Sector",
    lead: "IA para pacientes, telemonitoreo e historia clínica.",
    audience:
      "Para IPS, clínicas, hospitales y redes de prestadores en Colombia, con equipos clínicos y administrativos que necesitan herramientas que se adapten a su operación y no al revés.",
    hero: {
      image: "/sectores/sector-salud.webp",
      alt: "Una clínica consulta una tableta junto al monitor de un paciente, con la luz de un ventanal.",
    },
    claim: "Software alrededor de la historia clínica que la IPS ya tiene.",
    intro:
      "Las IPS no necesitan empezar de cero. Construimos lo que falta alrededor de los sistemas que ya operan: la relación con el paciente, el seguimiento entre consultas, la integración con la historia clínica existente y el soporte a quienes usan el sistema todos los días, con el equipo clínico decidiendo en cada alerta.",
    promises: [
      { label: "Pacientes", lineA: "Cada paciente,", lineB: "acompañado." },
      { label: "Telemonitoreo", lineA: "Cada alerta,", lineB: "atendida." },
      { label: "Historia clínica", lineA: "Cada dato,", lineB: "en su fuente." },
    ],
    products: [],
    serviceType: "Desarrollo de software a la medida para prestadores de salud",
    audienceType: "IPS, clínicas, hospitales y redes de prestadores de salud",
    principles: [
      {
        title: "La app suma, no condiciona",
        detail:
          "Ningún servicio depende de que el paciente use el celular. Los canales que ya existen siguen abiertos; el software agrega una vía más.",
      },
      {
        title: "La historia clínica sigue siendo la fuente",
        detail:
          "Lo que construimos lee y agenda sobre la historia clínica que la IPS ya tiene. Escribir en ella se diseña aparte, con autorización expresa y registro de quién consulta qué.",
      },
      {
        title: "Intervenir antes de la urgencia",
        detail:
          "El registro entre consultas se convierte en alertas para el equipo de la central, con un guion de atención y un cierre con desenlace.",
      },
      {
        title: "Acceso sin contraseñas que perder",
        detail:
          "El paciente escribe su documento y recibe un código por mensaje de texto. Nada que recordar ni que restablecer.",
      },
    ],
    capabilities: [
      {
        code: "S–01",
        title: "App de pacientes",
        description:
          "La aplicación institucional de la IPS: acceso a los servicios, gestión del riesgo en salud y bienestar del usuario desde el celular.",
        items: [
          "Citas, resultados y autorizaciones",
          "PQR-F con trazabilidad",
          "Planes de cuidado y contenido educativo",
          "Cuidadores con acceso delegado",
          "Android, iOS y web desde una sola base de código",
        ],
        status: "En construcción",
      },
      {
        code: "S–02",
        title: "Central de telemonitoreo",
        description:
          "Un tablero para la enfermería y la medicina de la central: la cola de alertas priorizada por semáforo, la ficha del paciente, el guion de atención y el cierre con desenlace.",
        items: [
          "Reglas por programa: riesgo cardiovascular, diabetes, EPOC y gestantes",
          "Registro del paciente entre consultas",
          "Priorización por semáforo y guion de atención",
          "Cierre con desenlace y bitácora",
        ],
        status: "En construcción",
      },
      {
        code: "S–03",
        title: "Integración con la historia clínica",
        description:
          "Una capa de servicios entre la app y el sistema de historia clínica que la IPS ya opera, para que agenda, lista de espera, PQRS y laboratorio hablen entre sí.",
        items: [
          "Agendar, consultar y cancelar citas",
          "Lista de espera y PQRS",
          "Resultados de laboratorio",
          "Verificación automática por horas y bitácora inmutable",
        ],
        status: "En construcción",
      },
      {
        code: "S–04",
        title: "Mesa de ayuda y soporte",
        description:
          "Un portal de atención para quienes usan el sistema: tickets, seguimiento y respuesta por correo, sin contraseñas ni instalaciones.",
        items: [
          "Acceso sin contraseña por enlace",
          "Carga masiva de tickets desde Excel o CSV",
          "Correo en hilo y registro inmutable",
          "Acuerdos de respuesta visibles",
        ],
        status: "En operación",
      },
      {
        code: "S–05",
        title: "Tableros y analítica",
        description:
          "Salas de control sobre los datos que la organización ya produce: registros, vencimientos y novedades en una sola vista.",
        items: [
          "Consolidación de fuentes dispersas",
          "Bandeja de novedades y vencimientos",
          "Indicadores por sede, programa o servicio",
        ],
        status: "Oferta",
      },
      {
        code: "S–06",
        title: "Sistemas administrativos y asistenciales a la medida",
        description:
          "Cuando el software del mercado no encaja con la operación: módulos administrativos, asistenciales y de facturación diseñados sobre los procesos reales de la institución, con la interoperabilidad que la norma exige.",
        items: [
          "Módulo asistencial y agenda",
          "Facturación y RIPS",
          "Resumen digital de atención para la historia clínica electrónica interoperable",
          "Archivo clínico a demanda",
        ],
        status: "Oferta",
      },
      {
        code: "S–07",
        title: "Amparo.help · resolución de disputas en salud",
        description:
          "Un prototipo para resolver disputas entre pacientes y aseguradores sin abogados ni costos de juzgado, con la decisión final en manos humanas. Lo llevamos al hackathon de ODR 2026 en Boston.",
        items: [
          "Triaje del caso y arreglo directo con la aseguradora",
          "Borrador de tutela cuando no hay arreglo",
          "Tablero para el juez",
        ],
        status: "Prototipo",
        href: "https://amparo.help",
        hrefLabel: "Abrir Amparo.help",
      },
    ],
    framework: [
      {
        label: "Resolución 866 de 2021",
        detail:
          "Define el conjunto de datos mínimos y el mecanismo de interoperabilidad de la historia clínica electrónica.",
        href: "https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%20No.%20866%20de%202021.pdf",
      },
      {
        label: "Resolución 2275 de 2023",
        detail:
          "Fija el reporte de RIPS como soporte de la factura electrónica de venta en salud.",
        href: "https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%20No.%202275%20de%202023.pdf",
      },
      {
        label: "Resolución 3100 de 2019",
        detail:
          "Condiciones de habilitación de los prestadores: la operación que el software tiene que respetar.",
        href: "https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%20No.%203100%20de%202019.pdf",
      },
      {
        label: "Ley 1581 de 2012",
        detail:
          "Protección de datos personales. Los datos de salud son sensibles: autorización expresa, cifrado y registro de acceso.",
        href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981",
      },
    ],
    closing: {
      title: "Cuéntanos qué sistema ya tienen y qué falta alrededor.",
      lead: "Empezamos por la operación real: qué sistema de historia clínica usan, cuántas sedes, qué programas y qué duele hoy. Con eso dimensionamos lo que sigue.",
    },
    verifiedAt: "2026-10-17",
  },
  {
    slug: "publico",
    name: "Sector público",
    title: "IA para alcaldías y entidades públicas",
    description:
      "Lo que INPLUX construye para alcaldías, entidades territoriales y hacienda pública: información fiscal con fuente, revisión de contratación y seguimiento de la gestión, con el equipo aprobando cada paso.",
    eyebrow: "Sector",
    lead: "IA para hacienda municipal, contratación y seguimiento de la gestión.",
    audience:
      "Para alcaldías, secretarías de hacienda, entidades territoriales y entes de control que necesitan ver su operación con cifras que se puedan defender.",
    hero: {
      image: "/sectores/sector-publico.webp",
      alt: "Una funcionaria revisa un formulario impreso en una ventanilla, con un ciudadano de espaldas y una bandera de Colombia al fondo.",
    },
    claim: "La operación pública, visible y con cada decisión respaldada.",
    intro:
      "Trabajamos sobre los sistemas que la entidad ya opera —presupuesto, recaudo, contratación, archivo— y dejamos cada cifra con su fuente y cada revisión con su registro. Lo que se automatiza queda trazado; lo que se decide, lo decide el funcionario.",
    promises: [
      { label: "Recaudo", lineA: "Cada contribuyente,", lineB: "ubicado." },
      { label: "Contratación", lineA: "Cada expediente,", lineB: "comprobado." },
      { label: "Seguimiento", lineA: "Cada meta,", lineB: "con su cifra." },
    ],
    products: ["gobia", "tribai"],
    serviceType: "Desarrollo e implementación de IA para entidades públicas",
    audienceType: "Alcaldías, entidades territoriales, secretarías de hacienda y entes de control",
    framework: [
      {
        label: "Ley 1712 de 2014",
        detail:
          "Transparencia y acceso a la información pública: lo que se publica, cómo y con qué trazabilidad.",
        href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=56882",
      },
      {
        label: "Decreto 1082 de 2015",
        detail:
          "Reglas de la contratación pública que cada comprobación sobre un expediente tiene que respetar.",
        href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=77653",
      },
      {
        label: "Ley 1581 de 2012",
        detail:
          "Protección de datos personales: los datos de contribuyentes y ciudadanos exigen autorización, cifrado y registro de acceso.",
        href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981",
      },
    ],
    closing: {
      title: "Cuéntanos qué sistema ya opera la entidad y qué cifra no cuadra.",
      lead: "Empezamos por un proceso concreto: el recaudo de un impuesto, una muestra de contratos o un tablero de metas. Con eso dimensionamos lo que sigue.",
    },
    verifiedAt: "2026-10-20",
  },
  {
    slug: "legal-tributario",
    name: "Legal y tributario",
    title: "IA para firmas, contadores y áreas jurídicas",
    description:
      "Lo que INPLUX construye para firmas de abogados, contadores y áreas jurídicas: consulta tributaria con fuente oficial, vigencia de normas, jurisprudencia y laudos comparables.",
    eyebrow: "Sector",
    lead: "IA para consulta normativa, vigencia y jurisprudencia.",
    audience:
      "Para firmas de abogados, contadores, revisores fiscales y áreas jurídicas que responden por lo que firman y necesitan la fuente en cada respuesta.",
    hero: {
      image: "/sectores/sector-legal-tributario.webp",
      alt: "Unas manos anotan con un bolígrafo un estatuto impreso sobre un escritorio de madera, con expedientes y códigos al fondo.",
    },
    claim: "Criterio con fuente, en el flujo de trabajo del abogado y del contador.",
    intro:
      "Conectamos el Estatuto Tributario, la doctrina y la jurisprudencia vigentes con las herramientas que tu equipo ya usa. Cada respuesta llega con el artículo, la fecha y el enlace oficial; la decisión sigue siendo de quien firma.",
    promises: [
      { label: "Normativa", lineA: "Cada artículo,", lineB: "con su vigencia." },
      { label: "Jurisprudencia", lineA: "Cada criterio,", lineB: "con su sentencia." },
      { label: "Arbitraje", lineA: "Cada laudo,", lineB: "comparable." },
    ],
    products: ["tribai", "kelsen", "laudos"],
    serviceType: "IA para consulta tributaria, jurídica y arbitral",
    audienceType: "Firmas de abogados, contadores, revisores fiscales y áreas jurídicas",
    closing: {
      title: "Cuéntanos qué consulta se repite y dónde vive hoy la respuesta.",
      lead: "Empezamos por las preguntas que tu equipo responde cada semana: qué norma, qué doctrina, qué fallo. Con eso definimos qué conectar primero.",
    },
    verifiedAt: "2026-10-20",
  },
  {
    slug: "empresas",
    name: "Empresas",
    title: "IA para la operación de empresas",
    description:
      "Lo que INPLUX construye para compañías privadas: productos digitales, herramientas internas y datos conciliados sobre los sistemas que ya operan, con las decisiones críticas en manos del equipo.",
    eyebrow: "Sector",
    lead: "IA para operación, datos y productos digitales.",
    audience:
      "Para compañías con una operación real —planta, finca, servicio, ventas— que quieren un producto o una herramienta interna que el equipo adopte.",
    hero: {
      image: "/sectores/sector-empresas.webp",
      alt: "Un supervisor camina por el piso de una planta con una tableta, entre máquinas y líneas amarillas de seguridad.",
    },
    claim: "Productos y herramientas internas que la operación adopta.",
    intro:
      "Entramos por un proceso concreto y construimos sobre los sistemas que ya operas: el ERP, la hoja de cálculo que manda, el chat del equipo. Lo que se automatiza queda registrado y lo crítico pasa por una persona antes de ejecutarse.",
    promises: [
      { label: "Operación", lineA: "Cada proceso,", lineB: "medido." },
      { label: "Datos", lineA: "Cada fuente,", lineB: "conciliada." },
      { label: "Producto", lineA: "Cada idea,", lineB: "en producción." },
    ],
    products: ["porkia", "tribai"],
    serviceType: "Desarrollo de productos digitales e implementación de IA para empresas",
    audienceType: "Compañías privadas con operación propia: industria, agro, servicios y comercio",
    closing: {
      title: "Cuéntanos qué proceso duele y en qué sistema vive hoy.",
      lead: "Empezamos por una operación concreta y su dato: qué se registra, dónde y quién lo revisa. Con eso dimensionamos un piloto que se pueda usar.",
    },
    verifiedAt: "2026-10-20",
  },
] as const satisfies readonly SectorProfile[];

export function getSectorProfile(slug: string): SectorProfile | undefined {
  return sectorProfiles.find((sector) => sector.slug === slug);
}

export function isSectorSlug(slug: string): slug is SectorSlug {
  return sectorProfiles.some((sector) => sector.slug === slug);
}
