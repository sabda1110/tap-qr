import { Link } from "@tanstack/react-router";
import { useI18n } from "../../i18n";
import { useDashboardSession } from "../../hooks/use-dashboard-session";
import type { UserProfile } from "../../lib/auth/user-profile";
import type { OrderDetail } from "../../server/orders/order.types";
import { canAdminEditOrder } from "../../server/orders/order-policy";
import { AdminDashboardLayout } from "../layouts/admin-dashboard-layout";
import { CardOrderForm } from "../organisms/card-order-form";
import { ToasterProvider } from "../ui/toaster";

export function AdminOrderEditPage(props: { user: UserProfile; order: OrderDetail }) {
  return <ToasterProvider><AdminEditor {...props} /></ToasterProvider>;
}

function AdminEditor({ user, order }: { user: UserProfile; order: OrderDetail }) {
  const { language, messages } = useI18n();
  const signOut = useDashboardSession(user, language);
  return <AdminDashboardLayout homeLabel={messages.header.brandHomeLabel} language={language} navigation={messages.adminDashboard.sidebar} onSignOut={() => void signOut()}>
    <div className="mx-auto max-w-5xl">
      <Link to="/$locale/dashboard/admin/orders" params={{ locale: language }} className="mb-5 inline-flex min-h-11 items-center text-sm font-semibold text-[#087e91]">{messages.orders.adminOrders}</Link>
      <h1 className="text-2xl font-bold">{messages.orders.management.edit} · {order.code}</h1>
      {canAdminEditOrder(order) ? <CardOrderForm user={user} available context="admin" editing={order} /> : <p role="status" className="mt-5 text-sm text-amber-900">{messages.orders.management.locked}</p>}
    </div>
  </AdminDashboardLayout>;
}
