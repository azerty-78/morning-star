import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn, formatPublicationDate } from "@/lib/utils";

export interface EditorialCardProps {
  href: string;
  title: string;
  excerpt: string;
  date: string;
  index?: string;
  themes?: string[];
  className?: string;
}

export function EditorialCard({
  href,
  title,
  excerpt,
  date,
  themes,
  className,
}: EditorialCardProps) {
  return (
    <article className={cn("border-b border-black/5 last:border-b-0", className)}>
      <Link
        href={href}
        className="flex items-center gap-3 px-4 py-3.5 no-underline transition-colors hover:bg-ms-gold/10"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] font-medium text-ms-black">
            {title}
          </span>
          <span className="mt-0.5 block truncate text-[13px] text-ms-gray-600">
            {formatPublicationDate(date)}
            {excerpt ? ` · ${excerpt}` : ""}
          </span>
          {themes && themes.length > 0 ? (
            <span className="mt-0.5 block truncate text-[12px] text-ms-gold-dark">
              {themes.join(" · ")}
            </span>
          ) : null}
        </span>
        <ChevronRight size={16} className="shrink-0 text-ms-gray-400" aria-hidden />
      </Link>
    </article>
  );
}

export interface EditorialCardListProps {
  children: React.ReactNode;
  className?: string;
}

export function EditorialCardList({
  children,
  className,
}: EditorialCardListProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[22px] bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
