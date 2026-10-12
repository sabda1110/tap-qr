import { CheckCircle2 } from "lucide-react";
import type { Messages } from "../../i18n";
import { cn } from "../../lib/utils";
import newStoreImage from "../assets/images/activation/new-store.jpg";
import existingStoreImage from "../assets/images/activation/existing-store.jpg";

type Props = {
  outletMode: "new" | "existing";
  onModeChange: (mode: "new" | "existing") => void;
  content: Messages["cardClaim"];
};

export function CardClaimChoiceCards({
  outletMode,
  onModeChange,
  content,
}: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => onModeChange("new")}
        className={cn(
          "group relative flex min-h-24 cursor-pointer items-center gap-3.5 rounded-xl p-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155ee8] focus-visible:ring-offset-2",
          outletMode === "new"
            ? "border-2 border-[#2f80ed] bg-[#f7fbff] shadow-[0_8px_24px_rgba(47,128,237,0.10)]"
            : "border border-slate-200 bg-white hover:border-blue-200"
        )}
      >
        <img
          src={newStoreImage}
          alt=""
          className="size-16 shrink-0 rounded-xl object-contain"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">{content.newOutlet}</p>
          <p className="mt-0.5 text-xs text-slate-500 leading-snug">
            {content.newOutletDesc}
          </p>
        </div>
        <div className="shrink-0">
          {outletMode === "new" ? (
            <CheckCircle2 className="size-5 fill-[#155ee8] text-white" />
          ) : (
            <div className="size-5 rounded-full border-2 border-slate-300" />
          )}
        </div>
      </button>

      <button
        type="button"
        onClick={() => onModeChange("existing")}
        className={cn(
          "group relative flex min-h-24 cursor-pointer items-center gap-3.5 rounded-xl p-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155ee8] focus-visible:ring-offset-2",
          outletMode === "existing"
            ? "border-2 border-[#2f80ed] bg-[#f7fbff] shadow-[0_8px_24px_rgba(47,128,237,0.10)]"
            : "border border-slate-200 bg-white hover:border-blue-200"
        )}
      >
        <img
          src={existingStoreImage}
          alt=""
          className="size-16 shrink-0 rounded-xl object-contain"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">{content.existingOutlet}</p>
          <p className="mt-0.5 text-xs text-slate-500 leading-snug">
            {content.existingOutletDesc}
          </p>
        </div>
        <div className="shrink-0">
          {outletMode === "existing" ? (
            <CheckCircle2 className="size-5 fill-[#155ee8] text-white" />
          ) : (
            <div className="size-5 rounded-full border-2 border-slate-300" />
          )}
        </div>
      </button>
    </div>
  );
}
