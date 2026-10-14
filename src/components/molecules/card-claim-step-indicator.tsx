import { Clock } from "lucide-react";
import type { Messages } from "../../i18n";

type Props = {
  content: Messages["cardClaim"];
  step: 1 | 2 | 3;
};

export function CardClaimStepIndicator({ content, step }: Props) {
  return (
    <div className="mb-5" aria-label={content.step.replace("{current}", String(step))}>
      <div className="grid gap-2 sm:grid-cols-3">
        <div
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
            step === 1
              ? "bg-[#eaf3ff] text-slate-950"
              : "bg-blue-50 text-[#155ee8]"
          }`}
        >
          <span
            className={`grid size-5 place-items-center rounded-full text-xs font-bold ${
              step === 1 ? "bg-[#155ee8] text-white" : "bg-[#155ee8] text-white"
            }`}
          >
            1
          </span>
          <span>{content.steps.outlet}</span>
        </div>

        <div
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
            step === 2
              ? "bg-[#eaf3ff] text-slate-950"
              : "text-slate-500"
          }`}
        >
          <span
            className={`grid size-5 place-items-center rounded-full text-xs font-bold ${
              step === 2
              ? "bg-[#155ee8] text-white"
              : "bg-slate-100 text-slate-500"
            }`}
          >
            2
          </span>
          <span className={step === 2 ? "text-slate-950" : "font-medium text-slate-500"}>
            {content.steps.channels}
          </span>
        </div>
        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${step === 3 ? "bg-[#eaf3ff] text-slate-950" : "text-slate-500"}`}>
          <span className={`grid size-5 place-items-center rounded-full text-xs font-bold ${step === 3 ? "bg-[#155ee8] text-white" : "bg-slate-100 text-slate-500"}`}>3</span>
          <span className={step === 3 ? "text-slate-950" : "font-medium text-slate-500"}>{content.steps.links}</span>
        </div>
      </div>

      <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <Clock className="size-3.5" />
        <span>{content.step.replace("{current}", String(step))}</span>
      </div>
    </div>
  );
}
