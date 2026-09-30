import { NotifyPublicationButton } from "@/components/admin";
import { Container } from "@/components/ui";
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
  const metrics = [
    { label: "Total", value: snap.counts.total },
    { label: "Actifs", value: snap.counts.active },
    { label: "En attente", value: snap.counts.pending },
    { label: "Désabonnés", value: snap.counts.unsubscribed },
  ];

  return (
    <Container className="ios-ui space-y-4 py-4 pb-[var(--ms-space-10)]">
      <p className="text-[13px] text-ms-gray-600">{MOCK_DATA_BANNER}</p>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(26,26,26,0.05)]"
          >
            <p className="text-[26px] font-semibold leading-none tabular-nums text-ms-black">
              {metric.value.toLocaleString("fr-FR")}
            </p>
            <p className="mt-2 text-[13px] font-medium text-ms-gray-600">{metric.label}</p>
          </div>
        ))}
      </section>

      {today ? (
        <section className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
          <h2 className="text-[15px] font-semibold text-ms-black">Notification de publication</h2>
          <p className="mt-1 text-[14px] text-ms-gray-600">
            Envoyer « {today.title} » aux abonnés actifs. L’envoi reste simulé.
          </p>
          <div className="mt-3">
            <NotifyPublicationButton meditationId={today.id} />
          </div>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        <h2 className="px-4 py-3 text-[15px] font-semibold text-ms-black">
          Historique des notifications
        </h2>
        <ul className="border-t border-ms-gold/15">
          {snap.notifications.length === 0 ? (
            <li className="px-4 py-5 text-[15px] text-ms-gray-600">Aucun envoi pour le moment.</li>
          ) : (
            snap.notifications.map((n) => (
              <li key={n.id} className="border-b border-black/5 px-4 py-3 last:border-b-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[16px] font-medium text-ms-black">{n.subject}</p>
                    <p className="mt-0.5 text-[13px] text-ms-gray-600">
                      {kindLabel(n.kind)}
                      {n.meditationTitle ? ` · ${n.meditationTitle}` : ""} ·{" "}
                      {n.createdAt.toISOString().slice(0, 10)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-ms-gold/20 px-2.5 py-1 text-[11px] font-semibold text-ms-black">
                    {notificationStatusLabel(n.status)}
                  </span>
                </div>
                <p className="mt-1 text-[13px] tabular-nums text-ms-gray-600">
                  {n.sentCount}/{n.recipientCount} envoyés
                  {n.failedCount > 0 ? ` · ${n.failedCount} échec` : ""}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        <div className="px-4 py-3">
          <h2 className="text-[15px] font-semibold text-ms-black">Inscriptions récentes</h2>
          <p className="mt-0.5 text-[13px] text-ms-gray-600">Adresses masquées.</p>
        </div>
        <ul className="border-t border-ms-gold/15">
          {snap.recentSubscribers.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-3 border-b border-black/5 px-4 py-3 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-[14px] text-ms-black">{s.emailMasked}</p>
                <p className="text-[13px] text-ms-gray-600">{s.subscribedAt.slice(0, 10)}</p>
              </div>
              <span className="shrink-0 rounded-full bg-ms-cream-deep px-2.5 py-1 text-[11px] font-semibold text-ms-gray-700">
                {subscriberStatusLabel(s.status)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
