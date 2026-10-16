import { createFileRoute } from "@tanstack/react-router";
import { OrderLookupPage } from "../components/page/order-lookup-page";

export const Route = createFileRoute("/$locale/orders/")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }, { name: "referrer", content: "no-referrer" }] }),
  component: OrderLookupPage,
});
