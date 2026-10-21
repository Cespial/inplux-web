import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { buildEmail, escapeHtml, formatBogota, resolveMailConfig } from "../src/lib/contact/email.mjs";
import { FIELD, LIMITS, TOKEN_WINDOW } from "../src/lib/contact/fields.mjs";
import { processSubmission } from "../src/lib/contact/process.mjs";
import { clientIp, createRateLimiter } from "../src/lib/contact/rate-limit.mjs";
import { createNonceStore, issueToken, resolveSecret, verifyToken } from "../src/lib/contact/token.mjs";
import { countUrls, sanitizePage, validateContact } from "../src/lib/contact/validate.mjs";

/**
 * El formulario de contacto (PR O): la lógica pura de `src/lib/contact/`.
 * Ninguna prueba llama a Resend: el `fetch` se inyecta y registra lo que
 * habría salido.
 */

const NOW = Date.parse("2026-10-20T20:04:00.000Z"); // 3:04 p. m. en Bogotá
const SECRET = "secreto-de-prueba";
const ENV = { NODE_ENV: "production", CONTACT_FORM_SECRET: SECRET, RESEND_API_KEY: "re_test_dummy" };

const valid = {
  [FIELD.name]: "Ana Gómez",
  [FIELD.email]: "ana@example.com",
  [FIELD.organization]: "Hospital Uno",
  [FIELD.needType]: "Mejorar una operación",
  [FIELD.message]: "Necesitamos ordenar la agenda de consulta externa.",
  [FIELD.page]: "/contacto",
};

function harness({ env = ENV, fields = {}, ip = "203.0.113.7", now = NOW, limiter, nonces, status = 200 } = {}) {
  const calls = [];
  const logs = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    return { ok: status >= 200 && status < 300, status };
  };
  const run = () =>
    processSubmission({
      fields: { ...valid, [FIELD.token]: issueToken(SECRET, now - 10_000), ...fields },
      ip,
      env,
      limiter: limiter ?? createRateLimiter(),
      nonces: nonces ?? createNonceStore(),
      fetchImpl,
      now,
      log: (message) => logs.push(message),
    });
  return { run, calls, logs };
}

test("camino feliz: llama a Resend con to, reply_to, asunto y cuerpo", async () => {
  const { run, calls } = harness();
  const result = await run();
  assert.deepEqual(result.body, { ok: true });
  assert.equal(result.outcome, "sent");
  assert.equal(calls.length, 1);
  const [{ url, init, body }] = calls;
  assert.equal(url, "https://api.resend.com/emails");
  assert.equal(init.headers.Authorization, "Bearer re_test_dummy");
  assert.deepEqual(body.to, ["cristian@inplux.co"]);
  assert.equal(body.from, "INPLUX <formulario@inplux.co>");
  assert.equal(body.reply_to, "ana@example.com");
  assert.equal(body.subject, "Contacto inplux.co · Ana Gómez · Hospital Uno");
  assert.match(body.text, /Página: \/contacto/);
  assert.match(body.text, /20 de octubre de 2026/);
});

test("asunto sin organización no deja un separador colgando", async () => {
  const { run, calls } = harness({ fields: { [FIELD.organization]: "" } });
  await run();
  assert.equal(calls[0].body.subject, "Contacto inplux.co · Ana Gómez");
});

test("el campo trampa no usa un nombre que el autocompletado reconozca", () => {
  assert.equal(FIELD.honeypot, "hp_ref_x7");
  assert.doesNotMatch(
    FIELD.honeypot,
    /name|nombre|mail|correo|org|empresa|company|web|url|site|sitio|phone|tel|address/i,
  );
});

test("el campo trampa del formulario: sin etiqueta y fuera del alcance de autocompletado y gestores", () => {
  const source = readFileSync(new URL("../src/components/site/ContactForm.tsx", import.meta.url), "utf8");
  const trap = source.match(/<div className="site-form-trap"[\s\S]*?<\/div>/)?.[0] ?? "";
  assert.match(trap, /aria-hidden="true"/);
  assert.match(trap, /name=\{FIELD\.honeypot\}/);
  assert.match(trap, /tabIndex=\{-1\}/);
  assert.match(trap, /autoComplete="off"/);
  assert.match(trap, /data-1p-ignore/);
  assert.match(trap, /data-lpignore="true"/);
  assert.match(trap, /data-form-type="other"/);
  assert.doesNotMatch(trap, /<label|<span/);
});

