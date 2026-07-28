"use client";

import { useId, useState, type KeyboardEvent } from "react";
import styles from "@/app/capacidades/capacidades.module.css";

const capabilityKeys = ["producto", "operacion", "ia", "integracion"] as const;

const scenarios = [
  {
    id: "lanzar",
    number: "01",
    label: "Lanzar un producto",
    shortLabel: "Producto",
    code: "PRD-01",
    title: "Convertir una oportunidad en una primera versión que ya puede aprender.",
    description:
      "El recorte no empieza en funcionalidades. Empieza en una persona, una acción importante y la evidencia que permitirá decidir qué sigue.",
    problem: "Una oportunidad clara, pero todavía sin una experiencia utilizable.",
    context: "Usuarios, prioridad de negocio y primera hipótesis de valor.",
    constraint: "Llegar a uso real sin convertir la primera versión en el producto completo.",
    modules: {
      producto: "Núcleo",
      operacion: "Soporte",
      ia: "Según el caso",
      integracion: "Según el caso",
    },
    active: ["producto", "operacion"] as const,
    phases: [
      ["01", "Contexto", "Persona, problema y señal de cambio."],
      ["02", "Recorte", "El mínimo recorrido que ya entrega valor."],
      ["03", "Producto", "Interfaz, lógica y datos funcionando juntos."],
      ["04", "Aprendizaje", "Uso real que informa la siguiente decisión."],
    ],
    output: "Primera versión útil",
    control: "Decisiones de alcance",
    signal: "Uso y aprendizaje",
  },
  {
    id: "modernizar",
    number: "02",
    label: "Modernizar una operación",
    shortLabel: "Operación",
    code: "OPS-02",
    title: "Convertir una forma de trabajar dispersa en una operación visible.",
    description:
      "El sistema respeta reglas y excepciones reales mientras conecta información, responsables y acciones alrededor de una misma tarea.",
    problem: "Trabajo sostenido por archivos, mensajes y memoria de las personas.",
    context: "Pasos, responsables, reglas, excepciones y sistemas existentes.",
    constraint: "Reducir fricción sin borrar el conocimiento que mantiene viva la operación.",
    modules: {
      producto: "Interfaz",
      operacion: "Núcleo",
      ia: "Asistencia",
      integracion: "Conexión",
    },
    active: ["producto", "operacion", "integracion"] as const,
    phases: [
      ["01", "Observar", "La operación tal como ocurre, no como está documentada."],
      ["02", "Modelar", "Estados, reglas y excepciones que deben conservarse."],
      ["03", "Conectar", "Acciones y datos en una misma superficie."],
      ["04", "Controlar", "Historial visible para saber qué pasó y qué sigue."],
    ],
    output: "Operación conectada",
    control: "Reglas y excepciones",
    signal: "Tiempo, estado y trazabilidad",
  },
  {
    id: "conocimiento",
    number: "03",
    label: "Activar conocimiento con IA",
    shortLabel: "Conocimiento",
    code: "AIX-03",
    title: "Convertir información dispersa en asistencia que conserva la fuente.",
    description:
      "La IA busca, prepara o clasifica dentro de un flujo definido. Una persona mantiene el criterio y la responsabilidad donde la decisión importa.",
    problem: "Conocimiento valioso que tarda demasiado en encontrarse, leerse o aplicarse.",
    context: "Fuentes, criterios, permisos y decisiones que requieren revisión humana.",
    constraint: "Acelerar el trabajo sin presentar una respuesta opaca como una decisión final.",
    modules: {
      producto: "Superficie",
      operacion: "Flujo",
      ia: "Núcleo",
      integracion: "Fuentes",
    },
    active: ["producto", "operacion", "ia", "integracion"] as const,
    phases: [
      ["01", "Fuente", "Información identificable, vigente y autorizada."],
      ["02", "Asistencia", "Búsqueda, síntesis o clasificación con criterios."],
      ["03", "Revisión", "Contraste y decisión humana donde corresponde."],
      ["04", "Evidencia", "Salida que conserva la ruta hasta su fuente."],
    ],
    output: "Trabajo asistido y trazable",
    control: "Revisión humana",
    signal: "Calidad, fuente y ahorro de tiempo",
  },
  {
    id: "servicio-publico",
    number: "04",
    label: "Evolucionar un servicio público",
    shortLabel: "Servicio público",
    code: "CIV-04",
    title: "Convertir reglas institucionales en un servicio claro para las personas.",
    description:
      "La experiencia ciudadana y la operación interna se diseñan como un solo sistema, con continuidad, lenguaje claro y trazabilidad institucional.",
    problem: "Un servicio fragmentado entre canales, dependencias y requisitos difíciles de seguir.",
    context: "Ciudadanía, funcionarios, normativa, datos y capacidad operativa.",
    constraint: "Mejorar la experiencia sin perder responsabilidad, continuidad ni evidencia.",
    modules: {
      producto: "Servicio",
      operacion: "Núcleo",
      ia: "Asistencia",
      integracion: "Interoperabilidad",
    },
    active: ["producto", "operacion", "integracion"] as const,
    phases: [
      ["01", "Recorrido", "Necesidad ciudadana y puntos de fricción reales."],
      ["02", "Reglas", "Requisitos y responsabilidades convertidos en flujo."],
      ["03", "Servicio", "Canales y operación conectados de principio a fin."],
      ["04", "Seguimiento", "Estado visible para la entidad y para la persona."],
    ],
    output: "Servicio continuo y trazable",
    control: "Responsabilidad institucional",
    signal: "Acceso, resolución y continuidad",
  },
] as const;

