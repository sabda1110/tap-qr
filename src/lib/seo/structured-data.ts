import { localizedSeo } from "./metadata";
import { normalizeSeoOrigin, seoPageUrl, type SeoLanguage, type SeoPage } from "./pages";

type Offer = { name: string; description: string; price: string };
export function pageStructuredData(origin: string, language: SeoLanguage, page: SeoPage, offers: Offer[] = []) {
  const base = normalizeSeoOrigin(origin);
  const content = localizedSeo(language);
  const canonical = seoPageUrl(base, language, page);
  const { title, description } = content.pages[page];
  const organizationId = `${base}/#organization`;
  const websiteId = `${base}/#website`;
  const organization = {
    "@type": "Organization", "@id": organizationId, name: "TapQR", url: base,
    logo: `${base}/icon-512.png`,
    description: content.pages.home.description,
    ...(offers.length ? { hasOfferCatalog: {
      "@type": "OfferCatalog", name: content.catalogName,
      itemListElement: offers.map((offer) => ({ "@type": "Offer", priceCurrency: "IDR",
        price: offer.price.replace(/[^0-9]/g, ""), url: `${seoPageUrl(base, language, "home")}#pricing`,
        itemOffered: { "@type": "Product", name: offer.name, description: offer.description },
      })),
    } } : {}),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...(page === "home" ? [organization, { "@type": "WebSite", "@id": websiteId, name: "TapQR", url: base,
        inLanguage: ["id", "en"], publisher: { "@id": organizationId } }] : []),
      { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: title, description,
        inLanguage: language, isPartOf: { "@id": websiteId }, about: { "@id": organizationId } },
      ...(page !== "home" ? [{ "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "TapQR", item: seoPageUrl(base, language, "home") },
        { "@type": "ListItem", position: 2, name: title, item: canonical },
      ] }] : []),
    ],
  };
}
