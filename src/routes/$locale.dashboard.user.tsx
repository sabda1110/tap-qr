import { cardSearchSchema } from "../server/cards/card-entry.schemas";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { getCurrentAuthenticatedUser } from "../server/auth/auth.functions";
import { getUserDashboardOutlets } from "../server/outlets/user-outlet.functions";
import { MembershipNavigationContext } from "../components/layouts/membership-navigation-context";

export const Route = createFileRoute("/$locale/dashboard/user")({
  validateSearch: cardSearchSchema,
  loaderDeps: ({ search }) => ({ cardId: search.cardId }),
  loader: async ({ params, location }) => {
    const user = await getCurrentAuthenticatedUser();
    if (!user) {
      throw redirect({
        to: "/$locale/auth/$mode",
        params: { locale: params.locale, mode: "login" },
        search: { cardId: cardSearchSchema.parse(location.search).cardId, destination: location.pathname.endsWith("/buy") ? "buy" : location.pathname.endsWith("/orders") ? "orders" : undefined },
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

    const outlets = await getUserDashboardOutlets();
    return { user, membershipEnabled: outlets.some((outlet) => outlet.membership?.isActive) };
  },
  component: UserDashboardLayoutRoute,
});

function UserDashboardLayoutRoute() {
  const { membershipEnabled } = Route.useLoaderData();
  return <MembershipNavigationContext.Provider value={membershipEnabled}><Outlet /></MembershipNavigationContext.Provider>;
}
