import { AdminDashboardView } from "@/components/admin";
import { Badge, Container, PageHeader } from "@/components/ui";
import { MOCK_DATA_BANNER } from "@/constants/app";
import { createAdminService } from "@/services/admin";

export const metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const snapshot = await createAdminService().getDashboard();

  return (
    <Container className="pb-[var(--ms-space-10)]">
      <PageHeader
        eyebrow="Administration"
        title="Dashboard"
        description="Vue d’ensemble pour un auteur unique — publication, file d’attente, audience."
      />
      <div className="mb-8">
        <Badge tone="accent">{MOCK_DATA_BANNER}</Badge>
      </div>
      <AdminDashboardView snapshot={snapshot} />
    </Container>
  );
}
