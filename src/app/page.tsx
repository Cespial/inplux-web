"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

/* ═══════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════ */
function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal,.reveal-left"));
    // Sin IntersectionObserver, mostramos todo de inmediato.
    if (typeof IntersectionObserver === "undefined" || els.length === 0) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      }),
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    // Red de seguridad: si algo quedó sin revelar (observer perdido, layout tardío),
    // forzamos visible para que ninguna sección se quede en blanco.
    const safety = window.setTimeout(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!el.classList.contains("visible") && r.top < window.innerHeight * 1.2) {
          el.classList.add("visible");
        }
      });
    }, 1200);
    return () => { obs.disconnect(); window.clearTimeout(safety); };
  }, []);
}

function AnimatedNumber({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState("0");
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        const num = parseInt(value.replace(/[^0-9]/g, ""));
        const prefix = value.startsWith("+") ? "+" : "";
        const dur = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 4);
          setDisplay(prefix + Math.round(num * ease).toString());
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <div className="font-serif text-5xl md:text-6xl lg:text-[4.5rem] text-ink leading-none mb-2">{display}</div>
      <div className="text-gray-500 text-sm font-medium">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   DATA
   ═══════════════════════════════════════ */
const TIMELINE_ERA_1 = {
  title: "El grupo de expertos",
  subtitle: "Liderado por Jaime Alonso Cano Pino y un equipo de contadores, tributaristas y financieros, los primeros 23 años se forjaron en campo: municipio a municipio, hospital a hospital, estatuto a estatuto.",
  ceoLinkedIn: "https://www.linkedin.com/in/jaime-alonso-cano-pino-a11a6246/",
  events: [
    { year: "2000", text: "Empezamos asesorando al Hospital San Camilo de Lelis y al Municipio de Vegachí. Contabilidad y gestión financiera pura, en terreno.", metric: "Primer cliente" },
    { year: "2002", text: "Llegamos al Hospital San Vicente de Paúl de Pueblo Rico. El sector salud nos abrió las puertas.", metric: "2 hospitales" },
    { year: "2004", text: "Asesoría contable y reestructuración administrativa de Segovia — nuestro primer caso de alto impacto.", metric: "Alto impacto" },
    { year: "2007", text: "Participamos en la constitución de la ESP de Vegachí. Valdivia, Yolombó y Andes entraron al portafolio de asesoría contable y financiera.", metric: "+4 municipios" },
    { year: "2010", text: "Alianza estratégica con Sistemas Aries, proveedores de la plataforma ERP financiera modular con más de 31 años en el departamento. Think IT y BBD Soluciones se suman al ecosistema.", metric: "Alianzas clave" },
    { year: "2012", text: "Iniciamos asesoría contable, financiera, fiscal y tributaria en Cisneros. Reestructuración de pasivos (Ley 550) — un proyecto de largo aliento.", metric: "Cisneros" },
    { year: "2014", text: "5 provincias estructuradas contable y financieramente para el Ministerio del Interior. La CIS se integra como aliado en las consultorías del proyecto.", metric: "5 provincias" },
    { year: "2019", text: "44 municipios con herramientas de fiscalización y construcción de estatutos tributarios para la Gobernación de Antioquia, en alianza con la Jaime Isaza Cadavid y la CIS.", metric: "44 municipios" },
    { year: "2021", text: "Llegan Caucasia, El Bagre y nuevos municipios al portafolio. Se estructuran proyectos de asesoría contable, financiera y tributaria a escala departamental.", metric: "Nuevos municipios" },
  ],
};

const TIMELINE_ERA_2 = {
  title: "La era INPLUX",
  subtitle: "Toda esa experiencia se formaliza en un Hub tecnológico. Lo que antes vivía en la cabeza de los expertos, ahora vive en código, modelos de IA y productos digitales.",
  events: [
    { year: "2023", text: "Nace INPLUX S.A.S. como Hub que integra consultoría contable, financiera, tributaria y tecnología. Se formaliza el ecosistema con Fourier, Sistemas Aries, Think IT, BBD Soluciones, Alianza IT y el Observatorio de Datos y Análisis. Arranca la transformación digital.", metric: "Hub fundado" },
    { year: "2025", text: "Lanzamos Tribai.co: inteligencia tributaria y financiera con IA. Preparaciones automáticas de declaraciones con IA. Arrancamos la plataforma de sector público.", metric: "IA en producción" },
  ],
};

const LOGOS = [
  { src: "/logos/21053_escudo-vegachi-pagina_200x200.png", alt: "Vegachí" },
  { src: "/logos/47914_logo-alcaldia--300-x-100-1_200x200.png", alt: "Alcaldía" },
  { src: "/logos/54672_escudo-de-cisneros-antioquia-oficial-3x3_200x200.png", alt: "Cisneros" },
  { src: "/logos/CIS.png", alt: "CIS" },
  { src: "/logos/Escudo.png", alt: "Escudo" },
  { src: "/logos/Parque_Arví_Logo_Blanco.png", alt: "Parque Arví" },
  { src: "/logos/Think_It_Logo_Blanco.png", alt: "Think IT" },
  { src: "/logos/cropped-Logo_Alianza-IT-1.png", alt: "Alianza IT" },
  { src: "/logos/images.jpeg", alt: "Cliente" },
  { src: "/logos/images.png", alt: "Cliente" },
  { src: "/logos/logo-negro.png", alt: "Cliente" },
  { src: "/logos/logo-think-oracle.png", alt: "Think Oracle" },
  { src: "/logos/logo-provincia-b.svg", alt: "Provincia" },
  { src: "/logos/logo.png", alt: "Sistemas Aries" },
  { src: "/logos/logoedu.png", alt: "EDU" },
  { src: "/logos/navarro-ospina-logo.png", alt: "Navarro Ospina" },
  { src: "/logos/logo.jpg", alt: "Cliente" },
];

const HUB_COMPANIES = [
  {
    name: "Kelsen",
    domain: "kelsen.io",
    focus: "Sombrilla Legal IA",
    desc: "Cerebro legal de INPLUX. La sombrilla que integra todos nuestros productos jurídicos sobre una misma capa de conocimiento persistente: Tribai (inteligencia tributaria) y Laudos (laudos arbitrales y jurisprudencia). Agentes legales con memoria de largo plazo y citación de fuentes verificable.",
    status: "Activo",
    upcoming: "Módulos en desarrollo: litigio · contratos · derecho constitucional · derecho penal",
  },
  {
    name: "Gobia",
    domain: "gobia.co",
    focus: "Sector Público",
    desc: "Gemelo digital y rendición de cuentas para municipios. Integra automáticamente datos del DNP, ministerios, Contraloría, Contaduría y entidades IAS en un tablero centralizado con alertas. El secretario de Hacienda ve todo en un solo panel.",
    status: "Activo",
    upcoming: "Rendición de cuentas ante IAS · Seguimiento al plan de desarrollo · Reportes cruzados automáticos",
  },
];

/* ═══════════════════════════════════════
   PAGE
   ═══════════════════════════════════════ */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useScrollReveal();

  useEffect(() => {
    const h = () => {
      setScrolled(window.scrollY > 20);
      setShowTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Active section tracking
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection("#" + e.target.id);
        });
      },
      { threshold: 0.15, rootMargin: "-60px 0px -40% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const navLinks = [
    { label: "Motor", href: "#motor" },
    { label: "Legal", href: "#legal" },
    { label: "Fábrica", href: "#fabrica" },
    { label: "Tecnología", href: "#tecnologia" },
    { label: "Ecosistema", href: "#empresas" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <>
      {/* Skip to content — accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-ink focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold">
        Ir al contenido principal
      </a>

      {/* Mobile nav overlay */}
      <div className={`mobile-overlay ${mobileOpen ? "active" : ""}`} onClick={() => setMobileOpen(false)} role="presentation" aria-hidden="true" />

      {/* ──── NAV ──── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 nav-wrap ${scrolled ? "scrolled" : ""}`} aria-label="Navegación principal">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 flex items-center justify-between h-[60px]">
          <a href="#inicio" className="text-ink font-bold text-[1.1rem] tracking-[0.12em] uppercase" aria-label="INPLUX - Inicio">INPLUX</a>
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((l) =>
              l.href.startsWith("/") ? (
                <Link key={l.href} href={l.href} className="text-[0.8125rem] font-medium px-3 py-1.5 rounded-md transition-colors text-gray-500 hover:text-ink">{l.label}</Link>
              ) : (
                <a key={l.href} href={l.href} className={`text-[0.8125rem] font-medium px-3 py-1.5 rounded-md transition-colors ${activeSection === l.href ? "nav-link-active" : "text-gray-500 hover:text-ink"}`}>{l.label}</a>
              )
            )}
          </div>
          <div className="flex items-center gap-3">
            <a href="#contacto" className="!hidden md:!inline-flex btn-dark text-[0.8125rem] !py-2 !px-5">Hablemos</a>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-ink p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer" aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={mobileOpen}>
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-5 py-3 border-t border-border bg-white space-y-1">
            {navLinks.map((l) =>
              l.href.startsWith("/") ? (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-ink text-sm font-medium py-2.5 px-3 rounded-md transition-colors">{l.label}</Link>
              ) : (
                <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-ink text-sm font-medium py-2.5 px-3 rounded-md transition-colors">{l.label}</a>
              )
            )}
            <a href="#contacto" onClick={() => setMobileOpen(false)} className="btn-dark w-full text-sm !py-2.5 mt-2">Hablemos</a>
          </div>
        </div>
      </nav>

      <main id="main-content">
      {/* Shared SVG defs — gradientes y filtros reutilizables por todos los diagramas */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="inkGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#26241f" />
            <stop offset="100%" stopColor="#0d0c0b" />
          </linearGradient>
          <linearGradient id="tealGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#15b3a4" />
            <stop offset="100%" stopColor="#0a665f" />
          </linearGradient>
          <radialGradient id="tealHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d7d74" stopOpacity="0.32" />
            <stop offset="65%" stopColor="#0d7d74" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#0d7d74" stopOpacity="0" />
          </radialGradient>
          <filter id="cardShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="6" stdDeviation="9" floodColor="#1a1918" floodOpacity="0.12" />
          </filter>
        </defs>
      </svg>
      {/* ──── HERO ──── */}
      <section id="inicio" className="relative pt-[60px] overflow-hidden">
        <div className="absolute inset-0 top-[60px] z-0">
          <video autoPlay muted loop playsInline aria-hidden="true" className="w-full h-full object-cover">
            <source src="/hero.webm" type="video/webm" />
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 max-w-[1100px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <div className="max-w-[680px]">
            <p className="reveal text-gray-500 text-[0.75rem] font-semibold tracking-[0.15em] uppercase mb-5">Inteligencia Tributaria · Tecnología · IA</p>
            <h1 className="reveal font-serif text-[2.25rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[5rem] leading-[1.05] tracking-[-0.02em] text-ink mb-7">
              La norma la conocemos.<br />
              La tecnología la{" "}
              <em className="font-serif italic text-teal">construimos.</em>
            </h1>
            <p className="reveal text-gray-500 text-base md:text-[1.25rem] leading-[1.6] mb-7 max-w-[580px]">
              Nuestra historia empezó en la gestión tributaria. Llevamos 25 años entre estatutos, NIC/NIIF y hacienda pública colombiana. Hoy convertimos ese conocimiento en tecnología e inteligencia artificial.
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-3">
              <a href="#motor" className="btn-dark text-center">Ver el motor</a>
              <a href="#contacto" className="btn-ghost text-center">Hablemos</a>
            </div>
          </div>
        </div>
        <div className="relative z-10 h-12 hero-fade-bottom" />
      </section>

      {/* ──── LOGOS ──── */}
      <section className="pt-4 pb-8 md:pt-5 md:pb-10" aria-label="Clientes que confían en nosotros">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 mb-5">
          <p className="reveal text-center text-gray-500 text-[0.6875rem] font-semibold tracking-[0.15em] uppercase">Confían en nosotros</p>
        </div>
        <div className="reveal relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-28 z-10" style={{ background: "linear-gradient(90deg, white, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 z-10" style={{ background: "linear-gradient(270deg, white, transparent)" }} />
          <div className="logo-track">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <Image key={`${logo.alt}-${i}`} src={logo.src} alt={logo.alt} width={90} height={32} className="logo-item" style={{ objectFit: "contain", width: "auto" }} unoptimized loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      <div className="fine-rule" />

      {/* ──── STATS ──── */}
      <section className="py-20 md:py-28" aria-label="Cifras de impacto">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 stagger">
            {[
              { value: "+25", label: "Años de experiencia", detail: "Desde el año 2000" },
              { value: "+50", label: "Municipios atendidos", detail: "En toda Colombia" },
              { value: "+100", label: "Proyectos ejecutados", detail: "Público y privado" },
              { value: "6", label: "Sectores de impacto", detail: "Gobierno · Salud · Educación" },
            ].map((stat) => (
              <div key={stat.label} className="reveal group relative border border-transparent hover:border-border rounded-xl p-4 md:p-5 transition-all duration-300 hover:shadow-sm">
                <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                <AnimatedNumber value={stat.value} label={stat.label} />
                <p className="text-gray-500 text-[0.7rem] mt-1.5">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── MOTOR — Self-improving agent (ancla narrativa) ──── */}
      <section id="motor" className="py-20 md:py-28 bg-warm">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="reveal mb-14 text-center">
            <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">El motor</p>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-xl mx-auto">
              Así funciona un agente <em className="italic">que se mejora solo.</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              No es IA del montón. Un agente que recuerda cada caso, consolida lo aprendido mientras nadie lo mira y queda mejor en cada vuelta. El conocimiento no se recalcula: se compone.
            </p>
          </div>

          <div className="svg-scroll-hint">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" /></svg>
            Desliza para ver completo
          </div>
          <div className="reveal w-full overflow-x-auto">
            <svg viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[1000px] mx-auto min-w-[720px]" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }} role="img" aria-label="Flujo de un agente self-improving: experiencia, memoria episodica, consolidacion sleep-time y conocimiento alimentan un segundo cerebro persistente que el agente recupera en cada nuevo caso, mejorando en cada vuelta">
              {/* Background dots */}
              {Array.from({ length: 16 }).map((_, row) =>
                Array.from({ length: 28 }).map((_, col) => (
                  <circle key={`mt-${row}-${col}`} cx={36 * col + 12} cy={37 * row + 12} r="0.35" fill="#dcd9d5" />
                ))
              )}

              {/* Halo atmosférico detrás del cerebro */}
              <ellipse cx="500" cy="384" rx="345" ry="170" fill="url(#tealHalo)" className="svg-halo-pulse" />

              <text x="40" y="34" fill="#0d7d74" fontSize="9" fontWeight="700" letterSpacing="1.5">EL CICLO QUE LO HACE MEJORAR</text>

              {/* Flujo: 01 → 04 */}
              {[
                { n: "01", t: "Experiencia", a: "Resuelve casos reales", b: "Cada interacción es un dato", x: 30 },
                { n: "02", t: "Memoria", a: "Recuerda cada asunto", b: "Episódica y persistente", x: 270 },
                { n: "03", t: "Consolida", a: "Aprende en reposo", b: "Sleep-time compute", x: 510 },
                { n: "04", t: "Conocimiento", a: "El saber se compone", b: "LLM-wiki + grafo", x: 750 },
              ].map((c) => (
                <g key={c.n} className="svg-card svg-lift">
                  <rect x={c.x} y={52} width={200} height={94} rx={12} fill="white" stroke="#0d7d74" strokeWidth={1.5} />
                  <circle cx={c.x + 22} cy={74} r={11} fill="url(#tealGrad)" />
                  <text x={c.x + 22} y={77} textAnchor="middle" fill="white" fontSize="8" fontWeight="700">{c.n}</text>
                  <text x={c.x + 100} y={80} textAnchor="middle" fill="#1a1918" fontSize="13" fontWeight="700">{c.t}</text>
                  <text x={c.x + 100} y={100} textAnchor="middle" fill="#8a8784" fontSize="8.5">{c.a}</text>
                  <text x={c.x + 100} y={116} textAnchor="middle" fill="#a8a5a0" fontSize="7.5">{c.b}</text>
                </g>
              ))}

              {/* arrows 01→02→03→04 */}
              {[232, 472, 712].map((x) => (
                <g key={x}>
                  <line x1={x} y1={99} x2={x + 30} y2={99} stroke="#0d7d74" strokeWidth={1.5} />
                  <polygon points={`${x + 30},94 ${x + 40},99 ${x + 30},104`} fill="#0d7d74" />
                </g>
              ))}

              {/* 04 → segundo cerebro (flujo de datos) */}
              <path d="M 850 146 C 850 196, 760 200, 705 246" stroke="#0d7d74" strokeWidth="1.6" fill="none" className="svg-flow" />
              <polygon points="705,246 706,234 715,242" fill="#0d7d74" />
              <text x="794" y="206" fill="#6e6b68" fontSize="7.5" fontWeight="600">alimenta</text>

              {/* ── SEGUNDO CEREBRO ── */}
              <g className="svg-card"><rect x="230" y="246" width="540" height="266" rx="18" fill="white" stroke="#0d7d74" strokeWidth="1.5" /></g>
              <path d="M230 264 Q230 246 248 246 H752 Q770 246 770 264 V276 H230 Z" fill="url(#tealGrad)" />
              <text x="266" y="266" fill="white" fontSize="10" fontWeight="700" letterSpacing="2">SEGUNDO CEREBRO</text>
              <text x="740" y="266" textAnchor="end" fill="rgba(255,255,255,0.85)" fontSize="7.5" fontWeight="700" letterSpacing="0.5">SE PERFECCIONA ↑</text>
              <text x="499" y="296" textAnchor="middle" fill="#8a8784" fontSize="8.5">Se alimenta y crece con cada caso — el conocimiento se compone, no se recalcula</text>

              {/* 4 compartimentos */}
              <rect x="250" y="306" width="242" height="76" rx="10" fill="#f3f1ee" />
              <text x="371" y="334" textAnchor="middle" fill="#1a1918" fontSize="10.5" fontWeight="700">Memoria episódica</text>
              <text x="371" y="352" textAnchor="middle" fill="#8a8784" fontSize="8">Eventos con fecha y contexto</text>
              <text x="371" y="367" textAnchor="middle" fill="#a8a5a0" fontSize="7.5">Qué pasó, con quién, con qué resultado</text>

              <rect x="508" y="306" width="242" height="76" rx="10" fill="#f3f1ee" />
              <text x="629" y="334" textAnchor="middle" fill="#1a1918" fontSize="10.5" fontWeight="700">Memoria semántica</text>
              <text x="629" y="352" textAnchor="middle" fill="#8a8784" fontSize="8">Hechos, doctrina y reglas</text>
              <text x="629" y="367" textAnchor="middle" fill="#a8a5a0" fontSize="7.5">Lo episódico, generalizado</text>

              <rect x="250" y="392" width="242" height="76" rx="10" fill="#f3f1ee" />
              <text x="371" y="420" textAnchor="middle" fill="#1a1918" fontSize="10.5" fontWeight="700">Memoria procedural</text>
              <text x="371" y="438" textAnchor="middle" fill="#8a8784" fontSize="8">Cómo se hace · playbooks</text>
              <text x="371" y="453" textAnchor="middle" fill="#a8a5a0" fontSize="7.5">Habilidades aprendidas</text>

              <rect x="508" y="392" width="242" height="76" rx="10" fill="#e8f5f3" />
              <text x="600" y="420" textAnchor="middle" fill="#0d7d74" fontSize="10.5" fontWeight="700">LLM-Wiki + Grafo</text>
              <text x="600" y="438" textAnchor="middle" fill="#6e6b68" fontSize="8">Conocimiento conectado</text>
              <circle cx="694" cy="410" r="3" fill="#0d7d74" className="eco-node-pulse" /><circle cx="722" cy="426" r="3" fill="#0d7d74" /><circle cx="690" cy="446" r="3" fill="#0d7d74" className="eco-node-pulse-delay1" /><circle cx="726" cy="452" r="3" fill="#0d7d74" />
              <line x1="694" y1="410" x2="722" y2="426" stroke="#0d7d74" strokeWidth="1" opacity="0.5" /><line x1="722" y1="426" x2="690" y2="446" stroke="#0d7d74" strokeWidth="1" opacity="0.5" /><line x1="690" y1="446" x2="726" y2="452" stroke="#0d7d74" strokeWidth="1" opacity="0.5" /><line x1="722" y1="426" x2="726" y2="452" stroke="#0d7d74" strokeWidth="1" opacity="0.5" />

              {/* governed tag */}
              <rect x="372" y="480" width="256" height="22" rx="11" fill="url(#inkGrad)" />
              <text x="500" y="495" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="600" letterSpacing="0.5">GOBERNADO · citación verificable · trazabilidad</text>

              {/* Recuperación: el cerebro alimenta cada nuevo caso */}
              <path d="M 230 386 C 110 386, 88 230, 130 150" stroke="#0d7d74" strokeWidth="1.6" fill="none" className="svg-flow-fast" />
              <polygon points="130,150 124,162 136,161" fill="#0d7d74" />
              <text x="58" y="300" fill="#0d7d74" fontSize="8" fontWeight="700">RECUPERACIÓN</text>
              <text x="40" y="316" fill="#8a8784" fontSize="7.5">El agente consulta su</text>
              <text x="40" y="328" fill="#8a8784" fontSize="7.5">cerebro antes de actuar</text>

              {/* Partículas ambientales */}
              <circle cx="252" cy="330" r="2.5" fill="#0d7d74" className="svg-spark" />
              <circle cx="752" cy="420" r="2" fill="#15b3a4" className="svg-spark" style={{ animationDelay: "1.6s" }} />
              <circle cx="500" cy="226" r="2" fill="#0d7d74" className="svg-spark" style={{ animationDelay: "3.1s" }} />

              {/* Bottom band */}
              <rect x="280" y="556" width="440" height="34" rx="17" fill="url(#inkGrad)" />
              <text x="500" y="577" textAnchor="middle" fill="white" fontSize="8.5" fontWeight="700" letterSpacing="0.5">MÁS CASOS → MEJOR CEREBRO → MEJOR AGENTE</text>
            </svg>
          </div>

          {/* Dual-frente quick links */}
          <div className="reveal grid sm:grid-cols-2 gap-4 mt-12 max-w-[760px] mx-auto">
            <a href="#legal" className="card group flex items-start gap-3 hover:border-teal transition-colors">
              <span className="text-teal text-[0.7rem] font-bold tracking-[0.12em] uppercase mt-0.5">Frente 1</span>
              <span>
                <span className="block font-serif text-[1.15rem] text-ink mb-0.5">Productos con cerebro persistente</span>
                <span className="block text-gray-500 text-[0.85rem] leading-relaxed">Kelsen, Tribai, Laudos, Gobia — el conocimiento de cada vertical, vivo.</span>
              </span>
            </a>
            <a href="#fabrica" className="card group flex items-start gap-3 hover:border-teal transition-colors">
              <span className="text-teal text-[0.7rem] font-bold tracking-[0.12em] uppercase mt-0.5">Frente 2</span>
              <span>
                <span className="block font-serif text-[1.15rem] text-ink mb-0.5">Fábrica de software</span>
                <span className="block text-gray-500 text-[0.85rem] leading-relaxed">El mismo motor agéntico construye nuevas .apps a velocidad de frontera.</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ──── MANIFIESTO (moved up) ──── */}
      <section id="nosotros" className="py-20 md:py-28 bg-warm">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="reveal mb-12">
            <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">El conocimiento</p>
            <h2 className="font-serif text-[2.25rem] md:text-[3rem] lg:text-[3.5rem] leading-[1.08] tracking-[-0.02em] text-ink mb-6 max-w-[760px]">
              25 años de experiencia real <em className="italic">entrenan a nuestros agentes</em>
            </h2>
            <div className="max-w-[680px]">
              <p className="text-gray-600 text-base md:text-lg leading-[1.65] mb-4">
                Nuestro CEO lleva 25 años asesorando entidades públicas de toda índole — municipios, gobernaciones, empresas de servicios públicos y provincias — coordinando 44 estatutos tributarios para la Gobernación de Antioquia y estructurando la gestión financiera, contable y tributaria de más de 50 entidades en Colombia.
              </p>
              <p className="text-gray-500 text-[0.9375rem] leading-[1.65] mb-4">
                De esa experiencia nació INPLUX: un Hub donde el conocimiento tributario, financiero y contable se traduce en tecnología. Desde sus inicios, fundó empresas de asesoría tributaria y financiera, formó alianzas con Sistemas Aries — proveedores de la plataforma ERP financiera modular con más de 31 años en el departamento —, Think IT, BBD Soluciones, Alianza IT y el Observatorio de Datos y Análisis, y hoy lidera el ecosistema que construye Tribai.co y la plataforma de sector público.
              </p>
              <p className="text-gray-500 text-[0.9375rem] leading-[1.65]">
                Ese es nuestro moat. No usamos IA genérica: entrenamos a nuestros agentes con normativa colombiana real, casos reales y 25 años de criterio experto. Por eso saben de qué hablan — y por eso cada vuelta del motor los hace mejores.
              </p>
            </div>
          </div>

          {/* Manifesto SVG — bridge between expertise and technology */}
          <div className="reveal mb-14 w-full overflow-x-auto">
            <svg viewBox="0 0 900 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[900px] mx-auto min-w-[600px]" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }} role="img" aria-label="Puente entre experiencia tributaria-financiera y tecnología">
              {/* Subtle dot grid */}
              {Array.from({ length: 8 }).map((_, row) =>
                Array.from({ length: 26 }).map((_, col) => (
                  <circle key={`mg-${row}-${col}`} cx={35 * col + 12} cy={36 * row + 10} r="0.35" fill="#d8d5d1" />
                ))
              )}

              {/* ═══ LEFT: EXPERTISE ═══ */}
              <g className="eco-float">
                <rect x="20" y="40" width="260" height="200" rx="16" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <rect x="21" y="40" width="258" height="28" rx="16" fill="#f3f1ee" />
                <text x="40" y="59" fill="#6e6b68" fontSize="8" fontWeight="700" letterSpacing="1.5">EXPERIENCIA · 25 AÑOS</text>

                <text x="150" y="92" textAnchor="middle" fill="#1a1918" fontSize="14" fontWeight="700">Conocimiento de campo</text>

                {/* Expertise pills */}
                <rect x="36" y="108" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="86" y="123" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Tributaria</text>
                <rect x="144" y="108" width="80" height="22" rx="11" fill="#f3f1ee" />
                <text x="184" y="123" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Financiera</text>

                <rect x="36" y="136" width="80" height="22" rx="11" fill="#f3f1ee" />
                <text x="76" y="151" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Contable</text>
                <rect x="124" y="136" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="174" y="151" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">NIC/NIIF</text>

                <rect x="36" y="164" width="110" height="22" rx="11" fill="#f3f1ee" />
                <text x="91" y="179" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Hacienda pública</text>
                <rect x="154" y="164" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="204" y="179" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">44 estatutos</text>

                <text x="150" y="216" textAnchor="middle" fill="#a8a5a0" fontSize="8">+50 municipios · +100 proyectos</text>
              </g>

              {/* ═══ CENTER: INPLUX HUB ═══ */}
              <ellipse cx="450" cy="140" rx="115" ry="95" fill="url(#tealHalo)" className="svg-halo-pulse" />
              <g className="eco-glow">
                <circle cx="450" cy="140" r="52" fill="url(#inkGrad)" />
                <circle cx="450" cy="140" r="52" fill="none" stroke="#0d7d74" strokeWidth="2" strokeDasharray="6 200" className="eco-orbit" style={{ animationDuration: "8s" }} />
                <text x="450" y="133" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" letterSpacing="2.5">INPLUX</text>
                <text x="450" y="152" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="7.5" fontWeight="600" letterSpacing="1.5">HUB</text>
              </g>

              {/* Connecting arrows: LEFT → CENTER */}
              <line x1="288" y1="140" x2="392" y2="140" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4" className="eco-dash-flow" />
              <polygon points="392,136 400,140 392,144" fill="#0d7d74" opacity="0.5" />

              {/* Connecting arrows: CENTER → RIGHT */}
              <line x1="508" y1="140" x2="612" y2="140" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4" className="eco-dash-flow" />
              <polygon points="612,136 620,140 612,144" fill="#0d7d74" opacity="0.5" />

              {/* ═══ RIGHT: TECHNOLOGY ═══ */}
              <g className="eco-float-delay">
                <rect x="620" y="40" width="260" height="200" rx="16" fill="white" stroke="#0d7d74" strokeWidth="1.5" />
                <rect x="621" y="40" width="258" height="28" rx="16" fill="#e8f5f3" />
                <text x="640" y="59" fill="#0d7d74" fontSize="8" fontWeight="700" letterSpacing="1.5">TECNOLOGÍA · PRODUCTOS</text>

                <text x="750" y="92" textAnchor="middle" fill="#1a1918" fontSize="14" fontWeight="700">Soluciones digitales</text>

                {/* Tech pills */}
                <rect x="636" y="108" width="90" height="22" rx="11" fill="#e8f5f3" />
                <text x="681" y="123" textAnchor="middle" fill="#0d7d74" fontSize="7.5" fontWeight="600">Tribai.co</text>
                <rect x="734" y="108" width="130" height="22" rx="11" fill="#e8f5f3" />
                <text x="799" y="123" textAnchor="middle" fill="#0d7d74" fontSize="7.5" fontWeight="600">IA Tributaria</text>

                <rect x="636" y="136" width="120" height="22" rx="11" fill="#e8f5f3" />
                <text x="696" y="151" textAnchor="middle" fill="#0d7d74" fontSize="7.5" fontWeight="600">Gemelo Municipal</text>
                <rect x="764" y="136" width="100" height="22" rx="11" fill="#e8f5f3" />
                <text x="814" y="151" textAnchor="middle" fill="#0d7d74" fontSize="7.5" fontWeight="600">Calculadoras</text>

                <rect x="636" y="164" width="110" height="22" rx="11" fill="#e8f5f3" />
                <text x="691" y="179" textAnchor="middle" fill="#0d7d74" fontSize="7.5" fontWeight="600">RAG Normativo</text>
                <rect x="754" y="164" width="110" height="22" rx="11" fill="#e8f5f3" />
                <text x="809" y="179" textAnchor="middle" fill="#0d7d74" fontSize="7.5" fontWeight="600">Declaración de Renta</text>

                <text x="750" y="216" textAnchor="middle" fill="#0d7d74" fontSize="8" fontWeight="600">Productos en producción y desarrollo</text>
              </g>

              {/* Aliados label below */}
              <text x="450" y="220" textAnchor="middle" fill="#a8a5a0" fontSize="7" fontWeight="600" letterSpacing="0.8">SISTEMAS ARIES · THINK IT · BBD SOLUCIONES · ALIANZA IT · OBSERVATORIO DE DATOS</text>

              {/* Decorative pulses */}
              <circle cx="305" cy="100" r="2.5" fill="#0d7d74" opacity="0.3" className="eco-node-pulse" />
              <circle cx="600" cy="180" r="2.5" fill="#0d7d74" opacity="0.3" className="eco-node-pulse-delay1" />
              <circle cx="450" cy="260" r="2" fill="#d1cfcc" className="eco-node-pulse-delay2" />

              {/* Bottom label */}
              <rect x="330" y="240" width="240" height="24" rx="12" fill="url(#inkGrad)" />
              <text x="450" y="256" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700" letterSpacing="1.5">EXPERIENCIA → HUB → PRODUCTO</text>
            </svg>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 stagger">
            <div className="reveal text-center md:text-left">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink text-white text-[0.75rem] font-bold mb-4">1</div>
              <h3 className="font-serif text-[1.15rem] text-ink mb-2 leading-snug">Primero la norma,<br /><em className="italic">después el código</em></h3>
              <p className="text-gray-500 text-[0.85rem] leading-relaxed">Nuestros modelos de IA se entrenan con 25 años de experiencia tributaria y financiera real. No con tutoriales de internet.</p>
            </div>
            <div className="reveal text-center md:text-left">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink text-white text-[0.75rem] font-bold mb-4">2</div>
              <h3 className="font-serif text-[1.15rem] text-ink mb-2 leading-snug">Entregamos productos,<br /><em className="italic">no horas de consultoría</em></h3>
              <p className="text-gray-500 text-[0.85rem] leading-relaxed">Tribai.co ya está en producción. El gemelo digital municipal viene en camino. Esto no es un PowerPoint.</p>
            </div>
            <div className="reveal text-center md:text-left">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal text-white text-[0.75rem] font-bold mb-4">3</div>
              <h3 className="font-serif text-[1.15rem] text-ink mb-2 leading-snug">Medimos impacto,<br /><em className="italic">no cobramos por estar</em></h3>
              <p className="text-gray-500 text-[0.85rem] leading-relaxed">+100 proyectos. +50 municipios. Un equipo que llega, ejecuta y deja las cosas funcionando.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ──── CAPACIDADES — SVG Interconnected ──── */}
      <section id="servicios" className="py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="reveal mb-14 text-center">
            <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Lo que dominan nuestros agentes</p>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-lg mx-auto">
              Conocimiento de fondo.<br /><em className="italic">Agentes de frontera.</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Cuatro dominios que alimentan al motor. El conocimiento nutre a los agentes, los agentes generan herramientas, las herramientas automatizan la gestión — y todo retroalimenta al motor.
            </p>
          </div>

          <div className="svg-scroll-hint">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" /></svg>
            Desliza para ver completo
          </div>
          <div className="reveal w-full overflow-x-auto">
            <svg viewBox="0 0 1000 700" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[1000px] mx-auto min-w-[700px]" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }} role="img" aria-label="Cuatro capacidades de INPLUX interconectadas">
              {/* Subtle grid */}
              {Array.from({ length: 19 }).map((_, row) =>
                Array.from({ length: 28 }).map((_, col) => (
                  <circle key={`cg-${row}-${col}`} cx={36 * col + 14} cy={37 * row + 10} r="0.4" fill="#e8e6e3" />
                ))
              )}

              {/* Connecting lines from center to each pillar */}
              <line x1="500" y1="350" x2="500" y2="115" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.3" className="eco-dash-flow" />
              <line x1="500" y1="350" x2="500" y2="585" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.3" className="eco-dash-flow" />
              <line x1="500" y1="350" x2="165" y2="350" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.3" className="eco-dash-flow" />
              <line x1="500" y1="350" x2="835" y2="350" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.3" className="eco-dash-flow" />

              {/* Diagonal connection lines */}
              <path d="M 280 185 Q 400 260, 500 280" stroke="#e5e3e0" strokeWidth="0.8" strokeDasharray="3 4" fill="none" />
              <path d="M 720 185 Q 600 260, 500 280" stroke="#e5e3e0" strokeWidth="0.8" strokeDasharray="3 4" fill="none" />
              <path d="M 280 515 Q 400 440, 500 420" stroke="#e5e3e0" strokeWidth="0.8" strokeDasharray="3 4" fill="none" />
              <path d="M 720 515 Q 600 440, 500 420" stroke="#e5e3e0" strokeWidth="0.8" strokeDasharray="3 4" fill="none" />

              {/* ═══ CENTER: INPLUX ═══ */}
              <ellipse cx="500" cy="350" rx="150" ry="122" fill="url(#tealHalo)" className="svg-halo-pulse" />
              <g className="eco-glow">
                <circle cx="500" cy="350" r="60" fill="url(#inkGrad)" />
                <circle cx="500" cy="350" r="60" fill="none" stroke="#0d7d74" strokeWidth="2" strokeDasharray="8 200" className="eco-orbit" style={{ animationDuration: "8s" }} />
                <text x="500" y="343" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" letterSpacing="3">INPLUX</text>
                <text x="500" y="364" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="8" fontWeight="600" letterSpacing="1.5">HUB CENTRAL</text>
              </g>

              {/* ═══ TOP: INTELIGENCIA TRIBUTARIA ═══ */}
              <g className="eco-float">
                <rect x="320" y="30" width="360" height="150" rx="16" fill="white" stroke="#0d7d74" strokeWidth="1.5" />
                <rect x="321" y="30" width="358" height="28" rx="16" fill="#e8f5f3" />
                <text x="340" y="49" fill="#0d7d74" fontSize="8" fontWeight="700" letterSpacing="1.5">01 · INTELIGENCIA TRIBUTARIA</text>
                <text x="500" y="82" textAnchor="middle" fill="#1a1918" fontSize="16" fontWeight="700">Inteligencia Tributaria</text>
                <text x="500" y="104" textAnchor="middle" fill="#8a8784" fontSize="9.5">Estatuto tributario · NIC/NIIF · ICA · Renta</text>
                <text x="500" y="122" textAnchor="middle" fill="#8a8784" fontSize="9.5">44 estatutos coordinados para Antioquia</text>
                {/* Feature pills */}
                <rect x="335" y="137" width="90" height="20" rx="10" fill="#f3f1ee" />
                <text x="380" y="151" textAnchor="middle" fill="#6e6b68" fontSize="7" fontWeight="600">Renta</text>
                <rect x="433" y="137" width="60" height="20" rx="10" fill="#f3f1ee" />
                <text x="463" y="151" textAnchor="middle" fill="#6e6b68" fontSize="7" fontWeight="600">NIIF</text>
                <rect x="501" y="137" width="60" height="20" rx="10" fill="#f3f1ee" />
                <text x="531" y="151" textAnchor="middle" fill="#6e6b68" fontSize="7" fontWeight="600">ICA</text>
                <rect x="569" y="137" width="95" height="20" rx="10" fill="#e8f5f3" />
                <text x="616" y="151" textAnchor="middle" fill="#0d7d74" fontSize="7" fontWeight="600">+50 municipios</text>
              </g>
              <circle cx="500" cy="188" r="4" fill="#0d7d74" opacity="0.5" className="eco-node-pulse" />

              {/* ═══ BOTTOM: HIPERAUTOMATIZACIÓN ═══ */}
              <g className="eco-float-delay">
                <rect x="320" y="520" width="360" height="150" rx="16" fill="white" stroke="#0d7d74" strokeWidth="1.5" />
                <rect x="321" y="520" width="358" height="28" rx="16" fill="#e8f5f3" />
                <text x="340" y="539" fill="#0d7d74" fontSize="8" fontWeight="700" letterSpacing="1.5">04 · HIPERAUTOMATIZACIÓN</text>
                <text x="500" y="572" textAnchor="middle" fill="#1a1918" fontSize="16" fontWeight="700">Hiperautomatización</text>
                <text x="500" y="594" textAnchor="middle" fill="#8a8784" fontSize="9.5">+35 calculadoras · Declaración de renta · Exógena · Agentes IA</text>
                <text x="500" y="612" textAnchor="middle" fill="#8a8784" fontSize="9.5">APIs de integración · App móvil Tribai</text>
                <rect x="345" y="627" width="80" height="20" rx="10" fill="#f3f1ee" />
                <text x="385" y="641" textAnchor="middle" fill="#6e6b68" fontSize="7" fontWeight="600">Calculadoras</text>
                <rect x="433" y="627" width="60" height="20" rx="10" fill="#f3f1ee" />
                <text x="463" y="641" textAnchor="middle" fill="#6e6b68" fontSize="7" fontWeight="600">APIs</text>
                <rect x="501" y="627" width="80" height="20" rx="10" fill="#f3f1ee" />
                <text x="541" y="641" textAnchor="middle" fill="#6e6b68" fontSize="7" fontWeight="600">App Móvil</text>
                <rect x="589" y="627" width="75" height="20" rx="10" fill="#e8f5f3" />
                <text x="626" y="641" textAnchor="middle" fill="#0d7d74" fontSize="7" fontWeight="600">×100 más rápido</text>
              </g>
              <circle cx="500" cy="512" r="4" fill="#0d7d74" opacity="0.5" className="eco-node-pulse-delay1" />

              {/* ═══ LEFT: IA NEURO-SIMBÓLICA ═══ */}
              <g className="eco-float">
                <rect x="30" y="240" width="270" height="220" rx="16" fill="white" stroke="#0d7d74" strokeWidth="1.5" />
                <rect x="31" y="240" width="268" height="28" rx="16" fill="#e8f5f3" />
                <text x="50" y="259" fill="#0d7d74" fontSize="8" fontWeight="700" letterSpacing="1.5">02 · IA NEURO-SIMBÓLICA & RAG</text>
                <text x="165" y="294" textAnchor="middle" fill="#1a1918" fontSize="15" fontWeight="700">IA Neuro-simbólica</text>
                <text x="165" y="312" textAnchor="middle" fill="#0d7d74" fontSize="12" fontWeight="600">& RAG</text>

                <text x="165" y="340" textAnchor="middle" fill="#8a8784" fontSize="9">Indexamos toda la normativa</text>
                <text x="165" y="356" textAnchor="middle" fill="#8a8784" fontSize="9">colombiana y la procesamos</text>
                <text x="165" y="372" textAnchor="middle" fill="#8a8784" fontSize="9">con modelos de lenguaje</text>

                <rect x="50" y="390" width="100" height="20" rx="10" fill="#f3f1ee" />
                <text x="100" y="404" textAnchor="middle" fill="#6e6b68" fontSize="7" fontWeight="600">Tribai con IA</text>
                <rect x="158" y="390" width="60" height="20" rx="10" fill="#f3f1ee" />
                <text x="188" y="404" textAnchor="middle" fill="#6e6b68" fontSize="7" fontWeight="600">RAG</text>
                <rect x="50" y="416" width="70" height="20" rx="10" fill="#f3f1ee" />
                <text x="85" y="430" textAnchor="middle" fill="#6e6b68" fontSize="7" fontWeight="600">Simbólico</text>
                <rect x="128" y="416" width="90" height="20" rx="10" fill="#e8f5f3" />
                <text x="173" y="430" textAnchor="middle" fill="#0d7d74" fontSize="7" fontWeight="600">Declaración de renta</text>
              </g>
              <circle cx="308" cy="350" r="4" fill="#0d7d74" opacity="0.5" className="eco-node-pulse-delay2" />

              {/* ═══ RIGHT: GEMELOS DIGITALES ═══ */}
              <g className="eco-float-delay">
                <rect x="700" y="240" width="270" height="220" rx="16" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <rect x="701" y="240" width="268" height="28" rx="16" fill="#f3f1ee" />
                <text x="720" y="259" fill="#6e6b68" fontSize="8" fontWeight="700" letterSpacing="1.5">03 · GEMELOS DIGITALES</text>
                <text x="835" y="294" textAnchor="middle" fill="#1a1918" fontSize="15" fontWeight="700">Gemelos Digitales</text>
                <text x="835" y="312" textAnchor="middle" fill="#6e6b68" fontSize="12" fontWeight="600">& Gobernanza</text>

                <text x="835" y="340" textAnchor="middle" fill="#8a8784" fontSize="9">Réplica digital del municipio.</text>
                <text x="835" y="356" textAnchor="middle" fill="#8a8784" fontSize="9">Datos de Contraloría, Contaduría,</text>
                <text x="835" y="372" textAnchor="middle" fill="#8a8784" fontSize="9">DNP e IAS en un solo tablero.</text>

                <rect x="720" y="390" width="70" height="20" rx="10" fill="#f3f1ee" />
                <text x="755" y="404" textAnchor="middle" fill="#6e6b68" fontSize="7" fontWeight="600">Gemelo</text>
                <rect x="798" y="390" width="60" height="20" rx="10" fill="#f3f1ee" />
                <text x="828" y="404" textAnchor="middle" fill="#6e6b68" fontSize="7" fontWeight="600">IAS</text>
                <rect x="866" y="390" width="90" height="20" rx="10" fill="#f3f1ee" />
                <text x="911" y="404" textAnchor="middle" fill="#6e6b68" fontSize="7" fontWeight="600">Contraloría</text>
                <rect x="720" y="416" width="100" height="20" rx="10" fill="#f3f1ee" />
                <text x="770" y="430" textAnchor="middle" fill="#6e6b68" fontSize="7" fontWeight="600">Plan desarrollo</text>
                <rect x="828" y="416" width="128" height="20" rx="10" fill="#f3f1ee" />
                <text x="892" y="430" textAnchor="middle" fill="#6e6b68" fontSize="7" fontWeight="600">Hacienda Dashboard</text>
              </g>
              <circle cx="692" cy="350" r="4" fill="#0d7d74" opacity="0.5" className="eco-node-pulse" />

              {/* Outer orbit */}
              <circle cx="500" cy="350" r="280" stroke="#e5e3e0" strokeWidth="1" strokeDasharray="4 8" fill="none" className="eco-orbit" style={{ animationDuration: "40s" }} />

              {/* Decorative pulsing */}
              <circle cx="500" cy="12" r="2" fill="#0d7d74" opacity="0.2" className="eco-node-pulse" />
              <circle cx="15" cy="350" r="2" fill="#0d7d74" opacity="0.2" className="eco-node-pulse-delay1" />
              <circle cx="985" cy="350" r="2" fill="#0d7d74" opacity="0.2" className="eco-node-pulse-delay2" />
              <circle cx="500" cy="688" r="2" fill="#0d7d74" opacity="0.2" className="eco-node-pulse" />
            </svg>
          </div>
        </div>
      </section>

      {/* ──── ECOSISTEMA LEGAL — Kelsen sombrilla ──── */}
      <section id="legal" className="py-20 md:py-28 bg-warm">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="reveal mb-14 text-center">
            <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Frente 1 · Ecosistema Legal</p>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-xl mx-auto">
              Kelsen es la sombrilla.<br /><em className="italic">Cada vertical, un módulo.</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              kelsen.io es el cerebro legal de INPLUX. Una sola capa de conocimiento persistente; encima, productos especializados. Tribai y Laudos ya operan. El resto, en construcción.
            </p>
          </div>

          <div className="svg-scroll-hint">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" /></svg>
            Desliza para ver completo
          </div>
          <div className="reveal w-full overflow-x-auto">
            <svg viewBox="0 0 1000 680" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[1000px] mx-auto min-w-[680px]" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }} role="img" aria-label="Ecosistema legal de INPLUX con Kelsen como sombrilla y Tribai, Laudos y módulos en desarrollo">
              {/* Background dots */}
              {Array.from({ length: 18 }).map((_, row) =>
                Array.from({ length: 28 }).map((_, col) => (
                  <circle key={`lg-${row}-${col}`} cx={36 * col + 12} cy={37 * row + 10} r="0.35" fill="#d8d5d1" />
                ))
              )}

              {/* Orbits centered at (500, 330) */}
              <circle cx="500" cy="330" r="280" stroke="#c8c5c1" strokeWidth="1" strokeDasharray="8 6" fill="none" className="eco-orbit" style={{ animationDuration: "50s" }} />
              <circle cx="500" cy="330" r="200" stroke="#d1cfcc" strokeWidth="0.8" strokeDasharray="3 7" fill="none" className="eco-orbit" style={{ animationDirection: "reverse", animationDuration: "35s" }} />

              {/* Connection lines center → modules */}
              <line x1="430" y1="285" x2="300" y2="178" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4" className="eco-dash-flow" />
              <line x1="570" y1="285" x2="700" y2="178" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4" className="eco-dash-flow" />
              <line x1="445" y1="380" x2="270" y2="470" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow-slow" />
              <line x1="500" y1="400" x2="500" y2="500" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow-slow" />
              <line x1="555" y1="380" x2="730" y2="470" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow-slow" />

              {/* ═══ KELSEN — center (sombrilla) ═══ */}
              <ellipse cx="500" cy="330" rx="155" ry="132" fill="url(#tealHalo)" className="svg-halo-pulse" />
              <a href="https://kelsen.io" target="_blank" rel="noopener noreferrer">
                <g className="eco-glow svg-card" style={{ cursor: "pointer" }}>
                  <circle cx="500" cy="330" r="72" fill="url(#inkGrad)" />
                  <circle cx="500" cy="330" r="72" fill="none" stroke="#0d7d74" strokeWidth="2" strokeDasharray="10 250" className="eco-orbit" style={{ animationDuration: "8s" }} />
                  <text x="500" y="320" textAnchor="middle" fill="white" fontSize="18" fontWeight="800" letterSpacing="1.5">Kelsen</text>
                  <text x="500" y="338" textAnchor="middle" fill="#5fe3d6" fontSize="9" fontWeight="500" textDecoration="underline">kelsen.io</text>
                  <text x="500" y="354" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7.5" fontWeight="600" letterSpacing="1">CEREBRO LEGAL</text>
                </g>
              </a>

              {/* ═══ TRIBAI — módulo activo (arriba-izq) ═══ */}
              <a href="https://tribai.co" target="_blank" rel="noopener noreferrer">
                <g className="eco-float svg-card" style={{ cursor: "pointer" }}>
                  <rect x="120" y="74" width="230" height="104" rx="12" fill="white" stroke="#0d7d74" strokeWidth="1.5" />
                  <rect x="121" y="74" width="228" height="24" rx="12" fill="#e8f5f3" />
                  <text x="144" y="91" fill="#0d7d74" fontSize="8" fontWeight="700" letterSpacing="1.5">MÓDULO · TRIBUTARIO</text>
                  <circle cx="326" cy="86" r="6" fill="#0d7d74" />
                  <text x="326" y="89" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">&#10003;</text>
                  <text x="235" y="126" textAnchor="middle" fill="#1a1918" fontSize="16" fontWeight="700">Tribai</text>
                  <text x="235" y="144" textAnchor="middle" fill="#0d7d74" fontSize="10" fontWeight="500" textDecoration="underline">tribai.co</text>
                  <text x="235" y="163" textAnchor="middle" fill="#8a8784" fontSize="8.5">Inteligencia tributaria y financiera</text>
                </g>
              </a>

              {/* ═══ LAUDOS — módulo activo (arriba-der) ═══ */}
              <a href="https://laudos.co" target="_blank" rel="noopener noreferrer">
                <g className="eco-float-delay svg-card" style={{ cursor: "pointer" }}>
                  <rect x="650" y="74" width="230" height="104" rx="12" fill="white" stroke="#0d7d74" strokeWidth="1.5" />
                  <rect x="651" y="74" width="228" height="24" rx="12" fill="#e8f5f3" />
                  <text x="674" y="91" fill="#0d7d74" fontSize="8" fontWeight="700" letterSpacing="1.5">MÓDULO · ARBITRAJE</text>
                  <circle cx="856" cy="86" r="6" fill="#0d7d74" />
                  <text x="856" y="89" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">&#10003;</text>
                  <text x="765" y="126" textAnchor="middle" fill="#1a1918" fontSize="16" fontWeight="700">Laudos</text>
                  <text x="765" y="144" textAnchor="middle" fill="#0d7d74" fontSize="10" fontWeight="500" textDecoration="underline">laudos.co</text>
                  <text x="765" y="163" textAnchor="middle" fill="#8a8784" fontSize="8.5">Laudos arbitrales y jurisprudencia</text>
                </g>
              </a>

              {/* ═══ EN DESARROLLO ×3 (abajo) ═══ */}
              <g className="eco-float">
                <rect x="90" y="470" width="190" height="92" rx="12" fill="white" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="6 5" />
                <circle cx="256" cy="486" r="6" fill="#d1cfcc" />
                <text x="185" y="514" textAnchor="middle" fill="#a8a5a0" fontSize="13" fontWeight="700">Litigio</text>
                <text x="185" y="534" textAnchor="middle" fill="#b8b5b1" fontSize="8.5" fontWeight="600" letterSpacing="0.5">EN DESARROLLO</text>
              </g>

              <g className="eco-float-delay">
                <rect x="405" y="500" width="190" height="92" rx="12" fill="white" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="6 5" />
                <circle cx="571" cy="516" r="6" fill="#d1cfcc" />
                <text x="500" y="544" textAnchor="middle" fill="#a8a5a0" fontSize="13" fontWeight="700">Contratos</text>
                <text x="500" y="564" textAnchor="middle" fill="#b8b5b1" fontSize="8.5" fontWeight="600" letterSpacing="0.5">EN DESARROLLO</text>
              </g>

              <g className="eco-float">
                <rect x="720" y="470" width="190" height="92" rx="12" fill="white" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="6 5" />
                <circle cx="886" cy="486" r="6" fill="#d1cfcc" />
                <text x="815" y="508" textAnchor="middle" fill="#a8a5a0" fontSize="12" fontWeight="700">Penal · Constitucional</text>
                <text x="815" y="528" textAnchor="middle" fill="#b8b5b1" fontSize="8.5" fontWeight="600" letterSpacing="0.5">EN DESARROLLO</text>
              </g>

              {/* Decorative pulses */}
              <circle cx="300" cy="150" r="3" fill="#0d7d74" opacity="0.4" className="eco-node-pulse" />
              <circle cx="700" cy="150" r="3" fill="#0d7d74" opacity="0.4" className="eco-node-pulse-delay1" />
              <circle cx="500" cy="180" r="2.5" fill="#c8c5c1" className="eco-node-pulse-delay2" />

              {/* Legend */}
              <circle cx="372" cy="630" r="5" fill="#0d7d74" />
              <text x="372" y="633" textAnchor="middle" fill="white" fontSize="6" fontWeight="700">&#10003;</text>
              <text x="387" y="634" fill="#6e6b68" fontSize="9" fontWeight="500">En producción</text>
              <circle cx="510" cy="630" r="5" fill="#d1cfcc" />
              <text x="525" y="634" fill="#6e6b68" fontSize="9" fontWeight="500">En desarrollo</text>

              {/* Bottom branding */}
              <rect x="380" y="652" width="240" height="22" rx="11" fill="url(#inkGrad)" />
              <text x="500" y="667" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700" letterSpacing="1.5">ECOSISTEMA LEGAL KELSEN</text>
            </svg>
          </div>

          {/* Para quién · qué te llevas · CTA */}
          <div className="reveal grid md:grid-cols-3 gap-6 md:gap-8 mt-14 items-start">
            <div>
              <p className="text-teal text-[0.65rem] font-bold tracking-[0.12em] uppercase mb-2">Para quién</p>
              <p className="text-gray-600 text-[0.9rem] leading-relaxed">Firmas legales, abogados independientes y áreas jurídicas que quieren una IA que recuerde sus asuntos y trabaje a su estilo.</p>
            </div>
            <div>
              <p className="text-teal text-[0.65rem] font-bold tracking-[0.12em] uppercase mb-2">Qué te llevas</p>
              <ul className="space-y-2 text-gray-600 text-[0.9rem] leading-snug">
                <li className="flex gap-2"><span className="text-teal">→</span>Un cerebro que recuerda todos tus asuntos y aprende tu estilo.</li>
                <li className="flex gap-2"><span className="text-teal">→</span>Investigación jurídica con citación verificable, sin alucinaciones.</li>
                <li className="flex gap-2"><span className="text-teal">→</span>Módulos listos: Tribai (tributario) y Laudos (arbitral).</li>
              </ul>
            </div>
            <div className="md:pt-5">
              <a href="mailto:gerencia@inplux.co?subject=Demo%20de%20Kelsen" className="btn-dark w-full justify-center">
                Pide demo de Kelsen
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ──── FÁBRICA DE SOFTWARE — Frente 2 ──── */}
      <section id="fabrica" className="py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="reveal mb-14 text-center">
            <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Frente 2 · Fábrica de software</p>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-xl mx-auto">
              El mismo motor <em className="italic">construye software.</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Nuestros agentes no solo razonan: construyen. De la especificación al deploy, el motor agéntico convierte una idea en producto. Por eso operamos como fábrica — muchas .apps salen del mismo núcleo.
            </p>
          </div>

          <div className="svg-scroll-hint">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" /></svg>
            Desliza para ver completo
          </div>
          <div className="reveal w-full overflow-x-auto">
            <svg viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[1000px] mx-auto min-w-[720px]" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }} role="img" aria-label="Fábrica de software de INPLUX: el motor agéntico alimenta un pipeline de especificación, agentes, build y deploy, que produce múltiples aplicaciones">
              {/* Background dots */}
              {Array.from({ length: 16 }).map((_, row) =>
                Array.from({ length: 28 }).map((_, col) => (
                  <circle key={`fb-${row}-${col}`} cx={36 * col + 12} cy={37 * row + 12} r="0.35" fill="#e8e6e3" />
                ))
              )}

              {/* ═══ MOTOR (left) ═══ */}
              <ellipse cx="120" cy="300" rx="135" ry="112" fill="url(#tealHalo)" className="svg-halo-pulse" />
              <a href="#motor">
                <g className="eco-glow svg-card" style={{ cursor: "pointer" }}>
                  <rect x="30" y="240" width="180" height="120" rx="16" fill="url(#inkGrad)" />
                  <rect x="30" y="240" width="180" height="120" rx="16" fill="none" stroke="#0d7d74" strokeWidth="2" strokeDasharray="10 280" className="eco-orbit" style={{ animationDuration: "8s" }} />
                  <text x="120" y="288" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">Motor</text>
                  <text x="120" y="306" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">agéntico</text>
                  <text x="120" y="324" textAnchor="middle" fill="#5fe3d6" fontSize="7" fontWeight="600" letterSpacing="1">SELF-IMPROVING</text>
                  <text x="120" y="342" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7">memoria + aprendizaje</text>
                </g>
              </a>

              {/* Arrow motor → pipeline */}
              <line x1="210" y1="300" x2="248" y2="300" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow" />
              <polygon points="248,295 258,300 248,305" fill="#0d7d74" />

              {/* ═══ PIPELINE (center) ═══ */}
              <rect x="258" y="172" width="318" height="256" rx="16" fill="white" stroke="#0d7d74" strokeWidth="1.5" />
              <rect x="259" y="172" width="316" height="30" rx="16" fill="#e8f5f3" />
              <text x="417" y="192" textAnchor="middle" fill="#0d7d74" fontSize="9" fontWeight="700" letterSpacing="2">FÁBRICA DE SOFTWARE</text>

              {[
                { n: "01", t: "Especificación", s: "spec-kit · requisitos vivos" },
                { n: "02", t: "Agentes construyen", s: "código, datos y modelos" },
                { n: "03", t: "Build & pruebas", s: "CI/CD · tests automáticos" },
                { n: "04", t: "Deploy continuo", s: "a producción en días" },
              ].map((st, i) => {
                const y = 216 + i * 50;
                return (
                  <g key={st.n}>
                    <rect x="278" y={y} width="278" height="40" rx="10" fill="#f3f1ee" />
                    <circle cx="300" cy={y + 20} r="11" fill="#0d7d74" />
                    <text x="300" y={y + 23} textAnchor="middle" fill="white" fontSize="8" fontWeight="700">{st.n}</text>
                    <text x="322" y={y + 16} fill="#1a1918" fontSize="10.5" fontWeight="700">{st.t}</text>
                    <text x="322" y={y + 31} fill="#8a8784" fontSize="7.5">{st.s}</text>
                    {i < 3 && <line x1="417" y1={y + 40} x2="417" y2={y + 50} stroke="#0d7d74" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" />}
                  </g>
                );
              })}

              {/* Arrow pipeline → apps */}
              <line x1="576" y1="300" x2="614" y2="300" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow" />
              <polygon points="614,295 624,300 614,305" fill="#0d7d74" />

              {/* ═══ APPS (right) ═══ */}
              <text x="800" y="190" textAnchor="middle" fill="#6e6b68" fontSize="9" fontWeight="700" letterSpacing="2">PRODUCTOS · .APPS</text>
              {[
                { x: 628, y: 200, name: "Tribai", active: true },
                { x: 800, y: 200, name: "Gobia", active: true },
                { x: 628, y: 280, name: "Kelsen", active: true },
                { x: 800, y: 280, name: "Laudos", active: true },
                { x: 628, y: 360, name: "Porkia", active: false },
                { x: 800, y: 360, name: "MiMotoYa", active: false },
                { x: 628, y: 440, name: "+ nuevas .apps", active: false },
                { x: 800, y: 440, name: "En desarrollo", active: false },
              ].map((a) => (
                <g key={a.name} className="eco-float svg-card">
                  <rect x={a.x} y={a.y} width="156" height="64" rx="10" fill="white" stroke={a.active ? "#0d7d74" : "#d1cfcc"} strokeWidth={a.active ? 1.5 : 1.2} strokeDasharray={a.active ? "0" : "6 5"} />
                  <circle cx={a.x + 138} cy={a.y + 16} r="5" fill={a.active ? "#0d7d74" : "#d1cfcc"} />
                  {a.active && <text x={a.x + 138} y={a.y + 19} textAnchor="middle" fill="white" fontSize="6" fontWeight="700">&#10003;</text>}
                  <text x={a.x + 78} y={a.y + 38} textAnchor="middle" fill={a.active ? "#1a1918" : "#a8a5a0"} fontSize="12" fontWeight="700">{a.name}</text>
                  <text x={a.x + 78} y={a.y + 52} textAnchor="middle" fill={a.active ? "#0d7d74" : "#b8b5b1"} fontSize="7" fontWeight="600">{a.active ? "En producción" : "En desarrollo"}</text>
                </g>
              ))}

              {/* Bottom band */}
              <rect x="300" y="540" width="400" height="40" rx="20" fill="url(#inkGrad)" />
              <text x="500" y="565" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" letterSpacing="1">UN NÚCLEO · MUCHAS .APPS</text>
            </svg>
          </div>

          {/* Para quién · qué te llevas · CTA */}
          <div className="reveal grid md:grid-cols-3 gap-6 md:gap-8 mt-14 items-start">
            <div>
              <p className="text-teal text-[0.65rem] font-bold tracking-[0.12em] uppercase mb-2">Para quién</p>
              <p className="text-gray-600 text-[0.9rem] leading-relaxed">Empresas, gobiernos y emprendedores que necesitan software de verdad — no presentaciones — a velocidad de frontera.</p>
            </div>
            <div>
              <p className="text-teal text-[0.65rem] font-bold tracking-[0.12em] uppercase mb-2">Qué te llevas</p>
              <ul className="space-y-2 text-gray-600 text-[0.9rem] leading-snug">
                <li className="flex gap-2"><span className="text-teal">→</span>Del spec al deploy en semanas, no meses.</li>
                <li className="flex gap-2"><span className="text-teal">→</span>Agentes que construyen, prueban y despliegan con tu conocimiento dentro.</li>
                <li className="flex gap-2"><span className="text-teal">→</span>Un portafolio probado: Tribai, Gobia, Kelsen, Laudos y más.</li>
              </ul>
            </div>
            <div className="md:pt-5">
              <a href="mailto:contacto@inplux.co?subject=Nueva%20.app%20con%20INPLUX" className="btn-dark w-full justify-center">
                Conversemos tu .app
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ──── SOLIDEZ TÉCNICA — Frontera del conocimiento ──── */}
      <section id="tecnologia" className="py-20 md:py-28 bg-warm">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="reveal mb-14 text-center">
            <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Solidez técnica · Frontera del conocimiento</p>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-xl mx-auto">
              No inventamos la IA.<br /><em className="italic">Implementamos su frontera.</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Construimos sobre lo último en memoria, aprendizaje continuo y conocimiento persistente. Esto es lo que estudiamos y desplegamos — con 25 años de conocimiento real que lo aterriza.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {[
              { t: "Memory Blocks", d: "Memoria persistente y editable que el propio agente lee, escribe y versiona.", r: "MemGPT · Letta" },
              { t: "Sleep-time Compute", d: "El agente consolida y reflexiona en reposo, sin costar latencia en vivo.", r: "Letta · arXiv 2504.13171" },
              { t: "LLM-Wiki", d: "El conocimiento se compila en un wiki vivo e interconectado, no en chunks sueltos.", r: "Patrón A. Karpathy, 2026" },
              { t: "GraphRAG", d: "Grafo de conocimiento para razonamiento multi-hop y menos alucinaciones.", r: "Microsoft Research" },
              { t: "Continual Learning", d: "Mejora con cada caso, sin olvido catastrófico ni reentrenar de cero.", r: "Survey · arXiv 2404.16789" },
              { t: "Memoria episódica", d: "Recuerda eventos con fecha y contexto — la pieza que faltaba para el largo plazo.", r: "arXiv 2502.06975" },
            ].map((x) => (
              <div key={x.t} className="reveal card">
                <h3 className="font-serif text-[1.2rem] text-ink mb-1.5">{x.t}</h3>
                <p className="text-gray-500 text-[0.85rem] leading-relaxed mb-3.5">{x.d}</p>
                <span className="inline-block text-[0.62rem] font-semibold tracking-[0.06em] uppercase bg-teal-soft text-teal px-2.5 py-1 rounded-full">{x.r}</span>
              </div>
            ))}
          </div>

          <p className="reveal text-center text-gray-400 text-[0.8rem] mt-10 max-w-xl mx-auto leading-relaxed">
            Estudiamos la frontera para construir en ella. La misma maquinaria de auto-mejora mueve nuestro cerebro legal y nuestra fábrica de software.
          </p>
        </div>
      </section>

      {/* ──── INFRAESTRUCTURA — SVG Visual ──── */}
      <section className="py-20 md:py-28 bg-warm">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="reveal mb-14 text-center">
            <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Infraestructura</p>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-lg mx-auto">
              Tecnología de punta <em className="italic">detrás de cada producto</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Construimos sobre infraestructura de clase mundial. Cada capa — desde la inteligencia artificial hasta el despliegue — está diseñada para escalar con nuestros clientes.
            </p>
          </div>

          <div className="svg-scroll-hint">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" /></svg>
            Desliza para ver completo
          </div>
          <div className="reveal w-full overflow-x-auto">
            <svg viewBox="0 0 960 620" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[960px] mx-auto min-w-[640px]" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }} role="img" aria-label="Infraestructura tecnológica de INPLUX organizada por capas">
              {/* Background dots */}
              {Array.from({ length: 17 }).map((_, row) =>
                Array.from({ length: 27 }).map((_, col) => (
                  <circle key={`ig-${row}-${col}`} cx={36 * col + 12} cy={37 * row + 10} r="0.35" fill="#d8d5d1" />
                ))
              )}

              {/* ═══ LAYER 1: IA & MODELOS ═══ */}
              <g className="eco-float">
                <rect x="30" y="20" width="900" height="120" rx="16" fill="white" stroke="#0d7d74" strokeWidth="1.5" />
                <rect x="31" y="20" width="898" height="30" rx="16" fill="#e8f5f3" />
                <text x="55" y="40" fill="#0d7d74" fontSize="9" fontWeight="700" letterSpacing="2">INTELIGENCIA ARTIFICIAL & MODELOS</text>

                {/* AI pills */}
                <rect x="50" y="64" width="110" height="24" rx="12" fill="#e8f5f3" />
                <text x="105" y="80" textAnchor="middle" fill="#0d7d74" fontSize="8" fontWeight="600">Modelos LLM</text>
                <rect x="170" y="64" width="100" height="24" rx="12" fill="#e8f5f3" />
                <text x="220" y="80" textAnchor="middle" fill="#0d7d74" fontSize="8" fontWeight="600">Embeddings</text>
                <rect x="280" y="64" width="110" height="24" rx="12" fill="#e8f5f3" />
                <text x="335" y="80" textAnchor="middle" fill="#0d7d74" fontSize="8" fontWeight="600">RAG Pipeline</text>
                <rect x="400" y="64" width="130" height="24" rx="12" fill="#e8f5f3" />
                <text x="465" y="80" textAnchor="middle" fill="#0d7d74" fontSize="8" fontWeight="600">Prompt Engineering</text>
                <rect x="540" y="64" width="100" height="24" rx="12" fill="#e8f5f3" />
                <text x="590" y="80" textAnchor="middle" fill="#0d7d74" fontSize="8" fontWeight="600">Fine-tuning</text>
                <rect x="650" y="64" width="130" height="24" rx="12" fill="#e8f5f3" />
                <text x="715" y="80" textAnchor="middle" fill="#0d7d74" fontSize="8" fontWeight="600">Agentes Autónomos</text>
                <rect x="790" y="64" width="120" height="24" rx="12" fill="#e8f5f3" />
                <text x="850" y="80" textAnchor="middle" fill="#0d7d74" fontSize="8" fontWeight="600">NLP Normativo</text>

                <rect x="50" y="98" width="120" height="24" rx="12" fill="#f3f1ee" />
                <text x="110" y="114" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Base Vectorial</text>
                <rect x="180" y="98" width="130" height="24" rx="12" fill="#f3f1ee" />
                <text x="245" y="114" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Razonamiento Híbrido</text>
                <rect x="320" y="98" width="140" height="24" rx="12" fill="#f3f1ee" />
                <text x="390" y="114" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Clasificación Semántica</text>
                <rect x="470" y="98" width="130" height="24" rx="12" fill="#f3f1ee" />
                <text x="535" y="114" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">APIs de IA Propias</text>
                <rect x="610" y="98" width="140" height="24" rx="12" fill="#f3f1ee" />
                <text x="680" y="114" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Validación de Fuentes</text>
                <rect x="760" y="98" width="150" height="24" rx="12" fill="#f3f1ee" />
                <text x="835" y="114" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Procesamiento Masivo</text>
              </g>

              {/* Connection lines layer 1 → 2 */}
              <line x1="480" y1="144" x2="480" y2="168" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" className="eco-dash-flow" />
              <line x1="240" y1="144" x2="240" y2="168" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="720" y1="144" x2="720" y2="168" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="3 3" />

              {/* ═══ LAYER 2: APLICACIONES ═══ */}
              <g className="eco-float-delay">
                <rect x="30" y="168" width="900" height="120" rx="16" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <rect x="31" y="168" width="898" height="30" rx="16" fill="#f3f1ee" />
                <text x="55" y="188" fill="#6e6b68" fontSize="9" fontWeight="700" letterSpacing="2">APLICACIONES & PRODUCTOS</text>

                <rect x="50" y="212" width="110" height="24" rx="12" fill="#e8f5f3" />
                <text x="105" y="228" textAnchor="middle" fill="#0d7d74" fontSize="8" fontWeight="600">Tribai.co</text>
                <rect x="170" y="212" width="130" height="24" rx="12" fill="#f3f1ee" />
                <text x="235" y="228" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">+35 Calculadoras</text>
                <rect x="310" y="212" width="140" height="24" rx="12" fill="#f3f1ee" />
                <text x="380" y="228" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Declaración de Renta</text>
                <rect x="460" y="212" width="130" height="24" rx="12" fill="#f3f1ee" />
                <text x="525" y="228" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Info. Exógena</text>
                <rect x="600" y="212" width="140" height="24" rx="12" fill="#f3f1ee" />
                <text x="670" y="228" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Gemelo Municipal</text>
                <rect x="750" y="212" width="160" height="24" rx="12" fill="#f3f1ee" />
                <text x="830" y="228" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Hacienda Dashboard</text>

                <rect x="50" y="246" width="120" height="24" rx="12" fill="#f3f1ee" />
                <text x="110" y="262" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Estatuto RAG</text>
                <rect x="180" y="246" width="110" height="24" rx="12" fill="#f3f1ee" />
                <text x="235" y="262" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Rendición IAS</text>
                <rect x="300" y="246" width="140" height="24" rx="12" fill="#f3f1ee" />
                <text x="370" y="262" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Seguimiento PDM</text>
                <rect x="450" y="246" width="110" height="24" rx="12" fill="#f3f1ee" />
                <text x="505" y="262" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">API Tributaria</text>
                <rect x="570" y="246" width="120" height="24" rx="12" fill="#f3f1ee" />
                <text x="630" y="262" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">App Móvil</text>
                <rect x="700" y="246" width="150" height="24" rx="12" fill="#f3f1ee" />
                <text x="775" y="262" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Estatuto Municipal IA</text>
              </g>

              {/* Connection lines layer 2 → 3 */}
              <line x1="480" y1="292" x2="480" y2="316" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="4 3" />
              <line x1="240" y1="292" x2="240" y2="316" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="720" y1="292" x2="720" y2="316" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="3 3" />

              {/* ═══ LAYER 3: FRONTEND & BACKEND ═══ */}
              <g className="eco-float">
                <rect x="30" y="316" width="440" height="100" rx="16" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <rect x="31" y="316" width="438" height="26" rx="16" fill="#f3f1ee" />
                <text x="55" y="334" fill="#6e6b68" fontSize="8" fontWeight="700" letterSpacing="2">FRONTEND & EXPERIENCIA</text>

                <rect x="50" y="352" width="90" height="22" rx="11" fill="#f3f1ee" />
                <text x="95" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">React 19</text>
                <rect x="148" y="352" width="90" height="22" rx="11" fill="#f3f1ee" />
                <text x="193" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Next.js</text>
                <rect x="246" y="352" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="296" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">TypeScript</text>
                <rect x="354" y="352" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="404" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Tailwind CSS</text>

                <rect x="50" y="382" width="110" height="22" rx="11" fill="#f3f1ee" />
                <text x="105" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Framer Motion</text>
                <rect x="168" y="382" width="80" height="22" rx="11" fill="#f3f1ee" />
                <text x="208" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Radix UI</text>
                <rect x="256" y="382" width="90" height="22" rx="11" fill="#f3f1ee" />
                <text x="301" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Recharts</text>
                <rect x="354" y="382" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="404" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Validación</text>
              </g>

              <g className="eco-float-delay">
                <rect x="490" y="316" width="440" height="100" rx="16" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <rect x="491" y="316" width="438" height="26" rx="16" fill="#f3f1ee" />
                <text x="515" y="334" fill="#6e6b68" fontSize="8" fontWeight="700" letterSpacing="2">BACKEND & DATOS</text>

                <rect x="510" y="352" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="560" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">PostgreSQL</text>
                <rect x="618" y="352" width="80" height="22" rx="11" fill="#f3f1ee" />
                <text x="658" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">ORM</text>
                <rect x="706" y="352" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="756" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">REST APIs</text>
                <rect x="814" y="352" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="864" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Webhooks</text>

                <rect x="510" y="382" width="120" height="22" rx="11" fill="#f3f1ee" />
                <text x="570" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Edge Functions</text>
                <rect x="638" y="382" width="90" height="22" rx="11" fill="#f3f1ee" />
                <text x="683" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Cron Jobs</text>
                <rect x="736" y="382" width="80" height="22" rx="11" fill="#f3f1ee" />
                <text x="776" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Cache</text>
                <rect x="824" y="382" width="90" height="22" rx="11" fill="#f3f1ee" />
                <text x="869" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Queues</text>
              </g>

              {/* Connection lines layer 3 → 4 */}
              <line x1="480" y1="420" x2="480" y2="444" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="4 3" />

              {/* ═══ LAYER 4: DEVOPS & DESPLIEGUE ═══ */}
              <g className="eco-float">
                <rect x="140" y="444" width="680" height="70" rx="16" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <rect x="141" y="444" width="678" height="26" rx="16" fill="#f3f1ee" />
                <text x="165" y="462" fill="#6e6b68" fontSize="8" fontWeight="700" letterSpacing="2">DEVOPS · TESTING · DESPLIEGUE</text>

                <rect x="160" y="480" width="80" height="22" rx="11" fill="#f3f1ee" />
                <text x="200" y="495" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Cloud</text>
                <rect x="248" y="480" width="80" height="22" rx="11" fill="#f3f1ee" />
                <text x="288" y="495" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Docker</text>
                <rect x="336" y="480" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="386" y="495" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">CI/CD</text>
                <rect x="444" y="480" width="90" height="22" rx="11" fill="#f3f1ee" />
                <text x="489" y="495" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Testing</text>
                <rect x="542" y="480" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="592" y="495" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Monitoring</text>
                <rect x="650" y="480" width="80" height="22" rx="11" fill="#f3f1ee" />
                <text x="690" y="495" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Pagos</text>
                <rect x="738" y="480" width="70" height="22" rx="11" fill="#f3f1ee" />
                <text x="773" y="495" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Email</text>
              </g>

              {/* Decorative pulses */}
              <circle cx="60" cy="80" r="3" fill="#0d7d74" opacity="0.3" className="eco-node-pulse" />
              <circle cx="900" cy="230" r="3" fill="#0d7d74" opacity="0.2" className="eco-node-pulse-delay1" />
              <circle cx="60" cy="370" r="3" fill="#0d7d74" opacity="0.2" className="eco-node-pulse-delay2" />
              <circle cx="900" cy="480" r="3" fill="#d1cfcc" className="eco-node-pulse" />

              {/* Stats bar */}
              <rect x="200" y="540" width="560" height="34" rx="17" fill="url(#inkGrad)" />
              <text x="480" y="561" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" letterSpacing="1.5">4 CAPAS · 40+ HERRAMIENTAS · INFRAESTRUCTURA DE CLASE MUNDIAL</text>

              {/* Side labels */}
              <text x="480" y="600" textAnchor="middle" fill="#a8a5a0" fontSize="7.5" fontWeight="600" letterSpacing="1">DISEÑADA PARA ESCALAR CON NUESTROS CLIENTES</text>
            </svg>
          </div>
        </div>
      </section>

      {/* ──── HUB / ECOSYSTEM ──── */}
      <section id="empresas" className="py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="reveal mb-14">
            <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Ecosistema Inplux</p>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-lg">
              No trabajamos solos.<br /><em className="italic">Operamos como hub.</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed">
              Inplux integra plataformas propias con empresas aliadas de primer nivel.
              Cada proyecto tiene detrás un ecosistema completo de ingeniería, datos e infraestructura.
            </p>
          </div>

          {/* SVG Ecosystem Map — clickable Tribai & Fourier */}
          <div className="svg-scroll-hint">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" /></svg>
            Desliza para ver completo
          </div>
          <div className="reveal w-full overflow-x-auto">
            <svg viewBox="0 0 1000 760" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[1000px] mx-auto min-w-[680px]" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }} role="img" aria-label="Mapa del ecosistema de empresas aliadas de INPLUX">
              {/* Orbits — centered at (500, 360) */}
              <circle cx="500" cy="360" r="330" stroke="#a8a5a0" strokeWidth="1" strokeDasharray="8 6" fill="none" className="eco-orbit" style={{ animationDuration: "50s" }} />
              <circle cx="500" cy="360" r="280" stroke="#c8c5c1" strokeWidth="1.5" strokeDasharray="6 5" fill="none" className="eco-orbit" />
              <circle cx="500" cy="360" r="220" stroke="#d1cfcc" strokeWidth="0.8" strokeDasharray="3 7" fill="none" className="eco-orbit" style={{ animationDirection: "reverse", animationDuration: "35s" }} />

              {/* Decorative pulses on orbits */}
              <circle cx="250" cy="150" r="3" fill="#c8c5c1" className="eco-node-pulse" />
              <circle cx="780" cy="180" r="3" fill="#c8c5c1" className="eco-node-pulse-delay1" />
              <circle cx="180" cy="520" r="3" fill="#c8c5c1" className="eco-node-pulse-delay2" />
              <circle cx="830" cy="540" r="3" fill="#c8c5c1" className="eco-node-pulse" />

              {/* Connection lines from INPLUX down */}
              <line x1="400" y1="95" x2="310" y2="210" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4" className="eco-dash-flow" />
              <line x1="600" y1="95" x2="690" y2="210" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow-slow" />
              <line x1="500" y1="95" x2="500" y2="370" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.3" className="eco-dash-flow" />

              {/* ═══ INPLUX — top center ═══ */}
              <ellipse cx="500" cy="60" rx="185" ry="92" fill="url(#tealHalo)" className="svg-halo-pulse" />
              <g className="eco-glow">
                <rect x="400" y="24" width="200" height="68" rx="14" fill="url(#inkGrad)" />
                <text x="500" y="55" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" letterSpacing="3">INPLUX</text>
                <text x="500" y="74" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontWeight="600" letterSpacing="1.5">HUB DE IA & TIC</text>
              </g>

              {/* ═══ KELSEN — left (sombrilla legal) ═══ */}
              <a href="https://kelsen.io" target="_blank" rel="noopener noreferrer">
                <g className="eco-float svg-card" style={{ cursor: "pointer" }}>
                  <rect x="145" y="190" width="240" height="110" rx="12" fill="white" stroke="#0d7d74" strokeWidth="1.5" />
                  <rect x="146" y="190" width="238" height="26" rx="12" fill="#e8f5f3" />
                  <text x="170" y="208" fill="#0d7d74" fontSize="8.5" fontWeight="700" letterSpacing="1.5">SOMBRILLA LEGAL IA</text>
                  <circle cx="360" cy="203" r="6" fill="#0d7d74" />
                  <text x="360" y="206" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">&#10003;</text>
                  <text x="265" y="244" textAnchor="middle" fill="#1a1918" fontSize="17" fontWeight="700">Kelsen</text>
                  <text x="265" y="264" textAnchor="middle" fill="#0d7d74" fontSize="10.5" fontWeight="500" textDecoration="underline">kelsen.io</text>
                  <text x="265" y="284" textAnchor="middle" fill="#8a8784" fontSize="9">Cerebro legal · integra Tribai y Laudos</text>
                </g>
              </a>

              {/* ═══ GOBIA — right (mirror of Tribai) ═══ */}
              <a href="https://gobia.co" target="_blank" rel="noopener noreferrer">
              <g className="eco-float-delay svg-card" style={{ cursor: "pointer" }}>
                <rect x="615" y="190" width="240" height="110" rx="12" fill="white" stroke="#0d7d74" strokeWidth="1.5" />
                <rect x="616" y="190" width="238" height="26" rx="12" fill="#e8f5f3" />
                <text x="640" y="208" fill="#0d7d74" fontSize="8.5" fontWeight="700" letterSpacing="1.5">SECTOR PÚBLICO</text>
                <text x="735" y="244" textAnchor="middle" fill="#1a1918" fontSize="17" fontWeight="700">Gobia</text>
                <text x="735" y="264" textAnchor="middle" fill="#0d7d74" fontSize="10.5" fontWeight="500">gobia.co</text>
                <text x="735" y="284" textAnchor="middle" fill="#8a8784" fontSize="9">Gemelo digital & rendición de cuentas</text>
              </g>
              </a>

              {/* ═══ FOURIER — center ═══ */}
              <a href="https://fourier.dev/en" target="_blank" rel="noopener noreferrer">
                <g className="eco-glow svg-card" style={{ cursor: "pointer" }}>
                  <rect x="350" y="370" width="300" height="86" rx="14" fill="white" stroke="#0d7d74" strokeWidth="2" />
                  <rect x="351" y="370" width="298" height="24" rx="14" fill="#e8f5f3" />
                  <text x="380" y="387" fill="#0d7d74" fontSize="8" fontWeight="700" letterSpacing="1.5">BACK TECNOLÓGICO PRINCIPAL</text>
                  <text x="500" y="416" textAnchor="middle" fill="#1a1918" fontSize="18" fontWeight="800" letterSpacing="0.5">Fourier</text>
                  <text x="500" y="434" textAnchor="middle" fill="#0d7d74" fontSize="10.5" fontWeight="500" textDecoration="underline">fourier.dev</text>
                  <text x="500" y="450" textAnchor="middle" fill="#8a8784" fontSize="8.5">Arquitectura de software, cloud e infraestructura</text>
                </g>
              </a>

              {/* ═══ 4 ALIADOS — distribución simétrica alrededor de Fourier ═══ */}

              {/* Think IT — izquierda */}
              <g className="eco-float-delay2">
                <rect x="55" y="395" width="170" height="52" rx="10" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <text x="140" y="419" textAnchor="middle" fill="#3d3b39" fontSize="11" fontWeight="600">Think IT</text>
                <text x="140" y="435" textAnchor="middle" fill="#a8a5a0" fontSize="8.5">Ingeniería de software</text>
              </g>
              <line x1="225" y1="415" x2="350" y2="410" stroke="#c8c5c1" strokeWidth="1.5" strokeDasharray="4 3" />
              <circle cx="287" cy="413" r="3" fill="#0d7d74" opacity="0.4" className="eco-node-pulse" />

              {/* Alianza IT — derecha (espejo de Think IT) */}
              <g className="eco-float-delay">
                <rect x="775" y="395" width="170" height="52" rx="10" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <text x="860" y="419" textAnchor="middle" fill="#3d3b39" fontSize="11" fontWeight="600">Alianza IT</text>
                <text x="860" y="435" textAnchor="middle" fill="#a8a5a0" fontSize="8.5">Integración tecnológica</text>
              </g>
              <line x1="775" y1="415" x2="650" y2="410" stroke="#c8c5c1" strokeWidth="1.5" strokeDasharray="4 3" />
              <circle cx="713" cy="413" r="3" fill="#0d7d74" opacity="0.4" className="eco-node-pulse-delay2" />

              {/* BBD Soluciones — abajo-izquierda */}
              <g className="eco-float">
                <rect x="155" y="510" width="170" height="52" rx="10" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <text x="240" y="534" textAnchor="middle" fill="#3d3b39" fontSize="11" fontWeight="600">BBD Soluciones</text>
                <text x="240" y="550" textAnchor="middle" fill="#a8a5a0" fontSize="8.5">Analítica de datos</text>
              </g>
              <line x1="325" y1="525" x2="400" y2="456" stroke="#c8c5c1" strokeWidth="1.5" strokeDasharray="4 3" />
              <circle cx="362" cy="490" r="3" fill="#0d7d74" opacity="0.4" className="eco-node-pulse-delay1" />

              {/* Observatorio de Datos — abajo-derecha (espejo de BBD), clickable */}
              <a href="https://datosyanalisis.org/" target="_blank" rel="noopener noreferrer">
                <g className="eco-float-delay svg-card" style={{ cursor: "pointer" }}>
                  <rect x="675" y="510" width="170" height="52" rx="10" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                  <text x="760" y="534" textAnchor="middle" fill="#3d3b39" fontSize="10" fontWeight="600">Observatorio de Datos</text>
                  <text x="760" y="550" textAnchor="middle" fill="#0d7d74" fontSize="8" fontWeight="500" textDecoration="underline">datosyanalisis.org</text>
                </g>
              </a>
              <line x1="675" y1="525" x2="600" y2="456" stroke="#c8c5c1" strokeWidth="1.5" strokeDasharray="4 3" />
              <circle cx="638" cy="490" r="3" fill="#0d7d74" opacity="0.4" className="eco-node-pulse" />

              {/* ═══ SISTEMAS ARIES — círculo exterior, abajo centro ═══ */}
              <g className="eco-float-delay2">
                <rect x="380" y="620" width="240" height="66" rx="14" fill="white" stroke="#0d7d74" strokeWidth="2" />
                <rect x="381" y="620" width="238" height="22" rx="14" fill="#e8f5f3" />
                <text x="405" y="636" fill="#0d7d74" fontSize="7" fontWeight="700" letterSpacing="1.5">ALIADO ESTRATÉGICO · CÍRCULO EXTERIOR</text>
                <text x="500" y="659" textAnchor="middle" fill="#1a1918" fontSize="15" fontWeight="700">Sistemas Aries</text>
                <text x="500" y="676" textAnchor="middle" fill="#8a8784" fontSize="8.5">+31 años · ERP financiero modular</text>
              </g>
              <line x1="500" y1="600" x2="500" y2="620" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.3" className="eco-dash-flow" />
              <circle cx="500" cy="608" r="3" fill="#0d7d74" opacity="0.4" className="eco-node-pulse" />

              {/* Bottom label */}
              <text x="500" y="710" textAnchor="middle" fill="#d1cfcc" fontSize="8" fontWeight="600" letterSpacing="2">ECOSISTEMA DE ALIADOS ESTRATÉGICOS Y TECNOLÓGICOS</text>
            </svg>
          </div>

          {/* Platform details */}
          <div className="grid md:grid-cols-2 gap-5 mt-12 stagger">
            {HUB_COMPANIES.map((c) => (
              <div key={c.name} className="reveal card">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[0.6875rem] font-bold tracking-[0.12em] uppercase text-gray-400">{c.focus}</span>
                  <span className={`text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full ${c.status === "Activo" ? "bg-teal-soft text-teal" : "bg-warm-50 text-gray-500"}`}>{c.status}</span>
                </div>
                <h3 className="font-serif text-[1.35rem] md:text-[1.5rem] text-ink mb-1">{c.name}</h3>
                <p className="text-teal text-sm font-medium mb-3">{c.domain}</p>
                <p className="text-gray-500 text-[0.875rem] leading-relaxed mb-3">{c.desc}</p>
                <p className="text-gray-400 text-[0.75rem] italic">{c.upcoming}</p>
                {c.status === "Activo" && (
                  <a href={`https://${c.domain}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink text-sm font-semibold mt-4 hover:text-teal transition-colors">
                    Visitar plataforma
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── TIMELINE — Scrollytelling with two eras ──── */}
      <section id="trayectoria" className="py-20 md:py-28 bg-warm overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="reveal mb-16 md:mb-20">
            <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Trayectoria</p>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-lg">
              25 años de <em className="italic">transformaciones</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed">
              Cada hito construyó sobre el anterior. Lo que empezó como asesoría en terreno hoy es un ecosistema de tecnología e inteligencia artificial.
            </p>
          </div>

          {/* ═══ ERA 1: El grupo de expertos ═══ */}
          <div className="reveal mb-10">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-ink text-white flex items-center justify-center text-[0.75rem] font-bold shrink-0 shadow-md">I</div>
              <div>
                <h3 className="font-serif text-[1.5rem] md:text-[1.85rem] text-ink leading-tight mb-1">{TIMELINE_ERA_1.title}</h3>
                <span className="text-gray-400 text-[0.7rem] font-semibold tracking-[0.12em] uppercase">2000 — 2021 · 9 hitos</span>
              </div>
            </div>
            <div className="ml-[64px] md:ml-0 md:max-w-2xl">
              <p className="text-gray-500 text-[0.9375rem] leading-[1.65] mb-3">
                {TIMELINE_ERA_1.subtitle}
              </p>
              <a href={TIMELINE_ERA_1.ceoLinkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-teal text-[0.8125rem] font-semibold hover:text-ink transition-colors group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                Jaime Alonso Cano Pino
              </a>
            </div>
          </div>

          {/* Era 1 Timeline */}
          <div className="relative mb-10">
            {/* Center line desktop / left line mobile */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-px" style={{ background: "linear-gradient(to bottom, #e5e3e0, #d1cfcc 30%, #d1cfcc 70%, #e5e3e0)" }} />
            <div className="md:hidden absolute left-[18px] top-0 bottom-0 w-px bg-border" />

            <div className="space-y-4 md:space-y-6">
              {TIMELINE_ERA_1.events.map((ev, i) => {
                const isKeyMilestone = ["2000", "2010", "2019"].includes(ev.year);
                return (
                  <div key={ev.year} className="reveal relative md:grid md:grid-cols-2 md:gap-10">
                    {/* Timeline dot */}
                    <div className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 top-6 z-10">
                      <div className={`rounded-full border-2 transition-all duration-500 ${isKeyMilestone ? "w-4 h-4 border-ink bg-ink shadow-[0_0_0_4px_rgba(26,25,24,0.08)]" : "w-3 h-3 border-gray-300 bg-white hover:border-ink hover:bg-ink"}`} />
                    </div>

                    {/* Card — alternates sides on desktop */}
                    <div className={`ml-10 md:ml-0 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"}`}>
                      <div className={`rounded-xl p-5 md:p-6 transition-all duration-300 hover:shadow-md ${isKeyMilestone ? "bg-white border-2 border-gray-200 shadow-sm" : "bg-white border border-border hover:border-gray-200"}`}>
                        {/* Year + metric row */}
                        <div className={`flex items-center gap-3 mb-3 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                          <span className={`font-serif leading-none text-ink ${isKeyMilestone ? "text-[1.75rem] md:text-[2.25rem]" : "text-xl md:text-2xl"}`}>{ev.year}</span>
                          <span className={`text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full ${isKeyMilestone ? "bg-ink text-white" : "bg-warm-50 text-gray-500"}`}>{ev.metric}</span>
                        </div>
                        <p className="text-gray-500 text-[0.8125rem] leading-[1.6]">{ev.text}</p>
                      </div>
                    </div>
                    {i % 2 === 0 && <div className="hidden md:block" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Era 1 Summary */}
          <div className="reveal mb-8">
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {[
                { num: "21", label: "años en campo" },
                { num: "+50", label: "entidades" },
                { num: "9", label: "hitos clave" },
              ].map((s) => (
                <div key={s.label} className="text-center py-3">
                  <div className="font-serif text-2xl md:text-3xl text-ink leading-none mb-1">{s.num}</div>
                  <div className="text-gray-400 text-[0.65rem] font-semibold uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ TRANSITION — Era break ═══ */}
          <div className="reveal relative my-14 md:my-20">
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-teal/30 to-transparent" />
            <div className="relative flex flex-col items-center gap-3">
              <div className="bg-off-white px-8 py-4 border border-teal/30 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  <p className="text-teal text-[0.8rem] font-bold tracking-[0.08em] uppercase">De la experiencia al producto</p>
                </div>
                <p className="text-gray-400 text-[0.7rem] text-center">Todo ese conocimiento se formaliza en tecnología</p>
              </div>
            </div>
          </div>

          {/* ═══ ERA 2: La era INPLUX ═══ */}
          <div className="reveal mb-10">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-teal text-white flex items-center justify-center text-[0.75rem] font-bold shrink-0 shadow-md shadow-teal/20">II</div>
              <div>
                <h3 className="font-serif text-[1.5rem] md:text-[1.85rem] text-ink leading-tight mb-1">{TIMELINE_ERA_2.title}</h3>
                <span className="text-teal text-[0.7rem] font-semibold tracking-[0.12em] uppercase">2023 — Presente</span>
              </div>
            </div>
            <div className="ml-[64px] md:ml-0 md:max-w-2xl">
              <p className="text-gray-500 text-[0.9375rem] leading-[1.65]">
                {TIMELINE_ERA_2.subtitle}
              </p>
            </div>
          </div>

          {/* Era 2 Timeline */}
          <div className="relative">
            {/* Center line desktop / left line mobile — teal gradient */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-px" style={{ background: "linear-gradient(to bottom, #0d7d74 0%, rgba(13,125,116,0.3) 100%)" }} />
            <div className="md:hidden absolute left-[18px] top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, #0d7d74 0%, rgba(13,125,116,0.3) 100%)" }} />

            <div className="space-y-6">
              {TIMELINE_ERA_2.events.map((ev, i) => {
                const isLast = i === TIMELINE_ERA_2.events.length - 1;
                return (
                  <div key={ev.year} className="reveal relative md:grid md:grid-cols-2 md:gap-10">
                    {/* Timeline dot — teal, glowing for last */}
                    <div className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 top-6 z-10">
                      <div className={`w-4 h-4 rounded-full border-2 border-teal bg-teal transition-all ${isLast ? "shadow-[0_0_0_5px_rgba(13,125,116,0.15),0_0_12px_rgba(13,125,116,0.2)]" : "shadow-[0_0_0_4px_rgba(13,125,116,0.08)]"}`} />
                    </div>

                    {/* Card */}
                    <div className={`ml-10 md:ml-0 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"}`}>
                      <div className={`rounded-xl p-5 md:p-7 transition-all duration-300 hover:shadow-lg ${isLast ? "bg-gradient-to-br from-teal-soft/60 to-white border-2 border-teal/30 shadow-md" : "bg-white border-2 border-teal/20 shadow-sm hover:border-teal/30"}`}>
                        <div className={`flex items-center gap-3 mb-3 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                          <span className="font-serif text-[2rem] md:text-[2.75rem] text-ink leading-none">{ev.year}</span>
                          <span className="text-[0.65rem] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full bg-teal text-white shadow-sm">{ev.metric}</span>
                        </div>
                        <p className="text-gray-600 text-[0.875rem] leading-[1.65] font-medium">{ev.text}</p>
                      </div>
                    </div>
                    {i % 2 === 0 && <div className="hidden md:block" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Final — current status pulse */}
          <div className="reveal mt-10 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-white border border-teal/20 rounded-full px-5 py-2.5 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-teal opacity-40 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal" />
              </span>
              <span className="text-gray-600 text-[0.8rem] font-medium">Construyendo el futuro — {new Date().getFullYear()} en curso</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──── CONTACT ──── */}
      <section id="contacto" className="py-20 md:py-28 bg-warm">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-14 md:gap-20">
            <div className="reveal-left">
              <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Contacto</p>
              <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-5">Hablemos.</h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-10">
                Ya sea que necesite poner al día la hacienda pública de su municipio, automatizar su operación tributaria o construir un producto digital desde cero — arrancamos con una conversación.
              </p>
              <div className="space-y-5">
                <div>
                  <span className="text-gray-500 text-xs font-bold tracking-[0.1em] uppercase block mb-0.5">Dirección</span>
                  <a href="https://maps.google.com/?q=Transversal+5+A+%23+45+91+Medellín+Antioquia" target="_blank" rel="noopener noreferrer" className="text-gray-700 text-[0.9375rem] hover:text-teal transition-colors whitespace-pre-line">Transversal 5 A # 45 - 91{"\n"}Medellín, Antioquia</a>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-bold tracking-[0.1em] uppercase block mb-0.5">Teléfono</span>
                  <a href="tel:+573023194636" className="text-gray-700 text-[0.9375rem] hover:text-teal transition-colors">(+57) 302 319 46 36</a>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-bold tracking-[0.1em] uppercase block mb-0.5">Gerencia</span>
                  <a href="mailto:gerencia@inplux.co" className="text-gray-700 text-[0.9375rem] hover:text-teal transition-colors">gerencia@inplux.co</a>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-bold tracking-[0.1em] uppercase block mb-0.5">Coordinación comercial</span>
                  <a href="mailto:contacto@inplux.co" className="text-gray-700 text-[0.9375rem] hover:text-teal transition-colors">contacto@inplux.co</a>
                </div>
              </div>
            </div>
            <div className="reveal">
              <div className="bg-white border border-border rounded-xl p-6 md:p-7">
                <h3 className="text-ink font-semibold text-[1rem] mb-5">Enviar mensaje</h3>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-3.5">
                  <div>
                    <label htmlFor="contact-name" className="text-gray-500 text-xs font-bold tracking-wider uppercase mb-1 block">Nombre</label>
                    <input id="contact-name" type="text" placeholder="Su nombre" className="form-input" required />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="contact-email" className="text-gray-500 text-xs font-bold tracking-wider uppercase mb-1 block">Email</label>
                      <input id="contact-email" type="email" placeholder="correo@empresa.co" className="form-input" required />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="text-gray-500 text-xs font-bold tracking-wider uppercase mb-1 block">Teléfono</label>
                      <input id="contact-phone" type="tel" placeholder="+57 3XX XXX XXXX" className="form-input" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="text-gray-500 text-xs font-bold tracking-wider uppercase mb-1 block">Mensaje</label>
                    <textarea id="contact-message" rows={4} placeholder="Cuéntenos sobre su proyecto..." className="form-input resize-none" required />
                  </div>
                  <button type="submit" className="btn-dark w-full sm:w-auto">
                    Enviar mensaje
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* ──── BACK TO TOP ──── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`back-to-top ${showTop ? "visible" : ""}`}
        aria-label="Volver arriba"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
      </button>

      {/* ──── FOOTER ──── */}
      <footer className="py-14 md:py-16 border-t border-border">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <span className="text-ink font-bold text-[0.9rem] tracking-[0.12em] uppercase block mb-3">INPLUX</span>
              <p className="text-gray-500 text-[0.8125rem] leading-relaxed max-w-[200px]">Hub de consultoría tributaria, tecnología e inteligencia artificial. Medellín, Colombia.</p>
            </div>
            <div>
              <h4 className="text-ink font-semibold text-[0.8125rem] mb-3.5">Navegación</h4>
              <ul className="space-y-2">
                {[{ label: "Inicio", href: "#inicio" }, ...navLinks].map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith("/") ? (
                      <Link href={l.href} className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">{l.label}</Link>
                    ) : (
                      <a href={l.href} className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">{l.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-ink font-semibold text-[0.8125rem] mb-3.5">Ecosistema</h4>
              <ul className="space-y-2">
                <li><a href="https://kelsen.io" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Kelsen.io</a></li>
                <li><a href="https://tribai.co" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Tribai.co</a></li>
                <li><a href="https://laudos.co" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Laudos.co</a></li>
                <li><a href="https://gobia.co" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Gobia.co</a></li>
                <li><a href="https://fourier.dev/en" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Fourier</a></li>
                <li><span className="text-gray-400 text-[0.8125rem]">Sistemas Aries</span></li>
                <li><span className="text-gray-400 text-[0.8125rem]">Think IT</span></li>
                <li><span className="text-gray-400 text-[0.8125rem]">BBD Soluciones</span></li>
                <li><span className="text-gray-400 text-[0.8125rem]">Alianza IT</span></li>
                <li><a href="https://datosyanalisis.org/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Observatorio de Datos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-ink font-semibold text-[0.8125rem] mb-3.5">Contacto</h4>
              <ul className="space-y-2 text-gray-500 text-[0.8125rem]">
                <li>Medellín, Antioquia</li>
                <li>(+57) 302 319 46 36</li>
                <li><a href="mailto:gerencia@inplux.co" className="hover:text-ink transition-colors">gerencia@inplux.co</a></li>
                <li><a href="mailto:contacto@inplux.co" className="hover:text-ink transition-colors">contacto@inplux.co</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-400 text-[0.75rem]">&copy; {new Date().getFullYear()} INPLUX S.A.S. Todos los derechos reservados.</p>
            <a href="https://www.linkedin.com/company/inplux" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ink transition-colors" aria-label="INPLUX en LinkedIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
