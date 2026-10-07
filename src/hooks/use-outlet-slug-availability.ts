import { ownerActivationSchema } from "../lib/validation/owner-activation-schema";
import { checkOutletSlug } from "../server/activation/activation.functions";
import { useDebouncedAvailability } from "./use-debounced-availability";

const check = (slug: string) => checkOutletSlug({ data: { slug } });

export function useOutletSlugAvailability(value: string) {
  const slug = value.trim();
  return useDebouncedAvailability(slug, ownerActivationSchema.shape.slug.safeParse(slug).success, check);
}
