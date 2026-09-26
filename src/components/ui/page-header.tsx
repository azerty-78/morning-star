import { cn } from "@/lib/utils";
import { Typography } from "./typography";

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "border-b border-ms-border pb-8 pt-10 md:pb-10 md:pt-14",
        className,
      )}
    >
      {eyebrow ? (
        <Typography variant="nav" className="mb-4 text-ms-accent-muted">
          {eyebrow}
        </Typography>
      ) : null}
      <Typography variant="title">{title}</Typography>
      {description ? (
        <Typography variant="subtitle" className="mt-4 max-w-2xl">
          {description}
        </Typography>
      ) : null}
    </header>
  );
}
