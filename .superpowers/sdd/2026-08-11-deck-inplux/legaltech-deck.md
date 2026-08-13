# El deck dirigido a legaltech

Rama `feat/deck-legaltech`, sobre `51ecd16`. Sin push.

Un deck para presentar a ministros, directores y líderes del sector público:
la misma apertura, la misma fábrica y **cuatro productos** —Tribai, Gobia,
Kelsen y Laudos— en vez de cinco. Porkia no entra: es una app de porcicultura y
en esa sala no ayuda. Decisión del dueño del 11-ago-2026.

## Cómo quedó la ruta

| Ruta | Qué es | Índice |
| --- | --- | --- |
| `/deck/legaltech` | El índice de las láminas, con enlace a la presentación | `noindex`, fuera del sitemap |
| `/deck/legaltech/presentacion` | El deck que se recorre | `noindex`, fuera del sitemap |

El `noindex` vive en `src/app/deck/legaltech/layout.tsx` y **cubre todo lo que
cuelgue de la ruta**: una variante nueva bajo `/deck/legaltech` nace ya fuera
del índice, en vez de nacer indexable y que nadie se entere. `follow: true`,
como en `/marca`.

No entra al sitemap a propósito —no es una página pública, es un deck que se
manda por enlace—, y de paso no toca `expectedSitemapUrls`, que se compara
posición por posición. Lo que sí se dio de alta:

- `scripts/verify-build-output.mjs`: las dos rutas en `pageDefinitions`, con su
  título, su descripción, su canónica y su `noindex`; y una regla nueva que
  exige que **ninguna** URL del sitemap empiece por `/deck/legaltech`.
- `scripts/verify-http-contracts.mjs`: las dos rutas contestan 200.

El deck general no cambió de forma: sigue en quince láminas con sus cinco
productos, y `npm run check` lo sujeta igual que antes.

### Lo que se publica en la tarjeta del enlace

Ningún conteo escrito. El número de láminas sale del deck ya construido y los
nombres de los productos salen de `work.ts` a través de `nombresEnProsa()`, que
los arma con `Intl.ListFormat`:

> El índice de la presentación de INPLUX en 13 láminas: la tesis, el método y
> los productos Tribai, Gobia, Kelsen y Laudos, con sus fuentes.

Que los nombres estén en la descripción no es adorno: es una puerta más. Si
alguien mete un producto que no es de esta sala, su nombre sale publicado ahí y
el control del HTML construido lo canta.

## Qué se hizo con `puente`, y por qué

**No aparece en la variante.**

La lámina pregunta «¿Ustedes son de un sector?» y responde «Dominios que no se
parecen. La misma fábrica.». Su argumento es que la fábrica **no** es de un
sector. Ante un ministro ese argumento juega en contra —a él le interesa lo
contrario, que conocemos su terreno— y, con cuatro productos jurídico-
administrativos, la frase además deja de ser cierta: tributación, gestión
pública, derecho y arbitraje **sí** se parecen.

Se quita en vez de reescribirse porque cualquier copy alternativo —«el mismo
terreno», «cuatro frentes de lo público»— sería una **afirmación nueva sobre
INPLUX** que no está en `deck.copy.ts`, `work.ts` ni `home.ts`. La regla del
proyecto es que eso lo firma el dueño. Quitar la lámina es la salida más
conservadora que sigue siendo cierta: el deck no dice nada que no pueda
sostener, y no se pierde ningún hecho —los cuatro dominios siguen a la vista en
las fichas de producto y en la capa partida de «La fábrica por dentro»—.

Lo que se pierde es el gozne: sin `puente`, la serie de producto entra justo
después de la lámina de evidencia. Se comprobó con el arnés en tres tamaños y no
deja hueco ni repite arquetipo (`evidencia` → `tribai`).

El mecanismo para volver atrás ya está puesto: `construirDeck` acepta un segundo
parámetro `sinLaminas`, y la variante lo usa con `SIN_PUENTE`. **Si el dueño
firma un copy propio para la lámina en esta variante, se saca `puente` de esa
lista y vuelve**, sin tocar nada más.

## Qué componentes leían el global, y cómo se arreglaron

