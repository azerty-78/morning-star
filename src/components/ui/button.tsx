import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "link";
export type ButtonSize = "sm" | "md";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-ms-gold text-ms-black border border-transparent hover:bg-ms-gold-dark hover:text-white",
  secondary:
    "bg-white text-ms-black border border-ms-gold/35 hover:bg-ms-gold/15",
  ghost:
    "bg-transparent text-ms-gold-dark border border-transparent hover:bg-ms-gold/15",
  accent:
    "bg-ms-gold text-ms-black border border-transparent hover:bg-ms-gold-dark hover:text-white",
  link: "bg-transparent text-ms-gold-dark border-0 px-0 hover:text-ms-black",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[14px]",
  md: "h-11 px-5 text-[15px]",
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
    "rounded-full font-semibold tracking-normal no-underline",
    "transition-colors duration-200",
    "disabled:pointer-events-none disabled:opacity-40",
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
