import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { deleteCookie, getCookie, getRequestProtocol, setCookie } from "@tanstack/react-start/server";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type { OutletMembershipAddon } from "../../lib/firebase/firestore-schema";
import { isMembershipAddonActive } from "./membership-access";

const COOKIE = "tapqr_cashier";
const SESSION_SECONDS = 24 * 60 * 60;

function secret() {
  const value = process.env.MEMBERSHIP_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("MEMBERSHIP_SECRET_REQUIRED");
  return value;
}

export function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function hashCashierPin(outletId: string, pin: string, salt: string) {
  return hashValue(`${outletId}:${pin}:${salt}:${secret()}`);
}

export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function createPublicToken() {
  return randomBytes(32).toString("base64url");
}

export function createDocumentId(prefix: "MBR" | "LOG") {
  return `${prefix}-${randomBytes(16).toString("hex").toUpperCase()}`;
}

export function setCashierSession(outletId: string, version: number) {
  const expiresAt = Date.now() + SESSION_SECONDS * 1000;
  const payload = Buffer.from(JSON.stringify({ outletId, version, expiresAt })).toString("base64url");
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  setCookie(COOKIE, `${payload}.${signature}`, {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: SESSION_SECONDS,
    secure: getRequestProtocol({ xForwardedProto: true }) === "https",
  });
}

export function clearCashierSession() {
  deleteCookie(COOKIE, { path: "/" });
}

export async function requireCashierSession(outletId: string) {
  const stored = getCookie(COOKIE);
  if (!stored) throw new Error("CASHIER_AUTH_REQUIRED");
  const [payload, signature] = stored.split(".");
  if (!payload || !signature) throw new Error("CASHIER_AUTH_REQUIRED");
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  if (!safeEqual(signature, expected)) throw new Error("CASHIER_AUTH_REQUIRED");
  let session: { outletId: string; version: number; expiresAt: number };
  try { session = JSON.parse(Buffer.from(payload, "base64url").toString()); }
  catch { throw new Error("CASHIER_AUTH_REQUIRED"); }
  if (session.outletId !== outletId || session.expiresAt < Date.now()) throw new Error("CASHIER_AUTH_REQUIRED");
  const outlet = await getFirebaseAdminFirestore().collection("outlets").doc(outletId).get();
  const membership = outlet.data()?.addons?.membership as OutletMembershipAddon | undefined;
  if (!outlet.exists || !isMembershipAddonActive(membership) || membership?.cashierSessionVersion !== session.version) {
    clearCashierSession();
    throw new Error("CASHIER_AUTH_REQUIRED");
  }
  return { actor: "cashier" as const, actorUid: "cashier-session", membership, outlet: outlet.data()! };
}
