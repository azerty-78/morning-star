import { cn } from "@/lib/utils";

export interface SeparatorProps {
  className?: string;
  decorative?: boolean;
}

export function Separator({
  className,
  decorative = true,
}: SeparatorProps) {
  return (
    <hr
      aria-hidden={decorative || undefined}
      className={cn("border-0 border-t border-ms-border m-0", className)}
    />
  );
}
