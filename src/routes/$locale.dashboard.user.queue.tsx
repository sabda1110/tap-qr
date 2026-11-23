import { createFileRoute } from "@tanstack/react-router";
import { QueueDashboardPage } from "../components/page/queue-dashboard-page";
import { getCurrentAuthenticatedUser } from "../server/auth/auth.functions";
import { getUserDashboardOutlets } from "../server/outlets/user-outlet.functions";
import { getOwnerQueue } from "../server/queue/queue.functions";

export const Route = createFileRoute("/$locale/dashboard/user/queue")({
  loader: async () => {
    const [profile, outlets] = await Promise.all([getCurrentAuthenticatedUser(), getUserDashboardOutlets()]);
    if (!profile) throw new Error("AUTH_REQUIRED");
    const active = outlets.filter((outlet) => outlet.queue?.isActive).sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    const initialOutletId = active[0]?.id ?? "";
    const initial = initialOutletId ? await getOwnerQueue({ data: { outletId: initialOutletId } }) : null;
    return { profile, outlets, initial, initialOutletId };
  },
  component: () => <QueueDashboardPage {...Route.useLoaderData()} />,
});
