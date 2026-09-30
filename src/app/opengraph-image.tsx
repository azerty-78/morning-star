import { ImageResponse } from "next/og";
import { loadLogoDataUrl, SITE } from "@/lib/seo";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Carte de partage par défaut — logo officiel sur fond clair.
 */
export default async function OpenGraphImage() {
  const logo = await loadLogoDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f7f4ee",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={560} height={560} alt="" />
      </div>
    ),
    { ...size },
  );
}
