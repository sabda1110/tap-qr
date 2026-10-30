import { id } from "../../i18n/locales/id";
import { en } from "../../i18n/locales/en";
import { localizedSeo, pageMetadata, publicPageMetadata, serializeJsonLd } from "./metadata";
import { DEFAULT_SEO_ORIGIN, normalizeSeoOrigin, type SeoPage } from "./pages";
import { pageStructuredData } from "./structured-data";

export function getSeoOrigin() {
  return normalizeSeoOrigin(import.meta.env.VITE_SITE_URL || DEFAULT_SEO_ORIGIN);
}
export function publicPageHead(locale: string, page: SeoPage) {
  const language = locale === "en" ? "en" : "id";
  const pricing = (language === "en" ? en : id).pricing;
  const origin = getSeoOrigin();
  return {
    ...publicPageMetadata(origin, language, page, import.meta.env.VITE_SEO_NOINDEX === "true"),
    scripts: [{ type: "application/ld+json", children: serializeJsonLd(pageStructuredData(origin, language, page,
      page === "home" ? [pricing.pvcCard, pricing.acrylicBoard, pricing.businessBundle] : [])) }],
  };
}

export function outletProfileHead(locale: string, profile?: { name: string; slug: string; id: string; description: string | null; tagline: string | null } | null) {
  const copy = localizedSeo(locale);
  return pageMetadata(getSeoOrigin(), locale, {
    title: profile ? `${profile.name} | TapQR` : "TapQR",
    description: profile?.description || profile?.tagline || copy.profileDescription.replace("{name}", profile?.name ?? "TapQR"),
    path: profile ? `/p/${encodeURIComponent(profile.slug || profile.id)}` : "",
  }, !profile || import.meta.env.VITE_SEO_NOINDEX === "true");
}
