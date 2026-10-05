import { useCallback, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { signOut } from "firebase/auth";

import type { Language } from "../i18n";
import type { UserProfile } from "../lib/auth/user-profile";
import { firebaseAuth } from "../lib/firebase/client";
import { clearAuthenticatedSession } from "../server/auth/auth.functions";
import { useAuthStore } from "../store/auth/auth-store";

export function useUserDashboardSession(profile: UserProfile, language: Language) {
  const navigate = useNavigate();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);

  useEffect(() => {
    setAuthenticated(profile);
  }, [profile, setAuthenticated]);

  return useCallback(async () => {
    try {
      await clearAuthenticatedSession();
    } finally {
      await signOut(firebaseAuth);
      setUnauthenticated();
      await navigate({ to: "/$locale/auth/$mode", params: { locale: language, mode: "login" } });
    }
  }, [language, navigate, setUnauthenticated]);
}
