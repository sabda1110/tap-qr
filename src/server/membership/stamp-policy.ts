export type StampExpiryUnit = "day" | "month";

export type StampPolicy = {
  stampExpiryValue?: number;
  stampExpiryUnit?: StampExpiryUnit;
  dailyStampLimit?: number;
};

export function stampDayKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export function stampExpiryTime(lastStampAt: string | null, policy: StampPolicy) {
  if (!lastStampAt) return null;
  const last = new Date(lastStampAt);
  const value = policy.stampExpiryValue ?? 30;
  if (!Number.isFinite(last.getTime()) || value < 1) return null;
  if ((policy.stampExpiryUnit ?? "day") === "day") return last.getTime() + value * 86_400_000;
  const expiry = new Date(last);
  const originalDay = expiry.getUTCDate();
  expiry.setUTCDate(1);
  expiry.setUTCMonth(expiry.getUTCMonth() + value);
  const lastDay = new Date(Date.UTC(expiry.getUTCFullYear(), expiry.getUTCMonth() + 1, 0)).getUTCDate();
  expiry.setUTCDate(Math.min(originalDay, lastDay));
  return expiry.getTime();
}

export function stampsHaveExpired(lastStampAt: string | null, policy: StampPolicy, now = Date.now()) {
  const expiry = stampExpiryTime(lastStampAt, policy);
  return expiry !== null && expiry <= now;
}
