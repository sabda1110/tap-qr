import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Language, Messages } from "../../i18n";
import { Button } from "../ui/button";

type Props = {
  availableDates: string[];
  selectedDate: string;
  onSelect: (date: string) => void;
  language: Language;
  content: Messages["consultation"];
  disabled?: boolean;
};

export function ConsultationCalendar({ availableDates, selectedDate, onSelect, language, content, disabled }: Props) {
  const firstMonth = availableDates[0]?.slice(0, 7) ?? selectedDate.slice(0, 7);
  const lastMonth = availableDates.at(-1)?.slice(0, 7) ?? firstMonth;
  const [requestedMonth, setViewMonth] = useState(selectedDate.slice(0, 7) || firstMonth);
  const viewMonth = requestedMonth < firstMonth ? firstMonth : requestedMonth > lastMonth ? lastMonth : requestedMonth;
  const [year, month] = viewMonth.split("-").map(Number);
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const offset = (firstDay.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const locale = language === "id" ? "id-ID" : "en-GB";
  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(firstDay);
  const weekdays = Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 0, 5 + index))));
  const changeMonth = (direction: number) => {
    const date = new Date(Date.UTC(year, month - 1 + direction, 1));
    setViewMonth(`${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`);
  };
  return <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
    <div className="mb-5 flex items-center justify-between gap-3">
      <Button type="button" variant="ghost" className="size-11" aria-label={content.previousMonth} disabled={disabled || viewMonth <= firstMonth} onClick={() => changeMonth(-1)}><ChevronLeft /></Button>
      <p className="text-center font-bold" aria-live="polite">{monthLabel}</p>
      <Button type="button" variant="ghost" className="size-11" aria-label={content.nextMonth} disabled={disabled || viewMonth >= lastMonth} onClick={() => changeMonth(1)}><ChevronRight /></Button>
    </div>
    <div className="grid grid-cols-7 gap-1" role="group" aria-label={monthLabel}>
      {weekdays.map((day) => <span key={day} className="pb-3 text-center text-xs font-semibold text-[#69737d]">{day}</span>)}
      {Array.from({ length: offset }, (_, index) => <span key={`empty-${index}`} />)}
      {Array.from({ length: days }, (_, index) => {
        const date = `${viewMonth}-${String(index + 1).padStart(2, "0")}`;
        const available = availableDates.includes(date);
        const active = selectedDate === date;
        return <Button key={date} type="button" variant={active ? "warning" : "ghost"} className={`mx-auto h-11 w-full max-w-12 rounded-xl ${available && !active ? "bg-amber-50 font-bold text-[#8a5100]" : ""}`} disabled={disabled || !available} aria-pressed={active} aria-label={new Intl.DateTimeFormat(locale, { dateStyle: "full", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`))} onClick={() => onSelect(date)}>{index + 1}</Button>;
      })}
    </div>
    <p className="mt-5 text-xs leading-5 text-[#69737d]">{content.dateHelp}</p>
  </div>;
}
