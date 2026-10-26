import { Link } from "@tanstack/react-router";
import { ArrowRight, CreditCard } from "lucide-react";
import type { Language, Messages } from "../../i18n";
import type { AuthMode } from "../layouts/auth-layout";

export function ActivationAuthNotice({ cardId, mode, language, content, disabled }: {
  cardId: string;
  mode: AuthMode;
  language: Language;
  content: Messages["auth"]["activation"];
  disabled: boolean;
}) {
  const isRegister = mode === "register";
  return (
    <div className="mt-4 space-y-4">
      <p className="text-sm leading-6 text-[#4f5964]">
        {isRegister ? content.registerDescription : content.loginDescription}
      </p>
      <div className="flex items-center gap-3 rounded-xl bg-[#fff8e9] px-3 py-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#171b22] bg-[#ffb332] text-[#171b22] shadow-[2px_2px_0_#171b22]">
          <CreditCard aria-hidden="true" className="size-4" />
        </span>
        <p className="text-xs leading-5 font-medium text-[#4f5964]">
          {isRegister ? content.registerNextStep : content.nextStep}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 pb-5">
        <p className="text-sm text-[#4f5964]">{isRegister ? content.loginPrompt : content.registerPrompt}</p>
        <Link to="/$locale/auth/$mode"
          params={{ locale: language, mode: isRegister ? "login" : "register" }}
          search={{ cardId }} aria-disabled={disabled}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#171b22] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#303740] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087e91] aria-disabled:pointer-events-none aria-disabled:opacity-40">
          {isRegister ? content.loginAction : content.registerAction}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </div>
  );
}
