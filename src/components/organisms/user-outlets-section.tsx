import { useId, useState } from "react";
import { Store } from "lucide-react";
import type { Language, Messages } from "../../i18n";
import type { OutletDetail } from "../../server/outlets/outlet.types";
import { UserOutletManagementCard } from "../molecules/user-outlet-management-card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  outlets: OutletDetail[];
  language: Language;
  content: Messages["userDashboard"];
  materials: Messages["adminDashboard"]["outlets"];
  onEditOutlet: (outletId: string) => void;
  onEditCard: (outletId: string, cardId: string) => void;
  onAddCard: (outletId?: string) => void;
};

export function UserOutletsSection({
  outlets,
  language,
  content,
  materials,
  onEditOutlet,
  onEditCard,
  onAddCard,
}: Props) {
  const selectId = useId();
  const newestOutlet = findNewestOutlet(outlets);
  const [selectedOutletId, setSelectedOutletId] = useState(
    () => newestOutlet?.id ?? "",
  );
  const selectedOutlet =
    outlets.find((outlet) => outlet.id === selectedOutletId) ?? newestOutlet;
  if (outlets.length === 0)
    return (
      <section className="rounded-2xl border border-dashed border-[#bce8ef] bg-white px-5 py-10 text-center sm:py-14">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e8f8fb] text-[#087e91]">
          <Store aria-hidden="true" className="size-6" />
        </span>
        <h2 className="mt-5 text-xl font-bold">{content.emptyTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#69737d]">
          {content.emptyDescription}
        </p>
        <Button
          className="mt-6 h-11 w-full px-5 sm:w-auto"
          onClick={() => onAddCard()}
        >
          {content.addCard}
        </Button>
      </section>
    );
  return (
    <section aria-label={content.title}>
      <div className="mb-5 rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
        <label htmlFor={selectId} className="block text-sm font-semibold">
          {content.selectOutlet}
        </label>
        <p className="mt-1 text-xs leading-5 text-[#69737d]">
          {content.selectOutletHelp}
        </p>
        <Select
          items={Object.fromEntries(
            outlets.map((outlet) => [outlet.id, outlet.name]),
          )}
          value={selectedOutlet?.id ?? ""}
          onValueChange={(value) => value && setSelectedOutletId(value)}
        >
          <SelectTrigger id={selectId} className="mt-3 w-full sm:max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {outlets.map((outlet) => (
              <SelectItem key={outlet.id} value={outlet.id}>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">
                    {outlet.name}
                  </span>
                  <span className="block text-xs text-[#69737d]">
                    {content.cardCount.replace(
                      "{count}",
                      String(outlet.cardCount),
                    )}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedOutlet && (
        <UserOutletManagementCard
          key={selectedOutlet.id}
          outlet={selectedOutlet}
          language={language}
          content={content}
          materials={materials}
          onEditOutlet={() => onEditOutlet(selectedOutlet.id)}
          onEditCard={(cardId) => onEditCard(selectedOutlet.id, cardId)}
          onAddCard={() => onAddCard(selectedOutlet.id)}
        />
      )}
    </section>
  );
}

function findNewestOutlet(outlets: OutletDetail[]) {
  return outlets.reduce<OutletDetail | undefined>((newest, outlet) => {
    if (!newest) return outlet;
    const outletCreatedAt = outlet.createdAt
      ? Date.parse(outlet.createdAt)
      : Number.NEGATIVE_INFINITY;
    const newestCreatedAt = newest.createdAt
      ? Date.parse(newest.createdAt)
      : Number.NEGATIVE_INFINITY;
    return outletCreatedAt > newestCreatedAt ? outlet : newest;
  }, undefined);
}
