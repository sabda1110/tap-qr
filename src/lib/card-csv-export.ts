import type { MasterCard } from "../server/cards/card.repository.server";

const cardUrlBase = "https://tapqr.id/id";

export function createCardsCsv(cards: MasterCard[]) {
  const rows = cards.map((card) => [
    card.cardId,
    `${cardUrlBase}/${encodeURIComponent(card.cardId)}`,
    card.material,
  ]);
  return [["card_id", "qr_url", "material"], ...rows]
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\r\n");
}

export function downloadCardsCsv(cards: MasterCard[]) {
  const blob = new Blob(["\uFEFF", createCardsCsv(cards)], {
    type: "text/csv;charset=utf-8",
  });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `tapqr-cards-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(downloadUrl);
}

function escapeCsvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
