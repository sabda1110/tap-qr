import { z } from "zod";

export const listCardsSchema = z.object({
  cursor: z.string().optional(),
  query: z.string().trim().max(40).default(""),
});

export const generateCardsSchema = z.object({
  material: z.enum(["acrylic", "pvc"]),
  quantity: z.coerce.number().int().min(1).max(100),
});

export const deleteCardSchema = z.object({
  id: z.string().min(1),
});

export const deleteCardsSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(100),
});

export const deleteAllUnusedCardsSchema = z.object({});
