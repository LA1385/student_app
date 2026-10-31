"use client";

import Portal from "@/components/Tasks/Portal";
import { AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmationModal({ isOpen, onClose, onConfirm }: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      {/* Overlay covers the entire screen */}
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-text/55 px-4 py-6 backdrop-blur-sm sm:px-6"
        onClick={onClose}
      >
        {/* Modal Box */}
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-modal-title"
          tabIndex={-1}
          className="w-full max-w-md rounded-2xl border border-border bg-bg-card p-5 shadow-2xl shadow-text/20 sm:p-7"
          onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the box
        >
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-urgent/10 text-urgent">
              <AlertTriangle aria-hidden="true" className="size-5" />
            </div>
            <div className="min-w-0">
              <h2 id="confirmation-modal-title" className="text-lg font-bold text-text sm:text-xl">Are you sure?</h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
            This action cannot be undone. Please confirm to proceed.
              </p>
            </div>
          </div>
          
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button 
              className="min-h-11 rounded-xl border border-border-strong bg-bg-card px-5 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-bg-page focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="min-h-11 rounded-xl border border-urgent bg-urgent px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-urgent/25"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
