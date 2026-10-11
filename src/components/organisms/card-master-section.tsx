import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react";

import type { MasterCard } from "../../server/cards/card.repository.server";
import type { CardClaimFilter } from "../../server/cards/card.schemas";
import { useCardMaster } from "../../hooks/use-card-master";
import { CardSelectionActions } from "../molecules/card-selection-actions";
import { CardTableRow, type CardTableRowContent } from "../molecules/card-table-row";
import { CardGeneratorForm, type CardGeneratorFormContent } from "../molecules/card-generator-form";
import { Button } from "../ui/button";
import { CustomInputText } from "../elements/custom-input-text";
import { AlertDialog } from "../ui/alert-dialog";

export type CardMasterContent = CardTableRowContent &
  CardGeneratorFormContent & {
    kicker: string;
    title: string;
    description: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchAction: string;
    filterLabel: string;
    filterAll: string;
    filterUnclaimed: string;
    filterClaimed: string;
    generateAction: string;
    generatorTitle: string;
    table: { cardId: string; material: string; claimStatus: string; enabled: string; action: string };
    selectedCount: string;
    deleteSelected: string;
    deleteAllUnused: string;
    selectAll: string;
    confirmDeleteSelected: string;
    confirmDeleteAllUnused: string;
    deleteSelectedTitle: string;
    deleteAllUnusedTitle: string;
    deleteSuccess: string;
    deleteNoop: string;
    empty: string;
    previous: string;
    next: string;
    loading: string;
    requestError: string;
    generated: string;
  };

type CardPage = { cards: MasterCard[]; nextCursor?: string };

type CardMasterSectionProps = {
  content: CardMasterContent;
  initialPage: CardPage;
  initialStatus?: CardClaimFilter;
  initialQuery?: string;
};

