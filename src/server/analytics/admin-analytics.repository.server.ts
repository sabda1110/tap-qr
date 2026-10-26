import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";

export type AdminAnalyticsSummary = {
  users: {
    total: number;
    active: number;
  };
  outlets: {
    total: number;
    active: number;
  };
  cards: {
    total: number;
    claimed: number;
    unclaimed: number;
    printed: number;
    unprinted: number;
    enabled: number;
    disabled: number;
    acrylic: number;
    pvc: number;
  };
  scans: {
    total: number;
    cardVisits: number;
    profileViews: number;
  };
  recentOutlets: Array<{
    id: string;
    name: string;
    slug: string;
    address: string;
    phone: string;
  }>;
};

async function getCount(query: FirebaseFirestore.Query): Promise<number> {
  try {
    const snapshot = await query.count().get();
    return snapshot.data().count;
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : "unknown";
    console.error("ADMIN_ANALYTICS_COUNT_FAILED", { code, message: error instanceof Error ? error.message : "Unknown error" });
    throw new Error("ADMIN_ANALYTICS_UNAVAILABLE");
  }
}

export async function getAdminAnalyticsSummary(): Promise<AdminAnalyticsSummary> {
  const database = getFirebaseAdminFirestore();

  const [
    totalUsers,
    activeUsers,
    totalOutlets,
    activeOutlets,
    totalCards,
    claimedCards,
    unclaimedCards,
    printedCards,
    unprintedCards,
    enabledCards,
    acrylicCards,
    pvcCards,
    totalScans,
    cardVisits,
    profileViews,
    recentOutletsSnapshot,
  ] = await Promise.all([
    getCount(database.collection("users").where("role", "==", "owner")),
    getCount(
      database
        .collection("users")
        .where("role", "==", "owner")
        .where("status", "==", "active"),
    ),
    getCount(database.collection("outlets")),
    getCount(database.collection("outlets").where("status", "==", "active")),
    getCount(database.collection("cards")),
    getCount(database.collection("cards").where("claimStatus", "==", "claimed")),
    getCount(database.collection("cards").where("claimStatus", "==", "unclaimed")),
    getCount(database.collection("cards").where("print.status", "==", "printed")),
    getCount(database.collection("cards").where("print.status", "==", "unprinted")),
    getCount(database.collection("cards").where("isEnabled", "==", true)),
    getCount(database.collection("cards").where("material", "==", "acrylic")),
    getCount(database.collection("cards").where("material", "==", "pvc")),
    getCount(database.collection("scanEvents")),
    getCount(database.collection("scanEvents").where("event", "==", "card_visit")),
    getCount(database.collection("scanEvents").where("event", "==", "profile_view")),
    database
      .collection("outlets")
      .orderBy("createdAt", "desc")
      .limit(5)
      .get(),
  ]);

  const recentOutlets = recentOutletsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: String(data.name ?? ""),
      slug: String(data.slug ?? ""),
      address: String(data.address ?? ""),
      phone: String(data.phone ?? ""),
    };
  });

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
    },
    outlets: {
      total: totalOutlets,
      active: activeOutlets,
    },
    cards: {
      total: totalCards,
      claimed: claimedCards,
      unclaimed: unclaimedCards,
      printed: printedCards,
      unprinted: unprintedCards,
      enabled: enabledCards,
      disabled: Math.max(0, totalCards - enabledCards),
      acrylic: acrylicCards,
      pvc: pvcCards,
    },
    scans: {
      total: totalScans,
      cardVisits,
      profileViews,
    },
    recentOutlets,
  };
}
