import type { ConsultationNotificationRecord, NotificationOutcome } from "./consultation-notification.types";

const titles = {
  new: "Booking konsultasi baru",
  cancelled: "Booking konsultasi dibatalkan",
  rescheduled: "Jadwal konsultasi diubah",
  reminder6: "Pengingat: tenggat konfirmasi dalam 6 jam",
  reminder1: "Pengingat: tenggat konfirmasi dalam 1 jam",
};

function singleLine(value: string | null | undefined, limit = 300) {
  return (value ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, " ").trim().slice(0, limit) || "—";
}

function dateTime(iso: string) {
  return `${new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta", dateStyle: "full", timeStyle: "short",
  }).format(new Date(iso))} WIB`;
}

function dashboardLink(bookingId: string) {
  try {
    const url = new URL(process.env.CONSULTATION_APP_URL ?? "");
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if ((url.protocol !== "https:" && !(local && url.protocol === "http:")) || url.username || url.password) return null;
    const dashboard = new URL("/id/dashboard/admin/consultations", url.origin);
    dashboard.searchParams.set("focus", bookingId);
    return dashboard.toString();
  } catch { return null; }
}

export function consultationNotificationText(record: ConsultationNotificationRecord) {
  const { booking, bookingId, event } = record;
  const dashboard = dashboardLink(bookingId);
  if (!dashboard) return null;
  const chatText = `Halo ${singleLine(booking.name, 100)}, terkait konsultasi TapQR ${singleLine(booking.code, 50)} pada ${dateTime(booking.startAt)}.`;
  const whatsapp = /^62\d{8,13}$/.test(booking.whatsapp) ? booking.whatsapp : "";
  return [
    titles[event],
    `Kode: ${singleLine(booking.code, 50)}`,
    `Mulai: ${dateTime(booking.startAt)}`,
    `Selesai: ${dateTime(booking.endAt)}`,
    `Nama: ${singleLine(booking.name, 100)}`,
    `WhatsApp: ${whatsapp || "—"}`,
    `Usaha: ${singleLine(booking.businessName, 120)}`,
    `Jenis usaha: ${singleLine(booking.businessType, 100)}`,
    `Catatan: ${singleLine(booking.notes)}`,
    `Status: ${singleLine(booking.status, 30)}`,
    `Alasan: ${singleLine(booking.reason)}`,
    `Tenggat konfirmasi: ${dateTime(booking.deadlineAt)}`,
    whatsapp ? `Chat pelanggan: https://wa.me/${whatsapp}?text=${encodeURIComponent(chatText)}` : "",
    `Dashboard: ${dashboard}`,
  ].filter(Boolean).join("\n");
}

async function postNotification(url: string, body: object, headers: HeadersInit): Promise<NotificationOutcome> {
  try {
    const response = await fetch(url, {
      method: "POST", headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body), signal: AbortSignal.timeout(5_000),
    });
    // Inspect only the success marker; never log provider bodies or thrown errors.
    if (!response.ok) return "rejected";
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object") return "rejected";
    return ("ok" in payload && payload.ok === true) || ("id" in payload && typeof payload.id === "string") ? "sent" : "rejected";
  } catch { return "unavailable"; }
}

export async function sendConsultationTelegram(record: ConsultationNotificationRecord): Promise<NotificationOutcome> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  const text = consultationNotificationText(record);
  if (!token || !/^\d+:[\w-]+$/.test(token) || !chatId || !text) return "not_configured";
  return postNotification(`https://api.telegram.org/bot${token}/sendMessage`, {
    chat_id: chatId, text, link_preview_options: { is_disabled: true },
  }, {});
}

export async function sendConsultationEmail(id: string, record: ConsultationNotificationRecord): Promise<NotificationOutcome> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipient = process.env.ADMIN_EMAIL?.trim();
  const text = consultationNotificationText(record);
  if (!apiKey || !recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient) || !text) return "not_configured";
  return postNotification("https://api.resend.com/emails", {
    from: process.env.EMAIL_FROM?.trim() || "onboarding@resend.dev", to: [recipient],
    subject: `[TapQR] ${titles[record.event]} · ${singleLine(record.booking.code, 50)}`, text,
  }, { Authorization: `Bearer ${apiKey}`, "Idempotency-Key": `consultation/${id}` });
}
