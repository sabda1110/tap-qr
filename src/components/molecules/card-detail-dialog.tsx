import { Link } from "@tanstack/react-router";
import {
  CreditCard,
  ExternalLink,
  Link2,
  Loader2,
  MapPin,
  Phone,
  Store,
  User,
} from "lucide-react";

import type { AdminCardDetail } from "../../server/cards/card.repository.server";
import { Dialog, DialogBody, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { SocialBrandMark } from "../elements/social-brand-mark";

export type CardDetailDialogContent = {
  title: string;
  description: string;
  cardInfo: string;
  outletInfo: string;
  ownerInfo: string;
  linksInfo: string;
  noOutlet: string;
  noOwner: string;
  noLinks: string;
  googleReviewLabel: string;
  googlePlaceId: string;
  verified: string;
  pending: string;
  unverified: string;
  openPublicPage: string;
  manageInOutlet: string;
  close: string;
  loading: string;
  error: string;
  pvc: string;
  acrylic: string;
  claimed: string;
  unclaimed: string;
  enabled: string;
  disabled: string;
  printed: string;
  unprinted: string;
};

type CardDetailDialogProps = {
  cardDetail: AdminCardDetail | null;
  content: CardDetailDialogContent;
  isLoading: boolean;
  locale: string;
  onClose: () => void;
  open: boolean;
};

export function CardDetailDialog({
  cardDetail,
  content,
  isLoading,
  locale,
  onClose,
  open,
}: CardDetailDialogProps) {
  if (!open) return null;

  return (
    <Dialog
      closeLabel={content.close}
      description={content.description}
      icon={CreditCard}
      onClose={onClose}
      title={`${content.title} · ${cardDetail?.cardId ?? ""}`}
    >
      <DialogBody className="bg-[#f8fafc] p-4 sm:p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-[#646b75]">
            <Loader2 className="size-8 animate-spin text-[#087e91]" />
            <p className="mt-3 text-sm font-medium">{content.loading}</p>
          </div>
        ) : !cardDetail ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-600">
            {content.error}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Card Information Badges */}
            <div className="rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
              <span className="text-xs font-bold tracking-wider text-[#69737d] uppercase">
                {content.cardInfo}
              </span>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-xl border border-black/10 bg-[#f5f8fa] px-3 py-1 font-mono text-xs font-bold text-[#172029]">
                  {cardDetail.cardId}
                </span>
                <span className="rounded-xl bg-[#f1f3f5] px-2.5 py-1 text-xs font-bold text-[#69737d]">
                  {cardDetail.material === "pvc" ? content.pvc : content.acrylic}
                </span>
                <span className="rounded-xl bg-[#eaf9fb] px-2.5 py-1 text-xs font-bold text-[#087e91]">
                  {content.claimed}
                </span>
                <span
                  className={`rounded-xl px-2.5 py-1 text-xs font-bold ${
                    cardDetail.printStatus === "printed"
                      ? "bg-[#eaf9fb] text-[#087e91]"
                      : "bg-[#f1f3f5] text-[#69737d]"
                  }`}
                >
                  {cardDetail.printStatus === "printed"
                    ? content.printed
                    : content.unprinted}
                </span>
                <span
                  className={`rounded-xl px-2.5 py-1 text-xs font-bold ${
                    cardDetail.isEnabled
                      ? "bg-[#eaf9fb] text-[#087e91]"
                      : "bg-[#f1f3f5] text-[#69737d]"
                  }`}
                >
                  {cardDetail.isEnabled ? content.enabled : content.disabled}
                </span>
              </div>
            </div>

            {/* Outlet & Owner Information */}
            <div className="rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
              <span className="text-xs font-bold tracking-wider text-[#69737d] uppercase">
                {content.outletInfo}
              </span>
              {cardDetail.outlet ? (
                <div className="mt-3 space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid size-11 place-items-center rounded-2xl border border-[#bce8ef] bg-[#e8f8fb] text-[#087e91]">
                        <Store className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#172029]">
                          {cardDetail.outlet.name}
                        </h4>
                        <p className="text-xs text-[#69737d]">
                          /{cardDetail.outlet.slug}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`/${locale}/${cardDetail.cardId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 self-start rounded-xl border border-black/8 bg-[#f5f8fa] px-3 py-1.5 text-xs font-semibold text-[#172029] transition-colors hover:bg-black/5"
                    >
                      <ExternalLink className="size-3.5" />
                      <span>{content.openPublicPage}</span>
                    </a>
                  </div>

                  <div className="grid gap-2 border-t border-black/6 pt-3 text-xs sm:grid-cols-2">
                    {cardDetail.outlet.address && (
                      <div className="flex items-start gap-2 text-[#646b75]">
                        <MapPin className="size-3.5 shrink-0 mt-0.5 text-[#087e91]" />
                        <span>{cardDetail.outlet.address}</span>
                      </div>
                    )}
                    {cardDetail.outlet.phone && (
                      <div className="flex items-center gap-2 text-[#646b75]">
                        <Phone className="size-3.5 shrink-0 text-[#087e91]" />
                        <span>{cardDetail.outlet.phone}</span>
                      </div>
                    )}
                  </div>

                  {cardDetail.owner && (
                    <div className="rounded-xl bg-[#f8fafc] p-3 text-xs">
                      <div className="flex items-center gap-2 font-semibold text-[#172029]">
                        <User className="size-3.5 text-[#087e91]" />
                        <span>
                          {content.ownerInfo}: {cardDetail.owner.name}
                        </span>
                      </div>
                      <p className="mt-1 pl-5.5 text-[#69737d]">
                        {cardDetail.owner.email}
                        {cardDetail.owner.phone ? ` · ${cardDetail.owner.phone}` : ""}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-sm text-[#69737d]">{content.noOutlet}</p>
              )}
            </div>

            {/* Links and Content */}
            <div className="rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
              <span className="text-xs font-bold tracking-wider text-[#69737d] uppercase">
                {content.linksInfo}
              </span>
              <div className="mt-3 space-y-2.5">
                {cardDetail.config.google.reviewUrl && (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-black/6 bg-[#f8fafc] p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <SocialBrandMark type="google_review" />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[#172029]">
                          {content.googleReviewLabel}
                        </p>
                        <p className="truncate text-xs text-[#69737d]">
                          {cardDetail.config.google.reviewUrl}
                        </p>
                      </div>
                    </div>
                    {cardDetail.config.google.verificationStatus && (
                      <span className="shrink-0 rounded-full bg-[#eaf9fb] px-2.5 py-0.5 text-[11px] font-bold text-[#087e91]">
                        {cardDetail.config.google.verificationStatus === "verified"
                          ? content.verified
                          : content.pending}
                      </span>
                    )}
                  </div>
                )}

                {cardDetail.config.social.links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-black/6 bg-[#f8fafc] p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {link.type === "facebook" ? (
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eaf9fb] text-[#087e91]">
                          <Link2 className="size-5" />
                        </span>
                      ) : (
                        <SocialBrandMark type={link.type} />
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[#172029]">
                          {link.label}
                        </p>
                        <p className="truncate text-xs text-[#69737d]">
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        link.isActive
                          ? "bg-[#eaf9fb] text-[#087e91]"
                          : "bg-[#f1f3f5] text-[#69737d]"
                      }`}
                    >
                      {link.isActive ? content.enabled : content.disabled}
                    </span>
                  </div>
                ))}

                {!cardDetail.config.google.reviewUrl &&
                  cardDetail.config.social.links.length === 0 && (
                    <p className="py-4 text-center text-sm text-[#69737d]">
                      {content.noLinks}
                    </p>
                  )}
              </div>
            </div>
          </div>
        )}
      </DialogBody>
      <DialogFooter className="bg-white">
        {cardDetail?.outlet && (
          <Link
            to="/$locale/dashboard/admin/outlets"
            params={{ locale }}
            search={{ query: cardDetail.outlet.name, outletId: cardDetail.outlet.id, edit: true }}
            className="inline-flex"
          >
            <Button type="button" variant="outline" className="border-[#087e91] text-[#087e91] hover:bg-[#e8f8fb]">
              <Store className="size-4" />
              <span>{content.manageInOutlet}</span>
            </Button>
          </Link>
        )}
        <Button type="button" onClick={onClose}>{content.close}</Button>
      </DialogFooter>
    </Dialog>
  );
}
