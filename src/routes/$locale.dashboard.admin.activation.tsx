import { createFileRoute } from "@tanstack/react-router";

import { AdminCardActivationPage } from "../components/page/admin-card-activation-page";
import { getAdminActivationSession } from "../server/activation/activation.functions";

export const Route = createFileRoute("/$locale/dashboard/admin/activation")({
  loader: () => getAdminActivationSession({ data: {} }),
  component: AdminActivationRoute,
});

function AdminActivationRoute() {
  return <AdminCardActivationPage profile={Route.useLoaderData()} />;
}
