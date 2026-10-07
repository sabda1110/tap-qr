import { CardSelectionActions } from "../molecules/card-selection-actions";
import { useState, type FormEvent } from "react";
import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react";

import type { CardMaterial } from "../../lib/firebase/firestore-schema";
import type { MasterCard } from "../../server/cards/card.repository.server";
import { deleteAdminCard, deleteAdminCards, deleteAllUnusedAdminCards, generateAdminCards, getAdminCardMaster } from "../../server/cards/card.functions";
import { Button } from "../ui/button";
import { CustomInputText } from "../elements/custom-input-text";
import { AlertDialog } from "../ui/alert-dialog";
import { useToast } from "../ui/toaster";

type CardMasterContent = {
  kicker: string;
  title: string;
  description: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchAction: string;
  generateAction: string;
  generatorTitle: string;
  quantityLabel: string;
  materialLabel: string;
  acrylic: string;
  pvc: string;
  generateSubmit: string;
  cancel: string;
  table: { cardId: string; material: string; claimStatus: string; enabled: string; action: string };
  unclaimed: string;
  claimed: string;
  enabled: string;
  disabled: string;
  delete: string;
  deleteSelected: string;
  selectedCount: string;
  deleteAllUnused: string;
  selectAll: string;
  selectCard: string;
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

export function CardMasterSection({ content, initialPage }: { content: CardMasterContent; initialPage: CardPage }) {
  const { showToast } = useToast();
  const [draftQuery, setDraftQuery] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(initialPage);
  const [previousCursors, setPreviousCursors] = useState<Array<string | undefined>>([]);
  const [currentCursor, setCurrentCursor] = useState<string>();
  const [isGeneratorOpen, setGeneratorOpen] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [material, setMaterial] = useState<CardMaterial>("acrylic");
  const [isPending, setPending] = useState(false);
  const [notice, setNotice] = useState<string>();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<"selected" | "all" | string>();

  async function loadCards(nextQuery: string, cursor?: string, history: Array<string | undefined> = []) {
    setPending(true);
    setNotice(undefined);
    try {
      const response = await getAdminCardMaster({ data: { query: nextQuery, cursor } });
      setPage(response.page);
      setQuery(nextQuery);
      setCurrentCursor(cursor);
      setPreviousCursors(history);
      setSelectedIds(new Set());
    } catch {
      setNotice(content.requestError); showToast(content.requestError, "error");
    } finally {
      setPending(false);
    }
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadCards(draftQuery.trim());
  }

  async function submitGeneration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setNotice(undefined);
    try {
      await generateAdminCards({ data: { quantity: Number(quantity), material } });
      setGeneratorOpen(false);
      setNotice(content.generated); showToast(content.generated, "success");
      await loadCards(query);
    } catch {
      setNotice(content.requestError); showToast(content.requestError, "error");
      setPending(false);
    }
  }

  async function deleteCard(id: string) {
    setPending(true);
    setNotice(undefined);
    try {
      const deleted = await deleteAdminCard({ data: { id } });
      await loadCards(query, currentCursor, previousCursors);
      showToast(deleted ? content.deleteSuccess : content.deleteNoop, deleted ? "success" : "warning");
    } catch {
      setNotice(content.requestError); showToast(content.requestError, "error");
      setPending(false);
    }
  }

  async function deleteSelectedCards() {
    setPending(true);
    setNotice(undefined);
    try {
      const deleted = await deleteAdminCards({ data: { ids: [...selectedIds] } });
      await loadCards(query, currentCursor, previousCursors);
      showToast(deleted ? content.deleteSuccess : content.deleteNoop, deleted ? "success" : "warning");
    } catch {
      setNotice(content.requestError); showToast(content.requestError, "error");
      setPending(false);
    }
  }

  async function deleteAllUnusedCards() {
    setPending(true);
    setNotice(undefined);
    try {
      const deleted = await deleteAllUnusedAdminCards({ data: {} });
      await loadCards(query);
      showToast(deleted ? content.deleteSuccess : content.deleteNoop, deleted ? "success" : "warning");
    } catch {
      setNotice(content.requestError); showToast(content.requestError, "error");
      setPending(false);
    }
  }

  function toggleCard(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAllVisibleCards() {
    const unusedIds = page.cards.filter((card) => card.claimStatus === "unclaimed").map((card) => card.id);
    const isEveryUnusedCardSelected = unusedIds.every((id) => selectedIds.has(id));
    setSelectedIds(isEveryUnusedCardSelected ? new Set() : new Set(unusedIds));
  }

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
        <form className="mt-6 grid gap-4 rounded-2xl border border-[#bce8ef] bg-[#eaf9fb] p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end" onSubmit={submitGeneration}>
          <CustomInputText label={content.quantityLabel} min="1" max="100" onChange={(event) => setQuantity(event.target.value)} required type="number" value={quantity} />
          <label className="grid gap-2 text-sm font-semibold text-[#252a32]">
            {content.materialLabel}
            <select className="h-10 rounded-lg border border-black/12 bg-white px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#0798ad]" disabled={isPending} onChange={(event) => setMaterial(event.target.value as CardMaterial)} value={material}>
              <option value="acrylic">{content.acrylic}</option>
              <option value="pvc">{content.pvc}</option>
            </select>
          </label>
          <div className="flex gap-2">
            <Button className="h-10 bg-black px-4 text-white hover:bg-black/80" disabled={isPending} type="submit">{content.generateSubmit}</Button>
            <Button className="h-10 px-4" disabled={isPending} onClick={() => setGeneratorOpen(false)} type="button" variant="outline">{content.cancel}</Button>
          </div>
        </form>
      ) : null}

      <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={submitSearch}>
        <div className="min-w-0 flex-1"><CustomInputText icon={Search} label={content.searchLabel} onChange={(event) => setDraftQuery(event.target.value)} placeholder={content.searchPlaceholder} value={draftQuery} /></div>
        <Button className="h-10 self-end px-4" disabled={isPending} type="submit" variant="outline">{content.searchAction}</Button>
      </form>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button disabled={isPending} onClick={() => setDeleteTarget("all")} type="button" variant="destructive"><Trash2 />{content.deleteAllUnused}</Button>
      </div>

      <p aria-live="polite" className="mt-4 min-h-5 text-sm font-medium text-[#087e91]">{isPending ? content.loading : notice}</p>
      <div className="mt-2 overflow-hidden rounded-2xl border border-black/8 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[740px] text-left text-sm">
            <thead className="bg-[#f5f8fa] text-xs font-bold tracking-[0.08em] text-[#69737d] uppercase"><tr><th className="px-5 py-4"><input aria-label={content.selectAll} checked={page.cards.filter((card) => card.claimStatus === "unclaimed").length > 0 && page.cards.filter((card) => card.claimStatus === "unclaimed").every((card) => selectedIds.has(card.id))} disabled={isPending} onChange={toggleAllVisibleCards} type="checkbox" /></th><th className="px-5 py-4">{content.table.cardId}</th><th className="px-5 py-4">{content.table.material}</th><th className="px-5 py-4">{content.table.claimStatus}</th><th className="px-5 py-4">{content.table.enabled}</th><th className="px-5 py-4 text-right">{content.table.action}</th></tr></thead>
            <tbody>{page.cards.map((card) => <CardRow card={card} content={content} disabled={isPending} isSelected={selectedIds.has(card.id)} key={card.id} onDelete={(id) => setDeleteTarget(id)} onToggle={toggleCard} />)}</tbody>
          </table>
          {page.cards.length === 0 ? <p className="px-5 py-12 text-center text-sm text-[#69737d]">{content.empty}</p> : null}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-black/8 px-4 py-3">
          <Button disabled={isPending || previousCursors.length === 0} onClick={() => { const history = previousCursors.slice(0, -1); void loadCards(query, previousCursors.at(-1), history); }} type="button" variant="outline"><ChevronLeft />{content.previous}</Button>
          <Button disabled={isPending || !page.nextCursor} onClick={() => void loadCards(query, page.nextCursor, [...previousCursors, currentCursor])} type="button" variant="outline">{content.next}<ChevronRight /></Button>
        </div>
      </div>
      <CardSelectionActions count={selectedIds.size} pending={isPending} content={content} onDelete={() => setDeleteTarget("selected")} onCancel={() => setSelectedIds(new Set())} />
      <AlertDialog cancelLabel={content.cancel} confirmLabel={content.delete} description={deleteTarget === "all" ? content.confirmDeleteAllUnused : content.confirmDeleteSelected} onConfirm={() => { const target = deleteTarget; setDeleteTarget(undefined); if (target === "all") void deleteAllUnusedCards(); else if (target === "selected") void deleteSelectedCards(); else if (target) void deleteCard(target); }} onOpenChange={(open) => !open && setDeleteTarget(undefined)} open={Boolean(deleteTarget)} title={deleteTarget === "all" ? content.deleteAllUnusedTitle : content.deleteSelectedTitle} />
    </section>
  );
}

