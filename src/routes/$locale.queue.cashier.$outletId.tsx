import { createFileRoute } from "@tanstack/react-router";
import { QueueCashierPage } from "../components/page/queue-cashier-page";
import { getQueueCashier } from "../server/queue/queue.functions";

export const Route = createFileRoute("/$locale/queue/cashier/$outletId")({
  loader: async ({ params }) => {
    try {
      return await getQueueCashier({ data: { outletId: params.outletId } });
    } catch {
      return null;
    }
  },
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: () => {
    const initial = Route.useLoaderData();
    const queue = initial?.queue ?? null;
    return <QueueCashierPage outletId={Route.useParams().outletId} initialName={initial?.session.outletName ?? null} initialQueue={queue} />;
  },
});
