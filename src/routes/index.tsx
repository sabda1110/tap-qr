import { createFileRoute, redirect } from "@tanstack/react-router";
import { defaultLanguage } from "../i18n";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: "/$locale",
      params: { locale: defaultLanguage },
      replace: true,
    });
  },
});
