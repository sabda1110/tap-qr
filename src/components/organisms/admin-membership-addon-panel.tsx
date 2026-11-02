import { useState } from "react";
import type { Messages } from "../../i18n";
import type { OutletDetail } from "../../server/outlets/outlet.types";
import { saveAdminMembershipAddon } from "../../server/membership/membership.functions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/toaster";

function wibDateInput(value: string | null | undefined) {
  if (!value) return "";
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp + 7 * 60 * 60 * 1000).toISOString().slice(0, 10) : "";
}

export function AdminMembershipAddonPanel({ outlet, content, onSaved }: {
  outlet: OutletDetail;
  content: Messages["adminDashboard"]["outlets"]["addons"];
  onSaved: () => Promise<void>;
}) {
  const { showToast } = useToast();
  const [enabled, setEnabled] = useState(outlet.membership?.enabled ?? false);
  const initialExpiry = wibDateInput(outlet.membership?.expiresAt);
  const [expiresOn, setExpiresOn] = useState(initialExpiry);
  const [busy, setBusy] = useState(false);
  const unchanged = enabled === (outlet.membership?.enabled ?? false) && expiresOn === initialExpiry;
  const active = outlet.membership?.isActive ?? false;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const expiresAt = expiresOn ? new Date(`${expiresOn}T23:59:59.999+07:00`).toISOString() : null;
      await saveAdminMembershipAddon({ data: { outletId: outlet.id, enabled, expiresAt } });
      showToast(enabled ? content.enabledSuccess : content.disabledSuccess, "success");
      await onSaved();
    } catch {
      showToast(content.error, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold">{content.title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#69737d]">{content.description}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${active ? "bg-emerald-100 text-emerald-800" : outlet.membership?.enabled ? "bg-amber-100 text-amber-900" : "bg-black/6 text-[#69737d]"}`}>
          {active ? content.active : outlet.membership?.enabled ? content.expired : content.inactive}
        </span>
      </div>
      <form className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end" onSubmit={submit}>
        <label className="flex min-h-12 flex-1 items-center justify-between gap-4 rounded-xl border border-black/8 bg-[#f8fafc] px-4 text-sm font-semibold">
          {content.enable}
          <input type="checkbox" checked={enabled} disabled={busy} onChange={(event) => setEnabled(event.target.checked)} className="size-5 accent-[#0798ad]" />
        </label>
        <label className="text-sm font-semibold">{content.expiresAt}<Input type="date" className="mt-2" value={expiresOn} disabled={busy || !enabled} onChange={(event) => setExpiresOn(event.target.value)} /><span className="mt-1.5 block text-xs font-normal leading-5 text-[#69737d]">{content.expiresAtHelp}</span></label>
        <Button type="submit" className="min-h-11 px-5" disabled={busy || unchanged}>{busy ? content.saving : content.save}</Button>
      </form>
    </section>
  );
}
