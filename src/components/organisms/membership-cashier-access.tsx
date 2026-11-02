import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Language, Messages } from "../../i18n";
import { changeOwnerCashierPin } from "../../server/membership/membership.functions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/toaster";

export function MembershipCashierAccess({ outletId, language, initialPinConfigured, content }: {
  outletId: string;
  language: Language;
  initialPinConfigured: boolean;
  content: Messages["membership"]["owner"];
}) {
  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);
  const [pinConfigured, setPinConfigured] = useState(initialPinConfigured);
  const cashierPath = `/${language}/cashier/${outletId}`;

  async function savePin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const pin = String(values.get("pin"));
    if (pin !== String(values.get("confirmPin"))) {
      showToast(content.pinMismatch, "warning");
      return;
    }
    setBusy(true);
    try {
      await changeOwnerCashierPin({ data: { outletId, pin } });
      form.reset();
      setPinConfigured(true);
      showToast(content.saved, "success");
    } catch {
      showToast(content.error, "error");
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${cashierPath}`);
      showToast(content.linkCopied, "success");
    } catch {
      showToast(content.error, "error");
    }
  }

  return <form onSubmit={savePin} className="rounded-2xl border border-black/10 bg-white p-5">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="font-bold">{content.pinTitle}</h2>
      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${pinConfigured ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
        {pinConfigured ? content.pinConfigured : content.pinNotConfigured}
      </span>
    </div>
    <p className="mt-2 text-xs leading-5 text-[#69737d]">{content.pinHelp}</p>
    <Input className="mt-3" name="pin" aria-label={content.newPin} required type="password" inputMode="numeric" autoComplete="new-password" minLength={6} maxLength={6} pattern="[0-9]{6}" placeholder={content.newPin} disabled={busy} />
    <Input className="mt-3" name="confirmPin" aria-label={content.confirmPin} required type="password" inputMode="numeric" autoComplete="new-password" minLength={6} maxLength={6} pattern="[0-9]{6}" placeholder={content.confirmPin} disabled={busy} />
    <Button type="submit" disabled={busy} variant="warning" className="mt-3 min-h-11 w-full">{content.changePin}</Button>
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      <Link to="/$locale/cashier/$outletId" params={{ locale: language, outletId }} target="_blank" className="flex min-h-11 items-center justify-center rounded-lg border border-black/10 px-3 text-center text-sm font-bold">{content.cashierLink}</Link>
      <Button type="button" variant="outline" className="min-h-11" onClick={() => void copyLink()}>{content.copyCashierLink}</Button>
    </div>
  </form>;
}
