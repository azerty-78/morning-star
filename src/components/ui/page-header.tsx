import { cn } from "@/lib/utils";
import { Typography } from "./typography";
import { Separator } from "./separator";

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  /** Le titre est déjà porté par la barre admin. */
  omitTitle?: boolean;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  omitTitle = false,
}: PageHeaderProps) {
  return (
    <header className={cn("pt-[var(--ms-space-8)] pb-[var(--ms-space-6)]", className)}>
      {eyebrow ? (
        <Typography variant="label" className="mb-4 text-ms-gold-dark">
          {eyebrow}
        </Typography>
      ) : null}
      {omitTitle ? null : <Typography variant="title">{title}</Typography>}
      {description ? (
        <Typography variant="subtitle" className="mt-4 max-w-[var(--ms-measure)]">
          {description}
        </Typography>
      ) : null}
      <Separator tone="strong" className="mt-[var(--ms-space-6)]" />
    </header>
  );
}
