import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "../../i18n";
import { useDashboardSession } from "../../hooks/use-dashboard-session";
import type { UserProfile } from "../../lib/auth/user-profile";
import type { CardMaterial } from "../../lib/firebase/firestore-schema";
import { UserDashboardLayout } from "../layouts/user-dashboard-layout";
import { CardOrderForm } from "../organisms/card-order-form";
import { ToasterProvider } from "../ui/toaster";
import type { OrderDetail } from "../../server/orders/order.types";
import { canEditOrder } from "../../server/orders/order-policy";

type Props = { user: UserProfile; whatsappNumber: string | null; order?: OrderDetail; initialMaterial?: CardMaterial };

export function OwnerCardOrderPage(props: Props) {
  return <ToasterProvider><OwnerCheckout {...props} /></ToasterProvider>;
}

function OwnerCheckout({ user, whatsappNumber, order, initialMaterial }: Props) {
  const { language, messages } = useI18n();
  const signOut = useDashboardSession(user, language);
  return (
    <UserDashboardLayout activeItem="orders" homeLabel={messages.header.brandHomeLabel} language={language}
      navigation={messages.userDashboard.sidebar} onSignOut={() => void signOut()}>
      <div className="mx-auto max-w-5xl">
        <Link to="/$locale/dashboard/user/orders" params={{ locale: language }} className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#087e91]">
          <ArrowLeft aria-hidden="true" className="size-4" />{messages.orders.backToOrders}
        </Link>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{order ? messages.orders.management.editTitle : messages.orders.buy}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#69737d]">{order ? `${order.code} · ${messages.orders.management.editDescription}` : messages.orders.ownerCheckoutDescription}</p>
        {order && !canEditOrder(order) ? <p role="status" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{messages.orders.management.locked}</p> : <CardOrderForm key={order?.id ?? initialMaterial ?? "default"} user={user} available={!!order || !!whatsappNumber} context="owner" editing={order} initialMaterial={initialMaterial} />}
      </div>
    </UserDashboardLayout>
  );
}
