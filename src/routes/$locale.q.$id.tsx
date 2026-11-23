import { createFileRoute } from "@tanstack/react-router";
import { PublicQueuePage } from "../components/page/public-queue-page";
import { getQueueOutlet } from "../server/queue/queue.functions";

export const Route = createFileRoute("/$locale/q/$id")({
  loader: ({ params }) => getQueueOutlet({ data: { outlet: params.id } }),
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: () => <PublicQueuePage outlet={Route.useLoaderData()} />,
});
