import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/dashboard/admin/")({
  loader: async ({ params }) => {
    throw redirect({
      to: "/$locale/dashboard/admin/analytics",
      params: { locale: params.locale },
      replace: true,
    });
  },
});
