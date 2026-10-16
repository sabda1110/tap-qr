import { useI18n } from "../../i18n";

export function OrderLoadError() {
  const { messages } = useI18n();
  return <div role="alert" className="mx-auto my-12 max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{messages.orders.loadingError}</div>;
}
