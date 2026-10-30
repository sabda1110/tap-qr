import { createFileRoute } from "@tanstack/react-router";
import { robotsResponse } from "../lib/seo/crawl";
import { getSeoOrigin } from "../lib/seo/head";

export const Route = createFileRoute("/robots.txt")({
  server: { handlers: { GET: () => robotsResponse(getSeoOrigin(), import.meta.env.VITE_SEO_NOINDEX === "true") } },
});
