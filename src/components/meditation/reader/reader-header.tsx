import { Badge, Separator, Typography } from "@/components/ui";
import {
  formatDayNumber,
  formatMonthYear,
  formatPublicationDate,
  formatWeekday,
} from "@/lib/utils";
import { MOCK_DATA_BANNER } from "@/constants/app";

export interface ReaderHeaderProps {
  title: string;
  subtitle?: string;
  date: string;
  authorName: string;
  showMockBadge?: boolean;
}

/**
 * En-tête lecteur — bannière typographique (pas d'image décorative).
 */
export function ReaderHeader({
  title,
  subtitle,
  date,
  authorName,
  showMockBadge = true,
}: ReaderHeaderProps) {
  return (
    <header>
      <div className="border-b border-ms-black pb-4">
        <div className="flex items-center justify-between gap-4">
          <Typography variant="label" className="text-ms-gold-dark">
            Méditation
          </Typography>
          <Separator tone="accent" className="w-16" />
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-3">
          <time
            dateTime={date}
            className="block"
            aria-label={formatPublicationDate(date)}
          >
            <span className="ms-label block text-ms-muted">
              {formatWeekday(date)}
            </span>
            <span
              className="mt-2 block font-sans font-bold leading-none tracking-[var(--ms-tracking-tighter)] text-ms-fg"
              style={{ fontSize: "clamp(2.75rem, 8vw, 4rem)" }}
            >
              {formatDayNumber(date)}
            </span>
            <span className="mt-2 block text-[length:var(--ms-text-sm)] uppercase tracking-[var(--ms-tracking-wider)] text-ms-gray-700">
              {formatMonthYear(date)}
            </span>
          </time>

          <Typography variant="meta" className="mt-6">
            <span className="ms-label block mb-1 text-ms-muted">Auteur</span>
            {authorName}
          </Typography>

          {showMockBadge ? (
            <div className="mt-4">
              <Badge tone="accent">{MOCK_DATA_BANNER}</Badge>
            </div>
          ) : null}
        </div>

        <div className="md:col-span-8 md:col-start-5">
          <Typography variant="display" className="max-w-[16ch]">
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant="subtitle"
              className="mt-5 max-w-[var(--ms-measure)]"
            >
              {subtitle}
            </Typography>
          ) : null}
        </div>
      </div>
    </header>
  );
}
