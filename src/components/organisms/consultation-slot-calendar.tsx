import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, LockKeyhole, Trash2, UnlockKeyhole } from "lucide-react";
import type { Language } from "../../i18n";
import type { ConsultationSlot } from "../../server/consultations/consultation.types";
import { changeConsultationSlot } from "../../server/consultations/consultation.functions";
import { consultationDateKey, consultationDateLabel, consultationRangeLabel, consultationSlotClass, type ConsultationAdminCopy, type ConsultationMutation } from "../../lib/consultation-admin-view";
import { cn } from "../../lib/utils";
import { AlertDialog } from "../ui/alert-dialog";
import { Button } from "../ui/button";

type Props = { initialDate?: string; slots: ConsultationSlot[]; now: number; cutoffHours: number; language: Language; copy: ConsultationAdminCopy; busy: boolean; mutate: ConsultationMutation };
const dayDate = (key: string) => new Date(`${key}T12:00:00Z`);
const dayKey = (date: Date) => date.toISOString().slice(0, 10);

function calendarDays(anchor: string, mode: "week" | "month") {
  const date = dayDate(anchor);
  if (mode === "month") date.setUTCDate(1);
  const offset = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - offset);
  return Array.from({ length: mode === "week" ? 7 : 42 }, (_, index) => {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + index);
    return dayKey(result);
  });
}

