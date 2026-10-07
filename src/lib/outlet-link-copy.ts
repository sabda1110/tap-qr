import type { SocialLink } from "./firebase/firestore-schema";
import type { CardLinksEditValues } from "../server/outlets/outlet.schemas";

export function copySocialLinks(
  links: SocialLink[],
): CardLinksEditValues["links"] {
  return links.map((link) => {
    let value = link.url;
    try {
      if (link.type === "google_review")
        value = new URL(link.url).searchParams.get("placeid") ?? "";
      if (link.type === "whatsapp")
        value = new URL(link.url).pathname.replace(/\D/g, "");
    } catch {
      value = "";
    }
    return {
      id: crypto.randomUUID(),
      type: link.type,
      label: link.label,
      value,
      isActive: link.isActive,
    };
  });
}
