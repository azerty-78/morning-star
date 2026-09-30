import { Container } from "@/components/ui";
import { MOCK_DATA_BANNER } from "@/constants/app";
import { getUserRepository } from "@/lib/db";

export const metadata = {
  title: "Paramètres",
};

export default async function AdminParametresPage() {
  const admin = await getUserRepository().findAdmin();
  const publication = [
    { label: "Nom du site", value: "Morning Star" },
    { label: "Accroche", value: "Méditation chrétienne quotidienne" },
    { label: "Traduction par défaut", value: "LSG1910" },
  ];

  return (
    <Container className="ios-ui space-y-4 py-4 pb-[var(--ms-space-10)]">
      <p className="text-[13px] text-ms-gray-600">{MOCK_DATA_BANNER}</p>

      <section className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        <h2 className="px-4 py-3 text-[15px] font-semibold text-ms-black">Publication</h2>
        <dl className="border-t border-ms-gold/15">
          {publication.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 border-b border-black/5 px-4 py-3 last:border-b-0"
            >
              <dt className="text-[15px] text-ms-gray-600">{row.label}</dt>
              <dd className="text-right text-[16px] font-medium text-ms-black">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        <h2 className="px-4 py-3 text-[15px] font-semibold text-ms-black">Compte auteur</h2>
        <dl className="border-t border-ms-gold/15">
          <div className="flex items-center justify-between gap-4 border-b border-black/5 px-4 py-3">
            <dt className="text-[15px] text-ms-gray-600">Nom</dt>
            <dd className="text-[16px] font-medium text-ms-black">{admin?.name ?? "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-[15px] text-ms-gray-600">Email</dt>
            <dd className="text-[16px] font-medium text-ms-black">{admin?.email ?? "—"}</dd>
          </div>
        </dl>
      </section>

      <p className="px-1 text-[13px] leading-snug text-ms-gray-600">
        L’enregistrement et l’authentification seront branchés plus tard. Ces valeurs sont en lecture seule.
      </p>
    </Container>
  );
}
