# INPLUX — LinkedIn banner v3

Portadas de LinkedIn reconstruidas como un solo sistema con dos masters.
Preparadas el 21 de agosto de 2026.

## Por qué existe v3

El master v2 era **4200 × 700 (6:1)**, que es la especificación de la **Página de
empresa**. Estaba puesto en el **perfil personal**, cuya portada es
**1584 × 396 (4:1)**. LinkedIn escala por altura y recorta ~700 px de original a
cada lado, así que:

- el titular caía dentro del rango que ocupa la foto de perfil y se chocaba;
- se perdía un tercio de la composición en el recorte.

v3 no ajusta la composición: separa los destinos. Un master por proporción,
la misma gramática en los dos.

## Qué subir

### Perfil personal

1. **Portada:** `inplux-linkedin-profile-cover-v3-1584x396.png`
2. Alternativa retina: `inplux-linkedin-profile-cover-v3-3168x792.png`
3. Alternativa JPEG: `inplux-linkedin-profile-cover-v3-1584x396.jpg`

El PNG a tamaño exacto es la primera opción: es la medida que LinkedIn
recomienda, así que no hay reescalado y el grano queda píxel a píxel. El 2× es
para pantallas retina si prefieres apurar nitidez; LinkedIn lo reduce él mismo.

### Página de empresa

1. **Portada:** `inplux-linkedin-company-cover-v3-4200x700.png`
2. Alternativa JPEG: `inplux-linkedin-company-cover-v3-4200x700.jpg`
3. **Logo de Página:** `inplux-linkedin-page-logo-400.png`
4. **Contenido de la Página:** `linkedin-copy-paste.es.txt`

### No subir

Todo lo que hay en `proofs/`, el preview `1128x188` y el review board son
archivos de revisión interna.

## Geometría de la interfaz

Las zonas de exclusión del perfil no son una estimación: salen de medir la
interfaz real. Sobre una captura de 1300 × 808 la portada ocupa 1266 × 315
(4.019:1) y el anillo blanco del avatar va de x 52 a 307 con el borde superior
en y 181. Reescalado al lienzo maestro:

| Elemento | Geometría en 1584 × 396 |
| --- | --- |
| Avatar | círculo centro `(207, 365)`, r `160` |
| Holgura del avatar | r `186` |
| Botón de editar | rect `x 1462–1560`, `y 8–140` |
| Carril de contenido | `x 432 → 1544`, `y 40 → 372` |

`render-banner-v3.mjs` falla si un nodo de texto entra en el círculo del avatar,
en el rectángulo del botón o se sale del carril. La prueba
`proofs/proof-insitu-profile.png` compone la portada con la foto y el botón en
su posición real, para verla antes de subirla.

Para la Página se conserva la zona esencial conservadora de v2, `x 900–3300`,
`y 120–580`, y se reserva `x < 900` para el logo superpuesto.

LinkedIn no publica coordenadas numéricas de zona segura ni de recorte en móvil.
Estas retículas son decisiones conservadoras del paquete, derivadas de medición
directa. La especificación oficial de Página consultada para el master 6:1 es
`4200 × 700`, PNG/JPEG, máximo `3 MB`:

- <https://www.linkedin.com/help/linkedin/answer/a564330>

## Dirección de arte

**Campo óptico.** La profundidad de las referencias aportadas por el usuario se
traduce a una escena construida, no a una textura. Seis decisiones sostienen la
pieza:

1. **Tres planos de profundidad.** Lejano (blur 26), medio (blur 9) y un plano
   delantero desenfocado (blur 46) que entra por el ángulo inferior izquierdo y
   amortigua la llegada de la foto de perfil en vez de chocar con ella.
2. **Caída de foco a lo largo de la traza.** Los siete estados de Estratos van
   del más desenfocado al líder perfectamente nítido. El módulo `42:13` y el
   paso `+21/−18` se conservan exactos: la profundidad es una propiedad óptica
   del campo, nunca una deformación de la geometría canónica.
3. **Un único evento de luz.** Halo en tres capas, núcleo especular y destello
   anamórfico sobre la cápsula teal. El resto del campo queda subordinado.
4. **Grano procedural.** No es decoración. LinkedIn recomprime a JPEG y los
   degradados oscuros grandes bandean; el grano actúa como dither. Se genera con
   `feTurbulence` en el render, no se importa ninguna textura raster.
