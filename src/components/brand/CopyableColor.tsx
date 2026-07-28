"use client";

import { useEffect, useRef, useState } from "react";

export function CopyableColor({
  hex,
  className,
}: {
  hex: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  async function copyColor() {
    try {
      await navigator.clipboard.writeText(hex);
      setState("copied");
    } catch {
      setState("error");
    }

    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setState("idle"), 1400);
  }

  const label = state === "copied" ? "Copiado" : state === "error" ? "No disponible" : hex;

  return (
    <button
      type="button"
      onClick={copyColor}
      className={className}
      data-copy-color
      aria-label={`Copiar color ${hex}`}
    >
      <span aria-live="polite">{label}</span>
    </button>
  );
}
