"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════ */
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".reveal,.reveal-left").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
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
const SERVICES = [
  {
    tag: "01",
    title: "Inteligencia Tributaria",
    desc: "Sabemos de estatuto tributario porque llevamos dos décadas aplicándolo en más de 50 municipios. NIC/NIIF en sus tres grupos, declaraciones de renta, ICA, estructuración fiscal — lo hacemos todos los días.",
    features: ["Estatuto tributario e impuesto de renta", "Adopción NIC/NIIF (grupos 1, 2 y 3)", "Estructuración fiscal municipal y departamental", "44 estatutos tributarios coordinados para Antioquia"],
    icon: "tax",
  },
  {
    tag: "02",
    title: "IA Neuro-simbólica & RAG",
    desc: "Vectorizamos toda la normativa colombiana y la ponemos a conversar con modelos de lenguaje. Así nació Tribai: un asistente que cita artículos, no inventa respuestas.",
    features: ["Asistente tributario Tribai con citación de fuentes", "RAG sobre normativa colombiana completa", "Razonamiento simbólico + modelos de lenguaje", "Stack: Pinecone, Supabase, LLMs de última generación"],
    icon: "ai",
  },
  {
    tag: "03",
    title: "Gemelos Digitales & Gobernanza",
    desc: "Un municipio colombiano reporta a Contraloría, Contaduría, DNP, ministerios y entidades CIAS. Construimos la réplica digital que centraliza todo eso en un solo tablero.",
    features: ["Gemelo digital de la gestión municipal", "Rendición de cuentas automatizada (CIAS)", "Reportes integrados a organismos de control", "Seguimiento en tiempo real al plan de desarrollo"],
    icon: "twin",
  },
  {
    tag: "04",
    title: "Hiperautomatización",
    desc: "Calculadoras de precisión tributaria, declaraciones sugeridas, agentes de IA para auditoría. Lo que antes tomaba semanas, ahora lo ejecuta un sistema en minutos.",
    features: ["Calculadoras tributarias de alta precisión", "Declaraciones sugeridas automatizadas", "Infraestructura cloud y plataformas ERP", "Agentes de IA para auditoría e interventoría"],
    icon: "auto",
  },
];

