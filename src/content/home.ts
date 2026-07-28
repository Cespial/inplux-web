export const services = [
  {
    number: "01",
    title: "Lanzar un producto digital",
    copy:
      "Convertimos una oportunidad o una idea en una primera versión útil, preparada para aprender, crecer y evolucionar.",
  },
  {
    number: "02",
    title: "Mejorar una operación",
    copy:
      "Construimos herramientas que conectan personas, procesos, reglas y datos alrededor de la forma real de trabajar.",
  },
  {
    number: "03",
    title: "Automatizar trabajo y conocimiento",
    copy:
      "Convertimos tareas repetitivas y conocimiento disperso en flujos trazables, con revisión humana donde importa.",
  },
] as const;

export const method = [
  {
    number: "01",
    title: "Entendemos el reto",
    copy:
      "Hablamos con las personas involucradas, revisamos el contexto y definimos qué debería cambiar.",
  },
  {
    number: "02",
    title: "Definimos el producto",
    copy:
      "Convertimos el reto en prioridades, flujos y criterios claros para construir la primera versión útil.",
  },
  {
    number: "03",
    title: "Construimos y probamos",
    copy:
      "Diseñamos la experiencia, desarrollamos el software y revisamos su funcionamiento, sus riesgos y su utilidad.",
  },
  {
    number: "04",
    title: "Lanzamos y evolucionamos",
    copy:
      "Ponemos una versión útil en producción, observamos cómo funciona y decidimos contigo qué mejorar después.",
  },
] as const;

export const portfolio: Array<{
  name: string;
  category: string;
  description: string;
  stage?: "Piloto activo" | "Beta" | "En desarrollo";
  access?: "Público" | "Abierto" | "Por solicitud";
  href?: string;
  verifiedAt: `${number}-${number}-${number}`;
}> = [
  {
    name: "Tribai",
    category: "Tributación",
    description: "Consulta y herramientas tributarias con fuentes visibles.",
    access: "Público",
    href: "/trabajo/tribai",
    verifiedAt: "2026-07-15",
  },
  {
    name: "Gobia",
    category: "Gestión pública",
    description: "Información y seguimiento municipal en un solo entorno.",
    stage: "Piloto activo",
    href: "/trabajo/gobia",
    verifiedAt: "2026-07-15",
  },
  {
    name: "Kelsen",
    category: "Derecho",
    description: "Investigación jurídica con trazabilidad a la fuente.",
    access: "Por solicitud",
    href: "/trabajo/kelsen",
    verifiedAt: "2026-07-15",
  },
  {
    name: "Laudos",
    category: "Arbitraje",
    description: "Búsqueda de laudos y jurisprudencia arbitral, cocreada con REDEK.",
    stage: "Beta",
    access: "Abierto",
    href: "/trabajo/laudos",
    verifiedAt: "2026-07-15",
  },
  {
    name: "MiMotoYa",
    category: "Movilidad",
    description: "Producto digital para una operación de movilidad.",
    stage: "En desarrollo",
    verifiedAt: "2026-07-15",
  },
];

export const faq = [
  {
    question: "¿Qué puede construir INPLUX?",
    answer:
      "Aplicaciones web y móviles, plataformas, portales, herramientas internas y automatizaciones alrededor de un problema concreto.",
  },
  {
    question: "¿Necesito tener los requisitos definidos?",
    answer:
      "No. Empezamos por entender el problema, las personas involucradas y el resultado esperado. A partir de ahí definimos contigo el alcance de la primera versión útil.",
  },
  {
    question: "¿Trabajan solo en tributación o con entidades públicas?",
    answer:
      "No. Esa trayectoria nos dio criterio para contextos complejos y regulados, pero la fábrica construye para empresas, entidades y nuevos negocios de distintos sectores.",
  },
  {
    question: "¿Qué papel cumple la inteligencia artificial?",
    answer:
      "La IA ayuda a investigar, programar, probar y documentar en paralelo. Las decisiones, la validación y la responsabilidad permanecen bajo dirección humana.",
  },
  {
    question: "¿Cuánto tarda un proyecto?",
    answer:
      "Depende del reto y del alcance. Después de entender el contexto proponemos un plan, una primera versión y un rango de trabajo; no publicamos un plazo genérico que no podamos sostener.",
  },
] as const;
