import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/dashboard/admin")({
  component: AdminDashboardLayoutRoute,
});

function AdminDashboardLayoutRoute() {
  return <Outlet />;
}
