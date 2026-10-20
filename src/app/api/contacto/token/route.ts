import { issueToken, resolveSecret } from "@/lib/contact/token.mjs";

/*
 * GET /api/contacto/token: la marca de tiempo firmada que el formulario
 * adjunta al enviar. El navegador la pide al primer foco en el formulario, no
 * al cargar la página, para no gastar una invocación por visita.
 *
 * Sin `RESEND_API_KEY` responde 503 `not_configured` y el formulario usa el
 * borrador por `mailto:` desde el primer clic.
 */

export const dynamic = "force-dynamic";

export function GET() {
  const headers = { "Cache-Control": "no-store" };
  const secret = resolveSecret(process.env);
  if (!process.env.RESEND_API_KEY || !secret) {
    return Response.json({ ok: false, error: "not_configured" }, { status: 503, headers });
  }
  return Response.json({ ok: true, token: issueToken(secret) }, { headers });
}
