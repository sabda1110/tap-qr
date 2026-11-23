import { createHash, randomBytes, randomUUID } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import { queueEn } from "../../i18n/locales/queue-en";
import { queueId } from "../../i18n/locales/queue-id";
import { assertOutletOwner } from "../outlets/outlet-ownership";
import { isQueueAddonActive, queueDateKey } from "./queue-access";
import { cashierPushTokensQuery, createCashierBookingNotification } from "./queue-cashier-notifications.repository.server";
import type { AdminQueueAddonValues, OwnerQueueInput, OwnerQueueOpenValues, PublicQueueJoinValues } from "./queue.schemas";
import type { PublicQueueTicket, QueueTicketView } from "./queue.types";

const digest = (value: string) => createHash("sha256").update(value).digest("hex");
const token = () => randomBytes(32).toString("base64url");
const ticketId = () => randomBytes(16).toString("hex");
export const dayRef = (outletId: string, dateKey: string) => getFirebaseAdminFirestore()
  .collection("outlets").doc(outletId).collection("queueDays").doc(dateKey);
const queueRevision = (dateKey: string, day?: { revision?: unknown; isOpen?: unknown }) => `${dateKey}:${Number(day?.revision ?? 0)}:${day?.isOpen === true ? 1 : 0}`;
export const notificationCopy = (language: unknown, number: number) => {
  const copy = language === "en" ? queueEn.public : queueId.public;
  return { title: copy.notificationTitle, body: copy.notificationBody.replace("{number}", String(number)) };
};

async function findOutlet(value: string) {
  const database = getFirebaseAdminFirestore();
  const direct = await database.collection("outlets").doc(value).get();
  if (direct.exists) return direct;
  const matches = await database.collection("outlets").where("slug", "==", value).limit(1).get();
  return matches.empty ? null : matches.docs[0];
}

export async function assertQueueOutlet(outletId: string) {
  const outlet = await getFirebaseAdminFirestore().collection("outlets").doc(outletId).get();
  if (!outlet.exists || outlet.data()?.status !== "active" || !isQueueAddonActive(outlet.data()?.addons?.queue)) {
    throw new Error("QUEUE_NOT_ENABLED");
  }
  return outlet;
}

