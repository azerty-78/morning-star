import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Image Open Graph par défaut — typographie Swiss, sans décor superflu.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f3f2ee",
          color: "#0a0a0a",
          padding: "64px",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: "2px solid #0a0a0a",
            paddingBottom: "24px",
            fontSize: 22,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#7d6523",
          }}
        >
          Méditation quotidienne
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {SITE.name}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#3a3834",
              letterSpacing: "-0.01em",
              maxWidth: 800,
            }}
          >
            {SITE.tagline}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 18,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#6f6d67",
          }}
        >
          Publication éditoriale
        </div>
      </div>
    ),
    { ...size },
  );
}
