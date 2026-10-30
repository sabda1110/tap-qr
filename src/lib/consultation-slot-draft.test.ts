import assert from "node:assert/strict";
import { test } from "node:test";
import { consultationSlotDraft } from "./consultation-slot-draft";
import { defaultConsultationSettings, type ConsultationSlot } from "../server/consultations/consultation.types";

const now = Date.parse("2026-11-01T00:00:00Z");
test("schedule preview deduplicates repeat dates and displays the exact WIB intervals to be saved", () => {
  const draft = consultationSlotDraft(["2026-11-07", "2026-11-14"], ["10:00", "13:00"], 1, defaultConsultationSettings, [], now);
  assert.equal(draft.length, 6);
  assert.equal(draft[0].startAt, "2026-11-07T03:00:00.000Z");
  assert.equal(draft[0].endAt, "2026-11-07T03:30:00.000Z");
  assert.equal(draft.at(-1)?.date, "2026-11-21");
  assert.ok(draft.every((slot) => slot.issue === null));
});
test("schedule preview flags existing slots, cutoff failures, and repeated dates outside the server horizon", () => {
  const existing: ConsultationSlot = { id: "20261101-1100", date: "2026-11-01", startAt: "2026-11-01T04:00:00Z", endAt: "2026-11-01T04:30:00Z", status: "ditutup", bookingId: null, createdAt: new Date(now).toISOString() };
  const draft = consultationSlotDraft(["2026-11-01"], ["09:30", "10:00", "11:00"], 0, defaultConsultationSettings, [existing], now);
  assert.deepEqual(draft.map((slot) => slot.issue), ["tooSoon", null, "exists"]);
  const future = consultationSlotDraft(["2027-10-30"], ["10:00"], 1, defaultConsultationSettings, [], now);
  assert.deepEqual(future.map((slot) => slot.issue), [null, "tooFar"]);
});
