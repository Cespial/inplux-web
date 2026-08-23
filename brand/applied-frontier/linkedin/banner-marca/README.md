# INPLUX — portadas de marca sola

Portadas de LinkedIn sin una sola palabra. Preparadas el 22 de agosto de 2026.

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
única herencia es una técnica de dibujo — barras horizontales — que además ya
era nuestra.

## Qué subir

### Perfil personal · 1584 × 396

1. `inplux-marca-perfil-01-disolucion.png`
2. Retina: `inplux-marca-perfil-01-disolucion-2x.png`
3. JPEG: `inplux-marca-perfil-01-disolucion.jpg`

### Página de empresa · 4200 × 700

1. `inplux-marca-pagina-01-disolucion.png`
2. JPEG: `inplux-marca-pagina-01-disolucion.jpg`

Cambia `01-disolucion` por la variante que elijas. Nada de `proofs/` se sube.

## Las cuatro variantes

| | Nombre | Qué hace |
| --- | --- | --- |
| `01` | Disolución | La cápsula de atrás se deshace, la del medio sostiene, la teal queda entera. **Recomendada.** |
| `02` | Limpia | Sin disolución: sólo la marca en barrido. La más silenciosa y la más cercana en tono a la referencia. |
| `03` | Barrido fino | Paso corto y barra delgada. La más bonita de cerca; a 3 px de barra corre riesgo de titilar tras la recompresión de LinkedIn. |
| `04` | A sangre | La marca crece hasta el tope. Más presencia, menos aire. |

## Decisiones de construcción

**El paso del barrido se deriva de la altura de la cápsula, no del ancho del
lienzo.** Por eso las dos proporciones producen exactamente el mismo número de
cápsulas por variante — 81, 21, 158 y 97 — y la densidad óptica es idéntica en
4:1 y en 6:1. Atarlo al lienzo daba un 6:1 con cuatro líneas por cápsula.

**El generador es determinista.** Usa un PRNG con semilla (`mulberry32`), nunca
`Math.random`. Un banner que cambia cada vez que se regenera no es un activo de
marca: no se puede versionar, comparar ni reproducir.

**La escala tiene tope derivado del lienzo.** La marca nunca ocupa más del 86 %
del alto, porque las esquirlas de la disolución se extienden por debajo de su
caja. El tope se calcula; no se ajusta a ojo por formato.

**La rotura es cuadrática, no lineal.** Una probabilidad lineal deshacía el 70 %
de la marca y la volvía ruido. Con `d²` sólo se rompe de verdad cerca del borde
de atrás, y la forma se sigue leyendo.

## Zonas de exclusión

Medidas sobre la interfaz real, no estimadas.

| Formato | Zona | Geometría |
| --- | --- | --- |
| Perfil | Avatar | círculo centro `(207, 365)` r `160` · holgura r `186` |
| Perfil | Botón de editar | rect `x 1450–1572` · `y 0–152` |
| Página | Logo de Página | rect `x 0–900` · `y 380–700` |

`build-marca.mjs` **aborta el render** si la caja de la composición entra en
cualquiera de ellas o si se sale del lienzo. Ya ocurrió: la variante `04` a 6:1
se salía por abajo y el build la detuvo.

## Reproducción

```sh
node brand/applied-frontier/linkedin/banner-marca/build-marca.mjs
```

Genera los dos formatos, las cuatro variantes, los SVG editables, los JPEG, el
maestro retina del perfil, el preview `1128 × 188` de la Página, las ocho
pruebas in-situ y `QA.json` con los hashes.

El build falla si un archivo supera `3 MB` o si le falta el perfil ICC.

## Pruebas incluidas

| Archivo | Qué demuestra |
| --- | --- |
| `proofs/insitu-perfil-*.png` | la portada con la foto y el botón en su posición medida |
| `proofs/insitu-pagina-*.png` | la Página con el logo superpuesto, a `1128 × 188` |
| `proofs/preview-*-1128x188.png` | la reducción real que hace LinkedIn en la Página |

## Nota sobre la variante fina

`03-fina` usa barras de 3 px en el maestro de perfil. Se ve espectacular a
tamaño completo, pero LinkedIn recomprime y las tramas de un píxel impar son lo
primero que se degrada. Si la eliges, revisa el resultado ya subido antes de
darla por buena. `02-limpia` es la apuesta sin riesgo.
