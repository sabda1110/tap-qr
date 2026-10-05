import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useForm, type FieldPath, type UseFormReturn } from "react-hook-form";

import type { Messages } from "../../i18n";
import { createAuthSchemas } from "../../lib/validation/auth-schemas";
import { CustomInputText } from "../elements/custom-input-text";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";

export type LoginValues = {
  email: string;
  password: string;
};

export type RegisterValues = LoginValues & {
  name: string;
  confirmPassword: string;
};

type AuthEmailFormProps = {
  content: Pick<Messages["auth"]["login"], "submit">;
  feedback: Messages["auth"];
  isSubmitting: boolean;
  mode: "login" | "register";
  onSubmit: (values: LoginValues | RegisterValues) => Promise<void>;
};

export function AuthEmailForm({ content, feedback, isSubmitting, mode, onSubmit }: AuthEmailFormProps) {
  return mode === "register" ? (
    <RegisterForm content={content} feedback={feedback} isSubmitting={isSubmitting} onSubmit={onSubmit} />
  ) : (
    <LoginForm content={content} feedback={feedback} isSubmitting={isSubmitting} onSubmit={onSubmit} />
  );
}

function LoginForm({ content, feedback, isSubmitting, onSubmit }: Omit<AuthEmailFormProps, "mode">) {
  const schemas = createAuthSchemas(feedback.validation);
  const form = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
    resolver: zodResolver(schemas.login),
  });

  return (
    <Form {...form}>
      <form aria-busy={isSubmitting} noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset className="grid gap-4 border-0 p-0" disabled={isSubmitting}>
          <EmailField feedback={feedback} form={form} />
          <PasswordField feedback={feedback} form={form} />
          <SubmitButton isSubmitting={isSubmitting} label={content.submit} />
        </fieldset>
      </form>
    </Form>
  );
}

function RegisterForm({ content, feedback, isSubmitting, onSubmit }: Omit<AuthEmailFormProps, "mode">) {
  const schemas = createAuthSchemas(feedback.validation);
  const form = useForm<RegisterValues>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onBlur",
    resolver: zodResolver(schemas.register),
  });

  return (
    <Form {...form}>
      <form aria-busy={isSubmitting} noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset className="grid gap-3 border-0 p-0" disabled={isSubmitting}>
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <CustomInputText
                {...field}
                autoComplete="name"
                error={fieldState.error?.message}
                icon={UserRound}
                label={feedback.nameLabel}
                placeholder={feedback.namePlaceholder}
              />
            )}
          />
          <EmailField feedback={feedback} form={form} />
          <PasswordField feedback={feedback} form={form} />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <CustomInputText
                {...field}
                autoComplete="new-password"
                error={fieldState.error?.message}
                icon={LockKeyhole}
                label={feedback.confirmPasswordLabel}
                placeholder={feedback.confirmPasswordPlaceholder}
                type="password"
              />
            )}
          />
          <SubmitButton isSubmitting={isSubmitting} label={content.submit} />
        </fieldset>
      </form>
    </Form>
  );
}

function EmailField<TValues extends LoginValues>({
  feedback,
  form,
}: {
  feedback: Messages["auth"];
  form: UseFormReturn<TValues>;
}) {
  return (
    <FormField<TValues, FieldPath<TValues>>
      control={form.control}
      name={"email" as FieldPath<TValues>}
      render={({ field, fieldState }) => (
        <CustomInputText
          {...field}
          autoComplete="email"
          error={fieldState.error?.message}
          icon={Mail}
          label={feedback.emailLabel}
          placeholder={feedback.emailPlaceholder}
          type="email"
        />
      )}
    />
  );
}

function PasswordField<TValues extends LoginValues>({
  feedback,
  form,
}: {
  feedback: Messages["auth"];
  form: UseFormReturn<TValues>;
}) {
  return (
    <FormField<TValues, FieldPath<TValues>>
      control={form.control}
      name={"password" as FieldPath<TValues>}
      render={({ field, fieldState }) => (
        <CustomInputText
          {...field}
          autoComplete="new-password"
          error={fieldState.error?.message}
          helpText={feedback.validation.passwordMin}
          icon={LockKeyhole}
          label={feedback.passwordLabel}
          placeholder={feedback.passwordPlaceholder}
          type="password"
        />
      )}
    />
  );
}

function SubmitButton({ isSubmitting, label }: { isSubmitting: boolean; label: string }) {
  return (
    <Button
      className="mt-1 h-12 rounded-xl px-5 text-sm font-semibold shadow-[0_12px_28px_rgba(0,0,0,0.16)] hover:-translate-y-0.5"
      disabled={isSubmitting}
      type="submit"
    >
      {isSubmitting ? "..." : label}
    </Button>
  );
}
