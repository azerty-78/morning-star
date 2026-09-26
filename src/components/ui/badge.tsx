import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "inverted";
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
        "text-[length:var(--ms-text-2xs)] font-medium uppercase tracking-[var(--ms-tracking-widest)]",
        tone === "accent" && "border-ms-gold text-ms-gold-dark",
        tone === "neutral" && "border-ms-border text-ms-gray-700",
        tone === "inverted" && "border-ms-black bg-ms-black text-ms-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
