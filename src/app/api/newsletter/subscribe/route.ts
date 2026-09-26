import { NextResponse } from "next/server";
import { createNewsletterService } from "@/services/newsletter";

/**
 * POST /api/newsletter/subscribe
 * Body: { email: string, source?: string }
 * Réponse : jamais d’adresse email.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "INVALID_EMAIL",
        message: "Requête invalide.",
      },
      { status: 400 },
    );
  }

  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof (body as { email: unknown }).email === "string"
      ? (body as { email: string }).email
      : "";

  const source =
    typeof body === "object" &&
    body !== null &&
    "source" in body &&
    typeof (body as { source: unknown }).source === "string"
      ? (body as { source: string }).source
      : "homepage";

  const result = await createNewsletterService().subscribe(email, source);

  return NextResponse.json(result, {
    status: result.ok ? 200 : 400,
  });
}
