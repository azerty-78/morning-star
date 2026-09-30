import { Container } from "@/components/ui";
import { MOCK_DATA_BANNER } from "@/constants/app";
import { createAdminService } from "@/services/admin";

export const metadata = {
  title: "Commentaires",
};

export default async function AdminCommentairesPage() {
  const comments = await createAdminService().listComments();

  return (
    <Container className="ios-ui py-4 pb-[var(--ms-space-10)]">
      <p className="mb-3 text-[13px] text-ms-gray-600">
        {comments.length} en attente · {MOCK_DATA_BANNER}
      </p>
      <ul className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        {comments.length === 0 ? (
          <li className="px-4 py-6 text-[15px] text-ms-gray-600">
            Aucun commentaire en attente.
          </li>
        ) : (
          comments.map((c) => (
            <li key={c.id} className="border-b border-black/5 px-4 py-4 last:border-b-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[16px] font-semibold text-ms-black">{c.authorName}</p>
                  <p className="mt-0.5 text-[13px] text-ms-gray-600">
                    {new Intl.DateTimeFormat("fr-FR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(c.createdAt))}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-ms-gold/20 px-2.5 py-1 text-[11px] font-semibold text-ms-gold-dark">
                  {c.status === "PENDING"
                    ? "En attente"
                    : c.status === "APPROVED"
                      ? "Approuvé"
                      : "Rejeté"}
                </span>
              </div>
              <p className="mt-3 text-[15px] leading-snug text-ms-black">{c.excerpt}</p>
              <p className="mt-1 text-[13px] text-ms-gray-600">{c.meditationTitle}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled
                  className="h-9 cursor-not-allowed rounded-full bg-ms-gold/40 px-4 text-[14px] font-semibold text-ms-black/50"
                >
                  Approuver
                </button>
                <button
                  type="button"
                  disabled
                  className="h-9 cursor-not-allowed rounded-full bg-ms-cream-deep px-4 text-[14px] font-semibold text-ms-gray-600"
                >
                  Rejeter
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </Container>
  );
}
