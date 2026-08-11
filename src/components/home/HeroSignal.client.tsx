"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { homeCopyEs } from "@/content/copy/es";
import type { HeroCopy } from "@/content/copy/types";
import styles from "./home.module.css";

type PointerState = {
  active: boolean;
  x: number;
  y: number;
};

const glyphs = ["·", "/", "{", "0", "1", "+"] as const;
const glyphColors = [
  "rgba(249,245,239,.10)",
  "rgba(249,245,239,.18)",
  "rgba(249,245,239,.29)",
  "rgba(149,144,137,.58)",
  "rgba(249,245,239,.68)",
  "rgba(0,215,202,.88)",
] as const;

export function HeroSignal({ copy = homeCopyEs.hero }: { copy?: HeroCopy }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<PointerState>({ active: false, x: 0.68, y: 0.48 });

  useEffect(() => {
    const panel = panelRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!panel || !canvas || !context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    let reducedMotion = motionQuery.matches;
    let visible = true;
    let documentVisible = !document.hidden;
    let frame = 0;
    let lastPaint = -Infinity;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let columns = 0;
    let rows = 0;
    let normalizedColumns: number[] = [];
    let normalizedRows: number[] = [];
    const monoFamily =
      getComputedStyle(panel).getPropertyValue("--font-home-mono").trim() ||
      '"Geist Mono", "SFMono-Regular", ui-monospace, monospace';
    const cellWidth = 14;
    const cellHeight = 16;

    const resize = () => {
      const bounds = panel.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      columns = Math.ceil(width / cellWidth) + 2;
      rows = Math.ceil(height / cellHeight) + 2;
      normalizedColumns = Array.from(
        { length: columns + 1 },
        (_, column) => ((column - 0.5) * cellWidth) / width,
      );
      normalizedRows = Array.from(
        { length: rows + 1 },
        (_, row) => ((row - 0.5) * cellHeight) / height,
      );
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const paint = (timestamp: number) => {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `500 12px ${monoFamily}`;

      const time = reducedMotion ? 0.65 : timestamp * 0.0009;
      const pointer = pointerRef.current;
      const pointerActive = pointer.active && finePointerQuery.matches;
      const centerlines = normalizedColumns.map(
        (normalizedX) =>
          0.5 +
          Math.sin(normalizedX * 8.4 + time * 1.45) * 0.12 +
          Math.cos(normalizedX * 3.1 - time * 0.72) * 0.045,
      );
      const horizontalField = normalizedColumns.map(
        (normalizedX) => Math.sin(normalizedX * 17.5 + time * 1.8) * 0.24,
      );
      const verticalField = normalizedRows.map(
        (normalizedY) => Math.cos(normalizedY * 15.2 - time * 1.15) * 0.2,
      );

      for (let row = -1; row < rows; row += 1) {
        const y = (row + 0.5) * cellHeight;
        const normalizedY = y / height;
        const rowIndex = row + 1;

        for (let column = -1; column < columns; column += 1) {
          const x = (column + 0.5) * cellWidth;
          const normalizedX = x / width;
          const columnIndex = column + 1;
          const centerline = centerlines[columnIndex];
          const ribbon = Math.exp(-Math.abs(normalizedY - centerline) * 9.5);
          const field =
            horizontalField[columnIndex] +
            verticalField[rowIndex] +
            Math.sin((normalizedX + normalizedY) * 10.8 - time * 0.62) * 0.16;
          const pointerEnergy =
            pointerActive
              ? Math.exp(
                  -Math.hypot(normalizedX - pointer.x, normalizedY - pointer.y) * 7.5,
                ) * 0.74
              : 0;
          const edgeFade = Math.min(
            1,
            normalizedX * 7,
            (1 - normalizedX) * 7,
            normalizedY * 6,
            (1 - normalizedY) * 6,
          );
          const intensity = Math.max(
            0,
            Math.min(0.999, (0.18 + ribbon * 0.56 + field + pointerEnergy) * edgeFade),
          );
          const glyphIndex = Math.min(glyphs.length - 1, Math.floor(intensity * glyphs.length));

          context.fillStyle = glyphColors[glyphIndex];
          context.fillText(glyphs[glyphIndex], x, y);
        }
      }
    };

    const loop = (timestamp: number) => {
      frame = 0;
      if (!visible || !documentVisible || reducedMotion) return;
      const paintInterval = pointerRef.current.active ? 32 : 48;
      if (timestamp - lastPaint >= paintInterval) {
        paint(timestamp);
        lastPaint = timestamp;
      }
      frame = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (!frame && visible && documentVisible && !reducedMotion) {
        frame = window.requestAnimationFrame(loop);
      }
    };

    const stop = () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const onMotionChange = () => {
      reducedMotion = motionQuery.matches;
      if (reducedMotion) {
        stop();
        paint(0);
      } else {
        start();
      }
    };

    const onVisibilityChange = () => {
      documentVisible = !document.hidden;
      if (documentVisible) start();
      else stop();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      paint(performance.now());
    });
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.01 },
    );

    resize();
    paint(0);
    resizeObserver.observe(panel);
    intersectionObserver.observe(panel);
    motionQuery.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const updatePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      active: true,
      x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
      y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)),
    };
  };

  return (
    <div
      ref={panelRef}
      className={styles.signalPanel}
      onPointerMove={updatePointer}
      onPointerLeave={() => {
        pointerRef.current = { active: false, x: 0.68, y: 0.48 };
      }}
      role="img"
      aria-label={copy.signalAriaLabel}
    >
      <canvas ref={canvasRef} className={styles.signalCanvas} aria-hidden="true" />
      <div className={styles.signalMeta} aria-hidden="true">
        {copy.signalMeta.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className={styles.signalStages} aria-hidden="true">
        {copy.signalStages.map((stage) => (
          <span key={stage.number}>
            <b>{stage.number}</b>
            <strong>{stage.title}</strong>
            <small>{stage.detail}</small>
          </span>
        ))}
      </div>
      <div className={styles.signalAxis} aria-hidden="true">
        <span />
        <i />
        <strong>{copy.signalAxis}</strong>
      </div>
    </div>
  );
}
