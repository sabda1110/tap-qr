import { useState } from "react";
import { useI18n } from "../../i18n";
import { orderListSchema, orderStatusOptions, type OrderListSearch } from "../../server/orders/order.schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function OrderListControls({ search, onChange, admin = false }: { search: OrderListSearch; onChange: (search: OrderListSearch) => void; admin?: boolean }) {
  const { messages } = useI18n();
  const content = messages.orders;
  const [code, setCode] = useState(search.code ?? "");
  const [invalid, setInvalid] = useState(false);
  return <div className="my-5 grid gap-3 sm:grid-cols-[1fr_auto]">
    <form className="flex flex-wrap items-end gap-2" onSubmit={(event) => { event.preventDefault(); const parsed = orderListSchema.safeParse({ status: search.status, archived: search.archived, code: code.trim() || undefined }); setInvalid(!parsed.success); if (parsed.success) onChange(parsed.data); }}>
      <div className="min-w-0 flex-1"><label htmlFor="order-code-search" className="mb-2 block text-xs font-semibold">{content.orderCode}</label><Input id="order-code-search" value={code} onChange={(event) => setCode(event.target.value)} maxLength={16} aria-invalid={invalid} /></div>
      <Button variant="outline" type="submit" className="h-12">{content.checkOrder}</Button>
    </form>
    <div><label htmlFor="order-status-filter" className="mb-2 block text-xs font-semibold">{content.filter}</label><Select value={search.status ?? "all"} onValueChange={(value) => { const status = orderStatusOptions.find((status) => status === value); onChange({ code: search.code, status, archived: search.archived }); }}><SelectTrigger id="order-status-filter" className="h-12 w-full"><SelectValue>{search.status ? content.statuses[search.status] : content.all}</SelectValue></SelectTrigger><SelectContent><SelectItem value="all">{content.all}</SelectItem>{orderStatusOptions.map((status) => <SelectItem key={status} value={status}>{content.statuses[status]}</SelectItem>)}</SelectContent></Select></div>
    {admin && <div><label htmlFor="order-archive-filter" className="mb-2 block text-xs font-semibold">{content.management.archiveFilter}</label><Select value={search.archived ? "archived" : "active"} onValueChange={(value) => onChange({ code: search.code, status: search.status, archived: value === "archived" })}><SelectTrigger id="order-archive-filter" className="h-12 w-full"><SelectValue>{search.archived ? content.management.archivedOrders : content.management.activeOrders}</SelectValue></SelectTrigger><SelectContent><SelectItem value="active">{content.management.activeOrders}</SelectItem><SelectItem value="archived">{content.management.archivedOrders}</SelectItem></SelectContent></Select></div>}
  </div>;
}
