import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useI18n } from "../../i18n";
import { saveOwnerQueueCashierPin } from "../../server/queue/queue.functions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/toaster";

export function QueueCashierAccess({ outletId, pinConfigured }: { outletId: string; pinConfigured: boolean }) {
  const { language, messages } = useI18n();
  const copy = messages.queue.owner;
  const { showToast } = useToast();
  const router = useRouter();
  const [configured, setConfigured] = useState(pinConfigured);
  const [busy, setBusy] = useState(false);
  const cashierPath = `/${language}/queue/cashier/${outletId}`;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const pin = String(form.get("pin"));
    if (!/^\d{4,6}$/.test(pin) || pin !== form.get("confirmPin")) { showToast(copy.pinMismatch, "error"); return; }
    setBusy(true);
    try {
      await saveOwnerQueueCashierPin({ data: { outletId, pin } });
      setConfigured(true);
      formElement.reset();
      showToast(copy.saved, "success");
      await router.invalidate();
    } catch { showToast(copy.error, "error"); }
    finally { setBusy(false); }
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(`${window.location.origin}${cashierPath}`); showToast(copy.copied, "success"); }
    catch { showToast(copy.error, "error"); }
  }

  return <form onSubmit={submit} className="rounded-2xl border border-black/10 bg-white p-5">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="font-bold">{copy.pinTitle}</h2>
      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${configured ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
        {configured ? copy.pinConfigured : copy.pinNotConfigured}
      </span>
    </div>
    <p className="mt-2 text-xs leading-5 text-[#69737d]">{copy.pinHelp}</p>
    <Input className="mt-3" name="pin" aria-label={copy.newPin} type="password" inputMode="numeric" autoComplete="new-password" minLength={4} maxLength={6} pattern="[0-9]{4,6}" placeholder={copy.newPin} required disabled={busy} />
    <Input className="mt-3" name="confirmPin" aria-label={copy.confirmPin} type="password" inputMode="numeric" autoComplete="new-password" minLength={4} maxLength={6} pattern="[0-9]{4,6}" placeholder={copy.confirmPin} required disabled={busy} />
    <Button type="submit" variant="warning" disabled={busy} className="mt-3 min-h-11 w-full">{busy ? copy.savingPin : copy.savePin}</Button>
    {configured && <div className="mt-3 grid gap-2 sm:grid-cols-2"><Link to="/$locale/queue/cashier/$outletId" params={{ locale: language, outletId }} target="_blank" className="flex min-h-11 items-center justify-center rounded-lg border border-black/10 px-3 text-center text-sm font-bold">{copy.openCashier}</Link><Button type="button" variant="outline" className="min-h-11" onClick={() => void copyLink()}>{copy.copyCashier}</Button></div>}
  </form>;
}
