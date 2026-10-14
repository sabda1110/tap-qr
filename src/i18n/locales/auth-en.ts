import type { authId } from "./auth-id";

export const authEn: typeof authId = {
  backHome: "Back to home",
  languageLabel: "Choose language",
  google: "Continue with Google",
  divider: "or use your email",
  nameLabel: "Full name",
  namePlaceholder: "Enter your full name",
  emailLabel: "Email",
  emailPlaceholder: "name@yourbusiness.com",
  passwordLabel: "Password",
  passwordPlaceholder: "At least 8 characters",
  confirmPasswordLabel: "Confirm password",
  confirmPasswordPlaceholder: "Enter your password again",
  validation: {
    nameMin: "Name must be at least 2 characters.",
    email: "Enter a valid email address.",
    passwordMin: "Password must be at least 8 characters.",
    passwordsMismatch: "Passwords do not match.",
  },
  errors: {
    emailInUse: "This email is already registered. Please log in instead.",
    googleCancelled: "Google sign-in was cancelled.",
    invalidCredential: "The email or password is incorrect.",
    unavailable: "Authentication could not be completed. Please try again shortly.",
    weakPassword: "The password is too weak. Use at least 8 characters.",
    concurrentLogin: "Your session has ended because this account logged in on another device or browser.",
  },
  concurrentNotice: {
    title: "Session Terminated",
    description: "Your account was just logged in from another device or browser. Please log in again if this is you.",
  },
  login: {
    kicker: "Welcome back",
    title: "Log in to TapQR",
    description:
      "Manage your links, track every tap, and help your business earn more reviews.",
    submit: "Log in",
    switchPrompt: "New to TapQR?",
    switchAction: "Create an account",
    showcaseKicker: "One tap, real impact",
    showcaseTitle: "Connect customers with your business.",
    showcaseDescription:
      "One simple page for Google Reviews, WhatsApp, WiFi, menus, and every channel that matters.",
    benefits: ["Ready in just a few minutes", "Change destinations at any time"],
  },
  register: {
    kicker: "Get started with TapQR",
    title: "Create your account",
    description:
      "Set up your business's first tap and scan experience without a complicated process.",
    submit: "Create account",
    switchPrompt: "Already have an account?",
    switchAction: "Log in instead",
    showcaseKicker: "Made for small businesses",
    showcaseTitle: "Turn every visit into a new connection.",
    showcaseDescription:
      "Help customers find your business, leave a review, and reconnect after every transaction.",
    benefits: ["QR and NFC in one experience", "Easy-to-read tap and scan insights"],
  },
};
