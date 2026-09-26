import Link from "next/link";
import { Typography } from "@/components/ui";
import { StatusBadge } from "@/components/admin/status-badge";
import type { DailyMeditation } from "@/domain/meditation";
import { PUBLIC_ROUTES } from "@/constants/routes";

export function MeditationAdminTable({
  items,
}: {
  items: DailyMeditation[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-ms-black">
            <th className="py-3 pr-4 text-[length:var(--ms-text-2xs)] font-medium uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted">
              Date
            </th>
            <th className="py-3 pr-4 text-[length:var(--ms-text-2xs)] font-medium uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted">
              Titre
            </th>
            <th className="py-3 pr-4 text-[length:var(--ms-text-2xs)] font-medium uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted">
              Statut
            </th>
            <th className="py-3 text-[length:var(--ms-text-2xs)] font-medium uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((m) => (
            <tr key={m.id} className="border-b border-ms-border align-baseline">
              <td className="py-3 pr-4">
                <Typography variant="date" dateTime={m.publicationDate}>
                  {m.publicationDate}
                </Typography>
              </td>
              <td className="py-3 pr-4">
                <p className="font-sans text-sm font-medium text-ms-fg">
                  {m.title}
                </p>
                <Typography variant="meta" className="mt-0.5 line-clamp-1">
                  {m.excerpt}
                </Typography>
              </td>
              <td className="py-3 pr-4">
                <StatusBadge status={m.status} />
              </td>
              <td className="py-3">
                {m.status === "PUBLISHED" ? (
                  <Link
                    href={`${PUBLIC_ROUTES.meditations}/${m.slug}`}
                    className="text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wider)] text-ms-fg no-underline hover:underline"
                  >
                    Lire
                  </Link>
                ) : (
                  <span className="text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wider)] text-ms-muted">
                    Éditer
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
