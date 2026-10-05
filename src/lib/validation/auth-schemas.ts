import { z } from "zod";

type AuthValidationMessages = {
  nameMin: string;
  email: string;
  passwordMin: string;
  passwordsMismatch: string;
};

export function createAuthSchemas(messages: AuthValidationMessages) {
  const email = z.string().trim().email(messages.email);
  const password = z.string().min(8, messages.passwordMin);

  return {
    login: z.object({ email, password }),
    register: z
      .object({
        name: z.string().trim().min(2, messages.nameMin),
        email,
        password,
        confirmPassword: z.string(),
      })
      .refine((values) => values.password === values.confirmPassword, {
        message: messages.passwordsMismatch,
        path: ["confirmPassword"],
      }),
  };
}
