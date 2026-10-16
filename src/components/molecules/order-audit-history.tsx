import { useState } from "react";
import { useI18n } from "../../i18n";
import type { OrderAudit } from "../../server/orders/order.types";
import { getOrderAudit } from "../../server/orders/order-management.functions";

export function OrderAuditHistory({ orderId }: { orderId: string }) {
  const { language, messages } = useI18n();
  const content = messages.orders.management;
  const [events, setEvents] = useState<OrderAudit[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const labels: Record<string, string> = { name: messages.orders.name, email: messages.orders.email, phone: messages.orders.phone, address: messages.orders.address, product: messages.orders.product, material: messages.orders.material, theme: messages.orders.design, quantity: messages.orders.quantity, status: messages.orders.status, carrier: messages.orders.carrier, trackingNumber: messages.orders.trackingNumber, paymentStatus: content.payment, productionStarted: content.production, archived: content.archived,
    ...Object.fromEntries(Object.entries(messages.orders.regions).map(([key, label]) => [`shippingRegion.${key}`, label])) };
  const valueLabel = (field: string, value: string) => {
    if (field === "paymentStatus") return content.payments[value as keyof typeof content.payments] ?? value;
    if (field === "status") return messages.orders.statuses[value as keyof typeof messages.orders.statuses] ?? value;
    if (field === "product" || field === "material") return messages.orders[value as "social" | "wifi" | "acrylic" | "pvc"] ?? value;
    if (value === "true" || value === "false") return value === "true" ? content.yes : content.no;
    return value || "—";
  };
  return <details className="mt-4 rounded-xl border border-black/8 p-3" onToggle={async (event) => {
    if (!event.currentTarget.open || loading || events) return;
    setLoading(true); setError(false);
    try { setEvents(await getOrderAudit({ data: { id: orderId } })); } catch { setError(true); } finally { setLoading(false); }
  }}><summary className="cursor-pointer text-sm font-semibold">{content.audit}</summary>
    {loading && <p className="mt-3 text-xs">{content.auditLoading}</p>}
    {error && <p role="alert" className="mt-3 text-xs text-red-700">{content.auditError}</p>}
    {events?.length === 0 && <p className="mt-3 text-xs text-[#69737d]">{content.auditEmpty}</p>}
    <ol className="mt-3 space-y-4">{events?.map((event) => <li key={event.id} className="border-t border-black/8 pt-3 text-xs">
      <p className="font-bold">{content.auditActions[event.action]}</p><p className="mt-1 text-[#69737d]">{new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(event.at))} · {event.actorName}</p>
      {event.reason && <p className="mt-2 break-words">{event.reason}</p>}
      <ul className="mt-2 space-y-2">{event.changes.map((change) => <li key={change.field} className="break-words"><span className="font-semibold">{labels[change.field] ?? change.field}: </span>{valueLabel(change.field, change.before)} → {valueLabel(change.field, change.after)}</li>)}</ul>
    </li>)}</ol>
  </details>;
}
