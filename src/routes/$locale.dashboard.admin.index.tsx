import { createFileRoute, redirect } from "@tanstack/react-router";

import { AdminDashboardPage } from "../components/page/admin-dashboard-page";
import { getCurrentAuthenticatedUser } from "../server/auth/auth.functions";

export const Route = createFileRoute("/$locale/dashboard/admin/")({
  loader: async ({ params }) => {
    const user = await getCurrentAuthenticatedUser();
    if (!user) {
      throw redirect({
        to: "/$locale/auth/$mode",
        params: { locale: params.locale, mode: "login" },
        replace: true,
      });
    }

    if (user.role !== "admin") {
      throw redirect({
        to: "/$locale/dashboard/user",
        params: { locale: params.locale },
        replace: true,
      });
    }

    return user;
  },
  component: AdminDashboardIndexRoute,
});

function AdminDashboardIndexRoute() {
  return <AdminDashboardPage profile={Route.useLoaderData()} />;
}
