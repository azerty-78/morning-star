import { MeditationAdminTable } from "@/components/admin/meditation-admin-table";
import { Container } from "@/components/ui";
import { createAdminService } from "@/services/admin";

export const metadata = {
  title: "Méditations",
};

export default async function AdminMeditationsPage() {
  const items = await createAdminService().listMeditations();

  return (
    <Container className="py-4 pb-[var(--ms-space-10)]">
      <MeditationAdminTable items={items} />
    </Container>
  );
}
