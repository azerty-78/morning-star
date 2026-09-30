import { AnalyticsDashboardView } from "@/components/admin";
import { Container } from "@/components/ui";
import { MOCK_DATA_BANNER } from "@/constants/app";
import { createAnalyticsService } from "@/services/analytics";

export const metadata = {
  title: "Statistiques",
};

export default async function AdminStatistiquesPage() {
  const data = await createAnalyticsService().getDashboard();

  return (
    <Container className="py-4 pb-[var(--ms-space-10)]">
      <p className="mb-3 text-[13px] text-ms-gray-600">{MOCK_DATA_BANNER}</p>
      <AnalyticsDashboardView data={data} />
    </Container>
  );
}
