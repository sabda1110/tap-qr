import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { randomBytes } from "node:crypto";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type { MemberDocument, OutletMembershipAddon } from "../../lib/firebase/firestore-schema";
import { assertUserOutletAccess } from "../outlets/user-outlet.repository.server";
import { createDocumentId, createPublicToken, hashValue } from "./membership-security.server";
import type { MemberPass, MemberView } from "./membership.types";

export function normalizeMemberPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("0")) return `+62${digits.slice(1)}`;
  if (digits.startsWith("62")) return `+${digits}`;
  if (value.startsWith("+") && digits.length >= 9) return `+${digits}`;
  throw new Error("INVALID_PHONE");
}

function maskPhone(phone: string) {
  return phone.length > 8 ? `${phone.slice(0, 5)}****${phone.slice(-4)}` : "****";
}

function view(member: MemberDocument, includePhone = true): MemberView {
  const expired = member.expiresAt ? new Date(member.expiresAt).getTime() <= Date.now() : false;
  return { id: member.id, name: member.name, ...(includePhone ? { maskedPhone: maskPhone(member.phone) } : {}),
    status: expired && member.status === "active" ? "expired" : member.status,
    expiryType: member.expiryType, expiresAt: member.expiresAt, totalVisits: member.totalVisits,
    currentStamps: member.currentStamps, totalRewardsClaimed: member.totalRewardsClaimed,
    lastVisitedAt: member.lastVisitedAt, registeredAt: member.registeredAt };
}

export async function getMembershipOutlet(outletId: string) {
  const snap = await getFirebaseAdminFirestore().collection("outlets").doc(outletId).get();
  const membership = snap.data()?.addons?.membership as OutletMembershipAddon | undefined;
  if (!snap.exists || !membership?.enabled) throw new Error("MEMBERSHIP_NOT_ENABLED");
  return { outlet: snap.data()!, membership };
}

export async function registerMember(input: { outletId: string; name: string; phone: string; notes?: string }, actorUid: string) {
  const database = getFirebaseAdminFirestore();
  const { membership } = await getMembershipOutlet(input.outletId);
  const phone = normalizeMemberPhone(input.phone);
  const id = createDocumentId("MBR");
  const token = createPublicToken();
  const now = new Date().toISOString();
  const expiresAt = membership.expiryType === "period"
    ? new Date(Date.now() + (membership.defaultDurationDays ?? 30) * 86_400_000).toISOString() : null;
  const member: MemberDocument = { id, tokenHash: hashValue(token), name: input.name.trim(), phone,
    status: "active", expiryType: membership.expiryType, expiresAt, totalVisits: 0, currentStamps: 0,
    totalRewardsClaimed: 0, registeredAt: now, registeredByUid: actorUid, lastVisitedAt: null,
    ...(input.notes ? { notes: input.notes.trim() } : {}), updatedAt: now };
  const outletRef = database.collection("outlets").doc(input.outletId);
  const ref = outletRef.collection("members").doc(id);
  const phoneRef = outletRef.collection("memberPhones").doc(hashValue(phone));
  const logId = createDocumentId("LOG");
  await database.runTransaction(async (transaction) => {
    if ((await transaction.get(phoneRef)).exists) throw new Error("MEMBER_PHONE_EXISTS");
    transaction.create(phoneRef, { memberId: id });
    transaction.create(ref, member);
    transaction.create(ref.collection("logs").doc(logId), { id: logId, event: "registered", timestamp: now,
      actor: actorUid === "cashier-session" ? "cashier" : "owner", actorUid, details: {} });
  });
  return { member: view(member), token };
}

async function locateToken(token: string) {
  const snapshot = await getFirebaseAdminFirestore().collectionGroup("members").where("tokenHash", "==", hashValue(token)).limit(1).get();
  if (snapshot.empty) throw new Error("MEMBER_NOT_FOUND");
  const document = snapshot.docs[0];
  return { document, member: document.data() as MemberDocument, outletId: document.ref.parent.parent!.id };
}

