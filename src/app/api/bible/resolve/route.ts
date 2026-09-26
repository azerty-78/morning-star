import { NextResponse } from "next/server";
import { createBibleService } from "@/services/bible";

/**
 * Résolution interne d'une référence biblique.
 * GET /api/bible/resolve?q=Jean+3:16&translation=LSG1910
 * Ne renvoie jamais d'URL externe.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const translation = searchParams.get("translation") ?? undefined;

  if (!q) {
    return NextResponse.json(
      { error: "Paramètre q requis (ex. Jean 3:16)." },
      { status: 400 },
    );
  }

  const service = createBibleService();
  const result = await service.resolve(q, translation);

  return NextResponse.json({
    data: {
      status: result.status,
      message: result.message,
      reference: result.reference,
      translation: result.translation
        ? {
            code: result.translation.code,
            name: result.translation.name,
            licenseNotice: result.translation.licenseNotice,
            licenseVerified: result.translation.licenseVerified,
          }
        : null,
      passage: result.passage
        ? {
            verses: result.passage.verses,
            translation: {
              code: result.passage.translation.code,
              name: result.passage.translation.name,
            },
          }
        : null,
    },
  });
}
