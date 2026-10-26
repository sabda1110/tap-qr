import storeAvatar from "../assets/images/activation/existing-store-orange.webp";
import { useId } from "react";
import { Link } from "@tanstack/react-router";
import { CreditCard, ExternalLink, Images, MapPin, Pencil, Plus } from "lucide-react";
import type { Language, Messages } from "../../i18n";
import type { OutletDetail } from "../../server/outlets/outlet.types";
import { OutletAvatar } from "../elements/outlet-avatar";
import { Button, buttonVariants } from "../ui/button";

type Props = {
  outlet: OutletDetail;
  language: Language;
  content: Messages["userDashboard"];
  galleryContent: Messages["outletGallery"];
  materials: Pick<Messages["adminDashboard"]["outlets"], "acrylic" | "pvc">;
  onEditOutlet: () => void;
  onManageGallery: () => void;
  onEditCard: (cardId: string) => void;
  onAddCard: () => void;
};

export function UserOutletManagementCard({
  outlet,
  language,
  content,
  galleryContent,
  materials,
  onEditOutlet,
  onManageGallery,
  onEditCard,
  onAddCard,
}: Props) {
  const galleryTooltipId = useId();
  const outletActive = outlet.status === "active";
  const canManageGallery = outlet.cards.some(
    (card) => card.links.filter((link) => link.isActive).length > 1,
  );
  return (
    <article className="min-w-0 overflow-hidden rounded-3xl border border-black/10 bg-white">
      <div className="border-t-4 border-[#ffb332] bg-[#fffdf8] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <OutletAvatar
            key={outlet.logoUrl}
            name={outlet.name}
            logoUrl={outlet.logoUrl}
            fallbackSrc={storeAvatar}
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
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Button
            className="h-11 rounded-md px-3"
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
                className: "h-11 gap-2 rounded-md px-3 no-underline",
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
            <Button className="h-11 rounded-md px-3" variant="outline" disabled>
              <ExternalLink aria-hidden="true" />
              {content.viewProfile}
            </Button>
          )}
          <span
            className="group relative col-span-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087e91] sm:col-span-1"
            tabIndex={canManageGallery ? undefined : 0}
            aria-describedby={canManageGallery ? undefined : galleryTooltipId}
          >
            <Button
              className="h-11 w-full rounded-md px-3"
              variant="outline"
              onClick={onManageGallery}
              disabled={!canManageGallery}
            >
              <Images aria-hidden="true" />
              {galleryContent.manage}
            </Button>
            {!canManageGallery && (
              <span
                id={galleryTooltipId}
                role="tooltip"
                className="pointer-events-none absolute right-0 bottom-full z-10 mb-2 w-max max-w-64 rounded-lg bg-[#172029] px-3 py-2 text-xs leading-5 font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus:opacity-100"
              >
                {galleryContent.disabledHelp}
              </span>
            )}
          </span>
        </div>
        {!outletActive && (
          <p className="mt-2 text-xs leading-5 text-amber-800">
            {content.profileUnavailable}
          </p>
        )}
      </div>

      <section
        className="border-t border-black/8 bg-[#faf9f6] p-4 sm:p-5"
        aria-label={content.cards}
      >
        <h4 className="flex items-center gap-2 text-sm font-bold">
          <CreditCard aria-hidden="true" className="size-4 text-[#c77913]" />
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
                className="min-w-0 rounded-2xl border border-black/10 bg-white p-4 shadow-[2px_2px_0_#f0e4cd] sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-[#fff2d3] px-2.5 py-1.5 text-xs font-bold text-[#85500f]">
                    <CreditCard aria-hidden="true" className="size-4" />
                    {card.material === "acrylic"
                      ? materials.acrylic
                      : materials.pvc}
                  </span>
                  <StatusBadge active={available} content={content} />
                </div>
                <p className="mt-3 font-mono text-[11px] leading-5 break-all text-[#69737d]">
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
                        className="max-w-full rounded-md border border-[#eadfc9] bg-[#fffaf0] px-2 py-1 text-xs font-medium break-words text-[#614a2b]"
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
                    className="h-11 rounded-md px-3"
                    onClick={() => onEditCard(card.id)}
                  >
                    <Pencil aria-hidden="true" className="hidden sm:block" />
                    {content.editLinks}
                  </Button>
                  {available ? (
                    <Link
                      className={buttonVariants({
                        variant: "outline",
                        className: "h-11 gap-2 rounded-md px-3 no-underline",
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
                    <Button className="h-11 rounded-md px-3" variant="outline" disabled>
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
            className="mt-4 h-11 w-full rounded-md border-[#e5c68b] bg-[#fff8e9] text-[#614a2b] hover:bg-[#fff2d3]"
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
