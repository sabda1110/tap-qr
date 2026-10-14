import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { signOut } from "firebase/auth";

import type { Language } from "../i18n";
import type { UserProfile } from "../lib/auth/user-profile";
import { firebaseAuth } from "../lib/firebase/client";
import { checkActiveSession, clearAuthenticatedSession } from "../server/auth/auth.functions";
import { useAuthStore } from "../store/auth/auth-store";
import { useToast } from "../components/ui/toaster";

export function useDashboardSession(profile: UserProfile, language: Language) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);
  const isTerminatingRef = useRef(false);

  useEffect(() => {
    setAuthenticated(profile);
  }, [profile, setAuthenticated]);

  const handleTermination = useCallback(
    async (reason: "concurrent_login" | "other") => {
      if (isTerminatingRef.current) return;
      isTerminatingRef.current = true;

      try {
        await clearAuthenticatedSession();
      } catch {
        // Network blips should not fail clean logout
      } finally {
        await signOut(firebaseAuth);
        setUnauthenticated();

        if (reason === "concurrent_login") {
          showToast(
            language === "id"
              ? "Sesi Anda telah berakhir karena akun ini login di perangkat atau browser lain."
              : "Your session has ended because this account logged in on another device or browser.",
            "warning",
          );
        }

        await navigate({
          to: "/$locale/auth/$mode",
          params: { locale: language, mode: "login" },
          search: { reason: reason === "concurrent_login" ? "concurrent_login" : undefined },
        });
      }
    },
    [language, navigate, setUnauthenticated, showToast],
  );

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    const verify = async () => {
      if (isTerminatingRef.current) return;
      try {
        const response = await checkActiveSession();
        if (!response.active) {
          await handleTermination(response.reason === "concurrent_login" ? "concurrent_login" : "other");
        }
      } catch {
        // Network blips should not trigger immediate forced kick
      }
    };

    const startTimer = () => {
      if (!timer) {
        timer = setInterval(verify, 4000);
      }
    };

    const stopTimer = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void verify();
        startTimer();
      } else {
        stopTimer();
      }
    };

    const handleFocus = () => {
      void verify();
    };

    startTimer();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [handleTermination]);

  return useCallback(async () => {
    isTerminatingRef.current = true;
    try {
      await clearAuthenticatedSession();
    } finally {
      await signOut(firebaseAuth);
      setUnauthenticated();
      await navigate({ to: "/$locale/auth/$mode", params: { locale: language, mode: "login" } });
    }
  }, [language, navigate, setUnauthenticated]);
}
