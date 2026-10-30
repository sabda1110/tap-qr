import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import type { Language } from "../../i18n";
import type { AdminConsultationBooking, BookingStatus } from "../../server/consultations/consultation.types";
import { bookingStatuses } from "../../server/consultations/consultation.types";
import { consultationCountdown, consultationDateLabel, consultationRangeLabel, consultationStatusClass, type ConsultationAdminCopy } from "../../lib/consultation-admin-view";
import { cn } from "../../lib/utils";
import { CustomInputText } from "../elements/custom-input-text";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Props = { bookings: AdminConsultationBooking[]; date?: string; status?: BookingStatus; now: number; copy: ConsultationAdminCopy; language: Language; busy: boolean; onFilter: (value: { date?: string; status?: BookingStatus }) => void; onSelect: (id: string) => void };

export function ConsultationBookingsTable({ bookings, date, status, now, copy, language, busy, onFilter, onSelect }: Props) {
  const [page, setPage] = useState(0);
  const total = Math.max(1, Math.ceil(bookings.length / 20));
  const current = Math.min(page, total - 1);
  const items = [{ value: "all", label: copy.all }, ...bookingStatuses.map((value) => ({ value, label: copy.statuses[value] }))];
  return <section className="min-w-0">
    <div className="mb-5 grid items-end gap-3 rounded-2xl border border-black/8 bg-white p-4 sm:grid-cols-[1fr_1fr_auto]">
      <CustomInputText id="consultation-date-filter" label={copy.dateFilter} type="date" value={date ?? ""} disabled={busy} onChange={(event) => { setPage(0); onFilter({ date: event.target.value || undefined, status }); }} />
      <div><label id="consultation-status-label" className="mb-2 block text-sm font-semibold">{copy.statusFilter}</label><Select items={items} value={status ?? "all"} disabled={busy} onValueChange={(value) => { setPage(0); onFilter({ date, status: value === "all" ? undefined : value as BookingStatus }); }}><SelectTrigger aria-labelledby="consultation-status-label" className="w-full"><SelectValue /></SelectTrigger><SelectContent>{items.map((item) => <SelectItem value={item.value} key={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>
      <Button variant="outline" disabled={busy || (!date && !status)} onClick={() => { setPage(0); onFilter({}); }}>{copy.clearFilter}</Button>
    </div>
    {!bookings.length ? <p className="rounded-2xl border border-black/8 bg-white p-8 text-center text-sm text-[#69737d]">{copy.empty}</p> : <div className="overflow-hidden rounded-2xl border border-black/8 bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-black/8 bg-[#f2f5f7] text-xs text-[#69737d]"><tr>{[copy.table.schedule, copy.table.customer, copy.business, copy.statusFilter, copy.table.actions].map((label) => <th className="px-5 py-4 font-semibold" scope="col" key={label}>{label}</th>)}</tr></thead><tbody className="divide-y divide-black/6">
      {bookings.slice(current * 20, (current + 1) * 20).map((booking) => <tr key={booking.id} className="align-top hover:bg-[#fffbf2]">
        <td className="px-5 py-5"><p className="font-bold">{consultationDateLabel(booking.startAt, language)}</p><p className="mt-1 whitespace-nowrap text-xs text-[#69737d]">{consultationRangeLabel(booking.startAt, booking.endAt)}</p><p className="mt-2 font-mono text-[10px]">{booking.code}</p></td>
        <td className="max-w-48 px-5 py-5"><p className="break-words font-semibold">{booking.name}</p><p className="mt-1 text-xs text-[#69737d]">+{booking.whatsapp}</p>{booking.isNew && <span className="mt-2 inline-flex rounded-full bg-[#fff0cd] px-2 py-0.5 text-[10px] font-bold text-[#805300]">{copy.new}</span>}</td>
        <td className="max-w-56 px-5 py-5"><p className="break-words">{booking.businessName || copy.noBusiness}</p>{booking.notes && <p title={booking.notes} className="mt-1 line-clamp-2 break-words text-xs leading-5 text-[#69737d]">{booking.notes}</p>}</td>
        <td className="px-5 py-5"><span className={cn("inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold", consultationStatusClass[booking.status])}>{copy.statuses[booking.status]}</span>{booking.status === "menunggu" && <p className={cn("mt-2 max-w-48 text-xs font-semibold", Date.parse(booking.deadlineAt) - now < 3_600_000 ? "text-amber-800" : "text-[#69737d]")}>{consultationCountdown(booking.deadlineAt, now, copy)}</p>}{booking.notificationPending && <p className="mt-2 max-w-48 text-xs font-semibold text-amber-800">{copy.notificationPending}</p>}</td>
        <td className="px-5 py-5"><Button variant="outline" size="sm" disabled={busy} onClick={() => onSelect(booking.id)}><Eye />{copy.table.details}</Button></td>
      </tr>)}
    </tbody></table></div></div>}
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><Button variant="outline" size="sm" disabled={!current} onClick={() => setPage(current - 1)}><ChevronLeft />{copy.table.previous}</Button><p className="text-xs text-[#69737d]">{copy.table.pagination.replace("{page}", String(current + 1)).replace("{total}", String(total))}</p><Button variant="outline" size="sm" disabled={current + 1 >= total} onClick={() => setPage(current + 1)}>{copy.table.next}<ChevronRight /></Button></div>
  </section>;
}
