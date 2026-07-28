"use client";

import Image from "next/image";
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  RefObject,
} from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { portfolio } from "@/content/home";

type SoftwareFactoryExperienceProps = {
  heroCta: ReactNode;
  offerCta: ReactNode;
  pressSection: ReactNode;
  sectorsSection: ReactNode;
};

type FactoryStage = 0 | 1 | 2 | 3 | 4;
type RunPhase = 0 | 1 | 2 | 3;
type SolutionStage = 0 | 1 | 2;

const heroSignalGlyphs = ["/", "{", "}", "<", ">", "01", "→", "·", "+", "[]"] as const;
const heroSignalLetters = {
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  N: ["10001", "11001", "11001", "10101", "10011", "10011", "10001"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
} as const;

const heroSignalWord = "INPLUX";

function beginPointerPress(event: ReactPointerEvent<HTMLButtonElement>) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  event.currentTarget.dataset.pressed = "true";
}

function endPointerPress(event: ReactPointerEvent<HTMLButtonElement>) {
  delete event.currentTarget.dataset.pressed;
}

const solutionStories = [
  {
    label: "Lanzar un producto digital",
    title: "De una oportunidad a una primera versión útil.",
    copy:
      "Definimos el producto, diseñamos la experiencia y construimos una base preparada para aprender y evolucionar.",
    details: ["Alcance visible", "Experiencia propia", "Base preparada para crecer"],
  },
  {
    label: "Mejorar una operación",
    title: "Personas, procesos y datos dentro del mismo sistema.",
    copy:
      "Conectamos lo que hoy vive en herramientas separadas para que la operación sea más clara, trazable y fácil de sostener.",
    details: ["Flujos conectados", "Decisiones trazables", "Información disponible"],
  },
  {
    label: "Automatizar conocimiento",
    title: "El criterio permanece; el trabajo repetitivo disminuye.",
    copy:
      "Convertimos reglas, documentos y tareas repetitivas en flujos verificables, con revisión humana donde importa.",
    details: ["Reglas explícitas", "Fuentes visibles", "Control humano"],
  },
] as const;

const stages = [
  {
    number: "01",
    label: "Su experiencia",
    title: "Diferenciar.",
    copy:
      "Diseñamos una experiencia digital propia, simple para sus usuarios y fiel a la forma en que su organización trabaja.",
    accent: "#15dcc4",
  },
  {
    number: "02",
    label: "Su operación",
    title: "Conectar.",
    copy:
      "Integramos personas, datos, procesos y sistemas para que la operación avance sin depender de tareas aisladas.",
    accent: "#d1cfcc",
  },
  {
    number: "03",
    label: "Fábrica INPLUX",
    title: "Construir.",
    copy:
      "Diseñamos, desarrollamos y probamos en ciclos cortos. Las decisiones permanecen visibles durante todo el recorrido.",
    accent: "#0fb3a1",
  },
  {
    number: "04",
    label: "Software operando",
    title: "Evolucionar.",
    copy:
      "Ponemos una primera versión en producción, medimos lo que ocurre y la mejoramos con evidencia real.",
    accent: "#8ecfc6",
  },
] as const;

const stackLayers = [
  {
    number: "01",
    name: "Experiencia",
    kind: "experience",
    accent: "#15dcc4",
    callouts: ["Recorrido propio", "Usuarios reales"],
  },
  {
    number: "02",
    name: "Operación",
    kind: "operation",
    accent: "#d1cfcc",
    callouts: ["Datos conectados", "Proceso visible"],
  },
  {
    number: "03",
    name: "Fábrica",
    kind: "factory",
    accent: "#0fb3a1",
    callouts: ["Entrega continua", "Revisión contigo"],
  },
  {
    number: "04",
    name: "Producción",
    kind: "production",
    accent: "#8ecfc6",
    callouts: ["En producción", "Mejora continua"],
  },
] as const;

const storyAnchors = [0, 0.18, 0.42, 0.66, 0.9] as const;
const layerPositions = [
  [-150, -50, 50, 150],
  [0, 190, 285, 380],
  [-255, 0, 190, 285],
  [-330, -235, 0, 190],
  [-405, -310, -215, 0],
] as const;

