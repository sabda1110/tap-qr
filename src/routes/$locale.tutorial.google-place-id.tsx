import { createFileRoute } from "@tanstack/react-router";

import { GooglePlaceIdTutorialPage } from "../components/page/google-place-id-tutorial-page";

export const Route = createFileRoute("/$locale/tutorial/google-place-id")({
  component: GooglePlaceIdTutorialPage,
});
