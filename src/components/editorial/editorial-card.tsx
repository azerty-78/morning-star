import Link from "next/link";
import { cn, formatPublicationDate } from "@/lib/utils";
import { Typography } from "@/components/ui";

export interface EditorialCardProps {
  href: string;
  title: string;
  excerpt: string;
  date: string;
  index?: string;
  themes?: string[];
  className?: string;
}

/**
 * Entrée de liste éditoriale — pas une « card » SaaS.
 * Règles : filet, grille asymétrique, aucun shadow / radius.
 */
export function EditorialCard({
  href,
  title,
  excerpt,
  date,
  index,
  themes,
  className,
}: EditorialCardProps) {
  return (
    <article
      className={cn(
        "border-t border-ms-border first:border-t-0",
        className,
      )}
    >
      <Link
        href={href}
        className={cn(
          "group grid gap-3 py-7 no-underline md:grid-cols-12 md:gap-6 md:py-8",
          "transition-colors duration-[var(--ms-duration)]",
          "hover:bg-ms-gray-100/50",
        )}
      >
        <div className="md:col-span-3">
          {index ? (
            <Typography variant="label" className="mb-2 text-ms-gold">
              {index}
            </Typography>
          ) : null}
          <Typography variant="date" as="time" dateTime={date}>
            {formatPublicationDate(date)}
          </Typography>
        </div>
        <div className="md:col-span-8 md:col-start-5">
          <Typography
            variant="subtitle"
            as="h2"
            className="text-ms-fg group-hover:text-ms-black"
          >
            {title}
          </Typography>
          <Typography variant="meta" className="mt-3 max-w-[var(--ms-measure)]">
            {excerpt}
          </Typography>
          {themes && themes.length > 0 ? (
            <p className="mt-3 text-[length:var(--ms-text-2xs)] uppercase tracking-[var(--ms-tracking-wider)] text-ms-muted">
              {themes.join(" · ")}
            </p>
          ) : null}
        </div>
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
    <div className={cn("border-y border-ms-black", className)}>{children}</div>
  );
}
