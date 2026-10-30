import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { createConsultation } from "./consultation.repository.server";
import { changeConsultationBooking } from "./consultation-actions.repository.server";
import { runConsultationMaintenance } from "./consultation-maintenance.server";
import { dispatchConsultationNotifications } from "./consultation-notifications.server";
import { claimConsultationNotification, finishConsultationNotification, markConsultationChannelSent } from "./consultation-notifications.repository.server";
import { bookingInput, fixtureNow, seedSlots, withConsultations } from "./consultation-test-fixture";
import type { ConsultationNotificationRecord } from "./consultation-notification.types";

const delivery = require("./consultation-notification-delivery.server") as typeof import("./consultation-notification-delivery.server");

test("notification failure retains a committed booking; retries send only unfinished channels", async () => withConsultations(async (fixture) => {
  const [slot] = seedSlots(fixture);
  const id = await createConsultation(bookingInput(slot.id));
  const warning = mock.method(console, "warn", () => undefined);
  const telegram = mock.method(delivery, "sendConsultationTelegram", async () => "sent" as const);
  const email = mock.method(delivery, "sendConsultationEmail", async () => "unavailable" as const);
  try {
    await Promise.all([dispatchConsultationNotifications(id), dispatchConsultationNotifications(id)]);
    assert.equal(fixture.booking(id).status, "menunggu");
    assert.equal(fixture.booking(id).notificationPending, true);
    assert.equal(telegram.mock.callCount(), 1, "the lease must prevent parallel duplicate sends");
    assert.equal(email.mock.callCount(), 1);
    assert.equal(fixture.documents.get(`consultationNotifications/${id}-new-0`)?.telegramSent, true);
    email.mock.mockImplementation(async () => "sent" as const);
    await dispatchConsultationNotifications(id);
    assert.equal(telegram.mock.callCount(), 1, "already successful Telegram must not repeat on email retry");
    assert.equal(email.mock.callCount(), 2);
    assert.equal(fixture.booking(id).notificationPending, false);
    assert.equal(fixture.documents.get(`consultationNotifications/${id}-new-0`)?.status, "sent");
    await dispatchConsultationNotifications(id);
    assert.equal(email.mock.callCount(), 2);
  } finally { telegram.mock.restore(); email.mock.restore(); warning.mock.restore(); }
}));

test("reminders are queued once at six and one hours before deadline and expiry is idempotent", async () => withConsultations(async (fixture) => {
  const [slot] = seedSlots(fixture);
  const id = await createConsultation(bookingInput(slot.id));
  const deadline = Date.parse(fixture.booking(id).deadlineAt);
  fixture.setTime(deadline - 6 * 3_600_000);
  assert.deepEqual(await runConsultationMaintenance({ dispatch: false }), { expired: 0, reminders: 1 });
  assert.deepEqual(await runConsultationMaintenance({ dispatch: false }), { expired: 0, reminders: 0 });
  assert.equal(fixture.booking(id).reminder6Queued, true);
  fixture.setTime(deadline - 3_600_000);
  const runs = await Promise.all([runConsultationMaintenance({ dispatch: false }), runConsultationMaintenance({ dispatch: false })]);
  assert.equal(runs.reduce((total, run) => total + run.reminders, 0), 1);
  assert.equal(fixture.booking(id).reminder1Queued, true);
  fixture.setTime(deadline);
  assert.deepEqual(await runConsultationMaintenance({ dispatch: false }), { expired: 1, reminders: 0 });
  assert.deepEqual(await runConsultationMaintenance({ dispatch: false }), { expired: 0, reminders: 0 });
  assert.equal(fixture.booking(id).status, "dibatalkan_otomatis");
  assert.equal(fixture.documents.has(`consultationNotifications/${id}-cancelled-1`), true);
  assert.equal(await claimConsultationNotification(`${id}-reminder6-0`, true), null);
  assert.equal(await claimConsultationNotification(`${id}-reminder1-0`, true), null);
}));

