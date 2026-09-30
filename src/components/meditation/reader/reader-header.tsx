import { Badge } from "@/components/ui";
import { formatPublicationDate } from "@/lib/utils";
import { MOCK_DATA_BANNER } from "@/constants/app";

export interface ReaderHeaderProps {
  title: string;
  subtitle?: string;
  date: string;
  authorName: string;
  showMockBadge?: boolean;
}

export function ReaderHeader({
  title,
  subtitle,
  date,
  authorName,
  showMockBadge = true,
}: ReaderHeaderProps) {
  return (
    <header className="rounded-[22px] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(26,26,26,0.05)] sm:px-7">
      <p className="text-[13px] font-medium text-ms-gold-dark">Méditation</p>
      <time
        dateTime={date}
        className="mt-1 block text-[15px] text-ms-gray-600"
      >
        {formatPublicationDate(date)}
      </time>
      <h1
        id="meditation-title"
        className="mt-2 text-[clamp(1.75rem,5vw,2rem)] font-semibold leading-tight tracking-tight text-ms-black"
      >
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 max-w-xl text-[18px] leading-snug text-ms-gray-700">
          {subtitle}
        </p>
      ) : null}
      <p className="mt-3 text-[15px] text-ms-gray-600">{authorName}</p>
      {showMockBadge ? (
        <div className="mt-4">
          <Badge tone="accent">{MOCK_DATA_BANNER}</Badge>
        </div>
      ) : null}
    </header>
  );
}
