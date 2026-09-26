import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  tone?: "neutral" | "accent";
  className?: string;
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-none border px-2 py-0.5",
        "text-[0.7rem] uppercase tracking-[0.14em]",
        tone === "accent"
          ? "border-ms-accent text-ms-accent-muted"
          : "border-ms-border text-ms-gray-700",
        className,
      )}
    >
      {children}
    </span>
  );
}
