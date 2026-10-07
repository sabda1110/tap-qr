import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "../auth/authorization.server";
import {
  getOutletDetail,
  listOutlets,
  updateOutlet,
} from "./outlet.repository.server";
import {
  outletSearchSchema,
  updateOutletSchema,
  updateOutletCardLinksSchema,
} from "./outlet.schemas";
import { updateOutletCardLinks } from "./outlet-card.repository.server";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";

export const checkAdminOutletSlug = createServerFn({ method: "GET" })
  .validator(updateOutletSchema.pick({ id: true, slug: true }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const database = getFirebaseAdminFirestore();
    const [reservation, outlets] = await Promise.all([
      database.collection("outletSlugs").doc(data.slug).get(),
      database.collection("outlets").where("slug", "==", data.slug).get(),
    ]);
    return {
      available:
        (!reservation.exists || reservation.data()?.outletId === data.id) &&
        outlets.docs.every((outlet) => outlet.id === data.id),
    };
  });

export const getAdminOutlets = createServerFn({ method: "GET" })
  .validator(outletSearchSchema)
  .handler(async ({ data }) => {
    const user = await requireAdmin();
    const [page, detail] = await Promise.all([
      listOutlets(data),
      data.outletId ? getOutletDetail(data.outletId) : Promise.resolve(null),
    ]);
    return { user, page, detail };
  });

export const updateAdminOutlet = createServerFn({ method: "POST" })
  .validator(updateOutletSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    await updateOutlet(data);
  });

export const updateAdminOutletCardLinks = createServerFn({ method: "POST" })
  .validator(updateOutletCardLinksSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    await updateOutletCardLinks(data);
  });
