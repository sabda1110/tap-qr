import { createFileRoute } from "@tanstack/react-router";
import { GoogleReviewGuidePage } from "../components/page/google-review-guide-page";
import { publicPageHead } from "../lib/seo/head";

export const Route = createFileRoute("/$locale/tutorial/google-review")({
  head: ({ params }) => publicPageHead(params.locale, "googleReviewGuide"),
  component: GoogleReviewGuidePage,
});