test("trampa llena: responde ok sin enviar y sin datos personales en el log", async () => {
  const { run, calls, logs } = harness({ fields: { [FIELD.honeypot]: "http://spam.example" } });
  const result = await run();
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { ok: true });
  assert.equal(result.outcome, "honeypot");
  assert.equal(calls.length, 0);
  assert.equal(logs.length, 1);
  assert.doesNotMatch(logs[0], /ana@example\.com|Ana|spam/);
});

test("menos de 3 s desde la marca: silencio, sin enviar", async () => {
  const { run, calls } = harness({ fields: { [FIELD.token]: issueToken(SECRET, NOW - 1_000) } });
  const result = await run();
  assert.deepEqual(result.body, { ok: true });
  assert.equal(result.outcome, "token_too_fast");
  assert.equal(calls.length, 0);
});

test("marca de más de 2 h: silencio", async () => {
  const { run, calls } = harness({
    fields: { [FIELD.token]: issueToken(SECRET, NOW - TOKEN_WINDOW.maxAgeMs - 1) },
  });
  assert.equal((await run()).outcome, "token_expired");
  assert.equal(calls.length, 0);
});

test("la ventana de la marca es de 2 h", () => {
  assert.equal(TOKEN_WINDOW.maxAgeMs, 2 * 60 * 60 * 1000);
  const token = issueToken(SECRET, NOW);
  assert.equal(verifyToken(SECRET, token, NOW + 2 * 60 * 60 * 1000 - 1).ok, true);
  assert.deepEqual(verifyToken(SECRET, token, NOW + 2 * 60 * 60 * 1000 + 1), {
    ok: false,
    reason: "expired",
  });
});

test("token reutilizado: el segundo envío con la misma marca se descarta en silencio", async () => {
  const nonces = createNonceStore();
  const token = issueToken(SECRET, NOW - 10_000);
  const first = harness({ nonces, fields: { [FIELD.token]: token } });
  assert.equal((await first.run()).outcome, "sent");
  const second = harness({ nonces, ip: "198.51.100.77", fields: { [FIELD.token]: token } });
  const result = await second.run();
  assert.deepEqual(result.body, { ok: true });
  assert.equal(result.outcome, "token_reused");
  assert.equal(second.calls.length, 0);
  assert.equal(second.logs.length, 1);
  assert.doesNotMatch(second.logs[0], /ana@example\.com|Ana/);
});

test("un 400 no gasta la marca: la persona corrige y reenvía", async () => {
  const nonces = createNonceStore();
  const token = issueToken(SECRET, NOW - 10_000);
  const bad = harness({ nonces, fields: { [FIELD.token]: token, [FIELD.email]: "sin-arroba" } });
  assert.equal((await bad.run()).status, 400);
  const fixed = harness({ nonces, fields: { [FIELD.token]: token } });
  assert.equal((await fixed.run()).outcome, "sent");
});

test("nonce alterado: firma inválida", () => {
  const token = issueToken(SECRET, NOW - 10_000, "AAAAAAAAAAAAAAAAAAAAAA");
  const [issuedAt, , signature] = token.split(".");
  const altered = `${issuedAt}.BBBBBBBBBBBBBBBBBBBBBB.${signature}`;
  assert.deepEqual(verifyToken(SECRET, altered, NOW), { ok: false, reason: "signature" });
  assert.equal(verifyToken(SECRET, token, NOW).ok, true);
  const nonces = [issueToken(SECRET), issueToken(SECRET)].map((value) => value.split(".")[1]);
  assert.notEqual(nonces[0], nonces[1], "cada marca trae su propio nonce");
});

test("el registro de nonces caduca con la ventana", () => {
  const store = createNonceStore();
  store.add("n1", NOW);
  assert.equal(store.has("n1", NOW + 1_000), true);
  assert.equal(store.has("n1", NOW + TOKEN_WINDOW.maxAgeMs + 61_000), false);
  assert.equal(store.size(), 0);
});

