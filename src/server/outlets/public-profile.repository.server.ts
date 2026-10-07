import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type { CardRecord, SocialLink } from "../../lib/firebase/firestore-schema";
import type { PublicOutletProfile } from "./public-profile.types";

function publicUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export async function getPublicOutletProfile(id: string): Promise<PublicOutletProfile | null> {
  const database = getFirebaseAdminFirestore();
  let outletDocument = await database.collection("outlets").doc(id).get();
  if (!outletDocument.exists) {
    const matches = await database.collection("outlets").where("slug", "==", id).limit(1).get();
    if (matches.empty) return null;
    outletDocument = matches.docs[0];
  }
  const outlet = outletDocument.data()!;
  if (outlet.status !== "active" || !outlet.ownerId) return null;

  const snapshot = await database.collection("cards").where("ownerId", "==", outlet.ownerId).get();
  const cards = snapshot.docs
    .map((document) => ({ id: document.id, record: document.data() as CardRecord }))
    .filter(({ record }) => record.outletId === outletDocument.id && record.claimStatus === "claimed" && record.isEnabled)
    .sort((a, b) => a.id.localeCompare(b.id));
  const links: SocialLink[] = [];
  const seen = new Set<string>();
  for (const { id: cardId, record } of cards) {
    const configured = [...(record.config?.social?.links ?? [])];
    if (record.config?.type === "google_review" && record.config.google.reviewUrl && !configured.some((link) => link.type === "google_review")) {
      configured.push({ id: "review", type: "google_review", label: "", url: record.config.google.reviewUrl, isActive: true, order: -1 });
    }
    for (const link of configured.sort((a, b) => a.order - b.order)) {
      const url = publicUrl(link.url);
      if (!link.isActive || !url || seen.has(url)) continue;
      seen.add(url);
      links.push({ ...link, id: `${cardId}:${link.id}`, url });
    }
  }
  // Reviews remain the primary action; other links retain their configured order.
  links.sort((a, b) => Number(b.type === "google_review") - Number(a.type === "google_review"));
  const social = cards[0]?.record.config?.social;
  return {
    id: outletDocument.id,
    name: outlet.name ?? "",
    slug: outlet.slug ?? "",
    location: [outlet.address, outlet.city, outlet.province].filter(Boolean).join(", "),
    description: social?.description ?? null,
    avatarUrl: publicUrl(outlet.logoUrl) ?? publicUrl(social?.avatarUrl),
    links,
  };
}

export async function recordPublicProfileView(outletId: string) {
  await getFirebaseAdminFirestore().collection("scanEvents").add({
    business_id: outletId,
    outletId,
    cardId: null,
    event: "profile_view",
    actionType: "profile_view",
    source: "direct",
    timestamp: FieldValue.serverTimestamp(),
  });
}
