import { z } from "zod";
import {
  activationLinkSchema,
  ownerActivationSchema,
} from "../../lib/validation/owner-activation-schema";

const outletLinkSchema = z
  .object({
    id: z.string().min(1),
    type: z.enum([
      "google_review",
      "whatsapp",
      "instagram",
      "tiktok",
      "facebook",
      "custom",
    ]),
    label: z.string().trim().min(1).max(100),
    value: z.string().trim().min(1).max(2000),
    isActive: z.boolean(),
  })
  .superRefine((link, context) => {
    const result = activationLinkSchema.safeParse({
      ...link,
      type: link.type === "facebook" ? "custom" : link.type,
    });
    if (!result.success)
      for (const issue of result.error.issues)
        context.addIssue({
          code: "custom",
          path: issue.path,
          message: issue.message,
        });
  });

export const outletSearchSchema = z.object({
  query: z.string().trim().max(150).default(""),
  cursor: z.string().max(300).optional(),
  outletId: z.string().min(1).max(150).optional(),
});

export const updateOutletSchema = ownerActivationSchema
  .pick({
    outletName: true,
    logoUrl: true,
    slug: true,
    address: true,
    phone: true,
  })
  .extend({
    phone: ownerActivationSchema.shape.phone.or(z.literal("")),
    id: z.string().min(1).max(150),
    status: z.enum(["active", "disabled"]),
  });

export const updateOutletCardLinksSchema = z.object({
  outletId: z.string().min(1).max(150),
  cardId: z.string().min(1).max(150),
  links: z
    .array(outletLinkSchema)
    .min(1)
    .max(20)
    .refine(
      (links) => new Set(links.map((link) => link.id)).size === links.length,
    ),
});
export type CardLinksEditValues = z.infer<typeof updateOutletCardLinksSchema>;

export type OutletEditValues = z.infer<typeof updateOutletSchema>;
