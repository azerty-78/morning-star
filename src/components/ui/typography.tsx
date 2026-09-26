import { cn } from "@/lib/utils";

type TypographyVariant =
  | "display"
  | "title"
  | "subtitle"
  | "nav"
  | "body"
  | "lede"
  | "date"
  | "quote"
  | "reference"
  | "meta"
  | "label";

export interface TypographyProps {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "blockquote" | "cite" | "time";
  variant: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  dateTime?: string;
  id?: string;
}

const variantClass: Record<TypographyVariant, string> = {
  display:
    "font-sans font-bold text-[length:var(--ms-text-display)] leading-[var(--ms-leading-tight)] tracking-[var(--ms-tracking-tighter)] text-ms-fg",
  title:
    "font-sans font-semibold text-[length:var(--ms-text-3xl)] md:text-[length:var(--ms-text-3xl)] leading-[var(--ms-leading-tight)] tracking-[var(--ms-tracking-tight)] text-ms-fg",
  subtitle:
    "font-sans font-normal text-[length:var(--ms-text-lg)] md:text-[length:var(--ms-text-xl)] leading-[var(--ms-leading-snug)] tracking-[var(--ms-tracking-tight)] text-ms-gray-700",
  nav: "font-sans font-medium text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wider)] text-ms-fg",
  body: "font-sans font-normal text-[length:var(--ms-text-base)] leading-[var(--ms-leading-normal)] text-ms-fg",
  lede: "font-sans font-normal text-[length:var(--ms-text-lg)] leading-[var(--ms-leading-snug)] text-ms-gray-700",
  date: "font-sans font-medium text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wider)] text-ms-muted",
  quote:
    "font-serif font-normal italic text-[length:var(--ms-text-xl)] md:text-[length:var(--ms-text-2xl)] leading-[var(--ms-leading-snug)] text-ms-gray-700",
  reference:
    "font-serif font-normal text-[length:var(--ms-text-sm)] tracking-[var(--ms-tracking-wide)] text-ms-gold-dark",
  meta: "font-sans font-normal text-[length:var(--ms-text-sm)] leading-[var(--ms-leading-snug)] text-ms-muted",
  label:
    "font-sans font-medium text-[length:var(--ms-text-2xs)] uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted",
};

export function Typography({
  as,
  variant,
  children,
  className,
  dateTime,
  id,
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

  const classNames = cn(variantClass[variant], className);

  if (Tag === "time") {
    return (
      <time id={id} className={classNames} dateTime={dateTime}>
        {children}
      </time>
    );
  }

  return (
    <Tag id={id} className={classNames}>
      {children}
    </Tag>
  );
}
