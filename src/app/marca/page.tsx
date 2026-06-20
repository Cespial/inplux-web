"use client";

import { useState } from "react";

/* ════════════════════════════════════════════════════════
   INPLUX — Sistema de Marca (brandbook vivo)
   Editorial White System v3 · Instrument Serif + Plus Jakarta
   ════════════════════════════════════════════════════════ */

const TEAL = "#0d7d74";

type Swatch = { name: string; hex: string; note?: string; dark?: boolean };

const PRIMARY: Swatch[] = [
  { name: "--ink", hex: "#1a1918", note: "Texto, botones, fondo oscuro", dark: true },
  { name: "--teal", hex: "#0d7d74", note: "Acento de marca", dark: true },
  { name: "--teal-bright", hex: "#15dcc4", note: "Highlight / sobre oscuro" },
  { name: "--teal-soft", hex: "#e8f5f3", note: "Fondo teal suave" },
  { name: "--white", hex: "#ffffff", note: "Fondo principal" },
  { name: "--off-white", hex: "#f8f8f7", note: "Secciones alternas" },
];

const NEUTRALS: Swatch[] = [
  { name: "100", hex: "#e8e6e3" },
  { name: "200", hex: "#d1cfcc" },
  { name: "300", hex: "#a8a5a0" },
  { name: "400", hex: "#8a8784" },
  { name: "500", hex: "#6e6b68" },
  { name: "600", hex: "#545250", dark: true },
  { name: "700", hex: "#3d3b39", dark: true },
  { name: "800", hex: "#282726", dark: true },
  { name: "900", hex: "#1a1918", dark: true },
  { name: "950", hex: "#0d0c0c", dark: true },
];

const SCALE = [
  { el: "H1 · Hero", serif: true, size: "clamp(2.25rem, 6vw, 5rem)", sample: "La norma la conocemos" },
  { el: "H2 · Sección", serif: true, size: "2.75rem", sample: "Tributaristas que construyen" },
  { el: "H3 · Subsección", serif: false, size: "1.15rem", sample: "Inteligencia tributaria con IA" },
  { el: "Body", serif: false, size: "1.25rem", sample: "25 años entre estatutos, NIC/NIIF y hacienda pública." },
  { el: "Label", serif: false, size: "0.6875rem", sample: "HUB DE INTELIGENCIA TRIBUTARIA", upper: true },
];

function Copyable({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 1100);
      }}
      className="font-mono text-[0.8125rem] tracking-tight hover:text-teal transition-colors cursor-pointer"
      title="Copiar"
    >
      {copied ? "¡copiado!" : hex}
    </button>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="max-w-[1100px] mx-auto px-6 md:px-8 py-16 md:py-24">
      <div className="mb-10">
        <p className="text-teal text-[0.6875rem] font-semibold uppercase tracking-[0.16em] mb-3">
          {eyebrow}
        </p>
        <h2 className="font-serif text-[2.25rem] md:text-[2.75rem] leading-[1.05] text-ink">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Download({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-1.5 text-[0.8125rem] text-gray-500 hover:text-teal transition-colors"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
      </svg>
      {label}
    </a>
  );
}

