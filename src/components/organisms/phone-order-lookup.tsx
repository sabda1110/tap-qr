import { useState } from "react";
import { Search } from "lucide-react";
import { useI18n } from "../../i18n";
import { orderPhoneSchema } from "../../server/orders/order.schemas";
import { getOrdersByPhone } from "../../server/orders/order.functions";
import type { PhoneOrderList } from "../../server/orders/order.types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { orderThemeName } from "../molecules/order-summary";
import { OrderShippingDetails } from "../molecules/order-shipping-details";
import { OrderChangeRequests } from "../molecules/order-change-requests";

export function PhoneOrderLookup() {
  const { language, messages } = useI18n();
  const content = messages.orders;
  const [phone, setPhone] = useState("");
  const [queriedPhone, setQueriedPhone] = useState("");
  const [page, setPage] = useState<PhoneOrderList>();
  const [whatsappNumber, setWhatsAppNumber] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function lookup(cursor?: string) {
    const parsed = orderPhoneSchema.safeParse(phone);
    if (!parsed.success) { setError(content.invalidPhone); setPage(undefined); return; }
    setBusy(true);
    setError(undefined);
    if (!cursor) setPage(undefined);
    try {
      const result = await getOrdersByPhone({ data: { phone: parsed.data, cursor } });
      if (!result.success) { setError(content[result.reason]); return; }
      setQueriedPhone(parsed.data);
      setWhatsAppNumber(result.whatsappNumber);
      setPage((previous) => ({ orders: cursor ? [...(previous?.orders ?? []), ...result.page.orders] : result.page.orders, nextCursor: result.page.nextCursor }));
    } catch { setError(content.lookupError); }
    finally { setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form className="rounded-2xl border border-black/8 bg-white p-5 sm:p-6" onSubmit={(event) => { event.preventDefault(); void lookup(); }} noValidate>
        <h1 className="text-2xl font-bold tracking-tight">{content.checkOrder}</h1>
        <p className="mt-2 text-sm leading-6 text-[#69737d]">{content.lookupDescription}</p>
        <label htmlFor="lookup-phone" className="mt-5 mb-2 block text-sm font-semibold">{content.lookupPhone}</label>
        <Input id="lookup-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} placeholder={content.phonePlaceholder} maxLength={24}
          disabled={busy} aria-invalid={!!error} aria-describedby={error ? "lookup-error" : "lookup-privacy"}
          onChange={(event) => { setPhone(event.target.value); setPage(undefined); setError(undefined); }} />
        <p id="lookup-privacy" className="mt-2 text-xs leading-5 text-[#69737d]">{content.phonePrivacy}</p>
        {error && <p id="lookup-error" role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        <Button type="submit" className="mt-4 w-full sm:w-auto" disabled={busy}><Search aria-hidden="true" />{busy ? content.searching : content.checkOrder}</Button>
      </form>
      <div aria-live="polite" aria-busy={busy} className="mt-5 space-y-4">
        {page?.orders.length === 0 && <p role="status" className="rounded-xl border border-black/8 bg-white p-5 text-sm text-[#69737d]">{content.phoneEmpty}</p>}
        {page?.orders.map((order) => <article key={order.code} className="rounded-2xl border border-black/8 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="break-all text-base font-bold">{order.code}</h2><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${order.status === "completed" ? "bg-emerald-50 text-emerald-800" : "bg-cyan-50 text-cyan-800"}`}>{content.statuses[order.status]}</span></div>
          <p className="mt-2 text-xs text-[#69737d]">{content.date}: {new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-GB", { dateStyle: "medium", timeZone: "Asia/Jakarta" }).format(new Date(order.createdAt))}</p>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            {[{ label: content.product, value: content[order.product] }, { label: content.material, value: content[order.material] }, { label: content.design, value: orderThemeName(order, messages) }, { label: content.quantity, value: order.quantity }].map(({ label, value }) => <div key={label}><dt className="text-xs text-[#69737d]">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}
          </dl>
          <OrderShippingDetails order={order} content={content} />
          <OrderChangeRequests order={order} number={whatsappNumber} content={content.management} />
          <p className="mt-4 text-xs leading-5 text-[#69737d]">{content.statusHelp[order.status]}</p>
        </article>)}
      </div>
      {page?.nextCursor && orderPhoneSchema.safeParse(phone).data === queriedPhone && <Button className="mt-5" variant="outline" disabled={busy} onClick={() => void lookup(page.nextCursor)}>{busy ? content.searching : content.moreOrders}</Button>}
    </div>
  );
}
