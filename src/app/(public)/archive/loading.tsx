import { ArchiveLoading } from "@/components/archive";
import { Container, PageHeader } from "@/components/ui";

export default function ArchiveLoadingPage() {
  return (
    <Container className="pb-[var(--ms-space-10)]">
      <PageHeader
        eyebrow="Chronologie"
        title="Archive"
        description="Chargement…"
      />
      <div className="mt-10">
        <ArchiveLoading />
      </div>
    </Container>
  );
}
