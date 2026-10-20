"use client";

import { useState } from "react";

/**
 * Copia el correo de contacto al portapapeles. Si el navegador lo niega,
 * selecciona el texto del enlace para que la persona lo copie a mano.
 */
export function CopyEmailButton({
  email,
  targetId,
  label,
  doneLabel,
  className,
}: {
  email: string;
  targetId: string;
  label: string;
  doneLabel: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setDone(true);
      window.setTimeout(() => setDone(false), 2400);
    } catch {
      const target = document.getElementById(targetId);
      const selection = window.getSelection();
      if (!target || !selection) return;
      const range = document.createRange();
      range.selectNodeContents(target);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  return (
    <button type="button" className={className} onClick={copy} aria-live="polite">
      {done ? doneLabel : label}
    </button>
  );
}
