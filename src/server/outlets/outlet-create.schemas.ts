import { z } from "zod";
import { ownerActivationSchema } from "../../lib/validation/owner-activation-schema";
import {
  updateOutletSchema,
  updateOutletCardLinksSchema,
} from "./outlet.schemas";

export const createOutletFieldsSchema = updateOutletSchema
  .omit({ id: true })
  .extend({
    ownerId: z.string().min(1).max(150),
    cardId: ownerActivationSchema.shape.cardId,
  });
export const createOutletSchema = createOutletFieldsSchema.extend({
  links: updateOutletCardLinksSchema.shape.links,
});
export const ownerSearchSchema = z.object({
  query: z.string().trim().max(150).default(""),
});
export const ownerSourceSchema = z.object({
  ownerId: z.string().min(1).max(150),
});
export const cardSourceSchema = ownerSourceSchema.extend({
  outletId: z.string().min(1).max(150),
});
export type CreateOutletFields = z.infer<typeof createOutletFieldsSchema>;
export type CreateOutletValues = z.infer<typeof createOutletSchema>;
export type OutletOwnerOption = {
  id: string;
  name: string;
  email: string;
  phone: string;
};
export type SourceOutletOption = { id: string; name: string; slug: string };