Dos láminas hablan de la serie ENTERA y leían `workProfiles` de `work.ts`, no el
subconjunto. Un deck filtrado enseñaba Porkia igual, **contradiciendo al deck que
lo contenía, con todo en verde**:

| Archivo | Qué hacía | Cómo quedó |
| --- | --- | --- |
| `slides/PuenteSlide.tsx` | Vitrina con las cinco capturas y acta «5 capturas de navegador» | Recibe `perfiles`; el conteo y el rango de fechas se derivan de ellos |
| `figures/CapasFabrica.tsx` | Capa de dominios partida en los `category` de los cinco | Recibe `perfiles`; `DOMINIOS` pasó a ser `dominiosDe(perfiles)` y `--tramos` sale de ahí |

Y buscando más (`grep` de `workProfiles` y de `@/content/deck` en
`src/components/deck/`) aparecieron **cuatro que no estaban en el encargo** y
que habrían dejado la variante a medias:

| Archivo | Qué hacía | Cómo quedó |
| --- | --- | --- |
| `PresentationDeck.client.tsx` | Importaba `SLIDES` y `TOTAL_SLIDES`: solo había UN deck posible | Recibe `slides`; el total es `slides.length` |
| `useDeckNav.ts` | Recorría `SLIDES` y topaba en `TOTAL_SLIDES` | Recibe `slides`: `Fin`, las flechas y el hash se mueven dentro de SU deck |
| `chrome/IndexOverlay.client.tsx` | Listaba las quince láminas y ofrecía saltar a ellas | Recibe `slides` |
| `app/deck/presentacion/page.tsx` | Precargaba las cinco capturas | Las precargas salen de los perfiles del deck (`PaginaDeDeck`) |

Los perfiles bajan por el mismo camino que `motivos`: `PaginaDeDeck` →
`PresentationDeck` → `SlideRenderer` → la lámina. `perfilesDe(slides)` en
`deck.ts` es la única forma de obtenerlos, y sale del deck que se está
presentando.

De paso, el `<noscript>` de la presentación enlazaba a `/deck` escrito a mano:
quien abriera el deck dirigido sin JavaScript aterrizaba en el índice del
general. Ahora la ruta del índice llega por prop (`hrefIndice`).

Dos piezas nuevas evitan que la segunda ruta fuera una copia de la primera:
`components/deck/PaginaDeDeck.tsx` (leer los motivos, anunciar las capturas,
montar el riel) y `components/deck/IndiceDeDeck.tsx` (el índice). Las dos rutas
del deck general las usan también, así que no hay dos caminos que mantener.

## Verificación

`npm run check` en verde, corrido entero: `lint`, 29 pruebas
(5 + **17** + 3 + 4), `check:content`, `next build`, `check:output` y
`check:http` (13 rutas + 6 PNG sociales).

**El filtro, probado en el HTML construido** (no en el código). El riel de
progreso es lo único del documento que trae el deck entero —un botón por lámina
con su título en el `aria-label`—, así que por ahí se juzga qué deck se está
sirviendo:

```
general   · 15 láminas · … | Dominios que no se parecen… | Tribai | Gobia | Kelsen | Laudos | Porkia | …
legaltech · 13 láminas · … | Trece cosas que este sitio no puede decir | Tribai | Gobia | Kelsen | Laudos | …
```

`verifyDeckShape` en `verify-build-output.mjs` lo comprueba en cada build: el
número de láminas, los productos del riel en el orden de `work.ts`, y que las
capturas anunciadas en la cabecera sean exactamente las de las fichas que ese
deck monta (la de Porkia no se precarga en la variante: era medio megabyte que
ninguna lámina iba a pintar).

**El guardia, probado metiendo Porkia a propósito** en `PERFILES_LEGALTECH`.
Protestan dos capas, ocho veces:

```
# modelo — npm run test:deck
not ok 12 - el deck de legaltech presenta exactamente los cuatro perfiles pedidos
not ok 13 - Porkia no entra en el deck de legaltech · 'Porkia volvió a la selección de legaltech'

# HTML construido — npm run check:output
- deckLegaltech description: … recibió “… en 14 láminas … Tribai, Gobia, Kelsen, Laudos y Porkia …”
- deckLegaltechPresentacion description: … recibió “… en 14 láminas, con los productos … y Porkia.”
- deckLegaltechPresentacion láminas en el riel: esperaba “13” y recibió “14”
- deckLegaltechPresentacion láminas de producto en el riel:
    esperaba “Tribai · Gobia · Kelsen · Laudos” y recibió “Tribai · Gobia · Kelsen · Laudos · Porkia”
- deckLegaltechPresentacion capturas precargadas: esperaba “4” y recibió “5”
- deckLegaltechPresentacion: precarga la captura de Porkia y ese producto no está en este deck
```

