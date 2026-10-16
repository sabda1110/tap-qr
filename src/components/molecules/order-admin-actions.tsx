import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useI18n } from "../../i18n";
import { orderStatuses } from "../../server/orders/order.schemas";
import type { OrderDetail } from "../../server/orders/order.types";
import { updateCardOrder } from "../../server/orders/order.functions";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/toaster";

export function OrderAdminActions({ order }: { order: OrderDetail }) {
  const { messages } = useI18n();
  const content = messages.orders;
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const next = order.status === "cancelled" ? undefined : orderStatuses[orderStatuses.indexOf(order.status) + 1];
  if (!next || order.archived || order.paymentStatus === "refunded") return null;
  return <form className="mt-4 border-t border-black/8 pt-4" onSubmit={async (event) => {
    event.preventDefault();
    if (next === "shipped" && (!carrier.trim() || !trackingNumber.trim())) { showToast(content.shippingRequired, "warning"); return; }
    setBusy(true);
    try {
      const result = await updateCardOrder({ data: { id: order.id, expectedStatus: order.status, expectedRevision: order.revision, status: next, carrier, trackingNumber } });
      if (!result.success) { showToast(content.updateError, "error"); return; }
      await router.invalidate(); showToast(content.updated, "success");
    } catch { showToast(content.updateError, "error"); }
    finally { setBusy(false); }
  }}>
    <fieldset disabled={busy}>
      {next === "shipped" ? <div className="grid gap-3 sm:grid-cols-2"><div><label htmlFor={`carrier-${order.id}`} className="mb-2 block text-xs font-semibold">{content.carrier}</label><Input id={`carrier-${order.id}`} value={carrier} onChange={(event) => setCarrier(event.target.value)} maxLength={60} required /></div><div><label htmlFor={`tracking-${order.id}`} className="mb-2 block text-xs font-semibold">{content.trackingNumber}</label><Input id={`tracking-${order.id}`} value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} maxLength={100} required /></div></div> : <p className="text-xs leading-5 text-[#69737d]">{next === "confirmed" ? content.confirmationNote : content.completedNote}</p>}
      {next === "shipped" && (order.paymentStatus !== "paid" || !order.productionStarted) && <p className="mt-3 text-xs text-amber-800">{content.management.shippingLocked}</p>}
      <Button className="mt-3 w-full" type="submit" disabled={busy || (next === "shipped" && (order.paymentStatus !== "paid" || !order.productionStarted))}>{busy ? content.saving : next === "confirmed" ? content.confirm : next === "shipped" ? content.send : content.complete}</Button>
    </fieldset>
  </form>;
}
