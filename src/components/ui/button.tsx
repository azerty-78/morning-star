import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-ms-black text-ms-white hover:bg-ms-gray-700 border border-ms-black",
  secondary:
    "bg-transparent text-ms-fg border border-ms-black hover:bg-ms-gray-100",
  ghost: "bg-transparent text-ms-fg border border-transparent hover:bg-ms-gray-100",
  accent:
    "bg-ms-accent text-ms-white border border-ms-accent hover:bg-ms-accent-muted",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm tracking-[0.04em] uppercase",
  lg: "px-6 py-3 text-base tracking-[0.04em] uppercase",
};

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
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150",
        "disabled:opacity-40 disabled:pointer-events-none",
        "rounded-none",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
