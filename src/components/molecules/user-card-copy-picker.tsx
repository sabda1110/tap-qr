import { useEffect, useState } from "react";

import type { Messages } from "../../i18n";
import type { SocialLink } from "../../lib/firebase/firestore-schema";
import type { UserOutletCopyCard } from "../../server/cards/card-entry.repository.server";
import { getUserOutletCopyCards } from "../../server/cards/card-entry.functions";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Outlet = { id: string; name: string };

export function UserCardCopyPicker({ outlets, content, channels, disabled, onCopy }: {
  outlets: Outlet[];
  content: Messages["cardClaim"]["copy"];
  channels: Messages["adminDashboard"]["activation"]["channels"];
  disabled: boolean;
  onCopy: (links: SocialLink[]) => void;
}) {
  const [outletId, setOutletId] = useState("");
  const [cards, setCards] = useState<UserOutletCopyCard[]>([]);
  const [cardId, setCardId] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!outletId) return;
    let active = true;
    setLoading(true); setFailed(false);
    void getUserOutletCopyCards({ data: { outletId } })
      .then((items) => active && setCards(items))
      .catch(() => active && setFailed(true))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [outletId]);
  if (!outlets.length) return null;
  const card = cards.find((item) => item.id === cardId);
  const channelName = (type: string) => type in channels
    ? channels[type as keyof typeof channels].title
    : type === "facebook" ? "Facebook" : channels.custom.title;
  return <section className="rounded-2xl border border-[#bce8ef] bg-[#f0fbfd] p-5">
    <h2 className="font-bold">{content.title}</h2>
    <p className="mt-2 text-sm leading-6 text-[#69737d]">{content.description}</p>
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <PickerSelect label={content.outlet} value={outletId} disabled={disabled} placeholder={content.select} items={outlets.map((item) => ({ value: item.id, label: item.name }))} onChange={(value) => { setOutletId(value); setCardId(""); setCards([]); setSelected([]); }} />
      <PickerSelect label={content.card} value={cardId} disabled={disabled || loading || failed || !outletId} placeholder={content.select} items={cards.map((item) => ({ value: item.id, label: item.cardId }))} onChange={(value) => { setCardId(value); setSelected([]); }} />
    </div>
    {loading && <p className="mt-3 text-sm text-[#69737d]">{content.loading}</p>}
    {failed && <p className="mt-3 text-sm text-red-600">{content.error}</p>}
    {!loading && !failed && outletId && !cards.length && <p className="mt-3 text-sm text-[#69737d]">{content.empty}</p>}
    {card && <div className="mt-4 grid gap-3">
      {card.links.map((link) => <label key={link.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/8 bg-white p-3"><Checkbox disabled={disabled} checked={selected.includes(link.id)} onCheckedChange={(checked) => setSelected((ids) => checked ? [...ids, link.id] : ids.filter((id) => id !== link.id))} /><span className="min-w-0"><span className="block text-sm font-semibold">{link.label} · {channelName(link.type)}</span><span className="block truncate text-xs text-[#69737d]">{link.url}</span></span></label>)}
      {!card.links.length && <p className="text-sm text-[#69737d]">{content.noLinks}</p>}
      <Button type="button" className="h-11 justify-self-start px-4" disabled={disabled || !selected.length} onClick={() => { onCopy(card.links.filter((link) => selected.includes(link.id))); setSelected([]); }}>{content.action}</Button>
    </div>}
  </section>;
}

function PickerSelect({ label, value, disabled, placeholder, items, onChange }: { label: string; value: string; disabled: boolean; placeholder: string; items: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return <div className="grid gap-2"><label className="text-sm font-semibold">{label}</label><Select items={Object.fromEntries(items.map((item) => [item.value, item.label]))} value={value} disabled={disabled} onValueChange={(next) => next && onChange(next)}><SelectTrigger className="w-full"><SelectValue placeholder={placeholder} /></SelectTrigger><SelectContent>{items.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>;
}
