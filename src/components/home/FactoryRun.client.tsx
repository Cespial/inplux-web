"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import styles from "./FactoryRun.module.css";

type ItemState =
  | "approved"
  | "active"
  | "review"
  | "blocked"
  | "queued"
  | "ready";

type FactoryPhase = {
  code: string;
  id: string;
  title: string;
  status: string;
  statusTone: ItemState;
  summary: string;
  progress: number;
  boardLabel: string;
  boardNote: string;
  owner: string;
  ownerInitials: string;
  gate: string;
  milestone: string;
  updated: string;
  metrics: readonly {
    label: string;
    value: string;
    detail: string;
  }[];
  workItems: readonly {
    id: string;
    type: string;
    title: string;
    detail: string;
    state: ItemState;
    stateLabel: string;
    owner: string;
  }[];
  activity: readonly {
    initials: string;
    actor: string;
    action: string;
    time: string;
    state: ItemState;
  }[];
  command: string;
};

const factoryPhases = [
  {
    code: "01",
    id: "CTX-07",
    title: "Contexto",
    status: "ALINEADO",
    statusTone: "approved",
    summary:
      "Unimos conversaciones, restricciones y evidencia para que el resultado tenga una definición compartida.",
    progress: 84,
    boardLabel: "Evidencia del contexto",
    boardNote: "4 elementos · 1 requiere decisión",
    owner: "Cristian Espinal",
    ownerInitials: "CE",
    gate: "Resultado compartido",
    milestone: "Definición / 19 jul",
    updated: "09:12 COT",
    metrics: [
      { label: "Actores", value: "12", detail: "mapeados" },
      { label: "Reglas", value: "18", detail: "trazadas" },
      { label: "Fricciones", value: "06", detail: "priorizadas" },
    ],
    workItems: [
      {
        id: "CTX-12",
        type: "BRIEF",
        title: "Resultado que debe cambiar",
        detail: "Reducir de 11 a 4 días el alta de una solicitud completa.",
        state: "approved",
        stateLabel: "Aprobado",
        owner: "CE",
      },
      {
        id: "CTX-15",
        type: "PERSONAS",
        title: "Mapa de actores y autoridad",
        detail: "Ciudadanía, revisión técnica y aprobación jurídica conectadas.",
        state: "approved",
        stateLabel: "Trazado",
        owner: "ME",
      },
      {
        id: "CTX-18",
        type: "FRICCIÓN",
        title: "Validación de identidad",
        detail: "Definir excepción para documentos con lectura incompleta.",
        state: "review",
        stateLabel: "Revisión",
        owner: "LP",
      },
      {
        id: "CTX-21",
        type: "EVIDENCIA",
        title: "Umbral de éxito",
        detail: "80% completa el flujo sin asistencia en la primera sesión.",
        state: "ready",
        stateLabel: "Listo",
        owner: "AG",
      },
    ],
    activity: [
      {
        initials: "ME",
        actor: "María E.",
        action: "conectó 3 reglas al flujo de validación",
        time: "08:58",
        state: "approved",
      },
      {
        initials: "LP",
        actor: "Laura P.",
        action: "solicitó criterio jurídico en CTX-18",
        time: "08:41",
        state: "review",
      },
      {
        initials: "CE",
        actor: "Cristian E.",
        action: "fijó el resultado y su umbral",
        time: "Ayer",
        state: "ready",
      },
    ],
    command: "inplux context lock --outcome service-adoption",
  },
  {
    code: "02",
    id: "PRD-18",
    title: "Producto",
    status: "VALIDANDO",
    statusTone: "active",
    summary:
      "Hacemos visible la solución antes de construirla: flujos, decisiones y prototipos que las personas pueden probar.",
    progress: 68,
    boardLabel: "Plan de producto",
    boardNote: "4 historias · sesión 03 en curso",
    owner: "Ana Gómez",
    ownerInitials: "AG",
    gate: "Flujo comprensible",
    milestone: "Prototipo / 22 jul",
    updated: "11:46 COT",
    metrics: [
      { label: "Flujos", value: "04", detail: "modelados" },
      { label: "Pruebas", value: "09", detail: "completadas" },
      { label: "Claridad", value: "8.7", detail: "sobre 10" },
    ],
    workItems: [
      {
        id: "PRD-31",
        type: "FLUJO",
        title: "Radicar una solicitud",
        detail: "Ingreso, validación y confirmación en un recorrido único.",
        state: "approved",
        stateLabel: "Validado",
        owner: "AG",
      },
      {
        id: "PRD-34",
        type: "PROTOTIPO",
        title: "Bandeja de seguimiento",
        detail: "Estado, próximos pasos y evidencia visible para cada caso.",
        state: "active",
        stateLabel: "Probando",
        owner: "SM",
      },
      {
        id: "PRD-37",
        type: "DECISIÓN",
        title: "Recuperación de una solicitud",
        detail: "Dos alternativas abiertas después de pruebas con 5 personas.",
        state: "review",
        stateLabel: "Decidir",
        owner: "CE",
      },
      {
        id: "PRD-40",
        type: "CONTENIDO",
        title: "Mensajes de validación",
        detail: "Lenguaje claro revisado; pendiente control de accesibilidad.",
        state: "queued",
        stateLabel: "En cola",
        owner: "LP",
      },
    ],
    activity: [
      {
        initials: "SM",
        actor: "Santiago M.",
        action: "publicó el prototipo 0.8",
        time: "11:46",
        state: "active",
      },
      {
        initials: "AG",
        actor: "Ana G.",
        action: "cerró 3 hallazgos de usabilidad",
        time: "10:22",
        state: "approved",
      },
      {
        initials: "CE",
        actor: "Cristian E.",
        action: "agendó decisión para PRD-37",
        time: "09:54",
        state: "review",
      },
    ],
    command: "inplux prototype test --flow citizen-onboarding",
  },
  {
    code: "03",
    id: "BLD-42",
    title: "Build",
    status: "EN ENSAMBLE",
    statusTone: "active",
    summary:
      "Diseño e ingeniería trabajan sobre el mismo sistema, con agentes especializados y revisión humana en cada gate.",
    progress: 57,
    boardLabel: "Cambios en integración",
    boardNote: "3 cambios · CI ejecutando",
    owner: "Mateo Ríos",
    ownerInitials: "MR",
    gate: "Calidad verificable",
    milestone: "Candidate / 25 jul",
    updated: "14:08 COT",
    metrics: [
      { label: "Cambios", value: "38", detail: "integrados" },
      { label: "Cobertura", value: "92%", detail: "rutas críticas" },
      { label: "Agentes", value: "04", detail: "supervisados" },
    ],
    workItems: [
      {
        id: "PR-184",
        type: "MERGE REQUEST",
        title: "feat/intake-validation",
        detail: "17 archivos · +426 −118 · commit a91e2f7",
        state: "active",
        stateLabel: "CI 7/9",
        owner: "MR",
      },
      {
        id: "BLD-46",
        type: "CONTRATO",
        title: "Schema de radicación v3",
        detail: "Compatibilidad, permisos y respuestas de error verificadas.",
        state: "approved",
        stateLabel: "Aprobado",
        owner: "JV",
      },
      {
        id: "BLD-51",
        type: "CALIDAD",
        title: "Lectura por teclado del formulario",
        detail: "Falla de orden de foco detectada en el paso Documentos.",
        state: "blocked",
        stateLabel: "Bloquea",
        owner: "SM",
      },
      {
        id: "BLD-55",
        type: "REVISIÓN",
        title: "Aprobación humana de cambios",
        detail: "Producto revisa alcance antes de habilitar el merge.",
        state: "queued",
        stateLabel: "Asignado",
        owner: "AG",
      },
    ],
    activity: [
      {
        initials: "JV",
        actor: "Juan V.",
        action: "aprobó el contrato de servicio",
        time: "14:08",
        state: "approved",
      },
      {
        initials: "QA",
        actor: "Quality agent",
        action: "reportó bloqueo de teclado en BLD-51",
        time: "13:52",
        state: "blocked",
      },
      {
        initials: "MR",
        actor: "Mateo R.",
        action: "solicitó revisión humana del merge",
        time: "13:31",
        state: "review",
      },
    ],
    command: "inplux build run --quality-gates strict",
  },
  {
    code: "04",
    id: "RLS-09",
    title: "Release",
    status: "LISTO",
    statusTone: "ready",
    summary:
      "Publicamos con evidencia, observabilidad y una ruta de reversión clara. Producción también es parte del producto.",
    progress: 96,
    boardLabel: "Operación del release",
    boardNote: "Candidate 09 · aprobación registrada",
    owner: "Laura Pérez",
    ownerInitials: "LP",
    gate: "Producción segura",
    milestone: "Release / 26 jul",
    updated: "16:32 COT",
    metrics: [
      { label: "Gates", value: "08/08", detail: "aprobados" },
      { label: "Errores", value: "0.08%", detail: "últimos 30 min" },
      { label: "Respuesta", value: "184ms", detail: "p95" },
    ],
    workItems: [
      {
        id: "RLS-09",
        type: "ARTEFACTO",
        title: "Candidate 2026.07.26-rc.3",
        detail: "SHA 55c9d11 · imagen firmada · SBOM adjunto.",
        state: "approved",
        stateLabel: "Firmado",
        owner: "LP",
      },
      {
        id: "DEP-28",
        type: "DESPLIEGUE",
        title: "Producción · región BOG",
        detail: "100% disponible · 3 réplicas saludables.",
        state: "ready",
        stateLabel: "Saludable",
        owner: "MR",
      },
      {
        id: "OBS-14",
        type: "OBSERVABILIDAD",
        title: "SLO del flujo de radicación",
        detail: "99.96% disponibilidad · sin regresiones detectadas.",
        state: "active",
        stateLabel: "En vivo",
        owner: "JV",
      },
      {
        id: "RBK-03",
        type: "REVERSIÓN",
        title: "Snapshot y procedimiento",
        detail: "Último ensayo completado en 02:18.",
        state: "approved",
        stateLabel: "Verificado",
        owner: "CE",
      },
    ],
    activity: [
      {
        initials: "CE",
        actor: "Cristian E.",
        action: "autorizó el paso a producción",
        time: "16:32",
        state: "ready",
      },
      {
        initials: "LP",
        actor: "Laura P.",
        action: "firmó el artefacto RLS-09",
        time: "16:21",
        state: "approved",
      },
      {
        initials: "MR",
        actor: "Mateo R.",
        action: "verificó la ruta de reversión",
        time: "15:48",
        state: "approved",
      },
    ],
    command: "inplux release --production --human-approved",
  },
] as const satisfies readonly FactoryPhase[];

