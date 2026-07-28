"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import styles from "./home.module.css";
import ultraStyles from "./FactoryScrollyUltra.module.css";

const steps = [
  {
    index: "01",
    label: "TU RETO",
    title: "Entender",
    copy: "Observamos el contexto, escuchamos a las personas y hacemos visible el problema que realmente vale la pena resolver.",
    signals: ["PERSONAS / CONTEXTO", "REGLAS / FRICCIONES"],
  },
  {
    index: "02",
    label: "EL PRODUCTO",
    title: "Dar forma",
    copy: "Convertimos lo aprendido en prioridades, flujos y una experiencia que se puede probar antes de escalar.",
    signals: ["FLUJOS / DECISIONES", "INTERFAZ / PROTOTIPO"],
  },
  {
    index: "03",
    label: "LA FÁBRICA",
    title: "Construir",
    copy: "Diseño, ingeniería e inteligencia aplicada trabajan como un solo sistema, con revisión humana en cada punto crítico.",
    signals: ["DISEÑO / INGENIERÍA", "IA / REVISIÓN HUMANA"],
  },
  {
    index: "04",
    label: "EN PRODUCCIÓN",
    title: "Evolucionar",
    copy: "Lanzamos una versión útil, observamos cómo funciona y decidimos contigo qué mejorar a partir de evidencia real.",
    signals: ["DATOS / APRENDIZAJE", "OPERACIÓN / EVOLUCIÓN"],
  },
] as const;

const chapterOffsets = [0.642, 1.139, 1.8844, 2.5055] as const;
const compactChapterOffsets = [0.22, 0.58, 0.94, 1.3] as const;
const introPositions = [-156, -52, 52, 156] as const;
const basePaintOrder = [3, 2, 1, 0] as const;

function IsometricCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <g>
      <path
        className={ultraStyles.cardDepthShadow}
        d="M94 269L312 143L530 269L312 421Z"
        transform="translate(0 18)"
      />
      <path className={styles.cardSideLeft} d="M94 269L312 395V421L94 295Z" />
      <path className={styles.cardSideRight} d="M312 395L530 269V295L312 421Z" />
      <path className={styles.cardBaseLine} d="M94 295L312 421L530 295" />
      <path
        className={styles.cardSideHatch}
        d="M116 282V307M138 295V320M160 307V332M182 320V345M204 333V358M226 345V370M248 358V383M270 371V396M292 383V408"
      />
      <path className={styles.cardTop} d="M94 269L312 143L530 269L312 395Z" />
      <path className={styles.cardTopInset} d="M107 269L312 151L517 269L312 387Z" />
      <path
        className={ultraStyles.activeRim}
        d="M94 269L312 143L530 269L312 395Z"
      />
      <g
        className={styles.cardBlueprint}
        transform="matrix(.384615 -.221154 .588235 .338235 112 269)"
      >
        {children}
      </g>
    </g>
  );
}

function PlaneStamp({
  command,
  index,
}: {
  command: string;
  index: string;
}) {
  return (
    <>
      <g className={`${styles.blueprintMeta} ${ultraStyles.blueprintMeta}`}>
        <text
          className={`${styles.blueprintCommand} ${ultraStyles.blueprintCommand}`}
          x="24"
          y="316"
        >
          {command}
        </text>
        <text
          className={`${styles.blueprintIndex} ${ultraStyles.blueprintIndex}`}
          x="488"
          y="316"
          textAnchor="end"
        >
          INPLUX / {index}
        </text>
      </g>
      <g
        className={`${styles.blueprintPlatform} ${ultraStyles.blueprintPlatform}`}
        transform="translate(48 47)"
      >
        <g className={styles.blueprintMark} transform="translate(0 2) scale(.5)">
          <rect x="0" y="36" width="42" height="13" rx="6.5" />
          <rect x="21" y="18" width="42" height="13" rx="6.5" />
          <rect x="42" y="0" width="42" height="13" rx="6.5" />
        </g>
        <text x="56" y="17">INPLUX</text>
        <text x="56" y="39">PLATFORM</text>
      </g>
    </>
  );
}

