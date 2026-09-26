import { NextResponse } from "next/server";
import { createImportService } from "@/services/import";

interface RouteProps {
  params: Promise<{ jobId: string }>;
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { jobId } = await params;
  const job = createImportService().getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job introuvable." }, { status: 404 });
  }
  return NextResponse.json({ data: job });
}

/**
 * Actions admin : approve | reject | publish | schedule
 * publish / schedule refusés sans approve préalable.
 */
export async function POST(request: Request, { params }: RouteProps) {
  const { jobId } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    action?: string;
    reason?: string;
    scheduledAt?: string;
    preview?: unknown;
  };

  const service = createImportService();
  const action = body.action;

  if (action === "approve") {
    const job = service.approve(jobId);
    if (!job) {
      return NextResponse.json(
        { error: "Impossible d'approuver ce job." },
        { status: 400 },
      );
    }
    return NextResponse.json({ data: job });
  }

  if (action === "reject") {
    const job = service.reject(jobId, body.reason);
    if (!job) {
      return NextResponse.json({ error: "Job introuvable." }, { status: 404 });
    }
    return NextResponse.json({ data: job });
  }

  if (action === "publish") {
    const job = service.publish(jobId);
    if (!job) {
      return NextResponse.json(
        {
          error:
            "Publication refusée. Approuvez d'abord la preview (aucune publication auto).",
        },
        { status: 400 },
      );
    }
    return NextResponse.json({ data: job });
  }

  if (action === "schedule") {
    if (!body.scheduledAt) {
      return NextResponse.json(
        { error: "scheduledAt requis (ISO)." },
        { status: 400 },
      );
    }
    const job = service.schedule(jobId, body.scheduledAt);
    if (!job) {
      return NextResponse.json(
        { error: "Programmation refusée. Approuvez d'abord la preview." },
        { status: 400 },
      );
    }
    return NextResponse.json({ data: job });
  }

  return NextResponse.json({ error: "Action inconnue." }, { status: 400 });
}