test("firma inválida o ausente: silencio", async () => {
  const forged = issueToken("otro-secreto", NOW - 10_000);
  const bad = harness({ fields: { [FIELD.token]: forged } });
  assert.equal((await bad.run()).outcome, "token_signature");
  assert.equal(bad.calls.length, 0);

  const tampered = issueToken(SECRET, NOW - 10_000).replace(/^\d+/, String(NOW - 60_000));
  assert.equal(verifyToken(SECRET, tampered, NOW).ok, false);

  const missing = harness({ fields: { [FIELD.token]: "" } });
  assert.equal((await missing.run()).outcome, "token_missing");
});

test("sin JS: la marca llega por cookie si el cuerpo no la trae", async () => {
  const calls = [];
  const result = await processSubmission({
    fields: { ...valid },
    cookieToken: issueToken(SECRET, NOW - 60_000),
    ip: "203.0.113.9",
    env: ENV,
    limiter: createRateLimiter(),
    nonces: createNonceStore(),
    fetchImpl: async (url, init) => {
      calls.push(init);
      return { ok: true, status: 200 };
    },
    now: NOW,
    log: () => {},
  });
  assert.equal(result.outcome, "sent");
  assert.equal(calls.length, 1);
});

test("límite por IP: el sexto intento en 10 min es 429; otra IP pasa", async () => {
  const limiter = createRateLimiter();
  const outcomes = [];
  for (let index = 0; index < 6; index += 1) {
    const { run } = harness({ limiter, now: NOW + index * 1_000 });
    outcomes.push((await run()).status);
  }
  assert.deepEqual(outcomes, [200, 200, 200, 200, 200, 429]);
  const sixth = await harness({ limiter, now: NOW + 7_000 }).run();
  assert.deepEqual(sixth.body, { ok: false, error: "rate_limited" });
  assert.equal((await harness({ limiter, ip: "198.51.100.1" }).run()).status, 200);
});

test("límite diario: 20 por día aunque se respeten las ventanas de 10 min", () => {
  const limiter = createRateLimiter();
  const tenMinutes = 10 * 60 * 1000;
  let allowed = 0;
  for (let index = 0; index < 30; index += 1) {
    if (limiter.hit("ip", NOW + index * (tenMinutes / 5 + 1))) allowed += 1;
  }
  assert.equal(allowed, 20);
  assert.equal(limiter.hit("ip", NOW + 25 * 60 * 60 * 1000), true);
});

test("el limitador limpia IPs viejas y respeta su tope de memoria", () => {
  const limiter = createRateLimiter({ maxKeys: 3 });
  for (let index = 0; index < 10; index += 1) limiter.hit(`ip-${index}`, NOW);
  assert.ok(limiter.size() <= 4);
  limiter.hit("nueva", NOW + 2 * 24 * 60 * 60 * 1000);
  assert.equal(limiter.size(), 1);
});

test("IP desde x-forwarded-for, luego x-real-ip", () => {
  const headers = (entries) => ({ get: (name) => entries[name] ?? null });
  assert.equal(clientIp(headers({ "x-forwarded-for": "203.0.113.1, 10.0.0.1" })), "203.0.113.1");
  assert.equal(clientIp(headers({ "x-real-ip": "198.51.100.2" })), "198.51.100.2");
  assert.equal(clientIp(headers({})), "desconocida");
});

test("sin RESEND_API_KEY: 503 not_configured, sin llamar a nadie", async () => {
  const { run, calls } = harness({ env: { NODE_ENV: "production", CONTACT_FORM_SECRET: SECRET } });
  const result = await run();
  assert.equal(result.status, 503);
  assert.deepEqual(result.body, { ok: false, error: "not_configured" });
  assert.equal(calls.length, 0);
});

test("en producción sin clave ni secreto: not_configured (no hay con qué firmar)", async () => {
  const { run, calls } = harness({ env: { NODE_ENV: "production" } });
  assert.deepEqual((await run()).body, { ok: false, error: "not_configured" });
  assert.equal(calls.length, 0);
  assert.equal(resolveSecret({ NODE_ENV: "production" }), null);
  assert.ok(resolveSecret({ NODE_ENV: "development" }));
  const derived = resolveSecret({ NODE_ENV: "production", RESEND_API_KEY: "re_x" });
  assert.ok(derived && !derived.includes("re_x"));
});

