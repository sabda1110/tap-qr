import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AdminOutletsPage } from "../components/page/admin-outlets-page";
import { getAdminOutlets } from "../server/outlets/outlet.functions";
import { outletSearchSchema } from "../server/outlets/outlet.schemas";

export const Route = createFileRoute("/$locale/dashboard/admin/outlets")({
  validateSearch: outletSearchSchema.extend({ edit: z.boolean().optional() }),
  loaderDeps: ({ search }) => search,
  shouldReload: true,
  loader: ({ deps }) => getAdminOutlets({ data: deps }),
  component: AdminOutletsRoute,
});

function AdminOutletsRoute() {
  const { page, user, detail } = Route.useLoaderData();
  return (
    <AdminOutletsPage
      page={page}
      detail={detail}
      profile={user}
      search={Route.useSearch()}
    />
  );
}
