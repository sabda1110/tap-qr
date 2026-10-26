import { ArrowRight, Lightbulb, type LucideIcon } from "lucide-react";
import type { Messages } from "../../i18n";

type Props = {
  content: Messages["gettingStarted"]["steps"]["purchase"];
  icon: LucideIcon;
  number: number;
};

export function GettingStartedStep({ content, icon: Icon, number }: Props) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-black/10 bg-white p-6 shadow-[0_4px_0_rgba(23,27,34,0.05)] sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-[#171b22] bg-[#ffb332] text-xl font-extrabold text-[#171b22] shadow-[3px_3px_0_#171b22]">
          {String(number).padStart(2, "0")}
        </span>
        <Icon aria-hidden="true" className="size-8 text-[#0798ad]" strokeWidth={1.5} />
      </div>
      <p className="mt-7 text-xs font-bold tracking-wider text-[#087e91] uppercase">{content.badge}</p>
      <h2 className="mt-2 text-xl font-extrabold tracking-tight text-[#171b22] sm:text-2xl">{content.title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#58606b]">{content.description}</p>
      <ul className="mt-5 space-y-4 pb-6">
        {content.instructions.map((instruction) => (
          <li key={instruction} className="flex items-start gap-3 text-sm leading-6 text-[#303740]">
            <ArrowRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#087e91]" />
            <span>{instruction}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-start gap-2.5 rounded-xl bg-[#fff8e9] p-4">
        <Lightbulb aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#946115]" />
        <p className="text-xs leading-6 text-[#58606b]">{content.tip}</p>
      </div>
    </article>
  );
}
