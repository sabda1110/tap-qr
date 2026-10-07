import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

export function Dialog({
  title,
  closeLabel,
  onClose,
  children,
  busy = false,
}: {
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
  busy?: boolean;
}) {
  return (
    <DialogPrimitive.Root
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm" />
        <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-black/10 bg-[#f8fafc] shadow-2xl">
          <div className="flex items-center justify-between gap-4 border-b border-black/8 bg-white p-5">
            <DialogPrimitive.Title className="text-xl font-bold">
              {title}
            </DialogPrimitive.Title>
            <Button
              size="icon"
              variant="ghost"
              aria-label={closeLabel}
              disabled={busy}
              onClick={onClose}
            >
              <X />
            </Button>
          </div>
          <div className="overflow-y-auto p-5 sm:p-6">{children}</div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
