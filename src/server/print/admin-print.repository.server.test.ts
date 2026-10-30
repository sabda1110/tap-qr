import assert from "node:assert/strict";
import { test } from "node:test";
import { withConsultations } from "../consultations/consultation-test-fixture";
import { getCardPrintDetail, listCardsForPrint } from "./admin-print.repository.server";
import { updateCardsPrintStatus } from "../cards/card.repository.server";

test("print inventory carries Firestore IDs while QR detail lookup uses public card IDs", async () => withConsultations(async (fixture) => {
  const cardId = `TQR-${"A".repeat(32)}`;
  fixture.documents.set("cards/random-firestore-id", { cardId, claimStatus: "unclaimed", material: "acrylic", print: { status: "unprinted" } });
  const cards = await listCardsForPrint();
  assert.equal(cards[0].id, "random-firestore-id");
  assert.equal(cards[0].cardId, cardId);
  assert.equal((await getCardPrintDetail(cardId))?.id, "random-firestore-id");
  await assert.rejects(updateCardsPrintStatus([cardId], "printed", "admin"), /CARD_PRINT_UPDATE_CONFLICT/);
  assert.deepEqual(fixture.documents.get("cards/random-firestore-id")?.print, { status: "unprinted" });
  assert.equal(await updateCardsPrintStatus([cards[0].id, cards[0].id], "printed", "admin"), 1);
  const stored = fixture.documents.get("cards/random-firestore-id")?.print as { status: string; printedBy: string };
  assert.equal(stored.status, "printed");
  assert.equal(stored.printedBy, "admin");
  assert.equal((await listCardsForPrint()).length, 0);
}));

test("a missing or newly claimed card rejects the entire print status batch", async () => withConsultations(async (fixture) => {
  fixture.documents.set("cards/available", { claimStatus: "unclaimed", print: { status: "unprinted" } });
  fixture.documents.set("cards/claimed", { claimStatus: "claimed", print: { status: "unprinted" } });
  const before = structuredClone([...fixture.documents]);
  for (const id of ["claimed", "missing"]) {
    await assert.rejects(updateCardsPrintStatus(["available", id], "printed", "admin"), /CARD_PRINT_UPDATE_CONFLICT/);
    assert.deepEqual([...fixture.documents], before);
  }
}));
