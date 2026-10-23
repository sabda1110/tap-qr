import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getPublicOutletProfile,
  recordPublicProfileAction,
  recordPublicHighlightOpen,
  recordPublicProfileView,
} from "./public-profile.repository.server";

const profileIdSchema = z.object({ id: z.string().trim().min(1).max(200).refine((id) => !id.includes("/")) });
const profileActionSchema = profileIdSchema.extend({
  channel: z.enum([
    "instagram",
    "tiktok",
    "facebook",
    "whatsapp",
    "google_review",
    "custom",
  ]),
});
const highlightOpenSchema = profileIdSchema.extend({
  highlightId: z.uuid(),
});

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

export const trackOutletProfileAction = createServerFn({ method: "POST" })
  .validator(profileActionSchema)
  .handler(async ({ data }) => {
    await recordPublicProfileAction(data.id, data.channel).catch(() =>
      console.error("PROFILE_ACTION_RECORD_FAILED"),
    );
  });

export const trackOutletHighlightOpen = createServerFn({ method: "POST" })
  .validator(highlightOpenSchema)
  .handler(async ({ data }) => {
    await recordPublicHighlightOpen(data.id, data.highlightId).catch(() =>
      console.error("HIGHLIGHT_OPEN_RECORD_FAILED"),
    );
  });
