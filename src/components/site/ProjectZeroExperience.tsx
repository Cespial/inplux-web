"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type Scenario = {
  id: "manual" | "product" | "internal" | "citizen";
  label: string;
  fragments: readonly [string, string, string, string];
  output: string;
  outcome: string;
  surface: readonly [string, string, string];
};

type ProjectZeroExperienceProps = {
  heroCta: ReactNode;
};

type TransformationCanvasProps = {
  animateChange?: boolean;
  intro?: boolean;
  scenario: Scenario;
  stage: number;
};

const scenarios: readonly Scenario[] = [
  {
    id: "manual",
    label: "Una operación manual",
    fragments: ["Hojas de cálculo", "Mensajes", "Aprobaciones", "Reprocesos"],
    output: "Centro de operaciones",
    outcome: "El trabajo, las decisiones y la trazabilidad viven en un solo lugar.",
    surface: ["Pendientes", "En curso", "Trazabilidad"],
  },
  {
    id: "product",
    label: "Un producto nuevo",
    fragments: ["Oportunidad", "Usuarios", "Supuestos", "Reglas"],
    output: "Producto digital validable",
    outcome: "Una primera versión útil para aprender con personas reales y evolucionar.",
    surface: ["Experiencia", "Aprendizajes", "Siguiente versión"],
  },
  {
    id: "internal",
    label: "Una herramienta interna",
    fragments: ["Equipos", "Permisos", "Datos dispersos", "Reportes"],
    output: "Espacio de trabajo operativo",
    outcome: "Cada equipo encuentra la información y las acciones que necesita.",
    surface: ["Equipos", "Flujos", "Información"],
  },
  {
    id: "citizen",
    label: "Un servicio al ciudadano",
    fragments: ["Personas", "Trámite", "Documentos", "Canales"],
    output: "Servicio digital accesible",
    outcome: "Un recorrido claro para solicitar, consultar y completar un servicio.",
    surface: ["Solicitud", "Seguimiento", "Orientación"],
  },
] as const;

const storySteps = [
  {
    number: "01",
    label: "Entender",
    title: "Empezamos por lo que ocurre, no por una tecnología.",
    copy:
      "Personas, reglas, datos y fricciones: trazamos el problema completo antes de construir.",
  },
  {
    number: "02",
    label: "Definir",
    title: "Convertimos contexto en una primera versión que sí se puede construir.",
    copy:
      "Acordamos alcance, riesgos y señales de éxito contigo. Lo importante queda dentro; lo demás encuentra su momento.",
  },
  {
    number: "03",
    label: "Construir y probar",
    title: "Producto, diseño, ingeniería y calidad avanzan como un solo sistema.",
    copy:
      "La tecnología acelera investigación, prototipos y pruebas. INPLUX y tu equipo dirigen cada decisión.",
  },
  {
    number: "04",
    label: "Operar y evolucionar",
    title: "El resultado entra a trabajar.",
    copy:
      "Lo ponemos en operación, lo documentamos y seguimos aprendiendo para decidir contigo qué mejorar.",
  },
] as const;

