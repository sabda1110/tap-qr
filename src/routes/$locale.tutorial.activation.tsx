import { publicPageHead } from "../lib/seo/head";
import { createFileRoute } from "@tanstack/react-router";
import { ActivationTutorialPage } from "../components/page/activation-tutorial-page";

export const Route = createFileRoute("/$locale/tutorial/activation")({
  head: ({ params }) => publicPageHead(params.locale, "activationGuide"),
  component: ActivationTutorialPage,
});
