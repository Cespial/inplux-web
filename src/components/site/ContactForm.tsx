"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { homeCopyEs } from "@/content/copy/es";
import { formatCopy } from "@/content/copy/format";
import type { ContactFormCopy } from "@/content/copy/types";
import {
  CONTACT_ENDPOINT,
  CONTACT_TOKEN_ENDPOINT,
  FIELD,
  LIMITS,
  TOKEN_WINDOW,
} from "@/lib/contact/fields.mjs";

/*
 * Formulario de contacto (octubre de 2026).
 *
 * - Con JS: envía JSON a `/api/contacto`, que lo manda por Resend. La marca de
 *   tiempo firmada se pide al primer foco, no al cargar la página.
 * - Sin JS: el `<form method="post">` nativo llega al mismo endpoint, que
 *   responde 303 a `/contacto` con un ancla de estado.
 * - Sin clave de Resend en el servidor (503 `not_configured`): cae al borrador
 *   por `mailto:` de siempre, con el mismo texto armado.
 */

const contactEmail = "gerencia@inplux.co";
/** Una marca más vieja que esto se renueva antes de enviar (vence a las 2 h). */
const tokenRefreshMs = 60 * 60 * 1000;
/** Margen sobre el mínimo del servidor para que una persona nunca caiga en él. */
const minWaitMs = TOKEN_WINDOW.minAgeMs + 300;

type ContactFormProps = {
  context?: "dialog" | "section";
  copy?: ContactFormCopy;
};

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string }
  | { kind: "prepared" };

