import { z } from "zod";
import { isValidWhatsAppNumber } from "./whatsapp-number";

export function createActivationSchema(messages: { cardId: string; destinationUrl: string }) {
  return z.object({
    cardId: z.string().trim().min(4, messages.cardId).max(80),
    destinationUrl: z.string().trim().min(1, messages.destinationUrl).max(2_000, messages.destinationUrl),
    type: z.enum(["google_review", "whatsapp", "instagram", "tiktok", "custom"]),
  }).superRefine((values, context) => {
    if (values.type === "whatsapp") {
      if (!isValidWhatsAppNumber(values.destinationUrl)) context.addIssue({ code: "custom", message: messages.destinationUrl, path: ["destinationUrl"] });
      return;
    }

    try {
      const parsed = new URL(values.destinationUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("Invalid protocol");
    } catch {
      context.addIssue({ code: "custom", message: messages.destinationUrl, path: ["destinationUrl"] });
    }
  });
}
