export function assertOutletOwner(ownerId: unknown, uid: string) {
  if (!uid || ownerId !== uid) throw new Error("OUTLET_NOT_AVAILABLE");
}
