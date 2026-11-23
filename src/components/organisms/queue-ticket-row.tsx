import type { QueueStatus } from "../../server/queue/queue.schemas";
import type { QueueTicketView } from "../../server/queue/queue.types";
import { Button } from "../ui/button";

export function QueueTicketRow({ ticket, label, sourceLabel, copy, busy, onStatus }: {
  ticket: QueueTicketView;
  label: string;
  sourceLabel: string;
  copy: typeof import("../../i18n/locales/queue-id").queueId.owner;
  busy: boolean;
  onStatus: (status: QueueStatus) => void;
}) {
  const actions: Partial<Record<QueueStatus, { label: string; next: QueueStatus }[]>> = {
    waiting: [{ label: copy.call, next: "called" }, { label: copy.cancel, next: "cancelled" }],
    called: [{ label: copy.start, next: "serving" }, { label: copy.reopen, next: "waiting" }, { label: copy.skip, next: "no_show" }],
    serving: [{ label: copy.finish, next: "completed" }],
  };
  return <article className="grid gap-3 rounded-2xl border border-black/10 bg-white p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-5">
    <div className="grid size-14 place-items-center rounded-xl bg-[#ffb332] text-xl font-black">{ticket.number}</div>
    <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold">{ticket.name}</h2><span className="rounded-full bg-[#f1f4f6] px-2.5 py-1 text-xs font-semibold">{label}</span><span className="text-xs text-[#69737d]">{sourceLabel}</span></div><p className="mt-1 truncate text-sm text-[#58606b]">{ticket.service}</p></div>
    <div className="flex flex-wrap gap-2">{(actions[ticket.status] ?? []).map((action) => <Button key={action.next} type="button" size="sm" variant={action.next === "cancelled" ? "outline" : "default"} disabled={busy} onClick={() => onStatus(action.next)}>{action.label}</Button>)}</div>
  </article>;
}
