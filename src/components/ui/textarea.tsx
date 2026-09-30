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
        className="text-[13px] font-medium text-ms-gray-600"
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
          "w-full resize-y rounded-xl border border-ms-gold/30 bg-white",
          "px-4 py-3 text-[16px] text-ms-black leading-snug",
          "placeholder:text-ms-gray-400",
          "focus-visible:border-ms-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ms-gold/30",
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
