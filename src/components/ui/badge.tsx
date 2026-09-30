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
        "inline-flex items-center rounded-full px-2.5 py-1",
        "text-[11px] font-semibold tracking-normal",
        tone === "accent" && "bg-ms-gold text-ms-black",
        tone === "neutral" && "bg-ms-cream-deep text-ms-gray-700",
        tone === "inverted" && "bg-ms-black text-ms-off-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
