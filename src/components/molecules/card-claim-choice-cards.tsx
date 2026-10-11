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
      {/* Card 1: Buat outlet baru */}
      <button
        type="button"
        onClick={() => onModeChange("new")}
        className={cn(
          "group relative flex items-center gap-3.5 rounded-2xl p-3.5 text-left transition-all cursor-pointer",
          outletMode === "new"
            ? "border-2 border-[#0798ad] bg-[#f7fdfe] shadow-xs ring-4 ring-[#0798ad]/10"
            : "border border-slate-200 bg-white hover:border-slate-300"
        )}
      >
        <img
          src={newStoreImage}
          alt=""
          className="size-14 shrink-0 rounded-xl object-contain bg-slate-50 border border-slate-100 p-0.5"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">{content.newOutlet}</p>
          <p className="mt-0.5 text-xs text-slate-500 leading-snug">
            {content.newOutletDesc}
          </p>
        </div>
        <div className="shrink-0">
          {outletMode === "new" ? (
            <CheckCircle2 className="size-5 text-[#0798ad] fill-[#0798ad] text-white" />
          ) : (
            <div className="size-5 rounded-full border-2 border-slate-300" />
          )}
        </div>
      </button>

      {/* Card 2: Pilih outlet yang sudah ada */}
      <button
        type="button"
        onClick={() => onModeChange("existing")}
        className={cn(
          "group relative flex items-center gap-3.5 rounded-2xl p-3.5 text-left transition-all cursor-pointer",
          outletMode === "existing"
            ? "border-2 border-[#0798ad] bg-[#f7fdfe] shadow-xs ring-4 ring-[#0798ad]/10"
            : "border border-slate-200 bg-white hover:border-slate-300"
        )}
      >
        <img
          src={existingStoreImage}
          alt=""
          className="size-14 shrink-0 rounded-xl object-contain bg-slate-50 border border-slate-100 p-0.5"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">{content.existingOutlet}</p>
          <p className="mt-0.5 text-xs text-slate-500 leading-snug">
            {content.existingOutletDesc}
          </p>
        </div>
        <div className="shrink-0">
          {outletMode === "existing" ? (
            <CheckCircle2 className="size-5 text-[#0798ad] fill-[#0798ad] text-white" />
          ) : (
            <div className="size-5 rounded-full border-2 border-slate-300" />
          )}
        </div>
      </button>
    </div>
  );
}
