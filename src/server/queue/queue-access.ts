export function isQueueAddonActive(queue: { enabled?: unknown; expiresAt?: unknown } | null | undefined, now = Date.now()) {
  if (!queue?.enabled) return false;
  if (queue.expiresAt == null || queue.expiresAt === "") return true;
  if (typeof queue.expiresAt !== "string") return false;
  const expiry = Date.parse(queue.expiresAt);
  return Number.isFinite(expiry) && expiry > now;
}

export function queueDateKey(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((entry) => entry.type === type)?.value ?? "00";
  return `${part("year")}-${part("month")}-${part("day")}`;
}
