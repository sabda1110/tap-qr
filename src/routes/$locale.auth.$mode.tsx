import { createFileRoute, redirect } from "@tanstack/react-router";

import { AuthPage } from "../components/page/auth-page";
import type { AuthMode } from "../components/layouts/auth-layout";

function isAuthMode(value: string): value is AuthMode {
  return value === "login" || value === "register";
}

export const Route = createFileRoute("/$locale/auth/$mode")({
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
  return <AuthPage mode={isAuthMode(mode) ? mode : "login"} />;
}
