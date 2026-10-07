import { z } from "zod";

export function createActivationSchema(messages: { cardId: string; destinationUrl: string }) {
  return z.object({
    cardId: z.string().trim().min(4, messages.cardId).max(80),
    destinationUrl: z.string().trim().min(1, messages.destinationUrl).max(2_000, messages.destinationUrl),
    type: z.enum(["google_review", "whatsapp", "instagram", "tiktok", "custom"]),
  }).superRefine((values, context) => {
    if (values.type === "whatsapp") {
      const number = values.destinationUrl.replace(/\D/g, "");
      if (!/^62\d{8,14}$/.test(number)) context.addIssue({ code: "custom", message: messages.destinationUrl, path: ["destinationUrl"] });
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
