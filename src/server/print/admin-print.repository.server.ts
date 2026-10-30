import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type {
  CardClaimStatus,
  CardMaterial,
  CardPrintStatus,
  CardRecord,
  OutletRecord,
} from "../../lib/firebase/firestore-schema";

export type PrintCardOption = {
  id: string;
  cardId: string;
  claimStatus: CardClaimStatus;
  printStatus: CardPrintStatus;
  material: CardMaterial;
  outletName: string | null;
  outletSlug: string | null;
};

export type PrintCardDetail = PrintCardOption & {
  logoUrl: string | null;
  phone: string | null;
  address: string | null;
};

function getMillis(val: unknown): number {
  if (!val) return 0;
  if (
    typeof val === "object" &&
    val !== null &&
    "toMillis" in val &&
    typeof (val as { toMillis: () => number }).toMillis === "function"
  ) {
    return (val as { toMillis: () => number }).toMillis();
  }
  if (typeof val === "number") return val;
  if (typeof val === "string") return new Date(val).getTime() || 0;
  return 0;
}

/**
 * Lists only cards that are UNCLAIMED and UNPRINTED for the print studio.
 */
export async function listCardsForPrint(): Promise<PrintCardOption[]> {
  const database = getFirebaseAdminFirestore();

  // Query only cards that are unclaimed
  const snapshot = await database
    .collection("cards")
    .where("claimStatus", "==", "unclaimed")
    .get();

  const cards = snapshot.docs.map((doc) => ({ ...doc.data() as CardRecord, id: doc.id }));

  // Filter only cards that have NOT been printed yet (unprinted)
  const unprintedCards = cards.filter(
    (c) => !c.print || c.print.status === "unprinted",
  );

  // Sort newest first
  unprintedCards.sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt));

  return unprintedCards.map((c) => ({
    id: c.id,
    cardId: c.cardId,
    claimStatus: c.claimStatus,
    printStatus: (c.print?.status as CardPrintStatus) ?? "unprinted",
    material: c.material === "pvc" ? "pvc" : "acrylic",
    outletName: null,
    outletSlug: null,
  }));
}

export async function getCardPrintDetail(cardId: string): Promise<PrintCardDetail | null> {
  const database = getFirebaseAdminFirestore();
  const matching = await database.collection("cards").where("cardId", "==", cardId).limit(1).get();
  const snapshot = matching.docs[0];
  if (!snapshot) return null;

  const cardData = snapshot.data() as CardRecord;
  let outletName: string | null = null;
  let outletSlug: string | null = null;
  let logoUrl: string | null = null;
  let phone: string | null = null;
  let address: string | null = null;

  if (cardData.outletId) {
    const outletSnap = await database.collection("outlets").doc(cardData.outletId).get();
    if (outletSnap.exists) {
      const oData = outletSnap.data() as OutletRecord;
      outletName = oData.name ?? null;
      outletSlug = oData.slug ?? null;
      logoUrl = oData.logoUrl ?? null;
      phone = oData.phone ?? null;
      address = oData.address ?? null;
    }
  }

  return {
    id: snapshot.id,
    cardId: cardData.cardId,
    claimStatus: cardData.claimStatus,
    printStatus: cardData.print?.status ?? "unprinted",
    material: cardData.material === "pvc" ? "pvc" : "acrylic",
    outletName,
    outletSlug,
    logoUrl,
    phone,
    address,
  };
}
