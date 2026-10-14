import { Link } from "@tanstack/react-router";
import {
  CreditCard,
  ExternalLink,
  Layers,
  MapPin,
  ScanLine,
  Store,
  Users,
} from "lucide-react";

import type { AdminAnalyticsSummary } from "../../server/analytics/admin-analytics.repository.server";
import { AnalyticsKpiCard } from "../molecules/analytics-kpi-card";
import { Button } from "../ui/button";

export type AdminAnalyticsContent = {
  kicker: string;
  title: string;
  description: string;
  kpi: {
    totalUsers: string;
    totalUsersSubtext: string;
    totalOutlets: string;
    totalOutletsSubtext: string;
    totalCards: string;
    totalCardsSubtext: string;
    totalScans: string;
    totalScansSubtext: string;
  };
  cardsSection: {
    title: string;
    description: string;
    claimedRate: string;
    claimed: string;
    unclaimed: string;
    printStatusTitle: string;
    printed: string;
    unprinted: string;
    materialTitle: string;
    acrylic: string;
    pvc: string;
  };
  scansSection: {
    title: string;
    description: string;
    cardVisits: string;
    cardVisitsDesc: string;
    profileViews: string;
    profileViewsDesc: string;
    avgScansPerOutlet: string;
    avgScansSubtext: string;
  };
  recentOutletsSection: { title: string; description: string; viewAll: string; empty: string };
};

type AdminAnalyticsSectionProps = {
  summary: AdminAnalyticsSummary;
  content: AdminAnalyticsContent;
  locale: string;
};

