import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "../../i18n";
import { Button } from "../ui/button";

export function AdminConsultationsLoading() {
  const { messages } = useI18n();
  return <p role="status" className="mx-auto my-10 max-w-3xl rounded-2xl border border-black/8 bg-white p-8 text-sm">{messages.consultation.admin.refreshing}</p>;
}

export function AdminConsultationsLoadError() {
  const { messages } = useI18n();
  const copy = messages.consultation.admin;
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return <div role="alert" className="mx-auto my-10 max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-sm text-red-800"><p>{copy.loadError}</p><Button className="mt-4 bg-white" variant="outline" disabled={pending} onClick={async () => { setPending(true); try { await router.invalidate(); } finally { setPending(false); } }}>{pending ? copy.refreshing : copy.retry}</Button></div>;
}
