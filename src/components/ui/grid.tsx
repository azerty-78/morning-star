import { cn } from "@/lib/utils";

export interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 12;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const colsClass: Record<NonNullable<GridProps["cols"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  12: "grid-cols-12",
};

const gapClass = {
  sm: "gap-4",
  md: "gap-[var(--ms-grid-gap)]",
  lg: "gap-[var(--ms-grid-gap-lg)]",
} as const;

export function Grid({
  children,
  cols = 12,
  gap = "md",
  className,
}: GridProps) {
  return (
    <div className={cn("grid", colsClass[cols], gapClass[gap], className)}>
      {children}
    </div>
  );
}

export interface GridItemProps {
  children?: React.ReactNode;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  className?: string;
}

const spanClass: Record<NonNullable<GridItemProps["span"]>, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

const startClass: Record<NonNullable<GridItemProps["start"]>, string> = {
  1: "col-start-1",
  2: "col-start-2",
  3: "col-start-3",
  4: "col-start-4",
  5: "col-start-5",
  6: "col-start-6",
  7: "col-start-7",
  8: "col-start-8",
  9: "col-start-9",
  10: "col-start-10",
  11: "col-start-11",
  12: "col-start-12",
};

export function GridItem({
  children,
  span = 12,
  start,
  className,
}: GridItemProps) {
  return (
    <div
      className={cn(
        spanClass[span],
        start ? startClass[start] : undefined,
        className,
      )}
    >
      {children}
    </div>
  );
}