function ServiceIcon({ type }: { type: string }) {
  const base = "w-full h-full";
  switch (type) {
    case "tax":
      return (
        <svg viewBox="0 0 80 80" fill="none" className={base}>
          <rect x="10" y="18" width="60" height="44" rx="4" stroke="#0d7d74" strokeWidth="1.5" fill="none" />
          <line x1="10" y1="30" x2="70" y2="30" stroke="#0d7d74" strokeWidth="1" opacity="0.4" />
          <line x1="10" y1="40" x2="70" y2="40" stroke="#e5e3e0" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="10" y1="50" x2="70" y2="50" stroke="#e5e3e0" strokeWidth="0.8" strokeDasharray="3 3" />
          <text x="20" y="27" fill="#0d7d74" fontSize="6" fontWeight="700" fontFamily="monospace">§ ART. 1294</text>
          <rect x="16" y="34" width="20" height="3" rx="1.5" fill="#0d7d74" opacity="0.3" />
          <rect x="16" y="44" width="32" height="3" rx="1.5" fill="#0d7d74" opacity="0.2" />
          <rect x="16" y="54" width="14" height="3" rx="1.5" fill="#0d7d74" opacity="0.15" />
          <circle cx="60" cy="52" r="8" stroke="#0d7d74" strokeWidth="1.5" fill="none" className="eco-orbit" style={{ animationDuration: "8s" }} />
          <text x="60" y="55" textAnchor="middle" fill="#0d7d74" fontSize="8" fontWeight="700">$</text>
        </svg>
      );
    case "ai":
      return (
        <svg viewBox="0 0 80 80" fill="none" className={base}>
          {/* Neural network nodes */}
          <circle cx="15" cy="25" r="4" fill="#0d7d74" opacity="0.6" className="eco-node-pulse" />
          <circle cx="15" cy="40" r="4" fill="#0d7d74" opacity="0.6" className="eco-node-pulse-delay1" />
          <circle cx="15" cy="55" r="4" fill="#0d7d74" opacity="0.6" className="eco-node-pulse-delay2" />
          <circle cx="40" cy="30" r="5" fill="#0d7d74" opacity="0.8" className="eco-node-pulse-delay1" />
          <circle cx="40" cy="50" r="5" fill="#0d7d74" opacity="0.8" className="eco-node-pulse" />
          <circle cx="65" cy="40" r="6" fill="#0d7d74" className="eco-node-pulse-delay2" />
          {/* Connections */}
          <line x1="19" y1="25" x2="35" y2="30" stroke="#0d7d74" strokeWidth="0.8" opacity="0.4" />
          <line x1="19" y1="40" x2="35" y2="30" stroke="#0d7d74" strokeWidth="0.8" opacity="0.4" />
          <line x1="19" y1="40" x2="35" y2="50" stroke="#0d7d74" strokeWidth="0.8" opacity="0.4" />
          <line x1="19" y1="55" x2="35" y2="50" stroke="#0d7d74" strokeWidth="0.8" opacity="0.4" />
          <line x1="45" y1="30" x2="59" y2="40" stroke="#0d7d74" strokeWidth="1" opacity="0.5" className="eco-dash-flow" strokeDasharray="3 3" />
          <line x1="45" y1="50" x2="59" y2="40" stroke="#0d7d74" strokeWidth="1" opacity="0.5" className="eco-dash-flow" strokeDasharray="3 3" />
          {/* RAG label */}
          <rect x="22" y="62" width="36" height="12" rx="6" fill="#e8f5f3" />
          <text x="40" y="71" textAnchor="middle" fill="#0d7d74" fontSize="6" fontWeight="700" fontFamily="monospace">RAG</text>
        </svg>
      );
    case "twin":
      return (
        <svg viewBox="0 0 80 80" fill="none" className={base}>
          {/* Real building */}
          <rect x="8" y="25" width="22" height="35" rx="2" stroke="#a8a5a0" strokeWidth="1" fill="none" />
          <rect x="12" y="30" width="4" height="4" rx="0.5" fill="#a8a5a0" opacity="0.4" />
          <rect x="20" y="30" width="4" height="4" rx="0.5" fill="#a8a5a0" opacity="0.4" />
          <rect x="12" y="38" width="4" height="4" rx="0.5" fill="#a8a5a0" opacity="0.4" />
          <rect x="20" y="38" width="4" height="4" rx="0.5" fill="#a8a5a0" opacity="0.4" />
          <rect x="15" y="50" width="8" height="10" rx="1" fill="#a8a5a0" opacity="0.3" />
          {/* Mirror arrow */}
          <path d="M 34 40 L 46 40" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="3 2" className="eco-dash-flow" />
          <polygon points="46,37 52,40 46,43" fill="#0d7d74" opacity="0.6" />
          {/* Digital twin */}
          <rect x="50" y="25" width="22" height="35" rx="2" stroke="#0d7d74" strokeWidth="1.5" fill="none" />
          <rect x="54" y="30" width="4" height="4" rx="0.5" fill="#0d7d74" opacity="0.6" className="eco-node-pulse" />
          <rect x="62" y="30" width="4" height="4" rx="0.5" fill="#0d7d74" opacity="0.6" className="eco-node-pulse-delay1" />
          <rect x="54" y="38" width="4" height="4" rx="0.5" fill="#0d7d74" opacity="0.6" className="eco-node-pulse-delay2" />
          <rect x="62" y="38" width="4" height="4" rx="0.5" fill="#0d7d74" opacity="0.6" className="eco-node-pulse" />
          <rect x="57" y="50" width="8" height="10" rx="1" fill="#0d7d74" opacity="0.4" />
          {/* Live indicator */}
          <circle cx="68" cy="28" r="3" fill="#0d7d74" className="eco-node-pulse" />
          <text x="40" y="72" textAnchor="middle" fill="#a8a5a0" fontSize="5.5" fontWeight="600" letterSpacing="1">REAL → DIGITAL</text>
        </svg>
      );
    case "auto":
      return (
        <svg viewBox="0 0 80 80" fill="none" className={base}>
          {/* Gear 1 */}
          <circle cx="28" cy="35" r="12" stroke="#0d7d74" strokeWidth="1.5" fill="none" strokeDasharray="4 3" className="eco-orbit" style={{ animationDuration: "6s" }} />
          <circle cx="28" cy="35" r="5" fill="#0d7d74" opacity="0.2" />
          <circle cx="28" cy="35" r="2" fill="#0d7d74" opacity="0.6" />
          {/* Gear 2 */}
          <circle cx="52" cy="45" r="10" stroke="#0d7d74" strokeWidth="1.5" fill="none" strokeDasharray="3 3" className="eco-orbit" style={{ animationDuration: "5s", animationDirection: "reverse" }} />
          <circle cx="52" cy="45" r="4" fill="#0d7d74" opacity="0.2" />
          <circle cx="52" cy="45" r="1.5" fill="#0d7d74" opacity="0.6" />
          {/* Flow arrows */}
          <path d="M 10 60 Q 25 55, 40 58 T 70 56" stroke="#0d7d74" strokeWidth="1" opacity="0.4" strokeDasharray="3 2" className="eco-dash-flow" fill="none" />
          <polygon points="70,53 74,56 70,59" fill="#0d7d74" opacity="0.4" />
          {/* Speed indicator */}
          <text x="40" y="72" textAnchor="middle" fill="#a8a5a0" fontSize="5.5" fontWeight="600" letterSpacing="1">×100 FASTER</text>
        </svg>
      );
    default:
      return null;
  }
}

