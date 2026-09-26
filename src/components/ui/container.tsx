import { cn } from "@/lib/utils";

export interface ContainerProps {
  children: React.ReactNode;
  narrow?: boolean;
  className?: string;
  as?: "div" | "section" | "main" | "article" | "header" | "footer";
}

export function Container({
  children,
  narrow = false,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-[var(--ms-gutter)]",
        narrow ? "max-w-[var(--ms-container-narrow)]" : "max-w-[var(--ms-container)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
