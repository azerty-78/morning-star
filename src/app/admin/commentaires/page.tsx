import { Badge, Container, PageHeader, Typography } from "@/components/ui";
import { MOCK_DATA_BANNER } from "@/constants/app";
import { createAdminService } from "@/services/admin";

export const metadata = {
  title: "Commentaires",
};

export default async function AdminCommentairesPage() {
  const comments = await createAdminService().listComments();

  return (
    <Container className="pb-[var(--ms-space-10)]">
      <PageHeader
        omitTitle
        eyebrow="Administration"
        title="Commentaires"
        description="Modération légère — file d’attente pour l’auteur."
      />
      <div className="mb-8">
        <Badge tone="accent">{MOCK_DATA_BANNER}</Badge>
      </div>

      <p className="mb-6 border-b border-ms-black pb-4 font-sans text-sm text-ms-gray-700">
        {comments.length} commentaire{comments.length > 1 ? "s" : ""} en
        attente.
      </p>

      <ul>
        {comments.map((c) => (
          <li
            key={c.id}
            className="grid gap-3 border-b border-ms-border py-6 md:grid-cols-12"
          >
            <div className="md:col-span-3">
              <Typography variant="nav" className="text-ms-fg">
                {c.authorName}
              </Typography>
              <Typography variant="meta" className="mt-1">
                {new Intl.DateTimeFormat("fr-FR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(c.createdAt))}
              </Typography>
              <Typography variant="label" className="mt-3 text-ms-gold-dark">
                {c.status}
              </Typography>
            </div>
            <div className="md:col-span-9">
              <Typography variant="body">{c.excerpt}</Typography>
              <Typography variant="meta" className="mt-2">
                Méditation : {c.meditationTitle}
              </Typography>
              <div className="mt-4 flex gap-6">
                <button
                  type="button"
                  disabled
                  className="text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wider)] text-ms-muted"
                >
                  Approuver
                </button>
                <button
                  type="button"
                  disabled
                  className="text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wider)] text-ms-muted"
                >
                  Rejeter
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
