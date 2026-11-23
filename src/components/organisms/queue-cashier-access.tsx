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

  return <section className="mt-5 rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
    <h2 className="font-bold">{copy.cashierAccess}</h2><p className="mt-1 text-sm leading-6 text-[#69737d]">{copy.pinHelp}</p>
    <p className="mt-3 text-xs font-bold text-[#58606b]">{configured ? copy.pinConfigured : copy.pinNotConfigured}</p>
    <form onSubmit={submit} className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <label className="text-sm font-semibold">{copy.newPin}<Input className="mt-2" name="pin" type="password" inputMode="numeric" autoComplete="new-password" minLength={4} maxLength={6} pattern="[0-9]{4,6}" required /></label>
      <label className="text-sm font-semibold">{copy.confirmPin}<Input className="mt-2" name="confirmPin" type="password" inputMode="numeric" autoComplete="new-password" minLength={4} maxLength={6} pattern="[0-9]{4,6}" required /></label>
      <Button type="submit" disabled={busy} className="min-h-11">{busy ? copy.adding : copy.savePin}</Button>
    </form>
    {configured && <div className="mt-4 flex flex-wrap gap-2"><Link to="/$locale/queue/cashier/$outletId" params={{ locale: language, outletId }} target="_blank" className="inline-flex min-h-11 items-center rounded-lg bg-[#171b22] px-4 text-sm font-bold text-white no-underline">{copy.openCashier}</Link><Button type="button" variant="outline" onClick={() => void copyLink()}>{copy.copyCashier}</Button></div>}
  </section>;
}
