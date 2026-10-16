import { createFileRoute } from "@tanstack/react-router";
import { OrdersDashboardPage } from "../components/page/orders-dashboard-page";
import { OrderLoadError } from "../components/page/order-load-error";
import { getOwnerOrders } from "../server/orders/order.functions";
import { orderListSchema } from "../server/orders/order.schemas";
import { z } from "zod";

export const Route = createFileRoute("/$locale/dashboard/user/orders")({
  validateSearch: orderListSchema.extend({ created: z.boolean().optional(), updated: z.boolean().optional() }),
  loaderDeps: ({ search }) => orderListSchema.parse(search),
  loader: ({ deps }) => getOwnerOrders({ data: deps }),
  shouldReload: true,
  component: OwnerOrdersRoute,
  errorComponent: OrderLoadError,
});

function OwnerOrdersRoute() {
  const { user, page, whatsappNumber } = Route.useLoaderData();
  return <OrdersDashboardPage profile={user} page={page} whatsappNumber={whatsappNumber} search={Route.useSearch()} />;
}
