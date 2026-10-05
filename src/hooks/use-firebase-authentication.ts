import { useCallback, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type User,
} from "firebase/auth";

import type { Messages } from "../i18n";
import type { UserProfile } from "../lib/auth/user-profile";
import { firebaseAuth } from "../lib/firebase/client";
import { syncAuthenticatedUser } from "../server/auth/auth.functions";

type AuthMessages = Pick<Messages["auth"], "errors">;

type Credentials = {
  email: string;
  password: string;
};

type RegistrationCredentials = Credentials & {
  name: string;
};

type UseFirebaseAuthenticationOptions = {
  messages: AuthMessages;
  onAuthenticated: (profile: UserProfile) => void | Promise<void>;
};

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export function useFirebaseAuthentication({
  messages,
  onAuthenticated,
}: UseFirebaseAuthenticationOptions) {
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeAuthentication = useCallback(
    async (user: User) => {
      const idToken = await user.getIdToken(true);
      const profile = await syncAuthenticatedUser({ data: { idToken } });
      await onAuthenticated(profile);
    },
    [onAuthenticated],
  );

  const runAuthentication = useCallback(
    async (operation: () => Promise<User>) => {
      setError(undefined);
      setIsSubmitting(true);

      try {
        await completeAuthentication(await operation());
      } catch (caughtError) {
        setError(getAuthenticationError(caughtError, messages));
      } finally {
        setIsSubmitting(false);
      }
    },
    [completeAuthentication, messages],
  );

  const signInWithEmail = useCallback(
    (credentials: Credentials) =>
      runAuthentication(async () => {
        const credential = await signInWithEmailAndPassword(
          firebaseAuth,
          credentials.email,
          credentials.password,
        );
        return credential.user;
      }),
    [runAuthentication],
  );

  const registerWithEmail = useCallback(
    (credentials: RegistrationCredentials) =>
      runAuthentication(async () => {
        const credential = await createUserWithEmailAndPassword(
          firebaseAuth,
          credentials.email,
          credentials.password,
        );
        await updateProfile(credential.user, { displayName: credentials.name });
        return credential.user;
      }),
    [runAuthentication],
  );

  const signInWithGoogle = useCallback(
    () =>
      runAuthentication(async () => {
        const credential = await signInWithPopup(firebaseAuth, googleProvider);
        return credential.user;
      }),
    [runAuthentication],
  );

  return { error, isSubmitting, registerWithEmail, signInWithEmail, signInWithGoogle };
}

function getAuthenticationError(error: unknown, messages: AuthMessages) {
  if (!isFirebaseAuthError(error)) return messages.errors.unavailable;

  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use": messages.errors.emailInUse,
    "auth/invalid-credential": messages.errors.invalidCredential,
    "auth/popup-closed-by-user": messages.errors.googleCancelled,
    "auth/weak-password": messages.errors.weakPassword,
  };

  return errorMessages[error.code] ?? messages.errors.unavailable;
}

function isFirebaseAuthError(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error && typeof error.code === "string";
}
