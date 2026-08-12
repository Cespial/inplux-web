export type DeckSource = {
  label: string;
  url: string;
  supports: string;
  verifiedAt: `${number}-${number}-${number}`;
};

export const DECK_SOURCES = [
  {
    label: "Flyvbjerg y Budzier, Why Your IT Project May Be Riskier than You Think",
    url: "https://arxiv.org/abs/1304.0265",
    supports:
      "Muestra de 1.471 proyectos de TI; sobrecosto promedio de 27 %; uno de cada seis con 200 % de sobrecosto y casi 70 % de sobreplazo.",
    verifiedAt: "2026-08-11",
  },
] as const satisfies readonly DeckSource[];

export const DECK_COPY = {
  portada: {
    eyebrow: "INPLUX / FÁBRICA DE SOFTWARE",
    titulo: ["De un problema real", "a software en producción."],
    bajada:
      "La IA acelera el trabajo. Personas expertas dirigen y validan las decisiones críticas.",
  },
  problema: {
    pregunta: "¿Por qué el software a la medida se sale de cauce tan seguido?",
    respuesta: "El promedio no es el riesgo.",
    cifra: { valor: 200, sufijo: " %", antetitulo: "1 de cada 6", pie: "proyectos de TI se sale" },
    cuerpo:
      "El sobrecosto promedio de un proyecto de TI es del 27 %, y con ese número se puede vivir. El problema está en la cola: uno de cada seis se va al 200 % y arrastra casi 70 % de sobreplazo.",
    fuente: DECK_SOURCES[0],
  },
  tesis: {
    pregunta: "¿Dónde se decide si un proyecto va a funcionar?",
    respuesta: "El software empieza en el problema, no en el requisito.",
    cuerpo:
      "Un requisito escrito antes de entender el problema no es un plan: es una apuesta con forma de documento. Nosotros empezamos por hablar con quien hace el trabajo.",
  },
  metodo: {
    pregunta: "¿Cómo trabajamos?",
    respuesta: "Cuatro tiempos, y ninguno se salta.",
  },
  espejo: {
    pregunta: "¿Y esto cómo se ve desde mi lado?",
    respuesta: "El mismo método, dos lecturas.",
    columnas: {
      empresa: {
        titulo: "Empresa",
        filas: [
          "Quién decide y con qué información",
          "Qué versión mínima es útil este trimestre",
          "Se integra con lo que ya opera",
          "Se observa el uso real y se ajusta",
        ],
      },
      entidad: {
        titulo: "Entidad",
        filas: [
          "Qué obliga la norma y quién responde",
          "Qué alcance es defendible y trazable",
          "Deja rastro de cada decisión",
          "Se entrega documentado y auditable",
        ],
      },
    },
  },
  evidencia: {
    pregunta: "¿Por qué habría de creerle a una fábrica de software?",
    respuesta: "Trece cosas que este sitio no puede decir.",
    cuerpo: "No es una guía de estilo. Es una prueba automática.",
    remate: "Si alguien las escribe, el sitio no compila.",
  },
  puente: {
    pregunta: "¿Ustedes son de un sector?",
    respuesta: "Cinco dominios distintos. La misma fábrica.",
  },
  capacidades: {
    pregunta: "¿Qué comparten los cinco por dentro?",
    respuesta: "La fábrica es la misma; cambia el dominio.",
  },
  comoEmpezamos: {
    pregunta: "¿Y con lo mío?",
    respuesta: "Los mismos cuatro tiempos, aplicados a tu reto.",
  },
  cierre: {
    respuesta: "Cuéntanos el problema.",
    correo: "gerencia@inplux.co",
    ciudad: "Medellín, Colombia",
  },
} as const;
