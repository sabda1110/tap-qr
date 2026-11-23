import { useState } from "react";
import type { Messages } from "../../i18n";
import type { OutletDetail } from "../../server/outlets/outlet.types";
import { saveAdminMembershipAddon } from "../../server/membership/membership.functions";
import { saveAdminQueueAddon } from "../../server/queue/queue.functions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/toaster";

function localDate(value: string | null | undefined) {
  if (!value) return "";
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp + 7 * 60 * 60 * 1000).toISOString().slice(0, 10) : "";
}

export function AdminMembershipAddonPanel({ outlet, content, onSaved }: {
  outlet: OutletDetail;
  content: Messages["adminDashboard"]["outlets"]["addons"];
  onSaved: () => Promise<void>;
}) {
  return <section className="mt-6 rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
    <h2 className="font-bold">{content.title}</h2>
    <p className="mt-1 max-w-2xl text-sm leading-6 text-[#69737d]">{content.description}</p>
    <div className="mt-5 grid gap-4 xl:grid-cols-2">
      <AddonAccessCard key={`${outlet.id}:membership`} kind="membership" outlet={outlet} copy={content.membership} save={saveAdminMembershipAddon} onSaved={onSaved} />
      <AddonAccessCard key={`${outlet.id}:queue`} kind="queue" outlet={outlet} copy={content.queue} save={saveAdminQueueAddon} onSaved={onSaved} />
    </div>
  </section>;
}

function AddonAccessCard({ kind, outlet, copy, save, onSaved }: {
  kind: "membership" | "queue";
  outlet: OutletDetail;
  copy: Messages["adminDashboard"]["outlets"]["addons"]["membership"];
  save: (args: { data: { outletId: string; enabled: boolean; expiresAt: string | null } }) => Promise<unknown>;
  onSaved: () => Promise<void>;
}) {
  const { showToast } = useToast();
  const addon = outlet[kind];
  const [enabled, setEnabled] = useState(addon?.enabled ?? false);
  const initialExpiry = localDate(addon?.expiresAt);
  const [expiresOn, setExpiresOn] = useState(initialExpiry);
  const [busy, setBusy] = useState(false);
  const active = addon?.isActive ?? false;
  const unchanged = enabled === (addon?.enabled ?? false) && expiresOn === initialExpiry;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const expiresAt = expiresOn ? new Date(`${expiresOn}T23:59:59.999+07:00`).toISOString() : null;
      await save({ data: { outletId: outlet.id, enabled, expiresAt } });
      showToast(enabled ? copy.enabledSuccess : copy.disabledSuccess, "success");
      await onSaved();
    } catch {
      showToast(copy.error, "error");
    } finally {
      setBusy(false);
    }
  }

  return <article className="rounded-xl border border-black/8 p-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h3 className="font-bold">{copy.title}</h3><p className="mt-1 text-sm leading-6 text-[#69737d]">{copy.description}</p></div>
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${active ? "bg-emerald-100 text-emerald-800" : addon?.enabled ? "bg-amber-100 text-amber-900" : "bg-black/6 text-[#69737d]"}`}>
        {active ? copy.active : addon?.enabled ? copy.expired : copy.inactive}
      </span>
    </div>
    <form className="mt-4 grid gap-3" onSubmit={submit}>
      <label className="flex min-h-12 items-center justify-between gap-4 rounded-xl border border-black/8 bg-[#f8fafc] px-4 text-sm font-semibold">
        {copy.enable}<input type="checkbox" checked={enabled} disabled={busy} onChange={(event) => setEnabled(event.target.checked)} className="size-5 accent-[#0798ad]" />
      </label>
      <label className="text-sm font-semibold">{copy.expiresAt}<Input type="date" className="mt-2" value={expiresOn} disabled={busy || !enabled} onChange={(event) => setExpiresOn(event.target.value)} /><span className="mt-1.5 block text-xs font-normal leading-5 text-[#69737d]">{copy.expiresAtHelp}</span></label>
      <Button type="submit" className="min-h-11 px-5" disabled={busy || unchanged}>{busy ? copy.saving : copy.save}</Button>
    </form>
  </article>;
}
