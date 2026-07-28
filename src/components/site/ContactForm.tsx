"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

const contactEmail = "gerencia@inplux.co";

type ContactFormProps = {
  context?: "dialog" | "section";
};

export function ContactForm({ context = "section" }: ContactFormProps) {
  const [preparedMessage, setPreparedMessage] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [showManualCopy, setShowManualCopy] = useState(false);
  const manualCopyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!showManualCopy) return;
    manualCopyRef.current?.focus();
    manualCopyRef.current?.select();
  }, [showManualCopy]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const organization = String(data.get("organization") ?? "").trim();
    const needType = String(data.get("needType") ?? "").trim();
    const challenge = String(data.get("challenge") ?? "").trim();

    const subject = `Nuevo reto de software · ${organization || name}`;
    const body = [
      `Nombre: ${name}`,
      `Empresa o entidad: ${organization || "No indicada"}`,
      `Tipo de necesidad: ${needType}`,
      "",
      "Reto:",
      challenge,
    ].join("\n");

    setPreparedMessage(
      [`Para: ${contactEmail}`, `Asunto: ${subject}`, "", body].join("\n"),
    );
    setCopyStatus(null);
    setShowManualCopy(false);

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const copyMessage = async () => {
    if (!preparedMessage) return;

    let copied = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(preparedMessage);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      const previousFocus =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const temporaryTextarea = document.createElement("textarea");
      temporaryTextarea.value = preparedMessage;
      temporaryTextarea.setAttribute("readonly", "");
      temporaryTextarea.style.position = "fixed";
      temporaryTextarea.style.opacity = "0";
      document.body.appendChild(temporaryTextarea);
      try {
        temporaryTextarea.select();
        copied =
          typeof document.execCommand === "function" && document.execCommand("copy");
      } catch {
        copied = false;
      } finally {
        temporaryTextarea.remove();
        if (previousFocus?.isConnected) previousFocus.focus();
      }
    }

    if (copied) {
      setCopyStatus("Mensaje copiado. Puedes pegarlo en el canal que prefieras.");
      setShowManualCopy(false);
    } else {
      setCopyStatus("No pudimos copiarlo automáticamente. El mensaje está seleccionado abajo.");
      setShowManualCopy(true);
    }
  };

  return (
    <form
      className="site-contact-form"
      data-contact-form={context}
      aria-label={
        context === "dialog"
          ? "Formulario de contacto en diálogo"
          : "Formulario de contacto de la página"
      }
      onSubmit={onSubmit}
    >
      <div className="site-form-row">
        <label>
          <span>Nombre</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            required
          />
        </label>
        <label>
          <span>Empresa o entidad <em>opcional</em></span>
          <input
            name="organization"
            type="text"
            autoComplete="organization"
            maxLength={160}
          />
        </label>
      </div>

      <label>
        <span>¿Qué tipo de necesidad tienes?</span>
        <select name="needType" defaultValue="Aún no lo sé">
          <option>Lanzar un producto digital</option>
          <option>Mejorar una operación</option>
          <option>Automatizar trabajo y conocimiento</option>
          <option>Aún no lo sé</option>
        </select>
      </label>

      <label>
        <span>¿Qué problema necesitas resolver?</span>
        <textarea
          name="challenge"
          rows={5}
          placeholder="Cuéntanos el problema, quién lo vive y qué debería cambiar."
          maxLength={900}
          required
        />
      </label>

      <p className="site-form-note">
        Prepararemos un borrador en tu aplicación de correo. Esta página no enviará ni
        almacenará los datos.
      </p>
      <button className="site-button site-button-light" type="submit">
        Abrir borrador en mi correo <span aria-hidden="true">↗</span>
      </button>

      {preparedMessage ? (
        <>
          <p className="site-contact-note" role="status">
            El borrador quedó preparado. Si tu aplicación de correo no se abrió, puedes
            copiar el mensaje y enviarlo desde el canal que prefieras.
          </p>
          <button
            className="site-button site-button-light"
            type="button"
            onClick={copyMessage}
          >
            Copiar mensaje preparado
          </button>
          {copyStatus ? (
            <p className="site-contact-note" role="status" aria-live="polite">
              {copyStatus}
            </p>
          ) : null}
          {showManualCopy ? (
            <label>
              <span>Mensaje preparado para copiar manualmente</span>
              <textarea
                ref={manualCopyRef}
                value={preparedMessage}
                rows={9}
                readOnly
              />
            </label>
          ) : null}
        </>
      ) : null}
    </form>
  );
}
