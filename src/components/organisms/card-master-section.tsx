import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

import type { AdminCardDetail, MasterCard } from "../../server/cards/card.repository.server";
import type { CardClaimFilter } from "../../server/cards/card.schemas";
import { getAdminCardDetail } from "../../server/cards/card.functions";
import { useCardMaster } from "../../hooks/use-card-master";
import { CardSelectionActions } from "../molecules/card-selection-actions";
import { CardTableRow, type CardTableRowContent } from "../molecules/card-table-row";
import { CardGeneratorForm, type CardGeneratorFormContent } from "../molecules/card-generator-form";
import { CardMasterToolbar, type CardMasterToolbarContent } from "../molecules/card-master-toolbar";
import { CardDetailDialog } from "../molecules/card-detail-dialog";
import { Button } from "../ui/button";
import { AlertDialog } from "../ui/alert-dialog";
import { useToast } from "../ui/toaster";

export type CardMasterContent = CardTableRowContent &
  CardGeneratorFormContent &
  CardMasterToolbarContent & {
    kicker: string;
    title: string;
    description: string;
    generateAction: string;
    generatorTitle: string;
    table: { cardId: string; material: string; claimStatus: string; enabled: string; printStatus: string; action: string };
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
    exportCsv: string;
    exportSuccess: string;
    markPrinted: string;
    markUnprinted: string;
    printStatusSuccess: string;
    scanSuccess: string;
    detail: string;
    detailModal: {
      title: string;
      description: string;
      cardInfo: string;
      outletInfo: string;
      ownerInfo: string;
      linksInfo: string;
      noOutlet: string;
      noOwner: string;
      noLinks: string;
      googleReviewLabel: string;
      googlePlaceId: string;
      verified: string;
      pending: string;
      unverified: string;
      openPublicPage: string;
      manageInOutlet: string;
      close: string;
      loading: string;
      error: string;
    };
  };

type CardPage = { cards: MasterCard[]; nextCursor?: string };

type CardMasterSectionProps = {
  content: CardMasterContent;
  initialPage: CardPage;
  initialStatus?: CardClaimFilter;
  initialQuery?: string;
  locale?: string;
};

export function CardMasterSection({
  content,
  initialPage,
  initialStatus = "all",
  initialQuery = "",
  locale = "id",
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
    handleScanCard,
    submitGeneration,
    toggleCard,
    toggleAllVisibleCards,
    handleConfirmDelete,
    handlePreviousPage,
    handleNextPage,
    exportSelectedCards,
    setSelectedCardsPrintStatus,
  } = useCardMaster({
    initialPage,
    initialStatus,
    initialQuery,
    requestErrorText: content.requestError,
    generatedText: content.generated,
    deleteSuccessText: content.deleteSuccess,
    deleteNoopText: content.deleteNoop,
    exportSuccessText: content.exportSuccess,
    printStatusSuccessText: content.printStatusSuccess,
    scanSuccessText: content.scanSuccess,
  });

  const { showToast } = useToast();
  const [detailTargetId, setDetailTargetId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<AdminCardDetail | null>(null);
  const [isDetailLoading, setDetailLoading] = useState(false);

  async function handleOpenDetail(id: string) {
    setDetailTargetId(id);
    setDetailLoading(true);
    try {
      const response = await getAdminCardDetail({ data: { id } });
      setDetailData(response);
    } catch {
      showToast(content.detailModal.error, "error");
    } finally {
      setDetailLoading(false);
    }
  }

  function handleCloseDetail() {
    setDetailTargetId(null);
    setDetailData(null);
  }

  return (
    <section className={`mx-auto max-w-6xl ${selectedIds.size > 0 ? "pb-48 sm:pb-32" : ""}`}>
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

      <CardMasterToolbar
        content={content}
        draftQuery={draftQuery}
        isPending={isPending}
        onDraftQueryChange={setDraftQuery}
        onFilterChange={handleFilterChange}
        onScanCard={handleScanCard}
        onSubmitSearch={submitSearch}
        status={status}
      />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button disabled={isPending} onClick={() => setDeleteTarget("all")} type="button" variant="destructive">
          <Trash2 />
          {content.deleteAllUnused}
        </Button>
      </div>

      <p aria-live="polite" className="mt-4 min-h-5 text-sm font-medium text-[#087e91]">{isPending ? content.loading : notice}</p>
      <div className="mt-2 overflow-hidden rounded-2xl border border-black/8 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
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
                <th className="px-5 py-4">{content.table.printStatus}</th>
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
                  onDetail={handleOpenDetail}
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
      <CardSelectionActions
        count={selectedIds.size}
        pending={isPending}
        content={content}
        onDelete={() => setDeleteTarget("selected")}
        onCancel={() => setSelectedIds(new Set())}
        onExport={exportSelectedCards}
        onMarkPrinted={() => void setSelectedCardsPrintStatus("printed")}
        onMarkUnprinted={() => void setSelectedCardsPrintStatus("unprinted")}
      />
      <AlertDialog cancelLabel={content.cancel} confirmLabel={content.delete} description={deleteTarget === "all" ? content.confirmDeleteAllUnused : content.confirmDeleteSelected} onConfirm={handleConfirmDelete} onOpenChange={(open) => !open && setDeleteTarget(undefined)} open={Boolean(deleteTarget)} title={deleteTarget === "all" ? content.deleteAllUnusedTitle : content.deleteSelectedTitle} />
      <CardDetailDialog
        cardDetail={detailData}
        content={{
          ...content.detailModal,
          pvc: content.pvc,
          acrylic: content.acrylic,
          claimed: content.claimed,
          unclaimed: content.unclaimed,
          enabled: content.enabled,
          disabled: content.disabled,
          printed: content.printed,
          unprinted: content.unprinted,
        }}
        isLoading={isDetailLoading}
        locale={locale}
        onClose={handleCloseDetail}
        open={Boolean(detailTargetId)}
      />
    </section>
  );
}
