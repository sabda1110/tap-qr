import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useI18n } from "../../i18n";
import type { OrderDetail } from "../../server/orders/order.types";
import { manageCardOrder } from "../../server/orders/order-management.functions";
import { Dialog, DialogBody, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/toaster";

export type OrderManagementMode = "cancel" | "paid" | "refunded" | "production" | "archive" | "restore" | "shipping" | "delete";

export function OrderManagementDialog({ order, mode, onClose }: { order: OrderDetail; mode: OrderManagementMode; onClose: () => void }) {
  const { messages } = useI18n();
  const content = messages.orders.management;
  const [reason, setReason] = useState("");
  const [carrier, setCarrier] = useState(order.carrier);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber);
  const [busy, setBusy] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const needsReason = ["cancel", "paid", "refunded", "shipping"].includes(mode);
  const titles = { cancel: content.cancelTitle, paid: content.paidTitle, refunded: content.refundTitle, production: content.productionTitle, archive: content.archiveTitle, restore: content.restoreTitle, shipping: content.shippingTitle, delete: content.deleteTitle };
  const descriptions = { cancel: content.cancelDescription, paid: content.paidDescription, refunded: content.refundDescription, production: content.productionDescription, archive: content.archiveDescription, restore: content.archiveDescription, shipping: content.shippingDescription, delete: content.deleteDescription };
  const formId = `manage-order-${order.id}`;
  return <Dialog title={titles[mode]} description={`${order.code} · ${descriptions[mode]}`} closeLabel={content.close} busy={busy} onClose={onClose} dismissOnOutsidePress={false}>
    <DialogBody><form id={formId} onSubmit={async (event) => {
      event.preventDefault();
      if (needsReason && reason.trim().length < 5) { setInvalid(true); return; }
      setBusy(true);
      try {
        const base = { id: order.id, expectedRevision: order.revision };
        const data = mode === "cancel" ? { ...base, action: "cancel" as const, reason }
          : mode === "shipping" ? { ...base, action: "shipping" as const, carrier, trackingNumber, reason }
          : mode === "paid" || mode === "refunded" ? { ...base, action: "payment" as const, paymentStatus: mode, reason }
          : mode === "production" ? { ...base, action: "production" as const }
          : { ...base, action: "archive" as const, archived: mode === "archive" || mode === "delete" };
        const result = await manageCardOrder({ data });
        if (!result.success) { showToast(content.error, "error"); return; }
        await router.invalidate(); showToast(messages.orders.updated, "success"); onClose();
      } catch { showToast(content.error, "error"); }
      finally { setBusy(false); }
    }}>{mode === "shipping" && <div className="mb-4 grid gap-3"><label className="text-sm font-semibold">{messages.orders.carrier}<Input value={carrier} onChange={(event) => setCarrier(event.target.value)} disabled={busy} maxLength={60} required className="mt-2" /></label><label className="text-sm font-semibold">{messages.orders.trackingNumber}<Input value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} disabled={busy} maxLength={100} required className="mt-2" /></label></div>}{needsReason && <><label htmlFor="order-change-reason" className="mb-2 block text-sm font-semibold">{content.reason}</label><Input id="order-change-reason" value={reason} onChange={(event) => setReason(event.target.value)} disabled={busy} maxLength={500} aria-invalid={invalid} /><p className={`mt-2 text-xs leading-5 ${invalid ? "text-red-700" : "text-[#69737d]"}`}>{content.reasonHelp}</p></>}</form></DialogBody>
    <DialogFooter><Button variant="outline" onClick={onClose} disabled={busy}>{content.close}</Button><Button form={formId} type="submit" disabled={busy} variant={mode === "cancel" || mode === "delete" ? "destructive" : "default"}>{busy ? messages.orders.saving : mode === "delete" ? content.delete : content.confirm}</Button></DialogFooter>
  </Dialog>;
}
