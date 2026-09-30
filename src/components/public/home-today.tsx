import { ButtonLink } from "@/components/ui";
import { PUBLIC_ROUTES } from "@/constants/routes";
import type { DailyMeditation } from "@/domain/meditation";
import { formatPublicationDate } from "@/lib/utils";

export interface HomeTodayProps {
  meditation: DailyMeditation;
}

export function HomeToday({ meditation }: HomeTodayProps) {
  const primaryRef = meditation.bibleReferences[0];
  const readHref = `${PUBLIC_ROUTES.meditations}/${meditation.slug}`;

  return (
    <section
      aria-labelledby="meditation-du-jour-title"
      className="overflow-hidden rounded-[22px] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(26,26,26,0.05)] sm:px-7"
    >
      <p className="text-[13px] font-medium text-ms-gold-dark">Méditation du jour</p>
      <time
        dateTime={meditation.publicationDate}
        className="mt-1 block text-[15px] text-ms-gray-600"
      >
        {formatPublicationDate(meditation.publicationDate)}
      </time>
      <h1
        id="meditation-du-jour-title"
        className="mt-2 text-[32px] font-semibold leading-tight tracking-tight text-ms-black"
      >
        {meditation.title}
      </h1>
      {meditation.subtitle ? (
        <p className="mt-2 max-w-xl text-[18px] leading-snug text-ms-gray-700">
          {meditation.subtitle}
        </p>
      ) : null}
      {primaryRef ? (
        <p className="mt-3 text-[15px] text-ms-gold-dark">{primaryRef.label}</p>
      ) : null}
      <p className="mt-4 max-w-xl text-[17px] leading-snug text-ms-gray-700">
        {meditation.excerpt}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <ButtonLink
          href={readHref}
          variant="primary"
          aria-label={`Lire la méditation : ${meditation.title}`}
        >
          Lire la méditation
        </ButtonLink>
        <ButtonLink href={PUBLIC_ROUTES.archive} variant="secondary">
          Archives
        </ButtonLink>
      </div>
    </section>
  );
}
