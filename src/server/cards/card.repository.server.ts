import { createHash, randomBytes } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";

import type {
  CardClaimStatus,
  CardMaterial,
  CardRecord,
  SocialLink,
} from "../../lib/firebase/firestore-schema";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type { CardClaimFilter } from "./card.schemas";

const pageSize = 10;

export type MasterCard = Pick<CardRecord, "cardId" | "claimStatus" | "isEnabled" | "material"> & {
  id: string;
  printStatus: CardRecord["print"]["status"];
};

export async function createCardBatch(quantity: number, material: CardMaterial) {
  const database = getFirebaseAdminFirestore();

  return database.runTransaction(async (transaction) => {
    const cards = Array.from({ length: quantity }, () => {
      const reference = database.collection("cards").doc();
      const claimToken = randomBytes(32).toString("base64url");
      const card: CardRecord = {
        cardId: `TQR-${randomBytes(16).toString("hex").toUpperCase()}`,
        material,
        claimStatus: "unclaimed",
        ownerId: null,
        outletId: null,
        claim: { claimTokenHash: hashClaimToken(claimToken), claimedAt: null, claimedBy: null },
        print: { status: "unprinted", printedAt: null, printedBy: null },
        config: {
          type: "google_review",
          google: { placeId: null, reviewUrl: null, verificationStatus: null, verifiedAt: null },
          social: { profileName: null, description: null, avatarUrl: null, links: [] },
        },
        nfc: { type: "tapqr", url: null, lastWrittenAt: null, lastWrittenBy: null },
        isEnabled: true,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };
      transaction.create(reference, card);
      return { id: reference.id, ...card };
    });

    return cards.map(({ id, cardId, claimStatus, isEnabled, material: cardMaterial }) => ({ id, cardId, claimStatus, isEnabled, material: cardMaterial }));
  });
}

export async function listMasterCards({
  cursor,
  query,
  status = "all",
}: {
  cursor?: string;
  query: string;
  status?: CardClaimFilter;
}) {
  const database = getFirebaseAdminFirestore();
  const normalizedQuery = query.toUpperCase();
  let request: FirebaseFirestore.Query = database.collection("cards");

  if (status && status !== "all") {
    request = request.where("claimStatus", "==", status);
  }

  if (normalizedQuery) {
    request = request.where("cardId", ">=", normalizedQuery).where("cardId", "<=", `${normalizedQuery}\uf8ff`);
  }
  request = request.orderBy("cardId").limit(pageSize + 1);
  if (cursor) request = request.startAfter(cursor);

  try {
    const snapshot = await request.get();
    const cards = snapshot.docs.slice(0, pageSize).map((document) => toMasterCard(document.id, document.data()));
    return { cards, nextCursor: snapshot.docs.length > pageSize ? cards.at(-1)?.cardId : undefined };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = (error as { code?: number })?.code;

    if (errorMessage.includes("index") || errorCode === 9) {
      console.warn("Firestore index missing for card query, using fallback:", errorMessage);
      let fallbackRequest: FirebaseFirestore.Query = database.collection("cards");
      if (status && status !== "all") {
        fallbackRequest = fallbackRequest.where("claimStatus", "==", status);
      }
      const snapshot = await fallbackRequest.get();
      let allCards = snapshot.docs.map((doc) => toMasterCard(doc.id, doc.data()));
      if (normalizedQuery) {
        allCards = allCards.filter((card) => card.cardId.includes(normalizedQuery));
      }
      allCards.sort((a, b) => a.cardId.localeCompare(b.cardId));

      let startIndex = 0;
      if (cursor) {
        const foundIndex = allCards.findIndex((card) => card.cardId === cursor);
        if (foundIndex !== -1) {
          startIndex = foundIndex + 1;
        }
      }
      const pageCards = allCards.slice(startIndex, startIndex + pageSize);
      const nextCursor = allCards.length > startIndex + pageSize ? pageCards.at(-1)?.cardId : undefined;
      return { cards: pageCards, nextCursor };
    }
    throw error;
  }
}

export async function removeUnusedCards(ids: string[]) {
  const database = getFirebaseAdminFirestore();
  return database.runTransaction(async (transaction) => {
    const references = ids.map((id) => database.collection("cards").doc(id));
    const snapshots = await Promise.all(references.map((reference) => transaction.get(reference)));
    const unusedReferences = snapshots
      .filter((snapshot) => snapshot.exists && isUnusedCard(snapshot.data()))
      .map((snapshot) => snapshot.ref);

    unusedReferences.forEach((reference) => transaction.delete(reference));
    return unusedReferences.length;
  });
}

export async function removeAllUnusedCards() {
  const database = getFirebaseAdminFirestore();
  const snapshot = await database.collection("cards").where("claimStatus", "==", "unclaimed").get();
  const unusedIds = snapshot.docs.filter((document) => isUnusedCard(document.data())).map((document) => document.id);
  let deletedCount = 0;

  for (const ids of splitIntoChunks(unusedIds, 100)) {
    deletedCount += await removeUnusedCards(ids);
  }
  return deletedCount;
}

