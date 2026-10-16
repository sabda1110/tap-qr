import { Link, useRouter } from "@tanstack/react-router";
import { Copy, MessageCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../../i18n";
import type { OrderSummary } from "../../server/orders/order.types";
import { OrderLayout } from "../layouts/order-layout";
import { OrderSummaryCard, orderWhatsAppUrl } from "../molecules/order-summary";
import { Button } from "../ui/button";
import { ToasterProvider, useToast } from "../ui/toaster";
import { OrderChangeRequests } from "../molecules/order-change-requests";

export function OrderTrackingPage(props: { order: OrderSummary | null; whatsappNumber: string | null }) {
  return <ToasterProvider><TrackingContent {...props} /></ToasterProvider>;
}

function TrackingContent({ order, whatsappNumber }: { order: OrderSummary | null; whatsappNumber: string | null }) {
  const { language, messages } = useI18n();
  const content = messages.orders;
  const router = useRouter();
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  return <OrderLayout language={language} messages={messages}><div className="mx-auto max-w-2xl">
    <h1 className="text-3xl font-bold tracking-tight">{content.trackTitle}</h1>
    {!order ? <p role="status" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">{content.notFound}</p> : <>
      <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
        <p className="text-sm leading-6 text-cyan-900">{content.trackHelp}</p>
        <Button variant="outline" className="mt-3 bg-white" onClick={async () => { try { await navigator.clipboard.writeText(window.location.origin + window.location.pathname); showToast(content.copied, "success"); } catch { showToast(content.copyFailed, "warning"); } }}><Copy aria-hidden="true" />{content.copyLink}</Button>
      </div>
      <div className="mt-5"><OrderSummaryCard order={order} messages={messages} language={language} timeline /></div>
      <section className="mt-5 rounded-2xl border border-black/8 bg-white p-5">
        <p className="text-sm leading-6 text-[#69737d]">{content.whatsappHelp}</p>
        {whatsappNumber ? <a href={orderWhatsAppUrl(order, whatsappNumber, messages)} target="_blank" rel="noreferrer" className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#172029] px-4 text-center text-sm font-bold text-white"><MessageCircle aria-hidden="true" className="size-5 shrink-0" />{content.whatsapp}</a> : <p className="mt-3 text-sm text-amber-800">{content.unavailable}</p>}
        <Button variant="outline" className="mt-3 w-full" disabled={refreshing} onClick={async () => { setRefreshing(true); try { await router.invalidate(); } catch { showToast(content.loadingError, "error"); } finally { setRefreshing(false); } }}><RefreshCw aria-hidden="true" />{content.refresh}</Button>
        <OrderChangeRequests order={order} number={whatsappNumber} content={content.management} />
      </section>
      <p className="mt-5 text-sm leading-6 text-[#69737d]">{content.signInHint}</p>
      <div className="mt-2 flex flex-wrap gap-4 text-sm font-bold text-[#087e91]"><Link to="/$locale/auth/$mode" params={{ locale: language, mode: "login" }} search={{ destination: "orders" }}>{content.signIn}</Link><Link to="/$locale/dashboard/user/orders" params={{ locale: language }}>{content.dashboard}</Link></div>
    </>}
  </div></OrderLayout>;
}
