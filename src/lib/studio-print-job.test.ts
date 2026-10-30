import assert from "node:assert/strict";
import { test } from "node:test";
import { printDocumentIds, runStudioPrintJob } from "./studio-print-job";

test("studio resolves public QR identifiers to actual inventory document identifiers", () => {
  const cards = [{ id: "firestore-random-id", cardId: "TQR-PUBLIC" }];
  assert.deepEqual(printDocumentIds(cards, ["TQR-PUBLIC", "TQR-PUBLIC"]), ["firestore-random-id"]);
  assert.throws(() => printDocumentIds(cards, ["missing"]), /PRINT_CARD_NOT_AVAILABLE/);
});

test("queue refresh runs only after the selected artwork has been printed", async () => {
  const actions: string[] = [];
  await runStudioPrintJob({ ids: ["inventory-id"], markAsPrinted: true,
    save: async (ids) => { actions.push(`saved:${ids[0]}`); return 1; },
    print: async () => { actions.push("printed-selected-artwork"); },
    refresh: async () => { actions.push("removed-from-queue"); },
  });
  assert.deepEqual(actions, ["saved:inventory-id", "printed-selected-artwork", "removed-from-queue"]);
});

test("failed or zero status updates do not print or claim success", async () => {
  let printed = false;
  let refreshed = false;
  await assert.rejects(runStudioPrintJob({ ids: ["missing"], markAsPrinted: true,
    save: async () => 0, print: async () => { printed = true; }, refresh: async () => { refreshed = true; },
  }), /PRINT_STATUS_NOT_UPDATED/);
  assert.equal(printed, false);
  assert.equal(refreshed, false);
});

test("print-only leaves inventory status and queue unchanged", async () => {
  const actions: string[] = [];
  await runStudioPrintJob({ ids: ["inventory-id"], markAsPrinted: false,
    save: async () => { actions.push("saved"); return 1; }, print: async () => { actions.push("printed"); },
    refresh: async () => { actions.push("refreshed"); },
  });
  assert.deepEqual(actions, ["printed"]);
});
