"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function Dialog({
  open,
  title,
  onClose,
  children,
  className,
}: DialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const handleClose = () => onClose();
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={cn(
        "ios-ui m-auto w-[min(100%,32rem)] max-h-[min(85vh,40rem)] max-w-[calc(100vw-2rem)] overflow-hidden p-0",
        "rounded-[22px] border border-ms-gold/30 bg-ms-cream-deep text-ms-fg",
        "shadow-[0_24px_64px_rgba(26,26,26,0.28)]",
        "backdrop:bg-ms-black/40 backdrop:backdrop-blur-sm",
        "open:flex open:flex-col",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-ms-gold/25 bg-ms-off-white/90 px-3 py-2.5">
        <span className="size-8 shrink-0" aria-hidden="true" />
        <h2
          id={titleId}
          className="min-w-0 flex-1 truncate text-center text-[17px] font-semibold leading-tight tracking-normal text-ms-black"
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la boîte de dialogue"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ms-gold/20 text-ms-black transition-colors hover:bg-ms-gold/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ms-gold"
        >
          <X aria-hidden="true" className="size-4" strokeWidth={2.25} />
        </button>
      </div>
      <div className="overflow-auto px-4 py-4">{children}</div>
    </dialog>
  );
}
