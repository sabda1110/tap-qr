import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getPublicOutletProfile, recordPublicProfileView } from "./public-profile.repository.server";

const profileIdSchema = z.object({ id: z.string().trim().min(1).max(200).refine((id) => !id.includes("/")) });

export const getOutletProfile = createServerFn({ method: "GET" })
  .validator(profileIdSchema)
  .handler(({ data }) => getPublicOutletProfile(data.id));

export const trackOutletProfileView = createServerFn({ method: "POST" })
  .validator(profileIdSchema)
  .handler(async ({ data }) => {
    const profile = await getPublicOutletProfile(data.id);
    if (profile) {
      // Analytics failures must not prevent customers from opening the outlet.
      await recordPublicProfileView(profile.id).catch(() => console.error("PROFILE_VIEW_RECORD_FAILED"));
    }
  });
