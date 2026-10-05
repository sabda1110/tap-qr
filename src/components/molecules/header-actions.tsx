import type { Messages } from "../../i18n";
import { LanguageSwitcher } from "../elements/language-switcher";

type HeaderActionsProps = {
  labels: Pick<Messages["header"], "languageLabel" | "signUp">;
  mobile?: boolean;
};

export function HeaderActions({ labels, mobile = false }: HeaderActionsProps) {
  return (
    <div
      className={
        mobile
          ? "flex flex-col items-start gap-5 border-t border-black/10 pt-5"
          : "hidden items-center gap-7 md:flex"
      }
    >
      <LanguageSwitcher label={labels.languageLabel} />
      <a
        className={
          mobile
            ? "flex h-11 w-full items-center justify-center rounded-md bg-black px-7 text-[12px] font-medium text-white no-underline hover:bg-black/80 hover:text-white"
            : "flex h-11 items-center justify-center rounded-md bg-black px-7 text-[12px] font-medium text-white no-underline hover:bg-black/80 hover:text-white"
        }
        href="#pricing"
      >
        {labels.signUp}
      </a>
    </div>
  );
}
