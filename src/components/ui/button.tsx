import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "link";
export type ButtonSize = "sm" | "md";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-ms-gold text-ms-black border border-ms-gold hover:bg-ms-gold-dark hover:border-ms-gold-dark hover:text-ms-white",
  secondary:
    "bg-transparent text-ms-black border border-ms-black hover:border-ms-gold-dark hover:bg-ms-gold/15 hover:text-ms-black",
  ghost:
    "bg-transparent text-ms-fg border border-transparent hover:border-ms-gold hover:text-ms-gold-dark",
  accent:
    "bg-ms-gold text-ms-black border border-ms-gold hover:bg-ms-gold-dark hover:border-ms-gold-dark hover:text-ms-white",
  link: "bg-transparent text-ms-gold-dark border-0 underline underline-offset-4 hover:text-ms-black px-0",
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
    "inline-flex cursor-pointer items-center justify-center gap-2",
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
