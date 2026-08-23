# INPLUX — portadas de marca sola

Portadas de LinkedIn sin una sola palabra. Preparadas el 23 de agosto de 2026.

## De dónde sale

La referencia aportada por el usuario es el banner de perfil de Karri Saarinen:
fondo negro, un círculo dibujado con **barras horizontales de extremos
redondeados** que se rompen en fragmentos hacia un ángulo.

Una barra horizontal de extremos redondeados **es el módulo de Estratos**. La
técnica de la referencia y la geometría de INPLUX son la misma primitiva. Así
que aquí no se copia el círculo: se dibuja la marca con cápsulas Estratos
diminutas — la marca hecha de sí misma.

La disolución corre sobre el vector canónico `+21/−18`: se deshace por detrás y
se resuelve hacia adelante, donde está la cápsula teal.

**Ruido → estructura → señal.** Applied Frontier dibujado, no escrito. Un
círculo no puede decir eso; esta marca sí.

No se reutiliza ningún activo, forma, textura ni composición de terceros. La
única herencia es una técnica de dibujo que además ya era nuestra.

## Qué subir

| Destino | Archivo |
| --- | --- |
| **Perfil personal** `1584 × 396` | `inplux-marca-perfil-01-disolucion.png` |
| Alternativa retina | `inplux-marca-perfil-01-disolucion-2x.png` |
| **Página de empresa** `4200 × 700` | `inplux-marca-pagina-01-disolucion.png` |

Los `.jpg` son la alternativa compatible. Nada de `proofs/` ni de
`emplazamiento/` se sube: son revisión interna.

Para probar otra variante, cambia `01-disolucion` por `02-limpia`, `03-fina` o
`04-densa`.

## El emplazamiento

**Tercio derecho, a media altura.** Sale del estudio en
`study-emplazamiento.mjs`, que prueba siete sitios con la misma escena.

- En la **esquina** la marca queda arrinconada, no colocada.
- **Centrada** —que es lo que hace la referencia— queda descolgada, porque la
  foto de perfil ocupa la izquierda y rompe la simetría que justificaría
  centrarla. Saarinen tampoco centra respecto al lienzo: centra respecto a lo
  que queda visible. Copiar la posición sin copiar la razón habría sido el
  error.
- El **tercio derecho a media altura** le da aire por los cuatro lados y deja
  el retrato con su propio espacio.

## Las cuatro variantes

| | Nombre | Qué hace |
| --- | --- | --- |
| `01` | Disolución | **La elegida.** La cápsula de atrás se deshace, la del medio sostiene, la teal queda entera. |
| `02` | Limpia | Sin disolución: sólo la marca en barrido. La más silenciosa. |
| `03` | Barrido fino | Paso corto y barra delgada. La más bonita de cerca. |
| `04` | Disolución densa | Más esquirlas y rotura más temprana; el rastro llega más lejos hacia el retrato. |

## Decisiones de construcción

**El paso del barrido se deriva de la altura de la cápsula, no del ancho del
lienzo.** Atado al lienzo, el maestro 6:1 salía con cuatro líneas por cápsula y
el dibujo se perdía.

**La barra tiene un grosor mínimo, y es distinto por formato.** LinkedIn muestra
la portada de Página reducida a `1128 × 188`, un factor de `0.269`. Una barra de
3,6 px en ese maestro llegaría a un píxel escaso en pantalla, así que el mínimo
sube en la misma proporción. El build **falla** si alguna barra llega a menos de
`1.4 px` en pantalla.

**La marca es proporcionalmente mayor en la Página que en el perfil.** No es una
inconsistencia: con el 33 % de alto que usa el perfil, la trama no sobrevive la
reducción a 1128 px. El tamaño lo fija la legibilidad en pantalla, no la
simetría entre maestros.

**El halo se dimensiona con la marca, no con el lienzo.** Atado al lienzo, una
marca pequeña quedaba envuelta en una nube que no le pertenecía.

**El generador es determinista.** PRNG con semilla (`mulberry32`), nunca
`Math.random`. Un banner que cambia cada vez que se regenera no se puede
versionar, comparar ni reproducir — y entonces no es un activo de marca.

**La rotura es cuadrática, no lineal.** Con probabilidad lineal se deshacía el
70 % de la marca y quedaba ruido. Con `d²` sólo se rompe cerca del borde de
atrás y la forma sobrevive.

## Zonas de exclusión

Medidas sobre la interfaz real, no estimadas.

| Formato | Zona | Geometría |
| --- | --- | --- |
| Perfil | Avatar | círculo centro `(207, 365)` r `160` · holgura r `186` |
| Perfil | Botón de editar | rect `x 1450–1572` · `y 0–152` |
| Página | Logo de Página | rect `x 0–900` · `y 380–700` |

`build-marca.mjs` **aborta el render** si la caja de la composición entra en
cualquiera de ellas o si se sale del lienzo. Ya ocurrió durante el desarrollo:
una variante grande a 6:1 se salía por abajo y el build la detuvo.

También falla si un archivo supera `3 MB`, si le falta el perfil ICC o si
conserva canal alfa.

## Archivos fuente

| Archivo | Papel |
| --- | --- |
| `mark-engine.mjs` | el dibujo: trama, disolución, esquirlas y zonas de exclusión |
| `build-marca.mjs` | la composición: formatos, emplazamiento, variantes y export |
| `study-emplazamiento.mjs` | el estudio de los siete emplazamientos |
| `QA.json` | resultado del último build, con hashes |

```sh
node brand/applied-frontier/linkedin/banner-marca/build-marca.mjs
```

## Nota sobre la variante fina

`03-fina` es la más bonita a tamaño completo, pero usa la trama más apretada que
el mínimo permite. Si la eliges, revisa el resultado **ya subido** antes de
darla por buena: la recompresión de LinkedIn es lo que decide, no el maestro.
`02-limpia` es la apuesta sin riesgo.
