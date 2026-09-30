import { notFound } from "next/navigation";
import { AdminBackLink } from "@/components/admin/admin-back-link";
import { ImportPreviewPanel } from "@/components/editor";
import { Container } from "@/components/ui";
import { ADMIN_ROUTES } from "@/constants/routes";
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
    <Container className="ios-ui space-y-4 py-4 pb-[var(--ms-space-10)]">
      <AdminBackLink fallbackHref={ADMIN_ROUTES.import} label="Import" />
      <div className="rounded-3xl bg-white px-4 py-4 shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        <p className="text-[13px] font-medium text-ms-gold-dark">
          {job.file.filename} · {job.file.format.toUpperCase()}
        </p>
        <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-ms-black">
          {job.preview?.title ?? "Résultat d'analyse"}
        </h2>
        <p className="mt-1 text-[14px] text-ms-gray-600">
          Validation admin obligatoire. Aucune publication automatique.
        </p>
      </div>
      <ImportPreviewPanel job={job} />
    </Container>
  );
}