function ChallengePlane() {
  return (
    <IsometricCard>
      <rect className={styles.blueprintFrame} x="8" y="8" width="504" height="324" rx="4" />
      <path d="M78 86L206 52L332 95L444 62" />
      <path d="M78 86L132 220L270 270L430 222L444 62" />
      <path d="M132 220L252 150L430 222M206 52L252 150L332 95" />
      <circle cx="78" cy="86" r="18" />
      <circle cx="206" cy="52" r="13" />
      <circle cx="332" cy="95" r="16" />
      <circle cx="444" cy="62" r="11" />
      <circle className={styles.blueprintAccent} cx="252" cy="150" r="23" />
      <circle cx="132" cy="220" r="14" />
      <circle cx="270" cy="270" r="17" />
      <circle cx="430" cy="222" r="13" />
      <path className={styles.blueprintDash} d="M58 297H462" />
      <PlaneStamp command="MAP:CONTEXT" index="01" />
    </IsometricCard>
  );
}

function ProductPlane() {
  return (
    <IsometricCard>
      <rect className={styles.blueprintFrame} x="8" y="8" width="504" height="324" rx="4" />
      <rect x="40" y="42" width="440" height="34" rx="3" />
      <circle cx="61" cy="59" r="4" />
      <circle cx="76" cy="59" r="4" />
      <path d="M326 59H452" />
      <rect className={styles.blueprintAccent} x="40" y="96" width="278" height="194" rx="3" />
      <rect x="338" y="96" width="142" height="77" rx="3" />
      <rect x="338" y="193" width="142" height="97" rx="3" />
      <path d="M65 127H211M65 151H280M65 242H154" />
      <rect x="65" y="181" width="78" height="32" rx="16" />
      <path className={styles.blueprintDash} d="M363 123H452M363 218H452M363 241H432" />
      <PlaneStamp command="DESIGN:PRODUCT" index="02" />
    </IsometricCard>
  );
}

function FactoryPlane() {
  return (
    <IsometricCard>
      <rect className={styles.blueprintFrame} x="8" y="8" width="504" height="324" rx="4" />
      <path d="M48 170H164M356 170H472" />
      <path className={styles.blueprintDash} d="M106 92V248M414 92V248" />
      <rect x="48" y="120" width="116" height="100" rx="5" />
      <rect x="356" y="120" width="116" height="100" rx="5" />
      <rect className={styles.blueprintAccent} x="190" y="86" width="140" height="168" rx="7" />
      <circle cx="260" cy="170" r="42" />
      <circle cx="260" cy="170" r="18" />
      <path d="M211 113H309M211 227H309" />
      <path d="M74 144H138M74 168H138M74 192H118M382 144H446M382 168H446M382 192H426" />
      <circle cx="164" cy="170" r="7" />
      <circle cx="356" cy="170" r="7" />
      <PlaneStamp command="BUILD:SYSTEM" index="03" />
    </IsometricCard>
  );
}

function ProductionPlane() {
  return (
    <IsometricCard>
      <rect className={styles.blueprintFrame} x="8" y="8" width="504" height="324" rx="4" />
      <path d="M52 286H470M52 56V286" />
      <path className={styles.blueprintDash} d="M52 228H470M52 170H470M52 112H470" />
      <path className={styles.blueprintArea} d="M52 258L128 228L202 240L276 154L350 180L426 92L470 112V286H52Z" />
      <path className={styles.blueprintAccent} d="M52 258L128 228L202 240L276 154L350 180L426 92L470 112" />
      <circle cx="128" cy="228" r="7" />
      <circle cx="202" cy="240" r="7" />
      <circle cx="276" cy="154" r="7" />
      <circle cx="350" cy="180" r="7" />
      <circle className={styles.blueprintAccent} cx="426" cy="92" r="10" />
      <PlaneStamp command="RUN:SOFTWARE" index="04" />
    </IsometricCard>
  );
}

