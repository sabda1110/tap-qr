import { useI18n } from "../../i18n";
import { OrderLayout } from "../layouts/order-layout";
import { PhoneOrderLookup } from "../organisms/phone-order-lookup";
import { ToasterProvider } from "../ui/toaster";

export function OrderLookupPage() {
  const { language, messages } = useI18n();
  return <ToasterProvider><OrderLayout language={language} messages={messages}><PhoneOrderLookup /></OrderLayout></ToasterProvider>;
}
