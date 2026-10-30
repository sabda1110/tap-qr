import { bookingsRef } from "./consultation-store.server";

export function isConsultationIndexMissing(error: unknown) {
  return error instanceof Error && "code" in error && error.code === 9 && /index/i.test(error.message);
}

export async function waitingConsultationBookings() {
  const waiting = bookingsRef().where("status", "==", "menunggu");
  try {
    return (await waiting.orderBy("deadlineAt").limit(500).get()).docs;
  } catch (error) {
    if (!isConsultationIndexMissing(error)) throw error;
    // Only a temporary fallback while the composite index is being deployed.
    // Sort before limiting so an earlier deadline cannot be omitted by document ID.
    const snapshot = await waiting.get();
    return snapshot.docs
      .filter((doc) => typeof doc.data().deadlineAt === "string")
      .sort((a, b) => a.data().deadlineAt.localeCompare(b.data().deadlineAt) || a.id.localeCompare(b.id))
      .slice(0, 500);
  }
}
