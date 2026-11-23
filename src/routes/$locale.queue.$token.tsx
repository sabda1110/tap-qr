import { createFileRoute } from "@tanstack/react-router";
import { PublicQueueTicketPage } from "../components/page/public-queue-page";
import { getQueueTicket } from "../server/queue/queue.functions";

export const Route = createFileRoute("/$locale/queue/$token")({
  loader: ({ params }) => getQueueTicket({ data: { token: params.token } }),
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }, { name: "referrer", content: "no-referrer" }] }),
  component: () => <PublicQueueTicketPage initial={Route.useLoaderData()} token={Route.useParams().token} />,
});
