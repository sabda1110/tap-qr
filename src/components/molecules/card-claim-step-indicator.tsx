import { Check } from "lucide-react";
import type { Messages } from "../../i18n";

type Props = { content: Messages["cardClaim"]; step: 1 | 2 | 3 };

export function CardClaimStepIndicator({ content, step }: Props) {
  const labels = [content.steps.outlet, content.steps.channels, content.steps.links];
  return (
    <nav className="mb-6" aria-label={content.step.replace("{current}", String(step))}>
      <ol className="grid grid-cols-3 gap-2 rounded-2xl border border-black/8 bg-[#faf9f6] p-2 sm:gap-3">
        {labels.map((label, index) => {
          const current = step === index + 1;
          const complete = step > index + 1;
          return (
            <li key={label} aria-current={current ? "step" : undefined}
              className={`flex min-w-0 flex-col items-center gap-2 rounded-xl px-2 py-3 text-center sm:flex-row sm:text-left ${current ? "bg-[#ffb332] text-[#171b22]" : complete ? "text-[#087e91]" : "text-[#69737d]"}`}>
              <span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${current ? "bg-[#171b22] text-white" : complete ? "bg-[#e8f8fb] text-[#087e91]" : "border border-black/15 bg-white"}`}>
                {complete ? <Check aria-hidden="true" className="size-4" /> : index + 1}
              </span>
              <span className="min-w-0 text-xs leading-5 font-semibold sm:text-sm">{label}</span>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-xs font-medium text-[#69737d]" aria-live="polite">{content.step.replace("{current}", String(step))}</p>
    </nav>
  );
}