function FactoryLayerArt({
  kind,
  runPhase,
}: {
  kind: (typeof stackLayers)[number]["kind"];
  runPhase: RunPhase;
}) {
  if (kind === "experience") {
    return (
      <div className="factory-evolve-art factory-evolve-art-experience">
        <span className="factory-evolve-art-rail" />
        <span className="factory-evolve-art-block is-wide" />
        <span className="factory-evolve-art-block" />
        <span className="factory-evolve-art-block" />
        <span className="factory-evolve-art-line" />
        <span className="factory-evolve-art-line is-short" />
      </div>
    );
  }

  if (kind === "operation") {
    return (
      <div className="factory-evolve-art factory-evolve-art-operation">
        {Array.from({ length: 7 }, (_, index) => (
          <span key={index} style={{ "--bar": index } as CSSProperties} />
        ))}
      </div>
    );
  }

  if (kind === "factory") {
    return (
      <div className="factory-evolve-art factory-evolve-art-factory">
        <span className="factory-evolve-core">
          <i />
          <i />
          <i />
        </span>
        {Array.from({ length: 9 }, (_, index) => (
          <span className="factory-evolve-module" key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="factory-evolve-art factory-evolve-art-production">
      <div>
        <span>Solicitud / 025</span>
        <strong>{runPhase === 3 ? "Operando" : "Lista para operar"}</strong>
      </div>
      <div className="factory-evolve-status-track">
        {Array.from({ length: 12 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
    </div>
  );
}

function FactoryEvolveMachine({
  stage,
  instant,
  runPhase,
  machineRef,
}: {
  stage: FactoryStage;
  instant: boolean;
  runPhase: RunPhase;
  machineRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={machineRef}
      className="factory-evolve-machine"
      data-stage={stage}
      data-instant={instant ? "true" : "false"}
      data-run={runPhase}
      aria-hidden="true"
    >
      <div className="factory-evolve-machine-label">
        <span />
        Fábrica en vivo
      </div>
      <div className="factory-evolve-dot-grid" />
      <span className="factory-evolve-spine" />

      <div className="factory-evolve-layer-field">
        {stackLayers.map((layer, index) => (
          <div
            className="factory-evolve-layer"
            data-layer={index + 1}
            key={layer.number}
            style={
              {
                "--layer-accent": layer.accent,
                "--layer-z": stackLayers.length - index,
              } as CSSProperties
            }
          >
            <div className="factory-evolve-plane">
              <span className="factory-evolve-plane-edge is-front" />
              <span className="factory-evolve-plane-edge is-right" />
              <div className="factory-evolve-plane-surface">
                <span className="factory-evolve-plane-label">
                  {layer.number} / {layer.name}
                </span>
                <FactoryLayerArt kind={layer.kind} runPhase={runPhase} />
              </div>
            </div>
            <div className="factory-evolve-callout is-left">
              <span />
              {layer.callouts[0]}
            </div>
            <div className="factory-evolve-callout is-right">
              <span />
              {layer.callouts[1]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStepOffset(index: number, stage: FactoryStage) {
  const step = index + 1;

  if (stage === 0) {
    return `calc(27vh + ${index * 2.05}rem)`;
  }

  if (step === stage) return "0px";
  if (step < stage) return `calc(-40vh + ${index * 2.05}rem)`;
  return `calc(40vh - ${(stages.length - 1 - index) * 2.05}rem)`;
}

function getRunLabel(runPhase: RunPhase) {
  if (runPhase === 1) return "Recibiendo solicitud";
  if (runPhase === 2) return "Aplicando reglas";
  if (runPhase === 3) return "Solicitud procesada";
  return "Poner una necesidad en producción";
}

function FactoryEvolveNarrative({
  stage,
  instant,
  runPhase,
  onSelectStage,
  onRun,
}: {
  stage: FactoryStage;
  instant: boolean;
  runPhase: RunPhase;
  onSelectStage: (stage: FactoryStage, instant: boolean) => void;
  onRun: (event: ReactMouseEvent<HTMLButtonElement>) => void;
}) {
  const runLabel = getRunLabel(runPhase);

  return (
    <div
      className="factory-evolve-narrative"
      data-stage={stage}
      data-instant={instant ? "true" : "false"}
    >
      <div className="factory-evolve-intro" aria-hidden={stage !== 0}>
        <p>01 / LA FÁBRICA EN VIVO</p>
        <h2 id="factory-story-title">
          Una fábrica de software creada para <em>evolucionar.</em>
        </h2>
        <span>
          Diseñamos, construimos y operamos software que cambia al ritmo de su
          organización.
        </span>
      </div>

      <span className="factory-evolve-timeline-rail" aria-hidden="true" />

      <div className="factory-evolve-timeline">
        {stages.map((item, index) => {
          const step = (index + 1) as FactoryStage;
          const isActive = stage === step;

          return (
            <article
              className={isActive ? "is-active" : stage > step ? "is-past" : "is-future"}
              key={item.number}
              style={
                {
                  "--step-offset": getStepOffset(index, stage),
                  "--stage-accent": item.accent,
                } as CSSProperties
              }
            >
              <button
                type="button"
                aria-pressed={isActive}
                tabIndex={stage === 0 ? -1 : 0}
                onClick={(event) => onSelectStage(step, event.detail === 0)}
              >
                <span className="factory-evolve-marker" aria-hidden="true" />
                <span>{item.number}</span>
                <strong>{item.label}</strong>
              </button>

              <div className="factory-evolve-step-detail" aria-hidden={!isActive}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                {step === 4 ? (
                  <button
                    type="button"
                    className="factory-evolve-run"
                    onClick={onRun}
                    disabled={!isActive || runPhase === 1 || runPhase === 2}
                    tabIndex={isActive ? 0 : -1}
                  >
                    <span>{runPhase === 3 ? "Probar otra vez" : runLabel}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                ) : null}
                {step === 4 ? (
                  <p className="site-visually-hidden" aria-live="polite">
                    {runLabel}
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function FactoryEvolveMobile({
  runPhase,
  onRun,
}: {
  runPhase: RunPhase;
  onRun: (event: ReactMouseEvent<HTMLButtonElement>) => void;
}) {
  const runLabel = getRunLabel(runPhase);

  return (
    <div className="site-shell factory-evolve-mobile">
      <div className="factory-evolve-mobile-intro">
        <p className="factory-section-index">01 / LA FÁBRICA EN VIVO</p>
        <h2>
          Una fábrica de software creada para <em>evolucionar.</em>
        </h2>
        <p>
          Diseñamos, construimos y operamos software que cambia al ritmo de su
          organización.
        </p>
      </div>

      {stages.map((item, index) => (
        <article
          key={item.number}
          style={{ "--stage-accent": item.accent } as CSSProperties}
        >
          <div className="factory-evolve-mobile-heading">
            <span>{item.number}</span>
            <strong>{item.label}</strong>
          </div>
          <h3>{item.title}</h3>
          <p>{item.copy}</p>
          <div className="factory-evolve-mobile-plane" aria-hidden="true">
            <span>
              {item.number} / {stackLayers[index].name}
            </span>
            <FactoryLayerArt kind={stackLayers[index].kind} runPhase={runPhase} />
          </div>
          {index === stages.length - 1 ? (
            <button
              type="button"
              className="factory-evolve-run"
              onClick={onRun}
              disabled={runPhase === 1 || runPhase === 2}
            >
              <span>{runPhase === 3 ? "Probar otra vez" : runLabel}</span>
              <span aria-hidden="true">→</span>
            </button>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function FactorySignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let animationFrame = 0;
    let visible = true;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let lastFrame = 0;
    const pointer = { x: 0, y: 0, strength: 0 };
    const pointerTarget = { x: 0, y: 0, active: false };
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactViewport = window.matchMedia("(max-width: 700px)");

    const isWordCell = (row: number, column: number, rows: number, columns: number) => {
      const wordWidth = heroSignalWord.length * 6 - 1;
      const wordColumn = column - Math.floor((columns - wordWidth) / 2);
      const letterRow = row - Math.floor((rows - 7) / 2);
      const letterIndex = Math.floor(wordColumn / 6);
      const letterColumn = wordColumn % 6;
      const letter = heroSignalWord[letterIndex] as keyof typeof heroSignalLetters;

      return (
        letterRow >= 0 &&
        letterRow < 7 &&
        letterIndex >= 0 &&
        letterIndex < heroSignalWord.length &&
        letterColumn >= 0 &&
        letterColumn < 5 &&
        heroSignalLetters[letter][letterRow][letterColumn] === "1"
      );
    };

    const draw = (time = 0) => {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#0d0c0c";
      context.fillRect(0, 0, width, height);

      const cellWidth = compactViewport.matches ? 13 : 16;
      const cellHeight = compactViewport.matches ? 16 : 18;
      const columns = Math.ceil(width / cellWidth) + 2;
      const rows = Math.ceil(height / cellHeight) + 2;
      const timeFactor = reducedMotion ? 0 : time * 0.00032;
      const pointerRadius = compactViewport.matches ? 90 : 140;
      context.font = `${compactViewport.matches ? 9 : 10}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const isLetter = isWordCell(row, column, rows, columns);
          const seed = row * 97 + column * 53;
          const wave = Math.sin(timeFactor + column * 0.17 + row * 0.31);
          const pulse = Math.max(0, Math.sin(timeFactor * 0.72 - column * 0.09 + row * 0.2));
          let x = column * cellWidth - cellWidth / 2;
          let y = row * cellHeight - cellHeight / 2 + wave * 0.55;

          if (pointer.strength > 0.001) {
            const deltaX = x - pointer.x;
            const deltaY = y - pointer.y;
            const distance = Math.hypot(deltaX, deltaY);
            if (distance > 0 && distance < pointerRadius) {
              const force = (1 - distance / pointerRadius) * 4 * pointer.strength;
              x += (deltaX / distance) * force;
              y += (deltaY / distance) * force;
            }
          }

          const isSpark = seed % 29 === 0 || seed % 43 === 0;
          const opacity = isLetter
            ? 0.34 + pulse * 0.28
            : isSpark
              ? 0.16 + pulse * 0.18
              : 0.035 + Math.max(0, wave) * 0.035;
          const glyph =
            heroSignalGlyphs[(seed + (isLetter ? 3 : 0)) % heroSignalGlyphs.length];

          context.fillStyle = isLetter || seed % 71 === 0
            ? `rgba(21, 220, 196, ${opacity})`
            : `rgba(235, 239, 235, ${opacity})`;
          context.fillText(glyph, x, y);
        }
      }
    };

    const tick = (time: number) => {
      animationFrame = 0;
      if (!visible) return;
      const frameInterval = compactViewport.matches ? 1000 / 30 : 1000 / 60;
      if (reducedMotion || time - lastFrame >= frameInterval) {
        const frameDelta = Math.min(64, Math.max(frameInterval, time - lastFrame));
        lastFrame = time;
        if (!reducedMotion) {
          const positionFollow = 1 - Math.exp(-frameDelta / 82);
          const strengthFollow = 1 - Math.exp(-frameDelta / 105);
          pointer.x += (pointerTarget.x - pointer.x) * positionFollow;
          pointer.y += (pointerTarget.y - pointer.y) * positionFollow;
          pointer.strength +=
            ((pointerTarget.active ? 1 : 0) - pointer.strength) * strengthFollow;
        }
        draw(time);
      }
      if (!reducedMotion) animationFrame = window.requestAnimationFrame(tick);
    };

    const requestTick = () => {
      if (animationFrame || !visible) return;
      animationFrame = window.requestAnimationFrame(tick);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw(performance.now());
      requestTick();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerTarget.x = event.clientX - rect.left;
      pointerTarget.y = event.clientY - rect.top;
      if (pointer.strength < 0.001) {
        pointer.x = pointerTarget.x;
        pointer.y = pointerTarget.y;
      }
      pointerTarget.active = true;
    };
    const onPointerLeave = () => {
      pointerTarget.active = false;
    };
    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (reducedMotion) {
        pointerTarget.active = false;
        pointer.strength = 0;
      }
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      draw(performance.now());
      requestTick();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          draw(performance.now());
          requestTick();
        } else if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
      },
      { rootMargin: "10% 0px 10% 0px", threshold: 0.01 },
    );

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);
    resize();

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="factory-hero-signal-canvas" aria-hidden="true" />;
}

function FactoryHeroLab() {
  return (
    <div
      className="factory-hero-signal"
      aria-label="Campo interactivo de señales de la fábrica de software"
    >
      <FactorySignalCanvas />
      <p className="factory-hero-signal-hint">
        Mueve el puntero para alterar la señal
      </p>
    </div>
  );
}

function FactoryExperienceRailSet() {
  return (
    <div className="factory-proof-set">
      <div className="factory-proof-item is-metric">
        <strong>Trayectoria aplicada</strong>
        <span>experiencia acumulada por el equipo</span>
      </div>
      <div className="factory-proof-item is-logo is-emblem">
        <Image
          src="/brand/clients/experience-01.png"
          alt="Parque Arví Corporación"
          width={379}
          height={394}
          sizes="72px"
        />
      </div>
      <div className="factory-proof-item is-logo is-think">
        <Image
          src="/brand/clients/experience-02.png"
          alt="Think IT"
          width={577}
          height={140}
          sizes="190px"
        />
      </div>
      <div className="factory-proof-item is-logo">
        <Image
          src="/brand/clients/experience-03.png"
          alt="Corporación Interuniversitaria de Servicios"
          width={447}
          height={151}
          sizes="190px"
        />
      </div>
      <div className="factory-proof-item is-logo is-emblem">
        <Image
          src="/brand/clients/experience-04.png"
          alt="Provincia"
          width={473}
          height={512}
          sizes="72px"
        />
      </div>
      <div className="factory-proof-item is-logo">
        <Image
          src="/brand/clients/experience-05.png"
          alt="Rentan"
          width={388}
          height={104}
          sizes="190px"
        />
      </div>
      <div className="factory-proof-item is-logo">
        <Image
          src="/brand/clients/experience-06.png"
          alt="Empresa de Desarrollo Urbano"
          width={367}
          height={138}
          sizes="190px"
        />
      </div>
      <div className="factory-proof-item is-logo">
        <Image
          src="/brand/clients/experience-07.png"
          alt="Sistemas Aries"
          width={223}
          height={113}
          sizes="170px"
        />
      </div>
      <div className="factory-proof-item is-logo is-emblem">
        <Image
          src="/brand/clients/experience-08.png"
          alt="Alcaldía de Vegachí"
          width={192}
          height={180}
          sizes="72px"
        />
      </div>
      <div className="factory-proof-item is-statement">
        <span>Producto · tecnología · operación</span>
        <strong>Software preparado para evolucionar.</strong>
      </div>
    </div>
  );
}

function FactoryExperienceRail() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateRailBoundaries = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const maximumScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    setCanScrollPrevious(viewport.scrollLeft > 2);
    setCanScrollNext(viewport.scrollLeft < maximumScroll - 2);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    updateRailBoundaries();
    const resizeObserver = new ResizeObserver(updateRailBoundaries);
    resizeObserver.observe(viewport);
    viewport.addEventListener("scroll", updateRailBoundaries, { passive: true });

    return () => {
      resizeObserver.disconnect();
      viewport.removeEventListener("scroll", updateRailBoundaries);
    };
  }, [updateRailBoundaries]);

  const moveRail = (
    direction: -1 | 1,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const withoutMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches || event.detail === 0;
    viewport.scrollBy({
      left: direction * Math.max(280, viewport.clientWidth * 0.66),
      behavior: withoutMotion ? "auto" : "smooth",
    });
  };

  return (
    <section className="factory-proof" aria-label="Experiencia y trayectoria">
      <div className="factory-proof-topline">
        <span>Experiencia que ya está en movimiento</span>
        <div className="factory-proof-controls">
          <button
            type="button"
            aria-label="Ver experiencias anteriores"
            aria-controls="factory-proof-carousel"
            disabled={!canScrollPrevious}
            onClick={(event) => moveRail(-1, event)}
            onPointerDown={beginPointerPress}
            onPointerUp={endPointerPress}
            onPointerCancel={endPointerPress}
            onPointerLeave={endPointerPress}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Ver más experiencias"
            aria-controls="factory-proof-carousel"
            disabled={!canScrollNext}
            onClick={(event) => moveRail(1, event)}
            onPointerDown={beginPointerPress}
            onPointerUp={endPointerPress}
            onPointerCancel={endPointerPress}
            onPointerLeave={endPointerPress}
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={viewportRef}
        id="factory-proof-carousel"
        className="factory-proof-viewport"
        role="region"
        aria-label="Carrusel de experiencia"
        tabIndex={0}
      >
        <div className="factory-proof-track">
          <FactoryExperienceRailSet />
        </div>
      </div>
    </section>
  );
}

function FactorySolutionShowcase() {
  const [solutionStage, setSolutionStage] = useState<SolutionStage>(0);
  const [instant, setInstant] = useState(false);
  const instantTimerRef = useRef<number | null>(null);
  const activeSolution = solutionStories[solutionStage];

  useEffect(
    () => () => {
      if (instantTimerRef.current) window.clearTimeout(instantTimerRef.current);
    },
    [],
  );

  const selectSolution = (
    nextStage: SolutionStage,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    if (instantTimerRef.current) window.clearTimeout(instantTimerRef.current);
    const withoutMotion =
      event.detail === 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setInstant(withoutMotion);
    setSolutionStage(nextStage);
    if (withoutMotion) {
      instantTimerRef.current = window.setTimeout(() => setInstant(false), 80);
    }
  };

  return (
    <section
      id="que-construimos"
      className="factory-solutions"
      data-instant={instant}
      aria-labelledby="factory-solutions-title"
    >
      <div className="factory-solutions-copy">
        <p className="factory-section-index">02 / QUÉ CONSTRUIMOS</p>
        <h2 id="factory-solutions-title">
          Una fábrica diseñada para ayudarte a <em>construir.</em>
        </h2>

        <div className="factory-solutions-list">
          {solutionStories.map((solution, index) => {
            const isActive = solutionStage === index;

            return (
              <article
                className={`t-acc${isActive ? " is-active" : ""}`}
                data-open={isActive}
                key={solution.label}
              >
                <button
                  className="t-acc-head"
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={`factory-solution-${index + 1}`}
                  onClick={(event) =>
                    selectSolution(index as SolutionStage, event)
                  }
                  onPointerDown={beginPointerPress}
                  onPointerUp={endPointerPress}
                  onPointerCancel={endPointerPress}
                  onPointerLeave={endPointerPress}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{solution.label}</strong>
                  <i aria-hidden="true">→</i>
                </button>
                <div
                  id={`factory-solution-${index + 1}`}
                  className="factory-solution-detail t-acc-panel"
                  aria-hidden={!isActive}
                >
                  <div className="factory-solution-detail-inner t-acc-panel-inner">
                    <div className="factory-solution-detail-content">
                      <p>{solution.copy}</p>
                      <ul>
                        {solution.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div
        className="factory-solution-visual"
        data-stage={solutionStage}
        data-instant={instant}
        aria-label={`Demostración: ${activeSolution.label}`}
      >
        <div className="factory-solution-grid" aria-hidden="true" />
        <div className="factory-solution-topline">
          <span>INPLUX / SISTEMA ACTIVO</span>
          <span>
            <i />
            Operando
          </span>
        </div>
        <div className="factory-solution-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="factory-solution-window">
          <div className="factory-solution-window-head">
            <span>{String(solutionStage + 1).padStart(2, "0")}</span>
            <span>{activeSolution.label}</span>
          </div>
          <div className="factory-solution-window-body" key={activeSolution.label}>
            <strong>{activeSolution.title}</strong>
            <div className="factory-solution-window-rows" aria-hidden="true">
              {activeSolution.details.map((detail, index) => (
                <span key={detail} style={{ "--row": index } as CSSProperties}>
                  <i />
                  {detail}
                  <b>Visible</b>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="factory-solution-status" aria-hidden="true">
          <span>Entrada</span>
          <i />
          <span>Sistema</span>
          <i />
          <span>Resultado</span>
        </div>
        <p className="site-visually-hidden" aria-live="polite">
          {activeSolution.title}
        </p>
      </div>
    </section>
  );
}

const featuredProductNames = new Set(["Tribai", "Gobia", "Kelsen"]);

function FactoryProductProof() {
  const featuredProducts = portfolio.filter((product) =>
    featuredProductNames.has(product.name),
  );

  return (
    <section
      id="proyectos"
      className="factory-product-proof"
      aria-labelledby="factory-product-proof-title"
    >
      <div className="factory-product-proof-heading">
        <div>
          <p className="factory-section-index">04 / TRABAJO REAL</p>
          <h2 id="factory-product-proof-title">
            La fábrica funciona porque sus productos ya se pueden <em>usar.</em>
          </h2>
        </div>
        <a href="#contacto">
          Cuéntanos qué necesitas construir <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="factory-product-proof-grid">
        {featuredProducts.map((product, index) => (
          <article
            className={`factory-product-card is-${product.name.toLowerCase()}`}
            key={product.name}
          >
            <div className="factory-product-card-visual" aria-hidden="true">
              <div className="factory-product-browser">
                <div>
                  <span />
                  <span />
                  <span />
                  <b>{product.href?.replace("https://", "").replace("/", "")}</b>
                </div>
                <div className="factory-product-browser-body">
                  <span className="factory-product-browser-label">
                    {String(index + 1).padStart(2, "0")} / EN PRODUCCIÓN
                  </span>
                  <strong>{product.name}</strong>
                  <div>
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </div>
            </div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            {product.href ? (
              <a href={product.href} target="_blank" rel="noreferrer">
                Explorar producto <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function FactoryBuildSystem() {
  const buildSignals = [
    ["Especificación visible", "El alcance y las decisiones quedan escritos."],
    ["Construcción conectada", "Diseño, código y datos avanzan sobre la misma base."],
    ["Pruebas continuas", "Cada cambio se revisa antes de entrar en producción."],
    ["Despliegue controlado", "El producto sale con responsables y trazabilidad."],
    ["Mejora con evidencia", "El uso real indica qué construir después."],
  ] as const;

  return (
    <section
      id="como-trabajamos"
      className="factory-build-system"
      data-header-theme="dark"
      aria-labelledby="factory-build-system-title"
    >
      <div className="factory-build-copy">
        <p className="factory-section-index">06 / CÓMO TRABAJAMOS</p>
        <h2 id="factory-build-system-title">
          Un sistema para construir con <em>ritmo</em> y con criterio.
        </h2>
        <p>
          La tecnología acelera el trabajo. Las decisiones importantes siguen teniendo
          contexto, responsables y revisión humana.
        </p>
        <ul>
          {buildSignals.map(([title, copy]) => (
            <li key={title}>
              <span aria-hidden="true">✓</span>
              <div>
                <strong>{title}</strong>
                <small>{copy}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="factory-build-visual" aria-label="Flujo de construcción de software">
        <div className="factory-build-backdrop" aria-hidden="true" />
        <div className="factory-build-console">
          <div className="factory-build-console-head">
            <span>BUILD / INPLUX</span>
            <span>
              <i />
              Verificado
            </span>
          </div>
          <div className="factory-build-console-summary">
            <span>Producto</span>
            <strong>Primera versión útil</strong>
            <b>Lista para operar</b>
          </div>
          <div className="factory-build-console-log" aria-hidden="true">
            <span>
              <i>01</i>
              Especificación aprobada
              <b>completa</b>
            </span>
            <span>
              <i>02</i>
              Componentes construidos
              <b>completos</b>
            </span>
            <span>
              <i>03</i>
              Pruebas automáticas
              <b>aprobadas</b>
            </span>
            <span>
              <i>04</i>
              Producción
              <b>operando</b>
            </span>
          </div>
          <div className="factory-build-console-progress" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => (
              <i key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FactoryPrinciples({ cta }: { cta: ReactNode }) {
  const principles = [
    ["01", "Primero, una versión útil.", "Algo concreto para probar, usar y mejorar."],
    ["02", "Criterio humano.", "Responsables visibles en las decisiones sensibles."],
    ["03", "Pruebas antes de producir.", "Calidad integrada dentro del recorrido."],
    ["04", "Evolución continua.", "El uso real orienta cada siguiente paso."],
  ] as const;

  return (
    <section className="factory-principle-field">
      <div className="factory-principle-heading">
        <p className="factory-section-index">07 / PRINCIPIOS</p>
        <h2>
          Construida para avanzar sin perder el <em>control.</em>
        </h2>
      </div>

      <div className="factory-principle-grid">
        {principles.map(([number, title, copy]) => (
          <article key={number}>
            <span>{number}</span>
            <i aria-hidden="true">→</i>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>

      <div className="factory-final-invitation">
        <p>De una necesidad concreta a un producto que ya puede trabajar.</p>
        <h2>
          Construyamos el software que tu operación necesita <em>ahora.</em>
        </h2>
        {cta}
      </div>
    </section>
  );
}

export function SoftwareFactoryExperience({
  heroCta,
  offerCta,
  pressSection,
  sectorsSection,
}: SoftwareFactoryExperienceProps) {
  const [stage, setStage] = useState<FactoryStage>(0);
  const [instant, setInstant] = useState(false);
  const [runPhase, setRunPhase] = useState<RunPhase>(0);
  const storyRef = useRef<HTMLElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const instantTimerRef = useRef<number | null>(null);
  const runTimersRef = useRef<number[]>([]);

  const clearRunTimers = useCallback(() => {
    runTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    runTimersRef.current = [];
  }, []);

  const selectStage = useCallback((nextStage: FactoryStage, withoutMotion = false) => {
    if (instantTimerRef.current) window.clearTimeout(instantTimerRef.current);
    setInstant(withoutMotion);
    setStage(nextStage);
    if (nextStage !== 4) {
      clearRunTimers();
      setRunPhase(0);
    }
    if (withoutMotion) {
      instantTimerRef.current = window.setTimeout(() => setInstant(false), 80);
    }
  }, [clearRunTimers]);

  const selectStageFromControl = useCallback(
    (nextStage: FactoryStage, withoutMotion = false) => {
      const story = storyRef.current;
      if (!story) {
        selectStage(nextStage, true);
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const storyTop = window.scrollY + story.getBoundingClientRect().top;
      const storyRange = Math.max(1, story.offsetHeight - window.innerHeight);
      const targetTop =
        storyTop + storyRange * storyAnchors[nextStage];

      if (withoutMotion || prefersReducedMotion) {
        selectStage(nextStage, true);
        const previousScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo({ top: targetTop, behavior: "auto" });
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
        return;
      }

      window.scrollTo({ top: targetTop, behavior: "smooth" });
    },
    [selectStage],
  );

  const runRequest = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      clearRunTimers();
      if (event.detail === 0) {
        if (instantTimerRef.current) window.clearTimeout(instantTimerRef.current);
        setInstant(true);
        setRunPhase(3);
        instantTimerRef.current = window.setTimeout(() => setInstant(false), 80);
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setRunPhase(3);
        return;
      }

      setRunPhase(1);
      runTimersRef.current = [
        window.setTimeout(() => setRunPhase(2), 620),
        window.setTimeout(() => setRunPhase(3), 1260),
      ];
    },
    [clearRunTimers],
  );

  useEffect(() => {
    const story = storyRef.current;
    const machine = machineRef.current;
    if (!story || !machine) return;

    let animationFrame = 0;
    let renderedStage = -1;
    let storyTop = 0;
    let storyBottom = 0;
    let storyRange = 1;
    let heightScale = 1;
    let storyIsNear = false;
    let lastStoryIsActive = false;
    let lastStoryPosition = Number.NaN;
    const reduceMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const layers = machine.querySelectorAll<HTMLElement>(
      ".factory-evolve-layer",
    );

    const updateEvolveStory = () => {
      animationFrame = 0;

      const headerLine = 64;
      const storyIsActive =
        window.scrollY + headerLine >= storyTop &&
        window.scrollY + headerLine < storyBottom;
      if (storyIsActive !== lastStoryIsActive) {
        lastStoryIsActive = storyIsActive;
        document.body.classList.toggle("factory-evolve-header", storyIsActive);
      }

      if (reduceMotionQuery.matches || !storyIsNear) return;

      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY - storyTop) / storyRange),
      );

      let lowerState = 0;
      for (let index = 0; index < storyAnchors.length - 1; index += 1) {
        if (progress >= storyAnchors[index]) lowerState = index;
      }
      lowerState = Math.min(lowerState, storyAnchors.length - 2);

      const lowerAnchor = storyAnchors[lowerState];
      const upperAnchor = storyAnchors[lowerState + 1];
      const segmentProgress =
        progress >= storyAnchors.at(-1)!
          ? 1
          : (progress - lowerAnchor) / Math.max(0.001, upperAnchor - lowerAnchor);
      const easedProgress =
        segmentProgress * segmentProgress * (3 - 2 * segmentProgress);
      const storyPosition =
        progress >= storyAnchors.at(-1)!
          ? 4
          : lowerState + easedProgress;
      const nextStage = Math.min(4, Math.max(0, Math.round(storyPosition))) as FactoryStage;

      if (nextStage !== renderedStage) {
        renderedStage = nextStage;
        selectStage(nextStage);
      }

      if (
        Number.isFinite(lastStoryPosition) &&
        Math.abs(storyPosition - lastStoryPosition) < 0.001
      ) {
        return;
      }
      lastStoryPosition = storyPosition;

      const lowerPositionIndex = Math.floor(storyPosition);
      const upperPositionIndex = Math.min(4, Math.ceil(storyPosition));
      const positionMix = storyPosition - lowerPositionIndex;

      layers.forEach((layer, index) => {
        const from = layerPositions[lowerPositionIndex][index];
        const to = layerPositions[upperPositionIndex][index];
        const position = (from + (to - from) * positionMix) * heightScale;
        layer.style.transform =
          `translate3d(-50%, -50%, 0) translate3d(0, ${position}px, 0)`;
      });
    };

    const requestUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateEvolveStory);
    };

    const measureStory = () => {
      const storyRect = story.getBoundingClientRect();
      const storyHeight = story.offsetHeight;
      storyTop = window.scrollY + storyRect.top;
      storyBottom = storyTop + storyHeight;
      storyRange = Math.max(1, storyHeight - window.innerHeight);
      heightScale = Math.min(
        1,
        Math.max(0.72, machine.getBoundingClientRect().height / 760),
      );
      requestUpdate();
    };

    const resizeObserver = new ResizeObserver(measureStory);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        storyIsNear = entry.isIntersecting;
        machine.dataset.active = storyIsNear ? "true" : "false";
        if (storyIsNear) {
          lastStoryPosition = Number.NaN;
          requestUpdate();
        }
      },
      { rootMargin: "100% 0px 100% 0px", threshold: 0 },
    );
    resizeObserver.observe(story);
    resizeObserver.observe(machine);
    intersectionObserver.observe(story);
    measureStory();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", measureStory);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", measureStory);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.body.classList.remove("factory-evolve-header");
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [selectStage]);

  useEffect(
    () => () => {
      clearRunTimers();
      if (instantTimerRef.current) window.clearTimeout(instantTimerRef.current);
    },
    [clearRunTimers],
  );

  return (
    <div className="factory-home">
      <section
        className="factory-hero"
        data-header-theme="dark"
        aria-labelledby="factory-hero-title"
      >
        <div className="factory-hero-grid" aria-hidden="true" />
        <div className="site-shell factory-hero-inner">
          <div className="factory-hero-copy">
            <p className="factory-kicker">
              <span>INPLUX</span>
              <span>Fábrica de software</span>
            </p>
            <h1 id="factory-hero-title">
              <span>Software que mueve</span>
              <br />
              <em>tu operación.</em>
            </h1>
            <p className="factory-hero-lead">
              Convertimos una necesidad concreta en una primera versión útil, la ponemos a
              trabajar y seguimos mejorándola contigo.
            </p>
            <div className="factory-hero-actions">
              {heroCta}
              <a href="#fabrica-en-vivo">
                Ver la fábrica en acción
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <div className="factory-hero-note">
            <span />
            <p>Una fábrica preparada para construir, operar y mejorar contigo.</p>
            <a href="#fabrica-en-vivo">
              Explorar el sistema <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <FactoryHeroLab />
        <div className="factory-hero-meta">
          <span>Medellín / Colombia</span>
          <span>Producto · Tecnología · Operación</span>
        </div>
      </section>

      <FactoryExperienceRail />

      <section
        ref={storyRef}
        id="fabrica-en-vivo"
        className="factory-scrolly factory-evolve-story"
        data-header-theme="dark"
        aria-label="La fábrica en vivo"
      >
        <div className="factory-evolve-track">
          <div className="factory-evolve-sticky">
            <div className="factory-evolve-layout">
              <FactoryEvolveNarrative
                stage={stage}
                instant={instant}
                runPhase={runPhase}
                onSelectStage={selectStageFromControl}
                onRun={runRequest}
              />
              <FactoryEvolveMachine
                stage={stage}
                instant={instant}
                runPhase={runPhase}
                machineRef={machineRef}
              />
            </div>
          </div>
        </div>

        <FactoryEvolveMobile runPhase={runPhase} onRun={runRequest} />
      </section>

      <FactorySolutionShowcase />
      {sectorsSection}
      <FactoryProductProof />
      {pressSection}
      <FactoryBuildSystem />
      <FactoryPrinciples cta={offerCta} />
    </div>
  );
}
