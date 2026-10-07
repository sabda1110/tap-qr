import { useEffect, useState } from "react";
import type { Messages } from "../../i18n";
import type { SocialLink } from "../../lib/firebase/firestore-schema";
import type { SourceOutletOption } from "../../server/outlets/outlet-create.schemas";
import type { OutletDetail } from "../../server/outlets/outlet.types";
import {
  getAdminOwnerSourceOutlets,
  getAdminOutletCopyCards,
} from "../../server/outlets/outlet-create.functions";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function OutletCopyPicker({
  ownerId,
  content,
  channels,
  disabled,
  onCopy,
}: {
  ownerId: string;
  content: Messages["adminDashboard"]["outletCreate"];
  channels: Messages["adminDashboard"]["activation"]["channels"];
  disabled: boolean;
  onCopy: (links: SocialLink[]) => void;
}) {
  const [outlets, setOutlets] = useState<SourceOutletOption[]>([]);
  const [outletId, setOutletId] = useState<string | null>(null);
  const [cards, setCards] = useState<OutletDetail["cards"]>([]);
  const [cardId, setCardId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let current = true;
    setLoading(true);
    setError(false);
    async function loadOptions() {
      if (outletId) {
        const options = await getAdminOutletCopyCards({
          data: { ownerId, outletId },
        });
        if (current) setCards(options);
      } else {
        const options = await getAdminOwnerSourceOutlets({ data: { ownerId } });
        if (current) setOutlets(options);
      }
    }
    const request = loadOptions();
    void request
      .catch(() => {
        if (current) setError(true);
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => {
      current = false;
    };
  }, [ownerId, outletId, retry]);
  const card = cards.find((option) => option.id === cardId);
  const channelName = (type: string) =>
    type in channels
      ? channels[type as keyof typeof channels].title
      : type === "facebook"
        ? "Facebook"
        : channels.custom.title;
  const cardLabel = (option: OutletDetail["cards"][number]) =>
    `${option.cardId} · ${option.channels.map(channelName).join(", ") || content.noLinks}`;
  if (loading && !outlets.length && !error) return null;
  if (!loading && !error && !outlets.length) return null;
  return (
    <section className="rounded-2xl border border-[#bce8ef] bg-[#f0fbfd] p-5">
      <h2 className="font-bold">{content.duplicateTitle}</h2>
      <p className="mt-2 text-sm leading-6 text-[#69737d]">
        {content.duplicateHelp}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label id="copy-outlet" className="text-sm font-semibold">
            {content.sourceOutlet}
          </label>
          <Select
            value={outletId}
            disabled={disabled || loading || error}
            items={Object.fromEntries(
              outlets.map((outlet) => [
                outlet.id,
                `${outlet.name} · ${outlet.slug}`,
              ]),
            )}
            onValueChange={(value) => {
              setOutletId(value);
              setCardId(null);
              setCards([]);
              setSelected([]);
            }}
          >
            <SelectTrigger aria-labelledby="copy-outlet" className="w-full">
              <SelectValue placeholder={content.selectSource} />
            </SelectTrigger>
            <SelectContent>
              {outlets.map((outlet) => (
                <SelectItem key={outlet.id} value={outlet.id}>
                  {outlet.name} · {outlet.slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label id="copy-card" className="text-sm font-semibold">
            {content.sourceCard}
          </label>
          <Select
            value={cardId}
            disabled={disabled || loading || error || !outletId}
            items={Object.fromEntries(
              cards.map((option) => [option.id, cardLabel(option)]),
            )}
            onValueChange={(value) => {
              setCardId(value);
              setSelected([]);
            }}
          >
            <SelectTrigger aria-labelledby="copy-card" className="w-full">
              <SelectValue placeholder={content.selectSource} />
            </SelectTrigger>
            <SelectContent>
              {cards.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {cardLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {loading && (
        <p className="mt-3 text-sm text-[#69737d]" role="status">
          {content.loading}
        </p>
      )}
      {error && (
        <div className="mt-3 flex items-center gap-3">
          <p className="text-sm text-red-600">{content.loadError}</p>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => setRetry((value) => value + 1)}
          >
            {content.retry}
          </Button>
        </div>
      )}
      {!loading && !error && outletId && !cards.length && (
        <p className="mt-3 text-sm text-[#69737d]">{content.noCards}</p>
      )}
      {card && (
        <div className="mt-4 grid gap-3">
          {card.links.map((link) => (
            <label
              key={link.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/8 bg-white p-3"
            >
              <Checkbox
                disabled={disabled}
                checked={selected.includes(link.id)}
                onCheckedChange={(checked) =>
                  setSelected((ids) =>
                    checked
                      ? [...ids, link.id]
                      : ids.filter((id) => id !== link.id),
                  )
                }
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold">
                  {link.label} · {channelName(link.type)}
                </span>
                <span className="block truncate text-xs text-[#69737d]">
                  {link.url}
                </span>
              </span>
            </label>
          ))}
          {!card.links.length && (
            <p className="text-sm text-[#69737d]">{content.noLinks}</p>
          )}
          <Button
            type="button"
            className="h-11 justify-self-start px-4"
            disabled={disabled || !selected.length || loading || error}
            onClick={() => {
              onCopy(card.links.filter((link) => selected.includes(link.id)));
              setSelected([]);
            }}
          >
            {content.copyAction}
          </Button>
        </div>
      )}
    </section>
  );
}
