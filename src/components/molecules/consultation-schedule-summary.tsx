import { CalendarDays, Clock3 } from "lucide-react";
import type { Language, Messages } from "../../i18n";
import { consultationDate, consultationTime } from "../../lib/consultation-public";

export function ConsultationScheduleSummary({ slot, language, content, details = false }: {
  slot: { startAt: string; endAt: string };
  language: Language;
  content: Messages["consultation"];
  details?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#ffb332]/40 bg-[#fff8e9] p-4 sm:p-5">
      <p className="text-xs font-bold text-[#85500e]">{content.bookingFlow.selectedSchedule}</p>
      <p className="mt-3 flex items-start gap-2 text-sm font-bold leading-6">
        <CalendarDays aria-hidden="true" className="mt-1 size-4 shrink-0" />
        {consultationDate(slot.startAt, language)}
      </p>
      <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
        <Clock3 aria-hidden="true" className="size-4 shrink-0" />
        {consultationTime(slot.startAt, language)}–{consultationTime(slot.endAt, language)} WIB
      </p>
      <p className="mt-3 text-xs leading-5 text-[#69737d]">
        {details ? content.bookingFlow.awaitingConfirmation : content.bookingFlow.notReserved}
      </p>
    </div>
  );
}
