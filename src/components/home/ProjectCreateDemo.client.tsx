"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";

type ProjectRunState = "ready" | "running" | "created";

const requestBody = `{
  "outcome": "software-in-production",
  "direction": "human-led",
  "evidence": "required"
}`;

export function ProjectCreateDemo() {
  const [runState, setRunState] = useState<ProjectRunState>("ready");
  const [responseOpen, setResponseOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyAnnouncement, setCopyAnnouncement] = useState("");
  const timerRef = useRef<number | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const runProject = () => {
    if (runState === "running") return;
    if (timerRef.current) window.clearTimeout(timerRef.current);

    setRunState("running");
    setResponseOpen(false);
    timerRef.current = window.setTimeout(() => {
      setRunState("created");
      setResponseOpen(true);
      timerRef.current = null;
    }, 760);
  };

  const copyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText("/v1/projects");
      setCopied(true);
      setCopyAnnouncement("Endpoint copiado al portapapeles.");
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        setCopyAnnouncement("");
        copyTimerRef.current = null;
      }, 1500);
    } catch {
      setCopied(false);
      setCopyAnnouncement("No fue posible copiar el endpoint.");
    }
  };

  const statusLabel =
    runState === "ready"
      ? "SANDBOX READY"
      : runState === "running"
        ? "CREATING PROJECT…"
        : "PROJECT CREATED";

  return (
    <div
      className={styles.projectCreateDemo}
      data-state={runState}
      role="region"
      aria-label="Demostración para crear un proyecto en INPLUX Factory"
    >
      <span className="site-visually-hidden" role="status" aria-live="polite">
        {copyAnnouncement}
      </span>
      <p className={styles.projectDemoDisclosure}>
        DEMOSTRACIÓN INTERACTIVA · DATOS ILUSTRATIVOS
      </p>
      <div className={styles.apiIdentityCard}>
        <span>{"// CREATE PROJECT"}</span>
        <strong>INPLUX FACTORY</strong>
        <div className={styles.projectIdentityMeta}>
          <span>ENV / SANDBOX</span>
          <span>REGION / LATAM-01</span>
        </div>
        <i aria-hidden="true" />
      </div>

      <div className={styles.apiRequestCard}>
        <div className={styles.projectRequestHeader}>
          <span>{"// REQUEST"}</span>
          <b>POST</b>
        </div>
        <div className={styles.projectEndpoint}>
          <span>POST</span>
          <code>/v1/projects</code>
          <button
            type="button"
            aria-label={copied ? "Endpoint copiado" : "Copiar endpoint"}
            title={copied ? "Copiado" : "Copiar endpoint"}
            onClick={copyEndpoint}
          >
            {copied ? (
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m3.5 8.25 2.75 2.75 6.25-6.25" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <rect x="5.25" y="5.25" width="7.25" height="7.25" rx="1.25" />
                <path d="M10.75 5.25V4.5A1.5 1.5 0 0 0 9.25 3h-4.5A1.75 1.75 0 0 0 3 4.75v4.5a1.5 1.5 0 0 0 1.5 1.5h.75" />
              </svg>
            )}
          </button>
        </div>
        <pre>{requestBody}</pre>
        <div className={styles.projectRequestFooter}>
          <button
            type="button"
            aria-busy={runState === "running"}
            aria-disabled={runState === "running"}
            onClick={runProject}
          >
            <span aria-hidden="true">
              {runState === "running" ? (
                <i className={styles.projectRunSpinner} />
              ) : (
                <svg viewBox="0 0 16 16">
                  <path d="m5.75 3.75 5 4.25-5 4.25Z" />
                </svg>
              )}
            </span>
            {runState === "created" ? "RUN AGAIN" : runState === "running" ? "RUNNING" : "RUN REQUEST"}
          </button>
          <span role="status" aria-live="polite">
            <i aria-hidden="true" />
            {statusLabel}
          </span>
        </div>
      </div>

      <div className={styles.apiResponseCard} data-open={responseOpen ? "true" : "false"}>
        <button
          type="button"
          aria-expanded={responseOpen}
          aria-controls="project-create-response"
          onClick={() => setResponseOpen((current) => !current)}
        >
          <span>{"// RESPONSE"}</span>
          <b>{runState === "created" ? "201 / CREATED" : "READY"}</b>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="m3.75 6 4.25 4 4.25-4" />
          </svg>
        </button>
        <div
          id="project-create-response"
          className={styles.projectResponseReveal}
          aria-hidden={!responseOpen}
          inert={!responseOpen ? true : undefined}
        >
          <div className={styles.projectResponseRevealInner}>
            <dl>
              <div>
                <dt>PROJECT</dt>
                <dd>IX-0718</dd>
              </div>
              <div>
                <dt>NEXT GATE</dt>
                <dd>CONTEXT / 01</dd>
              </div>
              <div>
                <dt>TRACE</dt>
                <dd>ENABLED</dd>
              </div>
            </dl>
            <code>{`{ "status": "ready", "human_direction": true }`}</code>
            {runState === "created" ? (
              <a className={styles.projectOpenLink} href="#factory-run">
                ABRIR IX-0718 EN FACTORY RUN <span aria-hidden="true">→</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
