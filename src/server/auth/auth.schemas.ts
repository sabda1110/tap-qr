import { z } from "zod";

export const firebaseTokenSchema = z.object({
  idToken: z.string().min(100, "Firebase token tidak valid."),
});
