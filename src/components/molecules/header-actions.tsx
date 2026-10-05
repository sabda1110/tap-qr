import { Link } from "@tanstack/react-router";

import type { Language, Messages } from "../../i18n";
import { LanguageSwitcher } from "../elements/language-switcher";

type HeaderActionsProps = {
  labels: Pick<Messages["header"], "languageLabel" | "login" | "register">;
  language: Language;
  mobile?: boolean;
};

export function HeaderActions({
  labels,
  language,
  mobile = false,
}: HeaderActionsProps) {
  return (
    <div
      className={
        mobile
          ? "flex flex-col items-start gap-5 border-t border-black/10 pt-5"
          : "hidden items-center gap-7 md:flex"
      }
    >
      <LanguageSwitcher label={labels.languageLabel} />
      <Link
        className="text-xs font-semibold text-black/70 no-underline hover:text-black"
        to="/$locale/auth/$mode"
        params={{ locale: language, mode: "login" }}
      >
        {labels.login}
      </Link>
      <Link
        className={
          mobile
            ? "flex h-11 w-full items-center justify-center rounded-md bg-black px-7 text-[12px] font-medium text-white no-underline hover:bg-black/80 hover:text-white"
            : "flex h-11 items-center justify-center rounded-md bg-black px-7 text-[12px] font-medium text-white no-underline hover:bg-black/80 hover:text-white"
        }
        to="/$locale/auth/$mode"
        params={{ locale: language, mode: "register" }}
      >
        {labels.register}
      </Link>
    </div>
  );
}
