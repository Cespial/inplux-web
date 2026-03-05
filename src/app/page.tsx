"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════
   SCROLL REVEAL HOOK
   ═══════════════════════════════════════ */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal,.reveal-left,.draw-on-scroll,.stat-animate").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ═══════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════ */
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState("0");
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const num = parseInt(value.replace(/[^0-9]/g, ""));
          const prefix = value.startsWith("+") ? "+" : "";
          const duration = 1200;
          const start = performance.now();
          const step = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            setDisplay(prefix + Math.round(num * ease).toString());
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="stat-animate">
      <div className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-gray-950 mb-2">
        {display}
      </div>
      <div className="text-gray-500 text-sm md:text-base font-medium">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SVG ILLUSTRATIONS — hand-crafted style
   ═══════════════════════════════════════ */
function IllustrationFinance({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className}>
      <rect x="10" y="70" width="16" height="40" rx="2" fill="#e5e5e5" />
      <rect x="34" y="50" width="16" height="60" rx="2" fill="#d4d4d4" />
      <rect x="58" y="30" width="16" height="80" rx="2" fill="#b0b0b0" />
      <rect x="82" y="15" width="16" height="95" rx="2" fill="#171717" />
      <path d="M18 68L42 48L66 28L90 13" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="68" r="3.5" fill="#0d9488" />
      <circle cx="42" cy="48" r="3.5" fill="#0d9488" />
      <circle cx="66" cy="28" r="3.5" fill="#0d9488" />
      <circle cx="90" cy="13" r="3.5" fill="#0d9488" />
    </svg>
  );
}

function IllustrationDigital({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className}>
      <rect x="8" y="16" width="104" height="72" rx="6" stroke="#171717" strokeWidth="2" />
      <rect x="8" y="16" width="104" height="12" rx="6" fill="#f5f5f5" />
      <circle cx="18" cy="22" r="2.5" fill="#e5e5e5" />
      <circle cx="26" cy="22" r="2.5" fill="#e5e5e5" />
      <circle cx="34" cy="22" r="2.5" fill="#e5e5e5" />
      <rect x="20" y="38" width="36" height="3" rx="1.5" fill="#d4d4d4" />
      <rect x="20" y="46" width="28" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="20" y="54" width="42" height="3" rx="1.5" fill="#d4d4d4" />
      <rect x="20" y="62" width="20" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="72" y="38" width="28" height="36" rx="4" fill="#0d9488" opacity="0.12" />
      <path d="M80 50l6 6 10-12" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="40" y="96" width="40" height="8" rx="2" fill="#e5e5e5" />
      <line x1="60" y1="88" x2="60" y2="96" stroke="#d4d4d4" strokeWidth="2" />
    </svg>
  );
}

function IllustrationOrg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className}>
      <circle cx="60" cy="24" r="14" stroke="#171717" strokeWidth="2" />
      <circle cx="60" cy="24" r="6" fill="#171717" />
      <line x1="60" y1="38" x2="60" y2="58" stroke="#d4d4d4" strokeWidth="2" />
      <line x1="60" y1="58" x2="28" y2="72" stroke="#d4d4d4" strokeWidth="2" />
      <line x1="60" y1="58" x2="92" y2="72" stroke="#d4d4d4" strokeWidth="2" />
      <circle cx="28" cy="80" r="12" stroke="#171717" strokeWidth="2" />
      <circle cx="28" cy="80" r="5" fill="#0d9488" opacity="0.2" />
      <circle cx="28" cy="80" r="2.5" fill="#0d9488" />
      <circle cx="92" cy="80" r="12" stroke="#171717" strokeWidth="2" />
      <circle cx="92" cy="80" r="5" fill="#0d9488" opacity="0.2" />
      <circle cx="92" cy="80" r="2.5" fill="#0d9488" />
      <line x1="28" y1="92" x2="28" y2="108" stroke="#d4d4d4" strokeWidth="2" />
      <line x1="92" y1="92" x2="92" y2="108" stroke="#d4d4d4" strokeWidth="2" />
      <rect x="16" y="108" width="24" height="6" rx="3" fill="#e5e5e5" />
      <rect x="80" y="108" width="24" height="6" rx="3" fill="#e5e5e5" />
    </svg>
  );
}

