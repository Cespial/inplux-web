# INPLUX — Fábrica de software

Sitio corporativo de [inplux.co](https://inplux.co). Presenta a INPLUX como una fábrica de software a la medida para empresas y entidades: de un problema real a un producto digital en producción, con inteligencia artificial aplicada y dirección humana.

## Experiencia pública

- `/`: propuesta de valor, servicios, trabajo real, método, públicos y preguntas frecuentes.
- `/nosotros`: historia, principios, disciplinas y liderazgo.
- `/marca`: guía interna de identidad y descarga de activos propios.
- `robots.txt`, `sitemap.xml`, manifiesto web, metadatos y tarjetas sociales por ruta.

El sitio evita cifras, resultados, relaciones comerciales y estados de producto que no tengan evidencia vigente. Los logos de terceros no se publican hasta registrar relación, proyecto, periodo, permiso y archivo maestro. Los partners tecnológicos se declaran en `src/content/partners.json` con su permiso (fuente oficial, `grantedAt`, `verifiedAt`) y su archivo en `public/brand/partners/`; `scripts/partners-gate.mjs` bloquea el build si falta algo.

## Stack

- Next.js 16 y React 19.
- TypeScript 5.
- CSS nativo con tokens de marca.
- Fuentes locales para evitar dependencias externas en el render inicial.
- Despliegue previsto en Vercel.

## Desarrollo

```bash
npm install
npm run dev
```

Antes de entregar o desplegar:

```bash
npm run check
```

El control completo ejecuta lint, pruebas del inspector visual, validación editorial, build de producción y verificación del HTML generado. Comprueba, entre otras cosas:

- lenguaje público bloqueado o promesas sin evidencia;
- separación entre etapa y acceso de cada producto;
- fecha de verificación del portafolio;
- atribución de Laudos a REDEK;
- tarjetas sociales y dimensiones 1200 × 630;
- ausencia de logos de terceros sin permiso publicable;
- presencia de las cabeceras de seguridad requeridas.
- metadata final, social cards, canonical, JSON-LD, sitemap y manifest web;
- manifest, decisiones visuales y hashes del futuro HERO generado.

Por defecto, un estado de producto vence después de 120 días. Para una revisión excepcional puede definirse `CONTENT_VERIFICATION_MAX_AGE_DAYS`, sin eliminar la obligación de actualizar `verifiedAt` en `src/content/home.ts`.

Una entrega visual se inspecciona antes de integrarla:

```bash
npm run inspect:hero -- /ruta/absoluta/a/la/entrega
```

La carpeta debe incluir `hero-media-manifest.json`, las decisiones JSON aprobadas del reviewer, ambos posters canónicos y, si existe video, el par WebM/MP4. El inspector no consulta URLs externas: valida procedencia declarada, aprobaciones, SHA-256 y el contenido real de cada medio.

## Estructura principal

```text
src/
├── app/                  # Rutas, metadatos y estilos
├── components/site/      # Componentes compartidos
└── content/home.ts       # Contenido estructurado y estados verificados
public/brand/             # Únicos activos publicables de marca
scripts/                  # Controles de calidad del repositorio
```

## Publicación

La rama `main` alimenta producción. Antes de integrarla se requiere aprobar el contenido, ejecutar `npm run check` y revisar visualmente las rutas públicas en móvil y escritorio.

### Formulario de contacto (variables de entorno)

El formulario de `/contacto` y del diálogo de contacto envía a `POST /api/contacto`, que manda el correo con la API de [Resend](https://resend.com). Las variables se configuran en Vercel (Project → Settings → Environment Variables); ninguna va en el repositorio.

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `RESEND_API_KEY` | Sí, para enviar | Clave de Resend con permiso solo de envío. Secreta, solo servidor. Sin ella el endpoint responde `503 not_configured` y el formulario abre el borrador por `mailto:` como antes. |
| `CONTACT_TO` | No | Destinatario. Por defecto `cristian@inplux.co`. |
| `CONTACT_FROM` | No | Remitente. Por defecto `INPLUX <formulario@inplux.co>`; exige el dominio `inplux.co` verificado en Resend. |
| `CONTACT_FORM_SECRET` | No | Firma la marca de tiempo antibots. Si falta, se deriva de `RESEND_API_KEY`. |
| `RESEND_API_URL` | No | Solo para pruebas locales (un servidor que registra el cuerpo). Por defecto la API real; no se define en Vercel. |

Antibots, sin servicios externos: campo trampa, marca de tiempo firmada (mínimo 3 s, máximo 24 h) y límite por IP (5 cada 10 min, 20 por día). El límite vive en memoria **por instancia**; para un límite global hace falta una regla de Vercel Firewall sobre `POST /api/contacto`. La lógica pura está en `src/lib/contact/` y la prueba `npm run test:contact`.

## Licencia

MIT
