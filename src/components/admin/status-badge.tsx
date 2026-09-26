import { Badge } from "@/components/ui";
import type { MeditationStatus } from "@/domain/meditation";
import { statusLabel } from "@/services/admin";
import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  className,
}: {
  status: MeditationStatus;
  className?: string;
}) {
  const label = statusLabel(status);
  const tone =
    status === "PUBLISHED"
      ? "inverted"
      : status === "SCHEDULED"
        ? "accent"
        : "neutral";

  return (
    <Badge tone={tone} className={cn(className)}>
      {label}
    </Badge>
  );
}