export function AdminAnalyticsSection({
  summary,
  content,
  locale,
}: AdminAnalyticsSectionProps) {
  const claimedPercentage =
    summary.cards.total > 0
      ? Math.round((summary.cards.claimed / summary.cards.total) * 100)
      : 0;

  const avgScans =
    summary.outlets.active > 0
      ? (summary.scans.total / summary.outlets.active).toFixed(1)
      : "0";

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="border-b border-black/8 pb-7">
        <p className="text-xs font-bold tracking-[0.16em] text-[#0798ad] uppercase">
          {content.kicker}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
          {content.title}
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-[#646b75]">
          {content.description}
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsKpiCard icon={Users} title={content.kpi.totalUsers} value={summary.users.total} badge={`${summary.users.active} aktif`} subtext={content.kpi.totalUsersSubtext} variant="cyan" />
        <AnalyticsKpiCard icon={Store} title={content.kpi.totalOutlets} value={summary.outlets.total} badge={`${summary.outlets.active} aktif`} subtext={content.kpi.totalOutletsSubtext} variant="default" />
        <AnalyticsKpiCard icon={CreditCard} title={content.kpi.totalCards} value={summary.cards.total} badge={`${claimedPercentage}% diklaim`} subtext={`${summary.cards.claimed} terpakai`} variant="cyan" />
        <AnalyticsKpiCard icon={ScanLine} title={content.kpi.totalScans} value={summary.scans.total} badge={`${summary.scans.cardVisits} tap`} subtext={content.kpi.totalScansSubtext} variant="orange" />
      </div>

      {/* Breakdown Details Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Card Inventory Breakdown */}
        <div className="rounded-2xl border border-black/8 bg-white p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl border border-[#bce8ef] bg-[#e8f8fb] text-[#087e91]">
              <Layers className="size-5" />
            </span>
            <div>
              <h3 className="font-bold text-[#172029]">
                {content.cardsSection.title}
              </h3>
              <p className="text-xs text-[#646b75]">
                {content.cardsSection.description}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* Claimed Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#646b75]">{content.cardsSection.claimedRate}</span>
                <span className="font-bold text-[#087e91]">{claimedPercentage}%</span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#f1f3f5]">
                <div
                  className="h-full rounded-full bg-[#087e91] transition-all"
                  style={{ width: `${claimedPercentage}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-[#646b75]">
                <span>{summary.cards.claimed} {content.cardsSection.claimed}</span>
                <span>{summary.cards.unclaimed} {content.cardsSection.unclaimed}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-black/6 pt-4 text-xs">
              <div className="rounded-xl bg-[#f8fafc] p-3">
                <p className="text-[#646b75]">{content.cardsSection.printStatusTitle}</p>
                <div className="mt-1 flex items-baseline gap-2 font-bold text-[#172029]">
                  <span className="text-lg text-[#087e91]">{summary.cards.printed}</span>
                  <span>{content.cardsSection.printed}</span>
                </div>
                <p className="text-[11px] text-[#69737d]">
                  {summary.cards.unprinted} {content.cardsSection.unprinted}
                </p>
              </div>

              <div className="rounded-xl bg-[#f8fafc] p-3">
                <p className="text-[#646b75]">{content.cardsSection.materialTitle}</p>
                <div className="mt-1 flex items-baseline gap-2 font-bold text-[#172029]">
                  <span className="text-lg">{summary.cards.acrylic}</span>
                  <span>{content.cardsSection.acrylic}</span>
                </div>
                <p className="text-[11px] text-[#69737d]">
                  {summary.cards.pvc} {content.cardsSection.pvc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scan & Interaction Breakdown */}
        <div className="rounded-2xl border border-black/8 bg-white p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl border border-[#ffe1a6] bg-[#fff8eb] text-[#d97706]">
              <ScanLine className="size-5" />
            </span>
            <div>
              <h3 className="font-bold text-[#172029]">
                {content.scansSection.title}
              </h3>
              <p className="text-xs text-[#646b75]">
                {content.scansSection.description}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-[#f8fafc] p-4">
              <div>
                <p className="text-xs font-bold text-[#172029]">{content.scansSection.cardVisits}</p>
                <p className="text-[11px] text-[#646b75]">{content.scansSection.cardVisitsDesc}</p>
              </div>
              <span className="text-2xl font-extrabold text-[#087e91]">
                {summary.scans.cardVisits}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[#f8fafc] p-4">
              <div>
                <p className="text-xs font-bold text-[#172029]">{content.scansSection.profileViews}</p>
                <p className="text-[11px] text-[#646b75]">{content.scansSection.profileViewsDesc}</p>
              </div>
              <span className="text-2xl font-extrabold text-[#172029]">
                {summary.scans.profileViews}
              </span>
            </div>

            <div className="rounded-xl border border-black/6 p-3 text-xs text-[#646b75]">
              <span className="font-semibold text-[#172029]">{content.scansSection.avgScansPerOutlet}: </span>
              <span>{avgScans} scan/outlet ({content.scansSection.avgScansSubtext})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Outlets Section */}
      <div className="rounded-2xl border border-black/8 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-[#172029] sm:text-lg">
              {content.recentOutletsSection.title}
            </h3>
            <p className="text-xs text-[#646b75]">
              {content.recentOutletsSection.description}
            </p>
          </div>
          <Link
            to="/$locale/dashboard/admin/outlets"
            params={{ locale }}
            className="inline-flex shrink-0"
          >
            <Button variant="outline" size="sm" className="h-9 gap-1.5 px-3 text-xs">
              <span>{content.recentOutletsSection.viewAll}</span>
              <ExternalLink className="size-3.5" />
            </Button>
          </Link>
        </div>

        <div className="mt-5 divide-y divide-black/6">
          {summary.recentOutlets.length > 0 ? (
            summary.recentOutlets.map((outlet) => (
              <div
                key={outlet.id}
                className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#eaf9fb] text-[#087e91]">
                    <Store className="size-4" />
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm text-[#172029]">{outlet.name}</h4>
                    <p className="text-xs text-[#69737d]">/{outlet.slug}</p>
                  </div>
                </div>
                {outlet.address && (
                  <div className="flex items-center gap-1.5 text-xs text-[#646b75]">
                    <MapPin className="size-3.5 shrink-0 text-[#087e91]" />
                    <span className="truncate max-w-xs">{outlet.address}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-[#69737d]">
              {content.recentOutletsSection.empty}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
