import { useNavigate, useRouter } from "@tanstack/react-router";
import { CalendarDays, Check, Clock3, MessageCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "../../i18n";
import { createConsultationToken } from "../../lib/consultation-public";
import { getConsultationAvailability, submitConsultation } from "../../server/consultations/consultation.functions";
import { ConsultationShell } from "../organisms/consultation-shell";
import { ConsultationScheduleStep } from "../organisms/consultation-schedule-step";
import { ConsultationScheduleSummary } from "../molecules/consultation-schedule-summary";
import { ConsultationDetailsForm, type ConsultationFormValues } from "../molecules/consultation-details-form";
import { Button } from "../ui/button";

type Availability = Awaited<ReturnType<typeof getConsultationAvailability>>;

export function ConsultationBookingPage({ initial }: { initial: Availability }) {
  const { language, messages } = useI18n();
  const content = messages.consultation;
  const navigate = useNavigate();
  const router = useRouter();
  const [availability, setAvailability] = useState(initial);
  const [requestedStep, setRequestedStep] = useState<0 | 1>(0);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [pending, setPending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshingRef = useRef(false);
  const tokens = useRef<{ statusToken: string; cancelToken: string } | null>(null);
  const availableDates = [...new Set(availability.slots.filter((slot) => slot.bookable).map((slot) => slot.date))].sort();
  const dateSlots = availability.slots.filter((slot) => slot.date === selectedDate);
  const selected = availability.slots.find((slot) => slot.id === selectedSlot && slot.bookable);
  const step = selected ? requestedStep : 0;
  const unavailableSelection = Boolean(selectedSlot && !selected);
  const changeStep = (next: 0 | 1) => {
    if (pending || (next === 1 && (!selected || refreshFailed || refreshing))) return;
    setRequestedStep(next);
    window.requestAnimationFrame(() => {
      stepHeading.current?.focus({ preventScroll: true });
      stepHeading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  };
  useEffect(() => {
    if (requestedStep === 1 && !selected) {
      setRequestedStep(0);
      stepHeading.current?.focus({ preventScroll: true });
    }
  }, [requestedStep, selected]);

  const refresh = useCallback(async () => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    setRefreshing(true);
    try { setAvailability(await getConsultationAvailability()); setRefreshFailed(false); }
    catch { setRefreshFailed(true); }
    finally { refreshingRef.current = false; setRefreshing(false); }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => { void refresh(); }, 25_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const submit = async (values: ConsultationFormValues) => {
    if (!selected || pending || step !== 1 || refreshFailed || refreshing) return;
    setPending(true);
    setError(null);
    tokens.current ??= { statusToken: createConsultationToken(), cancelToken: createConsultationToken() };
    try {
      const result = await submitConsultation({ data: { ...values, slotId: selected.id, ...tokens.current } });
      if (!result.success) {
        setError(content.errors[result.reason as keyof typeof content.errors] ?? content.errors.error);
        if (result.reason === "slotUnavailable") { setSelectedSlot(""); setRequestedStep(0); await refresh(); }
        return;
      }
      // A failed availability refresh must not hide an already saved booking.
      try { await router.invalidate(); } catch { /* The status route can retry its own loader. */ }
      await navigate({ to: "/$locale/consultation/$token", params: { locale: language, token: result.token }, hash: `cancel=${tokens.current.cancelToken}` });
    } catch { setError(content.errors.error); }
    finally { setPending(false); }
  };

  return <ConsultationShell language={language} messages={messages}>
    <div className="mb-8 max-w-3xl">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#a46400]">{content.kicker}</p>
      <h1 className="text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">{content.pageTitle}</h1>
      <p className="mt-4 text-sm leading-7 text-[#69737d] sm:text-base">{content.pageDescription}</p>
    </div>
    <ol aria-label={content.bookingFlow.navigation} className="mb-7 grid grid-cols-2 gap-2 sm:gap-4">
      {content.steps.map((label, index) => <li key={label} aria-current={step === index ? "step" : undefined} className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-4 text-center text-xs font-bold sm:flex-row sm:px-4 sm:text-left sm:text-sm ${index <= step ? "border-[#ffb332]/60 bg-[#fff7e8]" : "border-black/8 bg-white text-[#69737d]"}`}><span className={`grid size-7 shrink-0 place-items-center rounded-full ${index <= step ? "bg-[#ffb332] text-[#172029]" : "bg-gray-100"}`}>{index < step ? <Check className="size-4" /> : index + 1}</span>{label}</li>)}
    </ol>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <p className="flex items-center gap-2 text-xs font-medium text-[#69737d]"><Clock3 aria-hidden="true" className="size-4" />{content.timeZone}</p>
      <Button variant="outline" type="button" disabled={refreshing || pending} onClick={() => void refresh()} className="min-h-10"><RefreshCw aria-hidden="true" className={refreshing ? "motion-safe:animate-spin" : ""} />{refreshing ? content.refreshing : content.refresh}</Button>
    </div>
    {refreshFailed ? <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{content.refreshError}</p> : null}
    {!availableDates.length ? <section role="status" className="rounded-3xl border border-black/8 bg-white p-7 text-center sm:p-12">
      <CalendarDays aria-hidden="true" className="mx-auto mb-4 size-10 text-[#dc930e]" />
      <h2 className="mx-auto max-w-lg text-lg font-bold leading-8">{content.empty}</h2>
      {availability.whatsappNumber ? <a href={`https://wa.me/${availability.whatsappNumber}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#172029] px-5 text-sm font-bold text-white"><MessageCircle aria-hidden="true" className="size-4" />{content.contact}</a> : <p className="mt-3 text-sm text-[#69737d]">{content.noContact}</p>}
    </section> : null}
    {error && step === 0 ? <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}
    {unavailableSelection ? <p role="alert" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{content.errors.slotUnavailable}</p> : null}
    <div className="mx-auto max-w-4xl">
      <h2 ref={stepHeading} tabIndex={-1} className="scroll-mt-6 text-xl font-bold tracking-tight outline-none sm:text-2xl">
        {step === 0 ? content.bookingFlow.scheduleTitle : content.formTitle}
      </h2>
      <p className="mt-2 mb-6 text-sm leading-6 text-[#69737d]">
        {step === 0 ? content.bookingFlow.scheduleDescription : content.bookingFlow.detailsDescription}
      </p>
      {step === 0 && availableDates.length > 0 ? <ConsultationScheduleStep
        availableDates={availableDates} selectedDate={selectedDate} selected={selected} dateSlots={dateSlots}
        disabled={pending || refreshing || refreshFailed} language={language} content={content}
        onDateChange={(date) => { setSelectedDate(date); setSelectedSlot(""); setError(null); }}
        onSlotChange={(id) => { setSelectedSlot(id); setError(null); }} onNext={() => changeStep(1)}
      /> : null}
      {/* Keep the form mounted so going back or losing a slot preserves the draft. */}
      <section hidden={step !== 1} aria-label={content.formTitle} className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
        {selected ? <div className="mb-6">
          <ConsultationScheduleSummary slot={selected} language={language} content={content} details />
          <Button type="button" variant="outline" disabled={pending} onClick={() => changeStep(0)} className="mt-3 min-h-11">
            {content.bookingFlow.change}
          </Button>
        </div> : null}
        <ConsultationDetailsForm content={content} onSubmit={submit} disabled={step !== 1 || !selected || refreshing || refreshFailed}
          pending={pending} error={error} onBack={() => changeStep(0)} />
      </section>
    </div>
  </ConsultationShell>;
}
