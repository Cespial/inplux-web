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
    desc: "Estatuto tributario, NIC/NIIF, norma internacional de contabilidad en sus tres grupos. Declaraciones de renta, ICA, estructuración fiscal y cobro de cartera para los sectores público y privado.",
    features: ["Estatuto tributario e impuesto de renta", "Adopción NIC/NIIF (grupos 1, 2 y 3)", "Estructuración fiscal municipal y departamental", "44 estatutos tributarios coordinados para Antioquia"],
  },
  {
    tag: "02",
    title: "IA Neuro-simbólica & RAG",
    desc: "Sistemas de inteligencia artificial que combinan razonamiento simbólico con modelos de lenguaje. Vectorización de bases normativas, asistentes con citación de fuentes y retrieval augmented generation.",
    features: ["Asistentes tributarios con IA (Tribai)", "Vectorización y RAG sobre normativa colombiana", "Modelos neuro-simbólicos para consulta fiscal", "Integración con Pinecone, Supabase y LLMs"],
  },
  {
    tag: "03",
    title: "Gemelos Digitales & Gobernanza",
    desc: "Réplicas digitales de la gestión municipal. Integración de datos del DNP, ministerios y organismos de control en tableros centralizados para toma de decisiones en tiempo real.",
    features: ["Gemelo digital de municipios", "Rendición de cuentas automatizada (CIAS)", "Reportes a Contraloría y Contaduría", "Dashboards de seguimiento al plan de desarrollo"],
  },
  {
    tag: "04",
    title: "Hiperautomatización",
    desc: "Automatización de procesos financieros, contables y administrativos mediante agentes de IA, plataformas cloud e integración de sistemas ERP.",
    features: ["Calculadoras tributarias de precisión", "Automatización de declaraciones sugeridas", "Infraestructura cloud y plataformas ERP", "Agentes de IA para auditoría e interventoría"],
  },
];

