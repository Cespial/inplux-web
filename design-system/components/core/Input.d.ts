import * as React from "react";

/** Text input — white surface, hairline border, ink focus ring (no blue). */
export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  /** Show invalid (teal) border. @default false */
  invalid?: boolean;
}
export function Input(props: InputProps): JSX.Element;

/** Labelled field wrapper: uppercase label + helper/error text around any control. */
export interface FieldProps {
  label?: React.ReactNode;
  htmlFor?: string;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Field(props: FieldProps): JSX.Element;
