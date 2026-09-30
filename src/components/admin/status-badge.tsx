import type { MeditationStatus } from "@/domain/meditation";
import { cn } from "@/lib/utils";

function label(status: MeditationStatus): string {
  if (status === "PUBLISHED") return "Publié";
  if (status === "SCHEDULED") return "Programmé";
  if (status === "ARCHIVED") return "Archivé";
  return "Brouillon";
}

export function StatusBadge({
  status,
  className,
}: {
  status: MeditationStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        status === "PUBLISHED" && "bg-ms-black text-ms-off-white",
        status === "SCHEDULED" && "bg-ms-gold text-ms-black",
        status !== "PUBLISHED" &&
          status !== "SCHEDULED" &&
          "bg-ms-gray-100 text-ms-gray-700",
        className,
      )}
    >
      {label(status)}
    </span>
  );
}