export function ConsultationSlotCalendar({ initialDate, slots, now, cutoffHours, language, copy, busy, mutate }: Props) {
  const today = consultationDateKey(now);
  const [anchor, setAnchor] = useState(initialDate ?? today);
  const [selected, setSelected] = useState(initialDate ?? today);
  const [mode, setMode] = useState<"week" | "month">("month");
  const [deleting, setDeleting] = useState<ConsultationSlot | null>(null);
  const days = calendarDays(anchor, mode);
  const byDate = useMemo(() => {
    const result = new Map<string, ConsultationSlot[]>();
    for (const slot of slots) result.set(slot.date, [...(result.get(slot.date) ?? []), slot]);
    for (const list of result.values()) list.sort((first, second) => first.startAt.localeCompare(second.startAt));
    return result;
  }, [slots]);
  const shift = (direction: number) => {
    const date = dayDate(anchor);
    if (mode === "month") { date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() + direction); }
    else date.setUTCDate(date.getUTCDate() + direction * 7);
    setAnchor(dayKey(date));
    setSelected(dayKey(date));
  };
  const month = new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(dayDate(anchor));
  const dayFormatter = new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-GB", { weekday: "short", timeZone: "UTC" });
  return <section className="min-w-0 rounded-3xl border border-black/8 bg-white p-4 sm:p-6">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-lg font-bold capitalize">{month}</h2>
      <div className="flex rounded-xl bg-[#f2f5f7] p-1" aria-label={copy.tabs.slots}>{(["week", "month"] as const).map((value) => <Button key={value} type="button" size="sm" variant={mode === value ? "default" : "ghost"} aria-pressed={mode === value} onClick={() => setMode(value)}>{copy.calendar[value]}</Button>)}</div>
    </header>
    <div className="my-4 flex items-center justify-between gap-2"><Button variant="outline" size="icon" aria-label={copy.calendar.previous} onClick={() => shift(-1)}><ChevronLeft /></Button><Button size="sm" variant="ghost" onClick={() => { setAnchor(today); setSelected(today); }}>{copy.calendar.today}</Button><Button variant="outline" size="icon" aria-label={copy.calendar.next} onClick={() => shift(1)}><ChevronRight /></Button></div>
    <div className="grid grid-cols-7 gap-1 text-center sm:gap-2">
      {days.slice(0, 7).map((key) => <span key={`label-${key}`} className="pb-2 text-[10px] font-bold text-[#69737d] sm:text-xs">{dayFormatter.format(dayDate(key))}</span>)}
      {days.map((key) => {
        const daySlots = byDate.get(key) ?? [];
        const countLabel = daySlots.length ? copy.calendar.total.replace("{count}", String(daySlots.length)) : copy.calendar.emptyDay;
        return <Button key={key} variant="ghost" aria-pressed={selected === key} aria-label={`${consultationDateLabel(key, language)}. ${countLabel}`} className={cn("flex h-auto min-h-16 min-w-0 flex-col gap-1 rounded-xl border px-0.5 py-2 sm:min-h-20", selected === key ? "border-[#ffb332] bg-[#fff6e3] ring-2 ring-[#ffb332]/25" : "border-black/6", key.slice(0, 7) !== anchor.slice(0, 7) && "opacity-50")} onClick={() => setSelected(key)}>
          <span className={cn("grid size-6 place-items-center rounded-full text-xs font-bold sm:text-sm", key === today && "bg-[#172029] text-white")}>{Number(key.slice(-2))}</span>
          <span className="flex min-h-2 flex-wrap justify-center gap-0.5">{(["tersedia", "dipesan", "ditutup"] as const).map((status) => daySlots.some((slot) => slot.status === status) && <span key={status} className={cn("size-1.5 rounded-full sm:size-2", status === "tersedia" ? "bg-emerald-500" : status === "dipesan" ? "bg-amber-500" : "bg-slate-400")} />)}</span>
          <span className="hidden text-[10px] text-[#69737d] sm:block">{daySlots.length || "—"}</span>
        </Button>;
      })}
    </div>
    <div className="mt-4 flex flex-wrap gap-3 text-[11px] font-semibold">{(["tersedia", "dipesan", "ditutup"] as const).map((status) => <span className={cn("rounded-full border px-2 py-1", consultationSlotClass[status])} key={status}>{copy.slotStatuses[status]}</span>)}</div>
    <div className="mt-6 border-t border-black/8 pt-5"><h3 className="font-bold">{consultationDateLabel(selected, language)}</h3><p className="mt-1 text-xs text-[#69737d]">{copy.calendar.selectedDate}</p>
      {!byDate.get(selected)?.length && <p className="py-6 text-sm text-[#69737d]">{copy.calendar.empty}</p>}
      <div className="mt-3 grid gap-3">{byDate.get(selected)?.map((slot) => {
        const cutoff = Date.parse(slot.startAt) - cutoffHours * 3_600_000 <= now;
        const past = Date.parse(slot.startAt) <= now;
        return <article key={slot.id} className="rounded-2xl border border-black/8 p-3 sm:p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold">{consultationRangeLabel(slot.startAt, slot.endAt)}</p><span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", consultationSlotClass[slot.status])}>{copy.slotStatuses[slot.status]}</span></div>
          {slot.status === "dipesan" ? <p className="mt-3 text-xs leading-5 text-[#69737d]">{copy.calendar.bookedHelp}</p> : <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" disabled={busy || (slot.status === "ditutup" && cutoff)} onClick={() => void mutate(() => changeConsultationSlot({ data: { id: slot.id, action: slot.status === "tersedia" ? "close" : "open" } }))}>{slot.status === "tersedia" ? <LockKeyhole /> : <UnlockKeyhole />}{slot.status === "tersedia" ? copy.calendar.close : copy.calendar.open}</Button>
            <Button size="sm" variant="destructive" disabled={busy} onClick={() => setDeleting(slot)}><Trash2 />{copy.calendar.delete}</Button>
            {cutoff && <span className="text-xs text-[#69737d]">{past ? copy.calendar.past : copy.calendar.cutoff}</span>}
          </div>}
        </article>;
      })}</div>
    </div>
    <AlertDialog open={Boolean(deleting)} title={copy.calendar.deleteTitle} description={copy.calendar.deleteDescription} cancelLabel={copy.cancel} confirmLabel={busy ? copy.saving : copy.calendar.delete} onOpenChange={(open) => { if (!open && !busy) setDeleting(null); }} onConfirm={() => { if (!deleting || busy) return; void mutate(() => changeConsultationSlot({ data: { id: deleting.id, action: "delete" } })).then((success) => { if (success) setDeleting(null); }); }} />
  </section>;
}
