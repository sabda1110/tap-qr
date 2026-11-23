import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useI18n } from "../../i18n";
import type { UserProfile } from "../../lib/auth/user-profile";
import type { OutletDetail } from "../../server/outlets/outlet.types";
import { addOwnerWalkInToQueue, getOwnerQueue, setOwnerQueueAvailability, setQueueStationCount, updateOwnerQueueTicket } from "../../server/queue/queue.functions";
import type { QueueStatus } from "../../server/queue/queue.schemas";
import type { QueueTicketView } from "../../server/queue/queue.types";
import { useDashboardSession } from "../../hooks/use-dashboard-session";
import { UserDashboardLayout } from "../layouts/user-dashboard-layout";
import { QueueCashierAccess } from "../organisms/queue-cashier-access";
import { QueueTicketRow } from "../organisms/queue-ticket-row";
import { QueueStationBoard } from "../organisms/queue-station-board";
import { QueuePhoneField } from "../molecules/queue-phone-field";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ToasterProvider, useToast } from "../ui/toaster";

type QueueData = Awaited<ReturnType<typeof getOwnerQueue>>;
type Props = { profile: UserProfile; outlets: OutletDetail[]; initial: QueueData | null; initialOutletId: string };

export function QueueDashboardPage(props: Props) {
  return <ToasterProvider><QueueDashboardContent {...props} /></ToasterProvider>;
}

