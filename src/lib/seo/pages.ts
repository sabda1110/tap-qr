export const DEFAULT_SEO_ORIGIN = "https://www.tapqr.id";
export const seoLanguages = ["id", "en"] as const;
export type SeoLanguage = typeof seoLanguages[number];
export const seoPagePaths = {
  home: "",
  consultation: "/consultation",
  activationGuide: "/tutorial/activation",
  googlePlaceIdGuide: "/tutorial/google-place-id",
} as const;
export type SeoPage = keyof typeof seoPagePaths;

/** SEO origin is explicit and independent of QR URLs or incoming Host headers. */
export function normalizeSeoOrigin(value?: string) {
  try {
    const url = new URL(value?.trim() || DEFAULT_SEO_ORIGIN);
    if (url.protocol !== "https:" || url.username || url.password ||
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || url.hostname.endsWith(".localhost")) return DEFAULT_SEO_ORIGIN;
    return url.origin;
  } catch { return DEFAULT_SEO_ORIGIN; }
}

export function seoPageUrl(origin: string, language: SeoLanguage, page: SeoPage) {
  return `${normalizeSeoOrigin(origin)}/${language}${seoPagePaths[page]}`;
}
