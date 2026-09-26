import Link from "next/link";
import {
  buttonClassName,
  type ButtonSize,
  type ButtonVariant,
} from "./button";

export interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  "aria-label"?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  "aria-label": ariaLabel,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={buttonClassName({ variant, size, className })}
    >
      {children}
    </Link>
  );
}
