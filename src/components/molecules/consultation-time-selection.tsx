import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { ConsultationAdminCopy } from "../../lib/consultation-admin-view";
import { Button } from "../ui/button";
import { CustomInputText } from "../elements/custom-input-text";

type Props = { times: string[]; onChange: (times: string[]) => void; duration: number; copy: ConsultationAdminCopy; disabled: boolean };
const suggestions = Array.from({ length: 17 }, (_, i) => `${String(9 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);
export function ConsultationTimeSelection({ times, onChange, duration, copy, disabled }: Props) {
  const [custom, setCustom] = useState("");
  const [error, setError] = useState(false);
  const toggle = (time: string) => onChange(times.includes(time) ? times.filter((item) => item !== time) : [...times, time].sort());
  const end = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const total = hour * 60 + minute + duration;
    return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}${total >= 1440 ? ` (${copy.wizard.nextDay})` : ""}`;
  };
  return <div className="space-y-5">
    <p className="text-sm leading-6 text-[#69737d]">{copy.wizard.timeHelp}</p>
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#fff6e3] p-4">
      <p className="text-sm font-semibold">{copy.slots.duration.replace("{minutes}", String(duration))}</p>
      <Button type="button" size="sm" variant="outline" disabled={disabled} onClick={() => onChange(["10:00", "11:00", "13:00", "14:00"])}>{copy.wizard.exampleHours}</Button>
    </div>
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{suggestions.map((time) => <Button key={time} type="button" variant={times.includes(time) ? "warning" : "outline"} aria-pressed={times.includes(time)} disabled={disabled || (!times.includes(time) && times.length >= 24)} className="h-auto flex-col gap-1 py-3" onClick={() => toggle(time)}><span className="font-bold">{time}</span><span className="text-[10px] font-normal">{copy.wizard.until} {end(time)}</span></Button>)}</div>
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1"><CustomInputText label={copy.wizard.customTime} type="time" value={custom} disabled={disabled} onChange={(event) => { setCustom(event.target.value); setError(false); }} /></div>
      <Button type="button" variant="outline" disabled={disabled || !custom || times.length >= 24} onClick={() => {
        if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(custom)) { setError(true); return; }
        if (!times.includes(custom)) onChange([...times, custom].sort());
        setCustom("");
      }}><Plus />{copy.slots.addTime}</Button>
    </div>
    {error && <p role="alert" className="text-sm text-red-700">{copy.slots.timeInvalid}</p>}
    <div className="border-t border-black/8 pt-4">
      <p className="text-sm font-bold" aria-live="polite">{copy.wizard.selectedTimes.replace("{count}", String(times.length))}</p>
      <div className="mt-3 flex flex-wrap gap-2">{times.map((time) => <Button key={time} type="button" variant="outline" size="sm" disabled={disabled} aria-label={copy.slots.remove.replace("{value}", time)} onClick={() => toggle(time)}>{time}–{end(time)} WIB<X className="size-3" /></Button>)}</div>
    </div>
  </div>;
}
