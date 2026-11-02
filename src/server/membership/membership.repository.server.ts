import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { randomBytes } from "node:crypto";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type { MemberDocument, OutletMembershipAddon } from "../../lib/firebase/firestore-schema";
import { assertUserOutletAccess } from "../outlets/user-outlet.repository.server";
import { createDocumentId, createPublicToken, hashValue } from "./membership-security.server";
import type { MemberPass, MemberView } from "./membership.types";
import { isMembershipAddonActive } from "./membership-access";
import { stampDayKey, stampsHaveExpired, type StampPolicy } from "./stamp-policy";

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

function view(member: MemberDocument, includePhone = true, policy?: StampPolicy): MemberView {
  const currentStamps = policy && stampsHaveExpired(member.lastVisitedAt, policy) ? 0 : member.currentStamps;
  return { id: member.id, name: member.name, ...(includePhone ? { maskedPhone: maskPhone(member.phone) } : {}),
    status: member.status, totalVisits: member.totalVisits,
    currentStamps, totalRewardsClaimed: member.totalRewardsClaimed,
    lastVisitedAt: member.lastVisitedAt, registeredAt: member.registeredAt };
}

export async function getMembershipOutlet(outletId: string) {
  const snap = await getFirebaseAdminFirestore().collection("outlets").doc(outletId).get();
  const membership = snap.data()?.addons?.membership as OutletMembershipAddon | undefined;
  if (!snap.exists || !membership?.enabled) throw new Error("MEMBERSHIP_NOT_ENABLED");
  if (!isMembershipAddonActive(membership)) throw new Error("MEMBERSHIP_EXPIRED");
  return { outlet: snap.data()!, membership };
}

export async function registerMember(input: { outletId: string; name: string; phone: string; notes?: string }, actorUid: string) {
  const database = getFirebaseAdminFirestore();
  const { membership } = await getMembershipOutlet(input.outletId);
  const phone = normalizeMemberPhone(input.phone);
  const id = createDocumentId("MBR");
  const token = createPublicToken();
  const now = new Date().toISOString();
  const today = stampDayKey(new Date());
  const member: MemberDocument = { id, tokenHash: hashValue(token), name: input.name.trim(), phone,
    status: "active", totalVisits: 1, currentStamps: 1, stampDayKey: today, stampDayCount: 1,
    totalRewardsClaimed: 0, registeredAt: now, registeredByUid: actorUid, lastVisitedAt: now,
    ...(input.notes ? { notes: input.notes.trim() } : {}), updatedAt: now };
  const outletRef = database.collection("outlets").doc(input.outletId);
  const ref = outletRef.collection("members").doc(id);
  const phoneRef = outletRef.collection("memberPhones").doc(hashValue(phone));
  const tokenRef = database.collection("memberTokens").doc(member.tokenHash);
  const logId = createDocumentId("LOG");
  const stampLogId = createDocumentId("LOG");
  await database.runTransaction(async (transaction) => {
    if ((await transaction.get(phoneRef)).exists) throw new Error("MEMBER_PHONE_EXISTS");
    transaction.create(phoneRef, { memberId: id });
    transaction.create(tokenRef, { outletId: input.outletId, memberId: id });
    transaction.create(ref, member);
    transaction.create(ref.collection("logs").doc(logId), { id: logId, event: "registered", timestamp: new Date(Date.parse(now) - 1).toISOString(),
      actor: actorUid === "cashier-session" ? "cashier" : "owner", actorUid, details: {} });
    transaction.create(ref.collection("logs").doc(stampLogId), { id: stampLogId, event: "stamp_added", timestamp: now,
      actor: actorUid === "cashier-session" ? "cashier" : "owner", actorUid,
      details: { previousStamps: 0, newStamps: 1, previousTotalVisits: 0, previousLastVisitedAt: null } });
  });
  return { member: view(member, true, membership.loyaltyReward), token };
}

