"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { LazyMotion, domMax, MotionConfig, m, AnimatePresence, useReducedMotion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, useMotionValueEvent, type Variants, type Transition } from "motion/react";
import { spring, pressable } from "@/lib/motion";

/* ═══════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════ */
function AnimatedNumber({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState("0");
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        const num = parseInt(value.replace(/[^0-9]/g, ""));
        const prefix = value.startsWith("+") ? "+" : "";
        if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setDisplay(prefix + num.toString());
          return;
        }
        const dur = 600;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 4);
          setDisplay(prefix + Math.round(num * ease).toString());
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <div className="font-serif text-5xl md:text-6xl lg:text-[4.5rem] text-ink leading-none mb-2 tabular-nums">{display}</div>
      <div className="text-gray-500 text-sm font-medium">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SECTION KICKER — eyebrow numerado (estilo Pinecone 01-NN)
   ═══════════════════════════════════════ */
function SectionKicker({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="text-teal text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3">
      <span className="text-gray-400 font-normal tabular-nums mr-2">{n}</span>
      <span className="text-gray-300 font-normal mr-2">/</span>
      {children}
    </p>
  );
}

/* ═══════════════════════════════════════
   VECTOR CLOUD — hero visual (memoria del agente)
   ═══════════════════════════════════════ */
type VPoint = { id: number; x: number; y: number; size: number; vop: number; delay: number };
function makeVecPoints(seed: number, count: number, radius: number, cx: number, cy: number): VPoint[] {
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, (_, i) => {
    const r = Math.sqrt(rand()) * radius;
    const a = rand() * Math.PI * 2;
    return {
      id: i,
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
      size: 1.2 + rand() * 1.4,
      vop: 0.4 + rand() * 0.5,
      delay: rand() * 6,
    };
  });
}
const VEC_POINTS: VPoint[] = makeVecPoints(7, 240, 270, 300, 300);
const VEC_HIGHLIGHT: VPoint[] = makeVecPoints(91, 5, 230, 300, 300);

/* ═══════════════════════════════════════
   BRAIN GRAPH — el "segundo cerebro" como supergrafo
   Nodos deterministas + aristas a vecinos cercanos.
   ═══════════════════════════════════════ */
type GNode = { id: number; x: number; y: number; size: number; vop: number; delay: number };
function makeBrainGraph(seed: number, count: number, w: number, h: number): { nodes: GNode[]; edges: [number, number][] } {
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const cx = w / 2, cy = h / 2;
  const nodes: GNode[] = Array.from({ length: count }, (_, i) => {
    const r = Math.pow(rand(), 0.62) * (h / 2 - 26);
    const a = rand() * Math.PI * 2;
    return {
      id: i,
      x: cx + Math.cos(a) * r * 1.12,
      y: cy + Math.sin(a) * r,
      size: 1 + rand() * 1.9,
      vop: 0.35 + rand() * 0.5,
      delay: Math.round(rand() * 600) / 100,
    };
  });
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  const maxD = (h * 0.17) ** 2;
  for (let i = 0; i < nodes.length; i++) {
    const near: { j: number; d: number }[] = [];
    for (let j = 0; j < nodes.length; j++) {
      if (j === i) continue;
      const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
      const d = dx * dx + dy * dy;
      if (d < maxD) near.push({ j, d });
    }
    near.sort((p, q) => p.d - q.d);
    near.slice(0, 2).forEach((o) => {
      const k = i < o.j ? `${i}-${o.j}` : `${o.j}-${i}`;
      if (!seen.has(k)) { seen.add(k); edges.push([i, o.j]); }
    });
  }
  return { nodes, edges };
}
const MOTOR_GRAPH = makeBrainGraph(73, 180, 520, 460);
const MOTOR_HILITE = [9, 31, 54, 78, 103, 121, 147, 168];

/* Grafo cerebral reutilizable (puro visual; los textos van en HTML alrededor) */
function BrainGraph({ data, highlights = [], reticleId, uid, w, h }: { data: { nodes: GNode[]; edges: [number, number][] }; highlights?: number[]; reticleId?: number; uid: string; w: number; h: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);
  const prefersReduced = useReducedMotion();
  // Tras el ensamblaje, Motion suelta el control y volvemos a SVG plano:
  // el twinkle CSS (--vop) y el focus/dim (opacity vía data-attrs) recuperan el mando.
  const [assembled, setAssembled] = useState(false);

  const adj = useMemo(() => {
    const m = new Map<number, Set<number>>();
    data.edges.forEach(([a, b]) => {
      (m.get(a) ?? m.set(a, new Set()).get(a))!.add(b);
      (m.get(b) ?? m.set(b, new Set()).get(b))!.add(a);
    });
    return m;
  }, [data]);

  const focus = (id: number | null) => {
    const svg = svgRef.current;
    if (!svg) return;
    if (id == null) {
      svg.removeAttribute("data-focusing");
      svg.querySelectorAll("[data-on]").forEach((el) => el.removeAttribute("data-on"));
      return;
    }
    const nbrs = adj.get(id);
    svg.setAttribute("data-focusing", "1");
    svg.querySelectorAll<SVGElement>("[data-node]").forEach((el) => {
      const nid = Number(el.getAttribute("data-node"));
      if (nid === id || (nbrs && nbrs.has(nid))) el.setAttribute("data-on", ""); else el.removeAttribute("data-on");
    });
    svg.querySelectorAll<SVGElement>("[data-edge]").forEach((el) => {
      const on = Number(el.getAttribute("data-a")) === id || Number(el.getAttribute("data-b")) === id;
      if (on) el.setAttribute("data-on", ""); else el.removeAttribute("data-on");
    });
  };

  const onMove = (e: React.PointerEvent) => {
    if (!assembled) return; // durante el ensamblaje no peleamos estilos con Motion
    const hit = (e.target as Element).closest?.("[data-node]");
    const id = hit ? Number(hit.getAttribute("data-node")) : null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => focus(id));
  };
  const onLeave = () => {
    if (!assembled) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    focus(null);
  };

  const reduced = !!prefersReduced;
  const nodesContainer: Variants = {
    hidden: {},
    show: { transition: reduced ? { duration: 0 } : { staggerChildren: 0.004, delayChildren: 0.05 } },
  };
  const edgesContainer: Variants = {
    hidden: {},
    show: { transition: reduced ? { duration: 0 } : { staggerChildren: 0.004, delayChildren: 0.18 } },
  };
  const nodeVariants: Variants = {
    hidden: reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 },
    show: (delay: number) => ({
      opacity: 1,
      scale: 1,
      transition: reduced ? { duration: 0 } : ({ type: "spring", stiffness: 420, damping: 26, mass: 0.7, delay: delay * 0.018 } as Transition),
    }),
  };
  const edgeVariants: Variants = {
    hidden: reduced ? { pathLength: 1 } : { pathLength: 0 },
    show: (delay: number) => ({
      pathLength: 1,
      transition: reduced ? { duration: 0 } : ({ duration: 0.55, ease: "easeOut", delay: delay * 0.012 } as Transition),
    }),
  };
  const onNodesComplete = useCallback(() => setAssembled(true), []);

  const renderNodes = () =>
    data.nodes.map((n) =>
      assembled ? (
        <circle key={`n${n.id}`} data-node={n.id} className="vec-dot brain-node" cx={n.x} cy={n.y} r={n.size} style={{ ["--vop" as string]: n.vop.toString(), animationDelay: `${n.delay}s`, transformBox: "fill-box", transformOrigin: "center" } as React.CSSProperties} />
      ) : (
        <m.circle key={`n${n.id}`} data-node={n.id} className="brain-node" cx={n.x} cy={n.y} r={n.size} custom={n.delay} variants={nodeVariants} style={{ transformBox: "fill-box", transformOrigin: "center", opacity: n.vop } as React.CSSProperties} />
      )
    );

  const renderEdges = () =>
    data.edges.map(([a, b], i) =>
      assembled ? (
        <line key={`e${i}`} data-edge data-a={a} data-b={b} x1={data.nodes[a].x} y1={data.nodes[a].y} x2={data.nodes[b].x} y2={data.nodes[b].y} strokeWidth="0.6" opacity={i % 5 === 0 ? 0.55 : 0.2} className={`brain-edge${i % 5 === 0 ? " svg-flow" : ""}`} />
      ) : (
        <m.line key={`e${i}`} data-edge data-a={a} data-b={b} x1={data.nodes[a].x} y1={data.nodes[a].y} x2={data.nodes[b].x} y2={data.nodes[b].y} strokeWidth="0.6" custom={i} variants={edgeVariants} className="brain-edge" style={{ opacity: i % 5 === 0 ? 0.55 : 0.2 }} />
      )
    );

  return (
    <m.svg ref={svgRef} onPointerMove={onMove} onPointerLeave={onLeave} viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="brain-svg w-full h-auto" role="img" aria-label="Grafo de conocimiento interactivo: pasa el cursor sobre un nodo para iluminar sus conexiones" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
      <defs><filter id={`bg-${uid}`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5" /></filter></defs>
      <ellipse cx={w / 2} cy={h / 2} rx={w * 0.47} ry={h * 0.47} fill="url(#tealHalo)" opacity="0.6" className="svg-halo-pulse" style={{ pointerEvents: "none" }} />
      <g filter={`url(#bg-${uid})`} fill="#15dcc4" className="brain-glow" style={{ pointerEvents: "none" }}>
        {data.nodes.map((n) => (
          <circle key={`g${n.id}`} cx={n.x} cy={n.y} r={n.size * 2.4} opacity={n.vop * 0.55} />
        ))}
      </g>
      <m.g stroke="#0fb3a1" style={{ pointerEvents: "none" }} variants={edgesContainer}>
        {renderEdges()}
      </m.g>
      <m.g fill="#0d7d74" variants={nodesContainer} onAnimationComplete={onNodesComplete}>
        {renderNodes()}
      </m.g>
      {highlights.map((id, i) => {
        const n = data.nodes[id];
        return (
          <g key={`h${i}`} style={{ pointerEvents: "none" }}>
            <circle cx={n.x} cy={n.y} r="10" fill="none" stroke="#0d7d74" strokeWidth="1" opacity="0.5" />
            <circle className="eco-node-pulse" cx={n.x} cy={n.y} r="4.5" fill="#0d7d74" style={{ animationDelay: `${i * 0.5}s` }} />
          </g>
        );
      })}
      {reticleId != null && data.nodes[reticleId] && (
        <g className="vec-cursor" style={{ transformOrigin: `${data.nodes[reticleId].x}px ${data.nodes[reticleId].y}px`, pointerEvents: "none" }}>
          <circle cx={data.nodes[reticleId].x} cy={data.nodes[reticleId].y} r="15" fill="none" stroke="#1a1918" strokeWidth="1.2" />
          <line x1={data.nodes[reticleId].x - 22} y1={data.nodes[reticleId].y} x2={data.nodes[reticleId].x - 11} y2={data.nodes[reticleId].y} stroke="#1a1918" strokeWidth="1.2" />
          <line x1={data.nodes[reticleId].x + 11} y1={data.nodes[reticleId].y} x2={data.nodes[reticleId].x + 22} y2={data.nodes[reticleId].y} stroke="#1a1918" strokeWidth="1.2" />
        </g>
      )}
    </m.svg>
  );
}

