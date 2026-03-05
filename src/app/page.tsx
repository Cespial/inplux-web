"use client";

import { useState, useEffect } from "react";

/* ================================================
   DATA: COMPANIES IN THE HUB
   ================================================ */
const COMPANIES = [
  {
    name: "Rotorr",
    tagline: "Ingenieria de Software a Medida",
    description:
      "Desarrollo de plataformas, aplicaciones web y moviles con arquitectura escalable. Equipos dedicados que transforman ideas en productos digitales robustos.",
    tags: ["Software Development", "Web Apps", "Mobile", "Cloud"],
    color: "#3b82f6",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    stats: { projects: "120+", team: "35", years: "8" },
  },
  {
    name: "Aries AI",
    tagline: "Inteligencia Artificial & Data",
    description:
      "Soluciones de IA, machine learning y analitica avanzada. Convertimos datos en decisiones estrategicas con modelos predictivos y automatizacion inteligente.",
    tags: ["AI/ML", "Data Science", "NLP", "Automation"],
    color: "#8b5cf6",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    stats: { projects: "80+", team: "20", years: "5" },
  },
  {
    name: "NexCloud",
    tagline: "Infraestructura Cloud & DevOps",
    description:
      "Arquitectura cloud-native, migraciones, CI/CD y operaciones DevOps. Infraestructura segura, escalable y optimizada en costos para cualquier escala.",
    tags: ["AWS", "Azure", "Kubernetes", "DevOps"],
    color: "#06b6d4",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path d="M6 19a4 4 0 01-.94-7.89A5.5 5.5 0 0116.9 8.28 4.5 4.5 0 0118 17H6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    stats: { projects: "200+", team: "25", years: "6" },
  },
  {
    name: "CyberShield",
    tagline: "Ciberseguridad & Compliance",
    description:
      "Proteccion integral de activos digitales. Auditorias de seguridad, pentesting, SOC y cumplimiento normativo para organizaciones que no pueden permitirse vulnerabilidades.",
    tags: ["Cybersecurity", "Pentesting", "SOC", "Compliance"],
    color: "#f43f5e",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path d="M12 2l8 4v6c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    stats: { projects: "150+", team: "18", years: "7" },
  },
  {
    name: "DataPulse",
    tagline: "Business Intelligence & Analytics",
    description:
      "Dashboards ejecutivos, data warehousing y estrategias data-driven. Hacemos visibles los insights ocultos en sus datos para decisiones mas inteligentes.",
    tags: ["BI", "Analytics", "ETL", "Data Warehouse"],
    color: "#f59e0b",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 16l4-6 4 4 6-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    stats: { projects: "90+", team: "15", years: "4" },
  },
  {
    name: "DigitalBridge",
    tagline: "Consultoria en Transformacion Digital",
    description:
      "Acompanamos organizaciones en su journey digital. Roadmaps estrategicos, change management y adopcion tecnologica para empresas publicas y privadas.",
    tags: ["Digital Strategy", "Change Mgmt", "Agile", "Innovation"],
    color: "#10b981",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 22v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    stats: { projects: "60+", team: "12", years: "5" },
  },
];

const HUB_STATS = [
  { value: "700+", label: "Proyectos Entregados" },
  { value: "125+", label: "Profesionales" },
  { value: "6", label: "Empresas Especializadas" },
  { value: "23+", label: "Anos de Experiencia" },
];

const ECOSYSTEM_BENEFITS = [
  {
    title: "Soluciones Integradas",
    description: "Un ecosistema donde cada empresa complementa a las demas. Ofrecemos soluciones end-to-end sin fricciones.",
    icon: "layers",
  },
  {
    title: "Talento Especializado",
    description: "Mas de 125 profesionales con expertise profundo en sus areas. El mejor talento tech de la region.",
    icon: "people",
  },
  {
    title: "Innovacion Continua",
    description: "Laboratorios de innovacion compartidos, transferencia de conocimiento y adopcion temprana de tecnologias emergentes.",
    icon: "spark",
  },
  {
    title: "Escala On-Demand",
    description: "Equipos que crecen y se adaptan a la demanda de cada proyecto. Flexibilidad sin sacrificar calidad.",
    icon: "scale",
  },
];

