import { Check, Package } from "lucide-react";
import { OrderShippingDetails } from "./order-shipping-details";
import type { Language, Messages } from "../../i18n";
import { orderStatuses } from "../../server/orders/order.schemas";
import type { OrderSummary } from "../../server/orders/order.types";

export function orderThemeName(order: Pick<OrderSummary, "product" | "theme">, messages: Messages) {
  const studio = messages.adminDashboard.printStudio;
  const theme = order.theme;
  if (order.product === "social" && theme in studio.themes) return studio.themes[theme as keyof typeof studio.themes].title;
  if (order.product === "wifi" && theme in studio.wifi.themeDescriptions) return studio.wifi[theme as keyof typeof studio.wifi.themeDescriptions];
  return theme;
}

export function orderWhatsAppUrl(order: OrderSummary, number: string, messages: Messages) {
  const text = messages.orders.whatsappMessage.replace("{code}", order.code).replace("{product}", messages.orders[order.product])
    .replace("{material}", messages.orders[order.material]).replace("{theme}", orderThemeName(order, messages)).replace("{quantity}", String(order.quantity));
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

const formatDate = (at: string, language: Language) => new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-GB", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta",
}).format(new Date(at));

export function OrderSummaryCard({ order, messages, language, timeline = false }: { order: OrderSummary; messages: Messages; language: Language; timeline?: boolean }) {
  const content = messages.orders;
  return <div className="min-w-0 rounded-2xl border border-black/8 bg-white p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs text-[#69737d]">{content.orderCode}</p><h2 className="mt-1 break-all text-lg font-bold">{order.code}</h2></div><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${order.status === "completed" ? "bg-emerald-50 text-emerald-800" : "bg-cyan-50 text-cyan-800"}`}>{content.statuses[order.status]}</span></div>
    <p className="mt-2 text-xs text-[#69737d]">{content.date}: {formatDate(order.createdAt, language)} WIB</p>
    <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
      {[{ label: content.product, value: content[order.product] }, { label: content.material, value: content[order.material] }, { label: content.design, value: orderThemeName(order, messages) }, { label: content.quantity, value: order.quantity }].map(({ label, value }) => <div key={label}><dt className="text-xs text-[#69737d]">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}
    </dl>
    <dl className="mt-4 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-xs text-[#69737d]">{content.management.payment}</dt><dd className="mt-1 font-semibold">{content.management.payments[order.paymentStatus]}</dd></div><div><dt className="text-xs text-[#69737d]">{content.management.production}</dt><dd className="mt-1 font-semibold">{order.productionStarted ? content.management.started : content.management.notStarted}</dd></div></dl>
    {order.status === "cancelled" && <p className="mt-4 rounded-lg bg-red-50 p-3 text-xs leading-5 text-red-800">{content.statusHelp.cancelled}</p>}
    <OrderShippingDetails order={order} content={content} />
    {timeline && <section className="mt-6"><h3 className="text-sm font-bold">{content.timeline}</h3><ol className="mt-4 space-y-4">{(order.status === "cancelled" ? [...orderStatuses.filter((status) => order.history.some((event) => event.status === status)), "cancelled" as const] : orderStatuses).map((status, index) => {
      const event = order.history.find((entry) => entry.status === status);
      const current = order.status === status;
      return <li key={status} className="flex gap-3"><span aria-hidden="true" className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${event ? "bg-[#087e91] text-white" : "bg-[#f3f5f7] text-[#69737d]"}`}>{event ? <Check className="size-4" /> : index + 1}</span><div><p className={`text-sm font-bold ${!event ? "text-[#69737d]" : ""}`} aria-current={current ? "step" : undefined}>{content.statuses[status]}</p>{event && <p className="mt-1 text-xs text-[#69737d]">{formatDate(event.at, language)} WIB</p>}{current && <p className="mt-1 text-xs leading-5 text-[#69737d]">{content.statusHelp[status]}</p>}</div></li>;
    })}</ol></section>}
    {!timeline && <p className="mt-4 flex gap-2 text-xs leading-5 text-[#69737d]"><Package aria-hidden="true" className="mt-0.5 size-4 shrink-0" />{content.statusHelp[order.status]}</p>}
  </div>;
}
