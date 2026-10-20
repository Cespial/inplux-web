import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import ui from "./v5.module.css";

/*
 * Las primitivas del sistema v5. Cada una recibe props: ninguna conoce el copy
 * de una página ni lee contenido. El HTML que producen es el mismo que la
 * portada v5 publicó en octubre de 2026; las páginas los componen.
 *
 * Los identificadores (`id`) siempre llegan de fuera: `verify-build-output`
 * exige que sean únicos por página y los `aria-labelledby` los necesitan
 * estables.
 *
 * La entrada al hacer scroll también va aquí, en atributos que lee
 * `Reveal.client.tsx`: `data-reveal` (un bloque), `data-reveal-children` (los
 * hijos escalonados) y `data-reveal-band` (cada hijo directo de una banda por
 * su cuenta, salvo los que ya traen su propio `data-reveal*`).
 */

export { ui as v5 };

/** Une clases omitiendo las vacías. */
export function cx(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ tipo */

export function Eyebrow({
  children,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "span";
}) {
  return <Tag className={cx(ui.eyebrow, className)}>{children}</Tag>;
}

/**
 * Cabecera de sección: ojo, título y, a la derecha o debajo, el lead o un
 * enlace. `align="split"` reparte en dos columnas; `"center"` centra.
 */
export function SectionHead({
  id,
  eyebrow,
  title,
  lead,
  link,
  align = "split",
  titleClassName,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  link?: { href: string; label: string };
  align?: "split" | "center";
  titleClassName?: string;
}) {
  if (align === "center") {
    return (
      <div className={ui.headC} data-reveal="">
        <p className={ui.eyebrow}>{eyebrow}</p>
        <h2 className={cx(ui.d2, titleClassName)} id={id}>{title}</h2>
        {lead ? <p className={ui.lead}>{lead}</p> : null}
      </div>
    );
  }
  return (
    <div className={ui.head} data-reveal="">
      <div>
        <p className={ui.eyebrow}>{eyebrow}</p>
        <h2 className={cx(ui.d2, titleClassName)} id={id}>{title}</h2>
      </div>
      {link ? (
        <p className={ui.headLink}>
          <Link href={link.href}>
            {link.label} <span aria-hidden="true">→</span>
          </Link>
        </p>
      ) : lead ? (
        <p className={ui.lead}>{lead}</p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------ componentes */

/** Las cuatro cruces de esquina que marcan una banda destacada. */
export function Plus() {
  return (
    <>
      <span className={`${ui.plus} ${ui.tl}`} aria-hidden="true">+</span>
      <span className={`${ui.plus} ${ui.tr}`} aria-hidden="true">+</span>
      <span className={`${ui.plus} ${ui.bl}`} aria-hidden="true">+</span>
      <span className={`${ui.plus} ${ui.br}`} aria-hidden="true">+</span>
    </>
  );
}

/**
 * Una banda de página. `tone="dark"` es el fondo del sitio; `"light"` es la
 * banda marfil. Las bandas con fondo propio (textura, video) lo ponen con su
 * `className`; la primitiva nunca pinta fondo fuera de `light`.
 */
export function Band({
  id,
  tone = "dark",
  plus = false,
  labelledBy,
  className,
  children,
  as: Tag = "section",
}: {
  id?: string;
  tone?: "dark" | "light";
  plus?: boolean;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
  as?: "section" | "div";
}) {
  return (
    <Tag
      id={id}
      className={cx(ui.band, tone === "light" && ui.light, className)}
      aria-labelledby={labelledBy}
    >
      {plus ? <Plus /> : null}
      <div className={ui.wrap} data-reveal-band="">
        {children}
      </div>
    </Tag>
  );
}

export type ButtonVariant = "primary" | "ghost";

/** La clase de botón, para los enlaces que no pueden ser `Button` (ContactLink, CopyEmailButton). */
export function buttonClass(variant: ButtonVariant, className?: string) {
  return cx(ui.btn, variant === "primary" ? ui.primary : ui.ghost, className);
}

/**
 * Enlace con forma de botón. Interno → `next/link`; con `#` o externo → `<a>`.
 * El primario dibuja su flecha por CSS; el fantasma recibe la suya como hijo.
 */
export function Button({
  href,
  variant = "ghost",
  className,
  children,
  external = false,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
  external?: boolean;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">) {
  const classes = buttonClass(variant, className);
  if (external || href.startsWith("#") || href.startsWith("mailto:")) {
    return (
      <a
        className={classes}
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link className={classes} href={href} {...rest}>
      {children}
    </Link>
  );
}

/** Estado o etiqueta en píldora. `dot` pinta el punto de estado; `tone="pilot"` lo pone ámbar. */
export function Chip({
  children,
  tone,
  dot = false,
  className,
}: {
  children: ReactNode;
  tone?: "live" | "pilot";
  dot?: boolean;
  className?: string;
}) {
  return (
    <span className={cx(ui.chip, tone === "pilot" && ui.pilot, className)}>
      {dot ? <i /> : null}
      {children}
    </span>
  );
}

/** Deduce el tono de un estado publicado («piloto», «beta» → pilot). */
export function statusTone(status: string): "live" | "pilot" {
  return /piloto|beta|pilot/i.test(status) ? "pilot" : "live";
}

/* -------------------------------------------------------------- bloques */

/**
 * Lista de filas numeradas (los sectores de la portada): número, título,
 * detalle, etiqueta y flecha, cada fila un enlace.
 */
export function RowsList({
  items,
  className,
}: {
  items: readonly { title: string; detail: string; tag?: string; href: string }[];
  className?: string;
}) {
  return (
    <ul className={cx(ui.rows, className)} data-reveal-children="quiet">
      {items.map((item, index) => (
        <li key={item.href + item.title}>
          <Link href={item.href}>
            <span className={ui.n}>{`0${index + 1}`}</span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
            {item.tag ? <small>{item.tag}</small> : null}
            <i aria-hidden="true">→</i>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Bloque alternado: texto a un lado y un medio (captura, terminal, figura) al
 * otro. `reverse` pone el medio a la izquierda.
 */
export function FeatureSplit({
  id,
  kicker,
  title,
  lead,
  extra,
  actions,
  media,
  reverse = false,
  titleClassName,
}: {
  id?: string;
  kicker: ReactNode;
  title: ReactNode;
  lead: ReactNode;
  /** Bloques después del lead (una lista, una nota): van fuera del `<p>` para que el HTML sea válido. */
  extra?: ReactNode;
  actions?: ReactNode;
  media: ReactNode;
  reverse?: boolean;
  titleClassName?: string;
}) {
  const text = (
    <div className={ui.featText}>
      <p className={ui.kicker}>{kicker}</p>
      <h3 className={cx(ui.d2, ui.featTitle, titleClassName)}>{title}</h3>
      <p className={ui.lead}>{lead}</p>
      {extra}
      {actions ? <div className={ui.featActions}>{actions}</div> : null}
    </div>
  );
  return (
    <article className={cx(ui.feat, reverse && ui.rev)} id={id} data-reveal-children="media">
      {reverse ? media : text}
      {reverse ? text : media}
    </article>
  );
}

/** Captura de producto enmarcada, para el lado medio de un `FeatureSplit`. */
export function Shot({ children }: { children: ReactNode }) {
  return <figure className={ui.shot}>{children}</figure>;
}

/** Línea de tiempo de fases (cómo trabajamos). */
export function Timeline({
  phases,
  deliverableLabel,
}: {
  phases: readonly { title: string; detail: string; deliverable: string }[];
  deliverableLabel: string;
}) {
  return (
    <ol className={ui.timeline} data-reveal-children="">
      {phases.map((phase, index) => (
        <li key={phase.title}>
          <b>{`0${index + 1}`}</b>
          <h3>{phase.title}</h3>
          <p>{phase.detail}</p>
          <p className={ui.deliverable}>
            <span>{deliverableLabel}</span>
            {phase.deliverable}
          </p>
        </li>
      ))}
    </ol>
  );
}

/** Retícula de tarjetas compactas (hasta cuatro por fila). */
export function CardGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx(ui.minis, className)} data-reveal-children="">
      {children}
    </div>
  );
}

/**
 * Tarjeta compacta: imagen o marcador arriba, meta, título y una línea. Con
 * `href` es un enlace; sin él, un bloque (lo que está en desarrollo).
 */
export function Card({
  id,
  href,
  media,
  meta,
  title,
  text,
  className,
}: {
  id?: string;
  href?: string;
  media: ReactNode;
  meta: ReactNode;
  title: string;
  text: string;
  className?: string;
}) {
  const body = (
    <>
      <span className={ui.miniMedia}>{media}</span>
      <div>
        <p className={ui.meta}>{meta}</p>
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
    </>
  );
  if (href) {
    return (
      <Link className={cx(ui.mini, className)} href={href} id={id}>
        {body}
      </Link>
    );
  }
  return (
    <div className={cx(ui.mini, ui.dev, className)} id={id}>
      {body}
    </div>
  );
}

/** Marcador de tarjeta sin captura («En desarrollo»). */
export function Placeholder({ children }: { children: ReactNode }) {
  return <span className={ui.ph}>{children}</span>;
}

/**
 * Banda de cierre centrada: ojo, título con énfasis, lead y lo que la página
 * ponga debajo (correo, botones, nota de entidad).
 */
export function CloseBand({
  id,
  titleId,
  eyebrow,
  title,
  lead,
  children,
  footnote,
}: {
  id: string;
  titleId: string;
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  children?: ReactNode;
  footnote?: ReactNode;
}) {
  return (
    <section id={id} className={ui.close} aria-labelledby={titleId}>
      <Plus />
      <div className={`${ui.wrap} ${ui.closeInner}`} data-reveal-children="quiet">
        <p className={ui.eyebrow}>{eyebrow}</p>
        <h2 className={ui.d1} id={titleId}>{title}</h2>
        <p className={ui.lead}>{lead}</p>
        {children}
        {footnote ? <p className={ui.entity}>{footnote}</p> : null}
      </div>
    </section>
  );
}

/** Fila de correo y botones del cierre. */
export function MailRow({ children }: { children: ReactNode }) {
  return <div className={ui.mailRow}>{children}</div>;
}

/** Fragmento histórico: un destino de ancla sin caja. */
export function Anchor({ id }: { id: string }) {
  return <span id={id} className={ui.anchor} aria-hidden="true" />;
}
