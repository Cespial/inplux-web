"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════
   SCROLL REVEAL HOOK
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

/* ═══════════════════════════════════════
   DATA
   ═══════════════════════════════════════ */
const TEAM = [
  {
    name: "Jaime Alonso Cano Pino",
    role: "CEO & Fundador",
    area: "Dirección General",
    linkedin: "https://www.linkedin.com/in/jaime-alonso-cano-pino-a11a6246/",
    bio: "25 años asesorando entidades públicas en Colombia. Coordinó 44 estatutos tributarios para la Gobernación de Antioquia y estructuró la gestión financiera de más de 50 entidades. Fundador del ecosistema INPLUX.",
    initials: "JC",
  },
  {
    name: "Cristian Espinal",
    role: "CTO",
    area: "Tecnología & Producto",
    linkedin: "https://www.linkedin.com/in/cespial/",
    bio: "Lidera la arquitectura tecnológica del Hub. Responsable de la construcción de Tribai.co, la infraestructura cloud y los modelos de IA que procesan normativa tributaria colombiana.",
    initials: "CE",
  },
];

const DEPARTMENTS = [
  {
    name: "Consultoría Tributaria & Financiera",
    head: "Dirección de Consultoría",
    icon: "briefcase",
    functions: [
      "Asesoría contable, financiera y tributaria",
      "Estructuración fiscal municipal y departamental",
      "Adopción NIC/NIIF (grupos 1, 2 y 3)",
      "Reestructuración de pasivos y Ley 550",
      "Estatutos tributarios y hacienda pública",
    ],
  },
  {
    name: "Tecnología & Producto",
    head: "Dirección de Tecnología",
    icon: "code",
    functions: [
      "Arquitectura de software y cloud",
      "Desarrollo de Tribai.co y plataforma de sector público",
      "Modelos de IA y procesamiento de normativa",
      "Infraestructura DevOps y CI/CD",
      "Ingeniería de datos y analítica",
    ],
  },
  {
    name: "Gestión de Proyectos",
    head: "Dirección de Proyectos",
    icon: "clipboard",
    functions: [
      "Formulación y estructuración de proyectos",
      "Auditoría e interventoría",
      "Modernización organizacional",
      "Seguimiento y control de ejecución",
    ],
  },
  {
    name: "Gestión Institucional",
    head: "Dirección Institucional",
    icon: "building",
    functions: [
      "Modelos de gobernanza y gestión institucional",
      "Comunicaciones estratégicas",
      "Relaciones con entidades del sector público",
      "Gestión del conocimiento",
    ],
  },
];

const VALUES = [
  { title: "Integración", desc: "Conectamos consultoría, tecnología e inteligencia artificial en una sola propuesta de valor." },
  { title: "Inteligencia", desc: "25 años de conocimiento tributario y financiero convertidos en modelos de IA y productos digitales." },
  { title: "Impulso", desc: "Aceleramos la transformación de las organizaciones con soluciones que generan resultados medibles." },
];

function DeptIcon({ type }: { type: string }) {
  const cls = "w-5 h-5";
  switch (type) {
    case "briefcase":
      return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
    case "code":
      return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg>;
    case "clipboard":
      return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" /></svg>;
    case "building":
      return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>;
    default:
      return null;
  }
}

/* ═══════════════════════════════════════
   PAGE
   ═══════════════════════════════════════ */
