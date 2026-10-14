import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { getCurrentAuthenticatedUser } from "../server/auth/auth.functions";

export const Route = createFileRoute("/$locale/dashboard/admin")({
  loader: async ({ params }) => {
    const user = await getCurrentAuthenticatedUser();
    if (!user || user.role !== "admin") {
      throw redirect({
        to: "/$locale/auth/$mode",
        params: { locale: params.locale, mode: "login" },
        replace: true,
      });
    }
    return user;
  },
  component: AdminDashboardLayoutRoute,
});

function AdminDashboardLayoutRoute() {
  return <Outlet />;
}