const TIMELINE_EVENTS = [
  { year: "2000", text: "Empezamos asesorando al Hospital San Camilo de Lelis y al Municipio de Vegachí. Contabilidad pura." },
  { year: "2002", text: "Llegamos al Hospital San Vicente de Paúl de Pueblo Rico. El sector salud nos abrió las puertas." },
  { year: "2004", text: "Reorganización financiera de Segovia — nuestro primer caso de alto impacto." },
  { year: "2007", text: "Constituimos la ESP de Vegachí. Yarumal, Valdivia, Yolombó y Andes entraron al portafolio." },
  { year: "2010", text: "Alianza con Sistemas Aries como asesores tributarios. Esa relación sigue vigente." },
  { year: "2014", text: "5 asociaciones de municipios estructuradas contablemente para el Ministerio del Interior." },
  { year: "2016", text: "Reestructuración de pasivos (Ley 550) de Cisneros. Un proyecto de 7 años." },
  { year: "2019", text: "44 estatutos tributarios coordinados para la Gobernación de Antioquia. El proyecto más grande hasta la fecha." },
  { year: "2021", text: "Asesoría a Caucasia, una de las entidades de mayor complejidad del departamento." },
  { year: "2023", text: "Nace INPLUX S.A.S. — ya no solo consultoría, sino hub de tecnología e inteligencia artificial." },
  { year: "2025", text: "Lanzamos Tribai.co: inteligencia tributaria con IA. Y arrancamos la plataforma de sector público." },
];

const LOGOS = [
  { src: "/logos/21053_escudo-vegachi-pagina_200x200.png", alt: "Vegachí" },
  { src: "/logos/47914_logo-alcaldia--300-x-100-1_200x200.png", alt: "Alcaldía" },
  { src: "/logos/54672_escudo-de-cisneros-antioquia-oficial-3x3_200x200.png", alt: "Cisneros" },
  { src: "/logos/CIS.png", alt: "CIS" },
  { src: "/logos/Escudo.png", alt: "Escudo" },
  { src: "/logos/cropped-Logo_Alianza-IT-1.png", alt: "Alianza IT" },
  { src: "/logos/logo-think-oracle.png", alt: "Think Oracle" },
  { src: "/logos/logo-provincia-b.svg", alt: "Provincia" },
  { src: "/logos/logo.png", alt: "Sistemas Aries" },
  { src: "/logos/logoedu.png", alt: "EDU" },
  { src: "/logos/navarro-ospina-logo.png", alt: "Navarro Ospina" },
  { src: "/logos/images.png", alt: "Cliente" },
  { src: "/logos/logo.jpg", alt: "Cliente" },
];

const HUB_COMPANIES = [
  {
    name: "Tribai",
    domain: "tribai.co",
    focus: "Sector Privado",
    desc: "Plataforma de inteligencia tributaria para contadores colombianos. +1.294 artículos del estatuto indexados, 35 calculadoras de precisión y asistente IA con citación de fuentes. Declaraciones de renta sugeridas y consulta automatizada.",
    status: "Activo",
  },
  {
    name: "Sector Público",
    domain: "Próximamente",
    focus: "Sector Público",
    desc: "Gemelo digital y rendición de cuentas para municipios. Integra datos de múltiples fuentes (DNP, ministerios, organismos de control) en un tablero centralizado. Automatiza reportes a la Contraloría, Contaduría y entidades CIAS.",
    status: "En desarrollo",
  },
];

const ECOSYSTEM = [
  { name: "Fourier", url: "https://fourier.dev/en", role: "Arquitectura de software, cloud e infraestructura digital" },
  { name: "Think IT", url: null, role: "Ingeniería de software y consultoría tecnológica" },
  { name: "Big Bang Data", url: null, role: "Analítica de datos y soluciones de información" },
  { name: "Alianza IT", url: null, role: "Integración tecnológica y servicios TI" },
];

