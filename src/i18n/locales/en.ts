import { adminDashboardEn } from "./admin-dashboard-en";
import { authEn } from "./auth-en";
import { cardClaimEn, userDashboardEn } from "./user-dashboard-en";
import { outletProfileEn } from "./outlet-profile-en";
import type { id } from "./id";
import { ordersEn } from "./orders-en";
import { landingFaqEn } from "./landing-details-en";
import { productShowcaseEn } from "./product-showcase-en";

export const en: typeof id = {
  productShowcase: productShowcaseEn,
  faq: landingFaqEn,
  orders: ordersEn,
  outletProfile: outletProfileEn,
  header: {
    brandHomeLabel: "TapQR home",
    mainNavigationLabel: "Main navigation",
    features: "Features",
    pricing: "Pricing",
    testimonials: "Testimonials",
    login: "Log in",
    register: "Sign up",
    buy: "Buy cards",
    checkOrder: "Check order",
    languageLabel: "Choose language",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
  },
  auth: authEn,
  cardClaim: cardClaimEn,
  googlePlaceIdTutorial: {
    title: "How to find a Google Place ID",
    description: "Use a Place ID so the Google Review button on your TapQR card opens the correct business profile.",
    steps: [
      { title: "Open Place ID Finder", description: "Open Google’s official tool in a new tab." },
      { title: "Find your business", description: "Enter your business name and operational address until the correct location pin appears." },
      { title: "Copy the Place ID", description: "Select the business location, then copy the Place ID code that starts with ChIJ." },
      { title: "Paste it in TapQR", description: "Return to card claim, paste the code in the Google Place ID field, then activate the card." },
    ],
    googleDocs: "Open Google Place ID Finder",
    backHome: "Back to home",
  },
  userDashboard: userDashboardEn,
  adminDashboard: adminDashboardEn,
  accountSettings: {
    kicker: "Account settings",
    title: "Manage your account",
    description: "Review your account information and update your login security.",
    profileTitle: "Account information",
    name: "Name",
    email: "Email",
    loginMethod: "Login method",
    passwordLogin: "Email and password",
    googleLogin: "Google",
    passwordTitle: "Change password",
    passwordDescription:
      "Enter your current password to confirm that this account belongs to you.",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    passwordPlaceholder: "At least 8 characters",
    savePassword: "Save new password",
    saving: "Saving…",
    success: "Your password has been updated.",
    passwordMin: "The new password must be at least 8 characters.",
    passwordMismatch: "The new passwords do not match.",
    wrongPassword: "The current password is incorrect.",
    samePassword: "Use a different new password.",
    error: "Your password could not be updated. Please try again.",
    googlePasswordTitle: "Your password is managed by Google",
    googlePasswordDescription:
      "This account signs in with Google. Change your password in your Google Account settings.",
  },
  home: {
    titleStart: "One Tap, More",
    titleAccent: "Google Reviews",
    titleEnd: "& Returning Customers",
    description:
      "Help customers leave a Google review, connect to WiFi, open WhatsApp, browse your menu, and follow your social media—all from a single tap or scan.",
    getStarted: "Choose Your TapQR Card",
    tryDemo: "Explore TapQR features",
    illustrationAlt:
      "Customers connecting with a business through their digital devices",
  },
  features: {
    heading: {
      kicker: "Key Features",
      titleStart: "Everything your business needs to",
      titleAccent: "turn one tap",
      titleEnd: "into loyal customers",
    },
    reviewGrowth: {
      eyebrow: "REPUTATION",
      title: "Grow Your Google Reviews",
      description:
        "Send happy customers straight to your review page. A shorter journey helps your business collect more reviews without making customers search for the right place.",
      imageAlt:
        "A customer leaving a review after tapping a TapQR card at a cafe",
    },
    customerHub: {
      eyebrow: "CONNECTION",
      title: "One Tap to Every Channel",
      description:
        "Bring WiFi, WhatsApp, your menu, location, and social media into one experience. Customers can tap or scan to find the action they need.",
      imageAlt:
        "A phone connecting customers to WiFi, chat, menu, location, and social media",
    },
    flexibleNfcQr: {
      eyebrow: "FLEXIBILITY",
      title: "Change Destinations Without Reprinting",
      description:
        "Update TapQR links and destinations from your dashboard at any time. Keep using the same NFC and QR card as your promotions, menu, or business needs change.",
      imageAlt:
        "A business owner updating an NFC and QR card destination from a phone",
    },
    scanAnalytics: {
      eyebrow: "INSIGHT",
      title: "Understand Every Tap and Scan",
      description:
        "See how customers interact with TapQR, which channels they open most, and the activity trends that help you make better business decisions.",
      imageAlt:
        "A business owner viewing TapQR tap and scan analytics on a dashboard",
    },
  },
  pricing: {
    heading: {
      kicker: "Simple Pricing",
      titleStart: "Choose the TapQR media",
      titleAccent: "that fits",
      titleEnd: "your business",
      description:
        "Every medium includes NFC and QR. Choose the material that fits, or get the complete package with Google Review and a landing page.",
    },
    pvcCard: {
      name: "PVC Card",
      badge: "",
      description: "A lightweight PVC card with NFC and QR, easy to carry or attach to a surface.",
      price: "Rp79.000",
      priceDetail: "/ unit",
      features: [
        "NFC tap and QR scan in one card",
        "Design with your business identity",
        "Updatable link destination",
      ],
      cta: "Choose PVC Card",
    },
    acrylicBoard: {
      name: "Acrylic Standee",
      badge: "Most Popular",
      description: "A freestanding acrylic board with NFC and QR, ready for tables and checkout counters.",
      price: "Rp69.000",
      priceDetail: "/ unit",
      features: [
        "NFC tap and QR scan in one board",
        "Sturdy acrylic, ready to display",
        "Updatable link destination",
      ],
      cta: "Choose Acrylic Standee",
    },
    businessBundle: {
      name: "Business Package",
      badge: "Most Complete",
      description: "An acrylic NFC + QR board, plus Google Review setup and a landing page for your business.",
      price: "Rp499.000",
      priceDetail: "/ package",
      features: [
        "Acrylic NFC + QR board",
        "Google Business Profile and review link setup",
        "Business landing page (2 revisions)",
      ],
      cta: "Choose Business Package",
      note: "Domain billed separately (approx. Rp200–300k/year). We help you choose and register it.",
      whatsappMessage:
        "Hello TapQR, I am interested in purchasing the Business Package for Rp499.000.\n\nName: \nBusiness name: \nBusiness type: \nCity: \n\nI need:\n- Acrylic NFC + QR board\n- Google Business Profile and review link setup\n- Business landing page (2 revisions)\n\nDomain preference:\n[ ] I already have a domain\n[ ] I would like help choosing and registering a domain\n[ ] I do not need a domain yet\n\nPlease share the next steps for ordering. Thank you.",
    },
    note:
      "Need a domain too? Business Package + Domain starts at Rp799.000. Contact us.",
  },
  testimonials: {
    heading: {
      kicker: "Customer Stories",
      titleStart: "Experiences from businesses",
      titleAccent: "growing with",
      titleEnd: "TapQR",
    },
    ratingLabel: "5 out of 5 stars",
    coffeeShop: {
      quote:
        "Happy customers now know exactly what to tap. Asking for a review feels more natural and no longer slows down the checkout queue.",
      name: "Rina A.",
      role: "Coffee Shop Owner",
      initials: "RA",
    },
    barbershop: {
      quote:
        "One card on the counter is enough to guide customers to our Google Review and WhatsApp. Our team no longer has to explain a long process.",
      name: "Bagus P.",
      role: "Barbershop Owner",
      initials: "BP",
    },
    laundry: {
      quote:
        "When a promotion changes, we can update the link without printing new media. It is practical for a small business that needs to move quickly.",
      name: "Dewi L.",
      role: "Laundry Owner",
      initials: "DL",
    },
  },
  footer: {
    brandHomeLabel: "Back to the TapQR homepage",
    tagline:
      "One tap to help small businesses earn more reviews, connect with customers, and grow with better insight.",
    navigationLabel: "Footer navigation",
    navigationTitle: "Explore",
    faq: "Frequently asked questions",
    home: "Home",
    features: "Features",
    pricing: "Pricing",
    testimonials: "Testimonials",
    ctaTitle: "Ready to make every tap count?",
    ctaDescription:
      "Choose the TapQR media that fits your needs and start connecting customers with your business.",
    ctaLabel: "View pricing options",
    rights: "All rights reserved.",
    backToTop: "Back to top",
  },
};
