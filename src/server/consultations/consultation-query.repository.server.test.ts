import assert from "node:assert/strict";
import { test } from "node:test";
import { waitingConsultationBookings } from "./consultation-query.repository.server";
import { listPendingConsultationNotifications } from "./consultation-notifications.repository.server";
import { createConsultation, listConsultationBookings } from "./consultation.repository.server";
import { runConsultationMaintenance } from "./consultation-maintenance.server";
import { bookingInput, fixtureNow, seedSlots, withConsultations } from "./consultation-test-fixture";

const missingIndex = () => Object.assign(new Error("The query requires an index"), { code: 9 });

test("missing consultation index preserves deadline priority before limiting and keeps maintenance running", async () => {
  await withConsultations(async (fixture) => {
    const [slot] = seedSlots(fixture);
    const id = await createConsultation(bookingInput(slot.id));
    assert.equal((await listConsultationBookings())[0].id, id);
    fixture.setTime(Date.parse(fixture.booking(id).deadlineAt));
    assert.equal((await runConsultationMaintenance({ dispatch: false })).expired, 1);
    assert.equal(fixture.booking(id).status, "dibatalkan_otomatis");
    for (let index = 0; index < 501; index++) {
      fixture.documents.set(`consultationBookings/pending-${index}`, {
        status: "menunggu", deadlineAt: new Date(fixtureNow + (501 - index) * 60_000).toISOString(),
      });
    }
    const waiting = await waitingConsultationBookings();
    assert.equal(waiting.length, 500);
    assert.equal(waiting[0].id, "pending-500");
    assert.equal(waiting.some((doc) => doc.id === "pending-0"), false);
  }, missingIndex());
});

test("missing outbox index only selects pending due events in retry order", async () => {
  await withConsultations(async (fixture) => {
    const now = new Date().getTime();
    const at = (offset: number) => new Date(now + offset).toISOString();
    fixture.documents.set("consultationNotifications/sent", { status: "sent", nextAttemptAt: at(-100) });
    fixture.documents.set("consultationNotifications/future", { status: "pending", nextAttemptAt: at(3_600_000) });
    for (let index = 0; index < 21; index++) {
      fixture.documents.set(`consultationNotifications/due-${index}`, { status: "pending", nextAttemptAt: at(-index - 1) });
    }
    const ids = await listPendingConsultationNotifications();
    assert.equal(ids.length, 20);
    assert.equal(ids[0], "due-20");
    assert.equal(ids.includes("future"), false);
    assert.equal(ids.includes("sent"), false);
    assert.equal(ids.includes("due-0"), false);
  }, missingIndex());
});

test("consultation fallback does not hide permission or connectivity errors", async () => {
  const denied = Object.assign(new Error("Permission denied"), { code: 7 });
  await withConsultations(async () => {
    await assert.rejects(waitingConsultationBookings(), denied);
    await assert.rejects(listPendingConsultationNotifications(), denied);
  }, denied);
});
