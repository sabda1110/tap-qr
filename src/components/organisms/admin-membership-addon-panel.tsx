import { useState } from "react";
import type { Messages } from "../../i18n";
import type { OutletDetail } from "../../server/outlets/outlet.types";
import { saveAdminMembershipAddon } from "../../server/membership/membership.functions";
import { Button } from "../ui/button";
import { useToast } from "../ui/toaster";

export function AdminMembershipAddonPanel({ outlet, content, onSaved }: {
  outlet: OutletDetail;
  content: Messages["adminDashboard"]["outlets"]["addons"];
  onSaved: () => Promise<void>;
}) {
  const { showToast } = useToast();
  const [enabled, setEnabled] = useState(outlet.membership?.enabled ?? false);
  const [busy, setBusy] = useState(false);
  const unchanged = enabled === (outlet.membership?.enabled ?? false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await saveAdminMembershipAddon({ data: { outletId: outlet.id, enabled } });
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
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${outlet.membership?.enabled ? "bg-emerald-100 text-emerald-800" : "bg-black/6 text-[#69737d]"}`}>
          {outlet.membership?.enabled ? content.active : content.inactive}
        </span>
      </div>
      <form className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" onSubmit={submit}>
        <label className="flex min-h-12 flex-1 items-center justify-between gap-4 rounded-xl border border-black/8 bg-[#f8fafc] px-4 text-sm font-semibold">
          {content.enable}
          <input type="checkbox" checked={enabled} disabled={busy} onChange={(event) => setEnabled(event.target.checked)} className="size-5 accent-[#0798ad]" />
        </label>
        <Button type="submit" className="min-h-11 px-5" disabled={busy || unchanged}>{busy ? content.saving : content.save}</Button>
      </form>
    </section>
  );
}