export async function updateAdminQueueAddon(input: AdminQueueAddonValues) {
  const database = getFirebaseAdminFirestore();
  const reference = database.collection("outlets").doc(input.outletId);
  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists) throw new Error("OUTLET_NOT_FOUND");
    const current = snapshot.data()?.addons?.queue;
    transaction.update(reference, {
      "addons.queue": { enabled: input.enabled, activatedAt: current?.activatedAt ?? new Date().toISOString(), expiresAt: input.expiresAt,
        stationCount: Math.max(1, Math.min(20, Number(current?.stationCount ?? 3))),
        cashierPinSalt: current?.cashierPinSalt ?? "", cashierPinHash: current?.cashierPinHash ?? "",
        cashierSessionVersion: (current?.cashierSessionVersion ?? 0) + (current?.enabled && !input.enabled ? 1 : 0) },
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}

async function createTicket(outletId: string, input: Pick<OwnerQueueInput, "name" | "service" | "phone"> & { language?: "id" | "en" }, source: "online" | "walk_in", ip?: string) {
  const database = getFirebaseAdminFirestore();
  const dateKey = queueDateKey();
  const counterRef = dayRef(outletId, dateKey);
  const id = ticketId();
  const publicToken = token();
  const tokenHash = digest(publicToken);
  const ticketRef = counterRef.collection("tickets").doc(id);
  const tokenRef = database.collection("queueTokens").doc(tokenHash);
  const now = new Date().toISOString();
  const expiresAt = new Date(`${dateKey}T23:59:59.999+07:00`);
  const rateRef = ip ? database.collection("queueRateLimits").doc(digest(`${outletId}:${ip}:${Math.floor(Date.now() / 60_000)}`)) : null;

  const created = await database.runTransaction(async (transaction) => {
    const outletRef = database.collection("outlets").doc(outletId);
    const reads = await Promise.all([
      transaction.get(outletRef), transaction.get(counterRef),
      ...(rateRef ? [transaction.get(rateRef)] : []),
    ]);
    const outlet = reads[0];
    const counter = reads[1];
    const rate = rateRef ? reads[2] : null;
    const cashierTokens = source === "online" ? await transaction.get(cashierPushTokensQuery(outletId)) : null;
    if (!outlet.exists || outlet.data()?.status !== "active" || !isQueueAddonActive(outlet.data()?.addons?.queue)) throw new Error("QUEUE_NOT_ENABLED");
    if (counter.data()?.isOpen !== true) throw new Error("QUEUE_CLOSED");
    if (rateRef && (rate?.data()?.count ?? 0) >= 10) throw new Error("QUEUE_RATE_LIMITED");
    const next = Number(counter.data()?.lastNumber ?? 0) + 1;
    transaction.set(counterRef, { dateKey, lastNumber: next, revision: Number(counter.data()?.revision ?? 0) + 1, updatedAt: now }, { merge: true });
    transaction.create(ticketRef, { number: next, name: input.name, service: input.service, phone: input.phone, language: input.language ?? "id", status: "waiting", source,
      createdAt: now, updatedAt: now, tokenHash, expiresAt });
    transaction.create(tokenRef, { outletId, dateKey, ticketId: id, expiresAt });
    transaction.create(ticketRef.collection("queueEvents").doc(), { event: "joined", source, timestamp: now, expiresAt });
    if (source === "online") transaction.create(database.collection("scanEvents").doc(), {
      business_id: outletId, outletId, cardId: null, event: "queue_join", actionType: "queue_join", source: "queue_page", timestamp: FieldValue.serverTimestamp(),
    });
    if (rateRef) transaction.set(rateRef, { count: (rate?.data()?.count ?? 0) + 1, expiresAt });
    const notificationId = source === "online" && cashierTokens?.size
      ? createCashierBookingNotification(transaction, {
        tokens: cashierTokens, outletId, dateKey, ticketId: id, number: next,
        language: input.language ?? "id",
      })
      : null;
    return { number: next, notificationId };
  });
  return { ...created, token: publicToken, dateKey };
}

export async function joinPublicQueue(input: PublicQueueJoinValues, ip: string) {
  const outlet = await findOutlet(input.outlet);
  if (!outlet || outlet.data()?.status !== "active" || !isQueueAddonActive(outlet.data()?.addons?.queue)) throw new Error("QUEUE_NOT_ENABLED");
  const created = await createTicket(outlet.id, input, "online", ip);
  return { ...created, outletName: String(outlet.data()?.name ?? "") };
}

export async function getPublicQueueOutlet(value: string) {
  const outlet = await findOutlet(value);
  if (!outlet || outlet.data()?.status !== "active" || !isQueueAddonActive(outlet.data()?.addons?.queue)) return null;
  const dateKey = queueDateKey();
  const day = await dayRef(outlet.id, dateKey).get();
  return { id: outlet.id, name: String(outlet.data()?.name ?? ""), slug: String(outlet.data()?.slug ?? outlet.id), isOpen: day.data()?.isOpen === true };
}

export async function getPublicQueueTicket(rawToken: string): Promise<PublicQueueTicket | null> {
  const database = getFirebaseAdminFirestore();
  const lookup = await database.collection("queueTokens").doc(digest(rawToken)).get();
  if (!lookup.exists) return null;
  const { outletId, dateKey, ticketId: id } = lookup.data()!;
  if (dateKey !== queueDateKey()) return null;
  const outlet = await assertQueueOutlet(outletId).catch(() => null);
  if (!outlet) return null;
  const ticket = await dayRef(outletId, dateKey).collection("tickets").doc(id).get();
  if (!ticket.exists) return null;
  const value = ticket.data()!;
  return { outletName: String(outlet.data()?.name ?? ""), number: value.number, service: value.service,
    status: value.status, dateKey };
}

export async function listOwnerQueue(ownerId: string, outletId: string) {
  await assertOutletOwnerAccess(ownerId, outletId);
  const outlet = await assertQueueOutlet(outletId);
  const stationCount = Math.max(1, Math.min(20, Number(outlet.data()?.addons?.queue?.stationCount ?? 3)));
  const dateKey = queueDateKey();
  const day = await dayRef(outletId, dateKey).get();
  const snapshot = await dayRef(outletId, dateKey).collection("tickets").orderBy("number", "desc").limit(300).get();
  const tickets: QueueTicketView[] = snapshot.docs.map((document) => {
    const value = document.data();
    return { id: document.id, number: value.number, name: value.name, service: value.service, phone: typeof value.phone === "string" ? value.phone : undefined,
      status: value.status, stationNumber: typeof value.stationNumber === "number" ? value.stationNumber : undefined,
      createdAt: value.createdAt, source: value.source };
  });
  return { dateKey, tickets, stationCount, isOpen: day.data()?.isOpen === true, revision: queueRevision(dateKey, day.data()) };
}

export async function getQueueDayRevision(outletId: string) {
  const dateKey = queueDateKey();
  const day = await dayRef(outletId, dateKey).get();
  return queueRevision(dateKey, day.data());
}

export async function setOwnerQueueOpen(ownerId: string, input: OwnerQueueOpenValues) {
  await assertOutletOwnerAccess(ownerId, input.outletId);
  await assertQueueOutlet(input.outletId);
  const dateKey = queueDateKey();
  const reference = dayRef(input.outletId, dateKey);
  await getFirebaseAdminFirestore().runTransaction(async (transaction) => {
    const day = await transaction.get(reference);
    transaction.set(reference, { dateKey, isOpen: input.isOpen, revision: Number(day.data()?.revision ?? 0) + 1,
      updatedAt: new Date().toISOString() }, { merge: true });
  });
}

export async function assertOutletOwnerAccess(ownerId: string, outletId: string) {
  const outlet = await getFirebaseAdminFirestore().collection("outlets").doc(outletId).get();
  assertOutletOwner(outlet.data()?.ownerId, ownerId);
  if (!outlet.exists) throw new Error("OUTLET_NOT_FOUND");
}

export async function addOwnerWalkIn(ownerId: string, input: OwnerQueueInput) {
  await assertOutletOwnerAccess(ownerId, input.outletId);
  const created = await createTicket(input.outletId, input, "walk_in");
  return { number: created.number, token: created.token, dateKey: created.dateKey };
}

export async function registerPublicQueuePushToken(ticketToken: string, fcmToken: string) {
  const database = getFirebaseAdminFirestore();
  const lookup = await database.collection("queueTokens").doc(digest(ticketToken)).get();
  if (!lookup.exists) throw new Error("QUEUE_TICKET_NOT_FOUND");
  const { outletId, dateKey, ticketId: id } = lookup.data()!;
  if (dateKey !== queueDateKey()) throw new Error("QUEUE_TICKET_EXPIRED");
  const outlet = await assertQueueOutlet(outletId);
  const reference = dayRef(outletId, dateKey).collection("tickets").doc(id);
  const tokenRef = reference.collection("pushTokens").doc(digest(fcmToken));
  const notificationId = randomUUID();
  const result = await database.runTransaction(async (transaction) => {
    const [snapshot, existing] = await Promise.all([transaction.get(reference), transaction.get(tokenRef)]);
    if (!snapshot.exists) throw new Error("QUEUE_TICKET_NOT_FOUND");
    if (existing.exists) return null;
    const ticket = snapshot.data()!;
    if (!["waiting", "called"].includes(ticket.status)) throw new Error("QUEUE_NOTIFIABLE");
    const now = new Date().toISOString();
    transaction.set(tokenRef, { token: fcmToken, createdAt: now, expiresAt: new Date(`${dateKey}T23:59:59.999+07:00`) });
    transaction.update(reference, { pushTokenUpdatedAt: now });
    if (ticket.status !== "called") return null;
    const language = ticket.language === "en" ? "en" : "id";
    const copy = notificationCopy(language, Number(ticket.number));
    const url = `/${language}/p/${String(outlet.data()?.slug ?? outletId)}`;
    transaction.create(database.collection("queueNotifications").doc(notificationId), { ticketId: id, outletId, dateKey, tokens: [fcmToken],
      ...copy, url, status: "pending", attempts: 0, createdAt: now, expiresAt: new Date(`${dateKey}T23:59:59.999+07:00`) });
    return copy;
  });
  if (!result) return { notificationId: null };
  return { notificationId };
}

export async function getQueueCashierAccess(outletId: string) {
  const outlet = await assertQueueOutlet(outletId);
  return { outlet: outlet.data()!, pinHash: String(outlet.data()?.addons?.queue?.cashierPinHash ?? ""),
    pinSalt: String(outlet.data()?.addons?.queue?.cashierPinSalt ?? ""), version: Number(outlet.data()?.addons?.queue?.cashierSessionVersion ?? 0) };
}

export async function consumeQueuePinAttempt(outletId: string, ipHash: string, valid: boolean) {
  const database = getFirebaseAdminFirestore();
  const reference = database.collection("queueCashierRateLimits").doc(`${outletId}_${ipHash}`);
  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    const record = snapshot.data();
    const lockedUntil = record?.lockedUntil ? new Date(record.lockedUntil).getTime() : 0;
    if (lockedUntil > Date.now()) throw new Error("QUEUE_CASHIER_LOCKED");
    if (valid) { transaction.delete(reference); return; }
    const attempts = (record?.attempts ?? 0) + 1;
    transaction.set(reference, { attempts, lockedUntil: attempts >= 5 ? new Date(Date.now() + 900_000).toISOString() : null,
      expiresAt: new Date(Date.now() + 900_000) });
  });
}

export async function updateOwnerQueueCashierPin(ownerId: string, outletId: string, pinHash: string, pinSalt: string) {
  await assertOutletOwnerAccess(ownerId, outletId);
  await assertQueueOutlet(outletId);
  const database = getFirebaseAdminFirestore();
  const ref = database.collection("outlets").doc(outletId);
  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists || snapshot.data()?.ownerId !== ownerId || !isQueueAddonActive(snapshot.data()?.addons?.queue)) throw new Error("QUEUE_NOT_ENABLED");
    transaction.update(ref, { "addons.queue.cashierPinSalt": pinSalt, "addons.queue.cashierPinHash": pinHash,
      "addons.queue.cashierSessionVersion": Number(snapshot.data()?.addons?.queue?.cashierSessionVersion ?? 0) + 1,
      updatedAt: FieldValue.serverTimestamp() });
  });
}
