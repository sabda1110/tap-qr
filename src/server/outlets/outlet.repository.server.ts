import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type { CardRecord } from "../../lib/firebase/firestore-schema";
import type { OutletDetail, OutletList, OutletSummary } from "./outlet.types";
import type { OutletEditValues } from "./outlet.schemas";

function timestamp(value: unknown): string | null {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return (value.toDate() as Date).toISOString();
  }
  return null;
}

function summary(
  id: string,
  outlet: DocumentData,
  cards: CardRecord[],
): OutletSummary {
  const links = cards.flatMap((card) => card.config?.social?.links ?? []);
  return {
    id,
    ownerId: outlet.ownerId ?? "",
    name: outlet.name ?? "",
    slug: outlet.slug ?? "",
    logoUrl: outlet.logoUrl ?? null,
    address: outlet.address ?? "",
    city: outlet.city ?? "",
    province: outlet.province ?? "",
    phone: outlet.phone ?? "",
    status: outlet.status === "disabled" ? "disabled" : "active",
    createdAt: timestamp(outlet.createdAt),
    updatedAt: timestamp(outlet.updatedAt),
    cardCount: cards.filter((card) => card.claimStatus === "claimed").length,
    activeCardCount: cards.filter(
      (card) => card.claimStatus === "claimed" && card.isEnabled,
    ).length,
    channels: [
      ...new Set(
        links.filter((link) => link.isActive).map((link) => link.type),
      ),
    ],
  };
}

export async function listOutlets({
  query,
  cursor,
}: {
  query: string;
  cursor?: string;
}): Promise<OutletList> {
  const database = getFirebaseAdminFirestore();
  let request = database
    .collection("outlets")
    .orderBy("name")
    .orderBy("__name__")
    .limit(11);
  if (query)
    request = request
      .where("name", ">=", query)
      .where("name", "<=", `${query}\uf8ff`);
  if (cursor) {
    const previous = await database.collection("outlets").doc(cursor).get();
    if (previous.exists) request = request.startAfter(previous);
  }
  const snapshot = await request.get();
  const outlets = await Promise.all(
    snapshot.docs.slice(0, 10).map(async (document) => {
      const cards = await database
        .collection("cards")
        .where("outletId", "==", document.id)
        .get();
      return summary(
        document.id,
        document.data(),
        cards.docs.map((card) => card.data() as CardRecord),
      );
    }),
  );
  return {
    outlets,
    nextCursor: snapshot.docs.length > 10 ? outlets.at(-1)?.id : undefined,
  };
}

export async function getOutletDetail(id: string): Promise<OutletDetail> {
  const database = getFirebaseAdminFirestore();
  const document = await database.collection("outlets").doc(id).get();
  if (!document.exists) throw new Error("OUTLET_NOT_FOUND");
  const outlet = document.data()!;
  const [owner, cardSnapshot] = await Promise.all([
    outlet.ownerId
      ? database.collection("users").doc(outlet.ownerId).get()
      : Promise.resolve(null),
    database.collection("cards").where("outletId", "==", id).get(),
  ]);
  const cards = cardSnapshot.docs.map((card) => ({
    id: card.id,
    record: card.data() as CardRecord,
  }));
  const profile = owner?.data();
  return {
    ...summary(
      id,
      outlet,
      cards.map((card) => card.record),
    ),
    owner: profile
      ? {
          name: profile.name ?? "",
          email: profile.email ?? "",
          phone: profile.phone ?? "",
          status: profile.status ?? "",
        }
      : null,
    cards: cards.map(({ id: cardId, record }) => ({
      id: cardId,
      cardId: record.cardId,
      material: record.material,
      isEnabled: record.isEnabled,
      claimStatus: record.claimStatus,
      links: [...(record.config?.social?.links ?? [])].sort(
        (a, b) => a.order - b.order,
      ),
      channels: [
        ...new Set(
          (record.config?.social?.links ?? [])
            .filter((link) => link.isActive)
            .map((link) => link.type),
        ),
      ],
    })),
  };
}

export async function updateOutlet(input: OutletEditValues) {
  const database = getFirebaseAdminFirestore();
  const reference = database.collection("outlets").doc(input.id);
  await database.runTransaction(async (transaction) => {
    const outletSnapshot = await transaction.get(reference);
    if (!outletSnapshot.exists) throw new Error("OUTLET_NOT_FOUND");
    const outlet = outletSnapshot.data()!;
    const newSlugReference = database.collection("outletSlugs").doc(input.slug);
    const oldSlugReference =
      outlet.slug && outlet.slug !== input.slug
        ? database.collection("outletSlugs").doc(outlet.slug)
        : null;
    const oldSlug = oldSlugReference
      ? await transaction.get(oldSlugReference)
      : null;
    const [slug, duplicates] = await Promise.all([
      transaction.get(newSlugReference),
      transaction.get(
        database.collection("outlets").where("slug", "==", input.slug),
      ),
    ]);
    if (
      (slug.exists && slug.data()?.outletId !== input.id) ||
      duplicates.docs.some((other) => other.id !== input.id)
    )
      throw new Error("SLUG_ALREADY_USED");
    const now = FieldValue.serverTimestamp();
    transaction.update(reference, {
      name: input.outletName,
      ...(input.logoUrl !== undefined ? { logoUrl: input.logoUrl } : {}),
      slug: input.slug,
      address: input.address,
      city: input.city,
      province: input.province,
      phone: input.phone,
      status: input.status,
      updatedAt: now,
    });
    transaction.set(newSlugReference, {
      outletId: input.id,
      ownerId: outlet.ownerId,
    });
    if (oldSlugReference && oldSlug?.data()?.outletId === input.id)
      transaction.delete(oldSlugReference);
  });
}
