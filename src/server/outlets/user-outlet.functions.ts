import { createServerFn } from "@tanstack/react-start";
import { requireAuthenticatedUser } from "../auth/authorization.server";
import {
  checkUserOutletSlug,
  listUserDashboardOutlets,
} from "./user-outlet.repository.server";
import { updateOutlet } from "./outlet.repository.server";
import { updateOutletCardLinks } from "./outlet-card.repository.server";
import {
  updateOutletSchema,
  updateOutletCardLinksSchema,
} from "./outlet.schemas";

export const getUserDashboardOutlets = createServerFn({
  method: "GET",
}).handler(async () => {
  const user = await requireAuthenticatedUser();
  return listUserDashboardOutlets(user.uid);
});

export const checkOwnerOutletSlug = createServerFn({ method: "GET" })
  .validator(updateOutletSchema.pick({ id: true, slug: true }))
  .handler(async ({ data }) => {
    const user = await requireAuthenticatedUser();
    return checkUserOutletSlug(user.uid, data.id, data.slug);
  });

export const updateUserOutlet = createServerFn({ method: "POST" })
  .validator(updateOutletSchema)
  .handler(async ({ data }) => {
    const user = await requireAuthenticatedUser();
    await updateOutlet(data, user.uid);
  });

export const updateUserOutletCardLinks = createServerFn({ method: "POST" })
  .validator(updateOutletCardLinksSchema)
  .handler(async ({ data }) => {
    const user = await requireAuthenticatedUser();
    await updateOutletCardLinks(data, user.uid);
  });
