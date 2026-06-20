import * as React from "react";

/**
 * INPLUX's signature spot illustration — concentric dotted rings with teal
 * nodes orbiting a central labelled node. Use on dark ink sections as a
 * stand-in for hero imagery. Honors prefers-reduced-motion.
 *
 * @startingPoint section="Brand" subtitle="Signature orbit / ecosystem graphic" viewport="700x420"
 */
export interface OrbitGraphicProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Pixel or CSS size (square). @default 360 */
  size?: number | string;
  /** Central node label. @default "Agente" */
  label?: React.ReactNode;
  /** Tracked sub-label under the central node. @default "SELF-IMPROVING" */
  sublabel?: React.ReactNode;
  /** Tune colors for dark ink vs. light surfaces. @default true */
  onDark?: boolean;
  /** Animate orbit + node pulse. @default true */
  animate?: boolean;
}

export function OrbitGraphic(props: OrbitGraphicProps): JSX.Element;
