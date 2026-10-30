import assert from "node:assert/strict";
import { test } from "node:test";
import { buildRobots, buildSitemap, escapeXml, robotsResponse, sitemapResponse } from "./crawl";
import { localizedSeo, privateRobots, publicPageMetadata, serializeJsonLd } from "./metadata";
import { DEFAULT_SEO_ORIGIN, normalizeSeoOrigin, seoLanguages, seoPagePaths, seoPageUrl, type SeoPage } from "./pages";
import { pageStructuredData } from "./structured-data";
import { id } from "../../i18n/locales/id";

test("SEO origin stays on the explicit public domain and rejects local or unsafe configuration", () => {
  for (const value of [undefined, "", "http://localhost:3000", "https://localhost", "javascript:alert(1)", "https://user:password@example.com"]) {
    assert.equal(normalizeSeoOrigin(value), DEFAULT_SEO_ORIGIN);
  }
  assert.equal(normalizeSeoOrigin("https://www.tapqr.id/path?token=private#fragment"), "https://www.tapqr.id");
});

test("every sitemap URL has matching localized metadata, canonicals and reciprocal hreflang", () => {
  const sitemap = buildSitemap(DEFAULT_SEO_ORIGIN);
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  const titles = new Set<string>();
  for (const page of Object.keys(seoPagePaths) as SeoPage[]) for (const language of seoLanguages) {
    const head = publicPageMetadata(DEFAULT_SEO_ORIGIN, language, page);
    const canonical = seoPageUrl(DEFAULT_SEO_ORIGIN, language, page);
    assert.ok(urls.includes(canonical));
    assert.equal(head.links.find((link) => link.rel === "canonical")?.href, canonical);
    assert.equal(head.meta.find((meta) => meta.property === "og:url")?.content, canonical);
    assert.equal(head.meta.find((meta) => meta.name === "robots")?.content, "index, follow, max-image-preview:large");
    assert.equal(head.links.filter((link) => link.rel === "alternate").length, 3);
    assert.ok(head.links.some((link) => link.hrefLang === "x-default" && link.href === seoPageUrl(DEFAULT_SEO_ORIGIN, "id", page)));
    assert.ok(head.meta.some((meta) => meta.name === "description" && meta.content === localizedSeo(language).pages[page].description));
    titles.add(head.meta.find((meta) => meta.title)?.title ?? "");
  }
  assert.equal(urls.length, 8);
  assert.equal(new Set(urls).size, urls.length);
  assert.equal(titles.size, 8);
  assert.doesNotMatch(sitemap, /dashboard|orders|\/order<|auth|TQR-|token|lastmod/);
  assert.match(sitemap, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
  assert.doesNotMatch(sitemap, /xhtml:/);
});

test("robots and sitemap responses are crawlable and staging can disable indexing", () => {
  const robots = buildRobots(DEFAULT_SEO_ORIGIN);
  assert.match(robots, /Sitemap: https:\/\/www.tapqr.id\/sitemap.xml/);
  assert.match(robots, /Disallow: \/_serverFn\//);
  assert.doesNotMatch(robots, /Disallow: \/id\/dashboard/);
  assert.match(buildRobots(DEFAULT_SEO_ORIGIN, true), /Disallow: \/\n/);
  assert.equal(publicPageMetadata(DEFAULT_SEO_ORIGIN, "en", "home", true).meta.find((meta) => meta.name === "robots")?.content, privateRobots);
  assert.match(sitemapResponse(DEFAULT_SEO_ORIGIN).headers.get("Content-Type") ?? "", /application\/xml/);
  assert.match(robotsResponse(DEFAULT_SEO_ORIGIN).headers.get("Content-Type") ?? "", /text\/plain/);
  assert.equal(sitemapResponse(DEFAULT_SEO_ORIGIN, true).headers.get("X-Robots-Tag"), "noindex, nofollow");
  assert.equal(escapeXml(`<&"'>`), "&lt;&amp;&quot;&apos;&gt;");
});

test("JSON-LD uses real visible product prices and never invents reviews or ratings", () => {
  const schema = pageStructuredData(DEFAULT_SEO_ORIGIN, "id", "home", [id.pricing.pvcCard, id.pricing.acrylicBoard, id.pricing.businessBundle]);
  const serialized = serializeJsonLd(schema);
  const graph = JSON.parse(serialized)["@graph"];
  const organization = graph.find((node: { "@type": string }) => node["@type"] === "Organization");
  assert.deepEqual(organization.hasOfferCatalog.itemListElement.map((offer: { price: string }) => offer.price), ["79000", "69000", "499000"]);
  assert.equal(organization.url, DEFAULT_SEO_ORIGIN);
  assert.doesNotMatch(serialized, /aggregateRating|ratingValue|reviewCount|InStock/);
  const hostile = { name: "</script><script>alert('x')</script>" };
  assert.doesNotMatch(serializeJsonLd(hostile), /<\/script>/);
  assert.deepEqual(JSON.parse(serializeJsonLd(hostile)), hostile);
});
