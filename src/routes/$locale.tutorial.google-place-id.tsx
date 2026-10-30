import { publicPageHead } from "../lib/seo/head";
import { createFileRoute } from "@tanstack/react-router";

import { GooglePlaceIdTutorialPage } from "../components/page/google-place-id-tutorial-page";

export const Route = createFileRoute("/$locale/tutorial/google-place-id")({
  head: ({ params }) => publicPageHead(params.locale, "googlePlaceIdGuide"),
  component: GooglePlaceIdTutorialPage,
});
