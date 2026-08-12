"use client";

import { useEffect, useState } from "react";

/**
 * Un contador que corre contra una figura.
 *
 * No sabe nada del compás: recibe `retraso` y `duracion` ya calculados desde
 * `RITMO` en `figures/SeisBarras.tsx`, que es donde vive el compás de la
 * lámina. Aquí no se escribe ningún segundo.
 */
export function Contador({
  hasta,
  retraso,
  duracion,
  sufijo = "",
}: {
  hasta: number;
  retraso: number;
  duracion: number;
  sufijo?: string;
}) {
  // Servidor y primer render del cliente pintan el valor FINAL. Por eso no hay
  // discrepancia de hidratación posible, y por eso quien tenga movimiento
  // reducido ve el dato completo desde el primer fotograma: la animación
  // arranca en el efecto, y el efecto no corre si no se la ha pedido.
  const [valor, setValor] = useState(hasta);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cuadro = 0;
    let arranque = 0;

    /**
     * El respaldo, y por qué hace falta.
     *
     * `requestAnimationFrame` no corre si el navegador no da fotogramas —una
     * pestaña abierta en segundo plano, una ventana minimizada, una tubería de
     * captura—, y el primer cuadro es justo el que pone el numeral a cero. Sin
     * esto, la única cifra del deck se queda publicada en «0 %», que no es un
     * hueco: es un dato distinto y falso. Estuvo así en producción.
     *
     * Un temporizador SÍ corre en una pestaña de fondo (lo que hace el
     * navegador es espaciarlo, no cancelarlo), así que sirve de red. Se arma
     * para 300 ms después del final previsto de la animación y lo desarma el
     * propio cuadro que llega a `hasta`: si hay fotogramas no se nota, y si no
     * los hay el numeral acaba en su valor final igual.
     *
     * ⚠️ El plazo se calcula desde `retraso` y `duracion`, que son el compás
     * de la figura contra la que corre este contador. No hay ningún segundo
     * escrito aquí, y por eso el respaldo no puede desacoplarse de la barra.
     */
    const respaldo = window.setTimeout(
      () => {
        cancelAnimationFrame(cuadro);
        setValor(hasta);
      },
      (retraso + duracion) * 1000 + 300,
    );

    const paso = (ahora: number) => {
      if (!arranque) arranque = ahora;
      const t = (ahora - arranque) / 1000 - retraso;
      // Lineal a propósito: una curva expo-out se lee atascada porque alcanza
      // el 99 % del valor a mitad de recorrido. Y la barra contra la que corre
      // este contador también va lineal: las dos rectas coinciden en el final
      // por aritmética, no porque alguien haya copiado bien una curva.
      //
      // El tramo negativo —el retraso— se pinza a 0 en vez de salir antes de
      // tiempo: así el numeral se pone a cero DENTRO del primer cuadro y no en
      // el cuerpo del efecto, que es una cascada de renders que el linter
      // prohíbe con razón. React descarta los `setValor(0)` repetidos porque
      // el valor no cambia.
      const avance = Math.min(1, Math.max(0, t / duracion));
      setValor(Math.round(avance * hasta));
      if (avance < 1) cuadro = requestAnimationFrame(paso);
      else window.clearTimeout(respaldo);
    };

    cuadro = requestAnimationFrame(paso);
    return () => {
      cancelAnimationFrame(cuadro);
      window.clearTimeout(respaldo);
    };
  }, [hasta, retraso, duracion]);

  // `aria-hidden` porque un lector de pantalla no debe oír una cifra en
  // movimiento. El dato completo, en palabras, lo declaran la etiqueta
  // accesible de la lámina y su párrafo de cuerpo.
  return <span aria-hidden="true">{`${valor}${sufijo}`}</span>;
}
