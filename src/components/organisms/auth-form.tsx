import { Link, useNavigate } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";

import type { Language, Messages } from "../../i18n";
import { useFirebaseAuthentication } from "../../hooks/use-firebase-authentication";
import type { AuthMode } from "../layouts/auth-layout";
import { ActivationAuthNotice } from "../molecules/activation-auth-notice";
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
  cardId?: string;
  reason?: string;
  destination?: "orders" | "buy";
};

export function AuthForm({ content, feedback, language, mode, cardId, reason, destination }: AuthFormProps) {
  const navigate = useNavigate();
  const isRegister = mode === "register";
  const nextMode: AuthMode = isRegister ? "login" : "register";
  const { error, isSubmitting, registerWithEmail, signInWithEmail, signInWithGoogle } =
    useFirebaseAuthentication({
      messages: feedback,
      onAuthenticated: (profile) =>
        navigate({
          to: profile.role === "admin" && !cardId ? "/$locale/dashboard/admin" : destination === "buy" && !cardId ? "/$locale/dashboard/user/buy" : destination === "orders" && !cardId ? "/$locale/dashboard/user/orders" : "/$locale/dashboard/user",
          params: { locale: language },
          search: { cardId },
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
          <p className={cardId ? "text-sm font-semibold text-[#087e91]" : "text-[11px] font-bold tracking-[0.18em] text-[#0798ad] uppercase"}>
            {cardId ? feedback.activation.kicker : content.kicker}
          </p>
          {isRegister && !cardId ? (
            <Link
              aria-disabled={isSubmitting}
              className="shrink-0 text-xs font-bold text-black underline decoration-[#ffb332] decoration-2 underline-offset-4 hover:text-[#0798ad] aria-disabled:pointer-events-none aria-disabled:opacity-40"
              to="/$locale/auth/$mode"
              params={{ locale: language, mode: nextMode }}
              search={{ cardId, destination }}
            >
              {content.switchAction}
            </Link>
          ) : null}
        </div>
        <h1 className={cardId ? "relative mt-3 pb-3 text-[clamp(1.75rem,3.4vw,2.4rem)] leading-[1.28] font-extrabold tracking-[-0.035em] text-black" : "mt-3 text-[clamp(2rem,4vw,2.8rem)] leading-tight font-semibold tracking-[-0.05em] text-black"}>
          {cardId ? (isRegister ? feedback.activation.registerTitle : feedback.activation.loginTitle) : content.title}
          {cardId && <svg aria-hidden="true" className="absolute bottom-0 left-0 h-2 w-32 text-[#ffb332]" viewBox="0 0 140 10" fill="none">
            <path d="M3 6C40 1 94 2 137 6M5 7c45-3 86-2 126 1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>}
        </h1>
        {cardId ? (
          <ActivationAuthNotice cardId={cardId} mode={mode} language={language}
            content={feedback.activation} disabled={isSubmitting} />
        ) : <p className="mt-3 text-sm leading-6 text-[#6b7079]">{content.description}</p>}

        {reason === "concurrent_login" && (
          <div
            aria-live="polite"
            className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-amber-900"
            role="status"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold">{feedback.concurrentNotice.title}</p>
              <p className="mt-0.5 text-amber-800">{feedback.concurrentNotice.description}</p>
            </div>
          </div>
        )}

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

        {!isRegister && !cardId ? (
          <p className="mt-6 text-center text-sm text-black/55">
            {content.switchPrompt}{" "}
            <Link
              aria-disabled={isSubmitting}
              className="font-bold text-black underline decoration-[#ffb332] decoration-2 underline-offset-4 hover:text-[#0798ad] aria-disabled:pointer-events-none aria-disabled:opacity-40"
              to="/$locale/auth/$mode"
              params={{ locale: language, mode: nextMode }}
              search={{ cardId, destination }}
            >
              {content.switchAction}
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