export async function getPublicMemberPass(token: string): Promise<MemberPass> {
  const { member, outletId } = await locateToken(token);
  const database = getFirebaseAdminFirestore();
  const { outlet, membership } = await getMembershipOutlet(outletId);
  const cards = await database.collection("cards").where("outletId", "==", outletId).get();
  const reviewUrl = cards.docs.flatMap((card) => card.data().config?.social?.links ?? [])
    .find((link: { type?: string; isActive?: boolean }) => link.type === "google_review" && link.isActive)?.url ?? null;
  return { ...view(member, false), name: member.name.split(/\s+/)[0] ?? member.name, outlet: { id: outletId, name: outlet.name ?? "", address: outlet.address ?? "",
    logoUrl: outlet.logoUrl ?? null, reviewUrl }, reward: { enabled: membership.loyaltyReward?.enabled ?? false,
    targetVisits: membership.loyaltyReward?.targetVisits ?? 5, title: membership.loyaltyReward?.rewardTitle ?? "Reward" } };
}

export async function verifyMember(outletId: string, token: string) {
  const found = await locateToken(token);
  if (found.outletId !== outletId) throw new Error("MEMBER_NOT_FOUND");
  const { membership } = await getMembershipOutlet(outletId);
  const logId = createDocumentId("LOG");
  await found.document.ref.collection("logs").doc(logId).create({ id: logId, event: "verified",
    timestamp: new Date().toISOString(), actor: "cashier", actorUid: "cashier-session", details: {} });
  return { member: view(found.member), reward: { enabled: membership.loyaltyReward?.enabled ?? false,
    targetVisits: membership.loyaltyReward?.targetVisits ?? 5, title: membership.loyaltyReward?.rewardTitle ?? "Reward" } };
}

export async function mutateMember(outletId: string, token: string, action: "stamp" | "claim") {
  const database = getFirebaseAdminFirestore();
  const found = await locateToken(token);
  if (found.outletId !== outletId) throw new Error("MEMBER_NOT_FOUND");
  const { membership } = await getMembershipOutlet(outletId);
  const target = membership.loyaltyReward?.targetVisits ?? 5;
  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(found.document.ref);
    const member = snapshot.data() as MemberDocument;
    if (view(member).status !== "active") throw new Error("MEMBER_INACTIVE");
    if (action === "stamp" && member.currentStamps >= target) throw new Error("REWARD_READY");
    if (action === "claim" && member.currentStamps < target) throw new Error("REWARD_NOT_READY");
    const now = new Date().toISOString();
    const nextStamps = action === "stamp" ? member.currentStamps + 1 : 0;
    transaction.update(found.document.ref, { currentStamps: nextStamps, updatedAt: now,
      ...(action === "stamp" ? { totalVisits: member.totalVisits + 1, lastVisitedAt: now }
        : { totalRewardsClaimed: member.totalRewardsClaimed + 1 }) });
    const logId = createDocumentId("LOG");
    transaction.create(found.document.ref.collection("logs").doc(logId), { id: logId,
      event: action === "stamp" ? "stamp_added" : "reward_claimed", timestamp: now, actor: "cashier",
      actorUid: "cashier-session", details: { previousStamps: member.currentStamps, newStamps: nextStamps,
        ...(action === "claim" ? { rewardTitle: membership.loyaltyReward?.rewardTitle } : {}) } });
  });
  const updated = await found.document.ref.get();
  return { member: view(updated.data() as MemberDocument), reward: {
    enabled: membership.loyaltyReward?.enabled ?? false, targetVisits: target,
    title: membership.loyaltyReward?.rewardTitle ?? "Reward",
  } };
}

