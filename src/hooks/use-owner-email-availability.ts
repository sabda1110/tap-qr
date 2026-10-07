import { z } from "zod";
import { checkOwnerEmail } from "../server/activation/activation.functions";
import { useDebouncedAvailability } from "./use-debounced-availability";

const check = (email: string) => checkOwnerEmail({ data: { email } });

export function useOwnerEmailAvailability(value: string) {
  const email = value.trim().toLowerCase();
  return useDebouncedAvailability(email, z.string().email().safeParse(email).success, check);
}
