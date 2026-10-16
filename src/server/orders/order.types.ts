import type { OrderDraft, OrderStatus } from "./order.schemas";

export type OrderSummary = {
  id: string;
  code: string;
  product: OrderDraft["product"];
  material: OrderDraft["material"];
  theme: OrderDraft["theme"];
  quantity: number;
  status: OrderStatus;
  carrier: string;
  trackingNumber: string;
  createdAt: string;
  updatedAt: string;
  paymentStatus: "unpaid" | "paid" | "refunded";
  productionStarted: boolean;
  revision: number;
  history: { status: OrderStatus; at: string }[];
};
export type OrderDetail = OrderSummary & {
  customer: Pick<OrderDraft, "name" | "email" | "phone" | "address"> & { shippingRegion: OrderDraft["shippingRegion"] | null };
  ownerId: string | null;
  archived: boolean;
  cancellationReason: string;
};
export type OrderList = { orders: OrderDetail[]; nextCursor?: string };
export type OrderRecord = Omit<OrderDraft, "shippingRegion"> & {
  shippingRegion?: OrderDraft["shippingRegion"];
  code: string;
  ownerId: string | null;
  status: OrderStatus;
  carrier: string;
  trackingNumber: string;
  createdAt: string;
  updatedAt: string;
  paymentStatus?: OrderSummary["paymentStatus"];
  productionStarted?: boolean;
  revision?: number;
  archived?: boolean;
  cancellationReason?: string;
  history: { status: OrderStatus; at: string; by: string | null }[];
};

export function summarizeOrder(id: string, order: OrderRecord): OrderSummary {
  return {
    id, code: order.code, product: order.product, material: order.material,
    theme: order.theme, quantity: order.quantity, status: order.status,
    carrier: order.carrier, trackingNumber: order.trackingNumber,
    createdAt: order.createdAt, updatedAt: order.updatedAt,
    paymentStatus: order.paymentStatus ?? "unpaid", productionStarted: order.productionStarted ?? false, revision: order.revision ?? 0,
    history: order.history.map(({ status, at }) => ({ status, at })),
  };
}

export function detailOrder(id: string, order: OrderRecord): OrderDetail {
  return { ...summarizeOrder(id, order), ownerId: order.ownerId, archived: order.archived ?? false, cancellationReason: order.cancellationReason ?? "",
    customer: { name: order.name, email: order.email, phone: order.phone, address: order.address, shippingRegion: order.shippingRegion ?? null } };
}

export type OrderAudit = {
  id: string; action: "edit" | "cancel" | "payment" | "production" | "archive" | "status" | "shipping";
  at: string; actorId: string; actorName: string; reason: string;
  changes: { field: string; before: string; after: string }[];
};

export type PhoneOrderSummary = Pick<OrderSummary, "code" | "product" | "material" | "theme" | "quantity" | "status" | "createdAt" | "carrier" | "trackingNumber">;
export type PhoneOrderList = { orders: PhoneOrderSummary[]; nextCursor?: string };

export function phoneOrderSummary(order: OrderRecord): PhoneOrderSummary {
  const shipped = order.status === "shipped" || order.status === "completed";
  return { code: order.code, product: order.product, material: order.material, theme: order.theme,
    quantity: order.quantity, status: order.status, createdAt: order.createdAt,
    carrier: shipped ? order.carrier ?? "" : "", trackingNumber: shipped ? order.trackingNumber ?? "" : "" };
}