function IllustrationComms({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className}>
      <rect x="8" y="20" width="64" height="48" rx="8" stroke="#171717" strokeWidth="2" />
      <rect x="18" y="32" width="32" height="3" rx="1.5" fill="#d4d4d4" />
      <rect x="18" y="40" width="44" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="18" y="48" width="24" height="3" rx="1.5" fill="#d4d4d4" />
      <path d="M8 60l20 16V60H8z" fill="#171717" />
      <rect x="52" y="52" width="56" height="40" rx="8" stroke="#0d9488" strokeWidth="2" />
      <rect x="62" y="64" width="28" height="3" rx="1.5" fill="#0d9488" opacity="0.3" />
      <rect x="62" y="72" width="36" height="3" rx="1.5" fill="#0d9488" opacity="0.2" />
      <rect x="62" y="80" width="20" height="3" rx="1.5" fill="#0d9488" opacity="0.3" />
      <circle cx="96" cy="16" r="10" fill="#0d9488" opacity="0.1" />
      <path d="M92 16l3 3 5-6" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   DATA
   ═══════════════════════════════════════ */
const SERVICES = [
  {
    title: "Consultoría Estratégica y Financiera",
    description: "Estructuramos la inteligencia financiera de su organización para convertirla en el motor de las decisiones estratégicas y el crecimiento sostenible.",
    features: ["Gestión financiera, contable y tributaria", "Planificación estratégica y del desarrollo", "Optimización fiscal y cobro de cartera"],
    illustration: <IllustrationFinance className="w-full h-32 md:h-36" />,
  },
  {
    title: "Soluciones de Transformación Digital",
    description: "Diseñamos y construimos los ecosistemas digitales que su organización necesita para operar con mayor eficiencia y generar ventajas competitivas.",
    features: ["Desarrollo de productos y ecosistemas digitales", "Infraestructura cloud y plataformas ERP", "Inteligencia de negocios, IA e IoT"],
    illustration: <IllustrationDigital className="w-full h-32 md:h-36" />,
  },
  {
    title: "Optimización Organizacional y de Proyectos",
    description: "La estrategia solo genera valor a través de una ejecución impecable. Alineamos sus procesos, equipos y proyectos para garantizar resultados extraordinarios.",
    features: ["Gerencia de proyectos de alto impacto", "Auditoría e interventoría técnica y financiera", "Modernización y talento humano"],
    illustration: <IllustrationOrg className="w-full h-32 md:h-36" />,
  },
  {
    title: "Gestión Institucional y Comunicaciones",
    description: "La buena gestión solo genera valor cuando se comunica de forma estratégica. Construimos la narrativa y los canales para fortalecer su reputación.",
    features: ["Modelos de gestión y gobernanza (MIPG)", "Comunicación estratégica y relacionamiento", "Producción de eventos y foros sectoriales"],
    illustration: <IllustrationComms className="w-full h-32 md:h-36" />,
  },
];

const TIMELINE = [
  { year: "2000", title: "Génesis", text: "Primeros contratos con el Hospital San Camilo de Lelis y el Municipio de Vegachí. Nace la visión de traducir complejidad en resultados." },
  { year: "2004", title: "Punto de inflexión", text: "Reorganización financiera del Municipio de Segovia. El proyecto que nos posicionó como expertos en desafíos complejos." },
  { year: "2014", title: "Escala nacional", text: "Estructuración contable de 5 asociaciones de municipios para el Ministerio del Interior. Arquitectura institucional a nivel regional." },
  { year: "2019", title: "Liderazgo departamental", text: "Coordinación de 44 estatutos tributarios para la Gobernación de Antioquia con un equipo de 18 profesionales." },
  { year: "2025", title: "Inplux S.A.S.", text: "Evolución hacia una firma que integra consultoría financiera con soluciones de transformación digital." },
];

const CLIENT_LOGOS = [
  { src: "/logos/21053_escudo-vegachi-pagina_200x200.png", alt: "Municipio de Vegachí" },
  { src: "/logos/47914_logo-alcaldia--300-x-100-1_200x200.png", alt: "Alcaldía" },
  { src: "/logos/54672_escudo-de-cisneros-antioquia-oficial-3x3_200x200.png", alt: "Municipio de Cisneros" },
  { src: "/logos/CIS.png", alt: "CIS" },
  { src: "/logos/Escudo.png", alt: "Escudo Municipal" },
  { src: "/logos/cropped-Logo_Alianza-IT-1.png", alt: "Alianza IT" },
  { src: "/logos/logo (1).png", alt: "Cliente" },
  { src: "/logos/logo-negro.png", alt: "Rotorr" },
  { src: "/logos/logo-think-oracle.png", alt: "Think Oracle" },
  { src: "/logos/logo.png", alt: "Sistemas Aries" },
  { src: "/logos/logo_300.png", alt: "Prodepaz" },
  { src: "/logos/logoedu.png", alt: "EDU" },
  { src: "/logos/navarro-ospina-logo.png", alt: "Navarro Ospina" },
];

/* ═══════════════════════════════════════
   PAGE
   ═══════════════════════════════════════ */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useScrollReveal();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navLinks = [
    { label: "Servicios", href: "#servicios" },
    { label: "Trayectoria", href: "#trayectoria" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <>
      {/* ──────── NAVIGATION ──────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 nav-wrap ${scrolled ? "scrolled" : ""}`}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-8 flex items-center justify-between h-[64px]">
          <a href="#inicio" className="font-display font-bold text-[1.3rem] tracking-tight text-gray-950">
            inplux
          </a>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-gray-500 hover:text-gray-900 text-[0.875rem] font-medium px-3.5 py-2 rounded-lg transition-colors">
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="#contacto" className="hidden md:inline-flex btn-dark text-sm !py-2 !px-5">
              Hablemos
            </a>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-900 p-2 cursor-pointer" aria-label="Menú">
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-5 py-3 border-t border-border bg-white space-y-1">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-gray-900 text-sm font-medium py-2.5 px-3 rounded-lg transition-colors">
                {l.label}
              </a>
            ))}
            <a href="#contacto" onClick={() => setMobileOpen(false)} className="block btn-dark text-sm text-center !py-2.5 mt-2">Hablemos</a>
          </div>
        </div>
      </nav>

      {/* ──────── HERO ──────── */}
      <section id="inicio" className="relative min-h-[90vh] flex items-center pt-[64px]">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="relative z-10 max-w-[1120px] mx-auto px-5 md:px-8 w-full py-20 md:py-28">
          <div className="max-w-[740px]">
            <p className="reveal text-gray-500 text-sm font-semibold tracking-[0.08em] uppercase mb-6">
              Consultoría estratégica & transformación digital
            </p>
            <h1 className="reveal font-display text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[4.5rem] font-bold leading-[1.06] tracking-[-0.03em] text-gray-950 mb-7">
              Convertimos complejidad en{" "}
              <span className="relative">
                resultados
                <svg className="absolute -bottom-1 left-0 w-full h-[6px]" viewBox="0 0 200 6" preserveAspectRatio="none">
                  <path d="M0 5C40 1 80 1 100 3C120 5 160 1 200 3" stroke="#0d9488" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="reveal text-gray-500 text-lg md:text-xl leading-relaxed mb-10 max-w-[600px]">
              Más de 25 años construyendo la estabilidad financiera y la modernización
              de organizaciones públicas y privadas en Colombia.
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-3.5">
              <a href="#servicios" className="btn-dark text-center">
                Explorar servicios
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <a href="#contacto" className="btn-ghost text-center">
                Agendar sesión estratégica
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── CLIENT LOGOS ──────── */}
      <section className="py-14 md:py-16 border-y border-border">
        <div className="max-w-[1120px] mx-auto px-5 md:px-8 mb-8">
          <p className="reveal text-center text-gray-400 text-xs font-semibold tracking-[0.1em] uppercase">
            Confían en nosotros
          </p>
        </div>
        <div className="reveal relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10" style={{ background: "linear-gradient(90deg, white, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10" style={{ background: "linear-gradient(270deg, white, transparent)" }} />
          <div className="logo-track">
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, i) => (
              <Image
                key={`${logo.alt}-${i}`}
                src={logo.src}
                alt={logo.alt}
                width={100}
                height={36}
                className="logo-item"
                style={{ objectFit: "contain", width: "auto" }}
                unoptimized
              />
            ))}
          </div>
        </div>
      </section>

      {/* ──────── STATS ──────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
            <AnimatedStat value="+25" label="Años de experiencia" />
            <AnimatedStat value="+50" label="Municipios atendidos" />
            <AnimatedStat value="+100" label="Proyectos ejecutados" />
            <AnimatedStat value="6" label="Sectores de impacto" />
          </div>
        </div>
      </section>

      {/* ──────── SERVICES ──────── */}
      <section id="servicios" className="py-20 md:py-28 bg-alt">
        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
          <div className="reveal mb-14 md:mb-18">
            <p className="text-teal text-xs font-semibold tracking-[0.1em] uppercase mb-3">Servicios</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.02em] leading-tight text-gray-950 mb-4 max-w-xl">
              No ofrecemos servicios. Construimos capacidades.
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed">
              Integramos inteligencia financiera y poder tecnológico para diseñar, acelerar y escalar el futuro de su organización.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 stagger">
            {SERVICES.map((s) => (
              <div key={s.title} className="reveal service-card group">
                <div className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                  {s.illustration}
                </div>
                <h3 className="font-display text-lg md:text-xl font-semibold text-gray-900 mb-2.5 leading-snug">{s.title}</h3>
                <p className="text-gray-500 text-[0.9375rem] leading-relaxed mb-5">{s.description}</p>
                <ul className="space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal mt-[7px] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── TIMELINE ──────── */}
      <section id="trayectoria" className="py-20 md:py-28">
        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
          <div className="reveal mb-14 md:mb-18">
            <p className="text-teal text-xs font-semibold tracking-[0.1em] uppercase mb-3">Trayectoria</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.02em] leading-tight text-gray-950 mb-4 max-w-xl">
              25 años de transformaciones
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed">
              No contamos el tiempo en años, sino en transformaciones. Esta es nuestra historia.
            </p>
          </div>
          <div className="relative pl-8 md:pl-10">
            <div className="timeline-line" />
            <div className="space-y-12 md:space-y-16">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className="reveal relative flex gap-6 md:gap-8">
                  <div className="flex flex-col items-center">
                    <div className={`timeline-dot ${i === TIMELINE.length - 1 ? "active" : ""}`} />
                  </div>
                  <div className="pb-1 -mt-1">
                    <span className="font-display font-bold text-2xl md:text-3xl text-gray-950 tracking-tight">{item.year}</span>
                    <h3 className="font-display font-semibold text-lg text-gray-800 mt-1 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-[0.9375rem] leading-relaxed max-w-lg">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────── ABOUT / PHILOSOPHY ──────── */}
      <section id="nosotros" className="py-20 md:py-28 bg-alt">
        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-14 md:gap-20 items-start">
            <div className="reveal-left">
              <p className="text-teal text-xs font-semibold tracking-[0.1em] uppercase mb-3">Sobre Inplux</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.02em] leading-tight text-gray-950 mb-6">
                Socios estratégicos que construyen legados
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-5">
                Somos <strong className="text-gray-900 font-semibold">INPLUX S.A.S.</strong>, una consultora de soluciones integrales.
                Ayudamos a organizaciones líderes — públicas, mixtas y privadas — a resolver
                desafíos complejos mediante la fusión de inteligencia financiera y poder tecnológico.
              </p>
              <p className="text-gray-500 text-[0.9375rem] leading-relaxed mb-8">
                Nuestro propósito es apoyar la gestión administrativa, técnica, financiera,
                contable y jurídica de nuestros clientes. No solo optimizamos el presente;
                diseñamos e implementamos las soluciones innovadoras que aseguran su relevancia
                y competitividad en el futuro.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Medellín, Colombia", "+25 años", "Sector público & privado"].map((tag) => (
                  <span key={tag} className="text-sm font-medium text-gray-600 bg-white border border-border rounded-full px-4 py-2">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-4 stagger">
              {[
                { title: "Misión", text: "Acompañar a nuestros clientes en el logro de sus metas institucionales y empresariales, integrando servicios de consultoría de alta calidad con soluciones tecnológicas innovadoras que generan un impacto medible y sostenible." },
                { title: "Visión", text: "Ser el socio estratégico referente en Colombia por la entrega de soluciones integrales que, a través de la estrategia y la tecnología, potencien la gestión y competitividad de las organizaciones." },
                { title: "Compromiso", text: "Entregar servicios de la más alta calidad, apoyados en un equipo profesional, ético y transparente. Actuamos con eficacia, eficiencia y un profundo respeto hacia nuestros clientes y sus usuarios." },
              ].map((card) => (
                <div key={card.title} className="reveal bg-white border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:border-gray-200">
                  <h3 className="font-display font-semibold text-gray-950 text-[1.0625rem] mb-2.5">{card.title}</h3>
                  <p className="text-gray-500 text-[0.9375rem] leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────── CTA / CONTACT ──────── */}
      <section id="contacto" className="py-20 md:py-28">
        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-14 md:gap-20">
            <div className="reveal-left">
              <p className="text-teal text-xs font-semibold tracking-[0.1em] uppercase mb-3">Contacto</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.02em] leading-tight text-gray-950 mb-5">
                Hablemos.
              </h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-10">
                El futuro de su organización empieza con la próxima decisión estratégica.
                Contáctenos para agendar una sesión estratégica.
              </p>
              <div className="space-y-6">
                {[
                  { label: "Dirección", value: "Calle 23 # 43 A 66, Local 141\nMedellín, Antioquia" },
                  { label: "Teléfono", value: "(+57) 313 889 36 15" },
                  { label: "Email", value: "gerencia@inplux.co" },
                ].map((item) => (
                  <div key={item.label}>
                    <span className="text-gray-400 text-xs font-semibold tracking-[0.08em] uppercase block mb-1">{item.label}</span>
                    <span className="text-gray-700 text-[0.9375rem] whitespace-pre-line">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal">
              <div className="bg-gray-50 border border-border rounded-2xl p-6 md:p-8">
                <h3 className="font-display font-semibold text-gray-950 text-lg mb-6">Enviar mensaje</h3>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div>
                    <label className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-1.5 block">Nombre</label>
                    <input type="text" placeholder="Su nombre" className="form-input" required />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-1.5 block">Email</label>
                      <input type="email" placeholder="correo@empresa.co" className="form-input" required />
                    </div>
                    <div>
                      <label className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-1.5 block">Teléfono</label>
                      <input type="tel" placeholder="+57 3XX XXX XXXX" className="form-input" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-1.5 block">Mensaje</label>
                    <textarea rows={4} placeholder="Cuéntenos sobre su proyecto o desafío..." className="form-input resize-none" required />
                  </div>
                  <button type="submit" className="btn-dark w-full sm:w-auto">
                    Enviar mensaje
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── FOOTER ──────── */}
      <footer className="py-14 md:py-18 border-t border-border bg-gray-50">
        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-14">
            <div>
              <span className="font-display font-bold text-lg text-gray-950 tracking-tight block mb-3">inplux</span>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[220px]">
                Consultoría estratégica y transformación digital. Medellín, Colombia.
              </p>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold text-sm mb-4">Navegación</h4>
              <ul className="space-y-2.5">
                {[{ label: "Inicio", href: "#inicio" }, ...navLinks].map((l) => (
                  <li key={l.href}><a href={l.href} className="text-gray-500 hover:text-gray-900 text-sm transition-colors">{l.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold text-sm mb-4">Servicios</h4>
              <ul className="space-y-2.5">
                {SERVICES.map((s) => (<li key={s.title}><span className="text-gray-500 text-sm">{s.title}</span></li>))}
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold text-sm mb-4">Contacto</h4>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>Medellín, Antioquia</li>
                <li>(+57) 313 889 36 15</li>
                <li><a href="mailto:gerencia@inplux.co" className="hover:text-gray-900 transition-colors">gerencia@inplux.co</a></li>
                <li><a href="mailto:contacto@inplux.co" className="hover:text-gray-900 transition-colors">contacto@inplux.co</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-400 text-xs">&copy; {new Date().getFullYear()} INPLUX S.A.S. Todos los derechos reservados.</p>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
