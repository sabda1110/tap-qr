import { randomUUID } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import { assertOutletOwnerAccess, dayRef, notificationCopy } from "./queue.repository.server";
import { isQueueAddonActive, queueDateKey } from "./queue-access";
import type { OwnerQueueStatusValues, QueueStatus } from "./queue.schemas";

const transitions: Record<QueueStatus, QueueStatus[]> = {
  waiting: ["called", "cancelled", "no_show"],
  called: ["serving", "waiting", "cancelled", "no_show"],
  serving: ["completed", "cancelled"],
  completed: [],
  no_show: [],
  cancelled: [],
};

export async function setOwnerQueueStatus(ownerId: string, input: OwnerQueueStatusValues) {
  await assertOutletOwnerAccess(ownerId, input.outletId);
  if (input.dateKey !== queueDateKey()) throw new Error("QUEUE_DAY_EXPIRED");
  const database = getFirebaseAdminFirestore();
  const outletReference = database.collection("outlets").doc(input.outletId);
  const dayReference = dayRef(input.outletId, input.dateKey);
  const ticketReference = dayReference.collection("tickets").doc(input.ticketId);
  const targetStationReference = input.status === "serving"
    ? dayReference.collection("stations").doc(String(input.stationNumber))
    : null;
  const notificationId = randomUUID();

  return database.runTransaction(async (transaction) => {
    const [outlet, ticket, day] = await Promise.all([
      transaction.get(outletReference), transaction.get(ticketReference), transaction.get(dayReference),
    ]);
    if (!outlet.exists || outlet.data()?.status !== "active" || !isQueueAddonActive(outlet.data()?.addons?.queue)) {
      throw new Error("QUEUE_NOT_ENABLED");
    }
    if (!ticket.exists) throw new Error("QUEUE_TICKET_NOT_FOUND");
    const ticketData = ticket.data()!;
    const current = ticketData.status as QueueStatus;
    const assigningServingStation = current === "serving" && input.status === "serving" && input.stationNumber !== undefined;
    if (!transitions[current]?.includes(input.status) && !assigningServingStation) throw new Error("QUEUE_STATUS_INVALID");

    const stationCount = Math.max(1, Math.min(20, Number(outlet.data()?.addons?.queue?.stationCount ?? 3)));
    if (input.status === "serving" && (!input.stationNumber || input.stationNumber > stationCount)) {
      throw new Error("QUEUE_STATION_INVALID");
    }
    const targetStation = targetStationReference ? await transaction.get(targetStationReference) : null;
    const targetTicketId = targetStation?.data()?.ticketId;
    if (targetTicketId && targetTicketId !== input.ticketId) throw new Error("QUEUE_STATION_OCCUPIED");

    const oldStationNumber = current === "serving" ? Number(ticketData.stationNumber) : 0;
    const oldStationReference = oldStationNumber > 0
      ? dayReference.collection("stations").doc(String(oldStationNumber))
      : null;
    const oldStation = oldStationReference ? await transaction.get(oldStationReference) : null;
    const pushTokens = input.status === "called" ? await transaction.get(ticketReference.collection("pushTokens")) : null;

    const now = new Date().toISOString();
    const expiry = new Date(`${input.dateKey}T23:59:59.999+07:00`);
    const updates: Record<string, unknown> = { status: input.status, updatedAt: now };
    if (input.status === "serving") updates.stationNumber = input.stationNumber;
    else if (current === "serving") updates.stationNumber = FieldValue.delete();
    transaction.update(ticketReference, updates);
    transaction.set(dayReference, { dateKey: input.dateKey, revision: Number(day.data()?.revision ?? 0) + 1, updatedAt: now }, { merge: true });
    transaction.create(ticketReference.collection("queueEvents").doc(), {
      event: input.status, actor: "owner", actorUid: ownerId, timestamp: now, expiresAt: expiry,
      ...(input.stationNumber ? { stationNumber: input.stationNumber } : {}),
    });
    if (targetStationReference) {
      transaction.set(targetStationReference, { ticketId: input.ticketId, number: ticketData.number, updatedAt: now, expiresAt: expiry });
    }
    if (oldStationReference && oldStationReference.path !== targetStationReference?.path && oldStation?.data()?.ticketId === input.ticketId) {
      transaction.delete(oldStationReference);
    }

    if (input.status === "called" && pushTokens?.size) {
      const language = ticketData.language === "en" ? "en" : "id";
      const messages = notificationCopy(language, Number(ticketData.number));
      const profileUrl = `/${language}/p/${String(outlet.data()?.slug ?? input.outletId)}`;
      transaction.create(database.collection("queueNotifications").doc(notificationId), {
        ticketId: input.ticketId, outletId: input.outletId, dateKey: input.dateKey,
        tokens: pushTokens.docs.slice(0, 10).map((document) => document.data().token),
        title: messages.title, body: messages.body, url: profileUrl, status: "pending", attempts: 0,
        createdAt: now, expiresAt: expiry,
      });
    }
    return input.status === "called" && pushTokens?.size ? notificationId : null;
  });
}

export async function updateOwnerQueueStationCount(ownerId: string, outletId: string, stationCount: number) {
  await assertOutletOwnerAccess(ownerId, outletId);
  const database = getFirebaseAdminFirestore();
  const outletReference = database.collection("outlets").doc(outletId);
  const dateKey = queueDateKey();
  const dayReference = dayRef(outletId, dateKey);

  await database.runTransaction(async (transaction) => {
    const [outlet, day] = await Promise.all([transaction.get(outletReference), transaction.get(dayReference)]);
    if (!outlet.exists || outlet.data()?.ownerId !== ownerId || !isQueueAddonActive(outlet.data()?.addons?.queue)) {
      throw new Error("QUEUE_NOT_ENABLED");
    }
    const stationReferences = Array.from({ length: 20 }, (_, index) => dayReference.collection("stations").doc(String(index + 1)));
    const stations = await Promise.all(stationReferences.map((reference) => transaction.get(reference)));
    if (stations.slice(stationCount).some((station) => Boolean(station.data()?.ticketId))) {
      throw new Error("QUEUE_STATION_OCCUPIED");
    }
    const now = new Date().toISOString();
    transaction.update(outletReference, { "addons.queue.stationCount": stationCount, updatedAt: now });
    transaction.set(dayReference, { dateKey, revision: Number(day.data()?.revision ?? 0) + 1, updatedAt: now }, { merge: true });
  });
}
