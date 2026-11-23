import { useState } from "react";
import { MessageCircle } from "lucide-react";
import type { QueueStatus } from "../../server/queue/queue.schemas";
import type { QueueTicketView } from "../../server/queue/queue.types";
import { Button } from "../ui/button";

export function QueueTicketRow({ ticket, label, sourceLabel, copy, busy, availableStations, onStatus }: {
  ticket: QueueTicketView;
  label: string;
  sourceLabel: string;
  copy: typeof import("../../i18n/locales/queue-id").queueId.owner;
  busy: boolean;
  availableStations: number[];
  onStatus: (status: QueueStatus, stationNumber?: number) => void;
}) {
  const [selectedStation, setSelectedStation] = useState<number | null>(availableStations[0] ?? null);
  const activeStation = selectedStation && availableStations.includes(selectedStation) ? selectedStation : availableStations[0] ?? null;
  const actions: Partial<Record<QueueStatus, { label: string; next: QueueStatus }[]>> = {
    waiting: [{ label: copy.call, next: "called" }, { label: copy.cancel, next: "cancelled" }],
    called: [{ label: copy.reopen, next: "waiting" }, { label: copy.skip, next: "no_show" }],
    serving: [{ label: copy.finish, next: "completed" }],
  };
  const phone = ticket.phone && /^628\d{7,11}$/.test(ticket.phone) ? ticket.phone : null;
  const message = copy.whatsAppMessage.replace("{name}", ticket.name).replace("{number}", String(ticket.number));
  const needsStation = ticket.status === "called" || (ticket.status === "serving" && !ticket.stationNumber);
  const stationActionLabel = ticket.status === "called" ? copy.start : copy.assignStation;
  return <article className="grid gap-3 border-t border-black/8 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
    <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#f5f7f8] px-2 text-sm font-bold">{ticket.number}</span><h3 className="font-bold">{ticket.name}</h3><span className="rounded-full bg-[#f1f4f6] px-2.5 py-1 text-xs font-semibold">{label}</span>{ticket.stationNumber && <span className="rounded-full bg-[#e7f7f9] px-2.5 py-1 text-xs font-semibold text-[#087e91]">{copy.stationLabel.replace("{number}", String(ticket.stationNumber))}</span>}<span className="text-xs text-[#69737d]">{sourceLabel}</span></div><p className="mt-2 text-sm text-[#58606b]">{ticket.service}</p>
      {phone && <a href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-[#087e91] underline-offset-4 hover:underline"><MessageCircle aria-hidden="true" className="size-4" />{copy.contactWhatsApp} · {phone}</a>}
    </div>
    <div className="flex flex-wrap items-center gap-2">
      {needsStation && (availableStations.length ? <>
        <label className="sr-only" htmlFor={`queue-station-${ticket.id}`}>{copy.selectStation}</label>
        <select id={`queue-station-${ticket.id}`} value={activeStation ?? ""} onChange={(event) => setSelectedStation(Number(event.target.value) || null)} disabled={busy} className="h-9 min-w-28 rounded-lg border border-black/15 bg-white px-2 text-sm">
          <option value="">{copy.selectStation}</option>{availableStations.map((number) => <option key={number} value={number}>{copy.stationLabel.replace("{number}", String(number))}</option>)}
        </select>
        <Button type="button" size="sm" disabled={busy || !activeStation} onClick={() => activeStation && onStatus("serving", activeStation)}>{stationActionLabel}</Button>
      </> : <span className="text-xs font-semibold text-amber-800">{copy.allStationsBusy}</span>)}
      {(actions[ticket.status] ?? []).map((action) => <Button key={action.next} type="button" size="sm" variant={action.next === "cancelled" ? "outline" : "default"} disabled={busy} onClick={() => onStatus(action.next)}>{action.label}</Button>)}
    </div>
  </article>;
}