function QueueDashboardContent({ profile, outlets, initial, initialOutletId }: Props) {
  const { language, messages } = useI18n();
  const copy = messages.queue.owner;
  const { showToast } = useToast();
  const router = useRouter();
  const signOut = useDashboardSession(profile, language);
  const activeOutlets = outlets.filter((outlet) => outlet.queue?.isActive);
  const [outletId, setOutletId] = useState(initialOutletId);
  const [data, setData] = useState<QueueData | null>(initial);
  const [busy, setBusy] = useState(false);

  async function refresh(id = outletId) {
    setBusy(true);
    try { setData(await getOwnerQueue({ data: { outletId: id } })); }
    catch { showToast(copy.error, "error"); }
    finally { setBusy(false); }
  }

  async function selectOutlet(id: string) { setOutletId(id); setData(null); await refresh(id); }

  async function addWalkIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    try {
      const values = new FormData(form);
      await addOwnerWalkInToQueue({ data: { outletId, name: String(values.get("name")), service: String(values.get("service")), phone: String(values.get("phone")) } });
      form.reset();
      showToast(copy.added, "success");
      await refresh(outletId);
      await router.invalidate();
    } catch { showToast(copy.error, "error"); }
    finally { setBusy(false); }
  }

  async function changeStatus(ticket: QueueTicketView, status: QueueStatus, stationNumber?: number) {
    setBusy(true);
    try {
      await updateOwnerQueueTicket({ data: { outletId, dateKey: data?.dateKey ?? "", ticketId: ticket.id, status, stationNumber } });
      showToast(copy.updated, "success");
      await refresh(outletId);
    } catch { showToast(copy.error, "error"); }
    finally { setBusy(false); }
  }

  async function changeStationCount(nextCount: number) {
    if (!data || nextCount < 1 || nextCount > 20 || nextCount === data.stationCount) return;
    setBusy(true);
    try {
      await setQueueStationCount({ data: { outletId, stationCount: nextCount } });
      await refresh(outletId);
      showToast(copy.updated, "success");
    } catch (cause) {
      if (cause instanceof Error && cause.message.includes("QUEUE_STATION_OCCUPIED")) showToast(copy.stationOccupiedError, "warning");
      else showToast(copy.error, "error");
    } finally { setBusy(false); }
  }

  async function toggleQueue() {
    if (!data) return;
    setBusy(true);
    try {
      await setOwnerQueueAvailability({ data: { outletId, isOpen: !data.isOpen } });
      showToast(data.isOpen ? copy.closeSuccess : copy.openSuccess, "success");
      await refresh(outletId);
    } catch { showToast(copy.error, "error"); }
    finally { setBusy(false); }
  }

  const statusLabel: Record<QueueStatus, string> = { waiting: copy.waiting, called: copy.called, serving: copy.serving, completed: copy.completed, no_show: copy.no_show, cancelled: copy.cancelled };
  const tickets = data?.tickets ?? [];
  const metrics = [
    [copy.waiting, tickets.filter((ticket) => ticket.status === "waiting").length],
    [copy.called, tickets.filter((ticket) => ticket.status === "called").length],
    [copy.serving, tickets.filter((ticket) => ticket.status === "serving").length],
  ] as const;
  const stationCount = data?.stationCount ?? 3;
  const occupiedStationNumbers = tickets.flatMap((ticket) => ticket.status === "serving" && ticket.stationNumber ? [ticket.stationNumber] : []);
  const occupiedStations = new Set(occupiedStationNumbers);
  const availableStations = Array.from({ length: stationCount }, (_, index) => index + 1).filter((number) => !occupiedStations.has(number));
  const highestOccupiedStation = Math.max(0, ...occupiedStations);
  return <UserDashboardLayout activeItem="queue" homeLabel={messages.header.brandHomeLabel} language={language} navigation={messages.userDashboard.sidebar} onSignOut={() => void signOut()}>
    <div className="mx-auto max-w-6xl">
      <header><p className="text-xs font-bold uppercase tracking-[.16em] text-[#087e91]">{copy.kicker}</p><h1 className="mt-2 text-3xl font-black">{copy.title}</h1><p className="mt-2 text-sm text-[#69737d]">{copy.description}</p></header>
      {!activeOutlets.length ? <p className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">{copy.noAddon}</p> : <>
        <div className="mt-6 flex flex-wrap items-end gap-3">
          <label className="block min-w-60 max-w-sm flex-1 text-sm font-bold">{copy.selectOutlet}<select value={outletId} onChange={(event) => void selectOutlet(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-3">{activeOutlets.map((outlet) => <option key={outlet.id} value={outlet.id}>{outlet.name}</option>)}</select></label>
          <Button type="button" variant={data?.isOpen ? "outline" : "default"} className="min-h-12" onClick={() => void toggleQueue()} disabled={busy || !data}>{data?.isOpen ? copy.close : copy.open}</Button>
          <Button type="button" variant="outline" className="min-h-12" onClick={() => void refresh()} disabled={busy}>{copy.refresh}</Button>
        </div>
        <p className="mt-2 text-xs text-[#69737d]">{copy.closeHelp}</p>
        {data ? <>
          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            {metrics.map(([label, value]) => <div key={label} className="border-2 border-black bg-white p-5 shadow-[3px_3px_0_#000]"><p className="text-sm font-bold">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div>)}
          </section>
          <section className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white p-4">
            <div><h2 className="font-bold">{copy.stationCountLabel}</h2><p className="mt-1 text-xs text-[#69737d]">{copy.stationCountHelp}</p></div>
            <div className="flex items-center gap-3"><Button type="button" variant="outline" aria-label={copy.stationCountDecrease} disabled={busy || stationCount <= Math.max(1, highestOccupiedStation)} onClick={() => void changeStationCount(stationCount - 1)}>−</Button><span className="min-w-20 text-center text-sm font-bold">{copy.stationCountValue.replace("{count}", String(stationCount))}</span><Button type="button" variant="outline" aria-label={copy.stationCountIncrease} disabled={busy || stationCount >= 20} onClick={() => void changeStationCount(stationCount + 1)}>+</Button></div>
          </section>
          <QueueStationBoard stationCount={stationCount} tickets={tickets} ownerCopy={copy} cashierCopy={messages.queue.cashier} statusLabel={statusLabel} />
          <div className="mt-7 grid items-start gap-6 xl:grid-cols-[1.5fr_1fr]">
            <section className="overflow-hidden rounded-2xl border border-black/10 bg-white" aria-live="polite">
              <div className="flex items-center justify-between gap-3 p-5"><h2 className="text-lg font-bold">{copy.queueList}</h2><span className="rounded-full bg-[#f1f4f6] px-2.5 py-1 text-xs font-bold">{tickets.length}</span></div>
              {tickets.length ? tickets.map((ticket) => <QueueTicketRow key={ticket.id} ticket={ticket} label={statusLabel[ticket.status]} sourceLabel={ticket.source === "online" ? copy.sourceOnline : copy.sourceWalkIn} copy={copy} busy={busy} availableStations={availableStations} onStatus={(status, stationNumber) => void changeStatus(ticket, status, stationNumber)} />) : <p className="border-t border-black/8 p-5 text-sm text-[#69737d]">{copy.empty}</p>}
            </section>
            <div className="grid gap-5">
              <form onSubmit={addWalkIn} className="rounded-2xl border border-black/10 bg-white p-5">
                <h2 className="font-bold">{copy.walkInTitle}</h2>
                <label className="mt-3 block text-sm font-bold">{copy.name}<Input name="name" required maxLength={40} placeholder={copy.namePlaceholder} className="mt-2" /></label>
                <label className="mt-3 block text-sm font-bold">{copy.service}<Input name="service" required minLength={2} maxLength={60} placeholder={copy.servicePlaceholder} className="mt-2" /></label>
                <div className="mt-3"><QueuePhoneField name="phone" label={copy.phone} placeholder={copy.phonePlaceholder} help={copy.phoneHelp} warning={copy.phoneLeadingZeroWarning} /></div>
                <Button type="submit" variant="warning" className="mt-4 min-h-11 w-full" disabled={busy || !data.isOpen}>{busy ? copy.adding : copy.addWalkIn}</Button>
              </form>
              <QueueCashierAccess key={outletId} outletId={outletId} pinConfigured={activeOutlets.find((outlet) => outlet.id === outletId)?.queue?.pinConfigured ?? false} />
            </div>
          </div>
        </> : busy ? <p className="mt-6 rounded-2xl border border-black/10 bg-white p-5 text-sm text-[#69737d]">{copy.loading}</p> : null}
      </>}
    </div>
  </UserDashboardLayout>;
}

