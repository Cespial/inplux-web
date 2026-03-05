"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/* ════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════ */

const SERVICES = [
  {
    number: "01",
    title: "Consultoría Estratégica y Financiera",
    description:
      "Estructuramos la inteligencia financiera de su organización para convertirla en el motor de las decisiones estratégicas y el crecimiento sostenible.",
    features: [
      "Gestión financiera, contable y tributaria",
      "Planificación estratégica y del desarrollo",
      "Optimización fiscal y cobro de cartera",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 16l4-6 4 4 6-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Soluciones de Transformación Digital",
    description:
      "Diseñamos y construimos los productos y ecosistemas digitales que su organización necesita para operar con mayor eficiencia y generar ventajas competitivas.",
    features: [
      "Desarrollo de productos y ecosistemas digitales",
      "Infraestructura cloud y plataformas ERP",
      "Inteligencia de negocios, IA e IoT",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Optimización Organizacional y de Proyectos",
    description:
      "La estrategia solo genera valor a través de una ejecución impecable. Alineamos sus procesos, equipos y proyectos para garantizar resultados extraordinarios.",
    features: [
      "Gerencia de proyectos de alto impacto",
      "Auditoría e interventoría técnica y financiera",
      "Modernización y desarrollo del talento humano",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Gestión Institucional y Comunicaciones",
    description:
      "La buena gestión solo genera valor cuando se comunica de forma estratégica. Construimos la narrativa y los canales para fortalecer la reputación y la confianza.",
    features: [
      "Modelos de gestión y gobernanza (MIPG)",
      "Comunicación estratégica y relacionamiento",
      "Producción de eventos y foros sectoriales",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 22v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "+25", label: "Años de experiencia", suffix: "" },
  { value: "+50", label: "Municipios atendidos", suffix: "" },
  { value: "+100", label: "Proyectos ejecutados", suffix: "" },
  { value: "6", label: "Sectores de impacto", suffix: "" },
];

const SECTORS = [
  "Innovación y Tecnología",
  "Sector Público y Gobierno",
  "Sector Educativo y Mixto",
  "Sector Salud",
  "Servicios Públicos",
  "Sector Privado",
];

const CLIENT_LOGOS = [
  { src: "/logos/21053_escudo-vegachi-pagina_200x200.png", alt: "Municipio de Vegachí" },
  { src: "/logos/47914_logo-alcaldia--300-x-100-1_200x200.png", alt: "Alcaldía" },
  { src: "/logos/54672_escudo-de-cisneros-antioquia-oficial-3x3_200x200.png", alt: "Municipio de Cisneros" },
  { src: "/logos/CIS.png", alt: "CIS" },
  { src: "/logos/Escudo.png", alt: "Escudo Municipal" },
  { src: "/logos/Parque_Arví_Logo_Blanco.png", alt: "Parque Arví" },
  { src: "/logos/Think_It_Logo_Blanco.png", alt: "Think It" },
  { src: "/logos/cropped-Logo_Alianza-IT-1.png", alt: "Alianza IT" },
  { src: "/logos/logo (1).png", alt: "Cliente" },
  { src: "/logos/logo-negro.png", alt: "Rotorr" },
  { src: "/logos/logo-provincia-b.svg", alt: "Provincia" },
  { src: "/logos/logo-think-oracle.png", alt: "Think Oracle" },
  { src: "/logos/logo.jpg", alt: "Cliente" },
  { src: "/logos/logo.png", alt: "Sistemas Aries" },
  { src: "/logos/logo_300.png", alt: "Prodepaz" },
  { src: "/logos/logoedu.png", alt: "EDU" },
  { src: "/logos/navarro-ospina-logo.png", alt: "Navarro Ospina" },
];

const PHILOSOPHY = [
  {
    title: "Misión",
    text: "Acompañar a nuestros clientes en el logro de sus metas institucionales y empresariales, integrando servicios de consultoría de alta calidad con soluciones tecnológicas innovadoras que generan un impacto medible y sostenible.",
    accent: "var(--teal)",
  },
  {
    title: "Visión",
    text: "Ser el socio estratégico referente en Colombia por la entrega de soluciones integrales que, a través de la estrategia y la tecnología, potencien la gestión y competitividad de las organizaciones.",
    accent: "var(--lime)",
  },
  {
    title: "Compromiso",
    text: "Entregar servicios de la más alta calidad, apoyados en un equipo profesional, ético y transparente. Actuamos con eficacia, eficiencia y un profundo respeto hacia nuestros clientes.",
    accent: "var(--teal-light)",
  },
];

/* ════════════════════════════════════════════
   HOOKS
   ════════════════════════════════════════════ */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-left").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ════════════════════════════════════════════
   INPLUX LOGO SVG
   ════════════════════════════════════════════ */
function InpluxLogo({ className = "h-8" }: { className?: string }) {
  return (
    <span className={`font-display font-bold text-xl tracking-tight ${className}`}>
      <span className="text-teal">in</span>
      <span className="text-lime">p</span>
      <span className="text-text-white">lux</span>
    </span>
  );
}

/* ════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════ */
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
    { label: "Nosotros", href: "#nosotros" },
    { label: "Clientes", href: "#clientes" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          NAVIGATION
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 nav-blur transition-all duration-300 ${scrolled ? "scrolled" : ""}`}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 flex items-center justify-between h-[68px]">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2">
            <InpluxLogo />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-muted hover:text-text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a href="#contacto" className="hidden md:inline-flex btn-teal text-sm !py-2.5 !px-6">
              Hablemos
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-text-white p-2 cursor-pointer"
              aria-label="Menú"
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
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-5 py-4 border-t border-border-subtle space-y-1" style={{ background: "rgba(6, 13, 27, 0.95)" }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-text-muted hover:text-text-white text-sm font-medium py-2.5 px-3 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a href="#contacto" onClick={() => setMobileOpen(false)} className="block btn-teal text-sm text-center !py-2.5 mt-2">
              Hablemos
            </a>
          </div>
        </div>
      </nav>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden pt-[68px] hero-gradient dot-grid">
        {/* Decorative orbs */}
        <div className="orb w-[600px] h-[600px] -top-48 -left-48 opacity-30" style={{ background: "rgba(43, 188, 179, 0.2)" }} />
        <div className="orb w-[400px] h-[400px] bottom-20 right-[-120px] opacity-20" style={{ background: "rgba(168, 216, 46, 0.15)" }} />

        <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 w-full py-20 md:py-32">
          <div className="max-w-[820px]">
            {/* Badge */}
            <div className="reveal badge-teal mb-8">
              <span className="pulse-dot" style={{ width: 7, height: 7 }} />
              +25 años transformando organizaciones
            </div>

            {/* Headline */}
            <h1 className="reveal font-display text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[4.75rem] font-bold leading-[1.08] tracking-[-0.02em] mb-6">
              Convertimos desafíos{" "}
              <span className="text-gradient-teal">complejos</span> en{" "}
              <span className="text-gradient-lime">resultados</span>{" "}
              medibles
            </h1>

            {/* Subtitle */}
            <p className="reveal text-text-light text-base md:text-lg lg:text-xl leading-relaxed mb-10 max-w-[640px]">
              Consultoría estratégica, transformación digital y optimización organizacional
              para entidades públicas y privadas en Colombia.
            </p>

            {/* CTAs */}
            <div className="reveal flex flex-col sm:flex-row gap-4">
              <a href="#servicios" className="btn-teal text-center">
                Explorar servicios
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <a href="#contacto" className="btn-outline-light text-center">
                Agendar sesión estratégica
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CLIENT LOGOS CAROUSEL
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="clientes" className="py-16 md:py-20 relative">
        <div className="section-line" />
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-16 md:pt-20">
          <p className="reveal text-center text-text-muted text-sm font-medium tracking-wider uppercase mb-10">
            Confían en nosotros
          </p>
        </div>

        {/* Carousel */}
        <div className="reveal relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10" style={{ background: "linear-gradient(90deg, var(--navy-950), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10" style={{ background: "linear-gradient(270deg, var(--navy-950), transparent)" }} />

          <div className="logo-carousel-track">
            {/* Duplicate logos for seamless infinite scroll */}
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, i) => (
              <Image
                key={`${logo.alt}-${i}`}
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={40}
                className="logo-carousel-item"
                style={{ objectFit: "contain", width: "auto" }}
                unoptimized
              />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STATS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16 md:py-24 relative">
        <div className="section-line" />
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-16 md:pt-24">
          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <div className="stat-number text-4xl md:text-5xl lg:text-6xl text-gradient-teal mb-2">
                  {stat.value}
                </div>
                <div className="text-text-muted text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SERVICES
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="servicios" className="py-20 md:py-28 relative">
        <div className="section-line" />
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-20 md:pt-28">
          {/* Section header */}
          <div className="reveal text-center mb-16 md:mb-20">
            <p className="text-teal text-sm font-semibold tracking-wider uppercase mb-4">Nuestros servicios</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[3.25rem] font-bold tracking-[-0.02em] leading-tight mb-5">
              No ofrecemos servicios,{" "}
              <span className="text-gradient-teal">construimos capacidades</span>
            </h2>
            <p className="text-text-light text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Integramos inteligencia financiera y poder tecnológico para diseñar,
              acelerar y escalar el futuro de su organización.
            </p>
          </div>

          {/* Service cards */}
          <div className="grid md:grid-cols-2 gap-5 stagger">
            {SERVICES.map((service) => (
              <div key={service.number} className="reveal service-card group">
                <div className="relative z-10">
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-teal" style={{ background: "var(--teal-dim)" }}>
                      {service.icon}
                    </div>
                    <span className="font-display text-2xl font-bold text-text-dim group-hover:text-teal/30 transition-colors">
                      {service.number}
                    </span>
                  </div>

                  {/* Title & description */}
                  <h3 className="font-display text-xl md:text-[1.375rem] font-semibold text-text-white mb-3 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-text-light text-[0.9375rem] leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* Feature list */}
                  <ul className="space-y-2.5">
                    {service.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-text-muted text-sm">
                        <svg className="w-4 h-4 text-teal shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ABOUT / PHILOSOPHY
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="nosotros" className="py-20 md:py-28 relative">
        <div className="section-line" />
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-20 md:pt-28">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-start">
            {/* Left */}
            <div className="reveal-left">
              <p className="text-teal text-sm font-semibold tracking-wider uppercase mb-4">Sobre Inplux</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-[3.25rem] font-bold tracking-[-0.02em] leading-tight mb-6">
                Socios estratégicos que{" "}
                <span className="text-gradient-lime">construyen legados</span>
              </h2>
              <p className="text-text-light text-base md:text-lg leading-relaxed mb-6">
                Durante más de 25 años, hemos sido la fuerza detrás de la estabilidad
                financiera y la modernización de decenas de entidades públicas en Antioquia
                y a nivel nacional. Hoy, como <strong className="text-text-white">INPLUX S.A.S.</strong>,
                integramos nuestra profunda experiencia en consultoría financiera con
                las soluciones de transformación digital que el futuro exige.
              </p>
              <p className="text-text-muted text-[0.9375rem] leading-relaxed mb-8">
                Ayudamos a organizaciones líderes — públicas, mixtas y privadas — a resolver
                desafíos complejos mediante la fusión de inteligencia financiera y poder
                tecnológico. No solo optimizamos el presente; diseñamos, desarrollamos e
                implementamos las soluciones innovadoras que aseguran su relevancia y
                competitividad en el futuro.
              </p>

              {/* Sectors */}
              <div className="flex flex-wrap gap-2.5">
                {SECTORS.map((sector) => (
                  <span key={sector} className="sector-pill text-sm">
                    {sector}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Philosophy */}
            <div className="space-y-4 stagger">
              {PHILOSOPHY.map((card) => (
                <div key={card.title} className="reveal philosophy-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-8 rounded-full" style={{ background: card.accent }} />
                    <h3 className="font-display text-text-white font-semibold text-lg">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-text-light text-[0.9375rem] leading-relaxed pl-[18px]">
                    {card.text}
                  </p>
                </div>
              ))}

              {/* Key values */}
              <div className="reveal flex items-center gap-6 pt-4 pl-[18px]">
                {["Integración", "Inteligencia", "Impulso"].map((val) => (
                  <div key={val} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-lime" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 7l5 5-5 5M6 7l5 5-5 5" />
                    </svg>
                    <span className="font-display font-semibold text-text-white text-sm">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CTA — HABLEMOS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="contacto" className="py-20 md:py-28 relative">
        <div className="section-line" />
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-20 md:pt-28">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20">
            {/* Left */}
            <div className="reveal-left">
              <p className="text-teal text-sm font-semibold tracking-wider uppercase mb-4">Contacto</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-[3.25rem] font-bold tracking-[-0.02em] leading-tight mb-6">
                <span className="text-gradient-teal">¡Hablemos!</span>
              </h2>
              <p className="text-text-light text-base md:text-lg leading-relaxed mb-10">
                El futuro de su organización empieza con la próxima decisión estratégica.
                Permítanos mostrarle cómo la integración de finanzas y tecnología puede
                generar el impulso que necesita.
              </p>

              {/* Contact details */}
              <div className="space-y-5">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    ),
                    label: "Dirección",
                    value: "Calle 23 # 43 A 66, Local 141\nMedellín, Antioquia",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    ),
                    label: "Teléfono",
                    value: "(+57) 313 889 36 15",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    ),
                    label: "Email",
                    value: "gerencia@inplux.co",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="text-teal shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <span className="text-text-muted text-xs font-medium uppercase tracking-wider block mb-1">
                        {item.label}
                      </span>
                      <span className="text-text-light text-sm whitespace-pre-line">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div className="reveal">
              <div className="service-card !p-6 md:!p-8" style={{ background: "rgba(15, 26, 48, 0.7)" }}>
                <h3 className="font-display text-text-white font-semibold text-lg mb-6">
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
                        Teléfono
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
                      placeholder="Cuéntenos sobre su proyecto o desafío..."
                      className="form-input resize-none"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-teal w-full sm:w-auto">
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FOOTER
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="py-14 md:py-20 border-t border-border-subtle">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-14">
            {/* Brand */}
            <div className="md:col-span-1">
              <InpluxLogo className="h-7 mb-4 block" />
              <p className="text-text-muted text-sm leading-relaxed max-w-[240px]">
                Consultoría estratégica y transformación digital con más de 25 años de experiencia.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-text-white font-semibold text-sm mb-4">Navegación</h4>
              <ul className="space-y-2.5">
                {[{ label: "Inicio", href: "#inicio" }, ...navLinks].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-text-muted hover:text-text-white text-sm transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-text-white font-semibold text-sm mb-4">Servicios</h4>
              <ul className="space-y-2.5">
                {SERVICES.map((s) => (
                  <li key={s.number}>
                    <span className="text-text-muted text-sm">{s.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-text-white font-semibold text-sm mb-4">Contacto</h4>
              <ul className="space-y-2.5 text-text-muted text-sm">
                <li>Medellín, Antioquia</li>
                <li>(+57) 313 889 36 15</li>
                <li>
                  <a href="mailto:gerencia@inplux.co" className="hover:text-teal transition-colors">
                    gerencia@inplux.co
                  </a>
                </li>
                <li>
                  <a href="mailto:contacto@inplux.co" className="hover:text-teal transition-colors">
                    contacto@inplux.co
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-text-dim text-xs">
              &copy; {new Date().getFullYear()} INPLUX S.A.S. Todos los derechos reservados.
            </p>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-dim hover:text-text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
