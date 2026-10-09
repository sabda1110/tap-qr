import { useState, type FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react";
import type { Messages } from "../../i18n";
import type { UserProfile } from "../../lib/auth/user-profile";
import { firebaseAuth } from "../../lib/firebase/client";
import { CustomInputText } from "../elements/custom-input-text";
import { Button } from "../ui/button";
import { useToast } from "../ui/toaster";

type PasswordFields = {
  current: string;
  next: string;
  confirmation: string;
};

const emptyPasswords: PasswordFields = {
  current: "",
  next: "",
  confirmation: "",
};

export function AccountSettingsPanel({
  content,
  profile,
}: {
  content: Messages["accountSettings"];
  profile: UserProfile;
}) {
  const { showToast } = useToast();
  const [passwords, setPasswords] = useState(emptyPasswords);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  function setPassword(field: keyof PasswordFields, value: string) {
    setPasswords((current) => ({ ...current, [field]: value }));
    setError(undefined);
  }

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passwords.next.length < 8) return setError(content.passwordMin);
    if (passwords.next !== passwords.confirmation)
      return setError(content.passwordMismatch);
    if (passwords.current === passwords.next)
      return setError(content.samePassword);

    const user = firebaseAuth.currentUser;
    if (!user?.email) {
      setError(content.error);
      return;
    }

    setSaving(true);
    setError(undefined);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        passwords.current,
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwords.next);
      setPasswords(emptyPasswords);
      showToast(content.success, "success");
    } catch (caught) {
      const message = passwordError(caught, content);
      setError(message);
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto max-w-4xl pb-[env(safe-area-inset-bottom)]">
      <p className="text-xs font-bold tracking-[0.16em] text-[#087e91] uppercase">
        {content.kicker}
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        {content.title}
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[#69737d]">
        {content.description}
      </p>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-black/8 bg-white p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <UserRound aria-hidden="true" className="size-5 text-[#087e91]" />
            {content.profileTitle}
          </h2>
          <dl className="mt-5 grid gap-4">
            <AccountDetail icon={UserRound} label={content.name} value={profile.name} />
            <AccountDetail icon={Mail} label={content.email} value={profile.email} />
            <AccountDetail
              icon={ShieldCheck}
              label={content.loginMethod}
              value={
                profile.provider === "google"
                  ? content.googleLogin
                  : content.passwordLogin
              }
            />
          </dl>
        </article>

        {profile.provider === "password" ? (
          <form
            aria-busy={saving}
            className="rounded-2xl border border-black/8 bg-white p-5 sm:p-6"
            noValidate
            onSubmit={(event) => void savePassword(event)}
          >
            <h2 className="flex items-center gap-2 font-bold">
              <KeyRound aria-hidden="true" className="size-5 text-[#087e91]" />
              {content.passwordTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#69737d]">
              {content.passwordDescription}
            </p>
            <fieldset disabled={saving} className="mt-5 grid gap-4 border-0 p-0">
              <CustomInputText
                autoComplete="current-password"
                label={content.currentPassword}
                name="current-password"
                onChange={(event) => setPassword("current", event.target.value)}
                required
                type="password"
                value={passwords.current}
              />
              <CustomInputText
                autoComplete="new-password"
                label={content.newPassword}
                name="new-password"
                onChange={(event) => setPassword("next", event.target.value)}
                placeholder={content.passwordPlaceholder}
                required
                type="password"
                value={passwords.next}
              />
              <CustomInputText
                autoComplete="new-password"
                error={error}
                label={content.confirmPassword}
                name="confirm-password"
                onChange={(event) =>
                  setPassword("confirmation", event.target.value)
                }
                required
                type="password"
                value={passwords.confirmation}
              />
            </fieldset>
            <Button className="mt-5 h-11 w-full sm:w-auto" disabled={saving} type="submit">
              <KeyRound aria-hidden="true" />
              {saving ? content.saving : content.savePassword}
            </Button>
          </form>
        ) : (
          <article className="rounded-2xl border border-[#bce8ef] bg-[#f2fbfc] p-5 sm:p-6">
            <span className="grid size-11 place-items-center rounded-xl bg-white text-[#087e91]">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </span>
            <h2 className="mt-4 font-bold">{content.googlePasswordTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-[#69737d]">
              {content.googlePasswordDescription}
            </p>
          </article>
        )}
      </div>
    </section>
  );
}

function AccountDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl bg-[#f8fafc] p-3">
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#69737d]" />
      <div className="min-w-0">
        <dt className="text-xs text-[#69737d]">{label}</dt>
        <dd className="mt-0.5 truncate text-sm font-semibold">{value}</dd>
      </div>
    </div>
  );
}

function passwordError(
  error: unknown,
  content: Messages["accountSettings"],
) {
  if (!(error instanceof FirebaseError)) return content.error;
  if (
    error.code === "auth/invalid-credential" ||
    error.code === "auth/wrong-password"
  )
    return content.wrongPassword;
  if (error.code === "auth/weak-password") return content.passwordMin;
  return content.error;
}
