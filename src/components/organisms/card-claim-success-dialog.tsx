import { useState } from "react";
import { ArrowUpRight, BadgeCheck, Nfc, ScanQrCode, Sparkles } from "lucide-react";
import type { Language, Messages } from "../../i18n";
import { Button, buttonVariants } from "../ui/button";
import { Dialog, DialogBody, DialogFooter } from "../ui/dialog";

type Props = {
  cardId: string;
  language: Language;
  content: Messages["cardClaim"]["activated"];
  onDone: () => Promise<void>;
};

export function CardClaimSuccessDialog({ cardId, language, content, onDone }: Props) {
  const [finishing, setFinishing] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);

  async function finish() {
    if (finishing) return;
    setFinishing(true);
    setRefreshFailed(false);
    try {
      await onDone();
    } catch {
      setRefreshFailed(true);
      setFinishing(false);
    }
  }

  return (
    <Dialog
      title={content.title}
      description={content.description}
      icon={BadgeCheck}
      iconClassName="rounded-xl border-[#171b22] bg-[#ffb332] text-[#171b22] shadow-[3px_3px_0_#171b22]"
      size="compact"
      closeLabel={content.done}
      onClose={() => void finish()}
      busy={finishing}
      dismissOnOutsidePress={false}
    >
      <DialogBody className="bg-white">
        <div className="relative rounded-2xl border-2 border-[#171b22] bg-[#fff8e9] p-5 shadow-[4px_4px_0_#ffb332]">
          <Sparkles aria-hidden="true" className="absolute -right-2 -top-3 size-7 fill-[#ffb332] text-[#171b22]" />
          <h2 className="text-lg font-extrabold tracking-tight text-[#171b22]">{content.ready}</h2>
          <ul className="mt-5 space-y-5">
            <li className="flex items-start gap-3">
              <Nfc aria-hidden="true" className="mt-1 size-6 shrink-0 text-[#a86508]" />
              <div><h3 className="text-sm font-bold text-[#171b22]">{content.tapTitle}</h3>
                <p className="mt-1 text-sm leading-6 text-[#58606b]">{content.tapDescription}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ScanQrCode aria-hidden="true" className="mt-1 size-6 shrink-0 text-[#a86508]" />
              <div><h3 className="text-sm font-bold text-[#171b22]">{content.scanTitle}</h3>
                <p className="mt-1 text-sm leading-6 text-[#58606b]">{content.scanDescription}</p>
              </div>
            </li>
          </ul>
        </div>
        <p className="mt-6 text-sm leading-6 text-[#171b22]">{content.result}</p>
        <p className="mt-3 text-xs leading-6 text-[#69737d]">{content.editHint}</p>
        {refreshFailed && <p role="alert" className="mt-4 text-sm leading-6 text-red-600">{content.refreshError}</p>}
      </DialogBody>
      <DialogFooter className="flex-col sm:flex-col [&>a]:min-h-11">
        <a href={`/${language}/${cardId}`} target="_blank" rel="noopener noreferrer"
          className={buttonVariants({ variant: "warning", className: "min-h-11 w-full gap-2 whitespace-normal px-4 py-3 text-center" })}>
          {content.preview}<ArrowUpRight aria-hidden="true" className="size-4" /><span className="sr-only">{content.newTab}</span>
        </a>
        <Button type="button" variant="outline" onClick={() => void finish()} disabled={finishing} className="w-full border-black/15">
          {finishing ? content.finishing : content.done}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
