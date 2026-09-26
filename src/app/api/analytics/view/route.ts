import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_MAX_AGE,
  SESSION_COOKIE_NAME,
} from "@/lib/analytics";
import { createAnalyticsService } from "@/services/analytics";

/**
 * POST /api/analytics/view
 * Body: { meditationId: string }
 * Cookie ms_aid = session anonyme. Pas de PII stockée.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, recorded: false, reason: "invalid" },
      { status: 400 },
    );
  }

  const meditationId =
    typeof body === "object" &&
    body !== null &&
    "meditationId" in body &&
    typeof (body as { meditationId: unknown }).meditationId === "string"
      ? (body as { meditationId: string }).meditationId.trim()
      : "";

  if (!meditationId) {
    return NextResponse.json(
      { ok: false, recorded: false, reason: "invalid" },
      { status: 400 },
    );
  }

  const analytics = createAnalyticsService();
  const cookieHeader = request.headers.get("cookie") ?? "";
  const existing = readCookie(cookieHeader, SESSION_COOKIE_NAME);
  const sessionKey = analytics.ensureSessionKey(existing);

  const result = await analytics.recordPageView({
    meditationId,
    sessionKey,
    referrer: request.headers.get("referer"),
    userAgent: request.headers.get("user-agent"),
  });

  const response = NextResponse.json({
    ok: true,
    recorded: result.recorded,
    reason: result.reason,
  });

  if (!existing || existing !== sessionKey) {
    response.cookies.set(SESSION_COOKIE_NAME, sessionKey, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

function readCookie(header: string, name: string): string | undefined {
  const parts = header.split(";").map((p) => p.trim());
  for (const part of parts) {
    if (part.startsWith(`${name}=`)) {
      return decodeURIComponent(part.slice(name.length + 1));
    }
  }
  return undefined;
}
