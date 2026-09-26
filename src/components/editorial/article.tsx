import { cn, formatPublicationDate } from "@/lib/utils";
import { Badge, Typography } from "@/components/ui";

export interface ArticleMetaProps {
  date: string;
  badge?: string;
  className?: string;
}

export function ArticleMeta({ date, badge, className }: ArticleMetaProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2",
        className,
      )}
    >
      <Typography variant="date" as="time" dateTime={date}>
        {formatPublicationDate(date)}
      </Typography>
      {badge ? <Badge tone="accent">{badge}</Badge> : null}
    </div>
  );
}

export interface ArticleHeaderProps {
  title: string;
  subtitle?: string;
  date: string;
  badge?: string;
  className?: string;
}

export function ArticleHeader({
  title,
  subtitle,
  date,
  badge,
  className,
}: ArticleHeaderProps) {
  return (
    <header className={cn(className)}>
      <ArticleMeta date={date} badge={badge} className="mb-6" />
      <Typography variant="display" className="max-w-4xl">
        {title}
      </Typography>
      {subtitle ? (
        <Typography
          variant="subtitle"
          className="mt-5 max-w-[var(--ms-measure-wide)]"
        >
          {subtitle}
        </Typography>
      ) : null}
    </header>
  );
}

export interface PullQuoteProps {
  children: React.ReactNode;
  cite?: string;
  className?: string;
}

/** Citation éditoriale — filet doré, serif, asymétrie contrôlée. */
export function PullQuote({ children, cite, className }: PullQuoteProps) {
  return (
    <figure
      className={cn(
        "border-l-[3px] border-ms-gold pl-6 md:pl-8",
        "max-w-[var(--ms-measure-wide)]",
        className,
      )}
    >
      <Typography variant="quote" as="blockquote">
        {children}
      </Typography>
      {cite ? (
        <figcaption className="mt-4">
          <Typography variant="reference" as="cite">
            {cite}
          </Typography>
        </figcaption>
      ) : null}
    </figure>
  );
}

export interface ArticleBodyProps {
  /** Texte brut séparé par doubles sauts de ligne. */
  content: string;
  className?: string;
}

export function ArticleBody({ content, className }: ArticleBodyProps) {
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={cn("ms-prose", className)}>
      {paragraphs.map((paragraph) => (
        <Typography key={paragraph.slice(0, 40)} variant="body">
          {paragraph}
        </Typography>
      ))}
    </div>
  );
}
