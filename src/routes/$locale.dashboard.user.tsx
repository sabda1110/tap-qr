import { cardSearchSchema } from "../server/cards/card-entry.schemas";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { getCurrentAuthenticatedUser } from "../server/auth/auth.functions";

export const Route = createFileRoute("/$locale/dashboard/user")({
  validateSearch: cardSearchSchema,
  loaderDeps: ({ search }) => ({ cardId: search.cardId }),
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

    if (
      user.role === "admin" &&
      !cardSearchSchema.parse(location.search).cardId
    ) {
      throw redirect({
        to: "/$locale/dashboard/admin",
        params: { locale: params.locale },
        replace: true,
      });
    }

    return user;
  },
  component: UserDashboardLayoutRoute,
});

function UserDashboardLayoutRoute() {
  return <Outlet />;
}
