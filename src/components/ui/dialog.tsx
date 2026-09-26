"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface DialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
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
        "m-auto w-[min(100%,28rem)] max-h-[90vh] overflow-auto",
        "rounded-none border border-ms-black bg-ms-surface p-0 text-ms-fg",
        "backdrop:bg-ms-black/40",
        "open:flex open:flex-col",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-ms-border px-5 py-4">
        <h2 id={titleId} className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Fermer"
          className="uppercase tracking-[0.14em]"
        >
          Fermer
        </Button>
      </div>
      <div className="px-5 py-5">{children}</div>
    </dialog>
  );
}
