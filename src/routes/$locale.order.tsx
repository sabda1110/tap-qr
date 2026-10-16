import { createFileRoute, redirect } from "@tanstack/react-router";
import { CardOrderPage } from "../components/page/card-order-page";
import { OrderLoadError } from "../components/page/order-load-error";
import { getOrderCheckout } from "../server/orders/order.functions";

export const Route = createFileRoute("/$locale/order")({
  loader: async ({ params }) => {
    const checkout = await getOrderCheckout();
    if (checkout.user?.role === "owner") throw redirect({ to: "/$locale/dashboard/user/buy", params: { locale: params.locale }, replace: true });
    return checkout;
  },
  shouldReload: true,
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: CheckoutRoute,
  errorComponent: OrderLoadError,
});

function CheckoutRoute() { return <CardOrderPage {...Route.useLoaderData()} />; }
