import { notFound } from "next/navigation";
import { ImportPreviewPanel } from "@/components/editor";
import { Container, PageHeader } from "@/components/ui";
import { createImportService } from "@/services/import";

interface PageProps {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { jobId } = await params;
  const job = createImportService().getJob(jobId);
  return {
    title: job?.preview?.title
      ? `Preview · ${job.preview.title}`
      : "Preview import",
  };
}

export default async function ImportPreviewPage({ params }: PageProps) {
  const { jobId } = await params;
  const job = createImportService().getJob(jobId);
  if (!job) notFound();

  return (
    <Container className="pb-[var(--ms-space-10)]">
      <PageHeader
        omitTitle
        eyebrow="Import · Preview"
        title={job.preview?.title ?? "Résultat d'analyse"}
        description={`${job.file.filename} · ${job.file.format.toUpperCase()} · validation admin obligatoire`}
      />
      <div className="mt-10">
        <ImportPreviewPanel job={job} />
      </div>
    </Container>
  );
}
