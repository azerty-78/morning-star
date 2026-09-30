import { MeditationAdminTable } from "@/components/admin/meditation-admin-table";
import { Container } from "@/components/ui";
import type { MeditationStatus } from "@/domain/meditation";
import { createAdminService } from "@/services/admin";

export const metadata = {
  title: "Méditations",
};

function isFilter(value: string | undefined): value is MeditationStatus {
  return value === "DRAFT" || value === "SCHEDULED" || value === "PUBLISHED";
}

export default async function AdminMeditationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string }>;
}) {
  const { filtre } = await searchParams;
  const items = await createAdminService().listMeditations();

  return (
    <Container className="ios-meditations py-4 pb-[var(--ms-space-10)]">
      <MeditationAdminTable
        items={items}
        initialFilter={isFilter(filtre) ? filtre : "ALL"}
      />
    </Container>
  );
}
