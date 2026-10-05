import { createFileRoute, redirect } from "@tanstack/react-router";

import { HomePage } from "../components/page/home-page";
import { getCurrentAuthenticatedUser } from "../server/auth/auth.functions";

export const Route = createFileRoute("/$locale/")({
  loader: async ({ params }) => {
    const user = await getCurrentAuthenticatedUser();
    if (user) {
      throw redirect({
        to: "/$locale/dashboard/user",
        params: { locale: params.locale },
        replace: true,
      });
    }

    return null;
  },
  component: HomePage,
});
