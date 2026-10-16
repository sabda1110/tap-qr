import { z } from "zod";

export const orderStatuses = ["on_progress", "confirmed", "shipped", "completed"] as const;
export const orderStatusOptions = [...orderStatuses, "cancelled"] as const;
export const paymentStatuses = ["unpaid", "paid", "refunded"] as const;
export const socialOrderThemes = ["google", "google-classic", "minimal", "natural", "coffee", "barbershop", "modern", "review-poster"] as const;
export const wifiOrderThemes = ["monster", "mono", "natural", "coffee", "barbershop", "kraken", "poster"] as const;
export const orderTokenSchema = z.string().regex(/^[a-f0-9]{64}$/);
export const orderIdSchema = z.string().regex(/^[a-f0-9]{64}$/);
export const orderStatusSchema = z.enum(orderStatusOptions);
export const orderPhoneSchema = z.string().trim().max(24)
  .transform((phone) => phone.replace(/[\s()+.-]/g, ""))
  .transform((phone) => phone.startsWith("0") ? `62${phone.slice(1)}` : phone)
  .pipe(z.string().regex(/^[1-9]\d{8,14}$/));

export const shippingRegionSchema = z.object({
  province: z.string().trim().min(2).max(100),
  city: z.string().trim().min(2).max(100),
  district: z.string().trim().min(2).max(100),
  village: z.string().trim().min(2).max(100),
});
export const phoneOrderLookupSchema = z.object({ phone: orderPhoneSchema, cursor: orderIdSchema.optional() });

const customerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().trim().toLowerCase().max(254),
  phone: orderPhoneSchema,
  address: z.string().trim().min(10).max(600),
  shippingRegion: shippingRegionSchema,
  material: z.enum(["acrylic", "pvc"]),
  quantity: z.number().int().min(1).max(100),
});

export const orderDraftSchema = z.discriminatedUnion("product", [
  customerSchema.extend({ product: z.literal("social"), theme: z.enum(socialOrderThemes) }),
  customerSchema.extend({ product: z.literal("wifi"), theme: z.enum(wifiOrderThemes) }),
]);
export const createOrderSchema = z.object({ token: orderTokenSchema, order: orderDraftSchema });
export const orderListSchema = z.object({ cursor: orderIdSchema.optional(), status: orderStatusSchema.optional(), code: z.string().trim().regex(/^TQO-[A-F0-9]{12}$/i).transform((code) => code.toUpperCase()).optional(), archived: z.boolean().optional() });
const revisionFields = { id: orderIdSchema, expectedRevision: z.number().int().min(0) };
export const editOrderSchema = z.object({ ...revisionFields, order: orderDraftSchema, reason: z.string().trim().max(500).default("") });
export const manageOrderSchema = z.discriminatedUnion("action", [
  z.object({ ...revisionFields, action: z.literal("cancel"), reason: z.string().trim().min(5).max(500) }),
  z.object({ ...revisionFields, action: z.literal("payment"), paymentStatus: z.enum(paymentStatuses), reason: z.string().trim().min(5).max(500) }),
  z.object({ ...revisionFields, action: z.literal("production") }),
  z.object({ ...revisionFields, action: z.literal("archive"), archived: z.boolean() }),
  z.object({ ...revisionFields, action: z.literal("shipping"), carrier: z.string().trim().min(1).max(60), trackingNumber: z.string().trim().min(1).max(100), reason: z.string().trim().min(5).max(500) }),
]);
export const updateOrderSchema = z.object({
  id: orderIdSchema,
  expectedStatus: orderStatusSchema,
  status: orderStatusSchema,
  expectedRevision: z.number().int().min(0).default(0),
  carrier: z.string().trim().max(60).default(""),
  trackingNumber: z.string().trim().max(100).default(""),
}).superRefine((value, context) => {
  if (value.status === "shipped" && (!value.carrier || !value.trackingNumber)) {
    context.addIssue({ code: "custom", path: ["trackingNumber"], message: "SHIPPING_REQUIRED" });
  }
});

export function canAdvanceOrder(current: z.infer<typeof orderStatusSchema>, next: z.infer<typeof orderStatusSchema>) {
  return current !== "cancelled" && next !== "cancelled" && orderStatuses.indexOf(next) === orderStatuses.indexOf(current) + 1;
}

export type OrderDraft = z.infer<typeof orderDraftSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type OrderListSearch = z.infer<typeof orderListSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
