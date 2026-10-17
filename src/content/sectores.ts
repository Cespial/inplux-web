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
 */

export type SectorSlug = "salud";

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

export type SectorProfile = {
  slug: SectorSlug;
  /** Nombre corto, para la fila de la portada y el pie. */
  name: string;
  /** Título de la página y de la pestaña. */
  title: string;
  /** Descripción para buscadores (≤ 160 caracteres). */
  description: string;
  eyebrow: string;
  headline: readonly [string, string];
  lead: string;
  /** Para quién es la página, en una frase. */
  audience: string;
  /** Principios de diseño que aplicamos en el sector. */
  principles: readonly { title: string; detail: string }[];
  capabilities: readonly SectorCapability[];
  framework: readonly SectorFrameworkItem[];
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
    eyebrow: "SECTOR / SALUD",
    headline: ["Software para prestadores de salud", "que ya tienen una historia clínica."],
    lead: "Las IPS no necesitan empezar de cero. Construimos lo que falta alrededor de los sistemas que ya operan: la relación con el paciente, el seguimiento entre consultas, la integración con la historia clínica existente y el soporte a quienes usan el sistema todos los días.",
    audience:
      "Para IPS, clínicas, hospitales y redes de prestadores en Colombia, con equipos clínicos y administrativos que necesitan herramientas que se adapten a su operación y no al revés.",
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
] as const satisfies readonly SectorProfile[];

export function getSectorProfile(slug: string): SectorProfile | undefined {
  return sectorProfiles.find((sector) => sector.slug === slug);
}