function CardRow({ card, content, disabled, isSelected, onDelete, onToggle }: { card: MasterCard; content: CardMasterContent; disabled: boolean; isSelected: boolean; onDelete: (id: string) => void; onToggle: (id: string) => void }) {
  const isUnused = card.claimStatus === "unclaimed";
  return <tr className="border-t border-black/6"><td className="px-5 py-4"><input aria-label={`${content.selectCard} ${card.cardId}`} checked={isSelected} disabled={disabled || !isUnused} onChange={() => onToggle(card.id)} type="checkbox" /></td><td className="px-5 py-4 font-bold text-[#172029]">{card.cardId}</td><td className="px-5 py-4">{card.material === "pvc" ? content.pvc : content.acrylic}</td><td className="px-5 py-4"><StatusBadge label={card.claimStatus === "claimed" ? content.claimed : content.unclaimed} /></td><td className="px-5 py-4"><StatusBadge label={card.isEnabled ? content.enabled : content.disabled} muted={!card.isEnabled} /></td><td className="px-5 py-4 text-right"><Button aria-label={`${content.delete} ${card.cardId}`} disabled={disabled || !isUnused} onClick={() => void onDelete(card.id)} size="icon-sm" type="button" variant="destructive"><Trash2 /></Button></td></tr>;
}

function StatusBadge({ label, muted = false }: { label: string; muted?: boolean }) {
  return <span className={muted ? "rounded-full bg-[#f1f3f5] px-2.5 py-1 text-xs font-bold text-[#69737d]" : "rounded-full bg-[#eaf9fb] px-2.5 py-1 text-xs font-bold text-[#087e91]"}>{label}</span>;
}
