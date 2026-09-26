import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function Textarea({
  id,
  label,
  hint,
  error,
  className,
  required,
  rows = 5,
  ...props
}: TextareaProps) {
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
      <textarea
        id={inputId}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={
          [hintId, errorId].filter(Boolean).join(" ") || undefined
        }
        className={cn(
          "w-full resize-y rounded-none border border-ms-border bg-ms-surface",
          "px-3 py-3 text-[length:var(--ms-text-base)] text-ms-fg leading-[var(--ms-leading-normal)]",
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
