"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { homeCopyEs } from "@/content/copy/es";
import { formatCopy } from "@/content/copy/format";
import type { ContactFormCopy } from "@/content/copy/types";

const contactEmail = "gerencia@inplux.co";

type ContactFormProps = {
  context?: "dialog" | "section";
  copy?: ContactFormCopy;
};

export function ContactForm({
  context = "section",
  copy = homeCopyEs.contactForm,
}: ContactFormProps) {
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

    setPreparedMessage(
      [
        `${copy.mailTo}: ${contactEmail}`,
        `${copy.mailSubjectLabel}: ${subject}`,
        "",
        body,
      ].join("\n"),
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
      setCopyStatus(copy.copySuccess);
      setShowManualCopy(false);
    } else {
      setCopyStatus(copy.copyFailure);
      setShowManualCopy(true);
    }
  };

  return (
    <form
      className="site-contact-form"
      data-contact-form={context}
      aria-label={context === "dialog" ? copy.dialogLabel : copy.sectionLabel}
      onSubmit={onSubmit}
    >
      <div className="site-form-row">
        <label>
          <span>{copy.nameLabel}</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            required
          />
        </label>
        <label>
          <span>{`${copy.organizationLabel} `}<em>{copy.organizationOptional}</em></span>
          <input
            name="organization"
            type="text"
            autoComplete="organization"
            maxLength={160}
          />
        </label>
      </div>

      <label>
        <span>{copy.needLabel}</span>
        <select name="needType" defaultValue={copy.needDefault}>
          {copy.needOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>

      <label>
        <span>{copy.challengeLabel}</span>
        <textarea
          name="challenge"
          rows={5}
          placeholder={copy.challengePlaceholder}
          maxLength={900}
          required
        />
      </label>

      <p className="site-form-note">{copy.note}</p>
      <button className="site-button site-button-light" type="submit">
        {`${copy.submit} `}<span aria-hidden="true">↗</span>
      </button>

      {preparedMessage ? (
        <>
          <p className="site-contact-note" role="status">
            {copy.preparedNote}
          </p>
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
