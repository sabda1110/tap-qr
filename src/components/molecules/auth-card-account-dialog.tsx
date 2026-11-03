import { Link } from "@tanstack/react-router";
import type { Language, Messages } from "../../i18n";
import { Dialog, DialogBody, DialogFooter } from "../ui/dialog";

export function AuthCardAccountDialog({
  language,
  cardId,
  content,
  onClose,
}: {
  language: Language;
  cardId: string;
  content: Messages["auth"]["cardAccountPrompt"];
  onClose: () => void;
}) {
  return (
    <Dialog title={content.title} description={content.description} closeLabel={content.close} onClose={onClose} size="compact" icon={null}>
      <DialogBody>
        <p className="text-sm font-semibold text-[#303740]">{content.question}</p>
        <p className="mt-2 break-all rounded-lg bg-white px-3 py-2 font-mono text-xs text-[#69737d]">{cardId}</p>
      </DialogBody>
      <DialogFooter className="sm:flex-col">
        <Link onClick={onClose} to="/$locale/auth/$mode" params={{ locale: language, mode: "login" }} search={{ cardId }} className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#171b22] px-4 py-2 text-sm font-semibold text-white hover:bg-[#303740]">{content.login}</Link>
        <Link onClick={onClose} to="/$locale/auth/$mode" params={{ locale: language, mode: "register" }} search={{ cardId }} className="inline-flex min-h-11 items-center justify-center rounded-md border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-[#171b22] hover:bg-[#f3f5f7]">{content.register}</Link>
      </DialogFooter>
    </Dialog>
  );
}
