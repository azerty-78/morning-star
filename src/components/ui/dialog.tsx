"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

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
        "m-auto w-[min(100%,26rem)] max-h-[85vh] overflow-auto p-0",
        "rounded-none border border-ms-black bg-ms-paper text-ms-fg shadow-none",
        "backdrop:bg-ms-black/45 backdrop:backdrop-blur-none",
        "open:flex open:flex-col",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-ms-black px-5 py-4">
        <h2
          id={titleId}
          className="text-[length:var(--ms-text-sm)] font-semibold uppercase tracking-[var(--ms-tracking-wider)]"
        >
          {title}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Fermer la boîte de dialogue"
        >
          Fermer
        </Button>
      </div>
      <div className="px-5 py-5">{children}</div>
    </dialog>
  );
}
