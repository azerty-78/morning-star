import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/seo";
import { createMeditationService } from "@/services/meditation";

export const alt = "Méditation Morning Star";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Carte de partage d'une méditation — logo + titre.
 */
export default async function MeditationOpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const [meditation, logo] = await Promise.all([
    createMeditationService().getBySlug(slug),
    loadLogoDataUrl(),
  ]);
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
          alignItems: "center",
          backgroundColor: "#f7f4ee",
          color: "#0a0a0a",
          padding: "48px 64px",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={280} height={280} alt="" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: 48,
            maxWidth: 720,
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#7d6523",
            }}
          >
            {date || "Morning Star"}
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: title.length > 42 ? 44 : 56,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                marginTop: 18,
                fontSize: 22,
                lineHeight: 1.35,
                color: "#3a3834",
              }}
            >
              {subtitle.length > 120 ? `${subtitle.slice(0, 117)}…` : subtitle}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size },
  );
}
