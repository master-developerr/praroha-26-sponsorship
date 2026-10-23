"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface DialogProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  isDismissable?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  className?: string;
  hideHeader?: boolean;
  contentClassName?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  isDismissable = true,
  maxWidth = "md",
  className,
  hideHeader = false,
  contentClassName,
}: DialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDismissable && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isDismissable, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => {
          if (isDismissable && onClose) onClose();
        }}
      />

      {/* Content */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-50 w-full overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-lg animate-in zoom-in-95 duration-150",
          widthClasses[maxWidth],
          className
        )}
      >
        {!hideHeader && (title || (isDismissable && onClose)) && (
          <div className="flex items-start justify-between pb-4">
            <div>
              {title && (
                <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
              )}
              {description && (
                <p className="mt-1 text-xs text-text-secondary">{description}</p>
              )}
            </div>
            {isDismissable && onClose && (
              <button
                onClick={onClose}
                className="rounded-md p-1 text-text-muted hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            )}
          </div>
        )}
        <div className={contentClassName}>{children}</div>
      </div>
    </div>
  );
}
