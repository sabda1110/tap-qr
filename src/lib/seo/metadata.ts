import { seoId } from "../../i18n/locales/seo-id";
import { seoEn } from "../../i18n/locales/seo-en";
import { normalizeSeoOrigin, seoLanguages, seoPagePaths, type SeoLanguage, type SeoPage } from "./pages";

export function localizedSeo(language: string) { return language === "en" ? seoEn : seoId; }
export const privateRobots = "noindex, nofollow, noarchive";
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

export function publicPageMetadata(origin: string, locale: string, page: SeoPage, noindex = false) {
  return pageMetadata(origin, locale, { ...localizedSeo(locale).pages[page], path: seoPagePaths[page] }, noindex);
}

export type SeoImage = { url: string; alt: string; width?: number; height?: number; type?: string; card?: "summary" | "summary_large_image" };

export function pageMetadata(origin: string, locale: string, page: { title: string; description: string; path: string; image?: SeoImage }, noindex = false) {
  const language: SeoLanguage = locale === "en" ? "en" : "id";
  const base = normalizeSeoOrigin(origin);
  const content = localizedSeo(language);
  const { title, description } = page;
  const url = (code: SeoLanguage) => `${base}/${code}${page.path}`;
  const canonical = url(language);
  const image: SeoImage = page.image ?? { url: `${base}/tapqr-social.webp`, alt: content.imageAlt, width: 1536, height: 1024, type: "image/webp" };
  return {
    meta: [
      { title }, { name: "description", content: description },
      { name: "robots", content: noindex ? privateRobots : "index, follow, max-image-preview:large" },
      { property: "og:type", content: "website" }, { property: "og:site_name", content: content.siteName },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { property: "og:locale", content: language === "id" ? "id_ID" : "en_US" },
      { property: "og:locale:alternate", content: language === "id" ? "en_US" : "id_ID" },
      { property: "og:image", content: image.url }, { property: "og:image:alt", content: image.alt },
      ...(image.type ? [{ property: "og:image:type", content: image.type }] : []),
      ...(image.width ? [{ property: "og:image:width", content: String(image.width) }] : []),
      ...(image.height ? [{ property: "og:image:height", content: String(image.height) }] : []),
      { name: "twitter:card", content: image.card ?? "summary_large_image" }, { name: "twitter:title", content: title },
      { name: "twitter:description", content: description }, { name: "twitter:image", content: image.url },
      { name: "twitter:image:alt", content: image.alt },
    ],
    links: [
      { rel: "canonical", href: canonical },
      ...seoLanguages.map((language) => ({ rel: "alternate", hrefLang: language, href: url(language) })),
      { rel: "alternate", hrefLang: "x-default", href: url("id") },
    ],
  };
}
