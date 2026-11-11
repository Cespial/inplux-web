# Banco de temas para abrir · Gobia en @inplux_

Cada tema abre algo real en pantalla (`../MANTRA.md`). Estado: **consultado** = la cifra salió de
una consulta fechada que está en `datos/`; **por consultar** = la fuente está identificada, la
cifra todavía no se ha sacado y no se escribe en un guion hasta sacarla.
Fuente SECOP II = datos.gov.co `jbjy-vk9h`, orden territorial, firmados en 2026, consulta 10-nov-2026.

| # | Qué se abre | Fuente | Cifra | Miedo o necesidad que resuelve | Palabra | Estado |
|---|---|---|---|---|---|---|
| 1 | Los contratos del año por mes | SECOP II | 314.247 de 676.388 en enero (46,5 %) | planear enero sin colapsar | MUNICIPIO | consultado |
| 2 | El SECOP de Medellín | SECOP II, ciudad | 16.897 contratos; 85,3 % directa | entender qué hay detrás de «directa» | MUNICIPIO | consultado |
| 3 | 9 de cada 10 contratos son una persona | SECOP II | 88,7 % prestación de servicios | el pago mensual sin perseguir papeles | MANUAL | consultado |
| 4 | El SECOP de Segovia | SECOP II, entidad | 465 contratos; 262 en enero (56,3 %) | lo mismo pasa en municipios pequeños | MUNICIPIO | consultado · nombrar al cliente requiere su visto bueno |
| 5 | Directa + prestación de servicios, juntas | SECOP II | 511.295 (75,6 %) | dónde está el volumen de trabajo | MANUAL | consultado |
| 6 | Julio: el rebote después de la restricción | SECOP II | 75.536 en julio frente a 70.607 de feb a jun | segundo pico del año | MUNICIPIO | consultado |
| 7 | Las entidades que más contratan en una ciudad | SECOP II | INDER Medellín 6.454 | quién carga la operación | MUNICIPIO | consultado |
| 8 | El municipio que pida la audiencia | SECOP II por nombre | según pedido | respuesta en video | MUNICIPIO | por consultar, por pedido |
| 9 | Contratos sin ciudad registrada | SECOP II | ~100 mil con «No Definido» | calidad del dato público | DATOS | consultado (100.784) |
| 10 | Cuántos días pasan entre firma e inicio | SECOP II (fechas) | — | contratos que arrancan tarde | MANUAL | por consultar |
| 11 | Cuántos contratos se adicionan o prorrogan | SECOP II (adiciones) | — | planeación débil | ERRORES | por consultar |
| 12 | Contratos que terminan el 31 de diciembre | SECOP II (fecha fin) | — | el cierre de año | CIERRE | por consultar |
| 13 | Mínima cuantía: cuántas y de qué | SECOP II | 24.832 contratos | la modalidad que todos usan mal | ERRORES | consultado (conteo) |
| 14 | Convenios del Decreto 092 de 2017 | SECOP II | 4,8 % de los contratos | contratar con entidades sin ánimo de lucro | ERRORES | consultado (porcentaje) |
| 15 | Régimen especial: quién lo usa | SECOP II | 106.619 contratos (15,8 %) | hospitales y empresas públicas | MUNICIPIO | consultado |
| 16 | El contratista con más contratos de un municipio | SECOP II (proveedor) | — | concentración | MUNICIPIO | por consultar · cuidado con nombrar personas |
| 17 | Los requisitos de un contrato de prestación de servicios, uno por uno | manual de contratación + Gobia | — | que no falte un papel | MANUAL | por consultar (norma) |
| 18 | La cuenta de cobro mensual, paso a paso | Gobia, portal del contratista | — | el pago que se devuelve | MANUAL | producto |
| 19 | Qué revisa un supervisor antes de firmar | Gobia, chequeo | — | responsabilidad del supervisor | SUPERVISOR | producto + norma por consultar |
| 20 | Los hallazgos más repetidos de las contralorías en contratación | informes de auditoría publicados | — | el proceso fiscal | ERRORES | por consultar |
| 21 | Qué es un hallazgo fiscal y cuándo llega | norma de control fiscal | — | el miedo de quien firma | ERRORES | por consultar (Kelsen sin cuota) |
| 22 | La restricción a la contratación directa en año electoral | Ley 996 de 2005, art. 33 | texto verificado | por qué enero se desborda | CALENDARIO | consultado (Senado, 10-nov) · faltan fechas 2026 |
| 23 | El calendario de contratación 2027 de un municipio | SECOP II + calendario electoral | — | planear el año | CALENDARIO | por consultar |
| 24 | El plan anual de adquisiciones frente a lo que se contrató | SECOP II (PAA) | — | planear y cumplir | CALENDARIO | por consultar |
| 25 | Un municipio en una pantalla | gobia.co/demo | — | ver todo junto | DEMO | producto · cifras de la demo por confirmar |
| 26 | La bandeja de trabajo de un equipo de contratación | app.gobia.co | — | saber qué toca hoy | DEMO | producto |
| 27 | El manual de contratación convertido en lista de requisitos | Gobia | — | cumplir el manual propio | MANUAL | producto |
| 28 | El contratista que sube sus documentos sin crear cuenta | Gobia, enlace firmado | — | menos filas y correos | DEMO | producto |
| 29 | Lo que salió a producción esta semana | INPLUX | — | prueba de que se construye | — | semanal |
| 30 | Una pregunta de la audiencia respondida con la fuente abierta | comentarios | — | conversación | — | semanal |

Reglas del banco: solo conteos mientras los valores en pesos no se limpien; personas naturales
no se nombran; un cliente se nombra solo con su visto bueno; cada cifra «consultado» se
regenera con `python3 secop.py` antes de grabar.
