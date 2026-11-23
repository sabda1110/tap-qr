import { createHash, randomUUID } from "node:crypto";
import type { QuerySnapshot, Transaction } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import { queueEn } from "../../i18n/locales/queue-en";
import { queueId } from "../../i18n/locales/queue-id";
import { queueDateKey } from "./queue-access";

const digest = (value: string) => createHash("sha256").update(value).digest("hex");
const tokenCollection = (outletId: string) => getFirebaseAdminFirestore()
  .collection("outlets").doc(outletId).collection("queueCashierPushTokens");

export function cashierPushTokensQuery(outletId: string) {
  return tokenCollection(outletId).where("expiresAt", ">", new Date());
}

export function createCashierBookingNotification(transaction: Transaction, input: {
  tokens: QuerySnapshot;
  outletId: string;
  dateKey: string;
  ticketId: string;
  number: number;
  language: "id" | "en";
}) {
  if (input.tokens.empty) return null;
  const notificationId = randomUUID();
  const cashierCopy = input.language === "en" ? queueEn.cashier : queueId.cashier;
  const expiry = new Date(`${input.dateKey}T23:59:59.999+07:00`);
  transaction.create(getFirebaseAdminFirestore().collection("queueNotifications").doc(notificationId), {
    ticketId: input.ticketId,
    outletId: input.outletId,
    dateKey: input.dateKey,
    tokens: input.tokens.docs.slice(0, 10).map((document) => document.data().token),
    title: cashierCopy.newTicketNotificationTitle,
    body: cashierCopy.newTicketNotificationBody.replace("{number}", String(input.number)),
    url: `/${input.language}/queue/cashier/${input.outletId}`,
    status: "pending",
    attempts: 0,
    createdAt: new Date().toISOString(),
    expiresAt: expiry,
  });
  return notificationId;
}

export async function saveCashierPushToken(outletId: string, fcmToken: string) {
  const dateKey = queueDateKey();
  await tokenCollection(outletId).doc(digest(fcmToken)).set({
    token: fcmToken,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(`${dateKey}T23:59:59.999+07:00`),
  });
}

export async function deleteCashierPushToken(outletId: string, fcmToken: string) {
  await tokenCollection(outletId).doc(digest(fcmToken)).delete();
}
