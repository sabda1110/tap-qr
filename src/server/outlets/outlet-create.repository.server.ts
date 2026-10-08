import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import { getGoogleReviewUrl } from "../../lib/google-review";
import { toWhatsAppInternationalNumber } from "../../lib/validation/whatsapp-number";
import type {
  CardRecord,
  OutletRecord,
  SocialLink,
} from "../../lib/firebase/firestore-schema";
import type {
  CreateOutletValues,
  OutletOwnerOption,
  SourceOutletOption,
} from "./outlet-create.schemas";

export async function searchOutletOwners(
  query: string,
): Promise<OutletOwnerOption[]> {
  let request = getFirebaseAdminFirestore()
    .collection("users")
    .orderBy("email")
    .limit(20);
  if (query)
    request = request
      .where("email", ">=", query)
      .where("email", "<=", `${query}\uf8ff`);
  const snapshot = await request.get();
  return snapshot.docs
    .filter(
      (document) =>
        document.data().role === "owner" && document.data().status === "active",
    )
    .map((document) => {
      const owner = document.data();
      return {
        id: document.id,
        name: owner.name ?? "",
        email: owner.email ?? "",
        phone: owner.phone ?? "",
      };
    });
}

export async function listOwnerSourceOutlets(
  ownerId: string,
): Promise<SourceOutletOption[]> {
  const snapshot = await getFirebaseAdminFirestore()
    .collection("outlets")
    .where("ownerId", "==", ownerId)
    .limit(100)
    .get();
  return snapshot.docs.map((document) => ({
    id: document.id,
    name: document.data().name ?? "",
    slug: document.data().slug ?? "",
  }));
}

export async function createOwnerOutlet(
  input: CreateOutletValues,
  adminId: string,
) {
  const database = getFirebaseAdminFirestore();
  const matches = await database
    .collection("cards")
    .where("cardId", "==", input.cardId.toUpperCase())
    .limit(1)
    .get();
  const cardReference = matches.docs[0]?.ref;
  if (!cardReference) throw new Error("CARD_NOT_FOUND");
  const outletReference = database.collection("outlets").doc();
  const slugReference = database.collection("outletSlugs").doc(input.slug);
  await database.runTransaction(async (transaction) => {
    const [owner, cardSnapshot, slug, duplicates] = await Promise.all([
      transaction.get(database.collection("users").doc(input.ownerId)),
      transaction.get(cardReference),
      transaction.get(slugReference),
      transaction.get(
        database.collection("outlets").where("slug", "==", input.slug).limit(1),
      ),
    ]);
    if (
      !owner.exists ||
      owner.data()?.role !== "owner" ||
      owner.data()?.status !== "active"
    )
      throw new Error("OWNER_NOT_AVAILABLE");
    const card = cardSnapshot.data() as CardRecord | undefined;
    if (
      !card ||
      card.claimStatus !== "unclaimed" ||
      card.ownerId ||
      card.outletId
    )
      throw new Error("CARD_ALREADY_ASSIGNED");
    if (slug.exists || !duplicates.empty) throw new Error("SLUG_ALREADY_USED");
    const now = FieldValue.serverTimestamp();
    const links: SocialLink[] = input.links.map((link, order) => ({
      id: link.id,
      type: link.type,
      label: link.label,
      order,
      isActive: link.isActive,
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
    transaction.create(outletReference, {
      ownerId: input.ownerId,
      name: input.outletName,
      slug: input.slug,
      logoUrl: input.logoUrl ?? null,
      address: input.address,
      phone: input.phone,
      status: input.status,
      createdAt: now,
      updatedAt: now,
    } satisfies OutletRecord);
    transaction.create(slugReference, {
      outletId: outletReference.id,
      ownerId: input.ownerId,
    });
    transaction.update(cardReference, {
      ownerId: input.ownerId,
      outletId: outletReference.id,
      claimStatus: "claimed",
      isEnabled: true,
      claim: {
        ...card.claim,
        claimTokenHash: null,
        claimedAt: now,
        claimedBy: adminId,
      },
      config: {
        type: "social",
        google: {
          placeId: google?.value ?? null,
          reviewUrl: google ? getGoogleReviewUrl(google.value) : null,
          verificationStatus: google ? "pending" : null,
          verifiedAt: null,
        },
        social: {
          profileName: input.outletName,
          description: null,
          avatarUrl: null,
          links,
        },
      },
      nfc: {
        type: "tapqr",
        url: null,
        lastWrittenAt: null,
        lastWrittenBy: null,
      },
      updatedAt: now,
    });
  });
  return { outletId: outletReference.id };
}
