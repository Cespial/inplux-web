import Image from "next/image";
import type { Lang } from "@/content/i18n";
import { mockupUi } from "@/content/page-ui";
import type { WorkProfile } from "@/content/work";
import { appScreens } from "@/content/work-captures";
import { formatLongDateEn, verificationDateFor, verifiedAtFor } from "@/content/work-format";
import styles from "./ProductMockups.module.css";

/*
 * Los mockups de `/trabajo`: una ventana por producto, en HTML y CSS, con las
 * cifras que cada uno publica en su sitio. Son figuras de lectura, no capturas:
 * lo dicen en su línea de cierre y nunca inventan un dato que el perfil no
 * tenga. Las cifras salen de `profile.interface`, que es el mismo espejo que
 * pinta `WorkPreview` en el perfil del producto.
 *
 * Con `animate`, la ventana entra con sus datos —la cifra sube, la barra se
 * llena, las filas aparecen una tras otra—. Solo se usa en el hero de cada
 * ficha, que está a la vista al cargar; en `/trabajo` la ventana queda quieta.
 */

type MockupProps = { profile: WorkProfile; animate?: boolean; lang?: Lang };

function Window({
  name,
  status,
  theme,
  children,
  footer,
  label,
  animate,
}: {
  animate?: boolean;
  name: string;
  status: string;
  theme: WorkProfile["interface"]["theme"];
  children: React.ReactNode;
  footer: string;
  label: string;
}) {
  return (
    <figure
      className={styles.mock}
      data-theme={theme}
      data-animate={animate || undefined}
      role="img"
      aria-label={label}
    >
      <div className={styles.bar}>
        <i aria-hidden="true">
          <span />
          <span />
          <span />
        </i>
        <p>{name}</p>
        <span>{status}</span>
      </div>
      <div className={styles.body}>{children}</div>
      <figcaption className={styles.footer}>{footer}</figcaption>
    </figure>
  );
}

function item(profile: WorkProfile, index: number) {
  return profile.interface.items[index] ?? { label: "", value: "" };
}

/** Tribai: una llamada al servidor MCP y su respuesta con fuente. Ejemplo ilustrativo. */
export function TribaiMockup({ profile, animate, lang = "es" }: MockupProps) {
  const ui = mockupUi[lang].tribai;
  return (
    <Window
      animate={animate}
      name="tribai-mcp"
      status="200 OK"
      theme={profile.interface.theme}
      label={ui.label}
      footer={ui.footer}
    >
      <pre className={styles.code}>
        <span className={styles.c}>{ui.call}</span>
        {"\n"}
        <span className={styles.k}>tools/call</span> <span className={styles.u}>vigencia_articulo</span>
        {"\n"}
        {"{ "}
        <span className={styles.s}>&quot;articulo&quot;</span>: <span className={styles.s}>&quot;240&quot;</span>,{" "}
        <span className={styles.s}>&quot;norma&quot;</span>: <span className={styles.s}>&quot;Estatuto Tributario&quot;</span>
        {" }"}
        {"\n\n"}
        <span className={styles.c}>{ui.answer}</span>
        {"\n"}
        {"{"}
        {"\n  "}
        <span className={styles.s}>&quot;titulo&quot;</span>: <span className={styles.s}>&quot;Tarifa general para personas jurídicas&quot;</span>,
        {"\n"}
        <span className={styles.hl}>
          {"  "}
          <span className={styles.s}>&quot;tarifa&quot;</span>: <span className={styles.n}>0.35</span>,
        </span>
        {"\n"}
        <span className={styles.hl}>
          {"  "}
          <span className={styles.s}>&quot;modificado_por&quot;</span>: <span className={styles.s}>&quot;Ley 2277 de 2022, art. 10&quot;</span>,
        </span>
        {"\n  "}
        <span className={styles.s}>&quot;vigente&quot;</span>: <span className={styles.n}>true</span>,
        {"\n  "}
        <span className={styles.s}>&quot;fuente&quot;</span>: <span className={styles.u}>&quot;secretariasenado.gov.co/…/estatuto_tributario&quot;</span>
        {"\n"}
        {"}"}
      </pre>
    </Window>
  );
}

/** Gobia: el tablero de un municipio con las cifras de su demo pública. */
export function GobiaMockup({ profile, animate, lang = "es" }: MockupProps) {
  const ui = mockupUi[lang].gobia;
  const recaudo = item(profile, 0);
  const fut = item(profile, 1);
  const estatuto = item(profile, 2);
  return (
    <Window
      animate={animate}
      name="gobia.co · demo"
      status={profile.status.label}
      theme={profile.interface.theme}
      label={ui.label}
      footer={ui.footer}
    >
      <div className={styles.board}>
        <div className={styles.metric}>
          <span>{recaudo.label}</span>
          <strong>{recaudo.value.split(" ")[0]}</strong>
          <small>{recaudo.value.replace(/^\S+\s*/, "")}</small>
          <i className={styles.meter} aria-hidden="true">
            <b style={{ width: "89.5%" }} />
          </i>
        </div>
        <dl className={styles.rows}>
          <div>
            <dt>{profile.interface.metricLabel}</dt>
            <dd data-accent>{profile.interface.primaryMetric}</dd>
          </div>
          <div>
            <dt>{fut.label}</dt>
            <dd>{fut.value}</dd>
          </div>
          <div>
            <dt>{estatuto.label}</dt>
            <dd>{estatuto.value}</dd>
          </div>
        </dl>
      </div>
    </Window>
  );
}

