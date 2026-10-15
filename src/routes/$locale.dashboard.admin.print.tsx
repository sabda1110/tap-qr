import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { AdminPrintPage } from "../components/page/admin-print-page";
import { getAdminPrintData } from "../server/print/admin-print.functions";

const printSearchSchema = z.object({
  cardId: z.string().optional(),
});

export const Route = createFileRoute("/$locale/dashboard/admin/print")({
  validateSearch: printSearchSchema,
  loaderDeps: ({ search }) => ({ cardId: search.cardId }),
  loader: ({ deps }) => getAdminPrintData({ data: { cardId: deps.cardId } }),
  component: AdminPrintRoute,
});

function AdminPrintRoute() {
  const { cards, initialCard, user } = Route.useLoaderData();
  return <AdminPrintPage cards={cards} initialCard={initialCard} profile={user} />;
}