/* ═══════════════════════════════════════
   PAGE
   ═══════════════════════════════════════ */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  useScrollReveal();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navLinks = [
    { label: "Servicios", href: "#servicios" },
    { label: "Ecosistema", href: "#empresas" },
    { label: "Trayectoria", href: "#trayectoria" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <>
      {/* ──── NAV ──── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 nav-wrap ${scrolled ? "scrolled" : ""}`}>
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 flex items-center justify-between h-[60px]">
          <a href="#inicio" className="text-ink font-bold text-[1.1rem] tracking-[0.12em] uppercase">INPLUX</a>
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-gray-500 hover:text-ink text-[0.8125rem] font-medium px-3 py-1.5 rounded-md transition-colors">{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="#contacto" className="hidden md:inline-flex btn-dark text-[0.8125rem] !py-2 !px-5">Hablemos</a>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-ink p-2 cursor-pointer" aria-label="Menú">
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
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-ink text-sm font-medium py-2.5 px-3 rounded-md transition-colors">{l.label}</a>
            ))}
            <a href="#contacto" onClick={() => setMobileOpen(false)} className="block btn-dark text-sm text-center !py-2.5 mt-2">Hablemos</a>
          </div>
        </div>
      </nav>

      {/* ──── HERO ──── */}
      <section id="inicio" className="relative pt-[60px] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 top-[60px] z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero.webm" type="video/webm" />
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 hero-overlay" />
        </div>
        {/* Content */}
        <div className="relative z-10 max-w-[1100px] mx-auto px-5 md:px-8 py-28 md:py-40">
          <div className="max-w-[720px]">
            <p className="reveal text-gray-400 text-[0.75rem] font-semibold tracking-[0.15em] uppercase mb-5">Consultoría · Tecnología · Inteligencia Artificial</p>
            <h1 className="reveal font-serif text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[5rem] leading-[1.05] tracking-[-0.02em] text-ink mb-7">
              La norma la conocemos.<br />
              La tecnología la{" "}
              <em className="font-serif italic text-teal">construimos.</em>
            </h1>
            <p className="reveal text-gray-500 text-lg md:text-[1.25rem] leading-[1.6] mb-10 max-w-[600px]">
              Nacimos en la tributaria. Llevamos 25 años entre estatutos, NIC/NIIF y hacienda pública colombiana.
              Hoy ese conocimiento corre sobre IA, gemelos digitales y automatización.
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-3">
              <a href="#servicios" className="btn-dark text-center">Ver capacidades</a>
              <a href="#contacto" className="btn-ghost text-center">Agendar sesión</a>
            </div>
          </div>
        </div>
        {/* Fade to white */}
        <div className="relative z-10 h-24 hero-fade-bottom" />
      </section>

      {/* ──── LOGOS ──── */}
      <section className="pt-6 pb-12 md:pt-8 md:pb-14">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 mb-5">
          <p className="reveal text-center text-gray-400 text-[0.6875rem] font-semibold tracking-[0.15em] uppercase">Confían en nosotros</p>
        </div>
        <div className="reveal relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-28 z-10" style={{ background: "linear-gradient(90deg, white, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 z-10" style={{ background: "linear-gradient(270deg, white, transparent)" }} />
          <div className="logo-track">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <Image key={`${logo.alt}-${i}`} src={logo.src} alt={logo.alt} width={90} height={32} className="logo-item" style={{ objectFit: "contain", width: "auto" }} unoptimized />
            ))}
          </div>
        </div>
      </section>

      <div className="fine-rule" />

      {/* ──── STATS ──── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-5 stagger">
            {[
              { value: "+25", label: "Años de experiencia", detail: "Desde el año 2000" },
              { value: "+50", label: "Municipios atendidos", detail: "En toda Colombia" },
              { value: "+100", label: "Proyectos ejecutados", detail: "Público y privado" },
              { value: "6", label: "Sectores de impacto", detail: "Gobierno · Salud · Educación" },
            ].map((stat) => (
              <div key={stat.label} className="reveal group relative border border-transparent hover:border-border rounded-xl p-4 md:p-5 transition-all duration-300 hover:shadow-sm">
                <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                <AnimatedNumber value={stat.value} label={stat.label} />
                <p className="text-gray-400 text-[0.7rem] mt-1.5">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── SERVICES ──── */}
      <section id="servicios" className="py-20 md:py-28 bg-warm">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="reveal mb-14">
            <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Capacidades</p>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-lg">
              Tributaria de fondo.<br /><em className="italic">Tecnología de frontera.</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed">
              No somos una empresa de tecnología que aprendió de tributaria. Somos tributaristas que construyen tecnología. Esa diferencia importa.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 stagger">
            {SERVICES.map((s) => (
              <div key={s.title} className="reveal card group">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-gray-300 text-[0.75rem] font-bold tracking-[0.1em]">{s.tag}</span>
                  <div className="w-[72px] h-[72px] opacity-70 group-hover:opacity-100 transition-opacity">
                    <ServiceIcon type={s.icon} />
                  </div>
                </div>
                <h3 className="font-serif text-[1.3rem] md:text-[1.45rem] text-ink mb-3 leading-snug">{s.title}</h3>
                <p className="text-gray-500 text-[0.875rem] leading-relaxed mb-5">{s.desc}</p>
                <ul className="space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-gray-600 text-[0.8125rem]">
                      <span className="w-1 h-1 rounded-full bg-teal mt-[7px] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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

          {/* SVG Ecosystem Map */}
          <div className="reveal w-full overflow-x-auto">
            <svg viewBox="0 0 820 580" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[820px] mx-auto min-w-[580px]" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}>
              {/* ═══ OUTER ORBIT — Allies circle (animated rotation) ═══ */}
              <circle cx="410" cy="310" r="260" stroke="#c8c5c1" strokeWidth="1.5" strokeDasharray="6 5" fill="none" className="eco-orbit" />
              {/* Secondary inner orbit ring */}
              <circle cx="410" cy="310" r="220" stroke="#d1cfcc" strokeWidth="0.8" strokeDasharray="3 7" fill="none" className="eco-orbit" style={{ animationDirection: "reverse", animationDuration: "35s" }} />
              <text x="410" y="575" textAnchor="middle" fill="#d1cfcc" fontSize="8" fontWeight="600" letterSpacing="2">ECOSISTEMA DE ALIADOS TECNOLÓGICOS</text>

              {/* Small decorative orbit dots */}
              <circle cx="220" cy="130" r="3" fill="#c8c5c1" className="eco-node-pulse" />
              <circle cx="630" cy="155" r="3" fill="#c8c5c1" className="eco-node-pulse-delay1" />
              <circle cx="160" cy="450" r="3" fill="#c8c5c1" className="eco-node-pulse-delay2" />
              <circle cx="690" cy="480" r="3" fill="#c8c5c1" className="eco-node-pulse" />

              {/* Connection lines (animated dash flow) */}
              <line x1="340" y1="95" x2="270" y2="210" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4" className="eco-dash-flow" />
              <line x1="480" y1="95" x2="550" y2="210" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow-slow" />
              <line x1="410" y1="95" x2="410" y2="355" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.35" className="eco-dash-flow" />

              {/* ═══ INPLUX — Top center ═══ */}
              <g className="eco-glow">
                <rect x="310" y="24" width="200" height="68" rx="14" fill="#1a1918" />
                <text x="410" y="55" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" letterSpacing="3">INPLUX</text>
                <text x="410" y="74" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontWeight="600" letterSpacing="1.5">HUB DE IA & TIC</text>
              </g>

              {/* ═══ TRIBAI — Left, under umbrella ═══ */}
              <g className="eco-float">
                <rect x="138" y="195" width="230" height="106" rx="12" fill="white" stroke="#0d7d74" strokeWidth="1.5" />
                <rect x="139" y="195" width="228" height="26" rx="12" fill="#e8f5f3" />
                <text x="163" y="213" fill="#0d7d74" fontSize="8.5" fontWeight="700" letterSpacing="1.5">SECTOR PRIVADO</text>
                <circle cx="343" cy="208" r="6" fill="#0d7d74" />
                <text x="343" y="211" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">&#10003;</text>
                <text x="253" y="246" textAnchor="middle" fill="#1a1918" fontSize="17" fontWeight="700">Tribai</text>
                <text x="253" y="264" textAnchor="middle" fill="#0d7d74" fontSize="10.5" fontWeight="500">tribai.co</text>
                <text x="253" y="284" textAnchor="middle" fill="#8a8784" fontSize="9">Inteligencia tributaria con IA</text>
              </g>

              {/* ═══ SECTOR PÚBLICO — Right, under umbrella ═══ */}
              <g className="eco-float-delay">
                <rect x="452" y="195" width="230" height="106" rx="12" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <rect x="453" y="195" width="228" height="26" rx="12" fill="#f3f1ee" />
                <text x="477" y="213" fill="#8a8784" fontSize="8.5" fontWeight="700" letterSpacing="1.5">SECTOR PÚBLICO</text>
                <text x="567" y="246" textAnchor="middle" fill="#1a1918" fontSize="17" fontWeight="700">Sector Público</text>
                <text x="567" y="264" textAnchor="middle" fill="#8a8784" fontSize="10.5" fontWeight="500">Próximamente</text>
                <text x="567" y="284" textAnchor="middle" fill="#8a8784" fontSize="9">Gemelo digital & rendición de cuentas</text>
              </g>

              {/* ═══ FOURIER — Center, inside orbit, prominent ═══ */}
              <g className="eco-glow">
                <rect x="280" y="355" width="260" height="86" rx="14" fill="white" stroke="#0d7d74" strokeWidth="2" />
                <rect x="281" y="355" width="258" height="24" rx="14" fill="#e8f5f3" />
                <text x="305" y="372" fill="#0d7d74" fontSize="8" fontWeight="700" letterSpacing="1.5">BACK TECNOLÓGICO PRINCIPAL</text>
                <text x="410" y="400" textAnchor="middle" fill="#1a1918" fontSize="18" fontWeight="800" letterSpacing="0.5">Fourier</text>
                <text x="410" y="418" textAnchor="middle" fill="#0d7d74" fontSize="10.5" fontWeight="500">fourier.dev</text>
                <text x="410" y="434" textAnchor="middle" fill="#8a8784" fontSize="8.5">Arquitectura de software, cloud e infraestructura</text>
              </g>

              {/* ═══ Allies on the orbit circle ═══ */}
              {/* Think IT */}
              <g className="eco-float-delay2">
                <rect x="52" y="365" width="150" height="52" rx="10" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <text x="127" y="389" textAnchor="middle" fill="#3d3b39" fontSize="11" fontWeight="600">Think IT</text>
                <text x="127" y="405" textAnchor="middle" fill="#a8a5a0" fontSize="8.5">Ingeniería de software</text>
              </g>
              <circle cx="152" cy="347" r="4" fill="#0d7d74" opacity="0.5" className="eco-node-pulse" />
              <line x1="152" y1="351" x2="140" y2="365" stroke="#c8c5c1" strokeWidth="1.5" />

              {/* Big Bang Data */}
              <g className="eco-float">
                <rect x="335" y="480" width="150" height="52" rx="10" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <text x="410" y="504" textAnchor="middle" fill="#3d3b39" fontSize="11" fontWeight="600">Big Bang Data</text>
                <text x="410" y="520" textAnchor="middle" fill="#a8a5a0" fontSize="8.5">Analítica de datos</text>
              </g>
              <circle cx="410" cy="570" r="4" fill="#0d7d74" opacity="0.5" className="eco-node-pulse-delay1" />
              <line x1="410" y1="566" x2="410" y2="532" stroke="#c8c5c1" strokeWidth="1.5" />

              {/* Alianza IT */}
              <g className="eco-float-delay">
                <rect x="618" y="365" width="150" height="52" rx="10" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <text x="693" y="389" textAnchor="middle" fill="#3d3b39" fontSize="11" fontWeight="600">Alianza IT</text>
                <text x="693" y="405" textAnchor="middle" fill="#a8a5a0" fontSize="8.5">Integración tecnológica</text>
              </g>
              <circle cx="668" cy="347" r="4" fill="#0d7d74" opacity="0.5" className="eco-node-pulse-delay2" />
              <line x1="668" y1="351" x2="680" y2="365" stroke="#c8c5c1" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Platform details below SVG */}
          <div className="grid md:grid-cols-2 gap-5 mt-12 stagger">
            {HUB_COMPANIES.map((c) => (
              <div key={c.name} className="reveal card">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[0.6875rem] font-bold tracking-[0.12em] uppercase text-gray-400">{c.focus}</span>
                  <span className={`text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full ${c.status === "Activo" ? "bg-teal-soft text-teal" : "bg-warm-50 text-gray-500"}`}>{c.status}</span>
                </div>
                <h3 className="font-serif text-[1.35rem] md:text-[1.5rem] text-ink mb-1">{c.name}</h3>
                <p className="text-teal text-sm font-medium mb-3">{c.domain}</p>
                <p className="text-gray-500 text-[0.875rem] leading-relaxed">{c.desc}</p>
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

      {/* ──── TIMELINE (VERTICAL) ──── */}
      <section id="trayectoria" className="py-20 md:py-28 bg-warm">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="reveal mb-14">
            <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Trayectoria</p>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-lg">
              25 años de <em className="italic">transformaciones</em>
            </h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[22px] md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
            <div className="space-y-0">
              {TIMELINE_EVENTS.map((ev, i) => (
                <div key={ev.year} className={`reveal relative flex items-start gap-6 md:gap-0 pb-8 last:pb-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Content */}
                  <div className={`flex-1 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                    <span className="font-serif text-xl md:text-2xl text-ink block mb-0.5">{ev.year}</span>
                    <p className="text-gray-500 text-[0.8125rem] leading-relaxed">{ev.text}</p>
                  </div>
                  {/* Node */}
                  <div className="absolute left-[16px] md:left-1/2 md:-translate-x-1/2 top-1 z-10">
                    <div className={`w-[13px] h-[13px] rounded-full border-2 ${i === TIMELINE_EVENTS.length - 1 ? "border-teal bg-teal" : "border-gray-300 bg-white"} transition-all`} />
                  </div>
                  {/* Spacer for the other side (desktop) */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──── MANIFESTO ──── */}
      <section id="nosotros" className="py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          {/* Manifesto Header */}
          <div className="reveal mb-14 text-center">
            <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Manifiesto</p>
            <h2 className="font-serif text-[2.25rem] md:text-[3rem] lg:text-[3.5rem] leading-[1.08] tracking-[-0.02em] text-ink mb-6 max-w-[700px] mx-auto">
              Tributaristas que <em className="italic">escriben código</em>
            </h2>
          </div>

          {/* Animated Manifesto SVG */}
          <div className="reveal w-full mb-16">
            <svg viewBox="0 0 900 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[900px] mx-auto" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}>
              {/* Background grid dots */}
              {Array.from({ length: 15 }).map((_, row) =>
                Array.from({ length: 25 }).map((_, col) => (
                  <circle key={`dot-${row}-${col}`} cx={36 * col + 18} cy={28 * row + 10} r="0.6" fill="#e5e3e0" />
                ))
              )}

              {/* Flowing connection line through all nodes */}
              <path
                d="M 90 200 C 180 200, 220 200, 290 200 S 400 200, 450 200 S 560 200, 610 200 S 720 200, 810 200"
                stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="6 4" fill="none" opacity="0.35" className="eco-dash-flow"
              />
              {/* Secondary flowing lines */}
              <path
                d="M 90 200 C 200 140, 300 260, 450 200 S 600 140, 810 200"
                stroke="#c8c5c1" strokeWidth="1" strokeDasharray="4 6" fill="none" opacity="0.4" className="eco-dash-flow-slow"
              />

              {/* ═══ NODE 1: NORMA ═══ */}
              <g className="eco-float">
                <circle cx="90" cy="200" r="52" fill="white" stroke="#e5e3e0" strokeWidth="1" />
                <circle cx="90" cy="200" r="52" fill="none" stroke="#0d7d74" strokeWidth="2" strokeDasharray="8 200" className="eco-orbit" style={{ animationDuration: "12s" }} />
                <text x="90" y="190" textAnchor="middle" fill="#1a1918" fontSize="13" fontWeight="700">NORMA</text>
                <text x="90" y="206" textAnchor="middle" fill="#8a8784" fontSize="8.5">Estatuto tributario</text>
                <text x="90" y="218" textAnchor="middle" fill="#8a8784" fontSize="8.5">NIC/NIIF · 44 estatutos</text>
              </g>
              <circle cx="90" cy="200" r="4" fill="#0d7d74" opacity="0.6" className="eco-node-pulse" />

              {/* ═══ NODE 2: DATO ═══ */}
              <g className="eco-float-delay">
                <circle cx="330" cy="200" r="52" fill="white" stroke="#e5e3e0" strokeWidth="1" />
                <circle cx="330" cy="200" r="52" fill="none" stroke="#0d7d74" strokeWidth="2" strokeDasharray="8 200" className="eco-orbit" style={{ animationDuration: "15s", animationDirection: "reverse" }} />
                <text x="330" y="190" textAnchor="middle" fill="#1a1918" fontSize="13" fontWeight="700">DATO</text>
                <text x="330" y="206" textAnchor="middle" fill="#8a8784" fontSize="8.5">+50 municipios</text>
                <text x="330" y="218" textAnchor="middle" fill="#8a8784" fontSize="8.5">DNP · Contraloría · CIAS</text>
              </g>
              <circle cx="330" cy="200" r="4" fill="#0d7d74" opacity="0.6" className="eco-node-pulse-delay1" />

              {/* ═══ NODE 3: ALGORITMO ═══ */}
              <g className="eco-float">
                <circle cx="570" cy="200" r="52" fill="white" stroke="#e5e3e0" strokeWidth="1" />
                <circle cx="570" cy="200" r="52" fill="none" stroke="#0d7d74" strokeWidth="2" strokeDasharray="8 200" className="eco-orbit" style={{ animationDuration: "18s" }} />
                <text x="570" y="186" textAnchor="middle" fill="#1a1918" fontSize="13" fontWeight="700">ALGORITMO</text>
                <text x="570" y="202" textAnchor="middle" fill="#8a8784" fontSize="8.5">RAG · IA neuro-simbólica</text>
                <text x="570" y="214" textAnchor="middle" fill="#8a8784" fontSize="8.5">Gemelos digitales</text>
              </g>
              <circle cx="570" cy="200" r="4" fill="#0d7d74" opacity="0.6" className="eco-node-pulse-delay2" />

              {/* ═══ NODE 4: IMPACTO ═══ */}
              <g className="eco-float-delay">
                <circle cx="810" cy="200" r="52" fill="#1a1918" stroke="none" />
                <circle cx="810" cy="200" r="52" fill="none" stroke="#0d7d74" strokeWidth="2.5" strokeDasharray="10 200" className="eco-orbit" style={{ animationDuration: "10s", animationDirection: "reverse" }} />
                <text x="810" y="190" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">IMPACTO</text>
                <text x="810" y="206" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="8.5">Productos, no horas</text>
                <text x="810" y="218" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="8.5">Resultados medibles</text>
              </g>
              <circle cx="810" cy="200" r="5" fill="#0d7d74" className="eco-node-pulse" />

              {/* Arrow indicators between nodes */}
              <polygon points="148,197 155,200 148,203" fill="#0d7d74" opacity="0.5" className="eco-float" />
              <polygon points="388,197 395,200 388,203" fill="#0d7d74" opacity="0.5" className="eco-float-delay" />
              <polygon points="628,197 635,200 628,203" fill="#0d7d74" opacity="0.5" className="eco-float-delay2" />

              {/* Top manifesto phrases */}
              <text x="210" y="115" textAnchor="middle" fill="#a8a5a0" fontSize="9" fontWeight="600" letterSpacing="1.5" className="eco-float">CONOCIMIENTO FISCAL</text>
              <line x1="90" y1="148" x2="210" y2="122" stroke="#e5e3e0" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="330" y1="148" x2="210" y2="122" stroke="#e5e3e0" strokeWidth="0.8" strokeDasharray="3 3" />

              <text x="690" y="115" textAnchor="middle" fill="#a8a5a0" fontSize="9" fontWeight="600" letterSpacing="1.5" className="eco-float-delay">TECNOLOGÍA DE FRONTERA</text>
              <line x1="570" y1="148" x2="690" y2="122" stroke="#e5e3e0" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="810" y1="148" x2="690" y2="122" stroke="#e5e3e0" strokeWidth="0.8" strokeDasharray="3 3" />

              {/* Bottom bar — manifesto text */}
              <rect x="150" y="310" width="600" height="56" rx="28" fill="#f8f8f7" stroke="#e5e3e0" strokeWidth="1" />
              <text x="450" y="335" textAnchor="middle" fill="#3d3b39" fontSize="11" fontWeight="600" letterSpacing="0.5">Donde la norma se encuentra con el algoritmo.</text>
              <text x="450" y="352" textAnchor="middle" fill="#a8a5a0" fontSize="9">25 años de expertise fiscal → ejecutados con IA y automatización</text>

              {/* Decorative pulsing dots */}
              <circle cx="50" cy="80" r="2" fill="#0d7d74" opacity="0.2" className="eco-node-pulse" />
              <circle cx="860" cy="320" r="2" fill="#0d7d74" opacity="0.2" className="eco-node-pulse-delay1" />
              <circle cx="450" cy="60" r="2" fill="#0d7d74" opacity="0.2" className="eco-node-pulse-delay2" />
              <circle cx="30" cy="350" r="2" fill="#c8c5c1" opacity="0.3" className="eco-node-pulse-delay1" />
              <circle cx="870" cy="80" r="2" fill="#c8c5c1" opacity="0.3" className="eco-node-pulse" />
            </svg>
          </div>

          {/* Manifesto text — 3 punchy columns */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 stagger">
            <div className="reveal text-center md:text-left">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink text-white text-[0.75rem] font-bold mb-4">1</div>
              <h3 className="font-serif text-[1.15rem] text-ink mb-2 leading-snug">Primero la norma,<br /><em className="italic">después el código</em></h3>
              <p className="text-gray-500 text-[0.85rem] leading-relaxed">Nuestros modelos de IA se entrenan con 25 años de experiencia tributaria real. No con tutoriales de internet.</p>
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
                {[
                  { label: "Dirección", value: "Calle 23 # 43 A 66, Local 141\nMedellín, Antioquia" },
                  { label: "Teléfono", value: "(+57) 313 889 36 15" },
                  { label: "Email", value: "gerencia@inplux.co" },
                ].map((item) => (
                  <div key={item.label}>
                    <span className="text-gray-400 text-[0.6875rem] font-bold tracking-[0.1em] uppercase block mb-0.5">{item.label}</span>
                    <span className="text-gray-700 text-[0.9375rem] whitespace-pre-line">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal">
              <div className="bg-white border border-border rounded-xl p-6 md:p-7">
                <h3 className="text-ink font-semibold text-[1rem] mb-5">Enviar mensaje</h3>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-3.5">
                  <div>
                    <label className="text-gray-500 text-[0.6875rem] font-bold tracking-wider uppercase mb-1 block">Nombre</label>
                    <input type="text" placeholder="Su nombre" className="form-input" required />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-gray-500 text-[0.6875rem] font-bold tracking-wider uppercase mb-1 block">Email</label>
                      <input type="email" placeholder="correo@empresa.co" className="form-input" required />
                    </div>
                    <div>
                      <label className="text-gray-500 text-[0.6875rem] font-bold tracking-wider uppercase mb-1 block">Teléfono</label>
                      <input type="tel" placeholder="+57 3XX XXX XXXX" className="form-input" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-500 text-[0.6875rem] font-bold tracking-wider uppercase mb-1 block">Mensaje</label>
                    <textarea rows={4} placeholder="Cuéntenos sobre su proyecto..." className="form-input resize-none" required />
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
                  <li key={l.href}><a href={l.href} className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">{l.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-ink font-semibold text-[0.8125rem] mb-3.5">Ecosistema</h4>
              <ul className="space-y-2">
                <li><a href="https://tribai.co" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Tribai.co</a></li>
                <li><span className="text-gray-400 text-[0.8125rem]">Sector Público (pronto)</span></li>
                <li><a href="https://fourier.dev/en" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Fourier</a></li>
                <li><span className="text-gray-400 text-[0.8125rem]">Think IT</span></li>
                <li><span className="text-gray-400 text-[0.8125rem]">Big Bang Data</span></li>
                <li><span className="text-gray-400 text-[0.8125rem]">Alianza IT</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-ink font-semibold text-[0.8125rem] mb-3.5">Contacto</h4>
              <ul className="space-y-2 text-gray-500 text-[0.8125rem]">
                <li>Medellín, Antioquia</li>
                <li>(+57) 313 889 36 15</li>
                <li><a href="mailto:gerencia@inplux.co" className="hover:text-ink transition-colors">gerencia@inplux.co</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-400 text-[0.75rem]">&copy; {new Date().getFullYear()} INPLUX S.A.S. Todos los derechos reservados.</p>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ink transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