const capabilityLabels: Record<(typeof capabilityKeys)[number], string> = {
  producto: "Producto",
  operacion: "Operación",
  ia: "IA",
  integracion: "Integración",
};

export function CapabilitiesWorkbench() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsId = useId();
  const active = scenarios[activeIndex];

  const activateTab = (index: number, moveFocus = false) => {
    setActiveIndex(index);
    if (!moveFocus) return;

    document.getElementById(`${tabsId}-scenario-${index}`)?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    let next = activeIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (activeIndex + 1) % scenarios.length;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (activeIndex - 1 + scenarios.length) % scenarios.length;
    }
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = scenarios.length - 1;

    activateTab(next, true);
  };

  return (
    <div className={styles.workbench}>
      <div className={styles.workbenchHeader}>
        <div>
          <span>CREATE PROJECT</span>
          <strong>INPLUX FACTORY</strong>
        </div>
        <p><i aria-hidden="true" /> COMPOSITOR DISPONIBLE</p>
      </div>

      <div className={styles.workbenchLayout}>
        <div
          className={styles.workbenchNav}
          role="tablist"
          aria-label="Escenarios para componer un proyecto"
          aria-orientation="vertical"
          onKeyDown={handleKeyDown}
        >
          {scenarios.map((scenario, index) => (
            <button
              id={`${tabsId}-scenario-${index}`}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls={`${tabsId}-scenario-panel`}
              tabIndex={activeIndex === index ? 0 : -1}
              onClick={() => activateTab(index)}
              key={scenario.id}
            >
              <span>{scenario.number}</span>
              <strong>{scenario.label}</strong>
              <i aria-hidden="true">{activeIndex === index ? "●" : "○"}</i>
            </button>
          ))}
        </div>

        <div
          id={`${tabsId}-scenario-panel`}
          className={styles.workbenchPanel}
          data-scenario={active.id}
          role="tabpanel"
          aria-labelledby={`${tabsId}-scenario-${activeIndex}`}
          tabIndex={0}
        >
          <div className={styles.projectHeader}>
            <div className={styles.projectIdentity}>
              <p>INPLUX FACTORY / {active.number}</p>
              <span>{active.code}</span>
              <b>ALINEADO</b>
            </div>
            <p>ESCENARIO ACTIVO / {active.shortLabel}</p>
          </div>

          <div className={styles.projectIntro}>
            <div>
              <p>CAMBIO BUSCADO</p>
              <h3>{active.title}</h3>
            </div>
            <p>{active.description}</p>
          </div>

          <div className={styles.projectContext}>
            <article>
              <span>01 / PROBLEMA</span>
              <p>{active.problem}</p>
            </article>
            <article>
              <span>02 / CONTEXTO</span>
              <p>{active.context}</p>
            </article>
            <article>
              <span>03 / TENSIÓN</span>
              <p>{active.constraint}</p>
            </article>
          </div>

          <div className={styles.compositionBoard}>
            <div className={styles.compositionTitle}>
              <p>COMPOSICIÓN PROPUESTA</p>
              <span>{active.active.length} CAPAS ACTIVAS</span>
            </div>
            <div className={styles.moduleGrid} aria-label={`Capacidades para ${active.label}`}>
              {capabilityKeys.map((key, index) => {
                const selected = (active.active as readonly string[]).includes(key);
                return (
                  <div data-active={selected ? "true" : "false"} key={key}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{capabilityLabels[key]}</strong>
                    <small>{active.modules[key]}</small>
                    <i aria-hidden="true">{selected ? "ACTIVA" : "CONDICIONAL"}</i>
                  </div>
                );
              })}
            </div>
          </div>

          <ol className={styles.buildFlow} aria-label={`Ruta de construcción para ${active.label}`}>
            {active.phases.map(([number, title, copy], index) => (
              <li key={title}>
                <div><span>{number}</span><i aria-hidden="true">{index < active.phases.length - 1 ? "→" : "✓"}</i></div>
                <strong>{title}</strong>
                <p>{copy}</p>
              </li>
            ))}
          </ol>

          <div className={styles.projectResult}>
            <div><span>SALE A PRODUCCIÓN</span><strong>{active.output}</strong></div>
            <div><span>CONTROL CRÍTICO</span><strong>{active.control}</strong></div>
            <div><span>SEÑAL DE EVOLUCIÓN</span><strong>{active.signal}</strong></div>
            <p><i aria-hidden="true" /> LISTO PARA DEFINIR ALCANCE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
