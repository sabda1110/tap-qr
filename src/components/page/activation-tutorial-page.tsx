import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "../../i18n";
import { BrandLogo } from "../elements/brand-logo";
import { LanguageSwitcher } from "../elements/language-switcher";
import { TutorialLayout } from "../layouts/tutorial-layout";
import { GettingStartedSection } from "../organisms/getting-started-section";

export function ActivationTutorialPage() {
  const { language, messages } = useI18n();
  return (
    <TutorialLayout header={
      <>
        <BrandLogo homeLabel={messages.header.brandHomeLabel} language={language} />
        <div className="flex flex-wrap items-center gap-5">
          <LanguageSwitcher label={messages.header.languageLabel} />
          <Link to="/$locale" params={{ locale: language }} className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[#087e91] focus-visible:outline-2 focus-visible:outline-offset-4">
            <ArrowLeft aria-hidden="true" className="size-4" />
            {messages.gettingStarted.backHome}
          </Link>
        </div>
      </>
    }>
      <GettingStartedSection content={messages.gettingStarted} language={language} />
    </TutorialLayout>
  );
}