const TIMELINE_EVENTS = [
  { year: "2000", text: "Inicio de asesoría contable al Hospital San Camilo de Lelis y al Municipio de Vegachí." },
  { year: "2002", text: "Expansión al Hospital San Vicente de Paúl de Pueblo Rico." },
  { year: "2004", text: "Reorganización financiera del Municipio de Segovia — primer gran hito." },
  { year: "2007", text: "Constitución de la ESP de Vegachí. Servicios a Yarumal, Valdivia, Yolombó, Andes." },
  { year: "2010", text: "Asesor tributario de Sistemas Aries — alianza estratégica que continúa hoy." },
  { year: "2014", text: "Estructuración contable de 5 asociaciones de municipios para el Ministerio del Interior." },
  { year: "2016", text: "Reestructuración de pasivos (Ley 550) del Municipio de Cisneros — proyecto de 7 años." },
  { year: "2019", text: "Coordinación de 44 estatutos tributarios para la Gobernación de Antioquia." },
  { year: "2021", text: "Asesoría al Municipio de Caucasia, una de las entidades de mayor complejidad." },
  { year: "2023", text: "Nace INPLUX S.A.S. como hub que integra consultoría, tecnología e inteligencia artificial." },
  { year: "2025", text: "Lanzamiento de Tribai.co — plataforma de inteligencia tributaria con IA. Desarrollo de soluciones para el sector público." },
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
  { src: "/logos/logo_300.png", alt: "Prodepaz" },
  { src: "/logos/logoedu.png", alt: "EDU" },
  { src: "/logos/navarro-ospina-logo.png", alt: "Navarro Ospina" },
  { src: "/logos/Think_It_Logo_Blanco.png", alt: "Think IT" },
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
            <p className="reveal text-white/50 text-[0.75rem] font-semibold tracking-[0.15em] uppercase mb-5">Hub de consultoría, tecnología e inteligencia artificial</p>
            <h1 className="reveal font-serif text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[5rem] leading-[1.05] tracking-[-0.02em] text-white mb-7">
              Convertimos complejidad en{" "}
              <em className="font-serif italic text-[#2BBCB3]">resultados</em>
            </h1>
            <p className="reveal text-white/65 text-lg md:text-[1.25rem] leading-[1.6] mb-10 max-w-[600px]">
              +25 años en inteligencia tributaria y financiera. Hoy aplicamos IA neuro-simbólica,
              gemelos digitales y automatización para transformar organizaciones públicas y privadas en Colombia.
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-3">
              <a href="#servicios" className="btn-hero-primary text-center">Ver capacidades</a>
              <a href="#contacto" className="btn-hero-ghost text-center">Agendar sesión</a>
            </div>
          </div>
        </div>
        {/* Fade to white */}
        <div className="relative z-10 h-24 hero-fade-bottom" />
      </section>

      {/* ──── LOGOS ──── */}
      <section className="py-12 md:py-14">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 mb-6">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14">
            <AnimatedNumber value="+25" label="Años de experiencia" />
            <AnimatedNumber value="+50" label="Municipios atendidos" />
            <AnimatedNumber value="+100" label="Proyectos ejecutados" />
            <AnimatedNumber value="6" label="Sectores de impacto" />
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
              25 años de expertise tributario combinados con las herramientas que están redefiniendo la gestión pública y privada.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 stagger">
            {SERVICES.map((s) => (
              <div key={s.title} className="reveal card group">
                <span className="text-gray-300 text-[0.75rem] font-bold tracking-[0.1em] mb-4 block">{s.tag}</span>
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
              Un hub de empresas de <em className="italic">tecnología y tributaria</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed">
              Bajo la sombrilla de Inplux operan plataformas propias y empresas aliadas
              que conforman nuestro back tecnológico y tributario.
            </p>
          </div>

          {/* SVG Ecosystem Map */}
          <div className="reveal w-full overflow-x-auto">
            <svg viewBox="0 0 900 520" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[900px] mx-auto min-w-[600px]" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}>
              {/* Connection lines — drawn first so they sit behind */}
              {/* INPLUX to Tribai */}
              <line x1="450" y1="90" x2="280" y2="200" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="6 4" />
              {/* INPLUX to Sector Público */}
              <line x1="450" y1="90" x2="620" y2="200" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="6 4" />
              {/* INPLUX to Fourier (thicker, prominent) */}
              <line x1="450" y1="90" x2="450" y2="340" stroke="#0d7d74" strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />
              {/* Fourier to allies */}
              <line x1="450" y1="380" x2="200" y2="460" stroke="#e5e3e0" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="450" y1="380" x2="450" y2="460" stroke="#e5e3e0" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="450" y1="380" x2="700" y2="460" stroke="#e5e3e0" strokeWidth="1" strokeDasharray="4 4" />

              {/* ═══ INPLUX — Top center ═══ */}
              <rect x="340" y="24" width="220" height="68" rx="12" fill="#1a1918" />
              <text x="450" y="58" textAnchor="middle" fill="white" fontSize="15" fontWeight="700" letterSpacing="3">INPLUX</text>
              <text x="450" y="78" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontWeight="500" letterSpacing="1.5">HUB DE CONSULTORÍA & TECNOLOGÍA</text>

              {/* ═══ TRIBAI — Left branch ═══ */}
              <rect x="160" y="180" width="240" height="110" rx="12" fill="white" stroke="#0d7d74" strokeWidth="1.5" />
              <rect x="161" y="180" width="238" height="28" rx="12" fill="#e8f5f3" />
              <text x="185" y="199" fill="#0d7d74" fontSize="9" fontWeight="700" letterSpacing="1.5">SECTOR PRIVADO</text>
              <circle cx="375" cy="194" r="6" fill="#0d7d74" />
              <text x="375" y="197" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">&#10003;</text>
              <text x="280" y="232" textAnchor="middle" fill="#1a1918" fontSize="18" fontWeight="700">Tribai</text>
              <text x="280" y="250" textAnchor="middle" fill="#0d7d74" fontSize="11" fontWeight="500">tribai.co</text>
              <text x="280" y="272" textAnchor="middle" fill="#8a8784" fontSize="9.5">Inteligencia tributaria con IA</text>

              {/* ═══ SECTOR PÚBLICO — Right branch ═══ */}
              <rect x="500" y="180" width="240" height="110" rx="12" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
              <rect x="501" y="180" width="238" height="28" rx="12" fill="#f3f1ee" />
              <text x="525" y="199" fill="#8a8784" fontSize="9" fontWeight="700" letterSpacing="1.5">SECTOR PÚBLICO</text>
              <rect x="700" y="188" width="24" height="14" rx="7" fill="#f3f1ee" stroke="#d1cfcc" strokeWidth="1" />
              <text x="712" y="198" textAnchor="middle" fill="#a8a5a0" fontSize="7" fontWeight="600">...</text>
              <text x="620" y="232" textAnchor="middle" fill="#1a1918" fontSize="18" fontWeight="700">Sector Público</text>
              <text x="620" y="250" textAnchor="middle" fill="#8a8784" fontSize="11" fontWeight="500">Próximamente</text>
              <text x="620" y="272" textAnchor="middle" fill="#8a8784" fontSize="9.5">Gemelo digital & rendición de cuentas</text>

              {/* ═══ FOURIER — Center, prominent ═══ */}
              <rect x="310" y="335" width="280" height="90" rx="14" fill="white" stroke="#0d7d74" strokeWidth="2" />
              <rect x="311" y="335" width="278" height="26" rx="14" fill="#e8f5f3" />
              <text x="335" y="353" fill="#0d7d74" fontSize="8.5" fontWeight="700" letterSpacing="1.5">BACK TECNOLÓGICO PRINCIPAL</text>
              <text x="450" y="383" textAnchor="middle" fill="#1a1918" fontSize="19" fontWeight="800" letterSpacing="0.5">Fourier</text>
              <text x="450" y="402" textAnchor="middle" fill="#0d7d74" fontSize="11" fontWeight="500">fourier.dev</text>
              <text x="450" y="416" textAnchor="middle" fill="#8a8784" fontSize="9">Arquitectura de software, cloud e infraestructura</text>

              {/* ═══ Allied companies — Bottom row ═══ */}
              {/* Think IT */}
              <rect x="100" y="448" width="200" height="56" rx="10" fill="white" stroke="#e5e3e0" strokeWidth="1" />
              <text x="200" y="474" textAnchor="middle" fill="#3d3b39" fontSize="12" fontWeight="600">Think IT</text>
              <text x="200" y="492" textAnchor="middle" fill="#a8a5a0" fontSize="9">Ingeniería de software</text>

              {/* Big Bang Data */}
              <rect x="350" y="448" width="200" height="56" rx="10" fill="white" stroke="#e5e3e0" strokeWidth="1" />
              <text x="450" y="474" textAnchor="middle" fill="#3d3b39" fontSize="12" fontWeight="600">Big Bang Data</text>
              <text x="450" y="492" textAnchor="middle" fill="#a8a5a0" fontSize="9">Analítica de datos</text>

              {/* Alianza IT */}
              <rect x="600" y="448" width="200" height="56" rx="10" fill="white" stroke="#e5e3e0" strokeWidth="1" />
              <text x="700" y="474" textAnchor="middle" fill="#3d3b39" fontSize="12" fontWeight="600">Alianza IT</text>
              <text x="700" y="492" textAnchor="middle" fill="#a8a5a0" fontSize="9">Integración tecnológica</text>

              {/* Decorative: small label */}
              <text x="450" y="516" textAnchor="middle" fill="#d1cfcc" fontSize="8" fontWeight="600" letterSpacing="2">EMPRESAS ALIADAS DEL ECOSISTEMA</text>
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

      {/* ──── HORIZONTAL TIMELINE ──── */}
      <section id="trayectoria" className="py-20 md:py-28 bg-warm">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="reveal mb-12">
            <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Trayectoria</p>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-lg">
              25 años de <em className="italic">transformaciones</em>
            </h2>
            <p className="text-gray-500 text-sm mb-1">Desliza para recorrer nuestra historia &rarr;</p>
          </div>
        </div>
        <div className="reveal timeline-scroll" ref={timelineRef}>
          <div className="timeline-track px-5 md:px-8 pb-4">
            {TIMELINE_EVENTS.map((ev) => (
              <div key={ev.year} className="timeline-segment">
                <div className="timeline-line" />
                <div className="timeline-node" />
                <div className="px-3 pt-2">
                  <span className="font-serif text-2xl md:text-3xl text-ink block mb-1">{ev.year}</span>
                  <p className="text-gray-500 text-[0.8125rem] leading-relaxed pr-4">{ev.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── ABOUT ──── */}
      <section id="nosotros" className="py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-14 md:gap-20 items-start">
            <div className="reveal-left">
              <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Sobre Inplux</p>
              <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-6">
                Tributaristas que <em className="italic">escriben código</em>
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-[1.65] mb-5">
                <strong className="text-ink font-semibold">INPLUX S.A.S.</strong> nació de 25 años asesorando la hacienda pública
                de más de 50 municipios, coordinando 44 estatutos tributarios para la Gobernación de Antioquia
                y estructurando la contabilidad de hospitales, ESPs y asociaciones de municipios.
              </p>
              <p className="text-gray-500 text-[0.9375rem] leading-[1.65] mb-5">
                Hoy ese conocimiento fiscal profundo se ejecuta a través de inteligencia artificial.
                Construimos sistemas RAG sobre normativa colombiana, asistentes neuro-simbólicos
                para el estatuto tributario y gemelos digitales para la gestión municipal.
              </p>
              <p className="text-gray-500 text-[0.9375rem] leading-[1.65] mb-8">
                Operamos como hub junto a Think IT, Big Bang Data y Alianza IT.
                Entregamos productos, no horas. Plataformas como Tribai.co ya lo demuestran.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {["Medellín, Colombia", "+25 años tributaria", "IA & RAG", "Sector público & privado"].map((t) => (
                  <span key={t} className="text-[0.8125rem] font-medium text-gray-600 border border-border rounded-full px-4 py-1.5">{t}</span>
                ))}
              </div>
            </div>
            <div className="space-y-4 stagger">
              {[
                { label: "Misión", text: "Integrar consultoría tributaria de alto nivel con tecnología de frontera — IA, automatización y gemelos digitales — para generar impacto medible en organizaciones públicas y privadas." },
                { label: "Visión", text: "Ser el referente en Colombia en la intersección entre inteligencia tributaria y tecnología. Donde la norma se encuentra con el algoritmo." },
                { label: "Compromiso", text: "Equipo profesional, ético y transparente. Productos sobre horas. Resultados sobre promesas." },
              ].map((c) => (
                <div key={c.label} className="reveal border border-border rounded-xl p-5 transition-all duration-300 hover:shadow-sm hover:border-gray-200">
                  <h3 className="text-ink text-[0.8125rem] font-bold tracking-[0.08em] uppercase mb-2">{c.label}</h3>
                  <p className="text-gray-500 text-[0.9rem] leading-relaxed">{c.text}</p>
                </div>
              ))}
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
                ¿Necesita estructurar su hacienda pública, automatizar procesos tributarios o construir un producto digital? Conversemos.
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
