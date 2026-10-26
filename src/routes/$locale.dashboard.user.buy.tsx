import { createFileRoute } from "@tanstack/react-router";
import { OwnerCardOrderPage } from "../components/page/owner-card-order-page";
import { OrderLoadError } from "../components/page/order-load-error";
import { getOwnerCheckout } from "../server/orders/order.functions";
import { checkoutSearchSchema } from "../lib/validation/checkout-search";

export const Route = createFileRoute("/$locale/dashboard/user/buy")({
  validateSearch: checkoutSearchSchema,
  loader: () => getOwnerCheckout(),
  shouldReload: true,
  component: OwnerBuyRoute,
  errorComponent: OrderLoadError,
});

function OwnerBuyRoute() { return <OwnerCardOrderPage {...Route.useLoaderData()} initialMaterial={Route.useSearch().material} />; }
