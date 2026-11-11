# Tanda 1 · primera grabación de Cristian (semana del 16 al 22-nov-2026)

Cinco clips, una sola sesión (~45 min). Formato: selfie vertical, mirando al lente, luz de
ventana, sin música. La pantalla y el rótulo se montan después. Cada clip: 4 frases, 30–45 s.
Decir la cifra completa y despacio. Si una toma sale mal, repetir solo la frase.

Fuente de las cifras: SECOP II · Contratos Electrónicos (datos.gov.co, conjunto `jbjy-vk9h`),
entidades de orden territorial, contratos firmados en 2026, consulta del 10-nov-2026 (última
firma registrada: 5-nov). Se regeneran con `python3 secop.py "Ciudad"`; los JSON con fecha
quedan en `datos/`. **Siempre decir «en SECOP II»**. El campo «ciudad» viene como «No Definido» en unos
100 mil contratos territoriales (la Alcaldía de Segovia, por ejemplo, con 465 contratos): para
municipios pequeños se busca por nombre de entidad (`python3 secop.py "=Segovia"`).
Los valores en pesos del conjunto traen errores de digitación: esta tanda usa solo conteos.

---

## G1 · Gobia · «Casi la mitad de los contratos del año se firmaron en enero»
**Rótulo:** DE 676.388 CONTRATOS, **314.247 SE FIRMARON EN ENERO**
**Pantalla:** barras por mes de 2026 (enero 314.247 · feb–jun 70.607 en total · julio 75.536).
**Guion (40 s):**
1. «En 2026 los municipios y departamentos han firmado 676 mil contratos en SECOP II. Adivina cuántos se firmaron en enero.»
2. «314 mil. El 46 por ciento del año, en un solo mes.»
3. «No es casualidad. La Ley de Garantías prohíbe la contratación directa en los cuatro meses antes de la elección presidencial. Entonces todo el mundo corre a firmar antes. De febrero a junio, juntos, 70 mil. En julio vuelve a subir: 75 mil.»
4. «Un equipo de contratación que firma en un mes lo de medio año no revisa: sobrevive. Para eso hicimos Gobia. Comenta tu municipio y te muestro cómo le fue.»
**Caption:** 314.247 de los 676.388 contratos territoriales de 2026 en SECOP II se firmaron en enero (46,5 %). El artículo 33 de la Ley 996 de 2005 prohíbe la contratación directa durante los cuatro meses anteriores a la elección presidencial, y el calendario se comprime. Fuente: datos.gov.co, SECOP II, consulta del 10-nov-2026. Comenta tu municipio y lo abrimos.
**Verificado:** texto del art. 33 leído en secretariasenado.gov.co el 10-nov-2026 (condicionalmente exequible). 🚨 Confirmar antes de publicar las fechas exactas de la restricción en 2026 (inicio y fin según primera y segunda vuelta); el guion no las dice.

## G2 · Gobia · «Abrimos el SECOP de Medellín»
**Rótulo:** MEDELLÍN 2026 · **16.897 CONTRATOS** · 85 % A DEDO… ¿O NO?
**Pantalla:** tabla de entidades con sede en Medellín (INDER 6.454 · Colegio Mayor 2.556 · Biblioteca Pública Piloto 1.550 · Distrito de Medellín 1.328 · EDU 979) y barra de modalidades.
**Guion (45 s):**
1. «Abrí el SECOP de Medellín. Entidades territoriales con sede en la ciudad, año 2026: 16.897 contratos.»
2. «El 85 por ciento es contratación directa. Suena a escándalo, pero mira qué son: el 86 por ciento son contratos de prestación de servicios. Personas. El INDER solo tiene 6.454.»
3. «El problema no es que sean directos. Es que cada uno trae hoja de vida, estudios previos, seguridad social, supervisor y una cuenta de cobro cada mes. Multiplica eso por 16 mil.»
4. «Eso es lo que ordena Gobia. ¿Qué municipio abrimos mañana? Coméntalo.»
**Caption:** Entidades territoriales con sede en Medellín, 2026, SECOP II: 16.897 contratos; 85,3 % por contratación directa; 86,2 % de prestación de servicios; 7.484 firmados en enero. Fuente: datos.gov.co, consulta del 10-nov-2026. ¿Cuál abrimos mañana?
**Nota:** el campo «ciudad» es la sede de la entidad: incluye entidades descentralizadas y algunos registros del Departamento. Decir «entidades con sede en Medellín», no «la Alcaldía». Cristian decide si deja «a dedo» en el rótulo; alternativa sobria: «85 % CONTRATACIÓN DIRECTA».

