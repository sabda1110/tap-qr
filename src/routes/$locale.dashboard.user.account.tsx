import { createFileRoute, redirect } from "@tanstack/react-router";

import { AccountSettingsPage } from "../components/page/account-settings-page";
import { getCurrentAuthenticatedUser } from "../server/auth/auth.functions";

export const Route = createFileRoute("/$locale/dashboard/user/account")({
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
  component: AccountSettingsRoute,
});

function AccountSettingsRoute() {
  return <AccountSettingsPage profile={Route.useLoaderData()} />;
}
