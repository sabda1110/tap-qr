type PrintInventoryCard = { id: string; cardId: string };

/** Printed QR codes use public card IDs; inventory writes use Firestore document IDs. */
export function printDocumentIds(cards: PrintInventoryCard[], cardIds: string[]) {
  const selected = [...new Set(cardIds)];
  if (!selected.length) throw new Error("PRINT_CARD_NOT_AVAILABLE");
  return selected.map((cardId) => {
    const card = cards.find((card) => card.cardId === cardId);
    if (!card?.id) throw new Error("PRINT_CARD_NOT_AVAILABLE");
    return card.id;
  });
}

export async function runStudioPrintJob({ ids, markAsPrinted, save, print, refresh }: {
  ids: string[]; markAsPrinted: boolean;
  save: (ids: string[]) => Promise<number>;
  print: () => Promise<void>;
  refresh: () => Promise<void>;
}) {
  if (markAsPrinted && await save(ids) !== ids.length) throw new Error("PRINT_STATUS_NOT_UPDATED");
  // Refresh removes printed cards from the queue: keep their artwork mounted until print returns.
  await print();
  if (markAsPrinted) await refresh();
}
