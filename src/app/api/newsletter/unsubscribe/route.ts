import { NextResponse } from "next/server";
import { createNewsletterService } from "@/services/newsletter";

/**
 * POST /api/newsletter/unsubscribe
 * Body: { token: string } — one-click List-Unsubscribe.
 * GET avec ?token= également accepté.
 * Réponse : jamais d’adresse email.
 */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let token = "";

  if (contentType.includes("application/json")) {
    try {
      const body = (await request.json()) as { token?: string };
      token = body.token ?? "";
    } catch {
      token = "";
    }
  } else {
    const form = await request.formData().catch(() => null);
    const fromForm = form?.get("token");
    token = typeof fromForm === "string" ? fromForm : "";
    // RFC 8058 one-click
    if (!token) {
      const url = new URL(request.url);
      token = url.searchParams.get("token") ?? "";
    }
  }

  const result = await createNewsletterService().unsubscribe(token);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const result = await createNewsletterService().unsubscribe(token);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