function LayerAnnotations({ signals }: { signals: readonly [string, string] }) {
  const splitSignals = signals.map((signal) => signal.split(" / ")) as [
    [string, string],
    [string, string],
  ];

  return (
    <g
      className={`${styles.layerAnnotations} ${ultraStyles.layerAnnotations}`}
      transform="translate(0 99)"
    >
      <g>
        <circle className={ultraStyles.annotationMarker} cx="21" cy="134" r="5" />
        <path className={ultraStyles.annotationPath} d="M27 134H92L176 184" />
        <text
          className={`${styles.annotationLabelDesktop} ${ultraStyles.annotationText}`}
          x="34"
          y="119"
        >
          {signals[0]}
        </text>
        <text
          className={`${styles.annotationLabelMobile} ${ultraStyles.annotationText} ${ultraStyles.annotationTextMobile}`}
          x="34"
          y="96"
        >
          <tspan x="34">{splitSignals[0][0]}</tspan>
          <tspan x="34" dy="21">{splitSignals[0][1]}</tspan>
        </text>
      </g>
      <g>
        <circle className={ultraStyles.annotationMarker} cx="596" cy="314" r="5" />
        <path className={ultraStyles.annotationPath} d="M590 314H530L452 268" />
        <text
          className={`${styles.annotationLabelDesktop} ${ultraStyles.annotationText}`}
          x="582"
          y="299"
          textAnchor="end"
        >
          {signals[1]}
        </text>
        <text
          className={`${styles.annotationLabelMobile} ${ultraStyles.annotationText} ${ultraStyles.annotationTextMobile}`}
          x="582"
          y="276"
          textAnchor="end"
        >
          <tspan x="582">{splitSignals[1][0]}</tspan>
          <tspan x="582" dy="21">{splitSignals[1][1]}</tspan>
        </text>
      </g>
    </g>
  );
}

const planeLayers = [
  { Plane: ChallengePlane, signals: steps[0].signals },
  { Plane: ProductPlane, signals: steps[1].signals },
  { Plane: FactoryPlane, signals: steps[2].signals },
  { Plane: ProductionPlane, signals: steps[3].signals },
] as const;