5. **Marcas técnicas que registran la señal.** Regla de ticks, corchetes y una
   mira de precisión que encuadra el líder. Todas por debajo del 20 % de ivory y
   todas prescindibles ante recorte.
6. **Luz consciente del avatar.** Un lift radial detrás de la posición de la
   foto, para que el anillo blanco apoye sobre un plano levantado y no sobre
   negro muerto.

La marca completa no se repite dentro de la portada: el avatar cumple esa
función. `INPLUX / APPLIED SYSTEM 01` es metadata ambiental y puede perderse en
una reducción extrema; `APPLIED FRONTIER.` y el descriptor son la lectura
esencial.

No se reutilizan logos, textos, glyphs, interfaces, patrones ni activos de
terceros. El campo se construye entero con la geometría de INPLUX.

## Arquitectura verbal

| Función | Copy |
| --- | --- |
| Marca | `INPLUX` |
| Idea | `APPLIED FRONTIER.` |
| Categoría | `Fábrica de software agéntica` |
| Especialización | `Legaltech / Gobierno / A la medida` |
| Promesa | `De un problema real a software en producción.` |
| Tagline de Página | `Fábrica de software agéntica para legaltech y gobierno.` |
| CTA | `Contáctanos` — seleccionar `Contact us` — `https://inplux.co/contacto` |

Texto alternativo recomendado:

> INPLUX Applied Frontier. Fábrica de software agéntica para legaltech y gobierno.

## Especificación

| | Perfil | Página |
| --- | --- | --- |
| Lienzo | `1584 × 396` | `4200 × 700` |
| Proporción | `4:1` | `6:1` |
| Perfil de color | sRGB con ICC embebido | sRGB con ICC embebido |
| Tope de archivo | `3 MB` | `3 MB` |
| Fuentes | Geist y Geist Mono, OFL, incluidas | ídem |

## Reproducción

```sh
node brand/applied-frontier/linkedin/banner-v3/render-banner-v3.mjs
```

El exportador detiene la ejecución si:

- las fuentes empaquetadas no cargan;
- un nodo de texto entra en la zona del avatar o del botón de editar, o se sale
  del carril (perfil);
- un nodo de texto esencial se sale de la zona esencial (Página);
- la traza rompe el módulo `42:13` o el paso canónico `+21/−18`;
- el líder no es el estado teal, o no queda perfectamente nítido;
- la caída de foco no da un estado distinto por cápsula;
- hay más o menos de un evento teal en la pieza;
- la portada contiene texturas raster externas;
- el lienzo cambia, falta el perfil ICC o un archivo supera su tope.

### Archivos fuente

| Archivo | Papel |
| --- | --- |
| `field.css` | gramática compartida: tokens, fuentes, planos, grano, tipografía |
| `profile.css` | composición 4:1 y zonas de exclusión del perfil |
| `company.css` | composición 6:1 y zona esencial de la Página |
| `inplux-linkedin-profile-cover-v3-1584x396.html` | master del perfil |
| `inplux-linkedin-company-cover-v3-4200x700.html` | master de la Página |
| `proof-insitu-profile.html` | simulación de la tarjeta de perfil |
| `proof-insitu-company.html` | simulación de la Página |
| `proof-crop-tolerance.html` | ventanas de recorte y reducción |
| `render-banner-v3.mjs` | exportador y verificaciones |
| `QA.json` | resultado automatizado del último render |

## Pruebas incluidas

| Archivo | Qué demuestra |
| --- | --- |
| `proofs/proof-insitu-profile.png` | la portada con la foto y el botón en su posición real |
| `proofs/proof-insitu-company.png` | la Página con el logo superpuesto |
| `proofs/proof-profile-safe-area.png` | carril, círculo del avatar y rectángulo del botón |
| `proofs/proof-company-safe-area.png` | zona esencial y zona del logo |
| `proofs/proof-crop-tolerance.png` | recorte vertical, lateral y reducción al 45 % |
| `inplux-linkedin-banner-v3-review-board.png` | tablero de revisión completo |

En la prueba de recorte vertical, la segunda línea del descriptor es lo primero
que se pierde. Es el comportamiento buscado: la jerarquía se degrada de fuera
hacia dentro.
