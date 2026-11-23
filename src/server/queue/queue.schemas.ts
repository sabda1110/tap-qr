import { z } from "zod";

export const queueOutletIdSchema = z.string().trim().min(1).max(150).refine((value) => !value.includes("/"));
const queueName = z.string().trim().min(1).max(40);
const queueService = z.string().trim().min(2).max(60);
const queuePhone = z.string().trim().regex(/^8\d{7,11}$/, "QUEUE_PHONE_INVALID").transform((phone) => `62${phone}`);
const queueToken = z.string().regex(/^[A-Za-z0-9_-]{40,60}$/);

export const adminQueueAddonSchema = z.object({
  outletId: queueOutletIdSchema,
  enabled: z.boolean(),
  expiresAt: z.iso.datetime().nullable(),
});
export const publicQueueJoinSchema = z.object({
  outlet: queueOutletIdSchema,
  name: queueName,
  service: queueService,
  phone: queuePhone,
  language: z.enum(["id", "en"]),
});
export const publicQueueTokenSchema = z.object({ token: queueToken });
export const queuePushTokenSchema = z.object({ ticketToken: queueToken, fcmToken: z.string().trim().min(40).max(4096) });
export const queueCashierLoginSchema = z.object({ outletId: queueOutletIdSchema, pin: z.string().regex(/^\d{4,6}$/) });
export const queueCashierOutletSchema = z.object({ outletId: queueOutletIdSchema });
export const queueCashierPushTokenSchema = queueCashierOutletSchema.extend({ fcmToken: z.string().trim().min(40).max(4096) });
export const queueCashierPinSchema = z.object({ outletId: queueOutletIdSchema, pin: z.string().regex(/^\d{4,6}$/) });
export const publicQueueOutletSchema = z.object({ outlet: queueOutletIdSchema });
export const ownerQueueInputSchema = z.object({
  outletId: queueOutletIdSchema,
  name: queueName,
  service: queueService,
  phone: queuePhone,
});
export const ownerQueueReadSchema = z.object({ outletId: queueOutletIdSchema });
export const ownerQueueOpenSchema = z.object({ outletId: queueOutletIdSchema, isOpen: z.boolean() });
export const ownerQueueStatusSchema = z.object({
  outletId: queueOutletIdSchema,
  dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  ticketId: z.string().regex(/^[a-f0-9]{32}$/),
  status: z.enum(["called", "serving", "completed", "no_show", "cancelled", "waiting"]),
});

export type QueueStatus = z.infer<typeof ownerQueueStatusSchema>["status"];
export type AdminQueueAddonValues = z.infer<typeof adminQueueAddonSchema>;
export type PublicQueueJoinValues = z.infer<typeof publicQueueJoinSchema>;
export type OwnerQueueInput = z.infer<typeof ownerQueueInputSchema>;
export type OwnerQueueStatusValues = z.infer<typeof ownerQueueStatusSchema>;
export type OwnerQueueOpenValues = z.infer<typeof ownerQueueOpenSchema>;
