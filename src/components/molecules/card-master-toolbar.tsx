import type { FormEvent } from "react";
import { Search } from "lucide-react";

import type { CardClaimFilter } from "../../server/cards/card.schemas";
import { Button } from "../ui/button";
import { CustomInputText } from "../elements/custom-input-text";
import { CardQrScanner, type CardQrScannerContent } from "../elements/card-qr-scanner";

export type CardMasterToolbarContent = {
  searchLabel: string;
  searchPlaceholder: string;
  searchAction: string;
  filterLabel: string;
  filterAll: string;
  filterUnclaimed: string;
  filterClaimed: string;
  scanner: CardQrScannerContent;
};

type CardMasterToolbarProps = {
  content: CardMasterToolbarContent;
  draftQuery: string;
  onDraftQueryChange: (value: string) => void;
  onSubmitSearch: (event: FormEvent<HTMLFormElement>) => void;
  onScanCard: (scannedValue: string) => boolean;
  status: CardClaimFilter;
  onFilterChange: (status: CardClaimFilter) => void;
  isPending: boolean;
};

export function CardMasterToolbar({
  content,
  draftQuery,
  onDraftQueryChange,
  onSubmitSearch,
  onScanCard,
  status,
  onFilterChange,
  isPending,
}: CardMasterToolbarProps) {
  return (
    <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <form
        className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={onSubmitSearch}
      >
        <div className="min-w-0 flex-1">
          <CustomInputText
            icon={Search}
            label={content.searchLabel}
            onChange={(event) => onDraftQueryChange(event.target.value)}
            placeholder={content.searchPlaceholder}
            value={draftQuery}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <Button
            className="h-10 px-4"
            disabled={isPending}
            type="submit"
            variant="outline"
          >
            {content.searchAction}
          </Button>
          <CardQrScanner
            buttonClassName="h-10 w-full sm:w-auto px-4"
            content={content.scanner}
            disabled={isPending}
            mode="dialog"
            onScan={onScanCard}
          />
        </div>
      </form>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-[#646b75]">
          {content.filterLabel}
        </span>
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-black/8 bg-[#f5f8fa] p-1">
          <button
            type="button"
            disabled={isPending}
            onClick={() => onFilterChange("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              status === "all"
                ? "bg-white text-black shadow-xs"
                : "text-[#646b75] hover:text-black"
            }`}
          >
            {content.filterAll}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => onFilterChange("unclaimed")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              status === "unclaimed"
                ? "bg-[#0798ad] text-white shadow-xs"
                : "text-[#646b75] hover:text-[#0798ad]"
            }`}
          >
            {content.filterUnclaimed}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => onFilterChange("claimed")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              status === "claimed"
                ? "bg-[#087e91] text-white shadow-xs"
                : "text-[#646b75] hover:text-[#087e91]"
            }`}
          >
            {content.filterClaimed}
          </button>
        </div>
      </div>
    </div>
  );
}