test("reminders already past at booking creation are skipped", async () => withConsultations(async (fixture) => {
  const [slot] = seedSlots(fixture, "2026-11-01", ["12:00"]);
  const id = await createConsultation(bookingInput(slot.id));
  assert.deepEqual(await runConsultationMaintenance({ dispatch: false }), { expired: 0, reminders: 0 });
  fixture.setTime(fixtureNow + 2 * 3_600_000);
  assert.deepEqual(await runConsultationMaintenance({ dispatch: false }), { expired: 0, reminders: 1 });
  assert.equal(fixture.booking(id).reminder6Queued, false);
  assert.equal(fixture.booking(id).reminder1Queued, true);
}));

test("rescheduling skips obsolete reminders and old in-flight notification cannot mark the new reminder delivered", async () => withConsultations(async (fixture) => {
  const [first] = seedSlots(fixture);
  const [target] = seedSlots(fixture, "2026-11-02", ["07:00"]);
  const id = await createConsultation(bookingInput(first.id));
  const reminderAt = Date.parse(fixture.booking(id).deadlineAt) - 6 * 3_600_000;
  fixture.setTime(reminderAt);
  await runConsultationMaintenance({ dispatch: false });
  const notificationId = `${id}-reminder6-0`;
  const inFlight = await claimConsultationNotification(notificationId, true);
  assert.ok(inFlight);
  await changeConsultationBooking({ id, action: "reschedule", slotId: target.id });
  await markConsultationChannelSent(notificationId, inFlight.leaseId!, "telegram");
  await finishConsultationNotification(notificationId, inFlight.leaseId!);
  assert.equal(fixture.booking(id).reminder6Sent, false);
  assert.deepEqual(await runConsultationMaintenance({ dispatch: false }), { expired: 0, reminders: 0 });
  assert.equal(fixture.booking(id).reminder6Queued, false, "the earlier deadline's six-hour reminder passed before rescheduling");
  assert.equal(fixture.booking(id).notificationPending, true, "new and rescheduled notifications remain pending");
}));

test("confirmation suppresses unsent reminders, and passing the deadline suppresses late delivery", async () => withConsultations(async (fixture) => {
  const [first, second] = seedSlots(fixture);
  const id = await createConsultation(bookingInput(first.id));
  const secondId = await createConsultation(bookingInput(second.id, "b"));
  fixture.setTime(Date.parse(fixture.booking(secondId).deadlineAt) - 6 * 3_600_000);
  await runConsultationMaintenance({ dispatch: false });
  await changeConsultationBooking({ id, action: "confirm" });
  assert.equal(await claimConsultationNotification(`${id}-reminder6-0`, true), null);
  fixture.setTime(Date.parse(fixture.booking(secondId).deadlineAt));
  assert.equal(await claimConsultationNotification(`${secondId}-reminder6-0`, true), null);
}));

test("notification copy uses WIB, omits access tokens, and sanitizes control characters", async () => withConsultations(async (fixture) => {
  const [slot] = seedSlots(fixture);
  const input = bookingInput(slot.id);
  const id = await createConsultation(input);
  const record = fixture.documents.get(`consultationNotifications/${id}-new-0`) as unknown as ConsultationNotificationRecord;
  const original = process.env.CONSULTATION_APP_URL;
  process.env.CONSULTATION_APP_URL = "https://example.com";
  try {
    record.booking.name = "Test\nInjected\u202eVisitor";
    const text = delivery.consultationNotificationText(record)!;
    assert.ok(text.includes("WIB"));
    assert.ok(text.includes("https://wa.me/6281234567890"));
    assert.ok(text.includes("https://example.com/id/dashboard/admin/consultations"));
    assert.equal(text.includes(input.statusToken), false);
    assert.equal(text.includes(input.cancelToken), false);
    assert.equal(text.includes("\u202e"), false);
    assert.ok(text.includes("Nama: Test Injected Visitor"));
  } finally {
    if (original === undefined) delete process.env.CONSULTATION_APP_URL;
    else process.env.CONSULTATION_APP_URL = original;
  }
}));
