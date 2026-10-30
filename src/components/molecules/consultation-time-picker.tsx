import { Clock3 } from "lucide-react";
import type { Language, Messages } from "../../i18n";
import { consultationTime } from "../../lib/consultation-public";
import type { getConsultationAvailability } from "../../server/consultations/consultation.functions";
import { Button } from "../ui/button";

type Slot = Awaited<ReturnType<typeof getConsultationAvailability>>["slots"][number];

export function ConsultationTimePicker({ slots, selectedSlot, onSelect, language, content, disabled }: { slots: Slot[]; selectedSlot: string; onSelect: (id: string) => void; language: Language; content: Messages["consultation"]; disabled?: boolean }) {
  return <div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {slots.map((slot) => <Button key={slot.id} type="button" variant={selectedSlot === slot.id ? "warning" : "outline"} disabled={disabled || !slot.bookable} aria-pressed={selectedSlot === slot.id} onClick={() => onSelect(slot.id)} className="h-auto min-h-20 flex-col gap-2 rounded-xl px-2 py-3 disabled:bg-gray-100 disabled:text-gray-500">
        <span className="flex items-center gap-1.5"><Clock3 aria-hidden="true" className="size-3.5" />{consultationTime(slot.startAt, language)} WIB</span>
        <span className="text-[10px] font-medium">{content.slotStates[slot.bookable ? "tersedia" : slot.status === "dipesan" ? "dipesan" : "ditutup"]}</span>
      </Button>)}
    </div>
    {!slots.some((slot) => slot.bookable) ? <p role="status" className="mt-3 text-sm leading-6 text-amber-800">{content.emptyDate}</p> : null}
  </div>;
}
