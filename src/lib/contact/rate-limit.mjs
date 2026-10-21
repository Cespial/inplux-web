/*
 * Límite por IP en memoria.
 *
 * ⚠️ Es POR INSTANCIA: cada instancia de la función en Vercel (Fluid Compute)
 * lleva su propio Map, que se pierde cuando la instancia se recicla. Frena a
 * quien insiste desde una misma IP contra una misma instancia; no es un
 * límite global. Si hace falta uno de verdad, va en Vercel Firewall (regla de
 * rate limiting sobre POST /api/contacto) o en un almacén compartido.
 */

export const DEFAULT_LIMITS = Object.freeze([
  { windowMs: 10 * 60 * 1000, max: 5 },
  { windowMs: 24 * 60 * 60 * 1000, max: 20 },
]);

/**
 * @param {{ limits?: readonly { windowMs: number, max: number }[], maxKeys?: number }} [options]
 */
export function createRateLimiter({ limits = DEFAULT_LIMITS, maxKeys = 10_000 } = {}) {
  /** @type {Map<string, number[]>} */
  const hits = new Map();
  const longest = Math.max(...limits.map((limit) => limit.windowMs));
  let lastSweep = 0;

  /** @param {number} now */
  function sweep(now) {
    for (const [key, times] of hits) {
      const fresh = times.filter((time) => now - time < longest);
      if (fresh.length === 0) hits.delete(key);
      else hits.set(key, fresh);
    }
    // Tope duro de memoria: si aun así hay demasiadas IP, sale la más vieja.
    while (hits.size > maxKeys) {
      const oldest = hits.keys().next().value;
      if (oldest === undefined) break;
      hits.delete(oldest);
    }
    lastSweep = now;
  }

  return {
    /**
     * Registra un intento y dice si cabe en todos los límites.
     * @param {string} key
     * @param {number} [now]
     */
    hit(key, now = Date.now()) {
      if (now - lastSweep > 60_000 || hits.size > maxKeys) sweep(now);
      const times = (hits.get(key) ?? []).filter((time) => now - time < longest);
      const allowed = limits.every(
        (limit) => times.filter((time) => now - time < limit.windowMs).length < limit.max,
      );
      if (allowed) times.push(now);
      // Se reinserta para que el orden del Map siga el uso más reciente.
      hits.delete(key);
      hits.set(key, times);
      return allowed;
    },
    size() {
      return hits.size;
    },
  };
}

/**
 * IP del visitante: primer valor de `x-forwarded-for`, luego `x-real-ip`.
 * En Vercel ambas cabeceras las pone la plataforma.
 * @param {{ get(name: string): string | null }} headers
 */
export function clientIp(headers) {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first.slice(0, 64);
  const real = headers.get("x-real-ip")?.trim();
  return real ? real.slice(0, 64) : "desconocida";
}