test("Resend falla: 503 send_failed", async () => {
  const { run } = harness({ status: 422 });
  assert.deepEqual((await run()).body, { ok: false, error: "send_failed" });
});

test("validación del servidor", () => {
  const base = {
    name: valid[FIELD.name],
    email: valid[FIELD.email],
    organization: "",
    needType: "",
    message: valid[FIELD.message],
  };
  const check = (patch) => validateContact({ ...base, ...patch });
  assert.equal(check({}).ok, true);
  assert.deepEqual(check({ name: "A" }), { ok: false, error: "invalid_name" });
  assert.deepEqual(check({ name: "A".repeat(LIMITS.nameMax + 1) }), { ok: false, error: "invalid_name" });
  assert.deepEqual(check({ email: "sin-arroba" }), { ok: false, error: "invalid_email" });
  assert.deepEqual(check({ email: "a@b" }), { ok: false, error: "invalid_email" });
  assert.deepEqual(check({ email: `${"a".repeat(195)}@ex.co` }), { ok: false, error: "invalid_email" });
  assert.deepEqual(check({ organization: "x".repeat(161) }), { ok: false, error: "invalid_organization" });
  assert.deepEqual(check({ message: "corto" }), { ok: false, error: "invalid_message" });
  assert.deepEqual(check({ message: "x".repeat(4001) }), { ok: false, error: "invalid_message" });
  const links = "Ver https://a.co http://b.co www.c.co https://d.co";
  assert.equal(countUrls(links), 4);
  assert.deepEqual(check({ message: links }), { ok: false, error: "too_many_links" });
  assert.equal(check({ message: "Ver https://a.co http://b.co www.c.co ahora" }).ok, true);
  assert.equal(check({ name: "Ana\r\nBcc: x@y.co" }).value?.name, "Ana Bcc: x@y.co");
  assert.equal(check({ name: 42 }).ok, false);
});

test("página de origen: solo paths propios", () => {
  assert.equal(sanitizePage("/sectores/salud"), "/sectores/salud");
  assert.equal(sanitizePage("https://otro.example/x"), "");
  assert.equal(sanitizePage("//otro.example"), "");
});

test("HTML escapado: nada del visitante entra crudo al correo", async () => {
  const hostile = '<script>alert("x")</script> & <img src=x onerror=1>';
  const { run, calls } = harness({
    fields: {
      [FIELD.name]: "Eve <b>",
      [FIELD.organization]: "O'Reilly & <Co>",
      [FIELD.message]: hostile,
      [FIELD.page]: '/contacto"><svg>',
    },
  });
  await run();
  const { html, text } = calls[0].body;
  assert.doesNotMatch(html, /<script|<img|<b>|<svg|<Co>/);
  assert.match(html, /&lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt; &amp; &lt;img/);
  assert.match(html, /O&#39;Reilly &amp; &lt;Co&gt;/);
  assert.match(text, /<script>/, "el texto plano conserva lo escrito tal cual");
  assert.equal(escapeHtml(`<>&"'`), "&lt;&gt;&amp;&quot;&#39;");
});

test("correo: fecha en hora de Bogotá y variables por defecto", () => {
  assert.match(formatBogota(new Date(NOW)), /20 de octubre de 2026.*3:04/);
  const mail = buildEmail({
    name: "Ana",
    email: "a@b.co",
    organization: "",
    needType: "",
    message: "Hola equipo, una pregunta.",
    page: "",
    date: new Date(NOW),
  });
  assert.equal(mail.subject, "Contacto inplux.co · Ana");
  assert.match(mail.text, /Página: sin dato/);
  assert.deepEqual(resolveMailConfig({}), {
    apiKey: null,
    to: "cristian@inplux.co",
    from: "INPLUX <formulario@inplux.co>",
    apiUrl: "https://api.resend.com/emails",
  });
  assert.equal(resolveMailConfig({ RESEND_API_URL: "http://127.0.0.1:9/x" }).apiUrl, "http://127.0.0.1:9/x");
});
