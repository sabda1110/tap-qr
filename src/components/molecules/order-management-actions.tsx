import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "../../i18n";
import type { OrderDetail } from "../../server/orders/order.types";
import { canAdminEditOrder, canCancelOrder, canEditOrder } from "../../server/orders/order-policy";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "../../lib/utils";
import { OrderManagementDialog, type OrderManagementMode } from "./order-management-dialog";
import { OrderChangeRequests } from "./order-change-requests";

export function OrderManagementActions({ order, admin, whatsappNumber }: { order: OrderDetail; admin: boolean; whatsappNumber: string | null }) {
  const { language, messages } = useI18n();
  const content = messages.orders.management;
  const [mode, setMode] = useState<OrderManagementMode>();
  const actionClass = "h-auto min-h-11 whitespace-normal rounded-xl px-3 py-2 text-center text-xs leading-5";
  const terminal = ["cancelled", "completed"].includes(order.status);
  return <section className="mt-4 border-t border-black/8 pt-4">
    {order.cancellationReason && <p className="mb-3 text-xs leading-5 text-[#69737d]">{content.cancelReason}: {order.cancellationReason}</p>}
    <div className="grid gap-2 sm:grid-cols-2">
      {!admin && canEditOrder(order) && <Link to="/$locale/dashboard/user/edit-order" params={{ locale: language }} search={{ id: order.id }} className={cn(buttonVariants({ variant: "outline" }), actionClass)}>{content.edit}</Link>}
      {admin && canAdminEditOrder(order) && <Link to="/$locale/dashboard/admin/edit-order" params={{ locale: language }} search={{ id: order.id }} className={cn(buttonVariants({ variant: "outline" }), actionClass)}>{content.edit}</Link>}
      {admin && !order.archived && order.status === "shipped" && <Button className={actionClass} variant="outline" onClick={() => setMode("shipping")}>{content.correctShipping}</Button>}
      {admin && !order.archived && order.status !== "cancelled" && order.paymentStatus === "unpaid" && <Button className={actionClass} variant="outline" onClick={() => setMode("paid")}>{content.markPaid}</Button>}
      {admin && !order.archived && ["on_progress", "confirmed"].includes(order.status) && order.paymentStatus === "paid" && <Button className={actionClass} variant="outline" onClick={() => setMode("refunded")}>{content.refund}</Button>}
      {admin && !order.archived && order.status === "confirmed" && order.paymentStatus === "paid" && !order.productionStarted && <Button className={actionClass} variant="outline" onClick={() => setMode("production")}>{content.startProduction}</Button>}
      {canCancelOrder(order, admin) && <Button className={actionClass} variant="destructive" onClick={() => setMode("cancel")}>{content.cancel}</Button>}
      {admin && terminal && <Button className={actionClass} variant="outline" onClick={() => setMode(order.archived ? "restore" : "archive")}>{order.archived ? content.restore : content.archive}</Button>}
    </div>
    {admin && order.paymentStatus === "paid" && ["on_progress", "confirmed"].includes(order.status) && <p className="mt-3 text-xs leading-5 text-amber-800">{content.refundFirst}</p>}
    {!admin && !canEditOrder(order) && <OrderChangeRequests order={order} number={whatsappNumber} content={content} />}
    {mode && <OrderManagementDialog order={order} mode={mode} onClose={() => setMode(undefined)} />}
  </section>;
}
