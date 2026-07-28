"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import styles from "@/app/nosotros/nosotros.module.css";

const stages = [
  {
    id: "contexto",
    number: "01",
    label: "Contexto",
    verb: "Observar",
    title: "Entender el sistema antes de proponer una pantalla.",
    copy:
      "Personas, reglas y fricciones entran juntas. El problema se define desde la operación real, no desde una plantilla.",
    output: "Mapa del problema",
  },
  {
    id: "evidencia",
    number: "02",
    label: "Evidencia",
    verb: "Contrastar",
    title: "Separar los supuestos de lo que ya podemos demostrar.",
    copy:
      "Revisamos datos, conversaciones y recorridos para reconocer qué funciona, qué se rompe y dónde existe una oportunidad verificable.",
    output: "Señales priorizadas",
  },
  {
    id: "decision",
    number: "03",
    label: "Decisión",
    verb: "Elegir",
    title: "Convertir la evidencia en una dirección que se pueda explicar.",
    copy:
      "Definimos qué construir primero, qué dejar fuera y cómo sabremos si la decisión produjo el cambio esperado.",
    output: "Alcance con criterio",
  },
  {
    id: "producto",
    number: "04",
    label: "Producto",
    verb: "Entregar",
    title: "Poner una primera versión útil frente a quienes la necesitan.",
    copy:
      "Diseño e ingeniería convierten la decisión en software que puede usarse, medirse y evolucionar con nueva evidencia.",
    output: "Software en operación",
  },
] as const;

export function CriterionFlow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [motionMode, setMotionMode] = useState<"animate" | "instant">("animate");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeStage = stages[activeIndex];

  const selectStage = (index: number) => {
    setMotionMode("instant");
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % stages.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + stages.length) % stages.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = stages.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    selectStage(nextIndex);
  };

  return (
    <div className={styles.criterionExperience}>
      <div
        className={styles.criterionVisual}
        data-stage={activeStage.id}
        data-motion={motionMode}
      >
        <Image
          className={styles.criterionImage}
          src="/brand/about/mesa-de-criterio.webp"
          alt="Composición editorial de materiales, tarjetas y herramientas sobre una mesa de trabajo."
          fill
          priority
          quality={88}
          sizes="(max-width: 980px) 100vw, 50vw"
        />
        <div className={styles.criterionShade} aria-hidden="true" />
        <div className={styles.criterionCoordinates} aria-hidden="true">
          <span>CRITERION TABLE / CTX–01</span>
          <span>06°14′N / 75°34′W</span>
        </div>
        <div className={styles.criterionMarker} aria-hidden="true">
          <span />
        </div>

        <div
          id="criterion-active-panel"
          className={styles.criterionPanel}
          role="tabpanel"
          aria-labelledby={`criterion-tab-${activeStage.id}`}
          tabIndex={0}
          key={activeStage.id}
        >
          <div className={styles.criterionPanelMeta}>
            <span>{activeStage.number} / 04</span>
            <span>{activeStage.verb}</span>
          </div>
          <h2>{activeStage.title}</h2>
          <p>{activeStage.copy}</p>
          <div className={styles.criterionOutput}>
            <span>Salida</span>
            <strong>{activeStage.output}</strong>
          </div>
        </div>

        <p className={styles.criterionImageNote}>
          Imagen conceptual / La mesa de criterio
        </p>
      </div>

      <div
        className={styles.criterionTabs}
        role="tablist"
        aria-label="Etapas del criterio de la fábrica"
        aria-orientation="horizontal"
      >
        {stages.map((stage, index) => (
          <button
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            id={`criterion-tab-${stage.id}`}
            className={styles.criterionTab}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls="criterion-active-panel"
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => {
              setMotionMode("animate");
              setActiveIndex(index);
            }}
            onKeyDown={(event) => handleKeyDown(event, index)}
            key={stage.id}
          >
            <span>{stage.number}</span>
            <strong>{stage.label}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
