import { createFileRoute } from "@tanstack/react-router";

import { AdminCardMasterPage } from "../components/page/admin-card-master-page";
import { getAdminCardMaster } from "../server/cards/card.functions";

export const Route = createFileRoute("/$locale/dashboard/admin/cards")({
  shouldReload: true,
  loader: () => getAdminCardMaster({ data: { query: "" } }),
  component: AdminCardsRoute,
});

function AdminCardsRoute() {
  const { page, user } = Route.useLoaderData();
  return <AdminCardMasterPage initialPage={page} profile={user} />;
}
