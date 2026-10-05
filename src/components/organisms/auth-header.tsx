import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

import type { Language } from "../../i18n";
import { BrandLogo } from "../elements/brand-logo";
import { LanguageSwitcher } from "../elements/language-switcher";

type AuthHeaderProps = {
  backLabel: string;
  brandHomeLabel: string;
  language: Language;
  languageLabel: string;
};

export function AuthHeader({
  backLabel,
  brandHomeLabel,
  language,
  languageLabel,
}: AuthHeaderProps) {
  return (
    <header className="mx-auto flex h-20 w-[calc(100%-2rem)] max-w-6xl items-center justify-between sm:w-[calc(100%-3rem)] lg:h-24">
      <BrandLogo homeLabel={brandHomeLabel} language={language} />
      <div className="flex items-center gap-4 sm:gap-6">
        <LanguageSwitcher label={languageLabel} />
        <Link
          className="inline-flex items-center gap-2 text-xs font-semibold text-black/65 no-underline hover:text-black"
          to="/$locale"
          params={{ locale: language }}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{backLabel}</span>
        </Link>
      </div>
    </header>
  );
}
