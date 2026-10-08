import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type { CardRecord, OutletRecord } from "../../lib/firebase/firestore-schema";
import { getGoogleReviewUrl } from "../../lib/google-review";
import { toWhatsAppInternationalNumber } from "../../lib/validation/whatsapp-number";
import type { ClaimCardValues } from "./card-entry.schemas";

export async function findEntryCard(cardId: string) {
  const found = await getFirebaseAdminFirestore().collection("cards").where("cardId", "==", cardId).limit(1).get();
  return found.docs[0];
}

export async function resolveCardEntry(cardId: string) {
  const document = await findEntryCard(cardId);
  const card = document?.data() as CardRecord | undefined;
  if (!card || !card.isEnabled) return null;
  if (card.claimStatus === "unclaimed") return { kind: "unclaimed" as const };
  if (!card.outletId) return null;
  const outlet = await getFirebaseAdminFirestore().collection("outlets").doc(card.outletId).get();
  if (outlet.data()?.status !== "active") return null;
  const urls = (card.config?.social?.links ?? []).filter((link) => link.isActive).map((link) => link.url);
  if (card.config?.type === "google_review" && card.config.google.reviewUrl) urls.push(card.config.google.reviewUrl);
  const destinations = [...new Set(urls.filter((value) => {
    try { return ["https:", "http:"].includes(new URL(value).protocol); } catch { return false; }
  }))];
  return { kind: "claimed" as const, outletId: card.outletId, url: destinations.length === 1 ? destinations[0] : null };
}

export async function claimEntryCard(input: ClaimCardValues, uid: string) {
  const database = getFirebaseAdminFirestore();
  const document = await findEntryCard(input.cardId);
  if (!document) throw new Error("CARD_NOT_FOUND");
  const outlet =
    input.outletMode === "existing"
      ? database.collection("outlets").doc(input.outletId)
      : database.collection("outlets").doc();
  let outletId = outlet.id;
  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(document.ref);
    const card = snapshot.data() as CardRecord | undefined;
    if (!card || !card.isEnabled || card.claimStatus !== "unclaimed" || card.ownerId || card.outletId) throw new Error("CARD_ALREADY_ASSIGNED");
    const timestamp = FieldValue.serverTimestamp();
    const links = input.links.map((link, order) => ({
      id: link.id, type: link.type, label: link.label, isActive: link.isActive, order,
      url: link.type === "google_review" ? getGoogleReviewUrl(link.value) : link.type === "whatsapp" ? `https://wa.me/${toWhatsAppInternationalNumber(link.value)}` : link.value,
    }));
    const google = input.links.find((link) => link.type === "google_review" && link.isActive);
    let profileName: string;
    if (input.outletMode === "new") {
      const slug = database.collection("outletSlugs").doc(input.slug);
      const [reservation, existing] = await Promise.all([
        transaction.get(slug),
        transaction.get(database.collection("outlets").where("slug", "==", input.slug).limit(1)),
      ]);
      if (reservation.exists || !existing.empty) throw new Error("SLUG_ALREADY_USED");
      transaction.create(outlet, {
        ownerId: uid, name: input.outletName, slug: input.slug, logoUrl: input.logoUrl ?? null,
        address: input.address, phone: "", status: "active", createdAt: timestamp, updatedAt: timestamp,
      } satisfies OutletRecord);
      transaction.create(slug, { outletId: outlet.id, ownerId: uid });
      profileName = input.outletName;
    } else {
      const outletSnapshot = await transaction.get(outlet);
      if (!outletSnapshot.exists || outletSnapshot.data()?.ownerId !== uid || outletSnapshot.data()?.status !== "active")
        throw new Error("OUTLET_NOT_AVAILABLE");
      profileName = String(outletSnapshot.data()?.name ?? "");
    }
    transaction.update(document.ref, {
      ownerId: uid, outletId: outlet.id, claimStatus: "claimed",
      claim: { claimTokenHash: null, claimedAt: timestamp, claimedBy: uid },
      config: { type: "social", google: { placeId: google?.value ?? null, reviewUrl: google ? getGoogleReviewUrl(google.value) : null, verificationStatus: google ? "pending" : null, verifiedAt: null }, social: { profileName, description: null, avatarUrl: null, links } },
      updatedAt: timestamp,
    });
  });
  return { outletId };
}

export async function listUserOutlets(uid: string) {
  const snapshot = await getFirebaseAdminFirestore().collection("outlets").where("ownerId", "==", uid).get();
  return snapshot.docs.map((document) => ({ id: document.id, name: String(document.data().name ?? "") }));
}

export async function recordCardVisit(cardId: string) {
  const document = await findEntryCard(cardId);
  const card = document?.data() as CardRecord | undefined;
  if (!card?.isEnabled) return;
  await getFirebaseAdminFirestore().collection("scanEvents").add({
    cardId, business_id: card.outletId, outletId: card.outletId,
    event: "card_visit", actionType: "card_visit", source: "unknown",
    timestamp: FieldValue.serverTimestamp(),
  });
}
