import { create } from "zustand";

import type { UserProfile } from "../../lib/auth/user-profile";

type AuthenticationStatus = "loading" | "authenticated" | "unauthenticated";

type AuthState = {
  profile: UserProfile | null;
  status: AuthenticationStatus;
  setAuthenticated: (profile: UserProfile) => void;
  setLoading: () => void;
  setUnauthenticated: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  status: "loading",
  setAuthenticated: (profile) => set({ profile, status: "authenticated" }),
  setLoading: () => set({ status: "loading" }),
  setUnauthenticated: () => set({ profile: null, status: "unauthenticated" }),
}));
