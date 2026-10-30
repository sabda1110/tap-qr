import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Clock3, RefreshCw, CheckCircle2, Plus, ExternalLink } from "lucide-react";
import { useI18n } from "../../i18n";
import { useDashboardSession } from "../../hooks/use-dashboard-session";
import { useConsultationAdmin } from "../../hooks/use-consultation-admin";
import { consultationDateKey } from "../../lib/consultation-admin-view";
import { canBookSlot } from "../../server/consultations/consultation-policy";
import type { getAdminConsultations } from "../../server/consultations/consultation.functions";
import type { BookingStatus } from "../../server/consultations/consultation.types";
import { AdminDashboardLayout } from "../layouts/admin-dashboard-layout";
import { ConsultationBookingDialog } from "../molecules/consultation-booking-dialog";
import { ConsultationSlotForm } from "../molecules/consultation-slot-form";
import { ConsultationSettingsForm } from "../molecules/consultation-settings-form";
import { ConsultationBookingsTable } from "../organisms/consultation-bookings-table";
import { ConsultationSlotCalendar } from "../organisms/consultation-slot-calendar";
import { Button } from "../ui/button";
import { ToasterProvider } from "../ui/toaster";

export type ConsultationAdminSearch = { tab?: "bookings" | "slots" | "settings"; date?: string; status?: BookingStatus; focus?: string };
type Props = { initial: Awaited<ReturnType<typeof getAdminConsultations>>; search: ConsultationAdminSearch };

export function AdminConsultationsPage(props: Props) {
  return <ToasterProvider><ConsultationsContent {...props} /></ToasterProvider>;
}

function ConsultationsContent({ initial, search }: Props) {
  const { language, messages } = useI18n();
  const copy = messages.consultation.admin;
  const signOut = useDashboardSession(initial.user, language);
  const navigate = useNavigate();
  const waiting = initial.bookings.filter((booking) => booking.status === "menunggu").length;
  const { now, busy, refreshing, loadError, refresh, mutate } = useConsultationAdmin(initial.serverNow, waiting, copy);
  const [creating, setCreating] = useState(false);
  const [calendarDate, setCalendarDate] = useState<string>();
  const tab = search.tab ?? "bookings";
  const changeSearch = (next: ConsultationAdminSearch) => void navigate({ to: "/$locale/dashboard/admin/consultations", params: { locale: language }, search: next, replace: true });
  const bookings = initial.bookings.filter((booking) => (!search.date || consultationDateKey(booking.startAt) === search.date) && (!search.status || booking.status === search.status));
  const focusedBooking = initial.bookings.find((booking) => booking.id === search.focus);
  const stats = [
    { label: copy.pending, value: waiting, icon: Clock3, tone: "bg-[#fff3d8] text-[#8b5a00]" },
    { label: copy.confirmed, value: initial.bookings.filter((booking) => booking.status === "dikonfirmasi").length, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
    { label: copy.available, value: initial.slots.filter((slot) => canBookSlot(slot, initial.settings, now)).length, icon: CalendarDays, tone: "bg-[#e8f8fb] text-[#087e91]" },
  ];
  return <AdminDashboardLayout homeLabel={messages.header.brandHomeLabel} language={language} navigation={messages.adminDashboard.sidebar} onSignOut={() => void signOut()}>
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold tracking-widest text-[#087e91] uppercase">{copy.navigation}</p><h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{copy.title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#69737d]">{copy.description}</p></div><div className="flex flex-wrap gap-2"><Button disabled={busy} onClick={() => setCreating(true)}><Plus />{copy.wizard.create}</Button><Button variant="outline" disabled={busy || refreshing} onClick={() => void refresh()}><RefreshCw className={refreshing ? "animate-spin motion-reduce:animate-none" : ""} />{refreshing ? copy.refreshing : copy.refresh}</Button></div></header>
      <div className="my-6 grid gap-3 sm:grid-cols-3">{stats.map(({ label, value, icon: Icon, tone }) => <article key={label} className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white p-4"><span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="size-5" /></span><div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-[#69737d]">{label}</p></div></article>)}</div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#ffb332]/30 bg-[#fff8e9] p-5">
        <div className="max-w-xl"><h2 className="text-sm font-bold">{initial.slots.length ? copy.wizard.overview : copy.wizard.emptyTitle}</h2><p className="mt-1 text-sm leading-6 text-[#69737d]">{copy.wizard.emptyHelp}</p></div>
        <Button variant="outline" nativeButton={false} render={<Link to="/$locale/consultation" params={{ locale: language }} target="_blank" rel="noopener noreferrer" />}><ExternalLink />{copy.wizard.viewPublic}</Button>
      </div>
      <nav className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-black/8 bg-white p-2" aria-label={copy.navigation}>{(["bookings", "slots", "settings"] as const).map((value) => <Button key={value} variant={tab === value ? "default" : "ghost"} aria-current={tab === value ? "page" : undefined} disabled={busy} className="flex-1 sm:flex-none" onClick={() => changeSearch({ ...search, tab: value, focus: undefined })}>{copy.tabs[value]}{value === "bookings" && waiting > 0 && <span className="rounded-full bg-[#ffb332] px-2 py-0.5 text-[10px] font-bold text-[#172029]">{waiting}</span>}</Button>)}</nav>
      {loadError && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{copy.loadError}</p>}
      {tab === "bookings" && <ConsultationBookingsTable bookings={bookings} date={search.date} status={search.status} now={now} copy={copy} language={language} busy={busy} onFilter={(filter) => changeSearch({ ...filter, tab: "bookings" })} onSelect={(focus) => changeSearch({ ...search, focus })} />}
      {tab === "slots" && <section><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">{copy.wizard.calendarTitle}</h2><p className="mt-1 text-sm leading-6 text-[#69737d]">{copy.wizard.calendarHelp}</p></div><Button variant="outline" disabled={busy} onClick={() => setCreating(true)}><Plus />{copy.wizard.create}</Button></div><ConsultationSlotCalendar key={calendarDate} initialDate={calendarDate} slots={initial.slots} now={now} cutoffHours={initial.settings.batas_pemesanan_jam} language={language} copy={copy} busy={busy} mutate={mutate} /></section>}
      {creating && <ConsultationSlotForm copy={copy} language={language} now={now} settings={initial.settings} slots={initial.slots} busy={busy} mutate={mutate} onClose={() => setCreating(false)} onCreated={(date) => { setCalendarDate(date); setCreating(false); changeSearch({ tab: "slots" }); }} />}
      {tab === "settings" && <ConsultationSettingsForm key={JSON.stringify(initial.settings)} settings={initial.settings} copy={copy} busy={busy} mutate={mutate} />}
      {focusedBooking && <ConsultationBookingDialog key={focusedBooking.id} booking={focusedBooking} slots={initial.slots} cutoffHours={initial.settings.batas_pemesanan_jam} now={now} language={language} copy={copy} busy={busy} mutate={mutate} reasonLabels={{ confirmationExpired: messages.consultation.automaticReason, cancelledByCustomer: messages.consultation.customerReason, cancelledByAdmin: messages.consultation.adminReason }} onClose={() => changeSearch({ ...search, focus: undefined })} />}
    </div>
  </AdminDashboardLayout>;
}
