import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { RefreshCw, ShoppingBag } from "lucide-react";
import { useI18n } from "../../i18n";
import type { UserProfile } from "../../lib/auth/user-profile";
import { useDashboardSession } from "../../hooks/use-dashboard-session";
import type { OrderList } from "../../server/orders/order.types";
import type { OrderListSearch } from "../../server/orders/order.schemas";
import { AdminDashboardLayout } from "../layouts/admin-dashboard-layout";
import { UserDashboardLayout } from "../layouts/user-dashboard-layout";
import { OrderSummaryCard, orderWhatsAppUrl } from "../molecules/order-summary";
import { OrderListControls } from "../molecules/order-list-controls";
import { Button, buttonVariants } from "../ui/button";
import { ToasterProvider, useToast } from "../ui/toaster";
import { cn } from "../../lib/utils";
import { OrderManagementActions } from "../molecules/order-management-actions";
import { AdminOrdersTable } from "../organisms/admin-orders-table";

type Props = { admin?: boolean; profile: UserProfile; page: OrderList; search: OrderListSearch & { created?: boolean; updated?: boolean }; whatsappNumber?: string | null };

export function OrdersDashboardPage(props: Props) {
  return <ToasterProvider><OrdersContent {...props} /></ToasterProvider>;
}

function OrdersContent({ admin = false, profile, page, search, whatsappNumber }: Props) {
  const { language, messages } = useI18n();
  const content = messages.orders;
  const signOut = useDashboardSession(profile, language);
  const navigate = useNavigate();
  const router = useRouter();
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const headerActionClass = "h-11 w-full gap-2 rounded-xl px-4 sm:w-44";
  const changeSearch = (search: OrderListSearch) => { void navigate({ to: admin ? "/$locale/dashboard/admin/orders" : "/$locale/dashboard/user/orders", params: { locale: language }, search }); };
  const wrap = (children: ReactNode) => admin ? <AdminDashboardLayout homeLabel={messages.header.brandHomeLabel} language={language} navigation={messages.adminDashboard.sidebar} onSignOut={() => void signOut()}>{children}</AdminDashboardLayout> : <UserDashboardLayout activeItem="orders" homeLabel={messages.header.brandHomeLabel} language={language} navigation={messages.userDashboard.sidebar} onSignOut={() => void signOut()}>{children}</UserDashboardLayout>;
  return wrap(<div className="mx-auto max-w-5xl">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{admin ? content.adminTitle : content.historyTitle}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#69737d]">{admin ? content.adminDescription : content.historyDescription}</p></div><div className="grid w-full gap-2 sm:w-auto sm:grid-flow-col">
      <Button variant="outline" className={headerActionClass} disabled={refreshing} onClick={async () => { setRefreshing(true); try { await router.invalidate(); } catch { showToast(content.loadingError, "error"); } finally { setRefreshing(false); } }}><RefreshCw aria-hidden="true" />{content.refresh}</Button>
      {!admin && <Link className={cn(buttonVariants(), headerActionClass)} to="/$locale/dashboard/user/buy" params={{ locale: language }}><ShoppingBag aria-hidden="true" className="size-4" />{content.buy}</Link>}
    </div></header>
    {!admin && search.created && <section role="status" className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900"><h2 className="text-sm font-bold">{content.created}</h2><p className="mt-2 text-sm leading-6">{content.ownerOrderCreated}</p><Button variant="outline" className="mt-3 bg-white" onClick={() => changeSearch({})}>{content.viewAllOrders}</Button></section>}
    {search.updated && <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">{content.management.saved}</p>}
    <OrderListControls search={search} onChange={changeSearch} admin={admin} />
    {!admin && !page.orders.length && <p className="rounded-2xl border border-black/8 bg-white p-6 text-sm text-[#69737d]">{content.empty}</p>}
    {admin ? <AdminOrdersTable key={JSON.stringify(search)} orders={page.orders} messages={messages} language={language} /> : <div className="grid items-start gap-5 xl:grid-cols-2">{page.orders.map((order) => <article key={`${order.id}-${order.revision}-${order.status}`} className="min-w-0">
      <OrderSummaryCard order={order} messages={messages} language={language} />
      <div className="mt-2 rounded-2xl border border-black/8 bg-white p-5"><h3 className="text-sm font-bold">{content.customer}</h3><p className="mt-2 break-words text-sm font-semibold">{order.customer.name}</p><p className="mt-1 break-all text-xs text-[#69737d]">{order.customer.email} · +{order.customer.phone}</p><p className="mt-2 break-words text-xs leading-5 text-[#69737d]">{[order.customer.address, order.customer.shippingRegion?.village, order.customer.shippingRegion?.district, order.customer.shippingRegion?.city, order.customer.shippingRegion?.province].filter(Boolean).join(", ")}</p>
        {whatsappNumber && <a className="mt-3 inline-block text-sm font-bold text-[#087e91]" href={orderWhatsAppUrl(order, whatsappNumber, messages)} target="_blank" rel="noreferrer">{content.whatsapp}</a>}
        <OrderManagementActions order={order} admin={false} whatsappNumber={whatsappNumber ?? null} />
      </div>
    </article>)}</div>}
    <nav className="mt-6 flex justify-between gap-3">{search.cursor ? <Button variant="outline" onClick={() => changeSearch({ status: search.status, code: search.code, archived: search.archived })}>{content.previous}</Button> : <span />}{page.nextCursor && <Button variant="outline" onClick={() => changeSearch({ ...search, cursor: page.nextCursor })}>{content.next}</Button>}</nav>
  </div>);
}
