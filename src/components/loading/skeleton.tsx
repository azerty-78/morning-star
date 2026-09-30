import { cn } from "@/lib/utils";

function Bone({
  className,
  tone = "cream",
}: {
  className?: string;
  tone?: "cream" | "paper";
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "ms-skeleton block animate-pulse rounded-md",
        tone === "paper" ? "bg-white" : "bg-ms-cream-deep",
        className,
      )}
    />
  );
}

function Status({ label }: { label: string }) {
  return <p className="sr-only">{label}</p>;
}

export function PublicPageSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="mx-auto w-full max-w-[var(--ms-container)] space-y-4 px-[var(--ms-gutter)] pb-6 pt-6"
    >
      <Status label="Chargement de la page" />
      <div className="rounded-[22px] bg-white p-5 shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        <Bone className="h-3 w-28" />
        <Bone className="mt-4 h-8 w-2/3 max-w-md" />
        <Bone className="mt-3 h-4 w-full" />
        <Bone className="mt-2 h-4 w-4/5" />
        <Bone className="mt-5 h-11 w-40 rounded-full" />
      </div>
      <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="border-b border-black/5 px-4 py-4 last:border-b-0">
            <Bone className="h-4 w-1/3" />
            <Bone className="mt-2 h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoginPageSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="mx-auto w-full max-w-[var(--ms-container-narrow)] px-[var(--ms-gutter)] pb-16 pt-[var(--ms-space-8)]"
    >
      <Status label="Chargement de la connexion" />
      <div className="rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        <Bone className="mx-auto h-16 w-16 rounded-2xl" />
        <Bone className="mx-auto mt-6 h-7 w-40" />
        <Bone className="mx-auto mt-3 h-4 w-56 max-w-full" />
        <div className="mt-8 flex flex-col gap-4">
          <Bone className="h-12 w-full rounded-xl" />
          <Bone className="h-12 w-full rounded-xl" />
          <Bone className="h-11 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function AdminPageSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="mx-auto w-full max-w-[var(--ms-container)] px-[var(--ms-gutter)] py-4 pb-[var(--ms-space-10)]"
    >
      <Status label="Chargement de l’administration" />
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="rounded-[22px] bg-white p-5 shadow-[0_1px_2px_rgba(26,26,26,0.04)]"
          >
            <Bone className="h-9 w-9 rounded-xl" />
            <Bone className="mt-4 h-7 w-16" />
            <Bone className="mt-2 h-3 w-24" />
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-[22px] bg-white p-5 shadow-[0_1px_2px_rgba(26,26,26,0.04)]">
        <Bone className="h-4 w-40" />
        <Bone className="mt-5 h-40 w-full rounded-xl" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, column) => (
          <div
            key={column}
            className="rounded-[22px] bg-white p-5 shadow-[0_1px_2px_rgba(26,26,26,0.04)]"
          >
            <Bone className="h-4 w-36" />
            <div className="mt-4 flex flex-col gap-3">
              {Array.from({ length: 4 }, (_, row) => (
                <Bone key={row} className="h-10 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