/** Kelsen: un explorador con resultados y la ruta hasta la fuente. */
export function KelsenMockup({ profile, animate, lang = "es" }: MockupProps) {
  const ui = mockupUi[lang].kelsen;
  return (
    <Window
      animate={animate}
      name={ui.window}
      status={profile.status.label}
      theme={profile.interface.theme}
      label={ui.label}
      footer={ui.footer}
    >
      <div className={styles.search}>
        <div className={styles.query}>
          <span aria-hidden="true">⌕</span>
          <p>{ui.query}</p>
        </div>
        <ol className={styles.results}>
          {profile.interface.items.map((row) => (
            <li key={row.label} data-accent={row.state === "accent" || undefined}>
              <strong>{row.label}</strong>
              <p>{row.value}</p>
              <small>{ui.path}</small>
            </li>
          ))}
        </ol>
      </div>
    </Window>
  );
}

/** Laudos: el corpus con sus dos fondos y la cobertura, como los publica el laboratorio. */
export function LaudosMockup({ profile, animate, lang = "es" }: MockupProps) {
  const ui = mockupUi[lang].laudos;
  const labUrl = "https://laudos.co/?view=predecir";
  const verified =
    lang === "en"
      ? formatLongDateEn(verifiedAtFor(profile.sources, labUrl))
      : verificationDateFor(profile.sources, labUrl);
  return (
    <Window
      animate={animate}
      name={ui.window}
      status={profile.status.label}
      theme={profile.interface.theme}
      label={ui.label}
      footer={ui.footer(verified)}
    >
      <div className={styles.corpus}>
        <div className={styles.metric}>
          <span>{profile.interface.metricLabel}</span>
          <strong>{profile.interface.primaryMetric}</strong>
        </div>
        <ul className={styles.filters}>
          {profile.interface.items.map((row) => (
            <li key={row.label} data-accent={row.state === "accent" || undefined}>
              <span>{row.label}</span>
              <b>{row.value}</b>
            </li>
          ))}
        </ul>
        <div className={styles.tabs} aria-hidden="true">
          <span data-active>{ui.tabs[0]}</span>
          <span>{ui.tabs[1]}</span>
          <span>{ui.tabs[2]}</span>
        </div>
      </div>
    </Window>
  );
}

/** Porkia: la ficha de una finca, con los frentes que la app lleva. */
export function PorkiaMockup({ profile, animate, lang = "es" }: MockupProps) {
  const ui = mockupUi[lang].porkia;
  return (
    <Window
      animate={animate}
      name="porkia.co · demo"
      status={profile.status.label}
      theme={profile.interface.theme}
      label={ui.label}
      footer={ui.footer}
    >
      <div className={styles.farm}>
        <div className={styles.metric}>
          <span>{profile.interface.eyebrow.toLowerCase()}</span>
          <strong>{profile.interface.primaryMetric}</strong>
          <small>{profile.interface.metricLabel}</small>
        </div>
        <dl className={styles.rows}>
          {profile.interface.items.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd data-accent={row.state === "accent" || undefined}>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Window>
  );
}

/**
 * MiMotoYa: tres pantallas reales de la app, no una figura. Es el único perfil
 * sin página pública que dibujar o fotografiar, y lo que sí hay son las
 * pantallas que entregó INPLUX; la ventana las enseña tal cual —recortado solo
 * el titular que las acompaña— en vez de recrear una interfaz que no se puede
 * comprobar.
 */
const MIMOTOYA_PICKS = [0, 2, 4] as const;

export function MiMotoYaMockup({ profile, animate, lang = "es" }: MockupProps) {
  const ui = mockupUi[lang].mimotoya;
  const screens = appScreens[profile.slug] ?? [];
  return (
    <Window
      animate={animate}
      name={ui.window}
      status={profile.status.label}
      theme={profile.interface.theme}
      label={ui.label}
      footer={ui.footer}
    >
      <div className={styles.phones}>
        {MIMOTOYA_PICKS.map((index) => screens[index]).flatMap((screen) =>
          screen ? (
            <span key={screen.src} className={styles.phone}>
              <Image
                src={screen.src}
                alt=""
                width={screen.width}
                height={screen.height}
                sizes="(max-width: 760px) 28vw, 11rem"
                priority={animate}
              />
            </span>
          ) : [],
        )}
      </div>
    </Window>
  );
}

export const productMockups = {
  tribai: TribaiMockup,
  gobia: GobiaMockup,
  kelsen: KelsenMockup,
  laudos: LaudosMockup,
  porkia: PorkiaMockup,
  mimotoya: MiMotoYaMockup,
} as const satisfies Record<WorkProfile["slug"], (props: MockupProps) => React.ReactNode>;
