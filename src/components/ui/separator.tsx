import { cn } from "@/lib/utils";

export interface SeparatorProps {
  className?: string;
  decorative?: boolean;
  tone?: "default" | "strong" | "accent";
}

export function Separator({
  className,
  decorative = true,
  tone = "default",
}: SeparatorProps) {
  return (
    <hr
      aria-hidden={decorative || undefined}
      className={cn(
        "m-0 border-0 border-t",
        tone === "default" && "border-ms-border",
        tone === "strong" && "border-ms-black border-t-2",
        tone === "accent" && "border-ms-gold border-t-[3px]",
        className,
      )}
    />
  );
}
