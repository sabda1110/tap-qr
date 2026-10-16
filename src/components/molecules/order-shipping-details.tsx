import { Truck } from "lucide-react";
import type { Messages } from "../../i18n";
import type { OrderSummary } from "../../server/orders/order.types";

export function OrderShippingDetails({ order, content }: {
  order: Pick<OrderSummary, "carrier" | "trackingNumber">;
  content: Messages["orders"];
}) {
  return (
    <section className="mt-5 rounded-xl bg-[#f7f9fb] p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold"><Truck aria-hidden="true" className="size-4" />{content.shipping}</h3>
      {order.trackingNumber ? (
        <dl className="mt-2 space-y-2 text-sm">
          <div><dt className="text-xs text-[#69737d]">{content.carrier}</dt><dd className="mt-1 break-words font-semibold">{order.carrier}</dd></div>
          <div><dt className="text-xs text-[#69737d]">{content.trackingNumber}</dt><dd className="mt-1 break-all font-semibold select-text">{order.trackingNumber}</dd></div>
        </dl>
      ) : <p className="mt-2 text-xs leading-5 text-[#69737d]">{content.noShipping}</p>}
    </section>
  );
}
