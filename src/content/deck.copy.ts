export type DeckSource = {
  label: string;
  url: string;
  supports: string;
  verifiedAt: `${number}-${number}-${number}`;
};

export const DECK_SOURCES = [
  {
    label: "Flyvbjerg y Budzier, Why Your IT Project Might Be Riskier Than You Think",
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
    // La única palabra visible de la figura: rotula la línea contra la que se
    // leen las seis barras. Vive aquí, pegada a la cifra, porque sin ella el
    // 200 % no tiene con respecto a qué. El <title> del SVG NO sube: ese es el
    // nombre accesible del dibujo, no copy, y viaja con los trazos.
    figura: { presupuesto: "presupuesto" },
    fuente: DECK_SOURCES[0],
  },
  tesis: {
    pregunta: "¿Dónde se decide si un proyecto va a funcionar?",
    respuesta: "El software empieza en el problema, no en el requisito.",
    cuerpo:
      "Un requisito escrito antes de entender el problema no es un plan: es una apuesta con forma de documento. Nosotros empezamos por hablar con quien hace el trabajo.",
    // Las dos etiquetas visibles de la figura, pegadas a la respuesta que
    // espejan. Son los dos sustantivos de `respuesta` y solo significan algo
    // junto a ella: separadas, alguien puede cambiar el titular y dejar las
    // curvas rotuladas con la contradicción anterior, sin que nadie se entere.
    // El <title> del SVG NO sube aquí: es el nombre accesible del dibujo —el
    // equivalente de un `alt`—, describe trazos concretos y tiene que viajar
    // con ellos.
    figura: { requisito: "Requisito primero", problema: "Problema primero" },
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
    respuesta: "Dominios que no se parecen. La misma fábrica.",
  },
  capacidades: {
    pregunta: "¿Qué comparten por dentro?",
    respuesta: "La fábrica es la misma; cambia el dominio.",
    // Las cuatro capas de la figura, escritas DE ABAJO ARRIBA: es el orden en
    // que se apilan y el orden en que la lámina las construye. El componente
    // las pinta al revés —de arriba abajo, que es como se leen— y el índice de
    // aquí es el que manda el compás. Ver `figures/CapasFabrica.tsx`.
    //
    // ⚠️ **Estas cuatro cadenas son COPY NUEVO y necesitan la firma del dueño
    // del copy.** No se derivan de `workProfiles`: son una lectura editorial de
    // cómo está hecho lo que vendemos. Hay evidencia consistente en el modelo
    // de contenido —todos los perfiles declaran `sources`, todos declaran un
    // bloque `interface`, y sus `capabilities` hablan de fuentes, vigencia,
    // criterio y trazabilidad—, pero es evidencia consistente, no una fuente.
    // Es lo único de esta lámina que no sale de un archivo de contenido
    // anterior, y por eso vive aquí, donde se firma el copy, y no en el
    // componente. Si el dueño no las firma, la lámina se queda sin figura y hay
    // que rehacerla, no reetiquetarla.
    //
    // ⚠️ Y NO se intente derivarlas de las `capabilities` de cada perfil por su
    // posición en el arreglo —«la segunda de cada producto es la capa de
    // reglas»—: es clasificar por el orden en vez de por el contenido, que es
    // el error que ya costó una vez.
    //
    // ⚠️ `dominios` marca LA capa que no es la misma en todos los productos, y
    // es la mitad visual de «cambia el dominio». Es una bandera en el objeto y
    // NO un índice en el arreglo, a propósito: reordenar las capas no puede
    // dejar el acento puesto en la que no es. Los nombres de los dominios no
    // se escriben en ninguna parte — salen de `workProfiles`.
    capas: [
      { nombre: "Datos y fuentes", dominios: false },
      { nombre: "Reglas del dominio", dominios: true },
      { nombre: "Interfaz de trabajo", dominios: false },
      { nombre: "Trazabilidad", dominios: false },
    ],
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
