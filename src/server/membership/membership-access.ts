export function isMembershipAddonActive(membership: { enabled?: unknown; expiresAt?: unknown } | null | undefined, now = Date.now()) {
  if (!membership?.enabled) return false;
  if (membership.expiresAt == null || membership.expiresAt === "") return true;
  if (typeof membership.expiresAt !== "string") return false;
  const expiry = Date.parse(membership.expiresAt);
  return Number.isFinite(expiry) && expiry > now;
}
