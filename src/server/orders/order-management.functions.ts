import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireAdmin, requireAuthenticatedUser } from "../auth/authorization.server";
import { editOrderSchema, manageOrderSchema, orderIdSchema } from "./order.schemas";
import { getAdminOrderForEdit, getOwnedOrder, listOrderAudit, mutateOrder } from "./order-management.repository.server";
import { getOrderWhatsAppNumber } from "./order-config.server";

export const getOwnerEditableOrder = createServerFn({ method: "GET" }).validator(z.object({ id: orderIdSchema })).handler(async ({ data }) => {
  setResponseHeader("Cache-Control", "private, no-store");
  const user = await requireAuthenticatedUser();
  if (user.role !== "owner") throw new Error("OWNER_REQUIRED");
  return { user, order: await getOwnedOrder(data.id, user.uid), whatsappNumber: getOrderWhatsAppNumber() };
});

export const editOwnerOrder = createServerFn({ method: "POST" }).validator(editOrderSchema).handler(async ({ data }) => {
  const user = await requireAuthenticatedUser();
  if (user.role !== "owner") throw new Error("OWNER_REQUIRED");
  try { await mutateOrder(data, user); return { success: true as const }; }
  catch { return { success: false as const }; }
});

export const getAdminEditableOrder = createServerFn({ method: "GET" }).validator(z.object({ id: orderIdSchema })).handler(async ({ data }) => {
  setResponseHeader("Cache-Control", "private, no-store");
  const user = await requireAdmin();
  return { user, order: await getAdminOrderForEdit(data.id) };
});

export const editAdminOrder = createServerFn({ method: "POST" }).validator(editOrderSchema).handler(async ({ data }) => {
  const user = await requireAdmin();
  try { await mutateOrder(data, user); return { success: true as const }; }
  catch { return { success: false as const }; }
});

export const manageCardOrder = createServerFn({ method: "POST" }).validator(manageOrderSchema).handler(async ({ data }) => {
  const user = await requireAuthenticatedUser();
  try { await mutateOrder(data, user); return { success: true as const }; }
  catch { return { success: false as const }; }
});

export const getOrderAudit = createServerFn({ method: "GET" }).validator(z.object({ id: orderIdSchema })).handler(async ({ data }) => {
  setResponseHeader("Cache-Control", "private, no-store");
  await requireAdmin();
  return listOrderAudit(data.id);
});
