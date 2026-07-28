import { ImageResponse } from "next/og";
import {
  getWorkSocialCard,
  isWorkSocialKey,
} from "../social-card";

export const runtime = "edge";

const imageSize = { width: 1200, height: 630 } as const;
const bodyFont = fetch(
  new URL(
    "../../../../../../node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf",
    import.meta.url,
  ),
).then((response) => response.arrayBuffer());

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
  const bodyFontData = await bodyFont;
  const accent = card.kind === "profile" && card.attributionState === "unconfirmed"
    ? "#b8aaa0"
    : "#00d7ca";

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          backgroundColor: "#0c0c0b",
          color: "#f3f0ea",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Geist",
          height: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "58px 64px 50px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(243,240,234,0.19) 1.5px, transparent 0)",
            backgroundSize: "26px 26px",
            display: "flex",
            height: "100%",
            left: 0,
            opacity: 0.7,
            position: "absolute",
            top: 0,
            width: "100%",
          }}
        />
        <div
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 45%, rgba(0,215,202,0.16), transparent 39%)",
            display: "flex",
            height: "100%",
            position: "absolute",
            right: 0,
            top: 0,
            width: "64%",
          }}
        />

        <div
          style={{
            alignItems: "center",
            borderBottom: "1px solid rgba(243,240,234,0.22)",
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: 24,
            position: "relative",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              fontSize: 27,
              fontWeight: 650,
              letterSpacing: "-0.035em",
            }}
          >
            <span
              style={{
                backgroundColor: "#00d7ca",
                borderRadius: 99,
                display: "flex",
                height: 14,
                marginRight: 13,
                width: 14,
              }}
            />
            INPLUX
          </div>
          <div
            style={{
              color: "rgba(243,240,234,0.66)",
              display: "flex",
              fontSize: 17,
              fontWeight: 560,
              letterSpacing: "0.16em",
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
            paddingBottom: 36,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: card.kind === "directory" ? 760 : 700,
            }}
          >
            {card.kind === "profile" ? (
              <div
                style={{
                  color: "rgba(243,240,234,0.58)",
                  display: "flex",
                  fontSize: 18,
                  fontWeight: 560,
                  letterSpacing: "0.13em",
                  marginBottom: 15,
                  textTransform: "uppercase",
                }}
              >
                {card.category} / PERFIL DE PRODUCTO
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                fontFamily: "Geist",
                fontSize: card.kind === "directory" ? 86 : 108,
                fontWeight: 400,
                letterSpacing: "-0.055em",
                lineHeight: 0.88,
              }}
            >
              {card.title}
            </div>
            <div
              style={{
                color: "rgba(243,240,234,0.72)",
                display: "flex",
                fontSize: 25,
                letterSpacing: "-0.025em",
                lineHeight: 1.28,
                marginTop: 26,
                maxWidth: 700,
              }}
            >
              {card.description}
            </div>
          </div>

          {card.kind === "directory" ? (
            <div
              style={{
                alignItems: "stretch",
                border: "1px solid rgba(243,240,234,0.22)",
                display: "flex",
                flexDirection: "column",
                marginLeft: 42,
                width: 270,
              }}
            >
              <div
                style={{
                  alignItems: "baseline",
                  borderBottom: "1px solid rgba(243,240,234,0.22)",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "20px 22px",
                }}
              >
                <span style={{ color: "#00d7ca", display: "flex", fontSize: 48 }}>
                  {card.confirmedCount}
                </span>
                <span style={{ display: "flex", fontSize: 16, letterSpacing: "0.09em" }}>
                  ATRIBUIBLES
                </span>
              </div>
              <div
                style={{
                  alignItems: "baseline",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "20px 22px",
                }}
              >
                <span style={{ color: "#b8aaa0", display: "flex", fontSize: 48 }}>
                  {card.observedCount}
                </span>
                <span style={{ display: "flex", fontSize: 16, letterSpacing: "0.09em" }}>
                  OBSERVADOS
                </span>
              </div>
            </div>
          ) : (
            <div
              style={{
                alignItems: "center",
                border: `1px solid ${accent}`,
                borderRadius: 999,
                color: accent,
                display: "flex",
                fontSize: 18,
                height: 96,
                justifyContent: "center",
                letterSpacing: "0.12em",
                marginLeft: 42,
                width: 96,
              }}
            >
              {card.key.toUpperCase().slice(0, 2)}
            </div>
          )}
        </div>

        <div
          style={{
            alignItems: "center",
            borderTop: "1px solid rgba(243,240,234,0.22)",
            display: "flex",
            fontSize: 16,
            justifyContent: "space-between",
            letterSpacing: "0.12em",
            paddingTop: 23,
            position: "relative",
          }}
        >
          <div style={{ color: accent, display: "flex" }}>{card.attribution.toUpperCase()}</div>
          <div
            style={{
              color: "rgba(243,240,234,0.58)",
              display: "flex",
            }}
          >
            {card.status.toUpperCase()} · VERIFICADO {card.version}
          </div>
        </div>
      </div>
    ),
    {
      ...imageSize,
      fonts: [
        {
          name: "Geist",
          data: bodyFontData,
          style: "normal",
          weight: 400,
        },
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
