import { useId } from "react";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import type { Language, Messages } from "../../i18n";
import { consultationDate } from "../../lib/consultation-public";
import type { getConsultationAvailability } from "../../server/consultations/consultation.functions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ConsultationTimePicker } from "../molecules/consultation-time-picker";
import { ConsultationScheduleSummary } from "../molecules/consultation-schedule-summary";
import { Button } from "../ui/button";
import { landingButtonStyles } from "../elements/landing-button";

type Slot = Awaited<ReturnType<typeof getConsultationAvailability>>["slots"][number];

export function ConsultationScheduleStep({ availableDates, selectedDate, selected, dateSlots, disabled,
  language, content, onDateChange, onSlotChange, onNext }: {
  availableDates: string[];
  selectedDate: string;
  selected?: Slot;
  dateSlots: Slot[];
  disabled: boolean;
  language: Language;
  content: Messages["consultation"];
  onDateChange: (date: string) => void;
  onSlotChange: (id: string) => void;
  onNext: () => void;
}) {
  const dateSelectId = useId();
  const dateHelpId = `${dateSelectId}-help`;
  const dateOptions = Object.fromEntries(availableDates.map((date) => [date,
    consultationDate(`${date}T00:00:00+07:00`, language)]));
  const currentDate = availableDates.includes(selectedDate) ? selectedDate : null;
  return (
    <div className="min-w-0 rounded-2xl border border-black/10 bg-white p-5 sm:p-7">
      <div className="space-y-6">
        <section className="min-w-0" aria-label={content.dateTitle}>
          <label htmlFor={dateSelectId} className="mb-3 flex items-center gap-2 text-base font-bold">
            <CalendarDays aria-hidden="true" className="size-5 text-[#a46400]" />{content.dateTitle}
          </label>
          <Select items={dateOptions} value={currentDate} disabled={disabled || !availableDates.length}
            onValueChange={(value) => { if (value && value !== selectedDate) onDateChange(value); }}>
            <SelectTrigger id={dateSelectId} aria-describedby={dateHelpId}
              className="h-auto min-h-12 w-full min-w-0 py-3">
              <SelectValue placeholder={content.datePlaceholder} className="whitespace-normal leading-6" />
            </SelectTrigger>
            <SelectContent className="max-w-[calc(100vw-3rem)]">
              {availableDates.map((date) => <SelectItem key={date} value={date} className="min-h-11">
                <span className="whitespace-normal leading-6">{dateOptions[date]}</span>
              </SelectItem>)}
            </SelectContent>
          </Select>
          <p id={dateHelpId} className="mt-3 text-xs leading-5 text-[#69737d]">{content.dateHelp}</p>
        </section>
        <section className="min-w-0 border-t border-black/8 pt-6" aria-label={content.timeTitle}>
          <h3 className="flex items-center gap-2 text-base font-bold">
            <Clock3 aria-hidden="true" className="size-5 text-[#a46400]" />{content.timeTitle}
          </h3>
          {selectedDate ? <>
            <p className="mt-2 mb-5 text-sm leading-6 text-[#69737d]">{consultationDate(`${selectedDate}T00:00:00+07:00`, language)}</p>
            <ConsultationTimePicker slots={dateSlots} selectedSlot={selected?.id ?? ""} onSelect={onSlotChange}
              language={language} content={content} disabled={disabled} />
          </> : <div className="mt-3 rounded-xl bg-[#faf9f6] px-4 py-5">
            <p className="text-sm leading-6 text-[#69737d]">{content.bookingFlow.timePlaceholder}</p>
          </div>}
        </section>
      </div>
      <div className="mt-6 space-y-4 border-t border-black/8 pt-6">
        {selected && <ConsultationScheduleSummary slot={selected} language={language} content={content} />}
        <Button type="button" disabled={!selected || disabled} onClick={onNext}
          className={landingButtonStyles({ className: "min-h-12 w-full whitespace-normal sm:w-auto" })}>
          {content.bookingFlow.next}<ArrowRight aria-hidden="true" className="size-4" />
        </Button>
        <p className="text-xs leading-5 text-[#69737d]">{content.autoRefresh}</p>
      </div>
    </div>
  );
}
