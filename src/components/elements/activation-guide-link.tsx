import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/utils";

export function ActivationGuideLink({ className, onClick }: {
  className?: string;
  onClick?: () => void;
}) {
  const { language, messages } = useI18n();
  const content = messages.gettingStarted;
  return (
    <Link
      to="/$locale/tutorial/activation"
      params={{ locale: language }}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn("inline-flex items-center gap-2 rounded no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0798ad]", className)}
    >
      {content.navigationLabel}
      <ExternalLink aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="sr-only"> — {content.newTab}</span>
    </Link>
  );
}