/* ================================================
   SCROLL REVEAL HOOK
   ================================================ */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document
      .querySelectorAll(".reveal, .reveal-left")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ================================================
   ICON COMPONENT
   ================================================ */
function BenefitIcon({ type }: { type: string }) {
  const cls = "w-6 h-6";
  switch (type) {
    case "layers":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "people":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls}>
          <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M19 15a4 4 0 013 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls}>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "scale":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls}>
          <path d="M21 3L3 21M21 3v6M21 3h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
}

/* ================================================
   MAIN PAGE
   ================================================ */
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
    { label: "Inicio", href: "#inicio" },
    { label: "Ecosistema", href: "#ecosistema" },
    { label: "Empresas", href: "#empresas" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <>
      {/* ============================================
          NAVIGATION
          ============================================ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 nav-glass transition-all duration-300 ${
          scrolled ? "shadow-lg shadow-black/20" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">
          <a href="#inicio" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <span className="text-white font-bold text-sm">iX</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-text-primary">
              INPLUX<span className="text-accent-indigo">HUB</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-text-primary text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="#contacto" className="hidden md:inline-flex btn-primary text-sm !py-2.5 !px-6 !rounded-lg">
              Conectar
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-text-primary p-2 cursor-pointer"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-5 py-4 bg-bg-primary/95 backdrop-blur-xl border-t border-border-subtle space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-text-secondary hover:text-text-primary text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contacto"
              onClick={() => setMobileOpen(false)}
              className="block btn-primary text-sm text-center !py-2.5 mt-2"
            >
              Conectar
            </a>
          </div>
        </div>
      </nav>

      {/* ============================================
          HERO
          ============================================ */}
      <section
        id="inicio"
        className="relative min-h-screen flex items-center overflow-hidden pt-16 mesh-bg grid-pattern"
      >
        {/* Decorative orbs */}
        <div className="orb w-[500px] h-[500px] bg-accent-indigo/20 -top-40 -left-40" />
        <div className="orb w-[400px] h-[400px] bg-accent-cyan/15 bottom-20 right-[-100px]" />
        <div className="orb w-[300px] h-[300px] bg-accent-violet/10 top-1/2 left-1/3" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 w-full py-20 md:py-28">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="reveal badge badge-glow mb-8">
              <span className="pulse-dot !w-2 !h-2" />
              Ecosistema Tech Activo
            </div>

            {/* Headline */}
            <h1 className="reveal text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
              El Hub Tecnologico{" "}
              <span className="gradient-text">que impulsa</span>{" "}
              la innovacion
            </h1>

            {/* Subtext */}
            <p className="reveal text-text-secondary text-base md:text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl">
              Integramos empresas de TI especializadas bajo un mismo ecosistema.
              Desarrollo de software, IA, cloud, ciberseguridad y mas — todo conectado
              para potenciar su transformacion digital.
            </p>

            {/* CTAs */}
            <div className="reveal flex flex-col sm:flex-row gap-4 mb-16">
              <a href="#empresas" className="btn-primary text-center">
                Explorar Ecosistema
              </a>
              <a href="#contacto" className="btn-outline text-center">
                Agendar Reunion
              </a>
            </div>

            {/* Stats row */}
            <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {HUB_STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-text-muted text-xs md:text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          ECOSYSTEM BENEFITS
          ============================================ */}
      <section id="ecosistema" className="py-20 md:py-28 relative">
        <div className="section-divider" />
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-20 md:pt-28">
          {/* Section header */}
          <div className="reveal text-center mb-16 md:mb-20">
            <span className="badge badge-glow mb-4">Ecosistema</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Un ecosistema, <span className="gradient-text">infinitas posibilidades</span>
            </h2>
            <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto">
              Nuestro hub conecta empresas especializadas que trabajan en sinergia.
              El resultado: soluciones mas completas, rapidas y eficientes.
            </p>
          </div>

          {/* Benefits grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
            {ECOSYSTEM_BENEFITS.map((benefit) => (
              <div key={benefit.title} className="reveal glass-card rounded-2xl p-6 md:p-7">
                <div className="w-12 h-12 rounded-xl bg-accent-indigo/10 flex items-center justify-center text-accent-indigo mb-5">
                  <BenefitIcon type={benefit.icon} />
                </div>
                <h3 className="text-text-primary font-semibold text-lg mb-2">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          COMPANIES
          ============================================ */}
      <section id="empresas" className="py-20 md:py-28 relative">
        <div className="section-divider" />
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-20 md:pt-28">
          {/* Section header */}
          <div className="reveal text-center mb-16 md:mb-20">
            <span className="badge badge-glow mb-4">Empresas</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Nuestras <span className="gradient-text">empresas</span>
            </h2>
            <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto">
              Cada empresa del hub es lider en su verticar. Juntas, forman el ecosistema
              tecnologico mas completo de la region.
            </p>
          </div>

          {/* Companies grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {COMPANIES.map((company) => (
              <div
                key={company.name}
                className="reveal company-card"
                style={{ "--card-accent": company.color } as React.CSSProperties}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${company.color}15`,
                      color: company.color,
                    }}
                  >
                    {company.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: company.color }} />
                    <span className="text-text-muted text-xs">Activo</span>
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-text-primary font-bold text-xl mb-1">
                  {company.name}
                </h3>
                <p className="text-sm font-medium mb-3" style={{ color: company.color }}>
                  {company.tagline}
                </p>
                <p className="text-text-secondary text-sm leading-relaxed mb-5">
                  {company.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {company.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-5 pt-4 border-t border-border-subtle text-xs text-text-muted">
                  <span>
                    <strong className="text-text-primary font-semibold">{company.stats.projects}</strong> proyectos
                  </span>
                  <span>
                    <strong className="text-text-primary font-semibold">{company.stats.team}</strong> expertos
                  </span>
                  <span>
                    <strong className="text-text-primary font-semibold">{company.stats.years}</strong> anos
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          ABOUT / PHILOSOPHY
          ============================================ */}
      <section id="nosotros" className="py-20 md:py-28 relative mesh-bg">
        <div className="section-divider" />
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-20 md:pt-28">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Left */}
            <div className="reveal-left">
              <span className="badge badge-glow mb-4">Sobre Nosotros</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Mas que un grupo de empresas,{" "}
                <span className="gradient-text">un ecosistema vivo</span>
              </h2>
              <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-6">
                INPLUX HUB nacio de la conviccion de que la tecnologia genera mayor
                impacto cuando las disciplinas convergen. Reunimos bajo un mismo techo
                a empresas de TI especializadas que comparten vision, estandares y
                una cultura de excelencia.
              </p>
              <p className="text-text-secondary text-sm leading-relaxed mb-8">
                Con mas de 23 anos de experiencia acumulada, hemos ejecutado cientos de
                proyectos en el sector publico y privado. Nuestro modelo de hub permite
                ofrecer soluciones integrales que una sola empresa no podria entregar
                con la misma profundidad.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Medellin, Colombia", "23+ Anos", "Sector Publico & Privado"].map(
                  (item) => (
                    <span key={item} className="tag-pill !text-xs !py-2 !px-4">
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Right - Philosophy cards */}
            <div className="space-y-4 stagger-children">
              {[
                {
                  title: "Mision",
                  text: "Integrar empresas de tecnologia bajo un ecosistema colaborativo que potencie la transformacion digital de organizaciones publicas y privadas, entregando soluciones de clase mundial.",
                  accent: "#6366f1",
                },
                {
                  title: "Vision",
                  text: "Ser el hub tecnologico referente en Colombia, reconocido por la calidad, innovacion y el impacto real de nuestras soluciones integradas.",
                  accent: "#8b5cf6",
                },
                {
                  title: "Valores",
                  text: "Excelencia tecnica, colaboracion genuina, transparencia radical e innovacion con proposito. Cada empresa del hub comparte estos principios fundamentales.",
                  accent: "#06b6d4",
                },
              ].map((card) => (
                <div key={card.title} className="reveal glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-2 h-8 rounded-full"
                      style={{ background: card.accent }}
                    />
                    <h3 className="text-text-primary font-semibold text-lg">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed pl-5">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CONTACT
          ============================================ */}
      <section id="contacto" className="py-20 md:py-28 relative">
        <div className="section-divider" />
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-20 md:pt-28">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20">
            {/* Left */}
            <div className="reveal-left">
              <span className="badge badge-glow mb-4">Contacto</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Construyamos el{" "}
                <span className="gradient-text">futuro juntos</span>
              </h2>
              <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-10">
                Cada proyecto comienza con una conversacion. Cuentenos su desafio
                y encontraremos la empresa — o combinacion de empresas — del hub
                que mejor se ajuste a sus necesidades.
              </p>

              {/* Contact details */}
              <div className="space-y-5">
                {[
                  { label: "Direccion", value: "Calle 23 #43 A 66, Local 141\nMedellin, Antioquia, Colombia" },
                  { label: "Telefono", value: "(+57) 313 889 3615" },
                  { label: "Email", value: "gerencia@inplux.co" },
                  { label: "Web", value: "www.inplux.co" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="text-accent-indigo text-sm font-medium w-20 shrink-0 pt-0.5">
                      {item.label}
                    </span>
                    <span className="text-text-secondary text-sm whitespace-pre-line">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Form */}
            <div className="reveal">
              <div className="glass-card rounded-2xl p-6 md:p-8 !transform-none !hover:transform-none">
                <h3 className="text-text-primary font-semibold text-lg mb-6">
                  Enviar mensaje
                </h3>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div>
                    <label className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1.5 block">
                      Nombre
                    </label>
                    <input type="text" placeholder="Su nombre" className="form-input" required />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1.5 block">
                        Email
                      </label>
                      <input type="email" placeholder="correo@empresa.co" className="form-input" required />
                    </div>
                    <div>
                      <label className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1.5 block">
                        Telefono
                      </label>
                      <input type="tel" placeholder="+57 3XX XXX XXXX" className="form-input" />
                    </div>
                  </div>
                  <div>
                    <label className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1.5 block">
                      Mensaje
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Cuentenos sobre su proyecto..."
                      className="form-input resize-none"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full sm:w-auto">
                    Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="py-12 md:py-16 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                  <span className="text-white font-bold text-xs">iX</span>
                </div>
                <span className="font-bold text-base tracking-tight">
                  INPLUX<span className="text-accent-indigo">HUB</span>
                </span>
              </div>
              <p className="text-text-muted text-sm leading-relaxed">
                Ecosistema tecnologico que integra las mejores empresas de TI.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-text-primary font-semibold text-sm mb-4">Navegacion</h4>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-text-muted hover:text-text-primary text-sm transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Companies */}
            <div>
              <h4 className="text-text-primary font-semibold text-sm mb-4">Empresas</h4>
              <ul className="space-y-2.5">
                {COMPANIES.slice(0, 5).map((c) => (
                  <li key={c.name}>
                    <span className="text-text-muted text-sm">{c.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-text-primary font-semibold text-sm mb-4">Contacto</h4>
              <ul className="space-y-2.5 text-text-muted text-sm">
                <li>Medellin, Colombia</li>
                <li>(+57) 313 889 3615</li>
                <li>
                  <a href="mailto:gerencia@inplux.co" className="hover:text-text-primary transition-colors">
                    gerencia@inplux.co
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-text-muted text-xs">
              &copy; {new Date().getFullYear()} INPLUX HUB. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
