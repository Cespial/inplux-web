"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { WorkProfile } from "@/content/work";
import { WorkPreview } from "./WorkPreview";
import styles from "./workVisuals.module.css";

type ProductInterfaceProps = {
  profile: WorkProfile;
};

type InterfaceMode = "interface" | "evidence";

const interfaceModes = [
  "interface",
  "evidence",
] as const satisfies readonly InterfaceMode[];

export function ProductInterface({ profile }: ProductInterfaceProps) {
  const [mode, setMode] = useState<InterfaceMode>("interface");
  const tabsetId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const interfaceTabId = `${tabsetId}-interface-tab`;
  const evidenceTabId = `${tabsetId}-evidence-tab`;
  const interfacePanelId = `${tabsetId}-interface-panel`;
  const evidencePanelId = `${tabsetId}-evidence-panel`;

  function activateTab(nextMode: InterfaceMode) {
    setMode(nextMode);
    tabRefs.current[interfaceModes.indexOf(nextMode)]?.focus();
  }

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentMode: InterfaceMode,
  ) {
    const currentIndex = interfaceModes.indexOf(currentMode);
    let nextMode: InterfaceMode | undefined;

    switch (event.key) {
      case "ArrowRight":
        nextMode = interfaceModes[(currentIndex + 1) % interfaceModes.length];
        break;
      case "ArrowLeft":
        nextMode =
          interfaceModes[
            (currentIndex - 1 + interfaceModes.length) % interfaceModes.length
          ];
        break;
      case "Home":
        nextMode = interfaceModes[0];
        break;
      case "End":
        nextMode = interfaceModes[interfaceModes.length - 1];
        break;
      default:
        return;
    }

    event.preventDefault();
    activateTab(nextMode);
  }

  return (
    <div className={styles.interfaceStage} data-theme={profile.interface.theme}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className={styles.interfaceToolbar}>
        <div className={styles.productIdentity}>
          <span>{profile.number}</span>
          <strong>{profile.name}</strong>
          <small>PROFILE / DEMO</small>
        </div>
        <div
          className={styles.modeSwitch}
          role="tablist"
          aria-label={`Vista demostrativa de ${profile.name}`}
          aria-orientation="horizontal"
        >
          <button
            ref={(element) => {
              tabRefs.current[0] = element;
            }}
            id={interfaceTabId}
            type="button"
            role="tab"
            aria-controls={interfacePanelId}
            aria-selected={mode === "interface"}
            tabIndex={mode === "interface" ? 0 : -1}
            onClick={() => setMode("interface")}
            onKeyDown={(event) => handleTabKeyDown(event, "interface")}
          >
            Interfaz
          </button>
          <button
            ref={(element) => {
              tabRefs.current[1] = element;
            }}
            id={evidenceTabId}
            type="button"
            role="tab"
            aria-controls={evidencePanelId}
            aria-selected={mode === "evidence"}
            tabIndex={mode === "evidence" ? 0 : -1}
            onClick={() => setMode("evidence")}
            onKeyDown={(event) => handleTabKeyDown(event, "evidence")}
          >
            Evidencia
          </button>
        </div>
      </div>

      <div className={styles.interfaceViewport}>
        <div
          id={interfacePanelId}
          className={styles.modePanel}
          data-active={mode === "interface"}
          role="tabpanel"
          aria-labelledby={interfaceTabId}
          tabIndex={0}
          hidden={mode !== "interface"}
          inert={mode !== "interface"}
        >
          <WorkPreview profile={profile} />
        </div>
        <div
          id={evidencePanelId}
          className={`${styles.modePanel} ${styles.evidencePanel}`}
          data-active={mode === "evidence"}
          role="tabpanel"
          aria-labelledby={evidenceTabId}
          tabIndex={0}
          hidden={mode !== "evidence"}
          inert={mode !== "evidence"}
        >
          <div className={styles.evidenceWindow}>
            <div className={styles.evidenceHeader}>
              <span>REGISTRO DE EVIDENCIA</span>
              {/*
                El registro cuenta las fuentes que lista debajo, no dictamina
                sobre la atribución: la autoría la declara INPLUX y ninguna de
                estas filas la demuestra por sí sola.
              */}
              <b>
                {profile.sources.length}{" "}
                {profile.sources.length === 1 ? "FUENTE" : "FUENTES"}
              </b>
            </div>
            <div className={styles.evidenceStatement}>
              <p>Atribución</p>
              <strong>{profile.attribution.label}</strong>
              <span>{profile.attribution.statement}</span>
            </div>
            <ol>
              {profile.sources.map((source, index) => (
                <li key={source.url}>
                  <span>0{index + 1}</span>
                  <div>
                    <strong>{source.label}</strong>
                    <p>{source.supports}</p>
                  </div>
                  <time dateTime={source.verifiedAt}>{source.verifiedAt}</time>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <p className={styles.disclosure}>
        <span aria-hidden="true">●</span>
        Demostración editorial construida en HTML/CSS. No es una captura del
        producto.
      </p>
    </div>
  );
}
