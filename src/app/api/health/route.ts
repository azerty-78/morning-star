import { NextResponse } from "next/server";
import { APP_NAME } from "@/constants/app";
import { isMockDataSource } from "@/lib/mock";

/**
 * Health check — confirme que l'API App Router fonctionne
 * sans dépendre de PostgreSQL.
 */
export async function GET() {
  const source = isMockDataSource(process.env.DATA_SOURCE) ? "mock" : "prisma";

  return NextResponse.json({
    ok: true,
    app: APP_NAME,
    dataSource: source,
    timestamp: new Date().toISOString(),
  });
}
