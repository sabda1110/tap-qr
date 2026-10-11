import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { AdminCardMasterPage } from "../components/page/admin-card-master-page";
import { getAdminCardMaster } from "../server/cards/card.functions";
import { cardClaimFilterSchema } from "../server/cards/card.schemas";

const cardSearchSchema = z.object({
  query: z.string().trim().max(40).optional().default(""),
  status: cardClaimFilterSchema.optional().default("all"),
});

export const Route = createFileRoute("/$locale/dashboard/admin/cards")({
  validateSearch: cardSearchSchema,
  loaderDeps: ({ search }) => ({
    query: search.query ?? "",
    status: search.status ?? "all",
  }),
  shouldReload: true,
  loader: ({ deps }) =>
    getAdminCardMaster({
      data: { query: deps.query, status: deps.status },
    }),
  component: AdminCardsRoute,
});

function AdminCardsRoute() {
  const { page, user } = Route.useLoaderData();
  const search = Route.useSearch();
  return (
    <AdminCardMasterPage
      initialPage={page}
      initialQuery={search.query}
      initialStatus={search.status}
      profile={user}
    />
  );
}
