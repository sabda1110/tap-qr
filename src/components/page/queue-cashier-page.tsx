import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { createClientOnlyFn } from "@tanstack/react-start";
import { Bell, BellRing } from "lucide-react";
import { useI18n } from "../../i18n";
import { addQueueCashierWalkIn, getQueueCashier, getQueueCashierRevision, loginQueueCashier, logoutQueueCashier, registerQueueCashierPushToken, setQueueCashierAvailability, unregisterQueueCashierPushToken, updateQueueCashierTicket } from "../../server/queue/queue.functions";
import type { QueueStatus } from "../../server/queue/queue.schemas";
import type { QueueTicketView } from "../../server/queue/queue.types";
import { QueuePhoneField } from "../molecules/queue-phone-field";
import { QueueTicketRow } from "../organisms/queue-ticket-row";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ToasterProvider, useToast } from "../ui/toaster";

type QueueData = Awaited<ReturnType<typeof getQueueCashier>>["queue"];
type PermissionState = NotificationPermission | "unsupported" | "unknown";

const readNotificationPermissionOnClient = createClientOnlyFn(() => {
  if (typeof Notification === "undefined") return "unsupported" as const;
  return Notification.permission;
});
const requestNotificationPermissionOnClient = createClientOnlyFn(() => {
  if (typeof Notification === "undefined") return Promise.resolve("unsupported" as const);
  return Notification.permission === "granted" ? Promise.resolve("granted" as const) : Notification.requestPermission();
});
const getQueueMessagingTokenOnClient = createClientOnlyFn(async () => {
  const { requestQueueMessagingToken } = await import("../../lib/firebase/messaging.client");
  return requestQueueMessagingToken();
});
const listenForQueueMessagesOnClient = createClientOnlyFn(async (onMessage: (message: { title?: string; body?: string; url?: string }) => void) => {
  const { listenForQueueMessages } = await import("../../lib/firebase/messaging.client");
  return listenForQueueMessages(onMessage);
});

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
  const [permission, setPermission] = useState<PermissionState>("unknown");
  const [notificationBusy, setNotificationBusy] = useState(false);
  const [notificationsRegistered, setNotificationsRegistered] = useState(false);
  const [notificationError, setNotificationError] = useState(false);
  const revision = useRef(initialQueue?.revision ?? "");
  const cashierPushToken = useRef<string | null>(null);
  const seenTicketIds = useRef(new Set(initialQueue?.tickets.map((ticket) => ticket.id) ?? []));

  const updateQueueData = useCallback((queue: QueueData, announceNew = false) => {
    const newBookings = queue?.tickets.filter((ticket) => ticket.source === "online" && !seenTicketIds.current.has(ticket.id)) ?? [];
    if (announceNew && newBookings.length) {
      const newest = newBookings[newBookings.length - 1];
      showToast(copy.newTicketToast.replace("{number}", String(newest.number)), "info");
    }
    seenTicketIds.current = new Set(queue?.tickets.map((ticket) => ticket.id) ?? []);
    setData(queue);
  }, [copy.newTicketToast, showToast]);

  const refresh = useCallback(async (announceNew = false) => {
    const result = await getQueueCashier({ data: { outletId } });
    revision.current = result.queue?.revision ?? "";
    setOutletName(result.session.outletName);
    updateQueueData(result.queue, announceNew);
  }, [outletId, updateQueueData]);

  const connectNotifications = useCallback(async (requestPermission: boolean) => {
    setNotificationBusy(true);
    setNotificationError(false);
    try {
      const nextPermission = requestPermission
        ? await requestNotificationPermissionOnClient()
        : await readNotificationPermissionOnClient();
      setPermission(nextPermission);
      if (nextPermission !== "granted") return;
      const fcmToken = await getQueueMessagingTokenOnClient();
      if (!fcmToken) throw new Error("QUEUE_FCM_UNAVAILABLE");
      await registerQueueCashierPushToken({ data: { outletId, fcmToken } });
      cashierPushToken.current = fcmToken;
      setNotificationsRegistered(true);
    } catch {
      setNotificationError(true);
    } finally {
      setNotificationBusy(false);
    }
  }, [outletId]);

  useEffect(() => {
    if (!outletName) return;
    let active = true;
    void Promise.resolve(readNotificationPermissionOnClient()).then((currentPermission) => {
      if (!active) return;
      setPermission(currentPermission);
      if (currentPermission === "granted") void connectNotifications(false);
    }).catch(() => setPermission("unsupported"));
    return () => { active = false; };
  }, [connectNotifications, outletName]);

  useEffect(() => {
    if (!outletName || permission !== "granted" || !notificationsRegistered) return;
    let active = true;
    let unsubscribe: (() => void) | null = null;
    void listenForQueueMessagesOnClient(async (message) => {
      if (typeof window === "undefined" || !("Notification" in window) || Notification.permission !== "granted") return;
      const title = message.title || copy.newTicketNotificationTitle;
      const body = message.body || copy.newTicketNotificationBody.replace("{number}", "");
      const options: NotificationOptions = {
        body,
        tag: `tapqr-queue-cashier-${outletId}`,
        data: { url: message.url || window.location.pathname },
        requireInteraction: true,
      };
      const registration = await navigator.serviceWorker.getRegistration().catch(() => undefined);
      try {
        if (registration) await registration.showNotification(title, options);
        else new Notification(title, options);
      } catch { /* Queue polling still updates the latest-ticket panel. */ }
    }).then((stop) => {
      if (!active) { stop?.(); return; }
      unsubscribe = stop;
    }).catch(() => {});
    return () => { active = false; unsubscribe?.(); };
  }, [copy.newTicketNotificationBody, copy.newTicketNotificationTitle, notificationsRegistered, outletId, outletName, permission]);

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
        await refresh(true);
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
  }, [outletId, outletName, refresh]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true); setError(null);
    try {
      const result = await loginQueueCashier({ data: { outletId, pin: String(new FormData(form).get("pin")) } });
      form.reset(); setOutletName(result.outletName); await refresh();
    } catch (cause) {
      setError(cause instanceof Error && cause.message.includes("QUEUE_CASHIER_LOCKED") ? "locked" : "invalid");
    } finally { setBusy(false); }
  }

  async function addWalkIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    try {
      const values = new FormData(form);
      await addQueueCashierWalkIn({ data: { outletId, name: String(values.get("name")), service: String(values.get("service")), phone: String(values.get("phone")) } });
      form.reset(); showToast(ownerCopy.added, "success"); await refresh(true);
    } catch { showToast(ownerCopy.error, "error"); }
    finally { setBusy(false); }
  }

  async function toggleQueue() {
    if (!data) return;
    setBusy(true);
    try {
      await setQueueCashierAvailability({ data: { outletId, isOpen: !data.isOpen } });
      showToast(data.isOpen ? ownerCopy.closeSuccess : ownerCopy.openSuccess, "success"); await refresh(true);
    } catch { showToast(ownerCopy.error, "error"); }
    finally { setBusy(false); }
  }

  async function changeStatus(ticket: QueueTicketView, status: QueueStatus) {
    if (!data) return;
    setBusy(true);
    try {
      await updateQueueCashierTicket({ data: { outletId, dateKey: data.dateKey, ticketId: ticket.id, status } });
      showToast(ownerCopy.updated, "success"); await refresh(true);
    } catch { showToast(ownerCopy.error, "error"); }
    finally { setBusy(false); }
  }

  async function endShift() {
    setBusy(true);
    try {
      if (cashierPushToken.current) {
        await unregisterQueueCashierPushToken({ data: { outletId, fcmToken: cashierPushToken.current } }).catch(() => {});
      }
      await logoutQueueCashier();
      cashierPushToken.current = null;
      setNotificationsRegistered(false);
      setOutletName(null);
      setData(null);
    } finally { setBusy(false); }
  }

  if (!outletName) return <main className="grid min-h-dvh place-items-center bg-[#fff4a8] p-4"><form onSubmit={login} className="w-full max-w-sm border-4 border-black bg-white p-6 shadow-[7px_7px_0_#000]"><p className="text-xs font-black uppercase tracking-[.15em] text-[#087e91]">TapQR</p><h1 className="mt-2 text-2xl font-black">{copy.title}</h1><label className="mt-5 block text-sm font-bold">{copy.pinTitle}<Input name="pin" type="password" inputMode="numeric" pattern="[0-9]{4,6}" minLength={4} maxLength={6} required className="mt-2 min-h-12" placeholder={copy.pin} /></label>{error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error === "locked" ? copy.locked : copy.invalidPin}</p>}<Button type="submit" disabled={busy} className="mt-4 min-h-12 w-full">{busy ? copy.pinTitle : copy.login}</Button></form></main>;

  const statusLabel: Record<QueueStatus, string> = { waiting: ownerCopy.waiting, called: ownerCopy.called, serving: ownerCopy.serving, completed: ownerCopy.completed, no_show: ownerCopy.no_show, cancelled: ownerCopy.cancelled };
  const latestTicket = data?.tickets[data.tickets.length - 1];
  const waitingCount = data?.tickets.filter((ticket) => ticket.status === "waiting").length ?? 0;
  const notificationMessage = notificationsRegistered ? copy.notificationActive
    : permission === "denied" ? copy.notificationDenied
      : permission === "unsupported" ? copy.notificationUnsupported
        : permission === "granted" && notificationError ? copy.notificationError
        : copy.notificationPrompt;
  const canEnableNotifications = permission === "default" || permission === "unknown" || (permission === "granted" && (!notificationsRegistered || notificationError));

  return <main className="min-h-dvh bg-[#faf9f6] px-4 py-6 text-[#171b22] sm:px-6"><div className="mx-auto max-w-4xl">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.15em] text-[#087e91]">{copy.title}</p><h1 className="mt-1 text-2xl font-black">{outletName}</h1></div><Button type="button" variant="outline" disabled={busy} onClick={() => void endShift()}>{copy.logout}</Button></header>

    <section className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#087e91]/20 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5" aria-live="polite">
      <div className="flex min-w-0 items-start gap-3">
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${notificationsRegistered ? "bg-emerald-100 text-emerald-800" : "bg-[#e7f7f9] text-[#087e91]"}`}>
          {notificationsRegistered ? <BellRing aria-hidden="true" className="size-5" /> : <Bell aria-hidden="true" className="size-5" />}
        </span>
        <div className="min-w-0"><h2 className="font-bold">{copy.notificationTitle}</h2><p className="mt-1 text-sm leading-5 text-[#58606b]">{notificationMessage}</p>{notificationError && <p role="alert" className="mt-1 text-sm font-semibold text-amber-800">{copy.notificationError}</p>}</div>
      </div>
      {canEnableNotifications && <Button type="button" className="min-h-11 w-full shrink-0 sm:w-auto" disabled={notificationBusy} onClick={() => void connectNotifications(permission !== "granted")}>
        {notificationBusy ? copy.notificationEnabling : permission === "granted" ? copy.notificationRetry : copy.notificationAction}
      </Button>}
    </section>

    <div className="mt-4 flex flex-wrap items-center gap-3"><Button type="button" onClick={() => void toggleQueue()} disabled={busy}>{data?.isOpen ? ownerCopy.close : ownerCopy.open}</Button><Button type="button" variant="outline" disabled={busy} onClick={() => void refresh(true)}>{ownerCopy.refresh}</Button><p className="text-xs text-[#69737d]">{copy.autoRefresh}</p><p className="w-full text-xs text-[#69737d]">{ownerCopy.closeHelp}</p></div>

    <div className="mt-5 grid gap-3 sm:grid-cols-[0.7fr_1.3fr]">
      <section className="rounded-2xl border border-black/10 bg-[#fff4a8] p-5"><p className="text-xs font-black uppercase tracking-[.12em] text-[#58606b]">{ownerCopy.waiting}</p><p className="mt-1 text-4xl font-black tabular-nums">{waitingCount}</p></section>
      <section className="rounded-2xl border border-black/10 bg-white p-5" aria-live="polite"><p className="text-xs font-black uppercase tracking-[.12em] text-[#087e91]">{copy.latestTicket}</p>{latestTicket ? <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1"><span className="rounded-lg bg-[#ffb332] px-2.5 py-1 text-lg font-black">#{latestTicket.number}</span><span className="font-bold">{latestTicket.name}</span><span className="text-sm text-[#58606b]">· {latestTicket.service}</span><span className="text-xs text-[#69737d]">· {latestTicket.source === "online" ? ownerCopy.sourceOnline : ownerCopy.sourceWalkIn}</span></div> : <p className="mt-2 text-sm text-[#69737d]">{copy.noTicketsToday}</p>}</section>
    </div>

    <form onSubmit={addWalkIn} className="mt-5 grid gap-3 rounded-2xl border border-black/10 bg-white p-5"><h2 className="font-bold">{ownerCopy.walkInTitle}</h2><label className="text-sm font-bold">{ownerCopy.name}<Input name="name" required maxLength={40} placeholder={ownerCopy.namePlaceholder} className="mt-2" /></label><label className="text-sm font-bold">{ownerCopy.service}<Input name="service" required maxLength={60} placeholder={ownerCopy.servicePlaceholder} className="mt-2" /></label><QueuePhoneField name="phone" label={ownerCopy.phone} placeholder={ownerCopy.phonePlaceholder} help={ownerCopy.phoneHelp} warning={ownerCopy.phoneLeadingZeroWarning} /><Button type="submit" disabled={busy || !data?.isOpen} className="min-h-11 w-full">{busy ? ownerCopy.adding : ownerCopy.addWalkIn}</Button></form>

    <section className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="max-h-[60vh] overflow-y-auto overscroll-contain" aria-live="polite">
        <header className="sticky top-0 z-10 border-b border-black/10 bg-white/95 px-4 py-3 backdrop-blur"><div className="flex items-center justify-between gap-2"><h2 className="font-bold">{ownerCopy.queueList}</h2><span className="text-xs font-semibold text-[#69737d]">{waitingCount} {ownerCopy.waiting.toLowerCase()}</span></div>{latestTicket && <p className="mt-1 truncate text-xs text-[#58606b]">{copy.latestTicket}: <strong>#{latestTicket.number} · {latestTicket.name}</strong> — {latestTicket.service}</p>}</header>
        {data?.tickets.length ? data.tickets.map((ticket) => <QueueTicketRow key={ticket.id} ticket={ticket} label={statusLabel[ticket.status]} sourceLabel={ticket.source === "online" ? ownerCopy.sourceOnline : ownerCopy.sourceWalkIn} copy={ownerCopy} busy={busy} onStatus={(status) => void changeStatus(ticket, status)} />) : <p className="p-8 text-center text-sm text-[#69737d]">{ownerCopy.empty}</p>}
      </div>
    </section>
  </div></main>;
}
