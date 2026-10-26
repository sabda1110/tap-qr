import { z } from "zod";

export const checkoutSearchSchema = z.object({
  material: z.enum(["acrylic", "pvc"]).optional().catch(undefined),
});
