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
   SVG SERVICE ILLUSTRATIONS
   ═══════════════════════════════════════ */
function SvgFinance() {
  return (
    <svg viewBox="0 0 200 120" fill="none" className="w-full h-28">
      <rect x="20" y="60" width="24" height="50" rx="3" fill="#e8e6e3" />
      <rect x="56" y="42" width="24" height="68" rx="3" fill="#d1cfcc" />
      <rect x="92" y="26" width="24" height="84" rx="3" fill="#a8a5a0" />
      <rect x="128" y="10" width="24" height="100" rx="3" fill="#1a1918" />
      <path d="M32 58L68 40L104 24L140 8" stroke="#0d7d74" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="58" r="4" fill="white" stroke="#0d7d74" strokeWidth="2" />
      <circle cx="68" cy="40" r="4" fill="white" stroke="#0d7d74" strokeWidth="2" />
      <circle cx="104" cy="24" r="4" fill="white" stroke="#0d7d74" strokeWidth="2" />
      <circle cx="140" cy="8" r="4" fill="#0d7d74" />
      <line x1="164" y1="10" x2="164" y2="110" stroke="#e8e6e3" strokeWidth="1" strokeDasharray="3 3" />
      <text x="164" y="118" textAnchor="middle" fontSize="8" fill="#a8a5a0" fontFamily="system-ui">META</text>
    </svg>
  );
}

function SvgDigital() {
  return (
    <svg viewBox="0 0 200 120" fill="none" className="w-full h-28">
      <rect x="16" y="10" width="168" height="86" rx="8" stroke="#d1cfcc" strokeWidth="1.5" />
      <rect x="16" y="10" width="168" height="16" rx="8" fill="#f3f1ee" />
      <circle cx="30" cy="18" r="3" fill="#e8e6e3" />
      <circle cx="40" cy="18" r="3" fill="#e8e6e3" />
      <circle cx="50" cy="18" r="3" fill="#e8e6e3" />
      <rect x="30" y="36" width="60" height="4" rx="2" fill="#e8e6e3" />
      <rect x="30" y="46" width="44" height="4" rx="2" fill="#f3f1ee" />
      <rect x="30" y="56" width="52" height="4" rx="2" fill="#e8e6e3" />
      <rect x="30" y="66" width="36" height="4" rx="2" fill="#f3f1ee" />
      <rect x="110" y="36" width="56" height="44" rx="6" fill="#e8f5f3" />
      <path d="M128 52l8 8 14-18" stroke="#0d7d74" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="72" y="102" width="56" height="8" rx="3" fill="#f3f1ee" />
      <line x1="100" y1="96" x2="100" y2="102" stroke="#e8e6e3" strokeWidth="1.5" />
    </svg>
  );
}

function SvgOrg() {
  return (
    <svg viewBox="0 0 200 120" fill="none" className="w-full h-28">
      <circle cx="100" cy="22" r="16" stroke="#1a1918" strokeWidth="1.5" />
      <circle cx="100" cy="22" r="7" fill="#1a1918" />
      <line x1="100" y1="38" x2="100" y2="56" stroke="#d1cfcc" strokeWidth="1.5" />
      <line x1="100" y1="56" x2="48" y2="72" stroke="#d1cfcc" strokeWidth="1.5" />
      <line x1="100" y1="56" x2="152" y2="72" stroke="#d1cfcc" strokeWidth="1.5" />
      <circle cx="48" cy="80" r="14" stroke="#d1cfcc" strokeWidth="1.5" />
      <circle cx="48" cy="80" r="6" fill="#e8f5f3" stroke="#0d7d74" strokeWidth="1.5" />
      <circle cx="152" cy="80" r="14" stroke="#d1cfcc" strokeWidth="1.5" />
      <circle cx="152" cy="80" r="6" fill="#e8f5f3" stroke="#0d7d74" strokeWidth="1.5" />
      <rect x="28" y="102" width="40" height="8" rx="4" fill="#f3f1ee" />
      <rect x="132" y="102" width="40" height="8" rx="4" fill="#f3f1ee" />
    </svg>
  );
}

