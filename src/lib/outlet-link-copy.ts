import type { SocialLink } from "./firebase/firestore-schema";
import type { CardLinksEditValues } from "../server/outlets/outlet.schemas";

export function copySocialLinks(
  links: SocialLink[],
): CardLinksEditValues["links"] {
  return links.map((link) => {
    let value = link.url;
    let message = link.message ?? undefined;
    try {
      if (link.type === "google_review")
        value = new URL(link.url).searchParams.get("placeid") ?? "";
      if (link.type === "whatsapp") {
        const destination = new URL(link.url);
        value = destination.pathname.replace(/\D/g, "");
        message ??= destination.searchParams.get("text") ?? undefined;
      }
    } catch {
      value = "";
    }
    return {
      id: crypto.randomUUID(),
      type: link.type,
      label: link.label,
      value,
      message,
      isActive: link.isActive,
    };
  });
}
