import * as React from "react";

/**
 * Animated INPLUX Estratos mark — bars rise into place in sequence.
 * `mode="enter"` plays once (hero entrance); `mode="loading"` loops a rising
 * wave (spinners, "thinking" states). Respects prefers-reduced-motion.
 *
 * @startingPoint section="Brand" subtitle="Animated logo mark (hero / loading)" viewport="320x320"
 */
export interface MarkAnimatedProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Pixel or CSS size (square). @default 96 */
  size?: number | string;
  /** Animation behavior. @default "enter" */
  mode?: "enter" | "loading";
  /** Render on a rounded ink tile (app-icon style). @default false */
  tile?: boolean;
  /** White bars + teal-bright accent for dark surfaces. @default false */
  onDark?: boolean;
}

export function MarkAnimated(props: MarkAnimatedProps): JSX.Element;
