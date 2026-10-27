import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import {
  getWorkSocialCard,
  isWorkSocialKey,
  socialCardLang,
} from "../social-card";

/*
 * Node y no edge desde el PR N (20-oct-2026): la tarjeta de cada ficha lleva
 * la captura del mockup del hero, y se lee del disco en vez de pedirla por
 * red. `outputFileTracingIncludes` (next.config.ts) mete en la función las
 * fuentes y las capturas.
 */
export const runtime = "nodejs";

const imageSize = { width: 1200, height: 630 } as const;

const root = process.cwd();

// Rethink Sans, la familia única del sitio desde octubre de 2026. Son instancias
// estáticas (400 y 500) sacadas de la variable con fontTools: satori no lee
// woff2 ni resuelve ejes, así que la variable no sirve aquí.
const fontRegular = readFile(path.join(root, "src/app/fonts/RethinkSans-Regular.ttf"));
const fontMedium = readFile(path.join(root, "src/app/fonts/RethinkSans-Medium.ttf"));

/** Ancho con que la captura entra en la tarjeta (la fuente mide 560 px). */
const mockupWidth = 470;

/**
 * La captura del mockup del hero de la ficha, que pinta `scripts/og-mockups.mjs`
 * en `public/brand/og/mockups/<slug>.png`. Se devuelve como data URI con su
 * alto a la escala de la tarjeta; el tamaño sale de la cabecera del PNG.
 */
async function readMockup(slug: string, lang: "es" | "en") {
  // El mockup inglés sale de /en/work/[slug]: `<slug>-en.png`.
  const file = lang === "en" ? `${slug}-en.png` : `${slug}.png`;
  const buffer = await readFile(path.join(root, "public/brand/og/mockups", file));
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return {
    src: `data:image/png;base64,${buffer.toString("base64")}`,
    width: mockupWidth,
    height: Math.round((height * mockupWidth) / width),
  };
}

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

  const searchParams = new URL(request.url).searchParams;
  const lang = socialCardLang(searchParams.get("lang"));
  const card = getWorkSocialCard(key, lang);
  const requestedVersion = searchParams.get("v");
  const [regular, medium, mockup] = await Promise.all([
    fontRegular,
    fontMedium,
    card.kind === "profile" ? readMockup(card.key, lang) : null,
  ]);
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
            alignItems: card.kind === "directory" ? "flex-end" : "center",
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
            paddingBottom: card.kind === "directory" ? 34 : 22,
            paddingTop: card.kind === "directory" ? 0 : 22,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: card.kind === "directory" ? 780 : 540,
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
              {card.kind === "profile"
                ? `${card.category.toUpperCase()} · ${card.labels.ownProduct}`
                : card.labels.ownProducts}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: card.kind === "directory" ? 84 : 92,
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
                fontSize: card.kind === "directory" ? 26 : 23,
                lineHeight: 1.3,
                marginTop: card.kind === "directory" ? 24 : 18,
                maxWidth: 700,
              }}
            >
              {card.description}
            </div>
            {card.kind === "profile" ? (
              <div
                style={{
                  alignItems: "center",
                  alignSelf: "flex-start",
                  border: `1px solid ${accent}`,
                  borderRadius: 999,
                  color: accent,
                  display: "flex",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  marginTop: 26,
                  padding: "11px 18px",
                }}
              >
                <span
                  style={{
                    backgroundColor: accent,
                    borderRadius: 99,
                    display: "flex",
                    height: 8,
                    marginRight: 10,
                    width: 8,
                  }}
                />
                {card.status.toUpperCase()}
              </div>
            ) : null}
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
                {card.labels.publicSources}
              </span>
            </div>
          ) : mockup ? (
            // eslint-disable-next-line @next/next/no-img-element -- satori pinta <img>, no next/image
            <img
              alt=""
              height={mockup.height}
              src={mockup.src}
              style={{ marginLeft: 40 }}
              width={mockup.width}
            />
          ) : null}
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
          <div style={{ display: "flex" }}>{card.footer}</div>
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