## G3 · Gobia · «Del pliego al pago: 9 de cada 10 son personas»
**Rótulo:** 9 DE CADA 10 CONTRATOS PÚBLICOS TERRITORIALES SON **UNA PERSONA**
**Pantalla:** Gobia (app.gobia.co): bandeja de trabajo → chequeo de requisitos de un contrato → portal del contratista. Grabar con datos de demostración.
**Guion (40 s):**
1. «Cuando piensas en contratación pública piensas en puentes. Los datos dicen otra cosa.»
2. «De los contratos territoriales de 2026 en SECOP II, el 88,7 por ciento es prestación de servicios. Una persona, un contrato, un pago mensual.»
3. «Y cada pago necesita lo mismo: informe, planilla de seguridad social, visto bueno del supervisor. En Gobia el contratista lo sube por un enlace, sin crear cuenta, y el sistema revisa que no falte nada antes de que llegue al supervisor.»
4. «Del pliego al pago, sin perseguir papeles. Comenta MANUAL y te mando la lista de chequeo.»
**Caption:** 88,7 % de los contratos territoriales de 2026 en SECOP II son de prestación de servicios (datos.gov.co, 10-nov-2026). Gobia ordena ese ciclo: requisitos, supervisión y pago. Comenta MANUAL y te enviamos la lista de chequeo.
**Depende de:** la lista de chequeo (recurso del embudo) y la respuesta automática.

## I1 · INPLUX · «Construido esta semana»
**Rótulo:** CONSTRUIDO ESTA SEMANA · INPLUX
**Guion (30 s), plantilla:**
1. «Esto salió de INPLUX esta semana.»
2. «Uno: ____. Dos: ____. Tres: ____.» (tres hechos con verbo y cifra; nada que no esté en producción o entregado)
3. «Lo que más costó: ____.»
4. «El lunes, más.»
**Candidatos para el 16–22 nov (los confirma Cristian):** charla «Del pliego al pago» en INMERXIA (10-nov), panel en Horasis (11-nov), INPLUX partner oficial de SONDA. No se menciona nada bajo acuerdo de confidencialidad.

## I2 · INPLUX · entrada a cámara para Radar R2
El reel «Un agente apagó su propio monitoreo» ya está montado (`radar/video/`, 57 s, voz
provisional). Se graba solo la entrada y el cierre con rostro:
- **Entrada (6 s):** «Un agente de IA apagó su propio monitoreo. No es ciencia ficción: está en un informe de OpenAI del 20 de octubre.»
- **Cierre (6 s):** «Nosotros corrimos once agentes y revisamos la bitácora. Te muestro qué encontramos.»

---

## Pedidos de la audiencia (serie «Abrimos el SECOP de…»)
Cada comentario con un municipio entra a `datos/pedidos.md` (municipio, usuario, fecha). El reel
de respuesta se abre mostrando el comentario en pantalla. Se busca primero por nombre de entidad
(«MUNICIPIO DE …») y después por ciudad; si no hay registros, se dice en el reel.

---

## Filtro del mantra «No lo digas: ábrelo.» (ver `../MANTRA.md`)

| Clip | Alcance: ¿lo enviaría? | Enganche: ¿cifra o pantalla en 2 s? | Valor: ¿sirve el lunes? | Marca: ¿solo nosotros? | Venta: ¿siguiente paso? | Resultado |
|---|---|---|---|---|---|---|
| G1 enero | Sí: dato que nadie ha visto junto | Sí: 314.247 en el rótulo | Parcial: explica, no entrega herramienta | Sí: consulta propia | Sí: «comenta tu municipio» | Pasa. Mejora: cerrar con un consejo para planear enero de 2027 |
| G2 Medellín | Sí: ciudad con nombre propio | Sí: 16.897 en el rótulo | Parcial | Sí | Sí | Pasa |
| G3 personas | Medio: menos sorpresa | Sí: «9 de cada 10» | Sí: lista de chequeo | Sí: muestra Gobia | Sí: MANUAL | Pasa, depende del recurso |
| I1 construido | No, como está: enumera, no abre | No | No | Sí | No | **No pasa.** Rehacer: abrir en pantalla UNA cosa que salió a producción y cerrar con dónde verla |
| I2 Radar | Sí: hecho sorprendente con fuente | Sí: la fuente en pantalla | Medio | Sí: bitácora propia | Falta | Pasa si se añade cierre: «comenta AGENTES y te mando la bitácora» |

**I1 rehecho (30 s):** 1. «Esto salió de INPLUX esta semana, y te lo abro.» 2. (pantalla del
producto o entrega, 15 s) «Aquí está: ____. Hace ____.» 3. «Lo que más costó: ____.»
4. «Está en ____. El lunes abro otra.»
