import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Language } from "../../i18n";
import { consultationDateKey, consultationDateLabel, type ConsultationAdminCopy } from "../../lib/consultation-admin-view";
import { Button } from "../ui/button";

type Props = { dates: string[]; onChange: (dates: string[]) => void; now: number; language: Language; copy: ConsultationAdminCopy; disabled: boolean };
export function ConsultationDateSelection({ dates, onChange, now, language, copy, disabled }: Props) {
  const today = consultationDateKey(now);
  const latest = consultationDateKey(now + 365 * 86_400_000);
  const [month, setMonth] = useState(today.slice(0, 7));
  const first = new Date(`${month}-01T00:00:00Z`);
  const count = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7;
  const locale = language === "id" ? "id-ID" : "en-GB";
  const weekdays = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 0, 5 + i))));
  const toggle = (date: string) => onChange(dates.includes(date) ? dates.filter((item) => item !== date) : [...dates, date].sort());
  const move = (direction: number) => { const next = new Date(first); next.setUTCMonth(next.getUTCMonth() + direction); setMonth(next.toISOString().slice(0, 7)); };
  return <div>
    <p className="mb-5 text-sm leading-6 text-[#69737d]">{copy.wizard.dateHelp}</p>
    <div className="rounded-2xl border border-black/10 bg-white p-3 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <Button type="button" size="icon" variant="ghost" aria-label={copy.calendar.previous} disabled={disabled || month <= today.slice(0, 7)} onClick={() => move(-1)}><ChevronLeft /></Button>
        <p className="font-bold" aria-live="polite">{new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(first)}</p>
        <Button type="button" size="icon" variant="ghost" aria-label={copy.calendar.next} disabled={disabled || month >= latest.slice(0, 7)} onClick={() => move(1)}><ChevronRight /></Button>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {weekdays.map((day) => <span key={day} className="pb-2 text-center text-xs text-[#69737d]">{day}</span>)}
        {Array.from({ length: offset }, (_, i) => <span key={`blank-${i}`} />)}
        {Array.from({ length: count }, (_, i) => {
          const date = `${month}-${String(i + 1).padStart(2, "0")}`;
          const selected = dates.includes(date);
          return <Button key={date} type="button" variant={selected ? "warning" : "ghost"} aria-pressed={selected} aria-label={consultationDateLabel(date, language)} disabled={disabled || date < today || date > latest || (!selected && dates.length >= 31)} className="h-11 min-w-0 px-0" onClick={() => toggle(date)}>{i + 1}</Button>;
        })}
      </div>
    </div>
    <p className="mt-4 text-sm font-bold" aria-live="polite">{copy.wizard.selectedDates.replace("{count}", String(dates.length))}</p>
    <div className="mt-3 flex flex-wrap gap-2">{dates.map((date) => <Button key={date} type="button" size="sm" variant="outline" disabled={disabled} aria-label={copy.slots.remove.replace("{value}", consultationDateLabel(date, language))} onClick={() => toggle(date)}>{consultationDateLabel(date, language)}<X className="size-3" /></Button>)}</div>
  </div>;
}
