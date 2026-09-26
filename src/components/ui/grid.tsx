import { cn } from "@/lib/utils";

export interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 12;
  className?: string;
}

const colsClass: Record<NonNullable<GridProps["cols"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  12: "grid-cols-12",
};

export function Grid({ children, cols = 12, className }: GridProps) {
  return (
    <div
      className={cn(
        "grid gap-[var(--ms-grid-gap)]",
        colsClass[cols],
        className,
      )}
    >
      {children}
    </div>
  );
}
