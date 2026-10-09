import { useId, useRef, useState } from "react";
import { Search, Store, X } from "lucide-react";
import type { Language, Messages } from "../../i18n";
import type { OutletDetail } from "../../server/outlets/outlet.types";
import { UserOutletManagementCard } from "../molecules/user-outlet-management-card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
  const [query, setQuery] = useState("");
  const searchId = useId();
  const searchInput = useRef<HTMLInputElement>(null);
  const clearSearch = () => {
    setQuery("");
    searchInput.current?.focus();
  };
  const normalizedQuery = query.trim().toLocaleLowerCase(language);
  const matchingOutlets = outlets.filter(
    (outlet) =>
      outlet.name.toLocaleLowerCase(language).includes(normalizedQuery) ||
      outlet.cards.some((card) =>
        card.cardId.toLowerCase().includes(normalizedQuery),
      ),
  );
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
      <div className="mb-5">
        <label htmlFor={searchId} className="mb-2 block text-sm font-semibold">
          {content.search}
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-[#69737d]"
          />
          <Input
            ref={searchInput}
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={content.searchPlaceholder}
            className="h-11 bg-white pr-12 pl-10 text-base sm:text-sm [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query && (
            <Button
              aria-label={content.clearSearch}
              className="absolute top-0 right-0 size-11"
              variant="ghost"
              size="icon"
              onClick={clearSearch}
            >
              <X aria-hidden="true" />
            </Button>
          )}
        </div>
        <p className="mt-2 text-xs text-[#69737d]" role="status">
          {content.results.replace("{count}", String(matchingOutlets.length))}
        </p>
      </div>
      {matchingOutlets.length > 0 ? (
        <div className="grid items-start gap-4 xl:grid-cols-2">
          {matchingOutlets.map((outlet) => (
            <UserOutletManagementCard
              key={outlet.id}
              outlet={outlet}
              language={language}
              content={content}
              materials={materials}
              onEditOutlet={() => onEditOutlet(outlet.id)}
              onEditCard={(cardId) => onEditCard(outlet.id, cardId)}
              onAddCard={() => onAddCard(outlet.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-black/8 bg-white px-5 py-10 text-center">
          <h2 className="font-bold">{content.noResults}</h2>
          <p className="mt-2 text-sm text-[#69737d]">{content.noResultsHelp}</p>
          <Button
            className="mt-4 h-11 px-4"
            variant="outline"
            onClick={clearSearch}
          >
            {content.clearSearch}
          </Button>
        </div>
      )}
    </section>
  );
}
