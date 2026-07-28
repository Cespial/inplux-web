import type { ReactNode } from "react";

type SectionHeadingProps = {
  number?: string;
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  inverse?: boolean;
  compact?: boolean;
};

export function SectionHeading({
  number,
  eyebrow,
  title,
  copy,
  inverse = false,
  compact = false,
}: SectionHeadingProps) {
  return (
    <header
      className={`site-section-heading${inverse ? " is-inverse" : ""}${
        compact ? " is-compact" : ""
      }`}
    >
      <p className="site-eyebrow">
        {number ? <span aria-hidden="true">{number} / </span> : null}
        {eyebrow}
      </p>
      <h2>{title}</h2>
      {copy ? <p className="site-section-copy">{copy}</p> : null}
    </header>
  );
}
