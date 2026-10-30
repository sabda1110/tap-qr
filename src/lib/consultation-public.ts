import type { Language, Messages } from "../i18n";

export function consultationDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-GB", { timeZone: "Asia/Jakarta", dateStyle: "full" }).format(new Date(value));
}

export function consultationTime(value: string, language: Language) {
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));
}

export function consultationDateKey(value: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
}

export function createConsultationToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function consultationText(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

export function downloadConsultationCalendar(booking: { code: string; startAt: string; endAt: string }, content: Messages["consultation"]) {
  const utc = (value: string) => new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const escape = (value: string) => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//TapQR//Consultation//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    `UID:${booking.code}@tapqr`, `DTSTAMP:${utc(new Date().toISOString())}`, `DTSTART:${utc(booking.startAt)}`, `DTEND:${utc(booking.endAt)}`,
    `SUMMARY:${escape(content.calendarTitle)}`, `DESCRIPTION:${escape(consultationText(content.calendarDescription, { code: booking.code }))}`, "END:VEVENT", "END:VCALENDAR", ""];
  const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${booking.code}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
