import { Layers, Printer, Store } from "lucide-react";
import { Button } from "../ui/button";

type AdminPrintStudioHeaderProps = {
  kicker: string;
  title: string;
  description: string;
  activeTab: "single" | "bulk";
  onTabChange: (tab: "single" | "bulk") => void;
  printNowLabel: string;
  tabSingleLabel: string;
  tabBulkLabel: string;
  isPrintDisabled: boolean;
  onPrintClick: () => void;
};

export function AdminPrintStudioHeader({
  kicker,
  title,
  description,
  activeTab,
  onTabChange,
  printNowLabel,
  tabSingleLabel,
  tabBulkLabel,
  isPrintDisabled,
  onPrintClick,
}: AdminPrintStudioHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#087e91]">
          {kicker}
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-[#172029] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-[#69737d]">{description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="inline-flex rounded-xl border border-black/10 bg-white p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => onTabChange("single")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeTab === "single"
                ? "bg-[#087e91] text-white shadow-xs"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            <Store className="size-3.5" />
            <span>{tabSingleLabel}</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("bulk")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeTab === "bulk"
                ? "bg-[#087e91] text-white shadow-xs"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            <Layers className="size-3.5" />
            <span>{tabBulkLabel}</span>
          </button>
        </div>

        {activeTab === "single" && (
          <Button
            className="gap-2 bg-[#ffb332] font-bold text-black shadow-md hover:bg-[#e69f24]"
            onClick={onPrintClick}
            disabled={isPrintDisabled}
            type="button"
          >
            <Printer className="size-4" />
            <span>{printNowLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
