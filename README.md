# INPLUX — Ecosistema Tecnológico

> Landing page y sitio web corporativo de [inplux.co](https://inplux.co) — ecosistema de tecnología, datos y consultoría para el sector público y privado en Colombia.

[![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

## Descripción

Sitio web de INPLUX, hub de innovación tecnológica que conecta soluciones de datos, inteligencia artificial y desarrollo de software con las necesidades del territorio colombiano.

### Características

- **Landing page** corporativa con diseño moderno
- **Página "Nosotros"** (`/nosotros`) — equipo, misión y visión
- **SEO optimizado** — `robots.ts` y `sitemap.ts` integrados
- **Página 404** personalizada
- **Responsive** — diseño adaptativo para todos los dispositivos

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16, React 19 |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 4 |
| Deploy | Vercel |

## Estructura

```
inplux-web/
├── src/app/
│   ├── page.tsx          # Landing principal
│   ├── nosotros/         # Página "Nosotros"
│   ├── not-found.tsx     # 404 personalizado
│   ├── robots.ts         # robots.txt dinámico
│   ├── sitemap.ts        # Sitemap XML dinámico
│   ├── layout.tsx        # Layout principal
│   └── globals.css       # Estilos globales
└── public/               # Assets estáticos
```

## Instalación

```bash
git clone https://github.com/Cespial/inplux-web.git
cd inplux-web
npm install
npm run dev
```

## Deploy

Desplegado automáticamente en [Vercel](https://vercel.com) desde la rama `main`.

## Licencia

MIT

---

Desarrollado por [Cristian Espinal Maya](https://github.com/Cespial) · [inplux.co](https://inplux.co)
