import { cn } from "@/lib/utils";

type TypographyVariant =
  | "display"
  | "title"
  | "subtitle"
  | "nav"
  | "body"
  | "date"
  | "quote"
  | "reference"
  | "meta";

export interface TypographyProps {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "blockquote" | "cite" | "time";
  variant: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  dateTime?: string;
}

const variantClass: Record<TypographyVariant, string> = {
  display:
    "font-sans text-[length:var(--ms-text-display)] font-semibold leading-[var(--ms-leading-tight)] tracking-[var(--ms-tracking-tight)]",
  title:
    "font-sans text-3xl md:text-4xl font-semibold leading-[var(--ms-leading-tight)] tracking-[var(--ms-tracking-tight)]",
  subtitle:
    "font-sans text-lg md:text-xl font-normal text-ms-gray-700 leading-[var(--ms-leading-snug)]",
  nav: "font-sans text-xs uppercase tracking-[var(--ms-tracking-wide)] font-medium",
  body: "font-sans text-base leading-[var(--ms-leading-normal)] text-ms-fg",
  date: "font-sans text-xs uppercase tracking-[var(--ms-tracking-wide)] text-ms-muted",
  quote:
    "font-serif text-xl md:text-2xl italic leading-[var(--ms-leading-snug)] text-ms-gray-700",
  reference:
    "font-serif text-sm text-ms-accent-muted tracking-wide",
  meta: "font-sans text-sm text-ms-muted",
};

export function Typography({
  as,
  variant,
  children,
  className,
  dateTime,
}: TypographyProps) {
  const Tag =
    as ??
    (variant === "display" || variant === "title"
      ? "h1"
      : variant === "subtitle"
        ? "h2"
        : variant === "quote"
          ? "blockquote"
          : variant === "date"
            ? "time"
            : "p");

  return (
    <Tag className={cn(variantClass[variant], className)} dateTime={dateTime}>
      {children}
    </Tag>
  );
}
