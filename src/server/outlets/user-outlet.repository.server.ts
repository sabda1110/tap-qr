import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type { CardRecord } from "../../lib/firebase/firestore-schema";
import { assertOutletOwner } from "./outlet-ownership";
import { buildOutletSummary } from "./outlet.repository.server";
import type { OutletDetail } from "./outlet.types";

export async function listUserDashboardOutlets(
  uid: string,
): Promise<OutletDetail[]> {
  const database = getFirebaseAdminFirestore();
  const [outlets, cards] = await Promise.all([
    database.collection("outlets").where("ownerId", "==", uid).get(),
    database.collection("cards").where("ownerId", "==", uid).get(),
  ]);
  const cardsByOutlet = new Map<string, OutletDetail["cards"]>();
  const recordsByOutlet = new Map<string, CardRecord[]>();
  for (const document of cards.docs) {
    const record = document.data() as CardRecord;
    if (!record.outletId || record.claimStatus !== "claimed") continue;
    const outletCards = cardsByOutlet.get(record.outletId) ?? [];
    const links = [...(record.config?.social?.links ?? [])].sort(
      (a, b) => a.order - b.order,
    );
    outletCards.push({
      id: document.id,
      cardId: record.cardId,
      material: record.material,
      isEnabled: record.isEnabled,
      claimStatus: record.claimStatus,
      links,
      channels: [
        ...new Set(
          links.filter((link) => link.isActive).map((link) => link.type),
        ),
      ],
    });
    cardsByOutlet.set(record.outletId, outletCards);
    const records = recordsByOutlet.get(record.outletId) ?? [];
    records.push(record);
    recordsByOutlet.set(record.outletId, records);
  }
  return outlets.docs
    .map((document) => ({
      ...buildOutletSummary(
        document.id,
        document.data(),
        recordsByOutlet.get(document.id) ?? [],
      ),
      owner: null,
      cards: (cardsByOutlet.get(document.id) ?? []).sort((a, b) =>
        a.cardId.localeCompare(b.cardId),
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function checkUserOutletSlug(
  uid: string,
  id: string,
  slug: string,
) {
  const database = getFirebaseAdminFirestore();
  const outlet = await database.collection("outlets").doc(id).get();
  assertOutletOwner(outlet.data()?.ownerId, uid);
  const [reservation, duplicates] = await Promise.all([
    database.collection("outletSlugs").doc(slug).get(),
    database.collection("outlets").where("slug", "==", slug).get(),
  ]);
  return {
    available:
      (!reservation.exists || reservation.data()?.outletId === id) &&
      duplicates.docs.every((document) => document.id === id),
  };
}
