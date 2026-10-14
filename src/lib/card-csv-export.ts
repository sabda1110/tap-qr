import type { MasterCard } from "../server/cards/card.repository.server";

const cardUrlBase = "https://tapqr.id/id";

export function createCardsCsv(cards: MasterCard[]) {
  const rows = cards.map((card, index) => [
    card.cardId,
    `${cardUrlBase}/${encodeURIComponent(card.cardId)}`,
    `=IMAGE("https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" & ENCODEURL(B${index + 2}))`,
    card.material,
  ]);
  return [["card_id", "qr_url", "qr_image", "material"], ...rows]
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
