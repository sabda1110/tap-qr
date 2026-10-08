const WHATSAPP_NUMBER_PATTERN = /^(?:08|62|\+62)\d{8,13}$/;

/** Keeps a WhatsApp field to digits, with an optional leading `+`. */
export function sanitizeWhatsAppNumber(value: string) {
  const hasCountryPrefix = value.startsWith("+");
  const digits = value.replace(/\D/g, "").slice(0, 15);
  return hasCountryPrefix ? `+${digits}` : digits;
}

export function isValidWhatsAppNumber(value: string) {
  return WHATSAPP_NUMBER_PATTERN.test(value);
}

/** Converts an accepted Indonesian mobile number to the format required by wa.me. */
export function toWhatsAppInternationalNumber(value: string) {
  const sanitized = sanitizeWhatsAppNumber(value);
  const digits = sanitized.replace(/^\+/, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}