async function locateToken(token: string) {
  const database = getFirebaseAdminFirestore();
  const tokenHash = hashValue(token);
  const lookup = await database.collection("memberTokens").doc(tokenHash).get();
  const outletId = lookup.data()?.outletId;
  const memberId = lookup.data()?.memberId;
  if (!lookup.exists || typeof outletId !== "string" || typeof memberId !== "string") throw new Error("MEMBER_NOT_FOUND");
  const document = await database.collection("outlets").doc(outletId).collection("members").doc(memberId).get();
  const member = document.data() as MemberDocument | undefined;
  if (!document.exists || member?.tokenHash !== tokenHash) throw new Error("MEMBER_NOT_FOUND");
  return { document, member, outletId };
}

export async function getPublicMemberPass(token: string): Promise<MemberPass> {
  const { member, outletId } = await locateToken(token);
  const database = getFirebaseAdminFirestore();
  const { outlet, membership } = await getMembershipOutlet(outletId);
  const cards = await database.collection("cards").where("outletId", "==", outletId).get();
  const reviewUrl = cards.docs.flatMap((card) => card.data().config?.social?.links ?? [])
    .find((link: { type?: string; isActive?: boolean }) => link.type === "google_review" && link.isActive)?.url ?? null;
  return { ...view(member, false, membership.loyaltyReward), name: member.name.split(/\s+/)[0] ?? member.name, outlet: { id: outletId, name: outlet.name ?? "", address: outlet.address ?? "",
    logoUrl: outlet.logoUrl ?? null, reviewUrl }, reward: {
    targetVisits: membership.loyaltyReward?.targetVisits ?? 5, title: membership.loyaltyReward?.rewardTitle ?? "Reward" } };
}

export async function verifyMember(outletId: string, token: string) {
  const found = await locateToken(token);
  if (found.outletId !== outletId) throw new Error("MEMBER_NOT_FOUND");
  const { membership } = await getMembershipOutlet(outletId);
  const logId = createDocumentId("LOG");
  await found.document.ref.collection("logs").doc(logId).create({ id: logId, event: "verified",
    timestamp: new Date().toISOString(), actor: "cashier", actorUid: "cashier-session", details: {} });
  return { member: view(found.member, true, membership.loyaltyReward), reward: {
    targetVisits: membership.loyaltyReward?.targetVisits ?? 5, title: membership.loyaltyReward?.rewardTitle ?? "Reward" } };
}

