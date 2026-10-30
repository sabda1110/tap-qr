import { Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import type { Language } from "../../i18n";
import { landingButtonStyles } from "./landing-button";

type Props = { language: Language; label: string; compact?: boolean; className?: string; onClick?: () => void };

export function ConsultationLink({ language, label, compact, className, onClick }: Props) {
  return <Link to="/$locale/consultation" params={{ locale: language }} onClick={onClick} className={landingButtonStyles({ compact, className })}>
    <CalendarDays aria-hidden="true" className="size-4 shrink-0" />{label}
  </Link>;
}
