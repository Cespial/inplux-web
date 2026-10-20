#!/usr/bin/env node
/**
 * Cuenta las palabras de `<main>` en el HTML servido.
 *
 * Criterio (el mismo que usa la revisión editorial):
 *   1. se toma el primer `<main …>…</main>` del HTML;
 *   2. se quitan `<script>` y `<style>` con su contenido;
 *   3. se conservan las capas ocultas y lo marcado `aria-hidden`: si está en
 *      el HTML como texto, cuenta;
 *   4. se quitan las etiquetas, se decodifican las entidades básicas y
 *      palabras = texto.split() sobre espacios en blanco.
 *
 * Uso: node scripts/word-count.mjs <url|archivo.html> [...más]
 * Sin dependencias. No forma parte del gate.
 */
import { readFile } from "node:fs/promises";
import process from "node:process";

const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  "#39": "'",
};

function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/giu, (whole, body) => {
    if (body[0] === "#") {
      const code = body[1] === "x" || body[1] === "X"
        ? Number.parseInt(body.slice(2), 16)
        : Number.parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    return ENTITIES[body.toLowerCase()] ?? whole;
  });
}

export function mainText(html) {
  const open = html.search(/<main\b[^>]*>/iu);
  if (open === -1) return "";
  const close = html.indexOf("</main>", open);
  const fragment = html.slice(open, close === -1 ? undefined : close);
  const text = fragment
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, " ")
    .replace(/<[^>]+>/gu, " ");
  return decodeEntities(text);
}

export function countWords(html) {
  return mainText(html).split(/\s+/u).filter(Boolean).length;
}

async function load(target) {
  if (/^https?:\/\//iu.test(target)) {
    const response = await fetch(target, { headers: { accept: "text/html" } });
    if (!response.ok) throw new Error(`${target} → HTTP ${response.status}`);
    return response.text();
  }
  return readFile(target, "utf8");
}

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error("Uso: node scripts/word-count.mjs <url|archivo.html> [...]");
  process.exitCode = 2;
} else {
  for (const target of targets) {
    try {
      const html = await load(target);
      console.log(`${String(countWords(html)).padStart(5)}  ${target}`);
    } catch (error) {
      console.error(`   ERR  ${target}: ${error.message}`);
      process.exitCode = 1;
    }
  }
}
