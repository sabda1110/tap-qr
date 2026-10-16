import { createFileRoute } from "@tanstack/react-router";
import { OrderTrackingPage } from "../components/page/order-tracking-page";
import { OrderLoadError } from "../components/page/order-load-error";
import { getTrackedOrder } from "../server/orders/order.functions";
import { orderTokenSchema } from "../server/orders/order.schemas";

export const Route = createFileRoute("/$locale/orders/$token")({
  loader: ({ params }) => orderTokenSchema.safeParse(params.token).success ? getTrackedOrder({ data: { token: params.token } }) : { order: null, whatsappNumber: null },
  shouldReload: true,
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }, { name: "referrer", content: "no-referrer" }] }),
  component: TrackingRoute,
  errorComponent: OrderLoadError,
});

function TrackingRoute() { return <OrderTrackingPage {...Route.useLoaderData()} />; }
