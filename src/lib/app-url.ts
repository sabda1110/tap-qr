/**
 * Resolves the application public base URL.
 * Defaults to "https://tap-qr.vercel.app".
 * Configurable via VITE_APP_URL (client/server), APP_ORIGIN, or process.env.VITE_APP_URL.
 */
export function getAppBaseUrl(): string {
  let envUrl: string | undefined;

  if (typeof import.meta !== "undefined" && import.meta.env) {
    envUrl = (import.meta.env.VITE_APP_URL as string | undefined) || (import.meta.env.VITE_PUBLIC_APP_URL as string | undefined);
  }

  if (!envUrl && typeof process !== "undefined" && process.env) {
    envUrl = process.env.VITE_APP_URL || process.env.APP_ORIGIN || process.env.APP_URL;
  }

  const raw = (envUrl && typeof envUrl === "string" ? envUrl.trim() : "") || "https://tap-qr.vercel.app";
  return raw.replace(/\/+$/, "");
}

/**
 * Constructs the canonical public card URL for QR codes and links.
 * E.g. "https://tap-qr.vercel.app/id/TQR-XXXX"
 */
export function getCardUrl(locale: string, cardId: string): string {
  const base = getAppBaseUrl();
  const cleanLocale = locale?.trim() || "id";
  const cleanId = encodeURIComponent(cardId?.trim() || "");
  return `${base}/${cleanLocale}/${cleanId}`;
}
