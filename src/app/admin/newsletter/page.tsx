import { Badge, Container, PageHeader, Typography } from "@/components/ui";
import { NotifyPublicationButton } from "@/components/admin";
import { MOCK_DATA_BANNER } from "@/constants/app";
import { createMeditationService } from "@/services/meditation";
import { createNewsletterService } from "@/services/newsletter";

export const metadata = {
  title: "Newsletter",
};

function notificationStatusLabel(status: string): string {
  switch (status) {
    case "SENT":
      return "Envoyé";
    case "QUEUED":
      return "En file";
    case "PARTIAL":
      return "Partiel";
    case "FAILED":
      return "Échec";
    default:
      return status;
  }
}

function kindLabel(kind: string): string {
  switch (kind) {
    case "PUBLICATION":
      return "Publication";
    case "CONFIRMATION":
      return "Confirmation";
    default:
      return "Système";
  }
}

function subscriberStatusLabel(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "Actif";
    case "PENDING":
      return "En attente";
    case "UNSUBSCRIBED":
      return "Désabonné";
    default:
      return status;
  }
}

export default async function AdminNewsletterPage() {
  const snap = await createNewsletterService().getAdminSnapshot();
  const today = await createMeditationService().getToday();

  return (
    <Container className="pb-[var(--ms-space-10)]">
      <PageHeader
        omitTitle
        eyebrow="Administration"
        title="Newsletter"
        description="Abonnés, désabonnés et historique des notifications — sans tableau SaaS."
      />
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <Badge tone="accent">{MOCK_DATA_BANNER}</Badge>
        <Badge tone="neutral">EmailProvider · mock</Badge>
      </div>

      <dl className="grid gap-8 border-y border-ms-black py-8 sm:grid-cols-4">
        <div>
          <Typography variant="label" as="dt">
            Abonnés (total)
          </Typography>
          <Typography variant="title" as="dd" className="mt-2 tabular-nums">
            {snap.counts.total.toLocaleString("fr-FR")}
          </Typography>
        </div>
        <div>
          <Typography variant="label" as="dt">
            Actifs
          </Typography>
          <Typography variant="title" as="dd" className="mt-2 tabular-nums">
            {snap.counts.active.toLocaleString("fr-FR")}
          </Typography>
        </div>
        <div>
          <Typography variant="label" as="dt">
            En attente
          </Typography>
          <Typography variant="title" as="dd" className="mt-2 tabular-nums">
            {snap.counts.pending.toLocaleString("fr-FR")}
          </Typography>
        </div>
        <div>
          <Typography variant="label" as="dt">
            Désabonnés
          </Typography>
          <Typography variant="title" as="dd" className="mt-2 tabular-nums">
            {snap.counts.unsubscribed.toLocaleString("fr-FR")}
          </Typography>
        </div>
      </dl>

      {today ? (
        <section className="mt-10 border-b border-ms-border pb-8">
          <Typography variant="nav" className="mb-3">
            Notification de publication
          </Typography>
          <Typography variant="body" className="mb-4 text-ms-gray-700">
            Déclencher un envoi mock pour « {today.title} » aux abonnés actifs
            (EmailService · mock → .data/email/).
          </Typography>
          <NotifyPublicationButton meditationId={today.id} />
        </section>
      ) : null}

      <section className="mt-10">
        <Typography variant="nav" className="mb-4 border-b border-ms-black pb-2">
          Historique des notifications
        </Typography>
        {snap.notifications.length === 0 ? (
          <Typography variant="meta">Aucun envoi pour le moment.</Typography>
        ) : (
          <ul>
            {snap.notifications.map((n) => (
              <li
                key={n.id}
                className="grid gap-2 border-b border-ms-border py-4 md:grid-cols-12 md:items-baseline"
              >
                <div className="md:col-span-2">
                  <Typography
                    variant="date"
                    dateTime={n.createdAt.toISOString()}
                  >
                    {n.createdAt.toISOString().slice(0, 10)}
                  </Typography>
                  <Typography variant="label" className="mt-1">
                    {kindLabel(n.kind)}
                  </Typography>
                </div>
                <div className="md:col-span-6">
                  <p className="text-sm font-medium text-ms-fg">{n.subject}</p>
                  {n.meditationTitle ? (
                    <Typography variant="meta" className="mt-1">
                      {n.meditationTitle}
                    </Typography>
                  ) : null}
                </div>
                <div className="md:col-span-2">
                  <Badge tone={n.status === "SENT" ? "inverted" : "neutral"}>
                    {notificationStatusLabel(n.status)}
                  </Badge>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <Typography variant="meta" className="tabular-nums">
                    {n.sentCount}/{n.recipientCount} envoyés
                    {n.failedCount > 0 ? ` · ${n.failedCount} échec` : ""}
                  </Typography>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <Typography variant="nav" className="mb-4 border-b border-ms-black pb-2">
          Inscriptions récentes
        </Typography>
        <Typography variant="meta" className="mb-4">
          Adresses masquées — jamais exposées côté public.
        </Typography>
        <ul>
          {snap.recentSubscribers.map((s) => (
            <li
              key={s.id}
              className="grid grid-cols-[1fr_auto] gap-3 border-b border-ms-border py-3"
            >
              <div>
                <p className="font-mono text-sm text-ms-fg">{s.emailMasked}</p>
                <Typography variant="meta">
                  {s.subscribedAt.slice(0, 10)}
                </Typography>
              </div>
              <Badge tone="neutral">{subscriberStatusLabel(s.status)}</Badge>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
