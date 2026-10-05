import { createFileRoute, redirect } from "@tanstack/react-router";

import { UserDashboardPage } from "../components/page/user-dashboard-page";
import { getCurrentAuthenticatedUser } from "../server/auth/auth.functions";

export const Route = createFileRoute("/$locale/dashboard/user/")({
  loader: async ({ params }) => {
    const user = await getCurrentAuthenticatedUser();
    if (!user) {
      throw redirect({
        to: "/$locale/auth/$mode",
        params: { locale: params.locale, mode: "login" },
        replace: true,
      });
    }

    return user;
  },
  component: UserDashboardIndexRoute,
});

function UserDashboardIndexRoute() {
  return <UserDashboardPage profile={Route.useLoaderData()} />;
}