type Token = { value: string; receivedAt: number };

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export function ContactForm({
  context = "section",
  copy = homeCopyEs.contactForm,
}: ContactFormProps) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  /** Tras un error el botón dice «Reintentar» hasta que se edita un campo. */
  const [retryLabel, setRetryLabel] = useState(false);
  const [preparedMessage, setPreparedMessage] = useState<string | null>(null);
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [showManualCopy, setShowManualCopy] = useState(false);
  const manualCopyRef = useRef<HTMLTextAreaElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<Token | null>(null);
  const tokenRequestRef = useRef<Promise<Token | null> | null>(null);
  /** `mailto` cuando el servidor dijo que no tiene clave de Resend. */
  const modeRef = useRef<"api" | "mailto">("api");
  const focusStatusRef = useRef(false);

  useEffect(() => {
    if (!showManualCopy) return;
    manualCopyRef.current?.focus();
    manualCopyRef.current?.select();
  }, [showManualCopy]);

  useEffect(() => {
    if (!focusStatusRef.current) return;
    if (status.kind === "idle" || status.kind === "sending") return;
    focusStatusRef.current = false;
    statusRef.current?.focus();
  }, [status]);

  const ensureToken = (): Promise<Token | null> => {
    if (modeRef.current === "mailto") return Promise.resolve(null);
    const current = tokenRef.current;
    if (current && Date.now() - current.receivedAt < tokenRefreshMs) {
      return Promise.resolve(current);
    }
    if (tokenRequestRef.current) return tokenRequestRef.current;

    const request = fetch(CONTACT_TOKEN_ENDPOINT, { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json().catch(() => null)) as
          | { ok?: boolean; token?: string; error?: string }
          | null;
        if (response.status === 503 && data?.error === "not_configured") {
          modeRef.current = "mailto";
          return null;
        }
        if (!response.ok || !data?.token) throw new Error("token");
        const token = { value: data.token, receivedAt: Date.now() };
        tokenRef.current = token;
        return token;
      })
      .finally(() => {
        tokenRequestRef.current = null;
      });
    tokenRequestRef.current = request;
    return request;
  };

  const prepareMailto = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const name = String(data.get(FIELD.name) ?? "").trim();
    const organization = String(data.get(FIELD.organization) ?? "").trim();
    const needType = String(data.get(FIELD.needType) ?? "").trim();
    const challenge = String(data.get(FIELD.message) ?? "").trim();

    const subject = formatCopy(copy.mailSubject, {
      organization: organization || name,
    });
    const body = [
      `${copy.mailFieldName}: ${name}`,
      `${copy.mailFieldOrganization}: ${
        organization || copy.mailFieldOrganizationEmpty
      }`,
      `${copy.mailFieldNeed}: ${needType}`,
      "",
      copy.mailChallengeHeading,
      challenge,
    ].join("\n");
    const href = `mailto:${contactEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setPreparedMessage(
      [
        `${copy.mailTo}: ${contactEmail}`,
        `${copy.mailSubjectLabel}: ${subject}`,
        "",
        body,
      ].join("\n"),
    );
    setMailtoHref(href);
    setCopyStatus(null);
    setShowManualCopy(false);
    focusStatusRef.current = true;
    setStatus({ kind: "prepared" });

    window.location.href = href;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.kind === "sending") return;
    const form = event.currentTarget;

    // Ya se sabe que no hay envío directo: el borrador se abre dentro del
    // mismo clic, sin esperar a la red.
    if (modeRef.current === "mailto") {
      prepareMailto(form);
      return;
    }

    setStatus({ kind: "sending" });
    setRetryLabel(false);
    focusStatusRef.current = true;

    try {
      const token = await ensureToken();
      if (!token) {
        prepareMailto(form);
        return;
      }

      const elapsed = Date.now() - token.receivedAt;
      if (elapsed < minWaitMs) await wait(minWaitMs - elapsed);

      const data = new FormData(form);
      const payload: Record<string, string> = {};
      for (const key of [
        FIELD.name,
        FIELD.email,
        FIELD.organization,
        FIELD.needType,
        FIELD.message,
        FIELD.honeypot,
      ]) {
        payload[key] = String(data.get(key) ?? "");
      }
      payload[FIELD.token] = token.value;
      payload[FIELD.page] = window.location.pathname;

      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      // Cada marca vale para un envío: salvo un 400 (datos por corregir), el
      // servidor ya la gastó y el próximo intento pide una nueva.
      if (response.status !== 400) tokenRef.current = null;

      if (response.ok && result?.ok) {
        form.reset();
        setStatus({ kind: "sent" });
        return;
      }
      if (response.status === 503 && result?.error === "not_configured") {
        modeRef.current = "mailto";
        prepareMailto(form);
        return;
      }
      setRetryLabel(true);
      setStatus({
        kind: "error",
        message:
          response.status === 400
            ? copy.errorInvalid
            : response.status === 429
              ? copy.errorRateLimited
              : copy.errorSend,
      });
    } catch {
      setRetryLabel(true);
      setStatus({ kind: "error", message: copy.errorSend });
    }
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
      setCopyStatus(copy.copySuccess);
      setShowManualCopy(false);
    } else {
      setCopyStatus(copy.copyFailure);
      setShowManualCopy(true);
    }
  };

  const sending = status.kind === "sending";

  return (
    <form
      className="site-contact-form"
      data-contact-form={context}
      data-contact-status={status.kind}
      aria-label={context === "dialog" ? copy.dialogLabel : copy.sectionLabel}
      aria-busy={sending}
      method="post"
      action={CONTACT_ENDPOINT}
      onSubmit={onSubmit}
      onInput={() => {
        if (retryLabel) setRetryLabel(false);
      }}
      onChange={() => {
        if (retryLabel) setRetryLabel(false);
      }}
      onFocus={() => {
        // Primer foco: se pide la marca de tiempo mientras la persona escribe.
        ensureToken().catch(() => undefined);
      }}
    >
      <div className="site-form-row">
        <label>
          <span>{copy.nameLabel}</span>
          <input
            name={FIELD.name}
            type="text"
            autoComplete="name"
            minLength={LIMITS.nameMin}
            maxLength={LIMITS.nameMax}
            required
          />
        </label>
        <label>
          <span>{copy.emailLabel}</span>
          <input
            name={FIELD.email}
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={LIMITS.emailMax}
            required
          />
        </label>
      </div>

      <div className="site-form-row">
        <label>
          <span>{`${copy.organizationLabel} `}<em>{copy.organizationOptional}</em></span>
          <input
            name={FIELD.organization}
            type="text"
            autoComplete="organization"
            maxLength={LIMITS.organizationMax}
          />
        </label>
        <label>
          <span>{copy.needLabel}</span>
          <select name={FIELD.needType} defaultValue={copy.needDefault}>
            {copy.needOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Campo trampa: fuera de pantalla, fuera del orden de tabulación y del
          árbol de accesibilidad. Sin etiqueta ni nombre con significado para
          que el autocompletado del navegador y los gestores de contraseñas no
          lo llenen: si lo hicieran, un mensaje real se descartaría. */}
      <div className="site-form-trap" aria-hidden="true">
        <input
          name={FIELD.honeypot}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
          data-1p-ignore=""
          data-lpignore="true"
          data-form-type="other"
        />
      </div>

      <label>
        <span>{copy.challengeLabel}</span>
        <textarea
          name={FIELD.message}
          rows={5}
          placeholder={copy.challengePlaceholder}
          minLength={LIMITS.messageMin}
          maxLength={LIMITS.messageMax}
          required
        />
      </label>

      <button
        className="site-button site-button-light"
        type="submit"
        disabled={sending}
      >
        {sending ? (
          copy.sending
        ) : retryLabel ? (
          copy.retry
        ) : (
          <>{`${copy.submit} `}<span aria-hidden="true">↗</span></>
        )}
      </button>

      <p className="site-form-note">
        {`${copy.note} `}
        <Link href="/seguridad">{copy.privacyLink}</Link>
      </p>

      <div
        ref={statusRef}
        className="site-contact-status"
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        {status.kind === "sending" ? (
          <p className="site-contact-note">{copy.sending}</p>
        ) : null}
        {status.kind === "sent" ? (
          <p className="site-contact-note">{copy.sent}</p>
        ) : null}
        {status.kind === "error" ? (
          <>
            <p className="site-contact-note site-contact-note-error">{status.message}</p>
            <p className="site-form-note site-contact-fallback">
              {`${copy.errorMailLead} `}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </p>
          </>
        ) : null}
        {status.kind === "prepared" ? (
          <p className="site-contact-note">{copy.preparedNote}</p>
        ) : null}
      </div>

      {status.kind === "prepared" && preparedMessage ? (
        <>
          {mailtoHref ? (
            <a className="site-contact-fallback-link" href={mailtoHref}>
              {copy.preparedOpen}
            </a>
          ) : null}
          <button
            className="site-button site-button-light"
            type="button"
            onClick={copyMessage}
          >
            {copy.copyAction}
          </button>
          {copyStatus ? (
            <p className="site-contact-note" role="status" aria-live="polite">
              {copyStatus}
            </p>
          ) : null}
          {showManualCopy ? (
            <label>
              <span>{copy.manualCopyLabel}</span>
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
