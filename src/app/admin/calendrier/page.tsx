import { EditorialCalendar } from "@/components/admin";
import { Badge, Container, PageHeader } from "@/components/ui";
import { MOCK_DATA_BANNER } from "@/constants/app";
import { ADMIN_ROUTES } from "@/constants/routes";
import { createAdminService } from "@/services/admin";

export const metadata = {
  title: "Calendrier",
};

function shiftMonth(yearMonth: string, delta: number): string {
  const [y, m] = yearMonth.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function AdminCalendrierPage({
  searchParams,
}: {
  searchParams: Promise<{ mois?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const fallback = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const yearMonth =
    params.mois && /^\d{4}-\d{2}$/.test(params.mois) ? params.mois : fallback;

  const calendar = await createAdminService().getCalendarMonth(yearMonth);
  const prev = shiftMonth(yearMonth, -1);
  const next = shiftMonth(yearMonth, 1);

  return (
    <Container className="pb-[var(--ms-space-10)]">
      <PageHeader
        eyebrow="Administration"
        title="Calendrier"
        description="Planning éditorial — BROUILLON, PROGRAMMÉ, PUBLIÉ."
      />
      <div className="mb-8">
        <Badge tone="accent">{MOCK_DATA_BANNER}</Badge>
      </div>
      <EditorialCalendar
        yearMonth={calendar.yearMonth}
        days={calendar.days}
        legend={calendar.legend}
        prevHref={`${ADMIN_ROUTES.calendrier}?mois=${prev}`}
        nextHref={`${ADMIN_ROUTES.calendrier}?mois=${next}`}
      />
    </Container>
  );
}
