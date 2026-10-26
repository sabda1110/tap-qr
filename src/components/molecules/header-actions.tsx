import { landingButtonStyles } from "../elements/landing-button";
import { Link } from "@tanstack/react-router";

import type { Language, Messages } from "../../i18n";
import { LanguageSwitcher } from "../elements/language-switcher";

type HeaderActionsProps = {
  labels: Pick<Messages["header"], "languageLabel" | "login" | "register" | "buy" | "checkOrder">;
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
          : "hidden items-center gap-5 xl:flex"
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
        className={landingButtonStyles({ compact: true, className: mobile ? "w-full" : undefined })}
        to="/$locale/order"
        params={{ locale: language }}
      >
        {labels.buy}
      </Link>
      <Link className={`${mobile ? "block" : "hidden lg:block"} text-xs font-semibold text-black/70`} to="/$locale/orders" params={{ locale: language }}>{labels.checkOrder}</Link>
    </div>
  );
}
