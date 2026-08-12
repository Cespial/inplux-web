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
 * Devuelve los motivos de la lista de lenguaje bloqueado, leyéndolos del
 * verificador en tiempo de build.
 *
 * ⚠️ **Los motivos no se escriben aquí a mano, ni siquiera como ejemplo dentro
 * de un comentario.** Uno de ellos coincide con su propio patrón bloqueado, y
 * este archivo vive bajo `src/`, que es justo lo que `check:content` escanea
 * —comentarios incluidos, porque escanea el texto del archivo—. Escribir la
 * lista aquí rompe el build en la línea que la enumera. Ese es el chiste de la
 * lámina 6 y también su restricción de implementación.
 *
 * ⚠️ El sufijo `.server.ts` es una convención, no una garantía. Lo que impide
 * que esto llegue al cliente es que solo lo importa la ruta, que es componente
 * de servidor. Si alguien lo importara desde un `.client.tsx`, el build
 * fallaría con `node:fs` no disponible — y ese fallo es correcto.
 */
export async function leerMotivos(): Promise<string[]> {
  const fuente = await readFile(origen, "utf8");
  const bloque = fuente.split("const bannedPublicLanguage = [")[1]?.split("\n];")[0];

  if (bloque === undefined) {
    throw new Error("no se encontró la lista de lenguaje bloqueado en el verificador");
  }

  const motivos = [...bloque.matchAll(/\[\s*"([^"]+)"\s*,/g)].map((coincidencia) => coincidencia[1]);

  if (motivos.length === 0) {
    throw new Error("la lista de lenguaje bloqueado se leyó vacía: cambió su forma en el verificador");
  }

  return motivos;
}
