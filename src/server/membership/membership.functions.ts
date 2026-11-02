import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { requireAdmin, requireOwner } from "../auth/authorization.server";
import {
  adminMembershipAddonSchema, cashierLoginSchema, cashierMemberSchema, cashierPinChangeSchema, memberActionSchema,
  memberRegistrationSchema, memberSearchSchema, memberTokenInputSchema, membershipSettingsSchema, outletIdSchema,
  ownerMemberSchema,
} from "./membership.schemas";
import {
  consumePinAttempt, getMembershipOutlet, getPublicMemberPass, listOwnerMembers, mutateMember,
  deleteOwnerMember, newPinSalt, registerMember, rotateCashierMemberToken, rotateMemberToken,
  updateAdminMembershipAddon, updateMembershipSettings,
  updateOwnerCashierPin, verifyMember,
} from "./membership.repository.server";
import {
  clearCashierSession, hashCashierPin, hashValue, requireCashierSession, safeEqual, setCashierSession,
} from "./membership-security.server";

export const loginCashier = createServerFn({ method: "POST" }).validator(cashierLoginSchema).handler(async ({ data }) => {
  const { membership } = await getMembershipOutlet(data.outletId);
  const valid = Boolean(membership.cashierPinHash && membership.cashierPinSalt)
    && safeEqual(hashCashierPin(data.outletId, data.pin, membership.cashierPinSalt), membership.cashierPinHash);
  const ipHash = hashValue(getRequestIP({ xForwardedFor: true }) ?? "unknown");
  await consumePinAttempt(data.outletId, ipHash, valid);
  if (!valid) throw new Error("INVALID_CASHIER_PIN");
  setCashierSession(data.outletId, membership.cashierSessionVersion);
  return { success: true as const };
});

export const getCashierSession = createServerFn({ method: "GET" }).validator(outletIdSchema).handler(async ({ data: outletId }) => {
  const session = await requireCashierSession(outletId);
  return { outletName: session.outlet.name as string };
});

export const logoutCashier = createServerFn({ method: "POST" }).handler(async () => clearCashierSession());

export const registerCashierMember = createServerFn({ method: "POST" }).validator(memberRegistrationSchema).handler(async ({ data }) => {
  const session = await requireCashierSession(data.outletId);
  return registerMember(data, session.actorUid);
});

export const reissueCashierMemberPass = createServerFn({ method: "POST" }).validator(memberSearchSchema).handler(async ({ data }) => {
  await requireCashierSession(data.outletId);
  return rotateCashierMemberToken(data.outletId, data.phone);
});

export const verifyCashierMember = createServerFn({ method: "POST" }).validator(cashierMemberSchema).handler(async ({ data }) => {
  await requireCashierSession(data.outletId);
  return verifyMember(data.outletId, data.token);
});

export const actOnCashierMember = createServerFn({ method: "POST" }).validator(memberActionSchema).handler(async ({ data }) => {
  await requireCashierSession(data.outletId);
  return mutateMember(data.outletId, data.token, data.action);
});

export const getPublicMembershipPass = createServerFn({ method: "GET" }).validator(memberTokenInputSchema).handler(({ data }) => getPublicMemberPass(data.token));

export const getOwnerMembership = createServerFn({ method: "GET" }).validator(outletIdSchema).handler(async ({ data: outletId }) => {
  const owner = await requireOwner();
  return listOwnerMembers(owner.uid, outletId);
});

export const reissueOwnerMemberPass = createServerFn({ method: "POST" }).validator(memberSearchSchema).handler(async ({ data }) => {
  const owner = await requireOwner();
  return rotateMemberToken(owner.uid, data.outletId, data.phone);
});

export const removeOwnerMember = createServerFn({ method: "POST" }).validator(ownerMemberSchema).handler(async ({ data }) => {
  const owner = await requireOwner();
  await deleteOwnerMember(owner.uid, data.outletId, data.memberId);
});

export const saveOwnerMembershipSettings = createServerFn({ method: "POST" }).validator(membershipSettingsSchema).handler(async ({ data }) => {
  const owner = await requireOwner();
  await updateMembershipSettings(owner.uid, data);
});

export const changeOwnerCashierPin = createServerFn({ method: "POST" }).validator(cashierPinChangeSchema).handler(async ({ data }) => {
  const owner = await requireOwner();
  const salt = newPinSalt();
  await updateOwnerCashierPin(owner.uid, data.outletId, hashCashierPin(data.outletId, data.pin, salt), salt);
});

export const saveAdminMembershipAddon = createServerFn({ method: "POST" })
  .validator(adminMembershipAddonSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    await updateAdminMembershipAddon(data);
  });
