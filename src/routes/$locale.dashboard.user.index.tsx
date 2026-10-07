import { cardSearchSchema } from "../server/cards/card-entry.schemas";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { UserDashboardPage } from "../components/page/user-dashboard-page";
import { getCurrentAuthenticatedUser } from "../server/auth/auth.functions";

export const Route = createFileRoute("/$locale/dashboard/user/")({
  loader: async ({ params, location }) => {
    const user = await getCurrentAuthenticatedUser();
    if (!user) {
      throw redirect({
        to: "/$locale/auth/$mode",
        params: { locale: params.locale, mode: "login" },
        search: { cardId: cardSearchSchema.parse(location.search).cardId },
        replace: true,
      });
    }

    if (user.role === "admin" && !cardSearchSchema.parse(location.search).cardId) {
      throw redirect({
        to: "/$locale/dashboard/admin",
        params: { locale: params.locale },
        replace: true,
      });
    }

    return user;
  },
  component: UserDashboardIndexRoute,
});

function UserDashboardIndexRoute() {
  return <UserDashboardPage cardId={Route.useSearch().cardId} profile={Route.useLoaderData()} />;
}
