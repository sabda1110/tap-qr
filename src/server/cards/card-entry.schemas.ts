import { z } from "zod";
import { ownerActivationSchema } from "../../lib/validation/owner-activation-schema";
import { updateOutletCardLinksSchema } from "../outlets/outlet.schemas";

export const cardIdSchema = z.string().trim().regex(/^TQR-[A-F0-9]{32}$/i).transform((id) => id.toUpperCase());
export const cardSearchSchema = z.object({ cardId: cardIdSchema.optional().catch(undefined) });
export const newClaimOutletSchema = ownerActivationSchema.pick({
  outletName: true,
  slug: true,
  logoUrl: true,
  address: true,
});
const claimCardLinksSchema = updateOutletCardLinksSchema.pick({ links: true }).extend({
  links: updateOutletCardLinksSchema.shape.links.refine((links) => links.some((link) => link.isActive)),
  cardId: cardIdSchema,
});
export const claimCardSchema = z.discriminatedUnion("outletMode", [
  claimCardLinksSchema.extend({
    outletMode: z.literal("new"),
    ...newClaimOutletSchema.shape,
  }),
  claimCardLinksSchema.extend({
    outletMode: z.literal("existing"),
    outletId: z.string().min(1).max(150),
  }),
]);
export type ClaimCardValues = z.infer<typeof claimCardSchema>;
