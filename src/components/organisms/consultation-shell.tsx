import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import type { Language, Messages } from "../../i18n";
import { BrandLogo } from "../elements/brand-logo";
import { LanguageSwitcher } from "../elements/language-switcher";
import { ConsultationLayout } from "../layouts/consultation-layout";

export function ConsultationShell({ children, language, messages }: { children: ReactNode; language: Language; messages: Messages }) {
  return <ConsultationLayout
    header={<><BrandLogo homeLabel={messages.header.brandHomeLabel} language={language} /><LanguageSwitcher label={messages.header.languageLabel} /></>}
    backLink={<Link to="/$locale" params={{ locale: language }} className="mb-7 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#596570] hover:text-black"><ArrowLeft aria-hidden="true" className="size-4" />{messages.consultation.backHome}</Link>}
  >{children}</ConsultationLayout>;
}
