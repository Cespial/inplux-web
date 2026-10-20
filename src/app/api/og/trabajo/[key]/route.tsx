import { ImageResponse } from "next/og";
import {
  getWorkSocialCard,
  isWorkSocialKey,
} from "../social-card";

export const runtime = "edge";

const imageSize = { width: 1200, height: 630 } as const;

// Rethink Sans, la familia única del sitio desde octubre de 2026. Son instancias
// estáticas (400 y 500) sacadas de la variable con fontTools: satori no lee
// woff2 ni resuelve ejes, así que la variable no sirve aquí.
const fontRegular = fetch(
  new URL("../../../../fonts/RethinkSans-Regular.ttf", import.meta.url),
).then((response) => response.arrayBuffer());
const fontMedium = fetch(
  new URL("../../../../fonts/RethinkSans-Medium.ttf", import.meta.url),
).then((response) => response.arrayBuffer());

const ivory = "#f6f2ec";
const black = "#0c0c0b";
const teal = "#00d7ca";
const muted = "rgba(246,242,236,0.6)";
const line = "rgba(246,242,236,0.16)";

type SocialImageRouteProps = {
  params: Promise<{ key: string }>;
};

export async function GET(
  request: Request,
  { params }: SocialImageRouteProps,
) {
  const { key } = await params;

  if (!isWorkSocialKey(key)) {
    return new Response("Tarjeta social no disponible", { status: 404 });
  }

  const card = getWorkSocialCard(key);
  const requestedVersion = new URL(request.url).searchParams.get("v");
  const [regular, medium] = await Promise.all([fontRegular, fontMedium]);
  const accent =
    card.kind === "profile" && card.attributionState === "unconfirmed" ? "#b8aaa0" : teal;

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: black,
          color: ivory,
          display: "flex",
          flexDirection: "column",
          fontFamily: "Rethink Sans",
          height: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "54px 64px 48px",
          position: "relative",
          width: "100%",
        }}
      >
        {/* retícula tenue + luz teal, el mismo fondo de las bandas del sitio */}
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(246,242,236,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(246,242,236,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            display: "flex",
            height: "100%",
            left: 0,
            position: "absolute",
            top: 0,
            width: "100%",
          }}
        />
        <div
          style={{
            backgroundImage:
              "radial-gradient(circle at 78% 40%, rgba(0,215,202,0.18), transparent 42%)",
            display: "flex",
            height: "100%",
            left: 0,
            position: "absolute",
            top: 0,
            width: "100%",
          }}
        />

        <div
          style={{
            alignItems: "center",
            borderBottom: `1px solid ${line}`,
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: 22,
            position: "relative",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              fontSize: 26,
              fontWeight: 500,
              letterSpacing: "-0.02em",
            }}
          >
            <span
              style={{
                backgroundColor: teal,
                borderRadius: 99,
                display: "flex",
                height: 12,
                marginRight: 14,
                width: 12,
              }}
            />
            INPLUX
          </div>
          <div
            style={{
              color: muted,
              display: "flex",
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "0.15em",
            }}
          >
            {card.eyebrow}
          </div>
        </div>

        <div
          style={{
            alignItems: "flex-end",
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
            paddingBottom: 34,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: card.kind === "directory" ? 780 : 720,
            }}
          >
            <div
              style={{
                alignItems: "center",
                color: teal,
                display: "flex",
                fontSize: 17,
                fontWeight: 500,
                letterSpacing: "0.15em",
                marginBottom: 18,
              }}
            >
              <span style={{ display: "flex", marginRight: 10 }}>→</span>
              {card.kind === "profile" ? `${card.category.toUpperCase()} · PRODUCTO PROPIO` : "PRODUCTOS PROPIOS"}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: card.kind === "directory" ? 84 : 112,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 0.98,
              }}
            >
              {card.title}
            </div>
            <div
              style={{
                color: "rgba(246,242,236,0.78)",
                display: "flex",
                fontSize: 26,
                lineHeight: 1.3,
                marginTop: 24,
                maxWidth: 700,
              }}
            >
              {card.description}
            </div>
          </div>

          {card.kind === "directory" ? (
            <div
              style={{
                alignItems: "flex-start",
                border: `1px solid ${line}`,
                borderRadius: 18,
                display: "flex",
                flexDirection: "column",
                marginLeft: 40,
                padding: "26px 28px",
                width: 260,
              }}
            >
              <span style={{ color: ivory, display: "flex", fontSize: 64, lineHeight: 1 }}>
                {card.sourceCount}
              </span>
              <span
                style={{
                  color: muted,
                  display: "flex",
                  fontSize: 15,
                  letterSpacing: "0.12em",
                  marginTop: 12,
                }}
              >
                FUENTES PÚBLICAS
              </span>
            </div>
          ) : (
            <div
              style={{
                alignItems: "center",
                border: `1px solid ${accent}`,
                borderRadius: 999,
                color: accent,
                display: "flex",
                fontSize: 15,
                fontWeight: 500,
                justifyContent: "center",
                letterSpacing: "0.1em",
                marginLeft: 40,
                padding: "14px 22px",
              }}
            >
              <span
                style={{
                  backgroundColor: accent,
                  borderRadius: 99,
                  display: "flex",
                  height: 9,
                  marginRight: 10,
                  width: 9,
                }}
              />
              {card.status.toUpperCase()}
            </div>
          )}
        </div>

        <div
          style={{
            alignItems: "center",
            borderTop: `1px solid ${line}`,
            color: muted,
            display: "flex",
            fontSize: 15,
            fontWeight: 500,
            justifyContent: "space-between",
            letterSpacing: "0.12em",
            paddingTop: 22,
            position: "relative",
          }}
        >
          <div style={{ color: accent, display: "flex" }}>{card.attribution.toUpperCase()}</div>
          <div style={{ display: "flex" }}>INPLUX.CO/TRABAJO · VERIFICADO {card.version}</div>
        </div>
      </div>
    ),
    {
      ...imageSize,
      fonts: [
        { name: "Rethink Sans", data: regular, style: "normal", weight: 400 },
        { name: "Rethink Sans", data: medium, style: "normal", weight: 500 },
      ],
      headers: {
        "Cache-Control":
          requestedVersion === card.version
            ? "public, max-age=31536000, immutable"
            : "public, max-age=0, must-revalidate",
      },
    },
  );
}
