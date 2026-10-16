import { createFileRoute } from "@tanstack/react-router";
import { OwnerCardOrderPage } from "../components/page/owner-card-order-page";
import { OrderLoadError } from "../components/page/order-load-error";
import { getOwnerCheckout } from "../server/orders/order.functions";

export const Route = createFileRoute("/$locale/dashboard/user/buy")({
  loader: () => getOwnerCheckout(),
  shouldReload: true,
  component: OwnerBuyRoute,
  errorComponent: OrderLoadError,
});

function OwnerBuyRoute() { return <OwnerCardOrderPage {...Route.useLoaderData()} />; }