Revertido después, y `check:output` vuelve a aprobar.

**El arnés, sobre la ruta nueva.** `scripts/qa-deck.mjs` ya no está atado a
`/deck/presentacion`: `QA_DECK=legaltech` elige el deck, y de ahí salen su
export del modelo, su ruta y su carpeta de capturas (`qa-out/<deck>/`). Corrido
contra el build de esta rama, **con la firma del build comprobada** (sin aviso
de `BUILD_ID` desajustado, o sea que midió este código):

```
QA_BASE=http://localhost:3213 QA_DECK=legaltech node scripts/qa-deck.mjs
… 13 láminas × 3 tamaños … sin choques ni errores · capturas en qa-out/legaltech/
QA_BASE=http://localhost:3213                node scripts/qa-deck.mjs
… 15 láminas × 3 tamaños … sin choques ni errores · capturas en qa-out/general/
```

La diferencia que confirma el arreglo: `capacidades` mide **7 figuras y 27
palabras** en la variante y **8 y 28** en el general —una pieza y un rótulo
menos: «Porcicultura»—. En la captura de escritorio, la capa partida enseña
Tributación, Gestión pública, Derecho y Arbitraje, y nada más.

⚠️ El puerto 3210 —el canónico del arnés— estaba ocupado por un servidor de otra
sesión; se midió en el 3213 con `QA_BASE`.

**Pruebas nuevas en `verify-deck-model.test.mjs`** (de 12 a 17): la variante trae
exactamente los cuatro perfiles pedidos y en el orden de `work.ts`; Porkia no
está ni en la selección, ni en el deck, ni en la prosa publicada; la variante no
lleva `puente` y **lleva todo lo demás** —el esperado se deriva del deck general
menos `puente` y menos los productos que no presenta, así que una lámina que
entre o salga del general no obliga a tocar esta prueba—; quitar una lámina
renumera el resto sin huecos; y un id mal escrito en `sinLaminas` revienta en vez
de no quitar nada en silencio (que es el modo de fallo peligroso: la lámina que
se quería quitar llega a la sala con todo verde).

## Lo que queda pendiente del dueño

1. **El copy de `puente` para esta variante, si la quiere.** Hoy no aparece. Para
   que vuelva hace falta una pregunta y una respuesta propias que no afirmen
   nada que no esté ya en `deck.copy.ts`, `work.ts` o `home.ts`. No las escribí:
   habrían sido una afirmación nueva sobre INPLUX firmada por quien no firma el
   copy. Con ese copy escrito, el cambio es sacar `"puente"` de `SIN_PUENTE`.
2. **El nombre del deck.** Las dos rutas se titulan «Deck legaltech» y
   «Presentación legaltech», con «legaltech» tomado del encargo. Si en la sala
   se va a llamar de otra forma —«sector público», «Estado»—, es una decisión de
   copy y cambia en las dos rutas y en su espejo del verificador.
3. **Si algún día se publica.** Hoy es `noindex` y no está en el sitemap. Darla
   de alta obliga a tocar `src/app/sitemap.ts` **y** `expectedSitemapUrls` en
   `verify-build-output.mjs`, que se compara posición por posición.
4. **`perfil.partners` sigue sin renderizarse en el deck**, también aquí: Laudos
   lo trae con REDEK, el sitio lo conserva y el deck lo omite (decisión 13.6).
   La contradicción con `DECK.md:201` sigue abierta y la cierra el dueño.
5. **`como-empezamos`.** En `feat/deck` ya hay un commit que la quita; esta rama
   sale de antes, así que la variante todavía la trae. Al mergear desaparece de
   las dos a la vez: el conteo de la variante se deriva del general
   (`deckSlideCount - 1 - los productos que no presenta`), así que no hay ningún
   número que actualizar a mano.
