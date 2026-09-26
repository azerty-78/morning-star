import { NextResponse } from "next/server";
import { createImportService } from "@/services/import";

/**
 * POST multipart — démarre le pipeline jusqu'à PREVIEW.
 * Pas de publication automatique.
 */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Fichier manquant (champ « file »)." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const service = createImportService();
    const job = await service.ingestFile({
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      bytes: new Uint8Array(buffer),
    });

    if (job.status === "FAILED") {
      return NextResponse.json({ data: job }, { status: 422 });
    }

    return NextResponse.json({ data: job }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Échec de l'import.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  const jobs = createImportService().listJobs();
  return NextResponse.json({ data: jobs });
}