export default function Nosotros() {
  const [scrolled, setScrolled] = useState(false);
  useScrollReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ──── NAV ──── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 nav-wrap ${scrolled ? "scrolled" : ""}`} aria-label="Navegación">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 flex items-center justify-between h-[60px]">
          <Link href="/" className="text-ink font-bold text-[1.1rem] tracking-[0.12em] uppercase" aria-label="INPLUX - Inicio">INPLUX</Link>
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="text-[0.8125rem] font-medium px-3 py-1.5 rounded-md text-gray-500 hover:text-ink transition-colors">Inicio</Link>
            <span className="text-[0.8125rem] font-medium px-3 py-1.5 rounded-md nav-link-active">Nosotros</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/#contacto" className="btn-dark text-[0.8125rem] !py-2 !px-5">Hablemos</Link>
          </div>
        </div>
      </nav>

      <main className="pt-[60px]">
        {/* ──── HERO ──── */}
        <section className="py-20 md:py-28 bg-warm">
          <div className="max-w-[1100px] mx-auto px-5 md:px-8">
            <div className="max-w-[720px]">
              <Link href="/" className="reveal inline-flex items-center gap-2 text-gray-500 text-[0.8125rem] font-medium mb-8 hover:text-ink transition-colors group">
                <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" /></svg>
                Volver al inicio
              </Link>
              <p className="reveal text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Sobre nosotros</p>
              <h1 className="reveal font-serif text-[2.25rem] sm:text-[3rem] md:text-[3.75rem] leading-[1.08] tracking-[-0.02em] text-ink mb-6">
                La estructura detrás del <em className="italic">Hub.</em>
              </h1>
              <p className="reveal text-gray-500 text-base md:text-lg leading-[1.65]">
                INPLUX nació de 25 años de experiencia en consultoría tributaria y financiera. Hoy integramos ese conocimiento con tecnología e inteligencia artificial en una estructura diseñada para escalar.
              </p>
            </div>
          </div>
        </section>

        <div className="fine-rule" />

        {/* ──── VALORES ──── */}
        <section className="py-20 md:py-28">
          <div className="max-w-[1100px] mx-auto px-5 md:px-8">
            <div className="reveal mb-12">
              <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">ADN</p>
              <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink">Nuestros valores</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 stagger">
              {VALUES.map((v) => (
                <div key={v.title} className="reveal card">
                  <h3 className="text-ink font-semibold text-lg mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-[0.9375rem] leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="fine-rule" />

        {/* ──── MISIÓN / VISIÓN / COMPROMISO ──── */}
        <section className="py-20 md:py-28 bg-warm">
          <div className="max-w-[1100px] mx-auto px-5 md:px-8">
            <div className="reveal mb-12">
              <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Filosofía</p>
              <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink">Lo que nos guía</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 stagger">
              <div className="reveal">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-8 h-8 rounded-full bg-teal-soft flex items-center justify-center">
                    <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>
                  </span>
                  <h3 className="text-ink font-semibold text-base">Misión</h3>
                </div>
                <p className="text-gray-500 text-[0.9375rem] leading-[1.65]">
                  Acompañar a nuestros clientes en el logro de sus metas institucionales y empresariales, integrando servicios de consultoría de alta calidad con soluciones tecnológicas innovadoras.
                </p>
              </div>
              <div className="reveal">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-8 h-8 rounded-full bg-teal-soft flex items-center justify-center">
                    <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  </span>
                  <h3 className="text-ink font-semibold text-base">Visión</h3>
                </div>
                <p className="text-gray-500 text-[0.9375rem] leading-[1.65]">
                  Ser el socio estratégico referente en Colombia por la entrega de soluciones integrales que potencien la gestión y competitividad de las organizaciones.
                </p>
              </div>
              <div className="reveal">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-8 h-8 rounded-full bg-teal-soft flex items-center justify-center">
                    <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
                  </span>
                  <h3 className="text-ink font-semibold text-base">Compromiso</h3>
                </div>
                <p className="text-gray-500 text-[0.9375rem] leading-[1.65]">
                  Entregar servicios de la más alta calidad, apoyados en un equipo profesional, ético y transparente.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="fine-rule" />

        {/* ──── EQUIPO DIRECTIVO ──── */}
        <section className="py-20 md:py-28">
          <div className="max-w-[1100px] mx-auto px-5 md:px-8">
            <div className="reveal mb-12">
              <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Liderazgo</p>
              <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4">Equipo directivo</h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-[600px]">
                Las personas que lideran la estrategia, la tecnología y la operación del Hub.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8 stagger">
              {TEAM.map((member) => (
                <div key={member.name} className="reveal card group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm tracking-wider">{member.initials}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-ink font-semibold text-base mb-0.5">{member.name}</h3>
                      <p className="text-teal text-[0.8125rem] font-semibold">{member.role}</p>
                      <p className="text-gray-400 text-[0.75rem] font-medium">{member.area}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-[0.875rem] leading-[1.6] mb-4">{member.bio}</p>
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-ink text-[0.8125rem] font-medium transition-colors">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="fine-rule" />

        {/* ──── ESTRUCTURA ORGANIZACIONAL ──── */}
        <section className="py-20 md:py-28 bg-warm">
          <div className="max-w-[1100px] mx-auto px-5 md:px-8">
            <div className="reveal mb-12">
              <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Organización</p>
              <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4">Estructura del Hub</h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-[620px]">
                Cuatro direcciones que integran consultoría, tecnología, gestión de proyectos y gobernanza institucional.
              </p>
            </div>

            {/* Org chart SVG */}
            <div className="reveal mb-14 w-full overflow-x-auto">
              <svg viewBox="0 0 880 460" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[880px] mx-auto min-w-[600px]" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }} role="img" aria-label="Organigrama de INPLUX">

                {/* ═══ LEVEL 1 — CEO ═══ */}
                <rect x="310" y="20" width="260" height="60" rx="12" fill="#1a1918" />
                <text x="440" y="48" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">Jaime Alonso Cano Pino</text>
                <text x="440" y="64" textAnchor="middle" fill="#a8a5a0" fontSize="8.5" fontWeight="600" letterSpacing="1">CEO & FUNDADOR</text>

                {/* Line CEO → CTO */}
                <line x1="440" y1="80" x2="440" y2="110" stroke="#d1cfcc" strokeWidth="1.5" />

                {/* ═══ LEVEL 2 — CTO ═══ */}
                <rect x="310" y="110" width="260" height="50" rx="10" fill="white" stroke="#0d7d74" strokeWidth="1.5" />
                <text x="440" y="136" textAnchor="middle" fill="#1a1918" fontSize="11" fontWeight="700">Cristian Espinal</text>
                <text x="440" y="150" textAnchor="middle" fill="#0d7d74" fontSize="8" fontWeight="600" letterSpacing="0.5">CTO · TECNOLOGÍA & PRODUCTO</text>

                {/* Line CTO → 4 Directors */}
                <line x1="440" y1="160" x2="440" y2="195" stroke="#d1cfcc" strokeWidth="1.5" />
                <line x1="110" y1="195" x2="770" y2="195" stroke="#d1cfcc" strokeWidth="1" />

                {/* Vertical drops */}
                <line x1="110" y1="195" x2="110" y2="215" stroke="#d1cfcc" strokeWidth="1" />
                <line x1="330" y1="195" x2="330" y2="215" stroke="#d1cfcc" strokeWidth="1" />
                <line x1="550" y1="195" x2="550" y2="215" stroke="#d1cfcc" strokeWidth="1" />
                <line x1="770" y1="195" x2="770" y2="215" stroke="#d1cfcc" strokeWidth="1" />

                {/* ═══ LEVEL 3 — 4 Directors ═══ */}

                {/* Dir. Consultoría */}
                <rect x="15" y="215" width="190" height="110" rx="10" fill="white" stroke="#e5e3e0" strokeWidth="1" />
                <rect x="16" y="215" width="188" height="26" rx="10" fill="#f3f1ee" />
                <text x="110" y="233" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="700" letterSpacing="1">CONSULTORÍA</text>
                <text x="110" y="258" textAnchor="middle" fill="#1a1918" fontSize="9.5" fontWeight="700">Dir. de Consultoría</text>
                <text x="110" y="273" textAnchor="middle" fill="#8a8784" fontSize="7.5">Tributaria · Financiera · Contable</text>
                <text x="110" y="288" textAnchor="middle" fill="#8a8784" fontSize="7.5">NIC/NIIF · Hacienda pública</text>
                <text x="110" y="303" textAnchor="middle" fill="#8a8784" fontSize="7.5">Estatutos tributarios</text>

                {/* Dir. Tecnología */}
                <rect x="235" y="215" width="190" height="110" rx="10" fill="white" stroke="#0d7d74" strokeWidth="1" />
                <rect x="236" y="215" width="188" height="26" rx="10" fill="#e8f5f3" />
                <text x="330" y="233" textAnchor="middle" fill="#0d7d74" fontSize="7.5" fontWeight="700" letterSpacing="1">TECNOLOGÍA</text>
                <text x="330" y="258" textAnchor="middle" fill="#1a1918" fontSize="9.5" fontWeight="700">Dir. de Tecnología</text>
                <text x="330" y="273" textAnchor="middle" fill="#8a8784" fontSize="7.5">Software · Cloud · IA</text>
                <text x="330" y="288" textAnchor="middle" fill="#8a8784" fontSize="7.5">Tribai.co · Gobia.co</text>
                <text x="330" y="303" textAnchor="middle" fill="#8a8784" fontSize="7.5">DevOps · Datos · Analítica</text>

                {/* Dir. Proyectos */}
                <rect x="455" y="215" width="190" height="110" rx="10" fill="white" stroke="#e5e3e0" strokeWidth="1" />
                <rect x="456" y="215" width="188" height="26" rx="10" fill="#f3f1ee" />
                <text x="550" y="233" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="700" letterSpacing="1">PROYECTOS</text>
                <text x="550" y="258" textAnchor="middle" fill="#1a1918" fontSize="9.5" fontWeight="700">Dir. de Proyectos</text>
                <text x="550" y="273" textAnchor="middle" fill="#8a8784" fontSize="7.5">Formulación · Auditoría</text>
                <text x="550" y="288" textAnchor="middle" fill="#8a8784" fontSize="7.5">Interventoría</text>
                <text x="550" y="303" textAnchor="middle" fill="#8a8784" fontSize="7.5">Modernización organizacional</text>

                {/* Dir. Institucional */}
                <rect x="675" y="215" width="190" height="110" rx="10" fill="white" stroke="#e5e3e0" strokeWidth="1" />
                <rect x="676" y="215" width="188" height="26" rx="10" fill="#f3f1ee" />
                <text x="770" y="233" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="700" letterSpacing="1">INSTITUCIONAL</text>
                <text x="770" y="258" textAnchor="middle" fill="#1a1918" fontSize="9.5" fontWeight="700">Dir. Institucional</text>
                <text x="770" y="273" textAnchor="middle" fill="#8a8784" fontSize="7.5">Gobernanza · Comunicaciones</text>
                <text x="770" y="288" textAnchor="middle" fill="#8a8784" fontSize="7.5">Relaciones sector público</text>
                <text x="770" y="303" textAnchor="middle" fill="#8a8784" fontSize="7.5">Gestión del conocimiento</text>

                {/* ═══ Bottom branding ═══ */}
                <rect x="310" y="360" width="260" height="24" rx="12" fill="#1a1918" />
                <text x="440" y="376" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700" letterSpacing="2">ORGANIGRAMA INPLUX {new Date().getFullYear()}</text>
              </svg>
            </div>

            {/* Department detail cards */}
            <div className="grid sm:grid-cols-2 gap-6 stagger">
              {DEPARTMENTS.map((dept) => (
                <div key={dept.name} className="reveal card">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-9 h-9 rounded-lg bg-teal-soft flex items-center justify-center text-teal">
                      <DeptIcon type={dept.icon} />
                    </span>
                    <div>
                      <h3 className="text-ink font-semibold text-[0.9375rem]">{dept.name}</h3>
                      <p className="text-gray-400 text-[0.75rem] font-medium">{dept.head}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {dept.functions.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-gray-500 text-[0.8125rem] leading-snug">
                        <span className="w-1 h-1 rounded-full bg-teal mt-1.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="fine-rule" />

        {/* ──── ALIADOS / ECOSISTEMA ──── */}
        <section className="py-20 md:py-28">
          <div className="max-w-[1100px] mx-auto px-5 md:px-8">
            <div className="reveal mb-12">
              <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">Ecosistema</p>
              <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4">Aliados estratégicos</h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-[600px]">
                Un ecosistema de empresas especializadas que potencia cada proyecto del Hub.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 stagger">
              {[
                { name: "Fourier", role: "Arquitectura de software, cloud e infraestructura digital", url: "https://fourier.dev/en" },
                { name: "Sistemas Aries", role: "Plataforma ERP financiera modular — +31 años", url: null },
                { name: "Think IT", role: "Ingeniería de software y consultoría tecnológica", url: null },
                { name: "BBD Soluciones", role: "Analítica de datos y soluciones de información", url: null },
                { name: "Alianza IT", role: "Integración tecnológica y servicios TI", url: null },
                { name: "Observatorio de Datos", role: "Datos y análisis para la toma de decisiones", url: "https://datosyanalisis.org/" },
              ].map((ally) => (
                <div key={ally.name} className="reveal border border-border rounded-xl p-5 hover:border-gray-200 hover:shadow-sm transition-all duration-300">
                  <h3 className="text-ink font-semibold text-[0.9375rem] mb-1">{ally.name}</h3>
                  <p className="text-gray-500 text-[0.8125rem] leading-relaxed mb-3">{ally.role}</p>
                  {ally.url && (
                    <a href={ally.url} target="_blank" rel="noopener noreferrer" className="text-teal text-[0.75rem] font-semibold hover:underline">
                      Visitar sitio &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── CTA ──── */}
        <section className="py-20 md:py-28 bg-warm">
          <div className="max-w-[1100px] mx-auto px-5 md:px-8 text-center">
            <div className="reveal max-w-[540px] mx-auto">
              <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-5">
                ¿Listo para trabajar juntos?
              </h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8">
                Conozca cómo INPLUX puede potenciar su organización con consultoría de alto nivel y tecnología propia.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/#contacto" className="btn-dark text-center">Hablemos</Link>
                <Link href="/" className="btn-ghost text-center">Ver servicios</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

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
                <li><Link href="/" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Inicio</Link></li>
                <li><Link href="/nosotros" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Nosotros</Link></li>
                <li><Link href="/#servicios" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Servicios</Link></li>
                <li><Link href="/#contacto" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-ink font-semibold text-[0.8125rem] mb-3.5">Ecosistema</h4>
              <ul className="space-y-2">
                <li><a href="https://tribai.co" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Tribai.co</a></li>
                <li><a href="https://fourier.dev/en" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Fourier</a></li>
                <li><a href="https://datosyanalisis.org/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Observatorio de Datos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-ink font-semibold text-[0.8125rem] mb-3.5">Contacto</h4>
              <ul className="space-y-2 text-gray-500 text-[0.8125rem]">
                <li>Medellín, Antioquia</li>
                <li><a href="tel:+573138893615" className="hover:text-ink transition-colors">(+57) 313 889 36 15</a></li>
                <li><a href="mailto:gerencia@inplux.co" className="hover:text-ink transition-colors">gerencia@inplux.co</a></li>
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
