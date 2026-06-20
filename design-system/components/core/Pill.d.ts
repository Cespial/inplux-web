import * as React from "react";

/**
 * Authority-stat capsule — outline pill with a teal leading figure and a muted
 * label, e.g. "+25 años". Used in rows under hero statements.
 */
export interface PillProps extends React.ComponentPropsWithoutRef<"span"> {
  /** Teal-accented figure, e.g. "+25". */
  figure: React.ReactNode;
  /** Muted label, e.g. "años". */
  label: React.ReactNode;
  /** Style for dark ink sections. @default false */
  onDark?: boolean;
}

export function Pill(props: PillProps): JSX.Element;
