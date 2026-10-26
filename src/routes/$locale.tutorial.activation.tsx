import { createFileRoute } from "@tanstack/react-router";
import { ActivationTutorialPage } from "../components/page/activation-tutorial-page";

export const Route = createFileRoute("/$locale/tutorial/activation")({
  component: ActivationTutorialPage,
});
