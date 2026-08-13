import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * ⚠️ `process.cwd()` y no una ruta relativa a este módulo. En el build de Next
 * este archivo se empaqueta y `import.meta.url` deja de apuntar a `src/lib/`;
 * el directorio de trabajo del build y del servidor sí es la raíz del
 * proyecto.
 */
const origen = path.join(process.cwd(), "scripts", "verify-public-content.mjs");

/**
 * Una regla del verificador, vista desde el deck.
 *
 * `motivo` es el nombre interno —el que sale por consola cuando algo la
 * rompe—; `ejemplo` es la frase que la regla caza, escrita como la escribiría
 * un sitio del sector. `ejemplo` viene en `null` cuando citarla sería romperla:
 * hoy le pasa a la del logo de un tercero, porque cualquier frase que case con
 * ese patrón nombra a una organización.
 */
export type ReglaBloqueada = {
  motivo: string;
  ejemplo: string | null;
};

/**
 * Devuelve las reglas de la lista de lenguaje bloqueado, leyéndolas del
 * verificador en tiempo de build.
 *
 * ⚠️ **Ni los motivos ni los ejemplos se escriben aquí a mano, ni siquiera
 * dentro de un comentario.** Uno de los motivos coincide con su propio patrón
 * bloqueado y TODOS los ejemplos coinciden con el suyo —eso lo comprueba
 * `verifyBannedExamples()` en el propio verificador—, y este archivo vive bajo
 * `src/`, que es justo lo que `check:content` escanea, comentarios incluidos.
 * Escribir aquí cualquiera de esas cadenas rompe el build en la línea que la
 * escribe. Ese es el chiste de la lámina 6 y también su restricción de
 * implementación.
 *
 * ⚠️ El sufijo `.server.ts` es una convención, no una garantía. Lo que impide
 * que esto llegue al cliente es que solo lo importa la ruta, que es componente
 * de servidor. Si alguien lo importara desde un `.client.tsx`, el build
 * fallaría con `node:fs` no disponible — y ese fallo es correcto.
 */
export async function leerReglas(): Promise<ReglaBloqueada[]> {
  const fuente = await readFile(origen, "utf8");
  const bloque = fuente.split("const bannedPublicLanguage = [")[1]?.split("\n];")[0];

  if (bloque === undefined) {
    throw new Error("no se encontró la lista de lenguaje bloqueado en el verificador");
  }

  /**
   * Se parte por la clave `motivo:` y no se intenta leer la lista entera con
   * una sola expresión: entre un motivo y su ejemplo hay un literal de
   * expresión regular, y ninguna expresión regular sensata sabe dónde termina
   * otra. Partiendo, cada trozo contiene exactamente una regla y el `ejemplo`
   * que se encuentre dentro es el suyo.
   */
  const reglas = bloque
    .split("motivo:")
    .slice(1)
    .map((trozo) => {
      const motivo = trozo.match(/^\s*"([^"]+)"/)?.[1];
      if (motivo === undefined) return null;
      return { motivo, ejemplo: trozo.match(/ejemplo:\s*"([^"]+)"/)?.[1] ?? null };
    })
    .filter((regla): regla is ReglaBloqueada => regla !== null);

  if (reglas.length === 0) {
    throw new Error("la lista de lenguaje bloqueado se leyó vacía: cambió su forma en el verificador");
  }

  return reglas;
}
