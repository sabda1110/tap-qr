import { Link } from "@tanstack/react-router";
import { CreditCard, ExternalLink, MapPin, Pencil, Plus } from "lucide-react";
import type { Language, Messages } from "../../i18n";
import type { OutletDetail } from "../../server/outlets/outlet.types";
import { OutletAvatar } from "../elements/outlet-avatar";
import { Button, buttonVariants } from "../ui/button";

type Props = {
  outlet: OutletDetail;
  language: Language;
  content: Messages["userDashboard"];
  materials: Pick<Messages["adminDashboard"]["outlets"], "acrylic" | "pvc">;
  onEditOutlet: () => void;
  onEditCard: (cardId: string) => void;
  onAddCard: () => void;
};

export function UserOutletManagementCard({
  outlet,
  language,
  content,
  materials,
  onEditOutlet,
  onEditCard,
  onAddCard,
}: Props) {
  const outletActive = outlet.status === "active";
  return (
    <article className="min-w-0 overflow-hidden rounded-2xl border border-black/8 bg-white">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <OutletAvatar
            key={outlet.logoUrl}
            name={outlet.name}
            logoUrl={outlet.logoUrl}
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold tracking-tight break-words">
              {outlet.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#69737d]">
              <StatusBadge active={outletActive} content={content} />
              <span>
                {content.cardCount.replace("{count}", String(outlet.cardCount))}
              </span>
            </div>
          </div>
        </div>
        {outlet.address && (
          <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-[#69737d]">
            <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0" />
            <span className="break-words">{outlet.address}</span>
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            className="h-11 px-3"
            variant="outline"
            onClick={onEditOutlet}
          >
            <Pencil aria-hidden="true" />
            {content.editOutlet}
          </Button>
          {outletActive ? (
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "h-11 gap-2 px-3 no-underline",
              })}
              to="/$locale/p/$id"
              params={{ locale: language, id: outlet.slug || outlet.id }}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink aria-hidden="true" className="size-4" />
              {content.viewProfile}
            </Link>
          ) : (
            <Button className="h-11 px-3" variant="outline" disabled>
              <ExternalLink aria-hidden="true" />
              {content.viewProfile}
            </Button>
          )}
        </div>
        {!outletActive && (
          <p className="mt-2 text-xs leading-5 text-amber-800">
            {content.profileUnavailable}
          </p>
        )}
      </div>

      <section
        className="border-t border-black/8 bg-[#f8fafc] p-4 sm:p-5"
        aria-label={content.cards}
      >
        <h4 className="flex items-center gap-2 text-sm font-bold">
          <CreditCard aria-hidden="true" className="size-4 text-[#087e91]" />
          {content.cards}
        </h4>
        <p className="mt-1 text-xs leading-5 text-[#69737d]">
          {content.cardHelp}
        </p>
        <ul className="mt-3 grid gap-3">
          {outlet.cards.map((card) => {
            const available = outletActive && card.isEnabled;
            const activeLinks = card.links.filter((link) => link.isActive);
            return (
              <li
                key={card.id}
                className="min-w-0 rounded-xl border border-black/8 bg-white p-3 sm:p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#69737d]">
                    {card.material === "acrylic"
                      ? materials.acrylic
                      : materials.pvc}
                  </span>
                  <StatusBadge active={available} content={content} />
                </div>
                <p className="mt-2 font-mono text-xs leading-5 break-all">
                  {card.cardId}
                </p>
                <p className="mt-2 text-xs text-[#69737d]">
                  {content.linkCount.replace(
                    "{count}",
                    String(activeLinks.length),
                  )}
                </p>
                {activeLinks.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {activeLinks.map((link) => (
                      <span
                        key={link.id}
                        className="max-w-full rounded-md bg-[#e8f8fb] px-2 py-1 text-xs font-medium break-words text-[#087e91]"
                      >
                        {link.label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs leading-5 text-amber-800">
                    {content.noLinks}
                  </p>
                )}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    className="h-11 px-3"
                    onClick={() => onEditCard(card.id)}
                  >
                    <Pencil aria-hidden="true" className="hidden sm:block" />
                    {content.editLinks}
                  </Button>
                  {available ? (
                    <Link
                      className={buttonVariants({
                        variant: "ghost",
                        className: "h-11 gap-2 px-3 no-underline",
                      })}
                      to="/$locale/$cardId"
                      params={{ locale: language, cardId: card.cardId }}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink
                        aria-hidden="true"
                        className="hidden size-4 sm:block"
                      />
                      {content.viewCard}
                    </Link>
                  ) : (
                    <Button className="h-11 px-3" variant="ghost" disabled>
                      <ExternalLink
                        aria-hidden="true"
                        className="hidden sm:block"
                      />
                      {content.viewCard}
                    </Button>
                  )}
                </div>
                {!available && (
                  <p className="mt-2 text-xs leading-5 text-amber-800">
                    {content.cardUnavailable}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        {outlet.cards.length === 0 && (
          <p className="mt-3 text-sm leading-6 text-[#69737d]">
            {content.noCards}
          </p>
        )}
        {outletActive && (
          <Button
            className="mt-3 h-11 w-full"
            variant="outline"
            onClick={onAddCard}
          >
            <Plus aria-hidden="true" />
            {content.addCard}
          </Button>
        )}
      </section>
    </article>
  );
}

function StatusBadge({
  active,
  content,
}: {
  active: boolean;
  content: Messages["userDashboard"];
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold ${active ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-amber-500"}`}
      />
      {active ? content.active : content.disabled}
    </span>
  );
}
