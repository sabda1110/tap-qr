import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { OwnerCardOrderPage } from "../components/page/owner-card-order-page";
import { OrderLoadError } from "../components/page/order-load-error";
import { getOwnerEditableOrder } from "../server/orders/order-management.functions";
import { orderIdSchema } from "../server/orders/order.schemas";

export const Route = createFileRoute("/$locale/dashboard/user/edit-order")({
  validateSearch: z.object({ id: orderIdSchema }),
  loaderDeps: ({ search }) => ({ id: search.id }),
  loader: ({ deps }) => getOwnerEditableOrder({ data: deps }),
  shouldReload: true, component: OwnerEditRoute, errorComponent: OrderLoadError,
});

function OwnerEditRoute() { return <OwnerCardOrderPage {...Route.useLoaderData()} />; }
