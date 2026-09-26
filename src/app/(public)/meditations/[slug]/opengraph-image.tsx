import { ImageResponse } from "next/og";
import { createMeditationService } from "@/services/meditation";

export const alt = "Méditation Morning Star";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * OG dynamique par méditation — même grammaire visuelle que le site.
 */
export default async function MeditationOpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const meditation = await createMeditationService().getBySlug(slug);
  const title = meditation?.title ?? "Méditation";
  const date = meditation?.publicationDate ?? "";
  const subtitle = meditation?.subtitle ?? meditation?.excerpt ?? "";

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
          padding: "56px 64px",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "2px solid #0a0a0a",
            paddingBottom: "20px",
            fontSize: 18,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#7d6523",
          }}
        >
          <span>Morning Star</span>
          <span style={{ color: "#6f6d67" }}>{date}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: title.length > 48 ? 48 : 64,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: 24,
                color: "#3a3834",
                lineHeight: 1.35,
                maxWidth: 900,
              }}
            >
              {subtitle.length > 140 ? `${subtitle.slice(0, 137)}…` : subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 16,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#6f6d67",
          }}
        >
          Méditation chrétienne
        </div>
      </div>
    ),
    { ...size },
  );
}
