"use client";

import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  type RefObject,
} from "react";
import { useContactDialog } from "@/components/site/ContactDialog";

export type ContactSource =
  | "home-hero"
  | "home-offer"
  | "header-desktop"
  | "header-mobile"
  | "about-closing"
  // La home en inglés declara sus propios orígenes para no confundir la
  // telemetría de los disparadores con los de la ruta española.
  | "en-home-hero"
  | "en-home-offer"
  | "en-header-desktop"
  | "en-header-mobile";

type ContactLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  beforeOpen?: () => void | Promise<void>;
  fallbackHref: string;
  returnFocusRef?: RefObject<HTMLElement | null>;
  source: ContactSource;
};

export function ContactLink({
  beforeOpen,
  fallbackHref,
  onClick,
  returnFocusRef,
  source,
  target,
  ...props
}: ContactLinkProps) {
  const { openContact } = useContactDialog();

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const isModified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (event.button !== 0 || isModified || target === "_blank") return;

    event.preventDefault();
    const returnFocus = returnFocusRef?.current ?? event.currentTarget;
    const animate = event.detail !== 0;
    await beforeOpen?.();
    openContact({ animate, returnFocus });
  };

  return (
    <a
      {...props}
      href={fallbackHref}
      target={target}
      aria-controls="site-contact-dialog"
      aria-haspopup="dialog"
      data-contact-trigger={source}
      onClick={handleClick}
    />
  );
}
