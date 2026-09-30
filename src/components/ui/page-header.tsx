import { cn } from "@/lib/utils";

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
    <header className={cn("ios-ui pb-2 pt-6", className)}>
      {eyebrow ? (
        <p className="text-[13px] font-medium text-ms-gold-dark">{eyebrow}</p>
      ) : null}
      {omitTitle ? null : (
        <h1 className="mt-1 text-[clamp(1.75rem,5vw,2rem)] font-semibold leading-tight tracking-tight text-ms-black">
          {title}
        </h1>
      )}
      {description ? (
        <p className="mt-2 max-w-xl text-[17px] leading-snug text-ms-gray-700">
          {description}
        </p>
      ) : null}
    </header>
  );
}
