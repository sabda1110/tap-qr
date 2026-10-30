import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "../../i18n";
import { ConsultationShell } from "../organisms/consultation-shell";
import { Button } from "../ui/button";

export function ConsultationLoading() {
  const { language, messages } = useI18n();
  return <ConsultationShell language={language} messages={messages}><p role="status" className="rounded-2xl border border-black/8 bg-white p-8 text-sm">{messages.consultation.loading}</p></ConsultationShell>;
}

export function ConsultationLoadError() {
  const { language, messages } = useI18n();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return <ConsultationShell language={language} messages={messages}><div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"><p>{messages.consultation.loadError}</p><Button variant="outline" className="mt-4 min-h-11 bg-white" disabled={pending} onClick={async () => { setPending(true); try { await router.invalidate(); } finally { setPending(false); } }}>{messages.consultation.refresh}</Button></div></ConsultationShell>;
}