function SvgComms() {
  return (
    <svg viewBox="0 0 200 120" fill="none" className="w-full h-28">
      <rect x="12" y="14" width="88" height="56" rx="10" stroke="#1a1918" strokeWidth="1.5" />
      <rect x="26" y="28" width="48" height="4" rx="2" fill="#d1cfcc" />
      <rect x="26" y="38" width="60" height="4" rx="2" fill="#e8e6e3" />
      <rect x="26" y="48" width="36" height="4" rx="2" fill="#d1cfcc" />
      <path d="M12 62l24 18V62H12z" fill="#1a1918" />
      <rect x="100" y="40" width="84" height="52" rx="10" stroke="#0d7d74" strokeWidth="1.5" />
      <rect x="114" y="54" width="40" height="4" rx="2" fill="#0d7d74" opacity="0.25" />
      <rect x="114" y="64" width="56" height="4" rx="2" fill="#0d7d74" opacity="0.15" />
      <rect x="114" y="74" width="32" height="4" rx="2" fill="#0d7d74" opacity="0.25" />
      <circle cx="170" cy="28" r="12" fill="#e8f5f3" />
      <path d="M165 28l4 4 7-8" stroke="#0d7d74" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   DATA
   ═══════════════════════════════════════ */
const SERVICES = [
  { title: "Consultoría Estratégica y Financiera", desc: "Estructuramos la inteligencia financiera de su organización para convertirla en el motor de las decisiones estratégicas y el crecimiento sostenible.", features: ["Gestión financiera, contable y tributaria", "Planificación estratégica y del desarrollo", "Optimización fiscal y cobro de cartera"], svg: <SvgFinance /> },
  { title: "Soluciones de Transformación Digital", desc: "Diseñamos y construimos los ecosistemas digitales que su organización necesita para operar con mayor eficiencia y generar ventajas competitivas.", features: ["Plataformas de IA e inteligencia tributaria", "Infraestructura cloud y plataformas ERP", "Inteligencia de negocios, automatización e IoT"], svg: <SvgDigital /> },
  { title: "Optimización Organizacional", desc: "La estrategia solo genera valor a través de una ejecución impecable. Alineamos procesos, equipos y proyectos para resultados extraordinarios.", features: ["Gerencia de proyectos de alto impacto", "Auditoría e interventoría técnica", "Modernización y talento humano"], svg: <SvgOrg /> },
  { title: "Gestión Institucional y Comunicaciones", desc: "Construimos la narrativa y los canales para fortalecer la reputación y la confianza en su organización.", features: ["Modelos de gestión y gobernanza", "Comunicación estratégica", "Eventos y foros sectoriales"], svg: <SvgComms /> },
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
    desc: "Plataforma de inteligencia tributaria para contadores colombianos. +1.294 artículos indexados, 35 calculadoras de precisión y asistente IA con citación de fuentes. Declaraciones de renta sugeridas y herramientas de consulta automatizada.",
    status: "Activo",
  },
  {
    name: "Sector Público",
    domain: "Próximamente",
    focus: "Sector Público",
    desc: "Plataforma de rendición de cuentas y gemelo digital para municipios. Integra datos de múltiples fuentes (DNP, ministerios, organismos de control) en un tablero centralizado. Automatiza reportes a la Contraloría, Contaduría y entidades CIAS.",
    status: "En desarrollo",
  },
];

const ECOSYSTEM = [
  { name: "Think IT", role: "Ingeniería de software y consultoría tecnológica" },
  { name: "Big Bang Data", role: "Analítica de datos y soluciones de información" },
  { name: "Alianza IT", role: "Integración tecnológica y servicios TI" },
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
      <section id="inicio" className="relative pt-[60px]">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-24 md:py-36">
          <div className="max-w-[720px]">
            <p className="reveal text-gray-400 text-[0.75rem] font-semibold tracking-[0.15em] uppercase mb-5">Hub de consultoría, tecnología e inteligencia artificial</p>
            <h1 className="reveal font-serif text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[5rem] leading-[1.05] tracking-[-0.02em] text-ink mb-7">
              Convertimos complejidad en{" "}
              <em className="font-serif italic text-teal">resultados</em>
            </h1>
            <p className="reveal text-gray-500 text-lg md:text-[1.25rem] leading-[1.6] mb-10 max-w-[600px]">
              Más de 25 años integrando inteligencia financiera, consultoría tributaria y
              transformación digital para organizaciones públicas y privadas en Colombia.
              Expertos en inteligencia artificial aplicada al sector tributario y de gobierno.
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-3">
              <a href="#servicios" className="btn-dark text-center">Explorar servicios</a>
              <a href="#contacto" className="btn-ghost text-center">Agendar sesión estratégica</a>
            </div>
          </div>
        </div>
        <div className="fine-rule" />
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
            <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Servicios</p>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-lg">
              No ofrecemos servicios.<br /><em className="italic">Construimos capacidades.</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-lg leading-relaxed">
              Integramos inteligencia financiera, poder tecnológico e inteligencia artificial para diseñar, acelerar y escalar el futuro de su organización.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 stagger">
            {SERVICES.map((s) => (
              <div key={s.title} className="reveal card group">
                <div className="mb-5 opacity-70 group-hover:opacity-100 transition-opacity duration-300">{s.svg}</div>
                <h3 className="font-serif text-[1.2rem] md:text-[1.35rem] text-ink mb-2 leading-snug">{s.title}</h3>
                <p className="text-gray-500 text-[0.9rem] leading-relaxed mb-4">{s.desc}</p>
                <ul className="space-y-1.5">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-gray-600 text-[0.8125rem]">
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
              Inplux es la sombrilla que coordina un grupo de profesionales y empresas especializadas
              en TI, inteligencia artificial y consultoría tributaria. Nuestras plataformas insignia
              atienden al sector privado y público con soluciones a la medida.
            </p>
          </div>

          {/* Flagship Platforms */}
          <div className="grid md:grid-cols-2 gap-5 stagger mb-10">
            {HUB_COMPANIES.map((c) => (
              <div key={c.name} className="reveal card">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[0.6875rem] font-bold tracking-[0.12em] uppercase text-gray-400">{c.focus}</span>
                  <span className={`text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full ${c.status === "Activo" ? "bg-teal-soft text-teal" : "bg-warm-50 text-gray-500"}`}>{c.status}</span>
                </div>
                <h3 className="font-serif text-[1.5rem] md:text-[1.75rem] text-ink mb-1">{c.name}</h3>
                <p className="text-teal text-sm font-medium mb-3">{c.domain}</p>
                <p className="text-gray-500 text-[0.9rem] leading-relaxed">{c.desc}</p>
                {c.status === "Activo" && (
                  <a href={`https://${c.domain}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink text-sm font-semibold mt-5 hover:text-teal transition-colors">
                    Visitar plataforma
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Ecosystem Companies */}
          <div className="reveal">
            <p className="text-gray-400 text-[0.6875rem] font-bold tracking-[0.12em] uppercase mb-4">Empresas aliadas del ecosistema</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {ECOSYSTEM.map((e) => (
                <div key={e.name} className="border border-border rounded-xl p-5 transition-all duration-300 hover:shadow-sm hover:border-gray-200">
                  <h4 className="text-ink font-semibold text-[0.9375rem] mb-1">{e.name}</h4>
                  <p className="text-gray-500 text-[0.8125rem] leading-relaxed">{e.role}</p>
                </div>
              ))}
            </div>
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
                Socios estratégicos que construyen <em className="italic">legados</em>
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-[1.65] mb-5">
                Somos <strong className="text-ink font-semibold">INPLUX S.A.S.</strong>, un hub que coordina un grupo de profesionales
                con experiencia en consultoría financiera, inteligencia tributaria, transformación digital e inteligencia artificial.
                Ayudamos a organizaciones líderes — públicas, mixtas y privadas — a resolver desafíos complejos.
              </p>
              <p className="text-gray-500 text-[0.9375rem] leading-[1.65] mb-5">
                Nuestro recorrido abarca asesorías a más de 50 municipios, empresas de tecnología,
                firmas de auditoría financiera multinacional y entidades del sector salud, educativo
                y de servicios públicos. Combinamos ese recorrido con capacidades de frontera
                en inteligencia artificial y desarrollo de software.
              </p>
              <p className="text-gray-500 text-[0.9375rem] leading-[1.65] mb-8">
                Hoy operamos como la sombrilla que conecta plataformas como Tribai.co, empresas
                aliadas como Think IT, Big Bang Data y Alianza IT, y un equipo profesional, ético y transparente
                dedicado a entregar productos — no horas — de la más alta calidad.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {["Medellín, Colombia", "+25 años", "Sector público & privado", "Expertos en IA"].map((t) => (
                  <span key={t} className="text-[0.8125rem] font-medium text-gray-600 border border-border rounded-full px-4 py-1.5">{t}</span>
                ))}
              </div>
            </div>
            <div className="space-y-4 stagger">
              {[
                { label: "Misión", text: "Acompañar a nuestros clientes en el logro de sus metas institucionales y empresariales, integrando servicios de consultoría de alta calidad con soluciones tecnológicas innovadoras que generan un impacto medible y sostenible." },
                { label: "Visión", text: "Ser el socio estratégico referente en Colombia por la entrega de soluciones integrales que, a través de la estrategia y la tecnología, potencien la gestión y competitividad de las organizaciones." },
                { label: "Compromiso", text: "Entregar servicios de la más alta calidad, apoyados en un equipo profesional, ético y transparente. Actuamos con eficacia, eficiencia y un profundo respeto hacia nuestros clientes. Trabajamos por productos, no por horas." },
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
                El futuro de su organización empieza con la próxima decisión estratégica. Contáctenos para agendar una sesión.
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
              <p className="text-gray-500 text-[0.8125rem] leading-relaxed max-w-[200px]">Hub de consultoría, tecnología e inteligencia artificial. Medellín, Colombia.</p>
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
