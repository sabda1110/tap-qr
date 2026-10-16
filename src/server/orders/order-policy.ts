import type { OrderRecord } from "./order.types";

export function canEditOrder(order: Pick<OrderRecord, "status" | "paymentStatus" | "productionStarted" | "archived">) {
  return order.status === "on_progress" && (order.paymentStatus ?? "unpaid") === "unpaid" && !order.productionStarted && !order.archived;
}

export function canAdminEditOrder(order: Pick<OrderRecord, "status" | "paymentStatus" | "productionStarted" | "archived">) {
  return ["on_progress", "confirmed"].includes(order.status) && order.paymentStatus !== "refunded" && !order.productionStarted && !order.archived;
}

export function canCancelOrder(order: Pick<OrderRecord, "status" | "paymentStatus" | "productionStarted" | "archived">, admin: boolean) {
  if (order.archived) return false;
  if (!admin) return canEditOrder(order);
  return ["on_progress", "confirmed"].includes(order.status) && (order.paymentStatus ?? "unpaid") !== "paid";
}

export function orderAuditChanges(before: OrderRecord, after: OrderRecord) {
  const flatten = (order: OrderRecord): Record<string, string> => ({
    name: order.name, email: order.email, phone: order.phone, address: order.address,
    ...Object.fromEntries(Object.entries(order.shippingRegion ?? {}).map(([key, value]) => [`shippingRegion.${key}`, value])),
    product: order.product, material: order.material, theme: order.theme, quantity: String(order.quantity),
    status: order.status, carrier: order.carrier, trackingNumber: order.trackingNumber,
    paymentStatus: order.paymentStatus ?? "unpaid", productionStarted: String(order.productionStarted ?? false), archived: String(order.archived ?? false),
  });
  const previous = flatten(before);
  const next = flatten(after);
  return Object.keys(next).filter((key) => previous[key] !== next[key])
    .map((field) => ({ field, before: previous[field] ?? "", after: next[field] }));
}
