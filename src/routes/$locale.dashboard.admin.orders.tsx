import { createFileRoute } from "@tanstack/react-router";
import { OrdersDashboardPage } from "../components/page/orders-dashboard-page";
import { OrderLoadError } from "../components/page/order-load-error";
import { getAdminOrders } from "../server/orders/order.functions";
import { orderListSchema } from "../server/orders/order.schemas";
import { z } from "zod";

export const Route = createFileRoute("/$locale/dashboard/admin/orders")({
  validateSearch: orderListSchema.extend({ updated: z.boolean().optional() }),
  loaderDeps: ({ search }) => orderListSchema.parse(search),
  loader: ({ deps }) => getAdminOrders({ data: deps }),
  shouldReload: true,
  component: AdminOrdersRoute,
  errorComponent: OrderLoadError,
});

function AdminOrdersRoute() {
  const { user, page } = Route.useLoaderData();
  return <OrdersDashboardPage admin profile={user} page={page} search={Route.useSearch()} />;
}