export async function listOwnerMembers(uid: string, outletId: string) {
  await assertUserOutletAccess(uid, outletId);
  const { outlet, membership } = await getMembershipOutlet(outletId);
  const snapshot = await getFirebaseAdminFirestore().collection("outlets").doc(outletId).collection("members").orderBy("registeredAt", "desc").limit(250).get();
  const members = snapshot.docs.map((doc) => view(doc.data() as MemberDocument));
  return { outlet: { id: outletId, name: outlet.name ?? "" }, membership, members,
    metrics: { active: members.filter((item) => item.status === "active").length,
      visits: members.reduce((sum, item) => sum + item.totalVisits, 0),
      rewards: members.reduce((sum, item) => sum + item.totalRewardsClaimed, 0) } };
}

export async function rotateMemberToken(uid: string, outletId: string, phoneInput: string) {
  await assertUserOutletAccess(uid, outletId);
  const phone = normalizeMemberPhone(phoneInput);
  const query = await getFirebaseAdminFirestore().collection("outlets").doc(outletId).collection("members").where("phone", "==", phone).limit(1).get();
  if (query.empty) throw new Error("MEMBER_NOT_FOUND");
  const token = createPublicToken();
  await query.docs[0].ref.update({ tokenHash: hashValue(token), updatedAt: new Date().toISOString() });
  return { token, member: view(query.docs[0].data() as MemberDocument) };
}

export async function updateMembershipSettings(uid: string, input: { outletId: string; expiryType: "lifetime" | "period"; defaultDurationDays?: number; rewardEnabled: boolean; targetVisits: number; rewardTitle: string }) {
  await assertUserOutletAccess(uid, input.outletId);
  const ref = getFirebaseAdminFirestore().collection("outlets").doc(input.outletId);
  await ref.update({ "addons.membership.expiryType": input.expiryType,
    "addons.membership.defaultDurationDays": input.defaultDurationDays ?? FieldValue.delete(),
    "addons.membership.loyaltyReward": { enabled: input.rewardEnabled, targetVisits: input.targetVisits, rewardTitle: input.rewardTitle },
    updatedAt: FieldValue.serverTimestamp() });
}

export async function consumePinAttempt(outletId: string, ipHash: string, valid: boolean) {
  const database = getFirebaseAdminFirestore();
  const ref = database.collection("cashierRateLimits").doc(`${outletId}_${ipHash}`);
  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const record = snapshot.data();
    const lockedUntil = record?.lockedUntil ? new Date(record.lockedUntil).getTime() : 0;
    if (lockedUntil > Date.now()) throw new Error("CASHIER_LOCKED");
    if (valid) { transaction.delete(ref); return; }
    const attempts = (record?.attempts ?? 0) + 1;
    transaction.set(ref, { attempts, lockedUntil: attempts >= 5 ? new Date(Date.now() + 900_000).toISOString() : null,
      expiresAt: Timestamp.fromMillis(Date.now() + 900_000) });
  });
}

export function newPinSalt() { return randomBytes(16).toString("hex"); }

export async function updateAdminMembershipAddon(input: {
  outletId: string;
  enabled: boolean;
}) {
  const database = getFirebaseAdminFirestore();
  const reference = database.collection("outlets").doc(input.outletId);
  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists) throw new Error("OUTLET_NOT_FOUND");
    const current = snapshot.data()?.addons?.membership as OutletMembershipAddon | undefined;
    const sessionChanged = Boolean(current?.enabled && !input.enabled);
    transaction.update(reference, {
      "addons.membership": {
        enabled: input.enabled,
        activatedAt: current?.activatedAt ?? new Date().toISOString(),
        cashierPinSalt: current?.cashierPinSalt ?? "",
        cashierPinHash: current?.cashierPinHash ?? "",
        cashierSessionVersion: (current?.cashierSessionVersion ?? 0) + (sessionChanged ? 1 : 0),
        expiryType: current?.expiryType ?? "lifetime",
        ...(current?.defaultDurationDays ? { defaultDurationDays: current.defaultDurationDays } : {}),
        loyaltyReward: current?.loyaltyReward ?? { enabled: true, targetVisits: 5, rewardTitle: "Gratis 1 produk" },
      },
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}
