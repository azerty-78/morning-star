import { ButtonLink } from "@/components/ui";
import { PUBLIC_ROUTES } from "@/constants/routes";
import type { DailyMeditation } from "@/domain/meditation";
import { formatPublicationDate } from "@/lib/utils";

export interface ReaderNavProps {
  previous: DailyMeditation | null;
  next: DailyMeditation | null;
}

function NavCard({
  label,
  meditation,
  align = "start",
}: {
  label: string;
  meditation: DailyMeditation | null;
  align?: "start" | "end";
}) {
  const end = align === "end";

  return (
    <div
      className={`rounded-[22px] bg-white p-5 shadow-[0_1px_2px_rgba(26,26,26,0.05)] ${end ? "md:text-right" : ""}`}
    >
      <p className="text-[13px] font-medium text-ms-gold-dark">{label}</p>
      {meditation ? (
        <>
          <p className="mt-2 text-[13px] text-ms-gray-600">
            {formatPublicationDate(meditation.publicationDate)}
          </p>
          <p className="mt-1 text-[17px] font-semibold leading-snug text-ms-black">
            {meditation.title}
          </p>
          <div className={`mt-4 ${end ? "md:flex md:justify-end" : ""}`}>
            <ButtonLink
              href={`${PUBLIC_ROUTES.meditations}/${meditation.slug}`}
              variant={end ? "primary" : "secondary"}
              size="sm"
            >
              Lire
            </ButtonLink>
          </div>
        </>
      ) : (
        <p className="mt-2 text-[15px] text-ms-gray-600">
          Pas de méditation {end ? "suivante" : "précédente"}.
        </p>
      )}
    </div>
  );
}

export function ReaderNav({ previous, next }: ReaderNavProps) {
  return (
    <nav
      aria-label="Méditations adjacentes"
      className="grid gap-3 md:grid-cols-2"
    >
      <NavCard label="Précédente" meditation={previous} />
      <NavCard label="Suivante" meditation={next} align="end" />
    </nav>
  );
}
