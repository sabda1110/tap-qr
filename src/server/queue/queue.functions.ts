import { randomBytes } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { requireAdmin, requireOwner } from "../auth/authorization.server";
import { adminQueueAddonSchema, ownerQueueInputSchema, ownerQueueOpenSchema, ownerQueueReadSchema, ownerQueueStatusSchema, publicQueueJoinSchema, publicQueueOutletSchema, publicQueueTokenSchema, queueCashierLoginSchema, queueCashierOutletSchema, queueCashierPinSchema, queueCashierPushTokenSchema, queuePushTokenSchema } from "./queue.schemas";
import { addOwnerWalkIn, consumeQueuePinAttempt, getPublicQueueOutlet, getPublicQueueTicket, getQueueCashierAccess, getQueueDayRevision, joinPublicQueue, listOwnerQueue, registerPublicQueuePushToken, setOwnerQueueOpen, setOwnerQueueStatus, updateAdminQueueAddon, updateOwnerQueueCashierPin } from "./queue.repository.server";
import { deleteCashierPushToken, saveCashierPushToken } from "./queue-cashier-notifications.repository.server";
import { clearQueueCashierSession, requireQueueCashierSession, setQueueCashierSession } from "./queue-cashier-security.server";
import { hashCashierPin, hashValue, safeEqual } from "../membership/membership-security.server";
import { dispatchQueueNotification } from "./queue-notifications.server";

export const saveAdminQueueAddon = createServerFn({ method: "POST" })
  .validator(adminQueueAddonSchema)
  .handler(async ({ data }) => { await requireAdmin(); await updateAdminQueueAddon(data); });

export const joinQueue = createServerFn({ method: "POST" })
  .validator(publicQueueJoinSchema)
  .handler(async ({ data }) => {
    const result = await joinPublicQueue(data, getRequestIP({ xForwardedFor: true }) ?? "unknown");
    if (result.notificationId) await dispatchQueueNotification(result.notificationId).catch(() => false);
    return { number: result.number, token: result.token, dateKey: result.dateKey, outletName: result.outletName };
  });

export const getQueueOutlet = createServerFn({ method: "GET" })
  .validator(publicQueueOutletSchema)
  .handler(({ data }) => getPublicQueueOutlet(data.outlet));

export const getQueueTicket = createServerFn({ method: "GET" })
  .validator(publicQueueTokenSchema)
  .handler(({ data }) => getPublicQueueTicket(data.token));

export const registerQueuePushToken = createServerFn({ method: "POST" }).validator(queuePushTokenSchema).handler(async ({ data }) => {
  const result = await registerPublicQueuePushToken(data.ticketToken, data.fcmToken);
  if (result.notificationId) await dispatchQueueNotification(result.notificationId);
  return { success: true as const };
});

export const getOwnerQueue = createServerFn({ method: "GET" })
  .validator(ownerQueueReadSchema)
  .handler(async ({ data }) => { const owner = await requireOwner(); return listOwnerQueue(owner.uid, data.outletId); });

export const setOwnerQueueAvailability = createServerFn({ method: "POST" })
  .validator(ownerQueueOpenSchema)
  .handler(async ({ data }) => { const owner = await requireOwner(); await setOwnerQueueOpen(owner.uid, data); });

export const addOwnerWalkInToQueue = createServerFn({ method: "POST" })
  .validator(ownerQueueInputSchema)
  .handler(async ({ data }) => { const owner = await requireOwner(); return addOwnerWalkIn(owner.uid, data); });

export const updateOwnerQueueTicket = createServerFn({ method: "POST" })
  .validator(ownerQueueStatusSchema)
  .handler(async ({ data }) => {
    const owner = await requireOwner();
    const notificationId = await setOwnerQueueStatus(owner.uid, data);
    if (notificationId) await dispatchQueueNotification(notificationId);
  });

export const saveOwnerQueueCashierPin = createServerFn({ method: "POST" })
  .validator(queueCashierPinSchema)
  .handler(async ({ data }) => {
    const owner = await requireOwner();
    const salt = randomBytes(16).toString("hex");
    await updateOwnerQueueCashierPin(owner.uid, data.outletId, hashCashierPin(data.outletId, data.pin, salt), salt);
  });

export const loginQueueCashier = createServerFn({ method: "POST" }).validator(queueCashierLoginSchema).handler(async ({ data }) => {
  const config = await getQueueCashierAccess(data.outletId);
  const valid = Boolean(config.pinHash && config.pinSalt) && safeEqual(hashCashierPin(data.outletId, data.pin, config.pinSalt), config.pinHash);
  const ipHash = hashValue(getRequestIP({ xForwardedFor: true }) ?? "unknown");
  await consumeQueuePinAttempt(data.outletId, ipHash, valid);
  if (!valid) throw new Error("INVALID_QUEUE_CASHIER_PIN");
  setQueueCashierSession(data.outletId, Number(config.outlet.addons?.queue?.cashierSessionVersion ?? 0));
  return { outletName: String(config.outlet.name ?? "") };
});

export const getQueueCashierSessionInfo = createServerFn({ method: "GET" }).validator(queueCashierOutletSchema).handler(async ({ data }) => {
  const session = await requireQueueCashierSession(data.outletId);
  return { outletName: session.outletName };
});

export const getQueueCashier = createServerFn({ method: "GET" }).validator(queueCashierOutletSchema).handler(async ({ data }) => {
  const session = await requireQueueCashierSession(data.outletId);
  return { session: { outletName: session.outletName }, queue: await listOwnerQueue(session.ownerId, data.outletId) };
});

export const getQueueCashierRevision = createServerFn({ method: "GET" }).validator(queueCashierOutletSchema).handler(async ({ data }) => {
  await requireQueueCashierSession(data.outletId);
  return getQueueDayRevision(data.outletId);
});

export const registerQueueCashierPushToken = createServerFn({ method: "POST" }).validator(queueCashierPushTokenSchema).handler(async ({ data }) => {
  await requireQueueCashierSession(data.outletId);
  await saveCashierPushToken(data.outletId, data.fcmToken);
  return { success: true as const };
});

export const unregisterQueueCashierPushToken = createServerFn({ method: "POST" }).validator(queueCashierPushTokenSchema).handler(async ({ data }) => {
  await requireQueueCashierSession(data.outletId);
  await deleteCashierPushToken(data.outletId, data.fcmToken);
  return { success: true as const };
});

export const logoutQueueCashier = createServerFn({ method: "POST" }).handler(async () => clearQueueCashierSession());

export const addQueueCashierWalkIn = createServerFn({ method: "POST" }).validator(ownerQueueInputSchema).handler(async ({ data }) => {
  const session = await requireQueueCashierSession(data.outletId);
  return addOwnerWalkIn(session.ownerId, data);
});

export const setQueueCashierAvailability = createServerFn({ method: "POST" }).validator(ownerQueueOpenSchema).handler(async ({ data }) => {
  const session = await requireQueueCashierSession(data.outletId);
  await setOwnerQueueOpen(session.ownerId, data);
});

export const updateQueueCashierTicket = createServerFn({ method: "POST" }).validator(ownerQueueStatusSchema).handler(async ({ data }) => {
  const session = await requireQueueCashierSession(data.outletId);
  const notificationId = await setOwnerQueueStatus(session.ownerId, data);
  if (notificationId) await dispatchQueueNotification(notificationId);
});
