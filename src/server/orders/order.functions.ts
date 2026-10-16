import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, setResponseHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireAdmin, requireAuthenticatedUser } from "../auth/authorization.server";
import { getCurrentAuthenticatedUser } from "../auth/auth.functions";
import { getOrderWhatsAppNumber } from "./order-config.server";
import { createOrderSchema, orderListSchema, orderTokenSchema, phoneOrderLookupSchema, updateOrderSchema } from "./order.schemas";
import { lookupOrdersByPhone } from "./phone-order.repository.server";
import { advanceOrder, createOrder, findTrackedOrder, listOrders } from "./order.repository.server";

function privateResponse() {
  setResponseHeader("Cache-Control", "private, no-store");
  setResponseHeader("Referrer-Policy", "no-referrer");
}

export const getOrderCheckout = createServerFn({ method: "GET" }).handler(async () => {
  privateResponse();
  return { user: await getCurrentAuthenticatedUser(), whatsappNumber: getOrderWhatsAppNumber() };
});

export const getOwnerCheckout = createServerFn({ method: "GET" }).handler(async () => {
  privateResponse();
  const user = await requireAuthenticatedUser();
  if (user.role !== "owner") throw new Error("OWNER_REQUIRED");
  return { user, whatsappNumber: getOrderWhatsAppNumber() };
});

export const submitOwnerOrder = createServerFn({ method: "POST" }).validator(createOrderSchema).handler(async ({ data }) => {
  privateResponse();
  const user = await requireAuthenticatedUser();
  if (user.role !== "owner") throw new Error("OWNER_REQUIRED");
  if (!getOrderWhatsAppNumber()) return { success: false as const, reason: "unavailable" as const };
  try {
    const order = await createOrder(data.token, data.order, user, getRequestIP({ xForwardedFor: true }) ?? "unknown");
    return { success: true as const, code: order.code };
  } catch (error) {
    return { success: false as const, reason: error instanceof Error && error.message === "ORDER_RATE_LIMIT" ? "rateLimit" as const : "error" as const };
  }
});

export const submitCardOrder = createServerFn({ method: "POST" }).validator(createOrderSchema).handler(async ({ data }) => {
  privateResponse();
  if (!getOrderWhatsAppNumber()) return { success: false as const, reason: "unavailable" as const };
  try {
    await createOrder(data.token, data.order, await getCurrentAuthenticatedUser(), getRequestIP({ xForwardedFor: true }) ?? "unknown");
    return { success: true as const, token: data.token };
  } catch (error) {
    return { success: false as const, reason: error instanceof Error && error.message === "ORDER_RATE_LIMIT" ? "rateLimit" as const : "error" as const };
  }
});

export const getTrackedOrder = createServerFn({ method: "GET" }).validator(z.object({ token: orderTokenSchema })).handler(async ({ data }) => {
  privateResponse();
  return { order: await findTrackedOrder(data.token), whatsappNumber: getOrderWhatsAppNumber() };
});

export const getOrdersByPhone = createServerFn({ method: "POST" }).validator(phoneOrderLookupSchema).handler(async ({ data }) => {
  privateResponse();
  try {
    return { success: true as const, page: await lookupOrdersByPhone(data, getRequestIP({ xForwardedFor: true }) ?? "unknown"), whatsappNumber: getOrderWhatsAppNumber() };
  } catch (error) {
    const reason = error instanceof Error && error.message === "ORDER_RATE_LIMIT" ? "lookupRateLimit" as const
      : error && typeof error === "object" && "code" in error && error.code === 9 ? "lookupUnavailable" as const
      : "lookupError" as const;
    return { success: false as const, reason };
  }
});

export const getOwnerOrders = createServerFn({ method: "GET" }).validator(orderListSchema).handler(async ({ data }) => {
  privateResponse();
  const user = await requireAuthenticatedUser();
  if (user.role !== "owner") throw new Error("OWNER_REQUIRED");
  return { user, page: await listOrders(data, user.uid), whatsappNumber: getOrderWhatsAppNumber() };
});

export const getAdminOrders = createServerFn({ method: "GET" }).validator(orderListSchema).handler(async ({ data }) => {
  privateResponse();
  const user = await requireAdmin();
  return { user, page: await listOrders(data) };
});

export const updateCardOrder = createServerFn({ method: "POST" }).validator(updateOrderSchema).handler(async ({ data }) => {
  const user = await requireAdmin();
  try {
    await advanceOrder(data, user.uid, user.name);
    return { success: true as const };
  } catch { return { success: false as const }; }
});
