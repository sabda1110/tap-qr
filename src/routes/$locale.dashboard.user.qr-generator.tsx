import { createFileRoute, redirect } from "@tanstack/react-router";

import { QrGeneratorPage } from "../components/page/qr-generator-page";
import { getCurrentAuthenticatedUser } from "../server/auth/auth.functions";

export const Route = createFileRoute("/$locale/dashboard/user/qr-generator")({
  loader: async ({ params }) => {
    const user = await getCurrentAuthenticatedUser();
    if (!user) {
      throw redirect({
        to: "/$locale/auth/$mode",
        params: { locale: params.locale, mode: "login" },
        replace: true,
      });
    }

    if (user.role === "admin") {
      throw redirect({
        to: "/$locale/dashboard/admin",
        params: { locale: params.locale },
        replace: true,
      });
    }

    return user;
  },
  component: QrGeneratorRoute,
});

function QrGeneratorRoute() {
  return <QrGeneratorPage profile={Route.useLoaderData()} />;
}
