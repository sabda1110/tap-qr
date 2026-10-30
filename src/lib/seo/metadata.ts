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

export function pageMetadata(origin: string, locale: string, page: { title: string; description: string; path: string }, noindex = false) {
  const language: SeoLanguage = locale === "en" ? "en" : "id";
  const base = normalizeSeoOrigin(origin);
  const content = localizedSeo(language);
  const { title, description } = page;
  const url = (code: SeoLanguage) => `${base}/${code}${page.path}`;
  const canonical = url(language);
  const image = `${base}/tapqr-social.webp`;
  return {
    meta: [
      { title }, { name: "description", content: description },
      { name: "robots", content: noindex ? privateRobots : "index, follow, max-image-preview:large" },
      { property: "og:type", content: "website" }, { property: "og:site_name", content: "TapQR" },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { property: "og:locale", content: language === "id" ? "id_ID" : "en_US" },
      { property: "og:locale:alternate", content: language === "id" ? "en_US" : "id_ID" },
      { property: "og:image", content: image }, { property: "og:image:alt", content: content.imageAlt },
      { property: "og:image:type", content: "image/webp" },
      { property: "og:image:width", content: "1536" }, { property: "og:image:height", content: "1024" },
      { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: title },
      { name: "twitter:description", content: description }, { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: content.imageAlt },
    ],
    links: [
      { rel: "canonical", href: canonical },
      ...seoLanguages.map((language) => ({ rel: "alternate", hrefLang: language, href: url(language) })),
      { rel: "alternate", hrefLang: "x-default", href: url("id") },
    ],
  };
}