export async function updateCardsPrintStatus(
  ids: string[],
  status: CardRecord["print"]["status"],
  adminId: string,
) {
  const database = getFirebaseAdminFirestore();
  return database.runTransaction(async (transaction) => {
    const references = ids.map((id) => database.collection("cards").doc(id));
    const snapshots = await Promise.all(references.map((reference) => transaction.get(reference)));
    const printableCards = snapshots.filter(
      (snapshot) => snapshot.exists && snapshot.data()?.claimStatus === "unclaimed",
    );
    const timestamp = FieldValue.serverTimestamp();

    printableCards.forEach((snapshot) => {
      transaction.update(snapshot.ref, {
        print: {
          status,
          printedAt: status === "printed" ? timestamp : null,
          printedBy: status === "printed" ? adminId : null,
        },
        updatedAt: timestamp,
      });
    });
    return printableCards.length;
  });
}

function toMasterCard(id: string, data: FirebaseFirestore.DocumentData): MasterCard {
  return {
    id,
    cardId: String(data.cardId),
    claimStatus: data.claimStatus === "claimed" ? "claimed" : "unclaimed",
    isEnabled: Boolean(data.isEnabled),
    material: data.material === "pvc" ? "pvc" : "acrylic",
    printStatus: data.print?.status === "printed" ? "printed" : "unprinted",
  };
}

function hashClaimToken(claimToken: string) {
  return createHash("sha256").update(claimToken).digest("hex");
}

function isUnusedCard(data: FirebaseFirestore.DocumentData | undefined) {
  return data?.claimStatus === "unclaimed" && (data.ownerId === null || data.ownerId === undefined);
}

function splitIntoChunks<T>(items: T[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));
}

export type AdminCardDetail = {
  id: string;
  cardId: string;
  material: CardMaterial;
  claimStatus: CardClaimStatus;
  printStatus: CardRecord["print"]["status"];
  isEnabled: boolean;
  outlet: {
    id: string;
    name: string;
    slug: string;
    address: string;
    phone: string;
    logoUrl: string | null;
  } | null;
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
  config: {
    type: "google_review" | "social";
    google: {
      placeId: string | null;
      reviewUrl: string | null;
      verificationStatus: "pending" | "verified" | "invalid" | null;
    };
    social: {
      profileName: string | null;
      description: string | null;
      avatarUrl: string | null;
      links: SocialLink[];
    };
  };
};

export async function getMasterCardDetail(id: string): Promise<AdminCardDetail> {
  const database = getFirebaseAdminFirestore();
  const cardSnapshot = await database.collection("cards").doc(id).get();
  if (!cardSnapshot.exists) throw new Error("CARD_NOT_FOUND");
  const cardData = cardSnapshot.data() as CardRecord;

  const [outletSnapshot, ownerSnapshot] = await Promise.all([
    cardData.outletId
      ? database.collection("outlets").doc(cardData.outletId).get()
      : Promise.resolve(null),
    cardData.ownerId
      ? database.collection("users").doc(cardData.ownerId).get()
      : Promise.resolve(null),
  ]);

  const outletData = outletSnapshot?.exists ? outletSnapshot.data() : null;
  const ownerData = ownerSnapshot?.exists ? ownerSnapshot.data() : null;

  return {
    id: cardSnapshot.id,
    cardId: cardData.cardId,
    material: cardData.material,
    claimStatus: cardData.claimStatus,
    printStatus: cardData.print?.status ?? "unprinted",
    isEnabled: Boolean(cardData.isEnabled),
    outlet: outletData
      ? {
          id: cardData.outletId!,
          name: outletData.name ?? "",
          slug: outletData.slug ?? "",
          address: outletData.address ?? "",
          phone: outletData.phone ?? "",
          logoUrl: outletData.logoUrl ?? null,
        }
      : null,
    owner: ownerData
      ? {
          id: cardData.ownerId!,
          name: ownerData.name ?? ownerData.displayName ?? "",
          email: ownerData.email ?? "",
          phone: ownerData.phone ?? "",
        }
      : null,
    config: {
      type: cardData.config?.type ?? "google_review",
      google: {
        placeId: cardData.config?.google?.placeId ?? null,
        reviewUrl: cardData.config?.google?.reviewUrl ?? null,
        verificationStatus: cardData.config?.google?.verificationStatus ?? null,
      },
      social: {
        profileName: cardData.config?.social?.profileName ?? null,
        description: cardData.config?.social?.description ?? null,
        avatarUrl: cardData.config?.social?.avatarUrl ?? null,
        links: Array.isArray(cardData.config?.social?.links)
          ? cardData.config.social.links
          : [],
      },
    },
  };
}
