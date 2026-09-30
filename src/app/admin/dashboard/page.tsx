import { AdminDashboardView } from "@/components/admin/admin-dashboard";
import { Container } from "@/components/ui";
import { createAdminService } from "@/services/admin";

export const metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const snapshot = await createAdminService().getDashboard();

  return (
    <Container className="py-4 pb-[var(--ms-space-10)]">
      <AdminDashboardView snapshot={snapshot} />
    </Container>
  );
}
