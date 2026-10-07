import { isOutletSlugAvailable } from "./slug-availability.server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "../auth/authorization.server";
import { activateOwnerCard } from "./activation.repository.server";
import { activationSessionSchema, ownerActivationSchema } from "./activation.schemas";
import { isOwnerEmailAvailable } from "./email-availability.server";

export const checkOwnerEmail = createServerFn({ method: "GET" })
  .validator(z.object({ email: z.string().trim().email() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    return { available: await isOwnerEmailAvailable(data.email) };
  });

export const getAdminActivationSession = createServerFn({ method: "GET" })
  .validator(activationSessionSchema)
  .handler(async () => requireAdmin());

export const activateAdminCard = createServerFn({ method: "POST" })
  .validator(ownerActivationSchema)
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    await activateOwnerCard(data, admin.uid);
  });

export const checkOutletSlug = createServerFn({ method: "GET" })
  .validator(ownerActivationSchema.pick({ slug: true }))
  .handler(async ({ data }) => {
    await requireAdmin();
    return { available: await isOutletSlugAvailable(data.slug) };
  });
