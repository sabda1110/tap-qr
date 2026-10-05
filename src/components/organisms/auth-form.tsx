import { Link, useNavigate } from "@tanstack/react-router";

import type { Language, Messages } from "../../i18n";
import { useFirebaseAuthentication } from "../../hooks/use-firebase-authentication";
import type { AuthMode } from "../layouts/auth-layout";
import { GoogleMark } from "../elements/google-mark";
import {
  AuthEmailForm,
  type LoginValues,
  type RegisterValues,
} from "../molecules/auth-email-form";

type AuthFormProps = {
  content: Messages["auth"][AuthMode];
  feedback: Messages["auth"];
  language: Language;
  mode: AuthMode;
};

export function AuthForm({ content, feedback, language, mode }: AuthFormProps) {
  const navigate = useNavigate();
  const isRegister = mode === "register";
  const nextMode: AuthMode = isRegister ? "login" : "register";
  const { error, isSubmitting, registerWithEmail, signInWithEmail, signInWithGoogle } =
    useFirebaseAuthentication({
      messages: feedback,
      onAuthenticated: (profile) =>
        navigate({
          to: profile.role === "admin" ? "/$locale/dashboard/admin" : "/$locale/dashboard/user",
          params: { locale: language },
        }),
    });

  const submitEmailForm = (values: LoginValues | RegisterValues) => {
    return isRegister
      ? registerWithEmail(values as RegisterValues)
      : signInWithEmail(values as LoginValues);
  };

  return (
    <section className="flex h-full items-center p-7 sm:p-10 lg:p-8">
      <div className="mx-auto w-full max-w-[410px]">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] font-bold tracking-[0.18em] text-[#0798ad] uppercase">
            {content.kicker}
          </p>
          {isRegister ? (
            <Link
              aria-disabled={isSubmitting}
              className="shrink-0 text-xs font-bold text-black underline decoration-[#ffb332] decoration-2 underline-offset-4 hover:text-[#0798ad] aria-disabled:pointer-events-none aria-disabled:opacity-40"
              to="/$locale/auth/$mode"
              params={{ locale: language, mode: nextMode }}
            >
              {content.switchAction}
            </Link>
          ) : null}
        </div>
        <h1 className="mt-3 text-[clamp(2rem,4vw,2.8rem)] leading-tight font-semibold tracking-[-0.05em] text-black">
          {content.title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#6b7079]">{content.description}</p>

        <button
          className={`${isRegister ? "mt-5" : "mt-7"} flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white text-sm font-semibold text-[#252a32] shadow-sm hover:border-black/25 hover:bg-[#f8fafc]`}
          disabled={isSubmitting}
          onClick={signInWithGoogle}
          type="button"
        >
          <GoogleMark />
          {feedback.google}
        </button>

        <div
          className={`${isRegister ? "my-4" : "my-6"} flex items-center gap-4`}
          aria-hidden="true"
        >
          <span className="h-px flex-1 bg-black/10" />
          <span className="text-[10px] font-semibold tracking-[0.12em] text-black/35 uppercase">
            {feedback.divider}
          </span>
          <span className="h-px flex-1 bg-black/10" />
        </div>

        <AuthEmailForm
          content={content}
          feedback={feedback}
          isSubmitting={isSubmitting}
          mode={mode}
          onSubmit={submitEmailForm}
        />

        {error ? (
          <p aria-live="polite" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {!isRegister ? (
          <p className="mt-6 text-center text-sm text-black/55">
            {content.switchPrompt}{" "}
            <Link
              aria-disabled={isSubmitting}
              className="font-bold text-black underline decoration-[#ffb332] decoration-2 underline-offset-4 hover:text-[#0798ad] aria-disabled:pointer-events-none aria-disabled:opacity-40"
              to="/$locale/auth/$mode"
              params={{ locale: language, mode: nextMode }}
            >
              {content.switchAction}
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
