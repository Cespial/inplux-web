# Créditos del video del hero

Montaje propio de INPLUX (octubre de 2026): diez tomas de 2 s con corte seco, color corregido y exportado
en AV1, HEVC y H.264. Todas las tomas vienen de Pexels, cuya licencia permite el uso comercial gratuito
sin atribución obligatoria (https://www.pexels.com/license/). Se citan por cortesía y para rastrear su origen.

| # | Toma | Pexels |
|---|------|--------|
| 1 | Portacontenedores en altamar | https://www.pexels.com/video/6857819/ |
| 2 | Soldadura con chispas | https://www.pexels.com/video/34771890/ |
| 3 | Telares en primer plano | https://www.pexels.com/video/32244741/ |
| 4 | Capitolio Nacional, Bogotá | https://www.pexels.com/video/34736954/ |
| 5 | Brazo robótico industrial | https://www.pexels.com/video/32386532/ |
| 6 | Carretera de montaña con camiones | https://www.pexels.com/video/4609535/ |
| 7 | Hilo en una hilandería | https://www.pexels.com/video/26569060/ |
| 8 | Guatapé y la Piedra del Peñol | https://www.pexels.com/video/26229872/ |
| 9 | Cultivo en surcos | https://www.pexels.com/video/12493599/ |
| 10 | Refinería de noche | https://www.pexels.com/video/10386895/ |

# Créditos del video de «Cómo trabajamos»

Montaje propio de INPLUX (octubre de 2026): ocho tomas de 3 s de territorio colombiano con corte seco,
exportado en AV1, HEVC y H.264. Todas las tomas vienen de Pexels (licencia comercial gratuita sin
atribución obligatoria); se citan por cortesía y para rastrear su origen.

| # | Toma | Pexels |
|---|------|--------|
| 1 | Bogotá con los cerros orientales | https://www.pexels.com/video/10371805/ |
| 2 | El Carmen de Viboral, Antioquia | https://www.pexels.com/video/38242722/ |
| 3 | Avenida vista desde arriba | https://www.pexels.com/video/30103923/ |
| 4 | Iglesia de cúpula roja en un pueblo colombiano | https://www.pexels.com/video/37195944/ |
| 5 | Valle del Cocora, Quindío | https://www.pexels.com/video/16263003/ |
| 6 | TransMilenio desde arriba | https://www.pexels.com/video/40369226/ |
| 7 | Plaza de Bolívar y Catedral Primada | https://www.pexels.com/video/37151628/ |
| 8 | Bogotá al anochecer | https://www.pexels.com/video/40369464/ |

# Créditos del video de «Nosotros»

Montaje propio de INPLUX (octubre de 2026): nueve tomas de 2 s con corte seco, color natural,
1080p a partir de originales 4K, exportado en AV1, HEVC, H.264 y 720p para móvil. Todas las tomas
vienen de Pexels (licencia Pexels: uso comercial gratuito sin atribución obligatoria).

| # | Toma | Pexels |
|---|------|--------|
| 1 | Skyline de Medellín al atardecer | https://www.pexels.com/video/40130401/ |
| 2 | Pereira desde el aire | https://www.pexels.com/video/36360082/ |
| 3 | Equipo trabajando frente a pantallas | https://www.pexels.com/video/8632186/ |
| 4 | Sala de servidores | https://www.pexels.com/video/5028622/ |
| 5 | Equipo clínico revisando un documento | https://www.pexels.com/video/6631723/ |
| 6 | Guatapé y la Piedra del Peñol | https://www.pexels.com/video/26229872/ |
| 7 | Torres de oficinas de noche | https://www.pexels.com/video/17499154/ |
| 8 | Bogotá en hora azul | https://www.pexels.com/video/40369464/ |
| 9 | Medellín al atardecer, segundo tramo | https://www.pexels.com/video/40130401/ |

# Caché y nombres de archivo

`/media` y `/sectores` se sirven con `Cache-Control: public, max-age=31536000, immutable`
(`next.config.ts`): el navegador y la CDN guardan cada archivo un año sin volver a preguntar. Por eso
**ningún archivo de estas carpetas se reemplaza con el mismo nombre**. Si cambia un montaje, un póster o
una foto de sector, el archivo nuevo lleva otro nombre (`hero-av1.v2.mp4`, `sector-salud.v2.webp`) y se
actualiza la referencia en el código; el viejo se borra en el mismo cambio.

Los pósteres (`*-poster-<ancho>.avif|webp`) salen de `*-poster.jpg` con `node scripts/hero-posters.mjs`;
si cambia el JPEG, se versionan los tres nombres a la vez.
