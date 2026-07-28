"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "@/app/fabrica/fabrica.module.css";

const chapters = [
  {
    id: "contexto",
    number: "01",
    code: "CTX–01",
    tab: "Contexto",
    eyebrow: "OBSERVAR / DELIMITAR",
    title: "El problema deja de ser una frase.",
    description:
      "Reunimos personas, reglas, información y fricciones para entender qué ocurre hoy y qué debería cambiar.",
    signal: "CONTEXTO ALINEADO",
    question: "¿Qué ocurre hoy y qué debería cambiar?",
    inputs: ["Personas involucradas", "Reglas del entorno", "Fricciones visibles"],
    output: "Contexto compartido",
    feeds: "Resultado esperado y prioridades",
  },
  {
    id: "criterio",
    number: "02",
    code: "CRT–02",
    tab: "Criterio",
    eyebrow: "PRIORIZAR / DECIDIR",
    title: "Lo importante se convierte en criterio.",
    description:
      "Definimos el resultado esperado, las prioridades y las condiciones que debe cumplir una primera versión útil.",
    signal: "DECISIÓN TRAZABLE",
    question: "¿Qué debe lograr una primera versión útil?",
    inputs: ["Contexto compartido", "Resultado esperado", "Riesgos que cuidar"],
    output: "Primera versión definida",
    feeds: "Flujos, software y validaciones",
  },
  {
    id: "construccion",
    number: "03",
    code: "BLD–03",
    tab: "Construcción",
    eyebrow: "DISEÑAR / DESARROLLAR",
    title: "Diseño e ingeniería trabajan juntos.",
    description:
      "Construimos la experiencia, el software y sus validaciones como un solo producto, no como entregables separados.",
    signal: "PRODUCTO PROBABLE",
    question: "¿Cómo se vuelve producto la decisión?",
    inputs: ["Flujos de uso", "Alcance priorizado", "Criterios de validación"],
    output: "Software revisado",
    feeds: "Operación, observación y uso real",
  },
  {
    id: "evolucion",
    number: "04",
    code: "EVL–04",
    tab: "Evolución",
    eyebrow: "LANZAR / APRENDER",
    title: "La entrega abre el siguiente ciclo.",
    description:
      "Ponemos la versión útil en operación, observamos cómo funciona y decidimos qué mejorar con evidencia.",
    signal: "SIGUIENTE DECISIÓN",
    question: "¿Qué enseña la versión en operación?",
    inputs: ["Versión útil", "Uso real", "Hallazgos"],
    output: "Siguiente decisión",
    feeds: "Un nuevo ciclo de contexto",
  },
] as const;

type ChangeMode = "animated" | "instant";

export function FactorySystemDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [changeMode, setChangeMode] = useState<ChangeMode>("instant");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tabsId = useId();
  const chapter = chapters[activeIndex];

  const activateTab = (
    index: number,
    moveFocus: boolean,
    nextChangeMode: ChangeMode,
  ) => {
    const tab = tabRefs.current[index];

    if (index === activeIndex) {
      if (moveFocus) tab?.focus();
      tab?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
      return;
    }

    setChangeMode(nextChangeMode);
    setActiveIndex(index);

    if (moveFocus) tab?.focus();
    tab?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    let nextIndex = activeIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (activeIndex + 1) % chapters.length;
    }
    if (event.key === "ArrowLeft") {
      nextIndex = (activeIndex - 1 + chapters.length) % chapters.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = chapters.length - 1;

    activateTab(nextIndex, true, "instant");
  };

  return (
    <div className={styles.demo}>
      <div
        className={styles.demoTabs}
        role="tablist"
        aria-label="Etapas del sistema"
        onKeyDown={handleKeyDown}
      >
        {chapters.map((item, index) => (
          <button
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`${tabsId}-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`${tabsId}-panel`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={(event) => {
              activateTab(index, false, event.detail === 0 ? "instant" : "animated");
            }}
            key={item.id}
          >
            <span>{item.number}</span>
            <strong>{item.tab}</strong>
            <small>{item.eyebrow.split(" / ")[0]}</small>
          </button>
        ))}
      </div>

      <div
        id={`${tabsId}-panel`}
        className={styles.demoPanel}
        role="tabpanel"
        aria-labelledby={`${tabsId}-tab-${activeIndex}`}
        tabIndex={0}
      >
        <div className={styles.demoTopline}>
          <span>INPLUX FACTORY / HILO DE DECISIÓN</span>
          <span role="status" aria-atomic="true">
            FASE {chapter.number} DE 04 / {chapter.signal}
          </span>
        </div>

        <div
          className={styles.demoWorkspace}
          data-change-mode={changeMode}
          key={chapter.id}
        >
          <div className={styles.demoCopy}>
            <div className={styles.demoCode}>
              <span>{chapter.code}</span>
              <i aria-hidden="true" />
              <strong>{chapter.signal}</strong>
            </div>
            <p>{chapter.eyebrow}</p>
            <h3>{chapter.title}</h3>
            <p>{chapter.description}</p>

            <dl className={styles.demoContinuity}>
              <div>
                <dt>Entra</dt>
                <dd>{chapter.inputs.join(" · ")}</dd>
              </div>
              <div>
                <dt>Sale</dt>
                <dd>{chapter.output}</dd>
              </div>
              <div>
                <dt>Alimenta</dt>
                <dd>{chapter.feeds}</dd>
              </div>
            </dl>
          </div>

          <div className={styles.demoSystem} aria-hidden="true">
            <div className={styles.systemHeading}>
              <span>FLUJO DE FASE / {chapter.code}</span>
              <span><i /> SISTEMA ACTIVO</span>
            </div>

            <div className={styles.systemCanvas}>
              <div className={styles.signalStack}>
                <p>SEÑALES DE ENTRADA</p>
                {chapter.inputs.map((item, index) => (
                  <span key={item}>
                    <i />
                    {item}
                    <b>0{index + 1}</b>
                  </span>
                ))}
              </div>

              <div className={styles.decisionGate}>
                <div>
                  <span>DECISIÓN / {chapter.code}</span>
                  <b>{chapter.number}</b>
                </div>
                <p>{chapter.question}</p>
                <small><i /> DIRECCIÓN HUMANA</small>
              </div>

              <div className={styles.outputCard}>
                <span>SALIDA ÚTIL</span>
                <strong>{chapter.output}</strong>
                <small>ALIMENTA → {chapter.feeds}</small>
              </div>
            </div>

            <ol className={styles.cycleRail}>
              {chapters.map((item, index) => (
                <li
                  data-state={
                    index < activeIndex
                      ? "complete"
                      : index === activeIndex
                        ? "active"
                        : "queued"
                  }
                  key={item.id}
                >
                  <span>{item.number}</span>
                  <i />
                  <b>{item.tab}</b>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
