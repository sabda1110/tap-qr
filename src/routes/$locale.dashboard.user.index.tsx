import { cardSearchSchema } from "../server/cards/card-entry.schemas";
import { createFileRoute, redirect } from "@tanstack/react-router";

import {
  UserDashboardPage,
  UserDashboardLoadError,
} from "../components/page/user-dashboard-page";
import { getCurrentAuthenticatedUser } from "../server/auth/auth.functions";
import { getUserDashboardOutlets } from "../server/outlets/user-outlet.functions";
import { getCardEntry } from "../server/cards/card-entry.functions";

export const Route = createFileRoute("/$locale/dashboard/user/")({
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

    const cardId = cardSearchSchema.parse(location.search).cardId;
    const [outlets, entry] = await Promise.all([
      getUserDashboardOutlets(),
      cardId ? getCardEntry({ data: { cardId } }) : Promise.resolve(null),
    ]);
    return {
      user,
      outlets,
      unclaimedCardId: entry?.kind === "unclaimed" ? cardId : undefined,
    };
  },
  component: UserDashboardIndexRoute,
  errorComponent: UserDashboardLoadError,
});

function UserDashboardIndexRoute() {
  const { user, outlets, unclaimedCardId } = Route.useLoaderData();
  return (
    <UserDashboardPage
      key={unclaimedCardId ?? "dashboard"}
      cardId={unclaimedCardId}
      profile={user}
      outlets={outlets}
    />
  );
}
