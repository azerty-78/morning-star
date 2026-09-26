import { DocumentDropzone } from "@/components/editor";
import { Container, PageHeader, Typography } from "@/components/ui";
import { ADMIN_ROUTES } from "@/constants/routes";
import Link from "next/link";

export const metadata = {
  title: "Import",
};

export default function AdminImportPage() {
  return (
    <Container className="pb-[var(--ms-space-10)]">
      <PageHeader
        eyebrow="Administration"
        title="Import"
        description="Déposez un PDF, DOC ou DOCX. Le pipeline produit une preview — jamais de publication automatique."
      />

      <div className="mt-10">
        <DocumentDropzone />
      </div>

      <Typography variant="meta" className="mt-8">
        Pipeline : Upload → Validation → Extraction → Normalisation → Analyse →
        Structuration → Références bibliques → Nettoyage Blogspot → Preview →
        Validation admin → Publication / Programmation.
      </Typography>

      <p className="mt-6">
        <Link
          href={ADMIN_ROUTES.dashboard}
          className="text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wider)]"
        >
          Retour dashboard
        </Link>
      </p>
    </Container>
  );
}