export function CardMasterSection({
  content,
  initialPage,
  initialStatus = "all",
  initialQuery = "",
}: CardMasterSectionProps) {
  const {
    draftQuery,
    setDraftQuery,
    status,
    page,
    previousCursors,
    isGeneratorOpen,
    setGeneratorOpen,
    quantity,
    setQuantity,
    material,
    setMaterial,
    isPending,
    notice,
    selectedIds,
    setSelectedIds,
    deleteTarget,
    setDeleteTarget,
    handleFilterChange,
    submitSearch,
    submitGeneration,
    toggleCard,
    toggleAllVisibleCards,
    handleConfirmDelete,
    handlePreviousPage,
    handleNextPage,
  } = useCardMaster({
    initialPage,
    initialStatus,
    initialQuery,
    requestErrorText: content.requestError,
    generatedText: content.generated,
    deleteSuccessText: content.deleteSuccess,
    deleteNoopText: content.deleteNoop,
  });

  return (
    <section className={`mx-auto max-w-6xl ${selectedIds.size > 1 ? "pb-32" : ""}`}>
      <div className="flex flex-col gap-5 border-b border-black/8 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-[#0798ad] uppercase">{content.kicker}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">{content.title}</h1>
          <p className="mt-3 max-w-2xl leading-7 text-[#646b75]">{content.description}</p>
        </div>
        <Button className="h-11 bg-black px-4 text-white hover:bg-black/80" onClick={() => setGeneratorOpen(true)} type="button">
          <Plus />
          {content.generateAction}
        </Button>
      </div>

      {isGeneratorOpen ? (
        <CardGeneratorForm
          content={content}
          isPending={isPending}
          material={material}
          onCancel={() => setGeneratorOpen(false)}
          onMaterialChange={setMaterial}
          onQuantityChange={setQuantity}
          onSubmit={submitGeneration}
          quantity={quantity}
        />
      ) : null}

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <form className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row" onSubmit={submitSearch}>
          <div className="min-w-0 flex-1">
            <CustomInputText
              icon={Search}
              label={content.searchLabel}
              onChange={(event) => setDraftQuery(event.target.value)}
              placeholder={content.searchPlaceholder}
              value={draftQuery}
            />
          </div>
          <Button className="h-10 self-end px-4" disabled={isPending} type="submit" variant="outline">
            {content.searchAction}
          </Button>
        </form>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[#646b75]">{content.filterLabel}</span>
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-black/8 bg-[#f5f8fa] p-1">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleFilterChange("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                status === "all" ? "bg-white text-black shadow-xs" : "text-[#646b75] hover:text-black"
              }`}
            >
              {content.filterAll}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleFilterChange("unclaimed")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                status === "unclaimed" ? "bg-[#0798ad] text-white shadow-xs" : "text-[#646b75] hover:text-[#0798ad]"
              }`}
            >
              {content.filterUnclaimed}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleFilterChange("claimed")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                status === "claimed" ? "bg-[#087e91] text-white shadow-xs" : "text-[#646b75] hover:text-[#087e91]"
              }`}
            >
              {content.filterClaimed}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button disabled={isPending} onClick={() => setDeleteTarget("all")} type="button" variant="destructive">
          <Trash2 />
          {content.deleteAllUnused}
        </Button>
      </div>

      <p aria-live="polite" className="mt-4 min-h-5 text-sm font-medium text-[#087e91]">{isPending ? content.loading : notice}</p>
      <div className="mt-2 overflow-hidden rounded-2xl border border-black/8 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[740px] text-left text-sm">
            <thead className="bg-[#f5f8fa] text-xs font-bold tracking-[0.08em] text-[#69737d] uppercase">
              <tr>
                <th className="px-5 py-4">
                  <input
                    aria-label={content.selectAll}
                    checked={page.cards.filter((card) => card.claimStatus === "unclaimed").length > 0 && page.cards.filter((card) => card.claimStatus === "unclaimed").every((card) => selectedIds.has(card.id))}
                    disabled={isPending}
                    onChange={toggleAllVisibleCards}
                    type="checkbox"
                  />
                </th>
                <th className="px-5 py-4">{content.table.cardId}</th>
                <th className="px-5 py-4">{content.table.material}</th>
                <th className="px-5 py-4">{content.table.claimStatus}</th>
                <th className="px-5 py-4">{content.table.enabled}</th>
                <th className="px-5 py-4 text-right">{content.table.action}</th>
              </tr>
            </thead>
            <tbody>
              {page.cards.map((card) => (
                <CardTableRow
                  card={card}
                  content={content}
                  disabled={isPending}
                  isSelected={selectedIds.has(card.id)}
                  key={card.id}
                  onDelete={(id) => setDeleteTarget(id)}
                  onToggle={toggleCard}
                />
              ))}
            </tbody>
          </table>
          {page.cards.length === 0 ? <p className="px-5 py-12 text-center text-sm text-[#69737d]">{content.empty}</p> : null}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-black/8 px-4 py-3">
          <Button disabled={isPending || previousCursors.length === 0} onClick={handlePreviousPage} type="button" variant="outline">
            <ChevronLeft />
            {content.previous}
          </Button>
          <Button disabled={isPending || !page.nextCursor} onClick={handleNextPage} type="button" variant="outline">
            {content.next}
            <ChevronRight />
          </Button>
        </div>
      </div>
      <CardSelectionActions count={selectedIds.size} pending={isPending} content={content} onDelete={() => setDeleteTarget("selected")} onCancel={() => setSelectedIds(new Set())} />
      <AlertDialog cancelLabel={content.cancel} confirmLabel={content.delete} description={deleteTarget === "all" ? content.confirmDeleteAllUnused : content.confirmDeleteSelected} onConfirm={handleConfirmDelete} onOpenChange={(open) => !open && setDeleteTarget(undefined)} open={Boolean(deleteTarget)} title={deleteTarget === "all" ? content.deleteAllUnusedTitle : content.deleteSelectedTitle} />
    </section>
  );
}
