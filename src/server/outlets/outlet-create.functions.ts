import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "../auth/authorization.server";
import {
  cardSourceSchema,
  createOutletSchema,
  ownerSearchSchema,
  ownerSourceSchema,
} from "./outlet-create.schemas";
import {
  createOwnerOutlet,
  listOwnerSourceOutlets,
  searchOutletOwners,
} from "./outlet-create.repository.server";
import { getOutletDetail } from "./outlet.repository.server";

export const getAdminOutletOwners = createServerFn({ method: "GET" })
  .validator(ownerSearchSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    return searchOutletOwners(data.query.toLowerCase());
  });
export const getAdminOwnerSourceOutlets = createServerFn({ method: "GET" })
  .validator(ownerSourceSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    return listOwnerSourceOutlets(data.ownerId);
  });
export const getAdminOutletCopyCards = createServerFn({ method: "GET" })
  .validator(cardSourceSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const outlet = await getOutletDetail(data.outletId);
    if (outlet.ownerId !== data.ownerId)
      throw new Error("OUTLET_OWNER_MISMATCH");
    return outlet.cards.filter((card) => card.claimStatus === "claimed");
  });
export const createAdminOwnerOutlet = createServerFn({ method: "POST" })
  .validator(createOutletSchema)
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    return createOwnerOutlet(data, admin.uid);
  });
