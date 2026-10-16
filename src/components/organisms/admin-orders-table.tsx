import { useState } from "react";
import { Eye, RotateCcw, Trash2 } from "lucide-react";
import type { Language, Messages } from "../../i18n";
import type { OrderDetail } from "../../server/orders/order.types";
import { Button } from "../ui/button";
import { OrderManagementDialog } from "../molecules/order-management-dialog";
import { AdminOrderDetailDialog } from "./admin-order-detail-dialog";

export function AdminOrdersTable({ orders, messages, language }: {
  orders: OrderDetail[]; messages: Messages; language: Language;
}) {
  const content = messages.orders;
  const [selectedId, setSelectedId] = useState<string>();
  const [deleteId, setDeleteId] = useState<string>();
  const selected = orders.find((order) => order.id === selectedId);
  const deleting = orders.find((order) => order.id === deleteId);
  const tones = {
    on_progress: "bg-amber-50 text-amber-800", confirmed: "bg-cyan-50 text-cyan-800",
    shipped: "bg-blue-50 text-blue-800", completed: "bg-emerald-50 text-emerald-800", cancelled: "bg-red-50 text-red-800",
  };
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-black/8 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">{content.adminTitle}</caption>
          <thead className="border-b border-black/8 bg-[#f7f9fb] text-xs font-semibold text-[#69737d]">
            <tr>
              <th scope="col" className="px-5 py-4">{content.management.transactionId}</th>
              <th scope="col" className="px-5 py-4">{content.phone}</th>
              <th scope="col" className="px-5 py-4">{content.status}</th>
              <th scope="col" className="px-5 py-4 text-right">{content.management.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/8">
            {!orders.length && <tr><td colSpan={4} className="px-5 py-8 text-center text-[#69737d]">{content.empty}</td></tr>}
            {orders.map((order) => {
              const terminal = order.status === "completed" || order.status === "cancelled";
              return (
                <tr key={order.id} className="hover:bg-[#f8fafc]">
                  <th scope="row" className="whitespace-nowrap px-5 py-4 font-semibold text-[#172029]">{order.code}</th>
                  <td className="whitespace-nowrap px-5 py-4 text-[#4f5964]">+{order.customer.phone}</td>
                  <td className="px-5 py-4"><span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${tones[order.status]}`}>{content.statuses[order.status]}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" className="h-10 gap-2 rounded-xl px-3" onClick={() => setSelectedId(order.id)} aria-label={`${content.management.detail} ${order.code}`}><Eye aria-hidden="true" />{content.management.detail}</Button>
                      <Button variant={order.archived ? "outline" : "destructive"} className="h-10 gap-2 rounded-xl px-3" disabled={!terminal}
                        title={!terminal ? content.management.deleteLocked : content.management.deleteDescription}
                        onClick={() => setDeleteId(order.id)} aria-label={`${order.archived ? content.management.restore : content.management.delete} ${order.code}`}>
                        {order.archived ? <RotateCcw aria-hidden="true" /> : <Trash2 aria-hidden="true" />}{order.archived ? content.management.restore : content.management.delete}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selected && <AdminOrderDetailDialog order={selected} messages={messages} language={language} onClose={() => setSelectedId(undefined)} />}
      {deleting && <OrderManagementDialog order={deleting} mode={deleting.archived ? "restore" : "delete"} onClose={() => setDeleteId(undefined)} />}
    </section>
  );
}
