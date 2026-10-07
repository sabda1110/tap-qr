import { createServerFn } from "@tanstack/react-start";

import { requireAdmin } from "../auth/authorization.server";
import { createCardBatch, listMasterCards, removeAllUnusedCards, removeUnusedCards } from "./card.repository.server";
import { deleteAllUnusedCardsSchema, deleteCardSchema, deleteCardsSchema, generateCardsSchema, listCardsSchema } from "./card.schemas";

export const getAdminCardMaster = createServerFn({ method: "GET" })
  .validator(listCardsSchema)
  .handler(async ({ data }) => {
    const user = await requireAdmin();
    const page = await listMasterCards(data);
    return { page, user };
  });

export const generateAdminCards = createServerFn({ method: "POST" })
  .validator(generateCardsSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    return createCardBatch(data.quantity, data.material);
  });

export const deleteAdminCard = createServerFn({ method: "POST" })
  .validator(deleteCardSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    return removeUnusedCards([data.id]);
  });

export const deleteAdminCards = createServerFn({ method: "POST" })
  .validator(deleteCardsSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    return removeUnusedCards(data.ids);
  });

export const deleteAllUnusedAdminCards = createServerFn({ method: "POST" })
  .validator(deleteAllUnusedCardsSchema)
  .handler(async () => {
    await requireAdmin();
    return removeAllUnusedCards();
  });
