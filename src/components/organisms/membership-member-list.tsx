import { useState } from "react";
import type { Language, Messages } from "../../i18n";
import { removeOwnerMember } from "../../server/membership/membership.functions";
import type { MemberView } from "../../server/membership/membership.types";
import { AlertDialog } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useToast } from "../ui/toaster";

export function MembershipMemberList({ outletId, members, targetVisits, language, content, onDeleted }: {
  outletId: string;
  members: MemberView[];
  targetVisits: number;
  language: Language;
  content: Messages["membership"]["owner"];
  onDeleted: () => Promise<void>;
}) {
  const { showToast } = useToast();
  const [selected, setSelected] = useState<MemberView | null>(null);
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!selected || busy) return;
    setBusy(true);
    try {
      await removeOwnerMember({ data: { outletId, memberId: selected.id } });
      setSelected(null);
      showToast(content.deleteSuccess, "success");
      await onDeleted();
    } catch {
      showToast(content.error, "error");
    } finally {
      setBusy(false);
    }
  }

  return <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
    <h2 className="p-5 text-lg font-bold">{content.list}</h2>
    {!members.length ? <p className="border-t border-black/8 p-5 text-sm text-[#69737d]">{content.empty}</p> : <div className="overflow-x-auto">
      <table className="w-full text-left text-sm"><thead className="bg-[#f5f7f8]"><tr><th className="p-3">Member</th><th className="p-3">{content.visits}</th><th className="p-3">{content.lastVisit}</th><th className="p-3"><span className="sr-only">{content.deleteMember}</span></th></tr></thead>
        <tbody>{members.map((member) => <tr key={member.id} className="border-t border-black/8"><td className="p-3"><b>{member.name}</b><br/><span className="text-xs text-[#69737d]">{member.maskedPhone} · {member.currentStamps}/{targetVisits}</span></td><td className="p-3">{member.totalVisits}</td><td className="p-3 text-xs">{member.lastVisitedAt ? new Date(member.lastVisitedAt).toLocaleDateString(language) : "—"}</td><td className="p-3 text-right"><Button type="button" size="sm" variant="destructive" onClick={() => setSelected(member)}>{content.deleteMember}</Button></td></tr>)}</tbody>
      </table>
    </div>}
    <AlertDialog open={Boolean(selected)} onOpenChange={(open) => { if (!open && !busy) setSelected(null); }} title={content.deleteTitle} description={content.deleteDescription} cancelLabel={content.deleteCancel} confirmLabel={content.deleteConfirm} onConfirm={() => void remove()} />
  </section>;
}
