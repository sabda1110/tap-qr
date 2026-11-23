import { randomUUID } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore, getFirebaseAdminMessaging } from "../../lib/firebase/admin.server";

function publicOrigin() {
  try {
    const configured = new URL(process.env.VITE_SITE_URL ?? "https://www.tapqr.id");
    if (configured.protocol !== "https:" || configured.username || configured.password) return "https://www.tapqr.id";
    return configured.origin;
  } catch { return "https://www.tapqr.id"; }
}

export async function dispatchQueueNotification(id: string) {
  const database = getFirebaseAdminFirestore();
  const reference = database.collection("queueNotifications").doc(id);
  const snapshot = await reference.get();
  if (!snapshot.exists || snapshot.data()?.status !== "pending") return false;
  const notification = snapshot.data()!;
  const tokens = Array.isArray(notification.tokens) ? notification.tokens.filter((token): token is string => typeof token === "string" && token.length > 0).slice(0, 10) : [];
  if (!tokens.length) {
    await reference.update({ status: "skipped", completedAt: FieldValue.serverTimestamp() });
    return false;
  }
  const leaseId = randomUUID();
  const claim = await database.runTransaction(async (transaction) => {
    const current = await transaction.get(reference);
    if (current.data()?.status !== "pending") return false;
    transaction.update(reference, { status: "sending", leaseId, attempts: (current.data()?.attempts ?? 0) + 1 });
    return true;
  });
  if (!claim) return false;

  const path = typeof notification.url === "string" && notification.url.startsWith("/") ? notification.url : "/id";
  const url = new URL(path, publicOrigin()).toString();
  try {
    const message = {
      notification: { title: String(notification.title ?? "TapQR"), body: String(notification.body ?? "Giliran Anda sudah dipanggil.") },
      data: { url },
      webpush: { notification: { tag: `tapqr-queue-${id}`, requireInteraction: true }, fcmOptions: { link: url } },
    };
    const response = await getFirebaseAdminMessaging().sendEach(tokens.map((token) => ({ ...message, token })));
    const success = response.successCount > 0;
    await database.runTransaction(async (transaction) => {
      const current = await transaction.get(reference);
      if (current.data()?.leaseId !== leaseId) return;
      transaction.update(reference, { status: success ? "sent" : "failed", successCount: response.successCount,
        failureCount: response.failureCount, completedAt: FieldValue.serverTimestamp() });
    });
    return success;
  } catch {
    await database.runTransaction(async (transaction) => {
      const current = await transaction.get(reference);
      if (current.data()?.leaseId === leaseId) transaction.update(reference, { status: "failed", completedAt: FieldValue.serverTimestamp() });
    }).catch(() => {});
    console.warn("queue_fcm_delivery_failed", { outletId: notification.outletId });
    return false;
  }
}
