import { MeditationAdminTable } from "@/components/admin/meditation-admin-table";
import { Container } from "@/components/ui";
import { createAdminService } from "@/services/admin";

export const metadata = {
  title: "Méditations",
};

export default async function AdminMeditationsPage() {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  const items = await createAdminService().listMeditations();

  return (
    <Container className="ios-meditations py-4 pb-[var(--ms-space-10)]">
      <MeditationAdminTable items={items} />
    </Container>
  );
}
