import { FieldValue } from "firebase-admin/firestore";

import { getFirebaseAdminAuth, getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import { getGoogleReviewUrl } from "../../lib/google-review";
import { toWhatsAppInternationalNumber } from "../../lib/validation/whatsapp-number";
import type { OwnerActivationValues } from "../../lib/validation/owner-activation-schema";
import type { CardRecord, OutletRecord, SocialLink } from "../../lib/firebase/firestore-schema";

export async function activateOwnerCard(input: OwnerActivationValues, activatedBy: string) {
  const database = getFirebaseAdminFirestore();
  const auth = getFirebaseAdminAuth();
  const found = await database.collection("cards").where("cardId", "==", input.cardId.toUpperCase()).limit(1).get();
  const cardReference = found.docs.at(0)?.ref;
  if (!cardReference) throw new Error("CARD_NOT_FOUND");
  const initialCard = found.docs[0].data();
  if (initialCard.claimStatus !== "unclaimed" || initialCard.ownerId || initialCard.outletId) throw new Error("CARD_ALREADY_ASSIGNED");

  const account = await auth.createUser({ email: input.email, password: input.password, displayName: input.name });
  const outletReference = database.collection("outlets").doc();
  const slugReference = database.collection("outletSlugs").doc(input.slug);
  try {
    await database.runTransaction(async (transaction) => {
      const [snapshot, slugSnapshot, existingOutlets] = await Promise.all([transaction.get(cardReference), transaction.get(slugReference), transaction.get(database.collection("outlets").where("slug", "==", input.slug).limit(1))]);
      const card = snapshot.data() as CardRecord | undefined;
      if (!card || card.claimStatus !== "unclaimed" || card.ownerId || card.outletId) throw new Error("CARD_ALREADY_ASSIGNED");
      if (slugSnapshot.exists || !existingOutlets.empty) throw new Error("SLUG_ALREADY_USED");
      const timestamp = FieldValue.serverTimestamp();
      const links: SocialLink[] = input.links.map((link, order) => ({
        id: link.id, type: link.type, label: link.label, order, isActive: true,
        url: link.type === "google_review" ? getGoogleReviewUrl(link.value) : link.type === "whatsapp" ? `https://wa.me/${toWhatsAppInternationalNumber(link.value)}` : link.value,
      }));
      const google = input.links.find((link) => link.type === "google_review");
      transaction.create(database.collection("users").doc(account.uid), {
        uid: account.uid, name: input.name, email: input.email, phone: input.phone,
        provider: "password", role: "owner", status: "active", createdAt: timestamp, updatedAt: timestamp,
      });
      transaction.create(outletReference, {
        ownerId: account.uid, name: input.outletName, slug: input.slug, address: input.address,
        logoUrl: input.logoUrl ?? null,
        phone: input.phone, status: "active",
        createdAt: timestamp, updatedAt: timestamp,
      } satisfies OutletRecord);
      transaction.create(slugReference, { outletId: outletReference.id, ownerId: account.uid });
      transaction.update(cardReference, {
        ownerId: account.uid, outletId: outletReference.id, claimStatus: "claimed", isEnabled: true,
        claim: { ...card.claim, claimTokenHash: null, claimedAt: timestamp, claimedBy: activatedBy },
        config: {
          type: "social",
          google: { placeId: google?.value ?? null, reviewUrl: google ? getGoogleReviewUrl(google.value) : null, verificationStatus: google ? "pending" : null, verifiedAt: null },
          social: { profileName: input.outletName, description: null, avatarUrl: null, links },
        },
        nfc: { type: "tapqr", url: null, lastWrittenAt: null, lastWrittenBy: null },
        updatedAt: timestamp,
      });
    });
  } catch (error) {
    await auth.deleteUser(account.uid);
    throw error;
  }
  return { ownerId: account.uid, outletId: outletReference.id };
}
