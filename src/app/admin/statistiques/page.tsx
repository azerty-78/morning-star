import { AnalyticsDashboardView } from "@/components/admin";
import { Badge, Container, PageHeader } from "@/components/ui";
import { MOCK_DATA_BANNER } from "@/constants/app";
import { createAnalyticsService } from "@/services/analytics";

export const metadata = {
  title: "Statistiques",
};

export default async function AdminStatistiquesPage() {
  const data = await createAnalyticsService().getDashboard();

  return (
    <Container className="pb-[var(--ms-space-10)]">
      <PageHeader
        eyebrow="Administration"
        title="Statistiques"
        description="Lecture éditoriale des audiences — pages vues et sessions approximatives, sans tableau SaaS coloré."
      />
      <div className="mb-8 flex flex-wrap gap-3">
        <Badge tone="accent">{MOCK_DATA_BANNER}</Badge>
        <Badge tone="neutral">ArticleView · dédoublonnage 30 s</Badge>
      </div>
      <AnalyticsDashboardView data={data} />
    </Container>
  );
}
