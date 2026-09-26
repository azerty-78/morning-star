import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function Input({
  id,
  label,
  hint,
  error,
  className,
  required,
  ...props
}: InputProps) {
  const inputId = id ?? props.name ?? label.replace(/\s+/g, "-").toLowerCase();
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col gap-[var(--ms-space-2)]">
      <label
        htmlFor={inputId}
        className="text-[length:var(--ms-text-2xs)] font-medium uppercase tracking-[var(--ms-tracking-widest)] text-ms-gray-700"
      >
        {label}
        {required ? (
          <span className="text-ms-gold" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      <input
        id={inputId}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={
          [hintId, errorId].filter(Boolean).join(" ") || undefined
        }
        className={cn(
          "w-full rounded-none border-0 border-b border-ms-border bg-transparent",
          "px-0 py-2.5 text-[length:var(--ms-text-base)] text-ms-fg",
          "placeholder:text-ms-gray-400",
          "transition-colors duration-[var(--ms-duration)]",
          "focus-visible:border-ms-black focus-visible:outline-none",
          error && "border-ms-gold",
          className,
        )}
        {...props}
      />
      {hint && !error ? (
        <p id={hintId} className="text-[length:var(--ms-text-sm)] text-ms-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          className="text-[length:var(--ms-text-sm)] text-ms-gold-dark"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
