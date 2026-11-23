import { createHmac } from "node:crypto";
import { deleteCookie, getCookie, getRequestProtocol, setCookie } from "@tanstack/react-start/server";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import { isQueueAddonActive } from "./queue-access";
import { safeEqual } from "../membership/membership-security.server";

const COOKIE = "tapqr_queue_cashier";
const SESSION_SECONDS = 24 * 60 * 60;

function secret() {
  const value = process.env.MEMBERSHIP_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("MEMBERSHIP_SECRET_REQUIRED");
  return value;
}

export function setQueueCashierSession(outletId: string, version: number) {
  const expiresAt = Date.now() + SESSION_SECONDS * 1000;
  const payload = Buffer.from(JSON.stringify({ outletId, version, expiresAt })).toString("base64url");
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  setCookie(COOKIE, `${payload}.${signature}`, { httpOnly: true, sameSite: "lax", path: "/", maxAge: SESSION_SECONDS,
    secure: getRequestProtocol({ xForwardedProto: true }) === "https" });
}

export function clearQueueCashierSession() { deleteCookie(COOKIE, { path: "/" }); }

export async function requireQueueCashierSession(outletId: string) {
  const stored = getCookie(COOKIE);
  if (!stored) throw new Error("QUEUE_CASHIER_AUTH_REQUIRED");
  const [payload, signature] = stored.split(".");
  if (!payload || !signature || !safeEqual(signature, createHmac("sha256", secret()).update(payload).digest("base64url"))) {
    throw new Error("QUEUE_CASHIER_AUTH_REQUIRED");
  }
  let session: { outletId: string; version: number; expiresAt: number };
  try { session = JSON.parse(Buffer.from(payload, "base64url").toString()); }
  catch { throw new Error("QUEUE_CASHIER_AUTH_REQUIRED"); }
  if (session.outletId !== outletId || session.expiresAt < Date.now()) throw new Error("QUEUE_CASHIER_AUTH_REQUIRED");
  const outlet = await getFirebaseAdminFirestore().collection("outlets").doc(outletId).get();
  const queue = outlet.data()?.addons?.queue;
  if (!outlet.exists || !isQueueAddonActive(queue) || queue?.cashierSessionVersion !== session.version) {
    clearQueueCashierSession();
    throw new Error("QUEUE_CASHIER_AUTH_REQUIRED");
  }
  return { outletName: String(outlet.data()?.name ?? ""), ownerId: String(outlet.data()?.ownerId ?? "") };
}
