import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { getCardEntry, trackCardVisit } from "../server/cards/card-entry.functions";
import { cardIdSchema } from "../server/cards/card-entry.schemas";
import { getCurrentAuthenticatedUser } from "../server/auth/auth.functions";
import { OutletProfilePage } from "../components/page/outlet-profile-page";

export const Route = createFileRoute("/$locale/$cardId")({
  loader: async ({ params, preload }) => {
    const parsed = cardIdSchema.safeParse(params.cardId);
    if (!parsed.success) throw notFound();
    const entry = await getCardEntry({ data: { cardId: parsed.data } });
    if (!entry) throw notFound();
    if (!preload) await trackCardVisit({ data: { cardId: parsed.data } }).catch(() => {});
    if (entry.kind === "unclaimed") {
      const user = await getCurrentAuthenticatedUser();
      if (!user) throw redirect({ to: "/$locale/auth/$mode", params: { locale: params.locale, mode: "login" }, search: { cardId: parsed.data }, replace: true });
      throw redirect({ to: "/$locale/dashboard/user", params: { locale: params.locale }, search: { cardId: parsed.data }, replace: true });
    }
    if (entry.url) throw redirect({ href: entry.url });
    throw redirect({ to: "/$locale/p/$id", params: { locale: params.locale, id: entry.outletId }, replace: true });
  },
  notFoundComponent: () => <OutletProfilePage profile={null} />,
  errorComponent: () => <OutletProfilePage profile={null} failed />,
});
