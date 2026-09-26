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
    <div className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        className="text-xs uppercase tracking-[0.14em] text-ms-gray-700"
      >
        {label}
        {required ? (
          <span className="text-ms-accent" aria-hidden="true">
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
          "w-full resize-y rounded-none border border-ms-border bg-ms-surface px-3 py-2.5",
          "text-ms-fg placeholder:text-ms-muted",
          "focus-visible:border-ms-black",
          error && "border-ms-accent",
          className,
        )}
        {...props}
      />
      {hint && !error ? (
        <p id={hintId} className="text-sm text-ms-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-ms-accent-muted" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
