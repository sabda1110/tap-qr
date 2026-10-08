import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { CardClaimDialog } from "../organisms/card-claim-dialog";
import {
  getCardEntry,
  getUserOutlets,
} from "../../server/cards/card-entry.functions";
import { ArrowUpRight, CircleCheck, QrCode, Sparkles } from "lucide-react";

import { useI18n } from "../../i18n";
import type { UserProfile } from "../../lib/auth/user-profile";
import { useDashboardSession } from "../../hooks/use-dashboard-session";
import { UserDashboardLayout } from "../layouts/user-dashboard-layout";

export function UserDashboardPage({
  profile,
  cardId,
}: {
  profile: UserProfile;
  cardId?: string;
}) {
  const { language, messages } = useI18n();
  const signOut = useDashboardSession(profile, language);

  const navigate = useNavigate();
  const [claimOpen, setClaimOpen] = useState(false);
  const [outlets, setOutlets] = useState<{ id: string; name: string }[]>([]);
  const refreshOutlets = async () => setOutlets(await getUserOutlets());
  useEffect(() => {
    let current = true;
    void getUserOutlets()
      .then((items) => {
        if (current) setOutlets(items);
      })
      .catch(() => {});
    if (cardId)
      void getCardEntry({ data: { cardId } })
        .then((entry) => {
          if (current) setClaimOpen(entry?.kind === "unclaimed");
        })
        .catch(() => {});
    return () => {
      current = false;
    };
  }, [cardId]);
  const content = messages.userDashboard;
  return (
    <UserDashboardLayout
      activeItem="dashboard"
      homeLabel={messages.header.brandHomeLabel}
      language={language}
      navigation={content.sidebar}
      onSignOut={() => void signOut()}
    >
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-bold tracking-[0.16em] text-[#0798ad] uppercase">
          {content.kicker}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
          {content.greeting}, {profile.name.split(" ")[0]}
        </h1>
        <p className="mt-3 max-w-xl leading-7 text-[#646b75]">
          {content.description}
        </p>

        <article className="mt-8 rounded-3xl border border-[#d8edf1] bg-[#eaf9fb] p-6 sm:p-8">
          <Sparkles className="size-6 text-[#0798ad]" />
          <h2 className="mt-5 text-xl font-semibold tracking-[-0.04em]">
            {content.startCard.title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#52636a]">
            {content.startCard.description}
          </p>
          <button
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-black px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            type="button"
            onClick={() => setClaimOpen(true)}
          >
            {content.startCard.action}
            <ArrowUpRight className="size-4" />
          </button>
        </article>

        {outlets.length > 0 && (
          <section className="mt-8 grid gap-4">
            <h2 className="text-xl font-semibold">
              {messages.cardClaim.outlets}
            </h2>
            {outlets.map((outlet) => (
              <article
                key={outlet.id}
                className="rounded-2xl border border-black/10 bg-white p-5"
              >
                <h3 className="font-semibold">{outlet.name}</h3>
                <Link
                  className="mt-3 inline-block text-sm text-cyan-700 underline"
                  to="/$locale/p/$id"
                  params={{ locale: language, id: outlet.id }}
                >
                  {messages.cardClaim.profile}
                </Link>
              </article>
            ))}
          </section>
        )}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <StatusCard
            icon={QrCode}
            text={content.statusCards.media}
            title={content.statusCards.mediaTitle}
          />
          <StatusCard
            icon={CircleCheck}
            text={content.statusCards.profile}
            title={content.statusCards.profileTitle}
          />
        </div>
      </section>
      {claimOpen && (
        <CardClaimDialog
          cardId={cardId}
          messages={messages}
          outlets={outlets}
          onSaved={async () => {
            setClaimOpen(false);
            await navigate({
              to: "/$locale/dashboard/user",
              params: { locale: language },
              search: {},
              replace: true,
            });
            await refreshOutlets();
          }}
        />
      )}
    </UserDashboardLayout>
  );
}

function StatusCard({
  icon: Icon,
  text,
  title,
}: {
  icon: typeof QrCode;
  text: string;
  title: string;
}) {
  return (
    <article className="rounded-2xl border border-black/8 bg-white p-5">
      <Icon className="size-5 text-[#0798ad]" />
      <h2 className="mt-6 font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#6b7079]">{text}</p>
    </article>
  );
}
