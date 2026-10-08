import { z } from "zod";
import { isValidWhatsAppNumber } from "./whatsapp-number";

export const activationLinkSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["google_review", "whatsapp", "instagram", "tiktok", "custom"]),
  label: z.string().trim().min(1).max(100),
  value: z.string().trim().min(1).max(2000),
}).superRefine((link, context) => {
  let valid = false;
  if (link.type === "whatsapp") valid = isValidWhatsAppNumber(link.value);
  else if (link.type === "google_review") valid = /^[A-Za-z0-9_-]+$/.test(link.value);
  else {
    try { valid = ["http:", "https:"].includes(new URL(link.value).protocol); } catch { valid = false; }
  }
  if (!valid) context.addIssue({ code: "custom", path: ["value"], message: "Invalid destination" });
});

export const ownerActivationSchema = z.object({
  cardId: z.string().trim().min(4).max(80),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  phone: z.string().trim().refine(isValidWhatsAppNumber),
  password: z.string().min(8).max(128),
  outletName: z.string().trim().min(2).max(150),
  logoUrl: z.url().startsWith("https://res.cloudinary.com/").max(2000).nullable().optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  address: z.string().trim().min(3).max(500),
  links: z.array(activationLinkSchema).min(1).max(20),
});

export type OwnerActivationValues = z.infer<typeof ownerActivationSchema>;
export type ActivationLink = z.infer<typeof activationLinkSchema>;
