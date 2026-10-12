import { useState, type FormEvent } from "react";

import type { CardMaterial } from "../lib/firebase/firestore-schema";
import type { MasterCard } from "../server/cards/card.repository.server";
import type { CardClaimFilter } from "../server/cards/card.schemas";
import { downloadCardsCsv } from "../lib/card-csv-export";
import {
  deleteAdminCard,
  deleteAdminCards,
  deleteAllUnusedAdminCards,
  generateAdminCards,
  getAdminCardMaster,
  updateAdminCardsPrintStatus,
} from "../server/cards/card.functions";
import { useToast } from "../components/ui/toaster";

export type CardPage = { cards: MasterCard[]; nextCursor?: string };

type UseCardMasterOptions = {
  initialPage: CardPage;
  initialStatus?: CardClaimFilter;
  initialQuery?: string;
  requestErrorText: string;
  generatedText: string;
  deleteSuccessText: string;
  deleteNoopText: string;
  exportSuccessText: string;
  printStatusSuccessText: string;
};

export function useCardMaster({
  initialPage,
  initialStatus = "all",
  initialQuery = "",
  requestErrorText,
  generatedText,
  deleteSuccessText,
  deleteNoopText,
  exportSuccessText,
  printStatusSuccessText,
}: UseCardMasterOptions) {
  const { showToast } = useToast();
  const [draftQuery, setDraftQuery] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<CardClaimFilter>(initialStatus);
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

  async function loadCards(
    nextQuery: string,
    cursor?: string,
    history: Array<string | undefined> = [],
    nextStatus: CardClaimFilter = status
  ) {
    setPending(true);
    setNotice(undefined);
    try {
      const response = await getAdminCardMaster({
        data: { query: nextQuery, cursor, status: nextStatus },
      });
      setPage(response.page);
      setQuery(nextQuery);
      setStatus(nextStatus);
      setCurrentCursor(cursor);
      setPreviousCursors(history);
      setSelectedIds(new Set());
    } catch {
      setNotice(requestErrorText);
      showToast(requestErrorText, "error");
    } finally {
      setPending(false);
    }
  }

  function handleFilterChange(nextStatus: CardClaimFilter) {
    if (nextStatus === status || isPending) return;
    setStatus(nextStatus);
    void loadCards(query, undefined, [], nextStatus);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadCards(draftQuery.trim(), undefined, [], status);
  }

  async function submitGeneration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setNotice(undefined);
    try {
      await generateAdminCards({ data: { quantity: Number(quantity), material } });
      setGeneratorOpen(false);
      setNotice(generatedText);
      showToast(generatedText, "success");
      await loadCards(query, undefined, [], status);
    } catch {
      setNotice(requestErrorText);
      showToast(requestErrorText, "error");
      setPending(false);
    }
  }

  async function deleteCard(id: string) {
    setPending(true);
    setNotice(undefined);
    try {
      const deleted = await deleteAdminCard({ data: { id } });
      await loadCards(query, currentCursor, previousCursors, status);
      showToast(deleted ? deleteSuccessText : deleteNoopText, deleted ? "success" : "warning");
    } catch {
      setNotice(requestErrorText);
      showToast(requestErrorText, "error");
      setPending(false);
    }
  }

  async function deleteSelectedCards() {
    setPending(true);
    setNotice(undefined);
    try {
      const deleted = await deleteAdminCards({ data: { ids: [...selectedIds] } });
      await loadCards(query, currentCursor, previousCursors, status);
      showToast(deleted ? deleteSuccessText : deleteNoopText, deleted ? "success" : "warning");
    } catch {
      setNotice(requestErrorText);
      showToast(requestErrorText, "error");
      setPending(false);
    }
  }

  async function deleteAllUnusedCards() {
    setPending(true);
    setNotice(undefined);
    try {
      const deleted = await deleteAllUnusedAdminCards({ data: {} });
      await loadCards(query, undefined, [], status);
      showToast(deleted ? deleteSuccessText : deleteNoopText, deleted ? "success" : "warning");
    } catch {
      setNotice(requestErrorText);
      showToast(requestErrorText, "error");
      setPending(false);
    }
  }

  function exportSelectedCards() {
    const selectedCards = page.cards.filter(
      (card) => selectedIds.has(card.id) && card.claimStatus === "unclaimed",
    );
    if (selectedCards.length === 0) return;
    downloadCardsCsv(selectedCards);
    showToast(exportSuccessText, "success");
  }

  async function setSelectedCardsPrintStatus(printStatus: "unprinted" | "printed") {
    setPending(true);
    setNotice(undefined);
    try {
      const updated = await updateAdminCardsPrintStatus({
        data: { ids: [...selectedIds], status: printStatus },
      });
      await loadCards(query, currentCursor, previousCursors, status);
      showToast(updated ? printStatusSuccessText : deleteNoopText, updated ? "success" : "warning");
    } catch {
      setNotice(requestErrorText);
      showToast(requestErrorText, "error");
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

  function handleConfirmDelete() {
    const target = deleteTarget;
    setDeleteTarget(undefined);
    if (target === "all") void deleteAllUnusedCards();
    else if (target === "selected") void deleteSelectedCards();
    else if (target) void deleteCard(target);
  }

  function handlePreviousPage() {
    const history = previousCursors.slice(0, -1);
    void loadCards(query, previousCursors.at(-1), history, status);
  }

  function handleNextPage() {
    if (!page.nextCursor) return;
    void loadCards(query, page.nextCursor, [...previousCursors, currentCursor], status);
  }

  return {
    draftQuery,
    setDraftQuery,
    query,
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
    exportSelectedCards,
    setSelectedCardsPrintStatus,
  };
}
