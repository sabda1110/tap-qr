import { createFileRoute, redirect } from "@tanstack/react-router";

import { HomePage } from "../components/page/home-page";
import { getOrderCheckout } from "../server/orders/order.functions";

export const Route = createFileRoute("/$locale/")({
  loader: async ({ params }) => {
    const { user, whatsappNumber } = await getOrderCheckout();
    if (user) {
      throw redirect({
        to: user.role === "admin" ? "/$locale/dashboard/admin" : "/$locale/dashboard/user",
        params: { locale: params.locale },
        replace: true,
      });
    }

    return { whatsappNumber };
  },
  component: HomeRoute,
});

function HomeRoute() {
  return <HomePage whatsappNumber={Route.useLoaderData().whatsappNumber} />;
}
