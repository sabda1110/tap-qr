import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { recordLimitedPublicEvent } from "../analytics/public-event.server";
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
  .handler(({ data }) => recordLimitedPublicEvent(`profile:${data.id}`, () => recordPublicProfileView(data.id)));

export const trackOutletProfileAction = createServerFn({ method: "POST" })
  .validator(profileActionSchema)
  .handler(({ data }) => recordLimitedPublicEvent(`action:${data.id}:${data.channel}`, () => recordPublicProfileAction(data.id, data.channel)));

export const trackOutletHighlightOpen = createServerFn({ method: "POST" })
  .validator(highlightOpenSchema)
  .handler(({ data }) => recordLimitedPublicEvent(`highlight:${data.id}:${data.highlightId}`, () => recordPublicHighlightOpen(data.id, data.highlightId)));
