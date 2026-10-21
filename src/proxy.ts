import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_COOKIE, TOKEN_WINDOW } from "@/lib/contact/fields.mjs";
import { issueToken, resolveSecret } from "@/lib/contact/token.mjs";

/*
 * Solo `/contacto` y su par inglés, `/en/contact`. La página es estática, así que una marca de tiempo escrita
 * en su HTML sería la del build. Para que el formulario funcione SIN JS, el
 * proxy deja en cada visita una cookie con la marca firmada, limitada al
 * endpoint (`Path=/api/contacto`, HttpOnly, SameSite=Strict). Con JS el
 * formulario usa `/api/contacto/token` y esta cookie sobra.
 */

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const secret = resolveSecret(process.env);
  if (!process.env.RESEND_API_KEY || !secret || request.method !== "GET") return response;

  response.cookies.set(TOKEN_COOKIE, issueToken(secret), {
    path: "/api/contacto",
    httpOnly: true,
    sameSite: "strict",
    secure: request.nextUrl.protocol === "https:",
    maxAge: Math.floor(TOKEN_WINDOW.maxAgeMs / 1000),
  });
  return response;
}

export const config = {
  matcher: ["/contacto", "/en/contact"],
};