export async function mutateMember(outletId: string, token: string, action: "stamp" | "claim" | "undo_stamp") {
  const database = getFirebaseAdminFirestore();
  const found = await locateToken(token);
  if (found.outletId !== outletId) throw new Error("MEMBER_NOT_FOUND");
  const { membership } = await getMembershipOutlet(outletId);
  const target = membership.loyaltyReward?.targetVisits ?? 5;
  const policy = membership.loyaltyReward ?? {};
  const dailyLimit = membership.loyaltyReward?.dailyStampLimit ?? 1;
  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(found.document.ref);
    const member = snapshot.data() as MemberDocument;
    if (member.status !== "active") throw new Error("MEMBER_INACTIVE");
    const nowDate = new Date();
    const now = nowDate.toISOString();
    const today = stampDayKey(nowDate);
    const expired = stampsHaveExpired(member.lastVisitedAt, policy, nowDate.getTime());
    const currentStamps = expired ? 0 : member.currentStamps;
    const todayCount = member.stampDayKey === today ? (member.stampDayCount ?? 0) : 0;
    if (action === "stamp" && currentStamps >= target) throw new Error("REWARD_READY");
    if (action === "stamp" && todayCount >= dailyLimit) throw new Error("DAILY_STAMP_LIMIT");
    if (action === "claim" && currentStamps < target) throw new Error("REWARD_NOT_READY");
    if (action === "undo_stamp") {
      const latest = await transaction.get(found.document.ref.collection("logs").orderBy("timestamp", "desc").limit(1));
      const log = latest.docs[0]?.data();
      if (expired || log?.event !== "stamp_added" || currentStamps < 1 || member.totalVisits < 1) throw new Error("STAMP_UNDO_NOT_ALLOWED");
      transaction.update(found.document.ref, { currentStamps: currentStamps - 1,
        totalVisits: member.totalVisits - 1, lastVisitedAt: log.details?.previousLastVisitedAt ?? null,
        stampDayKey: today, stampDayCount: Math.max(0, todayCount - 1), updatedAt: now });
      const logId = createDocumentId("LOG");
      transaction.create(found.document.ref.collection("logs").doc(logId), { id: logId, event: "stamp_cancelled",
        timestamp: now, actor: "cashier", actorUid: "cashier-session",
        details: { previousStamps: currentStamps, newStamps: currentStamps - 1 } });
      return;
    }
    const nextStamps = action === "stamp" ? currentStamps + 1 : 0;
    transaction.update(found.document.ref, { currentStamps: nextStamps, updatedAt: now,
      ...(action === "stamp" ? { totalVisits: member.totalVisits + 1, lastVisitedAt: now,
        stampDayKey: today, stampDayCount: todayCount + 1 }
        : { totalRewardsClaimed: member.totalRewardsClaimed + 1 }) });
    const logId = createDocumentId("LOG");
    transaction.create(found.document.ref.collection("logs").doc(logId), { id: logId,
      event: action === "stamp" ? "stamp_added" : "reward_claimed", timestamp: now, actor: "cashier",
      actorUid: "cashier-session", details: { previousStamps: currentStamps, newStamps: nextStamps,
        ...(action === "stamp" ? { previousTotalVisits: member.totalVisits, previousLastVisitedAt: member.lastVisitedAt } : {}),
        ...(action === "claim" ? { rewardTitle: membership.loyaltyReward?.rewardTitle } : {}) } });
  });
  const updated = await found.document.ref.get();
  return { member: view(updated.data() as MemberDocument, true, policy), reward: {
    targetVisits: target,
    title: membership.loyaltyReward?.rewardTitle ?? "Reward",
  } };
}

export async function listOwnerMembers(uid: string, outletId: string) {
  await assertUserOutletAccess(uid, outletId);
  const { outlet, membership } = await getMembershipOutlet(outletId);
  const snapshot = await getFirebaseAdminFirestore().collection("outlets").doc(outletId).collection("members").orderBy("registeredAt", "desc").limit(250).get();
  const members = snapshot.docs.map((doc) => view(doc.data() as MemberDocument, true, membership.loyaltyReward));
  return { outlet: { id: outletId, name: outlet.name ?? "" }, membership: {
    enabled: membership.enabled,
    activatedAt: membership.activatedAt,
    expiresAt: membership.expiresAt ?? null,
    isActive: isMembershipAddonActive(membership),
    pinConfigured: Boolean(membership.cashierPinHash && membership.cashierPinSalt),
    loyaltyReward: membership.loyaltyReward,
  }, members,
    metrics: { active: members.filter((item) => item.status === "active").length,
      visits: members.reduce((sum, item) => sum + item.totalVisits, 0),
      rewards: members.reduce((sum, item) => sum + item.totalRewardsClaimed, 0) } };
}

