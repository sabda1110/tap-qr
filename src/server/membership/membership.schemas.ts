import { z } from "zod";

export const outletIdSchema = z.string().min(1).max(128);
export const memberTokenSchema = z.string().regex(/^[A-Za-z0-9_-]{43}$/);
const phoneSchema = z.string().trim().min(9).max(18);

export const cashierLoginSchema = z.object({
  outletId: outletIdSchema,
  pin: z.string().regex(/^\d{4,6}$/),
});

export const memberRegistrationSchema = z.object({
  outletId: outletIdSchema,
  name: z.string().trim().min(1).max(40),
  phone: phoneSchema,
  notes: z.string().trim().max(100).optional(),
});

export const memberTokenInputSchema = z.object({ token: memberTokenSchema });
export const cashierMemberSchema = z.object({ outletId: outletIdSchema, token: memberTokenSchema });
export const memberActionSchema = cashierMemberSchema.extend({ action: z.enum(["stamp", "claim"]) });
export const memberSearchSchema = z.object({ outletId: outletIdSchema, phone: phoneSchema });

export const membershipSettingsSchema = z.object({
  outletId: outletIdSchema,
  expiryType: z.enum(["lifetime", "period"]),
  defaultDurationDays: z.coerce.number().int().min(1).max(3650).optional(),
  rewardEnabled: z.boolean(),
  targetVisits: z.coerce.number().int().min(2).max(50),
  rewardTitle: z.string().trim().min(1).max(80),
});

export const cashierPinChangeSchema = z.object({
  outletId: outletIdSchema,
  pin: z.string().regex(/^\d{6}$/),
});

export const adminMembershipAddonSchema = z.object({
  outletId: outletIdSchema,
  enabled: z.boolean(),
});
