import { useI18n } from "../../i18n";
import type { UserProfile } from "../../lib/auth/user-profile";
import { OrderLayout } from "../layouts/order-layout";
import { CardOrderForm } from "../organisms/card-order-form";
import { ToasterProvider } from "../ui/toaster";

export function CardOrderPage({ user, whatsappNumber }: { user: UserProfile | null; whatsappNumber: string | null }) {
  const { language, messages } = useI18n();
  return <ToasterProvider><OrderLayout language={language} messages={messages}>
    <h1 className="text-3xl font-bold tracking-tight">{messages.orders.title}</h1>
    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#69737d]">{messages.orders.description}</p>
    <CardOrderForm user={user} available={!!whatsappNumber} />
  </OrderLayout></ToasterProvider>;
}
