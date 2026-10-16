import { orderPhoneSchema } from "./order.schemas";

export function getOrderWhatsAppNumber() {
  const parsed = orderPhoneSchema.safeParse(process.env.ORDER_WHATSAPP_NUMBER ?? "");
  return parsed.success ? parsed.data : null;
}
