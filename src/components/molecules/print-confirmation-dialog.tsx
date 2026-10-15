import { CheckCircle2, Info, Loader2, Printer } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogBody, DialogFooter } from "../ui/dialog";

type PrintConfirmationDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (markAsPrinted: boolean) => Promise<void>;
  isPending: boolean;
  activeTab: "single" | "bulk";
  cardCount: number;
  singleCardId?: string;
  sizeText: string;
  labels: {
    title: string;
    descriptionSingle: string;
    descriptionBulk: string;
    statusNotice: string;
    printOnly: string;
    printAndMark: string;
    cancel: string;
  };
};

export function PrintConfirmationDialog({
  open,
  onClose,
  onConfirm,
  isPending,
  activeTab,
  cardCount,
  singleCardId,
  sizeText,
  labels,
}: PrintConfirmationDialogProps) {
  if (!open) return null;

  const description =
    activeTab === "single"
      ? labels.descriptionSingle
          .replace("{cardId}", singleCardId || "")
          .replace("{size}", sizeText)
      : labels.descriptionBulk
          .replace("{count}", String(cardCount))
          .replace("{size}", sizeText);

  return (
    <Dialog
      title={labels.title}
      closeLabel={labels.cancel}
      onClose={onClose}
      busy={isPending}
      icon={Printer}
    >
      <DialogBody className="space-y-4">
        <p className="text-sm leading-relaxed text-neutral-600">{description}</p>

        {/* Notice Info Box */}
        <div className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
          <Info className="mt-0.5 size-5 shrink-0 text-[#087e91]" />
          <p className="text-xs font-medium leading-5 text-sky-950">
            {labels.statusNotice}
          </p>
        </div>
      </DialogBody>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isPending}
          className="text-xs font-semibold"
        >
          {labels.cancel}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => void onConfirm(false)}
          disabled={isPending}
          className="gap-1.5 text-xs font-semibold text-neutral-700"
        >
          <Printer className="size-3.5" />
          <span>{labels.printOnly}</span>
        </Button>

        <Button
          type="button"
          onClick={() => void onConfirm(true)}
          disabled={isPending}
          className="gap-1.5 bg-[#087e91] text-xs font-bold text-white shadow-md hover:bg-[#066373]"
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="size-3.5" />
          )}
          <span>{labels.printAndMark}</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
