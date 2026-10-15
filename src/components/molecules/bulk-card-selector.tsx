import { useMemo, useState } from "react";
import { CheckSquare, Filter, Search, Square } from "lucide-react";
import type { PrintCardOption } from "../../server/print/admin-print.repository.server";

type BulkCardSelectorProps = {
  cards: PrintCardOption[];
  selectedCardIds: string[];
  onToggleCard: (cardId: string) => void;
  onSelectAll: (cardIds: string[]) => void;
  labels: {
    filterAll: string;
    selectAll: string;
    deselectAll: string;
    selectedCount: string;
    searchPlaceholder: string;
  };
};

export function BulkCardSelector({
  cards,
  selectedCardIds,
  onToggleCard,
  onSelectAll,
  labels,
}: BulkCardSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "acrylic" | "pvc">("all");

  const filteredCards = useMemo(() => {
    return cards.filter((c) => {
      // Filter by material
      if (filterType === "acrylic" && c.material !== "acrylic") return false;
      if (filterType === "pvc" && c.material !== "pvc") return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return c.cardId.toLowerCase().includes(query);
      }

      return true;
    });
  }, [cards, filterType, searchQuery]);

  const allFilteredSelected =
    filteredCards.length > 0 &&
    filteredCards.every((c) => selectedCardIds.includes(c.cardId));

  const handleToggleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      // Remove all filtered from selected
      const filteredIdSet = new Set(filteredCards.map((c) => c.cardId));
      onSelectAll(selectedCardIds.filter((id) => !filteredIdSet.has(id)));
    } else {
      // Add all filtered to selected
      const merged = Array.from(new Set([...selectedCardIds, ...filteredCards.map((c) => c.cardId)]));
      onSelectAll(merged);
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-black/8 bg-white p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Filter className="size-3.5 text-[#087e91]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#172029]">
            Kartu Belum Dicetak ({cards.length})
          </span>
        </div>
        <span className="rounded-full bg-[#087e91]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#087e91]">
          {labels.selectedCount.replace("{count}", String(selectedCardIds.length))}
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 size-3.5 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="w-full rounded-xl border border-black/10 bg-[#fbfcfd] py-2 pl-9 pr-3 text-xs text-neutral-800 placeholder-neutral-400 focus:border-[#087e91] focus:outline-hidden"
        />
      </div>

      {/* Filter Tabs & Quick Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-black/5">
        <div className="flex flex-wrap gap-1">
          {[
            { id: "all", label: labels.filterAll },
            { id: "acrylic", label: "Akrilik" },
            { id: "pvc", label: "PVC" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id as typeof filterType)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                filterType === tab.id
                  ? "bg-[#087e91] text-white shadow-2xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToggleSelectAllFiltered}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-[#087e91] hover:bg-[#087e91]/10"
          >
            {allFilteredSelected ? (
              <>
                <Square className="size-3" />
                <span>{labels.deselectAll}</span>
              </>
            ) : (
              <>
                <CheckSquare className="size-3" />
                <span>{labels.selectAll}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Checkbox List */}
      <div className="max-h-56 overflow-y-auto divide-y divide-black/5 rounded-xl border border-black/8 bg-[#fbfcfd]">
        {filteredCards.length === 0 ? (
          <div className="p-4 text-center text-xs text-neutral-400">
            {cards.length === 0
              ? "Semua kartu sudah diklaim atau sudah dicetak."
              : "Tidak ada kartu yang cocok dengan filter pencarian."}
          </div>
        ) : (
          filteredCards.map((c) => {
            const isChecked = selectedCardIds.includes(c.cardId);
            return (
              <label
                key={c.cardId}
                className={`flex cursor-pointer items-center justify-between gap-3 p-2.5 transition-colors hover:bg-neutral-50 ${
                  isChecked ? "bg-[#087e91]/5" : ""
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleCard(c.cardId)}
                    className="size-4 rounded border-gray-300 text-[#087e91] focus:ring-[#087e91]"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-neutral-900 truncate">
                      {c.cardId}
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate">
                      Belum diklaim & siap produksi
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="rounded-md bg-neutral-200/80 px-1.5 py-0.5 text-[9px] font-bold text-neutral-700 uppercase">
                    {c.material}
                  </span>
                  <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-800">
                    Belum Dicetak
                  </span>
                </div>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
