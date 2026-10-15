import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "../auth/authorization.server";
import {
  getCardPrintDetail,
  listCardsForPrint,
} from "./admin-print.repository.server";

const getAdminPrintSchema = z.object({
  cardId: z.string().optional(),
});

export const getAdminPrintData = createServerFn({ method: "GET" })
  .validator(getAdminPrintSchema)
  .handler(async ({ data }) => {
    const user = await requireAdmin();
    const cards = await listCardsForPrint();

    let initialCard = null;
    const targetCardId = data.cardId || cards[0]?.cardId;
    if (targetCardId) {
      initialCard = await getCardPrintDetail(targetCardId);
    }

    return { user, cards, initialCard };
  });
