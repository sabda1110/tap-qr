import type { QueueStatus } from "../../server/queue/queue.schemas";
import type { QueueTicketView } from "../../server/queue/queue.types";

type OwnerCopy = Pick<typeof import("../../i18n/locales/queue-id").queueId.owner,
  "stationLabel" | "stationEmpty" | "waiting">;
type CashierCopy = Pick<typeof import("../../i18n/locales/queue-id").queueId.cashier,
  "previewProcessing" | "previewWaiting" | "previewNew" | "previewEmpty" | "unassignedServing">;

export function QueueStationBoard({ stationCount, tickets, ownerCopy, cashierCopy, statusLabel }: {
  stationCount: number;
  tickets: QueueTicketView[];
  ownerCopy: OwnerCopy;
  cashierCopy: CashierCopy;
  statusLabel: Record<QueueStatus, string>;
}) {
  const serving = tickets.filter((ticket) => ticket.status === "serving");
  const occupiedStations = new Map(serving.flatMap((ticket) => ticket.stationNumber ? [[ticket.stationNumber, ticket] as const] : []));
  const unassignedServing = serving.filter((ticket) => !ticket.stationNumber);
  const waiting = tickets.filter((ticket) => ticket.status === "waiting");
  const nextWaiting = waiting.reduce<QueueTicketView | null>((next, ticket) => !next || ticket.number < next.number ? ticket : next, null);
  const newestPending = tickets.filter((ticket) => ticket.status === "waiting" || ticket.status === "called").slice(0, 3);
  const stationNumbers = Array.from({ length: stationCount }, (_, index) => index + 1);

  return <section className="mt-5" aria-live="polite">
    <div className="grid gap-3 xl:grid-cols-4">
      <article className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 xl:col-span-2">
        <header className="mb-3 flex items-center justify-between gap-2"><h2 className="font-bold">{cashierCopy.previewProcessing}</h2><span className="rounded-full bg-[#e7f7f9] px-2.5 py-1 text-xs font-bold">{serving.length}</span></header>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {stationNumbers.map((number) => {
            const ticket = occupiedStations.get(number);
            return <div key={number} className={`rounded-xl border p-3 ${ticket ? "border-[#087e91]/20 bg-[#e7f7f9]" : "border-dashed border-black/20 bg-[#faf9f6]"}`}>
              <p className="text-xs font-bold uppercase tracking-wide text-[#69737d]">{ownerCopy.stationLabel.replace("{number}", String(number))}</p>
              {ticket ? <p className="mt-1 font-black">#{ticket.number} · {ticket.name}<span className="mt-0.5 block truncate text-sm font-medium text-[#58606b]">{ticket.service}</span></p> : <p className="mt-1 text-sm text-[#69737d]">{ownerCopy.stationEmpty}</p>}
            </div>;
          })}
        </div>
        {unassignedServing.length > 0 && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs font-semibold text-amber-900">{cashierCopy.unassignedServing} #{unassignedServing.map((ticket) => ticket.number).join(", #")}</p>}
      </article>

      <article className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
        <header className="mb-3 flex items-center justify-between gap-2"><h2 className="font-bold">{cashierCopy.previewWaiting}</h2><span className="rounded-full bg-[#fff4a8] px-2.5 py-1 text-xs font-bold">{waiting.length}</span></header>
        {nextWaiting ? <div className="rounded-xl bg-[#faf9f6] p-4"><p className="text-xs font-semibold text-[#69737d]">{ownerCopy.waiting}</p><p className="mt-1 text-xl font-black">#{nextWaiting.number} · {nextWaiting.name}</p><p className="mt-1 text-sm text-[#58606b]">{nextWaiting.service}</p></div> : <p className="rounded-xl bg-[#faf9f6] p-4 text-sm text-[#69737d]">{cashierCopy.previewEmpty}</p>}
      </article>

      <article className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
        <header className="mb-3 flex items-center justify-between gap-2"><h2 className="font-bold">{cashierCopy.previewNew}</h2><span className="rounded-full bg-[#f1f4f6] px-2.5 py-1 text-xs font-bold">{newestPending.length}</span></header>
        {newestPending.length ? <ol className="space-y-2">{newestPending.map((ticket) => <li key={ticket.id} className="flex items-center gap-3 rounded-xl bg-[#faf9f6] p-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#ffb332] font-black">{ticket.number}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{ticket.name}</strong><span className="block truncate text-xs text-[#69737d]">{ticket.service}</span></span><span className="shrink-0 text-[10px] font-bold text-[#58606b]">{statusLabel[ticket.status]}</span></li>)}</ol> : <p className="rounded-xl bg-[#faf9f6] p-4 text-sm text-[#69737d]">{cashierCopy.previewEmpty}</p>}
      </article>
    </div>
  </section>;
}