export function FactoryScrolly() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<Array<SVGGElement | null>>([]);
  const timelineBeamRef = useRef<HTMLSpanElement>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [instantSelection, setInstantSelection] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 767px)");
    let frame = 0;
    let measureFrame = 0;
    let lastStep = -2;
    let lastTimelineProgress = Number.NaN;
    let isMeasured = false;
    let disposed = false;
    const lastPositions = Array<number>(4).fill(Number.NaN);
    const metrics = {
      sectionTop: 0,
      sectionHeight: 0,
      viewport: 1,
      travel: 1,
      chapterStarts: chapterOffsets.map(() => 0),
      compact: compactQuery.matches,
    };

    const positionForState = (state: number, layer: number) => {
      if (state === 0) return introPositions[layer];
      const focus = state - 1;
      if (layer === focus) return 0;
      const distance = layer - focus;
      return Math.sign(distance) * (320 + 60 * (Math.abs(distance) - 1));
    };

    const placeLayer = (layer: number, position: number) => {
      const element = layerRefs.current[layer];
      if (!element) return;
      // Integer-only vertical translation keeps the isometric geometry stable:
      // no rotation, scale or subpixel skew is introduced while scrolling.
      const stablePosition = Math.round(position);
      if (lastPositions[layer] === stablePosition) return;
      lastPositions[layer] = stablePosition;
      element.setAttribute("transform", `translate(0 ${stablePosition})`);
    };

    const update = () => {
      frame = 0;
      if (!isMeasured) return;

      if (motionQuery.matches) {
        introPositions.forEach((position, layer) => placeLayer(layer, position));
        if (timelineBeamRef.current && lastTimelineProgress !== 1) {
          lastTimelineProgress = 1;
          timelineBeamRef.current.style.transform =
            metrics.compact ? "scaleX(1)" : "scaleY(1)";
        }
        if (lastStep !== -1) {
          lastStep = -1;
          setActiveStep(-1);
        }
        return;
      }

      const localY = Math.min(
        metrics.travel,
        Math.max(0, window.scrollY - metrics.sectionTop),
      );
      const nextStep = metrics.chapterStarts.reduce(
        (current, chapter, index) => (localY >= chapter ? index : current),
        -1,
      );
      const smoothstep = (value: number) => {
        const clamped = Math.min(1, Math.max(0, value));
        return clamped * clamped * (3 - 2 * clamped);
      };
      const transitionHalf = 0.21 * metrics.viewport;
      const visualProgress = metrics.chapterStarts.reduce(
        (progress, chapter) =>
          progress +
          smoothstep(
            (localY - (chapter - transitionHalf)) / (transitionHalf * 2),
          ),
        0,
      );
      const visualFrom = Math.floor(visualProgress);
      const visualTo = Math.min(4, visualFrom + 1);
      const visualMix = visualProgress - visualFrom;
      const timelineProgress = Math.max(0, Math.min(1, visualProgress / 4));
      if (
        timelineBeamRef.current &&
        Math.abs(timelineProgress - lastTimelineProgress) > 0.001
      ) {
        lastTimelineProgress = timelineProgress;
        timelineBeamRef.current.style.transform =
          metrics.compact
            ? `scaleX(${timelineProgress})`
            : `scaleY(${timelineProgress})`;
      }

      for (let layer = 0; layer < 4; layer += 1) {
        const from = positionForState(visualFrom, layer);
        const to = positionForState(visualTo, layer);
        placeLayer(layer, from + (to - from) * visualMix);
      }
      if (nextStep !== lastStep) {
        lastStep = nextStep;
        setActiveStep(nextStep);
      }
    };

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      metrics.sectionTop = window.scrollY + rect.top;
      metrics.sectionHeight = rect.height;
      metrics.viewport = viewport;
      metrics.travel = Math.max(1, rect.height - viewport);
      metrics.compact = compactQuery.matches;
      const activeOffsets = metrics.compact
        ? compactChapterOffsets
        : chapterOffsets;
      metrics.chapterStarts = activeOffsets.map(
        (chapter) => chapter * viewport,
      );
      isMeasured = true;
      lastTimelineProgress = Number.NaN;
      lastPositions.fill(Number.NaN);
      update();
    };

    const scheduleMeasure = () => {
      if (disposed || measureFrame) return;
      measureFrame = window.requestAnimationFrame(() => {
        measureFrame = 0;
        measure();
      });
    };

    const onScroll = () => {
      if (motionQuery.matches) return;
      const scrollY = window.scrollY;
      if (
        isMeasured &&
        (scrollY < metrics.sectionTop - metrics.viewport ||
          scrollY > metrics.sectionTop + metrics.sectionHeight)
      ) {
        return;
      }
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const onMotionChange = () => {
      update();
    };

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(section);
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) scheduleMeasure();
      },
      { rootMargin: "100% 0px" },
    );
    intersectionObserver.observe(section);

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    window.visualViewport?.addEventListener("resize", scheduleMeasure);
    motionQuery.addEventListener("change", onMotionChange);
    compactQuery.addEventListener("change", scheduleMeasure);
    void document.fonts?.ready.then(scheduleMeasure);
    return () => {
      disposed = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleMeasure);
      window.visualViewport?.removeEventListener("resize", scheduleMeasure);
      motionQuery.removeEventListener("change", onMotionChange);
      compactQuery.removeEventListener("change", scheduleMeasure);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      if (measureFrame) window.cancelAnimationFrame(measureFrame);
    };
  }, []);

  const goToStep = (index: number, instant = false) => {
    const section = sectionRef.current;
    if (!section) return;
    if (instant) {
      setInstantSelection(true);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setInstantSelection(false));
      });
    }
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const viewport = window.innerHeight;
    const compact = window.matchMedia("(max-width: 767px)").matches;
    const activeOffsets = compact ? compactChapterOffsets : chapterOffsets;
    const localY = (activeOffsets[index] + 0.08) * viewport;
    window.scrollTo({
      top: sectionTop + localY,
      behavior: instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  const paintOrder =
    activeStep < 0
      ? [...basePaintOrder]
      : [...basePaintOrder.filter((layer) => layer !== activeStep), activeStep];

  return (
    <section
      ref={sectionRef}
      id="fabrica-en-vivo"
      className={`${styles.scrolly} ${ultraStyles.scrollyUltra}`}
      data-active={activeStep}
      data-instant={instantSelection ? "true" : undefined}
      aria-labelledby="factory-story-title"
    >
      <div className={styles.scrollySticky}>
        <div className={styles.scrollyGrid}>
          <div className={styles.storyColumn}>
            <p className={ultraStyles.demoDisclosure}>
              <span aria-hidden="true" />
              Demostración interactiva · datos ilustrativos
            </p>
            <div className={`${styles.storyIntro}${activeStep < 0 ? ` ${styles.isVisible}` : ""}`}>
              <p className={styles.eyebrow}>01 / LA FÁBRICA EN VIVO</p>
              <h2 id="factory-story-title">
                Software construido para <em>evolucionar.</em>
              </h2>
              <p>
                No ensamblamos pantallas aisladas. Construimos un sistema en el que contexto,
                producto e ingeniería avanzan juntos hasta poner software útil en operación.
              </p>
            </div>

            <div className={styles.stepCopy} aria-hidden="true">
              {steps.map((step, index) => (
                <article
                  className={`${styles.stepDetail}${
                    activeStep === index ? ` ${styles.isVisible}` : ""
                  }`}
                  key={step.index}
                >
                  <p className={styles.stepKicker}>
                    {step.index} / {step.label}
                  </p>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>

            <ol className={styles.storyTranscript}>
              {steps.map((step) => (
                <li key={step.index}>
                  <h3>
                    {step.index} / {step.label}: {step.title}
                  </h3>
                  <p>{step.copy}</p>
                </li>
              ))}
            </ol>
            <p className={styles.storyStatus} aria-live="polite" aria-atomic="true">
              {activeStep < 0
                ? "Introducción a la fábrica"
                : `Etapa ${steps[activeStep].index} de ${steps.length}: ${steps[activeStep].label}. ${steps[activeStep].title}.`}
            </p>

            <div className={styles.storyTimeline} aria-label="Etapas de la fábrica">
              <span ref={timelineBeamRef} className={styles.timelineBeam} aria-hidden="true" />
              {steps.map((step, index) => (
                <button
                  className={activeStep === index ? styles.isActive : ""}
                  type="button"
                  tabIndex={activeStep === index ? -1 : 0}
                  onClick={(event) => goToStep(index, event.detail === 0)}
                  aria-current={activeStep === index ? "step" : undefined}
                  data-position={
                    activeStep < 0
                      ? "future"
                      : index < activeStep
                        ? "past"
                        : index === activeStep
                          ? "active"
                          : "future"
                  }
                  style={{
                    "--timeline-y":
                      activeStep >= 0 && index < activeStep
                        ? `${5.4 + index * 2.75}rem`
                        : index === activeStep
                          ? "calc(54dvh - 5rem)"
                        : `calc(100dvh - ${3 + (steps.length - 1 - index) * 2.75}rem)`,
                  } as CSSProperties}
                  key={step.index}
                >
                  <span className={styles.timelineMarker} aria-hidden="true" />
                  <b>{step.index}</b>
                  {step.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sceneColumn} aria-hidden="true">
            <div className={styles.dotField} />
            <span className={ultraStyles.sceneDisclosure}>
              Demo / 04 etapas
            </span>
            <div className={styles.scene}>
              <svg
                className={styles.stackSvg}
                viewBox="0 0 624 538"
                preserveAspectRatio="xMidYMid meet"
                shapeRendering="geometricPrecision"
                aria-hidden="true"
              >
                {paintOrder.map((layerIndex) => {
                  const layer = planeLayers[layerIndex];
                  const Plane = layer.Plane;
                  return (
                    <g
                      ref={(element) => {
                        layerRefs.current[layerIndex] = element;
                      }}
                      className={`${styles.stackLayer} ${ultraStyles.stackLayerUltra}`}
                      data-layer={layerIndex}
                      data-state={
                        activeStep < 0
                          ? "all"
                          : activeStep === layerIndex
                            ? "active"
                            : "inactive"
                      }
                      transform={`translate(0 ${introPositions[layerIndex]})`}
                      key={layerIndex}
                    >
                      <Plane />
                      <LayerAnnotations signals={layer.signals} />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
