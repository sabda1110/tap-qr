import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { ComponentProps, ReactNode } from "react";
import { PanelTop, X, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export function Dialog({
  title,
  closeLabel,
  onClose,
  children,
  busy = false,
  dismissOnOutsidePress = true,
  description,
  icon: Icon = PanelTop,
}: {
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
  busy?: boolean;
  dismissOnOutsidePress?: boolean;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <DialogPrimitive.Root
      open
      disablePointerDismissal={!dismissOnOutsidePress}
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-[#172029]/45 backdrop-blur-sm" />
        <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-white/70 bg-[#f8fafc] shadow-[0_30px_100px_rgba(23,32,41,0.3)] sm:max-h-[90dvh] sm:rounded-3xl">
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-black/8 bg-white p-5 sm:px-6 sm:py-5">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-[#bce8ef] bg-[#e8f8fb] text-[#087e91]">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0">
                <DialogPrimitive.Title className="text-lg leading-7 font-bold tracking-tight break-words sm:text-xl">
                  {title}
                </DialogPrimitive.Title>
                {description && (
                  <DialogPrimitive.Description className="mt-1 max-w-2xl text-sm leading-6 text-[#69737d]">
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0 rounded-xl border border-black/8 bg-[#f8fafc] text-[#69737d] hover:bg-black/5 hover:text-[#172029]"
              aria-label={closeLabel}
              disabled={busy}
              onClick={onClose}
            >
              <X />
            </Button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {children}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function DialogBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6",
        className,
      )}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex shrink-0 flex-col-reverse gap-3 border-t border-black/8 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end sm:px-6 [&_button]:min-h-11",
        className,
      )}
      {...props}
    />
  );
}
