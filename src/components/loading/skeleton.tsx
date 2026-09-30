import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "ms-skeleton block animate-pulse rounded-md bg-ms-cream-deep",
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
      className="mx-auto w-full max-w-[var(--ms-container)] px-[var(--ms-gutter)] pb-6 pt-[var(--ms-space-7)] md:pt-[var(--ms-space-8)]"
    >
      <Status label="Chargement de la page" />
      <Bone className="h-3 w-28" />
      <Bone className="mt-5 h-11 w-2/3 max-w-xl" />
      <Bone className="mt-4 h-5 w-1/2 max-w-md" />
      <Bone className="mt-8 h-px w-full rounded-none" />

      <div className="mt-10 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-3">
          <Bone className="h-3 w-20" />
          <Bone className="mt-4 h-16 w-24" />
          <Bone className="mt-3 h-3 w-16" />
        </div>
        <div className="flex flex-col gap-3 md:col-span-8 md:col-start-5">
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-11/12" />
          <Bone className="h-4 w-4/5" />
          <Bone className="mt-4 h-10 w-44 rounded-none" />
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-t border-ms-border py-4"
          >
            <Bone className="h-4 w-8" />
            <div className="min-w-0 flex-1">
              <Bone className="h-4 w-1/3" />
              <Bone className="mt-2 h-3 w-2/3" />
            </div>
          </div>
        ))}
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
