import { Dialog } from "@base-ui/react/dialog";

import { Button } from "./button";

type AlertDialogProps = {
  cancelLabel: string;
  confirmLabel: string;
  description: string;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
};

export function AlertDialog({ cancelLabel, confirmLabel, description, onConfirm, onOpenChange, open, title }: AlertDialogProps) {
  return <Dialog.Root onOpenChange={onOpenChange} open={open}><Dialog.Portal><Dialog.Backdrop className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm" /><Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-white p-6 shadow-2xl"><Dialog.Title className="text-xl font-bold tracking-[-0.04em]">{title}</Dialog.Title><Dialog.Description className="mt-2 text-sm leading-6 text-[#646b75]">{description}</Dialog.Description><div className="mt-6 flex justify-end gap-2"><Dialog.Close render={<Button type="button" variant="outline" />}>{cancelLabel}</Dialog.Close><Button onClick={onConfirm} type="button" variant="destructive">{confirmLabel}</Button></div></Dialog.Popup></Dialog.Portal></Dialog.Root>;
}
