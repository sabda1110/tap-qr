import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { cardIdSchema, claimCardSchema, userOutletCardsSchema } from "./card-entry.schemas";
import { resolveCardEntry, claimEntryCard, listUserOutlets, listUserOutletCards, recordCardVisit } from "./card-entry.repository.server";
import { requireAuthenticatedUser } from "../auth/authorization.server";

export const getCardEntry = createServerFn({ method: "GET" }).validator(z.object({ cardId: cardIdSchema }))
  .handler(({ data }) => resolveCardEntry(data.cardId));
export const claimUserCard = createServerFn({ method: "POST" }).validator(claimCardSchema)
  .handler(async ({ data }) => {
    const user = await requireAuthenticatedUser();
    return claimEntryCard(data, user.uid);
  });

export const getUserOutlets = createServerFn({ method: "GET" }).handler(async () => {
  const user = await requireAuthenticatedUser();
  return listUserOutlets(user.uid);
});
export const getUserOutletCopyCards = createServerFn({ method: "GET" })
  .validator(userOutletCardsSchema)
  .handler(async ({ data }) => {
    const user = await requireAuthenticatedUser();
    return listUserOutletCards(user.uid, data.outletId);
  });

export const trackCardVisit = createServerFn({ method: "POST" }).validator(z.object({ cardId: cardIdSchema }))
  .handler(({ data }) => recordCardVisit(data.cardId));