export default function MarcaPage() {
  return (
    <main className="bg-white text-ink min-h-screen">
      {/* ───────── HERO ───────── */}
      <header className="border-b border-border">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8 pt-20 pb-16 md:pt-28 md:pb-20">
          <img
            src="/brand/logos/inplux-logo-horizontal.svg"
            alt="INPLUX"
            className="h-12 md:h-16 mb-10"
          />
          <h1 className="font-serif text-[2.75rem] md:text-[4.5rem] leading-[1.02] text-ink max-w-3xl">
            Sistema de marca <span className="italic text-teal">vivo</span>.
          </h1>
          <p className="mt-6 text-gray-500 text-lg md:text-xl max-w-2xl leading-relaxed">
            Logo, color, tipografía, componentes y plantillas oficiales de INPLUX.
            Tomá lo que necesites — todo descargable, todo coherente.
          </p>
          <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-gray-500">
            {[
              ["#logo", "Logo"],
              ["#color", "Color"],
              ["#tipografia", "Tipografía"],
              ["#componentes", "Componentes"],
              ["#iconos", "Iconos"],
              ["#og", "Plantillas OG"],
            ].map(([h, l]) => (
              <a key={h} href={h} className="hover:text-ink transition-colors">
                {l}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ───────── LOGO ───────── */}
      <Section id="logo" eyebrow="01 · Identidad" title="El logo">
        <div className="grid md:grid-cols-2 gap-5">
          {/* lockup claro */}
          <div className="card flex flex-col">
            <div className="flex-1 flex items-center justify-center py-12 bg-off-white rounded-lg">
              <img src="/brand/logos/inplux-logo-horizontal.svg" alt="Logo horizontal" className="h-16" />
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[0.8125rem] text-gray-500">Horizontal · positivo</span>
              <div className="flex gap-4">
                <Download href="/brand/logos/inplux-logo-horizontal.svg" label="SVG" />
                <Download href="/brand/favicon/inplux-logo-horizontal.png" label="PNG" />
              </div>
            </div>
          </div>
          {/* lockup oscuro */}
          <div className="card flex flex-col">
            <div className="flex-1 flex items-center justify-center py-12 rounded-lg" style={{ background: "#1a1918" }}>
              <img src="/brand/logos/inplux-logo-horizontal-inverse.svg" alt="Logo inverso" className="h-16" />
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[0.8125rem] text-gray-500">Horizontal · inverso</span>
              <Download href="/brand/logos/inplux-logo-horizontal-inverse.svg" label="SVG" />
            </div>
          </div>
        </div>

        {/* marcas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5">
          {[
            { src: "/brand/logos/inplux-logo-stacked.svg", label: "Apilado", bg: "bg-off-white" },
            { src: "/brand/logos/inplux-mark-teal.svg", label: "Símbolo", bg: "bg-off-white" },
            { src: "/brand/logos/inplux-mark-flux-teal.svg", label: "Símbolo · flux", bg: "bg-off-white" },
            { src: "/brand/logos/inplux-appicon.svg", label: "App icon", bg: "bg-off-white" },
          ].map((m) => (
            <div key={m.src} className="card text-center">
              <div className={`flex items-center justify-center py-10 rounded-lg ${m.bg}`}>
                <img src={m.src} alt={m.label} className="h-20 w-20 object-contain" />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[0.75rem] text-gray-500">{m.label}</span>
                <Download href={m.src} label="SVG" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-x-10 gap-y-4 text-[0.875rem] text-gray-500 leading-relaxed">
          <p><strong className="text-ink">Área de protección.</strong> Dejá un margen mínimo igual a la altura del símbolo (▲) alrededor del logo.</p>
          <p><strong className="text-ink">Tamaño mínimo.</strong> Símbolo 16px · lockup horizontal 120px de ancho. Por debajo, usá solo el símbolo.</p>
          <p><strong className="text-ink">Símbolo.</strong> Triángulo ascendente = <em>impulso</em>. La variante <em>flux</em> evoca los estratos de la norma (influx).</p>
        </div>
      </Section>

      {/* ───────── COLOR ───────── */}
      <div className="bg-warm border-y border-border">
        <Section id="color" eyebrow="02 · Color" title="Paleta">
          <p className="text-gray-500 text-[0.9375rem] mb-6 -mt-4">Click en cualquier hex para copiarlo. Nunca usar negro puro: el ink es <span className="font-mono text-ink">#1a1918</span>.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PRIMARY.map((s) => (
              <div key={s.name} className="card !p-0 overflow-hidden">
                <div className="h-24" style={{ background: s.hex, borderBottom: "1px solid var(--border)" }} />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.8125rem] text-ink">{s.name}</span>
                    <Copyable hex={s.hex} />
                  </div>
                  {s.note && <p className="text-[0.75rem] text-gray-400 mt-1">{s.note}</p>}
                </div>
              </div>
            ))}
          </div>
          {/* escala neutra */}
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-gray-400 mt-12 mb-3">Neutros cálidos</p>
          <div className="flex rounded-xl overflow-hidden border border-border">
            {NEUTRALS.map((s) => (
              <div key={s.name} className="flex-1 group relative" style={{ background: s.hex }}>
                <div className="h-20" />
                <div className="px-1 py-2 text-center" style={{ color: s.dark ? "#fff" : "#1a1918" }}>
                  <div className="text-[0.6875rem] font-semibold">{s.name}</div>
                  <div className="font-mono text-[0.5625rem] opacity-70">{s.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* ───────── TIPOGRAFÍA ───────── */}
      <Section id="tipografia" eyebrow="03 · Tipografía" title="Dos voces">
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <div className="card">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-teal mb-2">Display</p>
            <p className="font-serif text-[3.5rem] leading-none text-ink">Instrument Serif</p>
            <p className="font-serif italic text-[1.75rem] text-gray-500 mt-2">Regular · Italic — para titulares</p>
            <p className="text-[0.8125rem] text-gray-400 mt-4">Headings, brand statements. Nunca para cuerpo de texto.</p>
          </div>
          <div className="card">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-teal mb-2">Body / UI</p>
            <p className="text-[3rem] leading-none text-ink font-bold">Plus Jakarta Sans</p>
            <p className="text-[1.25rem] text-gray-500 mt-3">300 · 400 · 500 · 600 · 700 · 800</p>
            <p className="text-[0.8125rem] text-gray-400 mt-4">Texto, navegación, botones, labels en uppercase + tracking 0.08em.</p>
          </div>
        </div>
        <div className="card divide-y divide-border">
          {SCALE.map((r) => (
            <div key={r.el} className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 py-5 first:pt-0 last:pb-0">
              <div className="md:w-44 shrink-0">
                <span className="text-[0.75rem] text-gray-400">{r.el}</span>
                <span className="block font-mono text-[0.6875rem] text-gray-300">{r.size}</span>
              </div>
              <div
                className={`${r.serif ? "font-serif" : ""} text-ink leading-tight ${r.upper ? "uppercase tracking-[0.08em] font-semibold" : ""}`}
                style={{ fontSize: r.size }}
              >
                {r.sample}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ───────── COMPONENTES ───────── */}
      <div className="bg-warm border-y border-border">
        <Section id="componentes" eyebrow="04 · UI Kit" title="Componentes">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="card">
              <p className="text-[0.75rem] text-gray-400 mb-4">Botones</p>
              <div className="flex flex-wrap items-center gap-3">
                <button className="btn-dark">Hablemos</button>
                <button className="btn-ghost">Ver más</button>
              </div>
              <p className="text-[0.75rem] text-gray-400 mt-5 font-mono">.btn-dark · .btn-ghost · radius 8px · min 44px</p>
            </div>
            <div className="card">
              <p className="text-[0.75rem] text-gray-400 mb-4">Chips de autoridad</p>
              <div className="flex flex-wrap gap-2.5">
                {["+25 años", "+50 municipios", "+100 proyectos"].map((c) => (
                  <span key={c} className="inline-flex items-center px-4 h-10 rounded-full text-[0.8125rem] font-semibold text-teal" style={{ background: "var(--teal-soft)" }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="card">
              <p className="text-[0.75rem] text-gray-400 mb-4">Input</p>
              <input className="form-input" placeholder="tu@correo.com" />
              <p className="text-[0.75rem] text-gray-400 mt-3 font-mono">.form-input · focus ring 3px</p>
            </div>
            <div className="card">
              <p className="text-[0.75rem] text-gray-400 mb-4">Card</p>
              <div className="rounded-[14px] border border-border bg-white p-5">
                <p className="font-serif text-xl text-ink">Tarjeta</p>
                <p className="text-[0.875rem] text-gray-500 mt-1">border-radius 14px · hover lift -2px · shadow-lg</p>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* ───────── ICONOS ───────── */}
      <Section id="iconos" eyebrow="05 · Favicon & App" title="Iconos">
        <div className="flex flex-wrap items-end gap-8">
          {[16, 32, 48, 96, 180].map((s) => (
            <div key={s} className="text-center">
              <img src="/brand/logos/inplux-appicon.svg" alt={`${s}px`} style={{ width: s, height: s }} className="rounded-[22%]" />
              <span className="block text-[0.6875rem] text-gray-400 mt-2">{s}px</span>
            </div>
          ))}
          <div className="ml-auto flex gap-5">
            <Download href="/brand/favicon/favicon.ico" label="favicon.ico" />
            <Download href="/brand/favicon/maskable-512.png" label="maskable 512" />
            <Download href="/brand/logos/inplux-appicon.svg" label="icon.svg" />
          </div>
        </div>
      </Section>

      {/* ───────── OG ───────── */}
      <div className="bg-warm border-t border-border">
        <Section id="og" eyebrow="06 · Social" title="Plantillas OG">
          <p className="text-gray-500 text-[0.9375rem] mb-6 -mt-4">1200×630 · una por producto/sección. Mismo sistema: serif + acento teal + chips.</p>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              ["og/og-default.png", "Default / Home"],
              ["og/og-tribai.png", "Tribai.co"],
              ["og/og-nosotros.png", "Nosotros"],
              ["og/og-sector-publico.png", "Sector público"],
            ].map(([src, label]) => (
              <div key={src} className="card !p-3">
                <img src={`/brand/${src}`} alt={label} className="rounded-lg w-full border border-border" />
                <div className="flex items-center justify-between mt-3 px-1">
                  <span className="text-[0.8125rem] text-gray-500">{label}</span>
                  <Download href={`/brand/${src}`} label="PNG" />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* ───────── FOOTER ───────── */}
      <footer className="border-t border-border">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <img src="/brand/logos/inplux-mark-teal.svg" alt="INPLUX" className="h-8" />
          <p className="text-[0.8125rem] text-gray-400">
            INPLUX S.A.S. · Editorial White System v3 · Medellín, Colombia
          </p>
        </div>
      </footer>
    </main>
  );
}
