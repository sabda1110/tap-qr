import { createFileRoute } from "@tanstack/react-router";
import { sitemapResponse } from "../lib/seo/crawl";
import { getSeoOrigin } from "../lib/seo/head";

export const Route = createFileRoute("/sitemap.xml")({
  server: { handlers: { GET: () => sitemapResponse(getSeoOrigin(), import.meta.env.VITE_SEO_NOINDEX === "true") } },
});
