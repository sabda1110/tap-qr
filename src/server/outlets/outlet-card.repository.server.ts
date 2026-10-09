import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import { getGoogleReviewUrl } from "../../lib/google-review";
import { toWhatsAppInternationalNumber } from "../../lib/validation/whatsapp-number";
import type {
  CardRecord,
  SocialLink,
} from "../../lib/firebase/firestore-schema";
import type { CardLinksEditValues } from "./outlet.schemas";
import { assertOutletOwner } from "./outlet-ownership";

export async function updateOutletCardLinks(input: CardLinksEditValues, ownerId?: string) {
  const database = getFirebaseAdminFirestore();
  const reference = database.collection("cards").doc(input.cardId);
  await database.runTransaction(async (transaction) => {
    const [snapshot, outlet] = await Promise.all([
      transaction.get(reference),
      transaction.get(database.collection("outlets").doc(input.outletId)),
    ]);
    const card = snapshot.data() as CardRecord | undefined;
    if (
      !outlet.exists ||
      !card ||
      card.outletId !== input.outletId ||
      card.claimStatus !== "claimed"
    )
      throw new Error("OUTLET_CARD_NOT_FOUND");
    if (ownerId !== undefined) {
      assertOutletOwner(outlet.data()?.ownerId, ownerId);
      assertOutletOwner(card.ownerId, ownerId);
    }
    const links: SocialLink[] = input.links.map((link, order) => ({
      id: link.id,
      type: link.type,
      label: link.label,
      isActive: link.isActive,
      order,
      url:
        link.type === "google_review"
          ? getGoogleReviewUrl(link.value)
          : link.type === "whatsapp"
            ? `https://wa.me/${toWhatsAppInternationalNumber(link.value)}`
            : link.value,
    }));
    const google = input.links.find(
      (link) => link.type === "google_review" && link.isActive,
    );
    const samePlace = google && card.config?.google?.placeId === google.value;
    transaction.update(reference, {
      "config.type": "social",
      "config.social.links": links,
      "config.google": {
        placeId: google?.value ?? null,
        reviewUrl: google ? getGoogleReviewUrl(google.value) : null,
        verificationStatus: google
          ? samePlace
            ? card.config.google.verificationStatus
            : "pending"
          : null,
        verifiedAt: samePlace ? card.config.google.verifiedAt : null,
      },
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}
