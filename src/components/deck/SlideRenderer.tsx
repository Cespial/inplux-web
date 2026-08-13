import type { ReactElement } from "react";
import type { DeckSlide } from "@/content/deck";
import type { ReglaBloqueada } from "@/lib/banned-reasons.server";
import { CapacidadesSlide } from "./slides/CapacidadesSlide";
import { CierreSlide } from "./slides/CierreSlide";
import { EspejoSlide } from "./slides/EspejoSlide";
import { EvidenciaSlide } from "./slides/EvidenciaSlide";
import { MetodoSlide } from "./slides/MetodoSlide";
import { PortadaSlide } from "./slides/PortadaSlide";
import { ProblemaSlide } from "./slides/ProblemaSlide";
import { ProductoSlide } from "./slides/ProductoSlide";
import { PuenteSlide } from "./slides/PuenteSlide";
import { TesisSlide } from "./slides/TesisSlide";

/**
 * ⚠️ **El tipo de retorno explícito es lo que hace REAL la exhaustividad del
 * `switch` de abajo, y no es decorativo.** Sin él, TypeScript infiere
 * `ReactElement | undefined` para esta función: un `switch` sin `default` al
 * que le falte un `kind` se limita a devolver `undefined` por ese camino y
 * compila en silencio. Comprobado quitando a mano la rama de una lámina:
 * `tsc --noEmit` salió con 0 y no dijo una palabra, que es exactamente el fallo
 * contra el que el comentario de este archivo creía estar protegiendo.
 * Declarando `ReactElement`, el camino que no devuelve nada deja de encajar en
 * la firma y el build se rompe con «Function lacks ending return statement».
 * Vuelto a comprobar quitando la misma rama con el tipo puesto: rompe.
 */
export function SlideRenderer({
  slide,
  // Los perfiles del DECK ENTERO, no los de esta lámina. Dos láminas hablan de
  // la serie completa —el puente la enseña y las capas reparten sus dominios— y
  // las dos leían `workProfiles` global, así que en un deck recortado enseñaban
  // productos que ese deck no presenta. Bajan por aquí, desde quien sí sabe qué
  // deck se está presentando, por el mismo camino que `reglas`.
  perfiles,
  // Las reglas bajan desde la ruta —el único sitio donde se puede leer del
  // disco— y las consume la lámina de evidencia, que no puede escribir sus
  // frases como literales sin romper el build en su propia lista.
  reglas,
}: {
  slide: DeckSlide;
  perfiles: readonly Extract<DeckSlide, { kind: "producto" }>["perfil"][];
  reglas: readonly ReglaBloqueada[];
}): ReactElement {
  // Cada lámina titula con <h1>, no solo la portada. En el riel hay una sola
  // lámina viva a la vez, así que el documento tiene siempre exactamente un
  // <h1> y nombra lo que de verdad se está viendo; la saliente queda fuera
  // del árbol de accesibilidad por `aria-hidden` + `inert`. El HTML que se
  // construye trae uno solo porque el servidor solo monta la portada, que es
  // lo que mide `check:output`.
  //
  // Sin `default` a propósito: con el tipo de retorno de arriba, TypeScript
  // comprueba que están cubiertos todos los kind, y añadir uno sin su rama
  // rompe el build en vez de pintar un hueco en producción.
  switch (slide.kind) {
    // Ya no queda grupo genérico: todas las láminas tienen cuerpo propio y
    // ninguna se pinta como un título suelto.
    //
    // `titulo` no baja a ninguna: su texto sale de DECK_COPY o de `work.ts`,
    // que es más largo y más preciso que el título del modelo (el del modelo es
    // el que rotula la barra superior y el índice, y ahí tiene que caber en una
    // línea). Pasarlo sería una prop que no usan.
    case "portada":
      return <PortadaSlide id={slide.id} />;
    case "problema":
      return <ProblemaSlide id={slide.id} />;
    case "tesis":
      return <TesisSlide id={slide.id} />;
    case "metodo":
      return <MetodoSlide id={slide.id} />;
    case "espejo":
      return <EspejoSlide id={slide.id} />;
    // Recibe algo más que su id por una razón concreta: su contenido no existe
    // en el código fuente. Se lee del verificador en build, arriba del límite
    // de cliente, y baja hasta aquí.
    case "evidencia":
      return <EvidenciaSlide id={slide.id} reglas={reglas} />;
    case "puente":
      return <PuenteSlide id={slide.id} perfiles={perfiles} />;
    case "capacidades":
      return <CapacidadesSlide id={slide.id} perfiles={perfiles} />;
    case "cierre":
      return <CierreSlide id={slide.id} />;
    // La única que recibe el perfil entero: la ficha se construye con él y no
    // con el título del modelo, que es solo el nombre.
    case "producto":
      return <ProductoSlide id={slide.id} perfil={slide.perfil} />;
  }
}