function TransformationCanvas({
  animateChange = false,
  intro = false,
  scenario,
  stage,
}: TransformationCanvasProps) {
  const boundedStage = Math.min(Math.max(stage, 0), storySteps.length - 1);

  return (
    <div
      className="project-zero-canvas"
      data-stage={boundedStage}
      data-intro={intro ? "true" : "false"}
      aria-hidden="true"
    >
      <div className="project-zero-canvas-topline">
        <span>Entrada · {scenario.label}</span>
        <span>
          {storySteps[boundedStage].number} / 04 · {storySteps[boundedStage].label}
        </span>
      </div>

      <div
        className={`project-zero-canvas-content${animateChange ? " is-entering" : ""}`}
        key={scenario.id}
      >
        <div className="project-zero-input-zone">
          <p>Señales del problema</p>
          <ul>
            {scenario.fragments.map((fragment) => (
              <li key={fragment}>
                <span aria-hidden="true" />
                {fragment}
              </li>
            ))}
          </ul>
        </div>

        <div className="project-zero-engine" aria-hidden="true">
          <div className="project-zero-route">
            <span className="project-zero-route-track" />
            <span className="project-zero-route-fill" />
          </div>

          <div className="project-zero-map">
            <span>Contexto</span>
            <span>Prioridad</span>
            <span>Primera versión</span>
          </div>

          <div className="project-zero-lanes">
            {["Producto", "Diseño", "Ingeniería", "Calidad"].map((lane) => (
              <div key={lane}>
                <span>{lane}</span>
                <i />
              </div>
            ))}
          </div>

          <div className="project-zero-checkpoint">
            <span aria-hidden="true">✓</span>
            <p>
              Revisión
              <strong>INPLUX + tu equipo</strong>
            </p>
          </div>
        </div>

        <div className="project-zero-output-zone">
          <p>Ejemplo de salida</p>
          <div className="project-zero-output-screen">
            <div className="project-zero-output-toolbar">
              <span />
              <span />
              <span />
            </div>
            <strong>{scenario.output}</strong>
            <p>{scenario.outcome}</p>
            <div className="project-zero-output-grid">
              {scenario.surface.map((item, index) => (
                <span key={item} data-accent={index === 0 ? "true" : "false"}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ol className="project-zero-stage-rail">
        {storySteps.map((step, index) => (
          <li key={step.number} data-active={index <= boundedStage ? "true" : "false"}>
            <span>{step.number}</span>
            {step.label}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ProjectZeroExperience({ heroCta }: ProjectZeroExperienceProps) {
  const [activeScenario, setActiveScenario] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [animateScenario, setAnimateScenario] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);
  const activeScenarioRef = useRef(0);
  const animatePillRef = useRef(false);
  const changeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scenario = scenarios[activeScenario];

  const movePill = useCallback((index: number, animate: boolean) => {
    const pill = pillRef.current;
    const tab = tabRefs.current[index];
    if (!pill || !tab) return;

    if (!animate) {
      const previousTransition = pill.style.transition;
      pill.style.transition = "none";
      pill.style.transform = `translateX(${tab.offsetLeft}px)`;
      pill.style.width = `${tab.offsetWidth}px`;
      void pill.offsetWidth;
      pill.style.transition = previousTransition;
      return;
    }

    pill.style.transform = `translateX(${tab.offsetLeft}px)`;
    pill.style.width = `${tab.offsetWidth}px`;
  }, []);

  useLayoutEffect(() => {
    activeScenarioRef.current = activeScenario;
    movePill(activeScenario, animatePillRef.current);
    animatePillRef.current = true;
  }, [activeScenario, movePill]);

  useEffect(() => {
    const tabs = tabsRef.current;
    if (!tabs) return;

    const snapPillToSelection = () => movePill(activeScenarioRef.current, false);
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(snapPillToSelection);

    observer?.observe(tabs);
    window.addEventListener("resize", snapPillToSelection);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", snapPillToSelection);
    };
  }, [movePill]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const nextStep = Number((entry.target as HTMLElement).dataset.step);
          if (Number.isInteger(nextStep)) setActiveStep(nextStep);
        });
      },
      {
        rootMargin: "-43% 0px -43% 0px",
        threshold: 0,
      },
    );

    stepRefs.current.forEach((step) => {
      if (step) observer.observe(step);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (changeTimerRef.current) clearTimeout(changeTimerRef.current);
    },
    [],
  );

  const chooseScenario = (index: number, animate: boolean) => {
    if (index === activeScenario) return;

    if (changeTimerRef.current) clearTimeout(changeTimerRef.current);
    animatePillRef.current = animate;
    activeScenarioRef.current = index;
    setAnimateScenario(animate);
    setActiveScenario(index);

    if (animate) {
      changeTimerRef.current = setTimeout(() => {
        setAnimateScenario(false);
        changeTimerRef.current = null;
      }, 260);
    }
  };

  const handleSelectorKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % scenarios.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + scenarios.length) % scenarios.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = scenarios.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    chooseScenario(nextIndex, false);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <>
      <section className="project-zero-hero" aria-labelledby="hero-title">
        <div className="site-shell project-zero-hero-shell">
          <div className="project-zero-hero-topline">
            <p className="project-zero-eyebrow">INPLUX · FÁBRICA DE SOFTWARE</p>
            <p className="project-zero-ready">
              <span aria-hidden="true" /> Lista para empezar con contexto, no con requisitos
            </p>
          </div>

          <div className="project-zero-promise">
            <h1 id="hero-title">
              Tu problema entra aquí. Lo convertimos en <em>software que opera.</em>
            </h1>

            <div className="project-zero-intro">
              <p>
                Entendemos tu operación, construimos la solución y la mejoramos contigo.
                La tecnología acelera el trabajo; las decisiones las tomamos contigo.
              </p>
              <div className="project-zero-actions">
                {heroCta}
                <a className="project-zero-secondary-link" href="#proyecto-cero">
                  Ver cómo lo convertimos <span aria-hidden="true">↓</span>
                </a>
              </div>
              <p className="project-zero-note">
                <span aria-hidden="true" /> No necesitas tener la solución definida.
              </p>
            </div>
          </div>

          <div className="project-zero-lab">
            <div className="project-zero-lab-heading">
              <div>
                <p>Proyecto Cero</p>
                <span>La página responde al reto que eliges.</span>
              </div>
              <span>Demostración interactiva · 01</span>
            </div>

            <div className="project-zero-selector-heading">
              <h2 id="project-zero-question">¿Qué necesitas transformar?</h2>
              <p>Elige un punto de partida. No es un formulario.</p>
            </div>

            <div
              ref={tabsRef}
              className="t-tabs project-zero-selector"
              role="tablist"
              aria-labelledby="project-zero-question"
            >
              <span ref={pillRef} className="t-tabs-pill" aria-hidden="true" />
              {scenarios.map((item, index) => (
                <button
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  className="t-tab"
                  id={`project-zero-tab-${item.id}`}
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-controls="project-zero-panel"
                  aria-selected={activeScenario === index}
                  tabIndex={activeScenario === index ? 0 : -1}
                  onClick={(event) => chooseScenario(index, event.detail !== 0)}
                  onKeyDown={(event) => handleSelectorKeyDown(event, index)}
                >
                  <span>0{index + 1}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div
              id="project-zero-panel"
              className="project-zero-tabpanel"
              role="tabpanel"
              aria-labelledby={`project-zero-tab-${scenario.id}`}
              tabIndex={0}
            >
              <p className="site-visually-hidden">
                {scenario.label}. La salida ilustrativa es {scenario.output}.{" "}
                {scenario.outcome}
              </p>
              <TransformationCanvas
                animateChange={animateScenario}
                intro
                scenario={scenario}
                stage={3}
              />
            </div>

            <p className="site-visually-hidden" aria-live="polite" aria-atomic="true">
              Vista actualizada: {scenario.label}. {scenario.output}.
            </p>
          </div>
        </div>
      </section>

      <section
        id="proyecto-cero"
        className="project-zero-story"
        aria-labelledby="project-zero-story-title"
      >
        <div className="site-shell">
          <div className="project-zero-story-heading">
            <p className="site-eyebrow">PROYECTO CERO · CÓMO FUNCIONA</p>
            <h2 id="project-zero-story-title">
              Así se convierte un problema en <em>software que opera.</em>
            </h2>
            <p>
              La tecnología trabaja en varios frentes. El criterio, la validación y la
              responsabilidad permanecen bajo dirección humana.
            </p>
          </div>

          <div className="project-zero-story-layout">
            <div className="project-zero-story-visual">
              <TransformationCanvas scenario={scenario} stage={activeStep} />
            </div>

            <ol className="project-zero-story-steps">
              {storySteps.map((step, index) => (
                <li
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  key={step.number}
                  data-step={index}
                  data-active={activeStep === index ? "true" : "false"}
                  aria-current={activeStep === index ? "step" : undefined}
                >
                  <div className="project-zero-step-copy">
                    <p>
                      {step.number} · {step.label}
                    </p>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                    {index === 0 ? (
                      <div className="project-zero-context-list" aria-label="Contexto elegido">
                        {scenario.fragments.map((fragment) => (
                          <span key={fragment}>{fragment}</span>
                        ))}
                      </div>
                    ) : null}
                    {index === storySteps.length - 1 ? (
                      <a href="#proyectos">
                        Ver un resultado real: Tribai <span aria-hidden="true">↓</span>
                      </a>
                    ) : null}
                  </div>

                  <div className="project-zero-mobile-canvas">
                    <TransformationCanvas scenario={scenario} stage={index} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
