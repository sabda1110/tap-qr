import { Clock } from "lucide-react";
import type { Messages } from "../../i18n";

type Props = {
  content: Messages["cardClaim"];
  step: 1 | 2;
};

export function CardClaimStepIndicator({ content, step }: Props) {
  return (
    <div className="mb-5">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        {/* Step 1 */}
        <div
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            step === 1
              ? "bg-[#0798ad] text-white shadow-xs"
              : "bg-[#e8f8fb] text-[#087e91]"
          }`}
        >
          <span
            className={`grid size-5 place-items-center rounded-full text-xs font-bold ${
              step === 1 ? "bg-white text-[#0798ad]" : "bg-[#0798ad] text-white"
            }`}
          >
            1
          </span>
          <span>{content.steps.outlet}</span>
        </div>

        {/* Divider line */}
        <div className="hidden h-0.5 flex-1 bg-slate-200 sm:block mx-3" />

        {/* Step 2 */}
        <div
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            step === 2
              ? "bg-[#0798ad] text-white shadow-xs"
              : "text-slate-400 bg-slate-50 border border-slate-200/60"
          }`}
        >
          <span
            className={`grid size-5 place-items-center rounded-full text-xs font-bold ${
              step === 2
                ? "bg-white text-[#0798ad]"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            2
          </span>
          <span className={step === 2 ? "text-white" : "text-slate-500 font-medium"}>
            {content.steps.links}
          </span>
        </div>
      </div>

      {/* Clock subrow */}
      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <Clock className="size-3.5" />
        <span>{content.step.replace("{current}", String(step))}</span>
      </div>
    </div>
  );
}