export async function updateOwnerCashierPin(uid: string, outletId: string, pinHash: string, salt: string) {
  await assertUserOutletAccess(uid, outletId);
  const reference = getFirebaseAdminFirestore().collection("outlets").doc(outletId);
  await getFirebaseAdminFirestore().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    const membership = snapshot.data()?.addons?.membership as OutletMembershipAddon | undefined;
    if (!membership?.enabled) throw new Error("MEMBERSHIP_NOT_ENABLED");
    if (!isMembershipAddonActive(membership)) throw new Error("MEMBERSHIP_EXPIRED");
    transaction.update(reference, {
      "addons.membership.cashierPinSalt": salt,
      "addons.membership.cashierPinHash": pinHash,
      "addons.membership.cashierSessionVersion": (membership.cashierSessionVersion ?? 0) + 1,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}

export async function rotateMemberToken(uid: string, outletId: string, phoneInput: string) {
  await assertUserOutletAccess(uid, outletId);
  return rotateMemberTokenForActor(outletId, phoneInput, "owner", uid);
}

export async function rotateCashierMemberToken(outletId: string, phoneInput: string) {
  await getMembershipOutlet(outletId);
  return rotateMemberTokenForActor(outletId, phoneInput, "cashier", "cashier-session");
}

async function rotateMemberTokenForActor(outletId: string, phoneInput: string, actor: "owner" | "cashier", actorUid: string) {
  const phone = normalizeMemberPhone(phoneInput);
  const query = await getFirebaseAdminFirestore().collection("outlets").doc(outletId).collection("members").where("phone", "==", phone).limit(1).get();
  if (query.empty) throw new Error("MEMBER_NOT_FOUND");
  const token = createPublicToken();
  const database = getFirebaseAdminFirestore();
  const member = query.docs[0].data() as MemberDocument;
  const tokenHash = hashValue(token);
  await database.runTransaction(async (transaction) => {
    transaction.update(query.docs[0].ref, { tokenHash, updatedAt: new Date().toISOString() });
    transaction.delete(database.collection("memberTokens").doc(member.tokenHash));
    transaction.create(database.collection("memberTokens").doc(tokenHash), { outletId, memberId: query.docs[0].id });
    const logId = createDocumentId("LOG");
    transaction.create(query.docs[0].ref.collection("logs").doc(logId), { id: logId, event: "token_reissued",
      timestamp: new Date().toISOString(), actor, actorUid, details: {} });
  });
  return { token, member: view(query.docs[0].data() as MemberDocument) };
}

export async function deleteOwnerMember(uid: string, outletId: string, memberId: string) {
  await assertUserOutletAccess(uid, outletId);
  const database = getFirebaseAdminFirestore();
  const memberRef = database.collection("outlets").doc(outletId).collection("members").doc(memberId);
  const snapshot = await memberRef.get();
  if (!snapshot.exists) throw new Error("MEMBER_NOT_FOUND");
  const member = snapshot.data() as MemberDocument;
  await database.recursiveDelete(memberRef);
  await Promise.all([
    database.collection("memberTokens").doc(member.tokenHash).delete(),
    database.collection("outlets").doc(outletId).collection("memberPhones").doc(hashValue(member.phone)).delete(),
  ]);
}

export async function updateMembershipSettings(uid: string, input: { outletId: string; targetVisits: number; rewardTitle: string; stampExpiryValue: number; stampExpiryUnit: "day" | "month"; dailyStampLimit: number }) {
  await assertUserOutletAccess(uid, input.outletId);
  const ref = getFirebaseAdminFirestore().collection("outlets").doc(input.outletId);
  await ref.update({ "addons.membership.loyaltyReward": { targetVisits: input.targetVisits, rewardTitle: input.rewardTitle,
    stampExpiryValue: input.stampExpiryValue, stampExpiryUnit: input.stampExpiryUnit, dailyStampLimit: input.dailyStampLimit },
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
  expiresAt: string | null;
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
        expiresAt: input.expiresAt,
        cashierPinSalt: current?.cashierPinSalt ?? "",
        cashierPinHash: current?.cashierPinHash ?? "",
        cashierSessionVersion: (current?.cashierSessionVersion ?? 0) + (sessionChanged ? 1 : 0),
        loyaltyReward: current?.loyaltyReward ? { targetVisits: current.loyaltyReward.targetVisits,
          rewardTitle: current.loyaltyReward.rewardTitle, stampExpiryValue: current.loyaltyReward.stampExpiryValue ?? 30,
          stampExpiryUnit: current.loyaltyReward.stampExpiryUnit ?? "day", dailyStampLimit: current.loyaltyReward.dailyStampLimit ?? 1 }
          : { targetVisits: 5, rewardTitle: "Gratis 1 produk", stampExpiryValue: 30, stampExpiryUnit: "day", dailyStampLimit: 1 },
      },
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}
