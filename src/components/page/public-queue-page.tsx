import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createClientOnlyFn } from "@tanstack/react-start";
import { useRouter } from "@tanstack/react-router";
import { useI18n } from "../../i18n";
import type { PublicQueueTicket } from "../../server/queue/queue.types";
import { getQueueTicket, joinQueue } from "../../server/queue/queue.functions";
import { registerQueuePushToken } from "../../server/queue/queue.functions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const requestQueueMessagingTokenOnClient = createClientOnlyFn(async () => {
  const { requestQueueMessagingToken } = await import("../../lib/firebase/messaging.client");
  return requestQueueMessagingToken();
});

type OutletInfo = { id: string; name: string; slug: string; isOpen: boolean } | null;

export function PublicQueuePage({ outlet }: { outlet: OutletInfo }) {
  const { language, messages } = useI18n();
  const copy = messages.queue.public;
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!outlet) return;
    const form = new FormData(event.currentTarget);
    setBusy(true); setError(false);
    try {
      const result = await joinQueue({ data: { outlet: outlet.slug, name: String(form.get("name")), service: String(form.get("service")), language } });
      await router.navigate({ to: "/$locale/queue/$token", params: { locale: language, token: result.token } });
    } catch { setError(true); }
    finally { setBusy(false); }
  }

  if (!outlet) return <PublicQueueFrame><h1 className="text-2xl font-black">{copy.unavailable}</h1><p className="mt-3 text-sm leading-6">{copy.unavailableHelp}</p></PublicQueueFrame>;
  if (!outlet.isOpen) return <PublicQueueFrame><p className="text-xs font-black uppercase tracking-[.15em] text-[#087e91]">{outlet.name}</p><h1 className="mt-2 text-2xl font-black">{copy.closed}</h1><p className="mt-3 text-sm leading-6">{copy.closedHelp}</p></PublicQueueFrame>;

  return <PublicQueueFrame><p className="text-xs font-black uppercase tracking-[.15em] text-[#087e91]">{outlet.name}</p><h1 className="mt-2 text-3xl font-black">{copy.title}</h1><p className="mt-3 text-sm leading-6 text-[#58606b]">{copy.description}</p>
    <form onSubmit={submit} className="mt-6 grid gap-4"><label className="text-sm font-bold">{copy.name}<Input name="name" required maxLength={40} autoComplete="name" placeholder={copy.namePlaceholder} className="mt-2 min-h-12" /></label><label className="text-sm font-bold">{copy.service}<Input name="service" required minLength={2} maxLength={60} placeholder={copy.servicePlaceholder} className="mt-2 min-h-12" /></label>{error && <p role="alert" className="text-sm font-semibold text-red-700">{copy.error}</p>}<Button disabled={busy} className="min-h-12 w-full">{busy ? copy.submitting : copy.submit}</Button><p className="text-center text-xs text-[#69737d]">{copy.privacy}</p></form>
  </PublicQueueFrame>;
}

export function PublicQueueTicketPage({ initial, token }: { initial: PublicQueueTicket | null; token: string }) {
  const { messages } = useI18n();
  const copy = messages.queue.public;
  const [ticket, setTicket] = useState(initial);
  const [notificationBusy, setNotificationBusy] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [notificationError, setNotificationError] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => { void getQueueTicket({ data: { token } }).then(setTicket).catch(() => {}); }, 15_000);
    return () => clearInterval(timer);
  }, [token]);
  async function enableNotifications() {
    setNotificationBusy(true); setNotificationError(false);
    try {
      const fcmToken = await requestQueueMessagingTokenOnClient();
      if (!fcmToken) { setNotificationError(true); return; }
      await registerQueuePushToken({ data: { ticketToken: token, fcmToken } });
      setNotificationEnabled(true);
    } catch { setNotificationError(true); }
    finally { setNotificationBusy(false); }
  }
  if (!ticket) return <PublicQueueFrame><h1 className="text-2xl font-black">{copy.unavailable}</h1><p className="mt-3 text-sm leading-6">{copy.unavailableHelp}</p></PublicQueueFrame>;
  const status = copy.statuses[ticket.status];
  return <PublicQueueFrame><p className="text-xs font-black uppercase tracking-[.15em] text-[#087e91]">{ticket.outletName}</p><h1 className="mt-2 text-3xl font-black">{copy.ticketTitle}</h1><div className="mt-6 grid size-36 place-items-center border-[4px] border-black bg-[#ffb332] text-6xl font-black shadow-[6px_6px_0_#171b22]">{ticket.number}</div><div className="mt-7 space-y-4"><p><span className="block text-xs font-bold uppercase text-[#69737d]">{copy.serviceLabel}</span><span className="mt-1 block font-bold">{ticket.service}</span></p><p><span className="block text-xs font-bold uppercase text-[#69737d]">{copy.status}</span><span className="mt-1 block font-black">{status}</span></p></div><p className="mt-5 text-sm leading-6 text-[#58606b]">{copy.ticketHelp}</p>
    {ticket.status === "waiting" || ticket.status === "called" ? <section className="mt-6 border-t border-black/10 pt-4"><p className="text-sm font-semibold">{notificationEnabled ? copy.notificationsEnabled : copy.notifyPrompt}</p>{!notificationEnabled && <Button type="button" className="mt-3 min-h-11 w-full" disabled={notificationBusy} onClick={() => void enableNotifications()}>{notificationBusy ? copy.submitting : copy.enableNotifications}</Button>}{notificationError && <p role="alert" className="mt-2 text-xs font-semibold text-amber-800">{copy.notificationsUnavailable} {copy.notificationError}</p>}</section> : null}
  </PublicQueueFrame>;
}

function PublicQueueFrame({ children }: { children: ReactNode }) {
  return <main className="grid min-h-dvh place-items-center bg-[#fff4a8] px-4 py-8 text-[#171b22]"><section className="w-full max-w-md border-[4px] border-black bg-white p-6 shadow-[7px_7px_0_#000] sm:p-8">{children}</section></main>;
}
