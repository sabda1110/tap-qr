import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { useRouter } from "@tanstack/react-router";
import { useToast } from "../ui/toaster";
import { updateAdminCardsPrintStatus } from "../../server/cards/card.functions";
import { getCardUrl } from "../../lib/app-url";
import type { PrintThemeKey } from "../elements/nfc-tap-target";
import { type PrintDimensions, PrintSizeSelector } from "../elements/print-size-selector";
import { PrintStudioStyles } from "../elements/print-studio-styles";
import { AdminPrintPreview } from "../molecules/admin-print-preview";
import { AdminPrintStudioHeader } from "../molecules/admin-print-studio-header";
import { BulkCardSelector } from "../molecules/bulk-card-selector";
import { BulkPrintPreviewGrid } from "../molecules/bulk-print-preview-grid";
import { PrintCardFormControls } from "../molecules/print-card-form-controls";
import { PrintConfirmationDialog } from "../molecules/print-confirmation-dialog";
import type { AdminPrintStudioProps } from "./admin-print-studio.types";
import type { CardMaterial } from "../../lib/firebase/firestore-schema";
import { PVC_WIDTH_MM, PVC_HEIGHT_MM } from "../../lib/print-dimensions";
export type { AdminPrintStudioContent, AdminPrintStudioProps } from "./admin-print-studio.types";
function getMaterialDimensions(material: CardMaterial): PrintDimensions {
  return material === "pvc"
    ? { preset: "custom", widthMm: PVC_WIDTH_MM, heightMm: PVC_HEIGHT_MM }
    : { preset: "a7", widthMm: 74, heightMm: 105 };
}
export function AdminPrintStudio({ cards, initialCard, content, locale }: AdminPrintStudioProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [selectedCardId, setSelectedCardId] = useState(
    initialCard?.cardId || cards[0]?.cardId || "",
  );
  const initialMaterial = initialCard?.material ?? cards[0]?.material ?? "acrylic";
  const [selectedBulkCardIds, setSelectedBulkCardIds] = useState<string[]>(
    cards.slice(0, 6).map((c) => c.cardId),
  );
  const [theme, setTheme] = useState<PrintThemeKey>("google");
  const [showMonster, setShowMonster] = useState(true);
  const [showCropMarks, setShowCropMarks] = useState(false);
  const [dimensions, setDimensions] = useState<PrintDimensions>(() => getMaterialDimensions(initialMaterial));
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [preHeadline, setPreHeadline] = useState(content.themes.google.defaultPreHeadline);
  const [headline, setHeadline] = useState(content.themes.google.defaultHeadline);
  const [footerNote, setFooterNote] = useState(content.themes.google.defaultFooter);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const selectedCard = cards.find((card) => card.cardId === selectedCardId)
    ?? (initialCard?.cardId === selectedCardId ? initialCard : null);
  const selectedMaterial = selectedCard?.material ?? "acrylic";
  useEffect(() => {
    if (cards.length > 0 && !cards.some((c) => c.cardId === selectedCardId)) {
      setSelectedCardId(cards[0].cardId);
    }
  }, [cards, selectedCardId]);
  useEffect(() => {
    setSelectedBulkCardIds((prev) =>
      prev.filter((id) => cards.some((c) => c.cardId === id)),
    );
  }, [cards]);
  useEffect(() => {
    setDimensions(getMaterialDimensions(selectedMaterial));
  }, [selectedMaterial]);
  const handleSelectTheme = (newTheme: PrintThemeKey) => {
    setTheme(newTheme);
    const defaults = content.themes[newTheme];
    setPreHeadline(defaults.defaultPreHeadline);
    setHeadline(defaults.defaultHeadline);
    setFooterNote(defaults.defaultFooter);
  };

  const handleResetDefaults = () => {
    const defaults = content.themes[theme];
    setPreHeadline(defaults.defaultPreHeadline);
    setHeadline(defaults.defaultHeadline);
    setFooterNote(defaults.defaultFooter);
  };

  useEffect(() => {
    if (!selectedCardId) {
      setQrDataUrl("");
      return;
    }
    const cardTargetUrl = getCardUrl(locale, selectedCardId);
    void QRCode.toDataURL(cardTargetUrl, {
      margin: 1,
      width: 320,
      color: { dark: "#000000", light: "#ffffff" },
      errorCorrectionLevel: "M",
    }).then(setQrDataUrl);
  }, [selectedCardId, locale]);

  const handleOpenConfirmDialog = useCallback(() => {
    setConfirmDialogOpen(true);
  }, []);

  const handleConfirmPrint = async (markAsPrinted: boolean) => {
    const ids =
      activeTab === "single"
        ? selectedCardId
          ? [selectedCardId]
          : []
        : selectedBulkCardIds;

    if (ids.length === 0) return;

    if (!markAsPrinted) {
      setConfirmDialogOpen(false);
      window.setTimeout(() => {
        window.print();
      }, 150);
      return;
    }

    setIsUpdatingStatus(true);
    try {
      await updateAdminCardsPrintStatus({
        data: {
          ids,
          status: "printed",
        },
      });
      showToast(
        content.toastPrintSuccess.replace("{count}", String(ids.length)),
        "success",
      );
      setConfirmDialogOpen(false);
      await router.invalidate();
      window.setTimeout(() => {
        window.print();
      }, 150);
    } catch (error) {
      console.error("Failed to update card print status", error);
      showToast(content.toastPrintFailure, "error");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleToggleBulkCard = (cardId: string) => {
    setSelectedBulkCardIds((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId],
    );
  };

  const sizeText =
    dimensions.preset === "custom"
      ? `${dimensions.widthMm}×${dimensions.heightMm} mm`
      : dimensions.preset.toUpperCase();

  const isPrintDisabled =
    activeTab === "single"
      ? !selectedCardId || cards.length === 0
      : selectedBulkCardIds.length === 0;

  return (
    <section className="space-y-6">
      <PrintStudioStyles activeTab={activeTab} dimensions={dimensions} material={selectedMaterial} />

      <AdminPrintStudioHeader
        kicker={content.kicker}
        title={content.title}
        description={content.description}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        printNowLabel={content.printNow}
        tabSingleLabel={content.tabSingle}
        tabBulkLabel={content.tabBulk}
        isPrintDisabled={isPrintDisabled}
        onPrintClick={handleOpenConfirmDialog}
      />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="space-y-4 rounded-3xl border border-black/8 bg-[#f5f7f8] p-3 shadow-xs sm:p-4 lg:col-span-5 xl:col-span-4">
          <PrintSizeSelector
            dimensions={dimensions}
            onChangeDimensions={setDimensions}
            showCropMarks={showCropMarks}
            onToggleCropMarks={setShowCropMarks}
            labels={{
              sizeLabel: content.sizeLabel,
              sizePresetA7: content.sizePresetA7,
              sizePresetA6: content.sizePresetA6,
              sizePresetA5: content.sizePresetA5,
              sizePresetCustom: content.sizePresetCustom,
              customWidthLabel: content.customWidthLabel,
              customHeightLabel: content.customHeightLabel,
              cropMarksLabel: content.cropMarksLabel,
              cropMarksHelp: content.cropMarksHelp,
              sizeHelp: content.sizeHelp,
            }}
          />

          {activeTab === "bulk" && (
            <BulkCardSelector
              cards={cards}
              selectedCardIds={selectedBulkCardIds}
              onToggleCard={handleToggleBulkCard}
              onSelectAll={setSelectedBulkCardIds}
              labels={{
                filterAll: content.bulkFilterAll,
                selectAll: content.bulkSelectAll,
                deselectAll: content.bulkDeselectAll,
                selectedCount: content.bulkSelectedCount,
                searchPlaceholder: content.searchCardPlaceholder,
              }}
            />
          )}

          <PrintCardFormControls
            cards={cards}
            selectedCardId={selectedCardId}
            onSelectCardId={setSelectedCardId}
            hideCardSelect={activeTab === "bulk"}
            theme={theme}
            onSelectTheme={handleSelectTheme}
            showMonster={showMonster}
            onToggleMonster={setShowMonster}
            preHeadline={preHeadline}
            onChangePreHeadline={setPreHeadline}
            headline={headline}
            onChangeHeadline={setHeadline}
            footerNote={footerNote}
            onChangeFooterNote={setFooterNote}
            onResetDefaults={handleResetDefaults}
            labels={{
              selectCardLabel: content.selectCardLabel,
              chooseThemeLabel: content.chooseThemeLabel,
              showMonsterLabel: content.showMonsterLabel,
              preHeadlineLabel: content.preHeadlineLabel,
              headlineLabel: content.headlineLabel,
              footerNoteLabel: content.footerNoteLabel,
              resetDefaults: content.resetDefaults,
              cardStatusUnprinted: content.cardStatusUnprinted,
              emptyCardLabel: content.emptyCardLabel,
              themeHelp: content.themeHelp,
              mascotHelp: content.mascotHelp,
              copySectionTitle: content.copySectionTitle,
              copySectionDescription: content.copySectionDescription,
              themes: content.themes,
            }}
          />
        </div>

        <div className="lg:col-span-7 xl:col-span-8">
          {activeTab === "single" ? (
            <AdminPrintPreview
              labels={content.printLabels}
              cardId={selectedCardId}
              dimensions={dimensions}
              showCropMarks={showCropMarks}
              footerNote={footerNote}
              headline={headline}
              preHeadline={preHeadline}
              previewTitle={selectedMaterial === "pvc" ? content.pvcPreviewTitle : content.previewTitle}
              material={selectedMaterial}
              qrDataUrl={qrDataUrl}
              showMonster={showMonster}
              theme={theme}
            />
          ) : (
            <BulkPrintPreviewGrid
              labels={content.printLabels}
              cardIds={selectedBulkCardIds}
              cardMaterials={Object.fromEntries(cards.map((card) => [card.cardId, card.material]))}
              theme={theme}
              dimensions={dimensions}
              showMonster={showMonster}
              showCropMarks={showCropMarks}
              preHeadline={preHeadline}
              headline={headline}
              footerNote={footerNote}
              locale={locale}
              onPrintBulk={handleOpenConfirmDialog}
              printHint={content.printPdfHint}
            />
          )}
        </div>
      </div>

      <PrintConfirmationDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmPrint}
        isPending={isUpdatingStatus}
        activeTab={activeTab}
        cardCount={selectedBulkCardIds.length}
        singleCardId={selectedCardId}
        sizeText={sizeText}
        labels={{
          title: content.confirmDialogTitle,
          descriptionSingle: content.confirmDialogDescriptionSingle,
          descriptionBulk: content.confirmDialogDescriptionBulk,
          statusNotice: content.confirmDialogStatusNotice,
          printOnly: content.confirmDialogPrintOnly,
          printAndMark: content.confirmDialogPrintAndMark,
          cancel: content.confirmDialogCancel,
        }}
      />
    </section>
  );
}
