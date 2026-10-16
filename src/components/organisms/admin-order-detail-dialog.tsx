import { ReceiptText } from "lucide-react";
import type { Language, Messages } from "../../i18n";
import type { OrderDetail } from "../../server/orders/order.types";
import { Dialog, DialogBody, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { OrderSummaryCard } from "../molecules/order-summary";
import { OrderAdminActions } from "../molecules/order-admin-actions";
import { OrderManagementActions } from "../molecules/order-management-actions";
import { OrderAuditHistory } from "../molecules/order-audit-history";

export function AdminOrderDetailDialog({ order, messages, language, onClose }: {
  order: OrderDetail; messages: Messages; language: Language; onClose: () => void;
}) {
  const content = messages.orders;
  const address = [order.customer.address, order.customer.shippingRegion?.village, order.customer.shippingRegion?.district,
    order.customer.shippingRegion?.city, order.customer.shippingRegion?.province].filter(Boolean).join(", ");
  return (
    <Dialog title={`${content.management.detail} · ${order.code}`} closeLabel={content.management.close} onClose={onClose} icon={ReceiptText}>
      <DialogBody>
        <div className="grid items-start gap-4 md:grid-cols-2" key={`${order.id}-${order.revision}`}>
          <OrderSummaryCard order={order} messages={messages} language={language} timeline />
          <section className="min-w-0 rounded-2xl border border-black/8 bg-white p-5">
            <h2 className="text-sm font-bold">{content.customer}</h2>
            <dl className="mt-4 space-y-4 text-sm">
              {[{ label: content.name, value: order.customer.name }, { label: content.email, value: order.customer.email },
                { label: content.phone, value: `+${order.customer.phone}` }, { label: content.shippingTitle, value: address }].map(({ label, value }) => (
                <div key={label}><dt className="text-xs text-[#69737d]">{label}</dt><dd className="mt-1 break-words font-medium [overflow-wrap:anywhere]">{value}</dd></div>
              ))}
            </dl>
            <a className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-[#087e91]" href={`https://wa.me/${order.customer.phone}?text=${encodeURIComponent(order.code)}`} target="_blank" rel="noreferrer">{content.contactCustomer}</a>
            <OrderAdminActions order={order} />
            <OrderManagementActions order={order} admin whatsappNumber={null} />
            <OrderAuditHistory orderId={order.id} />
          </section>
        </div>
      </DialogBody>
      <DialogFooter><Button variant="outline" onClick={onClose}>{content.management.close}</Button></DialogFooter>
    </Dialog>
  );
}
