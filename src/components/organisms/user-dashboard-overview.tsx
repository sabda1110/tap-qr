import { CreditCard, Plus, Store } from "lucide-react";
import type { Messages } from "../../i18n";
import { Button } from "../ui/button";

export function UserDashboardOverview({
  content,
  name,
  outletCount,
  cardCount,
  activeCardCount,
  onAddCard,
  onAddOutlet,
}: {
  content: Messages["userDashboard"];
  name: string;
  outletCount: number;
  cardCount: number;
  activeCardCount: number;
  onAddCard: () => void;
  onAddOutlet: () => void;
}) {
  return (
    <header className="mb-6 sm:mb-8">
      <p className="text-sm text-[#69737d]">
        {content.greeting},{" "}
        <span className="font-semibold text-[#172029]">{name}</span>
      </p>
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {content.title}
          </h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#69737d]">
            {content.description}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
          <Button
            className="h-11 px-3"
            variant="outline"
            onClick={onAddOutlet}
            title={content.addOutletHelp}
          >
            <Store aria-hidden="true" />
            {content.addOutlet}
          </Button>
          <Button className="h-11 px-3" onClick={onAddCard}>
            <Plus aria-hidden="true" />
            {content.addCard}
          </Button>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-3 divide-x divide-black/8 rounded-2xl border border-black/8 bg-white py-4">
        {[
          { label: content.outlets, value: outletCount, icon: Store },
          { label: content.cards, value: cardCount, icon: CreditCard },
          {
            label: content.activeCards,
            value: activeCardCount,
            icon: CreditCard,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="px-3 sm:px-5">
            <dt className="flex items-center gap-2 text-xs text-[#69737d]">
              <Icon aria-hidden="true" className="hidden size-4 sm:block" />
              {label}
            </dt>
            <dd className="mt-1 text-2xl font-bold tracking-tight">{value}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
