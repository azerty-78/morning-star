import { NextResponse } from "next/server";
import { createMeditationService } from "@/services/meditation";
import { createPublicationService } from "@/services/publication";

/**
 * POST /api/admin/newsletter/notify-publication
 * Déclenche EmailService pour les abonnés actifs.
 * Auth réelle à brancher plus tard.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Requête invalide." },
      { status: 400 },
    );
  }

  const meditationId =
    typeof body === "object" &&
    body !== null &&
    "meditationId" in body &&
    typeof (body as { meditationId: unknown }).meditationId === "string"
      ? (body as { meditationId: string }).meditationId
      : "";

  if (!meditationId) {
    return NextResponse.json(
      { ok: false, message: "meditationId requis." },
      { status: 400 },
    );
  }

  const meditation = await createMeditationService().listAll().then((all) =>
    all.find((m) => m.id === meditationId),
  );

  if (!meditation) {
    return NextResponse.json(
      { ok: false, message: "Méditation introuvable." },
      { status: 404 },
    );
  }

  const result =
    await createPublicationService().notifyMeditationPublished(meditation);

  return NextResponse.json({
    ok: true,
    notificationId: result?.notificationId,
    sent: result?.sent ?? 0,
    failed: result?.failed ?? 0,
  });
}
