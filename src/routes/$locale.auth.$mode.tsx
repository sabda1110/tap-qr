import { cardSearchSchema } from "../server/cards/card-entry.schemas";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { AuthPage } from "../components/page/auth-page";
import type { AuthMode } from "../components/layouts/auth-layout";

function isAuthMode(value: string): value is AuthMode {
  return value === "login" || value === "register";
}

export const Route = createFileRoute("/$locale/auth/$mode")({
  validateSearch: cardSearchSchema,
  beforeLoad: ({ params }) => {
    if (!isAuthMode(params.mode)) {
      throw redirect({
        to: "/$locale/auth/$mode",
        params: { locale: params.locale, mode: "login" },
        replace: true,
      });
    }
  },
  component: AuthRoute,
});

function AuthRoute() {
  const { mode } = Route.useParams();
  return <AuthPage cardId={Route.useSearch().cardId} mode={isAuthMode(mode) ? mode : "login"} />;
}
