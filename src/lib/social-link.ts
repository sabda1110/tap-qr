import type { SocialLink } from "./firebase/firestore-schema";
import { getGoogleReviewUrl } from "./google-review";
import { toWhatsAppInternationalNumber } from "./validation/whatsapp-number";

type EditableSocialLink = {
  id: string;
  type: SocialLink["type"];
  label: string;
  value: string;
  isActive: boolean;
  message?: string;
};

function isHttpUrl(value: string) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export function normalizeSocialUsername(value: string) {
  return value.trim().replace(/^@+/, "");
}

export function getSocialDestinationUrl(link: EditableSocialLink) {
  if (link.type === "google_review") return getGoogleReviewUrl(link.value);
  if (link.type === "whatsapp") {
    const number = toWhatsAppInternationalNumber(link.value);
    const message = link.message?.trim();
    return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
  }
  if (link.type === "instagram" && !isHttpUrl(link.value))
    return `https://www.instagram.com/${normalizeSocialUsername(link.value)}`;
  if (link.type === "tiktok" && !isHttpUrl(link.value))
    return `https://www.tiktok.com/@${normalizeSocialUsername(link.value)}`;
  return link.value;
}

export function toStoredSocialLink(
  link: EditableSocialLink,
  order: number,
): SocialLink {
  return {
    id: link.id,
    type: link.type,
    label: link.label,
    isActive: link.isActive,
    order,
    url: getSocialDestinationUrl(link),
    ...(link.type === "whatsapp"
      ? { message: link.message?.trim() || null }
      : {}),
  };
}