function stateGlyph(state: ItemState) {
  if (state === "approved" || state === "ready") return "✓";
  if (state === "blocked") return "!";
  if (state === "review") return "?";
  if (state === "active") return "•";
  return "–";
}

export function FactoryRun() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [instantSelection, setInstantSelection] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [showMobileScrollCue, setShowMobileScrollCue] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const activeViewBodyRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const instantTimerRef = useRef<number | null>(null);
  const activePhase = factoryPhases[activeIndex];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new ResizeObserver(([entry]) => {
      setIsCompact(entry.contentRect.width <= 650);
    });

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (instantTimerRef.current !== null) {
        window.clearTimeout(instantTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const viewBody = activeViewBodyRef.current;

    if (!viewBody || !isCompact) return;

    const syncScrollCue = () => {
      const isScrollable =
        viewBody.scrollHeight > viewBody.clientHeight + 8;
      setShowMobileScrollCue(isScrollable && viewBody.scrollTop < 8);
    };

    viewBody.addEventListener("scroll", syncScrollCue, { passive: true });

    const observer = new ResizeObserver(syncScrollCue);
    observer.observe(viewBody);
    const initialFrame = window.requestAnimationFrame(syncScrollCue);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      viewBody.removeEventListener("scroll", syncScrollCue);
      observer.disconnect();
    };
  }, [activeIndex, isCompact]);

  const activateTab = (index: number, moveFocus = false) => {
    if (moveFocus) {
      setInstantSelection(true);
      if (instantTimerRef.current !== null) {
        window.clearTimeout(instantTimerRef.current);
      }
      instantTimerRef.current = window.setTimeout(() => {
        setInstantSelection(false);
        instantTimerRef.current = null;
      }, 0);
    }

    setActiveIndex(index);
    if (moveFocus) tabRefs.current[index]?.focus();
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    let nextIndex: number | null = null;

    if (
      (isCompact && event.key === "ArrowRight") ||
      (!isCompact && event.key === "ArrowDown")
    ) {
      nextIndex = (currentIndex + 1) % factoryPhases.length;
    } else if (
      (isCompact && event.key === "ArrowLeft") ||
      (!isCompact && event.key === "ArrowUp")
    ) {
      nextIndex =
        (currentIndex - 1 + factoryPhases.length) % factoryPhases.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = factoryPhases.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    activateTab(nextIndex, true);
  };

  return (
    <div
      id="factory-run"
      ref={rootRef}
      className={styles.factoryRun}
      role="region"
      aria-label="Factory Run de INPLUX. Selecciona una fase para inspeccionar su ejecución."
      data-instant={instantSelection ? "true" : undefined}
    >
      <header className={styles.topbar}>
        <span className={styles.brand}>
          <svg aria-hidden="true" viewBox="0 0 16 16">
            <path d="M2.5 2.5h4v4h-4zM9.5 2.5h4v4h-4zM2.5 9.5h4v4h-4zM9.5 9.5h4v4h-4z" />
          </svg>
          INPLUX FACTORY
        </span>
        <span className={styles.demoFlag}>
          <i aria-hidden="true" />
          <strong>DEMOSTRACIÓN INTERACTIVA</strong>
          <span aria-hidden="true">·</span>
          <small>DATOS ILUSTRATIVOS</small>
        </span>
        <span className={styles.runMeta}>
          <span>RUN IX-0718</span>
          <b aria-label="Responsable Cristian Espinal">CE</b>
        </span>
      </header>

      <div className={styles.workspace}>
        <nav className={styles.phaseRail} aria-label="Navegación de Factory Run">
          <div className={styles.railProject}>
            <span>PROYECTO</span>
            <strong>Portal de licencias</strong>
            <small>IX-0718 · EN EJECUCIÓN</small>
          </div>
          <p className={styles.railLabel}>FASES DE ENTREGA</p>
          <div
            className={styles.phaseTabs}
            role="tablist"
            aria-label="Fases de la fábrica"
            aria-orientation={isCompact ? "horizontal" : "vertical"}
          >
            {factoryPhases.map((phase, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={phase.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`factory-run-tab-${phase.id}`}
                  className={styles.phaseTab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={
                    isActive ? `factory-run-panel-${phase.id}` : undefined
                  }
                  tabIndex={isActive ? 0 : -1}
                  data-active={isActive ? "true" : "false"}
                  onClick={() => activateTab(index)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  <span className={styles.phaseNumber}>{phase.code}</span>
                  <span className={styles.phaseTabCopy}>
                    <strong>{phase.title}</strong>
                    <small>{phase.id}</small>
                  </span>
                  <i aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <div className={styles.railStatus}>
            <i aria-hidden="true" />
            <span>RUN ACTIVO</span>
          </div>
        </nav>

        <div className={styles.panelRegion}>
          <section
            key={activePhase.id}
            id={`factory-run-panel-${activePhase.id}`}
            className={styles.phasePanel}
            role="tabpanel"
            aria-labelledby={`factory-run-tab-${activePhase.id}`}
            data-active="true"
            tabIndex={!isCompact ? 0 : -1}
          >
                <header className={styles.viewHeader}>
                  <p>
                    <span>Proyecto</span>
                    <i aria-hidden="true">/</i>
                    <span>IX-0718</span>
                    <i aria-hidden="true">/</i>
                    <span>Fase {activePhase.code}</span>
                    <i aria-hidden="true">/</i>
                    <strong>{activePhase.id}</strong>
                  </p>
                  <span
                    className={styles.statusPill}
                    data-state={activePhase.statusTone}
                  >
                    <i aria-hidden="true" />
                    {activePhase.status}
                  </span>
                </header>

                <div
                  ref={activeViewBodyRef}
                  className={styles.viewBody}
                  role={isCompact ? "region" : undefined}
                  aria-label={
                    isCompact
                      ? `Detalle desplazable de la fase ${activePhase.title}`
                      : undefined
                  }
                  tabIndex={isCompact ? 0 : undefined}
                >
                  <div className={styles.primaryView}>
                    <div className={styles.phaseIntro}>
                      <div>
                        <p>INPLUX FACTORY · FASE {activePhase.code}</p>
                        <h3>{activePhase.title}</h3>
                        <span>{activePhase.id}</span>
                      </div>
                      <div className={styles.phaseContext}>
                        <p>{activePhase.summary}</p>
                        <div className={styles.phaseOwner}>
                          <span aria-hidden="true">
                            {activePhase.ownerInitials}
                          </span>
                          <p>
                            <small>RESPONSABLE</small>
                            <strong>{activePhase.owner}</strong>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={styles.gateProgress}
                      role="progressbar"
                      aria-label={`Avance del gate ${activePhase.gate}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={activePhase.progress}
                    >
                      <p>
                        <span>GATE · {activePhase.gate}</span>
                        <strong>{activePhase.progress}%</strong>
                      </p>
                      <i aria-hidden="true">
                        <span
                          style={{
                            transform: `scaleX(${activePhase.progress / 100})`,
                          }}
                        />
                      </i>
                    </div>

                    <dl className={styles.metrics}>
                      {activePhase.metrics.map((metric) => (
                        <div key={metric.label}>
                          <dt>{metric.label}</dt>
                          <dd>
                            <strong>{metric.value}</strong>
                            <span>{metric.detail}</span>
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <section
                      className={styles.workBoard}
                      aria-labelledby={`factory-board-${activePhase.id}`}
                    >
                      <header>
                        <div>
                          <h4 id={`factory-board-${activePhase.id}`}>
                            {activePhase.boardLabel}
                          </h4>
                          <p>{activePhase.boardNote}</p>
                        </div>
                        <span>3 PRIORIDADES VISIBLES</span>
                      </header>
                      <ol>
                        {activePhase.workItems.slice(0, 3).map((item) => (
                          <li key={item.id} data-state={item.state}>
                            <span
                              className={styles.itemState}
                              aria-hidden="true"
                            >
                              {stateGlyph(item.state)}
                            </span>
                            <span className={styles.itemCopy}>
                              <small>
                                {item.type} · {item.id}
                              </small>
                              <strong>{item.title}</strong>
                              <span>{item.detail}</span>
                            </span>
                            <span className={styles.itemOwner}>{item.owner}</span>
                            <b>{item.stateLabel}</b>
                          </li>
                        ))}
                      </ol>
                    </section>
                  </div>

                  <aside
                    className={styles.inspector}
                    aria-label={`Inspector de ${activePhase.title}`}
                  >
                    <section className={styles.properties}>
                      <header className={styles.inspectorHeading}>
                        <h4>Propiedades</h4>
                        <span>{activePhase.id}</span>
                      </header>
                      <dl>
                        <div>
                          <dt>Gate</dt>
                          <dd>{activePhase.gate}</dd>
                        </div>
                        <div>
                          <dt>Milestone</dt>
                          <dd>{activePhase.milestone}</dd>
                        </div>
                        <div>
                          <dt>Actualizado</dt>
                          <dd>{activePhase.updated}</dd>
                        </div>
                      </dl>
                    </section>

                    <section
                      className={styles.activity}
                      aria-labelledby={`factory-activity-${activePhase.id}`}
                    >
                      <header className={styles.inspectorHeading}>
                        <h4 id={`factory-activity-${activePhase.id}`}>
                          Actividad
                        </h4>
                        <span>2 RECIENTES</span>
                      </header>
                      <ol>
                        {activePhase.activity.slice(0, 2).map((event) => (
                          <li
                            key={`${event.actor}-${event.time}`}
                            data-state={event.state}
                          >
                            <span>{event.initials}</span>
                            <p>
                              <strong>{event.actor}</strong>
                              {event.action}
                              <time>{event.time}</time>
                            </p>
                          </li>
                        ))}
                      </ol>
                    </section>

                    <div className={styles.authorityNote}>
                      <i aria-hidden="true" />
                      <p>
                        <small>DIRECCIÓN</small>
                        La IA propone y ejecuta. Una persona conserva la
                        decisión.
                      </p>
                    </div>
                  </aside>
                </div>

                <span
                  className={styles.mobileScrollCue}
                  data-visible={
                    isCompact && showMobileScrollCue ? "true" : "false"
                  }
                  aria-hidden="true"
                >
                  DESLIZA PARA MÁS DETALLE
                  <svg viewBox="0 0 12 12">
                    <path d="M2.5 4.25 6 7.75l3.5-3.5" />
                  </svg>
                </span>

                <footer className={styles.commandBar}>
                  <div>
                    <strong>RUN API</strong>
                    <code>{activePhase.command}</code>
                  </div>
                  <span>
                    <i aria-hidden="true" />
                    DATOS SINCRONIZADOS
                  </span>
                </footer>
              </section>
        </div>
      </div>

      <p className={styles.srAnnouncement} aria-live="polite">
        Fase activa: {activePhase.title}. Estado {activePhase.status}.
      </p>
    </div>
  );
}
