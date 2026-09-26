import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "link";
export type ButtonSize = "sm" | "md";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-ms-black text-ms-white border border-ms-black hover:bg-ms-gray-700",
  secondary:
    "bg-transparent text-ms-fg border border-ms-black hover:bg-ms-gray-100",
  ghost:
    "bg-transparent text-ms-fg border border-transparent hover:border-ms-border",
  accent:
    "bg-ms-gold text-ms-white border border-ms-gold hover:bg-ms-gold-dark",
  link: "bg-transparent text-ms-fg border-0 underline underline-offset-4 hover:text-ms-gold-dark px-0",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "min-h-8 px-3 py-1.5 text-[length:var(--ms-text-xs)] tracking-[var(--ms-tracking-wide)]",
  md: "min-h-10 px-4 py-2 text-[length:var(--ms-text-xs)] tracking-[var(--ms-tracking-wider)]",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}): string {
  return cn(
    "inline-flex items-center justify-center gap-2",
    "font-medium uppercase rounded-none no-underline",
    "transition-colors duration-[var(--ms-duration)] ease-[var(--ms-ease)]",
    "disabled:opacity-35 disabled:pointer-events-none",
    variant !== "link" && sizeClass[size],
    variantClass[variant],
    className,
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={buttonClassName({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}
