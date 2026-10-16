import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AdminOrderEditPage } from "../components/page/admin-order-edit-page";
import { OrderLoadError } from "../components/page/order-load-error";
import { getAdminEditableOrder } from "../server/orders/order-management.functions";
import { orderIdSchema } from "../server/orders/order.schemas";

export const Route = createFileRoute("/$locale/dashboard/admin/edit-order")({
  validateSearch: z.object({ id: orderIdSchema }), loaderDeps: ({ search }) => ({ id: search.id }),
  loader: ({ deps }) => getAdminEditableOrder({ data: deps }), shouldReload: true,
  component: AdminEditRoute, errorComponent: OrderLoadError,
});

function AdminEditRoute() { return <AdminOrderEditPage {...Route.useLoaderData()} />; }