/* Grafo clusterizado — 4 lóbulos (dominios) + nodo-hub central */
function makeClusterGraph(seed: number, w: number, h: number): { nodes: GNode[]; edges: [number, number][] } {
  let s = seed >>> 0;
  const rand = () => { s = (s + 0x6D2B79F5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const lobes = [{ x: w * 0.27, y: h * 0.28 }, { x: w * 0.73, y: h * 0.28 }, { x: w * 0.27, y: h * 0.72 }, { x: w * 0.73, y: h * 0.72 }];
  const per = 30, rad = Math.min(w, h) * 0.18;
  const nodes: GNode[] = [], cluster: number[] = [];
  lobes.forEach((L, ci) => {
    for (let k = 0; k < per; k++) {
      const rr = Math.pow(rand(), 0.6) * rad, a = rand() * Math.PI * 2;
      nodes.push({ id: nodes.length, x: L.x + Math.cos(a) * rr, y: L.y + Math.sin(a) * rr, size: 1 + rand() * 1.7, vop: 0.35 + rand() * 0.5, delay: Math.round(rand() * 600) / 100 });
      cluster.push(ci);
    }
  });
  const hubId = nodes.length;
  nodes.push({ id: hubId, x: w / 2, y: h / 2, size: 3.4, vop: 1, delay: 0 }); cluster.push(-1);
  const edges: [number, number][] = [], seen = new Set<string>();
  const add = (i: number, j: number) => { const k = i < j ? `${i}-${j}` : `${j}-${i}`; if (!seen.has(k)) { seen.add(k); edges.push([i, j]); } };
  for (let i = 0; i < hubId; i++) {
    const near: { j: number; d: number }[] = [];
    for (let j = 0; j < hubId; j++) { if (j === i || cluster[j] !== cluster[i]) continue; const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y; near.push({ j, d: dx * dx + dy * dy }); }
    near.sort((p, q) => p.d - q.d); near.slice(0, 2).forEach((o) => add(i, o.j));
  }
  lobes.forEach((_, ci) => { let best = -1, bd = Infinity; for (let i = 0; i < hubId; i++) { if (cluster[i] !== ci) continue; const dx = nodes[i].x - w / 2, dy = nodes[i].y - h / 2, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } } if (best >= 0) add(best, hubId); });
  return { nodes, edges };
}
const CAPAC_GRAPH = makeClusterGraph(41, 520, 460);
const CAPAC_HILITE = [14, 44, 74, 104];

/* Grafo de flujo — denso a la izquierda (experiencia) → cristaliza a la derecha (producto) */
function makeFlowGraph(seed: number, count: number, w: number, h: number): { nodes: GNode[]; edges: [number, number][] } {
  let s = seed >>> 0;
  const rand = () => { s = (s + 0x6D2B79F5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const nodes: GNode[] = Array.from({ length: count }, (_, i) => {
    const bias = Math.pow(rand(), 1.7); // más densidad a la izquierda
    const x = 30 + bias * (w - 60);
    const spread = 30 + (x / w) * (h * 0.42); // se abre hacia la derecha
    const y = h / 2 + (rand() - 0.5) * 2 * spread;
    return { id: i, x, y, size: 1 + rand() * 1.7, vop: 0.35 + rand() * 0.5, delay: Math.round(rand() * 600) / 100 };
  });
  const edges: [number, number][] = [], seen = new Set<string>();
  const maxD = (w * 0.16) ** 2;
  for (let i = 0; i < count; i++) {
    const near: { j: number; d: number }[] = [];
    for (let j = 0; j < count; j++) { if (j === i) continue; const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y; const d = dx * dx + dy * dy; if (d < maxD) near.push({ j, d }); }
    near.sort((p, q) => p.d - q.d);
    near.slice(0, 2).forEach((o) => { const k = i < o.j ? `${i}-${o.j}` : `${o.j}-${i}`; if (!seen.has(k)) { seen.add(k); edges.push([i, o.j]); } });
  }
  return { nodes, edges };
}
const CONOC_GRAPH = makeFlowGraph(58, 150, 520, 380);
// nodos-producto: los 4 más a la derecha
const CONOC_PRODUCTS = CONOC_GRAPH.nodes.slice().sort((a, b) => b.x - a.x).slice(0, 4).map((n) => n.id);

function VectorCloud() {
  return (
    <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" role="img" aria-label="Espacio vectorial de la memoria del agente: una nube de puntos donde cada uno es un fragmento de conocimiento">
      <defs>
        <filter id="vecBlur"><feGaussianBlur stdDeviation="3.2" /></filter>
        <radialGradient id="vecBgHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#15dcc4" stopOpacity="0.18" />
          <stop offset="65%" stopColor="#15dcc4" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#15dcc4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Halo de fondo */}
      <ellipse cx="300" cy="300" rx="280" ry="280" fill="url(#vecBgHalo)" />

      {/* Órbita exterior — gira lentamente con un marcador */}
      <g className="vec-orbit">
        <circle cx="300" cy="300" r="278" fill="none" stroke="#0fb3a1" strokeWidth="1" strokeDasharray="2 9" opacity="0.5" />
        <circle cx="578" cy="300" r="3.2" fill="#15dcc4" />
      </g>
      {/* Órbita interior — más sutil */}
      <circle cx="300" cy="300" r="186" fill="none" stroke="#0fb3a1" strokeWidth="0.8" strokeDasharray="1 7" opacity="0.28" />

      {/* Capa borrosa (halos suaves) */}
      <g filter="url(#vecBlur)" fill="#15dcc4">
        {VEC_POINTS.map((p) => (
          <circle key={`h${p.id}`} className="vec-halo" cx={p.x} cy={p.y} r={p.size * 2.4} style={{ ["--vop" as string]: (p.vop * 0.55).toString(), animationDelay: `${p.delay}s` } as React.CSSProperties} />
        ))}
      </g>

      {/* Capa nítida (puntos brillantes) */}
      <g fill="#0fb3a1">
        {VEC_POINTS.map((p) => (
          <circle key={`s${p.id}`} className="vec-dot" cx={p.x} cy={p.y} r={p.size} style={{ ["--vop" as string]: p.vop.toString(), animationDelay: `${p.delay + 0.4}s` } as React.CSSProperties} />
        ))}
      </g>

      {/* Puntos destacados (vectores "seleccionados") */}
      <g>
        {VEC_HIGHLIGHT.map((p, i) => (
          <g key={`H${i}`}>
            <circle cx={p.x} cy={p.y} r={6} fill="none" stroke="#0d7d74" strokeWidth="1" opacity="0.7" />
            <circle cx={p.x} cy={p.y} r={2.6} fill="#0d7d74" />
          </g>
        ))}
      </g>

      {/* Cursor / reticle central — el agente "mira" su memoria */}
      <g className="vec-cursor">
        <circle cx="300" cy="300" r="14" fill="none" stroke="#1a1918" strokeWidth="1.4" />
        <circle cx="300" cy="300" r="3.6" fill="#1a1918" />
        <line x1="276" y1="300" x2="288" y2="300" stroke="#1a1918" strokeWidth="1" />
        <line x1="312" y1="300" x2="324" y2="300" stroke="#1a1918" strokeWidth="1" />
        <line x1="300" y1="276" x2="300" y2="288" stroke="#1a1918" strokeWidth="1" />
        <line x1="300" y1="312" x2="300" y2="324" stroke="#1a1918" strokeWidth="1" />
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════
   KELSEN PROOF — demo de producto en el hero
   La cita normativa verificable es el héroe visual.
   NOTA: consulta y cita son ILUSTRATIVAS — verificar
   vigencia con un abogado antes de publicar a prod.
   ═══════════════════════════════════════ */
const KELSEN_DEMO = {
  consulta: "¿Es válida esta cláusula compromisoria?",
  respuesta: "Sí. El pacto cumple los requisitos de existencia y validez del arbitraje nacional.",
  fuente: { norma: "Ley 1563 de 2012", detalle: "Art. 3 · Estatuto de Arbitraje" },
};

// .apps que salen del mismo motor agéntico (la fábrica de software)
const SECTOR_PUBLICO: { name: string; url: string | null; live: boolean }[] = [
  { name: "Gobia", url: "https://gobia.co", live: true },
  { name: "Tribai mun.", url: "https://tribai.co", live: true },
];
const SECTOR_PRIVADO: { name: string; url: string | null; live: boolean }[] = [
  { name: "Kelsen", url: "https://kelsen.io", live: true },
  { name: "Tribai", url: "https://tribai.co", live: true },
  { name: "Laudos", url: "https://laudos.co", live: true },
  { name: "Porkia", url: "https://porkia.co", live: true },
  { name: "MiMotoYa", url: null, live: false },
];

function KelsenProof() {
  const reducedTilt = !!useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), spring.gentle);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), spring.gentle);
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(240px circle at ${glowX} ${glowY}, rgba(13,125,116,0.10), transparent 72%)`;
  const onTilt = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onTiltLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };
  // Parallax al scroll (capas a distinta velocidad). Nodos distintos al rotate del tilt.
  const { scrollY } = useScroll();
  const cloudY = useTransform(scrollY, [0, 800], [0, 64]); // fondo: lento, mismo sentido
  const cardY = useTransform(scrollY, [0, 800], [0, -30]); // card: en contra, sutil
  return (
    <div className="relative w-full">
      {/* VectorCloud como capa de memoria difuminada detrás (solo desktop) — parallax lento */}
      <m.div className="hidden lg:block absolute -inset-10 opacity-35 blur-[2px] pointer-events-none" aria-hidden="true" style={reducedTilt ? undefined : { y: cloudY }}>
        <div className="aspect-square w-full"><VectorCloud /></div>
      </m.div>

      {/* App de Kelsen — mockup de alta fidelidad (tilt 3D + glow magnético) */}
      <m.div
        className="relative w-full max-w-[560px] mx-auto lg:ml-auto lg:mr-0"
        onMouseMove={reducedTilt ? undefined : onTilt}
        onMouseLeave={reducedTilt ? undefined : onTiltLeave}
        style={reducedTilt ? undefined : { rotateX, rotateY, y: cardY, transformPerspective: 900 }}
      >
      <div className="kelsen-card relative w-full rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        {/* Barra de título */}
        <div className="flex items-center gap-2 h-9 px-3.5 border-b border-border-light bg-off-white">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          </span>
          <span className="ml-2 inline-flex items-center gap-1.5 text-[0.7rem] text-gray-400 font-medium truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" aria-hidden="true" /> kelsen.io
          </span>
          <span className="ml-auto text-[0.58rem] font-semibold px-2 py-0.5 rounded-full bg-teal-soft text-teal shrink-0">En producción</span>
        </div>

        {/* Cuerpo: sidebar + panel */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden sm:flex w-[150px] shrink-0 flex-col border-r border-border-light bg-off-white/70 py-3 px-2.5">
            <p className="text-[0.5rem] font-bold tracking-[0.14em] uppercase text-gray-400 px-2 mb-1.5">Espacio legal</p>
            {[
              { label: "Asuntos", active: true, d: "M5 4h10M5 8h10M5 12h6" },
              { label: "Investigación", active: false, d: "M9 4a5 5 0 103.5 8.5L16 16" },
              { label: "Memoria", active: false, d: "M10 3l7 4-7 4-7-4 7-4zM3 11l7 4 7-4" },
            ].map((it) => (
              <span key={it.label} className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[0.72rem] font-medium ${it.active ? "bg-teal-soft text-teal" : "text-gray-500"}`}>
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={it.d} /></svg>
                {it.label}
              </span>
            ))}
            <p className="text-[0.5rem] font-bold tracking-[0.14em] uppercase text-gray-400 px-2 mt-3.5 mb-1.5">Módulos</p>
            {["Tribai", "Laudos", "Gobia"].map((m) => (
              <span key={m} className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[0.72rem] font-medium text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0 mx-0.5" aria-hidden="true" />
                {m}
              </span>
            ))}
          </aside>

          {/* Panel principal */}
          <div className="flex-1 min-w-0 p-4 md:p-5">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-[0.68rem] text-gray-400 font-medium truncate">Asuntos / Cláusula compromisoria</span>
              <span className="inline-flex items-center gap-1 text-[0.58rem] font-semibold text-teal shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-teal" aria-hidden="true" /> Resuelto
              </span>
            </div>

            {/* Consulta del usuario */}
            <div className="flex gap-2.5 mb-4">
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-[0.58rem] font-bold flex items-center justify-center shrink-0">CE</span>
              <div className="min-w-0">
                <p className="text-[0.58rem] font-semibold text-gray-400 mb-0.5">Tú</p>
                <p className="text-ink text-[0.9rem] font-medium leading-snug">{KELSEN_DEMO.consulta}</p>
              </div>
            </div>

            {/* Respuesta del agente */}
            <div className="flex gap-2.5">
              <span className="w-6 h-6 rounded-full bg-ink text-white text-[0.6rem] font-bold flex items-center justify-center shrink-0">K</span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.58rem] font-semibold text-teal mb-0.5">Kelsen</p>
                <p className="text-gray-700 text-[0.875rem] leading-relaxed mb-3">
                  {KELSEN_DEMO.respuesta}<span className="kelsen-caret" aria-hidden="true" />
                </p>
                {/* Cita — héroe visual */}
                <div className="kelsen-cite flex items-start gap-2.5 rounded-lg border border-teal/30 bg-teal-soft/60 p-2.5">
                  <svg className="w-4 h-4 text-teal shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                  <div className="min-w-0">
                    <p className="text-[0.6rem] font-bold tracking-[0.1em] uppercase text-teal mb-0.5">Fuente verificable</p>
                    <p className="text-ink text-[0.85rem] font-semibold leading-tight">{KELSEN_DEMO.fuente.norma}</p>
                    <p className="text-gray-500 text-[0.75rem] tabular-nums">{KELSEN_DEMO.fuente.detalle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        {!reducedTilt && <m.div className="absolute inset-0 rounded-xl pointer-events-none" style={{ background: glow }} aria-hidden="true" />}
      </m.div>

      {/* Productos por sector — el mismo motor, público y privado */}
      <div className="relative mt-5 w-full max-w-[560px] mx-auto lg:ml-auto lg:mr-0">
        {[
          { label: "Público", href: "#publico", apps: SECTOR_PUBLICO },
          { label: "Privado", href: "#privado", apps: SECTOR_PRIVADO },
        ].map((sector) => (
          <div key={sector.label} className="mb-2.5">
            <a href={sector.href} className="text-gray-400 text-[0.6rem] font-bold tracking-[0.12em] uppercase mb-1.5 inline-block hover:text-teal transition-colors">{sector.label} →</a>
            <div className="flex flex-wrap gap-1.5">
              {sector.apps.map((app) => {
                const cls = `inline-flex items-center gap-1.5 text-[0.72rem] font-medium px-2.5 py-1 rounded-full border transition-colors ${app.live ? "border-border bg-white text-gray-700 hover:border-gray-300" : "border-dashed border-gray-300 text-gray-400 hover:text-gray-600"}`;
                const dot = <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${app.live ? "bg-teal" : "bg-gray-300"}`} aria-hidden="true" />;
                const lbl = app.live ? `${app.name} (en producción)` : `${app.name} (en desarrollo)`;
                return app.url ? (
                  <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer" className={cls} aria-label={lbl} title={lbl}>{dot}{app.name}</a>
                ) : (
                  <span key={app.name} className={cls} title={lbl}>{dot}{app.name}</span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   DATA
   ═══════════════════════════════════════ */
const TIMELINE_ERA_1 = {
  title: "El grupo de expertos",
  subtitle: "Liderado por Jaime Alonso Cano Pino y un equipo de contadores, tributaristas y financieros, los primeros 23 años se forjaron en campo: municipio a municipio, hospital a hospital, estatuto a estatuto.",
  ceoLinkedIn: "https://www.linkedin.com/in/jaime-alonso-cano-pino-a11a6246/",
  events: [
    { year: "2000", text: "Empezamos asesorando al Hospital San Camilo de Lelis y al Municipio de Vegachí. Contabilidad y gestión financiera pura, en terreno.", metric: "Primer cliente" },
    { year: "2002", text: "Llegamos al Hospital San Vicente de Paúl de Pueblo Rico. El sector salud nos abrió las puertas.", metric: "2 hospitales" },
    { year: "2004", text: "Asesoría contable y reestructuración administrativa de Segovia — nuestro primer caso de alto impacto.", metric: "Alto impacto" },
    { year: "2007", text: "Participamos en la constitución de la ESP de Vegachí. Valdivia, Yolombó y Andes entraron al portafolio de asesoría contable y financiera.", metric: "+4 municipios" },
    { year: "2010", text: "Alianza estratégica con Sistemas Aries, proveedores de la plataforma ERP financiera modular con más de 31 años en el departamento. Think IT y BBD Soluciones se suman al ecosistema.", metric: "Alianzas clave" },
    { year: "2012", text: "Iniciamos asesoría contable, financiera, fiscal y tributaria en Cisneros. Reestructuración de pasivos (Ley 550) — un proyecto de largo aliento.", metric: "Cisneros" },
    { year: "2014", text: "5 provincias estructuradas contable y financieramente para el Ministerio del Interior. La CIS se integra como aliado en las consultorías del proyecto.", metric: "5 provincias" },
    { year: "2019", text: "44 municipios con herramientas de fiscalización y construcción de estatutos tributarios para la Gobernación de Antioquia, en alianza con la Jaime Isaza Cadavid y la CIS.", metric: "44 municipios" },
    { year: "2021", text: "Llegan Caucasia, El Bagre y nuevos municipios al portafolio. Se estructuran proyectos de asesoría contable, financiera y tributaria a escala departamental.", metric: "Nuevos municipios" },
  ],
};

const TIMELINE_ERA_2 = {
  title: "La era INPLUX",
  subtitle: "Toda esa experiencia se formaliza en un Hub tecnológico. Lo que antes vivía en la cabeza de los expertos, ahora vive en código, modelos de IA y productos digitales.",
  events: [
    { year: "2023", text: "Nace INPLUX S.A.S. como Hub que integra consultoría contable, financiera, tributaria y tecnología. Se formaliza el ecosistema con Fourier, Sistemas Aries, Think IT, BBD Soluciones, Alianza IT y el Observatorio de Datos y Análisis. Arranca la transformación digital.", metric: "Hub fundado" },
    { year: "2025", text: "Lanzamos Tribai.co: inteligencia tributaria y financiera con IA. Preparaciones automáticas de declaraciones con IA. Arrancamos la plataforma de sector público.", metric: "IA en producción" },
  ],
};

const LOGOS = [
  { src: "/logos/21053_escudo-vegachi-pagina_200x200.png", alt: "Vegachí" },
  { src: "/logos/47914_logo-alcaldia--300-x-100-1_200x200.png", alt: "Alcaldía" },
  { src: "/logos/54672_escudo-de-cisneros-antioquia-oficial-3x3_200x200.png", alt: "Cisneros" },
  { src: "/logos/CIS.png", alt: "CIS – Corporación Interuniversitaria de Servicios" },
  { src: "/logos/Escudo.png", alt: "Alcaldía de Andes" },
  { src: "/logos/Parque_Arví_Logo_Blanco.png", alt: "Parque Arví" },
  { src: "/logos/Think_It_Logo_Blanco.png", alt: "Think IT" },
  { src: "/logos/cropped-Logo_Alianza-IT-1.png", alt: "Alianza IT" },
  { src: "/logos/images.jpeg", alt: "Hospital San Camilo de Lelis (Vegachí)" },
  { src: "/logos/images.png", alt: "Hospital San Pío X" },
  { src: "/logos/logo-negro.png", alt: "Politécnico Colombiano Jaime Isaza Cadavid" },
  { src: "/logos/logo-think-oracle.png", alt: "Think Oracle" },
  { src: "/logos/logo-provincia-b.svg", alt: "Provincia" },
  { src: "/logos/logo.png", alt: "Rentan" },
  { src: "/logos/logoedu.png", alt: "EDU – Empresa de Desarrollo Urbano" },
  { src: "/logos/navarro-ospina-logo.png", alt: "Navarro Ospina" },
  { src: "/logos/logo.jpg", alt: "Sistemas Aries" },
];

const HUB_COMPANIES = [
  {
    name: "Kelsen",
    domain: "kelsen.io",
    focus: "Sombrilla Legal IA",
    desc: "Cerebro legal de INPLUX. La sombrilla que integra todos nuestros productos jurídicos sobre una misma capa de conocimiento persistente: Tribai (inteligencia tributaria) y Laudos (laudos arbitrales y jurisprudencia). Agentes legales con memoria de largo plazo y citación de fuentes verificable.",
    status: "Activo",
    upcoming: "Módulos en desarrollo: litigio · contratos · derecho constitucional · derecho penal",
  },
  {
    name: "Gobia",
    domain: "gobia.co",
    focus: "Sector Público",
    desc: "Gemelo digital y rendición de cuentas para municipios. Integra automáticamente datos del DNP, ministerios, Contraloría, Contaduría y entidades IAS en un tablero centralizado con alertas. El secretario de Hacienda ve todo en un solo panel.",
    status: "Activo",
    upcoming: "Rendición de cuentas ante IAS · Seguimiento al plan de desarrollo · Reportes cruzados automáticos",
  },
];

/* ═══════════════════════════════════════
   REVEAL / STAGGER (motion)
   Entrada al viewport con física de resorte. Compositor-only
   (opacity + translateY). Bajo reduced-motion entra sin desplazar.
   NO usar en hero (LCP) ni en wrappers que contengan grafos SVG
   (esos ya ensamblan al scroll por su cuenta).
   ═══════════════════════════════════════ */
const REVEAL_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
const STAGGER_PARENT: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

function Reveal({
  children,
  className,
  amount = 0.3,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
  as?: "div" | "li" | "section" | "p";
}) {
  const reduced = !!useReducedMotion();
  const Comp = m[as];
  return (
    <Comp
      className={className}
      variants={REVEAL_VARIANTS}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={spring.smooth}
    >
      {children}
    </Comp>
  );
}

function Stagger({
  children,
  className,
  amount = 0.2,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
  as?: "div" | "ul" | "section";
}) {
  const reduced = !!useReducedMotion();
  const Comp = m[as];
  return (
    <Comp
      className={className}
      variants={STAGGER_PARENT}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </Comp>
  );
}

function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Comp = m[as];
  return (
    <Comp className={className} variants={REVEAL_VARIANTS} transition={spring.smooth}>
      {children}
    </Comp>
  );
}

/* ═══════════════════════════════════════
   GOBIA TWIN — Gemelo digital municipal
   Silueta real del municipio de Medellín
   (OSM/Nominatim, escalada a 520×460).
   Hover revela mini-cards por fuente.
   ═══════════════════════════════════════ */

/* Path real del municipio de Medellín — OSM relation, simplificado a ~90 pts */
const MED_PATH = "M20.0,92.2L23.1,100.7L21.6,110.9L22.6,121.6L30.5,132.6L37.3,147.7L40.7,159.7L42.7,165.1L41.0,171.5L40.8,187.3L44.8,205.2L41.3,216.5L38.3,231.3L38.4,247.8L39.7,272.4L54.4,299.6L57.2,322.0L56.0,362.0L79.3,381.4L87.5,396.9L94.8,415.7L116.1,435.5L136.8,426.6L144.2,425.7L146.0,429.5L154.6,429.5L159.0,431.1L164.0,431.3L169.7,421.3L180.0,417.3L184.4,412.0L181.9,407.4L187.9,397.3L199.0,376.0L229.3,368.7L243.9,370.1L255.7,373.5L272.4,378.3L285.8,388.0L295.6,399.5L310.8,407.1L319.7,412.2L325.2,413.4L330.9,413.4L333.8,414.5L341.4,414.0L392.5,391.0L427.6,379.4L456.9,377.7L478.5,366.0L471.1,337.8L467.6,315.6L485.1,306.6L498.6,292.5L488.1,272.8L476.2,259.5L465.0,240.5L457.7,224.1L456.9,217.7L457.4,212.5L453.3,200.7L448.0,186.6L406.8,190.3L392.7,183.9L393.5,177.8L383.7,171.1L378.4,174.3L373.6,169.4L369.0,165.9L364.0,163.9L360.6,162.4L353.3,159.7L347.3,157.3L336.9,151.3L331.3,147.4L322.9,147.8L316.9,147.0L309.7,150.4L305.0,150.0L300.0,149.4L294.5,151.1L285.3,153.0L271.2,154.2L255.2,156.6L242.1,150.4L230.2,143.4L210.3,143.3L196.8,140.7L179.6,129.5L155.9,109.6L139.7,62.3L125.7,41.3L108.1,30.0L87.1,34.9L67.6,34.5L52.3,29.9L41.4,30.7L25.3,44.7L27.4,64.0L30.3,79.7L22.7,82.4Z";

/* Nodos posicionados dentro del shape real de Medellín.
   Centro del municipio ≈ (262, 240). */
const TWIN_NODES = [
  { id: "dnp",         cx: 262, cy: 80,  label: "DNP",  pulse: "",             card: { x: 148, y: 48,  w: 156, title: "DNP",        sub: "PLANEACIÓN NACIONAL",  desc: "Planes de desarrollo · SGP · inversión" } },
  { id: "contraloria", cx: 390, cy: 195, label: "CTRL", pulse: "twin-pulse-2", card: { x: 244, y: 163, w: 156, title: "Contraloría", sub: "CONTROL FISCAL",       desc: "Alertas fiscales · auditoría · deuda" } },
  { id: "ministerios", cx: 80,  cy: 260, label: "MIN",  pulse: "twin-pulse-3", card: { x: 26,  y: 228, w: 152, title: "Ministerios", sub: "NORMATIVA SECTORIAL",  desc: "Hacienda · Interior · Salud · Educación" } },
  { id: "contaduria",  cx: 400, cy: 320, label: "CTD",  pulse: "twin-pulse-4", card: { x: 244, y: 290, w: 152, title: "Contaduría", sub: "ESTADO FINANCIERO",    desc: "Balance · pasivos · cierre contable" } },
  { id: "ias",         cx: 262, cy: 390, label: "IAS",  pulse: "twin-pulse-5", card: { x: 148, y: 358, w: 216, title: "IAS",        sub: "ENTIDADES ESPECIALES", desc: "EICE · SEM · empresas servicios públicos" } },
] as const;

const TWIN_FLOWS = [
  "M262,89 Q262,155 248,214",
  "M381,203 Q348,218 308,234",
  "M89,260 Q160,256 218,248",
  "M391,312 Q360,295 310,254",
  "M262,381 Q262,335 264,267",
] as const;

function GobiaTwin() {
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = !!useReducedMotion();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const cleanup: (() => void)[] = [];
    svg.querySelectorAll<SVGGElement>("[data-twin-node]").forEach((g) => {
      const id = g.getAttribute("data-twin-node");
      const card = svg.querySelector(`[data-twin-card="${id}"]`);
      if (!card) return;
      const enter = () => card.setAttribute("data-visible", "");
      const leave = () => card.removeAttribute("data-visible");
      g.addEventListener("mouseenter", enter);
      g.addEventListener("mouseleave", leave);
      cleanup.push(() => { g.removeEventListener("mouseenter", enter); g.removeEventListener("mouseleave", leave); });
    });
    return () => cleanup.forEach((fn) => fn());
  }, []);

  return (
    <m.div
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={spring.smooth}
      className="relative w-full"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 520 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[480px] mx-auto lg:mx-0"
        style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}
        role="img"
        aria-label="Gemelo digital municipal Gobia: fuentes DNP, Contraloría, Ministerios, Contaduría e IAS fluyendo al tablero de hacienda"
      >
        <defs>
          <radialGradient id="twinHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d7d74" stopOpacity="0.28" />
            <stop offset="60%" stopColor="#0d7d74" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#0d7d74" stopOpacity="0" />
          </radialGradient>
          <clipPath id="medClip">
            <path d={MED_PATH} />
          </clipPath>
        </defs>

        {/* Silueta real del municipio de Medellín */}
        <path d={MED_PATH} fill="#edf7f6" stroke="#a9d6d0" strokeWidth="1.5" strokeLinejoin="round" />

        {/* Puntos urbanos (recortados al shape) */}
        <g clipPath="url(#medClip)" opacity="0.35">
          {Array.from({ length: 13 }).map((_, row) =>
            Array.from({ length: 15 }).map((_, col) => (
              <circle key={`dot-${row}-${col}`} cx={35 * col + 22} cy={35 * row + 22} r={0.9} fill="#0d7d74" />
            ))
          )}
        </g>

        {/* Río Aburrá — recorre el centro del municipio de NE a SW */}
        <path
          d="M260,50 C258,100 250,140 245,180 C240,220 248,252 244,290 C240,330 238,372 244,430"
          fill="none" stroke="#a9d6d0" strokeWidth="2.5" strokeLinecap="round"
          clipPath="url(#medClip)"
        />

        {/* Flujos animados de fuentes → Gobia */}
        {!reduced && TWIN_FLOWS.map((d, i) => (
          <path key={i} d={d} className={`twin-flow twin-flow-${i + 1}`} />
        ))}

        {/* Halo central */}
        <ellipse cx="262" cy="240" rx="54" ry="48" fill="url(#twinHalo)" className="svg-halo-pulse" />

        {/* Card Gobia */}
        <g style={{ filter: "drop-shadow(0 4px 14px rgba(13,125,116,0.20))" }}>
          <rect x="214" y="212" width="96" height="56" rx="12" fill="url(#inkGrad)" />
          <rect x="214" y="212" width="96" height="56" rx="12" fill="none" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="8 100" className="eco-orbit" style={{ animationDuration: "10s" }} />
          <text x="262" y="235" textAnchor="middle" fill="white" fontSize="13" fontWeight="800">Gobia</text>
          <text x="262" y="249" textAnchor="middle" fill="#5fe3d6" fontSize="6.5" fontWeight="600" letterSpacing="1">TABLERO HACIENDA</text>
          <text x="238" y="263" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="9" fontWeight="700">+50</text>
          <text x="262" y="263" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7.5">mun.</text>
          <text x="286" y="263" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="9" fontWeight="700">44</text>
        </g>

        {/* Nodos de fuentes de datos */}
        {TWIN_NODES.map(({ id, cx, cy, label, pulse }) => (
          <g key={id} data-twin-node={id}>
            <circle cx={cx} cy={cy} r={13} fill="none" stroke="#a9d6d0" strokeWidth="1" className={`twin-pulse ${pulse}`} />
            <circle cx={cx} cy={cy} r={8} fill="white" stroke="#0d7d74" strokeWidth="1.5" className="twin-node-dot" />
            <text x={cx} y={cy + 3.5} textAnchor="middle" fill="#0d7d74" fontSize={label.length > 3 ? 6 : 7.5} fontWeight="700">{label}</text>
          </g>
        ))}

        {/* Mini-cards de hover */}
        {TWIN_NODES.map(({ id, card }) => (
          <g key={id} data-twin-card={id} className="twin-card" style={{ filter: "drop-shadow(0 4px 12px rgba(26,25,24,0.10))" }}>
            <rect x={card.x} y={card.y} width={card.w} height={54} rx={10} fill="white" stroke="#e2dfdb" strokeWidth="1" />
            <rect x={card.x + 1} y={card.y} width={card.w - 2} height={18} rx={10} fill="#f0faf9" />
            <text x={card.x + 12} y={card.y + 13} fill="#0d7d74" fontSize={7.5} fontWeight="700" letterSpacing="0.5">{card.sub}</text>
            <text x={card.x + 12} y={card.y + 32} fill="#1a1918" fontSize={10} fontWeight="700">{card.title}</text>
            <text x={card.x + 12} y={card.y + 46} fill="#76716a" fontSize={8}>{card.desc}</text>
          </g>
        ))}

        {/* Label */}
        <text x="262" y="452" textAnchor="middle" fill="#9a958e" fontSize="8" fontWeight="600" letterSpacing="1">MEDELLÍN · GEMELO DIGITAL MUNICIPAL · GOBIA.CO</text>
      </svg>
    </m.div>
  );
}

/* ═══════════════════════════════════════
   PAGE
   ═══════════════════════════════════════ */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [bannerOpen, setBannerOpen] = useState(true);

  const reducedMotion = !!useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Announcement bar — recuerda el dismiss entre visitas
  useEffect(() => {
    try {
      if (window.localStorage.getItem("inplux-banner-dismissed") === "1") setBannerOpen(false);
    } catch { /* localStorage no disponible */ }
  }, []);
  const dismissBanner = () => {
    setBannerOpen(false);
    try { window.localStorage.setItem("inplux-banner-dismissed", "1"); } catch { /* noop */ }
  };

  useEffect(() => {
    const h = () => {
      setScrolled(window.scrollY > 20);
      setShowTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Active section tracking
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection("#" + e.target.id);
        });
      },
      { threshold: 0.15, rootMargin: "-60px 0px -40% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const navLinks = [
    { label: "Motor", href: "#motor" },
    { label: "Público", href: "#publico" },
    { label: "Privado", href: "#privado" },
    { label: "Ecosistema", href: "#empresas" },
    { label: "Nosotros", href: "/nosotros" },
  ];

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user" transition={spring.smooth}>
        <>
      {/* Barra de progreso de lectura */}
      <m.div className="fixed top-0 left-0 right-0 h-[2px] bg-teal z-[61] origin-left pointer-events-none" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      {/* Skip to content — accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-ink focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold">
        Ir al contenido principal
      </a>

      {/* ──── ANNOUNCEMENT BAR (dismissible) ──── */}
      {bannerOpen && (
        <div className="announce-bar" role="region" aria-label="Anuncio">
          <span className="announce-inner">
            <span className="announce-dot" aria-hidden="true" />
            <span className="announce-label hidden sm:inline">
              Lanzamiento — Tribai.co: inteligencia tributaria con IA, ya en producción.
            </span>
            <span className="announce-label sm:hidden">
              Lanzamiento — Tribai.co en producción.
            </span>
            <a href="#empresas" className="announce-link" onClick={dismissBanner}>Ver más →</a>
          </span>
          <button onClick={dismissBanner} className="announce-dismiss" aria-label="Cerrar anuncio">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* Mobile nav overlay */}
      <div className={`mobile-overlay ${mobileOpen ? "active" : ""}`} onClick={() => setMobileOpen(false)} role="presentation" aria-hidden="true" />

      {/* ──── NAV ──── */}
      <nav className={`fixed left-0 right-0 z-50 nav-wrap transition-[top] duration-300 ${bannerOpen ? "top-10" : "top-0"} ${scrolled ? "scrolled" : ""}`} aria-label="Navegación principal">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 flex items-center justify-between h-[60px]">
          <a href="#inicio" aria-label="INPLUX - Inicio" className="flex items-center">
            <img src="/brand/logos/inplux-logo-horizontal.svg" alt="INPLUX" className="h-7 w-auto" />
          </a>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) =>
              l.href.startsWith("/") ? (
                <Link key={l.href} href={l.href} className="text-[0.8125rem] font-medium px-3.5 py-2 rounded-md transition-colors text-gray-500 hover:text-ink">{l.label}</Link>
              ) : (
                <a key={l.href} href={l.href} className={`relative text-[0.8125rem] font-medium px-3.5 py-2 rounded-md transition-colors ${activeSection === l.href ? "text-ink font-semibold" : "text-gray-500 hover:text-ink"}`}>
                  {activeSection === l.href && <m.span layoutId="nav-pill" className="absolute inset-0 rounded-md bg-off-white -z-10" transition={spring.smooth} />}
                  {l.label}
                </a>
              )
            )}
          </div>
          <div className="flex items-center gap-3">
            <m.a href="#contacto" className="!hidden md:!inline-flex btn-dark text-[0.8125rem] !py-2 !px-5" style={{ transitionProperty: "background-color, box-shadow" }} {...pressable(reducedMotion)}>Hablemos</m.a>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-ink p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer" aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={mobileOpen}>
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-5 py-3 border-t border-border bg-white space-y-1">
            {navLinks.map((l) =>
              l.href.startsWith("/") ? (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-ink text-sm font-medium py-2.5 px-3 rounded-md transition-colors">{l.label}</Link>
              ) : (
                <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-ink text-sm font-medium py-2.5 px-3 rounded-md transition-colors">{l.label}</a>
              )
            )}
            <a href="#contacto" onClick={() => setMobileOpen(false)} className="btn-dark w-full text-sm !py-2.5 mt-2">Hablemos</a>
          </div>
        </div>
      </nav>

      <main id="main-content">
      {/* Shared SVG defs — gradientes y filtros reutilizables por todos los diagramas */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="inkGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#26241f" />
            <stop offset="100%" stopColor="#0d0c0b" />
          </linearGradient>
          <linearGradient id="tealGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#15b3a4" />
            <stop offset="100%" stopColor="#0a665f" />
          </linearGradient>
          <radialGradient id="tealHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d7d74" stopOpacity="0.32" />
            <stop offset="65%" stopColor="#0d7d74" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#0d7d74" stopOpacity="0" />
          </radialGradient>
          <filter id="cardShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="6" stdDeviation="9" floodColor="#1a1918" floodOpacity="0.12" />
          </filter>
        </defs>
      </svg>
      {/* ──── HERO ──── */}
      <section id="inicio" className={`relative overflow-hidden bg-white transition-[padding] duration-300 ${bannerOpen ? "pt-[100px]" : "pt-[60px]"}`}>
        {/* Grid técnico de fondo */}
        <div className={`absolute inset-x-0 bottom-0 z-0 tech-grid tech-grid-fade pointer-events-none transition-[top] duration-300 ${bannerOpen ? "top-[100px]" : "top-[60px]"}`} aria-hidden="true" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 py-16 md:py-24 lg:py-28">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-20 items-start">
            {/* LEFT — copy */}
            <div className="min-w-0 max-w-[620px]">
              <p className="text-gray-500 text-[0.75rem] font-semibold tracking-[0.15em] uppercase mb-5">Hub de IA · Sector público y privado · 25 años</p>
              <h1 className="font-serif text-[2.3rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[4.75rem] leading-[1.05] tracking-[-0.02em] text-ink mb-7">
                Construimos el<br />
                <em className="font-serif italic" style={{ color: "var(--teal-accent)" }}>cerebro de IA</em><br />
                de Colombia.
              </h1>
              <p className="text-gray-500 text-base md:text-[1.15rem] leading-[1.65] mb-8 max-w-[540px]">
                Agentes con memoria que aprenden de 25 años de experiencia real. Modernizamos la hacienda pública de los municipios y construimos el software de las empresas — sobre un mismo motor que cita su fuente y mejora en cada caso.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <span className="bracket-cta">
                  <span className="br-tr" />
                  <span className="br-bl" />
                  <m.a href="#publico" className="btn-dark" style={{ transitionProperty: "background-color, box-shadow" }} {...pressable(reducedMotion)}>Sector público</m.a>
                </span>
                <span className="bracket-cta">
                  <span className="br-tr" />
                  <span className="br-bl" />
                  <m.a href="#privado" className="btn-ghost" style={{ transitionProperty: "background-color, border-color" }} {...pressable(reducedMotion)}>Sector privado</m.a>
                </span>
              </div>
            </div>

            {/* RIGHT — Kelsen en acción (prueba de producto) */}
            <Reveal className="relative min-w-0 w-full max-w-[560px] mx-auto lg:mx-0">
              <KelsenProof />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ──── LOGOS ──── */}
      <section className="pt-4 pb-8 md:pt-5 md:pb-10" aria-label="Clientes que confían en nosotros">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 mb-5">
          <Reveal as="p" className="text-center text-gray-500 text-[0.6875rem] font-semibold tracking-[0.15em] uppercase">Confían en nosotros</Reveal>
        </div>
        <Reveal className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-28 z-10" style={{ background: "linear-gradient(90deg, white, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 z-10" style={{ background: "linear-gradient(270deg, white, transparent)" }} />
          <div className="logo-track">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <Image key={`${logo.alt}-${i}`} src={logo.src} alt={logo.alt} width={90} height={32} className="logo-item" style={{ objectFit: "contain", width: "auto" }} unoptimized loading="lazy" />
            ))}
          </div>
        </Reveal>
      </section>

      {/* ──── HUB / ECOSYSTEM ──── */}
      <section id="empresas" className="py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <Reveal className="mb-14">
            <SectionKicker n="01">Ecosistema Inplux</SectionKicker>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-lg">
              Seis productos.<br /><em className="italic">Un motor. Dos frentes.</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed">
              Sector público y privado, sobre el mismo motor agéntico con memoria persistente.
              Cada producto aprende de los demás — el conocimiento se comparte, no se siloa.
            </p>
          </Reveal>

          <div className="svg-scroll-hint">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" /></svg>
            Desliza para ver completo
          </div>
          <Reveal className="w-full overflow-x-auto">
            <svg viewBox="0 0 1000 580" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[1000px] mx-auto" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }} role="img" aria-label="Ecosistema INPLUX: dos frentes (público y privado) con siete productos sobre un motor agéntico compartido">
              {/* Background dots */}
              {Array.from({ length: 16 }).map((_, row) =>
                Array.from({ length: 28 }).map((_, col) => (
                  <circle key={`ec-${row}-${col}`} cx={36 * col + 12} cy={37 * row + 10} r="0.35" fill="#ebe8e4" />
                ))
              )}

              {/* ═══ INPLUX — top center ═══ */}
              <ellipse cx="500" cy="62" rx="190" ry="80" fill="url(#tealHalo)" className="svg-halo-pulse" />
              <g className="eco-glow svg-card">
                <rect x="390" y="24" width="220" height="68" rx="14" fill="url(#inkGrad)" />
                <rect x="390" y="24" width="220" height="68" rx="14" fill="none" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="10 300" className="eco-orbit" style={{ animationDuration: "8s" }} />
                <text x="500" y="55" textAnchor="middle" fill="white" fontSize="16" fontWeight="800" letterSpacing="2.5">INPLUX</text>
                <text x="500" y="72" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8.5" fontWeight="600" letterSpacing="1.5">HUB DE IA · COLOMBIA</text>
              </g>

              {/* INPLUX → frentes */}
              <line x1="434" y1="94" x2="248" y2="148" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow" />
              <line x1="566" y1="94" x2="752" y2="148" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow" />

              {/* ═══ FRENTE PÚBLICO ═══ */}
              <rect x="100" y="148" width="296" height="28" rx="14" fill="#e8f5f3" />
              <text x="248" y="167" textAnchor="middle" fill="#0d5c57" fontSize="8.5" fontWeight="800" letterSpacing="2">FRENTE PÚBLICO</text>

              {/* Gobia */}
              <a href="https://gobia.co" target="_blank" rel="noopener noreferrer">
                <g className="eco-float svg-card" style={{ cursor: "pointer" }}>
                  <rect x="100" y="188" width="296" height="78" rx="12" fill="white" stroke="#a9d6d0" strokeWidth="1.5" />
                  <rect x="101" y="188" width="294" height="24" rx="12" fill="#f0faf9" />
                  <text x="122" y="204" fill="#0d7d74" fontSize="8" fontWeight="700" letterSpacing="1">GEMELO MUNICIPAL</text>
                  <circle cx="376" cy="200" r="6.5" fill="#0d7d74" />
                  <text x="376" y="203" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">&#10003;</text>
                  <text x="248" y="234" textAnchor="middle" fill="#1a1918" fontSize="15" fontWeight="700">Gobia</text>
                  <text x="248" y="249" textAnchor="middle" fill="#0d7d74" fontSize="9" fontWeight="500">gobia.co</text>
                  <text x="248" y="261" textAnchor="middle" fill="#76716a" fontSize="8">Hacienda · DNP · Contraloría · IAS</text>
                </g>
              </a>

              {/* Tribai mun. */}
              <a href="https://tribai.co" target="_blank" rel="noopener noreferrer">
                <g className="eco-float-delay svg-card" style={{ cursor: "pointer" }}>
                  <rect x="100" y="278" width="296" height="78" rx="12" fill="white" stroke="#a9d6d0" strokeWidth="1.5" />
                  <rect x="101" y="278" width="294" height="24" rx="12" fill="#f0faf9" />
                  <text x="122" y="294" fill="#0d7d74" fontSize="8" fontWeight="700" letterSpacing="1">TRIBUTARIO MUNICIPAL</text>
                  <circle cx="376" cy="290" r="6.5" fill="#0d7d74" />
                  <text x="376" y="293" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">&#10003;</text>
                  <text x="248" y="322" textAnchor="middle" fill="#1a1918" fontSize="15" fontWeight="700">Tribai</text>
                  <text x="248" y="337" textAnchor="middle" fill="#0d7d74" fontSize="9" fontWeight="500">tribai.co</text>
                  <text x="248" y="349" textAnchor="middle" fill="#76716a" fontSize="8">+44 estatutos · +50 municipios</text>
                </g>
              </a>

              {/* Público → Motor */}
              <path d="M248,356 C248,430 400,470 450,500" fill="none" stroke="#a9d6d0" strokeWidth="1.2" strokeDasharray="4 3" />

              {/* ═══ FRENTE PRIVADO ═══ */}
              <rect x="604" y="148" width="296" height="28" rx="14" fill="#f3f1ee" />
              <text x="752" y="167" textAnchor="middle" fill="#3d3b39" fontSize="8.5" fontWeight="800" letterSpacing="2">FRENTE PRIVADO</text>

              {/* Kelsen */}
              <a href="https://kelsen.io" target="_blank" rel="noopener noreferrer">
                <g className="eco-float-delay svg-card" style={{ cursor: "pointer" }}>
                  <rect x="604" y="188" width="296" height="78" rx="12" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                  <rect x="605" y="188" width="294" height="24" rx="12" fill="#f3f1ee" />
                  <text x="626" y="204" fill="#6e6b68" fontSize="8" fontWeight="700" letterSpacing="1">SOMBRILLA LEGAL · IA</text>
                  <circle cx="880" cy="200" r="6.5" fill="#0d7d74" />
                  <text x="880" y="203" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">&#10003;</text>
                  <text x="752" y="234" textAnchor="middle" fill="#1a1918" fontSize="15" fontWeight="700">Kelsen</text>
                  <text x="752" y="249" textAnchor="middle" fill="#0d7d74" fontSize="9" fontWeight="500">kelsen.io</text>
                  <text x="752" y="261" textAnchor="middle" fill="#76716a" fontSize="8">Cerebro legal · Tribai · Laudos</text>
                </g>
              </a>

              {/* Módulos privados: Tribai · Laudos · Porkia en fila */}
              {[
                { x: 604, label: "Tribai", sub: "tribai.co", tag: "TRIBUTARIO", prod: true, href: "https://tribai.co" },
                { x: 704, label: "Laudos", sub: "laudos.co", tag: "ARBITRAL", prod: true, href: "https://laudos.co" },
                { x: 804, label: "Porkia", sub: "porkia.co", tag: "GANADERÍA", prod: true, href: "https://porkia.co" },
              ].map(({ x, label, sub, tag, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                  <g className="eco-float svg-card" style={{ cursor: "pointer" }}>
                    <rect x={x} y={278} width={92} height={72} rx="10" fill="white" stroke="#d1cfcc" strokeWidth="1.2" />
                    <text x={x + 46} y={295} textAnchor="middle" fill="#6e6b68" fontSize="7" fontWeight="700" letterSpacing="0.5">{tag}</text>
                    <circle cx={x + 81} cy={289} r="5.5" fill="#0d7d74" />
                    <text x={x + 81} y={292} textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700">&#10003;</text>
                    <text x={x + 46} y={320} textAnchor="middle" fill="#1a1918" fontSize="13" fontWeight="700">{label}</text>
                    <text x={x + 46} y={341} textAnchor="middle" fill="#0d7d74" fontSize="8">{sub}</text>
                  </g>
                </a>
              ))}

              {/* MiMotoYa — lado a lado con los módulos */}
              <g className="eco-float-delay svg-card">
                <rect x="604" y="362" width="296" height="46" rx="10" fill="white" stroke="#e2dfdb" strokeWidth="1" strokeDasharray="5 4" />
                <text x="752" y="381" textAnchor="middle" fill="#76716a" fontSize="13" fontWeight="700">MiMotoYa</text>
                <text x="752" y="397" textAnchor="middle" fill="#9a958e" fontSize="8">Movilidad urbana · En desarrollo</text>
              </g>

              {/* Kelsen → módulos */}
              <line x1="650" y1="266" x2="650" y2="278" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="750" y1="266" x2="750" y2="278" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="850" y1="266" x2="850" y2="278" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="700" y1="350" x2="700" y2="362" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="800" y1="350" x2="800" y2="362" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="3 3" />

              {/* Privado → Motor */}
              <path d="M752,408 C752,450 580,476 550,500" fill="none" stroke="#d1cfcc" strokeWidth="1.2" strokeDasharray="4 3" />

              {/* ═══ MOTOR AGÉNTICO ═══ */}
              <ellipse cx="500" cy="514" rx="380" ry="56" fill="url(#tealHalo)" className="svg-halo-pulse" />
              <rect x="340" y="490" width="320" height="48" rx="24" fill="url(#inkGrad)" />
              <text x="500" y="511" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" letterSpacing="1">Motor agéntico</text>
              <text x="500" y="526" textAnchor="middle" fill="#5fe3d6" fontSize="7.5" fontWeight="600" letterSpacing="1.5">SELF-IMPROVING · BASE COMÚN</text>

              {/* Aliados — fila debajo del motor */}
              {[
                { cx: 108, name: "Fourier", sub: "Cloud" },
                { cx: 248, name: "Think IT", sub: "Ingeniería" },
                { cx: 752, name: "Alianza IT", sub: "Integración" },
                { cx: 892, name: "Aries", sub: "ERP · 31 años" },
              ].map((a) => (
                <g key={a.name} className="eco-float-delay2">
                  <rect x={a.cx - 60} y={552} width={120} height={36} rx={9} fill="white" stroke="#e2dfdb" strokeWidth="1" />
                  <text x={a.cx} y={567} textAnchor="middle" fill="#3d3b39" fontSize={9} fontWeight="600">{a.name}</text>
                  <text x={a.cx} y={580} textAnchor="middle" fill="#76716a" fontSize={7.5}>{a.sub}</text>
                  <line x1={a.cx} y1={552} x2={a.cx < 500 ? 420 : 580} y2={538} stroke="#d1cfcc" strokeWidth="1" strokeDasharray="3 3" />
                </g>
              ))}

              {/* Caption */}
              <text x="500" y="574" textAnchor="middle" fill="#9a958e" fontSize="0" letterSpacing="1.5">.</text>
            </svg>
          </Reveal>
        </div>
      </section>

      {/* ──── STATS ──── */}
      <section className="py-12 md:py-16" aria-label="Cifras de impacto">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 md:gap-x-12 md:gap-y-14">
            {[
              { value: "+25", label: "Años de experiencia", detail: "Desde el año 2000" },
              { value: "+50", label: "Municipios atendidos", detail: "Sector público" },
              { value: "+100", label: "Proyectos ejecutados", detail: "Público y privado" },
              { value: "+35", label: "Calculadoras IA", detail: "Tributario · Financiero" },
            ].map((stat) => (
              <StaggerItem key={stat.label} className="group relative border border-border-light hover:border-border rounded-xl p-4 md:p-5 transition-all duration-300 hover:shadow-sm">
                <AnimatedNumber value={stat.value} label={stat.label} />
                <p className="text-gray-400 text-xs mt-2">{stat.detail}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ──── FRENTE PÚBLICO — Gobia · Hacienda municipal ──── */}
      <section id="publico" className="py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Columna izquierda — narrativa */}
            <div>
              <Reveal>
                <SectionKicker n="02">Frente Público · Gobierno y municipios</SectionKicker>
                <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-lg">
                  Ponemos al día la<br /><em className="italic">hacienda pública de Colombia.</em>
                </h2>
                <p className="text-gray-500 text-base md:text-[1.05rem] leading-[1.65] mb-8 max-w-md">
                  25 años asesorando municipios, gobernaciones y empresas de servicios públicos. Hoy esa experiencia vive en <strong className="font-semibold text-ink">Gobia</strong> — gemelo digital municipal — y en <strong className="font-semibold text-ink">Tribai</strong> para el tributario.
                </p>
              </Reveal>

              <Stagger className="space-y-4 mb-8">
                <StaggerItem className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-teal-soft flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-teal" />
                  </span>
                  <div>
                    <p className="text-[0.875rem] font-semibold text-ink mb-0.5">Gobia · Gemelo digital municipal</p>
                    <p className="text-gray-500 text-[0.82rem] leading-relaxed">DNP · Contraloría · Contaduría · Ministerios · IAS en un solo tablero. El secretario de Hacienda ve todo en tiempo real.</p>
                    <a href="https://gobia.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-teal text-[0.78rem] font-semibold mt-1 hover:opacity-75 transition-opacity">gobia.co →</a>
                  </div>
                </StaggerItem>
                <StaggerItem className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-teal-soft flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-teal" />
                  </span>
                  <div>
                    <p className="text-[0.875rem] font-semibold text-ink mb-0.5">Tribai · Tributario municipal</p>
                    <p className="text-gray-500 text-[0.82rem] leading-relaxed">44 estatutos coordinados, +50 municipios. Estatuto RAG con citación verificable ante la DIAN.</p>
                    <a href="https://tribai.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-teal text-[0.78rem] font-semibold mt-1 hover:opacity-75 transition-opacity">tribai.co →</a>
                  </div>
                </StaggerItem>
                <StaggerItem className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-warm-50 border border-border flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-gray-300" />
                  </span>
                  <div>
                    <p className="text-[0.875rem] font-semibold text-ink mb-0.5">Para quién</p>
                    <p className="text-gray-500 text-[0.82rem] leading-relaxed">Alcaldías · secretarías de hacienda · gobernaciones · EICE · SEM · empresas de servicios públicos.</p>
                  </div>
                </StaggerItem>
              </Stagger>

              <Reveal>
                <span className="bracket-cta is-block max-w-[200px]">
                  <span className="br-tr" /><span className="br-bl" />
                  <m.a href="mailto:gerencia@inplux.co?subject=Sector%20p%C3%BAblico%20INPLUX" className="btn-dark w-full justify-center" style={{ transitionProperty: "background-color, box-shadow" }} {...pressable(reducedMotion)}>
                    Conversemos
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                  </m.a>
                </span>

                {/* Stats inline */}
                <div className="mt-10 pt-8 border-t border-border grid grid-cols-2 gap-5">
                  {[
                    { n: "+50", l: "municipios atendidos" },
                    { n: "44", l: "estatutos coordinados" },
                    { n: "25", l: "años en campo" },
                    { n: "5", l: "provincias — Min. Interior" },
                  ].map((s) => (
                    <div key={s.l}>
                      <div className="font-serif text-[1.6rem] text-ink leading-none mb-0.5">{s.n}</div>
                      <div className="text-gray-400 text-[0.7rem] leading-snug">{s.l}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Columna derecha — Gemelo digital interactivo */}
            <GobiaTwin />

          </div>
        </div>
      </section>

      {/* ──── FRENTE PRIVADO — Kelsen sombrilla + Fábrica ──── */}
      <section id="privado" className="py-24 md:py-32 bg-warm">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="mb-14">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-12">
            {/* Columna izquierda — narrativa privado */}
            <div>
              <Reveal>
                <SectionKicker n="03">Frente Privado · Empresas y firmas</SectionKicker>
                <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-lg">
                  Kelsen es la sombrilla.<br /><em className="italic">Cada vertical, un módulo.</em>
                </h2>
                <p className="text-gray-500 text-base md:text-[1.05rem] leading-[1.65] mb-8 max-w-md">
                  Para empresas, firmas legales y startups. Un cerebro legal con memoria persistente que cita su fuente — verificable ante la DIAN o un juez.
                </p>
              </Reveal>

              <Stagger className="space-y-4 mb-8">
                <StaggerItem className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-teal-soft flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-teal" />
                  </span>
                  <div>
                    <p className="text-[0.875rem] font-semibold text-ink mb-0.5">Kelsen · Cerebro legal</p>
                    <p className="text-gray-500 text-[0.82rem] leading-relaxed">Memoria persistente de tus asuntos, clientes y estilo. Razona sobre normativa colombiana real.</p>
                    <a href="https://kelsen.io" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-teal text-[0.78rem] font-semibold mt-1 hover:opacity-75 transition-opacity">kelsen.io →</a>
                  </div>
                </StaggerItem>
                <StaggerItem className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-teal-soft flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-teal" />
                  </span>
                  <div>
                    <p className="text-[0.875rem] font-semibold text-ink mb-0.5">Tribai · Tributario privado</p>
                    <p className="text-gray-500 text-[0.82rem] leading-relaxed">Declaración de renta, exógena y estatuto tributario con RAG. Citación verificable ante la DIAN.</p>
                    <a href="https://tribai.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-teal text-[0.78rem] font-semibold mt-1 hover:opacity-75 transition-opacity">tribai.co →</a>
                  </div>
                </StaggerItem>
                <StaggerItem className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-teal-soft flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-teal" />
                  </span>
                  <div>
                    <p className="text-[0.875rem] font-semibold text-ink mb-0.5">Laudos · Arbitraje</p>
                    <p className="text-gray-500 text-[0.82rem] leading-relaxed">Laudos arbitrales y jurisprudencia indexada. El primer módulo de derecho comercial.</p>
                    <a href="https://laudos.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-teal text-[0.78rem] font-semibold mt-1 hover:opacity-75 transition-opacity">laudos.co →</a>
                  </div>
                </StaggerItem>
              </Stagger>

              <Reveal>
                <span className="bracket-cta is-block max-w-[220px]">
                  <span className="br-tr" /><span className="br-bl" />
                  <m.a href="mailto:gerencia@inplux.co?subject=Demo%20de%20Kelsen" className="btn-dark w-full justify-center" style={{ transitionProperty: "background-color, box-shadow" }} {...pressable(reducedMotion)}>
                    Pide demo de Kelsen
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                  </m.a>
                </span>
              </Reveal>
            </div>{/* fin col izq */}
            <div />{/* espacio derecho — visible solo en lg */}
          </div>{/* fin inner grid */}

            {/* SVG Kelsen — full width */}
            <div className="svg-scroll-hint">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" /></svg>
              Desliza para ver completo
            </div>
            <Reveal className="w-full overflow-x-auto">
            <svg viewBox="0 0 1000 680" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[1000px] mx-auto" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }} role="img" aria-label="Ecosistema legal de INPLUX con Kelsen como sombrilla y Tribai, Laudos y módulos en desarrollo">
              {/* Background dots */}
              {Array.from({ length: 18 }).map((_, row) =>
                Array.from({ length: 28 }).map((_, col) => (
                  <circle key={`lg-${row}-${col}`} cx={36 * col + 12} cy={37 * row + 10} r="0.35" fill="#ebe8e4" />
                ))
              )}

              {/* Orbit guía única */}
              <circle cx="500" cy="330" r="280" stroke="#e2dfdb" strokeWidth="1" strokeDasharray="8 6" fill="none" className="eco-orbit" style={{ animationDuration: "50s" }} />

              {/* Connection lines center → modules */}
              <line x1="430" y1="285" x2="300" y2="178" stroke="#c8c5c1" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow" />
              <line x1="570" y1="285" x2="700" y2="178" stroke="#c8c5c1" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow" />
              <line x1="445" y1="380" x2="270" y2="470" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow-slow" />
              <line x1="500" y1="400" x2="500" y2="500" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow-slow" />
              <line x1="555" y1="380" x2="730" y2="470" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow-slow" />

              {/* ═══ KELSEN — center (sombrilla) ═══ */}
              <ellipse cx="500" cy="330" rx="155" ry="132" fill="url(#tealHalo)" className="svg-halo-pulse" />
              <a href="https://kelsen.io" target="_blank" rel="noopener noreferrer">
                <g className="eco-glow svg-card" style={{ cursor: "pointer" }}>
                  <circle cx="500" cy="330" r="72" fill="url(#inkGrad)" />
                  <circle cx="500" cy="330" r="72" fill="none" stroke="#0d7d74" strokeWidth="2" strokeDasharray="10 250" className="eco-orbit" style={{ animationDuration: "8s" }} />
                  <text x="500" y="320" textAnchor="middle" fill="white" fontSize="18" fontWeight="800" letterSpacing="1.5">Kelsen</text>
                  <text x="500" y="338" textAnchor="middle" fill="#5fe3d6" fontSize="9" fontWeight="500" textDecoration="underline">kelsen.io</text>
                  <text x="500" y="355" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="8.5" fontWeight="600" letterSpacing="1">CEREBRO LEGAL</text>
                </g>
              </a>

              {/* ═══ TRIBAI — módulo activo (arriba-izq) ═══ */}
              <a href="https://tribai.co" target="_blank" rel="noopener noreferrer">
                <g className="eco-float svg-card" style={{ cursor: "pointer" }}>
                  <rect x="120" y="74" width="230" height="104" rx="12" fill="white" stroke="#d1cfcc" strokeWidth="1" />
                  <rect x="121" y="74" width="228" height="24" rx="12" fill="#e8f5f3" />
                  <text x="144" y="91" fill="#0d7d74" fontSize="9" fontWeight="700" letterSpacing="1.2">MÓDULO · TRIBUTARIO</text>
                  <circle cx="326" cy="86" r="6.5" fill="#0d7d74" />
                  <text x="326" y="89" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">&#10003;</text>
                  <text x="235" y="126" textAnchor="middle" fill="#1a1918" fontSize="16" fontWeight="700">Tribai</text>
                  <text x="235" y="144" textAnchor="middle" fill="#0d7d74" fontSize="10" fontWeight="500" textDecoration="underline">tribai.co</text>
                  <text x="235" y="163" textAnchor="middle" fill="#76716a" fontSize="9">Inteligencia tributaria y financiera</text>
                </g>
              </a>

              {/* ═══ LAUDOS — módulo activo (arriba-der) ═══ */}
              <a href="https://laudos.co" target="_blank" rel="noopener noreferrer">
                <g className="eco-float-delay svg-card" style={{ cursor: "pointer" }}>
                  <rect x="650" y="74" width="230" height="104" rx="12" fill="white" stroke="#d1cfcc" strokeWidth="1" />
                  <rect x="651" y="74" width="228" height="24" rx="12" fill="#e8f5f3" />
                  <text x="674" y="91" fill="#0d7d74" fontSize="9" fontWeight="700" letterSpacing="1.2">MÓDULO · ARBITRAJE</text>
                  <circle cx="856" cy="86" r="6.5" fill="#0d7d74" />
                  <text x="856" y="89" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">&#10003;</text>
                  <text x="765" y="126" textAnchor="middle" fill="#1a1918" fontSize="16" fontWeight="700">Laudos</text>
                  <text x="765" y="144" textAnchor="middle" fill="#0d7d74" fontSize="10" fontWeight="500" textDecoration="underline">laudos.co</text>
                  <text x="765" y="163" textAnchor="middle" fill="#76716a" fontSize="9">Laudos arbitrales y jurisprudencia</text>
                </g>
              </a>

              {/* ═══ EN DESARROLLO ×3 (abajo) ═══ */}
              <g className="eco-float">
                <rect x="90" y="470" width="190" height="92" rx="12" fill="white" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="6 5" />
                <circle cx="256" cy="486" r="6" fill="#d1cfcc" />
                <text x="185" y="514" textAnchor="middle" fill="#76716a" fontSize="13" fontWeight="700">Litigio</text>
                <text x="185" y="534" textAnchor="middle" fill="#9a958e" fontSize="8.5" fontWeight="600" letterSpacing="0.5">EN DESARROLLO</text>
              </g>

              <g className="eco-float-delay">
                <rect x="405" y="500" width="190" height="92" rx="12" fill="white" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="6 5" />
                <circle cx="571" cy="516" r="6" fill="#d1cfcc" />
                <text x="500" y="544" textAnchor="middle" fill="#76716a" fontSize="13" fontWeight="700">Contratos</text>
                <text x="500" y="564" textAnchor="middle" fill="#9a958e" fontSize="8.5" fontWeight="600" letterSpacing="0.5">EN DESARROLLO</text>
              </g>

              <g className="eco-float">
                <rect x="720" y="470" width="190" height="92" rx="12" fill="white" stroke="#d1cfcc" strokeWidth="1.5" strokeDasharray="6 5" />
                <circle cx="886" cy="486" r="6" fill="#d1cfcc" />
                <text x="815" y="508" textAnchor="middle" fill="#76716a" fontSize="12" fontWeight="700">Penal · Constitucional</text>
                <text x="815" y="528" textAnchor="middle" fill="#9a958e" fontSize="8.5" fontWeight="600" letterSpacing="0.5">EN DESARROLLO</text>
              </g>

              {/* Legend */}
              <circle cx="372" cy="630" r="5.5" fill="#0d7d74" />
              <text x="372" y="633.5" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">&#10003;</text>
              <text x="387" y="634" fill="#6e6b68" fontSize="9" fontWeight="500">En producción</text>
              <circle cx="510" cy="630" r="5" fill="#d1cfcc" />
              <text x="525" y="634" fill="#6e6b68" fontSize="9" fontWeight="500">En desarrollo</text>

              {/* Bottom branding */}
              <rect x="380" y="652" width="240" height="22" rx="11" fill="url(#inkGrad)" />
              <text x="500" y="667" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" letterSpacing="1.2">ECOSISTEMA LEGAL KELSEN</text>
            </svg>
            </Reveal>
          </div>{/* fin mb-14 */}

          {/* Separador sub-bloque Fábrica */}
          <div className="fine-rule mt-20 mb-16" />

          {/* Sub-bloque B — Fábrica de software (capacidad del mismo motor) */}
          <div id="fabrica">
          <Reveal className="mb-14">
            <SectionKicker n="03b">Fábrica de software</SectionKicker>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-2xl">
              El mismo motor <em className="italic">construye software.</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed">
              Nuestros agentes no solo razonan: construyen. De la especificación al deploy, el motor convierte una idea en producto para empresas y startups. Porkia y MiMotoYa ya salieron del mismo núcleo.
            </p>
          </Reveal>

          <div className="svg-scroll-hint">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" /></svg>
            Desliza para ver completo
          </div>
          <Reveal className="w-full overflow-x-auto">
            <svg viewBox="0 0 1000 520" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[1000px] mx-auto min-w-[540px]" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }} role="img" aria-label="Fábrica de software de INPLUX: el mismo motor agéntico alimenta un pipeline de especificación, agentes, build y deploy que produce muchas aplicaciones, y cada release entrena de vuelta al motor">
              {/* Background dots */}
              {Array.from({ length: 14 }).map((_, row) =>
                Array.from({ length: 28 }).map((_, col) => (
                  <circle key={`fb-${row}-${col}`} cx={36 * col + 12} cy={37 * row + 12} r="0.35" fill="#ebe8e4" />
                ))
              )}

              {/* ═══ MOTOR (núcleo, izquierda) ═══ */}
              <ellipse cx="124" cy="280" rx="132" ry="106" fill="url(#tealHalo)" className="svg-halo-pulse" />
              <a href="#motor">
                <g className="eco-glow svg-card" style={{ cursor: "pointer" }}>
                  <rect x="38" y="224" width="172" height="112" rx="16" fill="url(#inkGrad)" />
                  <rect x="38" y="224" width="172" height="112" rx="16" fill="none" stroke="#0d7d74" strokeWidth="2" strokeDasharray="10 280" className="eco-orbit" style={{ animationDuration: "8s" }} />
                  <text x="124" y="274" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">Motor agéntico</text>
                  <text x="124" y="294" textAnchor="middle" fill="#5fe3d6" fontSize="8" fontWeight="600" letterSpacing="1.5">SELF-IMPROVING</text>
                  <text x="124" y="314" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8.5">memoria · aprendizaje</text>
                </g>
              </a>

              {/* Motor → pipeline */}
              <line x1="210" y1="280" x2="248" y2="280" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow" />
              <polygon points="248,275 258,280 248,285" fill="#0d7d74" />

              {/* ═══ PIPELINE (fábrica, centro) ═══ */}
              <rect x="262" y="150" width="300" height="262" rx="16" fill="white" stroke="#d1cfcc" strokeWidth="1" />
              <rect x="263" y="150" width="298" height="30" rx="16" fill="#f3f1ee" />
              <text x="412" y="170" textAnchor="middle" fill="#6e6b68" fontSize="9" fontWeight="700" letterSpacing="2">FÁBRICA DE SOFTWARE</text>
              {[
                { n: "01", t: "Especificación", s: "spec-kit · requisitos vivos" },
                { n: "02", t: "Agentes construyen", s: "código, datos y modelos" },
                { n: "03", t: "Build & pruebas", s: "CI/CD · tests automáticos" },
                { n: "04", t: "Deploy continuo", s: "a producción en días" },
              ].map((st, i) => {
                const y = 196 + i * 52;
                return (
                  <g key={st.n}>
                    <rect x="280" y={y} width="264" height="42" rx="10" fill="#f6f4f1" />
                    <circle cx="302" cy={y + 21} r="11" fill="#0d7d74" />
                    <text x="302" y={y + 24} textAnchor="middle" fill="white" fontSize="8" fontWeight="700">{st.n}</text>
                    <text x="324" y={y + 18} fill="#1a1918" fontSize="11" fontWeight="700">{st.t}</text>
                    <text x="324" y={y + 33} fill="#76716a" fontSize="9">{st.s}</text>
                    {i < 3 && <line x1="412" y1={y + 42} x2="412" y2={y + 52} stroke="#d1cfcc" strokeWidth="1.2" strokeDasharray="3 3" />}
                  </g>
                );
              })}

              {/* Salida del pipeline → origen del abanico */}
              <line x1="562" y1="280" x2="592" y2="280" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow" />
              <circle cx="600" cy="280" r="4.5" fill="#0d7d74" />
              <circle cx="600" cy="280" r="9" fill="none" stroke="#0d7d74" strokeWidth="1" opacity="0.35" />

              {/* ═══ ABANICO DE PRODUCTOS (un núcleo → muchas .apps) ═══ */}
              <text x="828" y="132" textAnchor="middle" fill="#6e6b68" fontSize="9" fontWeight="700" letterSpacing="2">PRODUCTOS · .APPS</text>
              {[
                { name: "Tribai", prod: true, status: "En producción" },
                { name: "Gobia", prod: true, status: "En producción" },
                { name: "Kelsen", prod: true, status: "En producción" },
                { name: "Laudos", prod: true, status: "En producción" },
                { name: "Porkia", prod: true, status: "En producción" },
                { name: "MiMotoYa", prod: false, status: "En desarrollo" },
                { name: "+ nuevas .apps", prod: false, status: "el mismo núcleo, más productos" },
              ].map((a, i) => {
                const cy = 168 + i * 46;
                return (
                  <g key={a.name}>
                    <path d={`M600,280 C 658,280 662,${cy} 716,${cy}`} fill="none" stroke={a.prod ? "#a9d6d0" : "#e2dfdb"} strokeWidth={a.prod ? 1.4 : 1} strokeDasharray={a.prod ? "0" : "4 4"} />
                    <rect x="720" y={cy - 19} width="216" height="38" rx="10" fill="white" stroke={a.prod ? "#e2dfdb" : "#d1cfcc"} strokeWidth="1" strokeDasharray={a.prod ? "0" : "5 4"} />
                    {a.prod && <rect x="729" y={cy - 12} width="3.5" height="24" rx="1.75" fill="#0d7d74" />}
                    <text x={a.prod ? 744 : 736} y={cy - 1} fill={a.prod ? "#1a1918" : "#76716a"} fontSize="12" fontWeight="700">{a.name}</text>
                    <text x={a.prod ? 744 : 736} y={cy + 12} fill={a.prod ? "#0d7d74" : "#9a958e"} fontSize="8" fontWeight="600">{a.status}</text>
                  </g>
                );
              })}
              <text x="828" y="500" textAnchor="middle" fill="#9a958e" fontSize="8.5" fontWeight="600" letterSpacing="1.5">UN NÚCLEO · MUCHAS .APPS</text>

              {/* ═══ BUCLE DE AUTO-MEJORA: cada release entrena al motor ═══ */}
              <path d="M412,412 C 412,486 124,486 124,340" fill="none" stroke="#0d7d74" strokeWidth="1.5" strokeDasharray="5 4" className="eco-dash-flow" opacity="0.65" />
              <polygon points="119,350 124,338 129,350" fill="#0d7d74" opacity="0.8" />
              <text x="268" y="472" textAnchor="middle" fill="#0d7d74" fontSize="9" fontWeight="600" letterSpacing="0.4">Cada release entrena al motor</text>
            </svg>
          </Reveal>

          {/* Para quién · qué te llevas · CTA */}
          <Reveal className="grid md:grid-cols-3 gap-6 md:gap-8 mt-14 items-start">
            <div>
              <p className="text-teal text-[0.65rem] font-bold tracking-[0.12em] uppercase mb-2">Para quién</p>
              <p className="text-gray-600 text-[0.9rem] leading-relaxed">Empresas y startups que necesitan software de verdad — no presentaciones — a velocidad de frontera. El mismo motor agéntico, tu producto.</p>
            </div>
            <div>
              <p className="text-teal text-[0.65rem] font-bold tracking-[0.12em] uppercase mb-2">Qué te llevas</p>
              <ul className="space-y-2 text-gray-600 text-[0.9rem] leading-snug">
                <li className="flex gap-2"><span className="text-teal">→</span>Del spec al deploy en semanas, no meses.</li>
                <li className="flex gap-2"><span className="text-teal">→</span>Agentes que construyen, prueban y despliegan con tu conocimiento dentro.</li>
                <li className="flex gap-2"><span className="text-teal">→</span>Portafolio probado: Porkia (ganadería) · MiMotoYa (movilidad) · más.</li>
              </ul>
            </div>
            <div className="md:pt-5">
              <span className="bracket-cta is-block">
                <span className="br-tr" />
                <span className="br-bl" />
                <m.a href="mailto:contacto@inplux.co?subject=Nueva%20.app%20con%20INPLUX" className="btn-dark w-full justify-center" style={{ transitionProperty: "background-color, box-shadow" }} {...pressable(reducedMotion)}>
                  Conversemos tu .app
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                </m.a>
              </span>
              <a href="#empresas" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-ink text-sm font-semibold mt-3 ml-1.5 transition-colors">
                Ver el portafolio
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </a>
            </div>
          </Reveal>
          </div>{/* end #fabrica */}
        </div>
      </section>

      {/* ──── MOTOR — Self-improving agent (ancla narrativa) ──── */}
      <section id="motor" className="py-24 md:py-32 bg-warm">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <Reveal className="mb-14">
            <SectionKicker n="04">El motor</SectionKicker>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-2xl">
Un agente <em className="italic">que se mejora solo.</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed">
              No es IA del montón. Un agente que recuerda cada caso, consolida lo aprendido mientras nadie lo mira y queda mejor en cada vuelta. El conocimiento no se recalcula: se compone.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center">
            {/* Narrativa (HTML, responsive) */}
            <Reveal className="max-w-[420px]">
              <h3 className="font-serif text-[1.6rem] md:text-[1.9rem] italic text-ink leading-tight mb-2">Segundo cerebro</h3>
              <p className="text-gray-500 text-[0.9rem] leading-relaxed mb-6">Memoria persistente que se compone, no se recalcula. El agente recupera de ella antes de actuar.</p>
              <ul className="space-y-3.5 mb-6">
                {[
                  { t: "Episódica", s: "Eventos con fecha y contexto" },
                  { t: "Semántica", s: "Hechos, doctrina y reglas" },
                  { t: "Procedural", s: "Cómo se hace · playbooks" },
                  { t: "Grafo + LLM-wiki", s: "Conocimiento conectado" },
                ].map((m) => (
                  <li key={m.t} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0 mt-2" aria-hidden="true" />
                    <span>
                      <span className="block font-serif italic text-ink text-[1.05rem] leading-tight">{m.t}</span>
                      <span className="block text-gray-500 text-[0.8rem]">{m.s}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border pt-4">
                <p className="font-serif italic text-ink text-[1.05rem] leading-snug">
                  Más casos<span className="text-teal"> → </span>mejor cerebro<span className="text-teal"> → </span>mejor agente
                </p>
                <p className="text-gray-400 text-[0.75rem] mt-1.5">Gobernado · citación verificable · trazabilidad</p>
              </div>
            </Reveal>

            {/* Grafo cerebro (puro visual) */}
            <div className="relative">
              <BrainGraph data={MOTOR_GRAPH} highlights={MOTOR_HILITE} reticleId={54} uid="motor" w={520} h={460} />
            </div>
          </div>

          {/* Dual-frente quick links — más aire tras el diagrama */}
          <Reveal className="grid sm:grid-cols-2 gap-4 mt-16 max-w-[760px] mx-auto">
            <a href="#publico" className="card group flex items-start gap-3 hover:border-teal transition-colors">
              <span className="text-teal text-[0.7rem] font-bold tracking-[0.12em] uppercase mt-0.5">Frente Público</span>
              <span>
                <span className="block font-serif text-[1.15rem] text-ink mb-0.5">Gobierno y municipios</span>
                <span className="block text-gray-500 text-[0.85rem] leading-relaxed">Gobia, Tribai tributario — hacienda pública modernizada con IA.</span>
              </span>
            </a>
            <a href="#privado" className="card group flex items-start gap-3 hover:border-teal transition-colors">
              <span className="text-teal text-[0.7rem] font-bold tracking-[0.12em] uppercase mt-0.5">Frente Privado</span>
              <span>
                <span className="block font-serif text-[1.15rem] text-ink mb-0.5">Empresas y startups</span>
                <span className="block text-gray-500 text-[0.85rem] leading-relaxed">Kelsen, Laudos, Porkia, MiMotoYa — cerebro legal y fábrica de software.</span>
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ──── MANIFIESTO (moved up) ──── */}
      <section id="nosotros" className="py-20 md:py-28 bg-warm">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <Reveal className="mb-12">
            <SectionKicker n="05">El conocimiento</SectionKicker>
            <h2 className="font-serif text-[2.25rem] md:text-[3rem] lg:text-[3.5rem] leading-[1.08] tracking-[-0.02em] text-ink mb-6 max-w-[760px]">
              25 años de experiencia real <em className="italic">entrenan a nuestros agentes</em>
            </h2>
            <div className="max-w-[680px]">
              <p className="text-gray-600 text-base md:text-lg leading-[1.65] mb-4">
                Nuestro CEO lleva 25 años asesorando entidades públicas de toda índole — municipios, gobernaciones, empresas de servicios públicos y provincias — coordinando 44 estatutos tributarios para la Gobernación de Antioquia y estructurando la gestión financiera, contable y tributaria de más de 50 entidades en Colombia.
              </p>
              <p className="text-gray-500 text-[0.9375rem] leading-[1.65] mb-4">
                De esa experiencia nació INPLUX: un Hub donde el conocimiento tributario, financiero y contable se traduce en tecnología. Desde sus inicios, fundó empresas de asesoría tributaria y financiera, formó alianzas con Sistemas Aries — proveedores de la plataforma ERP financiera modular con más de 31 años en el departamento —, Think IT, BBD Soluciones, Alianza IT y el Observatorio de Datos y Análisis, y hoy lidera el ecosistema que construye Tribai.co y la plataforma de sector público.
              </p>
              <p className="text-gray-500 text-[0.9375rem] leading-[1.65]">
                Ese es nuestro moat. No usamos IA genérica: entrenamos a nuestros agentes con normativa colombiana real, casos reales y 25 años de criterio experto. Por eso saben de qué hablan — y por eso cada vuelta del motor los hace mejores.
              </p>
            </div>
          </Reveal>

          {/* El conocimiento — flujo experiencia → producto (grafo) */}
          <div className="mb-14 max-w-[900px] mx-auto">
            <div className="flex items-center justify-between text-[0.68rem] font-semibold tracking-[0.14em] uppercase text-gray-400 mb-1 px-1">
              <span>Experiencia · 25 años</span>
              <span>Producto</span>
            </div>
            <BrainGraph data={CONOC_GRAPH} highlights={CONOC_PRODUCTS} uid="conoc" w={520} h={380} />
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 mt-4 text-[0.82rem]">
              <span className="text-gray-500">Cristaliza en producto:</span>
              {["Tribai", "Kelsen", "Laudos", "Gobia"].map((p) => (
                <span key={p} className="inline-flex items-center gap-1.5 font-serif italic text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal" aria-hidden="true" />{p}
                </span>
              ))}
            </div>
          </div>

          <Stagger className="grid md:grid-cols-3 gap-8 md:gap-12">
            <StaggerItem className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink text-white text-[0.75rem] font-bold mb-4">1</div>
              <h3 className="font-serif text-[1.15rem] text-ink mb-2 leading-snug">Primero la norma,<br /><em className="italic">después el código</em></h3>
              <p className="text-gray-500 text-[0.85rem] leading-relaxed">Nuestros modelos de IA se entrenan con 25 años de experiencia tributaria y financiera real. No con tutoriales de internet.</p>
            </StaggerItem>
            <StaggerItem className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink text-white text-[0.75rem] font-bold mb-4">2</div>
              <h3 className="font-serif text-[1.15rem] text-ink mb-2 leading-snug">Entregamos productos,<br /><em className="italic">no horas de consultoría</em></h3>
              <p className="text-gray-500 text-[0.85rem] leading-relaxed">Tribai.co ya está en producción. El gemelo digital municipal viene en camino. Esto no es un PowerPoint.</p>
            </StaggerItem>
            <StaggerItem className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal text-white text-[0.75rem] font-bold mb-4">3</div>
              <h3 className="font-serif text-[1.15rem] text-ink mb-2 leading-snug">Medimos impacto,<br /><em className="italic">no cobramos por estar</em></h3>
              <p className="text-gray-500 text-[0.85rem] leading-relaxed">+100 proyectos. +50 municipios. Un equipo que llega, ejecuta y deja las cosas funcionando.</p>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* ──── CAPACIDADES — SVG Interconnected ──── */}
      <section id="servicios" className="py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <Reveal className="mb-14">
            <SectionKicker n="06">Lo que dominan nuestros agentes</SectionKicker>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-lg">
              Conocimiento de fondo.<br /><em className="italic">Agentes de frontera.</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed">
              Cuatro dominios que alimentan al motor. El conocimiento nutre a los agentes, los agentes generan herramientas, las herramientas automatizan la gestión — y todo retroalimenta al motor.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center">
            {/* Narrativa (HTML responsive) */}
            <Reveal className="max-w-[440px]">
              <ul className="space-y-4">
                {[
                  { n: "01", t: "Inteligencia tributaria", s: "+50 municipios · 44 estatutos coordinados" },
                  { n: "02", t: "IA neuro-simbólica & RAG", s: "normativa colombiana indexada y razonada" },
                  { n: "03", t: "Gemelos & gobernanza", s: "Contraloría · DNP · IAS en un solo tablero" },
                  { n: "04", t: "Hiperautomatización", s: "+35 calculadoras · ×100 más rápido" },
                ].map((d) => (
                  <li key={d.n} className="flex items-start gap-3">
                    <span className="font-serif italic text-teal text-[0.95rem] tabular-nums mt-0.5">{d.n}</span>
                    <span>
                      <span className="block font-serif italic text-ink text-[1.1rem] leading-tight">{d.t}</span>
                      <span className="block text-gray-500 text-[0.82rem]">{d.s}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-400 text-[0.78rem] mt-6 flex flex-wrap items-center gap-x-2">
                <span>nutre</span><span className="text-teal">→</span><span>genera</span><span className="text-teal">→</span><span>automatiza</span><span className="text-teal">→</span><span>retroalimenta</span>
              </p>
            </Reveal>

            {/* Constelación de dominios (4 lóbulos + hub) */}
            <div className="relative">
              <BrainGraph data={CAPAC_GRAPH} highlights={CAPAC_HILITE} reticleId={120} uid="capac" w={520} h={460} />
            </div>
          </div>
        </div>
      </section>

      {/* ──── SOLIDEZ TÉCNICA — Frontera del conocimiento ──── */}
      <section id="tecnologia" className="relative overflow-hidden py-20 md:py-28 bg-warm">
        <div className="absolute inset-0 z-0 tech-grid tech-grid-fade pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 max-w-[1100px] mx-auto px-5 md:px-8">
          <Reveal className="mb-14">
            <SectionKicker n="07">Solidez técnica · Frontera del conocimiento</SectionKicker>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-2xl">
              No inventamos la IA.<br /><em className="italic">Implementamos su frontera.</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed">
              Construimos sobre lo último en memoria, aprendizaje continuo y conocimiento persistente. Esto es lo que estudiamos y desplegamos — con 25 años de conocimiento real que lo aterriza.
            </p>
          </Reveal>

          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[
              { t: "Memory Blocks", d: "Memoria persistente y editable que el propio agente lee, escribe y versiona.", r: "MemGPT · Letta" },
              { t: "Sleep-time Compute", d: "El agente consolida y reflexiona en reposo, sin costar latencia en vivo.", r: "Letta · arXiv 2504.13171" },
              { t: "LLM-Wiki", d: "El conocimiento se compila en un wiki vivo e interconectado, no en chunks sueltos.", r: "Patrón A. Karpathy, 2026" },
              { t: "GraphRAG", d: "Grafo de conocimiento para razonamiento multi-hop y menos alucinaciones.", r: "Microsoft Research" },
              { t: "Continual Learning", d: "Mejora con cada caso, sin olvido catastrófico ni reentrenar de cero.", r: "Survey · arXiv 2404.16789" },
              { t: "Memoria episódica", d: "Recuerda eventos con fecha y contexto — la pieza que faltaba para el largo plazo.", r: "arXiv 2502.06975" },
            ].map((x) => (
              <StaggerItem key={x.t} className="card">
                <h3 className="font-serif text-[1.2rem] tracking-[-0.01em] text-ink mb-1.5">{x.t}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3.5">{x.d}</p>
                <span className="inline-block text-[0.62rem] font-semibold tracking-[0.06em] uppercase bg-gray-50 text-gray-400 border border-border px-2.5 py-1 rounded-md">{x.r}</span>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal as="p" className="text-gray-400 text-[0.8rem] mt-10 max-w-xl leading-relaxed">
            Estudiamos la frontera para construir en ella. La misma maquinaria de auto-mejora mueve nuestro cerebro legal y nuestra fábrica de software.
          </Reveal>
        </div>
      </section>

      {/* ──── INFRAESTRUCTURA — SVG Visual ──── */}
      <section className="py-24 md:py-32 bg-warm">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <Reveal className="mb-14">
            <SectionKicker n="08">Infraestructura</SectionKicker>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-lg">
              Tecnología de punta <em className="italic">detrás de cada producto</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed">
              Construimos sobre infraestructura de clase mundial. Cada capa — desde la inteligencia artificial hasta el despliegue — está diseñada para escalar con nuestros clientes.
            </p>
          </Reveal>

          <div className="svg-scroll-hint">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" /></svg>
            Desliza para ver completo
          </div>
          <Reveal className="w-full overflow-x-auto">
            <svg viewBox="0 0 960 620" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[960px] mx-auto min-w-[640px]" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }} role="img" aria-label="Infraestructura tecnológica de INPLUX organizada por capas">
              {/* Background dots */}
              {Array.from({ length: 17 }).map((_, row) =>
                Array.from({ length: 27 }).map((_, col) => (
                  <circle key={`ig-${row}-${col}`} cx={36 * col + 12} cy={37 * row + 10} r="0.35" fill="#ebe8e4" />
                ))
              )}

              {/* ═══ LAYER 1: IA & MODELOS ═══ */}
              <g className="eco-float">
                <rect x="30" y="20" width="900" height="120" rx="16" fill="white" stroke="#0d7d74" strokeWidth="1.5" />
                <rect x="31" y="20" width="898" height="30" rx="16" fill="#f3f1ee" />
                <text x="55" y="40" fill="#6e6b68" fontSize="9" fontWeight="700" letterSpacing="2">INTELIGENCIA ARTIFICIAL & MODELOS</text>

                {/* AI pills — esenciales */}
                <rect x="50" y="82" width="124" height="26" rx="13" fill="#f3f1ee" />
                <text x="112" y="99" textAnchor="middle" fill="#6e6b68" fontSize="9" fontWeight="600">Modelos LLM</text>
                <rect x="184" y="82" width="120" height="26" rx="13" fill="#f3f1ee" />
                <text x="244" y="99" textAnchor="middle" fill="#6e6b68" fontSize="9" fontWeight="600">Embeddings</text>
                <rect x="314" y="82" width="124" height="26" rx="13" fill="#f3f1ee" />
                <text x="376" y="99" textAnchor="middle" fill="#6e6b68" fontSize="9" fontWeight="600">RAG Pipeline</text>
                <rect x="448" y="82" width="168" height="26" rx="13" fill="#f3f1ee" />
                <text x="532" y="99" textAnchor="middle" fill="#6e6b68" fontSize="9" fontWeight="600">Agentes Autónomos</text>
                <rect x="626" y="82" width="132" height="26" rx="13" fill="#f3f1ee" />
                <text x="692" y="99" textAnchor="middle" fill="#6e6b68" fontSize="9" fontWeight="600">Base Vectorial</text>
              </g>

              {/* Connection lines layer 1 → 2 */}
              <line x1="480" y1="144" x2="480" y2="168" stroke="#c8c5c1" strokeWidth="1.5" strokeDasharray="4 3" className="eco-dash-flow" />
              <line x1="240" y1="144" x2="240" y2="168" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="720" y1="144" x2="720" y2="168" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="3 3" />

              {/* ═══ LAYER 2: APLICACIONES ═══ */}
              <g className="eco-float-delay">
                <rect x="30" y="168" width="900" height="120" rx="16" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <rect x="31" y="168" width="898" height="30" rx="16" fill="#f3f1ee" />
                <text x="55" y="188" fill="#6e6b68" fontSize="9" fontWeight="700" letterSpacing="2">APLICACIONES & PRODUCTOS</text>

                <rect x="50" y="212" width="110" height="24" rx="12" fill="#e8f5f3" />
                <text x="105" y="228" textAnchor="middle" fill="#0d7d74" fontSize="8" fontWeight="600">Tribai.co</text>
                <rect x="170" y="212" width="130" height="24" rx="12" fill="#f3f1ee" />
                <text x="235" y="228" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">+35 Calculadoras</text>
                <rect x="310" y="212" width="140" height="24" rx="12" fill="#f3f1ee" />
                <text x="380" y="228" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Declaración de Renta</text>
                <rect x="460" y="212" width="130" height="24" rx="12" fill="#f3f1ee" />
                <text x="525" y="228" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Info. Exógena</text>
                <rect x="600" y="212" width="140" height="24" rx="12" fill="#f3f1ee" />
                <text x="670" y="228" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Gemelo Municipal</text>
                <rect x="750" y="212" width="160" height="24" rx="12" fill="#f3f1ee" />
                <text x="830" y="228" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Hacienda Dashboard</text>

                <rect x="50" y="246" width="120" height="24" rx="12" fill="#f3f1ee" />
                <text x="110" y="262" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Estatuto RAG</text>
                <rect x="180" y="246" width="110" height="24" rx="12" fill="#f3f1ee" />
                <text x="235" y="262" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Rendición IAS</text>
                <rect x="300" y="246" width="140" height="24" rx="12" fill="#f3f1ee" />
                <text x="370" y="262" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Seguimiento PDM</text>
                <rect x="450" y="246" width="110" height="24" rx="12" fill="#f3f1ee" />
                <text x="505" y="262" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">API Tributaria</text>
                <rect x="570" y="246" width="120" height="24" rx="12" fill="#f3f1ee" />
                <text x="630" y="262" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">App Móvil</text>
                <rect x="700" y="246" width="150" height="24" rx="12" fill="#f3f1ee" />
                <text x="775" y="262" textAnchor="middle" fill="#6e6b68" fontSize="8" fontWeight="600">Estatuto Municipal IA</text>
              </g>

              {/* Connection lines layer 2 → 3 */}
              <line x1="480" y1="292" x2="480" y2="316" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="4 3" />
              <line x1="240" y1="292" x2="240" y2="316" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="720" y1="292" x2="720" y2="316" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="3 3" />

              {/* ═══ LAYER 3: FRONTEND & BACKEND ═══ */}
              <g className="eco-float">
                <rect x="30" y="316" width="440" height="100" rx="16" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <rect x="31" y="316" width="438" height="26" rx="16" fill="#f3f1ee" />
                <text x="55" y="334" fill="#6e6b68" fontSize="8" fontWeight="700" letterSpacing="2">FRONTEND & EXPERIENCIA</text>

                <rect x="50" y="352" width="90" height="22" rx="11" fill="#f3f1ee" />
                <text x="95" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">React 19</text>
                <rect x="148" y="352" width="90" height="22" rx="11" fill="#f3f1ee" />
                <text x="193" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Next.js</text>
                <rect x="246" y="352" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="296" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">TypeScript</text>
                <rect x="354" y="352" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="404" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Tailwind CSS</text>

                <rect x="50" y="382" width="110" height="22" rx="11" fill="#f3f1ee" />
                <text x="105" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Framer Motion</text>
                <rect x="168" y="382" width="80" height="22" rx="11" fill="#f3f1ee" />
                <text x="208" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Radix UI</text>
                <rect x="256" y="382" width="90" height="22" rx="11" fill="#f3f1ee" />
                <text x="301" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Recharts</text>
                <rect x="354" y="382" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="404" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Validación</text>
              </g>

              <g className="eco-float-delay">
                <rect x="490" y="316" width="440" height="100" rx="16" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <rect x="491" y="316" width="438" height="26" rx="16" fill="#f3f1ee" />
                <text x="515" y="334" fill="#6e6b68" fontSize="8" fontWeight="700" letterSpacing="2">BACKEND & DATOS</text>

                <rect x="510" y="352" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="560" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">PostgreSQL</text>
                <rect x="618" y="352" width="80" height="22" rx="11" fill="#f3f1ee" />
                <text x="658" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">ORM</text>
                <rect x="706" y="352" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="756" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">REST APIs</text>
                <rect x="814" y="352" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="864" y="367" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Webhooks</text>

                <rect x="510" y="382" width="120" height="22" rx="11" fill="#f3f1ee" />
                <text x="570" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Edge Functions</text>
                <rect x="638" y="382" width="90" height="22" rx="11" fill="#f3f1ee" />
                <text x="683" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Cron Jobs</text>
                <rect x="736" y="382" width="80" height="22" rx="11" fill="#f3f1ee" />
                <text x="776" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Cache</text>
                <rect x="824" y="382" width="90" height="22" rx="11" fill="#f3f1ee" />
                <text x="869" y="397" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Queues</text>
              </g>

              {/* Connection lines layer 3 → 4 */}
              <line x1="480" y1="420" x2="480" y2="444" stroke="#d1cfcc" strokeWidth="1" strokeDasharray="4 3" />

              {/* ═══ LAYER 4: DEVOPS & DESPLIEGUE ═══ */}
              <g className="eco-float">
                <rect x="140" y="444" width="680" height="70" rx="16" fill="white" stroke="#d1cfcc" strokeWidth="1.5" />
                <rect x="141" y="444" width="678" height="26" rx="16" fill="#f3f1ee" />
                <text x="165" y="462" fill="#6e6b68" fontSize="8" fontWeight="700" letterSpacing="2">DEVOPS · TESTING · DESPLIEGUE</text>

                <rect x="160" y="480" width="80" height="22" rx="11" fill="#f3f1ee" />
                <text x="200" y="495" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Cloud</text>
                <rect x="248" y="480" width="80" height="22" rx="11" fill="#f3f1ee" />
                <text x="288" y="495" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Docker</text>
                <rect x="336" y="480" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="386" y="495" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">CI/CD</text>
                <rect x="444" y="480" width="90" height="22" rx="11" fill="#f3f1ee" />
                <text x="489" y="495" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Testing</text>
                <rect x="542" y="480" width="100" height="22" rx="11" fill="#f3f1ee" />
                <text x="592" y="495" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Monitoring</text>
                <rect x="650" y="480" width="80" height="22" rx="11" fill="#f3f1ee" />
                <text x="690" y="495" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Pagos</text>
                <rect x="738" y="480" width="70" height="22" rx="11" fill="#f3f1ee" />
                <text x="773" y="495" textAnchor="middle" fill="#6e6b68" fontSize="7.5" fontWeight="600">Email</text>
              </g>

              {/* Decorative pulses */}
              <circle cx="60" cy="80" r="3" fill="#c8c5c1" className="eco-node-pulse" />
              <circle cx="900" cy="230" r="3" fill="#d1cfcc" className="eco-node-pulse-delay1" />
              <circle cx="60" cy="370" r="3" fill="#d1cfcc" className="eco-node-pulse-delay2" />
              <circle cx="900" cy="480" r="3" fill="#d1cfcc" className="eco-node-pulse" />

              {/* Stats bar */}
              <rect x="200" y="540" width="560" height="34" rx="17" fill="url(#inkGrad)" />
              <text x="480" y="561" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" letterSpacing="1.5">4 CAPAS · 40+ HERRAMIENTAS · INFRAESTRUCTURA DE CLASE MUNDIAL</text>

              {/* Side labels */}
              <text x="480" y="600" textAnchor="middle" fill="#76716a" fontSize="7.5" fontWeight="600" letterSpacing="1">DISEÑADA PARA ESCALAR CON NUESTROS CLIENTES</text>
            </svg>
          </Reveal>
        </div>
      </section>

      {/* ──── TIMELINE — Scrollytelling with two eras ──── */}
      <section id="trayectoria" className="py-20 md:py-28 bg-warm overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <Reveal className="mb-16 md:mb-20">
            <SectionKicker n="09">Trayectoria</SectionKicker>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-4 max-w-lg">
              25 años de <em className="italic">transformaciones</em>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed">
              Cada hito construyó sobre el anterior. Lo que empezó como asesoría en terreno hoy es un ecosistema de tecnología e inteligencia artificial.
            </p>
          </Reveal>

          {/* ═══ ERA 1: El grupo de expertos ═══ */}
          <Reveal className="mb-10">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-ink text-white flex items-center justify-center text-[0.75rem] font-bold shrink-0 shadow-md">I</div>
              <div>
                <h3 className="font-serif text-[1.5rem] md:text-[1.85rem] text-ink leading-tight mb-1">{TIMELINE_ERA_1.title}</h3>
                <span className="text-gray-400 text-[0.7rem] font-semibold tracking-[0.12em] uppercase">2000 — 2021 · 9 hitos</span>
              </div>
            </div>
            <div className="ml-[64px] md:ml-0 md:max-w-2xl">
              <p className="text-gray-500 text-[0.9375rem] leading-[1.65] mb-3">
                {TIMELINE_ERA_1.subtitle}
              </p>
              <a href={TIMELINE_ERA_1.ceoLinkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-teal text-[0.8125rem] font-semibold hover:text-ink transition-colors group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                Jaime Alonso Cano Pino
              </a>
            </div>
          </Reveal>

          {/* Era 1 Timeline */}
          <div className="relative mb-10">
            {/* Center line desktop / left line mobile */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-px" style={{ background: "linear-gradient(to bottom, #e5e3e0, #d1cfcc 30%, #d1cfcc 70%, #e5e3e0)" }} />
            <div className="md:hidden absolute left-[18px] top-0 bottom-0 w-px bg-border" />

            <div className="space-y-4 md:space-y-6">
              {TIMELINE_ERA_1.events.map((ev, i) => {
                const isKeyMilestone = ["2000", "2010", "2019"].includes(ev.year);
                return (
                  <Reveal key={ev.year} className="relative md:grid md:grid-cols-2 md:gap-10">
                    {/* Timeline dot */}
                    <div className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 top-6 z-10">
                      <div className={`rounded-full border-2 transition-all duration-500 ${isKeyMilestone ? "w-4 h-4 border-ink bg-ink shadow-[0_0_0_4px_rgba(26,25,24,0.08)]" : "w-3 h-3 border-gray-300 bg-white hover:border-ink hover:bg-ink"}`} />
                    </div>

                    {/* Card — alternates sides on desktop */}
                    <div className={`ml-10 md:ml-0 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"}`}>
                      <div className={`rounded-xl p-5 md:p-6 transition-all duration-300 hover:shadow-md ${isKeyMilestone ? "bg-warm-50 border border-border shadow-sm" : "bg-white border border-border hover:border-gray-200"}`}>
                        {/* Year + metric row */}
                        <div className={`flex items-center gap-3 mb-3 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                          <span className={`font-serif leading-none text-ink ${isKeyMilestone ? "text-[1.75rem] md:text-[2.25rem]" : "text-xl md:text-2xl"}`}>{ev.year}</span>
                          <span className={`text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full ${isKeyMilestone ? "bg-ink text-white" : "bg-warm-50 text-gray-500"}`}>{ev.metric}</span>
                        </div>
                        <p className="text-gray-500 text-[0.8125rem] leading-[1.6]">{ev.text}</p>
                      </div>
                    </div>
                    {i % 2 === 0 && <div className="hidden md:block" />}
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Era 1 Summary */}
          <Reveal className="mb-8">
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {[
                { num: "21", label: "años en campo" },
                { num: "+50", label: "entidades" },
                { num: "9", label: "hitos clave" },
              ].map((s) => (
                <div key={s.label} className="text-center py-3">
                  <div className="font-serif text-2xl md:text-3xl text-ink leading-none mb-1">{s.num}</div>
                  <div className="text-gray-400 text-[0.65rem] font-semibold uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* ═══ TRANSITION — Era break ═══ */}
          <Reveal className="relative my-14 md:my-20">
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-teal/30 to-transparent" />
            <div className="relative flex flex-col items-center gap-3">
              <div className="bg-off-white px-8 py-4 border border-teal/30 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  <p className="text-teal text-[0.8rem] font-bold tracking-[0.08em] uppercase">De la experiencia al producto</p>
                </div>
                <p className="text-gray-400 text-[0.7rem] text-center">Todo ese conocimiento se formaliza en tecnología</p>
              </div>
            </div>
          </Reveal>

          {/* ═══ ERA 2: La era INPLUX ═══ */}
          <Reveal className="mb-10">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-teal text-white flex items-center justify-center text-[0.75rem] font-bold shrink-0 shadow-md shadow-teal/20">II</div>
              <div>
                <h3 className="font-serif text-[1.5rem] md:text-[1.85rem] text-ink leading-tight mb-1">{TIMELINE_ERA_2.title}</h3>
                <span className="text-teal text-[0.7rem] font-semibold tracking-[0.12em] uppercase">2023 — Presente</span>
              </div>
            </div>
            <div className="ml-[64px] md:ml-0 md:max-w-2xl">
              <p className="text-gray-500 text-[0.9375rem] leading-[1.65]">
                {TIMELINE_ERA_2.subtitle}
              </p>
            </div>
          </Reveal>

          {/* Era 2 Timeline */}
          <div className="relative">
            {/* Center line desktop / left line mobile — teal gradient */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-px" style={{ background: "linear-gradient(to bottom, #0d7d74 0%, rgba(13,125,116,0.3) 100%)" }} />
            <div className="md:hidden absolute left-[18px] top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, #0d7d74 0%, rgba(13,125,116,0.3) 100%)" }} />

            <div className="space-y-6">
              {TIMELINE_ERA_2.events.map((ev, i) => {
                const isLast = i === TIMELINE_ERA_2.events.length - 1;
                return (
                  <Reveal key={ev.year} className="relative md:grid md:grid-cols-2 md:gap-10">
                    {/* Timeline dot — teal, glowing for last */}
                    <div className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 top-6 z-10">
                      <div className={`w-4 h-4 rounded-full border-2 border-teal bg-teal transition-all ${isLast ? "shadow-[0_0_0_5px_rgba(13,125,116,0.15),0_0_12px_rgba(13,125,116,0.2)]" : "shadow-[0_0_0_4px_rgba(13,125,116,0.08)]"}`} />
                    </div>

                    {/* Card */}
                    <div className={`ml-10 md:ml-0 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"}`}>
                      <div className={`rounded-xl p-5 md:p-7 transition-all duration-300 hover:shadow-md ${isLast ? "bg-gradient-to-br from-teal-soft/50 to-white border border-teal/30 shadow-sm" : "bg-white border border-border hover:border-gray-200"}`}>
                        <div className={`flex items-center gap-3 mb-3 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                          <span className="font-serif text-[2rem] md:text-[2.75rem] text-ink leading-none">{ev.year}</span>
                          <span className="text-[0.65rem] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full bg-ink text-white shadow-sm">{ev.metric}</span>
                        </div>
                        <p className="text-gray-600 text-[0.875rem] leading-[1.65] font-medium">{ev.text}</p>
                      </div>
                    </div>
                    {i % 2 === 0 && <div className="hidden md:block" />}
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Final — current status pulse */}
          <Reveal className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-white border border-teal/20 rounded-full px-5 py-2.5 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-teal opacity-40 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal" />
              </span>
              <span className="text-gray-600 text-[0.8rem] font-medium">Construyendo el futuro — {new Date().getFullYear()} en curso</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ──── CONTACT ──── */}
      <section id="contacto" className="relative overflow-hidden py-20 md:py-28 bg-warm">
        <div className="absolute inset-0 z-0 tech-grid tech-grid-fade pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-14 md:gap-20">
            <Reveal>
              <SectionKicker n="10">Contacto</SectionKicker>
              <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.01em] text-ink mb-5">Hablemos.</h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-10">
                Ya sea que necesite poner al día la hacienda pública de su municipio, automatizar su operación tributaria o construir un producto digital desde cero — arrancamos con una conversación.
              </p>
              <div className="space-y-5">
                <div>
                  <span className="text-gray-500 text-xs font-bold tracking-[0.1em] uppercase block mb-0.5">Dirección</span>
                  <a href="https://maps.google.com/?q=Transversal+5+A+%23+45+91+Medellín+Antioquia" target="_blank" rel="noopener noreferrer" className="text-gray-700 text-[0.9375rem] hover:text-teal transition-colors whitespace-pre-line">Transversal 5 A # 45 - 91{"\n"}Medellín, Antioquia</a>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-bold tracking-[0.1em] uppercase block mb-0.5">Teléfono</span>
                  <a href="tel:+573023194636" className="text-gray-700 text-[0.9375rem] hover:text-teal transition-colors">(+57) 302 319 46 36</a>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-bold tracking-[0.1em] uppercase block mb-0.5">Gerencia</span>
                  <a href="mailto:gerencia@inplux.co" className="text-gray-700 text-[0.9375rem] hover:text-teal transition-colors">gerencia@inplux.co</a>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-bold tracking-[0.1em] uppercase block mb-0.5">Coordinación comercial</span>
                  <a href="mailto:contacto@inplux.co" className="text-gray-700 text-[0.9375rem] hover:text-teal transition-colors">contacto@inplux.co</a>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="bg-off-white border border-border rounded-xl p-7 md:p-9">
                <h3 className="text-ink font-semibold text-[1.0625rem] tracking-[-0.01em] mb-6">Enviar mensaje</h3>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="contact-name" className="text-gray-700 text-[0.8125rem] font-medium mb-1.5 block">Nombre</label>
                    <input id="contact-name" type="text" placeholder="Su nombre" className="form-input" required />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="contact-email" className="text-gray-700 text-[0.8125rem] font-medium mb-1.5 block">Email</label>
                      <input id="contact-email" type="email" placeholder="correo@empresa.co" className="form-input" required />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="text-gray-700 text-[0.8125rem] font-medium mb-1.5 block">Teléfono</label>
                      <input id="contact-phone" type="tel" placeholder="+57 3XX XXX XXXX" className="form-input" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="text-gray-700 text-[0.8125rem] font-medium mb-1.5 block">Mensaje</label>
                    <textarea id="contact-message" rows={4} placeholder="Cuéntenos sobre su proyecto..." className="form-input resize-none" required />
                  </div>
                  <m.button type="submit" className="btn-dark w-full sm:w-auto" style={{ transitionProperty: "background-color, box-shadow" }} {...pressable(reducedMotion)}>
                    Enviar mensaje
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                  </m.button>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      </main>

      {/* ──── BACK TO TOP ──── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`back-to-top ${showTop ? "visible" : ""}`}
        aria-label="Volver arriba"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
      </button>

      {/* ──── FOOTER ──── */}
      <footer className="py-14 md:py-16 border-t border-border">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-10">
            <div>
              <img src="/brand/logos/inplux-logo-horizontal.svg" alt="INPLUX" className="h-7 w-auto mb-3" />
              <p className="text-gray-500 text-[0.8125rem] leading-relaxed max-w-[200px]">Hub de consultoría tributaria, tecnología e inteligencia artificial. Medellín, Colombia.</p>
            </div>
            <div>
              <h4 className="text-ink font-semibold text-[0.8125rem] mb-3.5">Navegación</h4>
              <ul className="space-y-2.5">
                {[{ label: "Inicio", href: "#inicio" }, ...navLinks].map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith("/") ? (
                      <Link href={l.href} className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">{l.label}</Link>
                    ) : (
                      <a href={l.href} className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">{l.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-ink font-semibold text-[0.8125rem] mb-3.5">Productos</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Kelsen.io", href: "https://kelsen.io" },
                  { label: "Tribai.co", href: "https://tribai.co" },
                  { label: "Laudos.co", href: "https://laudos.co" },
                  { label: "Gobia.co", href: "https://gobia.co" },
                  { label: "Porkia.co", href: "https://porkia.co" },
                ].map((p) => (
                  <li key={p.label}><a href={p.href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">{p.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-ink font-semibold text-[0.8125rem] mb-3.5">Aliados</h4>
              <ul className="space-y-2.5">
                <li><a href="https://fourier.dev/en" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Fourier</a></li>
                <li><a href="https://datosyanalisis.org/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-ink text-[0.8125rem] transition-colors">Observatorio de Datos</a></li>
                <li className="text-gray-500 text-[0.8125rem]">Sistemas Aries</li>
                <li className="text-gray-500 text-[0.8125rem]">Think IT</li>
                <li className="text-gray-500 text-[0.8125rem]">BBD Soluciones</li>
                <li className="text-gray-500 text-[0.8125rem]">Alianza IT</li>
              </ul>
            </div>
            <div>
              <h4 className="text-ink font-semibold text-[0.8125rem] mb-3.5">Contacto</h4>
              <ul className="space-y-2.5 text-gray-500 text-[0.8125rem]">
                <li>Medellín, Antioquia</li>
                <li>(+57) 302 319 46 36</li>
                <li><a href="mailto:gerencia@inplux.co" className="hover:text-ink transition-colors">gerencia@inplux.co</a></li>
                <li><a href="mailto:contacto@inplux.co" className="hover:text-ink transition-colors">contacto@inplux.co</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-gray-400 text-[0.75rem]">&copy; {new Date().getFullYear()} INPLUX S.A.S. Todos los derechos reservados.</p>
            <a href="https://www.linkedin.com/company/inplux" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ink transition-colors" aria-label="INPLUX en LinkedIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
          </div>
        </div>
      </footer>
        </>
      </MotionConfig>
    </LazyMotion>
  );
}
