"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import styles from "./CapabilityRail.module.css";

/*
 * Carrusel de capacidades del perfil de producto: tarjetas en una pista con
 * `scroll-snap`, dos botones ←/→ y las flechas del teclado sobre la pista. Sin
 * librerías. Los botones se apagan en los extremos leyendo el scroll real, no
 * contando tarjetas, para que un ancho de pantalla distinto no los deje mal.
 */
export function CapabilityRail({
  items,
  ariaLabel,
}: {
  items: readonly { title: string; description: string }[];
  ariaLabel: string;
}) {
  const track = useRef<HTMLUListElement | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const measure = () => {
      const max = element.scrollWidth - element.clientWidth;
      setEdges({ start: element.scrollLeft <= 2, end: element.scrollLeft >= max - 2 });
    };
    measure();
    element.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {
      element.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, []);

  function step(direction: 1 | -1) {
    const element = track.current;
    if (!element) return;
    const card = element.querySelector("li");
    const width = card ? card.getBoundingClientRect().width + 20 : element.clientWidth * 0.8;
    element.scrollBy({ left: width * direction, behavior: "smooth" });
  }

  function onKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  }

  return (
    <div className={styles.rail}>
      <ul
        ref={track}
        className={styles.track}
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {items.map((item, index) => (
          <li key={item.title} className={styles.card}>
            <div className={styles.chrome} aria-hidden="true">
              <span>{`0${index + 1}`}</span>
              <i>
                <b style={{ width: `${48 + ((index * 17) % 40)}%` }} />
                <b style={{ width: `${30 + ((index * 23) % 50)}%` }} />
                <b style={{ width: `${62 - ((index * 11) % 30)}%` }} />
              </i>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
      <div className={styles.controls}>
        <button type="button" onClick={() => step(-1)} disabled={edges.start} aria-label="Capacidad anterior">
          ←
        </button>
        <button type="button" onClick={() => step(1)} disabled={edges.end} aria-label="Capacidad siguiente">
          →
        </button>
      </div>
    </div>
  );
}
