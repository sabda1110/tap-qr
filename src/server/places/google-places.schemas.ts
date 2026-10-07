import { z } from "zod";

export const searchGooglePlacesSchema = z.object({
  query: z.string().trim().min(2).max(120),
});
