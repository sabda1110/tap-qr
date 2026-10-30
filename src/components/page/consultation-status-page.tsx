import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { CalendarPlus, CheckCircle2, Clock3, Copy, MessageCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "../../i18n";
import { consultationDate, consultationText, consultationTime, downloadConsultationCalendar } from "../../lib/consultation-public";
import { cancelConsultation, getConsultationStatus } from "../../server/consultations/consultation.functions";
import { ConsultationShell } from "../organisms/consultation-shell";
import { AlertDialog } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useToast } from "../ui/toaster";

type StatusData = Awaited<ReturnType<typeof getConsultationStatus>>;

export function ConsultationStatusPage({ initial, token }: { initial: StatusData; token: string }) {
  const { language, messages } = useI18n();
  const content = messages.consultation;
  const router = useRouter();
  const hash = useRouterState({ select: (state) => state.location.hash });
  const { showToast } = useToast();
  const [data, setData] = useState(initial);
  const [cancelToken, setCancelToken] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const requestVersion = useRef(0);
  const refreshingRef = useRef(false);
  const pendingRef = useRef(false);
  const booking = data.booking;
  const lastStatus = useRef({ token, status: initial.booking?.status });

  useEffect(() => {
    const previous = lastStatus.current;
    if (previous.token === token && previous.status === "menunggu" && booking?.status === "dikonfirmasi") {
      showToast(content.confirmationToast, "success");
    }
    lastStatus.current = { token, status: booking?.status };
  }, [token, booking?.status, content.confirmationToast, showToast]);

  useEffect(() => { setData(initial); }, [initial]);
  useEffect(() => {
    const value = new URLSearchParams(hash.replace(/^#/, "")).get("cancel");
    setCancelToken(value && /^[a-f0-9]{64}$/.test(value) ? value : null);
  }, [hash]);

  const refresh = useCallback(async () => {
    if (refreshingRef.current || pendingRef.current || !/^[a-f0-9]{64}$/.test(token)) return;
    refreshingRef.current = true;
    setRefreshing(true);
    const version = requestVersion.current;
    try {
      const next = await getConsultationStatus({ data: { token } });
      if (version === requestVersion.current) { setData(next); setRefreshFailed(false); }
    } catch { if (version === requestVersion.current) setRefreshFailed(true); }
    finally { refreshingRef.current = false; setRefreshing(false); }
  }, [token]);

  useEffect(() => {
    const timer = window.setInterval(() => { void refresh(); }, 25_000);
    return () => { window.clearInterval(timer); requestVersion.current += 1; };
  }, [refresh]);

  const cancel = async () => {
    if (!cancelToken || pendingRef.current) return;
    setConfirmCancel(false);
    pendingRef.current = true;
    setPending(true);
    requestVersion.current += 1;
    try {
      const result = await cancelConsultation({ data: { token: cancelToken } });
      if (!result.success) { showToast(content.cancelError, "error"); return; }
      showToast(content.cancelSuccess, "success");
      try {
        await router.invalidate();
        setData(await getConsultationStatus({ data: { token } }));
        setRefreshFailed(false);
      } catch { setRefreshFailed(true); }
    } catch { showToast(content.cancelError, "error"); }
    finally { pendingRef.current = false; setPending(false); }
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); showToast(content.copied, "success"); }
    catch { showToast(content.copyFailed, "warning"); }
  };

  const active = booking?.status === "menunggu" || booking?.status === "dikonfirmasi";
  const confirmed = booking?.status === "dikonfirmasi";
  const reason = booking?.reason === "slotDeletedByAdmin" ? content.slotDeletedReason : booking?.reason === "confirmationExpired" ? content.automaticReason
    : booking?.reason === "cancelledByCustomer" ? content.customerReason
      : booking?.reason === "cancelledByAdmin" ? content.adminReason : booking?.reason;
  const whatsappText = booking ? consultationText(content.whatsappMessage, {
    name: booking.name, code: booking.code, date: consultationDate(booking.startAt, language), time: consultationTime(booking.startAt, language),
  }) : "";
  const notice = !booking ? "" : booking.status === "menunggu"
    ? consultationText(content.pendingNotice, { deadline: `${consultationDate(booking.deadlineAt, language)}, ${consultationTime(booking.deadlineAt, language)}` })
    : confirmed ? content.confirmedNotice : booking.status === "selesai" ? content.finishedNotice : content.cancelledNotice;

  return <ConsultationShell language={language} messages={messages}>
    <div className="mx-auto max-w-3xl">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#a46400]">{content.kicker}</p>
      <h1 className="text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">{content.statusTitle}</h1>
      {!booking ? <div className="mt-7 rounded-2xl border border-black/10 bg-white p-7"><p className="text-sm leading-7">{content.notFound}</p><Link to="/$locale/consultation" params={{ locale: language }} className="mt-5 inline-flex min-h-11 items-center font-bold text-[#8a5100] underline underline-offset-4">{content.rebook}</Link></div> : <>
        <section className="mt-7 overflow-hidden rounded-3xl border border-black/10 bg-white">
          <div className={`border-b border-black/8 px-5 py-6 sm:px-8 ${confirmed ? "bg-emerald-50" : active ? "bg-[#fff7e8]" : "bg-[#f3f5f7]"}`}>
            <p className={`inline-flex items-center gap-2 text-sm font-bold ${confirmed ? "text-emerald-800" : active ? "text-[#8a5100]" : "text-[#596570]"}`} aria-live="polite">{confirmed ? <CheckCircle2 aria-hidden="true" className="size-5" /> : <Clock3 aria-hidden="true" className="size-5" />}{content.statuses[booking.status]}</p>
            {confirmed && <h2 className="mt-3 text-xl font-bold text-emerald-900">{content.confirmationTitle}</h2>}
            <p className="mt-3 text-sm leading-7 text-[#596570]">{notice}</p>
            {booking.status === "menunggu" && <div className="mt-4 border-t border-[#ffb332]/30 pt-4">
              <h2 className="text-sm font-bold text-[#8a5100]">{content.confirmationHelpTitle}</h2>
              <p className="mt-1 text-sm leading-7 text-[#596570]">{content.confirmationHelp}</p>
            </div>}
          </div>
          <dl className="grid gap-6 p-5 sm:grid-cols-2 sm:p-8">
            <div><dt className="text-xs font-medium text-[#69737d]">{content.bookingCode}</dt><dd className="mt-2 break-all font-mono text-lg font-bold">{booking.code}</dd></div>
            <div><dt className="text-xs font-medium text-[#69737d]">{content.guestName}</dt><dd className="mt-2 break-words font-semibold">{booking.name}</dd></div>
            <div><dt className="text-xs font-medium text-[#69737d]">{content.schedule}</dt><dd className="mt-2 text-sm font-semibold leading-7">{consultationDate(booking.startAt, language)}<br />{consultationTime(booking.startAt, language)}–{consultationTime(booking.endAt, language)} WIB</dd></div>
            {booking.status === "menunggu" ? <div><dt className="text-xs font-medium text-[#69737d]">{content.deadline}</dt><dd className="mt-2 text-sm font-semibold leading-7">{consultationDate(booking.deadlineAt, language)}<br />{consultationTime(booking.deadlineAt, language)} WIB</dd></div> : null}
            {reason ? <div className="sm:col-span-2"><dt className="text-xs font-medium text-[#69737d]">{content.reason}</dt><dd className="mt-2 break-words text-sm leading-7">{reason}</dd></div> : null}
          </dl>
        </section>
        {refreshFailed ? <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{content.statusRefreshError}</p> : null}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {data.whatsappNumber ? <Button nativeButton={false} render={<a href={`https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noopener noreferrer" />} className="h-auto min-h-12 gap-2 whitespace-normal bg-[#172029] px-4 py-3"><MessageCircle aria-hidden="true" />{content.askAdmin}</Button> : null}
          <div><Button variant="outline" disabled={!confirmed || pending} onClick={() => downloadConsultationCalendar(booking, content)} className="min-h-12 w-full gap-2 px-4"><CalendarPlus aria-hidden="true" />{content.calendar}</Button>{!confirmed ? <p className="mt-2 text-xs leading-5 text-[#69737d]">{content.calendarHelp}</p> : null}</div>
        </div>
        <aside className="mt-6 rounded-2xl border border-[#0798ad]/15 bg-[#e7f6f8]/50 p-5">
          <p className="text-sm leading-7 text-[#45636b]">{content.privateLink}</p>
          <Button onClick={() => void copyLink()} variant="outline" className="mt-3 min-h-11 bg-white"><Copy aria-hidden="true" />{content.copyLink}</Button>
        </aside>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="outline" disabled={pending || refreshing} onClick={() => void refresh()} className="min-h-11"><RefreshCw aria-hidden="true" className={refreshing ? "motion-safe:animate-spin" : ""} />{refreshing ? content.refreshing : content.refreshStatus}</Button>
          {active && cancelToken ? <Button variant="destructive" disabled={pending} onClick={() => setConfirmCancel(true)} className="min-h-11">{pending ? content.cancelling : content.cancel}</Button> : null}
          {!active ? <Button nativeButton={false} render={<Link to="/$locale/consultation" params={{ locale: language }} />} variant="warning" className="min-h-11">{content.rebook}</Button> : null}
        </div>
        {active && !cancelToken ? <p className="mt-4 text-xs leading-6 text-[#69737d]">{content.cancelUnavailable}</p> : null}
        <p className="mt-5 text-xs leading-6 text-[#69737d]">{content.autoRefresh}</p>
        <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel} title={content.cancelTitle} description={content.cancelDescription} cancelLabel={content.keepBooking} confirmLabel={content.cancel} onConfirm={() => void cancel()} />
      </>}
    </div>
  </ConsultationShell>;
}
