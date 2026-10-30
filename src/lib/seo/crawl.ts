import { normalizeSeoOrigin, seoLanguages, seoPagePaths, seoPageUrl, type SeoPage } from "./pages";

export function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character]!);
}

/** Keep the sitemap allowlisted: never enumerate orders, card inventory, tokens or accounts. */
export function buildSitemap(origin: string) {
  const urls = (Object.keys(seoPagePaths) as SeoPage[]).flatMap((page) => seoLanguages.map((language) => {
    // Hreflang is already emitted in each HTML head; XHTML elements disable Chrome's XML tree viewer.
    return `  <url>\n    <loc>${escapeXml(seoPageUrl(origin, language, page))}</loc>\n  </url>`;
  }));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

export function buildRobots(origin: string, noindex = false) {
  // Let crawlers read noindex HTML on private routes; robots.txt is not access control.
  return `User-agent: *\n${noindex ? "Disallow: /" : "Allow: /\nDisallow: /api/\nDisallow: /_serverFn/"}\n\nSitemap: ${normalizeSeoOrigin(origin)}/sitemap.xml\n`;
}

export function sitemapResponse(origin: string, noindex = false) {
  return new Response(buildSitemap(origin), { headers: {
    "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600",
    ...(noindex ? { "X-Robots-Tag": "noindex, nofollow" } : {}),
  } });
}
export function robotsResponse(origin: string, noindex = false) {
  return new Response(buildRobots(origin, noindex), { headers: {
    "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600",
  } });
}
