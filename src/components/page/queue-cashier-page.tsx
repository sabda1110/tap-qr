import { useEffect, useRef, useState, type FormEvent } from "react";
import { useI18n } from "../../i18n";
import { addQueueCashierWalkIn, getQueueCashier, getQueueCashierRevision, loginQueueCashier, logoutQueueCashier, setQueueCashierAvailability, updateQueueCashierTicket } from "../../server/queue/queue.functions";
import type { QueueStatus } from "../../server/queue/queue.schemas";
import type { QueueTicketView } from "../../server/queue/queue.types";
import { QueuePhoneField } from "../molecules/queue-phone-field";
import { QueueTicketRow } from "../organisms/queue-ticket-row";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ToasterProvider, useToast } from "../ui/toaster";

type QueueData = Awaited<ReturnType<typeof getQueueCashier>>["queue"];

export function QueueCashierPage({ outletId, initialName, initialQueue }: { outletId: string; initialName: string | null; initialQueue: QueueData | null }) {
  return <ToasterProvider><QueueCashierContent outletId={outletId} initialName={initialName} initialQueue={initialQueue} /></ToasterProvider>;
}

function QueueCashierContent({ outletId, initialName, initialQueue }: { outletId: string; initialName: string | null; initialQueue: QueueData | null }) {
  const { messages } = useI18n();
  const ownerCopy = messages.queue.owner;
  const copy = messages.queue.cashier;
  const { showToast } = useToast();
  const [outletName, setOutletName] = useState(initialName);
  const [data, setData] = useState(initialQueue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<"locked" | "invalid" | null>(null);
  const revision = useRef(initialQueue?.revision ?? "");

  async function refresh() {
    const result = await getQueueCashier({ data: { outletId } });
    revision.current = result.queue?.revision ?? "";
    setOutletName(result.session.outletName); setData(result.queue);
  }

  useEffect(() => {
    if (!outletName) return;
    let active = true;
    let checking = false;
    async function refreshIfChanged() {
      if (checking || document.visibilityState !== "visible") return;
      checking = true;
      try {
        const latestRevision = await getQueueCashierRevision({ data: { outletId } });
        if (!active || latestRevision === revision.current) return;
        const result = await getQueueCashier({ data: { outletId } });
        if (!active) return;
        revision.current = result.queue?.revision ?? "";
        setOutletName(result.session.outletName);
        setData(result.queue);
      } catch { /* A failed background check can retry on the next interval. */ }
      finally { checking = false; }
    }
    const interval = window.setInterval(() => { void refreshIfChanged(); }, 5_000);
    const onVisibilityChange = () => { if (document.visibilityState === "visible") void refreshIfChanged(); };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [outletId, outletName]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true); setError(null);
    try {
      const result = await loginQueueCashier({ data: { outletId, pin: String(new FormData(form).get("pin")) } });
      form.reset(); setOutletName(result.outletName); await refresh();
    } catch (cause) {
      setError(cause instanceof Error && cause.message.includes("QUEUE_CASHIER_LOCKED") ? "locked" : "invalid");
    }
    finally { setBusy(false); }
  }

  async function addWalkIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    try {
      const values = new FormData(form);
      await addQueueCashierWalkIn({ data: { outletId, name: String(values.get("name")), service: String(values.get("service")), phone: String(values.get("phone")) } });
      form.reset(); showToast(ownerCopy.added, "success"); await refresh();
    } catch { showToast(ownerCopy.error, "error"); }
    finally { setBusy(false); }
  }

  async function toggleQueue() {
    if (!data) return;
    setBusy(true);
    try {
      await setQueueCashierAvailability({ data: { outletId, isOpen: !data.isOpen } });
      showToast(data.isOpen ? ownerCopy.closeSuccess : ownerCopy.openSuccess, "success"); await refresh();
    } catch { showToast(ownerCopy.error, "error"); }
    finally { setBusy(false); }
  }

  async function changeStatus(ticket: QueueTicketView, status: QueueStatus) {
    if (!data) return;
    setBusy(true);
    try {
      await updateQueueCashierTicket({ data: { outletId, dateKey: data.dateKey, ticketId: ticket.id, status } });
      showToast(ownerCopy.updated, "success"); await refresh();
    } catch { showToast(ownerCopy.error, "error"); }
    finally { setBusy(false); }
  }

  if (!outletName) return <main className="grid min-h-dvh place-items-center bg-[#fff4a8] p-4"><form onSubmit={login} className="w-full max-w-sm border-4 border-black bg-white p-6 shadow-[7px_7px_0_#000]"><p className="text-xs font-black uppercase tracking-[.15em] text-[#087e91]">TapQR</p><h1 className="mt-2 text-2xl font-black">{copy.title}</h1><label className="mt-5 block text-sm font-bold">{copy.pinTitle}<Input name="pin" type="password" inputMode="numeric" pattern="[0-9]{4,6}" minLength={4} maxLength={6} required className="mt-2 min-h-12" placeholder={copy.pin} /></label>{error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error === "locked" ? copy.locked : copy.invalidPin}</p>}<Button type="submit" disabled={busy} className="mt-4 min-h-12 w-full">{busy ? copy.pinTitle : copy.login}</Button></form></main>;

  const statusLabel: Record<QueueStatus, string> = { waiting: ownerCopy.waiting, called: ownerCopy.called, serving: ownerCopy.serving, completed: ownerCopy.completed, no_show: ownerCopy.no_show, cancelled: ownerCopy.cancelled };
  return <main className="min-h-dvh bg-[#faf9f6] px-4 py-6 text-[#171b22] sm:px-6"><div className="mx-auto max-w-4xl"><header className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.15em] text-[#087e91]">{copy.title}</p><h1 className="mt-1 text-2xl font-black">{outletName}</h1></div><Button type="button" variant="outline" onClick={() => { void logoutQueueCashier().then(() => { setOutletName(null); setData(null); }); }}>{copy.logout}</Button></header>
    <div className="mt-5 flex flex-wrap items-center gap-3"><Button type="button" onClick={() => void toggleQueue()} disabled={busy}>{data?.isOpen ? ownerCopy.close : ownerCopy.open}</Button><Button type="button" variant="outline" disabled={busy} onClick={() => void refresh()}>{ownerCopy.refresh}</Button><p className="text-xs text-[#69737d]">{copy.autoRefresh}</p><p className="w-full text-xs text-[#69737d]">{ownerCopy.closeHelp}</p></div>
    <form onSubmit={addWalkIn} className="mt-5 grid gap-3 rounded-2xl border border-black/10 bg-white p-5"><h2 className="font-bold">{ownerCopy.walkInTitle}</h2><label className="text-sm font-bold">{ownerCopy.name}<Input name="name" required maxLength={40} placeholder={ownerCopy.namePlaceholder} className="mt-2" /></label><label className="text-sm font-bold">{ownerCopy.service}<Input name="service" required maxLength={60} placeholder={ownerCopy.servicePlaceholder} className="mt-2" /></label><QueuePhoneField name="phone" label={ownerCopy.phone} placeholder={ownerCopy.phonePlaceholder} help={ownerCopy.phoneHelp} warning={ownerCopy.phoneLeadingZeroWarning} /><Button type="submit" disabled={busy || !data?.isOpen} className="min-h-11 w-full">{busy ? ownerCopy.adding : ownerCopy.addWalkIn}</Button></form>
    <section className="mt-5 space-y-3" aria-live="polite">{data?.tickets.length ? data.tickets.map((ticket) => <QueueTicketRow key={ticket.id} ticket={ticket} label={statusLabel[ticket.status]} sourceLabel={ticket.source === "online" ? ownerCopy.sourceOnline : ownerCopy.sourceWalkIn} copy={ownerCopy} busy={busy} onStatus={(status) => void changeStatus(ticket, status)} />) : <p className="rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center text-sm text-[#69737d]">{ownerCopy.empty}</p>}</section>
  </div></main>;
}
